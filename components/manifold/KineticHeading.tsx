import React, { useEffect, useMemo, useRef } from 'react';

interface KineticHeadingProps {
  children: string;
  className?: string;
}

const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const KineticHeading: React.FC<KineticHeadingProps> = ({ children, className }) => {
  const refs = useRef<Array<HTMLSpanElement | null>>([]);
  const chars = useMemo(() => Array.from(children), [children]);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    let frame = 0;

    const tick = () => {
      const now = Date.now();
      refs.current.forEach((span, index) => {
        if (!span) return;
        const offset = Math.sin((now + index * 80) * 0.004) * 1.5;
        span.style.setProperty('--char-offset', `${offset.toFixed(3)}px`);
      });
      frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, []);

  if (prefersReducedMotion()) {
    return <span className={className}>{children}</span>;
  }

  return (
    <span className={`manifold-kinetic-heading ${className ?? ''}`}>
      <style>
        {`
          .manifold-kinetic-heading {
            --kinetic-hover: 1;
          }
          .manifold-kinetic-heading:hover {
            --kinetic-hover: 2;
          }
          .manifold-kinetic-heading span {
            display: inline-block;
            transform: translateY(calc(var(--char-offset, 0px) * var(--kinetic-hover)));
            transition: transform 120ms ease-out;
            will-change: transform;
          }
        `}
      </style>
      {chars.map((char, index) => (
        <span
          key={`${char}-${index}`}
          ref={(node) => {
            refs.current[index] = node;
          }}
          style={{ '--char-offset': '0px' } as React.CSSProperties}
        >
          {char === ' ' ? '\u00a0' : char}
        </span>
      ))}
    </span>
  );
};

export default KineticHeading;
