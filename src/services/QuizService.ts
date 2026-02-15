
import { ALL_VESTIBULAR_QUESTIONS, type VestibularQuestion } from '@/data/vestibularQuestions';

/**
 * QuizService handles retrieval of questions for battles, quizzes, and exams.
 * It serves as an abstraction layer over local data and potential external APIs.
 */

// Adapter to match BattleQuestion interface used in Arena
export interface ArenaQuestion {
    id: string;
    question: string;
    alternatives: { letter: string; text: string }[];
    correctAnswer: string;
    timeLimit: number;
    difficulty: 'facil' | 'media' | 'dificil';
    topic: string;
}

export const QuizService = {
    /**
     * Fetches questions for a battle (X1 or Clan).
     * Currently retrieves from local vestibular data.
     * In future, this will call an API.
     */
    getBattleQuestions: async (count: number = 5): Promise<ArenaQuestion[]> => {
        // Simulating API delay
        await new Promise(resolve => setTimeout(resolve, 300));

        const shuffled = [...ALL_VESTIBULAR_QUESTIONS].sort(() => Math.random() - 0.5);
        const selected = shuffled.slice(0, count);

        return selected.map(q => ({
            id: q.id,
            question: q.question,
            alternatives: q.alternatives,
            correctAnswer: q.correctAnswer,
            timeLimit: 30, // Default time limit for battles
            difficulty: q.difficulty,
            topic: q.topic
        }));
    },

    /**
     * Fetches questions from Open Trivia DB (English only currently).
     * Returns generic questions if API fails.
     */
    fetchOpenTDBQuestions: async (amount: number = 5): Promise<any[]> => {
        try {
            const response = await fetch(`https://opentdb.com/api.php?amount=${amount}&type=multiple`);
            const data = await response.json();
            return data.results;
        } catch (error) {
            console.error("Failed to fetch from OpenTDB", error);
            return [];
        }
    },

    /**
     * Get a specific daily question (mock implementation)
     */
    getDailyQuestion: (): VestibularQuestion => {
        const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 1000 / 60 / 60 / 24);
        return ALL_VESTIBULAR_QUESTIONS[dayOfYear % ALL_VESTIBULAR_QUESTIONS.length];
    }
};
