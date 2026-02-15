import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    Trophy, MessageCircle, Users, Swords, Crown,
    Send, Circle, Zap, Star, BookOpen, Target,
} from 'lucide-react';
import { useAuthProfile } from '@/context/AuthProfileContext';
import { CLANS, type ClanId } from '@/services/ClanService';
import {
    getOnlineMembers, getClanChat, sendClanMessage,
    type OnlineMember, type ChatMessage,
} from '@/services/ArenaService';
import { MASCOT_COMPONENTS } from './ClanMascots';

type Tab = 'ranking' | 'chat' | 'online';

const CLAN_COLORS: Record<string, string> = {
    fenix: '#f97316', lobo: '#6366f1', aguia: '#eab308', dragao: '#ef4444',
};

const STATUS_CONFIG = {
    idle: { label: 'Online', color: '#22c55e', icon: Circle },
    studying: { label: 'Estudando', color: '#3b82f6', icon: BookOpen },
    arena: { label: 'Na Arena', color: '#ef4444', icon: Swords },
    quiz: { label: 'Fazendo Quiz', color: '#a855f7', icon: Target },
};

/* ─── Mock ranking ─── */
function getClanRanking(clanId: ClanId) {
    const members = [
        { name: 'Lucas_Fênix', xp: 12500, wins: 42, streak: 15 },
        { name: 'Carla_Fênix', xp: 10800, wins: 38, streak: 12 },
        { name: 'Juliana_Fênix', xp: 9200, wins: 30, streak: 8 },
        { name: 'Pedro_Dragão', xp: 7800, wins: 25, streak: 5 },
        { name: 'Ana_Lobo', xp: 6500, wins: 20, streak: 3 },
        { name: 'Gabriel_Lobo', xp: 5200, wins: 18, streak: 7 },
        { name: 'Maria_Águia', xp: 4000, wins: 15, streak: 2 },
        { name: 'Bianca_Águia', xp: 3200, wins: 12, streak: 1 },
    ].map(m => ({ ...m, clanId }));
    return members;
}

