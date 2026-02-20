export type Subject = 'Matemática' | 'Linguagens' | 'Ciências Humanas' | 'Ciências da Natureza';
export type Difficulty = 'fácil' | 'médio' | 'difícil';

export interface Question {
    id: string;
    year: number;
    subject: Subject;
    topic: string;
    difficulty: Difficulty;
    statement: string;
    options: string[];
    correctOption: number;
    explanation: string;
}

const generateMockQuestions = (topic: string, subject: Subject, count: number): Question[] => {
    return Array.from({ length: count }, (_, i) => ({
        id: `q-${topic.toLowerCase().replace(/\s/g, '-')}-${i}`,
        year: 2024 - (i % 24),
        subject,
        topic,
        difficulty: i % 3 === 0 ? 'fácil' : (i % 3 === 1 ? 'médio' : 'difícil'),
        statement: `Questão ${i + 1} sobre ${topic}. Este é um enunciado simulado baseado nas competências do ENEM para a área de ${subject}.`,
        options: [
            `Alternativa A: Correta para o cenário ${i}`,
            `Alternativa B: Incorreta comum em ${topic}`,
            `Alternativa C: Distrator clássico`,
            `Alternativa D: Fuga parcial do tema`,
            `Alternativa E: Conclusão equivocada`
        ],
        correctOption: 0,
        explanation: `A explicação para esta questão de ${topic} reside na aplicação direta dos conceitos fundamentais da BNCC explorados nesta trilha.`
    }));
};

const MOCK_QUESTIONS: Question[] = [
    ...generateMockQuestions("Funções de 1º Grau", "Matemática", 8),
    ...generateMockQuestions("Geometria Plana", "Matemática", 8),
    ...generateMockQuestions("Probabilidade", "Matemática", 8),
    ...generateMockQuestions("Modernismo no Brasil", "Linguagens", 8),
    ...generateMockQuestions("Figuras de Linguagem", "Linguagens", 8),
    ...generateMockQuestions("Brasil Colônia", "Ciências Humanas", 8),
    ...generateMockQuestions("Revolução Industrial", "Ciências Humanas", 8),
    ...generateMockQuestions("Ecologia", "Ciências da Natureza", 8),
    ...generateMockQuestions("Termodinâmica", "Ciências da Natureza", 8),
];

export const QuestionService = {
    getQuestions: (filters?: { year?: number; subject?: string; difficulty?: string; topic?: string }) => {
        return MOCK_QUESTIONS.filter(q => {
            if (filters?.year && q.year !== filters.year) return false;
            if (filters?.subject && q.subject !== filters.subject) return false;
            if (filters?.difficulty && q.difficulty !== filters.difficulty) return false;
            if (filters?.topic && q.topic !== filters.topic) return false;
            return true;
        });
    },

    // Integração com API Real (enem.dev)
    fetchQuestions: async (year?: number): Promise<Question[]> => {
        try {
            const baseUrl = 'https://api.enem.dev/v1/exams';
            const response = await fetch(year ? `${baseUrl}/${year}/questions` : 'https://api.enem.dev/v1/questions');
            if (!response.ok) throw new Error('Falha ao buscar perguntas da API');

            const data = await response.json();

            // Mapeamento para o formato interno
            return data.map((q: any) => ({
                id: q.id.toString(),
                year: q.exam_year,
                subject: q.subject === 'MATEMATICA' ? 'Matemática' :
                    (q.subject === 'LINGUAGENS' ? 'Linguagens' :
                        (q.subject === 'HUMANAS' ? 'Ciências Humanas' : 'Ciências da Natureza')),
                topic: q.topic || 'Conhecimentos Gerais',
                difficulty: 'médio', // API nem sempre fornece
                statement: q.context + '\n\n' + q.question,
                options: [q.alternatives.a, q.alternatives.b, q.alternatives.c, q.alternatives.d, q.alternatives.e],
                correctOption: q.correct_alternative === 'a' ? 0 :
                    (q.correct_alternative === 'b' ? 1 :
                        (q.correct_alternative === 'c' ? 2 :
                            (q.correct_alternative === 'd' ? 3 : 4))),
                explanation: q.explanation || 'Resolução oficial indisponível no momento.'
            }));
        } catch (error) {
            console.error('Erro API ENEM:', error);
            return MOCK_QUESTIONS; // Fallback para mock
        }
    },

    getRandomQuiz: async (topic?: string, count: number = 5): Promise<Question[]> => {
        // Tenta buscar da API primeiro para perguntas reais
        // Para fins de performance e limites, usamos um pool randômico
        const questions = await QuestionService.fetchQuestions();

        let pool = questions;
        if (topic) {
            pool = questions.filter(q => q.topic === topic || q.subject.includes(topic));
        }

        const shuffled = [...pool].sort(() => 0.5 - Math.random());
        return shuffled.slice(0, Math.min(count, shuffled.length));
    }
};

