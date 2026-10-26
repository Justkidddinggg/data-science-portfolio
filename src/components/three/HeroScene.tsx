import React, { Suspense, useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { DataInMotion } from './DataInMotion';
import { PremiumLighting } from './PremiumLighting';

interface HeroSceneProps {
  reducedMotion?: boolean;
}

function checkWebGL(): boolean {
  if (typeof window === 'undefined') return true;
  try {
    const c = document.createElement('canvas');
    return Boolean(
      window.WebGLRenderingContext &&
        (c.getContext('webgl') || c.getContext('experimental-webgl'))
    );
  } catch {
    return false;
  }
}

/** 
 * High-quality SVG Fallback representing the "DATA IN MOTION" concept
 * when WebGL is unavailable or during initial canvas loading.
 */
const SVGFallback: React.FC<{ dark?: boolean }> = ({ dark = true }) => (
  <div
    style={{
      position: 'absolute',
      inset: 0,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      pointerEvents: 'none',
      overflow: 'hidden',
    }}
  >
    <svg
      viewBox="0 0 900 600"
      style={{
        width: '100%',
        maxWidth: 920,
        height: 'auto',
        opacity: dark ? 0.75 : 0.55,
      }}
    >
      <defs>
        <linearGradient id="streamGrad1" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#93C5FD" stopOpacity="0.1" />
          <stop offset="50%" stopColor="#C4B5FD" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#93C5FD" stopOpacity="0.6" />
        </linearGradient>
        <linearGradient id="streamGrad2" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#C4B5FD" stopOpacity="0.15" />
          <stop offset="50%" stopColor="#F472B6" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#93C5FD" stopOpacity="0.5" />
        </linearGradient>
      </defs>

      {/* Streamline Trajectories */}
      <path
        d="M 100 240 C 300 210, 480 320, 850 280"
        fill="none"
        stroke="url(#streamGrad1)"
        strokeWidth="2"
      />
      <path
        d="M 120 320 C 340 340, 520 220, 880 230"
        fill="none"
        stroke="url(#streamGrad2)"
        strokeWidth="1.8"
      />
      <path
        d="M 80 400 C 310 390, 500 360, 840 340"
        fill="none"
        stroke="url(#streamGrad1)"
        strokeWidth="1.5"
        strokeDasharray="4 4"
      />

      {/* Structured Transformation Network Lines */}
      <line x1="420" y1="260" x2="520" y2="230" stroke="#A1A1A6" strokeWidth="0.8" opacity="0.4" />
      <line x1="520" y1="230" x2="620" y2="270" stroke="#A1A1A6" strokeWidth="0.8" opacity="0.4" />
      <line x1="420" y1="260" x2="480" y2="340" stroke="#A1A1A6" strokeWidth="0.8" opacity="0.4" />
      <line x1="480" y1="340" x2="620" y2="270" stroke="#A1A1A6" strokeWidth="0.8" opacity="0.4" />

      {/* Network Nodes */}
      <circle cx="420" cy="260" r="5" fill="#C4B5FD" />
      <circle cx="520" cy="230" r="4.5" fill="#93C5FD" />
      <circle cx="480" cy="340" r="4" fill="#C4B5FD" />
      <circle cx="620" cy="270" r="5" fill="#93C5FD" />

      {/* Highlighted Anomaly Node */}
      <circle cx="520" cy="230" r="8" fill="none" stroke="#F472B6" strokeWidth="1.5" opacity="0.8" />
      <circle cx="520" cy="230" r="4" fill="#F472B6" />

      {/* Dispersed Raw Particles on the Left */}
      {[
        [140, 220], [180, 260], [210, 190], [160, 310], [220, 350], [250, 290],
        [280, 240], [290, 330], [330, 220], [350, 360]
      ].map(([cx, cy], i) => (
        <circle key={i} cx={cx} cy={cy} r="2.2" fill={i % 3 === 0 ? '#C4B5FD' : '#93C5FD'} opacity="0.65" />
      ))}

      {/* Converged Structured Particles on the Right */}
      {[
        [680, 260], [710, 255], [740, 250], [780, 248], [820, 244],
        [690, 290], [730, 285], [770, 282], [810, 280]
      ].map(([cx, cy], i) => (
        <circle key={`r-${i}`} cx={cx} cy={cy} r="2.5" fill={i % 2 === 0 ? '#FFFFFF' : '#93C5FD'} opacity="0.85" />
      ))}
    </svg>
  </div>
);

export const HeroScene: React.FC<HeroSceneProps> = ({ reducedMotion = false }) => {
  const [hasWebGL, setHasWebGL] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setHasWebGL(checkWebGL());
    const onResize = () => setIsMobile(window.innerWidth < 1024);
    onResize();
    window.addEventListener('resize', onResize, { passive: true });
    return () => window.removeEventListener('resize', onResize);
  }, []);

  if (!hasWebGL) return <SVGFallback />;

  // Camera positioned on desktop to balance text on left and 3D on right;
  // on mobile, pulled back slightly to accommodate stacked layout.
  const camPos: [number, number, number] = isMobile ? [0, -0.2, 7.8] : [0.6, 0.1, 6.2];

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'auto',
      }}
      aria-hidden="true"
    >
      <Suspense fallback={<SVGFallback />}>
        <Canvas
          camera={{
            position: camPos,
            fov: isMobile ? 54 : 46,
            near: 0.1,
            far: 60,
          }}
          dpr={[1, isMobile ? 1 : 1.5]}
          gl={{ antialias: true, powerPreference: 'high-performance', alpha: true }}
          shadows={false}
          style={{ width: '100%', height: '100%' }}
        >
          <PremiumLighting />
          <DataInMotion reducedMotion={reducedMotion} />
        </Canvas>
      </Suspense>
    </div>
  );
};

export { SVGFallback };
