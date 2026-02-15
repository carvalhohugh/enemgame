/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { currentUser } from '@/data/mockData';

export type AreaId = 'humanas' | 'natureza' | 'linguagens' | 'matematica' | 'redacao';

interface AreaProgress {
  answered: number;
  correct: number;
}

interface StudyProgressState {
  totalXp: number;
  streak: number;
  bestStreak: number;
  totalAnswered: number;
  totalCorrect: number;
  mathCorrectStreak: number;
  lastStudyDate: string | null;
  dailyChallengeCompletions: string[];
  areaProgress: Record<AreaId, AreaProgress>;
  unlockedBadges: string[];
  badgeUnlockedAt: Record<string, string>;
}

interface RegisterAnswerInput {
  area: AreaId;
  isCorrect: boolean;
  xp: number;
  challengeId?: string;
}

interface StudyProgressContextValue {
  progress: StudyProgressState;
  level: number;
  currentLevelXp: number;
  xpToNextLevel: number;
  accuracy: number;
  registerAnswer: (input: RegisterAnswerInput) => void;
  isChallengeCompleted: (challengeId: string) => boolean;
}

const STORAGE_KEY = 'enemgame-study-progress-v2';

const emptyAreaProgress: Record<AreaId, AreaProgress> = {
  humanas: { answered: 0, correct: 0 },
  natureza: { answered: 0, correct: 0 },
  linguagens: { answered: 0, correct: 0 },
  matematica: { answered: 0, correct: 0 },
  redacao: { answered: 0, correct: 0 },
};

function createInitialState(): StudyProgressState {
  return {
    totalXp: currentUser.xp,
    streak: currentUser.streak,
    bestStreak: currentUser.streak,
    totalAnswered: 0,
    totalCorrect: 0,
    mathCorrectStreak: 0,
    lastStudyDate: null,
    dailyChallengeCompletions: [],
    areaProgress: emptyAreaProgress,
    unlockedBadges: ['1', '2', '3', '4'],
    badgeUnlockedAt: {
      '1': '2024-01-15',
      '2': '2024-01-20',
      '3': '2024-01-25',
      '4': '2024-02-01',
    },
  };
}

function todayKey(): string {
  return new Date().toISOString().slice(0, 10);
}

function yesterdayKey(): string {
  const now = new Date();
  now.setDate(now.getDate() - 1);
  return now.toISOString().slice(0, 10);
}

function getXpRequirementForLevel(level: number): number {
  return 1000 + (level - 1) * 250;
}

function computeLevel(totalXp: number): { level: number; currentLevelXp: number; xpToNextLevel: number } {
  let level = 1;
  let remainingXp = totalXp;

  while (remainingXp >= getXpRequirementForLevel(level)) {
    remainingXp -= getXpRequirementForLevel(level);
    level += 1;
  }

  return {
    level,
    currentLevelXp: remainingXp,
    xpToNextLevel: getXpRequirementForLevel(level),
  };
}

function unlockBadges(state: StudyProgressState): StudyProgressState {
  const unlocked = new Set(state.unlockedBadges);
  const unlockedAt = { ...state.badgeUnlockedAt };
  const unlockDate = todayKey();

  const maybeUnlock = (badgeId: string, condition: boolean) => {
    if (condition && !unlocked.has(badgeId)) {
      unlocked.add(badgeId);
      unlockedAt[badgeId] = unlockDate;
    }
  };

  const humanas = state.areaProgress.humanas;
  const natureza = state.areaProgress.natureza;
  const linguagens = state.areaProgress.linguagens;
  const level = computeLevel(state.totalXp).level;

  maybeUnlock('1', state.totalAnswered >= 1);
  maybeUnlock('2', state.streak >= 7);
  maybeUnlock('3', humanas.answered >= 20 && humanas.correct / humanas.answered >= 0.8);
  maybeUnlock('5', state.mathCorrectStreak >= 10);
  maybeUnlock('6', natureza.answered >= 20 && natureza.correct / natureza.answered >= 0.8);
  maybeUnlock('7', linguagens.answered >= 25);
  maybeUnlock('8', level >= 50);

  return {
    ...state,
    unlockedBadges: Array.from(unlocked),
    badgeUnlockedAt: unlockedAt,
  };
}

