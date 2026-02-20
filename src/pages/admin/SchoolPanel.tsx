import React, { useState } from 'react';
import {
    Building2, Users, GraduationCap, Trophy,
    Search, TrendingUp, Target, Award, ArrowUpRight
} from 'lucide-react';
import {
    Radar, RadarChart, PolarGrid,
    PolarAngleAxis, ResponsiveContainer
} from 'recharts';
import { motion } from 'framer-motion';
import './SchoolPanel.css';

const performanceData = [
    { area: 'Matemática', value: 78 },
    { area: 'Linguagens', value: 82 },
    { area: 'Humanas', value: 85 },
    { area: 'Natureza', value: 72 },
    { area: 'Redação', value: 88 },
];

const mockStudents = [
    { id: 1, name: 'Hugo Vasconcelos', clan: 'Cosmos', level: 18, avg: 842.5, status: 'Ativo' },
    { id: 2, name: 'Ana Julia', clan: 'Ignis', level: 15, avg: 790.2, status: 'Ativo' },
    { id: 3, name: 'Carlos Eduardo', clan: 'Glacies', level: 12, avg: 755.8, status: 'Inativo' },
    { id: 4, name: 'Beatriz Silva', clan: 'Silva', level: 20, avg: 890.1, status: 'Ativo' },
    { id: 5, name: 'Lucas Mendes', clan: 'Cosmos', level: 14, avg: 730.4, status: 'Ativo' },
];

const SchoolPanel: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredStudents = mockStudents.filter(s =>
        s.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="school-panel-container">
            <header className="school-header">
                <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--primary)', marginBottom: '8px' }}>
                        <Building2 size={24} />
                        <span style={{ fontWeight: 800, fontSize: '0.9rem', letterSpacing: '2px' }}>PAINEL DA UNIDADE</span>
                    </div>
                    <h1 style={{ fontSize: '2.5rem', fontWeight: 900 }}>Colégio <span style={{ color: 'white' }}>High Tech Academy</span> 🛡️</h1>
                    <p style={{ color: 'var(--text-secondary)' }}>Relatórios de performance e engajamento dos combatentes.</p>
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                    <button className="neon-button" style={{ borderRadius: '12px' }}>EXPORTAR RELATÓRIO</button>
                </div>
            </header>

            <div className="stats-grid">
                {[
                    { label: "Estudantes", val: "452", icon: <Users />, color: "var(--primary)" },
                    { label: "Média da Unidade", val: "768.4", icon: <Target />, color: "var(--accent)" },
                    { label: "Simulações Ativas", val: "24", icon: <TrendingUp />, color: "var(--secondary)" },
                    { label: "Combatentes Elite", val: "18", icon: <Award />, color: "gold" },
                ].map((s, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="glass-card"
                        style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '16px' }}
                    >
                        <div style={{ padding: '12px', background: `${s.color}20`, color: s.color, borderRadius: '12px' }}>{s.icon}</div>
                        <div>
                            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{s.label}</div>
                            <div style={{ fontSize: '1.5rem', fontWeight: 800 }}>{s.val}</div>
                        </div>
                    </motion.div>
                ))}
            </div>

            <div className="school-main-grid">
                <section className="glass-card students-section">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <GraduationCap size={22} color="var(--primary)" /> Estudantes Cadastrados
                        </h3>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: 'rgba(255,255,255,0.05)', padding: '10px 16px', borderRadius: '12px', width: '300px' }}>
                            <Search size={16} color="var(--text-secondary)" />
                            <input
                                type="text"
                                placeholder="Filtrar por nome..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                style={{ background: 'none', border: 'none', color: 'white', fontSize: '0.9rem', width: '100%' }}
                            />
                        </div>
                    </div>

                    <table className="student-table">
                        <thead>
                            <tr>
                                <th>ESTUDANTE</th>
                                <th>CLÃ</th>
                                <th>NÍVEL</th>
                                <th>MÉDIA GERAL</th>
                                <th>STATUS</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredStudents.map((s) => (
                                <tr key={s.id}>
                                    <td style={{ fontWeight: 700 }}>{s.name}</td>
                                    <td>
                                        <span style={{
                                            background: `var(--clan-${s.clan.toLowerCase()}-glow)20`,
                                            padding: '4px 12px',
                                            borderRadius: '20px',
                                            fontSize: '0.75rem',
                                            color: `var(--clan-${s.clan.toLowerCase()})`,
                                            fontWeight: 800
                                        }}>
                                            {s.clan.toUpperCase()}
                                        </span>
                                    </td>
                                    <td>lvl {s.level}</td>
                                    <td style={{ fontWeight: 800, color: s.avg > 800 ? 'var(--accent)' : 'white' }}>{s.avg}</td>
                                    <td>
                                        <span style={{
                                            width: '8px', height: '8px', borderRadius: '50%', display: 'inline-block',
                                            background: s.status === 'Ativo' ? 'var(--accent)' : 'var(--secondary)',
                                            marginRight: '8px'
                                        }} />
                                        {s.status}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </section>

                <section className="glass-card ranking-section">
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <Trophy size={22} color="gold" /> Ranking da Unidade
                    </h3>
                    <div className="ranking-list">
                        {mockStudents.sort((a, b) => b.avg - a.avg).slice(0, 5).map((s, i) => (
                            <div key={s.id} className="rank-item">
                                <div className={`rank-number ${i < 3 ? `top-${i + 1}` : ''}`}>{i + 1}</div>
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{s.name}</div>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Clã {s.clan}</div>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <div style={{ fontWeight: 800, color: 'var(--accent)' }}>{s.avg}</div>
                                    <div style={{ fontSize: '0.65rem', opacity: 0.5 }}>PONTOS</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                <section className="glass-card analytics-section">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px' }}>
                        <div>
                            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '4px' }}>Proficiência da Escola</h3>
                            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Média ponderada por área de conhecimento.</p>
                        </div>
                        <button style={{ color: 'var(--primary)', background: 'none', border: 'none', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
                            ANALISAR TENDÊNCIAS <ArrowUpRight size={16} />
                        </button>
                    </div>

                    <div style={{ height: '400px' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={performanceData}>
                                <PolarGrid stroke="rgba(255,255,255,0.05)" />
                                <PolarAngleAxis dataKey="area" tick={{ fill: 'var(--text-secondary)', fontSize: 12, fontWeight: 700 }} />
                                <Radar
                                    name="Performance"
                                    dataKey="value"
                                    stroke="var(--primary)"
                                    fill="var(--primary)"
                                    fillOpacity={0.4}
                                />
                            </RadarChart>
                        </ResponsiveContainer>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default SchoolPanel;
