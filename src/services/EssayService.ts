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

export interface EssayTheme {
    id: string;
    title: string;
    year?: number;
    category: 'Oficial ENEM' | 'Social' | 'Tecnologia' | 'Meio Ambiente' | 'Saúde';
}

const INEP_TIERS = [0, 40, 80, 120, 160, 200];

const HISTORIC_THEMES: EssayTheme[] = [
    { id: '2023', title: 'Desafios para o enfrentamento da invisibilidade do trabalho de cuidado realizado pela mulher no Brasil', year: 2023, category: 'Oficial ENEM' },
    { id: '2022', title: 'Desafios para a valorização de comunidades e povos tradicionais no Brasil', year: 2022, category: 'Oficial ENEM' },
    { id: '2021', title: 'Invisibilidade e registro civil: garantia de acesso à cidadania no Brasil', year: 2021, category: 'Oficial ENEM' },
    { id: '2020', title: 'O estigma associado às doenças mentais na sociedade brasileira', year: 2020, category: 'Oficial ENEM' },
    { id: '2019', title: 'Democratização do acesso ao cinema no Brasil', year: 2019, category: 'Oficial ENEM' },
    { id: 's1', title: 'A importância da educação financeira na formação do cidadão contemporâneo', category: 'Social' },
    { id: 't1', title: 'Os impactos da inteligência artificial na privacidade e no mercado de trabalho', category: 'Tecnologia' },
    { id: 'm1', title: 'Caminhos para combater a crise hídrica e garantir a segurança alimentar', category: 'Meio Ambiente' },
    { id: 'sa1', title: 'O aumento da obesidade infantil e os desafios para a saúde pública', category: 'Saúde' }
];

export const EssayService = {
    getThemes: (): EssayTheme[] => {
        return HISTORIC_THEMES;
    },

    getRandomTheme: (): EssayTheme => {
        return HISTORIC_THEMES[Math.floor(Math.random() * HISTORIC_THEMES.length)];
    },
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
