import { useCallback, useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Zap, CheckCircle2, XCircle, ArrowRight, RotateCcw,
    Trophy, Clock, Target, Flame,
} from 'lucide-react';
import { EnemService } from '@/services/EnemService';
import { useStudyProgress } from '@/context/StudyProgressContext';
import type { AreaId } from '@/context/StudyProgressContext';

/* ─── Types ─── */
interface QuickQuestion {
    id: string;
    title: string;
    context: string | null;
    alternatives: { letter: string; text: string; isCorrect: boolean }[];
    correctAlternative: string;
    discipline: string;
    year: number;
}

type AnswerState = { letter: string; isCorrect: boolean } | null;

/* ─── Area mapping ─── */
const disciplineToArea: Record<string, AreaId> = {
    'ciencias-humanas': 'humanas',
    'ciencias-natureza': 'natureza',
    linguagens: 'linguagens',
    matematica: 'matematica',
};

const XP_PER_CORRECT = 10;
const TOTAL_QUESTIONS = 10;

/* ─── Component ─── */
export default function TesteRapidoPage() {
    const { registerAnswer } = useStudyProgress();
    const [questions, setQuestions] = useState<QuickQuestion[]>([]);
    const [currentIdx, setCurrentIdx] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState<AnswerState>(null);
    const [score, setScore] = useState(0);
    const [totalXpGained, setTotalXpGained] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [finished, setFinished] = useState(false);
    const [streak, setStreak] = useState(0);
    const [bestStreak, setBestStreak] = useState(0);
    const [startTime] = useState(Date.now());

    /* ─── Load questions ─── */
    const loadQuestions = useCallback(async () => {
        setIsLoading(true);
        setError('');
        try {
            const exams = await EnemService.getExams();
            if (exams.length === 0) throw new Error('Nenhuma prova disponível');

            // Pick random years and disciplines
            const disciplines = ['ciencias-humanas', 'ciencias-natureza', 'linguagens', 'matematica'];
            const allQuestions: QuickQuestion[] = [];

            // Fetch from 2-3 random years to get variety
            const shuffledExams = [...exams].sort(() => Math.random() - 0.5).slice(0, 3);

            for (const exam of shuffledExams) {
                if (allQuestions.length >= TOTAL_QUESTIONS * 2) break;

                const disc = disciplines[Math.floor(Math.random() * disciplines.length)];
                try {
                    const resp = await EnemService.getQuestions(exam.year, {
                        discipline: disc,
                        limit: 15,
                        offset: Math.floor(Math.random() * 20),
                    });

                    const portugueseQs = resp.questions.filter((q) => {
                        const ctx = (q.context || '') + q.title;
                        const hasPortuguese = /[àáãâéêíóõôúç]/i.test(ctx);
                        const notSpanish = q.language !== 'espanhol';
                        return hasPortuguese && notSpanish;
                    });

                    allQuestions.push(
                        ...portugueseQs.map((q) => ({
                            id: `${exam.year}-${q.index}`,
                            title: q.title,
                            context: q.context || null,
                            alternatives: q.alternatives.map((a) => ({
                                letter: a.letter,
                                text: a.text,
                                isCorrect: a.isCorrect,
                            })),
                            correctAlternative: q.correctAlternative,
                            discipline: disc,
                            year: exam.year,
                        })),
                    );
                } catch {
                    // Skip failed fetches
                }
            }

            // Shuffle and pick 10
            const shuffled = allQuestions.sort(() => Math.random() - 0.5).slice(0, TOTAL_QUESTIONS);

            if (shuffled.length < 5) {
                throw new Error('Não foi possível carregar questões suficientes. Tente novamente.');
            }

            setQuestions(shuffled);
            setCurrentIdx(0);
            setScore(0);
            setTotalXpGained(0);
            setSelectedAnswer(null);
            setFinished(false);
            setStreak(0);
            setBestStreak(0);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Erro ao carregar questões');
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        loadQuestions();
    }, [loadQuestions]);

    /* ─── Handle answer ─── */
    const handleAnswer = (letter: string) => {
        if (selectedAnswer) return; // Already answered

        const question = questions[currentIdx];
        const isCorrect = letter === question.correctAlternative;

        setSelectedAnswer({ letter, isCorrect });

        const area = disciplineToArea[question.discipline] || 'humanas';
        const xp = isCorrect ? XP_PER_CORRECT : 0;

        if (isCorrect) {
            setScore((s) => s + 1);
            setTotalXpGained((x) => x + xp);
            setStreak((s) => {
                const newStreak = s + 1;
                setBestStreak((b) => Math.max(b, newStreak));
                return newStreak;
            });
        } else {
            setStreak(0);
        }

        // Register in global progress
        registerAnswer({ area, isCorrect, xp });
    };

    /* ─── Next question ─── */
    const goNext = () => {
        if (currentIdx < questions.length - 1) {
            setCurrentIdx((i) => i + 1);
            setSelectedAnswer(null);
        } else {
            setFinished(true);
        }
    };

    /* ─── Derived ─── */
    const currentQuestion = questions[currentIdx];
    const progress = questions.length > 0 ? ((currentIdx + 1) / questions.length) * 100 : 0;

    const elapsedTime = useMemo(() => {
        if (!finished) return '';
        const seconds = Math.floor((Date.now() - startTime) / 1000);
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}m ${secs}s`;
    }, [finished, startTime]);

    /* ─── Loading state ─── */
    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1.5, ease: 'linear' }}
                >
                    <Zap className="w-12 h-12 text-purple" />
                </motion.div>
                <p className="text-white/60 text-lg">Carregando questões...</p>
            </div>
        );
    }

    /* ─── Error state ─── */
    if (error) {
        return (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
                <XCircle className="w-12 h-12 text-red-400" />
                <p className="text-white/60 text-lg">{error}</p>
                <button
                    onClick={loadQuestions}
                    className="px-6 py-3 rounded-xl bg-purple text-white font-medium hover:bg-purple/80 transition"
                >
                    Tentar novamente
                </button>
            </div>
        );
    }

    /* ─── Finished (result screen) ─── */
    if (finished) {
        const percentage = Math.round((score / questions.length) * 100);
        const emoji = percentage >= 80 ? '🔥' : percentage >= 60 ? '💪' : percentage >= 40 ? '📚' : '🎯';

        return (
            <div className="max-w-lg mx-auto py-10 px-4">
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="bg-white/5 backdrop-blur-md rounded-2xl p-8 border border-white/10 text-center space-y-6"
                >
                    <div className="text-6xl">{emoji}</div>

                    <h2 className="text-3xl font-bold text-white">Teste Finalizado!</h2>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-white/5 rounded-xl p-4">
                            <Target className="w-6 h-6 text-green-400 mx-auto mb-2" />
                            <p className="text-2xl font-bold text-white">{score}/{questions.length}</p>
                            <p className="text-xs text-white/50">Acertos</p>
                        </div>
                        <div className="bg-white/5 rounded-xl p-4">
                            <Trophy className="w-6 h-6 text-yellow-400 mx-auto mb-2" />
                            <p className="text-2xl font-bold text-green-400">+{totalXpGained} XP</p>
                            <p className="text-xs text-white/50">Conquistado</p>
                        </div>
                        <div className="bg-white/5 rounded-xl p-4">
                            <Flame className="w-6 h-6 text-orange-400 mx-auto mb-2" />
                            <p className="text-2xl font-bold text-white">{bestStreak}</p>
                            <p className="text-xs text-white/50">Melhor sequência</p>
                        </div>
                        <div className="bg-white/5 rounded-xl p-4">
                            <Clock className="w-6 h-6 text-blue-400 mx-auto mb-2" />
                            <p className="text-2xl font-bold text-white">{elapsedTime}</p>
                            <p className="text-xs text-white/50">Tempo total</p>
                        </div>
                    </div>

                    {/* Progress bar */}
                    <div>
                        <div className="flex justify-between text-sm text-white/50 mb-1">
                            <span>Aproveitamento</span>
                            <span>{percentage}%</span>
                        </div>
                        <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden">
                            <motion.div
                                className={`h-full rounded-full ${percentage >= 70 ? 'bg-green-500' : percentage >= 50 ? 'bg-yellow-500' : 'bg-red-500'}`}
                                initial={{ width: 0 }}
                                animate={{ width: `${percentage}%` }}
                                transition={{ duration: 1, delay: 0.3 }}
                            />
                        </div>
                    </div>

                    <button
                        onClick={loadQuestions}
                        className="flex items-center gap-2 mx-auto px-8 py-3 rounded-xl bg-gradient-to-r from-purple to-pink-500 text-white font-semibold hover:scale-105 transition-transform"
                    >
                        <RotateCcw className="w-4 h-4" />
                        Jogar Novamente
                    </button>
                </motion.div>
            </div>
        );
    }

    /* ─── Question card ─── */
    return (
        <div className="max-w-3xl mx-auto py-6 px-4">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-purple/20 flex items-center justify-center">
                        <Zap className="w-5 h-5 text-purple-light" />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-white">Teste Rápido</h1>
                        <p className="text-xs text-white/40">
                            Questão {currentIdx + 1} de {questions.length}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    {streak > 0 && (
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="flex items-center gap-1 bg-orange-500/20 px-3 py-1 rounded-full"
                        >
                            <Flame className="w-4 h-4 text-orange-400" />
                            <span className="text-orange-400 text-sm font-bold">{streak}x</span>
                        </motion.div>
                    )}
                    <div className="bg-green-500/20 px-3 py-1 rounded-full">
                        <span className="text-green-400 text-sm font-bold">+{totalXpGained} XP</span>
                    </div>
                </div>
            </div>

            {/* Progress bar */}
            <div className="w-full h-1.5 bg-white/10 rounded-full mb-6 overflow-hidden">
                <motion.div
                    className="h-full bg-gradient-to-r from-purple to-pink-500 rounded-full"
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.3 }}
                />
            </div>

            {/* Question */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={currentQuestion.id}
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -30 }}
                    className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10"
                >
                    {/* Year + discipline badge */}
                    <div className="flex items-center gap-2 mb-4">
                        <span className="text-xs px-2 py-1 rounded bg-white/10 text-white/50">
                            ENEM {currentQuestion.year}
                        </span>
                        <span className="text-xs px-2 py-1 rounded bg-purple/20 text-purple-light">
                            {currentQuestion.discipline.replace('ciencias-', 'Ciências ').replace('linguagens', 'Linguagens').replace('matematica', 'Matemática')}
                        </span>
                    </div>

                    {/* Context */}
                    {currentQuestion.context && (
                        <div className="mb-4 text-white/70 text-sm leading-relaxed max-h-48 overflow-y-auto pr-2 whitespace-pre-line border-l-2 border-purple/30 pl-4">
                            {currentQuestion.context.length > 800
                                ? currentQuestion.context.slice(0, 800) + '...'
                                : currentQuestion.context}
                        </div>
                    )}

                    {/* Alternatives */}
                    <div className="space-y-3">
                        {currentQuestion.alternatives.map((alt) => {
                            let classes = 'bg-white/5 border-white/5 hover:bg-purple/15 hover:border-purple/30';

                            if (selectedAnswer) {
                                if (alt.isCorrect) {
                                    classes = 'bg-green-500/20 border-green-500/50';
                                } else if (alt.letter === selectedAnswer.letter && !selectedAnswer.isCorrect) {
                                    classes = 'bg-red-500/20 border-red-500/50';
                                } else {
                                    classes = 'bg-white/5 border-white/5 opacity-50';
                                }
                            }

                            return (
                                <button
                                    key={alt.letter}
                                    onClick={() => handleAnswer(alt.letter)}
                                    disabled={!!selectedAnswer}
                                    className={`w-full text-left p-4 rounded-xl border transition-all flex items-start gap-3 ${classes}`}
                                >
                                    <span className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold shrink-0 ${selectedAnswer && alt.isCorrect
                                        ? 'bg-green-500 text-white'
                                        : selectedAnswer && alt.letter === selectedAnswer.letter && !selectedAnswer.isCorrect
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

                    {/* Feedback + Next */}
                    {selectedAnswer && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mt-6 flex items-center justify-between"
                        >
                            <div className="flex items-center gap-2">
                                {selectedAnswer.isCorrect ? (
                                    <>
                                        <CheckCircle2 className="w-5 h-5 text-green-400" />
                                        <span className="text-green-400 font-medium">Correto! +{XP_PER_CORRECT} XP</span>
                                    </>
                                ) : (
                                    <>
                                        <XCircle className="w-5 h-5 text-red-400" />
                                        <span className="text-red-400 font-medium">
                                            Errado. Resposta: {currentQuestion.correctAlternative}
                                        </span>
                                    </>
                                )}
                            </div>

                            <button
                                onClick={goNext}
                                className="flex items-center gap-2 px-6 py-2 rounded-xl bg-purple text-white font-medium hover:bg-purple/80 transition"
                            >
                                {currentIdx < questions.length - 1 ? 'Próxima' : 'Ver Resultado'}
                                <ArrowRight className="w-4 h-4" />
                            </button>
                        </motion.div>
                    )}
                </motion.div>
            </AnimatePresence>
        </div>
    );
}
