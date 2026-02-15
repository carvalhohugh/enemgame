import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Trophy, TrendingUp, TrendingDown, Minus, Crown, Medal, Award } from 'lucide-react';
import { ranking } from '@/data/mockData';

const getRankIcon = (rank: number) => {
  switch (rank) {
    case 1:
      return <Crown className="w-6 h-6 text-gold" />;
    case 2:
      return <Medal className="w-6 h-6 text-gray-300" />;
    case 3:
      return <Award className="w-6 h-6 text-amber-600" />;
    default:
      return <span className="text-white/60 font-bold">#{rank}</span>;
  }
};

const getRankStyle = (rank: number) => {
  switch (rank) {
    case 1:
      return 'bg-gradient-to-r from-gold/20 via-gold/10 to-transparent border-gold/30';
    case 2:
      return 'bg-gradient-to-r from-gray-400/20 via-gray-400/10 to-transparent border-gray-400/30';
    case 3:
      return 'bg-gradient-to-r from-amber-600/20 via-amber-600/10 to-transparent border-amber-600/30';
    default:
      return 'bg-white/5 border-white/10 hover:bg-white/10';
  }
};

interface RankingRowProps {
  user: (typeof ranking)[0];
  index: number;
  isCurrentUser: boolean;
}

function RankingRow({ user, index, isCurrentUser }: RankingRowProps) {
  const rankChange = user.change;

  return (
    <motion.div
      initial={{ opacity: 0, x: -30 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
      whileHover={{ x: 10 }}
      className={`relative flex items-center gap-4 p-4 rounded-xl border transition-all duration-300 ${
        getRankStyle(user.rank)
      } ${isCurrentUser ? 'ring-2 ring-purple/50' : ''}`}
    >
      {/* Rank */}
      <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-white/5">
        {getRankIcon(user.rank)}
      </div>

      {/* Avatar */}
      <img
        src={user.avatar}
        alt={user.name}
        className="w-12 h-12 rounded-full bg-purple/20"
      />

      {/* User Info */}
      <div className="flex-grow">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-white">{user.name}</span>
          {isCurrentUser && (
            <span className="px-2 py-0.5 rounded-full bg-purple/30 text-purple-light text-xs">
              Você
            </span>
          )}
        </div>
        <div className="flex items-center gap-2 text-sm text-white/50">
          <span>Nível {user.level}</span>
          <span>•</span>
          <span>{user.xp.toLocaleString()} XP</span>
        </div>
      </div>

      {/* Rank Change */}
      <div className="flex items-center gap-1">
        {rankChange > 0 ? (
          <>
            <TrendingUp className="w-4 h-4 text-green-400" />
            <span className="text-green-400 text-sm font-medium">+{rankChange}</span>
          </>
        ) : rankChange < 0 ? (
          <>
            <TrendingDown className="w-4 h-4 text-red-400" />
            <span className="text-red-400 text-sm font-medium">{rankChange}</span>
          </>
        ) : (
          <>
            <Minus className="w-4 h-4 text-white/40" />
            <span className="text-white/40 text-sm">-</span>
          </>
        )}
      </div>
    </motion.div>
  );
}

export default function RankingSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const top3 = ranking.slice(0, 3);
  const rest = ranking.slice(3);

  return (
    <section id="ranking" className="relative py-24 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-purple/30 to-transparent" />
        <div className="absolute top-1/2 right-0 w-96 h-96 bg-purple/5 rounded-full blur-[150px]" />
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8" ref={ref}>
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
            className="inline-flex items-center gap-2 bg-purple/20 px-4 py-2 rounded-full border border-purple/30 mb-6"
          >
            <Trophy className="w-4 h-4 text-gold" />
            <span className="text-sm text-purple-light font-medium">
              Competição Saudável
            </span>
          </motion.div>

          <h2 className="font-poppins text-4xl sm:text-5xl font-bold text-white mb-4">
            Ranking dos <span className="text-gradient">Estudantes</span>
          </h2>
          <p className="text-white/60 text-lg">
            Veja sua posição e compare seu progresso com outros estudantes.
          </p>
        </motion.div>

        {/* Top 3 Podium */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex justify-center items-end gap-4 mb-12"
        >
          {/* 2nd Place */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col items-center"
          >
            <div className="relative">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-gray-300 to-gray-500 p-0.5">
                <img
                  src={top3[1]?.avatar}
                  alt={top3[1]?.name}
                  className="w-full h-full rounded-full bg-dark-surface"
                />
              </div>
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-gray-400 flex items-center justify-center text-dark font-bold text-sm">
                2
              </div>
            </div>
            <div className="mt-4 text-center">
              <p className="font-semibold text-white">{top3[1]?.name}</p>
              <p className="text-white/50 text-sm">Nv. {top3[1]?.level}</p>
            </div>
            <div className="w-24 h-24 mt-4 bg-gradient-to-t from-gray-400/20 to-transparent rounded-t-lg flex items-end justify-center pb-2">
              <Medal className="w-8 h-8 text-gray-300" />
            </div>
          </motion.div>

          {/* 1st Place */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-col items-center -mt-8"
          >
            <div className="relative">
              <div className="absolute -inset-2 bg-gradient-to-br from-gold to-amber-600 rounded-full blur-lg opacity-50" />
              <div className="relative w-28 h-28 rounded-full bg-gradient-to-br from-gold to-amber-600 p-1">
                <img
                  src={top3[0]?.avatar}
                  alt={top3[0]?.name}
                  className="w-full h-full rounded-full bg-dark-surface"
                />
              </div>
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-gold flex items-center justify-center text-dark font-bold">
                <Crown className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-6 text-center">
              <p className="font-bold text-xl text-white">{top3[0]?.name}</p>
              <p className="text-gold text-sm">Nv. {top3[0]?.level}</p>
            </div>
            <div className="w-32 h-32 mt-4 bg-gradient-to-t from-gold/20 to-transparent rounded-t-lg flex items-end justify-center pb-4">
              <Trophy className="w-10 h-10 text-gold" />
            </div>
          </motion.div>

          {/* 3rd Place */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-col items-center"
          >
            <div className="relative">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-amber-600 to-amber-800 p-0.5">
                <img
                  src={top3[2]?.avatar}
                  alt={top3[2]?.name}
                  className="w-full h-full rounded-full bg-dark-surface"
                />
              </div>
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-amber-600 flex items-center justify-center text-white font-bold text-sm">
                3
              </div>
            </div>
            <div className="mt-4 text-center">
              <p className="font-semibold text-white">{top3[2]?.name}</p>
              <p className="text-white/50 text-sm">Nv. {top3[2]?.level}</p>
            </div>
            <div className="w-24 h-16 mt-4 bg-gradient-to-t from-amber-600/20 to-transparent rounded-t-lg flex items-end justify-center pb-2">
              <Award className="w-8 h-8 text-amber-600" />
            </div>
          </motion.div>
        </motion.div>

        {/* Rest of Ranking */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="space-y-2"
        >
          {rest.map((user, index) => (
            <RankingRow
              key={user.id}
              user={user}
              index={index}
              isCurrentUser={user.name === 'Ana Beatriz'}
            />
          ))}
        </motion.div>

        {/* View Full Ranking CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="mt-8 text-center"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-6 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-purple/30 text-white transition-all"
          >
            Ver Ranking Completo
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}
