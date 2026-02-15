import type { EssaySubmission, EssayResult, CompetencyScore } from './types';
import { COMPETENCIES } from './types';

// Mock AI corrector — in production, this would call an LLM API (GPT-4, Gemini, etc.)
const MOCK_FEEDBACK_POOL = {
    high: [
        'Excelente domínio. Texto bem estruturado e coeso.',
        'Argumentação sólida com repertório diversificado.',
        'Proposta de intervenção bem articulada e viável.',
    ],
    medium: [
        'Bom nível, mas pode melhorar a articulação entre parágrafos.',
        'Repertório adequado, porém poderia ser mais diversificado.',
        'A proposta existe, mas falta maior detalhamento.',
    ],
    low: [
        'Desvios frequentes da norma padrão comprometem a leitura.',
        'Tangencia o tema proposto. Precisa de maior foco.',
        'Proposta de intervenção genérica ou ausente.',
    ],
};

function generateMockScore(): number {
    const levels = [0, 40, 80, 120, 160, 200];
    // Weighted toward middle-high scores for demo
    const weights = [1, 2, 4, 6, 5, 3];
    const totalWeight = weights.reduce((a, b) => a + b, 0);
    let random = Math.random() * totalWeight;
    for (let i = 0; i < levels.length; i++) {
        random -= weights[i];
        if (random <= 0) return levels[i];
    }
    return 120;
}

function getFeedback(score: number): string {
    if (score >= 160) return MOCK_FEEDBACK_POOL.high[Math.floor(Math.random() * MOCK_FEEDBACK_POOL.high.length)];
    if (score >= 80) return MOCK_FEEDBACK_POOL.medium[Math.floor(Math.random() * MOCK_FEEDBACK_POOL.medium.length)];
    return MOCK_FEEDBACK_POOL.low[Math.floor(Math.random() * MOCK_FEEDBACK_POOL.low.length)];
}

export const RedacaoAIService = {
    /**
     * Simulates AI essay correction.
     * In production, this would send the text to an LLM endpoint.
     */
    correctEssay: async (submission: EssaySubmission): Promise<EssayResult> => {
        // Simulate processing time (1.5-3 seconds)
        await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 1500));

        const competencies: CompetencyScore[] = COMPETENCIES.map(comp => {
            const score = generateMockScore();
            return {
                ...comp,
                score,
                feedback: getFeedback(score),
            };
        });

        const totalScore = competencies.reduce((acc, c) => acc + c.score, 0);

        let overallFeedback = '';
        if (totalScore >= 800) {
            overallFeedback = 'Parabéns! Sua redação demonstra excelente domínio das competências avaliadas. Continue praticando para manter esse nível.';
        } else if (totalScore >= 500) {
            overallFeedback = 'Bom trabalho! Há pontos de melhoria, especialmente nas competências com nota mais baixa. Revise os feedbacks individuais.';
        } else {
            overallFeedback = 'Sua redação precisa de atenção. Foque nas competências com menor nota e pratique a estrutura argumentativa.';
        }

        return {
            submissionId: submission.id,
            totalScore,
            competencies,
            overallFeedback,
            processedAt: new Date().toISOString(),
        };
    },
};
