import React, { createContext, useContext, useState, useEffect } from 'react';

export type Clan = 'ignis' | 'glacies' | 'silva' | 'cosmos' | null;

interface ThemeContextType {
  clan: Clan;
  setClan: (clan: Clan) => void;
  isDark: boolean;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [clan, setClan] = useState<Clan>(() => {
    return (localStorage.getItem('user-clan') as Clan) || null;
  });

  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('theme-mode');
    return saved ? saved === 'dark' : true;
  });

  useEffect(() => {
    const root = document.documentElement;
    if (clan) {
      root.setAttribute('data-clan', clan);
      localStorage.setItem('user-clan', clan);
    } else {
      root.removeAttribute('data-clan');
    }
  }, [clan]);

  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute('data-theme', isDark ? 'dark' : 'light');
    localStorage.setItem('theme-mode', isDark ? 'dark' : 'light');
  }, [isDark]);

  const toggleTheme = () => setIsDark(!isDark);

  return (
    <ThemeContext.Provider value={{ clan, setClan, isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within a ThemeProvider');
  return context;
};

