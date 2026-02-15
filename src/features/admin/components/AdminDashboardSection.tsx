import { useCallback, useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  AlertTriangle,
  BarChart3,
  CheckCircle2,
  LoaderCircle,
  RefreshCw,
  Search,
  ShieldCheck,
  Users,
} from 'lucide-react';
import { useAuthProfile } from '@/context/AuthProfileContext';
import {
  fetchAdminDashboardPayload,
  type AdminArea,
  type StudentAdminRecord,
  type StudentStatus,
} from '@/services/adminApi';

const DEFAULT_ADMIN_YEAR = 2025;

const areaLabels: Record<AdminArea, string> = {
  humanas: 'Humanas',
  natureza: 'Natureza',
  linguagens: 'Linguagens',
  matematica: 'Matemática',
  redacao: 'Redação',
};

const statusLabels: Record<StudentStatus, string> = {
  aprovado: 'Aprovado',
  recuperacao: 'Recuperação',
  em_risco: 'Em risco',
  sem_registro: 'Sem registro',
};

const statusStyles: Record<StudentStatus, string> = {
  aprovado: 'border-green-500/40 bg-green-500/15 text-green-300',
  recuperacao: 'border-amber-500/40 bg-amber-500/15 text-amber-300',
  em_risco: 'border-red-500/40 bg-red-500/15 text-red-300',
  sem_registro: 'border-white/20 bg-white/5 text-white/60',
};

function formatDate(value: string | null): string {
  if (!value) {
    return 'Sem atividade';
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return 'Data inválida';
  }

  return date.toLocaleDateString('pt-BR');
}

function summarize(students: StudentAdminRecord[]) {
  const totalStudents = students.length;
  const withGrades = students.filter((student) => student.averageScore !== null);
  const avgGrade = withGrades.length
    ? Math.round(
        withGrades.reduce((sum, student) => sum + (student.averageScore ?? 0), 0) / withGrades.length,
      )
    : 0;
  const approvedCount = students.filter((student) => student.status === 'aprovado').length;
  const riskCount = students.filter((student) => student.status === 'em_risco').length;
  const approvalRate = totalStudents ? Math.round((approvedCount / totalStudents) * 100) : 0;

  return {
    totalStudents,
    avgGrade,
    approvedCount,
    riskCount,
    approvalRate,
  };
}

