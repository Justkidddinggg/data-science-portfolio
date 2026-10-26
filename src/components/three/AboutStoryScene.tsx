import React, { Suspense, useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { AboutDataTransformation } from './AboutDataTransformation';

interface AboutStorySceneProps {
  progress: number;
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

/** Fallback illustration representing data transformation */
const FallbackIllustration: React.FC<{ progress: number }> = ({ progress }) => (
  <div
    style={{
      width: '100%',
      height: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      pointerEvents: 'none',
    }}
  >
    <svg viewBox="0 0 500 500" style={{ width: '80%', maxWidth: 380, opacity: 0.7 }}>
      <circle
        cx="250"
        cy="250"
        r={120 + Math.sin(progress * Math.PI) * 30}
        fill="none"
        stroke={progress > 0.65 ? '#FF2A85' : progress > 0.35 ? '#38BDF8' : '#A78BFA'}
        strokeWidth="1.5"
        strokeDasharray={progress > 0.65 ? 'none' : '4 6'}
      />
      <circle cx="250" cy="250" r="16" fill={progress > 0.65 ? '#FF2A85' : '#38BDF8'} />
    </svg>
  </div>
);

export const AboutStoryScene: React.FC<AboutStorySceneProps> = ({
  progress,
  reducedMotion = false,
}) => {
  const [hasWebGL, setHasWebGL] = useState(true);

  useEffect(() => {
    setHasWebGL(checkWebGL());
  }, []);

  if (!hasWebGL) return <FallbackIllustration progress={progress} />;

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      <Suspense fallback={<FallbackIllustration progress={progress} />}>
        <Canvas
          camera={{ position: [0, 0, 4.8], fov: 46 }}
          dpr={[1, 1.5]}
          gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
          style={{ width: '100%', height: '100%' }}
        >
          <ambientLight intensity={0.75} color="#1E293B" />
          <directionalLight position={[4, 6, 5]} intensity={1.5} color="#FFFFFF" />
          <pointLight position={[-3, 2, 3]} intensity={2.5} color="#38BDF8" distance={10} decay={2} />
          <pointLight position={[3, -2, 2]} intensity={2.2} color="#C084FC" distance={10} decay={2} />
          
          <AboutDataTransformation progress={progress} reducedMotion={reducedMotion} />
        </Canvas>
      </Suspense>
    </div>
  );
};
