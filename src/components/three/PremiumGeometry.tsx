import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface PremiumGeometryProps {
  reducedMotion?: boolean;
}

/**
 * Apple product-render inspired geometry.
 * Clean composition: one dominant object + supporting elements.
 * Polished materials, gentle motion, mouse parallax.
 */
export const PremiumGeometry: React.FC<PremiumGeometryProps> = ({
  reducedMotion = false,
}) => {
  const rootRef  = useRef<THREE.Group>(null);
  const torusRef = useRef<THREE.Mesh>(null);
  const sphereARef = useRef<THREE.Mesh>(null);
  const sphereBRef = useRef<THREE.Mesh>(null);
  const cubeRef  = useRef<THREE.Mesh>(null);
  const icoRef   = useRef<THREE.Mesh>(null);

  const mouse = useRef({ x: 0, y: 0 });
  const scroll = useRef(0);

  React.useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = -((e.clientY / window.innerHeight) * 2 - 1);
    };
    const onScroll = () => {
      scroll.current = window.scrollY / window.innerHeight;
    };
    window.addEventListener('mousemove', onMove, { passive: true });
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  const mats = useMemo(() => ({
    lavender: new THREE.MeshStandardMaterial({
      color: '#C4B5FD',
      roughness: 0.18,
      metalness: 0.3,
    }),
    pink: new THREE.MeshStandardMaterial({
      color: '#F9A8D4',
      roughness: 0.22,
      metalness: 0.12,
    }),
    pinkLight: new THREE.MeshStandardMaterial({
      color: '#FBCFE8',
      roughness: 0.35,
      metalness: 0.06,
    }),
    blue: new THREE.MeshStandardMaterial({
      color: '#93C5FD',
      roughness: 0.2,
      metalness: 0.25,
    }),
    rim: new THREE.MeshStandardMaterial({
      color: '#E9D5FF',
      roughness: 0.12,
      metalness: 0.45,
    }),
  }), []);

  useFrame((state, delta) => {
    const t = state.clock.getElapsedTime();
    const sp = reducedMotion ? 0.08 : 1;

    if (rootRef.current) {
      const tx = mouse.current.x * 0.3;
      const ty = mouse.current.y * 0.22 - scroll.current * 0.6;
      rootRef.current.position.x = THREE.MathUtils.lerp(rootRef.current.position.x, tx, delta * 2.8);
      rootRef.current.position.y = THREE.MathUtils.lerp(rootRef.current.position.y, ty, delta * 2.8);
      rootRef.current.rotation.y = THREE.MathUtils.lerp(rootRef.current.rotation.y, mouse.current.x * 0.14, delta * 2);
      rootRef.current.rotation.x = THREE.MathUtils.lerp(rootRef.current.rotation.x, -mouse.current.y * 0.08, delta * 2);
    }

    if (torusRef.current) {
      torusRef.current.rotation.x = 0.42 + t * 0.18 * sp;
      torusRef.current.rotation.y = t * 0.26 * sp;
      torusRef.current.position.y = Math.sin(t * 0.7 * sp) * 0.14;
    }
    if (sphereARef.current) {
      sphereARef.current.position.y = -0.6 + Math.sin(t * 0.95 * sp + 1.2) * 0.18;
      sphereARef.current.position.x = 1.7 + Math.cos(t * 0.6 * sp) * 0.1;
    }
    if (sphereBRef.current) {
      sphereBRef.current.position.y = 1.7 + Math.cos(t * 0.8 * sp + 2) * 0.15;
      sphereBRef.current.position.x = -1.6 + Math.sin(t * 0.55 * sp) * 0.1;
    }
    if (cubeRef.current) {
      cubeRef.current.rotation.x = t * 0.28 * sp;
      cubeRef.current.rotation.y = t * 0.38 * sp;
      cubeRef.current.position.y = 1.0 + Math.sin(t * 0.7 * sp + 3) * 0.16;
    }
    if (icoRef.current) {
      icoRef.current.rotation.y = t * 0.42 * sp;
      icoRef.current.position.y = -1.8 + Math.sin(t * 1.1 * sp) * 0.14;
    }
  });

  return (
    <group ref={rootRef} position={[0.5, 0, 0]}>
      {/* Primary: Lavender torus — dominant centrepiece */}
      <mesh ref={torusRef} position={[0, 0, 0]} material={mats.lavender}>
        <torusGeometry args={[1.3, 0.38, 64, 96]} />
      </mesh>

      {/* Pink sphere — large accent */}
      <mesh ref={sphereARef} position={[1.7, -0.6, 0.6]} material={mats.pink}>
        <sphereGeometry args={[0.72, 56, 56]} />
      </mesh>

      {/* Pink soft sphere — upper left */}
      <mesh ref={sphereBRef} position={[-1.6, 1.7, -0.3]} material={mats.pinkLight}>
        <sphereGeometry args={[0.44, 40, 40]} />
      </mesh>

      {/* Blue cube — upper right */}
      <mesh ref={cubeRef} position={[2, 1.0, -0.4]} material={mats.blue}>
        <boxGeometry args={[0.68, 0.68, 0.68]} />
      </mesh>

      {/* Rim icosahedron — lower accent */}
      <mesh ref={icoRef} position={[-1.2, -1.8, 0.5]} material={mats.rim}>
        <icosahedronGeometry args={[0.42, 1]} />
      </mesh>

      {/* Tiny accent sphere */}
      <mesh position={[2.5, -1.6, -0.6]} material={mats.lavender}>
        <sphereGeometry args={[0.15, 24, 24]} />
      </mesh>
    </group>
  );
};
