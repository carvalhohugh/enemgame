
import { motion } from 'framer-motion';
import { PlayCircle, Lock, Calendar, MessageSquare } from 'lucide-react';

export default function AulasOnlinePage() {
    return (
        <div className="min-h-screen bg-[#0F0F0F] text-white p-4 md:p-8 animate-fade-in pb-24 md:pb-8">
            <header className="mb-8 flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-bold font-poppins mb-2">Aulas Online</h1>
                    <p className="text-white/60">Aprenda ao vivo com os melhores professores.</p>
                </div>
                <button className="px-4 py-2 bg-purple-600 rounded-lg text-sm font-bold hover:bg-purple-500 transition">
                    Ver Calendário
                </button>
            </header>

            <div className="grid lg:grid-cols-3 gap-6">
                {/* Main Video Area */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="aspect-video bg-black/40 rounded-2xl border border-white/10 flex items-center justify-center relative overflow-hidden group">
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                        <div className="text-center z-10 p-6">
                            <div className="w-16 h-16 rounded-full bg-white/10 backdrop-blur flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform cursor-pointer">
                                <PlayCircle className="w-8 h-8 text-white" />
                            </div>
                            <h2 className="text-xl font-bold">Revisão Geral: Matemática Básica</h2>
                            <p className="text-sm text-white/60 mt-2">Ao vivo agora • Prof. Hugo</p>
                        </div>
                    </div>

                    <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
                        <h3 className="font-bold text-lg mb-4">Próximas Aulas</h3>
                        <div className="space-y-3">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="flex items-center gap-4 p-3 rounded-xl hover:bg-white/5 transition border border-transparent hover:border-white/5">
                                    <div className="w-12 h-12 rounded-lg bg-gray-800 flex flex-col items-center justify-center text-xs font-bold border border-white/10">
                                        <span className="text-white/40">DEV</span>
                                        <span>1{i}</span>
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="font-semibold text-sm">Redação Nota 1000: Estrutura</h4>
                                        <p className="text-xs text-white/40">19:00 • Prof. Ana</p>
                                    </div>
                                    <button className="p-2 hover:bg-purple-500/20 rounded-lg text-purple-400">
                                        <Calendar className="w-4 h-4" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Sidebar / Chat */}
                <div className="space-y-6">
                    <div className="h-[600px] rounded-2xl bg-white/5 border border-white/10 flex flex-col">
                        <div className="p-4 border-b border-white/10">
                            <h3 className="font-bold flex items-center gap-2">
                                <MessageSquare className="w-4 h-4" /> Chat ao Vivo
                            </h3>
                        </div>
                        <div className="flex-1 p-4 space-y-4 overflow-y-auto">
                            <div className="text-center text-white/30 text-sm py-10">
                                O chat está disponível apenas durante aulas ao vivo.
                            </div>
                        </div>
                        <div className="p-4 border-t border-white/10">
                            <input
                                type="text"
                                placeholder="Enviar mensagem..."
                                disabled
                                className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2 text-sm text-white/50 cursor-not-allowed"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
