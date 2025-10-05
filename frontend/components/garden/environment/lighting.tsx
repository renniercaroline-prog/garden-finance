"use client"

export default function Lighting() {
  return (
    <>
      {/* Ambient light for overall illumination */}
      <ambientLight intensity={0.6} color="#f5f1e8" />

      {/* Main sunlight */}
      <directionalLight
        position={[50, 50, 25]}
        intensity={1.2}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-far={100}
        shadow-camera-left={-50}
        shadow-camera-right={50}
        shadow-camera-top={50}
        shadow-camera-bottom={-50}
        color="#fffef0"
      />

      {/* Fill light from opposite side */}
      <directionalLight position={[-30, 20, -20]} intensity={0.3} color="#a8b5a0" />

      {/* Subtle ground bounce light */}
      <hemisphereLight args={["#e8ebe4", "#5a6650", 0.4]} position={[0, 1, 0]} />
    </>
  )
}
