import { motion } from 'framer-motion';
import { Award, Flame, Star, Target, TrendingUp } from 'lucide-react';
import { currentUser } from '@/data/mockData';

const stats = [
  {
    label: 'Nivel atual',
    value: currentUser.level,
    icon: Award,
    color: 'text-purple-light',
  },
  {
    label: 'XP total',
    value: currentUser.xp.toLocaleString('pt-BR'),
    icon: TrendingUp,
    color: 'text-gold',
  },
  {
    label: 'Sequencia',
    value: `${currentUser.streak} dias`,
    icon: Flame,
    color: 'text-orange-400',
  },
  {
    label: 'Ranking',
    value: `#${currentUser.rank}`,
    icon: Target,
    color: 'text-emerald-400',
  },
];

export default function HeroDashboard() {
  const xpProgress = Math.min(100, (currentUser.xp / currentUser.xpToNextLevel) * 100);

  return (
    <section id="dashboard" className="relative overflow-hidden pt-24 pb-16">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-purple/25 blur-3xl" />
        <div className="absolute -bottom-20 right-0 h-72 w-72 rounded-full bg-gold/20 blur-3xl" />
      </div>

      <div className="relative mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="glass rounded-3xl border border-purple/20 p-6 md:p-8"
        >
          <p className="inline-flex items-center gap-2 rounded-full border border-purple/30 bg-purple/15 px-3 py-1 text-xs font-semibold text-purple-light">
            <Star className="h-4 w-4" />
            Modulo original da plataforma
          </p>

          <h2 className="mt-4 font-poppins text-3xl font-bold text-white md:text-5xl">
            Ola, <span className="text-gradient">{currentUser.name}</span>
          </h2>
          <p className="mt-3 max-w-2xl text-white/70">
            Continue sua trilha de estudos com simulados, ranking e conquistas.
          </p>

          <div className="mt-8 rounded-2xl border border-white/10 bg-black/20 p-4">
            <div className="flex items-center justify-between gap-3 text-sm">
              <span className="text-white/70">Progresso para o proximo nivel</span>
              <span className="font-semibold text-purple-light">
                {currentUser.xp.toLocaleString('pt-BR')} / {currentUser.xpToNextLevel.toLocaleString('pt-BR')} XP
              </span>
            </div>
            <div className="mt-3 h-3 overflow-hidden rounded-full bg-dark-deeper">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${xpProgress}%` }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
                className="h-full rounded-full bg-gradient-to-r from-purple to-gold"
              />
            </div>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat, index) => {
              const Icon = stat.icon;

              return (
                <motion.article
                  key={stat.label}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.08 }}
                  className="rounded-2xl border border-white/10 bg-white/5 p-4"
                >
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-white/65">{stat.label}</p>
                    <Icon className={`h-5 w-5 ${stat.color}`} />
                  </div>
                  <p className="mt-2 font-poppins text-2xl font-bold text-white">{stat.value}</p>
                </motion.article>
              );
            })}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
