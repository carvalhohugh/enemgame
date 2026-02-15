import { motion } from 'framer-motion';
import { Trophy, Heart, Github, Twitter, Instagram, Mail } from 'lucide-react';

const footerLinks = {
  plataforma: [
    { name: 'Dashboard', href: '#dashboard' },
    { name: 'Trilhas de Estudo', href: '#trilhas' },
    { name: 'Simulados', href: '#simulado' },
    { name: 'Ranking', href: '#ranking' },
  ],
  recursos: [
    { name: 'Questões Comentadas', href: '#' },
    { name: 'Redação Nota 1000', href: '#' },
    { name: 'Planos de Estudo', href: '#' },
    { name: 'Estatísticas', href: '#' },
  ],
  suporte: [
    { name: 'Central de Ajuda', href: '#' },
    { name: 'Contato', href: '#' },
    { name: 'FAQ', href: '#' },
    { name: 'Feedback', href: '#' },
  ],
};

const socialLinks = [
  { icon: Twitter, href: '#', label: 'Twitter' },
  { icon: Instagram, href: '#', label: 'Instagram' },
  { icon: Github, href: '#', label: 'GitHub' },
  { icon: Mail, href: '#', label: 'Email' },
];

export default function Footer() {
  return (
    <footer className="relative pt-24 pb-8 overflow-hidden">
      {/* Wave SVG */}
      <div className="absolute top-0 left-0 w-full overflow-hidden leading-none">
        <svg
          className="relative block w-full h-16"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
        >
          <motion.path
            initial={{ d: 'M0,60 C300,90 600,30 900,60 C1200,90 1200,60 1200,60 L1200,120 L0,120 Z' }}
            animate={{
              d: [
                'M0,60 C300,90 600,30 900,60 C1200,90 1200,60 1200,60 L1200,120 L0,120 Z',
                'M0,60 C300,30 600,90 900,60 C1200,30 1200,60 1200,60 L1200,120 L0,120 Z',
                'M0,60 C300,90 600,30 900,60 C1200,90 1200,60 1200,60 L1200,120 L0,120 Z',
              ],
            }}
            transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
            fill="rgba(124, 58, 237, 0.1)"
          />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-12 mb-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <motion.a
              href="#"
              className="flex items-center gap-2 mb-4"
              whileHover={{ scale: 1.05 }}
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple to-purple-light flex items-center justify-center">
                <Trophy className="w-5 h-5 text-white" />
              </div>
              <span className="font-poppins font-bold text-xl text-white">
                ENEM<span className="text-gold">Game</span>
              </span>
            </motion.a>
            <p className="text-white/50 mb-6 max-w-sm">
              Transformando a preparação para o ENEM em uma jornada gamificada e divertida. 
              Estude, conquiste e alcance seus objetivos!
            </p>
            
            {/* Social Links */}
            <div className="flex items-center gap-3">
              {socialLinks.map((social) => (
                <motion.a
                  key={social.label}
                  href={social.href}
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-10 h-10 rounded-xl bg-white/5 hover:bg-purple/20 flex items-center justify-center text-white/50 hover:text-purple-light transition-colors"
                  aria-label={social.label}
                >
                  <social.icon className="w-5 h-5" />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="font-poppins font-semibold text-white mb-4 capitalize">
                {category}
              </h4>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.name}>
                    <a
                      href={link.href}
                      className="text-white/50 hover:text-purple-light transition-colors text-sm"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-purple/10 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-white/40 text-sm text-center md:text-left">
              © 2024 ENEM Game. Todos os direitos reservados.
            </p>
            <p className="text-white/40 text-sm flex items-center gap-1">
              Feito com <Heart className="w-4 h-4 text-red-500 fill-red-500" /> para estudantes
            </p>
            <div className="flex items-center gap-4 text-sm">
              <a href="#" className="text-white/40 hover:text-purple-light transition-colors">
                Privacidade
              </a>
              <a href="#" className="text-white/40 hover:text-purple-light transition-colors">
                Termos
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
