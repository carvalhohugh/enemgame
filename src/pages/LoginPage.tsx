import { useState } from 'react';
import { useAuthProfile } from '@/context/AuthProfileContext';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Trophy, ArrowRight, Mail, Lock } from 'lucide-react';

export default function LoginPage() {
    const { login } = useAuthProfile();
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        // Simulate network delay
        setTimeout(async () => {
            await login(email);
            setIsLoading(false);
            navigate('/app');
        }, 1200);
    };

    return (
        <div className="min-h-screen bg-dark-bg flex items-center justify-center p-4 relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-purple/10 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-500/10 rounded-full blur-[120px]" />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md bg-dark-surface border border-white/10 rounded-2xl p-8 relative z-10 backdrop-blur-xl"
            >
                <div className="text-center mb-8">
                    <div className="w-16 h-16 mx-auto bg-gradient-to-br from-purple to-purple-light rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-purple/20">
                        <Trophy className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-2xl font-bold text-white mb-2">Bem-vindo de volta!</h1>
                    <p className="text-white/40">Entre para continuar sua jornada de estudos.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-1.5">
                        <label className="text-xs font-medium text-white/50 uppercase">E-mail</label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-3 w-5 h-5 text-white/20" />
                            <input
                                type="email"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-white placeholder:text-white/20 focus:outline-none focus:border-purple/50 transition-colors"
                                placeholder="seunome@exemplo.com"
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-xs font-medium text-white/50 uppercase">Senha</label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-3 w-5 h-5 text-white/20" />
                            <input
                                type="password"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-white placeholder:text-white/20 focus:outline-none focus:border-purple/50 transition-colors"
                                placeholder="••••••••"
                                required
                            />
                        </div>
                    </div>

                    <div className="flex justify-end">
                        <button type="button" className="text-xs text-purple-light hover:text-purple transition-colors">
                            Esqueceu sua senha?
                        </button>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-purple hover:bg-purple-light text-white font-semibold py-3 rounded-xl transition-all shadow-lg shadow-purple/25 flex items-center justify-center gap-2 group disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {isLoading ? (
                            <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                        ) : (
                            <>
                                Entrar na Plataforma
                                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </>
                        )}
                    </button>
                </form>

                <div className="mt-6 text-center text-sm text-white/40">
                    Não tem uma conta?{' '}
                    <Link to="/matricula" className="text-purple-light hover:text-purple font-medium transition-colors">
                        Matricule-se agora
                    </Link>
                </div>
            </motion.div>
        </div>
    );
}
