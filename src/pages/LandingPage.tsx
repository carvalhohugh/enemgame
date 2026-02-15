import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Trophy, Target, Swords, Zap, ArrowRight, Shield, BookOpen, CheckCircle2 } from 'lucide-react';

export default function LandingPage() {
    return (
        <div className="min-h-screen bg-dark-bg text-white overflow-x-hidden">
            {/* Header */}
            <header className="fixed top-0 left-0 right-0 z-50 bg-dark-bg/80 backdrop-blur-md border-b border-white/5">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple to-purple-light flex items-center justify-center">
                            <Trophy className="w-5 h-5 text-white" />
                        </div>
                        <span className="font-poppins font-bold text-xl">
                            ENEM<span className="text-gold">Game</span>
                        </span>
                    </div>
                    <div className="flex items-center gap-4">
                        <Link to="/login" className="px-6 py-2.5 rounded-xl text-white/70 hover:text-white font-medium transition-colors">
                            Entrar
                        </Link>
                        <Link to="/matricula" className="px-6 py-2.5 rounded-xl bg-purple hover:bg-purple-light text-white font-bold transition-all shadow-lg shadow-purple/20">
                            Matricule-se
                        </Link>
                    </div>
                </div>
            </header>

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 px-6">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-purple/20 rounded-full blur-[120px] pointer-events-none" />

                <div className="max-w-5xl mx-auto text-center relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <span className="inline-block px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-purple-light text-sm font-medium mb-6">
                            🎮 A plataforma de estudos nº 1 do Brasil
                        </span>
                        <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
                            Transforme seus estudos em uma <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-light to-gold">Jornada Épica</span>
                        </h1>
                        <p className="text-xl text-white/60 max-w-2xl mx-auto mb-10">
                            Estude para o ENEM completando missões, batalhando com amigos e subindo de nível. A aprovação nunca foi tão divertida.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Link to="/matricula" className="w-full sm:w-auto px-8 py-4 rounded-xl bg-purple hover:bg-purple-light text-white font-bold text-lg transition-all shadow-xl shadow-purple/30 flex items-center justify-center gap-2">
                                Começar Grátis
                                <ArrowRight className="w-5 h-5" />
                            </Link>
                            <Link to="/login" className="w-full sm:w-auto px-8 py-4 rounded-xl bg-white/5 hover:bg-white/10 text-white font-bold text-lg transition-all border border-white/10">
                                Já tenho conta
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Features Grid */}
            <section className="py-20 px-6 border-t border-white/5 bg-dark-surface/30">
                <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-8">
                    <FeatureCard
                        icon={Swords}
                        color="text-red-400"
                        bg="bg-red-500/10"
                        title="Batalhas PvP"
                        desc="Desafie seus amigos ou enfrente oponentes aleatórios em duelos de conhecimento em tempo real."
                    />
                    <FeatureCard
                        icon={Target}
                        color="text-purple-light"
                        bg="bg-purple/10"
                        title="Missões Diárias"
                        desc="Mantenha a constância com desafios diários que garantem XP e recompensas para seu avatar."
                    />
                    <FeatureCard
                        icon={Shield}
                        color="text-gold"
                        bg="bg-yellow-500/10"
                        title="Sistema de Clãs"
                        desc="Junte-se a um clã, participe de guerras territoriais e conquiste a glória com sua equipe."
                    />
                </div>
            </section>

            {/* Stats / Social Proof */}
            <section className="py-20 px-6 text-center">
                <div className="max-w-4xl mx-auto space-y-12">
                    <h2 className="text-3xl font-bold">Por que o ENEM Game funciona?</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        <Stat number="10k+" label="Estudantes Ativos" />
                        <Stat number="500k+" label="Questões Resolvidas" />
                        <Stat number="92%" label="Aprovação em Federais" />
                        <Stat number="24/7" label="Disponível" />
                    </div>
                </div>
            </section>
        </div>
    );
}

function FeatureCard({ icon: Icon, color, bg, title, desc }: any) {
    return (
        <div className="p-8 rounded-3xl bg-dark-surface border border-white/5 hover:border-purple/30 transition-all hover:-translate-y-1 group">
            <div className={`w-14 h-14 rounded-2xl ${bg} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                <Icon className={`w-7 h-7 ${color}`} />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">{title}</h3>
            <p className="text-white/50 leading-relaxed">{desc}</p>
        </div>
    );
}

function Stat({ number, label }: any) {
    return (
        <div>
            <div className="text-4xl font-bold text-white mb-2">{number}</div>
            <div className="text-sm text-white/40 uppercase tracking-wider">{label}</div>
        </div>
    );
}
