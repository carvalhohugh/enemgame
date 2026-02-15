import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthProfile } from '@/context/AuthProfileContext';
import type { ClanId } from '@/services/ClanService';
import { Sparkles, ArrowRight, Flame, Brain, Eye, Zap } from 'lucide-react';

/* ─── 6 perguntas focadas em personalidade, estudo e ambição ─── */
const QUESTIONS = [
    {
        id: 1,
        text: 'Qual é a sua abordagem principal nos estudos?',
        icon: Brain,
        options: [
            { text: 'Persistência incansável, mesmo quando é difícil.', trait: 'fenix' },
            { text: 'Planejamento estratégico e otimização de tempo.', trait: 'lobo' },
            { text: 'Visão geral e foco nos objetivos finais.', trait: 'aguia' },
            { text: 'Domínio profundo e força de vontade absoluta.', trait: 'dragao' },
        ],
    },
    {
        id: 2,
        text: 'Como você lida com um erro em um simulado?',
        icon: Flame,
        options: [
            { text: 'Vejo como uma chance de renascer mais forte.', trait: 'fenix' },
            { text: 'Analiso friamente para não repetir.', trait: 'lobo' },
            { text: 'Ajusto minha rota e sigo em frente.', trait: 'aguia' },
            { text: 'Uso a raiva para estudar o dobro.', trait: 'dragao' },
        ],
    },
    {
        id: 3,
        text: 'O que te motiva a estudar todo dia?',
        icon: Zap,
        options: [
            { text: 'Provar que posso superar qualquer obstáculo.', trait: 'fenix' },
            { text: 'Saber que cada hora estudada é vantagem competitiva.', trait: 'lobo' },
            { text: 'Enxergar o futuro que quero construir.', trait: 'aguia' },
            { text: 'A fome de ser o melhor, sem exceção.', trait: 'dragao' },
        ],
    },
    {
        id: 4,
        text: 'Em um grupo de estudos, qual é o seu papel?',
        icon: Eye,
        options: [
            { text: 'O motivador — levanto a moral quando todos querem desistir.', trait: 'fenix' },
            { text: 'O organizador — monto cronogramas e divido tarefas.', trait: 'lobo' },
            { text: 'O mentor — explico conceitos e mostro o caminho.', trait: 'aguia' },
            { text: 'O líder — puxo o ritmo e elevo o nível de todos.', trait: 'dragao' },
        ],
    },
    {
        id: 5,
        text: 'Qual frase define melhor sua mentalidade?',
        icon: Sparkles,
        options: [
            { text: '"Caí sete vezes, levantei oito."', trait: 'fenix' },
            { text: '"Sorte é o cruzamento da preparação com a oportunidade."', trait: 'lobo' },
            { text: '"Quem tem visão, chega primeiro."', trait: 'aguia' },
            { text: '"Segundo lugar é o primeiro perdedor."', trait: 'dragao' },
        ],
    },
    {
        id: 6,
        text: 'Quando você atinge sua meta, o que sente?',
        icon: Flame,
        options: [
            { text: 'Gratidão pela jornada e pronto para a próxima.', trait: 'fenix' },
            { text: 'Satisfação de que o plano funcionou.', trait: 'lobo' },
            { text: 'Já estou de olho na meta seguinte.', trait: 'aguia' },
            { text: 'Fome de mais. Nunca é suficiente.', trait: 'dragao' },
        ],
    },
];

