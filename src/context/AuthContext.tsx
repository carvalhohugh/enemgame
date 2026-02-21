import React, { createContext, useContext, useState, useEffect } from 'react';

export type UserRole = 'ALUNO' | 'PROFESSOR' | 'GESTOR_ESCOLA' | 'VENDEDOR' | 'ADMIN';

interface User {
    id: string;
    name: string;
    email: string;
    role: UserRole;
    clan?: string;
}

interface AuthContextType {
    user: User | null;
    login: (role: UserRole) => void;
    logout: () => void;
    isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(() => {
        const saved = localStorage.getItem('auth-user');
        return saved ? JSON.parse(saved) : null;
    });

    const login = (role: UserRole) => {
        const mockUser: User = {
            id: 'USER-' + Math.random().toString(36).substr(2, 9).toUpperCase(),
            name: 'Hugo Vasconcelos',
            email: 'contato@hugovasconcelos.com.br',
            role: role,
            clan: 'ignis'
        };
        setUser(mockUser);
        localStorage.setItem('auth-user', JSON.stringify(mockUser));
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('auth-user');
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used within an AuthProvider');
    return context;
};
