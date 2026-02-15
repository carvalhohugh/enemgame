import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { ClanId } from '@/services/ClanService';
import { ClanMascot, CLANS } from './ClanMascots';
import { ArrowRight, Sparkles } from 'lucide-react';

interface ClanRevealProps {
    clanId: ClanId;
    onContinue: () => void;
}

/* Particles for the epic reveal */
function Particles({ color }: { color: string }) {
    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {Array.from({ length: 20 }).map((_, i) => (
                <motion.div
                    key={i}
                    className="absolute w-2 h-2 rounded-full"
                    style={{
                        backgroundColor: color,
                        left: `${Math.random() * 100}%`,
                        top: `${Math.random() * 100}%`,
                    }}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{
                        scale: [0, 1.5, 0],
                        opacity: [0, 0.8, 0],
                        y: [0, -(50 + Math.random() * 100)],
                        x: [(Math.random() - 0.5) * 60],
                    }}
                    transition={{
                        duration: 2 + Math.random() * 2,
                        delay: Math.random() * 1.5,
                        repeat: Infinity,
                        repeatDelay: Math.random() * 3,
                    }}
                />
            ))}
        </div>
    );
}

export default function ClanReveal({ clanId, onContinue }: ClanRevealProps) {
    const clan = CLANS[clanId];
    const [phase, setPhase] = useState<'flash' | 'mascot' | 'details'>('flash');

    useEffect(() => {
        const t1 = setTimeout(() => setPhase('mascot'), 800);
        const t2 = setTimeout(() => setPhase('details'), 3000);
        return () => { clearTimeout(t1); clearTimeout(t2); };
    }, []);

    return (
        <div className="fixed inset-0 z-[200] bg-dark flex items-center justify-center overflow-hidden">
            <Particles color={clan.color} />

            <AnimatePresence mode="wait">
                {/* Phase 1: Flash explosion */}
                {phase === 'flash' && (
                    <motion.div
                        key="flash"
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: [0, 3, 1], opacity: [0, 1, 0] }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.8 }}
                        className="absolute w-40 h-40 rounded-full"
                        style={{ backgroundColor: clan.color, boxShadow: `0 0 120px 60px ${clan.color}60` }}
                    />
                )}

                {/* Phase 2: Mascot reveal */}
                {phase === 'mascot' && (
                    <motion.div
                        key="mascot"
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.8, opacity: 0 }}
                        transition={{ type: 'spring', stiffness: 100, damping: 10 }}
                        className="flex flex-col items-center text-center"
                    >
                        {/* Glow ring */}
                        <motion.div
                            className="relative"
                            animate={{ rotate: 360 }}
                            transition={{ repeat: Infinity, duration: 8, ease: 'linear' }}
                        >
                            <div
                                className="absolute inset-[-20px] rounded-full opacity-20"
                                style={{ border: `3px dashed ${clan.color}` }}
                            />
                        </motion.div>

                        <ClanMascot clanId={clanId} size={220} />

                        <motion.h1
                            initial={{ y: 30, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.6 }}
                            className="text-5xl font-poppins font-black text-white mt-6"
                        >
                            {clan.emoji} <span style={{ color: clan.color }}>{clan.name}</span>
                        </motion.h1>

                        <motion.p
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 1 }}
                            className="text-xl text-white/60 mt-3 italic"
                        >
                            &ldquo;{clan.motto}&rdquo;
                        </motion.p>
                    </motion.div>
                )}

                {/* Phase 3: Full details */}
                {phase === 'details' && (
                    <motion.div
                        key="details"
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="max-w-lg text-center space-y-8 p-8"
                    >
                        {/* Mascot (smaller) */}
                        <div className="flex justify-center">
                            <ClanMascot clanId={clanId} size={140} />
                        </div>

                        {/* Title */}
                        <div>
                            <h2 className="text-4xl font-black text-white">
                                Bem-vindo ao{' '}
                                <span style={{ color: clan.color }}>{clan.name}</span>!
                            </h2>
                            <p className="text-white/40 text-sm mt-2 italic">
                                &ldquo;{clan.motto}&rdquo;
                            </p>
                        </div>

                        {/* Description */}
                        <p className="text-white/60 text-lg leading-relaxed">
                            {clan.description}
                        </p>

                        {/* Traits */}
                        <div className="flex flex-wrap justify-center gap-2">
                            {clan.traits.map((trait, i) => (
                                <motion.span
                                    key={trait}
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ delay: i * 0.1 }}
                                    className="px-4 py-2 rounded-full text-sm font-semibold border"
                                    style={{
                                        backgroundColor: `${clan.color}15`,
                                        color: clan.color,
                                        borderColor: `${clan.color}40`,
                                    }}
                                >
                                    {trait}
                                </motion.span>
                            ))}
                        </div>

                        {/* Motivational quote */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.5 }}
                            className="bg-white/5 rounded-xl p-4 border border-white/10"
                        >
                            <Sparkles className="w-5 h-5 mx-auto mb-2" style={{ color: clan.color }} />
                            <p className="text-white/70 text-sm">
                                {clanId === 'fenix' && 'Sua resiliência é sua maior arma. Cada vez que cair, levante com mais força. O ENEM não vai te parar.'}
                                {clanId === 'lobo' && 'Inteligência vence força bruta. Estude com estratégia, domine os padrões e conquiste sua vaga com método.'}
                                {clanId === 'aguia' && 'Sua visão vai além do horizonte. Enquanto outros veem uma prova, você vê o caminho para o futuro.'}
                                {clanId === 'dragao' && 'Você não aceita nada menos que excelência. Dominação total é o único resultado aceitável.'}
                            </p>
                        </motion.div>

                        {/* CTA */}
                        <motion.button
                            onClick={onContinue}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.8 }}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.98 }}
                            className="px-10 py-4 rounded-2xl font-bold text-white text-lg transition-all flex items-center gap-2 mx-auto shadow-lg"
                            style={{
                                background: `linear-gradient(135deg, ${clan.color}, ${clan.color}cc)`,
                                boxShadow: `0 8px 30px ${clan.color}40`,
                            }}
                        >
                            Começar minha jornada
                            <ArrowRight className="w-5 h-5" />
                        </motion.button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
