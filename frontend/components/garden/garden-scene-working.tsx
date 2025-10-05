"use client"
import { Sky, Text, Html } from "@react-three/drei"
import FirstPersonControls from "./controls/first-person-controls"
import { usePortfolio } from "@/context/portfolio-context"
import type { Holding } from "@/lib/types"

export default function GardenScene() {
  const { portfolio } = usePortfolio()

  console.log("🌿 Garden Scene Rendering...")
  console.log("📊 Holdings:", portfolio.holdings)

  return (
    <>
      {/* Background */}
      <color attach="background" args={["#87CEEB"]} />
      
      {/* Strong Lighting */}
      <ambientLight intensity={2} />
      <directionalLight position={[50, 50, 25]} intensity={3} castShadow />
      <pointLight position={[0, 10, 0]} intensity={2} />

      {/* Ground */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[100, 100]} />
        <meshStandardMaterial color="#6b8e4e" />
      </mesh>

      {/* Garden Paths */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]} receiveShadow>
        <planeGeometry args={[3, 30]} />
        <meshStandardMaterial color="#c4b5a0" />
      </mesh>

      {/* Entry Gate */}
      <group position={[0, 0, 15]}>
        <mesh position={[-2, 1.5, 0]} castShadow>
          <boxGeometry args={[0.3, 3, 0.3]} />
          <meshStandardMaterial color="#8B4513" />
        </mesh>
        <mesh position={[2, 1.5, 0]} castShadow>
          <boxGeometry args={[0.3, 3, 0.3]} />
          <meshStandardMaterial color="#8B4513" />
        </mesh>
        <mesh position={[0, 2.8, 0]} castShadow>
          <boxGeometry args={[4.5, 0.3, 0.3]} />
          <meshStandardMaterial color="#8B4513" />
        </mesh>
      </group>

      {/* Central Fountain */}
      <group position={[0, 0, 0]}>
        <mesh position={[0, 0.5, 0]} castShadow>
          <cylinderGeometry args={[1.5, 1.5, 1, 32]} />
          <meshStandardMaterial color="#888888" />
        </mesh>
        <mesh position={[0, 1, 0]}>
          <cylinderGeometry args={[1.4, 1.4, 0.2, 32]} />
          <meshStandardMaterial color="#4a9eff" transparent opacity={0.7} />
        </mesh>
        <Text position={[0, 2, 0]} fontSize={0.3} color="white" anchorX="center">
          ${Math.round(portfolio.totalValue).toLocaleString()}
        </Text>
      </group>

      {/* Portfolio Holdings removed - clean garden for new design */}

      {/* Sky */}
      <Sky 
        distance={450000} 
        sunPosition={[100, 20, 100]} 
        inclination={0.6} 
        azimuth={0.25}
      />

      {/* Controls */}
      <FirstPersonControls />
    </>
  )
}

