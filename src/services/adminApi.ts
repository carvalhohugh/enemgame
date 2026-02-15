import { supabase } from '@/lib/supabase';

export type AdminArea = 'humanas' | 'natureza' | 'linguagens' | 'matematica' | 'redacao';
export type StudentStatus = 'aprovado' | 'recuperacao' | 'em_risco' | 'sem_registro';

interface ProfileRow {
  id: string;
  email: string;
  full_name: string | null;
  role: 'student' | 'teacher' | 'admin';
  created_at: string;
  updated_at: string;
}

interface StudentMetricRow {
  user_id: string;
  total_xp: number;
  level: number;
  streak: number;
  total_answered: number;
  total_correct: number;
  accuracy: number;
  updated_at: string;
}

interface StudentScoreRow {
  id: string;
  user_id: string;
  exam_year: number;
  area: AdminArea;
  score: number;
  status: 'aprovado' | 'recuperacao' | 'em_risco';
  created_at: string;
  updated_at: string;
}

export interface StudentAdminRecord {
  userId: string;
  name: string;
  email: string;
  role: 'student' | 'teacher' | 'admin';
  joinedAt: string;
  lastUpdate: string | null;
  level: number;
  totalXp: number;
  streak: number;
  totalAnswered: number;
  totalCorrect: number;
  accuracy: number;
  averageScore: number | null;
  areaScores: Partial<Record<AdminArea, number>>;
  status: StudentStatus;
}

export interface AdminDashboardPayload {
  students: StudentAdminRecord[];
  availableYears: number[];
}

export interface SyncStudentMetricsInput {
  userId: string;
  email: string;
  fullName: string;
  role: 'student' | 'admin';
  metrics: {
    totalXp: number;
    level: number;
    streak: number;
    totalAnswered: number;
    totalCorrect: number;
    accuracy: number;
  };
}

function toStatus(averageScore: number | null, explicitStatus?: StudentScoreRow['status']): StudentStatus {
  if (explicitStatus) {
    return explicitStatus;
  }

  if (averageScore === null) {
    return 'sem_registro';
  }

  if (averageScore >= 700) {
    return 'aprovado';
  }

  if (averageScore >= 500) {
    return 'recuperacao';
  }

  return 'em_risco';
}

function normalizeMessage(errorMessage: string): string {
  if (errorMessage.includes('Could not find the table')) {
    return 'Estrutura administrativa ainda não foi criada no Supabase. Execute o arquivo scripts/admin_schema.sql.';
  }

  return errorMessage;
}

function assertSupabase() {
  if (!supabase) {
    throw new Error('Supabase não configurado para operações administrativas.');
  }

  return supabase;
}

export async function fetchAdminDashboardPayload(examYear?: number): Promise<AdminDashboardPayload> {
  const supabaseClient = assertSupabase();

  const profilesQuery = supabaseClient
    .from('profiles')
    .select('id,email,full_name,role,created_at,updated_at')
    .order('created_at', { ascending: false });
  const metricsQuery = supabaseClient
    .from('student_metrics')
    .select('user_id,total_xp,level,streak,total_answered,total_correct,accuracy,updated_at');
  const scoresBaseQuery = supabaseClient
    .from('student_scores')
    .select('id,user_id,exam_year,area,score,status,created_at,updated_at')
    .order('updated_at', { ascending: false });
  const scoresQuery = examYear ? scoresBaseQuery.eq('exam_year', examYear) : scoresBaseQuery;

  const [profilesResult, metricsResult, scoresResult] = await Promise.all([
    profilesQuery,
    metricsQuery,
    scoresQuery,
  ]);

  if (profilesResult.error) {
    throw new Error(normalizeMessage(profilesResult.error.message));
  }
  if (metricsResult.error) {
    throw new Error(normalizeMessage(metricsResult.error.message));
  }
  if (scoresResult.error) {
    throw new Error(normalizeMessage(scoresResult.error.message));
  }

  const profiles = (profilesResult.data ?? []) as ProfileRow[];
  const metrics = (metricsResult.data ?? []) as StudentMetricRow[];
  const scores = (scoresResult.data ?? []) as StudentScoreRow[];

  const metricsByUser = new Map(metrics.map((metric) => [metric.user_id, metric]));
  const scoresByUser = new Map<string, StudentScoreRow[]>();
  const availableYears = Array.from(new Set(scores.map((score) => score.exam_year))).sort((a, b) => b - a);

  scores.forEach((score) => {
    const current = scoresByUser.get(score.user_id) ?? [];
    current.push(score);
    scoresByUser.set(score.user_id, current);
  });

  const students = profiles
    .map((profile) => {
      const metric = metricsByUser.get(profile.id);
      const studentScores = scoresByUser.get(profile.id) ?? [];
      const areaScores: Partial<Record<AdminArea, number>> = {};

      studentScores.forEach((score) => {
        if (!(score.area in areaScores)) {
          areaScores[score.area] = score.score;
        }
      });

      const averageScore =
        studentScores.length > 0
          ? Math.round(
              studentScores.reduce((total, score) => total + score.score, 0) / studentScores.length,
            )
          : null;
      const explicitStatus = studentScores[0]?.status;
      const status = toStatus(averageScore, explicitStatus);

      return {
        userId: profile.id,
        name: profile.full_name?.trim() || profile.email.split('@')[0],
        email: profile.email,
        role: profile.role,
        joinedAt: profile.created_at,
        lastUpdate: metric?.updated_at ?? null,
        level: metric?.level ?? 1,
        totalXp: metric?.total_xp ?? 0,
        streak: metric?.streak ?? 0,
        totalAnswered: metric?.total_answered ?? 0,
        totalCorrect: metric?.total_correct ?? 0,
        accuracy: metric?.accuracy ?? 0,
        averageScore,
        areaScores,
        status,
      } as StudentAdminRecord;
    })
    .sort((left, right) => {
      const scoreLeft = left.averageScore ?? -1;
      const scoreRight = right.averageScore ?? -1;
      if (scoreRight !== scoreLeft) {
        return scoreRight - scoreLeft;
      }

      return right.totalXp - left.totalXp;
    });

  return {
    students,
    availableYears,
  };
}

export async function upsertStudentMetrics(input: SyncStudentMetricsInput): Promise<void> {
  const supabaseClient = assertSupabase();

  const profilePayload = {
    id: input.userId,
    email: input.email,
    full_name: input.fullName,
    role: input.role,
    updated_at: new Date().toISOString(),
  };

  const metricsPayload = {
    user_id: input.userId,
    total_xp: input.metrics.totalXp,
    level: input.metrics.level,
    streak: input.metrics.streak,
    total_answered: input.metrics.totalAnswered,
    total_correct: input.metrics.totalCorrect,
    accuracy: input.metrics.accuracy,
    updated_at: new Date().toISOString(),
  };

  const [profileResult, metricsResult] = await Promise.all([
    supabaseClient.from('profiles').upsert(profilePayload, { onConflict: 'id' }),
    supabaseClient.from('student_metrics').upsert(metricsPayload, { onConflict: 'user_id' }),
  ]);

  if (profileResult.error) {
    throw new Error(normalizeMessage(profileResult.error.message));
  }
  if (metricsResult.error) {
    throw new Error(normalizeMessage(metricsResult.error.message));
  }
}
