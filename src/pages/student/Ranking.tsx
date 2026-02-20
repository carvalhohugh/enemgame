import React, { useState } from 'react';
import {
    Trophy, Medal, Star, Filter, MapPin,
    MessageSquare, Swords, Send, UserPlus
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';
import './Ranking.css';

const RANKING_DATA = [
    { pos: 1, id: 'u1', nome: "Gabriel Mestre", clan: "cosmos", xp: "45.200", nivel: 42, local: "São Paulo, SP" },
    { pos: 2, id: 'u2', nome: "Ana Fênix", clan: "ignis", xp: "42.150", nivel: 40, local: "Rio de Janeiro, RJ" },
    { pos: 3, id: 'u3', nome: "Lucas Sábio", clan: "glacies", xp: "39.800", nivel: 38, local: "Belo Horizonte, MG" },
    { pos: 4, id: 'u4', nome: "Você (Herói)", clan: "cosmos", xp: "15.450", nivel: 15, isUser: true, local: "Curitiba, PR" },
    { pos: 5, id: 'u5', nome: "Carla Noite", clan: "silva", xp: "14.200", nivel: 14, local: "Salvador, BA" },
];

const Ranking: React.FC = () => {
    const { clan } = useTheme();
    const [activeTab, setActiveTab] = useState<'geral' | 'clan'>('geral');
    const [chatMsg, setChatMsg] = useState('');
    const [friends, setFriends] = useState<string[]>([]);

    const clanName = clan ? clan.charAt(0).toUpperCase() + clan.slice(1) : 'Exploradores';

    const filteredRanking = activeTab === 'geral'
        ? RANKING_DATA
        : RANKING_DATA.filter(p => p.clan === clan);

    const toggleFriend = (id: string) => {
        setFriends(prev =>
            prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]
        );
    };

    return (
        <div className="ranking-container">
            <header className="ranking-header">
                <div>
                    <h1 style={{ fontSize: '2.5rem', fontWeight: 900, color: 'var(--text-primary)' }}>Legião de <span style={{ color: 'var(--primary)' }}>Mestres</span> 🏆</h1>
                    <p style={{ color: 'var(--text-secondary)' }}>Os maiores combatentes do Brasil na jornada rumo ao ENEM.</p>
                </div>

                <div className="tab-navigation glass-card">
                    <button
                        className={`tab-btn ${activeTab === 'geral' ? 'active' : ''}`}
                        onClick={() => setActiveTab('geral')}
                    >
                        RANKING GERAL
                    </button>
                    <button
                        className={`tab-btn ${activeTab === 'clan' ? 'active' : ''}`}
                        onClick={() => setActiveTab('clan')}
                    >
                        MEU CLÃ ({clanName.toUpperCase()})
                    </button>
                </div>
            </header>

            <AnimatePresence mode="wait">
                <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                >
                    {activeTab === 'geral' ? (
                        <div className="geral-view">
                            <div className="ranking-filters glass-card">
                                <div className="filter-item">
                                    <label>ESTADO / REGIÃO</label>
                                    <select>
                                        <option>Brasil (Geral)</option>
                                        <option>São Paulo</option>
                                        <option>Rio de Janeiro</option>
                                    </select>
                                </div>
                                <div className="filter-item">
                                    <label>BUSCAR CIDADE</label>
                                    <div style={{ position: 'relative' }}>
                                        <MapPin size={14} className="input-icon" />
                                        <input placeholder="Ex: Curitiba" />
                                    </div>
                                </div>
                                <button className="neon-button">
                                    <Filter size={16} /> ATUALIZAR
                                </button>
                            </div>

                            <div className="ranking-top-cards">
                                <div className="glass-card top-player-card">
                                    <Medal size={32} color="#C0C0C0" />
                                    <div className="player-avatar-large">🥈</div>
                                    <h4>Ana Fênix</h4>
                                    <span style={{ color: 'var(--clan-ignis)', fontSize: '0.8rem' }}>CLÃ IGNIS</span>
                                </div>
                                <div className="glass-card top-player-card first">
                                    <Trophy size={40} color="#FFD700" />
                                    <div className="player-avatar-large" style={{ width: '100px', height: '100px', borderColor: 'var(--secondary)' }}>👑</div>
                                    <h3 style={{ fontSize: '1.25rem' }}>Gabriel Mestre</h3>
                                    <span style={{ color: 'var(--clan-cosmos)', fontSize: '0.9rem' }}>CLÃ COSMOS</span>
                                </div>
                                <div className="glass-card top-player-card">
                                    <Medal size={32} color="#CD7F32" />
                                    <div className="player-avatar-large">🥉</div>
                                    <h4>Lucas Sábio</h4>
                                    <span style={{ color: 'var(--clan-glacies)', fontSize: '0.8rem' }}>CLÃ GLACIES</span>
                                </div>
                            </div>

                            <div className="glass-card table-wrapper">
                                <table className="ranking-table">
                                    <thead>
                                        <tr>
                                            <th>POS</th>
                                            <th style={{ textAlign: 'left' }}>GUERREIRO</th>
                                            <th style={{ textAlign: 'left' }}>CLÃ</th>
                                            <th>NÍVEL</th>
                                            <th>XP</th>
                                            <th style={{ textAlign: 'center' }}>AÇÕES</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredRanking.map((player) => (
                                            <tr key={player.pos} className={`rank-row ${player.isUser ? 'is-user' : ''}`}>
                                                <td className="rank-pos">#{player.pos}</td>
                                                <td style={{ textAlign: 'left' }}>
                                                    <div className="rank-badge">
                                                        <div className="avatar-mini"><Star size={14} /></div>
                                                        {player.nome}
                                                    </div>
                                                </td>
                                                <td style={{ textAlign: 'left', fontWeight: 700, color: `var(--clan-${player.clan})`, textTransform: 'uppercase', fontSize: '0.7rem' }}>
                                                    {player.clan}
                                                </td>
                                                <td className="rank-lvl">LVL {player.nivel}</td>
                                                <td className="rank-xp">{player.xp}</td>
                                                <td className="rank-actions">
                                                    {!player.isUser && (
                                                        <div className="action-btns">
                                                            <button
                                                                title={friends.includes(player.id) ? "Remover Amigo" : "Adicionar Amigo"}
                                                                className={`action-icon-btn ${friends.includes(player.id) ? 'active' : ''}`}
                                                                onClick={() => toggleFriend(player.id)}
                                                            >
                                                                <UserPlus size={16} />
                                                            </button>
                                                            <button title="Enviar Mensagem" className="action-icon-btn">
                                                                <MessageSquare size={16} />
                                                            </button>
                                                        </div>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    ) : (
                        <div className="clan-social-grid">
                            <div className="glass-card clan-ranking">
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                                    <h3 style={{ fontWeight: 800 }}>Mestres do Clã {clanName}</h3>
                                    <button className="neon-button" style={{ fontSize: '0.7rem', padding: '10px 16px' }}>
                                        <Swords size={14} /> DESAFIO X1
                                    </button>
                                </div>
                                <table className="ranking-table">
                                    <tbody>
                                        {filteredRanking.map((player, i) => (
                                            <tr key={player.pos} className="rank-row">
                                                <td className="rank-pos">#{i + 1}</td>
                                                <td style={{ textAlign: 'left' }}>
                                                    <div className="rank-badge">
                                                        <div className="avatar-mini" style={{ background: 'var(--clan-color)' }}>{player.nome[0]}</div>
                                                        {player.nome}
                                                    </div>
                                                </td>
                                                <td className="rank-xp" style={{ textAlign: 'right' }}>{player.xp} XP</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            <div className="glass-card clan-chat">
                                <div className="chat-header">
                                    <MessageSquare size={18} />
                                    <span>CHAT DO CLÃ {clanName.toUpperCase()}</span>
                                    <div className="status-dot"></div>
                                </div>
                                <div className="chat-messages">
                                    <div className="msg-bubble">
                                        <span className="author">Gabriel_Pro:</span>
                                        <p>Bora estudar Redação hoje no Hub?</p>
                                    </div>
                                    <div className="msg-bubble me">
                                        <p>Com certeza, estou terminando o resumo de Modernismo.</p>
                                    </div>
                                    <div className="msg-bubble">
                                        <span className="author">Ana_Fênix:</span>
                                        <p>Alguém online para um X1 na Arena?</p>
                                    </div>
                                </div>
                                <div className="chat-input-area">
                                    <input
                                        type="text"
                                        placeholder="Digite sua mensagem..."
                                        value={chatMsg}
                                        onChange={(e) => setChatMsg(e.target.value)}
                                    />
                                    <button className="send-btn"><Send size={18} /></button>
                                </div>
                            </div>
                        </div>
                    )}
                </motion.div>
            </AnimatePresence>
        </div>
    );
};

export default Ranking;
