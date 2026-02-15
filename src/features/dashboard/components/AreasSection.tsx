import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { ArrowRight, BookOpen, CheckCircle2, LoaderCircle, RefreshCw, X } from 'lucide-react';
import { areas } from '@/data/mockData';
import {
  baseEssayThemes,
  buildThemesFromQuestions,
  mecCompetencies,
  type EssayTheme,
} from '@/data/redacao';
import { useStudyProgress } from '@/context/StudyProgressContext';
import {
  EnemService,
  type EnemExam,
  type EnemExamOption,
  type EnemQuestion,
} from '@/services/EnemService';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, rotateX: 90 },
  visible: {
    opacity: 1,
    rotateX: 0,
    transition: {
      duration: 0.6,
      ease: [0.19, 1, 0.22, 1] as const,
    },
  },
};

type AreaId = 'humanas' | 'natureza' | 'linguagens' | 'matematica' | 'redacao';
type StudyAreaId = Exclude<AreaId, 'redacao'>;
type Discipline = 'ciencias-humanas' | 'ciencias-natureza' | 'linguagens' | 'matematica';
type DashboardArea = (typeof areas)[number] & { id: AreaId };

type EnrichedArea = DashboardArea & {
  officialLoaded: number;
  officialTotalEstimate: number;
  apiLoading: boolean;
  apiError: string;
};

interface AreaApiState {
  questions: EnemQuestion[];
  loading: boolean;
  error: string;
  totalEstimate: number;
  nextOffset: number;
  hasMore: boolean;
}

const studyAreaIds: StudyAreaId[] = ['humanas', 'natureza', 'linguagens', 'matematica'];
const PREFERRED_ENEM_YEAR = 2025;

const disciplineByArea: Record<StudyAreaId, Discipline> = {
  humanas: 'ciencias-humanas',
  natureza: 'ciencias-natureza',
  linguagens: 'linguagens',
  matematica: 'matematica',
};

