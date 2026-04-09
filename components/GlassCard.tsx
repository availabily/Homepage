import React, { ReactNode } from 'react';

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  trimAccent?: 'blue' | 'pink' | 'green' | 'none';
}

const GlassCard: React.FC<GlassCardProps> = ({
  children,
  className = '',
  hover = false,
  trimAccent = 'none'
}) => {
  return (
    <div
      className={`glass-premium ${hover ? 'glass-premium-hover' : ''} ${className}`}
      style={{ position: 'relative' }}
    >
      {/* Trim accent line (appears on left for blue/green, right for pink) */}
      {trimAccent === 'blue' && <div className="trim-accent-blue" />}
      {trimAccent === 'pink' && <div className="trim-accent-pink" />}
      {trimAccent === 'green' && <div className="trim-accent-green" />}

      {children}
    </div>
  );
};

export default GlassCard;
