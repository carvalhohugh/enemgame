import {
    Clock, History, Save,
    FileText, Zap, CheckCircle
} from 'lucide-react';
import { motion } from 'framer-motion';
import './RedacaoPro.css';
import React, { useState, useEffect } from 'react';

const RedacaoPro: React.FC = () => {
    const [text, setText] = useState('');
    const [timeLeft, setTimeLeft] = useState(3600); // 1 hour
    const [isTimerActive, setIsTimerActive] = useState(false);
    const [wordCount, setWordCount] = useState(0);

    useEffect(() => {
        const words = text.trim() ? text.trim().split(/\s+/).length : 0;
        setWordCount(words);
    }, [text]);

    useEffect(() => {
        let interval: any;
        if (isTimerActive && timeLeft > 0) {
            interval = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
        }
        return () => clearInterval(interval);
    }, [isTimerActive, timeLeft]);

    const formatTime = (seconds: number) => {
        const m = Math.floor((seconds % 3600) / 60);
        const s = seconds % 60;
        return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    return (
        <div className="redacao-pro-container">
            <header className="redacao-header">
                <div>
                    <h1 style={{ fontSize: '2.5rem', fontWeight: 900 }}>Arena de <span style={{ color: 'var(--clan-color)' }}>Redação PRO</span> ✍️</h1>
                    <p style={{ color: 'var(--text-secondary)' }}>Simulação em tempo real com critérios oficiais do INEP.</p>
                </div>

                <div className="redacao-tools">
                    <div className="timer-card glass-card">
                        <Clock size={20} color={timeLeft < 600 ? 'var(--secondary)' : 'var(--primary)'} />
                        <span className="time-val">{formatTime(timeLeft)}</span>
                        <button className="start-btn" onClick={() => setIsTimerActive(!isTimerActive)}>
                            {isTimerActive ? 'PAUSAR' : 'INICIAR'}
                        </button>
                    </div>
                    <div className="stat-badge glass-card">
                        <FileText size={18} />
                        <span>{wordCount} PALAVRAS</span>
                    </div>
                </div>
            </header>

            <div className="redacao-editor-layout">
                <main className="editor-main glass-card">
                    <div className="editor-toolbar">
                        <span className="theme-current">TEMA: Os impactos da inteligência artificial na educação brasileira</span>
                        <div className="toolbar-btns">
                            <button title="Salvar Rascunho"><Save size={18} /></button>
                            <button title="Histórico"><History size={18} /></button>
                        </div>
                    </div>
                    <textarea
                        className="pro-textarea"
                        placeholder="Inicie sua dissertação-argumentativa aqui..."
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                    />
                </main>

                <aside className="editor-sidebar">
                    <div className="glass-card analysis-card">
                        <h3><Zap size={18} color="var(--primary)" /> ANÁLISE EM REAL-TIME</h3>
                        <div className="analysis-metrics">
                            <div className="metric">
                                <span>Coesão</span>
                                <div className="bar"><div className="fill" style={{ width: '70%' }}></div></div>
                            </div>
                            <div className="metric">
                                <span>Argumentação</span>
                                <div className="bar"><div className="fill" style={{ width: '45%' }}></div></div>
                            </div>
                        </div>
                    </div>

                    <div className="glass-card checklist-card">
                        <h3>COMPETÊNCIAS (AUTO-AVALIAÇÃO)</h3>
                        <div className="checklist-items">
                            <label><input type="checkbox" /> Proposta de Intervenção</label>
                            <label><input type="checkbox" /> Domínio da Norma Culta</label>
                            <label><input type="checkbox" /> Seleção de Argumentos</label>
                        </div>
                    </div>

                    <button className="neon-button submit-btn">
                        FINALIZAR E ENVIAR REDAÇÃO <CheckCircle size={18} />
                    </button>
                </aside>
            </div>
        </div>
    );
};

export default RedacaoPro;
