import React, { useEffect, useState, useRef } from 'react';

interface AuroraBackgroundProps {
  isActive: boolean;
}

const AuroraBackground: React.FC<AuroraBackgroundProps> = ({ isActive }) => {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Parallax offset based on scroll
  const parallaxOffset = scrollY * 0.15;

  return (
    <div
      className="fixed inset-0 pointer-events-none"
      style={{
        opacity: isActive ? 1 : 0,
        transition: 'opacity 800ms ease-out',
        zIndex: 1,
        overflow: 'hidden',
      }}
    >
      {/* DEBUG: Test if container is visible when active */}
      {isActive && (
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            background: 'red',
            color: 'white',
            padding: '20px',
            fontSize: '24px',
            zIndex: 9999,
            border: '5px solid yellow',
          }}
        >
          AURORA ACTIVE - YOU SHOULD SEE THIS
        </div>
      )}

      {/* Aurora Layer 1: Blue blob */}
      <div
        className="aurora-blob"
        style={{
          position: 'absolute',
          top: `${20 - parallaxOffset}%`,
          left: '15%',
          width: '800px',
          height: '800px',
          background: 'radial-gradient(circle, rgba(0, 181, 255, 0.8) 0%, rgba(0, 181, 255, 0.4) 30%, transparent 70%)',
          filter: 'blur(120px)',
          animation: 'aurora-drift-1 25s ease-in-out infinite',
          opacity: 1,
        }}
      />

      {/* Aurora Layer 2: Pink blob */}
      <div
        className="aurora-blob"
        style={{
          position: 'absolute',
          top: `${30 - parallaxOffset * 0.8}%`,
          right: '10%',
          width: '900px',
          height: '900px',
          background: 'radial-gradient(circle, rgba(255, 0, 159, 0.8) 0%, rgba(255, 0, 159, 0.4) 30%, transparent 70%)',
          filter: 'blur(120px)',
          animation: 'aurora-drift-2 30s ease-in-out infinite',
          animationDelay: '-5s',
          opacity: 1,
        }}
      />

      {/* Aurora Layer 3: Blue-purple blob */}
      <div
        className="aurora-blob"
        style={{
          position: 'absolute',
          top: `${50 - parallaxOffset * 1.2}%`,
          left: '40%',
          width: '750px',
          height: '750px',
          background: 'radial-gradient(circle, rgba(100, 100, 255, 0.7) 0%, rgba(100, 100, 255, 0.35) 30%, transparent 70%)',
          filter: 'blur(120px)',
          animation: 'aurora-drift-3 28s ease-in-out infinite',
          animationDelay: '-10s',
          opacity: 1,
        }}
      />

      {/* Aurora Layer 4: Yellow accent */}
      <div
        className="aurora-blob"
        style={{
          position: 'absolute',
          top: `${40 - parallaxOffset}%`,
          left: '60%',
          width: '600px',
          height: '600px',
          background: 'radial-gradient(circle, rgba(255, 220, 0, 0.4) 0%, rgba(255, 220, 0, 0.2) 30%, transparent 70%)',
          filter: 'blur(100px)',
          animation: 'aurora-drift-4 22s ease-in-out infinite',
          animationDelay: '-15s',
          opacity: 1,
        }}
      />

      {/* Noise/grain overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' /%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.05'/%3E%3C/svg%3E")`,
          opacity: 0.3,
          pointerEvents: 'none',
        }}
      />

      {/* Inline keyframes for animations */}
      <style>
        {`
          @keyframes aurora-drift-1 {
            0%, 100% { transform: translate(0, 0) scale(1); }
            25% { transform: translate(30px, -20px) scale(1.1); }
            50% { transform: translate(-20px, 30px) scale(0.95); }
            75% { transform: translate(20px, 20px) scale(1.05); }
          }

          @keyframes aurora-drift-2 {
            0%, 100% { transform: translate(0, 0) scale(1); }
            25% { transform: translate(-25px, 25px) scale(1.05); }
            50% { transform: translate(30px, -15px) scale(0.9); }
            75% { transform: translate(-15px, -25px) scale(1.1); }
          }

          @keyframes aurora-drift-3 {
            0%, 100% { transform: translate(0, 0) scale(1); }
            33% { transform: translate(20px, 30px) scale(1.08); }
            66% { transform: translate(-30px, -20px) scale(0.92); }
          }

          @keyframes aurora-drift-4 {
            0%, 100% { transform: translate(0, 0) scale(1); }
            50% { transform: translate(-20px, 20px) scale(1.15); }
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

export default AuroraBackground;
