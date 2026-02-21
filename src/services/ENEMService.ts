export interface ENEMQuestion {
    id: string;
    index: number;
    statement: string;
    alternatives: {
        letter: string;
        text: string;
        isCorrect: boolean;
    }[];
    explanation: string;
    year: number;
    subject: string;
    topic: string;
}

export const ENEMService = {
    fetchQuestions: async (year?: number, subject?: string): Promise<ENEMQuestion[]> => {
        try {
            let url = 'https://api.enem.dev/v1/questions';
            const params = new URLSearchParams();
            if (year) params.append('year', year.toString());
            if (subject) params.append('subject', subject);

            if (params.toString()) url += `?${params.toString()}`;

            const response = await fetch(url);
            if (!response.ok) throw new Error('Falha ao buscar questões do ENEM');

            return await response.json();
        } catch (error) {
            console.error('Erro no ENEMService:', error);
            // Fallback para mock se a API falhar ou estiver fora do ar
            return [];
        }
    },

    getRandomQuestions: async (count: number = 5): Promise<ENEMQuestion[]> => {
        const all = await ENEMService.fetchQuestions();
        return all.sort(() => 0.5 - Math.random()).slice(0, count);
    }
};
