import { useState, useRef } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { Clock, CheckCircle2, XCircle, Lightbulb, ArrowRight, RotateCcw } from 'lucide-react';
import { dailyQuestion } from '@/data/mockData';

export default function SimuladoSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);

  const handleSelectAnswer = (index: number) => {
    if (showResult) return;
    setSelectedAnswer(index);
    setTimeout(() => {
      setShowResult(true);
    }, 500);
  };

  const handleReset = () => {
    setSelectedAnswer(null);
    setShowResult(false);
    setShowExplanation(false);
  };

  const isCorrect = selectedAnswer === dailyQuestion.correctAnswer;

  return (
    <section id="simulado" className="relative py-24 overflow-hidden bg-dark-deeper/50">
      {/* Background Effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-purple/5 rounded-full blur-[150px]" />
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8" ref={ref}>
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 bg-gold/20 px-4 py-2 rounded-full border border-gold/30 mb-6"
          >
            <Clock className="w-4 h-4 text-gold" />
            <span className="text-sm text-gold font-medium">Desafio do Dia</span>
          </motion.div>

          <h2 className="font-poppins text-4xl sm:text-5xl font-bold text-white mb-4">
            Teste seus <span className="text-gradient-gold">conhecimentos</span>
          </h2>
          <p className="text-white/60 text-lg">
            Responda a questão diária e ganhe XP bônus!
          </p>
        </motion.div>

        {/* Question Card */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative"
        >
          {/* Glow Border */}
          <div className="absolute -inset-1 bg-gradient-to-r from-purple via-purple-light to-gold rounded-3xl blur-lg opacity-30" />

          <div className="relative glass rounded-3xl p-8 border border-purple/30">
            {/* Question Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 rounded-full bg-purple/20 text-purple-light text-sm font-medium">
                  {dailyQuestion.area === 'humanas' && 'Ciências Humanas'}
                  {dailyQuestion.area === 'natureza' && 'Ciências da Natureza'}
                  {dailyQuestion.area === 'linguagens' && 'Linguagens'}
                  {dailyQuestion.area === 'matematica' && 'Matemática'}
                  {dailyQuestion.area === 'redacao' && 'Redação'}
                </span>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    dailyQuestion.difficulty === 'easy'
                      ? 'bg-green-500/20 text-green-400'
                      : dailyQuestion.difficulty === 'medium'
                      ? 'bg-yellow-500/20 text-yellow-400'
                      : 'bg-red-500/20 text-red-400'
                  }`}
                >
                  {dailyQuestion.difficulty === 'easy' && 'Fácil'}
                  {dailyQuestion.difficulty === 'medium' && 'Médio'}
                  {dailyQuestion.difficulty === 'hard' && 'Difícil'}
                </span>
              </div>
              <div className="flex items-center gap-2 text-white/40">
                <Clock className="w-4 h-4" />
                <span className="text-sm">+50 XP</span>
              </div>
            </div>

            {/* Question */}
            <h3 className="font-poppins text-xl text-white mb-8 leading-relaxed">
              {dailyQuestion.question}
            </h3>

            {/* Options */}
            <div className="space-y-3">
              {dailyQuestion.options.map((option, index) => (
                <motion.button
                  key={index}
                  initial={{ opacity: 0, x: -30 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
                  onClick={() => handleSelectAnswer(index)}
                  disabled={showResult}
                  className={`w-full p-4 rounded-xl text-left transition-all duration-300 relative overflow-hidden ${
                    showResult
                      ? index === dailyQuestion.correctAnswer
                        ? 'bg-green-500/20 border-2 border-green-500'
                        : selectedAnswer === index
                        ? 'bg-red-500/20 border-2 border-red-500'
                        : 'bg-white/5 border-2 border-transparent opacity-50'
                      : selectedAnswer === index
                      ? 'bg-purple/30 border-2 border-purple'
                      : 'bg-white/5 border-2 border-transparent hover:bg-white/10 hover:border-purple/30'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <span
                      className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold text-sm ${
                        showResult
                          ? index === dailyQuestion.correctAnswer
                            ? 'bg-green-500 text-white'
                            : selectedAnswer === index
                            ? 'bg-red-500 text-white'
                            : 'bg-white/10 text-white/40'
                          : selectedAnswer === index
                          ? 'bg-purple text-white'
                          : 'bg-white/10 text-white/60'
                      }`}
                    >
                      {String.fromCharCode(65 + index)}
                    </span>
                    <span className="text-white flex-grow">{option}</span>
                    {showResult && index === dailyQuestion.correctAnswer && (
                      <CheckCircle2 className="w-6 h-6 text-green-500" />
                    )}
                    {showResult && selectedAnswer === index && index !== dailyQuestion.correctAnswer && (
                      <XCircle className="w-6 h-6 text-red-500" />
                    )}
                  </div>
                </motion.button>
              ))}
            </div>

            {/* Result */}
            <AnimatePresence>
              {showResult && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-6"
                >
                  <div
                    className={`p-4 rounded-xl mb-4 ${
                      isCorrect
                        ? 'bg-green-500/20 border border-green-500/30'
                        : 'bg-red-500/20 border border-red-500/30'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {isCorrect ? (
                        <CheckCircle2 className="w-6 h-6 text-green-500" />
                      ) : (
                        <XCircle className="w-6 h-6 text-red-500" />
                      )}
                      <span
                        className={`font-semibold ${
                          isCorrect ? 'text-green-400' : 'text-red-400'
                        }`}
                      >
                        {isCorrect
                          ? 'Parabéns! Resposta correta! +50 XP'
                          : 'Que pena! Resposta incorreta.'}
                      </span>
                    </div>
                  </div>

                  {/* Explanation Toggle */}
                  <button
                    onClick={() => setShowExplanation(!showExplanation)}
                    className="flex items-center gap-2 text-purple-light hover:text-purple transition-colors"
                  >
                    <Lightbulb className="w-5 h-5" />
                    <span>{showExplanation ? 'Ocultar explicação' : 'Ver explicação'}</span>
                    <ArrowRight
                      className={`w-4 h-4 transition-transform ${
                        showExplanation ? 'rotate-90' : ''
                      }`}
                    />
                  </button>

                  <AnimatePresence>
                    {showExplanation && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-4 p-4 bg-purple/10 rounded-xl border border-purple/20"
                      >
                        <p className="text-white/80">{dailyQuestion.explanation}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Reset Button */}
                  <motion.button
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    onClick={handleReset}
                    className="mt-6 flex items-center gap-2 px-6 py-3 bg-white/5 hover:bg-white/10 rounded-xl text-white transition-colors"
                  >
                    <RotateCcw className="w-5 h-5" />
                    <span>Tentar novamente</span>
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* More Questions CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-12 text-center"
        >
          <p className="text-white/60 mb-4">Quer mais desafios?</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="btn-primary inline-flex items-center gap-2"
          >
            <span>Iniciar Simulado Completo</span>
            <ArrowRight className="w-5 h-5" />
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}
