import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { XCircle, RefreshCcw, ArrowRight, Target, ShieldCheck, Loader2 } from 'lucide-react';
import { QuestionService } from '../../services/QuestionService';
import type { Question } from '../../services/QuestionService';

interface StudyQuizProps {
    topic: string;
    onComplete: (success: boolean) => void;
}

const StudyQuiz: React.FC<StudyQuizProps> = ({ topic, onComplete }) => {
    const [questions, setQuestions] = useState<Question[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [selected, setSelected] = useState<number | null>(null);
    const [results, setResults] = useState<boolean[]>([]);
    const [isFinished, setIsFinished] = useState(false);

    useEffect(() => {
        const load = async () => {
            setIsLoading(true);
            try {
                const q = await QuestionService.getRandomQuiz(topic, 5);
                setQuestions(q);
            } catch (error) {
                console.error("Erro ao carregar quiz:", error);
            } finally {
                setIsLoading(false);
            }
        };
        load();
    }, [topic]);

    const handleAnswer = (index: number) => {
        if (selected !== null) return;
        setSelected(index);
        const correct = index === questions[currentIndex].correctOption;
        setResults(prev => [...prev, correct]);
    };

    const next = () => {
        if (currentIndex < questions.length - 1) {
            setCurrentIndex(currentIndex + 1);
            setSelected(null);
        } else {
            setIsFinished(true);
        }
    };

    if (isLoading) {
        return (
            <div style={{ padding: '60px', textAlign: 'center' }}>
                <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }} style={{ color: 'var(--primary)', marginBottom: '16px' }}>
                    <Loader2 size={48} />
                </motion.div>
                <p style={{ color: 'var(--text-secondary)' }}>Carregando simulação...</p>
            </div>
        );
    }

    if (isFinished) {
        const correctCount = results.filter(r => r).length;
        const passed = correctCount >= 3;

        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                style={{ textAlign: 'center', padding: '40px 0' }}
            >
                <div style={{ position: 'relative', width: '120px', height: '120px', margin: '0 auto 32px' }}>
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, duration: 10, ease: 'linear' }}
                        style={{ position: 'absolute', inset: 0, borderRadius: '50%', border: '2px dashed var(--primary-glow)' }}
                    />
                    <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '4rem' }}>
                        {passed ? '🏆' : '💀'}
                    </div>
                </div>

                <h2 style={{ fontSize: '2.5rem', marginBottom: '16px', fontWeight: 900 }}>
                    {passed ? 'DESAFIO VENCIDO!' : 'COMBATE FALHOU'}
                </h2>

                <p style={{ color: 'var(--text-secondary)', marginBottom: '32px', fontSize: '1.2rem', maxWidth: '400px', margin: '0 auto 40px' }}>
                    Você dominou <span style={{ color: 'white', fontWeight: 700 }}>{correctCount} de 5</span> conceitos essenciais de {topic}.
                    {passed ? '' : ' É necessário pelo menos 3 acertos para progredir na trilha.'}
                </p>

                <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
                    {!passed && (
                        <button className="neon-button" style={{ background: 'var(--primary-glow)' }} onClick={() => window.location.reload()}>
                            <RefreshCcw size={18} /> RECOTAR TÁTICA
                        </button>
                    )}
                    <button
                        className="neon-button"
                        style={{ background: passed ? 'var(--accent)' : 'var(--secondary)', minWidth: '200px' }}
                        onClick={() => onComplete(passed)}
                    >
                        {passed ? 'COLETAR XP' : 'RETORNAR'}
                    </button>
                </div>
            </motion.div>
        );
    }

    if (questions.length === 0) {
        return (
            <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text-secondary)' }}>
                <Target size={48} style={{ opacity: 0.2, marginBottom: '20px' }} />
                <p>O INEP ainda não liberou artefatos para este setor da trilha.</p>
                <button className="neon-button" style={{ marginTop: '24px' }} onClick={() => onComplete(false)}>VOLTAR</button>
            </div>
        );
    }

    const currentQ = questions[currentIndex];

    return (
        <div className="study-quiz">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '40px' }}>
                <div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--primary)', fontWeight: 900, letterSpacing: '2px' }}>PROTOCOLO DE FIXAÇÃO</span>
                    <div style={{ fontSize: '1.75rem', fontWeight: 900 }}>Setor {currentIndex + 1}<span style={{ opacity: 0.3 }}>/05</span></div>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                    {results.map((r, i) => (
                        <motion.div
                            key={i}
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            style={{
                                width: '32px', height: '6px', borderRadius: '3px',
                                background: r ? 'var(--accent)' : 'var(--secondary)',
                                boxShadow: r ? '0 0 10px var(--accent)' : 'none'
                            }}
                        />
                    ))}
                    {Array.from({ length: 5 - results.length }).map((_, i) => (
                        <div key={i + 10} style={{ width: '32px', height: '6px', borderRadius: '3px', background: 'rgba(255,255,255,0.05)' }} />
                    ))}
                </div>
            </div>

            <AnimatePresence mode="wait">
                <motion.div
                    key={currentIndex}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                >
                    <div className="glass-card" style={{ padding: '32px', marginBottom: '32px', borderLeft: '4px solid var(--primary)' }}>
                        <p style={{ fontSize: '1.25rem', lineHeight: '1.6', color: 'white' }}>{currentQ.statement}</p>
                    </div>

                    <div style={{ display: 'grid', gap: '12px' }}>
                        {currentQ.options.map((opt, i) => {
                            let borderColor = 'var(--bg-card-border)';
                            let background = 'rgba(255,255,255,0.02)';
                            let glow = 'none';

                            if (selected !== null) {
                                if (i === currentQ.correctOption) {
                                    borderColor = 'var(--accent)';
                                    background = 'rgba(16, 185, 129, 0.1)';
                                    glow = '0 0 15px rgba(16, 185, 129, 0.2)';
                                } else if (i === selected) {
                                    borderColor = 'var(--secondary)';
                                    background = 'rgba(244, 63, 94, 0.1)';
                                }
                            }

                            return (
                                <motion.button
                                    key={i}
                                    whileHover={selected === null ? { scale: 1.01, background: 'rgba(255,255,255,0.05)' } : {}}
                                    onClick={() => handleAnswer(i)}
                                    style={{
                                        padding: '24px',
                                        borderRadius: '16px',
                                        border: `1px solid ${borderColor}`,
                                        background: background,
                                        boxShadow: glow,
                                        color: 'white',
                                        textAlign: 'left',
                                        cursor: selected === null ? 'pointer' : 'default',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '20px',
                                        transition: 'all 0.3s ease'
                                    }}
                                >
                                    <div style={{
                                        width: '36px', height: '36px', borderRadius: '10px',
                                        background: selected === i ? 'white' : 'rgba(255,255,255,0.05)',
                                        color: selected === i ? 'black' : 'white',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem', fontWeight: 900,
                                        border: '1px solid var(--bg-card-border)'
                                    }}>
                                        {String.fromCharCode(65 + i)}
                                    </div>
                                    <span style={{ flex: 1, fontSize: '1.05rem', fontWeight: 500 }}>{opt}</span>
                                    {selected !== null && i === currentQ.correctOption && <ShieldCheck size={24} color="var(--accent)" />}
                                    {selected === i && i !== currentQ.correctOption && <XCircle size={24} color="var(--secondary)" />}
                                </motion.button>
                            );
                        })}
                    </div>
                </motion.div>
            </AnimatePresence>

            <div style={{ marginTop: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                    {selected === null ? 'Selecione a resposta correta para prosseguir.' : 'Analise o resultado e avance.'}
                </p>
                <button
                    className="neon-button"
                    disabled={selected === null || questions.length === 0}
                    onClick={next}
                    style={{ padding: '12px 32px' }}
                >
                    {currentIndex === questions.length - 1 ? 'FINALIZAR PROTOCOLO' : 'PRÓXIMO SETOR'} <ArrowRight size={18} style={{ marginLeft: '8px' }} />
                </button>
            </div>
        </div>
    );
};

export default StudyQuiz;
