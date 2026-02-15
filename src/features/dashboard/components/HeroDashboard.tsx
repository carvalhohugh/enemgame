import { useEffect, useMemo, useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { TrendingUp, Target, Flame, Award, Zap, Star } from 'lucide-react';
import { useAuthProfile } from '@/context/AuthProfileContext';
import { useStudyProgress } from '@/context/StudyProgressContext';
import { Link } from 'react-router-dom';
import { SocialShare } from './SocialShare';
import { ReferralCard } from './ReferralCard';

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  subValue?: string;
  color: string;
  delay: number;
}

function StatCard({ icon, label, value, subValue, color, delay }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, rotateY: 90 }}
      animate={{ opacity: 1, rotateY: 0 }}
      transition={{ duration: 1, delay, ease: [0.19, 1, 0.22, 1] }}
      whileHover={{ scale: 1.05, y: -5 }}
      className="relative group"
    >
      <div
        className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          background: `radial-gradient(circle at center, ${color}30 0%, transparent 70%)`,
        }}
      />
      <div className="relative glass-purple rounded-2xl p-5 border border-purple/20 hover:border-purple/50 transition-all duration-300">
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center mb-3"
          style={{ backgroundColor: `${color}20` }}
        >
          <div style={{ color }}>{icon}</div>
        </div>
        <p className="text-white/60 text-sm mb-1">{label}</p>
        <p className="text-2xl font-poppins font-bold text-white">{value}</p>
        {subValue && <p className="text-white/40 text-xs mt-1">{subValue}</p>}
      </div>
    </motion.div>
  );
}

