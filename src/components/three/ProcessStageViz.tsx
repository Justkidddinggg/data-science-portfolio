/**
 * ProcessStageViz.tsx
 *
 * Three distinct mini Three.js / R3F scenes for the Process stages:
 *   'scatter'  → random blue/cyan point cloud
 *   'flow'     → animated S-curve particle stream
 *   'network'  → node-edge graph with one glowing pink node
 */

import { useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

/* ─── Scatter Scene ─── */
function ScatterScene() {
  const pointsRef = useRef<THREE.Points>(null);
  const { camera } = useThree();

  useEffect(() => {
    camera.position.set(0, 0, 4);
    camera.lookAt(0, 0, 0);
  }, [camera]);

  const geometry = useMemo(() => {
    const COUNT = 280;
    const pos   = new Float32Array(COUNT * 3);
    const col   = new Float32Array(COUNT * 3);
    const blue  = new THREE.Color('#38BDF8');
    const cyan  = new THREE.Color('#58B8FF');
    const lav   = new THREE.Color('#A99CF4');

    for (let i = 0; i < COUNT; i++) {
      const r   = Math.random() * 1.8;
      const th  = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      pos[i * 3]     = r * Math.sin(phi) * Math.cos(th);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(th) * 0.7;
      pos[i * 3 + 2] = r * Math.cos(phi) * 0.4;

      const c = Math.random() < 0.5 ? blue : Math.random() < 0.5 ? cyan : lav;
      col[i * 3]     = c.r;
      col[i * 3 + 1] = c.g;
      col[i * 3 + 2] = c.b;
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    geo.setAttribute('color',    new THREE.BufferAttribute(col, 3));
    return geo;
  }, []);

  const material = useMemo(() =>
    new THREE.PointsMaterial({
      size:            0.06,
      vertexColors:    true,
      transparent:     true,
      opacity:         0.8,
      sizeAttenuation: true,
    }), []);

  useFrame(({ clock }) => {
    if (!pointsRef.current) return;
    pointsRef.current.rotation.y = clock.getElapsedTime() * 0.18;
    pointsRef.current.rotation.x = Math.sin(clock.getElapsedTime() * 0.12) * 0.15;
  });

  return (
    <>
      <points ref={pointsRef} geometry={geometry} material={material} />
      <ambientLight intensity={0.3} />
      <pointLight position={[2, 2, 2]} intensity={1.0} color="#38BDF8" />
    </>
  );
}

/* ─── Flow Scene ─── */
function FlowScene() {
  const groupRef = useRef<THREE.Group>(null);
  const { camera } = useThree();

  useEffect(() => {
    camera.position.set(0, 0, 5);
    camera.lookAt(0, 0, 0);
  }, [camera]);

  const COUNT = 300;
  const OFFSETS = useMemo(() => new Float32Array(COUNT).map(() => Math.random() * Math.PI * 2), []);

  const { geometry, basePositions } = useMemo(() => {
    const pos  = new Float32Array(COUNT * 3);
    const col  = new Float32Array(COUNT * 3);
    const base = new Float32Array(COUNT * 3);

    const blue = new THREE.Color('#58B8FF');
    const lav  = new THREE.Color('#A99CF4');

    for (let i = 0; i < COUNT; i++) {
      const t = i / COUNT;
      const x = (t - 0.5) * 3.5;
      const y = Math.sin(t * Math.PI * 2) * 0.7;
      const z = (Math.random() - 0.5) * 0.3;

      pos[i * 3]     = base[i * 3]     = x;
      pos[i * 3 + 1] = base[i * 3 + 1] = y;
      pos[i * 3 + 2] = base[i * 3 + 2] = z;

      const c = blue.clone().lerp(lav, t);
      col[i * 3]     = c.r;
      col[i * 3 + 1] = c.g;
      col[i * 3 + 2] = c.b;
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    geo.setAttribute('color',    new THREE.BufferAttribute(col, 3));
    return { geometry: geo, basePositions: base };
  }, []);

  const material = useMemo(() =>
    new THREE.PointsMaterial({
      size:            0.065,
      vertexColors:    true,
      transparent:     true,
      opacity:         0.9,
      sizeAttenuation: true,
    }), []);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    const posAttr = geometry.attributes.position as THREE.BufferAttribute;

    for (let i = 0; i < COUNT; i++) {
      const offset = OFFSETS[i];
      posAttr.setY(i, basePositions[i * 3 + 1] + Math.sin(t * 1.5 + offset) * 0.15);
      posAttr.setZ(i, basePositions[i * 3 + 2] + Math.cos(t * 1.2 + offset) * 0.08);
    }
    posAttr.needsUpdate = true;

    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(t * 0.2) * 0.2;
    }
  });

  return (
    <group ref={groupRef}>
      <points geometry={geometry} material={material} />
      <ambientLight intensity={0.3} />
      <pointLight position={[0, 2, 3]} intensity={1.0} color="#A99CF4" />
    </group>
  );
}

