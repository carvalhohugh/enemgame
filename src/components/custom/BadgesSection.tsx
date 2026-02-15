import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Lock, Unlock, Star, Award, Zap, Target } from 'lucide-react';
import { badges } from '@/data/mockData';
import { useStudyProgress } from '@/context/StudyProgressContext';

const rarityColors = {
  common: {
    bg: 'from-gray-500/20 to-gray-600/20',
    border: 'border-gray-500/30',
    text: 'text-gray-400',
    icon: 'text-gray-400',
  },
  rare: {
    bg: 'from-blue-500/20 to-blue-600/20',
    border: 'border-blue-500/30',
    text: 'text-blue-400',
    icon: 'text-blue-400',
  },
  epic: {
    bg: 'from-purple-500/20 to-purple-600/20',
    border: 'border-purple-500/30',
    text: 'text-purple-400',
    icon: 'text-purple-400',
  },
  legendary: {
    bg: 'from-gold/30 to-amber-600/30',
    border: 'border-gold/50',
    text: 'text-gold',
    icon: 'text-gold',
  },
};

const rarityLabels = {
  common: 'Comum',
  rare: 'Raro',
  epic: 'Épico',
  legendary: 'Lendário',
};

interface BadgeCardProps {
  badge: (typeof badges)[0];
  index: number;
}

function BadgeCard({ badge, index }: BadgeCardProps) {
  const colors = rarityColors[badge.rarity];

  return (
    <motion.div
      initial={{ opacity: 0, rotateY: 180 }}
      whileInView={{ opacity: 1, rotateY: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      whileHover={{ scale: 1.05, y: -5 }}
      className={`group relative ${!badge.unlocked ? 'opacity-60' : ''}`}
    >
      {/* Glow Effect for Unlocked */}
      {badge.unlocked && (
        <div
          className={`absolute -inset-1 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-lg bg-gradient-to-r ${colors.bg}`}
        />
      )}

      <div
        className={`relative glass rounded-2xl p-6 border ${colors.border} hover:border-opacity-60 transition-all duration-300 h-full flex flex-col items-center text-center`}
      >
        {/* Badge Icon */}
        <div className="relative mb-4">
          <div
            className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${colors.bg} flex items-center justify-center text-4xl`}
          >
            {badge.unlocked ? badge.icon : <Lock className="w-8 h-8 text-white/30" />}
          </div>
          
          {/* Unlocked Indicator */}
          {badge.unlocked && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3 + index * 0.1, type: 'spring' }}
              className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-green-500 flex items-center justify-center"
            >
              <Unlock className="w-3 h-3 text-white" />
            </motion.div>
          )}
        </div>

        {/* Badge Info */}
        <h3 className="font-poppins font-bold text-lg text-white mb-1">
          {badge.name}
        </h3>
        <p className="text-white/50 text-sm mb-3">{badge.description}</p>

        {/* Rarity Badge */}
        <div
          className={`mt-auto px-3 py-1 rounded-full text-xs font-medium ${colors.text} bg-white/5`}
        >
          {rarityLabels[badge.rarity]}
        </div>

        {/* Unlock Date */}
        {badge.unlocked && badge.unlockedAt && (
          <p className="text-white/30 text-xs mt-2">
            Desbloqueado em {new Date(badge.unlockedAt).toLocaleDateString('pt-BR')}
          </p>
        )}
      </div>
    </motion.div>
  );
}

export default function BadgesSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const { progress } = useStudyProgress();

  const runtimeBadges = badges.map((badge) => ({
    ...badge,
    unlocked: progress.unlockedBadges.includes(badge.id),
    unlockedAt: progress.badgeUnlockedAt[badge.id] ?? badge.unlockedAt,
  }));

  const unlockedCount = runtimeBadges.filter((badge) => badge.unlocked).length;
  const legendaryCount = runtimeBadges.filter((badge) => badge.unlocked && badge.rarity === 'legendary').length;
  const nextLockedBadge = runtimeBadges.find((badge) => !badge.unlocked);

  return (
    <section id="conquistas" className="relative py-24 overflow-hidden bg-dark-deeper/30">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-purple/30 to-transparent" />
        <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-gold/5 rounded-full blur-[150px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" ref={ref}>
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 bg-gold/20 px-4 py-2 rounded-full border border-gold/30 mb-6"
          >
            <Award className="w-4 h-4 text-gold" />
            <span className="text-sm text-gold font-medium">Suas Conquistas</span>
          </motion.div>

          <h2 className="font-poppins text-4xl sm:text-5xl font-bold text-white mb-4">
            Coleção de <span className="text-gradient-gold">Badges</span>
          </h2>
          <p className="text-white/60 text-lg max-w-2xl mx-auto">
            Complete desafios e desbloqueie badges exclusivos para mostrar seu progresso.
          </p>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12"
        >
          {[
            {
              label: 'Badges Desbloqueados',
              value: `${unlockedCount}/${runtimeBadges.length}`,
              icon: <Star className="w-5 h-5 text-gold" />,
              color: 'gold',
            },
            {
              label: 'Badges Lendários',
              value: legendaryCount,
              icon: <Award className="w-5 h-5 text-purple-light" />,
              color: 'purple',
            },
            {
              label: 'Próximo Badge',
              value: nextLockedBadge?.name ?? 'Todos liberados',
              icon: <Target className="w-5 h-5 text-green-400" />,
              color: 'green',
            },
            {
              label: 'XP Bônus',
              value: `+${(progress.totalCorrect * 5).toLocaleString('pt-BR')}`,
              icon: <Zap className="w-5 h-5 text-yellow-400" />,
              color: 'yellow',
            },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
              className="glass rounded-xl p-4 border border-purple/10"
            >
              <div className="flex items-center gap-2 mb-2">
                {stat.icon}
                <span className="text-white/60 text-sm">{stat.label}</span>
              </div>
              <p className="font-poppins font-bold text-2xl text-white">{stat.value}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Badges Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
        >
          {runtimeBadges.map((badge, index) => (
            <BadgeCard key={badge.id} badge={badge} index={index} />
          ))}
        </motion.div>

        {/* Progress to Next Badge */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-12 glass rounded-2xl p-6 border border-purple/20"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-purple/20 flex items-center justify-center text-2xl">
                {nextLockedBadge?.icon ?? '🏆'}
              </div>
              <div>
                <h4 className="font-semibold text-white">
                  Próximo: {nextLockedBadge?.name ?? 'Todos os badges liberados'}
                </h4>
                <p className="text-white/50 text-sm">
                  {nextLockedBadge?.description ?? 'Parabéns pelo desempenho completo.'}
                </p>
              </div>
            </div>
            <span className="text-purple-light font-bold">{unlockedCount}/{runtimeBadges.length}</span>
          </div>
          <div className="h-3 bg-dark-deeper rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={isInView ? { width: `${(unlockedCount / runtimeBadges.length) * 100}%` } : {}}
              transition={{ duration: 1, delay: 0.8 }}
              className="h-full bg-gradient-to-r from-purple to-purple-light rounded-full"
            />
          </div>
          <p className="text-white/40 text-sm mt-2">
            Continue respondendo questões oficiais para liberar o próximo badge.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
