/**
 * The Flux — liquid chrome + dissolve scaffold.
 * Uniforms: uTime, uMouse (xy in clip-ish space), uDissolveProgress (0–1).
 * Refine noise, SDF, and lighting in a later pass.
 */

export const fluxVertexShader = /* glsl */ `
uniform float uTime;
uniform vec2 uMouse;
uniform float uDissolveProgress;

varying vec3 vNormal;
varying vec3 vViewPosition;
varying vec3 vWorldPosition;
varying float vDissolve;

// 3D Simplex Noise (Ashima)
vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 mod7(vec4 x) { return x - floor(x * (1.0 / 7.0)) * 7.0; }

vec4 permute(vec4 x) { return mod289(((x * 34.0) + 1.0) * x); }

float snoise(vec3 v) {
  const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;
  const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);

  // First corner
  vec3 i  = floor(v + dot(v, C.yyy) );
  vec3 x0 = v - i + dot(i, C.xxx) ;

  // Other corners
  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min( g.xyz, l.zxy );
  vec3 i2 = max( g.xyz, l.zxy );

  vec3 x1 = x0 - i1 + C.xxx;
  vec3 x2 = x0 - i2 + C.yyy; // 2.0*C.x = 1/3 = C.y
  vec3 x3 = x0 - D.yyy;      // -1.0 + 3.0*C.x = -0.5

  // Permutations
  i = mod289(i);
  vec4 p = permute( permute( permute(
            i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
          + i.y + vec4(0.0, i1.y, i2.y, 1.0 ))
          + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));

  // Gradients: 7x7 points over a square, mapped onto an octahedron.
  float n_ = 1.0/7.0; // N=7
  vec3  ns = n_ * D.wyz - D.xzx;

  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);  // p - 49 * floor(p / 49)
  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_ );    // j - 7*x_

  vec4 x = x_ *ns.x + ns.yyyy;
  vec4 y = y_ *ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);

  vec4 b0 = vec4( x.xy, y.xy );
  vec4 b1 = vec4( x.zw, y.zw );

  vec4 s0 = vec4(lessThan(b0, vec4(0.0)));
  vec4 s1 = vec4(lessThan(b1, vec4(0.0)));
  vec4 sh = -step(h, vec4(0.0));

  vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
  vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;

  vec3 p0 = vec3(a0.xy, h.x);
  vec3 p1 = vec3(a0.zw, h.y);
  vec3 p2 = vec3(a1.xy, h.z);
  vec3 p3 = vec3(a1.zw, h.w);

  // Normalise gradients
  vec4 norm = inversesqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
  p0 *= norm.x;
  p1 *= norm.y;
  p2 *= norm.z;
  p3 *= norm.w;

  // Mix final noise value
  vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
  m = m * m;
  return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
}

void main() {
  vNormal = normalize(normalMatrix * normal);

  // --- Soft-body pulsing (simplex noise, subtle and stable) ---
  float t = uTime;
  vec3 npos = normalize(position + vec3(1e-4));
  float n1 = snoise(npos * 1.6 + vec3(0.0, t * 0.22, t * 0.11));
  float n2 = snoise(npos * 3.2 + vec3(t * 0.18, 0.0, -t * 0.14));
  float und = (n1 * 0.65 + n2 * 0.35);

  float softDisp = (1.0 - uDissolveProgress) * 0.028 * und;

  // --- Dissolve displacement: push vertices along normal when dissolving ---
  float jitter = sin(position.x * 12.0 + t * 2.0) * cos(position.y * 10.0);
  float dissolveDisp = uDissolveProgress * 0.08 * (0.5 + 0.5 * jitter);

  vec3 displaced = position + normal * (dissolveDisp + softDisp);

  vec4 mvPosition = modelViewMatrix * vec4(displaced, 1.0);
  vViewPosition = -mvPosition.xyz;
  vWorldPosition = (modelMatrix * vec4(displaced, 1.0)).xyz;
  gl_Position = projectionMatrix * mvPosition;

  // Pass a spatial dissolve mask (cursor bias + global progress)
  vec2 m = uMouse * 0.5;
  float cursorMask = 1.0 - smoothstep(0.0, 0.85, length(vWorldPosition.xy * 0.6 - m));
  vDissolve = clamp(uDissolveProgress + cursorMask * 0.35, 0.0, 1.0);
}
`;

export const fluxFragmentShader = /* glsl */ `
uniform float uTime;
uniform vec2 uMouse;
uniform float uDissolveProgress;
uniform samplerCube uEnvMap;

varying vec3 vNormal;
varying vec3 vViewPosition;
varying vec3 vWorldPosition;
varying float vDissolve;

// Palette: sulphur highlight, deep void, safety accent (tweak later)
const vec3 COL_SULPHUR = vec3(0.894, 1.0, 0.0);
const vec3 COL_VOID = vec3(0.039, 0.039, 0.047);
const vec3 COL_SAFETY = vec3(1.0, 0.373, 0.122);

void main() {
  vec3 N = normalize(vNormal);
  vec3 V = normalize(vViewPosition);
  vec3 R = reflect(-V, N);

  // --- Oxidized chrome reflections (fresnel + env cube) ---
  float fresnel = pow(1.0 - max(dot(N, V), 0.0), 5.5);

  // Procedural oxidation patterns (uses world coords so it "sticks" to the form)
  float oxRaw = fract(sin(dot(vWorldPosition * 2.7, vec3(12.9898, 78.233, 45.164))) * 43758.5453);
  float ox = smoothstep(0.35, 0.75, oxRaw);

  vec3 oxidA = vec3(0.97, 0.78, 0.22); // yellow-gold tarnish
  vec3 oxidB = vec3(0.12, 0.08, 0.06); // dark tarnish
  vec3 oxidized = mix(oxidB, oxidA, ox);

  vec3 base = mix(COL_VOID * 1.25, oxidized, 0.55 + fresnel * 0.45);

  // --- Harsh mouse-driven hot spot (adds energy and streak vibe) ---
  vec2 m = uMouse * 0.35;
  float glare = smoothstep(0.62, 0.0, length(vWorldPosition.xy * 0.5 - m));
  base += COL_SAFETY * glare * 0.12;

  // --- Environment reflection (high contrast chrome) ---
  vec3 env = textureCube(uEnvMap, R).rgb;
  vec3 reflection = env * (1.2 + 2.8 * fresnel);
  reflection += env * glare * 0.35;

  // --- Dissolve: mix toward particle-like noise ---
  float n = fract(sin(dot(vWorldPosition * 3.0, vec3(12.9898, 78.233, 45.164))) * 43758.5453);
  float edge = smoothstep(0.2, 0.95, vDissolve);
  vec3 noisy = mix(base, vec3(n * 0.45 + 0.05), edge * 0.85);

  vec3 color = mix(base + reflection * 0.65, noisy + reflection * 0.18, edge * 0.9);
  gl_FragColor = vec4(color, 1.0);
}
`;
