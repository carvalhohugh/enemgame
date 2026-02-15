import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';
import type { ExamScore } from './types';
import { EXAM_TYPE_LABELS, SCORE_FIELDS } from './types';

interface ScoreHistoryListProps {
    scores: ExamScore[];
    onDelete: (id: string) => void;
}

export default function ScoreHistoryList({ scores, onDelete }: ScoreHistoryListProps) {
    const [expandedId, setExpandedId] = useState<string | null>(null);

    if (scores.length === 0) {
        return (
            <div className="text-center py-16 bg-white/5 rounded-2xl border border-white/5">
                <div className="text-4xl mb-4">📊</div>
                <h3 className="text-lg font-medium text-white mb-2">Nenhuma nota registrada</h3>
                <p className="text-sm text-white/40 max-w-sm mx-auto">
                    Registre suas notas do ENEM, vestibulares e simulados para acompanhar sua evolução ao longo do tempo.
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-3">
            <AnimatePresence>
                {scores.map((score) => {
                    const isExpanded = expandedId === score.id;
                    const filledFields = SCORE_FIELDS.filter(f => score.scores[f.key] !== undefined);

                    return (
                        <motion.div
                            key={score.id}
                            layout
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, height: 0 }}
                            className="bg-white/5 rounded-xl border border-white/5 overflow-hidden"
                        >
                            {/* Summary Row */}
                            <button
                                onClick={() => setExpandedId(isExpanded ? null : score.id)}
                                className="w-full flex items-center justify-between p-4 hover:bg-white/5 transition-colors"
                            >
                                <div className="flex items-center gap-3">
                                    <span className="px-2 py-0.5 rounded-md text-xs font-medium bg-purple/20 text-purple-light">
                                        {EXAM_TYPE_LABELS[score.type]}
                                    </span>
                                    <span className="text-sm font-medium text-white">{score.name}</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className="text-sm font-bold text-gold">{score.totalScore}</span>
                                    {isExpanded ? (
                                        <ChevronUp className="w-4 h-4 text-white/30" />
                                    ) : (
                                        <ChevronDown className="w-4 h-4 text-white/30" />
                                    )}
                                </div>
                            </button>

                            {/* Expanded Details */}
                            <AnimatePresence>
                                {isExpanded && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.2 }}
                                        className="overflow-hidden"
                                    >
                                        <div className="px-4 pb-4 pt-0 border-t border-white/5 space-y-3">
                                            {/* Score Breakdown */}
                                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-3">
                                                {filledFields.map(field => (
                                                    <div key={field.key} className="bg-white/5 rounded-lg p-3">
                                                        <div className="flex items-center gap-1.5 mb-1">
                                                            <span className="text-xs">{field.icon}</span>
                                                            <span className="text-xs text-white/50">{field.label}</span>
                                                        </div>
                                                        <p className="text-lg font-bold text-white">{score.scores[field.key]}</p>
                                                    </div>
                                                ))}
                                            </div>

                                            {/* Notes */}
                                            {score.notes && (
                                                <p className="text-xs text-white/40 italic">"{score.notes}"</p>
                                            )}

                                            {/* Actions */}
                                            <div className="flex items-center justify-between pt-1">
                                                <span className="text-xs text-white/30">
                                                    {new Date(score.date).toLocaleDateString('pt-BR')}
                                                </span>
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        onDelete(score.id);
                                                    }}
                                                    className="flex items-center gap-1 text-xs text-red-400/60 hover:text-red-400 transition-colors"
                                                >
                                                    <Trash2 className="w-3 h-3" />
                                                    Remover
                                                </button>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    );
                })}
            </AnimatePresence>
        </div>
    );
}
