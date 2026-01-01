import React, { useEffect, useState } from 'react';

interface AmbientBackgroundProps {
  isActive: boolean;
}

const AmbientBackground: React.FC<AmbientBackgroundProps> = ({ isActive }) => {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Parallax offset for aurora (very subtle)
  const parallaxOffset = scrollY * 0.08;

  return (
    <div
      className="fixed inset-0 pointer-events-none"
      style={{
        opacity: isActive ? 1 : 0,
        transition: 'opacity 800ms ease-out',
        zIndex: 0,
      }}
    >
      {/* Subtle vertical gradient (near-black -> slightly lighter) */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(180deg, #000000 0%, #05070A 50%, #000000 100%)',
        }}
      />

      {/* Vignette (dark corners) */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(ellipse at center, transparent 0%, rgba(0,0,0,0.6) 100%)',
        }}
      />

      {/* Ultra-faint aurora haze - Blue */}
      <div
        className="aurora-blob"
        style={{
          position: 'absolute',
          top: `${15 - parallaxOffset}%`,
          left: '10%',
          width: '700px',
          height: '700px',
          background: 'radial-gradient(circle, rgba(59, 130, 246, 0.12) 0%, rgba(59, 130, 246, 0.06) 30%, transparent 70%)',
          filter: 'blur(140px)',
          animation: 'aurora-drift-1 30s ease-in-out infinite',
        }}
      />

      {/* Ultra-faint aurora haze - Pink */}
      <div
        className="aurora-blob"
        style={{
          position: 'absolute',
          top: `${25 - parallaxOffset * 0.6}%`,
          right: '8%',
          width: '750px',
          height: '750px',
          background: 'radial-gradient(circle, rgba(236, 72, 153, 0.10) 0%, rgba(236, 72, 153, 0.05) 30%, transparent 70%)',
          filter: 'blur(140px)',
          animation: 'aurora-drift-2 35s ease-in-out infinite',
          animationDelay: '-8s',
        }}
      />

      {/* Grain/noise overlay (1-3% intensity) */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' /%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.03'/%3E%3C/svg%3E")`,
          opacity: 0.5,
          mixBlendMode: 'overlay',
        }}
      />

      {/* Inline keyframes for aurora animations */}
      <style>
        {`
          @keyframes aurora-drift-1 {
            0%, 100% { transform: translate(0, 0) scale(1); }
            25% { transform: translate(20px, -15px) scale(1.05); }
            50% { transform: translate(-15px, 20px) scale(0.98); }
            75% { transform: translate(15px, 15px) scale(1.02); }
          }

          @keyframes aurora-drift-2 {
            0%, 100% { transform: translate(0, 0) scale(1); }
            33% { transform: translate(-18px, 18px) scale(1.03); }
            66% { transform: translate(18px, -12px) scale(0.97); }
          }

          @media (prefers-reduced-motion: reduce) {
            .aurora-blob {
              animation: none !important;
            }
          }
        `}
      </style>
    </div>
  );
};

export default AmbientBackground;
