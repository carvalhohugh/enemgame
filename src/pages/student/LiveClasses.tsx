import React, { useState } from 'react';
import { Send, Users, Zap, Heart, Flame, ThumbsUp } from 'lucide-react';
import './LiveClasses.css';

const MOCK_MESSAGES = [
    { user: "Gabriel Silva", text: "Essa aula de funções está animal!", color: "var(--clan-titas)" },
    { user: "Ana Paula", text: "Prof, explica de novo a parte do coeficiente?", color: "var(--clan-fenix)" },
    { user: "Lucas M.", text: "Clã Oráculo em peso aqui! 🔥", color: "var(--clan-oraculo)" },
    { user: "Mestre Edu", text: "Claro Ana, veja que o b indica onde a reta corta o eixo y.", color: "var(--primary)" },
];

const LiveClasses: React.FC = () => {
    const [message, setMessage] = useState("");
    const [chat, setChat] = useState(MOCK_MESSAGES);

    const handleSend = () => {
        if (!message) return;
        setChat([...chat, { user: "Você", text: message, color: "var(--secondary)" }]);
        setMessage("");
    };

    return (
        <div className="live-container">
            <div className="video-section">
                <div className="video-player-placeholder">
                    <div className="live-badge">
                        <div style={{ width: 8, height: 8, background: 'white', borderRadius: '50%' }} />
                        AO VIVO
                    </div>

                    <div style={{ textAlign: 'center' }}>
                        <Zap size={64} color="var(--primary)" style={{ marginBottom: '16px' }} />
                        <h2 style={{ fontSize: '1.5rem' }}>MATEMÁTICA: Funções do 1º Grau</h2>
                        <p style={{ color: 'var(--text-secondary)' }}>Prof. Carlos Mestre • 1.240 assistindo</p>
                    </div>

                    <div className="reactions-bar">
                        {[{ icon: <ThumbsUp size={20} />, label: "👍" }, { icon: <Heart size={20} />, label: "❤️" }, { icon: <Flame size={20} />, label: "🔥" }].map((r, i) => (
                            <button key={i} className="reaction-btn">
                                {r.label}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="glass-card" style={{ padding: '24px' }}>
                    <h3>Sobre esta aula</h3>
                    <p style={{ color: 'var(--text-secondary)', marginTop: '12px' }}>
                        Hoje vamos dominar tudo sobre funções afins, análise de gráficos e problemas contextuais do ENEM.
                        Pegue seu material e prepare seu café, herói!
                    </p>
                </div>
            </div>

            <aside className="glass-card chat-section">
                <div style={{ padding: '16px', borderBottom: '1px solid var(--bg-card-border)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Users size={18} />
                    <strong>Chat da Batalha</strong>
                </div>

                <div className="chat-messages">
                    {chat.map((msg, i) => (
                        <div key={i} className="message">
                            <span style={{ color: msg.color }}>{msg.user}:</span>
                            {msg.text}
                        </div>
                    ))}
                </div>

                <div className="chat-input-wrapper">
                    <input
                        className="chat-input"
                        placeholder="Mande uma mensagem..."
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                    />
                    <button className="neon-button" style={{ padding: '10px' }} onClick={handleSend}>
                        <Send size={18} />
                    </button>
                </div>
            </aside>
        </div>
    );
};

export default LiveClasses;
