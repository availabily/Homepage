import React, { ReactNode } from 'react';

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  trimAccent?: 'blue' | 'pink' | 'none';
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
      {/* Trim accent line (appears on left for blue, right for pink) */}
      {trimAccent === 'blue' && <div className="trim-accent-blue" />}
      {trimAccent === 'pink' && <div className="trim-accent-pink" />}

      {children}
    </div>
  );
};

export default GlassCard;
