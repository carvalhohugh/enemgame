/**
 * EnemService — Integração com a API pública enem.dev
 *
 * Endpoints usados:
 *   GET /v1/exams             → lista anos disponíveis
 *   GET /v1/exams/{year}      → detalhes do exame
 *   GET /v1/exams/{year}/questions?limit=N&offset=O&language=L
 *
 * Fonte: https://docs.enem.dev
 * Anos disponíveis: 2009–2024
 */

const API_BASE = 'https://api.enem.dev/v1';

export type EnemArea = 'humanas' | 'natureza' | 'linguagens' | 'matematica' | 'redacao';

export interface EnemExamOption {
    label: string;
    value: string;
}

export interface EnemExam {
    title: string;
    year: number;
    disciplines: EnemExamOption[];
    languages: EnemExamOption[];
}

export interface EnemQuestion {
    id: string;
    year: number;
    area: EnemArea;
    discipline: string;
    title: string;
    context: string;
    index: number;
    alternativesIntroduction?: string;
    alternatives: {
        letter: string;
        text: string;
        isCorrect: boolean;
    }[];
    correctAlternative: string;
    difficulty: 'facil' | 'media' | 'dificil';
    language?: string | null;
}

export interface EnemQuestionsResponse {
    metadata: {
        total: number;
        hasMore: boolean;
        limit: number;
        offset: number;
    };
    questions: EnemQuestion[];
}

/* ── Disciplinas padrão (todas as provas ENEM têm as mesmas áreas) ── */
const STANDARD_DISCIPLINES: EnemExamOption[] = [
    { label: 'Ciências Humanas', value: 'ciencias-humanas' },
    { label: 'Ciências da Natureza', value: 'ciencias-natureza' },
    { label: 'Linguagens e Códigos', value: 'linguagens' },
    { label: 'Matemática', value: 'matematica' },
];

const STANDARD_LANGUAGES: EnemExamOption[] = [
    { label: 'Inglês', value: 'ingles' },
    { label: 'Espanhol', value: 'espanhol' },
];

/* ── Mapa disciplina → área ── */
const disciplineToArea: Record<string, EnemArea> = {
    'ciencias-humanas': 'humanas',
    'ciencias-natureza': 'natureza',
    linguagens: 'linguagens',
    matematica: 'matematica',
};

/* ── Cache simples em memória ── */
const cache: Record<string, { data: unknown; ts: number }> = {};
const CACHE_TTL = 5 * 60 * 1000; // 5 min

async function cachedFetch<T>(url: string): Promise<T> {
    const now = Date.now();
    if (cache[url] && now - cache[url].ts < CACHE_TTL) {
        return cache[url].data as T;
    }
    const resp = await fetch(url);
    if (!resp.ok) {
        throw new Error(`API enem.dev retornou status ${resp.status} para ${url}`);
    }
    const data = await resp.json();
    cache[url] = { data, ts: now };
    return data as T;
}

/* ── Tipos da API crua ── */
interface ApiExam {
    title: string;
    year: number;
}

interface ApiAlternative {
    letter: string;
    text: string;
    isCorrect: boolean;
}

interface ApiQuestion {
    index: number;
    title: string;
    context?: string;
    alternativesIntroduction?: string;
    alternatives: ApiAlternative[];
    correctAlternative: string;
    discipline?: string;
    language?: string | null;
}

interface ApiQuestionsResponse {
    quantity: number;
    questions: ApiQuestion[];
}

/* ── Normaliza questão da API para o tipo interno ── */
function normalizeQuestion(raw: ApiQuestion, year: number): EnemQuestion {
    const disc = raw.discipline || 'linguagens';
    return {
        id: `${year}-${raw.index}`,
        year,
        area: disciplineToArea[disc] || 'linguagens',
        discipline: disc,
        title: raw.title || '',
        context: raw.context || '',
        index: raw.index,
        alternativesIntroduction: raw.alternativesIntroduction,
        alternatives: raw.alternatives.map((a) => ({
            letter: a.letter,
            text: a.text,
            isCorrect: a.isCorrect,
        })),
        correctAlternative: raw.correctAlternative,
        difficulty: 'media', // API não retorna dificuldade; padrão "media"
        language: raw.language || null,
    };
}

