import React, { useState, useEffect } from 'react';
import {
    Zap, Timer,
    Trophy, Users,
    Skull, Swords
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import './BattleMode.css';

interface BattleQuestion {
    id: number;
    text: string;
    options: string[];
    correct: number;
}

const MOCK_QUESTIONS: BattleQuestion[] = [
    { id: 1, text: "Qual o principal bioma brasileiro afetado pelas queimadas?", options: ["Pampas", "Cerrado", "Caatinga", "Mata Atlântica"], correct: 1 },
    { id: 2, text: "A Revolução Industrial teve início em qual país?", options: ["França", "Alemanha", "Inglaterra", "EUA"], correct: 2 },
    { id: 3, text: "Qual a função do DNA na célula?", options: ["Produção de energia", "Armazenar informação genética", "Digestão celular", "Transporte de oxigênio"], correct: 1 }
];

const BattleMode: React.FC = () => {
    const [gameState, setGameState] = useState<'lobby' | 'searching' | 'battle' | 'result'>('lobby');
    const [timer, setTimer] = useState(15);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [score, setScore] = useState(0);
    const [opponentScore, setOpponentScore] = useState(0);
    const [bet, setBet] = useState(100);

    useEffect(() => {
        let interval: any;
        if (gameState === 'battle' && timer > 0) {
            interval = setInterval(() => setTimer(t => t - 1), 1000);
        } else if (timer === 0 && gameState === 'battle') {
            handleAnswer(-1); // Time out
        }
        return () => clearInterval(interval);
    }, [gameState, timer]);

    const startSearch = () => {
        setGameState('searching');
        setTimeout(() => {
            setGameState('battle');
            setTimer(15);
        }, 3000);
    };

    const handleAnswer = (index: number) => {
        if (index === MOCK_QUESTIONS[currentQuestion].correct) {
            setScore(s => s + 100);
        }

        // Simular oponente
        if (Math.random() > 0.4) setOpponentScore(o => o + 100);

        if (currentQuestion < MOCK_QUESTIONS.length - 1) {
            setCurrentQuestion(c => c + 1);
            setTimer(15);
        } else {
            setGameState('result');
        }
    };

    return (
        <div className="battle-container">
            <AnimatePresence mode="wait">
                {gameState === 'lobby' && (
                    <motion.div key="lobby" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="battle-lobby">
                        <div className="lobby-content glass-card">
                            <Skull size={64} color="var(--secondary)" />
                            <h1>Arena de <span className="text-secondary">Duelos</span> ⚔️</h1>
                            <p>Enfrente outros estudantes em batalhas de conhecimento em tempo real.</p>

                            <div className="bet-selector">
                                <Zap size={20} color="gold" style={{ display: 'inline', marginRight: '8px' }} />
                                <span>APOSTA: <strong>{bet} XP</strong></span>
                                <input type="range" min="50" max="500" step="50" value={bet} onChange={e => setBet(parseInt(e.target.value))} />
                            </div>

                            <button className="neon-button large" onClick={startSearch}>
                                <Swords size={20} /> BUSCAR ADVERSÁRIO
                            </button>
                        </div>
                    </motion.div>
                )}

                {gameState === 'searching' && (
                    <motion.div key="searching" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="battle-searching">
                        <div className="radar">
                            <motion.div animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0.2, 0.5] }} transition={{ repeat: Infinity, duration: 2 }} className="radar-circle" />
                            <Users size={48} />
                        </div>
                        <h2>Buscando oponente digno...</h2>
                        <p>O nível do adversário será balanceado com o seu.</p>
                    </motion.div>
                )}

                {gameState === 'battle' && (
                    <motion.div key="battle" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="battle-arena">
                        <div className="battle-top-ui">
                            <div className="player-stats">
                                <div className="avatar">H</div>
                                <div className="p-info">
                                    <small>VOCÊ</small>
                                    <strong>{score}</strong>
                                </div>
                            </div>

                            <div className="battle-timer">
                                <div className="timer-circle" style={{ borderColor: timer < 5 ? 'var(--secondary)' : 'var(--primary)' }}>
                                    <Timer size={18} style={{ marginRight: '4px' }} />
                                    <span>{timer}</span>
                                </div>
                            </div>

                            <div className="player-stats opponent">
                                <div className="p-info">
                                    <small>OPONENTE</small>
                                    <strong>{opponentScore}</strong>
                                </div>
                                <div className="avatar opp">X</div>
                            </div>
                        </div>

                        <div className="question-card glass-card">
                            <span className="q-index">QUESTÃO {currentQuestion + 1} DE {MOCK_QUESTIONS.length}</span>
                            <h3>{MOCK_QUESTIONS[currentQuestion].text}</h3>
                        </div>

                        <div className="options-grid">
                            {MOCK_QUESTIONS[currentQuestion].options.map((opt, i) => (
                                <motion.button
                                    key={i}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="option-btn glass-card"
                                    onClick={() => handleAnswer(i)}
                                >
                                    <span className="opt-letter">{String.fromCharCode(65 + i)}</span>
                                    {opt}
                                </motion.button>
                            ))}
                        </div>
                    </motion.div>
                )}

                {gameState === 'result' && (
                    <motion.div key="result" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="battle-result">
                        <div className="glass-card result-content">
                            {score > opponentScore ? (
                                <>
                                    <Trophy size={80} color="gold" />
                                    <h1 className="text-gradient">VITÓRIA ÉPICA!</h1>
                                    <div className="reward">+{bet} XP</div>
                                </>
                            ) : (
                                <>
                                    <Skull size={80} color="#ef4444" />
                                    <h1>DERROTA...</h1>
                                    <div className="reward penalty">-{bet / 2} XP</div>
                                </>
                            )}
                            <div className="final-score">
                                <span>{score}</span> VS <span>{opponentScore}</span>
                            </div>
                            <button className="neon-button" onClick={() => setGameState('lobby')}>
                                RECOMEÇAR
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default BattleMode;
