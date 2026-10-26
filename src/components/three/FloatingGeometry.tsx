import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface FloatingGeometryProps {
  reducedMotion?: boolean;
}

/**
 * Interactive 3D geometric composition.
 * Contains pastel pink spheres, lavender torus, soft blue cubes, and abstract floating structures.
 * Features mouse parallax and scroll responsiveness with smooth damping.
 */
export const FloatingGeometry: React.FC<FloatingGeometryProps> = ({ reducedMotion = false }) => {
  const groupRef = useRef<THREE.Group>(null);
  const torusRef = useRef<THREE.Mesh>(null);
  const sphereLargeRef = useRef<THREE.Mesh>(null);
  const sphereMediumRef = useRef<THREE.Mesh>(null);
  const sphereSmallRef = useRef<THREE.Mesh>(null);
  const cubeRef = useRef<THREE.Mesh>(null);
  const octahedronRef = useRef<THREE.Mesh>(null);
  const icosahedronRef = useRef<THREE.Mesh>(null);
  const orbitRingRef = useRef<THREE.Group>(null);

  // Mouse & Scroll target vectors for smooth damping
  const mousePos = useRef({ x: 0, y: 0 });
  const scrollOffset = useRef(0);

  // Set up listeners for mouse and scroll
  React.useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      // Normalize mouse coordinates to [-1, 1]
      const nx = (event.clientX / window.innerWidth) * 2 - 1;
      const ny = -(event.clientY / window.innerHeight) * 2 + 1;
      mousePos.current.x = nx;
      mousePos.current.y = ny;
    };

    const handleScroll = () => {
      // Normalize scroll position relative to viewport height
      scrollOffset.current = window.scrollY / window.innerHeight;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Shared Materials with curated pastel colors and satin finish
  const materials = useMemo(() => {
    return {
      pink: new THREE.MeshStandardMaterial({
        color: new THREE.Color('#F3A6C8'),
        roughness: 0.32,
        metalness: 0.15,
      }),
      pinkSoft: new THREE.MeshStandardMaterial({
        color: new THREE.Color('#F7BDD6'),
        roughness: 0.45,
        metalness: 0.08,
      }),
      lavender: new THREE.MeshStandardMaterial({
        color: new THREE.Color('#B8A8F4'),
        roughness: 0.28,
        metalness: 0.2,
      }),
      lavenderDeep: new THREE.MeshStandardMaterial({
        color: new THREE.Color('#9E8CE6'),
        roughness: 0.35,
        metalness: 0.18,
      }),
      softBlue: new THREE.MeshStandardMaterial({
        color: new THREE.Color('#8DBBE8'),
        roughness: 0.38,
        metalness: 0.12,
      }),
      wireframeLavender: new THREE.MeshBasicMaterial({
        color: new THREE.Color('#B8A8F4'),
        wireframe: true,
        transparent: true,
        opacity: 0.35,
      }),
      wireframeBlue: new THREE.MeshBasicMaterial({
        color: new THREE.Color('#8DBBE8'),
        wireframe: true,
        transparent: true,
        opacity: 0.25,
      }),
    };
  }, []);

  // Frame animation loop with smooth lerping
  useFrame((state, delta) => {
    const t = state.clock.getElapsedTime();
    const speed = reducedMotion ? 0.1 : 1.0;

    // Smooth parallax interpolation for the parent group
    if (groupRef.current) {
      const targetX = mousePos.current.x * 0.45;
      const targetY = mousePos.current.y * 0.35 - scrollOffset.current * 0.8;
      const targetRotY = mousePos.current.x * 0.2;
      const targetRotX = -mousePos.current.y * 0.15;

      groupRef.current.position.x = THREE.MathUtils.lerp(
        groupRef.current.position.x,
        targetX,
        delta * 3.5
      );
      groupRef.current.position.y = THREE.MathUtils.lerp(
        groupRef.current.position.y,
        targetY,
        delta * 3.5
      );
      groupRef.current.rotation.y = THREE.MathUtils.lerp(
        groupRef.current.rotation.y,
        targetRotY,
        delta * 2.5
      );
      groupRef.current.rotation.x = THREE.MathUtils.lerp(
        groupRef.current.rotation.x,
        targetRotX,
        delta * 2.5
      );
    }

    // 1. Lavender Torus: Main centerpiece with graceful rotational roll
    if (torusRef.current) {
      torusRef.current.rotation.x = t * 0.25 * speed + 0.4;
      torusRef.current.rotation.y = t * 0.35 * speed;
      torusRef.current.position.y = 0.2 + Math.sin(t * 0.8 * speed) * 0.18;
    }

    // 2. Pastel Pink Sphere (Large)
    if (sphereLargeRef.current) {
      sphereLargeRef.current.position.y = -0.7 + Math.sin(t * 1.1 * speed + 1.2) * 0.22;
      sphereLargeRef.current.position.x = 1.6 + Math.cos(t * 0.7 * speed) * 0.15;
      sphereLargeRef.current.rotation.y = t * 0.2 * speed;
    }

    // 3. Pastel Pink Sphere (Medium floating)
    if (sphereMediumRef.current) {
      sphereMediumRef.current.position.y = 1.8 + Math.cos(t * 0.9 * speed + 2.0) * 0.2;
      sphereMediumRef.current.position.x = -1.5 + Math.sin(t * 0.6 * speed) * 0.12;
    }

    // 4. Pastel Pink Sphere (Small accent)
    if (sphereSmallRef.current) {
      sphereSmallRef.current.position.y = -1.9 + Math.sin(t * 1.4 * speed + 0.5) * 0.15;
      sphereSmallRef.current.position.x = 0.8 + Math.cos(t * 1.0 * speed) * 0.1;
    }

    // 5. Soft Blue Cube: Slow tumble & floating
    if (cubeRef.current) {
      cubeRef.current.rotation.x = t * 0.3 * speed;
      cubeRef.current.rotation.y = t * 0.4 * speed + 0.5;
      cubeRef.current.rotation.z = t * 0.2 * speed;
      cubeRef.current.position.y = 1.1 + Math.sin(t * 0.75 * speed + 3.1) * 0.2;
      cubeRef.current.position.x = 1.9 + Math.cos(t * 0.5 * speed) * 0.1;
    }

    // 6. Octahedron (Geometric primitive)
    if (octahedronRef.current) {
      octahedronRef.current.rotation.x = t * 0.4 * speed;
      octahedronRef.current.rotation.z = t * 0.35 * speed;
      octahedronRef.current.position.y = -1.4 + Math.cos(t * 1.2 * speed) * 0.18;
    }

    // 7. Icosahedron (Data node / ML model token)
    if (icosahedronRef.current) {
      icosahedronRef.current.rotation.y = t * 0.5 * speed;
      icosahedronRef.current.position.y = 0.8 + Math.sin(t * 1.0 * speed + 4.0) * 0.16;
    }

    // 8. Orbit Ring / Abstract wireframe structure
    if (orbitRingRef.current) {
      orbitRingRef.current.rotation.z = t * 0.15 * speed;
      orbitRingRef.current.rotation.x = 1.1 + Math.sin(t * 0.4 * speed) * 0.1;
    }
  });

  return (
    <group ref={groupRef} position={[0.6, 0, 0]}>
      {/* Centerpiece: Lavender Torus */}
      <mesh
        ref={torusRef}
        position={[0.2, 0.2, 0]}
        material={materials.lavender}
        castShadow
        receiveShadow
      >
        <torusGeometry args={[1.35, 0.42, 32, 64]} />
      </mesh>

      {/* Pastel Pink Large Sphere */}
      <mesh
        ref={sphereLargeRef}
        position={[1.6, -0.7, 0.8]}
        material={materials.pink}
        castShadow
        receiveShadow
      >
        <sphereGeometry args={[0.78, 48, 48]} />
      </mesh>

      {/* Pastel Pink Medium Sphere */}
      <mesh
        ref={sphereMediumRef}
        position={[-1.5, 1.8, -0.4]}
        material={materials.pinkSoft}
        castShadow
        receiveShadow
      >
        <sphereGeometry args={[0.48, 36, 36]} />
      </mesh>

      {/* Pastel Pink Small Accent Sphere */}
      <mesh
        ref={sphereSmallRef}
        position={[0.8, -1.9, 0.5]}
        material={materials.pink}
        castShadow
        receiveShadow
      >
        <sphereGeometry args={[0.28, 32, 32]} />
      </mesh>

      {/* Soft Blue Cube */}
      <mesh
        ref={cubeRef}
        position={[1.9, 1.1, -0.3]}
        material={materials.softBlue}
        castShadow
        receiveShadow
      >
        <boxGeometry args={[0.75, 0.75, 0.75]} />
      </mesh>

      {/* Lavender Octahedron */}
      <mesh
        ref={octahedronRef}
        position={[-1.7, -1.4, 0.4]}
        material={materials.lavenderDeep}
        castShadow
        receiveShadow
      >
        <octahedronGeometry args={[0.55]} />
      </mesh>

      {/* Soft Blue Icosahedron */}
      <mesh
        ref={icosahedronRef}
        position={[-0.9, 0.8, 1.2]}
        material={materials.softBlue}
        castShadow
        receiveShadow
      >
        <icosahedronGeometry args={[0.4, 0]} />
      </mesh>

      {/* Abstract Orbit Structure (Concentric Wireframe Rings) */}
      <group ref={orbitRingRef} position={[0.2, 0.2, 0]}>
        <mesh material={materials.wireframeLavender}>
          <ringGeometry args={[2.1, 2.14, 64]} />
        </mesh>
        <mesh rotation={[Math.PI / 4, 0, 0]} material={materials.wireframeBlue}>
          <ringGeometry args={[2.5, 2.53, 64]} />
        </mesh>
      </group>

      {/* Additional subtle floating geometric satellite */}
      <mesh position={[-2.2, 0.1, -1.2]} material={materials.pinkSoft}>
        <cylinderGeometry args={[0.18, 0.18, 0.5, 24]} />
      </mesh>

      {/* Small floating data point sphere */}
      <mesh position={[2.6, -1.5, -0.8]} material={materials.lavender}>
        <sphereGeometry args={[0.18, 24, 24]} />
      </mesh>
    </group>
  );
};
