import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    CheckCircle2, XCircle,
    Zap, ArrowRight, RotateCcw,
} from 'lucide-react';
import { ArenaService, type BattleQuestion } from '@/services/ArenaService';
import { useAuthProfile } from '@/context/AuthProfileContext';
import { CLANS, type ClanId } from '@/services/ClanService';
import { useStudyProgress } from '@/context/StudyProgressContext';

/* ─── Phases ─── */
type Phase = 'matchmaking' | 'ready' | 'battle' | 'result';

/* ─── Clan Colors ─── */
const CLAN_COLORS: Record<string, string> = {
    fenix: '#f97316', lobo: '#6366f1', aguia: '#eab308', dragao: '#ef4444',
};

export default function BatalhaX1Page() {
    const navigate = useNavigate();
    const { profile } = useAuthProfile();
    const { registerAnswer } = useStudyProgress();

    const [phase, setPhase] = useState<Phase>('matchmaking');
    const [opponent, setOpponent] = useState<{ name: string; clanId: ClanId; level: number } | null>(null);
    const [questions, setQuestions] = useState<BattleQuestion[]>([]);
    const [currentIdx, setCurrentIdx] = useState(0);
    const [myScore, setMyScore] = useState(0);
    const [opponentScore, setOpponentScore] = useState(0);
    const [myAnswer, setMyAnswer] = useState<string | null>(null);
    const [timer, setTimer] = useState(30);
    const [opponentAnswered, setOpponentAnswered] = useState(false);
    const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

    /* ─── Matchmaking ─── */
    useEffect(() => {
        if (phase !== 'matchmaking') return;
        const timeout = setTimeout(() => {
            const opp = ArenaService.findOpponent(profile.clanId ?? undefined);
            setOpponent(opp);
            setQuestions(ArenaService.getBattleQuestions(5));
            setPhase('ready');
        }, 2500 + Math.random() * 2000);
        return () => clearTimeout(timeout);
    }, [phase, profile.clanId]);

    /* ─── Ready countdown ─── */
    useEffect(() => {
        if (phase !== 'ready') return;
        const timeout = setTimeout(() => setPhase('battle'), 3000);
        return () => clearTimeout(timeout);
    }, [phase]);

    /* ─── Timer ─── */
    useEffect(() => {
        if (phase !== 'battle') return;
        setTimer(30);
        timerRef.current = setInterval(() => {
            setTimer((t) => {
                if (t <= 1) {
                    // Time's up — auto-advance
                    if (timerRef.current) clearInterval(timerRef.current);
                    handleTimeUp();
                    return 0;
                }
                return t - 1;
            });
        }, 1000);
        return () => { if (timerRef.current) clearInterval(timerRef.current); };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [phase, currentIdx]);

    /* ─── Simulate opponent ─── */
    useEffect(() => {
        if (phase !== 'battle' || !questions[currentIdx]) return;
        setOpponentAnswered(false);

        const sim = ArenaService.simulateOpponentAnswer(questions[currentIdx]);
        const timeout = setTimeout(() => {
            setOpponentAnswered(true);
            if (sim.answer === questions[currentIdx].correctAnswer) {
                setOpponentScore((s) => s + 1);
            }
        }, sim.timeMs);
        return () => clearTimeout(timeout);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [phase, currentIdx]);

    const handleTimeUp = useCallback(() => {
        if (!myAnswer) {
            // Player didn't answer
            advanceQuestion();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [myAnswer, currentIdx]);

    const handleAnswer = (letter: string) => {
        if (myAnswer) return;
        setMyAnswer(letter);
        if (timerRef.current) clearInterval(timerRef.current);

        const isCorrect = letter === questions[currentIdx].correctAnswer;
        if (isCorrect) setMyScore((s) => s + 1);

        registerAnswer({
            area: 'matematica', // generic
            isCorrect,
            xp: isCorrect ? 15 : 3,
        });

        // Auto-advance after 2s
        setTimeout(() => advanceQuestion(), 2000);
    };

    const advanceQuestion = () => {
        if (currentIdx < questions.length - 1) {
            setCurrentIdx((i) => i + 1);
            setMyAnswer(null);
            setOpponentAnswered(false);
        } else {
            setPhase('result');
        }
    };

    const clanId = profile.clanId ?? 'fenix';
    const myClan = CLANS[clanId];

    /* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
       MATCHMAKING
       ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
    if (phase === 'matchmaking') {
        return (
            <div className="min-h-[70vh] flex flex-col items-center justify-center gap-6 px-4">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 2, ease: 'linear' }}
                    className="w-20 h-20 rounded-full border-4 border-white/10 border-t-purple"
                />
                <h2 className="text-2xl font-bold text-white">Buscando Oponente...</h2>
                <p className="text-white/40">Procurando um adversário à sua altura</p>
                <div className="flex gap-2 mt-4">
                    {[0, 1, 2].map((i) => (
                        <motion.div
                            key={i}
                            className="w-3 h-3 rounded-full bg-purple"
                            animate={{ opacity: [0.3, 1, 0.3] }}
                            transition={{ repeat: Infinity, duration: 1.2, delay: i * 0.3 }}
                        />
                    ))}
                </div>
                <button
                    onClick={() => navigate('/app/arena')}
                    className="mt-6 text-sm text-white/40 hover:text-white transition"
                >
                    Cancelar
                </button>
            </div>
        );
    }

    /* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
       READY — VS screen
       ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
    if (phase === 'ready' && opponent) {
        return (
            <div className="min-h-[70vh] flex flex-col items-center justify-center gap-8 px-4">
                <div className="flex items-center gap-8 md:gap-16">
                    {/* Me */}
                    <motion.div
                        initial={{ x: -100, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        className="text-center"
                    >
                        <div className="w-24 h-24 rounded-2xl flex items-center justify-center text-3xl font-bold mb-3"
                            style={{ backgroundColor: CLAN_COLORS[clanId] + '30', color: CLAN_COLORS[clanId] }}>
                            {profile.displayName.substring(0, 2).toUpperCase()}
                        </div>
                        <p className="text-white font-bold">{profile.displayName}</p>
                        <p className="text-xs" style={{ color: CLAN_COLORS[clanId] }}>{myClan.name}</p>
                    </motion.div>

                    {/* VS */}
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.3, type: 'spring' }}
                        className="text-4xl font-black text-red-500"
                    >
                        VS
                    </motion.div>

                    {/* Opponent */}
                    <motion.div
                        initial={{ x: 100, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        className="text-center"
                    >
                        <div className="w-24 h-24 rounded-2xl flex items-center justify-center text-3xl font-bold mb-3"
                            style={{ backgroundColor: CLAN_COLORS[opponent.clanId] + '30', color: CLAN_COLORS[opponent.clanId] }}>
                            {opponent.name.substring(0, 2).toUpperCase()}
                        </div>
                        <p className="text-white font-bold">{opponent.name}</p>
                        <p className="text-xs" style={{ color: CLAN_COLORS[opponent.clanId] }}>{CLANS[opponent.clanId].name}</p>
                    </motion.div>
                </div>

                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="text-white/50 text-lg"
                >
                    Preparando batalha...
                </motion.p>
            </div>
        );
    }

    /* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
       BATTLE — Questions
       ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
    if (phase === 'battle' && opponent && questions.length > 0) {
        const q = questions[currentIdx];
        const isCorrectAnswer = myAnswer === q.correctAnswer;
        const timerPct = (timer / 30) * 100;
        const timerColor = timer > 10 ? '#22c55e' : timer > 5 ? '#f59e0b' : '#ef4444';

        return (
            <div className="max-w-4xl mx-auto py-6 px-4">
                {/* Scoreboard */}
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold"
                            style={{ backgroundColor: CLAN_COLORS[clanId] + '30', color: CLAN_COLORS[clanId] }}>
                            {profile.displayName.substring(0, 2).toUpperCase()}
                        </div>
                        <div>
                            <p className="text-white text-sm font-medium">{profile.displayName}</p>
                            <p className="text-2xl font-black text-white">{myScore}</p>
                        </div>
                    </div>

                    {/* Timer */}
                    <div className="flex flex-col items-center">
                        <div className="relative w-16 h-16">
                            <svg className="w-full h-full -rotate-90" viewBox="0 0 40 40">
                                <circle cx="20" cy="20" r="17" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="3" />
                                <circle
                                    cx="20" cy="20" r="17" fill="none"
                                    stroke={timerColor}
                                    strokeWidth="3"
                                    strokeDasharray={`${(timerPct / 100) * 106.8} 106.8`}
                                    strokeLinecap="round"
                                    style={{ transition: 'stroke-dasharray 0.5s' }}
                                />
                            </svg>
                            <span className="absolute inset-0 flex items-center justify-center text-white font-bold text-lg">
                                {timer}
                            </span>
                        </div>
                        <span className="text-xs text-white/30 mt-1">{currentIdx + 1}/{questions.length}</span>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="text-right">
                            <p className="text-white text-sm font-medium">{opponent.name}</p>
                            <p className="text-2xl font-black text-white">{opponentScore}</p>
                        </div>
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold"
                            style={{ backgroundColor: CLAN_COLORS[opponent.clanId] + '30', color: CLAN_COLORS[opponent.clanId] }}>
                            {opponent.name.substring(0, 2).toUpperCase()}
                        </div>
                    </div>
                </div>

                {/* Progress bar */}
                <div className="w-full h-1.5 bg-white/10 rounded-full mb-6 overflow-hidden flex">
                    <div className="h-full rounded-l-full transition-all"
                        style={{ width: `${(myScore / questions.length) * 50}%`, backgroundColor: CLAN_COLORS[clanId] }} />
                    <div className="flex-1" />
                    <div className="h-full rounded-r-full transition-all"
                        style={{ width: `${(opponentScore / questions.length) * 50}%`, backgroundColor: CLAN_COLORS[opponent.clanId] }} />
                </div>

                {/* Opponent status */}
                <div className="flex justify-end mb-3">
                    <span className={`text-xs px-2 py-1 rounded-lg ${opponentAnswered ? 'bg-green-500/20 text-green-400' : 'bg-white/5 text-white/30'
                        }`}>
                        {opponentAnswered ? '✅ Respondeu' : '⏳ Pensando...'}
                    </span>
                </div>

                {/* Question */}
                <AnimatePresence mode="wait">
                    <motion.div
                        key={q.id}
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -30 }}
                        className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10"
                    >
                        <h3 className="text-white text-lg leading-relaxed mb-6">{q.question}</h3>

                        <div className="space-y-3">
                            {q.alternatives.map((alt) => {
                                let classes = 'bg-white/5 border-white/5 hover:bg-white/10 hover:border-white/20';
                                if (myAnswer) {
                                    if (alt.letter === q.correctAnswer) {
                                        classes = 'bg-green-500/20 border-green-500/50';
                                    } else if (alt.letter === myAnswer && !isCorrectAnswer) {
                                        classes = 'bg-red-500/20 border-red-500/50';
                                    } else {
                                        classes = 'bg-white/5 border-white/5 opacity-50';
                                    }
                                }

                                return (
                                    <button
                                        key={alt.letter}
                                        onClick={() => handleAnswer(alt.letter)}
                                        disabled={!!myAnswer}
                                        className={`w-full text-left p-4 rounded-xl border transition-all flex items-start gap-3 ${classes}`}
                                    >
                                        <span className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold shrink-0 ${myAnswer && alt.letter === q.correctAnswer
                                            ? 'bg-green-500 text-white'
                                            : myAnswer && alt.letter === myAnswer && !isCorrectAnswer
                                                ? 'bg-red-500 text-white'
                                                : 'bg-white/10 text-white/50'
                                            }`}>
                                            {alt.letter}
                                        </span>
                                        <span className="text-white/80 text-sm leading-relaxed pt-1">{alt.text}</span>
                                    </button>
                                );
                            })}
                        </div>

                        {/* Feedback */}
                        {myAnswer && (
                            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-4">
                                <div className={`p-3 rounded-xl flex items-center gap-2 ${isCorrectAnswer ? 'bg-green-500/20 border border-green-500/30' : 'bg-red-500/20 border border-red-500/30'
                                    }`}>
                                    {isCorrectAnswer
                                        ? <><CheckCircle2 className="w-5 h-5 text-green-400" /><span className="text-green-400 font-medium">Correto! +15 XP</span></>
                                        : <><XCircle className="w-5 h-5 text-red-400" /><span className="text-red-400 font-medium">Errado! Resposta: {q.correctAnswer}</span></>
                                    }
                                </div>
                            </motion.div>
                        )}
                    </motion.div>
                </AnimatePresence>
            </div>
        );
    }

    /* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
       RESULT
       ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
    if (phase === 'result' && opponent) {
        const isWin = myScore > opponentScore;
        const isDraw = myScore === opponentScore;
        const xpEarned = isWin ? 80 : isDraw ? 30 : 15;

        return (
            <div className="max-w-xl mx-auto py-10 px-4">
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="bg-white/5 backdrop-blur-md rounded-2xl p-8 border border-white/10 text-center space-y-6"
                >
                    <div className="text-6xl">
                        {isWin ? '🏆' : isDraw ? '🤝' : '💪'}
                    </div>
                    <h2 className="text-3xl font-black text-white">
                        {isWin ? 'VITÓRIA!' : isDraw ? 'EMPATE!' : 'DERROTA'}
                    </h2>

                    {/* Score comparison */}
                    <div className="flex items-center justify-center gap-8">
                        <div className="text-center">
                            <p className="text-4xl font-black" style={{ color: CLAN_COLORS[clanId] }}>{myScore}</p>
                            <p className="text-sm text-white/50">{profile.displayName}</p>
                        </div>
                        <span className="text-2xl text-white/20">×</span>
                        <div className="text-center">
                            <p className="text-4xl font-black" style={{ color: CLAN_COLORS[opponent.clanId] }}>{opponentScore}</p>
                            <p className="text-sm text-white/50">{opponent.name}</p>
                        </div>
                    </div>

                    {/* XP earned */}
                    <div className={`p-4 rounded-xl ${isWin ? 'bg-green-500/20 border border-green-500/30' : 'bg-white/5 border border-white/10'
                        }`}>
                        <div className="flex items-center justify-center gap-2">
                            <Zap className="w-5 h-5 text-gold" />
                            <span className="text-gold font-bold text-lg">+{xpEarned} XP</span>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 justify-center pt-2">
                        <button
                            onClick={() => navigate('/app/arena')}
                            className="px-6 py-3 rounded-xl bg-white/10 text-white hover:bg-white/20 transition"
                        >
                            <ArrowRight className="w-4 h-4 inline mr-2" />
                            Voltar à Arena
                        </button>
                        <button
                            onClick={() => {
                                setPhase('matchmaking');
                                setCurrentIdx(0);
                                setMyScore(0);
                                setOpponentScore(0);
                                setMyAnswer(null);
                            }}
                            className="px-6 py-3 rounded-xl bg-purple text-white font-medium hover:bg-purple/80 transition"
                        >
                            <RotateCcw className="w-4 h-4 inline mr-2" />
                            Jogar Novamente
                        </button>
                    </div>
                </motion.div>
            </div>
        );
    }

    return null;
}
