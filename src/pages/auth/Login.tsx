import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Zap, Github, Chrome,
    Shield, Trophy, Target,
    ArrowRight
} from 'lucide-react';
import { motion } from 'framer-motion';
import './Login.css';

const LandingLogin: React.FC = () => {
    const navigate = useNavigate();
    const [isLoginMode, setIsLoginMode] = useState(true);

    const handleAction = (e: React.FormEvent) => {
        e.preventDefault();
        navigate('/onboarding');
    };

    return (
        <div className="landing-page">
            {/* Hero Section */}
            <nav className="landing-nav">
                <div className="logo">
                    <Zap size={32} fill="var(--primary)" />
                    <span>ENEM <span style={{ color: 'var(--primary)' }}>FOCO</span></span>
                </div>
                <div className="nav-links">
                    <a href="#features">Recursos</a>
                    <a href="#clans">Clãs</a>
                    <button className="neon-button mini" onClick={() => setIsLoginMode(true)}>ENTRAR</button>
                </div>
            </nav>

            <main className="landing-main">
                <div className="hero-content">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="hero-text"
                    >
                        <div className="badge-new">NOVA ARENA DISPONÍVEL ⚔️</div>
                        <h1>Domine o ENEM como um <span className="text-gradient">Lendário.</span></h1>
                        <p>A primeira plataforma de estudos RPG-Based que transforma sua preparação em uma jornada épica de conquistas, clãs e batalhas intelectuais.</p>

                        <div className="hero-stats">
                            <div className="h-stat">
                                <strong>50k+</strong>
                                <span>Guerreiros</span>
                            </div>
                            <div className="h-stat">
                                <strong>1.2M</strong>
                                <span>Questões</span>
                            </div>
                            <div className="h-stat">
                                <strong>850+</strong>
                                <span>Média TRI</span>
                            </div>
                        </div>

                        <div className="hero-cta">
                            <button className="neon-button large" onClick={() => setIsLoginMode(false)}>
                                COMEÇAR AGORA <ArrowRight size={20} />
                            </button>
                            <div className="social-proof">
                                <div className="avatar-group">
                                    <div className="mini-avatar">🔥</div>
                                    <div className="mini-avatar">❄️</div>
                                    <div className="mini-avatar">✨</div>
                                </div>
                                <span>+12 heróis entraram hoje</span>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="login-form-container"
                    >
                        <div className="glass-card login-card-v2">
                            <div className="card-header">
                                <h2>{isLoginMode ? 'Acessar Fortaleza' : 'Criar Novo Herói'}</h2>
                                <p>{isLoginMode ? 'Bem-vindo de volta, combatente.' : 'Inicie sua jornada rumo ao topo.'}</p>
                            </div>

                            <form className="auth-form" onSubmit={handleAction}>
                                {!isLoginMode && (
                                    <div className="form-group">
                                        <label>Nome do Herói</label>
                                        <input type="text" placeholder="Ex: GabrielMestre" required />
                                    </div>
                                )}
                                <div className="form-group">
                                    <label>Email de Herói</label>
                                    <input type="email" placeholder="heroi@email.com" required />
                                </div>
                                <div className="form-group">
                                    <label>Senha Criptografada</label>
                                    <input type="password" placeholder="••••••••" required />
                                </div>

                                <button type="submit" className="neon-button full">
                                    {isLoginMode ? 'INICIAR JORNADA' : 'CRIAR CONTA'}
                                </button>
                            </form>

                            <div className="divider">
                                <span>OU CONECTE-SE COM</span>
                            </div>

                            <div className="social-auth-grid">
                                <button className="social-auth-btn">
                                    <Chrome size={20} /> Google
                                </button>
                                <button className="social-auth-btn">
                                    <Github size={20} /> GitHub
                                </button>
                            </div>

                            <p className="auth-footer">
                                {isLoginMode ? 'Novo no clã?' : 'Já possui conta?'}
                                <span onClick={() => setIsLoginMode(!isLoginMode)}>
                                    {isLoginMode ? ' Cadastre-se' : ' Fazer Login'}
                                </span>
                            </p>
                        </div>
                    </motion.div>
                </div>
            </main>

            <section id="features" className="features-section">
                <div className="section-header">
                    <h2>Armamento <span className="text-gradient">Premium</span></h2>
                    <p>Ferramentas de elite para quem não aceita menos que a aprovação.</p>
                </div>

                <div className="features-grid">
                    {[
                        { icon: <Target />, title: 'Questões Adaptativas', desc: 'IA que aprende seus pontos fracos e ataca onde você mais precisa.' },
                        { icon: <Shield />, title: 'Clãs e Guildas', desc: 'Estude em grupo, compartilhe XP e participe de batalhas entre escolas.' },
                        { icon: <Trophy />, title: 'Arena de Redação', desc: 'Plataforma completa para escrita e correção profissional.' },
                    ].map((f, i) => (
                        <div key={i} className="glass-card feature-card">
                            <div className="f-icon">{f.icon}</div>
                            <h3>{f.title}</h3>
                            <p>{f.desc}</p>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
};

export default LandingLogin;
