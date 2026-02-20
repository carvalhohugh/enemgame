import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme, type Clan } from '../../context/ThemeContext';

import { Flame, Snowflake, TreePine, Sparkles, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

const CLANS = [
    {
        id: 'ignis' as Clan,
        name: 'Ignis',
        description: 'A nação do fogo. Guerreiros movidos pela paixão e coragem inabalável.',
        icon: <Flame size={48} />,
        color: 'var(--clan-ignis)',
        glow: 'var(--clan-ignis-glow)',
        mascot: 'Fênix de Prata'
    },
    {
        id: 'glacies' as Clan,
        name: 'Glacies',
        description: 'O reino do gelo. Estrategistas que valorizam o foco, a calma e a precisão.',
        icon: <Snowflake size={48} />,
        color: 'var(--clan-glacies)',
        glow: 'var(--clan-glacies-glow)',
        mascot: 'Lince Ártico'
    },
    {
        id: 'silva' as Clan,
        name: 'Silva',
        description: 'A guarda da floresta. Equilíbrio entre sabedoria ancestral e crescimento contínuo.',
        icon: <TreePine size={48} />,
        color: 'var(--clan-silva)',
        glow: 'var(--clan-silva-glow)',
        mascot: 'Cervo de Esmeralda'
    },
    {
        id: 'cosmos' as Clan,
        name: 'Cosmos',
        description: 'Os buscadores das estrelas. Curiosos que exploram os mistérios mais profundos.',
        icon: <Sparkles size={48} />,
        color: 'var(--clan-cosmos)',
        glow: 'var(--clan-cosmos-glow)',
        mascot: 'Dragão Galáctico'
    }
];

const ClanSelection: React.FC = () => {
    const { setClan } = useTheme();
    const navigate = useNavigate();

    const handleSelect = (clanId: Clan) => {
        setClan(clanId);
        navigate('/');
    };

    return (
        <div style={{
            minHeight: '100vh',
            background: 'var(--bg-dark)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '40px 20px'
        }}>
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                style={{ textAlign: 'center', marginBottom: '48px' }}
            >
                <h1 style={{ fontSize: '3rem', marginBottom: '16px', color: 'var(--text-primary)' }}>
                    Escolha sua <span style={{ color: 'var(--primary)', textShadow: '0 0 20px var(--primary-glow)' }}>Nação</span>
                </h1>
                <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem', maxWidth: '600px' }}>
                    Sua jornada no ENEM Foco começa aqui. Cada clã oferece desafios únicos e uma comunidade vibrante.
                </p>
            </motion.div>

            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: '24px',
                width: '100%',
                maxWidth: '1200px'
            }}>
                {CLANS.map((clan, index) => (
                    <motion.div
                        key={clan.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        whileHover={{ y: -10 }}
                        className="glass-card"
                        style={{
                            padding: '32px',
                            cursor: 'pointer',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            textAlign: 'center',
                            border: '1px solid var(--bg-card-border)',
                            position: 'relative',
                            overflow: 'hidden'
                        }}
                        onClick={() => handleSelect(clan.id)}
                    >
                        {/* Glow de fundo */}
                        <div style={{
                            position: 'absolute',
                            top: '-20%',
                            left: '-20%',
                            width: '140%',
                            height: '140%',
                            background: `radial-gradient(circle at center, ${clan.glow}, transparent 70%)`,
                            opacity: 0,
                            transition: 'opacity 0.3s ease'
                        }} className="clan-glow" />

                        <div style={{ color: clan.color, marginBottom: '24px', filter: 'drop-shadow(0 0 10px currentColor)' }}>
                            {clan.icon}
                        </div>

                        <h2 style={{ fontSize: '1.8rem', marginBottom: '12px', color: clan.color }}>{clan.name}</h2>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '20px', lineHeight: '1.6' }}>
                            {clan.description}
                        </p>

                        <div style={{
                            marginTop: 'auto',
                            paddingTop: '20px',
                            borderTop: '1px solid var(--bg-card-border)',
                            width: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '8px',
                            color: clan.color,
                            fontWeight: 700,
                            fontSize: '0.8rem',
                            textTransform: 'uppercase'
                        }}>
                            Mascote: {clan.mascot} <ChevronRight size={16} />
                        </div>
                    </motion.div>
                ))}
            </div>

            <style>{`
                .glass-card:hover .clan-glow {
                    opacity: 0.3 !important;
                }
                .glass-card:hover {
                    border-color: var(--clan-color) !important;
                    box-shadow: 0 0 40px -10px var(--clan-glow) !important;
                }
            `}</style>
        </div>
    );
};

export default ClanSelection;
