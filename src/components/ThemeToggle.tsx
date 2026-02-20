import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const ThemeToggle: React.FC = () => {
    const { isDark, toggleTheme } = useTheme();

    return (
        <button
            onClick={toggleTheme}
            className="glass-card"
            style={{
                padding: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                border: '1px solid var(--bg-card-border)',
                color: 'var(--text-primary)',
                transition: 'var(--transition-smooth)',
                width: '40px',
                height: '40px',
            }}
            title={isDark ? 'Ativar Modo Claro' : 'Ativar Modo Escuro'}
        >
            {isDark ? <Sun size={20} /> : <Moon size={20} />}
        </button>
    );
};

export default ThemeToggle;
