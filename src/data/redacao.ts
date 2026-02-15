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
    title: 'Dominio da norma padrao da lingua portuguesa',
    description:
      'Avalia se o texto demonstra dominio de ortografia, concordancia, regencia, pontuacao e registro formal.',
    scoreRange: '0 a 200 pontos',
  },
  {
    id: 2,
    title: 'Compreensao da proposta e repertorio',
    description:
      'Avalia se o estudante desenvolve o tema no formato dissertativo-argumentativo, com repertorio produtivo e pertinente.',
    scoreRange: '0 a 200 pontos',
  },
  {
    id: 3,
    title: 'Selecao e organizacao de argumentos',
    description:
      'Avalia a construcao de ponto de vista, progressao das ideias e uso de dados/exemplos para sustentar a tese.',
    scoreRange: '0 a 200 pontos',
  },
  {
    id: 4,
    title: 'Coesao textual',
    description:
      'Avalia o uso de conectivos, referenciação e encadeamento logico entre frases, periodos e paragrafos.',
    scoreRange: '0 a 200 pontos',
  },
  {
    id: 5,
    title: 'Proposta de intervencao',
    description:
      'Avalia se o texto apresenta proposta detalhada, viavel, respeitando os direitos humanos e com agentes, acoes e meios.',
    scoreRange: '0 a 200 pontos',
  },
];

export const baseEssayThemes: EssayTheme[] = [
  {
    id: 'base-1',
    title: 'Desafios para combater a desinformacao cientifica no Brasil',
    axes: ['educacao midiatica', 'saude publica', 'responsabilidade digital'],
    inspiration: 'Tema recorrente em debates sociais e educacionais.',
  },
  {
    id: 'base-2',
    title: 'Caminhos para ampliar a permanencia de jovens no ensino medio',
    axes: ['evasao escolar', 'politicas publicas', 'projeto de vida'],
    inspiration: 'Relaciona educacao, desigualdade e mercado de trabalho.',
  },
  {
    id: 'base-3',
    title: 'Impactos da inteligencia artificial na formacao dos estudantes brasileiros',
    axes: ['etica', 'acesso', 'inovacao pedagógica'],
    inspiration: 'Atualiza o debate sobre tecnologia e aprendizagem.',
  },
  {
    id: 'base-4',
    title: 'Desafios da mobilidade urbana para a inclusao social',
    axes: ['direito a cidade', 'infraestrutura', 'acessibilidade'],
    inspiration: 'Conecta cidadania, trabalho e qualidade de vida.',
  },
  {
    id: 'base-5',
    title: 'Seguranca alimentar e desperdicio de alimentos no Brasil contemporaneo',
    axes: ['fome', 'consumo consciente', 'cadeia produtiva'],
    inspiration: 'Dialoga com desigualdade e sustentabilidade.',
  },
  {
    id: 'base-6',
    title: 'Desafios para proteger adolescentes de violencias no ambiente digital',
    axes: ['cyberbullying', 'legislacao', 'familia e escola'],
    inspiration: 'Tema de alta incidencia na vida escolar.',
  },
  {
    id: 'base-7',
    title: 'Valorizacao do trabalho de cuidado e seus efeitos na economia brasileira',
    axes: ['desigualdade de genero', 'politicas de apoio', 'mercado de trabalho'],
    inspiration: 'Tema social com foco em equidade e direitos.',
  },
  {
    id: 'base-8',
    title: 'Barreiras para democratizar o acesso a bens culturais no Brasil',
    axes: ['territorio', 'financiamento', 'pluralidade'],
    inspiration: 'Amplia discussao sobre cidadania cultural.',
  },
  {
    id: 'base-9',
    title: 'Estrategias para reduzir o preconceito linguistico na sociedade brasileira',
    axes: ['diversidade', 'educacao', 'direitos civis'],
    inspiration: 'Tema alinhado a linguagens e inclusao social.',
  },
  {
    id: 'base-10',
    title: 'Desafios para fortalecer a participacao civica da juventude',
    axes: ['democracia', 'engajamento social', 'formacao politica'],
    inspiration: 'Relaciona protagonismo juvenil e politicas publicas.',
  },
  {
    id: 'base-11',
    title: 'Consequencias sociais da precarizacao do trabalho por aplicativos',
    axes: ['direitos trabalhistas', 'renda', 'regulacao'],
    inspiration: 'Tema atual sobre economia e justica social.',
  },
  {
    id: 'base-12',
    title: 'Desafios para garantir inclusao de pessoas com deficiencia no ensino superior',
    axes: ['acessibilidade', 'permanencia', 'politicas afirmativas'],
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
  'tambem',
  'ainda',
  'se',
  'nao',
  'sao',
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
  'questao',
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
        axes: ['contexto historico', 'impacto social', 'proposta de intervencao'],
        inspiration: `Inspirado por topicos da prova ENEM ${question.year}, questao ${question.index}.`,
      } as EssayTheme;
    })
    .filter((theme): theme is EssayTheme => theme !== null);
}
