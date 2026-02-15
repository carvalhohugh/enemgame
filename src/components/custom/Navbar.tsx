import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, User, Flame, Trophy } from 'lucide-react';
import { useStudyProgress } from '@/context/StudyProgressContext';

const navLinks = [
  { name: 'Dashboard', href: '#dashboard' },
  { name: 'Trilhas', href: '#trilhas' },
  { name: 'Simulado', href: '#simulado' },
  { name: 'Ranking', href: '#ranking' },
  { name: 'Conquistas', href: '#conquistas' },
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { progress, level } = useStudyProgress();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, ease: [0.19, 1, 0.22, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled
            ? 'py-2'
            : 'py-4'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div
            className={`flex items-center justify-between transition-all duration-500 ${
              isScrolled
                ? 'bg-dark-surface/80 backdrop-blur-xl border border-purple/20 rounded-2xl px-6 py-3 shadow-glow'
                : 'bg-transparent px-2'
            }`}
          >
            {/* Logo */}
            <motion.a
              href="#"
              className="flex items-center gap-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple to-purple-light flex items-center justify-center">
                <Trophy className="w-5 h-5 text-white" />
              </div>
              <span className="font-poppins font-bold text-xl text-white">
                ENEM<span className="text-gold">Game</span>
              </span>
            </motion.a>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map((link, index) => (
                <motion.a
                  key={link.name}
                  href={link.href}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 + index * 0.1 }}
                  className="relative px-4 py-2 text-sm font-medium text-white/70 hover:text-white transition-colors group"
                >
                  {link.name}
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-purple to-gold group-hover:w-3/4 transition-all duration-300" />
                </motion.a>
              ))}
            </div>

            {/* User Stats & Profile */}
            <div className="hidden md:flex items-center gap-4">
              {/* Streak */}
              <motion.div
                className="flex items-center gap-2 bg-orange-500/20 px-3 py-1.5 rounded-full border border-orange-500/30"
                whileHover={{ scale: 1.05 }}
              >
                <Flame className="w-4 h-4 text-orange-400" />
                <span className="text-sm font-semibold text-orange-400">
                  {progress.streak}
                </span>
              </motion.div>

              {/* Level */}
              <motion.div
                className="flex items-center gap-2 bg-purple/20 px-3 py-1.5 rounded-full border border-purple/30"
                whileHover={{ scale: 1.05 }}
              >
                <Trophy className="w-4 h-4 text-purple-light" />
                <span className="text-sm font-semibold text-purple-light">
                  Nv. {level}
                </span>
              </motion.div>

              {/* Profile Button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 bg-gradient-to-r from-purple to-purple-light px-4 py-2 rounded-xl font-medium text-white text-sm"
              >
                <User className="w-4 h-4" />
                <span>Perfil</span>
              </motion.button>
            </div>

            {/* Mobile Menu Button */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-xl bg-purple/20 text-white"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </motion.button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-x-0 top-20 z-40 md:hidden px-4"
          >
            <div className="bg-dark-surface/95 backdrop-blur-xl border border-purple/20 rounded-2xl p-4 shadow-glow-lg">
              <div className="flex flex-col gap-2">
                {navLinks.map((link) => (
                  <a
                    key={link.name}
                    href={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="px-4 py-3 text-white/70 hover:text-white hover:bg-purple/10 rounded-xl transition-all"
                  >
                    {link.name}
                  </a>
                ))}
                <div className="border-t border-purple/20 my-2" />
                <div className="flex items-center justify-between px-4 py-2">
                  <div className="flex items-center gap-2">
                    <Flame className="w-5 h-5 text-orange-400" />
                    <span className="text-orange-400 font-semibold">
                      {progress.streak} dias
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Trophy className="w-5 h-5 text-purple-light" />
                    <span className="text-purple-light font-semibold">
                      Nv. {level}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
