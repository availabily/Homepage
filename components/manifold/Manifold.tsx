import React, { useEffect, useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Bloom, ChromaticAberration, EffectComposer, Vignette } from '@react-three/postprocessing';
import * as THREE from 'three';
import { useCoherence } from './CoherenceContext';
import {
  edgeFragmentShader,
  edgeVertexShader,
  particleFragmentShader,
  particleVertexShader,
} from './manifoldShaders';

interface Edge {
  a: number;
  b: number;
  isCycleEdge: 0 | 1;
}

const halton = (index: number, base: number) => {
  let result = 0;
  let fraction = 1 / base;
  let i = index;
  while (i > 0) {
    result += fraction * (i % base);
    i = Math.floor(i / base);
    fraction /= base;
  }
  return result;
};

const createVertices = () => {
  const vertices: THREE.Vector3[] = [];
  for (let i = 1; i <= 24; i += 1) {
    const u = halton(i, 2) * Math.PI * 2;
    const v = halton(i, 3) * Math.PI * 2;
    const radius = 4 + 1.4 * Math.cos(v);
    vertices.push(new THREE.Vector3(radius * Math.cos(u), 1.4 * Math.sin(v), radius * Math.sin(u)));
  }
  return vertices;
};

const createEdges = (vertices: THREE.Vector3[]) => {
  const pairs = new Map<string, [number, number]>();
  vertices.forEach((vertex, index) => {
    vertices
      .map((other, otherIndex) => ({ otherIndex, distance: vertex.distanceTo(other) }))
      .filter(({ otherIndex }) => otherIndex !== index)
      .sort((a, b) => a.distance - b.distance)
      .slice(0, 4)
      .forEach(({ otherIndex }) => {
        const a = Math.min(index, otherIndex);
        const b = Math.max(index, otherIndex);
        pairs.set(`${a}:${b}`, [a, b]);
      });
  });

  const rawEdges = Array.from(pairs.values());
  const adjacency = new Map<number, Array<{ to: number; edgeIndex: number }>>();
  rawEdges.forEach(([a, b], edgeIndex) => {
    adjacency.set(a, [...(adjacency.get(a) ?? []), { to: b, edgeIndex }]);
    adjacency.set(b, [...(adjacency.get(b) ?? []), { to: a, edgeIndex }]);
  });

  const visited = new Array(vertices.length).fill(false);
  const tin = new Array(vertices.length).fill(0);
  const low = new Array(vertices.length).fill(0);
  const bridges = new Set<number>();
  let timer = 0;

  const dfs = (node: number, parentEdge: number) => {
    visited[node] = true;
    tin[node] = timer;
    low[node] = timer;
    timer += 1;

    for (const { to, edgeIndex } of adjacency.get(node) ?? []) {
      if (edgeIndex === parentEdge) continue;
      if (visited[to]) {
        low[node] = Math.min(low[node], tin[to]);
      } else {
        dfs(to, edgeIndex);
        low[node] = Math.min(low[node], low[to]);
        if (low[to] > tin[node]) bridges.add(edgeIndex);
      }
    }
  };

  for (let i = 0; i < vertices.length; i += 1) {
    if (!visited[i]) dfs(i, -1);
  }

  return rawEdges.map(([a, b], index): Edge => ({ a, b, isCycleEdge: bridges.has(index) ? 0 : 1 }));
};

