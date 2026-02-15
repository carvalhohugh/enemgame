/**
 * Compatibility shim — re-exports from EnemService using the old API names.
 * SimuladoSection and redacao.ts still reference these legacy exports.
 */
import { EnemService } from './EnemService';

export type { EnemExam, EnemQuestion, EnemQuestionsResponse, EnemArea } from './EnemService';

export const fetchEnemExams = EnemService.getExams;
export const fetchEnemQuestions = EnemService.getQuestions;
