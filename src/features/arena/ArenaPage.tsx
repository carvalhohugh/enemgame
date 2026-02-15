import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    Swords, Users, Trophy, Zap, Clock,
    ChevronRight, Crown, TrendingUp, Shield,
} from 'lucide-react';
import { ArenaService, type BattleHistoryEntry } from '@/services/ArenaService';
import { useAuthProfile } from '@/context/AuthProfileContext';
import { CLANS } from '@/services/ClanService';

/* ─── Clan color helper ─── */
const CLAN_COLORS: Record<string, string> = {
    fenix: '#f97316', lobo: '#6366f1', aguia: '#eab308', dragao: '#ef4444',
};

export default function ArenaPage() {
    const navigate = useNavigate();
    const { profile } = useAuthProfile();
    const [activeTab, setActiveTab] = useState<'modes' | 'ranking' | 'history'>('modes');

    const history = ArenaService.getBattleHistory();
    const x1Ranking = ArenaService.getX1Ranking();
    const clanRanking = ArenaService.getClanBattleRanking();

    return (
        <div className="max-w-5xl mx-auto py-8 px-4">
            {/* Header */}
            <div className="text-center mb-10">
                <div className="inline-flex items-center gap-2 bg-red-500/20 px-4 py-2 rounded-full border border-red-500/30 mb-4">
                    <Swords className="w-4 h-4 text-red-400" />
                    <span className="text-sm text-red-400 font-medium">Arena ENEM</span>
                </div>
                <h1 className="text-4xl font-bold text-white mb-3">Arena de Batalhas</h1>
                <p className="text-white/50 text-lg">Desafie oponentes em duelos de conhecimento. Prove seu valor!</p>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 mb-8 justify-center">
                {[
                    { id: 'modes' as const, label: 'Modos', icon: Swords },
                    { id: 'ranking' as const, label: 'Ranking', icon: Trophy },
                    { id: 'history' as const, label: 'Histórico', icon: Clock },
                ].map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`px-5 py-2.5 rounded-xl text-sm font-medium flex items-center gap-2 transition-all ${activeTab === tab.id
                            ? 'bg-white/10 text-white border border-white/20'
                            : 'text-white/40 hover:text-white/60 hover:bg-white/5'
                            }`}
                    >
                        <tab.icon className="w-4 h-4" />
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* ━━━ Modes ━━━ */}
            {activeTab === 'modes' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Batalha X1 */}
                    <motion.div
                        whileHover={{ scale: 1.02 }}
                        className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple/20 to-indigo-900/20 border border-purple/30 p-8 cursor-pointer group"
                        onClick={() => navigate('/app/arena/x1')}
                    >
                        <div className="absolute top-0 right-0 w-40 h-40 bg-purple/10 rounded-full -mr-20 -mt-20 group-hover:scale-110 transition-transform" />
                        <motion.div
                            className="w-16 h-16 rounded-2xl bg-purple/20 flex items-center justify-center mb-5"
                            whileHover={{ rotate: 10 }}
                        >
                            <Swords className="w-8 h-8 text-purple-light" />
                        </motion.div>
                        <h3 className="text-2xl font-bold text-white mb-2">Batalha X1</h3>
                        <p className="text-white/50 mb-4">
                            Duelo 1 contra 1. 5 questões, 30 segundos cada. O mais rápido e preciso vence!
                        </p>
                        <div className="flex flex-wrap gap-2 mb-6">
                            <span className="text-xs px-3 py-1 rounded-full bg-purple/20 text-purple-light">⏱ 30s/questão</span>
                            <span className="text-xs px-3 py-1 rounded-full bg-purple/20 text-purple-light">🎯 5 questões</span>
                            <span className="text-xs px-3 py-1 rounded-full bg-purple/20 text-purple-light">🏆 +80 XP</span>
                        </div>
                        <div className="flex items-center gap-2 text-purple-light font-medium group-hover:gap-3 transition-all">
                            Entrar na Arena <ChevronRight className="w-4 h-4" />
                        </div>
                    </motion.div>

                    {/* Batalha de Clã */}
                    <motion.div
                        whileHover={{ scale: 1.02 }}
                        className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-red-500/20 to-orange-900/20 border border-red-500/30 p-8 cursor-pointer group"
                        onClick={() => navigate('/app/arena/cla')}
                    >
                        <div className="absolute top-0 right-0 w-40 h-40 bg-red-500/10 rounded-full -mr-20 -mt-20 group-hover:scale-110 transition-transform" />
                        <motion.div
                            className="w-16 h-16 rounded-2xl bg-red-500/20 flex items-center justify-center mb-5"
                            whileHover={{ rotate: -10 }}
                        >
                            <Shield className="w-8 h-8 text-red-400" />
                        </motion.div>
                        <h3 className="text-2xl font-bold text-white mb-2">Batalha de Clã</h3>
                        <p className="text-white/50 mb-4">
                            Seu clã {profile.clanId ? `(${CLANS[profile.clanId].name})` : ''} contra outro! 10 questões, soma de acertos da equipe.
                        </p>
                        <div className="flex flex-wrap gap-2 mb-6">
                            <span className="text-xs px-3 py-1 rounded-full bg-red-500/20 text-red-400">👥 Equipe vs Equipe</span>
                            <span className="text-xs px-3 py-1 rounded-full bg-red-500/20 text-red-400">🎯 10 questões</span>
                            <span className="text-xs px-3 py-1 rounded-full bg-red-500/20 text-red-400">🏆 +150 XP</span>
                        </div>
                        <div className="flex items-center gap-2 text-red-400 font-medium group-hover:gap-3 transition-all">
                            Batalhar pelo Clã <ChevronRight className="w-4 h-4" />
                        </div>
                    </motion.div>
                </div>
            )}

            {/* ━━━ Ranking ━━━ */}
            {activeTab === 'ranking' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* X1 Ranking */}
                    <div className="bg-white/5 rounded-2xl border border-white/10 p-6">
                        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                            <Swords className="w-5 h-5 text-purple-light" /> Ranking X1
                        </h3>
                        <div className="space-y-2">
                            {x1Ranking.map((player, i) => (
                                <div key={player.name} className="flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/8 transition">
                                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold ${i === 0 ? 'bg-gold/20 text-gold' : i === 1 ? 'bg-gray-300/20 text-gray-300' : i === 2 ? 'bg-orange-700/20 text-orange-500' : 'bg-white/10 text-white/40'
                                        }`}>
                                        {i < 3 ? <Crown className="w-4 h-4" /> : i + 1}
                                    </div>
                                    <div className="flex-1">
                                        <span className="text-white text-sm font-medium">{player.name}</span>
                                        <span className="ml-2 text-xs px-1.5 py-0.5 rounded"
                                            style={{ backgroundColor: CLAN_COLORS[player.clanId] + '20', color: CLAN_COLORS[player.clanId] }}>
                                            {CLANS[player.clanId].name}
                                        </span>
                                    </div>
                                    <div className="text-right">
                                        <span className="text-white text-sm font-bold">{player.wins}W</span>
                                        <span className="text-white/30 text-sm"> / {player.losses}L</span>
                                    </div>
                                    <div className="w-16 text-right">
                                        <span className="text-xs text-green-400">{player.winRate}%</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Clan Ranking */}
                    <div className="bg-white/5 rounded-2xl border border-white/10 p-6">
                        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                            <Shield className="w-5 h-5 text-red-400" /> Ranking de Clãs
                        </h3>
                        <div className="space-y-3">
                            {clanRanking.map((clan, i) => (
                                <div key={clan.clanId} className="p-4 rounded-xl bg-white/5 border border-white/5">
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg font-bold ${i === 0 ? 'bg-gold/20 text-gold' : 'bg-white/10 text-white/40'
                                            }`}>
                                            {i === 0 ? '👑' : i + 1}
                                        </div>
                                        <div>
                                            <h4 className="text-white font-semibold">{clan.name}</h4>
                                            <p className="text-xs text-white/40">{clan.wins}/{clan.totalBattles} vitórias</p>
                                        </div>
                                        <div className="ml-auto text-right">
                                            <span className="text-sm font-bold" style={{ color: CLAN_COLORS[clan.clanId] }}>
                                                {Math.round((clan.wins / clan.totalBattles) * 100)}%
                                            </span>
                                            <p className="text-xs text-white/30">win rate</p>
                                        </div>
                                    </div>
                                    <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                                        <div
                                            className="h-full rounded-full transition-all"
                                            style={{
                                                width: `${Math.round((clan.wins / clan.totalBattles) * 100)}%`,
                                                backgroundColor: CLAN_COLORS[clan.clanId],
                                            }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* ━━━ History ━━━ */}
            {activeTab === 'history' && (
                <div className="space-y-3">
                    {history.length === 0 ? (
                        <div className="text-center py-16">
                            <Swords className="w-12 h-12 text-white/20 mx-auto mb-4" />
                            <p className="text-white/40">Nenhuma batalha ainda. Entre na Arena!</p>
                        </div>
                    ) : (
                        history.map((h: BattleHistoryEntry) => (
                            <motion.div
                                key={h.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/10"
                            >
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg ${h.result === 'win' ? 'bg-green-500/20' : h.result === 'loss' ? 'bg-red-500/20' : 'bg-yellow-500/20'
                                    }`}>
                                    {h.result === 'win' ? '🏆' : h.result === 'loss' ? '💀' : '🤝'}
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center gap-2">
                                        <span className="text-white font-medium">vs {h.opponent}</span>
                                        <span className="text-xs px-1.5 py-0.5 rounded"
                                            style={{ backgroundColor: CLAN_COLORS[h.opponentClan] + '20', color: CLAN_COLORS[h.opponentClan] }}>
                                            {h.type === 'x1' ? 'X1' : 'Clã'}
                                        </span>
                                    </div>
                                    <p className="text-xs text-white/40">
                                        {new Date(h.date).toLocaleDateString('pt-BR')} • {h.myScore} × {h.opponentScore}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <span className={`text-sm font-bold ${h.result === 'win' ? 'text-green-400' : h.result === 'loss' ? 'text-red-400' : 'text-yellow-400'
                                        }`}>
                                        {h.result === 'win' ? 'VITÓRIA' : h.result === 'loss' ? 'DERROTA' : 'EMPATE'}
                                    </span>
                                    <p className="text-xs text-white/40 flex items-center gap-1 justify-end">
                                        <Zap className="w-3 h-3" /> +{h.xpEarned} XP
                                    </p>
                                </div>
                            </motion.div>
                        ))
                    )}
                </div>
            )}

            {/* Quick Stats */}
            <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                    { label: 'Batalhas', value: '15', icon: Swords, color: '#a855f7' },
                    { label: 'Vitórias', value: '10', icon: Trophy, color: '#22c55e' },
                    { label: 'Win Rate', value: '67%', icon: TrendingUp, color: '#3b82f6' },
                    { label: 'XP Arena', value: '1.250', icon: Zap, color: '#f59e0b' },
                ].map((stat) => (
                    <div key={stat.label} className="bg-white/5 rounded-xl border border-white/10 p-4 text-center">
                        <stat.icon className="w-5 h-5 mx-auto mb-2" style={{ color: stat.color }} />
                        <p className="text-2xl font-bold text-white">{stat.value}</p>
                        <p className="text-xs text-white/40">{stat.label}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}
