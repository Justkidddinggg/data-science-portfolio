import React from 'react';

/**
 * Lighting rig for the 3D geometric scene.
 * Creates soft, atmospheric lighting with pastel accents matching the color palette.
 */
export const SceneLighting: React.FC = () => {
  return (
    <>
      {/* Gentle ambient fill matching the slate blue background */}
      <ambientLight intensity={0.9} color="#45567a" />

      {/* Main directional key light */}
      <directionalLight
        position={[8, 10, 6]}
        intensity={2.2}
        color="#ffffff"
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-near={0.5}
        shadow-camera-far={25}
        shadow-bias={-0.0005}
      />

      {/* Pastel Pink fill light from the left */}
      <pointLight
        position={[-6, 3, 3]}
        intensity={3.5}
        distance={18}
        decay={2}
        color="#F3A6C8"
      />

      {/* Lavender accent light from top-right */}
      <pointLight
        position={[6, 5, 2]}
        intensity={3.2}
        distance={16}
        decay={2}
        color="#B8A8F4"
      />

      {/* Soft Blue rim/back light */}
      <pointLight
        position={[0, -4, -3]}
        intensity={2.0}
        distance={14}
        decay={2}
        color="#8DBBE8"
      />
    </>
  );
};
