import React from 'react';

/**
 * Lighting rig tailored for the DATA IN MOTION visualization.
 * Creates deep atmospheric navy mood, sharp highlights on glass monoliths and glossy floor.
 */
export const PremiumLighting: React.FC = () => (
  <>
    {/* Deep navy ambient fill */}
    <ambientLight intensity={0.65} color="#151E33" />

    {/* Primary directional studio key light */}
    <directionalLight
      position={[7, 9, 6]}
      intensity={1.8}
      color="#FFFFFF"
    />

    {/* Soft cool fill from upper-left */}
    <pointLight
      position={[-5, 4, 3]}
      intensity={2.2}
      distance={16}
      decay={2}
      color="#93C5FD"
    />

    {/* Rim light from behind to highlight glass monolith borders */}
    <directionalLight
      position={[-2, 3, -4]}
      intensity={1.1}
      color="#C4B5FD"
    />
  </>
);
