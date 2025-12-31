import React from 'react';

export interface SectionProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

export interface Particle {
  x: number;
  y: number;
  z: number;
  vx: number;
  vy: number;
  originalX: number;
  originalY: number;
}