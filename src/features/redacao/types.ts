export interface EssaySubmission {
    id: string;
    topic: string;
    text: string;
    submittedAt: string;
    wordCount: number;
}

export interface CompetencyScore {
    id: number;
    name: string;
    description: string;
    score: number; // 0, 40, 80, 120, 160, 200
    feedback: string;
}

export interface EssayResult {
    submissionId: string;
    totalScore: number;
    competencies: CompetencyScore[];
    overallFeedback: string;
    processedAt: string;
}

export const COMPETENCIES = [
    { id: 1, name: 'Competência 1', description: 'Demonstrar domínio da norma padrão da língua escrita' },
    { id: 2, name: 'Competência 2', description: 'Compreender a proposta de redação e aplicar conceitos' },
    { id: 3, name: 'Competência 3', description: 'Selecionar, relacionar, organizar e interpretar informações' },
    { id: 4, name: 'Competência 4', description: 'Demonstrar conhecimento dos mecanismos linguísticos' },
    { id: 5, name: 'Competência 5', description: 'Elaborar proposta de intervenção para o problema' },
];

export const SUGGESTED_TOPICS = [
    'Os desafios para combater a desinformação na era digital',
    'O impacto da inteligência artificial no mercado de trabalho brasileiro',
    'Caminhos para garantir a saúde mental dos jovens no Brasil',
    'O papel da educação financeira na formação dos cidadãos brasileiros',
    'Desafios para a inclusão digital de idosos no Brasil',
    'A importância da preservação dos biomas brasileiros',
    'Violência contra a mulher: caminhos para o enfrentamento no Brasil',
    'O acesso à água potável como direito fundamental',
    'Os impactos do sedentarismo na saúde pública brasileira',
    'Caminhos para garantir a segurança alimentar no Brasil',
];
