/**
 * ArenaService — Gerencia batalhas X1 e batalhas de Clã
 *
 * Serviço mock local (sem backend real).
 * Simula matchmaking, questões, respostas e resultados.
 */

import { type ClanId } from './ClanService';
import { ALL_VESTIBULAR_QUESTIONS } from '@/data/vestibularQuestions';

/* ─────────────── Types ─────────────── */

export type BattleType = 'x1' | 'clan';
export type BattleStatus = 'waiting' | 'matching' | 'in_progress' | 'finished';

export interface BattlePlayer {
    id: string;
    name: string;
    clanId: ClanId;
    avatar: string;
    score: number;
    answers: (string | null)[];
}

export interface BattleQuestion {
    id: string;
    question: string;
    alternatives: { letter: string; text: string }[];
    correctAnswer: string;
    timeLimit: number; // seconds
}

export interface Battle {
    id: string;
    type: BattleType;
    status: BattleStatus;
    players: BattlePlayer[];
    questions: BattleQuestion[];
    currentQuestionIdx: number;
    startedAt: number;
    finishedAt?: number;
    winnerId?: string;
}

export interface BattleHistoryEntry {
    id: string;
    type: BattleType;
    opponent: string;
    opponentClan: ClanId;
    result: 'win' | 'loss' | 'draw';
    myScore: number;
    opponentScore: number;
    xpEarned: number;
    date: number;
}

/* ─────────────── Mock Data ─────────────── */

const MOCK_OPPONENTS: { name: string; clanId: ClanId; level: number }[] = [
    { name: 'Lucas_Fênix', clanId: 'fenix', level: 12 },
    { name: 'Ana_Lobo', clanId: 'lobo', level: 15 },
    { name: 'Pedro_Dragão', clanId: 'dragao', level: 10 },
    { name: 'Maria_Águia', clanId: 'aguia', level: 18 },
    { name: 'João_Lobo', clanId: 'lobo', level: 8 },
    { name: 'Carla_Fênix', clanId: 'fenix', level: 14 },
    { name: 'Rafael_Dragão', clanId: 'dragao', level: 20 },
    { name: 'Bianca_Águia', clanId: 'aguia', level: 11 },
    { name: 'Gabriel_Lobo', clanId: 'lobo', level: 16 },
    { name: 'Juliana_Fênix', clanId: 'fenix', level: 9 },
];



/* ─────────────── History Mock ─────────────── */

const MOCK_HISTORY: BattleHistoryEntry[] = [
    { id: 'h1', type: 'x1', opponent: 'Lucas_Fênix', opponentClan: 'fenix', result: 'win', myScore: 4, opponentScore: 2, xpEarned: 80, date: Date.now() - 3600000 },
    { id: 'h2', type: 'x1', opponent: 'Ana_Lobo', opponentClan: 'lobo', result: 'loss', myScore: 2, opponentScore: 4, xpEarned: 20, date: Date.now() - 7200000 },
    { id: 'h3', type: 'clan', opponent: 'Clã Dragão', opponentClan: 'dragao', result: 'win', myScore: 35, opponentScore: 28, xpEarned: 150, date: Date.now() - 86400000 },
];

/* ─────────────── Online Members Mock ─────────────── */

export interface OnlineMember {
    id: string;
    name: string;
    clanId: ClanId;
    level: number;
    status: 'idle' | 'studying' | 'arena' | 'quiz';
    lastSeen: number;
}

export function getOnlineMembers(clanId: ClanId): OnlineMember[] {
    const allMembers = MOCK_OPPONENTS.filter(o => o.clanId === clanId);
    return allMembers.map((m, i) => ({
        id: `member-${i}`,
        name: m.name,
        clanId: m.clanId,
        level: m.level,
        status: (['idle', 'studying', 'arena', 'quiz'] as const)[Math.floor(Math.random() * 4)],
        lastSeen: Date.now() - Math.floor(Math.random() * 300000),
    }));
}

/* ─────────────── Chat Mock ─────────────── */

export interface ChatMessage {
    id: string;
    senderId: string;
    senderName: string;
    text: string;
    timestamp: number;
}

