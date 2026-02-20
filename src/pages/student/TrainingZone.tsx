import React, { useState } from 'react';
import {
    Zap, Target, BookOpen, Clock,
    ChevronRight, Trophy, RotateCcw,
    CheckCircle, XCircle, ArrowLeft,
    ScrollText, GraduationCap
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { QuestionService, type Question } from '../../services/QuestionService';
import { XPService } from '../../services/XPService';
import './TrainingZone.css';

type Mode = 'hub' | 'quiz' | 'simulation' | 'competency-selection';

const TrainingZone: React.FC = () => {
    const [mode, setMode] = useState<Mode>('hub');
    const [questions, setQuestions] = useState<Question[]>([]);
    const [currentIdx, setCurrentIdx] = useState(0);
    const [score, setScore] = useState(0);
    const [showResults, setShowResults] = useState(false);
    const [selectedOption, setSelectedOption] = useState<number | null>(null);
    const [isAnswered, setIsAnswered] = useState(false);
    const [timer, setTimer] = useState(0);
    const [selectedCompetency, setSelectedCompetency] = useState<string | null>(null);

    const startQuiz = async (competency?: string) => {
        const q = await QuestionService.getRandomQuiz(competency, mode === 'simulation' ? 45 : 10);
        setQuestions(q);
        setCurrentIdx(0);
        setScore(0);
        setShowResults(false);
        setMode(mode === 'simulation' ? 'simulation' : 'quiz');
        setTimer(mode === 'simulation' ? 14400 : 0); // 4 hours for simulation
    };

    const handleAnswer = (idx: number) => {
        if (isAnswered) return;
        setSelectedOption(idx);
        setIsAnswered(true);
        if (idx === questions[currentIdx].correctOption) {
            setScore(prev => prev + 1);
        }
    };

    const nextQuestion = () => {
        if (currentIdx + 1 < questions.length) {
            setCurrentIdx(prev => prev + 1);
            setSelectedOption(null);
            setIsAnswered(false);
        } else {
            const xpGained = mode === 'simulation' ? score * 50 : score * 20;
            XPService.addXP(xpGained);
            setShowResults(true);
        }
    };

    const formatTimer = (sec: number) => {
        const h = Math.floor(sec / 3600);
        const m = Math.floor((sec % 3600) / 60);
        const s = sec % 60;
        return `${h > 0 ? h.toString().padStart(2, '0') + ':' : ''}${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    const renderHub = () => (
        <div className="training-hub">
            <header className="training-header">
                <h1 style={{ fontSize: '2.5rem', fontWeight: 900 }}>Zona de <span style={{ color: 'var(--secondary)' }}>Treinamento</span> 🎯</h1>
                <p style={{ color: 'var(--text-secondary)' }}>Aperfeiçoe suas habilidades com simulados reais e testes rápidos.</p>
            </header>

            <div className="training-options-grid">
                <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="glass-card option-card primary"
                    onClick={() => startQuiz()}
                >
                    <div className="card-icon"><Zap size={32} /></div>
                    <div className="card-content">
                        <h3>Desafio Relâmpago</h3>
                        <p>10 questões aleatórias de todas as áreas para testar seu conhecimento geral.</p>
                        <span className="xp-gain">+20 XP por acerto</span>
                    </div>
                    <ChevronRight className="arrow" />
                </motion.div>

                <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="glass-card option-card alt"
                    onClick={() => { setMode('simulation'); startQuiz(); }}
                >
                    <div className="card-icon"><ScrollText size={32} /></div>
                    <div className="card-content">
                        <h3>Simulado ENEM Real</h3>
                        <p>Simulações completas baseadas em provas anteriores do INEP (2020-2024).</p>
                        <span className="xp-gain">+500 XP bônus por conclusão</span>
                    </div>
                    <ChevronRight className="arrow" />
                </motion.div>

                <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="glass-card option-card"
                    onClick={() => setMode('competency-selection')}
                >
                    <div className="card-icon"><GraduationCap size={32} /></div>
                    <div className="card-content">
                        <h3>Treino por Competência</h3>
                        <p>Escolha uma área específica para focar seus estudos intensivamente.</p>
                        <span className="xp-gain">Escolha sua matéria</span>
                    </div>
                    <ChevronRight className="arrow" />
                </motion.div>
            </div>
        </div>
    );

    const renderCompetencySelection = () => (
        <div className="competency-selection">
            <button className="back-btn" onClick={() => setMode('hub')}><ArrowLeft size={18} /> VOLTAR</button>
            <h2 style={{ fontSize: '2rem', fontWeight: 900, marginBottom: '24px' }}>Escolha a <span style={{ color: 'var(--primary)' }}>Competência</span></h2>
            <div className="comp-grid">
                {[
                    { id: 'mat', name: 'Matemática', color: 'var(--primary)' },
                    { id: 'nat', name: 'Natureza', color: 'var(--accent)' },
                    { id: 'hum', name: 'Humanas', color: 'var(--primary-glow)' },
                    { id: 'lin', name: 'Linguagens', color: 'var(--secondary)' },
                ].map(c => (
                    <motion.div
                        key={c.id}
                        whileHover={{ scale: 1.05 }}
                        className="glass-card comp-option-card"
                        style={{ '--comp-color': c.color } as any}
                        onClick={() => { setSelectedCompetency(c.id); startQuiz(c.id); }}
                    >
                        <h3>{c.name}</h3>
                        <p>Pratique questões específicas de {c.name}.</p>
                    </motion.div>
                ))}
            </div>
        </div>
    );

    const renderQuiz = () => {
        if (showResults) {
            return (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="quiz-results glass-card">
                    <Trophy size={64} color="var(--primary)" />
                    <h2>{mode === 'simulation' ? 'Simulado Concluído!' : 'Desafio Concluído!'}</h2>
                    <div className="result-stats">
                        <div className="stat">
                            <span className="val">{score}/{questions.length}</span>
                            <span className="lab">Acertos</span>
                        </div>
                        <div className="stat">
                            <span className="val">+{mode === 'simulation' ? score * 50 : score * 20}</span>
                            <span className="lab">XP Ganhos</span>
                        </div>
                    </div>
                    <div className="result-actions">
                        <button className="neon-button" onClick={() => { setMode('hub'); setShowResults(false); }}>VOLTAR AO HUB</button>
                        <button className="neon-button alt" onClick={() => startQuiz(selectedCompetency || undefined)}><RotateCcw size={18} /> TENTAR NOVAMENTE</button>
                    </div>
                </motion.div>
            );
        }

        const q = questions[currentIdx];
        if (!q) return null;

        return (
            <div className="quiz-container">
                <header className="quiz-header">
                    <div className="progress-bar">
                        <div className="fill" style={{ width: `${((currentIdx + 1) / questions.length) * 100}%` }}></div>
                    </div>
                    <span>{mode === 'simulation' ? 'SIMULADO REAL' : 'DESAFIO'} • {currentIdx + 1} de {questions.length}</span>
                </header>

                <main className="quiz-main">
                    <div className="question-box glass-card">
                        <span className="q-meta">{q.subject} • ENEM {q.year}</span>
                        <h3>{q.statement}</h3>
                    </div>

                    <div className="options-list">
                        {q.options.map((opt, i) => {
                            let status = '';
                            if (isAnswered) {
                                if (i === q.correctOption) status = 'correct';
                                else if (i === selectedOption) status = 'wrong';
                            }
                            return (
                                <button
                                    key={i}
                                    className={`option-btn glass-card ${status} ${selectedOption === i ? 'selected' : ''}`}
                                    onClick={() => handleAnswer(i)}
                                    disabled={isAnswered}
                                >
                                    <span className="opt-letter">{String.fromCharCode(65 + i)}</span>
                                    <p>{opt}</p>
                                    {status === 'correct' && <CheckCircle size={20} className="status-icon" />}
                                    {status === 'wrong' && <XCircle size={20} className="status-icon" />}
                                </button>
                            );
                        })}
                    </div>
                </main>

                <footer className="quiz-footer">
                    <div className="timer-box">
                        <Clock size={16} />
                        <span>{mode === 'simulation' ? formatTimer(timer) : '00:00'}</span>
                    </div>
                    <button
                        className="neon-button next-btn"
                        disabled={!isAnswered}
                        onClick={nextQuestion}
                    >
                        {currentIdx + 1 === questions.length ? 'FINALIZAR' : 'PRÓXIMA QUESTÃO'} <ChevronRight size={18} />
                    </button>
                </footer>
            </div>
        );
    };

    return (
        <div className="training-zone-container">
            <AnimatePresence mode="wait">
                {mode === 'hub' && <motion.div key="hub" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>{renderHub()}</motion.div>}
                {mode === 'competency-selection' && <motion.div key="comp" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>{renderCompetencySelection()}</motion.div>}
                {(mode === 'quiz' || mode === 'simulation') && <motion.div key="quiz" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>{renderQuiz()}</motion.div>}
            </AnimatePresence>
        </div>
    );
};

export default TrainingZone;