/* ─── Network Scene ─── */
function NetworkScene() {
  const groupRef = useRef<THREE.Group>(null);
  const { camera } = useThree();

  useEffect(() => {
    camera.position.set(0, 0, 5.5);
    camera.lookAt(0, 0, 0);
  }, [camera]);

  const NODE_COUNT = 18;

  const { nodePositions, edgeGeometry } = useMemo(() => {
    const positions: THREE.Vector3[] = [];
    for (let i = 0; i < NODE_COUNT; i++) {
      positions.push(new THREE.Vector3(
        (Math.random() - 0.5) * 3.5,
        (Math.random() - 0.5) * 2.5,
        (Math.random() - 0.5) * 0.5,
      ));
    }

    const edgePositions: number[] = [];
    for (let a = 0; a < NODE_COUNT; a++) {
      for (let b = a + 1; b < NODE_COUNT; b++) {
        const dist = positions[a].distanceTo(positions[b]);
        if (dist < 1.8) {
          edgePositions.push(
            positions[a].x, positions[a].y, positions[a].z,
            positions[b].x, positions[b].y, positions[b].z,
          );
        }
      }
    }
    const egGeo = new THREE.BufferGeometry();
    egGeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(edgePositions), 3));

    return { nodePositions: positions, edgeGeometry: egGeo };
  }, []);

  const edgeMaterial = useMemo(() =>
    new THREE.LineBasicMaterial({ color: '#58B8FF', transparent: true, opacity: 0.3 }), []);

  useFrame(({ clock }) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = clock.getElapsedTime() * 0.15;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Edges */}
      <lineSegments geometry={edgeGeometry} material={edgeMaterial} />

      {/* Regular nodes */}
      {nodePositions.map((pos, i) => (
        <mesh key={i} position={pos}>
          <sphereGeometry args={[i === 5 ? 0 : 0.06, 8, 8]} />
          <meshBasicMaterial color={i % 3 === 0 ? '#A99CF4' : '#58B8FF'} />
        </mesh>
      ))}

      {/* Highlight anomaly node (index 5) */}
      <mesh position={nodePositions[5]}>
        <sphereGeometry args={[0.14, 12, 12]} />
        <meshBasicMaterial color="#E99BD7" />
      </mesh>

      <ambientLight intensity={0.5} />
      <pointLight position={[0, 0, 3]} intensity={1.2} color="#E99BD7" />
    </group>
  );
}

/* ─── Exported Wrapper ─── */
type VizType = 'scatter' | 'flow' | 'network';

interface Props {
  type: VizType;
  height?: number;
}

export function ProcessStageViz({ type, height = 200 }: Props) {
  return (
    <Canvas
      dpr={[1, 1.5]}
      gl={{ antialias: false, alpha: true }}
      style={{ width: '100%', height, background: 'transparent' }}
    >
      {type === 'scatter' && <ScatterScene />}
      {type === 'flow'    && <FlowScene />}
      {type === 'network' && <NetworkScene />}
    </Canvas>
  );
}
