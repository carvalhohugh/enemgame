import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Shield, CheckCircle2, XCircle,
    Zap, ArrowRight, RotateCcw,
} from 'lucide-react';
import { ArenaService, type BattleQuestion } from '@/services/ArenaService';
import { useAuthProfile } from '@/context/AuthProfileContext';
import { CLANS, type ClanId } from '@/services/ClanService';
import { useStudyProgress } from '@/context/StudyProgressContext';

type Phase = 'matchmaking' | 'ready' | 'battle' | 'result';

const CLAN_COLORS: Record<string, string> = {
    fenix: '#f97316', lobo: '#6366f1', aguia: '#eab308', dragao: '#ef4444',
};

const CLAN_IDS: ClanId[] = ['fenix', 'lobo', 'aguia', 'dragao'];

export default function BatalhaClaPage() {
    const navigate = useNavigate();
    const { profile } = useAuthProfile();
    const { registerAnswer } = useStudyProgress();

    const [phase, setPhase] = useState<Phase>('matchmaking');
    const [enemyClanId, setEnemyClanId] = useState<ClanId>('dragao');
    const [questions, setQuestions] = useState<BattleQuestion[]>([]);
    const [currentIdx, setCurrentIdx] = useState(0);
    const [myTeamScore, setMyTeamScore] = useState(0);
    const [enemyTeamScore, setEnemyTeamScore] = useState(0);
    const [myAnswer, setMyAnswer] = useState<string | null>(null);
    const [timer, setTimer] = useState(30);
    const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

    const clanId = profile.clanId ?? 'fenix';
    const myClan = CLANS[clanId];
    const enemyClan = CLANS[enemyClanId];

    /* ─── Matchmaking ─── */
    useEffect(() => {
        if (phase !== 'matchmaking') return;
        const enemy = CLAN_IDS.filter(c => c !== clanId)[Math.floor(Math.random() * 3)];
        const t = setTimeout(() => {
            setEnemyClanId(enemy);
            setQuestions(ArenaService.getBattleQuestions(10));
            setPhase('ready');
        }, 3000);
        return () => clearTimeout(t);
    }, [phase, clanId]);

    useEffect(() => {
        if (phase !== 'ready') return;
        const t = setTimeout(() => setPhase('battle'), 3000);
        return () => clearTimeout(t);
    }, [phase]);

    /* ─── Timer ─── */
    useEffect(() => {
        if (phase !== 'battle') return;
        setTimer(30);
        timerRef.current = setInterval(() => {
            setTimer((t) => {
                if (t <= 1) {
                    if (timerRef.current) clearInterval(timerRef.current);
                    advanceQuestion();
                    return 0;
                }
                return t - 1;
            });
        }, 1000);
        return () => { if (timerRef.current) clearInterval(timerRef.current); };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [phase, currentIdx]);

    /* ─── Simulate enemy team ─── */
    useEffect(() => {
        if (phase !== 'battle' || !questions[currentIdx]) return;
        const sim = ArenaService.simulateOpponentAnswer(questions[currentIdx]);
        const t = setTimeout(() => {
            if (sim.answer === questions[currentIdx].correctAnswer) {
                setEnemyTeamScore(s => s + 1);
            }
        }, sim.timeMs);
        return () => clearTimeout(t);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [phase, currentIdx]);

    const advanceQuestion = useCallback(() => {
        if (currentIdx < questions.length - 1) {
            setCurrentIdx(i => i + 1);
            setMyAnswer(null);
        } else {
            setPhase('result');
        }
    }, [currentIdx, questions.length]);

    const handleAnswer = (letter: string) => {
        if (myAnswer) return;
        setMyAnswer(letter);
        if (timerRef.current) clearInterval(timerRef.current);

        const isCorrect = letter === questions[currentIdx].correctAnswer;
        if (isCorrect) setMyTeamScore(s => s + 1);

        registerAnswer({ area: 'matematica', isCorrect, xp: isCorrect ? 10 : 2 });
        setTimeout(() => advanceQuestion(), 1800);
    };

    /* ━━━ MATCHMAKING ━━━ */
    if (phase === 'matchmaking') {
        return (
            <div className="min-h-[70vh] flex flex-col items-center justify-center gap-6 px-4">
                <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 2, ease: 'linear' }}
                    className="w-20 h-20 rounded-full border-4 border-white/10 border-t-red-500" />
                <h2 className="text-2xl font-bold text-white">Procurando Clã adversário...</h2>
                <p className="text-white/40">Aguardando combate entre clãs</p>
                <button onClick={() => navigate('/arena')} className="mt-6 text-sm text-white/40 hover:text-white transition">Cancelar</button>
            </div>
        );
    }

    /* ━━━ READY ━━━ */
    if (phase === 'ready') {
        return (
            <div className="min-h-[70vh] flex flex-col items-center justify-center gap-8 px-4">
                <div className="flex items-center gap-12">
                    <motion.div initial={{ x: -100, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="text-center">
                        <div className="w-28 h-28 rounded-2xl flex items-center justify-center text-5xl mb-3"
                            style={{ backgroundColor: CLAN_COLORS[clanId] + '30' }}>
                            <Shield className="w-14 h-14" style={{ color: CLAN_COLORS[clanId] }} />
                        </div>
                        <p className="text-white font-bold text-lg">{myClan.name}</p>
                        <p className="text-xs text-white/40">Seu Clã</p>
                    </motion.div>

                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.3, type: 'spring' }}
                        className="text-5xl font-black text-red-500">VS</motion.div>

                    <motion.div initial={{ x: 100, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="text-center">
                        <div className="w-28 h-28 rounded-2xl flex items-center justify-center text-5xl mb-3"
                            style={{ backgroundColor: CLAN_COLORS[enemyClanId] + '30' }}>
                            <Shield className="w-14 h-14" style={{ color: CLAN_COLORS[enemyClanId] }} />
                        </div>
                        <p className="text-white font-bold text-lg">{enemyClan.name}</p>
                        <p className="text-xs text-white/40">Adversário</p>
                    </motion.div>
                </div>
                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}
                    className="text-white/50 text-lg">🔥 10 questões • Soma de acertos decide!</motion.p>
            </div>
        );
    }

    /* ━━━ BATTLE ━━━ */
    if (phase === 'battle' && questions.length > 0) {
        const q = questions[currentIdx];
        const isCorrectAnswer = myAnswer === q.correctAnswer;
        const timerColor = timer > 10 ? '#22c55e' : timer > 5 ? '#f59e0b' : '#ef4444';

        return (
            <div className="max-w-4xl mx-auto py-6 px-4">
                {/* Scoreboard */}
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <Shield className="w-8 h-8" style={{ color: CLAN_COLORS[clanId] }} />
                        <div>
                            <p className="text-sm text-white/50">{myClan.name}</p>
                            <p className="text-3xl font-black text-white">{myTeamScore}</p>
                        </div>
                    </div>

                    <div className="flex flex-col items-center">
                        <div className="text-3xl font-bold" style={{ color: timerColor }}>{timer}</div>
                        <span className="text-xs text-white/30">{currentIdx + 1}/{questions.length}</span>
                    </div>

                    <div className="flex items-center gap-3 text-right">
                        <div>
                            <p className="text-sm text-white/50">{enemyClan.name}</p>
                            <p className="text-3xl font-black text-white">{enemyTeamScore}</p>
                        </div>
                        <Shield className="w-8 h-8" style={{ color: CLAN_COLORS[enemyClanId] }} />
                    </div>
                </div>

                {/* Progress */}
                <div className="w-full h-1.5 bg-white/10 rounded-full mb-6 overflow-hidden flex">
                    <div className="h-full rounded-l-full transition-all" style={{ width: `${(myTeamScore / questions.length) * 50}%`, backgroundColor: CLAN_COLORS[clanId] }} />
                    <div className="flex-1" />
                    <div className="h-full rounded-r-full transition-all" style={{ width: `${(enemyTeamScore / questions.length) * 50}%`, backgroundColor: CLAN_COLORS[enemyClanId] }} />
                </div>

                {/* Question */}
                <AnimatePresence mode="wait">
                    <motion.div key={q.id} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}
                        className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10">
                        <h3 className="text-white text-lg leading-relaxed mb-6">{q.question}</h3>
                        <div className="space-y-3">
                            {q.alternatives.map((alt) => {
                                let classes = 'bg-white/5 border-white/5 hover:bg-white/10 hover:border-white/20';
                                if (myAnswer) {
                                    if (alt.letter === q.correctAnswer) classes = 'bg-green-500/20 border-green-500/50';
                                    else if (alt.letter === myAnswer && !isCorrectAnswer) classes = 'bg-red-500/20 border-red-500/50';
                                    else classes = 'bg-white/5 border-white/5 opacity-50';
                                }
                                return (
                                    <button key={alt.letter} onClick={() => handleAnswer(alt.letter)} disabled={!!myAnswer}
                                        className={`w-full text-left p-4 rounded-xl border transition-all flex items-start gap-3 ${classes}`}>
                                        <span className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold shrink-0 ${myAnswer && alt.letter === q.correctAnswer ? 'bg-green-500 text-white'
                                            : myAnswer && alt.letter === myAnswer && !isCorrectAnswer ? 'bg-red-500 text-white'
                                                : 'bg-white/10 text-white/50'
                                            }`}>{alt.letter}</span>
                                        <span className="text-white/80 text-sm leading-relaxed pt-1">{alt.text}</span>
                                    </button>
                                );
                            })}
                        </div>
                        {myAnswer && (
                            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                                className={`mt-4 p-3 rounded-xl flex items-center gap-2 ${isCorrectAnswer ? 'bg-green-500/20 border border-green-500/30' : 'bg-red-500/20 border border-red-500/30'}`}>
                                {isCorrectAnswer
                                    ? <><CheckCircle2 className="w-5 h-5 text-green-400" /><span className="text-green-400 font-medium">+1 para {myClan.name}!</span></>
                                    : <><XCircle className="w-5 h-5 text-red-400" /><span className="text-red-400">Resposta: {q.correctAnswer}</span></>}
                            </motion.div>
                        )}
                    </motion.div>
                </AnimatePresence>
            </div>
        );
    }

    /* ━━━ RESULT ━━━ */
    if (phase === 'result') {
        const isWin = myTeamScore > enemyTeamScore;
        const isDraw = myTeamScore === enemyTeamScore;
        const xp = isWin ? 150 : isDraw ? 50 : 25;

        return (
            <div className="max-w-xl mx-auto py-10 px-4">
                <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                    className="bg-white/5 backdrop-blur-md rounded-2xl p-8 border border-white/10 text-center space-y-6">
                    <div className="text-6xl">{isWin ? '🏆' : isDraw ? '🤝' : '💪'}</div>
                    <h2 className="text-3xl font-black text-white">{isWin ? `${myClan.name} VENCEU!` : isDraw ? 'EMPATE!' : `${enemyClan.name} Venceu`}</h2>

                    <div className="flex items-center justify-center gap-8">
                        <div className="text-center">
                            <Shield className="w-10 h-10 mx-auto mb-2" style={{ color: CLAN_COLORS[clanId] }} />
                            <p className="text-4xl font-black" style={{ color: CLAN_COLORS[clanId] }}>{myTeamScore}</p>
                            <p className="text-sm text-white/50">{myClan.name}</p>
                        </div>
                        <span className="text-2xl text-white/20">×</span>
                        <div className="text-center">
                            <Shield className="w-10 h-10 mx-auto mb-2" style={{ color: CLAN_COLORS[enemyClanId] }} />
                            <p className="text-4xl font-black" style={{ color: CLAN_COLORS[enemyClanId] }}>{enemyTeamScore}</p>
                            <p className="text-sm text-white/50">{enemyClan.name}</p>
                        </div>
                    </div>

                    <div className={`p-4 rounded-xl ${isWin ? 'bg-green-500/20 border border-green-500/30' : 'bg-white/5 border border-white/10'}`}>
                        <div className="flex items-center justify-center gap-2">
                            <Zap className="w-5 h-5 text-gold" />
                            <span className="text-gold font-bold text-lg">+{xp} XP para o Clã</span>
                        </div>
                    </div>

                    <div className="flex gap-3 justify-center pt-2">
                        <button onClick={() => navigate('/arena')} className="px-6 py-3 rounded-xl bg-white/10 text-white hover:bg-white/20 transition">
                            <ArrowRight className="w-4 h-4 inline mr-2" />Voltar à Arena
                        </button>
                        <button onClick={() => { setPhase('matchmaking'); setCurrentIdx(0); setMyTeamScore(0); setEnemyTeamScore(0); setMyAnswer(null); }}
                            className="px-6 py-3 rounded-xl bg-red-500 text-white font-medium hover:bg-red-500/80 transition">
                            <RotateCcw className="w-4 h-4 inline mr-2" />Nova Batalha de Clã
                        </button>
                    </div>
                </motion.div>
            </div>
        );
    }

    return null;
}