const StudyProgressContext = createContext<StudyProgressContextValue | null>(null);

export function StudyProgressProvider({ children }: { children: ReactNode }) {
  const [progress, setProgress] = useState<StudyProgressState>(() => {
    if (typeof window === 'undefined') {
      return createInitialState();
    }

    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        return createInitialState();
      }

      const parsed = JSON.parse(raw) as StudyProgressState;
      return {
        ...createInitialState(),
        ...parsed,
        areaProgress: {
          ...emptyAreaProgress,
          ...parsed.areaProgress,
        },
      };
    } catch {
      return createInitialState();
    }
  });

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  }, [progress]);

  const registerAnswer = useCallback((input: RegisterAnswerInput) => {
    setProgress((previous) => {
      const currentDate = todayKey();
      const hadStudiedToday = previous.lastStudyDate === currentDate;
      const studiedYesterday = previous.lastStudyDate === yesterdayKey();

      const challengeAlreadyCompleted = input.challengeId
        ? previous.dailyChallengeCompletions.includes(input.challengeId)
        : false;
      const challengeBonusXp = input.challengeId && !challengeAlreadyCompleted && input.isCorrect ? 30 : 0;

      const nextState: StudyProgressState = {
        ...previous,
        totalXp: previous.totalXp + input.xp + challengeBonusXp,
        totalAnswered: previous.totalAnswered + 1,
        totalCorrect: previous.totalCorrect + (input.isCorrect ? 1 : 0),
        lastStudyDate: currentDate,
        streak: hadStudiedToday ? previous.streak : studiedYesterday ? previous.streak + 1 : 1,
        bestStreak: hadStudiedToday
          ? previous.bestStreak
          : Math.max(previous.bestStreak, studiedYesterday ? previous.streak + 1 : 1),
        mathCorrectStreak:
          input.area === 'matematica'
            ? input.isCorrect
              ? previous.mathCorrectStreak + 1
              : 0
            : previous.mathCorrectStreak,
        dailyChallengeCompletions:
          input.challengeId && !challengeAlreadyCompleted
            ? [...previous.dailyChallengeCompletions, input.challengeId]
            : previous.dailyChallengeCompletions,
        areaProgress: {
          ...previous.areaProgress,
          [input.area]: {
            answered: previous.areaProgress[input.area].answered + 1,
            correct: previous.areaProgress[input.area].correct + (input.isCorrect ? 1 : 0),
          },
        },
      };

      return unlockBadges(nextState);
    });
  }, []);

  const isChallengeCompleted = useCallback(
    (challengeId: string) => progress.dailyChallengeCompletions.includes(challengeId),
    [progress.dailyChallengeCompletions],
  );

  const { level, currentLevelXp, xpToNextLevel } = useMemo(
    () => computeLevel(progress.totalXp),
    [progress.totalXp],
  );

  const accuracy = useMemo(() => {
    if (progress.totalAnswered === 0) {
      return 0;
    }

    return Math.round((progress.totalCorrect / progress.totalAnswered) * 100);
  }, [progress.totalAnswered, progress.totalCorrect]);

  const value = useMemo<StudyProgressContextValue>(
    () => ({
      progress,
      level,
      currentLevelXp,
      xpToNextLevel,
      accuracy,
      registerAnswer,
      isChallengeCompleted,
    }),
    [accuracy, currentLevelXp, isChallengeCompleted, level, progress, registerAnswer, xpToNextLevel],
  );

  return <StudyProgressContext.Provider value={value}>{children}</StudyProgressContext.Provider>;
}

export function useStudyProgress(): StudyProgressContextValue {
  const context = useContext(StudyProgressContext);

  if (!context) {
    throw new Error('useStudyProgress must be used inside StudyProgressProvider');
  }

  return context;
}
