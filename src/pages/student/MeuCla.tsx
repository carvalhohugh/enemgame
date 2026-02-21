import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
    Swords, MessageSquare, Send
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import './Ranking.css';

const CLAN_MEMBERS = [
    { pos: 1, nome: "Gabriel Mestre", xp: "45.200", nivel: 42, role: "Líder" },
    { pos: 2, nome: "Ana Fênix", xp: "42.150", nivel: 40, role: "Sub-Líder" },
    { pos: 3, nome: "Você (Herói)", xp: "15.450", nivel: 15, isUser: true, role: "Guerreiro" },
    { pos: 4, nome: "Carla Noite", xp: "14.200", nivel: 14, role: "Guerreiro" },
];

const MeuCla: React.FC = () => {
    const { clan } = useTheme();
    const [chatMsg, setChatMsg] = useState('');

    const clanName = clan ? clan.charAt(0).toUpperCase() + clan.slice(1) : 'Exploradores';
    const clanColor = `var(--clan-${clan || 'cosmos'})`;

    return (
        <div className="ranking-container">
            <header className="ranking-header">
                <div>
                    <h1 style={{ fontSize: '2.5rem', fontWeight: 900, color: 'var(--text-primary)' }}>Fortaleza <span style={{ color: clanColor }}>{clanName}</span> 🛡️</h1>
                    <p style={{ color: 'var(--text-secondary)' }}>Onde gênios se encontram para dominar o ENEM.</p>
                </div>

                <div className="clan-stats-summary glass-card" style={{ display: 'flex', gap: '24px', padding: '12px 24px' }}>
                    <div className="stat">
                        <span style={{ fontSize: '0.7rem', opacity: 0.6, fontWeight: 900 }}>MEMBROS</span>
                        <div style={{ fontWeight: 900 }}>42 / 50</div>
                    </div>
                    <div className="stat">
                        <span style={{ fontSize: '0.7rem', opacity: 0.6, fontWeight: 900 }}>XP TOTAL</span>
                        <div style={{ fontWeight: 900 }}>1.2M</div>
                    </div>
                </div>
            </header>

            <div className="clan-social-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 400px', gap: '24px', marginTop: '32px' }}>
                <div className="left-col" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    <div className="glass-card clan-ranking" style={{ padding: '24px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                            <h3 style={{ fontWeight: 800 }}>Mestres da Guilda</h3>
                            <Link to="/duelos">
                                <button className="neon-button mini">
                                    <Swords size={14} /> DESAFIO X1
                                </button>
                            </Link>
                        </div>
                        <table className="ranking-table">
                            <thead>
                                <tr>
                                    <th>POS</th>
                                    <th style={{ textAlign: 'left' }}>GUERREIRO</th>
                                    <th>CARGO</th>
                                    <th style={{ textAlign: 'right' }}>XP</th>
                                </tr>
                            </thead>
                            <tbody>
                                {CLAN_MEMBERS.map((p, i) => (
                                    <tr key={i} className={`rank-row ${p.isUser ? 'is-user' : ''}`}>
                                        <td className="rank-pos">#{i + 1}</td>
                                        <td style={{ textAlign: 'left' }}>
                                            <div className="rank-badge">
                                                <div className="avatar-mini" style={{ background: clanColor }}>{p.nome[0]}</div>
                                                {p.nome}
                                            </div>
                                        </td>
                                        <td><span className="role-tag" style={{ fontSize: '0.65rem', background: 'rgba(255,255,255,0.05)', padding: '2px 8px', borderRadius: '4px' }}>{p.role}</span></td>
                                        <td className="rank-xp" style={{ textAlign: 'right' }}>{p.xp}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="glass-card clan-chat" style={{ height: 'calc(100vh - 280px)', display: 'flex', flexDirection: 'column', padding: '0 !important', overflow: 'hidden' }}>
                    <div className="chat-header" style={{ padding: '16px 24px', borderBottom: '1px solid var(--bg-card-border)', display: 'flex', alignItems: 'center', gap: '12px', background: 'rgba(255,255,255,0.02)' }}>
                        <MessageSquare size={18} />
                        <span style={{ fontWeight: 900, fontSize: '0.8rem' }}>CHAT DO CLÃ {clanName.toUpperCase()}</span>
                        <div className="status-dot" style={{ width: '8px', height: '8px', background: '#10b981', borderRadius: '50%', marginLeft: 'auto' }}></div>
                    </div>
                    <div className="chat-messages" style={{ flex: 1, padding: '24px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <div className="msg-bubble" style={{ alignSelf: 'flex-start', maxWidth: '85%' }}>
                            <span style={{ fontSize: '0.7rem', color: clanColor, fontWeight: 900 }}>GABRIEL_MESTRE</span>
                            <p style={{ background: 'rgba(255,255,255,0.05)', padding: '10px 14px', borderRadius: '0 12px 12px 12px', fontSize: '0.9rem', marginTop: '4px' }}>Bora focar em Natureza?</p>
                        </div>
                        <div className="msg-bubble me" style={{ alignSelf: 'flex-end', maxWidth: '85%' }}>
                            <p style={{ background: 'var(--primary)', padding: '10px 14px', borderRadius: '12px 12px 0 12px', fontSize: '0.9rem' }}>Com certeza!</p>
                        </div>
                    </div>
                    <div className="chat-input-area" style={{ padding: '16px', borderTop: '1px solid var(--bg-card-border)', display: 'flex', gap: '12px' }}>
                        <input
                            type="text"
                            placeholder="Mensagem..."
                            value={chatMsg}
                            onChange={(e) => setChatMsg(e.target.value)}
                            style={{ flex: 1, background: 'rgba(255,255,255,0.05)', border: '1px solid var(--bg-card-border)', padding: '10px', borderRadius: '8px', color: 'white', fontSize: '0.9rem' }}
                        />
                        <button style={{ background: 'var(--primary)', border: 'none', width: '40px', height: '40px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                            <Send size={16} color="white" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MeuCla;
