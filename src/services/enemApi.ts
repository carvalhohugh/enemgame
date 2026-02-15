const ENEM_API_BASE = 'https://api.enem.dev/v1';

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

export interface EnemAlternative {
  letter: string;
  text: string;
  file: string | null;
  isCorrect: boolean;
}

export interface EnemQuestion {
  title: string;
  index: number;
  discipline: string;
  language: string;
  year: number;
  context: string;
  files: string[];
  alternativesIntroduction: string;
  correctAlternative: string;
  alternatives: EnemAlternative[];
}

export interface EnemQuestionsResponse {
  metadata: {
    limit: number;
    offset: number;
    total: number;
    hasMore: boolean;
  };
  questions: EnemQuestion[];
}

export interface FetchQuestionsParams {
  language?: string;
  discipline?: string;
  limit?: number;
  offset?: number;
}

async function fetchWithTimeout(url: string, timeoutMs = 12000): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    return await fetch(url, {
      method: 'GET',
      signal: controller.signal,
    });
  } finally {
    clearTimeout(timeoutId);
  }
}

export async function fetchEnemExams(): Promise<EnemExam[]> {
  const response = await fetchWithTimeout(`${ENEM_API_BASE}/exams`);

  if (!response.ok) {
    throw new Error('Nao foi possivel carregar as provas do ENEM agora.');
  }

  const data = (await response.json()) as EnemExam[];
  return [...data].sort((a, b) => b.year - a.year);
}

export async function fetchEnemQuestions(
  year: number,
  params: FetchQuestionsParams = {},
): Promise<EnemQuestionsResponse> {
  const query = new URLSearchParams();

  if (params.language) {
    query.set('language', params.language);
  }

  if (params.discipline) {
    query.set('discipline', params.discipline);
  }

  if (params.limit) {
    query.set('limit', String(params.limit));
  }

  if (params.offset) {
    query.set('offset', String(params.offset));
  }

  const queryText = query.toString();
  const endpoint = `${ENEM_API_BASE}/exams/${year}/questions${queryText ? `?${queryText}` : ''}`;
  const response = await fetchWithTimeout(endpoint);

  if (!response.ok) {
    if (response.status === 429) {
      throw new Error('Limite de requisicoes da API atingido. Aguarde alguns segundos e tente novamente.');
    }

    throw new Error('Nao foi possivel carregar as questoes reais do ENEM.');
  }

  return (await response.json()) as EnemQuestionsResponse;
}
