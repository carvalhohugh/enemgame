export interface EssayCorrection {
    competencies: {
        c1: number; // Domínio da norma culta
        c2: number; // Compreender a proposta
        c3: number; // Selecionar e organizar informações
        c4: number; // Conhecimento linguístico (coesão)
        c5: number; // Proposta de intervenção
    };
    totalScore: number;
    plagiarismScore: number; // 0 to 100
    isApproved: boolean;
    feedback: string;
}

const INEP_TIERS = [0, 40, 80, 120, 160, 200];

export const EssayService = {
    checkPlagiarism: async (text: string): Promise<number> => {
        await new Promise(resolve => setTimeout(resolve, 2000));

        const suspiciousPhrases = [
            "na contemporaneidade",
            "hodiernamente",
            "vale ressaltar",
            "consoante o pensamento de"
        ];

        let count = 0;
        suspiciousPhrases.forEach(p => {
            if (text.toLowerCase().includes(p)) count++;
        });

        const score = Math.min(count * 15, 100);
        return score;
    },

    gradeEssay: async (text: string): Promise<EssayCorrection> => {
        await new Promise(resolve => setTimeout(resolve, 3000));

        const wordCount = text.trim().split(/\s+/).length;

        const getInepTier = (score: number) => {
            const clamped = Math.max(0, Math.min(score, 200));
            return INEP_TIERS.reduce((prev, curr) =>
                Math.abs(curr - clamped) < Math.abs(prev - clamped) ? curr : prev
            );
        };

        const baseQuality = Math.min(wordCount / 2, 200);

        const correction: EssayCorrection = {
            competencies: {
                c1: getInepTier(baseQuality - (Math.random() * 40)),
                c2: getInepTier(baseQuality + (Math.random() * 20)),
                c3: getInepTier(baseQuality - (Math.random() * 20)),
                c4: getInepTier(baseQuality + (Math.random() * 40)),
                c5: getInepTier(text.includes('Portanto') ? 160 : 40),
            },
            totalScore: 0,
            plagiarismScore: 0,
            isApproved: wordCount >= 7,
            feedback: ""
        };

        correction.totalScore = Object.values(correction.competencies).reduce((a, b) => a + b, 0);

        if (wordCount < 150) {
            correction.feedback = "Seu texto está abaixo do esperado para o padrão ENEM. Desenvolva mais seus argumentos e busque atingir entre 300 a 500 palavras.";
        } else if (correction.totalScore >= 900) {
            correction.feedback = "Parabéns! Sua redação apresenta excelente domínio da norma culta, estrutura argumentativa sólida e proposta de intervenção completa segundo as exigências do INEP.";
        } else if (correction.totalScore >= 700) {
            correction.feedback = "Bom desempenho. Você compreende a estrutura, mas pode refinar a coesão entre parágrafos e o detalhamento dos agentes na proposta de intervenção.";
        } else {
            correction.feedback = "Atenção: sua redação precisa de ajustes estruturais significativos. Revise o uso de conectivos e certifique-se de que sua proposta de intervenção responde aos 5 elementos obrigatórios.";
        }

        return correction;
    }
};
