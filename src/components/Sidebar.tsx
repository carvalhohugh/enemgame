import React from 'react';
import { NavLink } from 'react-router-dom';
import {
    LayoutDashboard,
    Calendar as CalendarIcon,
    Swords,
    PenTool,
    Trophy,
    Store,
    Settings,
    LogOut,
    Video,
    GraduationCap,
    FileText,
    Package,
    Shield,
    BarChart3,
    Brain,
    Activity
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import './Sidebar.css';

interface SidebarProps {
    isOpen?: boolean;
    onClose?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
    const { clan } = useTheme();
    const { user } = useAuth();

    const clanNames = {
        ignis: 'Ignis',
        glacies: 'Glacies',
        guardioes: 'Guardiões',
        cosmos: 'Cosmos'
    };

    const menuGroups = [
        {
            title: 'MEUS ESTUDOS',
            roles: ['ALUNO', 'PROFESSOR', 'ADMIN'],
            items: [
                { icon: <CalendarIcon size={18} />, label: 'Plano Adaptativo', path: '/calendario' },
                { icon: <Swords size={18} />, label: 'Arena ENEM', path: '/arena' },
                { icon: <PenTool size={18} />, label: 'Arena de Redação', path: '/redacao' },
                { icon: <GraduationCap size={18} />, label: 'Hub de Estudos', path: '/estudos' },
                { icon: <Video size={18} />, label: 'Aulas ao Vivo', path: '/live' },
                { icon: <Brain size={18} />, label: 'Flashcards', path: '/flashcards' },
                { icon: <FileText size={18} />, label: 'Minhas Anotações', path: '/anotacoes' },
            ]
        },
        {
            title: 'GESTÃO E RELATÓRIOS',
            roles: ['ADMIN', 'GESTOR_ESCOLA', 'PROFESSOR', 'VENDEDOR'],
            items: [
                { icon: <BarChart3 size={18} />, label: 'Relatórios', path: '/admin/relatorios' },
                { icon: <Package size={18} />, label: 'Financeiro', path: '/admin/financeiro' },
                { icon: <GraduationCap size={18} />, label: 'Gestão Escolar', path: '/admin/escolas' },
            ]
        },
        {
            title: 'MEU DESEMPENHO',
            roles: ['ALUNO', 'ADMIN'],
            items: [
                { icon: <BarChart3 size={18} />, label: 'Minhas Notas', path: '/minhas-notas' },
                { icon: <GraduationCap size={18} />, label: 'Simulador Sisu', path: '/simulador' },
                { icon: <Activity size={18} />, label: 'Meu Desempenho', path: '/desempenho' },
            ]
        },
        {
            title: 'GAME',
            roles: ['ALUNO', 'ADMIN'],
            items: [
                { icon: <Shield size={18} />, label: 'Meu Clã', path: '/meu-cla' },
                { icon: <Trophy size={18} />, label: 'Rankings', path: '/ranking' },
                { icon: <Package size={18} />, label: 'Inventário', path: '/inventario' },
                { icon: <Store size={18} />, label: 'Loja Racer', path: '/loja' },
            ]
        }
    ].filter(group => !user || group.roles.includes(user.role));

    return (
        <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
            {isOpen && <div className="sidebar-overlay" onClick={onClose} />}
            <div className="sidebar-logo">
                <Brain size={28} color="var(--clan-color)" />
                <span style={{ fontWeight: 900, fontSize: '1.2rem', background: 'linear-gradient(45deg, var(--text-primary), var(--clan-color))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                    ARENA ENEM
                </span>
            </div>

            <nav className="sidebar-nav">
                <NavLink to="/" className={({ isActive }) => `nav-item dashboard-link ${isActive ? 'active' : ''}`}>
                    <LayoutDashboard size={20} />
                    <span>Dashboard</span>
                </NavLink>

                {menuGroups.map((group, idx) => (
                    <div key={idx} className="nav-group">
                        <div className="group-divider">
                            <span className="group-title">{group.title}</span>
                        </div>
                        {group.items.map((item) => (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                            >
                                {item.icon}
                                <span>{item.label}</span>
                            </NavLink>
                        ))}
                    </div>
                ))}
            </nav>

            {clan && (
                <div className="clan-status glass-card" style={{ margin: '0 16px', padding: '16px', border: '1px solid var(--clan-glow)' }}>
                    <div className="clan-info">
                        <h4 style={{ color: 'var(--clan-color)', textTransform: 'uppercase', fontSize: '0.8rem', fontWeight: 900, letterSpacing: '0.1em' }}>
                            {clanNames[clan as keyof typeof clanNames]}
                        </h4>
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
