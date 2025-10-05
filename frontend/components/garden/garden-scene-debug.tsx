"use client"

// MINIMAL DEBUG VERSION - Replace garden-scene.tsx content with this temporarily
// to test if Canvas/WebGL works at all

export default function GardenScene() {
  console.log("🌿 Garden Scene Rendering...")

  return (
    <>
      {/* SUPER BRIGHT LIGHTING */}
      <ambientLight intensity={5} />
      <pointLight position={[10, 10, 10]} intensity={20} />
      <directionalLight position={[0, 10, 0]} intensity={5} />

      {/* TEST OBJECTS - Should be VERY visible */}
      <mesh position={[0, 2, 0]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial 
          color="hotpink" 
          emissive="hotpink" 
          emissiveIntensity={1.0} 
        />
      </mesh>

      <mesh position={[3, 1, 0]}>
        <sphereGeometry args={[1]} />
        <meshStandardMaterial 
          color="yellow" 
          emissive="yellow" 
          emissiveIntensity={1.0} 
        />
      </mesh>

      <mesh position={[-3, 1, 0]}>
        <cylinderGeometry args={[0.5, 0.5, 2]} />
        <meshStandardMaterial 
          color="cyan" 
          emissive="cyan" 
          emissiveIntensity={1.0} 
        />
      </mesh>

      {/* BRIGHT GREEN GROUND */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <planeGeometry args={[100, 100]} />
        <meshStandardMaterial 
          color="#00ff00" 
          emissive="#00ff00" 
          emissiveIntensity={0.5} 
        />
      </mesh>

      {/* Sky-like background color */}
      <color attach="background" args={["#87CEEB"]} />
    </>
  )
}

