import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Radar } from 'lucide-react';

interface SkillData {
    label: string;
    value: number; // 0-100
    color: string;
}

const MOCK_SKILLS: SkillData[] = [
    { label: 'Linguagens', value: 72, color: '#a855f7' },
    { label: 'Humanas', value: 85, color: '#3b82f6' },
    { label: 'Natureza', value: 58, color: '#10b981' },
    { label: 'Matemática', value: 65, color: '#f97316' },
    { label: 'Redação', value: 80, color: '#eab308' },
];

function polarToCartesian(cx: number, cy: number, r: number, angleInDegrees: number) {
    const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180;
    return {
        x: cx + r * Math.cos(angleInRadians),
        y: cy + r * Math.sin(angleInRadians),
    };
}

export default function ActivityRadar() {
    const skills = MOCK_SKILLS;
    const cx = 150;
    const cy = 150;
    const maxR = 100;
    const levels = 5;
    const angleStep = 360 / skills.length;

    // Generate polygon path for radar shape
    const radarPath = useMemo(() => {
        return skills
            .map((skill, i) => {
                const angle = i * angleStep;
                const r = (skill.value / 100) * maxR;
                const { x, y } = polarToCartesian(cx, cy, r, angle);
                return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
            })
            .join(' ') + ' Z';
    }, [skills]);

    return (
        <div className="space-y-4">
            <div className="flex items-center gap-2">
                <Radar className="w-5 h-5 text-purple-light" />
                <h3 className="font-semibold text-white">Radar de Habilidades</h3>
            </div>

            <div className="bg-white/5 rounded-2xl p-6 border border-white/5">
                <svg viewBox="0 0 300 300" className="w-full max-w-[280px] mx-auto">
                    {/* Grid circles */}
                    {Array.from({ length: levels }, (_, i) => {
                        const r = ((i + 1) / levels) * maxR;
                        const points = skills
                            .map((_, j) => {
                                const { x, y } = polarToCartesian(cx, cy, r, j * angleStep);
                                return `${x},${y}`;
                            })
                            .join(' ');
                        return (
                            <polygon
                                key={i}
                                points={points}
                                fill="none"
                                stroke="rgba(255,255,255,0.08)"
                                strokeWidth={1}
                            />
                        );
                    })}

                    {/* Axis lines */}
                    {skills.map((_, i) => {
                        const { x, y } = polarToCartesian(cx, cy, maxR, i * angleStep);
                        return (
                            <line
                                key={i}
                                x1={cx}
                                y1={cy}
                                x2={x}
                                y2={y}
                                stroke="rgba(255,255,255,0.06)"
                                strokeWidth={1}
                            />
                        );
                    })}

                    {/* Data polygon */}
                    <motion.path
                        d={radarPath}
                        fill="rgba(124, 58, 237, 0.15)"
                        stroke="#7c3aed"
                        strokeWidth={2}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                    />

                    {/* Data points */}
                    {skills.map((skill, i) => {
                        const angle = i * angleStep;
                        const r = (skill.value / 100) * maxR;
                        const { x, y } = polarToCartesian(cx, cy, r, angle);
                        return (
                            <motion.circle
                                key={i}
                                cx={x}
                                cy={y}
                                r={4}
                                fill={skill.color}
                                stroke="#0f0a1e"
                                strokeWidth={2}
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: 0.5 + i * 0.1 }}
                            />
                        );
                    })}

                    {/* Labels */}
                    {skills.map((skill, i) => {
                        const angle = i * angleStep;
                        const { x, y } = polarToCartesian(cx, cy, maxR + 25, angle);
                        return (
                            <text
                                key={i}
                                x={x}
                                y={y}
                                textAnchor="middle"
                                dominantBaseline="middle"
                                fill="rgba(255,255,255,0.5)"
                                fontSize={11}
                                fontFamily="Inter, sans-serif"
                            >
                                {skill.label}
                            </text>
                        );
                    })}
                </svg>

                {/* Legend */}
                <div className="grid grid-cols-5 gap-2 mt-4">
                    {skills.map(skill => (
                        <div key={skill.label} className="text-center">
                            <div
                                className="w-2 h-2 rounded-full mx-auto mb-1"
                                style={{ backgroundColor: skill.color }}
                            />
                            <p className="text-lg font-bold text-white">{skill.value}%</p>
                            <p className="text-[10px] text-white/40">{skill.label}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
