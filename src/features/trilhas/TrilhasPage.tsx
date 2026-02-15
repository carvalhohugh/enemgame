import { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ChevronRight, ChevronLeft, BookOpen, Calculator, Globe, Atom,
    CheckCircle2, XCircle, ArrowRight, Lock, Unlock,
    GraduationCap, Zap, RotateCcw, ExternalLink, ChevronDown,
} from 'lucide-react';
import { BNCC_DATA, type BnccArea, type BnccCompetencia, type BnccHabilidade, type AnoEscolar } from '@/data/bnccData';
import { getQuestionsByHabilidade, getQuestionsByArea } from '@/data/vestibularQuestions';
import { EnemService } from '@/services/EnemService';
import { fetchTopicContent, getWikipediaUrl } from '@/services/WikipediaService';
import { useStudyProgress, type AreaId } from '@/context/StudyProgressContext';

/* ─── Types ─── */
type Phase = 'areas' | 'competencias' | 'habilidades' | 'estudo' | 'quiz';

interface QuizQuestion {
    id: string;
    question: string;
    alternatives: { letter: string; text: string }[];
    correctAnswer: string;
    explanation: string;
    source: string;
}

/* ─── Icons map ─── */
const AREA_ICONS: Record<string, React.ElementType> = {
    Calculator, Globe, Atom, BookOpen,
};

function getIcon(name: string): React.ElementType {
    return AREA_ICONS[name] || BookOpen;
}

/* ─── Saved progress ─── */
function getCompletedHabs(): Set<string> {
    try {
        const data = localStorage.getItem('bncc_completed');
        return data ? new Set(JSON.parse(data)) : new Set();
    } catch { return new Set(); }
}

function saveCompletedHab(habId: string) {
    const set = getCompletedHabs();
    set.add(habId);
    localStorage.setItem('bncc_completed', JSON.stringify([...set]));
}

/* ═══════════════════════════════════════════════
   TOPIC CARD — loads Wikipedia content on expand
   ═══════════════════════════════════════════════ */
