import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Zap, Trophy, Users, TrendingUp } from 'lucide-react';
import { useAuthProfile } from '@/context/AuthProfileContext';
import { CLANS } from '@/services/ClanService';
import { MASCOT_COMPONENTS } from './ClanMascots';


// Mock data for demo
const MOCK_RANKING = [
    { name: 'Carlos M.', xp: 12400, position: 1 },
    { name: 'Ana L.', xp: 11200, position: 2 },
    { name: 'Hugo C.', xp: 9800, position: 3 },
    { name: 'Maria S.', xp: 8500, position: 4 },
    { name: 'Pedro R.', xp: 7200, position: 5 },
];

export default function ClanDashboard() {
    const { profile } = useAuthProfile();
    const clanId = profile.clanId;

    if (!clanId) return null;

    const clan = CLANS[clanId];
    const Mascot = MASCOT_COMPONENTS[clanId];

    const stats = useMemo(() => [
        { label: 'XP Total', value: '4.250', icon: Zap, color: clan.color },
        { label: 'Ranking', value: '#12', icon: Trophy, color: '#fbbf24' },
        { label: 'Membros', value: '1.432', icon: Users, color: '#a855f7' },
        { label: 'Sequência', value: '7 dias', icon: TrendingUp, color: '#10b981' },
    ], [clan.color]);

    return (
        <div className="space-y-8">
            {/* ═══════════ CLÃ HERO BANNER COM MASCOTE ═══════════ */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative overflow-hidden rounded-2xl p-8"
                style={{
                    background: `linear-gradient(135deg, ${clan.color}20, ${clan.color}05, transparent)`,
                    border: `1px solid ${clan.color}40`,
                }}
            >
                {/* Glow effect */}
                <div
                    className="absolute -right-20 -top-20 w-64 h-64 rounded-full opacity-20 blur-3xl"
                    style={{ backgroundColor: clan.color }}
                />
                <div
                    className="absolute -left-10 -bottom-10 w-40 h-40 rounded-full opacity-10 blur-2xl"
                    style={{ backgroundColor: clan.color }}
                />

                <div className="relative flex items-center justify-between gap-6">
                    {/* Info */}
                    <div className="flex-1">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 }}
                        >
                            <div className="flex items-center gap-2 mb-2">
                                <span
                                    className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full"
                                    style={{ backgroundColor: `${clan.color}30`, color: clan.color }}
                                >
                                    Seu Clã
                                </span>
                            </div>
                            <h2 className="text-3xl font-bold text-white mb-2">
                                Clã <span style={{ color: clan.color }}>{clan.name}</span>
                            </h2>
                            <p className="text-white/50 text-sm max-w-md">{clan.description}</p>

                            {/* Motto */}
                            <p className="mt-3 text-sm italic" style={{ color: `${clan.color}CC` }}>
                                {clan.motto}
                            </p>
                        </motion.div>
                    </div>

                    {/* Mascote Animado */}
                    <motion.div
                        initial={{ scale: 0, rotate: -10 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.3 }}
                        className="shrink-0 hidden sm:block"
                    >
                        <div
                            className="w-28 h-28 rounded-2xl flex items-center justify-center relative"
                            style={{
                                backgroundColor: `${clan.color}15`,
                                border: `2px solid ${clan.color}30`,
                                boxShadow: `0 0 30px ${clan.color}20`,
                            }}
                        >
                            <Mascot size={80} />
                            {/* Pulse ring */}
                            <motion.div
                                className="absolute inset-0 rounded-2xl"
                                style={{ border: `2px solid ${clan.color}20` }}
                                animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0, 0.5] }}
                                transition={{ repeat: Infinity, duration: 2 }}
                            />
                        </div>
                    </motion.div>
                </div>
            </motion.div>

            {/* ═══════════ STATS GRID ═══════════ */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat, i) => (
                    <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="bg-white/5 rounded-xl p-4 border border-white/5"
                    >
                        <div className="flex items-center gap-2 mb-2">
                            <stat.icon className="w-4 h-4" style={{ color: stat.color }} />
                            <span className="text-xs text-white/50 uppercase tracking-wider">{stat.label}</span>
                        </div>
                        <p className="text-2xl font-bold text-white">{stat.value}</p>
                    </motion.div>
                ))}
            </div>

            {/* ═══════════ RANKING TABLE ═══════════ */}
            <div className="bg-white/5 rounded-2xl border border-white/5 overflow-hidden">
                <div className="p-4 border-b border-white/5 flex items-center justify-between">
                    <h3 className="font-semibold text-white">Ranking do Clã {clan.name}</h3>
                    <span className="text-xs text-white/40 uppercase">Top 5</span>
                </div>
                <div className="divide-y divide-white/5">
                    {MOCK_RANKING.map((member) => (
                        <div key={member.position} className="flex items-center justify-between px-4 py-3 hover:bg-white/5 transition-colors">
                            <div className="flex items-center gap-3">
                                <span
                                    className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
                                    style={{
                                        backgroundColor: member.position <= 3 ? `${clan.color}30` : 'rgba(255,255,255,0.05)',
                                        color: member.position <= 3 ? clan.color : 'rgba(255,255,255,0.5)',
                                    }}
                                >
                                    {member.position}
                                </span>
                                <span className="text-sm text-white">{member.name}</span>
                            </div>
                            <span className="text-sm text-white/60">{member.xp.toLocaleString()} XP</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
