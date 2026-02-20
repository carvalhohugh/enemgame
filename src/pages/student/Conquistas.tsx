import React from 'react';
import { Award, Target, Zap, Shield, Flame, Star, BookOpen, Crown } from 'lucide-react';
import './Conquistas.css';

const BADGES = [
    { id: 1, name: "Primeiro Sangue", desc: "Acertou sua primeira questão na Arena.", icon: <Target />, category: "combat", progress: 100, locked: false },
    { id: 2, name: "Mestre das Humanas", desc: "Completou 50 questões de Ciências Humanas.", icon: <BookOpen />, category: "knowledge", progress: 65, locked: false },
    { id: 3, name: "Guerreiro de Clã", desc: "Venceu 5 batalhas de clã seguidas.", icon: <Shield />, category: "social", progress: 20, locked: false },
    { id: 4, name: "On-Fire", desc: "7 dias seguidos de estudos.", icon: <Flame color="var(--clan-fenix)" />, category: "streak", progress: 100, locked: false },
    { id: 5, name: "Lenda do ENEM", desc: "Atingiu o nível 50.", icon: <Crown color="gold" />, category: "level", progress: 10, locked: true },
    { id: 6, name: "Sniper de Questões", desc: "Acertou 10 questões difíceis seguidas.", icon: <Zap color="var(--clan-titas)" />, category: "combat", progress: 40, locked: false },
];

const Conquistas: React.FC = () => {
    return (
        <div className="conquistas-container">
            <header style={{ marginBottom: '40px' }}>
                <h1 style={{ fontSize: '2.5rem', marginBottom: '8px' }}>Sala de Troféus 🎖️</h1>
                <p style={{ color: 'var(--text-secondary)' }}>Sua jornada heróica imortalizada em conquistas lendárias.</p>

                <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
                    <div className="glass-card" style={{ padding: '16px 24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <Award color="gold" />
                        <div>
                            <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>CONQUISTAS</div>
                            <div style={{ fontWeight: 800 }}>12 / 48</div>
                        </div>
                    </div>
                    <div className="glass-card" style={{ padding: '16px 24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <Star color="var(--primary)" />
                        <div>
                            <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>PRESTÍGIO</div>
                            <div style={{ fontWeight: 800 }}>NÍVEL II</div>
                        </div>
                    </div>
                </div>
            </header>

            <div className="conquistas-grid">
                {BADGES.map(badge => (
                    <div key={badge.id} className={`glass-card badge-card ${badge.locked ? 'locked' : ''}`}>
                        <div className="badge-icon-wrapper">
                            {React.cloneElement(badge.icon as React.ReactElement, { size: 40 })}
                        </div>
                        <h4>{badge.name}</h4>
                        <p>{badge.desc}</p>
                        <div className="badge-progress">
                            <div className="badge-progress-fill" style={{ width: `${badge.progress}%` }} />
                        </div>
                        <div style={{ marginTop: '8px', fontSize: '0.7rem', fontWeight: 700, color: badge.progress === 100 ? 'var(--accent)' : 'var(--text-secondary)' }}>
                            {badge.progress === 100 ? 'CONCLUÍDO' : `${badge.progress}% COMPLETO`}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Conquistas;
