import React from 'react';
import {
    Calendar, TrendingUp,
    Target, Award
} from 'lucide-react';
import {
    Radar, RadarChart, PolarGrid,
    PolarAngleAxis, ResponsiveContainer,
    BarChart, Bar, XAxis, Tooltip,
    Cell
} from 'recharts';
import { motion } from 'framer-motion';
import './StudentDataVis.css';

const COMPETENCY_DATA = [
    { subject: 'Humanas', A: 85, fullMark: 100 },
    { subject: 'Exatas', A: 92, fullMark: 100 },
    { subject: 'Natureza', A: 78, fullMark: 100 },
    { subject: 'Linguagens', A: 90, fullMark: 100 },
    { subject: 'Redação', A: 95, fullMark: 100 },
];

const CONSISTENCY_DATA = [
    { day: 'Seg', hours: 4 },
    { day: 'Ter', hours: 6 },
    { day: 'Qua', hours: 5 },
    { day: 'Qui', hours: 8 },
    { day: 'Sex', hours: 3 },
    { day: 'Sáb', hours: 10 },
    { day: 'Dom', hours: 2 },
];

const StudentDataVis: React.FC = () => {
    return (
        <div className="datavis-container">
            <header className="datavis-header">
                <div>
                    <h1 style={{ fontSize: '2.5rem', fontWeight: 900 }}>Seu <span className="text-gradient">DNA Acadêmico</span> 🧬</h1>
                    <p style={{ color: 'var(--text-secondary)' }}>Análise profunda de competências e consistência de estudo.</p>
                </div>
            </header>

            <div className="vis-grid">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="vis-card glass-card"
                >
                    <div className="card-header">
                        <Target size={20} color="var(--primary)" />
                        <h3>Radar de Competências</h3>
                    </div>
                    <div className="chart-container" style={{ height: '300px' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={COMPETENCY_DATA}>
                                <PolarGrid stroke="rgba(255,255,255,0.1)" />
                                <PolarAngleAxis dataKey="subject" tick={{ fill: 'var(--text-secondary)', fontSize: 12 }} />
                                <Radar
                                    name="Você"
                                    dataKey="A"
                                    stroke="var(--primary)"
                                    fill="var(--primary)"
                                    fillOpacity={0.5}
                                />
                            </RadarChart>
                        </ResponsiveContainer>
                    </div>
                    <p className="vis-insight">Você é um <strong>Mestre em Exatas</strong>. Continue focando em Natureza para equilibrar sua média geral.</p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="vis-card glass-card"
                >
                    <div className="card-header">
                        <Calendar size={20} color="var(--clan-ignis)" />
                        <h3>Consistência Semanal (Horas)</h3>
                    </div>
                    <div className="chart-container" style={{ height: '300px' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={CONSISTENCY_DATA}>
                                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: 'var(--text-secondary)' }} />
                                <Tooltip
                                    contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--bg-card-border)', borderRadius: '8px' }}
                                    itemStyle={{ color: 'var(--primary)' }}
                                />
                                <Bar dataKey="hours" radius={[4, 4, 0, 0]}>
                                    {CONSISTENCY_DATA.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.hours > 6 ? 'var(--primary)' : 'rgba(255,255,255,0.1)'} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                    <p className="vis-insight">Sábado foi seu dia mais produtivo. Tente manter esse ritmo nas quintas-feiras!</p>
                </motion.div>
            </div>

            <div className="achievements-strip glass-card">
                <div className="strip-item">
                    <Award color="gold" size={32} />
                    <div>
                        <h4>Top 1% em Redação</h4>
                        <small>Você está superando a maioria dos usuários.</small>
                    </div>
                </div>
                <div className="strip-item">
                    <TrendingUp color="#10b981" size={32} />
                    <div>
                        <h4>Crescimento de 15%</h4>
                        <small>Sua média subiu em relação ao mês passado.</small>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StudentDataVis;
