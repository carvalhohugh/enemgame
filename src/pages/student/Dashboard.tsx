import React from 'react';
import {
    Radar, RadarChart, PolarGrid,
    PolarAngleAxis, ResponsiveContainer
} from 'recharts';
import { Share2, Zap, Target, Swords } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { motion } from 'framer-motion';
import './Dashboard.css';

const performanceData = [
    { area: 'Matemática', value: 85 },
    { area: 'Linguagens', value: 70 },
    { area: 'Humanas', value: 90 },
    { area: 'Natureza', value: 65 },
    { area: 'Redação', value: 80 },
];

const Dashboard: React.FC = () => {
    const { clan } = useTheme();
    const clanInfos = {
        ignis: { name: 'Ignis', icon: '🔥', description: 'O fogo da vitória e o foco absoluto.' },
        glacies: { name: 'Glacies', icon: '❄️', description: 'A frieza estratégica e o cálculo preciso.' },
        guardioes: { name: 'Guardiões', icon: '🌿', description: 'A base inabalável e a persistência eterna.' },
        cosmos: { name: 'Cosmos', icon: '✨', description: 'A visão infinita e a conexão universal.' }
    };

    const currentClan = clan ? clanInfos[clan as keyof typeof clanInfos] : { name: 'Exploradores', icon: '🚀', description: 'Em busca do seu destino na Arena ENEM.' };

    return (
        <div className="dashboard-container">
            <div className="clan-hero-section glass-card" style={{
                borderColor: 'var(--clan-color)',
                background: 'linear-gradient(135deg, rgba(var(--clan-color-rgb), 0.1) 0%, rgba(var(--clan-color-rgb), 0.02) 100%)'
            }}>
                <div className="clan-mascot-placeholder">
                    {currentClan.icon}
                </div>
                <div className="clan-hero-content">
                    <span className="clan-label">SEU CLÃ ATUAL</span>
                    <h1 className="clan-title">NAÇÃO {currentClan.name.toUpperCase()}</h1>
                    <p className="clan-description">{currentClan.description}</p>

                    <div className="clan-progress-wrapper" style={{ marginTop: '20px' }}>
                        <div className="clan-progress-header">
                            <span style={{ fontSize: '0.75rem', fontWeight: 800 }}>NÍVEL 18 • MESTRE DE COMBATE</span>
                            <span style={{ fontSize: '0.75rem', fontWeight: 800, opacity: 0.8 }}>2.450 / 5.000 XP</span>
                        </div>
                        <div className="clan-progress-bar">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: '65%' }}
                                className="clan-progress-fill"
                                style={{ background: 'var(--clan-color)', boxShadow: '0 0 15px var(--clan-color)' }}
                            />
                        </div>
                    </div>
                </div>
                <div className="clan-hero-actions">
                    <button className="neon-button">
                        CONVOCAR AMIGOS <Share2 size={18} />
                    </button>
                    <button className="neon-button secondary">
                        VER MEU CLÃ
                    </button>
                </div>
            </div>

            <div className="dashboard-grid">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card stat-card">
                    <div>
                        <span className="stat-label">Batalhas Ganhas</span>
                        <span className="stat-value">124</span>
                    </div>
                    <div className="stat-icon" style={{ background: 'rgba(16, 185, 129, 0.1)', color: 'var(--accent)' }}><Swords size={24} /></div>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card stat-card">
                    <div>
                        <span className="stat-label">Média ENEM</span>
                        <span className="stat-value">782.4</span>
                    </div>
                    <div className="stat-icon" style={{ background: 'rgba(99, 102, 241, 0.1)', color: 'var(--primary)' }}><Target size={24} /></div>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card stat-card">
                    <div>
                        <span className="stat-label">Sequência Atual</span>
                        <span className="stat-value">12 Dias</span>
                    </div>
                    <div className="stat-icon" style={{ background: 'rgba(245, 158, 11, 0.1)', color: 'var(--secondary)' }}><Zap size={24} /></div>
                </motion.div>

                <div className="glass-card chart-section">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Mapeamento de Poder</h3>
                        <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>BASEADO NAS ÚLTIMAS 50 QUESTÕES</span>
                    </div>
                    <div style={{ height: '300px' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={performanceData}>
                                <PolarGrid stroke="rgba(255,255,255,0.05)" />
                                <PolarAngleAxis dataKey="area" tick={{ fill: 'var(--text-secondary)', fontSize: 11, fontWeight: 700 }} />
                                <Radar
                                    name="Proficiência"
                                    dataKey="value"
                                    stroke="var(--clan-color)"
                                    fill="var(--clan-color)"
                                    fillOpacity={0.4}
                                />
                            </RadarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="glass-card goals-section">
                    <h3 style={{ marginBottom: '24px', fontSize: '1.25rem', fontWeight: 800 }}>Missões da Semana</h3>
                    <div style={{ display: 'grid', gap: '20px' }}>
                        {[
                            { label: 'Treinamento Redação', current: 3, total: 5, color: 'var(--primary)' },
                            { label: 'Vitórias em Combate', current: 8, total: 10, color: 'var(--accent)' },
                            { label: 'Conteúdos da Trilha', current: 12, total: 20, color: 'var(--secondary)' },
                        ].map((goal, i) => (
                            <div key={i} className="goal-item">
                                <div style={{ flex: 1 }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', alignItems: 'center' }}>
                                        <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>{goal.label}</span>
                                        <span style={{ fontSize: '0.8rem', fontWeight: 800, opacity: 0.8 }}>{goal.current}/{goal.total}</span>
                                    </div>
                                    <div className="goal-progress" style={{ height: '6px' }}>
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${(goal.current / goal.total) * 100}%` }}
                                            className="goal-fill"
                                            style={{ background: goal.color }}
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <button className="neon-button" style={{ marginTop: '32px', width: '100%', borderRadius: '12px', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--bg-card-border)' }}>
                        VER TODAS AS MISSÕES
                    </button>
                </div>

                <div className="glass-card activities-section">
                    <h3 style={{ marginBottom: '24px', fontSize: '1.25rem', fontWeight: 800 }}>Atividade Recente</h3>
                    <div style={{ display: 'grid', gap: '16px' }}>
                        {[
                            { type: 'combat', msg: 'Venceu combate contra Pedro H.', time: '2m atrás', xp: '+150' },
                            { type: 'study', msg: 'Concluiu Trilha: Modernismo', time: '1h atrás', xp: '+500' },
                            { type: 'rank', msg: 'Subiu para Top 10 Regional', time: '4h atrás', xp: '' },
                        ].map((act, i) => (
                            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '12px', background: 'rgba(255,255,255,0.02)', borderRadius: '12px' }}>
                                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: act.type === 'combat' ? 'var(--accent)' : 'var(--primary)' }} />
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontSize: '0.9rem', fontWeight: 500 }}>{act.msg}</div>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{act.time}</div>
                                </div>
                                <div style={{ color: 'var(--accent)', fontWeight: 800, fontSize: '0.8rem' }}>{act.xp}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
