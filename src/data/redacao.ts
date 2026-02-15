import type { EnemQuestion } from '@/services/enemApi';

export interface MecCompetency {
  id: number;
  title: string;
  description: string;
  scoreRange: string;
}

export interface EssayTheme {
  id: string;
  title: string;
  axes: string[];
  inspiration: string;
}

export const mecCompetencies: MecCompetency[] = [
  {
    id: 1,
    title: 'Domínio da norma padrão da língua portuguesa',
    description:
      'Avalia se o texto demonstra domínio de ortografia, concordância, regência, pontuação e registro formal.',
    scoreRange: '0 a 200 pontos',
  },
  {
    id: 2,
    title: 'Compreensão da proposta e repertório',
    description:
      'Avalia se o estudante desenvolve o tema no formato dissertativo-argumentativo, com repertório produtivo e pertinente.',
    scoreRange: '0 a 200 pontos',
  },
  {
    id: 3,
    title: 'Seleção e organização de argumentos',
    description:
      'Avalia a construção de ponto de vista, progressão das ideias e uso de dados/exemplos para sustentar a tese.',
    scoreRange: '0 a 200 pontos',
  },
  {
    id: 4,
    title: 'Coesão textual',
    description:
      'Avalia o uso de conectivos, referenciação e encadeamento lógico entre frases, períodos e parágrafos.',
    scoreRange: '0 a 200 pontos',
  },
  {
    id: 5,
    title: 'Proposta de intervenção',
    description:
      'Avalia se o texto apresenta proposta detalhada, viável, respeitando os direitos humanos e com agentes, ações e meios.',
    scoreRange: '0 a 200 pontos',
  },
];

export const baseEssayThemes: EssayTheme[] = [
  {
    id: 'base-1',
    title: 'Desafios para combater a desinformação científica no Brasil',
    axes: ['educação midiática', 'saúde pública', 'responsabilidade digital'],
    inspiration: 'Tema recorrente em debates sociais e educacionais.',
  },
  {
    id: 'base-2',
    title: 'Caminhos para ampliar a permanência de jovens no ensino médio',
    axes: ['evasão escolar', 'políticas públicas', 'projeto de vida'],
    inspiration: 'Relaciona educação, desigualdade e mercado de trabalho.',
  },
  {
    id: 'base-3',
    title: 'Impactos da inteligência artificial na formação dos estudantes brasileiros',
    axes: ['ética', 'acesso', 'inovação pedagógica'],
    inspiration: 'Atualiza o debate sobre tecnologia e aprendizagem.',
  },
  {
    id: 'base-4',
    title: 'Desafios da mobilidade urbana para a inclusão social',
    axes: ['direito à cidade', 'infraestrutura', 'acessibilidade'],
    inspiration: 'Conecta cidadania, trabalho e qualidade de vida.',
  },
  {
    id: 'base-5',
    title: 'Segurança alimentar e desperdício de alimentos no Brasil contemporâneo',
    axes: ['fome', 'consumo consciente', 'cadeia produtiva'],
    inspiration: 'Dialoga com desigualdade e sustentabilidade.',
  },
  {
    id: 'base-6',
    title: 'Desafios para proteger adolescentes de violências no ambiente digital',
    axes: ['cyberbullying', 'legislação', 'família e escola'],
    inspiration: 'Tema de alta incidência na vida escolar.',
  },
  {
    id: 'base-7',
    title: 'Valorização do trabalho de cuidado e seus efeitos na economia brasileira',
    axes: ['desigualdade de gênero', 'políticas de apoio', 'mercado de trabalho'],
    inspiration: 'Tema social com foco em equidade e direitos.',
  },
  {
    id: 'base-8',
    title: 'Barreiras para democratizar o acesso a bens culturais no Brasil',
    axes: ['território', 'financiamento', 'pluralidade'],
    inspiration: 'Amplia discussão sobre cidadania cultural.',
  },
  {
    id: 'base-9',
    title: 'Estratégias para reduzir o preconceito linguístico na sociedade brasileira',
    axes: ['diversidade', 'educação', 'direitos civis'],
    inspiration: 'Tema alinhado a linguagens e inclusão social.',
  },
  {
    id: 'base-10',
    title: 'Desafios para fortalecer a participação cívica da juventude',
    axes: ['democracia', 'engajamento social', 'formação política'],
    inspiration: 'Relaciona protagonismo juvenil e políticas públicas.',
  },
  {
    id: 'base-11',
    title: 'Consequências sociais da precarização do trabalho por aplicativos',
    axes: ['direitos trabalhistas', 'renda', 'regulação'],
    inspiration: 'Tema atual sobre economia e justiça social.',
  },
  {
    id: 'base-12',
    title: 'Desafios para garantir inclusão de pessoas com deficiência no ensino superior',
    axes: ['acessibilidade', 'permanência', 'políticas afirmativas'],
    inspiration: 'Debate sobre equidade e acesso educacional.',
  },
];

const stopWords = new Set([
  'como',
  'para',
  'com',
  'entre',
  'sobre',
  'uma',
  'das',
  'dos',
  'que',
  'por',
  'nos',
  'nas',
  'mais',
  'menos',
  'quando',
  'onde',
  'porque',
  'também',
  'ainda',
  'se',
  'não',
  'são',
  'ser',
  'foi',
  'sua',
  'seu',
  'suas',
  'seus',
  'eles',
  'elas',
  'isso',
  'essa',
  'esse',
  'essa',
  'texto',
  'questão',
  'enem',
]);

function removeMarkdown(value: string): string {
  return value
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
    .replace(/\[[^\]]*\]\([^)]*\)/g, ' ')
    .replace(/[>#*_`~]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function toTitleCase(value: string): string {
  return value
    .split(' ')
    .filter(Boolean)
    .map((word) => word[0].toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

function extractKeyword(value: string): string | null {
  const cleaned = removeMarkdown(value)
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase();

  const words = cleaned.match(/[a-z]{5,}/g) ?? [];
  const candidate = words.find((word) => !stopWords.has(word));

  return candidate ? toTitleCase(candidate) : null;
}

export function buildThemesFromQuestions(questions: EnemQuestion[]): EssayTheme[] {
  const selectedQuestions = questions.slice(0, 20);

  return selectedQuestions
    .map((question) => {
      const keyword = extractKeyword(question.context);

      if (!keyword) {
        return null;
      }

      return {
        id: `api-${question.year}-${question.index}-${question.language}`,
        title: `Desafios para promover ${keyword} de forma inclusiva no Brasil`,
        axes: ['contexto histórico', 'impacto social', 'proposta de intervenção'],
        inspiration: `Inspirado por tópicos da prova ENEM ${question.year}, questão ${question.index}.`,
      } as EssayTheme;
    })
    .filter((theme): theme is EssayTheme => theme !== null);
}