const createParticleGeometry = (count: number) => {
  const geometry = new THREE.InstancedBufferGeometry();
  const positions = new Float32Array(count * 3);
  let seed = 42;
  const random = () => {
    seed = (seed * 1664525 + 1013904223) >>> 0;
    return seed / 4294967296;
  };

  for (let i = 0; i < count; i += 1) {
    const radius = Math.cbrt(random()) * 6;
    const theta = random() * Math.PI * 2;
    const phi = Math.acos(2 * random() - 1);
    positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
    positions[i * 3 + 1] = radius * Math.cos(phi);
    positions[i * 3 + 2] = radius * Math.sin(phi) * Math.sin(theta);
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  return geometry;
};

const createEdgeGeometry = (vertices: THREE.Vector3[], edges: Edge[]) => {
  const geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(edges.length * 2 * 3);
  const cycles = new Float32Array(edges.length * 2);
  const uvs = new Float32Array(edges.length * 2 * 2);

  edges.forEach((edge, index) => {
    const a = vertices[edge.a];
    const b = vertices[edge.b];
    const offset = index * 6;
    positions.set([a.x, a.y, a.z, b.x, b.y, b.z], offset);
    cycles.set([edge.isCycleEdge, edge.isCycleEdge], index * 2);
    uvs.set([0, 0, 1, 0], index * 4);
  });

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('cycle', new THREE.BufferAttribute(cycles, 1));
  geometry.setAttribute('uv', new THREE.BufferAttribute(uvs, 2));
  return geometry;
};

const ManifoldScene: React.FC<{ mobile: boolean }> = ({ mobile }) => {
  const { coherence } = useCoherence();
  const particleMaterial = useRef<THREE.ShaderMaterial>(null);
  const edgeMaterial = useRef<THREE.ShaderMaterial>(null);
  const cursor = useRef(new THREE.Vector3(50, 50, 50));
  const particleCount = mobile ? 8000 : 32000;

  const { particleGeometry, edgeGeometry } = useMemo(() => {
    const vertices = createVertices();
    const edges = createEdges(vertices);
    return {
      particleGeometry: createParticleGeometry(particleCount),
      edgeGeometry: createEdgeGeometry(vertices, edges),
    };
  }, [particleCount]);

  useEffect(() => {
    if (mobile) return;
    const handlePointerMove = (event: PointerEvent) => {
      const x = (event.clientX / window.innerWidth - 0.5) * 10;
      const y = -(event.clientY / window.innerHeight - 0.5) * 6;
      cursor.current.set(x, y, 0);
    };
    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    return () => window.removeEventListener('pointermove', handlePointerMove);
  }, [mobile]);

  useFrame((_, delta) => {
    if (particleMaterial.current) {
      particleMaterial.current.uniforms.uTime.value += delta;
      particleMaterial.current.uniforms.uCoherence.value = coherence;
      particleMaterial.current.uniforms.uCursor.value.copy(cursor.current);
    }
    if (edgeMaterial.current) {
      edgeMaterial.current.uniforms.uTime.value += delta;
      edgeMaterial.current.uniforms.uCoherence.value = coherence;
    }
  });

  return (
    <>
      <points geometry={particleGeometry} frustumCulled={false}>
        <shaderMaterial
          ref={particleMaterial}
          vertexShader={particleVertexShader}
          fragmentShader={particleFragmentShader}
          uniforms={{
            uTime: { value: 0 },
            uCoherence: { value: coherence },
            uCursor: { value: cursor.current },
          }}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>
      <lineSegments geometry={edgeGeometry} frustumCulled={false}>
        <shaderMaterial
          ref={edgeMaterial}
          vertexShader={edgeVertexShader}
          fragmentShader={edgeFragmentShader}
          uniforms={{
            uTime: { value: 0 },
            uCoherence: { value: coherence },
          }}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </lineSegments>
      {!mobile && (
        <EffectComposer>
          <Bloom intensity={0.6} luminanceThreshold={0.2} />
          <ChromaticAberration offset={[0.0008, 0.0008]} />
          <Vignette offset={0.3} darkness={0.7} />
        </EffectComposer>
      )}
    </>
  );
};

const Manifold: React.FC = () => {
  if (import.meta.env.VITE_MANIFOLD === 'off') return null;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return null;
  const mobile = window.matchMedia('(max-width: 768px)').matches;

  return (
    <Canvas
      camera={{ position: [0, 0, 12], fov: 52 }}
      gl={{ antialias: false, powerPreference: 'high-performance' }}
      style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none' }}
      onCreated={({ gl }) => {
        gl.setClearColor('#050505', 1);
      }}
    >
      <ManifoldScene mobile={mobile} />
    </Canvas>
  );
};

export default Manifold;
