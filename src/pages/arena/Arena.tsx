import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Target, Users, Shield } from 'lucide-react';
import BattleRoom from './BattleRoom';
import './Arena.css';

const AREAS = ["Linguagens", "Matemática", "Humanas", "Natureza"];

const Arena: React.FC = () => {
    const [battleType, setBattleType] = useState<'X1' | 'Clan'>('X1');
    const [selectedAreas, setSelectedAreas] = useState<string[]>([]);
    const [selectedYear, setSelectedYear] = useState<number>(2024);
    const [isSearching, setIsSearching] = useState(false);
    const [inBattle, setInBattle] = useState(false);

    const toggleArea = (area: string) => {
        setSelectedAreas(prev =>
            prev.includes(area) ? prev.filter(a => a !== area) : [...prev, area]
        );
    };

    const handleCreateBattle = () => {
        setIsSearching(true);
        setTimeout(() => {
            setInBattle(true);
            setIsSearching(false);
        }, 2000);
    };

    if (inBattle) {
        return <BattleRoom year={selectedYear} onExit={() => setInBattle(false)} />;
    }

    return (
        <div className="arena-container">
            <motion.header
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <h1 style={{ fontSize: '2.5rem', marginBottom: '8px' }}>Arena de Batalhas ⚔️</h1>
                <p style={{ color: 'var(--text-secondary)' }}>Desafie outros heróis com questões reais do INEP (2000-2024).</p>
            </motion.header>

            <div className="battle-creation">
                <motion.section
                    className="glass-card"
                    style={{ padding: '32px' }}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                >
                    <h3 style={{ marginBottom: '24px' }}>Configurar Batalha</h3>

                    <div className="battle-type-selector">
                        <div
                            className={`glass-card type-card ${battleType === 'X1' ? 'active' : ''}`}
                            onClick={() => setBattleType('X1')}
                        >
                            <Target size={32} />
                            <h4>Batalha 1v1</h4>
                        </div>
                        <div
                            className={`glass-card type-card ${battleType === 'Clan' ? 'active' : ''}`}
                            onClick={() => setBattleType('Clan')}
                        >
                            <Users size={32} />
                            <h4>Guerra de Clãs</h4>
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
                        <div className="form-group">
                            <label>Ano do ENEM</label>
                            <select
                                value={selectedYear}
                                onChange={(e) => setSelectedYear(Number(e.target.value))}
                                style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--bg-card-border)', color: 'white', padding: '10px', borderRadius: '8px' }}
                            >
                                {Array.from({ length: 25 }, (_, i) => 2024 - i).map(y => (
                                    <option key={y} value={y}>{y}</option>
                                ))}
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Dificuldade</label>
                            <select style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--bg-card-border)', color: 'white', padding: '10px', borderRadius: '8px' }}>
                                <option>Misto (Padrão)</option>
                                <option>Apenas Fáceis</option>
                                <option>Apenas Médias</option>
                                <option>Desafio (Difíceis)</option>
                            </select>
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Escolha as Áreas</label>
                        <div className="multi-select">
                            {AREAS.map(area => (
                                <div
                                    key={area}
                                    className={`select-tag ${selectedAreas.includes(area) ? 'active' : ''}`}
                                    onClick={() => toggleArea(area)}
                                >
                                    {area}
                                </div>
                            ))}
                        </div>
                    </div>

                    <button
                        className={`neon-button ${isSearching ? 'loading' : ''}`}
                        style={{ width: '100%', marginTop: '12px', height: '50px' }}
                        onClick={handleCreateBattle}
                        disabled={isSearching}
                    >
                        {isSearching ? 'PROCURANDO OPONENTE...' : 'ENTRAR NA ARENA'}
                    </button>
                </motion.section>

                <motion.section
                    className="arena-stats"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <div className="glass-card" style={{ padding: '24px', marginBottom: '24px' }}>
                        <h4 style={{ color: 'var(--secondary)', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                            <Shield size={18} /> Sua Classificação
                        </h4>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem' }}>
                            <span>Patente</span>
                            <span style={{ color: 'var(--primary)', fontWeight: 700 }}>Diamante II</span>
                        </div>
                        <div className="goal-progress" style={{ marginTop: '8px' }}>
                            <div className="goal-fill" style={{ width: '65%', background: 'var(--primary)' }} />
                        </div>
                    </div>

                    <h3 style={{ marginBottom: '16px' }}>Salas em Andamento</h3>
                    <div className="active-battles">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="glass-card battle-card">
                                <div className="battle-info">
                                    <h4>Sala de Elite #0{i}</h4>
                                    <p>ENEM 2023 • 15 Heróis</p>
                                </div>
                                <div className="live-badge-mini" style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--error)', boxShadow: '0 0 10px var(--error)' }} />
                            </div>
                        ))}
                    </div>
                </motion.section>
            </div>
        </div>
    );
};

export default Arena;