export default function ClanHubPage() {
    const navigate = useNavigate();
    const { profile } = useAuthProfile();
    const clanId = profile.clanId ?? 'fenix';
    const clan = CLANS[clanId];
    const Mascot = MASCOT_COMPONENTS[clanId];
    const clanColor = CLAN_COLORS[clanId];

    const [activeTab, setActiveTab] = useState<Tab>('ranking');
    const [onlineMembers, setOnlineMembers] = useState<OnlineMember[]>([]);
    const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const chatEndRef = useRef<HTMLDivElement>(null);

    // Load data
    useEffect(() => {
        setOnlineMembers(getOnlineMembers(clanId));
        setChatMessages(getClanChat(clanId));
    }, [clanId]);

    // Scroll chat to bottom
    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [chatMessages]);

    const handleSendMessage = () => {
        if (!newMessage.trim()) return;
        const msg: ChatMessage = {
            id: `cm-${Date.now()}`,
            senderId: 'self',
            senderName: profile.displayName,
            text: newMessage.trim(),
            timestamp: Date.now(),
        };
        sendClanMessage(clanId, msg);
        setChatMessages(prev => [...prev, msg]);
        setNewMessage('');
    };

    const ranking = getClanRanking(clanId);
    const tabs = [
        { id: 'ranking' as const, label: 'Ranking', icon: Trophy },
        { id: 'chat' as const, label: 'Chat', icon: MessageCircle },
        { id: 'online' as const, label: `Online (${onlineMembers.length})`, icon: Users },
    ];

    return (
        <div className="max-w-5xl mx-auto py-8 px-4">
            {/* Hero Banner */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative overflow-hidden rounded-2xl p-8 mb-8"
                style={{
                    background: `linear-gradient(135deg, ${clanColor}15 0%, ${clanColor}08 50%, transparent 100%)`,
                    border: `1px solid ${clanColor}30`,
                }}
            >
                <div className="flex items-center gap-6">
                    <motion.div
                        className="relative"
                        animate={{ scale: [1, 1.05, 1] }}
                        transition={{ repeat: Infinity, duration: 3 }}
                    >
                        <div className="w-24 h-24 rounded-2xl flex items-center justify-center"
                            style={{ backgroundColor: clanColor + '20' }}>
                            <Mascot size={70} />
                        </div>
                        {/* Glow */}
                        <div className="absolute inset-0 rounded-2xl animate-pulse opacity-30"
                            style={{ boxShadow: `0 0 40px ${clanColor}` }} />
                    </motion.div>

                    <div className="flex-1">
                        <h1 className="text-3xl font-black text-white">{clan.name}</h1>
                        <p className="text-white/50 mt-1">{clan.description}</p>
                        <p className="text-sm italic mt-2" style={{ color: clanColor }}>{clan.motto}</p>
                        <div className="flex gap-4 mt-3">
                            {[
                                { label: 'Membros', value: '1.432' },
                                { label: 'XP Total', value: '89.500' },
                                { label: 'Ranking', value: '#2' },
                            ].map(s => (
                                <div key={s.label} className="text-center">
                                    <p className="text-white font-bold">{s.value}</p>
                                    <p className="text-xs text-white/30">{s.label}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Tabs */}
            <div className="flex gap-2 mb-6">
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`px-5 py-2.5 rounded-xl text-sm font-medium flex items-center gap-2 transition-all ${activeTab === tab.id
                            ? 'text-white border'
                            : 'text-white/40 hover:text-white/60 hover:bg-white/5'
                            }`}
                        style={activeTab === tab.id ? { backgroundColor: clanColor + '20', borderColor: clanColor + '40' } : {}}
                    >
                        <tab.icon className="w-4 h-4" />
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* ━━━ RANKING TAB ━━━ */}
            {activeTab === 'ranking' && (
                <div className="bg-white/5 rounded-2xl border border-white/10 p-6">
                    <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                        <Trophy className="w-5 h-5" style={{ color: clanColor }} />
                        Ranking do {clan.name}
                    </h3>
                    <div className="space-y-2">
                        {ranking.map((member, i) => (
                            <motion.div
                                key={member.name}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.05 }}
                                className="flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/8 transition"
                            >
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold ${i === 0 ? 'bg-gold/20 text-gold' : i === 1 ? 'bg-gray-300/20 text-gray-300' : i === 2 ? 'bg-orange-700/20 text-orange-500' : 'bg-white/10 text-white/40'
                                    }`}>
                                    {i < 3 ? <Crown className="w-5 h-5" /> : i + 1}
                                </div>
                                <div className="flex-1">
                                    <p className="text-white font-medium text-sm">{member.name}</p>
                                    <p className="text-xs text-white/30 flex items-center gap-3">
                                        <span className="flex items-center gap-1"><Zap className="w-3 h-3" />{member.xp.toLocaleString()} XP</span>
                                        <span className="flex items-center gap-1"><Swords className="w-3 h-3" />{member.wins}W</span>
                                        <span className="flex items-center gap-1"><Star className="w-3 h-3" />{member.streak}🔥</span>
                                    </p>
                                </div>
                                <div className="w-16 text-right">
                                    <span className="text-xs font-bold" style={{ color: clanColor }}>Nv {10 + i}</span>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            )}

            {/* ━━━ CHAT TAB ━━━ */}
            {activeTab === 'chat' && (
                <div className="bg-white/5 rounded-2xl border border-white/10 flex flex-col" style={{ height: '500px' }}>
                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-3">
                        {chatMessages.map((msg) => {
                            const isSelf = msg.senderId === 'self';
                            return (
                                <motion.div
                                    key={msg.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className={`flex ${isSelf ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div className={`max-w-[70%] p-3 rounded-2xl ${isSelf
                                        ? 'rounded-br-md text-white'
                                        : 'bg-white/10 rounded-bl-md text-white/80'
                                        }`}
                                        style={isSelf ? { backgroundColor: clanColor + '40' } : {}}
                                    >
                                        {!isSelf && (
                                            <p className="text-xs font-bold mb-1" style={{ color: clanColor }}>{msg.senderName}</p>
                                        )}
                                        <p className="text-sm">{msg.text}</p>
                                        <p className="text-xs text-white/30 mt-1 text-right">
                                            {new Date(msg.timestamp).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                                        </p>
                                    </div>
                                </motion.div>
                            );
                        })}
                        <div ref={chatEndRef} />
                    </div>

                    {/* Input */}
                    <div className="p-4 border-t border-white/10">
                        <form
                            onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }}
                            className="flex gap-2"
                        >
                            <input
                                type="text"
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                placeholder="Digite sua mensagem..."
                                className="flex-1 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-white/30 transition"
                            />
                            <button
                                type="submit"
                                disabled={!newMessage.trim()}
                                className="px-4 py-3 rounded-xl text-white transition disabled:opacity-30"
                                style={{ backgroundColor: clanColor }}
                            >
                                <Send className="w-5 h-5" />
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* ━━━ ONLINE TAB ━━━ */}
            {activeTab === 'online' && (
                <div className="space-y-3">
                    {onlineMembers.length === 0 ? (
                        <div className="text-center py-16 bg-white/5 rounded-2xl border border-white/10">
                            <Users className="w-12 h-12 text-white/20 mx-auto mb-4" />
                            <p className="text-white/40">Nenhum membro online agora.</p>
                        </div>
                    ) : (
                        onlineMembers.map((member, i) => {
                            const statusConf = STATUS_CONFIG[member.status];
                            const StatusIcon = statusConf.icon;
                            return (
                                <motion.div
                                    key={member.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.05 }}
                                    className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/10"
                                >
                                    {/* Avatar */}
                                    <div className="relative">
                                        <div className="w-12 h-12 rounded-xl flex items-center justify-center text-lg font-bold"
                                            style={{ backgroundColor: clanColor + '20', color: clanColor }}>
                                            {member.name.substring(0, 2).toUpperCase()}
                                        </div>
                                        {/* Online dot */}
                                        <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-dark-bg"
                                            style={{ backgroundColor: statusConf.color }} />
                                    </div>

                                    {/* Info */}
                                    <div className="flex-1">
                                        <p className="text-white font-medium">{member.name}</p>
                                        <div className="flex items-center gap-1.5 mt-0.5">
                                            <StatusIcon className="w-3 h-3" style={{ color: statusConf.color }} />
                                            <span className="text-xs" style={{ color: statusConf.color }}>{statusConf.label}</span>
                                            <span className="text-xs text-white/20 ml-2">Nv {member.level}</span>
                                        </div>
                                    </div>

                                    {/* Challenge button */}
                                    <button
                                        onClick={() => navigate('/app/arena/x1')}
                                        className="px-4 py-2 rounded-xl text-sm font-medium flex items-center gap-2 transition hover:scale-105"
                                        style={{ backgroundColor: clanColor + '20', color: clanColor }}
                                    >
                                        <Swords className="w-4 h-4" />
                                        Desafiar X1
                                    </button>
                                </motion.div>
                            );
                        })
                    )}
                </div>
            )}
        </div>
    );
}
