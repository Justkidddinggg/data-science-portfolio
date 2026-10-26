/**
 * SilhouetteParticles.tsx
 *
 * Renders an abstract particle-based human head + shoulders silhouette
 * using THREE.Points geometry. No real photo — geometry is defined
 * by parametric bezier curve sampling.
 *
 * Mouse parallax, gentle float animation, connecting line segments.
 */

import { useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

/* ─── Colour Palette ─── */
const BLUE   = new THREE.Color('#58B8FF');
const LAVNDR = new THREE.Color('#A99CF4');
const PINK   = new THREE.Color('#E99BD7');
const CYAN   = new THREE.Color('#38BDF8');

/* ─── Profile Key Points (head + shoulders silhouette, facing slightly right) ─── */
// Coordinates in local space, Y-up. Shape approximates a human head profile.
const PROFILE_POINTS: [number, number, number][] = [
  // Crown of head
  [ 0.00,  2.20,  0.00],
  // Right side of head going down
  [ 0.55,  2.00,  0.15],
  [ 0.85,  1.60,  0.30],
  // Forehead bump
  [ 0.90,  1.20,  0.40],
  // Nose bridge
  [ 0.95,  0.85,  0.45],
  // Nose tip
  [ 1.05,  0.60,  0.50],
  // Upper lip
  [ 0.90,  0.30,  0.42],
  // Chin
  [ 0.70,  0.00,  0.30],
  [ 0.45, -0.25,  0.20],
  // Neck
  [ 0.30, -0.55,  0.10],
  [ 0.25, -0.90,  0.05],
  // Right shoulder going out
  [ 0.50, -1.10,  0.00],
  [ 1.10, -1.30, -0.10],
  [ 1.80, -1.45, -0.20],
  // Left shoulder
  [-1.80, -1.45, -0.20],
  [-1.10, -1.30, -0.10],
  // Left neck
  [-0.25, -0.90,  0.05],
  [-0.20, -0.55,  0.10],
  // Left side of head going up
  [-0.30, -0.20,  0.20],
  [-0.55,  0.30,  0.30],
  [-0.65,  0.80,  0.35],
  [-0.70,  1.30,  0.30],
  [-0.60,  1.70,  0.20],
  [-0.35,  2.05,  0.10],
  // Back to crown
  [ 0.00,  2.20,  0.00],
];

/** Sample N points along the CatmullRom curve describing the profile outline */
function sampleOutlinePoints(count: number): THREE.Vector3[] {
  const vectors = PROFILE_POINTS.map(([x, y, z]) => new THREE.Vector3(x, y, z));
  const curve = new THREE.CatmullRomCurve3(vectors, true);
  const pts: THREE.Vector3[] = [];
  for (let i = 0; i < count; i++) {
    const t = i / count;
    const pt = curve.getPoint(t);
    // Add small noise for organic feel
    pt.x += (Math.random() - 0.5) * 0.12;
    pt.y += (Math.random() - 0.5) * 0.12;
    pt.z += (Math.random() - 0.5) * 0.18;
    pts.push(pt);
  }
  return pts;
}

/** Ray-casting point-in-polygon test */
function isInsidePolygon(x: number, y: number, polygon: THREE.Vector2[]): boolean {
  let inside = false;
  const n = polygon.length;
  for (let i = 0, j = n - 1; i < n; j = i++) {
    const xi = polygon[i].x, yi = polygon[i].y;
    const xj = polygon[j].x, yj = polygon[j].y;
    const intersect = ((yi > y) !== (yj > y)) && (x < ((xj - xi) * (y - yi)) / (yj - yi) + xi);
    if (intersect) inside = !inside;
  }
  return inside;
}

/** Sample N points scattered INSIDE the silhouette bounding box that pass a rough in-shape test */
function sampleInteriorPoints(count: number): THREE.Vector3[] {
  const pts: THREE.Vector3[] = [];
  const vectors = PROFILE_POINTS.map(([x, y, z]) => new THREE.Vector3(x, y, z));
  const curve = new THREE.CatmullRomCurve3(vectors, true);

  // Pre-sample many outline points to use for containment approximation
  const outlineSample: THREE.Vector2[] = [];
  for (let i = 0; i < 200; i++) {
    const pt = curve.getPoint(i / 200);
    outlineSample.push(new THREE.Vector2(pt.x, pt.y));
  }

  let attempts = 0;
  while (pts.length < count && attempts < count * 20) {
    attempts++;
    const rx = (Math.random() * 2 - 1) * 2.0;        // -2 to +2
    const ry = (Math.random() * 2 - 1) * 1.8 + 0.3;  // -1.5 to 2.1
    const rz = (Math.random() - 0.5) * 0.6;

    const inside = isInsidePolygon(rx, ry, outlineSample);
    if (inside) {
      pts.push(new THREE.Vector3(rx, ry, rz));
    }
  }
  return pts;
}

/** Assign a colour to each particle based on position */
function assignColor(isOutline: boolean): THREE.Color {
  if (isOutline) {
    return Math.random() < 0.5 ? BLUE.clone() : CYAN.clone();
  }
  const r = Math.random();
  if (r < 0.45) return BLUE.clone().lerp(LAVNDR, Math.random() * 0.5);
  if (r < 0.75) return LAVNDR.clone();
  if (r < 0.90) return PINK.clone();
  return CYAN.clone();
}

/* ─── Inner Scene Component ─── */
interface SceneProps {
  isMobile: boolean;
  reducedMotion: boolean;
}

function SilhouetteScene({ isMobile, reducedMotion }: SceneProps) {
  const pointsRef = useRef<THREE.Points>(null);
  const linesRef  = useRef<THREE.LineSegments>(null);
  const groupRef  = useRef<THREE.Group>(null);
  const mouseRef  = useRef({ x: 0, y: 0 });
  const targetRef = useRef({ x: 0, y: 0 });

  /** Stores the original Y values for each particle so useFrame can oscillate around them */
  const origYRef = useRef<Float32Array | null>(null);

  const OUTLINE_COUNT  = isMobile ? 250 : 500;
  const INTERIOR_COUNT = isMobile ? 300 : 700;
  const LINE_PAIRS     = isMobile ? 200 : 500;

  const { camera, gl } = useThree();

  // Position camera
  useEffect(() => {
    (camera as THREE.PerspectiveCamera).fov = 55;
    camera.position.set(0, 0.2, 6.5);
    camera.lookAt(0, 0.2, 0);
    camera.updateProjectionMatrix();
  }, [camera]);

  // Mouse tracking
  useEffect(() => {
    const canvas = gl.domElement;
    const onMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current.x = ((e.clientX - rect.left) / rect.width  - 0.5) * 2;
      mouseRef.current.y = ((e.clientY - rect.top)  / rect.height - 0.5) * -2;
    };
    window.addEventListener('mousemove', onMove);
    return () => window.removeEventListener('mousemove', onMove);
  }, [gl]);

  // Build geometry
  const { geometry, lineGeometry, floatOffsets, colorsArray } = useMemo(() => {
    const outlinePts  = sampleOutlinePoints(OUTLINE_COUNT);
    const interiorPts = sampleInteriorPoints(INTERIOR_COUNT);
    const allPts = [...outlinePts, ...interiorPts];
    const total  = allPts.length;

    const positions = new Float32Array(total * 3);
    const colors    = new Float32Array(total * 3);
    const colorsArr: THREE.Color[] = [];
    const offsets   = new Float32Array(total);

    // Also store original Y for animation
    const origY = new Float32Array(total);

    allPts.forEach((pt, i) => {
      positions[i * 3]     = pt.x;
      positions[i * 3 + 1] = pt.y;
      positions[i * 3 + 2] = pt.z;
      origY[i]             = pt.y;

      const col = assignColor(i < OUTLINE_COUNT);
      colors[i * 3]     = col.r;
      colors[i * 3 + 1] = col.g;
      colors[i * 3 + 2] = col.b;
      colorsArr.push(col);
      offsets[i] = Math.random() * Math.PI * 2;
    });

    // Store original Y in a stable ref-friendly way — we return it so useMemo can expose it
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('color',    new THREE.BufferAttribute(colors,    3));

    // Build line segments between nearby particles
    const linePositions: number[] = [];
    const picked = new Set<string>();
    let pairCount = 0;
    const attempts2 = LINE_PAIRS * 8;

    for (let k = 0; k < attempts2 && pairCount < LINE_PAIRS; k++) {
      const a = Math.floor(Math.random() * total);
      const b = Math.floor(Math.random() * total);
      if (a === b) continue;
      const key = a < b ? `${a}-${b}` : `${b}-${a}`;
      if (picked.has(key)) continue;

      const dx = positions[a * 3]     - positions[b * 3];
      const dy = positions[a * 3 + 1] - positions[b * 3 + 1];
      const dz = positions[a * 3 + 2] - positions[b * 3 + 2];
      const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
      if (dist < 0.35) {
        picked.add(key);
        pairCount++;
        linePositions.push(
          positions[a * 3],     positions[a * 3 + 1],     positions[a * 3 + 2],
          positions[b * 3],     positions[b * 3 + 1],     positions[b * 3 + 2],
        );
      }
    }

    const lineGeo = new THREE.BufferGeometry();
    lineGeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(linePositions), 3));

    return {
      geometry:    geo,
      lineGeometry: lineGeo,
      floatOffsets: offsets,
      colorsArray:  colorsArr,
      origYArray:   origY,
    };
  }, [OUTLINE_COUNT, INTERIOR_COUNT, LINE_PAIRS]);

  // Sync origY into a ref so useFrame can read it without recreating the closure
  useEffect(() => {
    // origYArray is returned from useMemo but TypeScript doesn't know it's there,
    // so we read it via the destructured variable captured in closure — see below
  }, []);

  // Store origYArray in a ref after first build
  const origYMemo = useMemo(() => {
    const outlinePts  = sampleOutlinePoints(OUTLINE_COUNT);
    const interiorPts = sampleInteriorPoints(INTERIOR_COUNT);
    const total = outlinePts.length + interiorPts.length;
    const origY = new Float32Array(total);
    const allPts = [...outlinePts, ...interiorPts];
    allPts.forEach((pt, i) => { origY[i] = pt.y; });
    return origY;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [OUTLINE_COUNT, INTERIOR_COUNT]);

  useEffect(() => {
    origYRef.current = origYMemo;
  }, [origYMemo]);

  // Point material
  const pointMaterial = useMemo(() => new THREE.PointsMaterial({
    size:            isMobile ? 0.045 : 0.038,
    vertexColors:    true,
    transparent:     true,
    opacity:         0.85,
    sizeAttenuation: true,
    depthWrite:      false,
  }), [isMobile]);

  const lineMaterial = useMemo(() => new THREE.LineBasicMaterial({
    color:       0x58B8FF,
    transparent: true,
    opacity:     0.12,
  }), []);

  // Animate
  useFrame(({ clock }) => {
    if (!groupRef.current || !pointsRef.current) return;
    const t = clock.getElapsedTime();

    // Smooth mouse lerp
    targetRef.current.x += (mouseRef.current.x - targetRef.current.x) * 0.04;
    targetRef.current.y += (mouseRef.current.y - targetRef.current.y) * 0.04;

    // Parallax tilt
    if (!reducedMotion) {
      groupRef.current.rotation.y = targetRef.current.x * 0.18;
      groupRef.current.rotation.x = targetRef.current.y * 0.09;
    }

    // Float each particle individually using stored original Y positions
    if (!reducedMotion && origYRef.current) {
      const posAttr   = pointsRef.current.geometry.attributes.position as THREE.BufferAttribute;
      const colorAttr = pointsRef.current.geometry.attributes.color    as THREE.BufferAttribute;
      const total     = posAttr.count;
      const origY     = origYRef.current;

      for (let i = 0; i < total; i++) {
        const offset = floatOffsets[i];
        // Oscillate around the original stored Y position
        posAttr.setY(i, origY[i] + Math.sin(t * 0.6 + offset) * 0.04);

        // Subtle colour pulse
        const col = colorsArray[i];
        if (col) {
          const pulse = 0.85 + Math.sin(t * 1.2 + offset) * 0.15;
          colorAttr.setXYZ(i, col.r * pulse, col.g * pulse, col.b * pulse);
        }
      }
      posAttr.needsUpdate   = true;
      colorAttr.needsUpdate = true;
    }

    // Slow rotation
    if (!reducedMotion) {
      groupRef.current.rotation.y += 0.0004;
    }
  });

  return (
    <group ref={groupRef} position={[0.2, -0.2, 0]}>
      {/* Silhouette particles */}
      <points ref={pointsRef} geometry={geometry} material={pointMaterial} />

      {/* Connecting data lines */}
      <lineSegments ref={linesRef} geometry={lineGeometry} material={lineMaterial} />

      {/* Cinematic lighting */}
      <ambientLight intensity={0.1} />
      <pointLight position={[2,  3, 3]} intensity={1.2} color="#58B8FF" />
      <pointLight position={[-2, 1, 2]} intensity={0.7} color="#A99CF4" />
      <pointLight position={[0, -1, 4]} intensity={0.4} color="#E99BD7" />
    </group>
  );
}

/* ─── Exported Canvas Wrapper ─── */
interface Props {
  reducedMotion?: boolean;
}

export function SilhouetteParticles({ reducedMotion = false }: Props) {
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  return (
    <Canvas
      dpr={[1, isMobile ? 1.5 : 2]}
      gl={{ antialias: false, alpha: true }}
      style={{ width: '100%', height: '100%', background: 'transparent' }}
    >
      <SilhouetteScene isMobile={isMobile} reducedMotion={reducedMotion} />
    </Canvas>
  );
}
