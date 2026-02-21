import { Trophy, Award, BookOpen, Target, TrendingUp, ChevronRight, Instagram, Twitter, Linkedin, Github } from 'lucide-react';
import { motion } from 'framer-motion';


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
    // const { clan } = useTheme(); // Removido por estar não utilizado


    return (
        <div className="profile-container" style={{ padding: '20px' }}>
            <header style={{ marginBottom: '40px' }}>
                <h1 style={{ fontSize: '2.5rem', marginBottom: '8px' }}>Seu <span style={{ color: 'var(--clan-color)' }}>Perfil de Combate</span></h1>
                <p style={{ color: 'var(--text-secondary)' }}>Estatísticas detalhadas e progresso acadêmico.</p>
            </header>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px', marginBottom: '40px' }}>
                {/* Stats Grid */}
                {[
                    { label: 'Total XP', value: '8.240', icon: <TrendingUp size={20} />, color: 'var(--primary)' },
                    { label: 'Batalhas', value: '142', icon: <Award size={20} />, color: 'var(--accent)' },
                    { label: 'Média Geral', value: '785', icon: <Target size={20} />, color: 'var(--secondary)' },
                    { label: 'Trilhas', value: '15/42', icon: <BookOpen size={20} />, color: 'var(--clan-color)' },
                ].map((stat, i) => (
                    <motion.div
                        key={i}
                        whileHover={{ translateY: -5 }}
                        className="glass-card"
                        style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '20px' }}
                    >
                        <div style={{ padding: '12px', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', color: stat.color }}>
                            {stat.icon}
                        </div>
                        <div>
                            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>{stat.label}</p>
                            <p style={{ fontSize: '1.5rem', fontWeight: 800 }}>{stat.value}</p>
                        </div>
                    </motion.div>
                ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '24px' }}>
                {/* Ranking Table */}
                <div className="glass-card" style={{ padding: '24px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                        <h3 style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><Trophy size={20} color="#FFD700" /> Ranking Regional</h3>
                        <button style={{ background: 'none', border: 'none', color: 'var(--primary)', fontSize: '0.8rem', cursor: 'pointer' }}>Ver Tudo</button>
                    </div>

                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ textAlign: 'left', color: 'var(--text-secondary)', fontSize: '0.75rem', textTransform: 'uppercase' }}>
                                <th style={{ padding: '12px 8px' }}>Pos</th>
                                <th style={{ padding: '12px 8px' }}>Guerreiro</th>
                                <th style={{ padding: '12px 8px' }}>XP</th>
                            </tr>
                        </thead>
                        <tbody>
                            {RANKING_DATA.map((user, i) => (
                                <tr key={i} style={{ borderTop: '1px solid var(--bg-card-border)', background: user.isUser ? 'rgba(99, 102, 241, 0.1)' : 'transparent' }}>
                                    <td style={{ padding: '16px 8px', fontWeight: 800 }}>#{user.rank}</td>
                                    <td style={{ padding: '16px 8px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                        <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: `var(--clan-${user.clan})` }} />
                                        {user.name}
                                        {user.isUser && <span style={{ fontSize: '0.6rem', background: 'var(--primary)', padding: '2px 6px', borderRadius: '4px', marginLeft: '4px' }}>VOCÊ</span>}
                                    </td>
                                    <td style={{ padding: '16px 8px', fontWeight: 700 }}>{user.xp}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Redações Table */}
                <div className="glass-card" style={{ padding: '24px' }}>
                    <h3 style={{ marginBottom: '24px' }}>Histórico de Redações</h3>

                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ textAlign: 'left', color: 'var(--text-secondary)', fontSize: '0.75rem', textTransform: 'uppercase' }}>
                                <th style={{ padding: '12px 8px' }}>Data</th>
                                <th style={{ padding: '12px 8px' }}>Tema</th>
                                <th style={{ padding: '12px 8px' }}>Nota</th>
                            </tr>
                        </thead>
                        <tbody>
                            {ESSAY_RESULTS.map((res, i) => (
                                <tr key={i} style={{ borderTop: '1px solid var(--bg-card-border)' }}>
                                    <td style={{ padding: '16px 8px', fontSize: '0.85rem' }}>{res.date}</td>
                                    <td style={{ padding: '16px 8px' }}>
                                        <p style={{ fontWeight: 600, fontSize: '0.9rem', marginBottom: '2px' }}>{res.theme}</p>
                                        <p style={{ fontSize: '0.75rem', color: res.grade ? 'var(--accent)' : 'var(--secondary)' }}>{res.status}</p>
                                    </td>
                                    <td style={{ padding: '16px 8px' }}>
                                        {res.grade ? (
                                            <span style={{ fontWeight: 800, fontSize: '1.1rem', color: res.grade >= 900 ? 'var(--accent)' : 'var(--text-primary)' }}>
                                                {res.grade}
                                            </span>
                                        ) : '--'}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <button className="neon-button" style={{ marginTop: '24px', width: '100%', borderRadius: 'var(--radius-sm)' }}>
                        Fazer Nova Redação <ChevronRight size={16} />
                    </button>
                </div>
            </div>

            {/* Social Connections */}
            <div className="glass-card" style={{ padding: '24px', marginTop: '24px' }}>
                <h3 style={{ marginBottom: '20px' }}>Conexões Sociais</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                    {[
                        { name: 'Instagram', icon: <Instagram size={20} />, connected: true, user: '@hugo_v' },
                        { name: 'Twitter (X)', icon: <Twitter size={20} />, connected: false },
                        { name: 'LinkedIn', icon: <Linkedin size={20} />, connected: true, user: 'Hugo Vasconcelos' },
                        { name: 'GitHub', icon: <Github size={20} />, connected: false },
                    ].map((app, i) => (
                        <div key={i} style={{ padding: '16px', borderRadius: '12px', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--bg-card-border)', display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <div style={{ color: app.connected ? 'var(--primary)' : 'var(--text-secondary)' }}>{app.icon}</div>
                            <div style={{ flex: 1 }}>
                                <div style={{ fontSize: '0.85rem', fontWeight: 700 }}>{app.name}</div>
                                <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>{app.connected ? app.user : 'Não conectado'}</div>
                            </div>
                            <button className="neon-button mini" style={{ padding: '6px 12px', fontSize: '0.65rem', background: app.connected ? 'rgba(239, 68, 68, 0.1)' : 'var(--primary)' }}>
                                {app.connected ? 'DESCONECTAR' : 'CONECTAR'}
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default UserProfile;
