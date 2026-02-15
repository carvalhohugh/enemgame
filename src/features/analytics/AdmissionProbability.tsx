import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, GraduationCap, AlertCircle } from 'lucide-react';

interface CourseData {
    name: string;
    university: string;
    weights: {
        linguagens: number;
        humanas: number;
        natureza: number;
        matematica: number;
        redacao: number;
    };
    cutoff2023: number; // Historical minimum score for admission
}

const POPULAR_COURSES: CourseData[] = [
    {
        name: 'Medicina',
        university: 'UnB',
        weights: { linguagens: 1.5, humanas: 1.0, natureza: 3.0, matematica: 2.0, redacao: 1.5 },
        cutoff2023: 780,
    },
    {
        name: 'Direito',
        university: 'UnB',
        weights: { linguagens: 2.0, humanas: 3.0, natureza: 1.0, matematica: 1.0, redacao: 2.0 },
        cutoff2023: 720,
    },
    {
        name: 'Engenharia de Software',
        university: 'UnB',
        weights: { linguagens: 1.0, humanas: 1.0, natureza: 1.5, matematica: 4.0, redacao: 1.0 },
        cutoff2023: 700,
    },
    {
        name: 'Psicologia',
        university: 'UFG',
        weights: { linguagens: 2.0, humanas: 3.0, natureza: 1.5, matematica: 1.0, redacao: 2.5 },
        cutoff2023: 680,
    },
    {
        name: 'Administração',
        university: 'UFG',
        weights: { linguagens: 1.5, humanas: 2.0, natureza: 1.0, matematica: 2.5, redacao: 1.5 },
        cutoff2023: 640,
    },
];

function calculateWeightedAverage(
    scores: { linguagens: number; humanas: number; natureza: number; matematica: number; redacao: number },
    weights: CourseData['weights']
): number {
    const totalWeight = Object.values(weights).reduce((a, b) => a + b, 0);
    const weightedSum =
        scores.linguagens * weights.linguagens +
        scores.humanas * weights.humanas +
        scores.natureza * weights.natureza +
        scores.matematica * weights.matematica +
        scores.redacao * weights.redacao;
    return Math.round((weightedSum / totalWeight) * 100) / 100;
}

function getProbability(weightedAvg: number, cutoff: number): number {
    // Simplified logistic probability based on distance from cutoff
    const diff = weightedAvg - cutoff;
    const prob = 1 / (1 + Math.exp(-0.03 * diff));
    return Math.round(prob * 100);
}

function getProbabilityColor(prob: number): string {
    if (prob >= 70) return '#10b981';
    if (prob >= 40) return '#eab308';
    return '#ef4444';
}

function getProbabilityLabel(prob: number): string {
    if (prob >= 80) return 'Muito Alta';
    if (prob >= 60) return 'Alta';
    if (prob >= 40) return 'Moderada';
    if (prob >= 20) return 'Baixa';
    return 'Muito Baixa';
}

export default function AdmissionProbability() {
    const [scores, setScores] = useState({
        linguagens: 600,
        humanas: 620,
        natureza: 580,
        matematica: 650,
        redacao: 700,
    });

    const results = useMemo(() =>
        POPULAR_COURSES.map(course => {
            const avg = calculateWeightedAverage(scores, course.weights);
            const probability = getProbability(avg, course.cutoff2023);
            return { ...course, weightedAvg: avg, probability };
        }).sort((a, b) => b.probability - a.probability),
        [scores]
    );

    const scoreFields = [
        { key: 'linguagens' as const, label: 'Linguagens', emoji: '📝' },
        { key: 'humanas' as const, label: 'Humanas', emoji: '🌎' },
        { key: 'natureza' as const, label: 'Natureza', emoji: '🔬' },
        { key: 'matematica' as const, label: 'Matemática', emoji: '📐' },
        { key: 'redacao' as const, label: 'Redação', emoji: '✍️' },
    ];

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <GraduationCap className="w-5 h-5 text-purple-light" />
                    Simulador SISU
                </h2>
                <p className="text-sm text-white/50 mt-1">Estime sua chance de aprovação com base nas notas e pesos de cada curso.</p>
            </div>

            {/* Score Inputs */}
            <div className="bg-white/5 rounded-xl p-4 border border-white/5">
                <div className="grid grid-cols-5 gap-3">
                    {scoreFields.map(field => (
                        <div key={field.key} className="text-center">
                            <span className="text-lg">{field.emoji}</span>
                            <p className="text-[10px] text-white/40 mb-1">{field.label}</p>
                            <input
                                type="number"
                                min={300}
                                max={1000}
                                value={scores[field.key]}
                                onChange={(e) => setScores(prev => ({ ...prev, [field.key]: parseInt(e.target.value) || 0 }))}
                                className="w-full bg-white/5 border border-white/10 rounded-lg px-2 py-1.5 text-sm text-white text-center focus:outline-none focus:border-purple/50 transition-colors"
                            />
                        </div>
                    ))}
                </div>
            </div>

            {/* Results */}
            <div className="space-y-2">
                {results.map((course, i) => {
                    const color = getProbabilityColor(course.probability);
                    const label = getProbabilityLabel(course.probability);

                    return (
                        <motion.div
                            key={course.name}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.05 }}
                            className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5 hover:bg-white/[0.07] transition-colors"
                        >
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-white truncate">{course.name}</p>
                                <p className="text-xs text-white/40">{course.university} • Corte: {course.cutoff2023}</p>
                            </div>
                            <div className="flex items-center gap-3 shrink-0">
                                <span className="text-xs" style={{ color }}>{label}</span>
                                <div className="w-16 h-1.5 bg-white/10 rounded-full overflow-hidden">
                                    <div
                                        className="h-full rounded-full transition-all duration-500"
                                        style={{ width: `${course.probability}%`, backgroundColor: color }}
                                    />
                                </div>
                                <span className="text-sm font-bold w-10 text-right" style={{ color }}>
                                    {course.probability}%
                                </span>
                            </div>
                        </motion.div>
                    );
                })}
            </div>

            <div className="flex items-start gap-2 text-xs text-white/30 bg-white/5 rounded-lg p-3">
                <AlertCircle className="w-3 h-3 mt-0.5 shrink-0" />
                <span>Estimativa baseada em dados históricos do SISU. Os pesos e notas de corte podem variar a cada edição.</span>
            </div>
        </div>
    );
}
