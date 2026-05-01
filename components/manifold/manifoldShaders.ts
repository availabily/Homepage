export const particleVertexShader = `
uniform float uTime;
uniform float uCoherence;
uniform vec3 uCursor;

vec3 hash33(vec3 p) {
  p = fract(p * vec3(0.1031, 0.11369, 0.13787));
  p += dot(p, p.yxz + 19.19);
  return fract(vec3((p.x + p.y) * p.z, (p.x + p.z) * p.y, (p.y + p.z) * p.x));
}

float noise(vec3 p) {
  vec3 i = floor(p);
  vec3 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  float n = mix(
    mix(mix(dot(hash33(i + vec3(0.0, 0.0, 0.0)) - 0.5, f - vec3(0.0, 0.0, 0.0)),
            dot(hash33(i + vec3(1.0, 0.0, 0.0)) - 0.5, f - vec3(1.0, 0.0, 0.0)), f.x),
        mix(dot(hash33(i + vec3(0.0, 1.0, 0.0)) - 0.5, f - vec3(0.0, 1.0, 0.0)),
            dot(hash33(i + vec3(1.0, 1.0, 0.0)) - 0.5, f - vec3(1.0, 1.0, 0.0)), f.x), f.y),
    mix(mix(dot(hash33(i + vec3(0.0, 0.0, 1.0)) - 0.5, f - vec3(0.0, 0.0, 1.0)),
            dot(hash33(i + vec3(1.0, 0.0, 1.0)) - 0.5, f - vec3(1.0, 0.0, 1.0)), f.x),
        mix(dot(hash33(i + vec3(0.0, 1.0, 1.0)) - 0.5, f - vec3(0.0, 1.0, 1.0)),
            dot(hash33(i + vec3(1.0, 1.0, 1.0)) - 0.5, f - vec3(1.0, 1.0, 1.0)), f.x), f.y),
    f.z);
  return n;
}

vec3 curl(vec3 p) {
  float e = 0.08;
  float n1 = noise(p + vec3(0.0, e, 0.0));
  float n2 = noise(p - vec3(0.0, e, 0.0));
  float n3 = noise(p + vec3(0.0, 0.0, e));
  float n4 = noise(p - vec3(0.0, 0.0, e));
  float n5 = noise(p + vec3(e, 0.0, 0.0));
  float n6 = noise(p - vec3(e, 0.0, 0.0));
  return normalize(vec3(n2 - n1 - n4 + n3, n4 - n3 - n6 + n5, n6 - n5 - n2 + n1) / (2.0 * e));
}

void main() {
  vec3 p = position;
  vec3 flow = curl(p * 0.22 + vec3(uTime * 0.05));
  float cursorResolve = smoothstep(2.2, 0.0, distance(p, uCursor));
  p += flow * mix(1.8, 0.22, uCoherence) * (1.0 - cursorResolve * 0.7);
  p += normalize(p) * sin(uTime * 0.4 + length(p)) * 0.08 * (1.0 - uCoherence);

  vec4 mvPosition = modelViewMatrix * vec4(p, 1.0);
  gl_PointSize = mix(1.5, 3.0, uCoherence) * (300.0 / -mvPosition.z);
  gl_Position = projectionMatrix * mvPosition;
}
`;

export const particleFragmentShader = `
uniform float uCoherence;

void main() {
  vec2 coord = gl_PointCoord - 0.5;
  float radius = length(coord);
  float alpha = smoothstep(0.5, 0.18, radius);
  vec3 magenta = vec3(1.0, 0.243, 0.647);
  vec3 cyan = vec3(0.361, 0.949, 0.839);
  vec3 color = mix(magenta, cyan, uCoherence);
  float split = step(uCoherence, 0.5);
  float redEdge = smoothstep(0.5, 0.16, length(coord + vec2(0.002, 0.0)));
  float blueEdge = smoothstep(0.5, 0.16, length(coord - vec2(0.002, 0.0)));
  color.r = mix(color.r, color.r * redEdge, split * 0.45);
  color.b = mix(color.b, color.b * blueEdge, split * 0.45);
  gl_FragColor = vec4(color * (1.25 + alpha * 0.85), alpha * 0.85);
}
`;

export const edgeVertexShader = `
attribute float cycle;
varying float vCycle;
varying vec2 vUv;

void main() {
  vCycle = cycle;
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

export const edgeFragmentShader = `
uniform float uTime;
uniform float uCoherence;
varying float vCycle;
varying vec2 vUv;

void main() {
  float dash = smoothstep(0.18, 0.28, fract(vUv.x * 8.0 - uTime * 0.3));
  vec3 magenta = vec3(1.0, 0.243, 0.647);
  vec3 cyan = vec3(0.361, 0.949, 0.839);
  vec3 cycleColor = mix(magenta, cyan, uCoherence);
  vec3 baseColor = vec3(0.4, 0.5, 0.6);
  vec3 color = mix(baseColor, cycleColor, step(0.5, vCycle));
  float alpha = mix(0.18, 0.82, step(0.5, vCycle)) * mix(0.35, 1.0, dash);
  gl_FragColor = vec4(color, alpha);
}
`;
