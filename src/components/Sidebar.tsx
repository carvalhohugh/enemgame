import React from 'react';
import { NavLink } from 'react-router-dom';
import {
    LayoutDashboard,
    Calendar as CalendarIcon,
    Swords,
    PenTool,
    Trophy,
    Store,
    Users,
    Settings,
    LogOut,
    Zap,
    Video,
    Award,
    GraduationCap,
    FileText,
    Package,
    Target,
    Shield,
    BarChart3,
    Brain,
    Activity
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import './Sidebar.css';

const Sidebar: React.FC = () => {
    const { clan } = useTheme();

    const clanNames = {
        ignis: 'Ignis',
        glacies: 'Glacies',
        silva: 'Silva',
        cosmos: 'Cosmos'
    };

    const navItems = [
        { icon: <LayoutDashboard size={20} />, label: 'Dashboard', path: '/' },
        { icon: <CalendarIcon size={20} />, label: 'Plano Adaptativo', path: '/calendario' },
        { icon: <Swords size={20} />, label: 'Arena ENEM', path: '/arena' },
        { icon: <Target size={20} />, label: 'Zona de Treino', path: '/treinamento' },
        { icon: <Shield size={20} />, label: 'Meu Clã', path: '/meu-cla' },
        { icon: <PenTool size={20} />, label: 'Arena de Redação', path: '/redacao' },
        { icon: <Video size={20} />, label: 'Aulas ao Vivo', path: '/live' },
        { icon: <GraduationCap size={20} />, label: 'Hub de Estudos', path: '/estudos' },
        { icon: <FileText size={20} />, label: 'Minhas Anotações', path: '/anotacoes' },
        { icon: <Trophy size={20} />, label: 'Ranking', path: '/ranking' },
        { icon: <Package size={20} />, label: 'Meu Inventário', path: '/inventario' },
        { icon: <Award size={20} />, label: 'Conquistas', path: '/conquistas' },
        { icon: <Store size={20} />, label: 'Loja Racer', path: '/loja' },
        { icon: <BarChart3 size={20} />, label: 'Minhas Notas', path: '/minhas-notas' },
        { icon: <GraduationCap size={20} />, label: 'Simulador Sisu', path: '/simulador' },
        { icon: <Brain size={20} />, label: 'Flashcards 🧠', path: '/flashcards' },
        { icon: <Activity size={20} />, label: 'Meu Desempenho', path: '/desempenho' },
        { icon: <Users size={20} />, label: 'Indicações', path: '/indicacoes' },
    ];

    return (
        <aside className="sidebar">
            <div className="sidebar-logo">
                <Zap size={28} fill="var(--clan-color)" color="var(--clan-color)" />
                <span style={{ background: 'linear-gradient(45deg, var(--text-primary), var(--clan-color))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                    ENEM Foco
                </span>
            </div>

            <nav className="sidebar-nav">
                {navItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                    >
                        {item.icon}
                        <span>{item.label}</span>
                    </NavLink>
                ))}
            </nav>

            {clan && (
                <div className="clan-status glass-card" style={{ margin: '0 16px', padding: '16px', border: '1px solid var(--clan-glow)' }}>
                    <div className="clan-info">
                        <h4 style={{ color: 'var(--clan-color)', textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '0.1em' }}>Clã {clanNames[clan]}</h4>
                        <p style={{ fontSize: '0.7rem', opacity: 0.8 }}>Nível 12 • Guerreiro</p>
                    </div>
                </div>
            )}

            <div className="sidebar-footer" style={{ marginTop: 'auto', padding: '20px', borderTop: '1px solid var(--bg-card-border)' }}>
                <NavLink to="/admin" className="nav-item">
                    <Settings size={20} />
                    <span>Painel Admin</span>
                </NavLink>
                <button className="nav-item" style={{ background: 'none', border: 'none', width: '100%', cursor: 'pointer', textAlign: 'left' }}>
                    <LogOut size={20} />
                    <span>Sair</span>
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