function sanitizeQuestionContext(value: string): string {
  const withoutMarkdown = value
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
    .replace(/\[[^\]]*\]\([^)]*\)/g, ' ')
    .replace(/[>#*_`~]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  return withoutMarkdown.length > 260 ? `${withoutMarkdown.slice(0, 260)}...` : withoutMarkdown;
}

function isPortugueseQuestion(question: EnemQuestion): boolean {
  if (!question.language) {
    return true;
  }

  const normalized = question.language.toLowerCase().trim();
  return normalized === 'portugues' || normalized === 'pt-br' || normalized === 'ptbr';
}

function getQuestionKey(question: EnemQuestion): string {
  return `${question.year}-${question.index}-${question.discipline}-${question.language ?? 'pt-br'}`;
}

function createInitialAreaState(): Record<StudyAreaId, AreaApiState> {
  return {
    humanas: {
      questions: [],
      loading: false,
      error: '',
      totalEstimate: 0,
      nextOffset: 0,
      hasMore: true,
    },
    natureza: {
      questions: [],
      loading: false,
      error: '',
      totalEstimate: 0,
      nextOffset: 0,
      hasMore: true,
    },
    linguagens: {
      questions: [],
      loading: false,
      error: '',
      totalEstimate: 0,
      nextOffset: 0,
      hasMore: true,
    },
    matematica: {
      questions: [],
      loading: false,
      error: '',
      totalEstimate: 0,
      nextOffset: 0,
      hasMore: true,
    },
  };
}

function pickThemeSuggestions(themes: EssayTheme[], offset: number, take = 3): EssayTheme[] {
  if (themes.length === 0) {
    return [];
  }

  const uniqueThemes = Array.from(new Map(themes.map((theme) => [theme.title, theme])).values());
  const result: EssayTheme[] = [];
  const normalizedOffset = Math.abs(offset) % uniqueThemes.length;

  for (let index = 0; index < Math.min(take, uniqueThemes.length); index += 1) {
    result.push(uniqueThemes[(normalizedOffset + index) % uniqueThemes.length]);
  }

  return result;
}

function choosePreferredExam(exams: EnemExam[]): { exam: EnemExam; usingPreferredYear: boolean } {
  const preferred = exams.find((exam) => exam.year === PREFERRED_ENEM_YEAR);
  if (preferred) {
    return {
      exam: preferred,
      usingPreferredYear: true,
    };
  }

  return {
    exam: exams[0],
    usingPreferredYear: false,
  };
}

function buildSubjectsByArea(
  disciplineOptions: EnemExamOption[],
  languageOptions: EnemExamOption[],
): Record<AreaId, string[]> {
  const labelByDiscipline = new Map(
    disciplineOptions.map((option) => [option.value, option.label]),
  );

  const idiomas = languageOptions.map((option) => option.label);

  return {
    humanas: [
      labelByDiscipline.get('ciencias-humanas') ?? 'Ciências Humanas e suas Tecnologias',
    ],
    natureza: [
      labelByDiscipline.get('ciencias-natureza') ?? 'Ciências da Natureza e suas Tecnologias',
    ],
    linguagens: [
      labelByDiscipline.get('linguagens') ?? 'Linguagens, Códigos e suas Tecnologias',
      ...idiomas.map((idioma) => `Idioma: ${idioma}`),
    ],
    matematica: [
      labelByDiscipline.get('matematica') ?? 'Matemática e suas Tecnologias',
    ],
    redacao: ['Competência 1', 'Competência 2', 'Competência 3', 'Competência 4', 'Competência 5'],
  };
}

interface AreaCardProps {
  area: EnrichedArea;
  index: number;
  onContinue: (areaId: AreaId) => void;
}

function AreaCard({ area, index, onContinue }: AreaCardProps) {
  return (
    <motion.div
      variants={cardVariants}
      whileHover={{ scale: 1.03, y: -8 }}
      className="group relative isolate"
    >
      <div
        className="pointer-events-none absolute -inset-0.5 z-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-lg"
        style={{ backgroundColor: area.color }}
      />

      <div className="relative z-10 glass rounded-2xl p-6 border border-white/10 group-hover:border-white/20 transition-all duration-300 h-full flex flex-col">
        <div className="flex items-start justify-between mb-4">
          <div
            className="w-14 h-14 rounded-xl flex items-center justify-center text-3xl"
            style={{ backgroundColor: `${area.color}20` }}
          >
            {area.icon}
          </div>
          <div
            className="px-3 py-1 rounded-full text-xs font-semibold"
            style={{ backgroundColor: `${area.color}20`, color: area.color }}
          >
            {area.completedQuests}/{area.totalQuests} questoes
          </div>
        </div>

        <h3 className="font-poppins font-bold text-xl text-white mb-2">{area.name}</h3>
        <p className="text-white/50 text-sm mb-2">{area.description}</p>
        <p className="text-xs text-white/40 mb-4">
          {area.id === 'redacao'
            ? 'Critérios oficiais do MEC + temas em atualização.'
            : area.apiLoading
              ? 'Carregando banco oficial...'
              : area.apiError
                ? 'Falha de conexão, clique em Continuar para tentar novamente.'
                : area.officialLoaded > 0
                  ? `${area.officialLoaded} questões oficiais carregadas`
                  : 'Clique em Continuar para carregar questões reais.'}
        </p>

        <div className="mb-4">
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="text-white/60">Progresso</span>
            <span className="font-semibold" style={{ color: area.color }}>
              {area.progress}%
            </span>
          </div>
          <div className="h-2 bg-dark-deeper rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: `${area.progress}%` }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 0.3 + index * 0.1 }}
              className="h-full rounded-full"
              style={{ backgroundColor: area.color }}
            />
          </div>
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onContinue(area.id)}
          className="relative z-20 w-full py-3 rounded-xl border border-white/15 hover:border-white/35 flex items-center justify-center gap-2 font-medium text-white transition-all duration-300"
          style={{
            backgroundColor: `${area.color}22`,
          }}
        >
          <BookOpen className="w-4 h-4" style={{ color: area.color }} />
          <span>Continuar</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" style={{ color: area.color }} />
        </motion.button>
      </div>
    </motion.div>
  );
}