export default function HeroDashboard() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const { profile } = useAuthProfile();
  const { progress, level, currentLevelXp, xpToNextLevel, accuracy } = useStudyProgress();
  const stars = useMemo(
    () =>
      Array.from({ length: 50 }, (_, index) => {
        const seeded = (seed: number) => {
          const value = Math.sin(seed * 9999.91) * 10000;
          return value - Math.floor(value);
        };

        return {
          left: `${seeded(index + 1) * 100}%`,
          top: `${seeded(index + 101) * 100}%`,
          duration: 2 + seeded(index + 201) * 3,
          delay: seeded(index + 301) * 2,
        };
      }),
    [],
  );

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 25, stiffness: 150 };
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [8, -8]), springConfig);
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-8, 8]), springConfig);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      mouseX.set(x);
      mouseY.set(y);
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  const xpProgress = (currentLevelXp / xpToNextLevel) * 100;

  return (
    <section
      id="dashboard"
      ref={containerRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20"
    >
      {/* Top Right Actions */}
      <div className="absolute top-24 right-8 z-30 flex gap-3 hidden lg:flex">
        <Link
          to="/simulado"
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-purple/20 border border-purple/30 text-white font-semibold hover:bg-purple/40 transition-all shadow-lg shadow-purple/10"
        >
          <Zap className="w-5 h-5 text-gold" />
          <span>Desafio Diário</span>
        </Link>
        <Link
          to="/trilhas"
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-green-500/20 border border-green-500/30 text-white font-semibold hover:bg-green-500/40 transition-all shadow-lg shadow-green-500/10"
        >
          <Target className="w-5 h-5 text-green-400" />
          <span>Continuar Estudos</span>
        </Link>
      </div>

      {/* Animated Background */}
      <div className="absolute inset-0">
        {/* Gradient Orbs */}
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple/30 rounded-full blur-[120px]"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gold/20 rounded-full blur-[100px]"
        />

        {/* Stars */}
        {stars.map((star, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full"
            style={{
              left: star.left,
              top: star.top,
            }}
            animate={{
              opacity: [0.2, 1, 0.2],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: star.duration,
              repeat: Infinity,
              delay: star.delay,
            }}
          />
        ))}

        {/* Mouse-following glow */}
        <motion.div
          className="absolute w-[600px] h-[600px] rounded-full pointer-events-none"
          style={{
            background: 'radial-gradient(circle, rgba(124, 58, 237, 0.15) 0%, transparent 70%)',
            left: mousePosition.x - 300,
            top: mousePosition.y - 300,
          }}
          transition={{ type: 'spring', damping: 30, stiffness: 200 }}
        />
      </div>

      {/* Main Content */}
      <motion.div
        style={{
          rotateX,
          rotateY,
          transformStyle: 'preserve-3d',
          perspective: 1000,
        }}
        className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 w-full"
      >
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Welcome & Avatar */}
          <div className="text-center lg:text-left">
            <div className="flex items-center justify-between lg:justify-start gap-4 mb-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.1 }}
                className="inline-flex items-center gap-2 bg-purple/20 px-4 py-2 rounded-full border border-purple/30"
              >
                <Zap className="w-4 h-4 text-gold" />
                <span className="text-sm text-purple-light font-medium">
                  Bem-vindo de volta!
                </span>
              </motion.div>
              <SocialShare />
            </div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="font-poppins text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-4"
            >
              Olá,{' '}
              <span className="text-gradient">{profile.displayName}</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="text-white/60 text-lg mb-8"
            >
              Sua jornada pelo conhecimento continua. Você está indo muito bem!
            </motion.p>

            {/* XP Progress Bar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="glass rounded-2xl p-5 border border-purple/20 mb-8"
            >
              {/* ... existing XP bar code ... */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-gold" />
                  <span className="text-white font-medium">Progresso para o próximo nível</span>
                </div>
                <span className="text-purple-light font-bold">
                  {currentLevelXp.toLocaleString('pt-BR')} / {xpToNextLevel.toLocaleString('pt-BR')} XP
                </span>
              </div>
              <div className="flex flex-wrap gap-3">
                <Link
                  to="/app/simulado"
                  className="px-6 py-3 bg-white text-purple-900 font-bold rounded-xl hover:bg-white/90 transition-colors inline-grid place-content-center"
                >
                  Desafio Diário
                </Link>
                <Link
                  to="/app/trilhas"
                  className="px-6 py-3 bg-white/10 text-white font-bold rounded-xl hover:bg-white/20 transition-colors inline-grid place-content-center backdrop-blur-sm"
                >
                  Continuar Estudos
                </Link>
              </div>      <div className="h-4 bg-dark-deeper rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${xpProgress}%` }}
                  transition={{ duration: 1.5, delay: 0.5, ease: [0.19, 1, 0.22, 1] }}
                  className="h-full bg-gradient-to-r from-purple via-purple-light to-gold rounded-full relative"
                >
                  <div className="absolute inset-0 bg-white/20 animate-shimmer"
                    style={{ backgroundSize: '200% 100%' }}
                  />
                </motion.div>
              </div>
              <p className="text-white/40 text-sm mt-2">
                Faltam {(xpToNextLevel - currentLevelXp).toLocaleString('pt-BR')} XP para o nível {level + 1}
              </p>
            </motion.div>

            {/* Indique um Amigo */}
            <ReferralCard />
          </div>

          {/* Right Column - Stats Grid */}
          <div className="grid grid-cols-2 gap-4">
            <StatCard
              icon={<Award className="w-6 h-6" />}
              label="Nível Atual"
              value={level}
              subValue="Avançado"
              color="#a855f7"
              delay={0.3}
            />
            <StatCard
              icon={<TrendingUp className="w-6 h-6" />}
              label="XP Total"
              value={progress.totalXp.toLocaleString('pt-BR')}
              subValue={`${progress.totalCorrect} acertos totais`}
              color="#fbbf24"
              delay={0.4}
            />
            <StatCard
              icon={<Flame className="w-6 h-6" />}
              label="Sequência"
              value={`${progress.streak} dias`}
              subValue={`Seu recorde: ${progress.bestStreak} dias`}
              color="#f97316"
              delay={0.5}
            />
            <StatCard
              icon={<Target className="w-6 h-6" />}
              label="Desempenho"
              value={`${accuracy}%`}
              subValue={`${progress.totalAnswered} questões respondidas`}
              color="#10b981"
              delay={0.6}
            />
          </div>
        </div>


      </motion.div>
    </section>
  );
}
