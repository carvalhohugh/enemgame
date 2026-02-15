import { useCallback, useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    BookOpen, Clock, ChevronLeft, ChevronRight, CheckCircle2,
    XCircle, BarChart3, ArrowRight, AlertTriangle, Bookmark,
} from 'lucide-react';
import { EnemService } from '@/services/EnemService';
import { useStudyProgress } from '@/context/StudyProgressContext';
import type { AreaId } from '@/context/StudyProgressContext';

interface SimQuestion {
    id: string;
    index: number;
    title: string;
    context: string | null;
    alternatives: { letter: string; text: string; isCorrect: boolean }[];
    correctAlternative: string;
    discipline: string;
    year: number;
}

type Phase = 'setup' | 'exam' | 'review' | 'result';

interface ExamDay {
    label: string;
    disciplines: string[];
    disciplineLabels: string[];
    timer: number;
}

const EXAM_DAYS: ExamDay[] = [
    {
        label: 'Dia 1 — Linguagens + Humanas',
        disciplines: ['linguagens', 'ciencias-humanas'],
        disciplineLabels: ['Linguagens', 'Ciências Humanas'],
        timer: 5.5 * 60 * 60,
    },
    {
        label: 'Dia 2 — Natureza + Matemática',
        disciplines: ['ciencias-natureza', 'matematica'],
        disciplineLabels: ['Ciências da Natureza', 'Matemática'],
        timer: 5 * 60 * 60,
    },
];

const disciplineToArea: Record<string, AreaId> = {
    'ciencias-humanas': 'humanas',
    'ciencias-natureza': 'natureza',
    linguagens: 'linguagens',
    matematica: 'matematica',
};

const XP_PER_CORRECT = 15;
const COMPLETION_BONUS = 100;
const QUESTIONS_PER_DISCIPLINE = 45;

function useTimer(initialSeconds: number, active: boolean) {
    const [remaining, setRemaining] = useState<number>(initialSeconds);
    const intervalRef = useRef<ReturnType<typeof setInterval> | undefined>(undefined);

    useEffect(() => {
        setRemaining(initialSeconds);
    }, [initialSeconds]);

    useEffect(() => {
        if (!active) return;
        intervalRef.current = setInterval(() => {
            setRemaining((r) => Math.max(0, r - 1));
        }, 1000);
        return () => clearInterval(intervalRef.current);
    }, [active]);

    const hours = Math.floor(remaining / 3600);
    const minutes = Math.floor((remaining % 3600) / 60);
    const seconds = remaining % 60;
    const display = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    const isLow = remaining < 600;

    return { remaining, display, isLow };
}

