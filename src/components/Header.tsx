import React from 'react';
import ThemeToggle from './ThemeToggle';
import { Search, Bell, User, Menu } from 'lucide-react';
import './Header.css';

interface HeaderProps {
    onMenuToggle?: () => void;
}

const Header: React.FC<HeaderProps> = ({ onMenuToggle }) => {
    return (
        <header className="main-header glass-card">
            <div style={{ display: 'flex', alignItems: 'center' }}>
                <button className="header-icon-btn mobile-menu-toggle" onClick={onMenuToggle}>
                    <Menu size={20} />
                </button>

                <div className="search-bar">
                    <Search size={18} color="var(--text-secondary)" />
                    <input
                        type="text"
                        placeholder="Buscar missões, trilhas ou batalhas..."
                    />
                </div>
            </div>

            <div className="header-actions">
                <ThemeToggle />

                <button className="header-icon-btn">
                    <Bell size={20} />
                    <span className="notification-dot" />
                </button>

                <div className="user-profile-button glass-card">
                    <div className="user-info">
                        <p className="name">Hugo Vasconcelos</p>
                        <p className="rank">Ouro II</p>
                    </div>
                    <div className="user-avatar">
                        <User size={18} color="white" />
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