export default function AdminDashboardSection() {
  const { profile } = useAuthProfile();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [students, setStudents] = useState<StudentAdminRecord[]>([]);
  const [availableYears, setAvailableYears] = useState<number[]>([DEFAULT_ADMIN_YEAR]);
  const [selectedYear, setSelectedYear] = useState<number>(DEFAULT_ADMIN_YEAR);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | StudentStatus>('all');
  const [areaFilter, setAreaFilter] = useState<'all' | AdminArea>('all');
  const [accuracyFilter, setAccuracyFilter] = useState<'all' | '50' | '70' | '85'>('all');

  const loadDashboard = useCallback(async () => {
    if (!profile.isAdmin) {
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const payload = await fetchAdminDashboardPayload(selectedYear);
      setStudents(payload.students);

      if (payload.availableYears.length > 0) {
        setAvailableYears(payload.availableYears);
      }
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'Falha ao carregar o painel administrativo.');
    } finally {
      setIsLoading(false);
    }
  }, [profile.isAdmin, selectedYear]);

  useEffect(() => {
    void loadDashboard();
  }, [loadDashboard]);

  const filteredStudents = useMemo(() => {
    return students.filter((student) => {
      const matchSearch =
        search.trim().length === 0 ||
        student.name.toLowerCase().includes(search.toLowerCase()) ||
        student.email.toLowerCase().includes(search.toLowerCase());

      const matchStatus = statusFilter === 'all' || student.status === statusFilter;
      const matchArea = areaFilter === 'all' || student.areaScores[areaFilter] !== undefined;
      const matchAccuracy =
        accuracyFilter === 'all' || student.accuracy >= Number(accuracyFilter);

      return matchSearch && matchStatus && matchArea && matchAccuracy;
    });
  }, [accuracyFilter, areaFilter, search, statusFilter, students]);

  const metrics = useMemo(() => summarize(filteredStudents), [filteredStudents]);

  if (!profile.isAdmin) {
    return null;
  }

  return (
    <section id="admin" className="relative py-24 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
        <div className="absolute right-10 top-20 h-72 w-72 rounded-full bg-gold/10 blur-[140px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-10"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-gold/30 bg-gold/15 px-4 py-2">
            <ShieldCheck className="h-4 w-4 text-gold" />
            <span className="text-sm font-medium text-gold">Painel Administrativo</span>
          </div>
          <h2 className="mt-4 font-poppins text-4xl font-bold text-white sm:text-5xl">
            Gestão Educacional
          </h2>
          <p className="mt-3 max-w-3xl text-white/65">
            Visão completa de alunos cadastrados, desempenho por nota e monitoramento pedagógico.
          </p>
          <p className="mt-2 text-xs text-white/45">
            Acesso autorizado para: hugocamposdecarvalho@gmail.com e roosevelt.miranda@gmail.com
          </p>
        </motion.div>

        <div className="glass mb-6 rounded-2xl border border-white/10 p-4">
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-5">
            <label className="relative lg:col-span-2">
              <Search className="pointer-events-none absolute left-3 top-3.5 h-4 w-4 text-white/40" />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Buscar aluno por nome ou e-mail"
                className="w-full rounded-xl border border-white/15 bg-black/20 py-3 pl-10 pr-3 text-sm text-white placeholder:text-white/35 focus:border-gold/40 focus:outline-none"
              />
            </label>

            <select
              value={selectedYear}
              onChange={(event) => setSelectedYear(Number(event.target.value))}
              className="rounded-xl border border-white/15 bg-black/20 px-3 py-3 text-sm text-white focus:border-gold/40 focus:outline-none"
            >
              {[...new Set([DEFAULT_ADMIN_YEAR, ...availableYears])].map((year) => (
                <option key={year} value={year}>
                  ENEM {year}
                </option>
              ))}
            </select>

            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value as 'all' | StudentStatus)}
              className="rounded-xl border border-white/15 bg-black/20 px-3 py-3 text-sm text-white focus:border-gold/40 focus:outline-none"
            >
              <option value="all">Todos os status</option>
              {Object.entries(statusLabels).map(([status, label]) => (
                <option key={status} value={status}>
                  {label}
                </option>
              ))}
            </select>

            <select
              value={areaFilter}
              onChange={(event) => setAreaFilter(event.target.value as 'all' | AdminArea)}
              className="rounded-xl border border-white/15 bg-black/20 px-3 py-3 text-sm text-white focus:border-gold/40 focus:outline-none"
            >
              <option value="all">Todas as áreas</option>
              {Object.entries(areaLabels).map(([area, label]) => (
                <option key={area} value={area}>
                  {label}
                </option>
              ))}
            </select>
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-3">
            <label className="text-xs text-white/50">Acurácia mínima</label>
            <select
              value={accuracyFilter}
              onChange={(event) => setAccuracyFilter(event.target.value as 'all' | '50' | '70' | '85')}
              className="rounded-lg border border-white/15 bg-black/20 px-3 py-2 text-xs text-white focus:border-gold/40 focus:outline-none"
            >
              <option value="all">Sem filtro</option>
              <option value="50">50%+</option>
              <option value="70">70%+</option>
              <option value="85">85%+</option>
            </select>
            <button
              type="button"
              onClick={() => void loadDashboard()}
              className="inline-flex items-center gap-2 rounded-lg border border-white/20 px-3 py-2 text-xs font-semibold text-white/80 transition hover:border-gold/40 hover:text-gold"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              Atualizar dados
            </button>
          </div>
        </div>

        <div className="mb-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {[
            { label: 'Alunos', value: metrics.totalStudents, icon: Users, color: 'text-blue-300' },
            { label: 'Nota Média', value: metrics.avgGrade, icon: BarChart3, color: 'text-gold' },
            { label: 'Aprovados', value: metrics.approvedCount, icon: CheckCircle2, color: 'text-green-300' },
            { label: 'Em Risco', value: metrics.riskCount, icon: AlertTriangle, color: 'text-red-300' },
          ].map((card) => (
            <div key={card.label} className="glass rounded-2xl border border-white/10 p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-white/60">{card.label}</span>
                <card.icon className={`h-4 w-4 ${card.color}`} />
              </div>
              <p className="mt-3 font-poppins text-3xl font-bold text-white">{card.value}</p>
            </div>
          ))}
        </div>

        <div className="glass rounded-2xl border border-white/10 p-5">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
            <h3 className="font-poppins text-xl font-bold text-white">Alunos cadastrados</h3>
            <span className="rounded-full border border-white/20 px-3 py-1 text-xs text-white/70">
              Taxa de aprovação: {metrics.approvalRate}%
            </span>
          </div>

          {isLoading && (
            <div className="flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-sm text-white/70">
              <LoaderCircle className="h-4 w-4 animate-spin" />
              Carregando dados dos alunos...
            </div>
          )}

          {error && (
            <div className="rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-100">
              {error}
            </div>
          )}

          {!isLoading && !error && filteredStudents.length === 0 && (
            <div className="rounded-xl border border-white/15 bg-white/5 px-4 py-6 text-center text-sm text-white/70">
              Nenhum aluno encontrado com os filtros atuais.
            </div>
          )}

          {!isLoading && !error && filteredStudents.length > 0 && (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[980px] border-collapse">
                <thead>
                  <tr className="border-b border-white/10 text-left text-xs uppercase tracking-wide text-white/45">
                    <th className="px-3 py-3">Aluno</th>
                    <th className="px-3 py-3">Papel</th>
                    <th className="px-3 py-3">Nível/XP</th>
                    <th className="px-3 py-3">Acurácia</th>
                    <th className="px-3 py-3">Nota média</th>
                    <th className="px-3 py-3">Status</th>
                    <th className="px-3 py-3">Atualização</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStudents.map((student) => (
                    <tr key={student.userId} className="border-b border-white/5 text-sm">
                      <td className="px-3 py-3 align-top">
                        <p className="font-semibold text-white">{student.name}</p>
                        <p className="text-xs text-white/55">{student.email}</p>
                        <p className="mt-1 text-[11px] text-white/35">
                          Cadastro: {formatDate(student.joinedAt)}
                        </p>
                      </td>
                      <td className="px-3 py-3 align-top text-white/75">
                        {student.role === 'admin'
                          ? 'Administrador'
                          : student.role === 'teacher'
                            ? 'Professor'
                            : 'Aluno'}
                      </td>
                      <td className="px-3 py-3 align-top text-white/80">
                        <p>Nível {student.level}</p>
                        <p className="text-xs text-white/50">{student.totalXp.toLocaleString('pt-BR')} XP</p>
                      </td>
                      <td className="px-3 py-3 align-top">
                        <p className="font-semibold text-white">{student.accuracy}%</p>
                        <p className="text-xs text-white/50">
                          {student.totalCorrect}/{student.totalAnswered} respostas
                        </p>
                      </td>
                      <td className="px-3 py-3 align-top text-white/85">
                        {student.averageScore !== null ? student.averageScore : 'Sem nota'}
                      </td>
                      <td className="px-3 py-3 align-top">
                        <span className={`rounded-full border px-3 py-1 text-xs ${statusStyles[student.status]}`}>
                          {statusLabels[student.status]}
                        </span>
                      </td>
                      <td className="px-3 py-3 align-top text-white/60">{formatDate(student.lastUpdate)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
