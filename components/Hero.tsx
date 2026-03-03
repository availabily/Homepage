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

  return (
    <section ref={ref} className={`relative h-screen w-full overflow-hidden flex items-center justify-center transition-colors duration-500 ${isDark ? 'bg-black' : 'bg-white'}`} style={{ zIndex: 5 }}>

      {/* Background Gradient/Solid Fallback */}
      <div className={`absolute inset-0 z-0 transition-colors duration-500 ${isDark ? 'bg-black' : 'bg-white'}`} />

      {/* Particle System */}
      <ParticleSystem color={isDark ? '#ffffff' : '#000000'} />

      {/* Theme toggle button */}
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

      {/* Text Overlay */}
      <div className="relative z-20 container mx-auto px-6 md:px-12 pointer-events-none">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="mb-8 flex justify-center"
          >
            <img
              src={logo}
              alt="Cobound logo"
              className="h-12 md:h-16 w-auto object-contain"
              style={{ filter: isDark ? 'none' : 'invert(1)' }}
            />
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.2, delay: 0.4, ease: "easeOut" }}
            className={`text-4xl md:text-5xl lg:text-6xl font-light tracking-tight leading-[1.1] mb-8 transition-colors duration-500 ${isDark ? 'text-white' : 'text-black'}`}
          >
            Multi-agent AI systems fail because of their shape, not their intelligence.
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.2, delay: 0.8 }}
            className="flex flex-col items-center gap-8 pointer-events-auto"
          >
            <span className={`text-sm font-medium tracking-wide uppercase text-xs transition-colors duration-500 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              The topology of coordination
            </span>

            <div className="flex gap-4">
              <a
                href="https://github.com/coboundinc-source/cobound"
                target="_blank"
                rel="noopener noreferrer"
                className={`
                  group relative px-6 py-3
                  border bg-transparent
                  text-sm font-medium tracking-tight
                  transition-all duration-300 ease-out
                  active:scale-[0.98]
                  ${isDark
                    ? 'border-gray-700 text-white hover:border-gray-500 hover:bg-gray-900'
                    : 'border-gray-300 text-black hover:border-gray-900 hover:bg-gray-50'
                  }
                `}
              >
                View the Code
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
});

Hero.displayName = 'Hero';

export default Hero;
