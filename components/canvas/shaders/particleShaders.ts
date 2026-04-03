/**
 * Particle cloud — points rendered with size attenuation.
 * Uniforms: uTime, uMouse, uDissolveProgress (visibility / morph amount).
 */

export const particleVertexShader = /* glsl */ `
uniform float uTime;
uniform float uPointScale;
uniform float uDissolveProgress;

attribute float aPhase;

varying float vAlpha;
varying vec3 vColor;

void main() {
  vec3 p = position;
  // Gentle breathe so the cloud feels alive before full GPGPU simulation
  float breathe = sin(uTime * 0.7 + aPhase * 6.2831853) * 0.02 * uDissolveProgress;
  p += normalize(p + 1e-4) * breathe;

  vec4 mvPosition = modelViewMatrix * vec4(p, 1.0);
  gl_Position = projectionMatrix * mvPosition;
  gl_PointSize = uPointScale * (300.0 / -mvPosition.z) * (0.4 + 0.6 * uDissolveProgress);
  vAlpha = smoothstep(0.05, 0.95, uDissolveProgress);
  vColor = vec3(0.894, 1.0, 0.0);
}
`;

export const particleFragmentShader = /* glsl */ `
varying float vAlpha;
varying vec3 vColor;

void main() {
  vec2 c = gl_PointCoord - 0.5;
  float d = length(c);
  float mask = smoothstep(0.5, 0.0, d);
  if (mask < 0.01) discard;
  gl_FragColor = vec4(vColor, mask * vAlpha);
}
`;
