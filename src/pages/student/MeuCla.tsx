import React from 'react';
import { Shield, Users, Trophy, Zap, Star } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import './MeuCla.css';

const MeuCla: React.FC = () => {
    const { clan } = useTheme();
    const clanNames = {
        ignis: 'Ignis',
        glacies: 'Glacies',
        guardioes: 'Guardiões',
        cosmos: 'Cosmos'
    };

    const currentClan = clan || 'ignis';

    return (
        <div className="cla-container">
            <header className="cla-header glass-card" style={{ borderColor: 'var(--clan-color)' }}>
                <div className="cla-identity">
                    <Shield size={64} color="var(--clan-color)" />
                    <div>
                        <h1 className="text-gradient">CLÃ {clanNames[currentClan as keyof typeof clanNames].toUpperCase()}</h1>
                        <p>Vocação, Honra e Excelência Acadêmica.</p>
                    </div>
                </div>
                <div className="cla-rank glass-card">
                    <Trophy size={24} color="#f59e0b" />
                    <div>
                        <small>RANK GLOBAL</small>
                        <h3>#12º LUGAR</h3>
                    </div>
                </div>
            </header>

            <div className="cla-grid">
                <section className="glass-card member-info">
                    <h3><Users size={20} /> Membros do Esquadrão</h3>
                    <div className="member-list">
                        {[
                            { name: 'Ricardo Dias', level: 18, role: 'Líder', status: 'online' },
                            { name: 'Letícia Melo', level: 15, role: 'Veterana', status: 'offline' },
                            { name: 'Hugo Vasconcelos', level: 12, role: 'Membro', status: 'online' },
                        ].map((m, i) => (
                            <div key={i} className="member-item">
                                <div className={`status-dot ${m.status}`} />
                                <div className="m-info">
                                    <strong>{m.name}</strong>
                                    <small>{m.role} • Nível {m.level}</small>
                                </div>
                                <div className="m-xp">+2450 XP</div>
                            </div>
                        ))}
                    </div>
                </section>

                <div className="cla-side">
                    <section className="glass-card stat-card">
                        <Zap size={24} color="var(--primary)" />
                        <div>
                            <h4>Bônus de Clã</h4>
                            <p>+15% XP em simulados de Matemática</p>
                        </div>
                    </section>

                    <section className="glass-card achievements-card">
                        <h3><Star size={20} /> Conquistas Recentes</h3>
                        <div className="achievements-list">
                            <div className="achievement">🏆 Top 1 Mensal: Natureza</div>
                            <div className="achievement">🔥 100 usuários ativos hoje</div>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default MeuCla;
