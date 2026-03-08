import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import logo from '../IMG_4402.jpeg';

const MIRROR_URL = 'https://mirror.cobound.dev';

interface StickyNavProps {
  heroRef: React.RefObject<HTMLElement | null>;
}

const StickyNav: React.FC<StickyNavProps> = ({ heroRef }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const element = heroRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          // Show nav when hero is less than 10% visible
          setVisible(entry.intersectionRatio < 0.1);
        });
      },
      {
        threshold: [0, 0.1, 0.5],
        rootMargin: '0px',
      }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [heroRef]);

  const handleScrollToCobound = (e: React.MouseEvent) => {
    e.preventDefault();
    const section = document.getElementById('cobound-platform');
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.nav
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.35, ease: [0.21, 0.47, 0.32, 0.98] }}
          className="sticky-nav"
          style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100 }}
          aria-label="Site navigation"
        >
          <div className="max-w-screen-xl mx-auto px-6 md:px-12 h-full flex items-center justify-between">
            {/* Left: logo */}
            <a href="/" aria-label="COBOUND home">
              <img
                src={logo}
                alt="COBOUND"
                className="h-7 w-auto object-contain"
                style={{ filter: 'none' }}
              />
            </a>

            {/* Right: links */}
            <div className="flex items-center gap-6">
              <a
                href={MIRROR_URL}
                className="sticky-nav-link text-sm font-medium tracking-wide"
              >
                Mirror
              </a>
              <button
                onClick={handleScrollToCobound}
                className="sticky-nav-link text-sm font-medium tracking-wide bg-transparent border-0 cursor-pointer p-0"
                aria-label="Navigate to COBOUND platform section"
              >
                COBOUND
              </button>
            </div>
          </div>
        </motion.nav>
      )}
    </AnimatePresence>
  );
};

export default StickyNav;
