import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { ArrowRight, BookOpen, CheckCircle2 } from 'lucide-react';
import { areas } from '@/data/mockData';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, rotateX: 90 },
  visible: {
    opacity: 1,
    rotateX: 0,
    transition: {
      duration: 0.6,
      ease: [0.19, 1, 0.22, 1] as const,
    },
  },
};

interface AreaCardProps {
  area: (typeof areas)[0];
  index: number;
}

function AreaCard({ area, index }: AreaCardProps) {
  return (
    <motion.div
      variants={cardVariants}
      whileHover={{ scale: 1.03, y: -8 }}
      className="group relative"
    >
      {/* Glow Effect */}
      <div
        className="absolute -inset-0.5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-lg"
        style={{ backgroundColor: area.color }}
      />

      <div className="relative glass rounded-2xl p-6 border border-white/10 group-hover:border-white/20 transition-all duration-300 h-full flex flex-col">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div
            className="w-14 h-14 rounded-xl flex items-center justify-center text-3xl"
            style={{ backgroundColor: `${area.color}20` }}
          >
            {area.icon}
          </div>
          <div
            className="px-3 py-1 rounded-full text-xs font-semibold"
            style={{ backgroundColor: `${area.color}20`, color: area.color }}
          >
            {area.completedQuests}/{area.totalQuests} questões
          </div>
        </div>

        {/* Content */}
        <h3 className="font-poppins font-bold text-xl text-white mb-2">
          {area.name}
        </h3>
        <p className="text-white/50 text-sm mb-4 flex-grow">{area.description}</p>

        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="text-white/60">Progresso</span>
            <span className="font-semibold" style={{ color: area.color }}>
              {area.progress}%
            </span>
          </div>
          <div className="h-2 bg-dark-deeper rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: `${area.progress}%` }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 0.3 + index * 0.1 }}
              className="h-full rounded-full"
              style={{ backgroundColor: area.color }}
            />
          </div>
        </div>

        {/* Action Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full py-3 rounded-xl flex items-center justify-center gap-2 font-medium transition-all duration-300"
          style={{
            backgroundColor: `${area.color}15`,
            color: area.color,
          }}
        >
          <BookOpen className="w-4 h-4" />
          <span>Continuar</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </motion.button>
      </div>
    </motion.div>
  );
}

export default function AreasSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section id="trilhas" className="relative py-24 overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-purple/30 to-transparent" />
        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-purple/30 to-transparent" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          ref={ref}
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
            <CheckCircle2 className="w-4 h-4 text-purple-light" />
            <span className="text-sm text-purple-light font-medium">
              Escolha sua trilha
            </span>
          </motion.div>

          <h2 className="font-poppins text-4xl sm:text-5xl font-bold text-white mb-4">
            Áreas do <span className="text-gradient">Conhecimento</span>
          </h2>
          <p className="text-white/60 text-lg max-w-2xl mx-auto">
            Explore as cinco áreas do ENEM e acompanhe seu progresso em cada uma delas.
          </p>
        </motion.div>

        {/* Areas Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {areas.map((area, index) => (
            <AreaCard key={area.id} area={area} index={index} />
          ))}

          {/* Coming Soon Card */}
          <motion.div
            variants={cardVariants}
            className="group relative"
          >
            <div className="relative glass rounded-2xl p-6 border border-dashed border-white/20 h-full flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 rounded-full bg-purple/10 flex items-center justify-center mb-4">
                <span className="text-3xl">🚀</span>
              </div>
              <h3 className="font-poppins font-bold text-xl text-white mb-2">
                Em Breve
              </h3>
              <p className="text-white/50 text-sm">
                Novas trilhas e desafios estão sendo preparados para você!
              </p>
            </div>
          </motion.div>
        </motion.div>

        {/* Stats Summary */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6"
        >
          {[
            { label: 'Questões Resolvidas', value: '1.247', icon: '📝' },
            { label: 'Simulados Completos', value: '23', icon: '📊' },
            { label: 'Dias de Estudo', value: '89', icon: '📅' },
            { label: 'Taxa de Acerto', value: '73%', icon: '🎯' },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.5, delay: 0.8 + index * 0.1 }}
              className="glass rounded-xl p-4 text-center border border-purple/10"
            >
              <div className="text-3xl mb-2">{stat.icon}</div>
              <div className="font-poppins font-bold text-2xl text-white mb-1">
                {stat.value}
              </div>
              <div className="text-white/50 text-sm">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
