import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthProfile } from '@/context/AuthProfileContext';
import { CLANS, type ClanId } from '@/services/ClanService';
import { Flame, Dog, Bird, Shield, Plus } from 'lucide-react';
import ScoreHistoryForm from './ScoreHistoryForm';
import ScoreHistoryList from './ScoreHistoryList';
import type { ExamScore } from './types';

const CLAN_ICONS: Record<ClanId, React.ElementType> = {
    fenix: Flame,
    lobo: Dog,
    aguia: Bird,
    dragao: Shield,
};

export default function ProfilePage() {
    const { profile } = useAuthProfile();
    const [showScoreForm, setShowScoreForm] = useState(false);
    const [scores, setScores] = useState<ExamScore[]>(() => {
        const saved = localStorage.getItem('enemgame_scores');
        return saved ? JSON.parse(saved) : [];
    });

    useEffect(() => {
        localStorage.setItem('enemgame_scores', JSON.stringify(scores));
    }, [scores]);

    const handleAddScore = (score: ExamScore) => {
        setScores(prev => [score, ...prev]);
        setShowScoreForm(false);
    };

    const handleDeleteScore = (id: string) => {
        setScores(prev => prev.filter(s => s.id !== id));
    };

    const clan = profile.clanId ? CLANS[profile.clanId] : null;
    const ClanIcon = profile.clanId ? CLAN_ICONS[profile.clanId] : null;

    return (
        <div className="space-y-8">
            {/* Profile Header */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative overflow-hidden rounded-2xl p-8 bg-white/5 border border-white/10"
            >
                <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                    {/* Avatar */}
                    <div className="w-20 h-20 rounded-2xl bg-purple/20 flex items-center justify-center text-3xl font-bold text-purple-light shrink-0">
                        {profile.displayName.substring(0, 2).toUpperCase()}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                        <h1 className="text-2xl font-bold text-white">{profile.displayName}</h1>
                        <p className="text-white/50 text-sm mt-1">{profile.email || 'Estudante'}</p>

                        {/* Clan Badge */}
                        {clan && ClanIcon && (
                            <div
                                className="inline-flex items-center gap-2 mt-3 px-3 py-1.5 rounded-full text-xs font-semibold"
                                style={{ backgroundColor: `${clan.color}20`, color: clan.color, border: `1px solid ${clan.color}40` }}
                            >
                                <ClanIcon className="w-3.5 h-3.5" />
                                Clã {clan.name}
                            </div>
                        )}
                    </div>

                    {/* Quick Stats */}
                    <div className="flex gap-4 text-center shrink-0">
                        <div className="bg-white/5 rounded-xl p-3 border border-white/5 min-w-[80px]">
                            <p className="text-lg font-bold text-white">{scores.length}</p>
                            <p className="text-xs text-white/40">Provas</p>
                        </div>
                        <div className="bg-white/5 rounded-xl p-3 border border-white/5 min-w-[80px]">
                            <p className="text-lg font-bold text-gold">
                                {scores.length > 0
                                    ? Math.round(scores.reduce((acc, s) => acc + s.totalScore, 0) / scores.length)
                                    : '—'}
                            </p>
                            <p className="text-xs text-white/40">Média Geral</p>
                        </div>
                    </div>
                </div>

                {/* Gradient border at bottom */}
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-purple via-purple-light to-gold" />
            </motion.div>

            {/* Score History Section */}
            <div>
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h2 className="text-xl font-bold text-white">Histórico de Notas</h2>
                        <p className="text-sm text-white/50 mt-1">Registre suas notas do ENEM e vestibulares para acompanhar sua evolução.</p>
                    </div>
                    <button
                        onClick={() => setShowScoreForm(true)}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-purple/20 hover:bg-purple/30 text-purple-light font-medium text-sm transition-all border border-purple/20 hover:border-purple/40"
                    >
                        <Plus className="w-4 h-4" />
                        Adicionar Nota
                    </button>
                </div>

                {/* Score Form Modal */}
                <AnimatePresence>
                    {showScoreForm && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
                            onClick={(e) => e.target === e.currentTarget && setShowScoreForm(false)}
                        >
                            <motion.div
                                initial={{ scale: 0.95, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.95, opacity: 0 }}
                                className="w-full max-w-lg"
                            >
                                <ScoreHistoryForm
                                    onSubmit={handleAddScore}
                                    onCancel={() => setShowScoreForm(false)}
                                />
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Score List */}
                <ScoreHistoryList scores={scores} onDelete={handleDeleteScore} />
            </div>
        </div>
    );
}
