import React from 'react';
import { Share2, Users, Gift, TrendingUp, Copy } from 'lucide-react';
import './Indicacoes.css';

const Indicacoes: React.FC = () => {
    return (
        <div className="referral-container">
            <header>
                <h1 style={{ fontSize: '2.5rem', marginBottom: '8px' }}>Sistema de Indicações 🎁</h1>
                <p style={{ color: 'var(--text-secondary)' }}>Expanda seu clã e ganhe recompensas épicas.</p>
            </header>

            <div className="stats-row">
                <div className="glass-card stat-card">
                    <span className="stat-label">Total Indicados</span>
                    <span className="stat-value">12</span>
                    <Users size={20} color="var(--primary)" />
                </div>
                <div className="glass-card stat-card">
                    <span className="stat-label">XP Acumulado</span>
                    <span className="stat-value">6.000</span>
                    <TrendingUp size={20} color="var(--accent)" />
                </div>
                <div className="glass-card stat-card">
                    <span className="stat-label">Próxima Meta</span>
                    <span className="stat-value">3/5</span>
                    <Gift size={20} color="var(--secondary)" />
                </div>
            </div>

            <div className="glass-card referral-code-card">
                <h3>Seu Código de Recrutamento</h3>
                <div className="code-display">HERO-2024</div>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>
                    Compartilhe este código com seus amigos. Você ganha 500 XP quando eles atingirem o nível 5!
                </p>
                <button className="neon-button" style={{ display: 'flex', alignItems: 'center', gap: '8px', margin: '0 auto' }}>
                    <Copy size={18} /> COPIAR CÓDIGO
                </button>
            </div>

            <section className="referral-history">
                <h3 style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Share2 size={20} /> Amigos Recrutados
                </h3>
                <div className="glass-card referral-list">
                    {[
                        { nome: "João Silva", data: "12/02/2024", xp: "+500", status: "Nível 5 Alcançado" },
                        { nome: "Maria Oliveira", data: "10/02/2024", xp: "+500", status: "Nível 5 Alcançado" },
                        { nome: "Pedro Santos", data: "05/02/2024", xp: "Pendente", status: "Nível 2" },
                    ].map((ref, i) => (
                        <div key={i} className="referral-item">
                            <div>
                                <h4 style={{ fontSize: '1rem', marginBottom: '4px' }}>{ref.nome}</h4>
                                <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Indicação em {ref.data}</p>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                                <span className="xp-badge">{ref.xp}</span>
                                <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '4px' }}>{ref.status}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
};

export default Indicacoes;
