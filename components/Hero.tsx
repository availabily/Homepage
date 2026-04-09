import React, { forwardRef } from 'react';
import ParticleSystem from './ParticleSystem';
import { motion } from 'framer-motion';
import logo from '../IMG_4402.jpeg';

interface HeroProps {
  theme: 'light' | 'dark';
  onRequestAccess?: () => void;
  onToggleTheme?: () => void;
}

const Hero = forwardRef<HTMLElement, HeroProps>((props, ref) => {
  const { theme, onToggleTheme } = props;
  const isDark = theme === 'dark';

  const handleScrollToCobound = (e: React.MouseEvent) => {
    e.preventDefault();
    const section = document.getElementById('cobound-platform');
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleScrollToMirror = (e: React.MouseEvent) => {
    e.preventDefault();
    const section = document.getElementById('mirror');
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleScrollToProva = (e: React.MouseEvent) => {
    e.preventDefault();
    const section = document.getElementById('prova');
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section ref={ref} className={`relative min-h-screen w-full overflow-hidden flex items-center justify-center transition-colors duration-500 ${isDark ? 'bg-black' : 'bg-white'}`} style={{ zIndex: 5 }}>

      <div className={`absolute inset-0 z-0 transition-colors duration-500 ${isDark ? 'bg-black' : 'bg-white'}`} />
      <ParticleSystem color={isDark ? '#ffffff' : '#000000'} />

      <button
        onClick={onToggleTheme}
        className={`absolute top-6 right-6 z-30 text-2xl leading-none bg-transparent border-0 cursor-pointer transition-colors duration-300 ${
          isDark ? 'text-gray-600 hover:text-gray-300' : 'text-gray-400 hover:text-gray-700'
        }`}
        aria-label="Toggle color scheme"
        title="Toggle color scheme"
      >
        ☂
      </button>

      <div className="relative z-20 container mx-auto px-6 md:px-12 py-24">
        <div className="max-w-5xl mx-auto text-center">

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="mb-6 flex justify-center"
          >
            <img
              src={logo}
              alt="Cobound logo"
              width={1024}
              height={877}
              className="h-12 md:h-14 w-auto object-contain"
              style={{ filter: isDark ? 'none' : 'invert(1)' }}
            />
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.2, delay: 0.3, ease: "easeOut" }}
            className={`text-base md:text-lg font-light tracking-wide mb-12 transition-colors duration-500 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}
          >
            The world needs AI proof. We build it.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.0, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
          >
            {/* Prova card — scrolls to #prova */}
            <button
              onClick={handleScrollToProva}
              className="hero-path-card hero-path-card--prova group text-left w-full"
              aria-label="Learn about Prova"
            >
              <div className="text-3xl mb-4">🛡️</div>
              <div className="mb-1 flex items-center gap-2">
                <span className={`text-xs font-semibold tracking-widest uppercase ${isDark ? 'text-green-400/70' : 'text-green-600/80'}`}>For Compliance</span>
                <span className="text-xs font-medium px-2 py-0.5 rounded-full border border-green-400/25 text-green-400/80 bg-green-400/[0.06]">
                  Coming Soon
                </span>
              </div>
              <h2 className={`text-xl md:text-2xl font-light tracking-tight mb-3 transition-colors duration-300 ${isDark ? 'text-white' : 'text-black'}`}>
                Prove your AI reasons correctly
              </h2>
              <p className={`text-sm leading-relaxed mb-6 transition-colors duration-300 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                Formally verified reasoning certificates for AI. Paste any chain-of-thought output, get a certificate of logical validity backed by 2,400+ Lean 4 theorems.
              </p>
              <span className="hero-path-cta hero-path-cta--prova text-sm font-medium">
                Join waitlist →
              </span>
            </button>

            {/* COBOUND card */}
            <button
              onClick={handleScrollToCobound}
              className="hero-path-card hero-path-card--cobound group text-left w-full"
              aria-label="Explore COBOUND"
            >
              <div className="text-3xl mb-4">🔧</div>
              <div className="mb-1">
                <span className={`text-xs font-semibold tracking-widest uppercase ${isDark ? 'text-blue-400/70' : 'text-blue-600/80'}`}>For My Team</span>
              </div>
              <h2 className={`text-xl md:text-2xl font-light tracking-tight mb-3 transition-colors duration-300 ${isDark ? 'text-white' : 'text-black'}`}>
                Prove your agent pipeline won't deadlock
              </h2>
              <p className={`text-sm leading-relaxed mb-6 transition-colors duration-300 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                Mathematically verified multi-agent coordination. Detect failures before deployment, backed by 2,433 Lean 4 theorems.
              </p>
              <span className="hero-path-cta hero-path-cta--cobound text-sm font-medium">
                Explore COBOUND →
              </span>
            </button>

            {/* Mirror card — scrolls to #mirror waitlist */}
            <button
              onClick={handleScrollToMirror}
              className="hero-path-card hero-path-card--mirror group text-left w-full"
              aria-label="Learn about Mirror"
            >
              <div className="text-3xl mb-4">🪞</div>
              <div className="mb-1 flex items-center gap-2">
                <span className={`text-xs font-semibold tracking-widest uppercase ${isDark ? 'text-amber-400/70' : 'text-amber-600/80'}`}>For Me</span>
                <span className="text-xs font-medium px-2 py-0.5 rounded-full border border-amber-400/25 text-amber-400/80 bg-amber-400/[0.06]">
                  Early Access
                </span>
              </div>
              <h2 className={`text-xl md:text-2xl font-light tracking-tight mb-3 transition-colors duration-300 ${isDark ? 'text-white' : 'text-black'}`}>
                See yourself clearly
              </h2>
              <p className={`text-sm leading-relaxed mb-6 transition-colors duration-300 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                AI reflection partner for personal growth. Mirror helps you understand who you are, how you show up, and who you're becoming.
              </p>
              <span className="hero-path-cta hero-path-cta--mirror text-sm font-medium">
                Join waitlist →
              </span>
            </button>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.0, delay: 1.0 }}
            className={`text-sm transition-colors duration-500 ${isDark ? 'text-gray-600' : 'text-gray-400'}`}
          >
            One company. Three ways to prove it.
          </motion.p>
        </div>
      </div>
    </section>
  );
});

Hero.displayName = 'Hero';

export default Hero;
