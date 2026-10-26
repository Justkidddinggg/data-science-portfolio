import React, { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface DataInMotionProps {
  reducedMotion?: boolean;
}

/**
 * DATA IN MOTION — 3D SCENE
 * Recreates the exact creative composition from the reference artwork:
 * 1. Scattered raw data cubes on the left floor (slate-blue, lavender, pink anomalies).
 * 2. Dense luminous fiber-optic stream surging upwards through the center.
 * 3. Three staggered translucent glass monoliths representing the transformation filter.
 * 4. Structured 3D neural/graph network lattice on the right with glowing pink anomaly nodes.
 * 5. Dark glossy reflective floor capturing ambient illumination and reflections.
 */
export const DataInMotion: React.FC<DataInMotionProps> = ({ reducedMotion = false }) => {
  const rootGroupRef = useRef<THREE.Group>(null);
  const streamParticlesRef = useRef<THREE.Points>(null);
  const anomalyNodesRef = useRef<THREE.Group>(null);
  const cubesGroupRef = useRef<THREE.Group>(null);

  // Normalized mouse & scroll references for smooth damping
  const mouse = useRef({ x: 0, y: 0 });
  const scroll = useRef(0);

  useEffect(() => {
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

  // ─────────────────────────────────────────────────────────────
  // 1. Raw Data Cubes (Left / Lower Mid-ground)
  // ─────────────────────────────────────────────────────────────
  const cubesData = useMemo(() => {
    // Curated clusters matching the exact composition of the reference image
    const colors = [
      '#5E82B8', // Slate blue
      '#8CB5E8', // Light cyan-blue
      '#436294', // Deep navy blue
      '#C4B5FD', // Soft lavender
      '#F472B6', // Pastel pink (anomaly telemetry)
      '#E2E8F0', // Soft white
    ];

    const list = [];
    const count = 42;

    for (let i = 0; i < count; i++) {
      const isAnomaly = i === 4 || i === 12 || i === 23;
      const size = 0.07 + (i % 5) * 0.035 + (i % 3 === 0 ? 0.04 : 0);
      
      // Distributed from x = -1.4 up to x = 0.8, clustering near the base of the stream
      const x = -1.4 + (i / count) * 2.2 + (Math.sin(i * 1.7) * 0.35);
      const y = -1.45 + (Math.cos(i * 2.3) * 0.45) + (i > 25 ? 0.35 : 0);
      const z = -0.5 + (Math.sin(i * 3.1) * 0.95);

      const color = isAnomaly ? '#F472B6' : colors[i % colors.length];

      list.push({
        pos: new THREE.Vector3(x, y, z),
        size,
        color,
        rot: new THREE.Euler(
          (i * 0.2) % 0.5,
          (i * 0.35) % 0.8,
          (i * 0.15) % 0.4
        ),
        phase: i * 0.4,
        speed: 0.2 + (i % 4) * 0.15,
      });
    }
    return list;
  }, []);

  // ─────────────────────────────────────────────────────────────
  // 2. Bundled Fiber-Optic Streamline Splines
  // ─────────────────────────────────────────────────────────────
  const streamCurves = useMemo(() => {
    const curves: THREE.CatmullRomCurve3[] = [];
    const numCurves = 18;

    for (let i = 0; i < numCurves; i++) {
      const spreadX = (i % 6 - 2.5) * 0.14;
      const spreadY = (Math.floor(i / 6) - 1.0) * 0.18;
      const spreadZ = ((i % 5) - 2.0) * 0.18;

      // S-curve sweeping from cube field, through glass slabs, into network
      const c = new THREE.CatmullRomCurve3([
        new THREE.Vector3(-0.4 + spreadX * 1.5, -1.2 + spreadY * 1.2, 0.4 + spreadZ),
        new THREE.Vector3(0.3 + spreadX * 1.2, -0.6 + spreadY * 0.8, 0.2 + spreadZ * 0.8),
        new THREE.Vector3(1.1 + spreadX * 0.8, 0.1 + spreadY * 0.5, 0.0 + spreadZ * 0.6),
        // Point passing right through the glass monoliths
        new THREE.Vector3(1.9 + spreadX * 0.5, 0.6 + spreadY * 0.4, -0.1 + spreadZ * 0.4),
        new THREE.Vector3(2.8 + spreadX * 0.8, 0.9 + spreadY * 0.6, 0.1 + spreadZ * 0.7),
        // Fan out into the structured network lattice
        new THREE.Vector3(3.7 + spreadX * 1.8, 1.1 + spreadY * 1.4, 0.2 + spreadZ * 1.5),
      ]);
      curves.push(c);
    }
    return curves;
  }, []);

  // Combined LineSegments geometry for all glowing fiber trails (1 draw call, fully typed)
  const streamLinesGeo = useMemo(() => {
    const linePoints: THREE.Vector3[] = [];
    streamCurves.forEach(curve => {
      const pts = curve.getPoints(80);
      for (let i = 0; i < pts.length - 1; i++) {
        linePoints.push(pts[i], pts[i + 1]);
      }
    });
    return new THREE.BufferGeometry().setFromPoints(linePoints);
  }, [streamCurves]);

  // ─────────────────────────────────────────────────────────────
  // 3. Dense Flowing Stream Particles
  // ─────────────────────────────────────────────────────────────
  const particleCount = 480;
  const particleMeta = useMemo(() => {
    const meta = [];
    for (let i = 0; i < particleCount; i++) {
      const curveIndex = i % streamCurves.length;
      const progress = Math.random();
      const speed = 0.06 + Math.random() * 0.09;
      const radius = 0.04 + Math.random() * 0.12;
      const angle = Math.random() * Math.PI * 2;

      // Color scheme: electric cyan, soft blue, white sparks, lavender
      let col = new THREE.Color('#38BDF8');
      if (i % 6 === 0) col = new THREE.Color('#FFFFFF'); // bright data spark
      else if (i % 4 === 0) col = new THREE.Color('#C084FC'); // lavender
      else if (i % 3 === 0) col = new THREE.Color('#93C5FD'); // pale ice blue
      else if (i % 23 === 0) col = new THREE.Color('#F472B6'); // rare anomaly pulse

      meta.push({ curveIndex, progress, speed, radius, angle, color: col });
    }
    return meta;
  }, [streamCurves]);

  const [particleGeo] = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const pos = new Float32Array(particleCount * 3);
    const cols = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      const m = particleMeta[i];
      const pt = streamCurves[m.curveIndex].getPointAt(m.progress);
      pos[i * 3] = pt.x;
      pos[i * 3 + 1] = pt.y;
      pos[i * 3 + 2] = pt.z;

      cols[i * 3] = m.color.r;
      cols[i * 3 + 1] = m.color.g;
      cols[i * 3 + 2] = m.color.b;
    }
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    geo.setAttribute('color', new THREE.BufferAttribute(cols, 3));
    return [geo];
  }, [streamCurves, particleMeta]);

  // ─────────────────────────────────────────────────────────────
  // 4. Glass Monoliths (Center Transformation Filter)
  // ─────────────────────────────────────────────────────────────
  const glassMonoliths = useMemo(() => {
    return [
      {
        pos: new THREE.Vector3(1.35, 0.05, 0.15),
        scale: new THREE.Vector3(0.04, 2.3, 1.25),
        rotY: -0.24,
      },
      {
        pos: new THREE.Vector3(1.95, 0.35, 0.0),
        scale: new THREE.Vector3(0.04, 2.5, 1.35),
        rotY: -0.20,
      },
      {
        pos: new THREE.Vector3(2.65, 0.55, -0.15),
        scale: new THREE.Vector3(0.04, 2.1, 1.15),
        rotY: -0.16,
      },
    ];
  }, []);

  // ─────────────────────────────────────────────────────────────
  // 5. Intelligent Network Lattice (Right Side)
  // ─────────────────────────────────────────────────────────────
  const networkGraph = useMemo(() => {
    // 3D coordinates for network nodes exactly as in the reference image
    const rawNodes: { pos: THREE.Vector3; isAnomaly?: boolean }[] = [
      // Top tier
      { pos: new THREE.Vector3(4.2, 1.8, 0.0) },
      { pos: new THREE.Vector3(4.8, 1.5, 0.3) },
      { pos: new THREE.Vector3(3.6, 1.5, -0.4) },
      { pos: new THREE.Vector3(4.1, 1.3, 0.5), isAnomaly: true }, // Anomaly 1 (top pink)
      // Mid-upper tier
      { pos: new THREE.Vector3(3.3, 1.0, 0.2) },
      { pos: new THREE.Vector3(3.8, 0.9, -0.3) },
      { pos: new THREE.Vector3(4.5, 0.9, 0.1) },
      { pos: new THREE.Vector3(5.1, 0.8, -0.4) },
      { pos: new THREE.Vector3(3.7, 0.5, 0.7), isAnomaly: true }, // Anomaly 2 (mid pink)
      // Mid tier
      { pos: new THREE.Vector3(3.2, 0.4, -0.2) },
      { pos: new THREE.Vector3(4.2, 0.3, -0.6) },
      { pos: new THREE.Vector3(4.8, 0.4, 0.4) },
      { pos: new THREE.Vector3(5.3, 0.1, -0.1) },
      // Mid-lower tier
      { pos: new THREE.Vector3(3.4, -0.1, 0.3) },
      { pos: new THREE.Vector3(4.1, -0.2, 0.1), isAnomaly: true }, // Anomaly 3 (lower bright pink)
      { pos: new THREE.Vector3(4.7, -0.3, -0.5) },
      { pos: new THREE.Vector3(3.8, -0.6, -0.2) },
      { pos: new THREE.Vector3(4.4, -0.7, 0.4) },
      // Boundary anchors
      { pos: new THREE.Vector3(5.0, -0.6, 0.1) },
      { pos: new THREE.Vector3(3.2, 1.3, -0.6) },
    ];

    // Build connection lines between close neighbors
    const edgePoints: THREE.Vector3[] = [];
    for (let i = 0; i < rawNodes.length; i++) {
      for (let j = i + 1; j < rawNodes.length; j++) {
        const d = rawNodes[i].pos.distanceTo(rawNodes[j].pos);
        if (d < 1.15) {
          edgePoints.push(rawNodes[i].pos);
          edgePoints.push(rawNodes[j].pos);
        }
      }
    }
    const linesGeo = new THREE.BufferGeometry().setFromPoints(edgePoints);

    return { nodes: rawNodes, linesGeo };
  }, []);

  // ─────────────────────────────────────────────────────────────
  // Animation Frame Loop
  // ─────────────────────────────────────────────────────────────
  useFrame((state, delta) => {
    const t = state.clock.getElapsedTime();
    const sp = reducedMotion ? 0.08 : 1.0;

    // Smooth Parallax of entire data system
    if (rootGroupRef.current) {
      const targetX = mouse.current.x * 0.25;
      const targetY = mouse.current.y * 0.18 - scroll.current * 0.45;
      const targetRotY = mouse.current.x * 0.08;
      const targetRotX = -mouse.current.y * 0.05;

      rootGroupRef.current.position.x = THREE.MathUtils.lerp(rootGroupRef.current.position.x, targetX, delta * 2.8);
      rootGroupRef.current.position.y = THREE.MathUtils.lerp(rootGroupRef.current.position.y, targetY, delta * 2.8);
      rootGroupRef.current.rotation.y = THREE.MathUtils.lerp(rootGroupRef.current.rotation.y, targetRotY, delta * 2.0);
      rootGroupRef.current.rotation.x = THREE.MathUtils.lerp(rootGroupRef.current.rotation.x, targetRotX, delta * 2.0);
    }

    // Gentle floating motion for raw data cubes
    if (cubesGroupRef.current) {
      cubesGroupRef.current.children.forEach((child, i) => {
        const meta = cubesData[i];
        if (meta) {
          child.position.y = meta.pos.y + Math.sin(t * meta.speed * sp + meta.phase) * 0.035;
          child.rotation.y = meta.rot.y + t * 0.1 * sp;
        }
      });
    }

    // Stream particles advancement along the curved fiber bundle
    if (streamParticlesRef.current) {
      const posAttr = streamParticlesRef.current.geometry.attributes.position as THREE.BufferAttribute;
      const arr = posAttr.array as Float32Array;

      for (let i = 0; i < particleCount; i++) {
        const m = particleMeta[i];
        m.progress = (m.progress + m.speed * delta * sp) % 1.0;

        const curve = streamCurves[m.curveIndex];
        const pt = curve.getPointAt(m.progress);

        // Stream cross-section breathing
        const radialPulse = m.radius * (1.0 + Math.sin(t * 1.5 + i) * 0.15);
        const ang = m.angle + t * 0.3 * sp;

        arr[i * 3]     = pt.x + Math.cos(ang) * radialPulse;
        arr[i * 3 + 1] = pt.y + Math.sin(ang) * radialPulse;
        arr[i * 3 + 2] = pt.z + Math.sin(ang * 2) * radialPulse * 0.6;
      }
      posAttr.needsUpdate = true;
    }

    // Anomaly nodes breathing / rhythmic pulse
    if (anomalyNodesRef.current) {
      const pulseScale = 1.0 + Math.sin(t * 2.6 * sp) * 0.22;
      anomalyNodesRef.current.children.forEach(child => {
        child.scale.set(pulseScale, pulseScale, pulseScale);
      });
    }
  });

  return (
    <group ref={rootGroupRef} position={[0.2, 0, 0]}>
      {/* ─────────────────────────────────────────────────────
          1. DARK REFLECTIVE GROUND FLOOR
          ───────────────────────────────────────────────────── */}
      <mesh position={[1.5, -1.6, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[14, 10]} />
        <meshStandardMaterial
          color="#060A14"
          roughness={0.18}
          metalness={0.65}
        />
      </mesh>

      {/* ─────────────────────────────────────────────────────
          2. RAW DATA CUBES (Left floor field)
          ───────────────────────────────────────────────────── */}
      <group ref={cubesGroupRef}>
        {cubesData.map((cube, idx) => (
          <mesh
            key={idx}
            position={cube.pos}
            rotation={cube.rot}
          >
            <boxGeometry args={[cube.size, cube.size, cube.size]} />
            <meshStandardMaterial
              color={cube.color}
              roughness={0.22}
              metalness={0.35}
              emissive={cube.color === '#F472B6' ? '#FF2A85' : '#000000'}
              emissiveIntensity={cube.color === '#F472B6' ? 0.35 : 0}
            />
          </mesh>
        ))}
      </group>

      {/* ─────────────────────────────────────────────────────
          3. GLOWING FIBER STREAMLINES (Visible ribbon trajectories)
          ───────────────────────────────────────────────────── */}
      <lineSegments geometry={streamLinesGeo}>
        <lineBasicMaterial
          color="#38BDF8"
          transparent
          opacity={0.32}
          blending={THREE.AdditiveBlending}
        />
      </lineSegments>

      {/* ─────────────────────────────────────────────────────
          4. LUMINESCENT FLOWING PARTICLES
          ───────────────────────────────────────────────────── */}
      <points ref={streamParticlesRef} geometry={particleGeo}>
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

      {/* ─────────────────────────────────────────────────────
          5. TRANSLUCENT GLASS MONOLITHS (Transformation filter)
          ───────────────────────────────────────────────────── */}
      {glassMonoliths.map((slab, idx) => (
        <group key={idx} position={slab.pos} rotation={[0, slab.rotY, 0]}>
          {/* Main Glass Slab */}
          <mesh scale={slab.scale}>
            <boxGeometry args={[1, 1, 1]} />
            <meshPhysicalMaterial
              color="#A5B4FC"
              transmission={0.88}
              opacity={0.65}
              transparent
              roughness={0.12}
              metalness={0.1}
              ior={1.48}
              thickness={0.4}
              specularIntensity={1.2}
            />
          </mesh>

          {/* Glowing Glass Edge Bevel / Frame */}
          <lineSegments scale={slab.scale}>
            <edgesGeometry args={[new THREE.BoxGeometry(1, 1, 1)]} />
            <lineBasicMaterial
              color="#38BDF8"
              transparent
              opacity={0.48}
              blending={THREE.AdditiveBlending}
            />
          </lineSegments>
        </group>
      ))}

      {/* ─────────────────────────────────────────────────────
          6. STRUCTURED NETWORK LATTICE (Right side)
          ───────────────────────────────────────────────────── */}
      {/* Network Edges / Connecting Struts */}
      <lineSegments geometry={networkGraph.linesGeo}>
        <lineBasicMaterial
          color="#38BDF8"
          transparent
          opacity={0.28}
          blending={THREE.AdditiveBlending}
        />
      </lineSegments>

      {/* Regular Network Spheres (Muted blue / lavender) */}
      {networkGraph.nodes
        .filter(n => !n.isAnomaly)
        .map((n, idx) => (
          <mesh key={idx} position={n.pos}>
            <sphereGeometry args={[0.075, 24, 24]} />
            <meshStandardMaterial
              color={idx % 2 === 0 ? '#93C5FD' : '#C4B5FD'}
              roughness={0.2}
              metalness={0.4}
            />
          </mesh>
        ))}

      {/* Highlighted Anomaly / Insight Nodes (Vibrant glowing pink) */}
      <group ref={anomalyNodesRef}>
        {networkGraph.nodes
          .filter(n => n.isAnomaly)
          .map((n, idx) => (
            <group key={idx} position={n.pos}>
              {/* Core Magenta Sphere */}
              <mesh>
                <sphereGeometry args={[0.11, 32, 32]} />
                <meshStandardMaterial
                  color="#FF2A85"
                  emissive="#FF2A85"
                  emissiveIntensity={1.8}
                  roughness={0.1}
                />
              </mesh>

              {/* Outer Glowing Halo / Pulse Ring */}
              <mesh rotation={[Math.PI / 3, 0, 0]}>
                <ringGeometry args={[0.16, 0.19, 32]} />
                <meshBasicMaterial
                  color="#FF2A85"
                  transparent
                  opacity={0.65}
                  side={THREE.DoubleSide}
                  blending={THREE.AdditiveBlending}
                />
              </mesh>
            </group>
          ))}
      </group>

      {/* ─────────────────────────────────────────────────────
          7. IN-SCENE ILLUMINATION RIG
          ───────────────────────────────────────────────────── */}
      {/* Intense Cyan-Blue glow inside the stream & glass slabs */}
      <pointLight
        position={[1.8, 0.3, 0.4]}
        intensity={5.5}
        distance={9}
        decay={2}
        color="#38BDF8"
      />

      {/* Vibrant Magenta-Pink glow for anomaly insight cluster */}
      <pointLight
        position={[4.1, 0.5, 0.6]}
        intensity={4.2}
        distance={7}
        decay={2}
        color="#FF2A85"
      />

      {/* Soft Blue glow over floor & cubes */}
      <pointLight
        position={[-0.4, -0.6, 0.8]}
        intensity={2.8}
        distance={8}
        decay={2}
        color="#60A5FA"
      />
    </group>
  );
};
