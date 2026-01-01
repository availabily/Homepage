import React, { useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// ============================================================================
// TUNING CONSTANTS
// ============================================================================
//
// AURORA INK GLOW CONFIGURATION
// Adjust these values to fine-tune the visual effect
//
// BLOB SETTINGS:
// - blobCount: Number of color blobs (3-6 recommended)
// - blobSpeed: Animation speed multiplier (0.1-0.5)
// - blobScale: Size of individual blobs (1.0-3.0)
//
// COLOR SETTINGS:
// - blueWeight: Prominence of neon blue (0.0-1.0)
// - pinkWeight: Prominence of neon pink (0.0-1.0)
// - yellowWeight: Prominence of yellow accent (0.05-0.15)
// - baseAlpha: Overall opacity (0.10-0.25)
//
// VISUAL EFFECTS:
// - grainIntensity: Film grain strength (0.01-0.05)
// - blurAmount: Softness of blobs (higher = softer)
//
// ============================================================================

const CONFIG = {
  blobCount: 5,
  blobSpeed: 0.15,
  blobScale: 2.0,
  blueWeight: 0.6,
  pinkWeight: 0.5,
  yellowWeight: 0.08,
  baseAlpha: 0.18,
  grainIntensity: 0.025,
  blurAmount: 1.8,
  scrollParallaxStrength: 0.15,
};

// Simplex noise function (compact version for shader)
const noiseShaderChunk = `
// Simplex 2D noise
vec3 permute(vec3 x) { return mod(((x*34.0)+1.0)*x, 289.0); }

float snoise(vec2 v) {
  const vec4 C = vec4(0.211324865405187, 0.366025403784439,
           -0.577350269189626, 0.024390243902439);
  vec2 i  = floor(v + dot(v, C.yy) );
  vec2 x0 = v -   i + dot(i, C.xx);
  vec2 i1;
  i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod(i, 289.0);
  vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
  + i.x + vec3(0.0, i1.x, 1.0 ));
  vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy),
    dot(x12.zw,x12.zw)), 0.0);
  m = m*m ;
  m = m*m ;
  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
  vec3 g;
  g.x  = a0.x  * x0.x  + h.x  * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}

// FBM (Fractal Brownian Motion) for organic cloud shapes
float fbm(vec2 p) {
  float value = 0.0;
  float amplitude = 0.5;
  float frequency = 1.0;
  for(int i = 0; i < 4; i++) {
    value += amplitude * snoise(p * frequency);
    frequency *= 2.0;
    amplitude *= 0.5;
  }
  return value;
}

// Film grain noise
float hash(vec2 p) {
  return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
}

float grain(vec2 uv, float time) {
  vec2 seed = uv * time;
  return hash(seed) * 2.0 - 1.0;
}
`;

interface AuroraShaderProps {
  time: number;
  scrollOffset: number;
  reducedMotion: boolean;
  isActive: boolean;
}

const AuroraShader: React.FC<AuroraShaderProps> = ({ time, scrollOffset, reducedMotion, isActive }) => {
  const meshRef = useRef<THREE.Mesh>(null);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uScrollOffset: { value: 0 },
      uResolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
      uBlobCount: { value: CONFIG.blobCount },
      uBlobSpeed: { value: reducedMotion ? 0 : CONFIG.blobSpeed },
      uBlobScale: { value: CONFIG.blobScale },
      uBlueWeight: { value: CONFIG.blueWeight },
      uPinkWeight: { value: CONFIG.pinkWeight },
      uYellowWeight: { value: CONFIG.yellowWeight },
      uBaseAlpha: { value: isActive ? CONFIG.baseAlpha : 0 },
      uGrainIntensity: { value: CONFIG.grainIntensity },
      uBlurAmount: { value: CONFIG.blurAmount },
      uScrollParallax: { value: CONFIG.scrollParallaxStrength },
    }),
    [reducedMotion, isActive]
  );

  useFrame(() => {
    if (!meshRef.current) return;
    const material = meshRef.current.material as THREE.ShaderMaterial;

    // Smooth alpha transition
    const targetAlpha = isActive ? CONFIG.baseAlpha : 0;
    const currentAlpha = material.uniforms.uBaseAlpha.value;
    material.uniforms.uBaseAlpha.value += (targetAlpha - currentAlpha) * 0.02;

    material.uniforms.uTime.value = time;
    material.uniforms.uScrollOffset.value = scrollOffset;
  });

  useEffect(() => {
    const handleResize = () => {
      if (!meshRef.current) return;
      const material = meshRef.current.material as THREE.ShaderMaterial;
      material.uniforms.uResolution.value.set(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const vertexShader = `
    varying vec2 vUv;

    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `;

  const fragmentShader = `
    ${noiseShaderChunk}

    uniform float uTime;
    uniform float uScrollOffset;
    uniform vec2 uResolution;
    uniform float uBlobCount;
    uniform float uBlobSpeed;
    uniform float uBlobScale;
    uniform float uBlueWeight;
    uniform float uPinkWeight;
    uniform float uYellowWeight;
    uniform float uBaseAlpha;
    uniform float uGrainIntensity;
    uniform float uBlurAmount;
    uniform float uScrollParallax;

    varying vec2 vUv;

    void main() {
      // Normalized coordinates
      vec2 uv = vUv;
      vec2 p = (uv - 0.5) * 2.0;
      p.x *= uResolution.x / uResolution.y;

      // Apply subtle parallax from scroll
      p.y += uScrollOffset * uScrollParallax;

      // Create multiple drifting blobs using FBM
      float blobField = 0.0;

      for(float i = 0.0; i < 6.0; i++) {
        if(i >= uBlobCount) break;

        // Each blob has its own drift pattern
        float angle = i * 2.0 + uTime * uBlobSpeed * 0.3;
        vec2 offset = vec2(
          cos(angle * 0.7) * 0.4 + cos(angle * 1.3) * 0.2,
          sin(angle * 0.5) * 0.4 + sin(angle * 1.1) * 0.2
        );

        vec2 blobPos = p - offset * uBlobScale;
        float dist = length(blobPos);

        // Use FBM to create organic cloud-like shapes
        float noise = fbm(blobPos * 0.8 + uTime * uBlobSpeed * 0.05);
        float blob = smoothstep(1.5, 0.0, dist + noise * 0.5) * uBlurAmount;

        blobField += blob;
      }

      // Clamp and soften the blob field
      blobField = clamp(blobField, 0.0, 1.0);
      blobField = pow(blobField, 1.5); // Soften further

      // Color palette mixing
      vec3 blue = vec3(0.0, 0.71, 1.0);   // Neon blue
      vec3 pink = vec3(1.0, 0.0, 0.63);   // Neon pink
      vec3 yellow = vec3(1.0, 0.86, 0.0); // Neon yellow

      // Create color variation using noise
      float colorNoise = fbm(p * 0.5 + uTime * uBlobSpeed * 0.02);
      float blueMix = smoothstep(0.0, 1.0, colorNoise * 0.5 + 0.5) * uBlueWeight;
      float pinkMix = smoothstep(0.0, 1.0, (1.0 - colorNoise) * 0.5 + 0.5) * uPinkWeight;
      float yellowMix = smoothstep(0.4, 0.6, colorNoise) * uYellowWeight;

      // Blend colors
      vec3 color = blue * blueMix + pink * pinkMix + yellow * yellowMix;
      color = mix(vec3(0.0), color, blobField);

      // Add film grain
      float grainValue = grain(uv, uTime * 0.5) * uGrainIntensity;
      color += vec3(grainValue);

      // Final alpha with fade
      float alpha = blobField * uBaseAlpha;

      gl_FragColor = vec4(color, alpha);
    }
  `;

  return (
    <mesh ref={meshRef} position={[0, 0, 0]}>
      <planeGeometry args={[30, 30]} />
      <shaderMaterial
        uniforms={uniforms}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        transparent={true}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
};

interface AuroraBackgroundProps {
  isActive: boolean;
}

// Inner component that can use useFrame
const AuroraScene: React.FC<{ reducedMotion: boolean; isActive: boolean }> = ({ reducedMotion, isActive }) => {
  const scrollOffsetRef = useRef(0);
  const [time, setTime] = React.useState(0);
  const [scrollOffset, setScrollOffset] = React.useState(0);

  useEffect(() => {
    const handleScroll = () => {
      scrollOffsetRef.current = window.scrollY / window.innerHeight;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useFrame((state) => {
    setTime(state.clock.elapsedTime);
    setScrollOffset(scrollOffsetRef.current);
  });

  return (
    <AuroraShader
      time={time}
      scrollOffset={scrollOffset}
      reducedMotion={reducedMotion}
      isActive={isActive}
    />
  );
};

const AuroraBackground: React.FC<AuroraBackgroundProps> = ({ isActive }) => {
  const [reducedMotion, setReducedMotion] = React.useState(false);

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

  // Mobile DPR optimization
  const dpr = useMemo(() => {
    if (typeof window === 'undefined') return 1;
    const isMobile = window.innerWidth < 768;
    return isMobile ? Math.min(window.devicePixelRatio, 1.5) : Math.min(window.devicePixelRatio, 2);
  }, []);

  return (
    <div
      className="fixed inset-0 pointer-events-none"
      style={{
        opacity: isActive ? 1 : 0,
        transition: 'opacity 800ms ease-out',
        zIndex: 1,
      }}
    >
      <Canvas
        camera={{ position: [0, 0, 5], fov: 75 }}
        dpr={dpr}
        gl={{ antialias: false, alpha: true }}
        style={{ background: 'transparent' }}
      >
        <AuroraScene reducedMotion={reducedMotion} isActive={isActive} />
      </Canvas>
    </div>
  );
};

export default AuroraBackground;

// ============================================================================
// QA / TESTING CHECKLIST
// ============================================================================
//
// ✅ VISUAL VERIFICATION:
// 1. Scroll past hero → aurora should fade in smoothly (600-1200ms)
// 2. Aurora blobs should drift gently, not move erratically
// 3. Colors should be primarily blue + pink, with subtle yellow accents
// 4. Film grain should be barely noticeable but add texture
// 5. Background should remain dark; aurora is accent not dominant
//
// ✅ READABILITY:
// 1. All text in glassmorphic sections should remain crisp and readable
// 2. Aurora should never wash out or overpower content
// 3. Adjust CONFIG.baseAlpha down if text contrast suffers
//
// ✅ PERFORMANCE:
// 1. 60fps on desktop (check Chrome DevTools Performance tab)
// 2. Mobile should maintain 30-60fps (lower DPR helps)
// 3. No jank during scroll
// 4. Shader compiles without errors (check console)
//
// ✅ ACCESSIBILITY:
// 1. Enable prefers-reduced-motion → animation should freeze
// 2. Static gradient + grain only (no drift)
// 3. Content remains fully readable
//
// ✅ INTEGRATION:
// 1. Aurora layer is behind all content (z-index: 0)
// 2. Glassmorphic sections remain focal point
// 3. Particles dim slightly when aurora activates (optional enhancement)
// 4. No layout shift or reflow when aurora activates
//
// ============================================================================
