import { motion } from 'framer-motion';
import { ArrowLeft, CheckCircle, AlertTriangle, XCircle } from 'lucide-react';
import type { EssayResult, CompetencyScore } from './types';

function getScoreColor(score: number): string {
    if (score >= 160) return '#10b981'; // Green
    if (score >= 80) return '#eab308';  // Yellow
    return '#ef4444'; // Red
}

function getScoreIcon(score: number) {
    if (score >= 160) return CheckCircle;
    if (score >= 80) return AlertTriangle;
    return XCircle;
}

function getScoreLabel(score: number): string {
    if (score >= 160) return 'Ótimo';
    if (score >= 120) return 'Bom';
    if (score >= 80) return 'Regular';
    if (score >= 40) return 'Insuficiente';
    return 'Crítico';
}

interface CorrectorAIProps {
    result: EssayResult;
    onNewEssay: () => void;
}

export default function CorrectorAI({ result, onNewEssay }: CorrectorAIProps) {
    const totalColor = getScoreColor(result.totalScore / 5);

    return (
        <div className="max-w-3xl mx-auto space-y-8">
            {/* Back Button */}
            <button
                onClick={onNewEssay}
                className="flex items-center gap-2 text-sm text-white/50 hover:text-white transition-colors"
            >
                <ArrowLeft className="w-4 h-4" />
                Nova Redação
            </button>

            {/* Total Score Card */}
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center p-8 rounded-2xl bg-white/5 border border-white/10"
            >
                <p className="text-sm text-white/50 uppercase tracking-wider mb-2">Nota Total</p>
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-6xl font-bold font-poppins"
                    style={{ color: totalColor }}
                >
                    {result.totalScore}
                </motion.p>
                <p className="text-sm text-white/40 mt-2">de 1000 pontos</p>

                {/* Progress bar */}
                <div className="mt-4 w-64 h-2 bg-white/10 rounded-full mx-auto overflow-hidden">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${(result.totalScore / 1000) * 100}%` }}
                        transition={{ delay: 0.5, duration: 1, ease: 'easeOut' }}
                        className="h-full rounded-full"
                        style={{ backgroundColor: totalColor }}
                    />
                </div>
            </motion.div>

            {/* Overall Feedback */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="p-5 rounded-xl bg-white/5 border border-white/5"
            >
                <p className="text-sm text-white/70 leading-relaxed">{result.overallFeedback}</p>
            </motion.div>

            {/* Competency Breakdown */}
            <div className="space-y-3">
                <h3 className="text-sm font-semibold text-white/50 uppercase tracking-wider">Competências INEP</h3>
                {result.competencies.map((comp, i) => (
                    <CompetencyCard key={comp.id} competency={comp} index={i} />
                ))}
            </div>

            {/* CTA */}
            <button
                onClick={onNewEssay}
                className="w-full py-3.5 rounded-xl bg-purple/20 hover:bg-purple/30 text-purple-light font-medium transition-colors border border-purple/20 hover:border-purple/40"
            >
                Escrever Nova Redação
            </button>
        </div>
    );
}

function CompetencyCard({ competency, index }: { competency: CompetencyScore; index: number }) {
    const color = getScoreColor(competency.score);
    const Icon = getScoreIcon(competency.score);
    const label = getScoreLabel(competency.score);

    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 + index * 0.1 }}
            className="p-4 rounded-xl bg-white/5 border border-white/5 space-y-2"
        >
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Icon className="w-4 h-4" style={{ color }} />
                    <span className="text-sm font-medium text-white">{competency.name}</span>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: `${color}20`, color }}>{label}</span>
                    <span className="text-sm font-bold" style={{ color }}>{competency.score}/200</span>
                </div>
            </div>
            <p className="text-xs text-white/40">{competency.description}</p>
            <p className="text-sm text-white/60 leading-relaxed">{competency.feedback}</p>

            {/* Score bar */}
            <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(competency.score / 200) * 100}%` }}
                    transition={{ delay: 0.8 + index * 0.1, duration: 0.6 }}
                    className="h-full rounded-full"
                    style={{ backgroundColor: color }}
                />
            </div>
        </motion.div>
    );
}