export const EnemService = {
    /**
     * Lista todos os exames disponíveis (2009-2024)
     */
    getExams: async (): Promise<EnemExam[]> => {
        try {
            const apiExams = await cachedFetch<ApiExam[]>(`${API_BASE}/exams`);
            return apiExams
                .map((e) => ({
                    title: e.title || `ENEM ${e.year}`,
                    year: e.year,
                    disciplines: STANDARD_DISCIPLINES,
                    languages: STANDARD_LANGUAGES,
                }))
                .sort((a, b) => b.year - a.year);
        } catch (err) {
            console.warn('Falha ao buscar exames da API, usando fallback local:', err);
            // Fallback: gera lista de 2009-2024
            const years = Array.from({ length: 16 }, (_, i) => 2024 - i);
            return years.map((y) => ({
                title: `ENEM ${y}`,
                year: y,
                disciplines: STANDARD_DISCIPLINES,
                languages: STANDARD_LANGUAGES,
            }));
        }
    },

    /**
     * Busca questões de um ano específico com filtros opcionais
     */
    getQuestions: async (
        year: number,
        filter?: { discipline?: string; offset?: number; limit?: number; language?: string }
    ): Promise<EnemQuestionsResponse> => {
        const limit = filter?.limit || 50;
        const offset = filter?.offset || 0;

        try {
            const params = new URLSearchParams();
            params.set('limit', String(limit));
            params.set('offset', String(offset));
            if (filter?.language) {
                params.set('language', filter.language);
            }

            const url = `${API_BASE}/exams/${year}/questions?${params.toString()}`;
            const apiResp = await cachedFetch<ApiQuestionsResponse>(url);

            let questions = apiResp.questions.map((q) => normalizeQuestion(q, year));

            // Filtrar por disciplina se necessário (a API não tem esse filtro nativo)
            if (filter?.discipline) {
                questions = questions.filter((q) => q.discipline === filter.discipline);
            }

            return {
                metadata: {
                    total: apiResp.quantity || questions.length,
                    hasMore: questions.length >= limit,
                    limit,
                    offset,
                },
                questions,
            };
        } catch (err) {
            console.warn(`Falha ao buscar questões de ${year}:`, err);
            return {
                metadata: { total: 0, hasMore: false, limit, offset },
                questions: [],
            };
        }
    },

    /**
     * Busca TODAS as questões de um ano (faz paginação automática)
     */
    getAllQuestionsForYear: async (year: number): Promise<EnemQuestion[]> => {
        const allQuestions: EnemQuestion[] = [];
        let offset = 0;
        const limit = 100;
        let hasMore = true;

        while (hasMore) {
            const resp = await EnemService.getQuestions(year, { limit, offset });
            allQuestions.push(...resp.questions);
            hasMore = resp.metadata.hasMore && resp.questions.length > 0;
            offset += limit;
            // Safety: máx 500 questões por ano
            if (allQuestions.length > 500) break;
        }

        return allQuestions;
    },

    /**
     * Retorna todas as questões de todos os anos (heavy! use com cuidado)
     */
    getAllQuestions: async (): Promise<EnemQuestion[]> => {
        const exams = await EnemService.getExams();
        const allQuestions: EnemQuestion[] = [];

        for (const exam of exams) {
            const yearQuestions = await EnemService.getAllQuestionsForYear(exam.year);
            allQuestions.push(...yearQuestions);
        }

        return allQuestions;
    },

    /**
     * Calcula nota TRI estimada
     */
    calculateTRIScore: (
        totalQuestions: number,
        correctAnswers: number
    ): number => {
        const ratio = correctAnswers / Math.max(totalQuestions, 1);
        // Estimativa simplificada: escala 300-1000
        return Math.round(300 + ratio * 700);
    },
};
