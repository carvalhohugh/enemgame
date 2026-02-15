import { useEffect, useMemo, useRef, useState } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { Clock, CheckCircle2, XCircle, Lightbulb, ArrowRight, RotateCcw, LoaderCircle } from 'lucide-react';
import { dailyQuestion } from '@/data/mockData';
import { fetchEnemExams, fetchEnemQuestions, type EnemQuestion } from '@/services/enemApi';
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

const disciplineCycle = ['ciencias-humanas', 'ciencias-natureza', 'linguagens', 'matematica'] as const;

function sanitizeText(value: string): string {
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

function getDayOfYear(date: Date): number {
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = date.getTime() - start.getTime();
  return Math.floor(diff / 86400000);
}

function toArea(discipline: string): AreaId {
  switch (discipline) {
    case 'ciencias-humanas':
      return 'humanas';
    case 'ciencias-natureza':
      return 'natureza';
    case 'linguagens':
      return 'linguagens';
    case 'matematica':
      return 'matematica';
    default:
      return 'humanas';
  }
}

function isPortugueseQuestion(question: EnemQuestion): boolean {
  if (!question.language) {
    return true;
  }

  const normalized = question.language.toLowerCase().trim();
  return normalized === 'portugues' || normalized === 'pt-br' || normalized === 'ptbr';
}

function buildFallbackQuestion(): QuizQuestion {
  return {
    id: dailyQuestion.id,
    area: dailyQuestion.area as AreaId,
    question: dailyQuestion.question,
    options: dailyQuestion.options,
    correctAnswer: dailyQuestion.correctAnswer,
    explanation: dailyQuestion.explanation,
    difficulty: dailyQuestion.difficulty,
    sourceLabel: 'Questão curada local',
  };
}

function toDifficulty(question: EnemQuestion): Difficulty {
  if (question.context.length > 1500) {
    return 'hard';
  }

  if (question.context.length > 700) {
    return 'medium';
  }

  return 'easy';
}

function toQuizQuestion(question: EnemQuestion): QuizQuestion {
  const context = sanitizeText(question.context);
  const title = sanitizeText(question.title);
  const statement = context || title || `Questão ${question.index}`;
  const options = question.alternatives.map((alternative) => {
    const content = sanitizeText(alternative.text);
    return content ? `${alternative.letter}) ${content}` : `${alternative.letter}) Alternativa em imagem`;
  });
  const correctAnswer = question.alternatives.findIndex((alternative) => alternative.isCorrect);
  const resolvedCorrectAnswer = correctAnswer >= 0 ? correctAnswer : 0;
  const correctLetter = question.correctAlternative || question.alternatives[resolvedCorrectAnswer]?.letter || 'A';

  return {
    id: `${question.year}-${question.index}-${question.discipline}`,
    area: toArea(question.discipline),
    question: statement,
    options: options.length > 0 ? options : ['A) Sem alternativas disponíveis no momento'],
    correctAnswer: options.length > 0 ? resolvedCorrectAnswer : 0,
    explanation: `Gabarito oficial: alternativa ${correctLetter}. Revise o enunciado e compare sua estratégia.`,
    difficulty: toDifficulty(question),
    sourceLabel: `ENEM ${question.year} • Questão ${question.index}`,
  };
}

function getAreaLabel(area: AreaId): string {
  switch (area) {
    case 'humanas':
      return 'Ciências Humanas';
    case 'natureza':
      return 'Ciências da Natureza';
    case 'linguagens':
      return 'Linguagens';
    case 'matematica':
      return 'Matemática';
    case 'redacao':
      return 'Redação';
    default:
      return 'Ciências Humanas';
  }
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

  const dailyChallengeId = useMemo(() => `daily-question-${getDayKey()}`, []);
  const question = questionPool[activePoolIndex] ?? buildFallbackQuestion();
  const isCorrect = selectedAnswer === question.correctAnswer;
  const challengeCompleted = isChallengeCompleted(dailyChallengeId);

  useEffect(() => {
    let isMounted = true;

    const loadDailyQuestion = async () => {
      setIsLoadingQuestion(true);
      setApiError('');

      try {
        const exams = await fetchEnemExams();
        const latestExam = exams[0];

        if (!latestExam) {
          throw new Error('A API oficial não retornou provas disponíveis.');
        }

        const now = new Date();
        const dayOfYear = getDayOfYear(now);
        const discipline = disciplineCycle[dayOfYear % disciplineCycle.length];

        const response = await fetchEnemQuestions(latestExam.year, {
          discipline,
          limit: 50,
        });

        const portugueseQuestions = response.questions.filter(isPortugueseQuestion);

        if (portugueseQuestions.length === 0) {
          throw new Error('Não houve questões em português nesse filtro oficial.');
        }

        const pool = portugueseQuestions.map(toQuizQuestion);

        if (isMounted) {
          setQuestionPool(pool);
          setActivePoolIndex(dayOfYear % pool.length);
        }
      } catch (error) {
        if (isMounted) {
          setQuestionPool([buildFallbackQuestion()]);
          setActivePoolIndex(0);
          setApiError(
            error instanceof Error
              ? `${error.message} Exibindo questão de contingência.`
              : 'Falha ao carregar questão oficial. Exibindo contingência.',
          );
        }
      } finally {
        if (isMounted) {
          setIsLoadingQuestion(false);
        }
      }
    };

    void loadDailyQuestion();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (!showResult || selectedAnswer === null || hasRegisteredResult) {
      return;
    }

    registerAnswer({
      area: question.area,
      isCorrect,
      xp: isCorrect ? 50 : 10,
      challengeId: dailyChallengeId,
    });
    setHasRegisteredResult(true);
  }, [dailyChallengeId, hasRegisteredResult, isCorrect, question.area, registerAnswer, selectedAnswer, showResult]);

  const handleSelectAnswer = (index: number) => {
    if (showResult) {
      return;
    }

    setSelectedAnswer(index);
    window.setTimeout(() => {
      setShowResult(true);
    }, 500);
  };

  const handleReset = () => {
    setSelectedAnswer(null);
    setShowResult(false);
    setShowExplanation(false);
    setHasRegisteredResult(false);
  };

  const handleNextQuestion = () => {
    setActivePoolIndex((current) => {
      if (questionPool.length === 0) {
        return 0;
      }

      return (current + 1) % questionPool.length;
    });
    setSelectedAnswer(null);
    setShowResult(false);
    setShowExplanation(false);
    setHasRegisteredResult(false);
  };

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
            <span className="text-sm text-gold font-medium">Desafio do Dia</span>
          </motion.div>

          <h2 className="font-poppins text-4xl sm:text-5xl font-bold text-white mb-4">
            Teste seus <span className="text-gradient-gold">conhecimentos</span>
          </h2>
          <p className="text-white/60 text-lg">Questão real do ENEM com correção instantânea e XP.</p>
          <p className="mt-3 text-sm text-white/50">{question.sourceLabel}</p>
          {challengeCompleted && (
            <p className="mt-2 text-sm text-green-300">
              Desafio diário de hoje já concluído. Você ainda pode treinar outras questões.
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
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    question.difficulty === 'easy'
                      ? 'bg-green-500/20 text-green-400'
                      : question.difficulty === 'medium'
                        ? 'bg-yellow-500/20 text-yellow-400'
                        : 'bg-red-500/20 text-red-400'
                  }`}
                >
                  {question.difficulty === 'easy' && 'Fácil'}
                  {question.difficulty === 'medium' && 'Médio'}
                  {question.difficulty === 'hard' && 'Difícil'}
                </span>
              </div>
              <div className="flex items-center gap-2 text-white/40">
                {isLoadingQuestion ? <LoaderCircle className="w-4 h-4 animate-spin" /> : <Clock className="w-4 h-4" />}
                <span className="text-sm">+50 XP</span>
              </div>
            </div>

            <h3 className="font-poppins text-xl text-white mb-8 leading-relaxed">{question.question}</h3>

            <div className="space-y-3">
              {question.options.map((option, index) => (
                <motion.button
                  key={`${question.id}-option-${index}`}
                  initial={{ opacity: 0, x: -30 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
                  onClick={() => handleSelectAnswer(index)}
                  disabled={showResult}
                  className={`w-full p-4 rounded-xl text-left transition-all duration-300 relative overflow-hidden ${
                    showResult
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
                    <span
                      className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold text-sm ${
                        showResult
                          ? index === question.correctAnswer
                            ? 'bg-green-500 text-white'
                            : selectedAnswer === index
                              ? 'bg-red-500 text-white'
                              : 'bg-white/10 text-white/40'
                          : selectedAnswer === index
                            ? 'bg-purple text-white'
                            : 'bg-white/10 text-white/60'
                      }`}
                    >
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
                  <div
                    className={`p-4 rounded-xl mb-4 ${
                      isCorrect
                        ? 'bg-green-500/20 border border-green-500/30'
                        : 'bg-red-500/20 border border-red-500/30'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {isCorrect ? (
                        <CheckCircle2 className="w-6 h-6 text-green-500" />
                      ) : (
                        <XCircle className="w-6 h-6 text-red-500" />
                      )}
                      <span className={`font-semibold ${isCorrect ? 'text-green-400' : 'text-red-400'}`}>
                        {isCorrect ? 'Resposta correta! +50 XP' : 'Resposta incorreta. +10 XP por tentativa'}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => setShowExplanation(!showExplanation)}
                    className="flex items-center gap-2 text-purple-light hover:text-purple transition-colors"
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
                        className="mt-4 p-4 bg-purple/10 rounded-xl border border-purple/20"
                      >
                        <p className="text-white/80">{question.explanation}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <motion.button
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    onClick={handleReset}
                    className="mt-6 flex items-center gap-2 px-6 py-3 bg-white/5 hover:bg-white/10 rounded-xl text-white transition-colors"
                  >
                    <RotateCcw className="w-5 h-5" />
                    <span>Tentar novamente</span>
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-12 text-center"
        >
          <p className="text-white/60 mb-4">Quer mais desafios?</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="btn-primary inline-flex items-center gap-2"
            onClick={handleNextQuestion}
          >
            <span>Carregar Próxima Questão Oficial</span>
            <ArrowRight className="w-5 h-5" />
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}
