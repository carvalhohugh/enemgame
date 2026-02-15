import { AnimatePresence, motion } from 'framer-motion';
import {
  BookOpenCheck,
  CheckCircle2,
  GraduationCap,
  LayoutDashboard,
  LoaderCircle,
  LogOut,
  PenLine,
  Sparkles,
  Target,
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import type { FormEvent } from 'react';
import type { User as SupabaseUser } from '@supabase/supabase-js';
import {
  fetchAllEnemQuestions,
  fetchEnemExams,
  type EnemExam,
  type EnemQuestion,
} from '@/services/enemApi';
import {
  baseEssayThemes,
  buildThemesFromQuestions,
  mecCompetencies,
  type EssayTheme,
} from '@/data/redacao';
import { supabase, supabaseConfigError } from '@/lib/supabase';
import AreasSection from '@/components/custom/AreasSection';
import AppErrorBoundary from '@/components/custom/AppErrorBoundary';
import BadgesSection from '@/components/custom/BadgesSection';
import Footer from '@/components/custom/Footer';
import HeroDashboard from '@/components/custom/HeroDashboard';
import RankingSection from '@/components/custom/RankingSection';
import SimuladoSection from '@/components/custom/SimuladoSection';

interface AuthUser {
  name: string;
  email: string;
}

type Screen = 'landing' | 'login' | 'dashboard';
type DashboardTab = 'plataforma' | 'questoes' | 'redacao';
type AuthMode = 'signin' | 'signup';

const THEME_HISTORY_STORAGE_KEY = 'enemhugo.theme-history';

function sanitizeContext(value: string): string {
  const withoutMarkdown = value
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
    .replace(/\[[^\]]*\]\([^)]*\)/g, ' ')
    .replace(/[>#*_`~]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  return withoutMarkdown.length > 320 ? `${withoutMarkdown.slice(0, 320)}...` : withoutMarkdown;
}

function isPortugueseQuestion(question: EnemQuestion): boolean {
  const language = question.language?.toLowerCase().trim();
  return !language || language === 'portugues' || language === 'pt-br' || language === 'ptbr';
}

function loadThemeHistory(): string[] {
  const raw = localStorage.getItem(THEME_HISTORY_STORAGE_KEY);

  if (!raw) {
    return [];
  }

  try {
    const parsed = JSON.parse(raw) as unknown;
    return Array.isArray(parsed) ? parsed.filter((item): item is string => typeof item === 'string') : [];
  } catch {
    return [];
  }
}

function dedupeThemes(themes: EssayTheme[]): EssayTheme[] {
  const seen = new Set<string>();
  const unique: EssayTheme[] = [];

  themes.forEach((theme) => {
    if (seen.has(theme.id)) {
      return;
    }

    seen.add(theme.id);
    unique.push(theme);
  });

  return unique;
}

function mapSupabaseUser(user: SupabaseUser): AuthUser {
  const metadataName =
    typeof user.user_metadata?.full_name === 'string' ? user.user_metadata.full_name.trim() : '';
  const email = user.email ?? '';
  const fallbackName = email.split('@')[0] || 'Aluno';

  return {
    name: metadataName || fallbackName,
    email,
  };
}

function App() {
  const [authReady, setAuthReady] = useState(false);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [screen, setScreen] = useState<Screen>('landing');
  const [activeTab, setActiveTab] = useState<DashboardTab>('questoes');

  const [authMode, setAuthMode] = useState<AuthMode>('signin');
  const [authLoading, setAuthLoading] = useState(false);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [authMessage, setAuthMessage] = useState('');

  const [exams, setExams] = useState<EnemExam[]>([]);
  const [examsLoading, setExamsLoading] = useState(false);
  const [examsError, setExamsError] = useState('');

  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [selectedDiscipline, setSelectedDiscipline] = useState('all');

  const [questions, setQuestions] = useState<EnemQuestion[]>([]);
  const [questionsLoading, setQuestionsLoading] = useState(false);
  const [questionsError, setQuestionsError] = useState('');
  const [visibleQuestions, setVisibleQuestions] = useState(6);

  const [usedThemeIds, setUsedThemeIds] = useState<string[]>(() => loadThemeHistory());
  const [currentTheme, setCurrentTheme] = useState<EssayTheme | null>(null);

  const selectedExam = useMemo(
    () => exams.find((exam) => exam.year === selectedYear) ?? null,
    [exams, selectedYear],
  );

  const availableDisciplines = useMemo(() => {
    if (!selectedExam) {
      return [];
    }

    return selectedExam.disciplines;
  }, [selectedExam]);

  const filteredQuestions = useMemo(() => {
    if (selectedDiscipline === 'all') {
      return questions;
    }

    return questions.filter((question) => question.discipline === selectedDiscipline);
  }, [questions, selectedDiscipline]);

  const allThemes = useMemo(() => {
    const fromApi = buildThemesFromQuestions(filteredQuestions);
    return dedupeThemes([...fromApi, ...baseEssayThemes]);
  }, [filteredQuestions]);

  useEffect(() => {
    const client = supabase;

    if (!client) {
      setAuthReady(true);
      return;
    }

    let isMounted = true;

    const syncCurrentSession = async () => {
      const { data, error } = await client.auth.getSession();

      if (!isMounted) {
        return;
      }

      if (error) {
        setLoginError(error.message);
      }

      if (data.session?.user) {
        setUser(mapSupabaseUser(data.session.user));
        setScreen('dashboard');
      } else {
        setUser(null);
        setScreen('landing');
      }

      setAuthReady(true);
    };

    void syncCurrentSession();

    const {
      data: { subscription },
    } = client.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser(mapSupabaseUser(session.user));
        setScreen('dashboard');
        return;
      }

      setUser(null);
      setScreen('landing');
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (!user || screen !== 'dashboard') {
      return;
    }

    const loadExams = async () => {
      setExamsLoading(true);
      setExamsError('');

      try {
        const examData = await fetchEnemExams();
        setExams(examData);
      } catch (error) {
        setExamsError(error instanceof Error ? error.message : 'Erro ao carregar provas.');
      } finally {
        setExamsLoading(false);
      }
    };

    void loadExams();
  }, [screen, user]);

  useEffect(() => {
    if (selectedYear || exams.length === 0) {
      return;
    }

    const first = exams[0];
    setSelectedYear(first.year);
  }, [exams, selectedYear]);

  useEffect(() => {
    if (!user || !selectedYear || screen !== 'dashboard') {
      return;
    }

    const loadQuestions = async () => {
      setQuestionsLoading(true);
      setQuestionsError('');

      try {
        const response = await fetchAllEnemQuestions(selectedYear);
        const portugueseQuestions = response.filter(isPortugueseQuestion);

        setQuestions(portugueseQuestions);
        setVisibleQuestions(6);
      } catch (error) {
        setQuestionsError(error instanceof Error ? error.message : 'Erro ao carregar questoes.');
      } finally {
        setQuestionsLoading(false);
      }
    };

    void loadQuestions();
  }, [screen, selectedYear, user]);

  useEffect(() => {
    setSelectedDiscipline('all');
  }, [selectedYear]);

  useEffect(() => {
    localStorage.setItem(THEME_HISTORY_STORAGE_KEY, JSON.stringify(usedThemeIds));
  }, [usedThemeIds]);

  useEffect(() => {
    if (allThemes.length === 0) {
      setCurrentTheme(null);
      return;
    }

    const hasCurrentTheme = currentTheme ? allThemes.some((theme) => theme.id === currentTheme.id) : false;

    if (hasCurrentTheme) {
      return;
    }

    const available = allThemes.filter((theme) => !usedThemeIds.includes(theme.id));
    const pool = available.length > 0 ? available : allThemes;
    const picked = pool[Math.floor(Math.random() * pool.length)];

    setCurrentTheme(picked);
    setUsedThemeIds((current) => {
      if (available.length === 0) {
        return [picked.id];
      }

      return [...current, picked.id];
    });
  }, [allThemes, currentTheme, usedThemeIds]);

  const handleThemeRefresh = () => {
    if (allThemes.length === 0) {
      return;
    }

    const available = allThemes.filter((theme) => !usedThemeIds.includes(theme.id));
    const pool = available.length > 0 ? available : allThemes;
    const picked = pool[Math.floor(Math.random() * pool.length)];

    setCurrentTheme(picked);

    if (available.length === 0) {
      setUsedThemeIds([picked.id]);
      return;
    }

    setUsedThemeIds((current) => [...current, picked.id]);
  };

  const handleLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoginError('');
    setAuthMessage('');

    if (!supabase) {
      setLoginError(supabaseConfigError || 'Supabase nao configurado.');
      return;
    }

    if (!email.includes('@')) {
      setLoginError('Digite um e-mail valido.');
      return;
    }

    if (password.trim().length < 6) {
      setLoginError('A senha precisa ter pelo menos 6 caracteres.');
      return;
    }

    setAuthLoading(true);

    try {
      if (authMode === 'signin') {
        const { error } = await supabase.auth.signInWithPassword({
          email: email.trim().toLowerCase(),
          password,
        });

        if (error) {
          setLoginError(error.message);
          return;
        }

        setPassword('');
        return;
      }

      const normalizedName = fullName.trim();
      const { data, error } = await supabase.auth.signUp({
        email: email.trim().toLowerCase(),
        password,
        options: {
          data: {
            full_name: normalizedName,
          },
        },
      });

      if (error) {
        setLoginError(error.message);
        return;
      }

      if (!data.session) {
        setAuthMessage('Conta criada. Verifique seu e-mail para confirmar e depois faca login.');
        setAuthMode('signin');
      }

      setPassword('');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = async () => {
    if (!supabase) {
      setUser(null);
      setScreen('landing');
      return;
    }

    await supabase.auth.signOut();
  };

  if (!authReady) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-dark text-white">
        <p className="inline-flex items-center gap-2 text-sm text-white/80">
          <LoaderCircle className="h-4 w-4 animate-spin" />
          Carregando sessao...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark text-white overflow-x-hidden">
      <AnimatePresence mode="wait">
        {screen === 'landing' && (
          <motion.section
            key="landing"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="relative min-h-screen px-6 py-10 md:px-10 lg:px-16"
          >
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute -top-32 -left-24 h-80 w-80 rounded-full bg-purple/30 blur-3xl" />
              <div className="absolute bottom-0 right-0 h-72 w-72 rounded-full bg-gold/25 blur-3xl" />
            </div>

            <header className="relative z-10 mx-auto flex w-full max-w-6xl items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-purple to-purple-light">
                  <GraduationCap className="h-6 w-6" />
                </div>
                <div>
                  <p className="font-poppins text-lg font-semibold">EnemHugo</p>
                  <p className="text-xs text-white/60">Plataforma gratuita para o ENEM</p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  setLoginError('');
                  setAuthMessage('');
                  setScreen('login');
                }}
                className="btn-primary"
              >
                Entrar
              </button>
            </header>

            <main className="relative z-10 mx-auto mt-14 grid w-full max-w-6xl gap-10 lg:grid-cols-[1.2fr_1fr]">
              <div>
                <p className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-4 py-1 text-sm text-white/80">
                  <Sparkles className="h-4 w-4 text-gold" />
                  Questoes reais do ENEM conectadas por API
                </p>

                <h1 className="mt-6 font-poppins text-4xl font-extrabold leading-tight md:text-6xl">
                  Treine com dados reais,
                  <span className="text-gradient"> evolua sua nota</span>
                  , sem pagar nada.
                </h1>

                <p className="mt-6 max-w-xl text-lg text-white/75">
                  Pratique por area, acompanhe o nivel de dificuldade e prepare sua redacao com os criterios oficiais
                  do MEC/INEP. O acesso e gratuito, com login para salvar sua jornada.
                </p>

                <div className="mt-8 flex flex-wrap gap-4">
                  <button
                    type="button"
                    onClick={() => {
                      setLoginError('');
                      setAuthMessage('');
                      setScreen('login');
                    }}
                    className="btn-primary"
                  >
                    Comecar gratis
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setLoginError('');
                      setAuthMessage('');
                      setScreen('login');
                    }}
                    className="rounded-xl border border-white/20 px-6 py-3 font-semibold transition hover:border-gold hover:text-gold"
                  >
                    Ja tenho conta
                  </button>
                </div>

                <div className="mt-10 grid gap-4 sm:grid-cols-3">
                  {[
                    { label: 'Questoes reais', value: '+180 por ano' },
                    { label: 'Competencias da redacao', value: '5 criterios oficiais' },
                    { label: 'Custo', value: '100% gratuito' },
                  ].map((item) => (
                    <article key={item.label} className="glass rounded-2xl p-4">
                      <p className="text-xs uppercase tracking-widest text-white/55">{item.label}</p>
                      <p className="mt-2 font-poppins text-lg font-bold text-gold">{item.value}</p>
                    </article>
                  ))}
                </div>
              </div>

              <motion.aside
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="glass rounded-3xl p-6"
              >
                <h2 className="font-poppins text-2xl font-bold">Como funciona</h2>
                <div className="mt-6 space-y-4">
                  {[
                    '1. Faca login gratuito para acessar o conteudo completo.',
                    '2. Escolha ano, idioma e disciplina para resolver questoes reais.',
                    '3. Treine redacao com proposta de tema nova sempre que quiser.',
                  ].map((step) => (
                    <p key={step} className="rounded-xl border border-white/10 bg-white/5 p-4 text-white/80">
                      {step}
                    </p>
                  ))}
                </div>
              </motion.aside>
            </main>
          </motion.section>
        )}

        {screen === 'login' && (
          <motion.section
            key="login"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex min-h-screen items-center justify-center px-6 py-10"
          >
            <div className="glass w-full max-w-md rounded-3xl p-8">
              <h2 className="font-poppins text-3xl font-bold">Entrar na plataforma</h2>
              <p className="mt-2 text-white/70">Acesso gratuito com Supabase Auth.</p>

              <div className="mt-4 grid grid-cols-2 gap-2 rounded-xl border border-white/10 bg-white/5 p-1">
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode('signin');
                    setLoginError('');
                    setAuthMessage('');
                  }}
                  className={`rounded-lg px-3 py-2 text-sm font-semibold transition ${
                    authMode === 'signin' ? 'bg-purple text-white' : 'text-white/75'
                  }`}
                >
                  Login
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode('signup');
                    setLoginError('');
                    setAuthMessage('');
                  }}
                  className={`rounded-lg px-3 py-2 text-sm font-semibold transition ${
                    authMode === 'signup' ? 'bg-purple text-white' : 'text-white/75'
                  }`}
                >
                  Cadastro
                </button>
              </div>

              <form className="mt-6 space-y-4" onSubmit={(event) => void handleLogin(event)}>
                {authMode === 'signup' && (
                  <label className="block text-sm text-white/75">
                    Nome (opcional)
                    <input
                      type="text"
                      value={fullName}
                      onChange={(event) => setFullName(event.target.value)}
                      placeholder="Seu nome"
                      className="mt-1 w-full rounded-xl border border-white/20 bg-white/5 px-4 py-3 outline-none transition focus:border-gold"
                    />
                  </label>
                )}

                <label className="block text-sm text-white/75">
                  E-mail
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="aluno@email.com"
                    className="mt-1 w-full rounded-xl border border-white/20 bg-white/5 px-4 py-3 outline-none transition focus:border-gold"
                  />
                </label>

                <label className="block text-sm text-white/75">
                  Senha
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="Minimo 6 caracteres"
                    className="mt-1 w-full rounded-xl border border-white/20 bg-white/5 px-4 py-3 outline-none transition focus:border-gold"
                  />
                </label>

                {supabaseConfigError && (
                  <p className="rounded-lg border border-amber-300/40 bg-amber-500/15 px-3 py-2 text-sm text-amber-100">
                    {supabaseConfigError}
                  </p>
                )}

                {loginError && (
                  <p className="rounded-lg border border-red-400/40 bg-red-500/15 px-3 py-2 text-sm text-red-100">{loginError}</p>
                )}

                {authMessage && (
                  <p className="rounded-lg border border-emerald-300/40 bg-emerald-500/15 px-3 py-2 text-sm text-emerald-100">
                    {authMessage}
                  </p>
                )}

                <button type="submit" disabled={authLoading} className="btn-primary w-full disabled:opacity-60">
                  {authLoading ? (
                    <span className="inline-flex items-center gap-2">
                      <LoaderCircle className="h-4 w-4 animate-spin" />
                      Processando...
                    </span>
                  ) : authMode === 'signin' ? (
                    'Entrar gratis'
                  ) : (
                    'Criar conta gratis'
                  )}
                </button>
              </form>

              <button
                type="button"
                onClick={() => setScreen('landing')}
                className="mt-4 w-full rounded-xl border border-white/20 px-4 py-3 text-sm transition hover:border-white/40"
              >
                Voltar para landing page
              </button>
            </div>
          </motion.section>
        )}

        {screen === 'dashboard' && user && (
          <motion.section
            key="dashboard"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="min-h-screen px-5 py-6 md:px-10"
          >
            <header className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-sm text-white/60">Bem-vindo(a), {user.name}</p>
                <h2 className="font-poppins text-3xl font-bold">Painel ENEM gratuito</h2>
              </div>
              <button
                type="button"
                onClick={() => void handleLogout()}
                className="inline-flex items-center gap-2 rounded-xl border border-white/25 px-4 py-2 text-sm transition hover:border-gold hover:text-gold"
              >
                <LogOut className="h-4 w-4" />
                Sair
              </button>
            </header>

            <nav className="mx-auto mt-7 flex w-full max-w-6xl gap-3">
              <button
                type="button"
                onClick={() => setActiveTab('plataforma')}
                className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition ${
                  activeTab === 'plataforma' ? 'bg-purple text-white' : 'border border-white/20 text-white/75 hover:border-white/40'
                }`}
              >
                <LayoutDashboard className="h-4 w-4" />
                Plataforma original
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('questoes')}
                className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition ${
                  activeTab === 'questoes' ? 'bg-purple text-white' : 'border border-white/20 text-white/75 hover:border-white/40'
                }`}
              >
                <BookOpenCheck className="h-4 w-4" />
                Questoes reais
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('redacao')}
                className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition ${
                  activeTab === 'redacao' ? 'bg-purple text-white' : 'border border-white/20 text-white/75 hover:border-white/40'
                }`}
              >
                <PenLine className="h-4 w-4" />
                Redacao
              </button>
            </nav>

            <main className={activeTab === 'plataforma' ? 'mt-6' : 'mx-auto mt-6 w-full max-w-6xl'}>
              {activeTab === 'plataforma' && (
                <AppErrorBoundary onReset={() => setActiveTab('questoes')}>
                  <HeroDashboard />
                  <AreasSection />
                  <SimuladoSection />
                  <RankingSection />
                  <BadgesSection />
                  <Footer />
                </AppErrorBoundary>
              )}

              {activeTab === 'questoes' && (
                <section className="space-y-6">
                  <div className="glass rounded-3xl p-5 md:p-6">
                    <h3 className="font-poppins text-xl font-bold">Conteudo oficial do ENEM por API</h3>
                    <p className="mt-2 text-sm text-white/70">
                      Fonte: api.enem.dev. Escolha ano e disciplina para estudar com questoes reais.
                    </p>

                    <div className="mt-5 grid gap-3 md:grid-cols-2">
                      <label className="text-sm text-white/70">
                        Ano da prova
                        <select
                          value={selectedYear ?? ''}
                          onChange={(event) => setSelectedYear(Number(event.target.value))}
                          className="mt-1 w-full rounded-xl border border-white/20 bg-dark-surface px-3 py-2 outline-none"
                        >
                          {exams.map((exam) => (
                            <option key={exam.year} value={exam.year}>
                              {exam.title}
                            </option>
                          ))}
                        </select>
                      </label>

                      <label className="text-sm text-white/70">
                        Disciplina
                        <select
                          value={selectedDiscipline}
                          onChange={(event) => setSelectedDiscipline(event.target.value)}
                          className="mt-1 w-full rounded-xl border border-white/20 bg-dark-surface px-3 py-2 outline-none"
                        >
                          <option value="all">Todas</option>
                          {availableDisciplines.map((discipline) => (
                            <option key={discipline.value} value={discipline.value}>
                              {discipline.label}
                            </option>
                          ))}
                        </select>
                      </label>
                    </div>

                    <div className="mt-5 flex flex-wrap gap-3 text-sm">
                      <span className="rounded-full bg-purple/20 px-3 py-1 text-purple-light">
                        {filteredQuestions.length} questoes no filtro atual
                      </span>
                      <span className="rounded-full bg-white/10 px-3 py-1 text-white/80">
                        Idioma fixo: Portugues (Brasil)
                      </span>
                      <span className="rounded-full bg-gold/20 px-3 py-1 text-gold">Fonte em tempo real</span>
                    </div>

                    {examsLoading && <p className="mt-4 text-white/60">Carregando provas...</p>}
                    {examsError && (
                      <p className="mt-4 rounded-lg border border-red-400/40 bg-red-500/15 px-4 py-3 text-sm text-red-100">{examsError}</p>
                    )}
                    {questionsLoading && <p className="mt-4 text-white/60">Carregando questoes reais...</p>}
                    {questionsError && (
                      <p className="mt-4 rounded-lg border border-red-400/40 bg-red-500/15 px-4 py-3 text-sm text-red-100">{questionsError}</p>
                    )}
                  </div>

                  <div className="grid gap-4">
                    {filteredQuestions.slice(0, visibleQuestions).map((question) => (
                      <article key={`${question.year}-${question.index}-${question.language}`} className="glass rounded-2xl p-5">
                        <header className="flex flex-wrap items-center gap-2 text-xs text-white/70">
                          <span className="rounded-full bg-white/10 px-2 py-1">{question.title}</span>
                          <span className="rounded-full bg-white/10 px-2 py-1">{question.discipline}</span>
                          <span className="rounded-full bg-white/10 px-2 py-1">Idioma: Portugues (Brasil)</span>
                        </header>

                        <p className="mt-3 text-sm text-white/85">{sanitizeContext(question.context)}</p>

                        <div className="mt-4 rounded-xl border border-white/10 bg-black/20 p-3">
                          <p className="text-sm font-semibold text-white/85">{question.alternativesIntroduction}</p>
                          <ul className="mt-2 space-y-2 text-sm text-white/80">
                            {question.alternatives.map((alternative) => (
                              <li key={`${question.index}-${alternative.letter}`} className="flex gap-2">
                                <span className="font-semibold text-gold">{alternative.letter})</span>
                                <span>{alternative.text}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </article>
                    ))}

                    {!questionsLoading && filteredQuestions.length === 0 && (
                      <p className="rounded-2xl border border-white/10 bg-white/5 p-5 text-sm text-white/70">
                        Nenhuma questao encontrada nesse filtro. Tente outro ano ou disciplina.
                      </p>
                    )}

                    {visibleQuestions < filteredQuestions.length && (
                      <button
                        type="button"
                        onClick={() => setVisibleQuestions((current) => current + 6)}
                        className="mx-auto rounded-xl border border-white/20 px-5 py-3 text-sm font-semibold transition hover:border-gold hover:text-gold"
                      >
                        Carregar mais questoes
                      </button>
                    )}
                  </div>
                </section>
              )}

              {activeTab === 'redacao' && (
                <section className="grid gap-6 lg:grid-cols-[1.1fr_1fr]">
                  <div className="glass rounded-3xl p-6">
                    <div className="flex items-center justify-between gap-3">
                      <h3 className="font-poppins text-2xl font-bold">Criterios de avaliacao MEC/INEP</h3>
                      <span className="rounded-full bg-gold/20 px-3 py-1 text-xs font-semibold text-gold">Nota total: 1000</span>
                    </div>

                    <div className="mt-5 space-y-3">
                      {mecCompetencies.map((competency) => (
                        <article key={competency.id} className="rounded-2xl border border-white/10 bg-black/20 p-4">
                          <p className="text-sm font-semibold text-gold">
                            Competencia {competency.id} - {competency.scoreRange}
                          </p>
                          <h4 className="mt-1 font-poppins text-lg font-semibold">{competency.title}</h4>
                          <p className="mt-2 text-sm text-white/75">{competency.description}</p>
                        </article>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-5">
                    <div className="glass-purple rounded-3xl p-6">
                      <div className="flex items-center justify-between gap-3">
                        <h3 className="font-poppins text-xl font-bold">Tema de redacao sugerido</h3>
                        <button
                          type="button"
                          onClick={handleThemeRefresh}
                          className="inline-flex items-center gap-2 rounded-xl bg-gold px-3 py-2 text-xs font-semibold text-dark transition hover:bg-gold-light"
                        >
                          <Target className="h-4 w-4" />
                          Novo tema
                        </button>
                      </div>

                      {currentTheme ? (
                        <>
                          <h4 className="mt-4 font-poppins text-2xl font-bold leading-tight">{currentTheme.title}</h4>
                          <p className="mt-2 text-sm text-white/80">{currentTheme.inspiration}</p>

                          <div className="mt-4 flex flex-wrap gap-2">
                            {currentTheme.axes.map((axis) => (
                              <span key={axis} className="rounded-full border border-white/25 px-3 py-1 text-xs text-white/90">
                                {axis}
                              </span>
                            ))}
                          </div>

                          <p className="mt-4 text-xs text-white/60">
                            O sistema evita repeticao ate percorrer todos os temas disponiveis.
                          </p>
                        </>
                      ) : (
                        <p className="mt-4 text-sm text-white/75">Carregando sugestoes de tema...</p>
                      )}
                    </div>

                    <div className="glass rounded-3xl p-6">
                      <h4 className="font-poppins text-lg font-bold">Checklist rapido para nota alta</h4>
                      <ul className="mt-4 space-y-3 text-sm text-white/80">
                        {[
                          'Defina uma tese clara logo na introducao.',
                          'Use repertorio sociocultural pertinente ao tema.',
                          'Conecte os paragrafos com coesao e progressao.',
                          'Feche com proposta de intervencao completa.',
                        ].map((item) => (
                          <li key={item} className="flex items-start gap-2">
                            <CheckCircle2 className="mt-0.5 h-4 w-4 text-gold" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </section>
              )}
            </main>
          </motion.section>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