export default function SimuladoRealPage() {
    const { registerAnswer } = useStudyProgress();
    const [phase, setPhase] = useState<Phase>('setup');
    const [selectedYear, setSelectedYear] = useState(2023);
    const [selectedDay, setSelectedDay] = useState(0);
    const [availableYears, setAvailableYears] = useState<number[]>([]);
    const [questions, setQuestions] = useState<SimQuestion[]>([]);
    const [currentIdx, setCurrentIdx] = useState(0);
    const [answers, setAnswers] = useState<Record<number, string>>({});
    const [marked, setMarked] = useState<Set<number>>(new Set());
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [showConfirmSubmit, setShowConfirmSubmit] = useState(false);
    const [examActive, setExamActive] = useState(false);

    const examDay = EXAM_DAYS[selectedDay];
    const timer = useTimer(examDay.timer, examActive);

    useEffect(() => {
        EnemService.getExams().then((exams) => {
            setAvailableYears(exams.map((e) => e.year).sort((a, b) => b - a));
        });
    }, []);

    const startExam = useCallback(async () => {
        setIsLoading(true);
        setError('');
        try {
            const allQ: SimQuestion[] = [];
            for (const disc of examDay.disciplines) {
                const resp = await EnemService.getQuestions(selectedYear, {
                    discipline: disc,
                    limit: QUESTIONS_PER_DISCIPLINE,
                    offset: 0,
                });
                const filtered = resp.questions
                    .filter((q) => q.language !== 'espanhol')
                    .slice(0, QUESTIONS_PER_DISCIPLINE);

                allQ.push(
                    ...filtered.map((q, i) => ({
                        id: `${selectedYear}-${disc}-${q.index}`,
                        index: allQ.length + i + 1,
                        title: q.title,
                        context: q.context || null,
                        alternatives: q.alternatives.map((a) => ({
                            letter: a.letter,
                            text: a.text,
                            isCorrect: a.isCorrect,
                        })),
                        correctAlternative: q.correctAlternative,
                        discipline: disc,
                        year: selectedYear,
                    })),
                );
            }
            if (allQ.length < 10) {
                throw new Error('Questões insuficientes para este ano/dia. Tente outro ano.');
            }
            allQ.forEach((q, i) => { q.index = i + 1; });
            setQuestions(allQ);
            setAnswers({});
            setMarked(new Set());
            setCurrentIdx(0);
            setPhase('exam');
            setExamActive(true);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Erro ao carregar prova');
        } finally {
            setIsLoading(false);
        }
    }, [selectedYear, examDay]);

    const submitExam = () => {
        setExamActive(false);
        setShowConfirmSubmit(false);
        let correct = 0;
        questions.forEach((q, i) => {
            const userAnswer = answers[i];
            const isCorrect = userAnswer === q.correctAlternative;
            if (isCorrect) correct++;
            const area = disciplineToArea[q.discipline] || 'humanas';
            registerAnswer({ area, isCorrect, xp: isCorrect ? XP_PER_CORRECT : 0 });
        });
        if (Object.keys(answers).length >= questions.length * 0.5) {
            registerAnswer({ area: 'humanas', isCorrect: true, xp: COMPLETION_BONUS });
        }
        void correct;
        setPhase('result');
    };

    useEffect(() => {
        if (timer.remaining === 0 && examActive) {
            submitExam();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [timer.remaining, examActive]);

    const getResults = () => {
        const byDiscipline: Record<string, { total: number; correct: number }> = {};
        let totalCorrect = 0;
        questions.forEach((q, i) => {
            if (!byDiscipline[q.discipline]) {
                byDiscipline[q.discipline] = { total: 0, correct: 0 };
            }
            byDiscipline[q.discipline].total++;
            const isCorrect = answers[i] === q.correctAlternative;
            if (isCorrect) {
                totalCorrect++;
                byDiscipline[q.discipline].correct++;
            }
        });
        const triEstimate = Math.round(300 + (totalCorrect / Math.max(questions.length, 1)) * 700);
        return { totalCorrect, byDiscipline, triEstimate };
    };

    // ═══════ SETUP ═══════
    if (phase === 'setup') {
        return (
            <div className="max-w-2xl mx-auto py-10 px-4">
                <div className="text-center mb-10">
                    <div className="inline-flex items-center gap-2 bg-red-500/20 px-4 py-2 rounded-full mb-4">
                        <BookOpen className="w-4 h-4 text-red-400" />
                        <span className="text-red-400 text-sm font-medium">Simulado Real</span>
                    </div>
                    <h1 className="text-4xl font-black text-white mb-3">Prova Completa ENEM</h1>
                    <p className="text-white/50 text-lg">Simule a experiência real do exame com questões oficiais e cronômetro.</p>
                </div>
                <div className="bg-white/5 backdrop-blur-md rounded-2xl p-8 border border-white/10 space-y-8">
                    <div>
                        <label className="block text-sm font-medium text-white/70 mb-3">Ano da Prova</label>
                        <div className="grid grid-cols-5 gap-2">
                            {availableYears.map((year) => (
                                <button key={year} onClick={() => setSelectedYear(year)}
                                    className={`py-2 rounded-lg text-sm font-medium transition-all ${selectedYear === year ? 'bg-purple text-white' : 'bg-white/5 text-white/50 hover:bg-white/10'}`}>
                                    {year}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-white/70 mb-3">Dia da Prova</label>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {EXAM_DAYS.map((day, i) => (
                                <button key={i} onClick={() => setSelectedDay(i)}
                                    className={`p-4 rounded-xl text-left transition-all border ${selectedDay === i ? 'bg-purple/20 border-purple/50' : 'bg-white/5 border-white/5 hover:bg-white/10'}`}>
                                    <p className="font-semibold text-white text-sm">{day.label}</p>
                                    <p className="text-xs text-white/40 mt-1">{day.disciplineLabels.join(' + ')}</p>
                                </button>
                            ))}
                        </div>
                    </div>
                    {error && (
                        <div className="flex items-center gap-2 bg-red-500/20 text-red-400 p-3 rounded-xl text-sm">
                            <AlertTriangle className="w-4 h-4" />{error}
                        </div>
                    )}
                    <button onClick={startExam} disabled={isLoading}
                        className="w-full py-4 rounded-xl bg-gradient-to-r from-red-500 to-orange-500 text-white font-bold text-lg hover:scale-[1.02] transition-transform disabled:opacity-50">
                        {isLoading ? 'Carregando questões...' : 'Iniciar Simulado'}
                    </button>
                    <p className="text-center text-xs text-white/30">⚠️ O cronômetro começará assim que iniciar.</p>
                </div>
            </div>
        );
    }

    // ═══════ EXAM ═══════
    if (phase === 'exam') {
        const q = questions[currentIdx];
        const answeredCount = Object.keys(answers).length;
        return (
            <div className="max-w-4xl mx-auto py-4 px-4">
                <div className="flex items-center justify-between mb-4 bg-white/5 rounded-xl p-3 border border-white/10">
                    <div className="flex items-center gap-3">
                        <BookOpen className="w-5 h-5 text-purple-light" />
                        <span className="text-white text-sm font-medium">ENEM {selectedYear} — {examDay.label}</span>
                    </div>
                    <div className={`flex items-center gap-2 px-3 py-1 rounded-lg ${timer.isLow ? 'bg-red-500/20 text-red-400 animate-pulse' : 'bg-white/10 text-white/70'}`}>
                        <Clock className="w-4 h-4" />
                        <span className="font-mono font-bold">{timer.display}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-xs text-white/40">{answeredCount}/{questions.length} respondidas</span>
                        <button onClick={() => setShowConfirmSubmit(true)}
                            className="px-4 py-1.5 rounded-lg bg-red-500/20 text-red-400 text-sm font-medium hover:bg-red-500/30 transition">
                            Entregar
                        </button>
                    </div>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-4">
                    <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-sm text-white/50">Questão {q.index} de {questions.length}</span>
                            <button onClick={() => setMarked((m) => { const next = new Set(m); next.has(currentIdx) ? next.delete(currentIdx) : next.add(currentIdx); return next; })}
                                className={`flex items-center gap-1 text-xs px-3 py-1 rounded-lg transition ${marked.has(currentIdx) ? 'bg-yellow-500/20 text-yellow-400' : 'bg-white/5 text-white/40 hover:text-white/60'}`}>
                                <Bookmark className="w-3 h-3" />
                                {marked.has(currentIdx) ? 'Marcada' : 'Marcar'}
                            </button>
                        </div>
                        {q.context && (
                            <div className="mb-5 text-white/70 text-sm leading-relaxed max-h-60 overflow-y-auto pr-2 whitespace-pre-line border-l-2 border-purple/30 pl-4">
                                {q.context.length > 1200 ? q.context.slice(0, 1200) + '...' : q.context}
                            </div>
                        )}
                        <div className="space-y-2">
                            {q.alternatives.map((alt) => (
                                <button key={alt.letter}
                                    onClick={() => setAnswers((a) => ({ ...a, [currentIdx]: alt.letter }))}
                                    className={`w-full text-left p-3 rounded-xl border transition-all flex items-start gap-3 ${answers[currentIdx] === alt.letter ? 'bg-purple/20 border-purple/50' : 'bg-white/5 border-white/5 hover:bg-white/10'}`}>
                                    <span className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 ${answers[currentIdx] === alt.letter ? 'bg-purple text-white' : 'bg-white/10 text-white/50'}`}>
                                        {alt.letter}
                                    </span>
                                    <span className="text-white/80 text-sm pt-0.5">{alt.text}</span>
                                </button>
                            ))}
                        </div>
                        <div className="flex items-center justify-between mt-6">
                            <button onClick={() => setCurrentIdx((i) => Math.max(0, i - 1))} disabled={currentIdx === 0}
                                className="flex items-center gap-1 px-4 py-2 rounded-lg bg-white/5 text-white/60 hover:bg-white/10 disabled:opacity-30 transition">
                                <ChevronLeft className="w-4 h-4" /> Anterior
                            </button>
                            <button onClick={() => setCurrentIdx((i) => Math.min(questions.length - 1, i + 1))} disabled={currentIdx === questions.length - 1}
                                className="flex items-center gap-1 px-4 py-2 rounded-lg bg-white/5 text-white/60 hover:bg-white/10 disabled:opacity-30 transition">
                                Próxima <ChevronRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                    <div className="bg-white/5 rounded-2xl p-4 border border-white/10 h-fit">
                        <p className="text-xs text-white/40 mb-3 uppercase tracking-wider">Navegação</p>
                        <div className="grid grid-cols-5 gap-1.5">
                            {questions.map((_, i) => (
                                <button key={i} onClick={() => setCurrentIdx(i)}
                                    className={`w-full aspect-square rounded-lg text-xs font-bold transition-all ${currentIdx === i ? 'bg-purple text-white ring-2 ring-purple/50' : marked.has(i) ? 'bg-yellow-500/30 text-yellow-300' : answers[i] ? 'bg-green-500/20 text-green-400' : 'bg-white/5 text-white/30 hover:bg-white/10'}`}>
                                    {i + 1}
                                </button>
                            ))}
                        </div>
                        <div className="mt-4 space-y-1 text-xs text-white/40">
                            <div className="flex items-center gap-2"><div className="w-3 h-3 rounded bg-green-500/20" /> Respondida</div>
                            <div className="flex items-center gap-2"><div className="w-3 h-3 rounded bg-yellow-500/30" /> Marcada para revisão</div>
                            <div className="flex items-center gap-2"><div className="w-3 h-3 rounded bg-white/5" /> Não respondida</div>
                        </div>
                    </div>
                </div>
                <AnimatePresence>
                    {showConfirmSubmit && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="fixed inset-0 z-[100] bg-black/70 flex items-center justify-center p-4"
                            onClick={() => setShowConfirmSubmit(false)}>
                            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}
                                onClick={(e) => e.stopPropagation()}
                                className="bg-dark-surface rounded-2xl p-8 max-w-md w-full border border-white/10 text-center space-y-4">
                                <AlertTriangle className="w-12 h-12 text-yellow-400 mx-auto" />
                                <h3 className="text-xl font-bold text-white">Entregar prova?</h3>
                                <p className="text-white/60 text-sm">
                                    Você respondeu {answeredCount} de {questions.length} questões.
                                    {questions.length - answeredCount > 0 && (
                                        <span className="text-yellow-400"> Faltam {questions.length - answeredCount} sem resposta.</span>
                                    )}
                                </p>
                                <div className="flex gap-3">
                                    <button onClick={() => setShowConfirmSubmit(false)}
                                        className="flex-1 py-3 rounded-xl bg-white/10 text-white font-medium hover:bg-white/15 transition">
                                        Continuar
                                    </button>
                                    <button onClick={submitExam}
                                        className="flex-1 py-3 rounded-xl bg-red-500 text-white font-bold hover:bg-red-600 transition">
                                        Entregar
                                    </button>
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        );
    }

    // ═══════ RESULT ═══════
    if (phase === 'result') {
        const { totalCorrect, byDiscipline, triEstimate } = getResults();
        const totalXp = totalCorrect * XP_PER_CORRECT + (Object.keys(answers).length >= questions.length * 0.5 ? COMPLETION_BONUS : 0);
        const percentage = Math.round((totalCorrect / questions.length) * 100);
        return (
            <div className="max-w-2xl mx-auto py-10 px-4">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
                    <div className="text-center">
                        <h1 className="text-4xl font-black text-white mb-2">Resultado do Simulado</h1>
                        <p className="text-white/50">ENEM {selectedYear} — {examDay.label}</p>
                    </div>
                    <div className="bg-white/5 rounded-2xl p-8 border border-white/10 text-center">
                        <BarChart3 className="w-8 h-8 text-purple-light mx-auto mb-3" />
                        <p className="text-sm text-white/50 mb-1">Nota Estimada (TRI)</p>
                        <p className="text-6xl font-black bg-clip-text text-transparent bg-gradient-to-r from-purple to-pink-500">{triEstimate}</p>
                        <p className="text-white/40 text-xs mt-2">Escala: 300-1000</p>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                        <div className="bg-white/5 rounded-xl p-4 text-center border border-white/10">
                            <p className="text-3xl font-bold text-green-400">{totalCorrect}</p>
                            <p className="text-xs text-white/50">Acertos</p>
                        </div>
                        <div className="bg-white/5 rounded-xl p-4 text-center border border-white/10">
                            <p className="text-3xl font-bold text-red-400">{questions.length - totalCorrect}</p>
                            <p className="text-xs text-white/50">Erros</p>
                        </div>
                        <div className="bg-white/5 rounded-xl p-4 text-center border border-white/10">
                            <p className="text-3xl font-bold text-purple-light">+{totalXp}</p>
                            <p className="text-xs text-white/50">XP ganho</p>
                        </div>
                    </div>
                    <div className="bg-white/5 rounded-2xl p-6 border border-white/10 space-y-4">
                        <h3 className="font-bold text-white text-sm uppercase tracking-wider">Desempenho por Área</h3>
                        {Object.entries(byDiscipline).map(([disc, stats]) => {
                            const pct = Math.round((stats.correct / stats.total) * 100);
                            const label = disc.replace('ciencias-', 'Ciências ').replace('linguagens', 'Linguagens').replace('matematica', 'Matemática');
                            return (
                                <div key={disc}>
                                    <div className="flex justify-between text-sm mb-1">
                                        <span className="text-white/70">{label}</span>
                                        <span className="text-white/50">{stats.correct}/{stats.total} ({pct}%)</span>
                                    </div>
                                    <div className="w-full h-2.5 bg-white/10 rounded-full overflow-hidden">
                                        <motion.div
                                            className={`h-full rounded-full ${pct >= 70 ? 'bg-green-500' : pct >= 50 ? 'bg-yellow-500' : 'bg-red-500'}`}
                                            initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 1, delay: 0.3 }}
                                        />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                    <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                        <div className="flex justify-between text-sm text-white/50 mb-2">
                            <span>Aproveitamento Geral</span><span>{percentage}%</span>
                        </div>
                        <div className="w-full h-4 bg-white/10 rounded-full overflow-hidden">
                            <motion.div
                                className={`h-full rounded-full ${percentage >= 70 ? 'bg-gradient-to-r from-green-500 to-emerald-400' : percentage >= 50 ? 'bg-gradient-to-r from-yellow-500 to-amber-400' : 'bg-gradient-to-r from-red-500 to-rose-400'}`}
                                initial={{ width: 0 }} animate={{ width: `${percentage}%` }} transition={{ duration: 1.5, delay: 0.5 }}
                            />
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <button onClick={() => setPhase('review')}
                            className="flex-1 flex items-center justify-center gap-2 py-4 rounded-xl bg-white/10 text-white font-medium hover:bg-white/15 transition">
                            <CheckCircle2 className="w-4 h-4" /> Revisar Questões
                        </button>
                        <button onClick={() => { setPhase('setup'); setExamActive(false); }}
                            className="flex-1 flex items-center justify-center gap-2 py-4 rounded-xl bg-gradient-to-r from-purple to-pink-500 text-white font-bold hover:scale-[1.02] transition-transform">
                            Novo Simulado <ArrowRight className="w-4 h-4" />
                        </button>
                    </div>
                </motion.div>
            </div>
        );
    }

    // ═══════ REVIEW ═══════
    if (phase === 'review') {
        const q = questions[currentIdx];
        const userAnswer = answers[currentIdx];
        return (
            <div className="max-w-3xl mx-auto py-6 px-4">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-white">Revisão — Questão {currentIdx + 1}/{questions.length}</h2>
                    <button onClick={() => setPhase('result')}
                        className="px-4 py-2 rounded-lg bg-white/10 text-white/60 text-sm hover:bg-white/15 transition">
                        Voltar ao resultado
                    </button>
                </div>
                <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                    {q.context && (
                        <div className="mb-4 text-white/70 text-sm leading-relaxed whitespace-pre-line border-l-2 border-purple/30 pl-4 max-h-48 overflow-y-auto">
                            {q.context.length > 1200 ? q.context.slice(0, 1200) + '...' : q.context}
                        </div>
                    )}
                    <div className="space-y-2">
                        {q.alternatives.map((alt) => {
                            let classes = 'bg-white/5 border-white/5';
                            let icon = null;
                            if (alt.isCorrect) {
                                classes = 'bg-green-500/20 border-green-500/50';
                                icon = <CheckCircle2 className="w-4 h-4 text-green-400 shrink-0" />;
                            } else if (alt.letter === userAnswer && !alt.isCorrect) {
                                classes = 'bg-red-500/20 border-red-500/50';
                                icon = <XCircle className="w-4 h-4 text-red-400 shrink-0" />;
                            }
                            return (
                                <div key={alt.letter} className={`p-3 rounded-xl border flex items-start gap-3 ${classes}`}>
                                    <span className="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center text-xs font-bold text-white/50 shrink-0">
                                        {alt.letter}
                                    </span>
                                    <span className="text-white/80 text-sm flex-1 pt-0.5">{alt.text}</span>
                                    {icon}
                                </div>
                            );
                        })}
                    </div>
                    <div className="flex items-center justify-between mt-6">
                        <button onClick={() => setCurrentIdx((i) => Math.max(0, i - 1))} disabled={currentIdx === 0}
                            className="flex items-center gap-1 px-4 py-2 rounded-lg bg-white/5 text-white/60 hover:bg-white/10 disabled:opacity-30 transition">
                            <ChevronLeft className="w-4 h-4" /> Anterior
                        </button>
                        <button onClick={() => setCurrentIdx((i) => Math.min(questions.length - 1, i + 1))} disabled={currentIdx === questions.length - 1}
                            className="flex items-center gap-1 px-4 py-2 rounded-lg bg-white/5 text-white/60 hover:bg-white/10 disabled:opacity-30 transition">
                            Próxima <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return null;
}
