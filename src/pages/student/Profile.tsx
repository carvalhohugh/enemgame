import React, { useState, useRef } from 'react';
import {
    Trophy, Award, Target,
    Instagram, Twitter, Linkedin, Github,
    Camera, CheckCircle, Activity, Star,
    Plus, Edit3
} from 'lucide-react';
import { motion } from 'framer-motion';
import './Profile.css';

const RANKING_DATA = [
    { rank: 1, name: 'Lucas Silva', xp: '15.420', clan: 'ignis' },
    { rank: 2, name: 'Ana Souza', xp: '14.850', clan: 'glacies' },
    { rank: 12, name: 'Hugo Vasconcelos', xp: '8.240', clan: 'cosmos', isUser: true },
    { rank: 13, name: 'Mariana Lima', xp: '8.100', clan: 'silva' },
];

const ESSAY_RESULTS = [
    { date: '15/02/2026', theme: 'Impactos da IA na Educação Brasileira', grade: 920, status: 'Corrigida' },
    { date: '08/02/2026', theme: 'Desafios do Saneamento Básico', grade: 880, status: 'Corrigida' },
    { date: '01/02/2026', theme: 'Preservação da Amazônia', grade: null, status: 'Em correção' },
];

const UserProfile: React.FC = () => {
    const [avatar, setAvatar] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setAvatar(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const triggerFileInput = () => {
        fileInputRef.current?.click();
    };

    return (
        <div className="profile-container">
            <header className="profile-hero glass-card">
                <div className="avatar-section">
                    <div className="avatar-wrapper" onClick={triggerFileInput}>
                        {avatar ? (
                            <img src={avatar} alt="Avatar" className="user-avatar" />
                        ) : (
                            <div className="avatar-placeholder">H</div>
                        )}
                        <div className="avatar-overlay">
                            <Camera size={24} />
                        </div>
                    </div>
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleAvatarChange}
                        style={{ display: 'none' }}
                        accept="image/*"
                    />
                    <div className="user-basics">
                        <h1>Hugo <span className="text-secondary">Vasconcelos</span></h1>
                        <p>@hugo_v • Guerreiro Nível 42 • Clã Cosmos</p>
                        <div className="identity-tags">
                            <span className="tag-premium">Premium User</span>
                            <span className="tag-clan">Clã Cosmos</span>
                        </div>
                    </div>
                </div>

                <div className="quick-stats-row">
                    <div className="q-stat">
                        <small>RANKING GLOBAL</small>
                        <strong>#1.242</strong>
                    </div>
                    <div className="q-divider" />
                    <div className="q-stat">
                        <small>XP TOTAL</small>
                        <strong>8.240</strong>
                    </div>
                    <div className="q-divider" />
                    <div className="q-stat">
                        <small>ESTRELA</small>
                        <strong><Star size={14} style={{ display: 'inline', marginRight: '4px' }} /> 4.9</strong>
                    </div>
                </div>
            </header>

            <div className="stats-dashboard-grid">
                {[
                    { label: 'Precisão ENEM', value: '78%', icon: <Target size={20} />, color: 'var(--primary)', desc: 'Média de acertos geral' },
                    { label: 'Média Redação', value: '912', icon: <Edit3 size={20} />, color: '#ec4899', desc: 'Últimas 5 redações' },
                    { label: 'Simulados', value: '14/20', icon: <Activity size={20} />, color: '#10b981', desc: 'Concluídos este mês' },
                    { label: 'Conquistas', value: '32', icon: <Award size={20} />, color: '#f59e0b', desc: 'Troféus desbloqueados' },
                ].map((stat, i) => (
                    <motion.div
                        key={i}
                        whileHover={{ y: -5 }}
                        className="glass-card stat-card-luxury"
                    >
                        <div className="stat-icon-box" style={{ background: `${stat.color}15`, color: stat.color }}>
                            {stat.icon}
                        </div>
                        <div className="stat-content">
                            <p className="stat-label">{stat.label}</p>
                            <h2 className="stat-value">{stat.value}</h2>
                            <p className="stat-desc">{stat.desc}</p>
                        </div>
                    </motion.div>
                ))}
            </div>

            <div className="profile-main-grid">
                <div className="profile-left-col">
                    <div className="glass-card ranking-luxury">
                        <div className="card-header">
                            <h3><Trophy size={18} color="#FFD700" /> Seu Ranking</h3>
                            <button className="view-all">Ver Global</button>
                        </div>
                        <div className="ranking-table-compact">
                            {RANKING_DATA.map((user, i) => (
                                <div key={i} className={`rank-item ${user.isUser ? 'active-rank' : ''}`}>
                                    <span className="pos">#{user.rank}</span>
                                    <div className="user-pill">
                                        <div className="c-dot" style={{ background: `var(--clan-${user.clan})` }} />
                                        {user.name}
                                    </div>
                                    <span className="xp">{user.xp} XP</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="glass-card social-card" style={{ marginTop: '24px' }}>
                        <h3>Redes Conectadas</h3>
                        <div className="social-mini-list">
                            <div className="s-link"><Instagram size={16} /> Instagram <CheckCircle size={12} color="#10b981" /></div>
                            <div className="s-link"><Linkedin size={16} /> LinkedIn <CheckCircle size={12} color="#10b981" /></div>
                            <div className="s-link"><Twitter size={16} /> Twitter / X <CheckCircle size={12} color="#10b981" /></div>
                            <div className="s-link disconnected"><Github size={16} /> GitHub <Plus size={12} /></div>
                        </div>
                        <button className="neon-button mini" style={{ width: '100%', marginTop: '16px' }}>
                            GERENCIAR CONEXÕES
                        </button>
                    </div>
                </div>

                <div className="profile-right-col">
                    <div className="glass-card performance-summary">
                        <h3>Análise de Desempenho</h3>
                        <div className="perf-stats">
                            <div className="perf-item">
                                <div className="label-row">
                                    <span>Linguagens</span>
                                    <span>85%</span>
                                </div>
                                <div className="p-bar"><div className="p-fill" style={{ width: '85%' }}></div></div>
                            </div>
                            <div className="perf-item">
                                <div className="label-row">
                                    <span>Matemática</span>
                                    <span>92%</span>
                                </div>
                                <div className="p-bar"><div className="p-fill" style={{ width: '92%' }}></div></div>
                            </div>
                            <div className="perf-item">
                                <div className="label-row">
                                    <span>Humanas</span>
                                    <span>78%</span>
                                </div>
                                <div className="p-bar"><div className="p-fill" style={{ width: '78%' }}></div></div>
                            </div>
                        </div>

                        <div className="redacao-history-luxury">
                            <h4>Histórico de Redações</h4>
                            {ESSAY_RESULTS.map((res, i) => (
                                <div key={i} className="essay-pill glass-card">
                                    <div className="essay-info">
                                        <strong>{res.theme}</strong>
                                        <small>{res.date} • {res.status}</small>
                                    </div>
                                    <div className="essay-grade" style={{ color: res.grade ? 'var(--primary)' : 'var(--text-secondary)' }}>
                                        {res.grade || '--'}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserProfile;
