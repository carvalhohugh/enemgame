import { useEffect, useMemo, useRef, useState, useCallback } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { Clock, CheckCircle2, XCircle, Lightbulb, ArrowRight, LoaderCircle, Zap } from 'lucide-react';
import { EnemService, type EnemQuestion } from '@/services/EnemService';
import { useStudyProgress, type AreaId } from '@/context/StudyProgressContext';

type Difficulty = 'easy' | 'medium' | 'hard';

interface QuizQuestion {
  id: string;
  area: AreaId;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  difficulty: Difficulty;
  sourceLabel: string;
}

function sanitizeText(value: string | null | undefined): string {
  if (!value) return '';
  return value
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
    .replace(/\[[^\]]*\]\([^)]*\)/g, ' ')
    .replace(/[>#*_`~]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function getDayKey(): string {
  return new Date().toISOString().slice(0, 10);
}

function toArea(discipline: string): AreaId {
  switch (discipline) {
    case 'ciencias-humanas': return 'humanas';
    case 'ciencias-natureza': return 'natureza';
    case 'linguagens': return 'linguagens';
    case 'matematica': return 'matematica';
    default: return 'humanas';
  }
}

/**
 * Questões em espanhol/inglês vêm com language preenchido.
 * Questões em português vêm com language = null.
 * Exclui questões estrangeiras (espanhol/inglês) mantendo null como PT.
 */
function isNotForeignLanguage(question: EnemQuestion): boolean {
  if (!question.language) return true; // null = português
  const lang = question.language.toLowerCase().trim();
  return lang !== 'espanhol' && lang !== 'ingles' && lang !== 'inglês';
}

function toDifficulty(question: EnemQuestion): Difficulty {
  const len = (question.context || '').length;
  if (len > 1500) return 'hard';
  if (len > 700) return 'medium';
  return 'easy';
}

function toQuizQuestion(question: EnemQuestion): QuizQuestion {
  const context = sanitizeText(question.context || '');
  const title = sanitizeText(question.title || '');
  const intro = question.alternativesIntroduction ? sanitizeText(question.alternativesIntroduction) : '';
  const statement = [context, intro, title].filter(Boolean).join('\n\n') || `Questão ${question.index}`;
  const options = question.alternatives.map((a) => {
    const content = sanitizeText(a.text);
    return content ? `${a.letter}) ${content}` : `${a.letter}) Alternativa em imagem`;
  });
  const correctAnswer = question.alternatives.findIndex((a) => a.isCorrect);
  const resolvedCorrectAnswer = correctAnswer >= 0 ? correctAnswer : 0;
  const correctLetter = question.correctAlternative || question.alternatives[resolvedCorrectAnswer]?.letter || 'A';

  return {
    id: `${question.year}-${question.index}-${question.discipline}`,
    area: toArea(question.discipline),
    question: statement,
    options: options.length > 0 ? options : ['A) Sem alternativas disponíveis'],
    correctAnswer: options.length > 0 ? resolvedCorrectAnswer : 0,
    explanation: `Gabarito oficial: alternativa ${correctLetter}. Revise o enunciado e compare sua estratégia.`,
    difficulty: toDifficulty(question),
    sourceLabel: `ENEM ${question.year} • Questão ${question.index}`,
  };
}

function getAreaLabel(area: AreaId): string {
  switch (area) {
    case 'humanas': return 'Ciências Humanas';
    case 'natureza': return 'Ciências da Natureza';
    case 'linguagens': return 'Linguagens';
    case 'matematica': return 'Matemática';
    case 'redacao': return 'Redação';
    default: return 'Geral';
  }
}

function shuffleArray<T>(arr: T[]): T[] {
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export default function SimuladoSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const { registerAnswer, isChallengeCompleted } = useStudyProgress();

  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  const [hasRegisteredResult, setHasRegisteredResult] = useState(false);
  const [isLoadingQuestion, setIsLoadingQuestion] = useState(false);
  const [apiError, setApiError] = useState('');
  const [questionPool, setQuestionPool] = useState<QuizQuestion[]>([]);
  const [activePoolIndex, setActivePoolIndex] = useState(0);
  const [questionsAnswered, setQuestionsAnswered] = useState(0);

  const dailyChallengeId = useMemo(() => `daily-question-${getDayKey()}`, []);

  const question = questionPool[activePoolIndex] ?? null;
  const isCorrect = selectedAnswer !== null && question ? selectedAnswer === question.correctAnswer : false;
  const challengeCompleted = isChallengeCompleted(dailyChallengeId);

  // ── Carrega pool diversificado de questões de vários anos ──
  const loadQuestionPool = useCallback(async () => {
    setIsLoadingQuestion(true);
    setApiError('');

    try {
      const exams = await EnemService.getExams();
      if (exams.length === 0) throw new Error('API não retornou provas disponíveis.');

      // Pegar 3-4 anos aleatórios para variedade
      const shuffledExams = shuffleArray(exams).slice(0, 4);
      const allQuestions: EnemQuestion[] = [];

      for (const exam of shuffledExams) {
        try {
          // A API retorna questões misturadas de todas as disciplinas.
          // Usamos offset alto (>10) para pular questões de espanhol/inglês
          // que ficam no início do array (linguagens estrangeiras).
          const offset = 10 + Math.floor(Math.random() * 100);
          const resp = await EnemService.getQuestions(exam.year, {
            limit: 30,
            offset,
          });
          // Filtrar questões em espanhol/inglês (manter null = português)
          const ptQuestions = resp.questions.filter(isNotForeignLanguage);
          allQuestions.push(...ptQuestions);
        } catch {
          // Skip failed year
        }
      }

      if (allQuestions.length === 0) {
        throw new Error('Nenhuma questão encontrada. Tente novamente.');
      }

      const pool = shuffleArray(allQuestions.map(toQuizQuestion));
      setQuestionPool(pool);
      setActivePoolIndex(0);
    } catch (err) {
      setApiError(
        err instanceof Error
          ? `${err.message} Tente recarregar.`
          : 'Falha ao carregar questões.'
      );
      setQuestionPool([]);
    } finally {
      setIsLoadingQuestion(false);
    }
  }, []);

  useEffect(() => {
    void loadQuestionPool();
  }, [loadQuestionPool]);

  // ── Registra XP ao mostrar resultado ──
  useEffect(() => {
    if (!showResult || selectedAnswer === null || hasRegisteredResult || !question) return;
    registerAnswer({
      area: question.area,
      isCorrect,
      xp: isCorrect ? 50 : 10,
      challengeId: questionsAnswered === 0 ? dailyChallengeId : undefined,
    });
    setHasRegisteredResult(true);
  }, [dailyChallengeId, hasRegisteredResult, isCorrect, question, registerAnswer, selectedAnswer, showResult, questionsAnswered]);

  const handleSelectAnswer = (index: number) => {
    if (showResult) return;
    setSelectedAnswer(index);
    window.setTimeout(() => setShowResult(true), 500);
  };

  // ── Próxima questão (auto-avança + recarrega se pool acabou) ──
  const handleNextQuestion = useCallback(async () => {
    const nextIdx = activePoolIndex + 1;
    if (nextIdx < questionPool.length) {
      setActivePoolIndex(nextIdx);
    } else {
      // Pool acabou → recarrega novas questões de outros anos
      await loadQuestionPool();
    }
    setSelectedAnswer(null);
    setShowResult(false);
    setShowExplanation(false);
    setHasRegisteredResult(false);
    setQuestionsAnswered((c) => c + 1);
  }, [activePoolIndex, questionPool.length, loadQuestionPool]);

  // ── Loading state ──
  if (isLoadingQuestion && questionPool.length === 0) {
    return (
      <section id="simulado" className="relative py-24 overflow-hidden bg-dark-deeper/50">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <LoaderCircle className="w-12 h-12 text-purple-light animate-spin mx-auto mb-4" />
          <p className="text-white/60 text-lg">Carregando questões de múltiplos anos do ENEM...</p>
          <p className="text-white/30 text-sm mt-2">Buscando de 2009 a 2024</p>
        </div>
      </section>
    );
  }

  if (!question) {
    return (
      <section id="simulado" className="relative py-24 overflow-hidden bg-dark-deeper/50">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <p className="text-white/60 text-lg mb-4">{apiError || 'Nenhuma questão disponível.'}</p>
          <button onClick={() => void loadQuestionPool()}
            className="btn-primary inline-flex items-center gap-2">
            <Zap className="w-4 h-4" /> Tentar novamente
          </button>
        </div>
      </section>
    );
  }

  return (
    <section id="simulado" className="relative py-24 overflow-hidden bg-dark-deeper/50">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-purple/5 rounded-full blur-[150px]" />
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 bg-gold/20 px-4 py-2 rounded-full border border-gold/30 mb-6"
          >
            <Clock className="w-4 h-4 text-gold" />
            <span className="text-sm text-gold font-medium">
              Questão Diária — ENEM 2009-2024
            </span>
          </motion.div>

          <h2 className="font-poppins text-4xl sm:text-5xl font-bold text-white mb-4">
            Teste seus <span className="text-gradient-gold">conhecimentos</span>
          </h2>
          <p className="text-white/60 text-lg">Questões reais do ENEM de todos os anos, com correção e XP.</p>
          <div className="mt-3 flex items-center justify-center gap-4 text-sm text-white/50">
            <span>{question.sourceLabel}</span>
            {questionsAnswered > 0 && (
              <span className="bg-purple/20 px-2 py-0.5 rounded text-purple-light">
                {questionsAnswered} respondida{questionsAnswered > 1 ? 's' : ''}
              </span>
            )}
          </div>
          {challengeCompleted && (
            <p className="mt-2 text-sm text-green-300">
              ✅ Desafio diário concluído! Continue treinando para ganhar mais XP.
            </p>
          )}
          {apiError && (
            <p className="mt-4 rounded-xl border border-amber-400/40 bg-amber-500/10 px-4 py-2 text-sm text-amber-100">
              {apiError}
            </p>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative"
        >
          <div className="absolute -inset-1 bg-gradient-to-r from-purple via-purple-light to-gold rounded-3xl blur-lg opacity-30" />

          <div className="relative glass rounded-3xl p-8 border border-purple/30">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 rounded-full bg-purple/20 text-purple-light text-sm font-medium">
                  {getAreaLabel(question.area)}
                </span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${question.difficulty === 'easy'
                  ? 'bg-green-500/20 text-green-400'
                  : question.difficulty === 'medium'
                    ? 'bg-yellow-500/20 text-yellow-400'
                    : 'bg-red-500/20 text-red-400'
                  }`}>
                  {question.difficulty === 'easy' && 'Fácil'}
                  {question.difficulty === 'medium' && 'Médio'}
                  {question.difficulty === 'hard' && 'Difícil'}
                </span>
              </div>
              <div className="flex items-center gap-2 text-white/40">
                <Clock className="w-4 h-4" />
                <span className="text-sm">+50 XP</span>
              </div>
            </div>

            <h3 className="font-poppins text-xl text-white mb-8 leading-relaxed whitespace-pre-line">
              {question.question.length > 1200
                ? question.question.slice(0, 1200) + '...'
                : question.question}
            </h3>

            <div className="space-y-3">
              {question.options.map((option, index) => (
                <motion.button
                  key={`${question.id}-option-${index}`}
                  initial={{ opacity: 0, x: -30 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
                  onClick={() => handleSelectAnswer(index)}
                  disabled={showResult}
                  className={`w-full p-4 rounded-xl text-left transition-all duration-300 relative overflow-hidden ${showResult
                    ? index === question.correctAnswer
                      ? 'bg-green-500/20 border-2 border-green-500'
                      : selectedAnswer === index
                        ? 'bg-red-500/20 border-2 border-red-500'
                        : 'bg-white/5 border-2 border-transparent opacity-50'
                    : selectedAnswer === index
                      ? 'bg-purple/30 border-2 border-purple'
                      : 'bg-white/5 border-2 border-transparent hover:bg-white/10 hover:border-purple/30'
                    }`}
                >
                  <div className="flex items-center gap-4">
                    <span className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold text-sm ${showResult
                      ? index === question.correctAnswer
                        ? 'bg-green-500 text-white'
                        : selectedAnswer === index
                          ? 'bg-red-500 text-white'
                          : 'bg-white/10 text-white/40'
                      : selectedAnswer === index
                        ? 'bg-purple text-white'
                        : 'bg-white/10 text-white/60'
                      }`}>
                      {String.fromCharCode(65 + index)}
                    </span>
                    <span className="text-white flex-grow">{option}</span>
                    {showResult && index === question.correctAnswer && (
                      <CheckCircle2 className="w-6 h-6 text-green-500" />
                    )}
                    {showResult && selectedAnswer === index && index !== question.correctAnswer && (
                      <XCircle className="w-6 h-6 text-red-500" />
                    )}
                  </div>
                </motion.button>
              ))}
            </div>

            <AnimatePresence>
              {showResult && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-6"
                >
                  <div className={`p-4 rounded-xl mb-4 ${isCorrect
                    ? 'bg-green-500/20 border border-green-500/30'
                    : 'bg-red-500/20 border border-red-500/30'
                    }`}>
                    <div className="flex items-center gap-3">
                      {isCorrect
                        ? <CheckCircle2 className="w-6 h-6 text-green-500" />
                        : <XCircle className="w-6 h-6 text-red-500" />
                      }
                      <span className={`font-semibold ${isCorrect ? 'text-green-400' : 'text-red-400'}`}>
                        {isCorrect ? 'Resposta correta! +50 XP 🔥' : 'Resposta incorreta. +10 XP por tentativa'}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => setShowExplanation(!showExplanation)}
                    className="flex items-center gap-2 text-purple-light hover:text-purple transition-colors mb-4"
                  >
                    <Lightbulb className="w-5 h-5" />
                    <span>{showExplanation ? 'Ocultar explicação' : 'Ver explicação'}</span>
                    <ArrowRight className={`w-4 h-4 transition-transform ${showExplanation ? 'rotate-90' : ''}`} />
                  </button>

                  <AnimatePresence>
                    {showExplanation && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mb-4 p-4 bg-purple/10 rounded-xl border border-purple/20"
                      >
                        <p className="text-white/80">{question.explanation}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* ── Botão PRÓXIMA QUESTÃO proeminente ── */}
                  <motion.button
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    onClick={() => void handleNextQuestion()}
                    className="w-full py-4 rounded-xl bg-gradient-to-r from-purple to-purple-light text-white font-bold text-lg hover:scale-[1.02] transition-transform flex items-center justify-center gap-3"
                  >
                    <Zap className="w-5 h-5" />
                    Próxima Questão
                    <ArrowRight className="w-5 h-5" />
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {!showResult && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="mt-8 text-center"
          >
            <p className="text-white/40 text-sm">
              Pool: {questionPool.length} questões • Posição {activePoolIndex + 1}/{questionPool.length}
            </p>
          </motion.div>
        )}
      </div>
    </section>
  );
}
