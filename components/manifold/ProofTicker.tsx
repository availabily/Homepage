import React, { useEffect, useRef } from 'react';
import { useCoherence } from './CoherenceContext';

const LINE =
  'H¹(K;ℤ) = 0  ·  2,433 theorems verified  ·  0 axioms  ·  0 sorries  ·  O(n+m) feasibility check  ·  Lean 4 + Mathlib  ·  44.2% MAS failures explained  ·';

const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const ProofTicker: React.FC = () => {
  const { coherence } = useCoherence();
  const trackRef = useRef<HTMLDivElement>(null);
  const coherenceRef = useRef(coherence);

  useEffect(() => {
    coherenceRef.current = coherence;
  }, [coherence]);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    let frame = 0;
    let frameCount = 0;
    let last = performance.now();
    let offset = 0;
    let jitter = 0;

    const tick = (now: number) => {
      const dt = (now - last) / 1000;
      last = now;
      frameCount += 1;
      offset += 30 * dt;

      const track = trackRef.current;
      if (track) {
        const loopWidth = Math.max(1, track.scrollWidth / 2);
        offset %= loopWidth;
        if (coherenceRef.current < 0.3 && frameCount % 60 === 0) {
          jitter = Math.random() > 0.5 ? 1 : -1;
        } else if (frameCount % 60 === 2) {
          jitter = 0;
        }
        track.style.transform = `translate3d(${-(offset + jitter)}px, 0, 0)`;
      }

      frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <div
      aria-hidden="true"
      style={{
        position: 'relative',
        zIndex: 10,
        width: '100%',
        height: 32,
        overflow: 'hidden',
        background: 'rgba(5,5,5,0.6)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        borderTop: '1px solid rgba(255,255,255,0.06)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
      }}
    >
      <div
        ref={trackRef}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          height: '100%',
          whiteSpace: 'nowrap',
          fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
          fontSize: 11,
          letterSpacing: '0.1em',
          color: 'rgba(255,255,255,0.55)',
          willChange: prefersReducedMotion() ? 'auto' : 'transform',
        }}
      >
        {Array.from({ length: 4 }).map((_, index) => (
          <span key={index} style={{ paddingRight: 24 }}>
            {LINE}
          </span>
        ))}
      </div>
    </div>
  );
};

export default ProofTicker;