export function getClanChat(_clanId: ClanId): ChatMessage[] {
    const stored = localStorage.getItem('clan_chat');
    if (stored) {
        try { return JSON.parse(stored); } catch { /* ignore */ }
    }
    return [
        { id: 'cm-1', senderId: 's1', senderName: 'Lucas_Fênix', text: 'Bora batalha de clã hoje à noite?', timestamp: Date.now() - 600000 },
        { id: 'cm-2', senderId: 's2', senderName: 'Ana_Lobo', text: 'Tô dentro! 💪', timestamp: Date.now() - 500000 },
        { id: 'cm-3', senderId: 's3', senderName: 'Pedro_Dragão', text: 'Quem quer X1 comigo?', timestamp: Date.now() - 300000 },
        { id: 'cm-4', senderId: 's1', senderName: 'Lucas_Fênix', text: 'Acabei de fazer 5/5 no quiz de genética!', timestamp: Date.now() - 120000 },
    ];
}

export function sendClanMessage(clanId: ClanId, message: ChatMessage): void {
    const chat = getClanChat(clanId);
    chat.push(message);
    localStorage.setItem('clan_chat', JSON.stringify(chat));
}

/* ─────────────── Service ─────────────── */

export const ArenaService = {
    /** Retorna oponente aleatório para X1 */
    findOpponent: (excludeClanId?: ClanId): typeof MOCK_OPPONENTS[0] => {
        const pool = excludeClanId
            ? MOCK_OPPONENTS.filter(o => o.clanId !== excludeClanId)
            : MOCK_OPPONENTS;
        return pool[Math.floor(Math.random() * pool.length)];
    },

    /** Retorna questões para batalha */
    getBattleQuestions: (count: number = 5): BattleQuestion[] => {
        // Using vestibular questions as source
        const source = [...ALL_VESTIBULAR_QUESTIONS];
        const shuffled = source.sort(() => Math.random() - 0.5);
        const selected = shuffled.slice(0, count);

        return selected.map(q => ({
            id: q.id,
            question: q.question,
            alternatives: q.alternatives,
            correctAnswer: q.correctAnswer,
            timeLimit: 30
        }));
    },

    /** Simula resposta do oponente (AI) */
    simulateOpponentAnswer: (question: BattleQuestion): { answer: string; timeMs: number } => {
        // 60% chance de acertar
        const isCorrect = Math.random() < 0.6;
        const answer = isCorrect
            ? question.correctAnswer
            : question.alternatives.filter(a => a.letter !== question.correctAnswer)[
                Math.floor(Math.random() * 4)
            ].letter;
        const timeMs = 3000 + Math.floor(Math.random() * 15000); // 3-18s
        return { answer, timeMs };
    },

    /** Retorna histórico de batalhas */
    getBattleHistory: (): BattleHistoryEntry[] => MOCK_HISTORY,

    /** Ranking global de X1 */
    getX1Ranking: () => [
        { name: 'Rafael_Dragão', clanId: 'dragao' as ClanId, wins: 42, losses: 8, winRate: 84 },
        { name: 'Maria_Águia', clanId: 'aguia' as ClanId, wins: 38, losses: 12, winRate: 76 },
        { name: 'Ana_Lobo', clanId: 'lobo' as ClanId, wins: 35, losses: 15, winRate: 70 },
        { name: 'Lucas_Fênix', clanId: 'fenix' as ClanId, wins: 30, losses: 10, winRate: 75 },
        { name: 'Gabriel_Lobo', clanId: 'lobo' as ClanId, wins: 28, losses: 22, winRate: 56 },
        { name: 'Juliana_Fênix', clanId: 'fenix' as ClanId, wins: 25, losses: 18, winRate: 58 },
        { name: 'Pedro_Dragão', clanId: 'dragao' as ClanId, wins: 22, losses: 20, winRate: 52 },
        { name: 'Bianca_Águia', clanId: 'aguia' as ClanId, wins: 20, losses: 15, winRate: 57 },
    ],

    /** Ranking de batalhas de clã */
    getClanBattleRanking: () => [
        { clanId: 'dragao' as ClanId, name: 'Clã Dragão', wins: 28, totalBattles: 35, avgScore: 78 },
        { clanId: 'lobo' as ClanId, name: 'Clã Lobo', wins: 25, totalBattles: 35, avgScore: 72 },
        { clanId: 'fenix' as ClanId, name: 'Clã Fênix', wins: 22, totalBattles: 35, avgScore: 68 },
        { clanId: 'aguia' as ClanId, name: 'Clã Águia', wins: 20, totalBattles: 35, avgScore: 65 },
    ],
};
