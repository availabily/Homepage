import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';

interface CoherenceContextValue {
  coherence: number;
  setCoherence: (n: number) => void;
  targetCoherence: number;
  setTargetCoherence: (n: number) => void;
}

const CoherenceContext = createContext<CoherenceContextValue | null>(null);

const clamp01 = (value: number) => Math.max(0, Math.min(1, value));

export const CoherenceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [coherence, setCoherenceState] = useState(0.05);
  const [targetCoherence, setTargetCoherenceState] = useState(0.05);
  const coherenceRef = useRef(coherence);
  const targetRef = useRef(targetCoherence);
  const velocityRef = useRef(0);

  const setCoherence = useCallback((value: number) => {
    const next = clamp01(value);
    coherenceRef.current = next;
    velocityRef.current = 0;
    setCoherenceState(next);
  }, []);

  const setTargetCoherence = useCallback((value: number) => {
    const next = clamp01(value);
    targetRef.current = next;
    setTargetCoherenceState(next);
  }, []);

  useEffect(() => {
    let frame = 0;
    let last = performance.now();
    const stiffness = 80;
    const damping = 20;

    const tick = (now: number) => {
      const dt = Math.min(0.033, (now - last) / 1000);
      last = now;

      const displacement = coherenceRef.current - targetRef.current;
      const acceleration = -stiffness * displacement - damping * velocityRef.current;
      velocityRef.current += acceleration * dt;
      coherenceRef.current = clamp01(coherenceRef.current + velocityRef.current * dt);
      setCoherenceState(coherenceRef.current);

      frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, []);

  const value = useMemo(
    () => ({ coherence, setCoherence, targetCoherence, setTargetCoherence }),
    [coherence, setCoherence, targetCoherence, setTargetCoherence]
  );

  return <CoherenceContext.Provider value={value}>{children}</CoherenceContext.Provider>;
};

export const useCoherence = () => {
  const value = useContext(CoherenceContext);
  if (!value) {
    throw new Error('useCoherence must be used inside CoherenceProvider');
  }
  return value;
};
