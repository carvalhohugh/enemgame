
import { motion } from 'framer-motion';
import { Users, Copy, CheckCircle2, Gift } from 'lucide-react';
import { useState } from 'react';
import { useStudyProgress } from '@/context/StudyProgressContext';

export function ReferralCard() {
    const { addXp } = useStudyProgress();
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText("https://enemgame.com.br/invite/junior123");
        setCopied(true);
        addXp(50); // XP por copiar o link (simbólico)
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-2xl p-6 relative overflow-hidden group"
        >
            <div className="absolute inset-0 bg-noise opacity-[0.03] mix-blend-overlay" />
            <div className="absolute -right-10 -top-10 w-40 h-40 bg-purple-500/20 blur-3xl rounded-full group-hover:bg-purple-500/30 transition-all duration-700" />

            <div className="relative flex items-center justify-between">
                <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                        <span className="p-2 rounded-lg bg-purple-500/20 text-purple-400">
                            <Users className="w-5 h-5" />
                        </span>
                        <span className="text-xs font-bold px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/20">
                            +500 XP POR AMIGO
                        </span>
                    </div>
                    <h3 className="text-xl font-bold text-white mb-1">Indique Amigos</h3>
                    <p className="text-sm text-white/50 mb-4 max-w-xs">
                        Convide amigos para batalhar e ganhe <span className="text-purple-400 font-bold">500 XP</span> a cada cadastro confirmado!
                    </p>

                    <div className="flex items-center gap-2">
                        <div className="px-3 py-2 bg-black/20 border border-white/10 rounded-lg text-white/50 text-xs font-mono select-all">
                            enemgame.com/invite/junior123
                        </div>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={handleCopy}
                            className="p-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg transition-colors"
                        >
                            {copied ? <CheckCircle2 className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                        </motion.button>
                    </div>
                </div>

                <div className="hidden md:block pr-4">
                    <Gift className="w-24 h-24 text-purple-500/20 rotate-12" />
                </div>
            </div>
        </motion.div>
    );
}
