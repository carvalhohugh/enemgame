const ENEM_API_BASE = 'https://api.enem.dev/v1';
const MAX_QUESTIONS_PER_REQUEST = 50;

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
  language: string | null;
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

  const resolvedLimit = Math.min(params.limit ?? MAX_QUESTIONS_PER_REQUEST, MAX_QUESTIONS_PER_REQUEST);
  query.set('limit', String(resolvedLimit));

  if (params.offset) {
    query.set('offset', String(params.offset));
  }

  const queryText = query.toString();
  const endpoint = `${ENEM_API_BASE}/exams/${year}/questions${queryText ? `?${queryText}` : ''}`;
  const response = await fetchWithTimeout(endpoint);

  if (!response.ok) {
    const errorPayload = (await response.json().catch(() => null)) as
      | { error?: { message?: string } }
      | null;
    const apiMessage = errorPayload?.error?.message;

    if (response.status === 429) {
      throw new Error('Limite de requisicoes da API atingido. Aguarde alguns segundos e tente novamente.');
    }

    if (apiMessage) {
      throw new Error(apiMessage);
    }

    throw new Error('Nao foi possivel carregar as questoes reais do ENEM.');
  }

  return (await response.json()) as EnemQuestionsResponse;
}

export async function fetchAllEnemQuestions(year: number): Promise<EnemQuestion[]> {
  const questions: EnemQuestion[] = [];
  const seen = new Set<string>();
  let offset = 0;

  for (let page = 0; page < 10; page += 1) {
    const response = await fetchEnemQuestions(year, {
      limit: MAX_QUESTIONS_PER_REQUEST,
      offset,
    });

    response.questions.forEach((question) => {
      const key = `${question.year}-${question.index}-${question.language ?? 'pt-br'}`;

      if (seen.has(key)) {
        return;
      }

      seen.add(key);
      questions.push(question);
    });

    if (!response.metadata.hasMore || response.questions.length === 0) {
      break;
    }

    offset += MAX_QUESTIONS_PER_REQUEST;
  }

  return questions;
}
