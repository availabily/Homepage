import React, { useRef, useMemo, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

// ============================================================================
// TUNING CONSTANTS
// ============================================================================
//
// This particle system has two modes:
// 1. IDLE MODE: Particles drift slowly, respond to mouse, return to origin (hero section)
// 2. GRAVITY MODE: Particles fall with gravity + scroll coupling (triggered at Manifesto section)
//
// TUNING GUIDE:
// - Increase GRAVITY for faster falling (recommended: 300-600)
// - Adjust PARALLAX_FACTOR for stronger "follow" effect (0.15-0.35)
// - Lower GRAVITY_MODE_ALPHA for better text readability (0.15-0.35)
// - Reduce COUNT_MOBILE if experiencing performance issues on mobile
// - Adjust SCROLL_COUPLING for more/less scroll responsiveness (0.1-0.25)
//
// ============================================================================

// Number of particles
const COUNT = 1000;
const COUNT_MOBILE = 400; // Reduced density for mobile

// Idle mode (hero behavior)
const INTERACTION_RADIUS = 3;
const FORCE_MULTIPLIER = 0.05;
const RETURN_SPEED = 0.015;
const MAX_VELOCITY = 0.15;

// Gravity mode
const GRAVITY = 400; // px/s^2 downward acceleration
const SCROLL_COUPLING = 0.15; // How much scroll velocity affects particle velocity
const MAX_SCROLL_BOOST = 400; // Max additional velocity from scrolling
const HORIZONTAL_DRIFT = 0.03; // Subtle horizontal noise
const RESPAWN_BUFFER = 2; // Units above/below viewport to respawn particles
const PARALLAX_FACTOR = 0.25; // World offset follows scroll (0.15-0.35 range)
const WORLD_OFFSET_EASE = 0.08; // Smoothing for parallax effect

// Visual
const GRAVITY_MODE_ALPHA = 0.25; // Reduced opacity in gravity mode for readability
const IDLE_MODE_ALPHA = 1.0;

const NEON_COLORS = [
  '#FF0099', // Neon Pink
  '#00F0FF', // Cyan / Electric Blue
  '#FAFF00', // Neon Yellow
];

// FX Modes
enum FXMode {
  IDLE = 'IDLE',
  GRAVITY = 'GRAVITY',
}

interface ParticlesProps {
  baseColor: string;
  fxMode: FXMode;
  reducedMotion: boolean;
}

const Particles: React.FC<ParticlesProps> = ({ baseColor, fxMode, reducedMotion }) => {
  const mesh = useRef<THREE.InstancedMesh>(null);
  const { viewport, mouse } = useThree();
  const dummy = useMemo(() => new THREE.Object3D(), []);

  // Track scroll position and velocity
  const scrollRef = useRef(0);
  const lastScrollRef = useRef(0);
  const scrollVelocityRef = useRef(0);
  const lastFrameTimeRef = useRef(performance.now());

  // World offset for parallax "follow" effect
  const worldOffsetYRef = useRef(0);
  const targetWorldOffsetYRef = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      scrollRef.current = window.scrollY;
      targetWorldOffsetYRef.current = window.scrollY * PARALLAX_FACTOR;
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

  // Determine particle count based on device
  const particleCount = useMemo(() => {
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
    return isMobile ? COUNT_MOBILE : COUNT;
  }, []);

  // Initialize Particle State
  const particles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < particleCount; i++) {
      const x = (Math.random() - 0.5) * viewport.width * 2;
      const y = (Math.random() - 0.5) * viewport.height * 2;
      const z = (Math.random() - 0.5) * 15;

      const colorHex = NEON_COLORS[Math.floor(Math.random() * NEON_COLORS.length)];

      temp.push({
        x, y, z,
        ox: x, oy: y, oz: z, // Original position for IDLE mode
        vx: 0, vy: 0, vz: 0,
        rx: Math.random() * Math.PI,
        ry: Math.random() * Math.PI,
        rz: Math.random() * Math.PI,
        rsx: (Math.random() - 0.5) * 0.04,
        rsy: (Math.random() - 0.5) * 0.04,
        rsz: (Math.random() - 0.5) * 0.04,
        neonColor: new THREE.Color(colorHex),
        mix: 0, // Current mix factor (0 = baseColor, 1 = neonColor)
      });
    }
    return temp;
  }, [viewport, particleCount]);

  // Reusable color objects to prevent garbage collection in loop
  const baseColorObj = useMemo(() => new THREE.Color(baseColor), [baseColor]);
  const tempColor = useMemo(() => new THREE.Color(), []);

  // Animation Loop
  useFrame((state) => {
    if (!mesh.current) return;

    // Calculate delta time
    const now = performance.now();
    const dt = Math.min((now - lastFrameTimeRef.current) / 1000, 0.1); // Cap at 100ms
    lastFrameTimeRef.current = now;

    // Calculate scroll velocity
    const scrollDelta = scrollRef.current - lastScrollRef.current;
    scrollVelocityRef.current = scrollDelta / (dt || 0.016);
    lastScrollRef.current = scrollRef.current;

    // Ease world offset toward target (parallax effect)
    worldOffsetYRef.current += (targetWorldOffsetYRef.current - worldOffsetYRef.current) * WORLD_OFFSET_EASE;
    const worldOffsetInUnits = (worldOffsetYRef.current / viewport.height) * viewport.height / 5;

    const mouseX = (mouse.x * viewport.width) / 2;
    const mouseY = (mouse.y * viewport.height) / 2;
    const isScrolled = scrollRef.current > 10;

    let needsColorUpdate = false;
    const isGravityMode = fxMode === FXMode.GRAVITY && !reducedMotion;

    // Target alpha based on mode
    const targetAlpha = isGravityMode ? GRAVITY_MODE_ALPHA : IDLE_MODE_ALPHA;

    particles.forEach((particle, i) => {
      const dx = mouseX - particle.x;
      const dy = mouseY - particle.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (isGravityMode) {
        // ============================================================
        // GRAVITY MODE PHYSICS
        // ============================================================

        // Apply gravity
        particle.vy += (GRAVITY / viewport.height) * dt;

        // Apply scroll coupling
        const scrollBoost = Math.max(Math.min(scrollVelocityRef.current * SCROLL_COUPLING, MAX_SCROLL_BOOST), -150);
        particle.vy += (scrollBoost / viewport.height) * dt;

        // Add horizontal drift noise
        particle.vx += (Math.random() - 0.5) * HORIZONTAL_DRIFT * dt;

        // Apply damping
        particle.vx *= 0.98;
        particle.vz *= 0.98;

        // Update position
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.z += particle.vz;

        // Respawn if particle exits bottom
        const viewportBottom = (viewport.height / 2) + RESPAWN_BUFFER;
        if (particle.y > viewportBottom) {
          particle.y = -(viewport.height / 2) - RESPAWN_BUFFER;
          particle.x = (Math.random() - 0.5) * viewport.width * 2;
          particle.vy = 0;
          particle.vx = 0;
        }

        // Wrap horizontally
        const viewportEdge = (viewport.width / 2) + 1;
        if (particle.x > viewportEdge) particle.x = -viewportEdge;
        if (particle.x < -viewportEdge) particle.x = viewportEdge;

      } else {
        // ============================================================
        // IDLE MODE PHYSICS (original behavior)
        // ============================================================

        if (!reducedMotion && dist < INTERACTION_RADIUS) {
          const force = (INTERACTION_RADIUS - dist) / INTERACTION_RADIUS;
          const angle = Math.atan2(dy, dx);
          particle.vx -= Math.cos(angle) * force * FORCE_MULTIPLIER;
          particle.vy -= Math.sin(angle) * force * FORCE_MULTIPLIER;
          particle.vz += (Math.random() - 0.5) * force * 0.05;
        }

        // Gentle drift
        const driftAmount = reducedMotion ? 0.001 : 0.005;
        particle.x += (Math.random() - 0.5) * driftAmount;
        particle.y += (Math.random() - 0.5) * driftAmount;
        particle.z += (Math.random() - 0.5) * driftAmount;

        // Return to origin
        particle.vx += (particle.ox - particle.x) * RETURN_SPEED * 0.05;
        particle.vy += (particle.oy - particle.y) * RETURN_SPEED * 0.05;
        particle.vz += (particle.oz - particle.z) * RETURN_SPEED * 0.05;

        // Damping
        particle.vx *= 0.94;
        particle.vy *= 0.94;
        particle.vz *= 0.94;

        // Clamp velocity
        particle.vx = Math.max(Math.min(particle.vx, MAX_VELOCITY), -MAX_VELOCITY);
        particle.vy = Math.max(Math.min(particle.vy, MAX_VELOCITY), -MAX_VELOCITY);
        particle.vz = Math.max(Math.min(particle.vz, MAX_VELOCITY), -MAX_VELOCITY);

        // Update position
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.z += particle.vz;
      }

      // Rotation (common to both modes)
      const rotSpeed = reducedMotion ? 0.3 : 1.0;
      particle.rx += particle.rsx * rotSpeed;
      particle.ry += particle.rsy * rotSpeed;
      particle.rz += particle.rsz * rotSpeed;

      // Apply world offset for parallax (only in gravity mode)
      const renderY = isGravityMode ? particle.y - worldOffsetInUnits : particle.y;

      dummy.position.set(particle.x, renderY, particle.z);
      dummy.rotation.set(particle.rx, particle.ry, particle.rz);
      dummy.scale.set(1, 1, 1);
      dummy.updateMatrix();
      mesh.current!.setMatrixAt(i, dummy.matrix);

      // ============================================================
      // COLOR LOGIC
      // ============================================================
      const isInteracting = dist < INTERACTION_RADIUS;
      const targetMix = (isScrolled || isInteracting) ? 1.0 : 0.0;
      particle.mix += (targetMix - particle.mix) * 0.1;

      tempColor.copy(baseColorObj).lerp(particle.neonColor, particle.mix);
      mesh.current!.setColorAt(i, tempColor);
      needsColorUpdate = true;
    });

    mesh.current.instanceMatrix.needsUpdate = true;
    if (needsColorUpdate) {
      mesh.current.instanceColor!.needsUpdate = true;
    }

    // Update material opacity based on mode
    if (mesh.current.material) {
      const currentOpacity = (mesh.current.material as THREE.MeshPhysicalMaterial).opacity || 1;
      const newOpacity = currentOpacity + (targetAlpha - currentOpacity) * 0.05;
      (mesh.current.material as THREE.MeshPhysicalMaterial).opacity = newOpacity;
      (mesh.current.material as THREE.MeshPhysicalMaterial).transparent = newOpacity < 1;
    }
  });

  return (
    <instancedMesh ref={mesh} args={[geometry, material, particleCount]} />
  );
};

