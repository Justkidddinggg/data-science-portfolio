import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface AboutDataTransformationProps {
  progress: number; // 0.0 (Curiosity/Scattered) -> 0.5 (Exploration/Patterns) -> 1.0 (Impact/Connected Network)
  reducedMotion?: boolean;
}

/**
 * BEHIND THE NUMBERS — DATA TRANSFORMATION VISUALIZATION
 * Smoothly morphs in 3 continuous stages based on scroll progress:
 * Stage 1 (0.00 - 0.35): Scattered particles (raw, curious, unexplored data cloud).
 * Stage 2 (0.35 - 0.70): Organized flowing patterns (sinusoidal trajectories, signal harmony).
 * Stage 3 (0.70 - 1.00): Connected insight network (structured lattice with pulsing actionable anomaly nodes).
 * Seamlessly reverses when scrolling upward.
 */
export const AboutDataTransformation: React.FC<AboutDataTransformationProps> = ({
  progress,
  reducedMotion = false,
}) => {
  const rootRef = useRef<THREE.Group>(null);
  const pointsRef = useRef<THREE.Points>(null);
  const streamLinesRef = useRef<THREE.LineSegments>(null);
  const networkLinesRef = useRef<THREE.LineSegments>(null);
  const insightNodesRef = useRef<THREE.Group>(null);

  // Smooth damped progress value for cinematic transitions
  const smoothProgress = useRef(0);

  const particleCount = 380;

  // ─────────────────────────────────────────────────────────────
  // Pre-calculate 3 Morphing Target States (A, B, C)
  // ─────────────────────────────────────────────────────────────
  const { positionsA, positionsB, positionsC, colorsA, colorsB, colorsC, networkGeo, streamGeo, anomalyPositions } = useMemo(() => {
    const posA = new Float32Array(particleCount * 3);
    const posB = new Float32Array(particleCount * 3);
    const posC = new Float32Array(particleCount * 3);

    const colA = new Float32Array(particleCount * 3);
    const colB = new Float32Array(particleCount * 3);
    const colC = new Float32Array(particleCount * 3);

    // Color definitions
    const colorMutedSlate = new THREE.Color('#64748B');
    const colorLavender   = new THREE.Color('#A78BFA');
    const colorCyan       = new THREE.Color('#38BDF8');
    const colorIceBlue    = new THREE.Color('#93C5FD');
    const colorWhite      = new THREE.Color('#FFFFFF');
    const colorPink       = new THREE.Color('#FF2A85');

    // 1. Stage C structured graph nodes (16 core structural anchors)
    const graphNodes: THREE.Vector3[] = [];
    const phi = (1 + Math.sqrt(5)) / 2; // Golden ratio for crystalline harmony
    const nodeCoords = [
      [-1,  phi,  0], [ 1,  phi,  0], [-1, -phi,  0], [ 1, -phi,  0],
      [ 0, -1,  phi], [ 0,  1,  phi], [ 0, -1, -phi], [ 0,  1, -phi],
      [ phi,  0, -1], [ phi,  0,  1], [-phi,  0, -1], [-phi,  0,  1],
      [ 0.6, 0.2, 0.4], [-0.5, -0.3, 0.3], [ 0.2, -0.6, -0.4], [-0.3, 0.6, -0.3]
    ];
    nodeCoords.forEach(([x, y, z]) => {
      graphNodes.push(new THREE.Vector3(x * 0.9, y * 0.9, z * 0.9));
    });

    // Network lines connecting adjacent nodes
    const netEdgePts: THREE.Vector3[] = [];
    for (let i = 0; i < graphNodes.length; i++) {
      for (let j = i + 1; j < graphNodes.length; j++) {
        if (graphNodes[i].distanceTo(graphNodes[j]) < 1.7) {
          netEdgePts.push(graphNodes[i]);
          netEdgePts.push(graphNodes[j]);
        }
      }
    }
    const netGeo = new THREE.BufferGeometry().setFromPoints(netEdgePts);

    // Stream lines for Stage B (Harmonic trajectory guides)
    const streamEdgePts: THREE.Vector3[] = [];
    const streamBands = 6;
    for (let b = 0; b < streamBands; b++) {
      const yOffset = (b - (streamBands - 1) / 2) * 0.36;
      const zOffset = Math.sin(b * 1.2) * 0.35;
      const samples = 30;
      for (let s = 0; s < samples - 1; s++) {
        const x1 = -2.2 + (s / samples) * 4.4;
        const x2 = -2.2 + ((s + 1) / samples) * 4.4;
        const y1 = yOffset + Math.sin(x1 * 2.2 + b) * 0.28;
        const y2 = yOffset + Math.sin(x2 * 2.2 + b) * 0.28;
        streamEdgePts.push(new THREE.Vector3(x1, y1, zOffset));
        streamEdgePts.push(new THREE.Vector3(x2, y2, zOffset));
      }
    }
    const strGeo = new THREE.BufferGeometry().setFromPoints(streamEdgePts);

    // Anomaly nodes in Stage C
    const anomalies = [
      graphNodes[5], // upper front
      graphNodes[12], // core insight
      graphNodes[9], // right lateral
    ];

    // Populate all particles across the 3 states
    for (let i = 0; i < particleCount; i++) {
      // ─── State A: Scattered raw cloud ───
      const u = Math.random();
      const v = Math.random();
      const theta = u * 2.0 * Math.PI;
      const phiAngle = Math.acos(2.0 * v - 1.0);
      const r = Math.cbrt(Math.random()) * 2.1;
      posA[i * 3]     = r * Math.sin(phiAngle) * Math.cos(theta);
      posA[i * 3 + 1] = r * Math.sin(phiAngle) * Math.sin(theta);
      posA[i * 3 + 2] = r * Math.cos(phiAngle);

      const isLav = i % 3 === 0;
      colA[i * 3]     = isLav ? colorLavender.r : colorMutedSlate.r;
      colA[i * 3 + 1] = isLav ? colorLavender.g : colorMutedSlate.g;
      colA[i * 3 + 2] = isLav ? colorLavender.b : colorMutedSlate.b;

      // ─── State B: Organized flowing streamlines ───
      const band = i % streamBands;
      const tParam = (i / particleCount) * 4.4 - 2.2;
      const streamY = (band - 2.5) * 0.36 + Math.sin(tParam * 2.2 + band) * 0.28;
      const streamZ = Math.sin(band * 1.2) * 0.35 + (Math.sin(i * 3.7) * 0.08);

      posB[i * 3]     = tParam;
      posB[i * 3 + 1] = streamY;
      posB[i * 3 + 2] = streamZ;

      const isWhite = i % 5 === 0;
      const colBActive = isWhite ? colorWhite : (i % 2 === 0 ? colorCyan : colorIceBlue);
      colB[i * 3]     = colBActive.r;
      colB[i * 3 + 1] = colBActive.g;
      colB[i * 3 + 2] = colBActive.b;

      // ─── State C: Structured connected network ───
      const targetNode = graphNodes[i % graphNodes.length];
      const jitter = (i >= graphNodes.length) ? 0.18 : 0.0;
      posC[i * 3]     = targetNode.x + (Math.random() - 0.5) * jitter;
      posC[i * 3 + 1] = targetNode.y + (Math.random() - 0.5) * jitter;
      posC[i * 3 + 2] = targetNode.z + (Math.random() - 0.5) * jitter;

      const isNodeAnomaly = (i % graphNodes.length === 5 || i % graphNodes.length === 12);
      const colCActive = isNodeAnomaly ? colorPink : (i % 2 === 0 ? colorCyan : colorLavender);
      colC[i * 3]     = colCActive.r;
      colC[i * 3 + 1] = colCActive.g;
      colC[i * 3 + 2] = colCActive.b;
    }

    return {
      positionsA: posA,
      positionsB: posB,
      positionsC: posC,
      colorsA: colA,
      colorsB: colB,
      colorsC: colC,
      networkGeo: netGeo,
      streamGeo: strGeo,
      anomalyPositions: anomalies,
    };
  }, []);

  // Geometry instance for particle points
  const currentParticleGeo = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(particleCount * 3), 3));
    geo.setAttribute('color', new THREE.BufferAttribute(new Float32Array(particleCount * 3), 3));
    return geo;
  }, []);

  // ─────────────────────────────────────────────────────────────
  // Animation Frame Loop: Continuous Smooth Morphing (Bidirectional)
  // ─────────────────────────────────────────────────────────────
  useFrame((state, delta) => {
    const t = state.clock.getElapsedTime();
    const sp = reducedMotion ? 0.08 : 1.0;

    // Damped smoothing of target progress (handles both forward and reverse scrolling smoothly)
    smoothProgress.current = THREE.MathUtils.lerp(
      smoothProgress.current,
      progress,
      delta * 4.2
    );

    const p = smoothProgress.current;

    // Gentle global orbit rotation for cinematic depth
    if (rootRef.current) {
      rootRef.current.rotation.y = t * 0.12 * sp + p * 0.5;
      rootRef.current.rotation.x = Math.sin(t * 0.15) * 0.08;
    }

    // Morph particle positions & colors
    if (pointsRef.current) {
      const posAttr = pointsRef.current.geometry.attributes.position as THREE.BufferAttribute;
      const colAttr = pointsRef.current.geometry.attributes.color as THREE.BufferAttribute;
      const pArr = posAttr.array as Float32Array;
      const cArr = colAttr.array as Float32Array;

      for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        let x = 0, y = 0, z = 0;
        let cr = 0, cg = 0, cb = 0;

        if (p <= 0.5) {
          // Transition 1: Stage A (Scattered) -> Stage B (Flowing Streamlines)
          const weight = p / 0.5; // 0.0 to 1.0
          const easeW = THREE.MathUtils.smoothstep(weight, 0, 1);

          // Subtle brownian drift in Stage A
          const drift = Math.sin(t * 0.8 + i) * 0.04 * (1.0 - easeW) * sp;

          x = THREE.MathUtils.lerp(positionsA[i3], positionsB[i3], easeW) + drift;
          y = THREE.MathUtils.lerp(positionsA[i3 + 1], positionsB[i3 + 1], easeW) + drift;
          z = THREE.MathUtils.lerp(positionsA[i3 + 2], positionsB[i3 + 2], easeW) + drift;

          cr = THREE.MathUtils.lerp(colorsA[i3], colorsB[i3], easeW);
          cg = THREE.MathUtils.lerp(colorsA[i3 + 1], colorsB[i3 + 1], easeW);
          cb = THREE.MathUtils.lerp(colorsA[i3 + 2], colorsB[i3 + 2], easeW);
        } else {
          // Transition 2: Stage B (Flowing Streamlines) -> Stage C (Connected Network)
          const weight = (p - 0.5) / 0.5; // 0.0 to 1.0
          const easeW = THREE.MathUtils.smoothstep(weight, 0, 1);

          x = THREE.MathUtils.lerp(positionsB[i3], positionsC[i3], easeW);
          y = THREE.MathUtils.lerp(positionsB[i3 + 1], positionsC[i3 + 1], easeW);
          z = THREE.MathUtils.lerp(positionsB[i3 + 2], positionsC[i3 + 2], easeW);

          cr = THREE.MathUtils.lerp(colorsB[i3], colorsC[i3], easeW);
          cg = THREE.MathUtils.lerp(colorsB[i3 + 1], colorsC[i3 + 1], easeW);
          cb = THREE.MathUtils.lerp(colorsB[i3 + 2], colorsC[i3 + 2], easeW);
        }

        pArr[i3]     = x;
        pArr[i3 + 1] = y;
        pArr[i3 + 2] = z;

        cArr[i3]     = cr;
        cArr[i3 + 1] = cg;
        cArr[i3 + 2] = cb;
      }

      posAttr.needsUpdate = true;
      colAttr.needsUpdate = true;
    }

    // Fade streamline guides in during Stage B (peaks around p = 0.5)
    if (streamLinesRef.current) {
      const streamMat = streamLinesRef.current.material as THREE.LineBasicMaterial;
      const visibility = Math.sin(Math.min(Math.max(p, 0), 1) * Math.PI);
      streamMat.opacity = visibility * 0.28;
    }

    // Fade network lines in during Stage C (increases from p = 0.55 to 1.0)
    if (networkLinesRef.current) {
      const netMat = networkLinesRef.current.material as THREE.LineBasicMaterial;
      const netVisibility = THREE.MathUtils.smoothstep(p, 0.52, 0.95);
      netMat.opacity = netVisibility * 0.35;
    }

    // Anomaly insight nodes pulsing in Stage C
    if (insightNodesRef.current) {
      const insightVisibility = THREE.MathUtils.smoothstep(p, 0.65, 0.95);
      const pulseScale = (1.0 + Math.sin(t * 3.0 * sp) * 0.25) * insightVisibility;
      insightNodesRef.current.children.forEach(child => {
        child.scale.set(pulseScale, pulseScale, pulseScale);
      });
    }
  });

  return (
    <group ref={rootRef}>
      {/* 1. Morphing Data Particles Cloud */}
      <points ref={pointsRef} geometry={currentParticleGeo}>
        <pointsMaterial
          size={0.052}
          vertexColors
          transparent
          opacity={0.92}
          sizeAttenuation
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>

      {/* 2. Organized Flowing Streamline Guides (Active during Exploration) */}
      <lineSegments ref={streamLinesRef} geometry={streamGeo}>
        <lineBasicMaterial
          color="#38BDF8"
          transparent
          opacity={0}
          blending={THREE.AdditiveBlending}
        />
      </lineSegments>

      {/* 3. Connected Graph Network Struts (Active during Impact) */}
      <lineSegments ref={networkLinesRef} geometry={networkGeo}>
        <lineBasicMaterial
          color="#C4B5FD"
          transparent
          opacity={0}
          blending={THREE.AdditiveBlending}
        />
      </lineSegments>

      {/* 4. Highlighted Insight Anomaly Nodes (Pulsing Magenta Action Nodes) */}
      <group ref={insightNodesRef}>
        {anomalyPositions.map((pos, idx) => (
          <group key={idx} position={pos}>
            <mesh>
              <sphereGeometry args={[0.09, 24, 24]} />
              <meshBasicMaterial color="#FF2A85" />
            </mesh>
            <mesh rotation={[Math.PI / 4, 0, 0]}>
              <ringGeometry args={[0.13, 0.16, 32]} />
              <meshBasicMaterial
                color="#FF2A85"
                transparent
                opacity={0.6}
                side={THREE.DoubleSide}
                blending={THREE.AdditiveBlending}
              />
            </mesh>
          </group>
        ))}
      </group>
    </group>
  );
};