export default function ClanSortingForm({ onComplete }: { onComplete: () => void }) {
    const { updateClan } = useAuthProfile();
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [answers, setAnswers] = useState<Record<string, number>>({
        fenix: 0,
        lobo: 0,
        aguia: 0,
        dragao: 0,
    });
    const [isCalculating, setIsCalculating] = useState(false);
    const [selectedOption, setSelectedOption] = useState<number | null>(null);

    const handleAnswer = (trait: string, idx: number) => {
        setSelectedOption(idx);

        // Small delay for visual feedback
        setTimeout(() => {
            const newAnswers = { ...answers, [trait]: answers[trait] + 1 };
            setAnswers(newAnswers);
            setSelectedOption(null);

            if (currentQuestion < QUESTIONS.length - 1) {
                setCurrentQuestion((prev) => prev + 1);
            } else {
                finishSorting(newAnswers);
            }
        }, 400);
    };

    const finishSorting = async (finalAnswers: Record<string, number>) => {
        setIsCalculating(true);

        // Dramatic sorting delay
        await new Promise((resolve) => setTimeout(resolve, 3000));

        // Determine winner
        let maxScore = -1;
        let winner: ClanId = 'fenix';

        (Object.entries(finalAnswers) as [ClanId, number][]).forEach(([clan, score]) => {
            if (score > maxScore) {
                maxScore = score;
                winner = clan;
            } else if (score === maxScore) {
                if (Math.random() > 0.5) winner = clan;
            }
        });

        await updateClan(winner);
        setIsCalculating(false);
        onComplete();
    };

    if (isCalculating) {
        return (
            <div className="flex flex-col items-center justify-center p-12 text-center min-h-[500px]">
                <motion.div
                    className="relative"
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 2, ease: 'linear' }}
                >
                    <Sparkles className="w-20 h-20 text-purple" />
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                >
                    <h2 className="text-3xl font-bold text-white mt-8 mb-3">
                        O destino está sendo revelado...
                    </h2>
                    <p className="text-white/60 text-lg">
                        Analisando sua alma de guerreiro...
                    </p>
                </motion.div>

                {/* Progress bar animation */}
                <div className="w-64 h-2 bg-white/10 rounded-full mt-8 overflow-hidden">
                    <motion.div
                        className="h-full bg-gradient-to-r from-purple to-pink-500 rounded-full"
                        initial={{ width: '0%' }}
                        animate={{ width: '100%' }}
                        transition={{ duration: 2.8, ease: 'easeInOut' }}
                    />
                </div>
            </div>
        );
    }

    const question = QUESTIONS[currentQuestion];
    const QuestionIcon = question.icon;
    const progress = ((currentQuestion + 1) / QUESTIONS.length) * 100;

    return (
        <div className="max-w-2xl mx-auto p-6 w-full">
            {/* Header */}
            <div className="mb-10 text-center">
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="inline-flex items-center gap-2 bg-purple/20 px-4 py-2 rounded-full mb-4"
                >
                    <Sparkles className="w-4 h-4 text-purple-light" />
                    <span className="text-purple-light text-sm font-medium">Cerimônia de Seleção</span>
                </motion.div>

                <h2 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-orange-400">
                    Descubra Seu Clã
                </h2>
                <p className="text-white/50 mt-3 text-lg">
                    Responda com honestidade. Não existe resposta errada.
                </p>
            </div>

            {/* Card */}
            <div className="relative bg-white/5 backdrop-blur-md rounded-2xl p-8 border border-white/10 overflow-hidden shadow-2xl">
                {/* Progress Bar */}
                <div className="absolute top-0 left-0 h-1 bg-gradient-to-r from-purple via-pink-500 to-orange-400 transition-all duration-500" style={{ width: `${progress}%` }} />

                <AnimatePresence mode="wait">
                    <motion.div
                        key={question.id}
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -30 }}
                        transition={{ duration: 0.3 }}
                        className="space-y-6"
                    >
                        {/* Question */}
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 rounded-xl bg-purple/20 flex items-center justify-center">
                                <QuestionIcon className="w-5 h-5 text-purple-light" />
                            </div>
                            <h3 className="text-xl font-semibold text-white flex-1">{question.text}</h3>
                        </div>

                        {/* Options */}
                        <div className="space-y-3">
                            {question.options.map((option, idx) => (
                                <motion.button
                                    key={idx}
                                    onClick={() => handleAnswer(option.trait, idx)}
                                    disabled={selectedOption !== null}
                                    whileHover={{ scale: 1.01 }}
                                    whileTap={{ scale: 0.99 }}
                                    className={`w-full text-left p-4 rounded-xl border transition-all group flex items-center justify-between ${selectedOption === idx
                                            ? 'bg-purple/30 border-purple/50 scale-[1.02]'
                                            : 'bg-white/5 hover:bg-purple/15 border-white/5 hover:border-purple/30'
                                        }`}
                                >
                                    <span className={`transition-colors ${selectedOption === idx ? 'text-white font-medium' : 'text-white/80 group-hover:text-white'}`}>
                                        {option.text}
                                    </span>
                                    <ArrowRight className={`w-4 h-4 transition-all transform ${selectedOption === idx
                                            ? 'text-purple-light translate-x-0 opacity-100'
                                            : 'text-white/0 -translate-x-2 group-hover:text-white/50 group-hover:translate-x-0'
                                        }`} />
                                </motion.button>
                            ))}
                        </div>
                    </motion.div>
                </AnimatePresence>

                <div className="mt-8 flex items-center justify-between">
                    <span className="text-xs text-white/30 uppercase tracking-widest">
                        Pergunta {currentQuestion + 1} de {QUESTIONS.length}
                    </span>
                    <div className="flex gap-1">
                        {QUESTIONS.map((_, i) => (
                            <div
                                key={i}
                                className={`w-2 h-2 rounded-full transition-all ${i <= currentQuestion ? 'bg-purple' : 'bg-white/10'
                                    }`}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
