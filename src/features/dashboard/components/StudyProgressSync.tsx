import { useEffect, useMemo, useRef } from 'react';
import { useAuthProfile } from '@/context/AuthProfileContext';
import { useStudyProgress } from '@/context/StudyProgressContext';
import { upsertStudentMetrics } from '@/services/adminApi';

export default function StudyProgressSync() {
  const { profile } = useAuthProfile();
  const { progress, level, accuracy } = useStudyProgress();
  const lastPayloadRef = useRef<string>('');

  const syncPayload = useMemo(
    () =>
      JSON.stringify({
        userId: profile.userId,
        email: profile.email,
        displayName: profile.displayName,
        isAuthenticated: profile.isAuthenticated,
        isAdmin: profile.isAdmin,
        totalXp: progress.totalXp,
        level,
        streak: progress.streak,
        totalAnswered: progress.totalAnswered,
        totalCorrect: progress.totalCorrect,
        accuracy,
      }),
    [
      accuracy,
      level,
      profile.displayName,
      profile.email,
      profile.isAdmin,
      profile.isAuthenticated,
      profile.userId,
      progress.streak,
      progress.totalAnswered,
      progress.totalCorrect,
      progress.totalXp,
    ],
  );

  useEffect(() => {
    if (!profile.isAuthenticated || !profile.userId || !profile.email) {
      return undefined;
    }

    if (lastPayloadRef.current === syncPayload) {
      return undefined;
    }

    const timer = window.setTimeout(async () => {
      try {
        await upsertStudentMetrics({
          userId: profile.userId as string,
          email: profile.email as string,
          fullName: profile.displayName,
          role: profile.isAdmin ? 'admin' : 'student',
          metrics: {
            totalXp: progress.totalXp,
            level,
            streak: progress.streak,
            totalAnswered: progress.totalAnswered,
            totalCorrect: progress.totalCorrect,
            accuracy,
          },
        });
        lastPayloadRef.current = syncPayload;
      } catch (error) {
        console.warn('Falha ao sincronizar progresso no painel administrativo:', error);
      }
    }, 700);

    return () => {
      window.clearTimeout(timer);
    };
  }, [
    accuracy,
    level,
    profile.displayName,
    profile.email,
    profile.isAdmin,
    profile.isAuthenticated,
    profile.userId,
    progress.streak,
    progress.totalAnswered,
    progress.totalCorrect,
    progress.totalXp,
    syncPayload,
  ]);

  return null;
}
