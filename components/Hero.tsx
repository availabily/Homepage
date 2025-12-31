import React from 'react';
import { motion } from 'framer-motion';

interface HeroProps {
  theme: 'light' | 'dark';
  onRequestAccess?: () => void;
}

const Hero: React.FC<HeroProps> = ({ theme, onRequestAccess }) => {
  const isDark = theme === 'dark';

  return (
    <section className={`relative h-screen w-full overflow-hidden flex items-center justify-center transition-colors duration-500 ${isDark ? 'bg-black' : 'bg-white'}`}>

      {/* Background Gradient/Solid Fallback */}
      <div className={`absolute inset-0 z-0 transition-colors duration-500 ${isDark ? 'bg-black' : 'bg-white'}`} />

      {/* Text Overlay */}
      <div className="relative z-20 container mx-auto px-6 md:px-12 pointer-events-none">
        <div className="max-w-3xl mx-auto text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className={`text-xl font-semibold tracking-tighter mb-8 transition-colors duration-500 ${isDark ? 'text-white' : 'text-black'}`}
          >
            Insinuate
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.2, delay: 0.4, ease: "easeOut" }}
            className={`text-4xl md:text-5xl lg:text-6xl font-light tracking-tight leading-[1.1] mb-8 transition-colors duration-500 ${isDark ? 'text-white' : 'text-black'}`}
          >
            Building the next generation of AI operating systems.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.2, delay: 0.8 }}
            className="flex flex-col items-center gap-8 pointer-events-auto"
          >
            <span className={`text-sm font-medium tracking-wide uppercase text-xs transition-colors duration-500 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              Intelligence as infrastructure
            </span>

            <button 
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
              onClick={() => {
                onRequestAccess?.();
                document.getElementById('access-section')?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              Request early access
            </button>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;