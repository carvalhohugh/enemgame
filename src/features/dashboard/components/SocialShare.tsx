
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Share2, Twitter, Linkedin, Facebook, Copy, CheckCircle2 } from 'lucide-react';
import { useStudyProgress } from '@/context/StudyProgressContext';

export function SocialShare() {
    const { addXp } = useStudyProgress();
    const [showShare, setShowShare] = useState(false);
    const [copied, setCopied] = useState(false);

    const handleShare = (platform: string) => {
        // Simula compartilhamento
        addXp(50);

        let url = '';
        const shareText = "Estou estudando para o ENEM na melhor plataforma gamificada! Venha batalhar comigo! 🚀 #EnemGame";
        const shareUrl = "https://enemgame.com.br"; // URL fictícia

        if (platform === 'twitter') {
            url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
        } else if (platform === 'linkedin') {
            url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`;
        } else if (platform === 'facebook') {
            url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
        } else if (platform === 'whatsapp') {
            url = `https://wa.me/?text=${encodeURIComponent(shareText + ' ' + shareUrl)}`;
        }

        if (url) window.open(url, '_blank');
        setShowShare(false);
    };

    const copyLink = () => {
        navigator.clipboard.writeText("https://enemgame.com.br/invite/junior123");
        setCopied(true);
        addXp(20);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="relative">
            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowShare(!showShare)}
                className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-colors"
                title="Compartilhar e Ganhar XP"
            >
                <Share2 className="w-5 h-5" />
            </motion.button>

            <AnimatePresence>
                {showShare && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 10 }}
                        className="absolute right-0 top-12 z-50 bg-[#1A1A1A] border border-white/10 rounded-xl p-4 shadow-xl w-64"
                    >
                        <div className="flex items-center justify-between mb-3 text-sm text-white/60">
                            <span>Compartilhe (+50 XP)</span>
                            <button onClick={() => setShowShare(false)} className="hover:text-white">✕</button>
                        </div>

                        <div className="grid grid-cols-4 gap-2 mb-4">
                            <button onClick={() => handleShare('twitter')} className="p-2 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 rounded-lg flex justify-center"><Twitter className="w-5 h-5" /></button>
                            <button onClick={() => handleShare('linkedin')} className="p-2 bg-blue-700/10 hover:bg-blue-700/20 text-blue-600 rounded-lg flex justify-center"><Linkedin className="w-5 h-5" /></button>
                            <button onClick={() => handleShare('facebook')} className="p-2 bg-blue-600/10 hover:bg-blue-600/20 text-blue-500 rounded-lg flex justify-center"><Facebook className="w-5 h-5" /></button>
                            <button onClick={() => handleShare('whatsapp')} className="p-2 bg-green-500/10 hover:bg-green-500/20 text-green-400 rounded-lg flex justify-center"><Share2 className="w-5 h-5" /></button>
                        </div>

                        <div className="relative">
                            <input
                                type="text"
                                value="enemgame.com/invite/junior"
                                readOnly
                                className="w-full bg-black/20 border border-white/5 rounded-lg px-3 py-2 text-xs text-white/40 font-mono"
                            />
                            <button
                                onClick={copyLink}
                                className="absolute right-1 top-1 p-1 hover:bg-white/10 rounded text-white/40 hover:text-white transition"
                            >
                                {copied ? <CheckCircle2 className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
