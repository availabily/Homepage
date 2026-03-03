import React from 'react';
import { FadeIn } from './FadeIn';

interface FooterProps {
  theme: 'light' | 'dark';
}

const Footer: React.FC<FooterProps> = ({ theme }) => {
  const isDark = theme === 'dark';
  
  return (
    <footer className={`w-full py-12 border-t transition-colors duration-500 ${isDark ? 'border-gray-800 bg-black' : 'border-gray-100 bg-white'}`}>
      <FadeIn>
        <div className={`container mx-auto px-6 md:px-12 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 text-xs font-medium tracking-tight transition-colors duration-500 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
          <div className="flex gap-6">
            <span className={`font-semibold ${isDark ? 'text-white' : 'text-black'}`}>COBOUND</span>
            <a href="mailto:coboundinc@gmail.com" className="hover:underline">coboundinc@gmail.com</a>
            <a href="https://github.com/coboundinc-source/cobound" target="_blank" rel="noopener noreferrer" className="hover:underline">GitHub</a>
          </div>
          <div>
            &copy; 2026 COBOUND
          </div>
        </div>
      </FadeIn>
    </footer>
  );
};

export default Footer;