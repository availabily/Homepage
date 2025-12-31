import React, { useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

// Number of particles
const COUNT = 1000;
const INTERACTION_RADIUS = 3;
const FORCE_MULTIPLIER = 0.05;
const RETURN_SPEED = 0.015;
const MAX_VELOCITY = 0.15;

const NEON_COLORS = [
  '#FF0099', // Neon Pink
  '#00F0FF', // Cyan / Electric Blue
  '#FAFF00', // Neon Yellow
];

interface ParticlesProps {
  baseColor: string; 
}

const Particles: React.FC<ParticlesProps> = ({ baseColor }) => {
  const mesh = useRef<THREE.InstancedMesh>(null);
  const { viewport, mouse } = useThree();
  const dummy = useMemo(() => new THREE.Object3D(), []);
  
  // Track scroll position for color transition
  const scrollRef = useRef(0);
  useEffect(() => {
    const handleScroll = () => {
      scrollRef.current = window.scrollY;
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Standard 3D Geometry
  const geometry = useMemo(() => new THREE.OctahedronGeometry(0.04, 0), []);

  // Physical Material for glossy look
  const material = useMemo(() => new THREE.MeshPhysicalMaterial({
    roughness: 0.15,
    metalness: 0.1, // Lower metalness to allow the white base color to show through brightly
    clearcoat: 1.0, // Adds the "gloss" layer
    clearcoatRoughness: 0.1, // Sharp reflections on the gloss layer
    flatShading: true,
  }), []);

  // Initialize Particle State
  const particles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < COUNT; i++) {
      const x = (Math.random() - 0.5) * viewport.width * 2;
      const y = (Math.random() - 0.5) * viewport.height * 2;
      const z = (Math.random() - 0.5) * 15; 
      
      const colorHex = NEON_COLORS[Math.floor(Math.random() * NEON_COLORS.length)];
      
      temp.push({
        x, y, z,
        ox: x, oy: y, oz: z,
        vx: 0, vy: 0, vz: 0,
        rx: Math.random() * Math.PI,
        ry: Math.random() * Math.PI,
        rz: Math.random() * Math.PI,
        rsx: (Math.random() - 0.5) * 0.04,
        rsy: (Math.random() - 0.5) * 0.04,
        rsz: (Math.random() - 0.5) * 0.04,
        neonColor: new THREE.Color(colorHex), // Store the target neon color
        mix: 0, // Current mix factor (0 = baseColor, 1 = neonColor)
      });
    }
    return temp;
  }, [viewport]);

  // Reusable color objects to prevent garbage collection in loop
  const baseColorObj = useMemo(() => new THREE.Color(baseColor), [baseColor]);
  const tempColor = useMemo(() => new THREE.Color(), []);

  // Animation Loop
  useFrame((state) => {
    if (!mesh.current) return;

    const mouseX = (mouse.x * viewport.width) / 2;
    const mouseY = (mouse.y * viewport.height) / 2;
    const isScrolled = scrollRef.current > 10; // Trigger color if scrolled slightly

    let needsColorUpdate = false;

    particles.forEach((particle, i) => {
      // --- Physics ---
      const dx = mouseX - particle.x;
      const dy = mouseY - particle.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < INTERACTION_RADIUS) {
        const force = (INTERACTION_RADIUS - dist) / INTERACTION_RADIUS;
        const angle = Math.atan2(dy, dx);
        particle.vx -= Math.cos(angle) * force * FORCE_MULTIPLIER;
        particle.vy -= Math.sin(angle) * force * FORCE_MULTIPLIER;
        particle.vz += (Math.random() - 0.5) * force * 0.05;
      }

      particle.x += (Math.random() - 0.5) * 0.005;
      particle.y += (Math.random() - 0.5) * 0.005;
      particle.z += (Math.random() - 0.5) * 0.005;
      
      particle.vx += (particle.ox - particle.x) * RETURN_SPEED * 0.05;
      particle.vy += (particle.oy - particle.y) * RETURN_SPEED * 0.05;
      particle.vz += (particle.oz - particle.z) * RETURN_SPEED * 0.05;
      
      particle.vx *= 0.94;
      particle.vy *= 0.94;
      particle.vz *= 0.94;

      particle.vx = Math.max(Math.min(particle.vx, MAX_VELOCITY), -MAX_VELOCITY);
      particle.vy = Math.max(Math.min(particle.vy, MAX_VELOCITY), -MAX_VELOCITY);
      particle.vz = Math.max(Math.min(particle.vz, MAX_VELOCITY), -MAX_VELOCITY);

      particle.x += particle.vx;
      particle.y += particle.vy;
      particle.z += particle.vz;

      particle.rx += particle.rsx;
      particle.ry += particle.rsy;
      particle.rz += particle.rsz;

      dummy.position.set(particle.x, particle.y, particle.z);
      dummy.rotation.set(particle.rx, particle.ry, particle.rz);
      dummy.scale.set(1, 1, 1);
      dummy.updateMatrix();
      mesh.current!.setMatrixAt(i, dummy.matrix);

      // --- Color Logic ---
      const isInteracting = dist < INTERACTION_RADIUS;
      
      // Target mix: 1 if active (scroll or hover), 0 if idle
      const targetMix = (isScrolled || isInteracting) ? 1.0 : 0.0;
      
      // Smoothly interpolate mix factor
      // Note: '0.1' is the speed of color transition
      particle.mix += (targetMix - particle.mix) * 0.1;

      // Only update color if mix is significant or changing
      // (Optimization: we could skip if mix is stable at 0 or 1, but for simplicity we update all)
      tempColor.copy(baseColorObj).lerp(particle.neonColor, particle.mix);
      mesh.current!.setColorAt(i, tempColor);
      needsColorUpdate = true;
    });

    mesh.current.instanceMatrix.needsUpdate = true;
    if (needsColorUpdate) {
      mesh.current.instanceColor!.needsUpdate = true;
    }
  });

  return (
    <instancedMesh ref={mesh} args={[geometry, material, COUNT]} />
  );
};

interface ParticleSystemProps {
  color?: string;
}

const ParticleSystem: React.FC<ParticleSystemProps> = ({ color = "#ffffff" }) => {
  return (
    <div className="absolute inset-0 z-10 pointer-events-auto">
      <Canvas
        camera={{ position: [0, 0, 10], fov: 60 }}
        dpr={[1, 2]} 
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={0.4} />
        <directionalLight position={[10, 10, 5]} intensity={1.5} color="#ffffff" />
        <directionalLight position={[-10, -10, -5]} intensity={0.5} color="#ff00ff" />
        <pointLight position={[0, 0, 0]} intensity={1.0} color="#ffffff" />
        
        <Particles baseColor={color} />
      </Canvas>
    </div>
  );
};

export default ParticleSystem;