export default function AreasSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const { progress, registerAnswer } = useStudyProgress();

  const [latestYear, setLatestYear] = useState<number | null>(null);
  const [yearNotice, setYearNotice] = useState('');
  const [disciplineOptions, setDisciplineOptions] = useState<EnemExamOption[]>([]);
  const [languageOptions, setLanguageOptions] = useState<EnemExamOption[]>([]);
  const [areaStates, setAreaStates] = useState<Record<StudyAreaId, AreaApiState>>(
    createInitialAreaState,
  );
  const [officialApiError, setOfficialApiError] = useState('');
  const [isApiLoading, setIsApiLoading] = useState(false);
  const [activeAreaId, setActiveAreaId] = useState<AreaId | null>(null);
  const [visibleQuestionCount, setVisibleQuestionCount] = useState(6);
  const [essayThemeOffset, setEssayThemeOffset] = useState(0);
  const [questionResponses, setQuestionResponses] = useState<
    Record<string, { selected: number; correct: boolean }>
  >({});

  const subjectsByArea = useMemo(
    () => buildSubjectsByArea(disciplineOptions, languageOptions),
    [disciplineOptions, languageOptions],
  );
  const officialSubjectsCount = useMemo(() => {
    const uniqueSubjects = new Set<string>();
    studyAreaIds.forEach((areaId) => {
      subjectsByArea[areaId].forEach((subject) => uniqueSubjects.add(subject));
    });

    return uniqueSubjects.size;
  }, [subjectsByArea]);

  useEffect(() => {
    let isMounted = true;

    const loadOfficialYear = async () => {
      setIsApiLoading(true);
      setOfficialApiError('');

      try {
        const exams = await EnemService.getExams();

        if (exams.length === 0) {
          throw new Error('Nenhuma prova encontrada na API oficial.');
        }

        const { exam, usingPreferredYear } = choosePreferredExam(exams);

        if (isMounted) {
          setLatestYear(exam.year);
          setDisciplineOptions(exam.disciplines);
          setLanguageOptions(exam.languages);
          setYearNotice(
            usingPreferredYear
              ? `Base oficial definida para ENEM ${PREFERRED_ENEM_YEAR}.`
              : `ENEM ${PREFERRED_ENEM_YEAR} ainda não disponível no acervo atual. Usando ENEM ${exam.year}.`,
          );
        }
      } catch (error) {
        if (isMounted) {
          setOfficialApiError(
            error instanceof Error ? error.message : 'Erro ao carregar conteúdo oficial.',
          );
        }
      } finally {
        if (isMounted) {
          setIsApiLoading(false);
        }
      }
    };

    void loadOfficialYear();

    return () => {
      isMounted = false;
    };
  }, []);

  const loadAreaQuestions = useCallback(
    async (areaId: StudyAreaId, reset = false) => {
      if (!latestYear) {
        return;
      }

      const discipline = disciplineByArea[areaId];
      const currentState = areaStates[areaId];
      const offset = reset ? 0 : currentState.nextOffset;

      if (!reset && (!currentState.hasMore || currentState.loading)) {
        return;
      }

      setAreaStates((prev) => ({
        ...prev,
        [areaId]: {
          ...prev[areaId],
          loading: true,
          error: '',
          ...(reset
            ? {
              questions: [],
              nextOffset: 0,
              hasMore: true,
            }
            : {}),
        },
      }));

      try {
        const response = await EnemService.getQuestions(latestYear, {
          discipline,
          limit: 50,
          offset,
        });

        const portugueseQuestions = response.questions
          .filter(isPortugueseQuestion)
          .sort((left, right) => left.index - right.index);

        setAreaStates((prev) => {
          const baseQuestions = reset ? [] : prev[areaId].questions;
          const dedupedMap = new Map<string, EnemQuestion>();

          baseQuestions.forEach((question) => {
            dedupedMap.set(getQuestionKey(question), question);
          });

          portugueseQuestions.forEach((question) => {
            dedupedMap.set(getQuestionKey(question), question);
          });

          return {
            ...prev,
            [areaId]: {
              questions: Array.from(dedupedMap.values()).sort((left, right) => left.index - right.index),
              loading: false,
              error: '',
              totalEstimate: response.metadata.total,
              hasMore: response.metadata.hasMore,
              nextOffset: offset + response.metadata.limit,
            },
          };
        });
      } catch (error) {
        setAreaStates((prev) => ({
          ...prev,
          [areaId]: {
            ...prev[areaId],
            loading: false,
            error:
              error instanceof Error
                ? error.message
                : 'Não foi possível carregar as questões dessa área.',
          },
        }));
      }
    },
    [areaStates, latestYear],
  );

  const enrichedAreas = useMemo<EnrichedArea[]>(() => {
    return areas
      .filter((area): area is DashboardArea =>
        ['humanas', 'natureza', 'linguagens', 'matematica', 'redacao'].includes(
          area.id as AreaId,
        ),
      )
      .map((area) => {
        if (area.id === 'redacao') {
          return {
            ...area,
            officialLoaded: 0,
            officialTotalEstimate: 0,
            apiLoading: false,
            apiError: '',
          };
        }

        const apiState = areaStates[area.id];
        const officialLoaded = apiState.questions.length;
        const officialTotalEstimate = apiState.totalEstimate || area.totalQuests;
        const sessionAnswered = progress.areaProgress[area.id].answered;
        const completed = Math.min(Math.max(area.completedQuests, sessionAnswered), officialTotalEstimate);
        const areaProgressPercent = Math.round((completed / officialTotalEstimate) * 100);

        return {
          ...area,
          completedQuests: completed,
          totalQuests: officialTotalEstimate,
          progress: areaProgressPercent,
          officialLoaded,
          officialTotalEstimate,
          apiLoading: apiState.loading,
          apiError: apiState.error,
        };
      });
  }, [areaStates, progress.areaProgress]);

  const activeArea = useMemo(
    () => enrichedAreas.find((area) => area.id === activeAreaId) ?? null,
    [activeAreaId, enrichedAreas],
  );

  const activeAreaQuestions = useMemo(() => {
    if (!activeAreaId || activeAreaId === 'redacao' || !studyAreaIds.includes(activeAreaId)) {
      return [];
    }

    return areaStates[activeAreaId].questions;
  }, [activeAreaId, areaStates]);

  const allOfficialQuestions = useMemo(
    () => studyAreaIds.flatMap((areaId) => areaStates[areaId].questions),
    [areaStates],
  );

  const essayThemes = useMemo(() => {
    const apiThemes = buildThemesFromQuestions(allOfficialQuestions);
    const allThemes = [...apiThemes, ...baseEssayThemes];
    return pickThemeSuggestions(allThemes, essayThemeOffset);
  }, [allOfficialQuestions, essayThemeOffset]);

  const activeAreaApiState = useMemo(() => {
    if (!activeAreaId || activeAreaId === 'redacao') {
      return null;
    }

    return areaStates[activeAreaId];
  }, [activeAreaId, areaStates]);

  const openArea = (areaId: AreaId) => {
    setActiveAreaId(areaId);
    setVisibleQuestionCount(6);

    if (areaId === 'redacao') {
      setEssayThemeOffset((current) => current + 3);
      return;
    }

    const areaState = areaStates[areaId];
    if (areaState.questions.length === 0 || areaState.error) {
      void loadAreaQuestions(areaId, true);
    }
  };

  const handleLoadMore = () => {
    if (!activeAreaId || activeAreaId === 'redacao') {
      return;
    }

    void loadAreaQuestions(activeAreaId, false);
    setVisibleQuestionCount((current) => current + 6);
  };

  const handleAreaQuestionAnswer = (question: EnemQuestion, selectedIndex: number) => {
    if (!activeAreaId || activeAreaId === 'redacao' || !studyAreaIds.includes(activeAreaId)) {
      return;
    }

    const key = getQuestionKey(question);
    if (questionResponses[key]) {
      return;
    }

    const correctIndex = question.alternatives.findIndex((alternative) => alternative.isCorrect);
    const isCorrect = correctIndex >= 0 ? selectedIndex === correctIndex : false;

    setQuestionResponses((current) => ({
      ...current,
      [key]: {
        selected: selectedIndex,
        correct: isCorrect,
      },
    }));

    registerAnswer({
      area: activeAreaId,
      isCorrect,
      xp: isCorrect ? 20 : 5,
    });
  };

  return (
    <section id="trilhas" className="relative py-24 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-purple/30 to-transparent" />
        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-purple/30 to-transparent" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 bg-purple/20 px-4 py-2 rounded-full border border-purple/30 mb-6"
          >
            <CheckCircle2 className="w-4 h-4 text-purple-light" />
            <span className="text-sm text-purple-light font-medium">
              Escolha sua trilha
            </span>
          </motion.div>

          <h2 className="font-poppins text-4xl sm:text-5xl font-bold text-white mb-4">
            Áreas do <span className="text-gradient">Conhecimento</span>
          </h2>
          <p className="text-white/60 text-lg max-w-2xl mx-auto">
            Trilhas e componentes oficiais do ENEM ({latestYear ?? 'carregando...'}).
          </p>
          {yearNotice && (
            <p className="mt-3 text-sm text-gold/90">{yearNotice}</p>
          )}

          {isApiLoading && (
            <p className="mt-4 inline-flex items-center gap-2 text-sm text-white/70">
              <LoaderCircle className="h-4 w-4 animate-spin" />
              Carregando banco oficial...
            </p>
          )}

          {officialApiError && (
            <p className="mt-4 rounded-xl border border-red-400/40 bg-red-500/15 px-4 py-2 text-sm text-red-100">
              {officialApiError}
            </p>
          )}
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {enrichedAreas.map((area, index) => (
            <AreaCard key={area.id} area={area} index={index} onContinue={openArea} />
          ))}
        </motion.div>

        {activeArea && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-10 glass rounded-3xl border border-purple/20 p-6"
          >
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-wider text-white/50">Trilha ativa</p>
                <h3 className="mt-1 font-poppins text-2xl font-bold text-white">{activeArea.name}</h3>
                <div className="mt-3 flex flex-wrap gap-2">
                  {subjectsByArea[activeArea.id].map((subject) => (
                    <span
                      key={subject}
                      className="rounded-full border border-white/20 bg-white/5 px-3 py-1 text-xs text-white/80"
                    >
                      {subject}
                    </span>
                  ))}
                </div>
              </div>
              <button
                type="button"
                onClick={() => setActiveAreaId(null)}
                className="inline-flex items-center gap-2 rounded-xl border border-white/20 px-4 py-2 text-sm text-white/70 transition hover:border-white/40"
              >
                <X className="h-4 w-4" />
                Fechar
              </button>
            </div>

            {activeArea.id === 'redacao' ? (
              <div className="mt-6 space-y-6">
                <div className="rounded-2xl border border-gold/30 bg-gold/10 p-4 text-sm text-white/85">
                  A redação segue os 5 critérios oficiais do MEC/INEP, com nota de 0 a 1000.
                </div>

                <div className="grid gap-3 md:grid-cols-2">
                  {mecCompetencies.map((competency) => (
                    <article
                      key={competency.id}
                      className="rounded-2xl border border-white/10 bg-black/20 p-4"
                    >
                      <p className="text-xs text-gold">Competência {competency.id}</p>
                      <h4 className="mt-1 font-semibold text-white">{competency.title}</h4>
                      <p className="mt-2 text-sm text-white/70">{competency.description}</p>
                      <p className="mt-2 text-xs text-white/50">{competency.scoreRange}</p>
                    </article>
                  ))}
                </div>

                <div className="rounded-2xl border border-purple/25 bg-purple/10 p-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <h4 className="font-poppins text-lg font-semibold text-white">Temas sugeridos</h4>
                    <button
                      type="button"
                      onClick={() => setEssayThemeOffset((current) => current + 1)}
                      className="inline-flex items-center gap-2 rounded-lg border border-white/20 px-3 py-2 text-xs font-semibold text-white/80 transition hover:border-white/40"
                    >
                      <RefreshCw className="h-3.5 w-3.5" />
                      Gerar novos temas
                    </button>
                  </div>

                  <div className="mt-4 space-y-3">
                    {essayThemes.map((theme) => (
                      <article key={theme.id} className="rounded-xl border border-white/10 bg-black/20 p-3">
                        <h5 className="font-semibold text-white">{theme.title}</h5>
                        <p className="mt-2 text-xs text-white/70">
                          Eixos: {theme.axes.join(' • ')}
                        </p>
                        <p className="mt-1 text-xs text-white/50">{theme.inspiration}</p>
                      </article>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <>
                <div className="mt-6 flex flex-wrap gap-3 text-xs">
                  <span className="rounded-full border border-purple/30 bg-purple/15 px-3 py-1 text-purple-light">
                    {activeAreaQuestions.length} questões oficiais em português carregadas
                  </span>
                  {activeAreaId && activeAreaId !== 'redacao' && (
                    <>
                      <span className="rounded-full border border-white/20 bg-white/5 px-3 py-1 text-white/80">
                        Respondidas na sessão: {progress.areaProgress[activeAreaId].answered}
                      </span>
                      <span className="rounded-full border border-white/20 bg-white/5 px-3 py-1 text-white/80">
                        Acertos na sessão: {progress.areaProgress[activeAreaId].correct}
                      </span>
                    </>
                  )}
                  {activeAreaApiState?.totalEstimate ? (
                    <span className="rounded-full border border-white/20 bg-white/5 px-3 py-1 text-white/80">
                      Base estimada: {activeAreaApiState.totalEstimate} itens na API
                    </span>
                  ) : null}
                </div>

                {activeAreaApiState?.error && (
                  <p className="mt-4 rounded-xl border border-red-400/40 bg-red-500/15 px-4 py-2 text-sm text-red-100">
                    {activeAreaApiState.error}
                  </p>
                )}

                <div className="mt-6 space-y-3">
                  {activeAreaQuestions.slice(0, visibleQuestionCount).map((question) => (
                    <article
                      key={`${question.year}-${question.index}-${question.discipline}-${question.language}`}
                      className="rounded-2xl border border-white/10 bg-black/20 p-4"
                    >
                      <p className="text-xs text-white/50">ENEM {question.year} • Questão {question.index}</p>
                      <h4 className="mt-1 font-semibold text-white">{question.title}</h4>
                      <p className="mt-2 text-sm text-white/75">{sanitizeQuestionContext(question.context)}</p>
                      <p className="mt-3 text-xs text-white/45">
                        Alternativas: {question.alternatives.length} • Disciplina: {question.discipline}
                      </p>

                      <div className="mt-4 space-y-2">
                        {question.alternatives.slice(0, 5).map((alternative, index) => {
                          const answer = questionResponses[getQuestionKey(question)];
                          const hasAnswered = Boolean(answer);
                          const isSelected = answer?.selected === index;
                          const isCorrectOption = alternative.isCorrect;

                          return (
                            <button
                              key={`${getQuestionKey(question)}-${alternative.letter}`}
                              type="button"
                              disabled={hasAnswered}
                              onClick={() => handleAreaQuestionAnswer(question, index)}
                              className={`w-full rounded-xl border px-3 py-2 text-left text-sm transition ${hasAnswered
                                ? isCorrectOption
                                  ? 'border-green-500/60 bg-green-500/10 text-green-100'
                                  : isSelected
                                    ? 'border-red-500/60 bg-red-500/10 text-red-100'
                                    : 'border-white/10 bg-white/5 text-white/50'
                                : 'border-white/10 bg-white/5 text-white/80 hover:border-purple/40 hover:bg-purple/10'
                                }`}
                            >
                              {alternative.letter}){' '}
                              {sanitizeQuestionContext(alternative.text || 'Alternativa com imagem')}
                            </button>
                          );
                        })}

                        {questionResponses[getQuestionKey(question)] && (
                          <p
                            className={`text-xs font-semibold ${questionResponses[getQuestionKey(question)].correct
                              ? 'text-green-300'
                              : 'text-red-300'
                              }`}
                          >
                            {questionResponses[getQuestionKey(question)].correct
                              ? 'Resposta correta! +20 XP'
                              : 'Resposta incorreta. +5 XP pela tentativa'}
                          </p>
                        )}
                      </div>
                    </article>
                  ))}
                </div>

                {activeAreaQuestions.length === 0 && !isApiLoading && (
                  <p className="mt-6 rounded-xl border border-white/10 bg-white/5 p-4 text-sm text-white/70">
                    Nenhuma questão oficial carregada ainda para esta área.
                  </p>
                )}

                <div className="mt-6 flex flex-wrap gap-3">
                  {activeAreaApiState?.loading ? (
                    <span className="inline-flex items-center gap-2 rounded-xl border border-white/20 px-4 py-2 text-sm text-white/70">
                      <LoaderCircle className="h-4 w-4 animate-spin" />
                      Carregando questões...
                    </span>
                  ) : null}

                  {visibleQuestionCount < activeAreaQuestions.length ? (
                    <button
                      type="button"
                      onClick={() => setVisibleQuestionCount((current) => current + 6)}
                      className="rounded-xl border border-white/20 px-4 py-2 text-sm font-semibold text-white/80 transition hover:border-gold hover:text-gold"
                    >
                      Ver mais questões carregadas
                    </button>
                  ) : null}

                  {activeAreaApiState?.hasMore && (
                    <button
                      type="button"
                      onClick={handleLoadMore}
                      disabled={activeAreaApiState.loading}
                      className="rounded-xl border border-gold/50 bg-gold/15 px-4 py-2 text-sm font-semibold text-gold transition hover:bg-gold/20 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {activeAreaApiState.loading ? 'Sincronizando...' : 'Buscar mais questões oficiais'}
                    </button>
                  )}

                  {!activeAreaApiState?.hasMore && activeAreaQuestions.length > 0 ? (
                    <span className="rounded-xl border border-white/20 px-4 py-2 text-sm text-white/70">
                      Você já carregou todo o conteúdo disponível para esta área.
                    </span>
                  ) : null}
                </div>

                {activeAreaQuestions.length === 0 && !activeAreaApiState?.loading && (
                  <button
                    type="button"
                    onClick={() => {
                      if (activeAreaId && activeAreaId !== 'redacao') {
                        void loadAreaQuestions(activeAreaId, true);
                      }
                    }}
                    className="rounded-xl border border-gold/50 bg-gold/15 px-4 py-2 text-sm font-semibold text-gold transition hover:bg-gold/20"
                  >
                    Carregar questões oficiais agora
                  </button>
                )}
              </>
            )}
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6"
        >
          {[
            {
              label: 'Questões Oficiais',
              value: allOfficialQuestions.length.toLocaleString('pt-BR'),
              icon: '📝',
            },
            { label: 'Ano de Referência', value: latestYear ?? '-', icon: '📅' },
            {
              label: 'Áreas com Conteúdo',
              value: enrichedAreas.filter((area) => area.officialLoaded > 0).length,
              icon: '📚',
            },
            { label: 'Matérias Oficiais', value: officialSubjectsCount, icon: '🎯' },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.5, delay: 0.8 + index * 0.1 }}
              className="glass rounded-xl p-4 text-center border border-purple/10"
            >
              <div className="text-3xl mb-2">{stat.icon}</div>
              <div className="font-poppins font-bold text-2xl text-white mb-1">{stat.value}</div>
              <div className="text-white/50 text-sm">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
