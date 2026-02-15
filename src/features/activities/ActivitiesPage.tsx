
import { motion } from 'framer-motion';
import { PenTool, Zap, Swords, BookOpen, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import StudyCalendar from '../calendar/StudyCalendar';

const WEEKLY_ESSAY_TOPICS = [
    { title: "Impactos da IA no trabalho", difficulty: "Difícil" },
    { title: "Desafios da saúde pública", difficulty: "Médio" },
    { title: "Preservação da Amazônia", difficulty: "Fácil" },
];

export default function ActivitiesPage() {
    return (
        <div className="min-h-screen bg-[#0F0F0F] text-white p-4 md:p-8 animate-fade-in pb-24 md:pb-8">
            <header className="mb-8">
                <h1 className="text-3xl font-bold font-poppins mb-2">Minhas Atividades</h1>
                <p className="text-white/60">Seu plano semanal de estudos para conquistar a aprovação.</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl">

                {/* Seção Redação */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-6 rounded-2xl bg-white/5 border border-white/10"
                >
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-3 rounded-xl bg-pink-500/20 text-pink-400">
                            <PenTool className="w-6 h-6" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold">Redação Semanal</h2>
                            <p className="text-xs text-white/40">3 temas sugeridos</p>
                        </div>
                    </div>

                    <div className="space-y-3">
                        {WEEKLY_ESSAY_TOPICS.map((topic, i) => (
                            <Link to="/redacao" key={i} className="block group">
                                <div className="p-4 rounded-xl bg-black/20 hover:bg-white/5 border border-white/5 hover:border-pink-500/30 transition-all flex justify-between items-center">
                                    <div>
                                        <h3 className="font-semibold text-sm group-hover:text-pink-300 transition-colors">{topic.title}</h3>
                                        <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded mt-1 inline-block ${topic.difficulty === 'Difícil' ? 'bg-red-500/20 text-red-400' :
                                            topic.difficulty === 'Médio' ? 'bg-yellow-500/20 text-yellow-400' :
                                                'bg-green-500/20 text-green-400'
                                            }`}>
                                            {topic.difficulty}
                                        </span>
                                    </div>
                                    <ChevronRight className="w-4 h-4 text-white/20 group-hover:text-pink-400" />
                                </div>
                            </Link>
                        ))}
                    </div>
                </motion.div>

                {/* Seção Desafio Diário */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="p-6 rounded-2xl bg-gradient-to-br from-purple-900/20 to-blue-900/20 border border-purple-500/20 relative overflow-hidden"
                >
                    <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-3 rounded-xl bg-purple-500/20 text-purple-400">
                                <Zap className="w-6 h-6" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold">Questão Diária</h2>
                                <p className="text-xs text-white/40">Ganhe XP rápido</p>
                            </div>
                        </div>

                        <p className="text-white/70 mb-6 text-sm">
                            Mantenha sua ofensiva! Responda a questão de hoje e garanta seu bônus de XP.
                        </p>

                        <Link to="/simulado" className="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-bold transition-all w-full justify-center">
                            <Zap className="w-4 h-4" /> Desafio Agora
                        </Link>
                    </div>
                </motion.div>

                {/* Seção Batalhas */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="p-6 rounded-2xl bg-white/5 border border-white/10"
                >
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-3 rounded-xl bg-orange-500/20 text-orange-400">
                            <Swords className="w-6 h-6" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold">Arena de Batalha</h2>
                            <p className="text-xs text-white/40">Desafie oponentes</p>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <div className="flex gap-3">
                            <Link to="/arena/x1" className="flex-1 p-4 rounded-xl bg-black/20 hover:bg-orange-500/10 border border-white/5 hover:border-orange-500/30 transition-all text-center group">
                                <h3 className="font-bold text-orange-400 mb-1">X1 Rápido</h3>
                                <p className="text-xs text-white/40 group-hover:text-white/60">5 questões • 30s</p>
                            </Link>
                            <Link to="/arena/cla" className="flex-1 p-4 rounded-xl bg-black/20 hover:bg-red-500/10 border border-white/5 hover:border-red-500/30 transition-all text-center group">
                                <h3 className="font-bold text-red-400 mb-1">Guerra de Clã</h3>
                                <p className="text-xs text-white/40 group-hover:text-white/60">Pontos pro Clã</p>
                            </Link>
                        </div>
                        <p className="text-center text-xs text-white/30 pt-2">Complete 5 batalhas essa semana</p>
                    </div>
                </motion.div>

                {/* Seção Simulado Semanal */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="p-6 rounded-2xl bg-white/5 border border-white/10"
                >
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-3 rounded-xl bg-green-500/20 text-green-400">
                            <BookOpen className="w-6 h-6" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold">Simulado Real</h2>
                            <p className="text-xs text-white/40">Treine com provas anteriores</p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="p-4 rounded-xl bg-green-900/10 border border-green-500/20 flex items-center justify-between">
                            <div>
                                <h3 className="font-bold text-green-300">Simulado ENEM 2023</h3>
                                <p className="text-xs text-green-400/60">Recomendado esta semana</p>
                            </div>
                            <Link to="/simulado-real" className="p-2 bg-green-500 text-black rounded-lg hover:bg-green-400 transition">
                                <ChevronRight className="w-5 h-5" />
                            </Link>
                        </div>
                        <p className="text-xs text-white/40 leading-relaxed">
                            Fazer um simulado completo por semana aumenta suas chances de aprovação em 40%.
                        </p>
                    </div>
                </motion.div>

            </div>

            {/* Seção Calendário */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="mt-6 max-w-5xl"
            >
                <StudyCalendar />
            </motion.div>
        </div>
    );
}
