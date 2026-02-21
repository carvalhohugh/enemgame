import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, SkipForward, AlertCircle, CheckCircle, XCircle, Shield, Sparkles, Lightbulb } from 'lucide-react';
import { QuestionService, type Question } from '../../services/QuestionService';
import './BattleRoom.css';

interface BattleRoomProps {
    onExit: () => void;
    year?: number;
}

const BattleRoom: React.FC<BattleRoomProps> = ({ onExit, year }) => {

    const [questions, setQuestions] = useState<Question[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [selectedOption, setSelectedOption] = useState<number | null>(null);
    const [isAnswered, setIsAnswered] = useState(false);
    const [score, setScore] = useState(0);
    const [health, setHealth] = useState(100);
    const [timeLeft, setTimeLeft] = useState(120);
    const [isHit, setIsHit] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    // Powerups State
    const [powerups, setPowerups] = useState({
        dica: 1,
        shield: 1,
        lupa: 1
    });
    const [isShieldActive, setIsShieldActive] = useState(false);
    const [eliminatedOptions, setEliminatedOptions] = useState<number[]>([]);
    const [showExplanationEarly, setShowExplanationEarly] = useState(false);

    useEffect(() => {
        const loadQuestions = async () => {
            setIsLoading(true);
            const q = await QuestionService.getRandomQuiz(undefined, 10);
            if (year) console.log(`Iniciando batalha com questões do ENEM ${year}`);
            setQuestions(q);
            setIsLoading(false);
        };
        loadQuestions();
    }, []);

    useEffect(() => {
        if (timeLeft > 0 && !isAnswered && !isLoading) {
            const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
            return () => clearTimeout(timer);
        } else if (timeLeft === 0 && !isAnswered) {
            handleAnswer(-1); // Resposta automática errada por tempo
        }
    }, [timeLeft, isAnswered, isLoading]);

    const usePowerup = (type: 'dica' | 'shield' | 'lupa') => {
        if (powerups[type] <= 0 || isAnswered) return;

        setPowerups(prev => ({ ...prev, [type]: prev[type] - 1 }));

        if (type === 'shield') {
            setIsShieldActive(true);
        } else if (type === 'lupa') {
            const currentQ = questions[currentIndex];
            const incorrectIndices = currentQ.options
                .map((_, i) => i)
                .filter(i => i !== currentQ.correctOption);

            const shuffled = incorrectIndices.sort(() => 0.5 - Math.random());
            setEliminatedOptions(shuffled.slice(0, 2));
        } else if (type === 'dica') {
            setShowExplanationEarly(true);
        }
    };

    const handleAnswer = (index: number) => {
        if (isAnswered || eliminatedOptions.includes(index)) return;

        setSelectedOption(index);
        setIsAnswered(true);

        if (index === questions[currentIndex]?.correctOption) {
            setScore(prev => prev + 150 + (timeLeft * 2)); // Bônus por tempo
        } else {
            if (isShieldActive) {
                setIsShieldActive(false);
            } else {
                setHealth(Math.max(0, health - 25));
                setIsHit(true);
                setTimeout(() => setIsHit(false), 500);
            }
        }
    };

    const nextQuestion = () => {
        if (currentIndex < questions.length - 1 && health > 0) {
            setCurrentIndex(currentIndex + 1);
            setSelectedOption(null);
            setIsAnswered(false);
            setTimeLeft(120);
            setIsShieldActive(false);
            setEliminatedOptions([]);
            setShowExplanationEarly(false);
        } else {
            alert(health <= 0 ? "GAME OVER! Seu HP acabou." : `VITÓRIA! Score Final: ${score}`);
            onExit();
        }
    };


    if (isLoading) return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '20px' }}>
            <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }} style={{ color: 'var(--primary)' }}><Clock size={40} /></motion.div>
            <p style={{ color: 'var(--text-secondary)' }}>Carregando questões do ENEM...</p>
        </div>
    );

    const currentQ = questions[currentIndex];

    return (
        <div className={`battle-room ${isHit ? 'hit-shake' : ''}`}>
            <div className="battle-header">
                <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
                    <div className="timer-box" style={{ color: timeLeft < 30 ? 'var(--error)' : 'inherit' }}>
                        <Clock size={20} /> {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
                    </div>
                    <div>
                        <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>QUESTÃO</div>
                        <div style={{ fontWeight: 800 }}>{currentIndex + 1} / {questions.length}</div>
                    </div>
                </div>

                <div className="powerups-dock glass-card">
                    <button
                        className={`powerup-btn ${powerups.lupa > 0 ? '' : 'empty'} ${eliminatedOptions.length > 0 ? 'active' : ''}`}
                        onClick={() => usePowerup('lupa')}
                        title="Lupa do INEP (Elimina 2 incorretas)"
                        disabled={isAnswered || powerups.lupa <= 0}
                    >
                        <Sparkles size={18} />
                        <span>{powerups.lupa}</span>
                    </button>
                    <button
                        className={`powerup-btn ${powerups.shield > 0 ? '' : 'empty'} ${isShieldActive ? 'active' : ''}`}
                        onClick={() => usePowerup('shield')}
                        title="Escudo de Platina (Protege HP)"
                        disabled={isAnswered || powerups.shield <= 0}
                    >
                        <Shield size={18} />
                        <span>{powerups.shield}</span>
                    </button>
                    <button
                        className={`powerup-btn ${powerups.dica > 0 ? '' : 'empty'} ${showExplanationEarly ? 'active' : ''}`}
                        onClick={() => usePowerup('dica')}
                        title="Dica do Oráculo (Mostra explicação)"
                        disabled={isAnswered || powerups.dica <= 0}
                    >
                        <Lightbulb size={18} />
                        <span>{powerups.dica}</span>
                    </button>
                </div>

                <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>SCORE</div>
                    <div style={{ fontWeight: 800, color: 'var(--primary)', fontSize: '1.25rem' }}>{score.toLocaleString()} XP</div>
                </div>
            </div>

            <div className="hp-bar-container" style={{ border: isHit ? '2px solid var(--secondary)' : '1px solid var(--bg-card-border)' }}>
                <div
                    className="hp-fill"
                    style={{
                        width: `${health}%`,
                        background: health < 40 ? 'var(--secondary)' : 'linear-gradient(90deg, var(--accent), #34d399)',
                        boxShadow: `0 0 20px ${health < 40 ? 'var(--secondary)' : 'var(--accent)'}`
                    }}
                />
            </div>


            <AnimatePresence mode="wait">
                <motion.div
                    key={currentIndex}
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    className="glass-card question-box"
                >
                    <div style={{ marginBottom: '12px', display: 'flex', gap: '8px' }}>
                        <span style={{ fontSize: '0.75rem', background: 'rgba(255,255,255,0.05)', padding: '4px 10px', borderRadius: '4px', border: '1px solid var(--bg-card-border)' }}>
                            ENEM {currentQ.year}
                        </span>
                        <span style={{ fontSize: '0.75rem', background: 'rgba(255,255,255,0.05)', padding: '4px 10px', borderRadius: '4px', border: '1px solid var(--bg-card-border)' }}>
                            {currentQ.topic}
                        </span>
                        {isShieldActive && <span className="active-modifier">ESCUDO ATIVO 🛡️</span>}
                    </div>

                    <h2 style={{ fontSize: '1.25rem', lineHeight: '1.6', fontWeight: 500 }}>
                        {currentQ.statement}
                    </h2>

                    <div className="options-grid" style={{ marginTop: '32px' }}>
                        {currentQ.options.map((opt, i) => {
                            let status = '';
                            const isEliminated = eliminatedOptions.includes(i);

                            if (isAnswered) {
                                if (i === currentQ.correctOption) status = 'correct';
                                else if (i === selectedOption) status = 'wrong';
                            }

                            return (
                                <button
                                    key={i}
                                    className={`option-card ${selectedOption === i ? 'selected' : ''} ${status} ${isAnswered || isEliminated ? 'disabled' : ''} ${isEliminated ? 'eliminated' : ''}`}
                                    onClick={() => handleAnswer(i)}
                                    disabled={isAnswered || isEliminated}
                                >
                                    <div className="option-letter">{String.fromCharCode(65 + i)}</div>
                                    <span style={{ opacity: isEliminated ? 0.3 : 1 }}>{opt}</span>
                                    {status === 'correct' && <CheckCircle size={20} style={{ marginLeft: 'auto', color: 'var(--accent)' }} />}
                                    {status === 'wrong' && <XCircle size={20} style={{ marginLeft: 'auto', color: 'var(--error)' }} />}
                                    {isEliminated && <XCircle size={16} style={{ marginLeft: 'auto', color: 'rgba(255,255,255,0.2)' }} />}
                                </button>
                            );
                        })}
                    </div>
                </motion.div>
            </AnimatePresence>

            <div className="battle-footer">
                {(isAnswered || showExplanationEarly) ? (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        style={{ display: 'flex', alignItems: 'center', gap: '16px', background: 'rgba(255,255,255,0.05)', padding: '16px 24px', borderRadius: '12px', flex: 1, marginRight: '20px', border: showExplanationEarly && !isAnswered ? '1px solid var(--secondary)' : 'none' }}
                    >
                        <AlertCircle color={showExplanationEarly && !isAnswered ? 'var(--secondary)' : (selectedOption === currentQ.correctOption ? 'var(--accent)' : 'var(--error)')} />
                        <p style={{ fontSize: '0.9rem', margin: 0 }}>
                            <strong>{showExplanationEarly && !isAnswered ? 'VISÃO DO ORÁCULO:' : 'Explicação:'}</strong> {currentQ.explanation}
                        </p>
                    </motion.div>
                ) : <div style={{ flex: 1 }} />}

                <button
                    className="neon-button"
                    disabled={!isAnswered}
                    onClick={nextQuestion}
                    style={{ padding: '16px 32px' }}
                >
                    {currentIndex === questions.length - 1 ? 'FINALIZAR BATALHA' : 'PRÓXIMA QUESTÃO'} <SkipForward size={18} style={{ marginLeft: '8px' }} />
                </button>
            </div>
        </div>
    );
};

export default BattleRoom;