function TopicCard({ topico, index, accentColor }: { topico: string; index: number; accentColor: string }) {
    const [expanded, setExpanded] = useState(false);
    const [content, setContent] = useState<string | null>(null);
    const [wikiTitle, setWikiTitle] = useState<string | null>(null);
    const [wikiUrl, setWikiUrl] = useState<string>('');
    const [isLoading, setIsLoading] = useState(false);
    const [hasError, setHasError] = useState(false);

    useEffect(() => {
        if (!expanded || content !== null) return;

        let cancelled = false;
        setIsLoading(true);
        setHasError(false);

        fetchTopicContent(topico)
            .then((result) => {
                if (cancelled) return;
                if (result) {
                    setContent(result.extract);
                    setWikiTitle(result.title);
                    setWikiUrl(result.url);
                } else {
                    setContent('');
                    setWikiUrl(getWikipediaUrl(topico));
                    setHasError(true);
                }
            })
            .catch(() => {
                if (!cancelled) {
                    setContent('');
                    setHasError(true);
                    setWikiUrl(getWikipediaUrl(topico));
                }
            })
            .finally(() => { if (!cancelled) setIsLoading(false); });

        return () => { cancelled = true; };
    }, [expanded, topico, content]);

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.08 }}
            className="rounded-xl bg-white/5 border border-white/5 overflow-hidden"
        >
            {/* Header — always visible */}
            <button
                onClick={() => setExpanded(!expanded)}
                className="w-full flex items-center gap-3 p-4 hover:bg-white/5 transition text-left"
            >
                <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold shrink-0"
                    style={{ backgroundColor: accentColor + '20', color: accentColor }}
                >
                    {index + 1}
                </div>
                <span className="text-white flex-1">{topico}</span>
                <motion.div
                    animate={{ rotate: expanded ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                >
                    <ChevronDown className="w-4 h-4 text-white/30" />
                </motion.div>
            </button>

            {/* Content — Wikipedia extract */}
            <AnimatePresence>
                {expanded && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                    >
                        <div className="px-4 pb-4 pt-0 border-t border-white/5">
                            {isLoading && (
                                <div className="space-y-2 pt-3 animate-pulse">
                                    <div className="h-3 bg-white/10 rounded w-full" />
                                    <div className="h-3 bg-white/10 rounded w-5/6" />
                                    <div className="h-3 bg-white/10 rounded w-4/6" />
                                    <div className="h-3 bg-white/10 rounded w-full" />
                                    <div className="h-3 bg-white/10 rounded w-3/6" />
                                </div>
                            )}

                            {!isLoading && hasError && (
                                <div className="pt-3">
                                    <p className="text-white/40 text-sm mb-2">
                                        Não foi possível carregar o conteúdo automaticamente.
                                    </p>
                                    <a
                                        href={wikiUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-lg bg-white/10 text-white/70 hover:text-white hover:bg-white/15 transition"
                                    >
                                        <ExternalLink className="w-3.5 h-3.5" />
                                        Pesquisar na Wikipedia
                                    </a>
                                </div>
                            )}

                            {!isLoading && !hasError && content && (
                                <div className="pt-3 space-y-3">
                                    {wikiTitle && (
                                        <h4 className="text-white font-semibold text-sm flex items-center gap-2">
                                            📖 {wikiTitle}
                                        </h4>
                                    )}
                                    <p className="text-white/60 text-sm leading-relaxed whitespace-pre-line">
                                        {content.length > 2000 ? content.slice(0, 2000) + '...' : content}
                                    </p>
                                    <a
                                        href={wikiUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-white/10 text-white/50 hover:text-white hover:bg-white/15 transition"
                                    >
                                        <ExternalLink className="w-3 h-3" />
                                        Ler artigo completo na Wikipedia
                                    </a>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}

/* ═══════════════════════════════════════════════
   COMPONENT
   ═══════════════════════════════════════════════ */
export default function TrilhasPage() {
    const { registerAnswer } = useStudyProgress();
    const [phase, setPhase] = useState<Phase>('areas');
    const [selectedArea, setSelectedArea] = useState<BnccArea | null>(null);
    const [selectedComp, setSelectedComp] = useState<BnccCompetencia | null>(null);
    const [selectedHab, setSelectedHab] = useState<BnccHabilidade | null>(null);
    const [selectedYear, setSelectedYear] = useState<AnoEscolar | 'todos'>('todos'); // Novo estado
    const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([]);
    const [quizIdx, setQuizIdx] = useState(0);
    const [quizAnswer, setQuizAnswer] = useState<string | null>(null);
    const [quizScore, setQuizScore] = useState(0);
    const [quizFinished, setQuizFinished] = useState(false);
    const [isLoadingQuiz, setIsLoadingQuiz] = useState(false);
    const [completed, setCompleted] = useState<Set<string>>(getCompletedHabs());

    /* ─── Navigation ─── */
    const goToArea = (area: BnccArea) => { setSelectedArea(area); setPhase('competencias'); };
    const goToComp = (comp: BnccCompetencia) => { setSelectedComp(comp); setPhase('habilidades'); };
    const goToHab = (hab: BnccHabilidade) => { setSelectedHab(hab); setPhase('estudo'); };

    const goBack = () => {
        if (phase === 'quiz' || phase === 'estudo') setPhase('habilidades');
        else if (phase === 'habilidades') setPhase('competencias');
        else if (phase === 'competencias') setPhase('areas');
    };

    /* ─── Load quiz questions for a habilidade ─── */
    const startQuiz = useCallback(async (hab: BnccHabilidade) => {
        setIsLoadingQuiz(true);
        setQuizIdx(0);
        setQuizAnswer(null);
        setQuizScore(0);
        setQuizFinished(false);

        const questions: QuizQuestion[] = [];

        // 1) Questões do banco de vestibulares local
        const localQs = getQuestionsByHabilidade(hab.id);
        for (const q of localQs) {
            questions.push({
                id: q.id,
                question: q.question,
                alternatives: q.alternatives,
                correctAnswer: q.correctAnswer,
                explanation: q.explanation,
                source: q.source,
            });
        }

        // 2) Se não tiver 5, buscar do ENEM API por área
        if (questions.length < 5 && selectedArea) {
            try {
                const areaQuestions = getQuestionsByArea(selectedArea.id);
                const remaining = areaQuestions
                    .filter((q) => !questions.some((qz) => qz.id === q.id))
                    .sort(() => Math.random() - 0.5)
                    .slice(0, 5 - questions.length);

                for (const q of remaining) {
                    questions.push({
                        id: q.id,
                        question: q.question,
                        alternatives: q.alternatives,
                        correctAnswer: q.correctAnswer,
                        explanation: q.explanation,
                        source: q.source,
                    });
                }
            } catch { /* ignore */ }
        }

        // 3) Se AINDA não tiver 5, buscar da API enem.dev
        if (questions.length < 5 && selectedArea) {
            try {
                const disciplineMap: Record<AreaId, string> = {
                    matematica: 'matematica',
                    humanas: 'ciencias-humanas',
                    natureza: 'ciencias-natureza',
                    linguagens: 'linguagens',
                    redacao: 'linguagens',
                };
                const disc = disciplineMap[selectedArea.id];
                const years = [2023, 2022, 2021, 2020, 2019];
                const yr = years[Math.floor(Math.random() * years.length)];

                const resp = await EnemService.getQuestions(yr, {
                    discipline: disc,
                    limit: 10,
                    offset: Math.floor(Math.random() * 30),
                });

                const filtered = resp.questions
                    .filter((q) => q.language !== 'espanhol')
                    .sort(() => Math.random() - 0.5)
                    .slice(0, 5 - questions.length);

                for (const q of filtered) {
                    questions.push({
                        id: `enem-${q.year}-${q.index}`,
                        question: (q.context || '') + '\n\n' + q.title,
                        alternatives: q.alternatives.map((a) => ({ letter: a.letter, text: a.text })),
                        correctAnswer: q.correctAlternative,
                        explanation: `Gabarito: alternativa ${q.correctAlternative}. Questão do ENEM ${q.year}.`,
                        source: `ENEM ${q.year}`,
                    });
                }
            } catch { /* ignore */ }
        }

        setQuizQuestions(questions.slice(0, 5));
        setPhase('quiz');
        setIsLoadingQuiz(false);
    }, [selectedArea]);

    const handleQuizAnswer = (letter: string) => {
        if (quizAnswer) return;
        setQuizAnswer(letter);
        const isCorrect = letter === quizQuestions[quizIdx].correctAnswer;
        if (isCorrect) setQuizScore((s) => s + 1);

        if (selectedArea) {
            registerAnswer({
                area: selectedArea.id,
                isCorrect,
                xp: isCorrect ? 20 : 5,
            });
        }
    };

    const goNextQuiz = () => {
        if (quizIdx < quizQuestions.length - 1) {
            setQuizIdx((i) => i + 1);
            setQuizAnswer(null);
        } else {
            setQuizFinished(true);
            if (selectedHab && quizScore >= 3) {
                saveCompletedHab(selectedHab.id);
                setCompleted(getCompletedHabs());
            }
        }
    };

    /* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
       RENDER: SELEÇÃO DE ÁREA
       ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
    if (phase === 'areas') {
        return (
            <div className="max-w-5xl mx-auto py-8 px-4">
                <div className="text-center mb-10">
                    <div className="inline-flex items-center gap-2 bg-purple/20 px-4 py-2 rounded-full border border-purple/30 mb-4">
                        <GraduationCap className="w-4 h-4 text-purple-light" />
                        <span className="text-sm text-purple-light font-medium">Trilhas BNCC</span>
                    </div>
                    <h1 className="text-4xl font-bold text-white mb-3">Trilhas de Conhecimento</h1>
                    <p className="text-white/50 text-lg">Estude por competência e habilidade da BNCC. Cada tema tem 5 questões de aferição.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {BNCC_DATA.map((area) => {
                        const Icon = getIcon(area.icone);
                        const totalHabs = area.competencias.reduce((s, c) => s + c.habilidades.length, 0);
                        const completedHabs = area.competencias.reduce(
                            (s, c) => s + c.habilidades.filter((h) => completed.has(h.id)).length, 0
                        );
                        const pct = totalHabs > 0 ? Math.round((completedHabs / totalHabs) * 100) : 0;

                        return (
                            <motion.button
                                key={area.id}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => goToArea(area)}
                                className="text-left p-6 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 hover:border-white/20 transition-all group"
                            >
                                <div className="flex items-start gap-4">
                                    <div
                                        className="w-14 h-14 rounded-xl flex items-center justify-center"
                                        style={{ backgroundColor: area.cor + '20' }}
                                    >
                                        <Icon className="w-7 h-7" style={{ color: area.cor }} />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-lg font-bold text-white group-hover:text-white/90">{area.titulo}</h3>
                                        <p className="text-sm text-white/40 mt-1">
                                            {area.competencias.length} competências • {totalHabs} habilidades
                                        </p>
                                        <div className="mt-3">
                                            <div className="flex justify-between text-xs text-white/40 mb-1">
                                                <span>{completedHabs}/{totalHabs} concluídas</span>
                                                <span>{pct}%</span>
                                            </div>
                                            <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full rounded-full transition-all"
                                                    style={{ width: `${pct}%`, backgroundColor: area.cor }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <ChevronRight className="w-5 h-5 text-white/30 mt-1 group-hover:text-white/60 transition" />
                                </div>
                            </motion.button>
                        );
                    })}
                </div>
            </div>
        );
    }

    /* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
       RENDER: COMPETÊNCIAS
       ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
    /* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
       RENDER: COMPETÊNCIAS
       ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
    if (phase === 'competencias' && selectedArea) {
        // Filtrar competências que têm habilidades do ano selecionado
        const filteredCompetencias = selectedArea.competencias.filter(comp => {
            if (selectedYear === 'todos') return true;
            return comp.habilidades.some(h => h.ano === selectedYear);
        });

        return (
            <div className="max-w-4xl mx-auto py-8 px-4">
                <button onClick={goBack} className="flex items-center gap-2 text-white/50 hover:text-white mb-6 transition">
                    <ChevronLeft className="w-4 h-4" /> Voltar
                </button>

                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                        {(() => { const Icon = getIcon(selectedArea.icone); return <Icon className="w-8 h-8" style={{ color: selectedArea.cor }} />; })()}
                        <h2 className="text-3xl font-bold text-white">{selectedArea.titulo}</h2>
                    </div>
                </div>

                {/* Seletor de Ano */}
                <div className="flex gap-2 mb-8 bg-white/5 p-1 rounded-xl w-fit">
                    {(['todos', 1, 2, 3] as const).map((ano) => (
                        <button
                            key={ano}
                            onClick={() => setSelectedYear(ano)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${selectedYear === ano
                                ? 'bg-white/10 text-white shadow-sm'
                                : 'text-white/40 hover:text-white/60'
                                }`}
                        >
                            {ano === 'todos' ? 'Todos os Anos' : `${ano}º Ano`}
                        </button>
                    ))}
                </div>

                <div className="space-y-4">
                    {filteredCompetencias.length === 0 ? (
                        <div className="text-center py-10 text-white/40">
                            Nenhuma competência encontrada para o {selectedYear}º ano nesta área.
                        </div>
                    ) : (
                        filteredCompetencias.map((comp, i) => {
                            // Contar apenas habilidades do ano selecionado (ou todas)
                            const relevantHabs = selectedYear === 'todos'
                                ? comp.habilidades
                                : comp.habilidades.filter(h => h.ano === selectedYear);

                            const completedCount = relevantHabs.filter((h) => completed.has(h.id)).length;
                            const total = relevantHabs.length;

                            if (total === 0) return null;

                            return (
                                <motion.button
                                    key={comp.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                    onClick={() => goToComp(comp)}
                                    className="w-full text-left p-5 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 transition-all group"
                                >
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <div className="flex items-center gap-2 mb-1">
                                                <span
                                                    className="text-xs font-bold px-2 py-0.5 rounded"
                                                    style={{ backgroundColor: selectedArea.cor + '30', color: selectedArea.cor }}
                                                >
                                                    {comp.id}
                                                </span>
                                                <h3 className="text-white font-semibold">{comp.titulo}</h3>
                                            </div>
                                            <p className="text-sm text-white/40 mt-1">{comp.descricao}</p>
                                            <p className="text-xs text-white/30 mt-2">
                                                {total} habilidade{total !== 1 ? 's' : ''} {selectedYear !== 'todos' ? `do ${selectedYear}º ano` : ''} • {completedCount} concluída{completedCount !== 1 ? 's' : ''}
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            {completedCount === total && total > 0 && (
                                                <CheckCircle2 className="w-5 h-5 text-green-400" />
                                            )}
                                            <ChevronRight className="w-5 h-5 text-white/30 group-hover:text-white/60" />
                                        </div>
                                    </div>
                                </motion.button>
                            );
                        })
                    )}
                </div>
            </div>
        );
    }

    /* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
       RENDER: HABILIDADES
       ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
    /* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
       RENDER: HABILIDADES
       ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
    if (phase === 'habilidades' && selectedComp && selectedArea) {
        // Filtrar habilidades pelo ano selecionado
        const filteredHab = selectedYear === 'todos'
            ? selectedComp.habilidades
            : selectedComp.habilidades.filter(h => h.ano === selectedYear);

        return (
            <div className="max-w-4xl mx-auto py-8 px-4">
                <button onClick={goBack} className="flex items-center gap-2 text-white/50 hover:text-white mb-6 transition">
                    <ChevronLeft className="w-4 h-4" /> Voltar
                </button>

                <div className="mb-8">
                    <span className="text-xs font-bold px-2 py-0.5 rounded mb-2 inline-block"
                        style={{ backgroundColor: selectedArea.cor + '30', color: selectedArea.cor }}>
                        {selectedComp.id}
                    </span>
                    <h2 className="text-2xl font-bold text-white">{selectedComp.titulo}</h2>
                    <p className="text-white/50 mt-1">{selectedComp.descricao}</p>
                    {selectedYear !== 'todos' && (
                        <p className="text-sm text-white/40 mt-2">
                            Mostrando habilidades do <span className="text-white">{selectedYear}º Ano</span>
                        </p>
                    )}
                </div>

                <div className="space-y-3">
                    {filteredHab.length === 0 ? (
                        <div className="text-center py-10 text-white/40 bg-white/5 rounded-xl border border-white/5">
                            Nenhuma habilidade encontrada para o {selectedYear}º ano nesta competência.
                        </div>
                    ) : (
                        filteredHab.map((hab, i) => {
                            const isDone = completed.has(hab.id);
                            return (
                                <motion.div
                                    key={hab.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                    className="p-4 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 transition-all"
                                >
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-1">
                                                {isDone
                                                    ? <Unlock className="w-4 h-4 text-green-400" />
                                                    : <Lock className="w-4 h-4 text-white/30" />
                                                }
                                                <span className="text-xs text-white/30 font-mono">{hab.id}</span>
                                                <span className="text-xs bg-white/10 px-2 py-0.5 rounded text-white/60">
                                                    {hab.ano}º Ano
                                                </span>
                                                {isDone && <span className="text-xs bg-green-500/20 text-green-400 px-2 py-0.5 rounded">Concluída</span>}
                                            </div>
                                            <h3 className="text-white font-semibold">{hab.titulo}</h3>
                                            <p className="text-sm text-white/40 mt-1">{hab.descricao}</p>
                                            <div className="flex flex-wrap gap-2 mt-2">
                                                {hab.topicos.map((t) => (
                                                    <span key={t} className="text-xs px-2 py-1 bg-white/5 rounded text-white/50">{t}</span>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="flex gap-2 shrink-0">
                                            <button
                                                onClick={() => goToHab(hab)}
                                                className="px-4 py-2 text-sm rounded-lg bg-white/5 text-white/60 hover:bg-white/10 transition"
                                            >
                                                📖 Estudar
                                            </button>
                                            <button
                                                onClick={() => { setSelectedHab(hab); void startQuiz(hab); }}
                                                className="px-4 py-2 text-sm rounded-lg text-white font-medium transition"
                                                style={{ backgroundColor: selectedArea.cor }}
                                            >
                                                <Zap className="w-3.5 h-3.5 inline mr-1" />
                                                Quiz
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })
                    )}
                </div>
            </div>
        );
    }

    /* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
       RENDER: ESTUDO (conteúdo do tema com Wikipedia)
       ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
    if (phase === 'estudo' && selectedHab && selectedArea) {
        return (
            <div className="max-w-3xl mx-auto py-8 px-4">
                <button onClick={goBack} className="flex items-center gap-2 text-white/50 hover:text-white mb-6 transition">
                    <ChevronLeft className="w-4 h-4" /> Voltar
                </button>

                <div className="bg-white/5 rounded-2xl p-8 border border-white/10 mb-6">
                    <span className="text-xs font-mono text-white/30">{selectedHab.id}</span>
                    <h2 className="text-2xl font-bold text-white mt-1">{selectedHab.titulo}</h2>
                    <p className="text-white/50 mt-2">{selectedHab.descricao}</p>

                    <div className="mt-6 space-y-4">
                        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                            📚 Tópicos para Estudo
                            <span className="text-xs text-white/30 font-normal">(clique para expandir)</span>
                        </h3>

                        {selectedHab.topicos.map((topico, i) => (
                            <TopicCard
                                key={topico}
                                topico={topico}
                                index={i}
                                accentColor={selectedArea.cor}
                            />
                        ))}
                    </div>

                    {/* Fonte */}
                    <div className="mt-6 pt-4 border-t border-white/5">
                        <p className="text-xs text-white/30 flex items-center gap-1">
                            📖 Conteúdo fornecido pela <a href="https://pt.wikipedia.org" target="_blank" rel="noopener noreferrer" className="text-white/50 underline hover:text-white/70 transition">Wikipedia PT-BR</a> — enciclopédia livre e confiável.
                        </p>
                    </div>
                </div>

                <button
                    onClick={() => void startQuiz(selectedHab)}
                    disabled={isLoadingQuiz}
                    className="w-full py-4 rounded-xl text-white font-bold text-lg flex items-center justify-center gap-3 hover:scale-[1.02] transition-transform"
                    style={{ backgroundColor: selectedArea.cor }}
                >
                    {isLoadingQuiz ? (
                        <><RotateCcw className="w-5 h-5 animate-spin" /> Carregando questões...</>
                    ) : (
                        <><Zap className="w-5 h-5" /> Iniciar Quiz de Aferição (5 questões)</>
                    )}
                </button>
            </div>
        );
    }

    /* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
       RENDER: QUIZ
       ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
    if (phase === 'quiz' && selectedHab && selectedArea) {
        if (isLoadingQuiz) {
            return (
                <div className="flex flex-col items-center justify-center py-20 gap-4">
                    <RotateCcw className="w-10 h-10 animate-spin" style={{ color: selectedArea.cor }} />
                    <p className="text-white/60">Carregando questões de aferição...</p>
                </div>
            );
        }

        if (quizQuestions.length === 0) {
            return (
                <div className="max-w-xl mx-auto py-20 text-center">
                    <p className="text-white/60 mb-4">Não há questões disponíveis para esta habilidade ainda.</p>
                    <button onClick={goBack} className="px-6 py-3 rounded-xl bg-white/10 text-white hover:bg-white/20 transition">
                        Voltar
                    </button>
                </div>
            );
        }

        // Quiz finished
        if (quizFinished) {
            const pct = Math.round((quizScore / quizQuestions.length) * 100);
            const passed = quizScore >= 3;

            return (
                <div className="max-w-xl mx-auto py-10 px-4">
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="bg-white/5 backdrop-blur-md rounded-2xl p-8 border border-white/10 text-center space-y-6"
                    >
                        <div className="text-5xl">{passed ? '🎉' : '📚'}</div>
                        <h2 className="text-2xl font-bold text-white">
                            {passed ? 'Parabéns! Habilidade Concluída!' : 'Continue Estudando'}
                        </h2>
                        <p className="text-white/50">
                            {selectedHab.titulo} — {quizScore}/{quizQuestions.length} acertos ({pct}%)
                        </p>

                        {passed ? (
                            <div className="bg-green-500/20 border border-green-500/30 rounded-xl p-4">
                                <CheckCircle2 className="w-8 h-8 text-green-400 mx-auto mb-2" />
                                <p className="text-green-400 font-medium">Habilidade {selectedHab.id} desbloqueada! +100 XP</p>
                            </div>
                        ) : (
                            <div className="bg-yellow-500/20 border border-yellow-500/30 rounded-xl p-4">
                                <p className="text-yellow-400">Você precisa de pelo menos 3/5 acertos para concluir. Revise os tópicos e tente novamente!</p>
                            </div>
                        )}

                        <div className="flex gap-3 justify-center">
                            <button onClick={goBack}
                                className="px-6 py-3 rounded-xl bg-white/10 text-white hover:bg-white/20 transition">
                                Voltar à Trilha
                            </button>
                            {!passed && (
                                <button onClick={() => void startQuiz(selectedHab)}
                                    className="px-6 py-3 rounded-xl text-white font-medium transition"
                                    style={{ backgroundColor: selectedArea.cor }}>
                                    <RotateCcw className="w-4 h-4 inline mr-2" /> Tentar Novamente
                                </button>
                            )}
                        </div>
                    </motion.div>
                </div>
            );
        }

        // Active quiz question
        const q = quizQuestions[quizIdx];
        const isCorrectAnswer = quizAnswer === q.correctAnswer;

        return (
            <div className="max-w-3xl mx-auto py-8 px-4">
                <button onClick={goBack} className="flex items-center gap-2 text-white/50 hover:text-white mb-6 transition">
                    <ChevronLeft className="w-4 h-4" /> Voltar à Trilha
                </button>

                {/* Progress */}
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <span className="text-xs text-white/30 font-mono">{selectedHab.id}</span>
                        <h3 className="text-lg font-bold text-white">{selectedHab.titulo} — Quiz</h3>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-white/50 text-sm">
                            {quizIdx + 1}/{quizQuestions.length}
                        </span>
                        <span className="text-xs bg-white/10 px-2 py-0.5 rounded text-white/40">{q.source}</span>
                    </div>
                </div>

                <div className="w-full h-1.5 bg-white/10 rounded-full mb-6 overflow-hidden">
                    <motion.div
                        className="h-full rounded-full"
                        style={{ backgroundColor: selectedArea.cor }}
                        animate={{ width: `${((quizIdx + 1) / quizQuestions.length) * 100}%` }}
                    />
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
                        <h3 className="text-white text-lg leading-relaxed mb-6 whitespace-pre-line">
                            {q.question.length > 1000 ? q.question.slice(0, 1000) + '...' : q.question}
                        </h3>

                        <div className="space-y-3">
                            {q.alternatives.map((alt) => {
                                let classes = 'bg-white/5 border-white/5 hover:bg-white/10 hover:border-white/20';
                                if (quizAnswer) {
                                    if (alt.letter === q.correctAnswer) {
                                        classes = 'bg-green-500/20 border-green-500/50';
                                    } else if (alt.letter === quizAnswer && !isCorrectAnswer) {
                                        classes = 'bg-red-500/20 border-red-500/50';
                                    } else {
                                        classes = 'bg-white/5 border-white/5 opacity-50';
                                    }
                                }

                                return (
                                    <button
                                        key={alt.letter}
                                        onClick={() => handleQuizAnswer(alt.letter)}
                                        disabled={!!quizAnswer}
                                        className={`w-full text-left p-4 rounded-xl border transition-all flex items-start gap-3 ${classes}`}
                                    >
                                        <span className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold shrink-0 ${quizAnswer && alt.letter === q.correctAnswer
                                            ? 'bg-green-500 text-white'
                                            : quizAnswer && alt.letter === quizAnswer && !isCorrectAnswer
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
                        {quizAnswer && (
                            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-6">
                                <div className={`p-3 rounded-xl mb-3 ${isCorrectAnswer ? 'bg-green-500/20 border border-green-500/30' : 'bg-red-500/20 border border-red-500/30'}`}>
                                    <div className="flex items-center gap-2">
                                        {isCorrectAnswer
                                            ? <><CheckCircle2 className="w-5 h-5 text-green-400" /><span className="text-green-400 font-medium">Correto! +20 XP</span></>
                                            : <><XCircle className="w-5 h-5 text-red-400" /><span className="text-red-400 font-medium">Incorreto. Resposta: {q.correctAnswer}</span></>
                                        }
                                    </div>
                                    <p className="text-white/50 text-sm mt-2">{q.explanation}</p>
                                </div>

                                <button
                                    onClick={goNextQuiz}
                                    className="w-full py-3 rounded-xl text-white font-medium flex items-center justify-center gap-2 hover:scale-[1.01] transition-transform"
                                    style={{ backgroundColor: selectedArea.cor }}
                                >
                                    {quizIdx < quizQuestions.length - 1 ? 'Próxima Questão' : 'Ver Resultado'}
                                    <ArrowRight className="w-4 h-4" />
                                </button>
                            </motion.div>
                        )}
                    </motion.div>
                </AnimatePresence>
            </div>
        );
    }

    return null;
}
