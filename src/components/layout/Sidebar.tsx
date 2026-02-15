import { useMemo } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
    LayoutDashboard,
    Map,
    Trophy,
    Target,
    Shield,
    Settings,
    LogOut,
    Swords,
    ScrollText,
    User,
    BookOpen,
    Zap,
    ListTodo,
    Video,
} from 'lucide-react';
import { useAuthProfile } from '@/context/AuthProfileContext';
import { useStudyProgress } from '@/context/StudyProgressContext';

export function Sidebar() {
    const { profile } = useAuthProfile();
    const { level, progress } = useStudyProgress();
    const navigate = useNavigate();

    const handleAdminAccess = () => {
        if (profile.isAdmin) {
            navigate('/admin');
            return;
        }

        const pwd = window.prompt("🔐 Acesso Administrativo\nDigite a senha de administrador:");
        if (pwd === 'admin' || pwd === 'admin123') {
            localStorage.setItem('enemgame_admin', 'true');
            window.location.reload();
        } else if (pwd !== null) {
            alert("Senha incorreta.");
        }
    };

    const links = useMemo(() => [
        { name: 'Dashboard', href: '/', icon: LayoutDashboard },
        { name: 'Minhas Atividades', href: '/atividades', icon: ListTodo },
        { name: 'Aulas Online', href: '/aulas', icon: Video },
        { name: 'Trilhas', href: '/trilhas', icon: Map },
        { name: 'Questão Diária', href: '/simulado', icon: Target },
        { name: 'Simulado Real', href: '/simulado-real', icon: BookOpen },
        { name: 'Teste Rápido', href: '/teste-rapido', icon: Zap },
        { name: 'Redação', href: '/redacao', icon: ScrollText },
        { name: 'Arena ENEM', href: '/arena', icon: Swords },
        { name: 'Meu Clã', href: '/cla', icon: Shield },
        { name: 'Perfil', href: '/perfil', icon: User },
        { name: 'Admin', href: '/admin', icon: Shield, adminOnly: true },
    ], []);

    const filteredLinks = links.filter(link => !link.adminOnly || profile.isAdmin);

    return (
        <aside className="fixed left-0 top-0 h-screen w-64 bg-dark-surface border-r border-white/10 flex flex-col z-50">
            {/* Brand */}
            <div className="p-6 flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple to-purple-light flex items-center justify-center">
                    <Trophy className="w-4 h-4 text-white" />
                </div>
                <span className="font-poppins font-bold text-lg text-white">
                    ENEM<span className="text-gold">Game</span>
                </span>
            </div>

            {/* User Mini Profile */}
            <div className="px-4 mb-6">
                <div className="p-3 rounded-xl bg-white/5 border border-white/5 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-purple/20 flex items-center justify-center text-purple-light font-bold">
                        {profile.displayName.substring(0, 2).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-white truncate">{profile.displayName}</p>
                        <p className="text-xs text-white/50">Nível {level} • {progress.totalXp} XP</p>
                    </div>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
                {filteredLinks.map((link) => (
                    <NavLink
                        key={link.href}
                        to={link.href}
                        className={({ isActive }) => `
              flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all
              ${isActive
                                ? 'bg-purple/20 text-white border border-purple/20'
                                : 'text-white/60 hover:text-white hover:bg-white/5'}
            `}
                    >
                        <link.icon className="w-4 h-4" />
                        {link.name}
                    </NavLink>
                ))}
            </nav>

            {/* Footer Actions */}
            <div className="p-4 border-t border-white/10 space-y-1">
                <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-white/60 hover:text-white hover:bg-white/5 transition-all">
                    <Settings className="w-4 h-4" />
                    Configurações
                </button>

                <button
                    onClick={handleAdminAccess}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-purple-light/70 hover:text-purple-light hover:bg-purple/10 transition-all"
                >
                    <Shield className="w-4 h-4" />
                    Painel Admin
                </button>
                <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-400/70 hover:text-red-400 hover:bg-red-400/10 transition-all">
                    <LogOut className="w-4 h-4" />
                    Sair
                </button>
            </div>
        </aside>
    );
}
