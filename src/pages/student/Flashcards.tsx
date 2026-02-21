import React, { useState, useEffect } from 'react';
import {
    Plus, Brain,
    RotateCcw, Check,
    Flame, Calendar, Layers
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import './Flashcards.css';

interface Flashcard {
    id: string;
    front: string;
    back: string;
    nextReview: number;
    interval: number; // in days
    easeFactor: number;
}

const Flashcards: React.FC = () => {
    const [cards, setCards] = useState<Flashcard[]>([]);
    const [isAdding, setIsAdding] = useState(false);
    const [isFlipped, setIsFlipped] = useState(false);
    const [currentCardIndex, setCurrentCardIndex] = useState(0);
    const [newFront, setNewFront] = useState('');
    const [newBack, setNewBack] = useState('');

    useEffect(() => {
        const saved = localStorage.getItem('enem_flashcards');
        if (saved) setCards(JSON.parse(saved));
    }, []);

    const saveCards = (updated: Flashcard[]) => {
        setCards(updated);
        localStorage.setItem('enem_flashcards', JSON.stringify(updated));
    };

    const handleAddCard = () => {
        if (!newFront || !newBack) return;
        const card: Flashcard = {
            id: Date.now().toString(),
            front: newFront,
            back: newBack,
            nextReview: Date.now(),
            interval: 0,
            easeFactor: 2.5
        };
        saveCards([...cards, card]);
        setNewFront('');
        setNewBack('');
        setIsAdding(false);
    };

    const handleFeedback = (difficulty: 'easy' | 'good' | 'hard') => {
        const updatedCards = [...cards];
        const card = updatedCards[currentCardIndex];

        let newInterval = card.interval === 0 ? 1 : card.interval * (difficulty === 'easy' ? 2 : difficulty === 'good' ? 1.5 : 0.5);
        card.interval = Math.max(1, Math.round(newInterval));
        card.nextReview = Date.now() + card.interval * 24 * 60 * 60 * 1000;

        saveCards(updatedCards);
        setIsFlipped(false);
        if (currentCardIndex < cards.length - 1) {
            setCurrentCardIndex(currentCardIndex + 1);
        } else {
            alert("Sessão concluída! Você revisou todos os cards de hoje.");
            setCurrentCardIndex(0);
        }
    };

    const dueCards = cards.filter(c => c.nextReview <= Date.now());

    return (
        <div className="flashcards-container">
            <header className="flashcards-header">
                <div>
                    <h1 style={{ fontSize: '2.5rem', fontWeight: 900 }}>Mestre dos <span className="text-gradient">Flashcards</span> 🧠</h1>
                    <p style={{ color: 'var(--text-secondary)' }}>Memorização ativa com repetição espaçada (SRS).</p>
                </div>
                <button className="neon-button" onClick={() => setIsAdding(true)}>
                    <Plus size={18} /> NOVO CARD
                </button>
            </header>

            <div className="flash-stats">
                <div className="glass-card f-stat">
                    <Flame color="var(--clan-ignis)" />
                    <div><small>STREAK</small><h3>7 Dias</h3></div>
                </div>
                <div className="glass-card f-stat">
                    <Calendar color="var(--primary)" />
                    <div><small>PARA HOJE</small><h3>{dueCards.length} Cards</h3></div>
                </div>
                <div className="glass-card f-stat">
                    <Layers color="#10b981" />
                    <div><small>TOTAL</small><h3>{cards.length} Cards</h3></div>
                </div>
            </div>

            <main className="study-area">
                {cards.length === 0 ? (
                    <div className="empty-state glass-card">
                        <Brain size={48} opacity={0.2} />
                        <h3>Nenhum flashcard criado</h3>
                        <p>Crie seu primeiro card para começar a memorizar!</p>
                    </div>
                ) : dueCards.length === 0 ? (
                    <div className="empty-state glass-card">
                        <Check size={48} color="#10b981" />
                        <h3>Tudo revisado!</h3>
                        <p>Você está em dia com seus estudos. Volte amanhã!</p>
                    </div>
                ) : (
                    <div className="active-session">
                        <div className="session-progress">
                            <span>Card {currentCardIndex + 1} de {dueCards.length}</span>
                            <div className="p-bar"><div className="p-fill" style={{ width: `${((currentCardIndex + 1) / dueCards.length) * 100}%` }}></div></div>
                        </div>

                        <div className={`card-scene ${isFlipped ? 'flipped' : ''}`} onClick={() => setIsFlipped(!isFlipped)}>
                            <div className="card-face card-front">
                                <small>PERGUNTA</small>
                                <h2>{dueCards[currentCardIndex].front}</h2>
                                <p className="hint">Clique para ver a resposta</p>
                            </div>
                            <div className="card-face card-back">
                                <small>RESPOSTA</small>
                                <h2>{dueCards[currentCardIndex].back}</h2>
                                <div className="feedback-hint">Como foi esse card?</div>
                            </div>
                        </div>

                        {isFlipped && (
                            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="feedback-btns">
                                <button className="f-btn hard" onClick={() => handleFeedback('hard')}><RotateCcw size={16} /> DIFÍCIL</button>
                                <button className="f-btn good" onClick={() => handleFeedback('good')}><Check size={16} /> BOM</button>
                                <button className="f-btn easy" onClick={() => handleFeedback('easy')}><Flame size={16} /> FÁCIL</button>
                            </motion.div>
                        )}
                    </div>
                )}
            </main>

            <AnimatePresence>
                {isAdding && (
                    <div className="modal-overlay">
                        <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="glass-card modal-content">
                            <h3>Criar Flashcard</h3>
                            <div className="f-group">
                                <label>Pergunta (Frente)</label>
                                <textarea placeholder="Ex: Qual a fórmula da energia cinética?" value={newFront} onChange={e => setNewFront(e.target.value)} />
                            </div>
                            <div className="f-group">
                                <label>Resposta (Verso)</label>
                                <textarea placeholder="Ex: Ec = mv²/2" value={newBack} onChange={e => setNewBack(e.target.value)} />
                            </div>
                            <div className="f-actions">
                                <button className="ghost-btn" onClick={() => setIsAdding(false)}>CANCELAR</button>
                                <button className="neon-button" onClick={handleAddCard}>CRIAR AGORA</button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Flashcards;
