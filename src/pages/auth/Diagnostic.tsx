import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import { Shield, Brain, ChevronRight } from 'lucide-react';
import './Diagnostic.css';

const QUESTIONS = [
    {
        icon: <Shield size={32} />,
        title: "Como você prefere lidar com desafios?",
        options: [
            { text: "Linha de frente, gosto de liderar e resolver rápido.", clan: "fenix" },
            { text: "Planejamento tático, observando padrões e vulnerabilidades.", clan: "titas" },
            { text: "Estudo profundo antes de qualquer ação.", clan: "oraculo" },
            { text: "Uso a intuição e estratégias pouco convencionais.", clan: "eclipse" }
        ]
    },
    {
        icon: <Brain size={32} />,
        title: "Qual sua área de maior domínio?",
        options: [
            { text: "Matemática e Lógica", clan: "titas" },
            { text: "Humanas e Sociedade", clan: "fenix" },
            { text: "Ciências e Natureza", clan: "oraculo" },
            { text: "Linguagens e Expressão", clan: "eclipse" }
        ]
    }
];

const Diagnostic: React.FC = () => {
    const [step, setStep] = useState(0);
    const [points, setPoints] = useState<Record<string, number>>({ fenix: 0, titas: 0, oraculo: 0, eclipse: 0 });
    const { setClan } = useTheme();
    const navigate = useNavigate();

    const handleOption = (clan: string) => {
        setPoints(prev => ({ ...prev, [clan]: prev[clan] + 1 }));
        if (step < QUESTIONS.length - 1) {
            setStep(step + 1);
        } else {
            // Finaliza e atribui clã baseado no maior score
            const winner = Object.entries(points).reduce((a, b) => b[1] > a[1] ? b : a)[0];
            setClan(winner as any);
            navigate('/');
        }
    };

    return (
        <div className="onboarding-page">
            <div className="glass-card diagnostic-card">
                <div className="progress-bar">
                    <div className="progress-fill" style={{ width: `${((step + 1) / QUESTIONS.length) * 100}%` }} />
                </div>

                <div className="diagnostic-header">
                    {QUESTIONS[step].icon}
                    <h1>{QUESTIONS[step].title}</h1>
                </div>

                <div className="options-list">
                    {QUESTIONS[step].options.map((opt, i) => (
                        <button key={i} className="option-btn" onClick={() => handleOption(opt.clan)}>
                            {opt.text}
                            <ChevronRight size={18} />
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Diagnostic;
