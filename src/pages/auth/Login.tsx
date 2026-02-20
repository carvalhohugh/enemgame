import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Zap, Github, Twitter, Chrome } from 'lucide-react';
import './Login.css';

const Login: React.FC = () => {
    const navigate = useNavigate();

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        navigate('/onboarding');
    };

    return (
        <div className="login-container">
            <div className="glass-card login-card">
                <div className="login-logo">
                    <Zap size={48} fill="currentColor" style={{ marginBottom: '8px' }} />
                    <div>ENEM FOCO</div>
                </div>

                <p style={{ color: 'var(--text-secondary)' }}>
                    A plataforma gamer definitiva para heróis que buscam o 1000 no ENEM.
                </p>

                <form className="login-form" onSubmit={handleLogin}>
                    <div className="form-group">
                        <label>Email de Herói</label>
                        <input type="email" placeholder="heroi@email.com" required />
                    </div>
                    <div className="form-group">
                        <label>Senha Criptografada</label>
                        <input type="password" placeholder="••••••••" required />
                    </div>
                    <button type="submit" className="neon-button" style={{ width: '100%', marginTop: '8px', padding: '16px' }}>
                        INICIAR JORNADA
                    </button>
                </form>

                <div style={{ position: 'relative', margin: '8px 0' }}>
                    <div style={{ borderTop: '1px solid var(--bg-card-border)', width: '100%', position: 'absolute', top: '50%' }} />
                    <span style={{ position: 'relative', background: '#0a0a0f', padding: '0 12px', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>OU CONECTE-SE COM</span>
                </div>

                <div className="social-login">
                    <button className="social-btn"><Chrome size={20} /></button>
                    <button className="social-btn"><Twitter size={20} /></button>
                    <button className="social-btn"><Github size={20} /></button>
                </div>

                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                    Novo no clã? <span style={{ color: 'var(--primary)', cursor: 'pointer', fontWeight: 700 }}>Cadastre-se Agora</span>
                </p>
            </div>
        </div>
    );
};

export default Login;
