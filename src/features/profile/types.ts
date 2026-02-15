export type ExamType = 'enem' | 'vestibular' | 'simulado';

export interface ExamScore {
    id: string;
    type: ExamType;
    name: string; // e.g. "ENEM 2024", "FUVEST 2025", "Simulado Abril"
    year: number;
    date: string; // ISO date string
    scores: {
        linguagens?: number;
        humanas?: number;
        natureza?: number;
        matematica?: number;
        redacao?: number;
    };
    totalScore: number;
    notes?: string; // optional personal notes
}

export const EXAM_TYPE_LABELS: Record<ExamType, string> = {
    enem: 'ENEM',
    vestibular: 'Vestibular',
    simulado: 'Simulado',
};

export const SCORE_FIELDS = [
    { key: 'linguagens' as const, label: 'Linguagens e Códigos', icon: '📝', max: 1000 },
    { key: 'humanas' as const, label: 'Ciências Humanas', icon: '🌎', max: 1000 },
    { key: 'natureza' as const, label: 'Ciências da Natureza', icon: '🔬', max: 1000 },
    { key: 'matematica' as const, label: 'Matemática', icon: '📐', max: 1000 },
    { key: 'redacao' as const, label: 'Redação', icon: '✍️', max: 1000 },
];
