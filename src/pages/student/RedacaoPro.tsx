import {
    Clock, History, Save,
    FileText, Zap, CheckCircle,
    AlertTriangle, Trophy,
    ArrowRight, RotateCcw
} from 'lucide-react';
import './RedacaoPro.css';
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { EssayService } from '../../services/EssayService';
import type { EssayCorrection, EssayTheme } from '../../services/EssayService';
import { XPService } from '../../services/XPService';

const RedacaoPro: React.FC = () => {
    const [theme, setTheme] = useState<EssayTheme>(EssayService.getRandomTheme());
    const [text, setText] = useState('');
    const [timeLeft, setTimeLeft] = useState(3600); // 1 hour
    const [isTimerActive, setIsTimerActive] = useState(false);
    const [wordCount, setWordCount] = useState(0);

    const [isProcessing, setIsProcessing] = useState(false);
    const [processingStep, setProcessingStep] = useState<'plagiarism' | 'grading' | 'done'>('plagiarism');
    const [correction, setCorrection] = useState<EssayCorrection | null>(null);
    const [showResults, setShowResults] = useState(false);

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

    const handleFinalize = async () => {
        if (wordCount < 10) {
            alert("Sua redação está muito curta para uma avaliação precisa.");
            return;
        }

        setIsProcessing(true);
        setProcessingStep('plagiarism');
        setIsTimerActive(false);

        // 1. Check Plagiarism
        const plagScore = await EssayService.checkPlagiarism(text);

        setProcessingStep('grading');

        // 2. Grade Essay (INEP Standard)
        const result = await EssayService.gradeEssay(text);
        result.plagiarismScore = plagScore;

        setCorrection(result);
        setProcessingStep('done');

        // Award XP (capped at 1000)
        XPService.addXP(result.totalScore);

        setIsProcessing(false);
        setShowResults(true);
    };

    const resetEssay = () => {
        setText('');
        setCorrection(null);
        setShowResults(false);
        setTimeLeft(3600);
        setIsTimerActive(false);
        setTheme(EssayService.getRandomTheme());
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
                        <span className="theme-current">TEMA: {theme.title} {theme.year ? `(ENEM ${theme.year})` : ''}</span>
                        <div className="toolbar-btns">
                            <button title="Trocar Tema" onClick={() => setTheme(EssayService.getRandomTheme())}><RotateCcw size={18} /></button>
                            <button title="Salvar Rascunho"><Save size={18} /></button>
                            <button title="Histórico"><History size={18} /></button>
                        </div>
                    </div>
                    <textarea
                        className="pro-textarea"
                        placeholder="Inicie sua dissertação-argumentativa aqui..."
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        disabled={isProcessing || showResults}
                    />
                </main>

                <aside className="editor-sidebar">
                    <div className="glass-card analysis-card">
                        <h3><Zap size={18} color="var(--primary)" /> ANÁLISE EM REAL-TIME</h3>
                        <div className="analysis-metrics">
                            <div className="metric">
                                <span>Coesão</span>
                                <div className="bar"><div className="fill" style={{ width: wordCount > 100 ? '70%' : '30%' }}></div></div>
                            </div>
                            <div className="metric">
                                <span>Argumentação</span>
                                <div className="bar"><div className="fill" style={{ width: wordCount > 250 ? '85%' : '45%' }}></div></div>
                            </div>
                        </div>
                    </div>

                    <div className="glass-card checklist-card">
                        <h3>COMPETÊNCIAS (AUTO-AVALIAÇÃO)</h3>
                        <div className="checklist-items">
                            <label><input type="checkbox" checked={wordCount >= 300} readOnly /> Mínimo de 300 palavras</label>
                            <label><input type="checkbox" checked={text.includes('Portanto')} readOnly /> Proposta de Intervenção</label>
                            <label><input type="checkbox" checked={text.length > 100} readOnly /> Repertório Sociocultural</label>
                        </div>
                    </div>

                    <button
                        className={`neon-button submit-btn ${isProcessing ? 'loading' : ''}`}
                        onClick={handleFinalize}
                        disabled={isProcessing || wordCount < 10}
                    >
                        {isProcessing ? 'CORRIGINDO...' : 'FINALIZAR E ENVIAR REDAÇÃO'} <CheckCircle size={18} />
                    </button>
                </aside>
            </div>

            <AnimatePresence>
                {isProcessing && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="result-overlay"
                    >
                        <div className="scanning-container">
                            <div className="scanner-box glass-card">
                                <div className="scan-line"></div>
                                <div style={{ padding: '40px', opacity: 0.1, whiteSpace: 'pre-wrap' }}>
                                    {text.substring(0, 1000)}
                                </div>
                            </div>
                            <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>
                                {processingStep === 'plagiarism' ? 'VERIFICANDO ANTIPLAGIO...' : 'ANALISANDO COMPETÊNCIAS INEP...'}
                            </h2>
                            <p style={{ color: 'var(--text-secondary)', marginTop: '8px' }}>
                                Nossa IA está processando seu texto seguindo rigorosamente os tiers de correção do ENEM.
                            </p>
                        </div>
                    </motion.div>
                )}

                {showResults && correction && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="result-overlay"
                    >
                        <div className="glass-card result-modal">
                            <div className="result-header">
                                <div className="total-score-circle">
                                    <span className="score-num">{correction.totalScore}</span>
                                    <span className="score-label">PONTOS INEP</span>
                                </div>
                                <h2 style={{ fontSize: '2rem', fontWeight: 900 }}>Grade de Avaliação</h2>
                            </div>

                            <div className="competencies-grid">
                                {[
                                    { id: 'C1', title: 'Norma Culta', score: correction.competencies.c1 },
                                    { id: 'C2', title: 'Compreensão do Tema', score: correction.competencies.c2 },
                                    { id: 'C3', title: 'Organização de Ideias', score: correction.competencies.c3 },
                                    { id: 'C4', title: 'Mecanismos Linguísticos', score: correction.competencies.c4 },
                                    { id: 'C5', title: 'Proposta de Intervenção', score: correction.competencies.c5 },
                                ].map(c => (
                                    <div key={c.id} className="comp-card">
                                        <div className="comp-head">
                                            <span className="comp-title">{c.id} • {c.title}</span>
                                            <span className="comp-points">{c.score}</span>
                                        </div>
                                        <div className="metric">
                                            <div className="bar" style={{ height: '4px' }}>
                                                <div className="fill" style={{ width: `${(c.score / 200) * 100}%` }}></div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="feedback-section glass-card" style={{ padding: '24px', marginBottom: '32px' }}>
                                <h4 style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px', color: 'var(--primary)' }}>
                                    <Trophy size={20} /> Nota do Avaliador
                                </h4>
                                <p style={{ lineHeight: 1.6 }}>{correction.feedback}</p>
                            </div>

                            {correction.plagiarismScore > 20 && (
                                <div className="plagiarism-warning">
                                    <AlertTriangle color="var(--secondary)" />
                                    <div>
                                        <h4 style={{ color: 'var(--secondary)' }}>Similaridade Detectada: {correction.plagiarismScore}%</h4>
                                        <p style={{ fontSize: '0.8rem' }}>Encontramos trechos que coincidem com repertórios comuns ou textos da internet. Tente ser mais autoral.</p>
                                    </div>
                                </div>
                            )}

                            <div className="result-actions" style={{ display: 'flex', gap: '16px', marginTop: '40px' }}>
                                <button className="neon-button" style={{ flex: 1, background: 'rgba(255,255,255,0.05)' }} onClick={resetEssay}>
                                    <RotateCcw size={18} /> REFAZER REDAÇÃO
                                </button>
                                <button className="neon-button" style={{ flex: 1 }} onClick={() => setShowResults(false)}>
                                    VOLTAR PARA O EDITOR <ArrowRight size={18} />
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default RedacaoPro;
