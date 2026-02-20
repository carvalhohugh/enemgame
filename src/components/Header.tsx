import React from 'react';
import ThemeToggle from './ThemeToggle';
import { Search, Bell, User } from 'lucide-react';

const Header: React.FC = () => {
    return (
        <header className="main-header glass-card" style={{
            margin: '20px',
            padding: '12px 24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderRadius: 'var(--radius-md)',
            position: 'sticky',
            top: '20px',
            zIndex: 100
        }}>
            <div className="search-bar" style={{ display: 'flex', alignItems: 'center', gap: '12px', background: 'rgba(255,255,255,0.05)', padding: '8px 16px', borderRadius: 'var(--radius-sm)', flex: 1, maxWidth: '400px' }}>
                <Search size={18} color="var(--text-secondary)" />
                <input
                    type="text"
                    placeholder="Buscar missões, trilhas ou batalhas..."
                    style={{ background: 'none', border: 'none', color: 'var(--text-primary)', width: '100%', outline: 'none', fontSize: '0.9rem' }}
                />
            </div>

            <div className="header-actions" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <ThemeToggle />

                <button className="glass-card" style={{ padding: '8px', position: 'relative' }}>
                    <Bell size={20} />
                    <span style={{ position: 'absolute', top: '6px', right: '6px', width: '8px', height: '8px', background: 'var(--secondary)', borderRadius: '50%', boxShadow: '0 0 10px var(--secondary)' }} />
                </button>

                <div className="user-profile-button glass-card" style={{ padding: '4px 12px', display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                    <div style={{ textAlign: 'right' }}>
                        <p style={{ fontSize: '0.8rem', fontWeight: 700 }}>Hugo Vasconcelos</p>
                        <p style={{ fontSize: '0.65rem', color: 'var(--text-secondary)' }}>Ouro II</p>
                    </div>
                    <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--clan-color)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <User size={18} color="white" />
                    </div>
                </div>

            </div>
        </header>
    );
};

export default Header;
