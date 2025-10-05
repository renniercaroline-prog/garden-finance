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

      {/* Sunflower - to the right of fountain */}
      <group position={[5, 0, 0]}>
        {/* Stem */}
        <mesh position={[0, 1, 0]} castShadow>
          <cylinderGeometry args={[0.1, 0.15, 2, 16]} />
          <meshStandardMaterial color="#5a7c3e" />
        </mesh>

        {/* Flower center */}
        <mesh position={[0, 2.2, 0]} castShadow>
          <sphereGeometry args={[0.4, 32, 32]} />
          <meshStandardMaterial color="#8b5a2b" />
        </mesh>

        {/* Petals - arranged in a circle */}
        {Array.from({ length: 12 }).map((_, i) => {
          const angle = (i / 12) * Math.PI * 2
          const x = Math.cos(angle) * 0.6
          const z = Math.sin(angle) * 0.6
          return (
            <mesh
              key={i}
              position={[x, 2.2, z]}
              rotation={[0, angle, 0]}
              castShadow
            >
              <boxGeometry args={[0.3, 0.05, 0.6]} />
              <meshStandardMaterial color="#F5C542" />
            </mesh>
          )
        })}
      </group>

      {/* Red Rose - to the left of fountain */}
      <group position={[-5, 0, 0]}>
        {/* Stem */}
        <mesh position={[0, 1, 0]} castShadow>
          <cylinderGeometry args={[0.08, 0.12, 2, 16]} />
          <meshStandardMaterial color="#2d5016" />
        </mesh>

        {/* Rose petals - layered spheres for rose shape */}
        <mesh position={[0, 2.2, 0]} castShadow>
          <sphereGeometry args={[0.3, 32, 32]} />
          <meshStandardMaterial color="#dc143c" />
        </mesh>
        <mesh position={[0, 2.3, 0]} castShadow>
          <sphereGeometry args={[0.25, 32, 32]} />
          <meshStandardMaterial color="#c41e3a" />
        </mesh>
        <mesh position={[0, 2.35, 0]} castShadow>
          <sphereGeometry args={[0.15, 32, 32]} />
          <meshStandardMaterial color="#b22234" />
        </mesh>

        {/* Outer petals */}
        {Array.from({ length: 8 }).map((_, i) => {
          const angle = (i / 8) * Math.PI * 2
          const x = Math.cos(angle) * 0.35
          const z = Math.sin(angle) * 0.35
          return (
            <mesh
              key={i}
              position={[x, 2.1, z]}
              rotation={[0, angle, Math.PI / 6]}
              castShadow
            >
              <sphereGeometry args={[0.2, 16, 16]} />
              <meshStandardMaterial color="#ff0040" />
            </mesh>
          )
        })}
      </group>

      {/* Purple Lily - to the back of fountain */}
      <group position={[0, 0, -5]}>
        {/* Stem */}
        <mesh position={[0, 1, 0]} castShadow>
          <cylinderGeometry args={[0.08, 0.1, 2, 16]} />
          <meshStandardMaterial color="#4a7c3e" />
        </mesh>

        {/* Lily center - yellow stamen */}
        <mesh position={[0, 2.2, 0]} castShadow>
          <cylinderGeometry args={[0.05, 0.05, 0.4, 8]} />
          <meshStandardMaterial color="#ffd700" />
        </mesh>

        {/* Lily petals - 6 elongated petals */}
        {Array.from({ length: 6 }).map((_, i) => {
          const angle = (i / 6) * Math.PI * 2
          const x = Math.cos(angle) * 0.4
          const z = Math.sin(angle) * 0.4
          return (
            <mesh
              key={i}
              position={[x, 2.1, z]}
              rotation={[Math.PI / 3, angle, 0]}
              castShadow
            >
              <boxGeometry args={[0.25, 0.05, 0.8]} />
              <meshStandardMaterial color="#9b59b6" />
            </mesh>
          )
        })}

        {/* Inner petals for more depth */}
        {Array.from({ length: 6 }).map((_, i) => {
          const angle = (i / 6) * Math.PI * 2 + Math.PI / 6
          const x = Math.cos(angle) * 0.25
          const z = Math.sin(angle) * 0.25
          return (
            <mesh
              key={`inner-${i}`}
              position={[x, 2.15, z]}
              rotation={[Math.PI / 4, angle, 0]}
              castShadow
            >
              <boxGeometry args={[0.2, 0.05, 0.6]} />
              <meshStandardMaterial color="#8e44ad" />
            </mesh>
          )
        })}
      </group>

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

