import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Flame, Snowflake, Sparkles,
    Shield, ArrowRight
} from 'lucide-react';
import './Diagnostic.css';

interface Question {
    id: number;
    text: string;
    options: {
        text: string;
        clan: 'ignis' | 'glacies' | 'cosmos' | 'guardioes';
        icon: React.ReactNode;
    }[];
}

const QUESTIONS: Question[] = [
    {
        id: 1,
        text: "Como você prefere iniciar um novo tema de estudo?",
        options: [
            { text: "Mergulho de cabeça e resolvo o máximo de questões rápido.", clan: 'ignis', icon: <Flame size={20} /> },
            { text: "Analiso a teoria detalhadamente antes de qualquer prática.", clan: 'glacies', icon: <Snowflake size={20} /> },
            { text: "Tento conectar o tema com outras áreas do conhecimento.", clan: 'cosmos', icon: <Sparkles size={20} /> },
            { text: "Sigo o cronograma base passo a passo, sem pular etapas.", clan: 'guardioes', icon: <Shield size={20} /> },
        ]
    },
    {
        id: 2,
        text: "O que mais te motiva durante a preparação?",
        options: [
            { text: "Superar meus recordes de acertos e subir no ranking.", clan: 'ignis', icon: <Flame size={20} /> },
            { text: "Entender a lógica complexa por trás de cada erro.", clan: 'glacies', icon: <Snowflake size={20} /> },
            { text: "A sensação de expansão mental e novas ideias.", clan: 'cosmos', icon: <Sparkles size={20} /> },
            { text: "A segurança de saber que estou construindo uma base sólida.", clan: 'guardioes', icon: <Shield size={20} /> },
        ]
    },
    {
        id: 3,
        text: "Qual seu 'poder especial' nos estudos?",
        options: [
            { text: "Velocidade e foco intenso sob pressão.", clan: 'ignis', icon: <Flame size={20} /> },
            { text: "Paciência e precisão cirúrgica na análise.", clan: 'glacies', icon: <Snowflake size={20} /> },
            { text: "Criatividade e visão ampla de longo prazo.", clan: 'cosmos', icon: <Sparkles size={20} /> },
            { text: "Consistência inabalável e disciplina diária.", clan: 'guardioes', icon: <Shield size={20} /> },
        ]
    }
];

const Diagnostic: React.FC = () => {
    const [step, setStep] = useState(0);
    const [answers, setAnswers] = useState<string[]>([]);
    const [assignedClan, setAssignedClan] = useState<string | null>(null);
    const navigate = useNavigate();

    const handleAnswer = (clan: string) => {
        const newAnswers = [...answers, clan];
        setAnswers(newAnswers);

        if (step < QUESTIONS.length - 1) {
            setStep(step + 1);
        } else {
            // Calculate assigned clan
            const counts: any = {};
            newAnswers.forEach(c => counts[c] = (counts[c] || 0) + 1);
            const winner = Object.keys(counts).reduce((a, b) => counts[a] > counts[b] ? a : b);
            setAssignedClan(winner);
        }
    };

    const finishOnboarding = () => {
        localStorage.setItem('user-clan', assignedClan || 'ignis');
        navigate('/');
    };

    return (
        <div className="diagnostic-wrapper">
            <AnimatePresence mode="wait">
                {!assignedClan ? (
                    <motion.div
                        key="quiz"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="quiz-container glass-card"
                    >
                        <div className="quiz-header">
                            <span className="step-indicator">PASSO {step + 1} DE {QUESTIONS.length}</span>
                            <h2>{QUESTIONS[step].text}</h2>
                        </div>

                        <div className="options-list">
                            {QUESTIONS[step].options.map((opt, i) => (
                                <button
                                    key={i}
                                    className="diagnostic-option"
                                    onClick={() => handleAnswer(opt.clan)}
                                >
                                    <div className="opt-icon">{opt.icon}</div>
                                    <span>{opt.text}</span>
                                </button>
                            ))}
                        </div>
                    </motion.div>
                ) : (
                    <motion.div
                        key="result"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="clan-result glass-card"
                    >
                        <div className="result-icon-glow" data-clan={assignedClan}>
                            {assignedClan === 'ignis' && <Flame size={80} />}
                            {assignedClan === 'glacies' && <Snowflake size={80} />}
                            {assignedClan === 'cosmos' && <Sparkles size={80} />}
                            {assignedClan === 'guardioes' && <Shield size={80} />}
                        </div>

                        <h1 className="text-gradient">VOCÊ É UM {assignedClan?.toUpperCase()}!</h1>
                        <p>Seu perfil de estudo combina perfeitamente com a alma desta linhagem. Prepare-se para honrar seu clã na Arena.</p>

                        <div className="clan-attributes">
                            {assignedClan === 'ignis' && <span>Velocidade • Paixão • Foco</span>}
                            {assignedClan === 'glacies' && <span>Lógica • Estratégia • Precisão</span>}
                            {assignedClan === 'cosmos' && <span>Visão • Criatividade • Conexão</span>}
                            {assignedClan === 'guardioes' && <span>Defesa • Consistência • Base</span>}
                        </div>

                        <button className="neon-button large" onClick={finishOnboarding}>
                            ENTRAR NA ARENA <ArrowRight size={20} />
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Diagnostic;
