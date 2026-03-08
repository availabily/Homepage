import React from 'react';
import { FadeIn } from './FadeIn';

interface FooterProps {
  theme: 'light' | 'dark';
}

const InstagramIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
    <circle cx="12" cy="12" r="4"/>
    <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none"/>
  </svg>
);

const LinkedinIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
    <rect x="2" y="9" width="4" height="12"/>
    <circle cx="4" cy="4" r="2"/>
  </svg>
);

const XIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
);

const Footer: React.FC<FooterProps> = ({ theme }) => {
  const isDark = theme === 'dark';
  const iconClass = `transition-colors duration-200 ${isDark ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-black'}`;

  return (
    <footer className={`relative w-full py-12 border-t transition-colors duration-500 ${isDark ? 'border-gray-800 bg-black' : 'border-gray-100 bg-white'}`} style={{ zIndex: 10 }}>
      <FadeIn>
        <div className={`container mx-auto px-6 md:px-12 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 text-xs font-medium tracking-tight transition-colors duration-500 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
          <div className="flex items-center gap-6 flex-wrap">
            <span className={`font-semibold ${isDark ? 'text-white' : 'text-black'}`}>COBOUND</span>
            <a href="https://mirror.cobound.dev" className="hover:underline">Mirror</a>
            <a href="mailto:coboundinc@gmail.com" className="hover:underline">coboundinc@gmail.com</a>
            <a href="https://github.com/coboundinc-source/cobound" target="_blank" rel="noopener noreferrer" className="hover:underline">GitHub</a>
            <a href="https://mirror.cobound.dev/privacy" className="hover:underline">Privacy</a>
          </div>
          <div className="flex items-center gap-5">
            <a href="https://www.instagram.com/cobound.ai/" target="_blank" rel="noopener noreferrer" className={iconClass} aria-label="Instagram">
              <InstagramIcon />
            </a>
            <a href="https://www.linkedin.com/company/insinuate" target="_blank" rel="noopener noreferrer" className={iconClass} aria-label="LinkedIn">
              <LinkedinIcon />
            </a>
            <a href="https://x.com/cobound_ai" target="_blank" rel="noopener noreferrer" className={iconClass} aria-label="X (Twitter)">
              <XIcon />
            </a>
            <span>&copy; 2026 COBOUND</span>
          </div>
        </div>
      </FadeIn>
    </footer>
  );
};

export default Footer;