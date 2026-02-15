export interface User {
  id: string;
  name: string;
  avatar: string;
  level: number;
  xp: number;
  xpToNextLevel: number;
  streak: number;
  rank: number;
}

export interface Area {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  progress: number;
  totalQuests: number;
  completedQuests: number;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

export interface Question {
  id: string;
  area: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface RankingUser {
  id: string;
  name: string;
  avatar: string;
  level: number;
  xp: number;
  rank: number;
  change: number;
}

export const currentUser: User = {
  id: '1',
  name: 'Ana Beatriz',
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ana&backgroundColor=7c3aed',
  level: 15,
  xp: 12450,
  xpToNextLevel: 15000,
  streak: 7,
  rank: 42,
};

export const areas: Area[] = [
  {
    id: 'humanas',
    name: 'Ciências Humanas',
    description: 'História, Geografia, Filosofia e Sociologia',
    icon: '🏛️',
    color: '#3b82f6',
    progress: 75,
    totalQuests: 120,
    completedQuests: 90,
  },
  {
    id: 'natureza',
    name: 'Ciências da Natureza',
    description: 'Biologia, Química e Física',
    icon: '🔬',
    color: '#10b981',
    progress: 60,
    totalQuests: 120,
    completedQuests: 72,
  },
  {
    id: 'linguagens',
    name: 'Linguagens',
    description: 'Português, Literatura, Artes e Inglês',
    icon: '📚',
    color: '#f59e0b',
    progress: 80,
    totalQuests: 100,
    completedQuests: 80,
  },
  {
    id: 'matematica',
    name: 'Matemática',
    description: 'Matemática e suas tecnologias',
    icon: '📐',
    color: '#ef4444',
    progress: 45,
    totalQuests: 100,
    completedQuests: 45,
  },
  {
    id: 'redacao',
    name: 'Redação',
    description: 'Produção textual e argumentação',
    icon: '✍️',
    color: '#8b5cf6',
    progress: 90,
    totalQuests: 50,
    completedQuests: 45,
  },
];

export const badges: Badge[] = [
  {
    id: '1',
    name: 'Primeiro Passo',
    description: 'Completou seu primeiro simulado',
    icon: '🎯',
    unlocked: true,
    unlockedAt: '2024-01-15',
    rarity: 'common',
  },
  {
    id: '2',
    name: '7 Dias Seguidos',
    description: 'Manteve uma sequência de 7 dias estudando',
    icon: '🔥',
    unlocked: true,
    unlockedAt: '2024-01-20',
    rarity: 'rare',
  },
  {
    id: '3',
    name: 'Mestre em Humanas',
    description: 'Alcançou 80% de progresso em Ciências Humanas',
    icon: '🏛️',
    unlocked: true,
    unlockedAt: '2024-01-25',
    rarity: 'epic',
  },
  {
    id: '4',
    name: 'Expert em Redação',
    description: 'Tirou nota 1000 em uma redação',
    icon: '👑',
    unlocked: true,
    unlockedAt: '2024-02-01',
    rarity: 'legendary',
  },
  {
    id: '5',
    name: 'Matemático',
    description: 'Acertou 10 questões de matemática seguidas',
    icon: '📐',
    unlocked: false,
    rarity: 'epic',
  },
  {
    id: '6',
    name: 'Cientista',
    description: 'Alcançou 80% de progresso em Ciências da Natureza',
    icon: '🔬',
    unlocked: false,
    rarity: 'epic',
  },
  {
    id: '7',
    name: 'Poliglota',
    description: 'Completou todos os exercícios de inglês',
    icon: '🌍',
    unlocked: false,
    rarity: 'rare',
  },
  {
    id: '8',
    name: 'Lendário',
    description: 'Alcançou o nível 50',
    icon: '⭐',
    unlocked: false,
    rarity: 'legendary',
  },
];

export const dailyQuestion: Question = {
  id: '1',
  area: 'humanas',
  question: 'Qual foi o principal fator que levou à crise do sistema colonial no Brasil no século XVIII?',
  options: [
    'A) A descoberta de ouro em Minas Gerais',
    'B) O esgotamento da mão de obra indígena',
    'C) A concorrência dos produtos coloniais no mercado internacional',
    'D) A proibição do tráfico negreiro pelo Reino Unido',
  ],
  correctAnswer: 2,
  explanation: 'A crise do sistema colonial foi causada principalmente pela concorrência dos produtos coloniais no mercado internacional, especialmente o açúcar brasileiro que enfrentava concorrência do caribe.',
  difficulty: 'medium',
};

export const ranking: RankingUser[] = [
  {
    id: '1',
    name: 'Pedro Henrique',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Pedro&backgroundColor=10b981',
    level: 28,
    xp: 45200,
    rank: 1,
    change: 0,
  },
  {
    id: '2',
    name: 'Maria Clara',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Maria&backgroundColor=f59e0b',
    level: 26,
    xp: 41800,
    rank: 2,
    change: 1,
  },
  {
    id: '3',
    name: 'João Victor',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Joao&backgroundColor=3b82f6',
    level: 25,
    xp: 39500,
    rank: 3,
    change: -1,
  },
  {
    id: '4',
    name: 'Luiza Santos',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Luiza&backgroundColor=ef4444',
    level: 23,
    xp: 36200,
    rank: 4,
    change: 2,
  },
  {
    id: '5',
    name: 'Gabriel Lima',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Gabriel&backgroundColor=8b5cf6',
    level: 22,
    xp: 34800,
    rank: 5,
    change: 0,
  },
  {
    id: '6',
    name: 'Ana Beatriz',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ana&backgroundColor=7c3aed',
    level: 15,
    xp: 12450,
    rank: 42,
    change: 5,
  },
];

export const subjects = [
  { id: 'historia', name: 'História', questions: 350, icon: '📜' },
  { id: 'geografia', name: 'Geografia', questions: 280, icon: '🌍' },
  { id: 'filosofia', name: 'Filosofia', questions: 180, icon: '🤔' },
  { id: 'sociologia', name: 'Sociologia', questions: 150, icon: '👥' },
  { id: 'biologia', name: 'Biologia', questions: 320, icon: '🧬' },
  { id: 'quimica', name: 'Química', questions: 290, icon: '⚗️' },
  { id: 'fisica', name: 'Física', questions: 310, icon: '⚛️' },
  { id: 'portugues', name: 'Português', questions: 420, icon: '📝' },
  { id: 'literatura', name: 'Literatura', questions: 200, icon: '📖' },
  { id: 'ingles', name: 'Inglês', questions: 180, icon: '🔤' },
  { id: 'matematica', name: 'Matemática', questions: 380, icon: '📊' },
];