interface ParticleSystemProps {
  color?: string;
  fxMode?: FXMode;
}

const ParticleSystem: React.FC<ParticleSystemProps> = ({ color = "#ffffff", fxMode = FXMode.IDLE }) => {
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    // Detect prefers-reduced-motion
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setReducedMotion(e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return (
    <div className="fixed inset-0 z-0 pointer-events-none">
      <Canvas
        camera={{ position: [0, 0, 10], fov: 60 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={0.4} />
        <directionalLight position={[10, 10, 5]} intensity={1.5} color="#ffffff" />
        <directionalLight position={[-10, -10, -5]} intensity={0.5} color="#ff00ff" />
        <pointLight position={[0, 0, 0]} intensity={1.0} color="#ffffff" />

        <Particles baseColor={color} fxMode={fxMode} reducedMotion={reducedMotion} />
      </Canvas>
    </div>
  );
};

export default ParticleSystem;
export { FXMode };

// ============================================================================
// QA / TESTING CHECKLIST
// ============================================================================
//
// ✅ VISUAL VERIFICATION:
// 1. Hero section: Particles should drift gently and respond to mouse hover
// 2. Scroll to Manifesto section: Particles should begin falling downward
// 3. Continue scrolling: Particles should appear to "follow" down the page
// 4. Glassmorphic sections: Text should remain crisp and readable over particles
// 5. Theme toggle: Particles should change color (white in dark, black in light)
//
// ✅ PERFORMANCE:
// 1. Open DevTools > Performance tab, record while scrolling
// 2. Verify 60fps on desktop (should see green bars in flame chart)
// 3. Mobile: Verify smooth performance (30-60fps acceptable)
// 4. No layout thrashing (particle canvas is fixed, doesn't trigger reflow)
//
// ✅ ACCESSIBILITY:
// 1. Enable "Reduce motion" in OS settings (macOS: System Settings > Accessibility > Display)
// 2. Verify particles use reduced animation (slower drift, no gravity)
// 3. Verify scroll still works and content is readable
//
// ✅ INTERACTION:
// 1. Scroll should not be blocked by particle canvas (pointer-events: none)
// 2. Clicking links/buttons should work normally
// 3. Theme toggle button should work
//
// ✅ EDGE CASES:
// 1. Rapidly scroll up/down: Should not cause jank or particle glitches
// 2. Resize window: Particles should adapt to new viewport
// 3. Scroll back to top: Can optionally revert to IDLE mode (currently stays in GRAVITY)
//
// ============================================================================