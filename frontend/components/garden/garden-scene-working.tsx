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

      {/* Greenhouse */}
      <group position={[12, 0, -6]}>
        <mesh position={[0, 2, 0]}>
          <boxGeometry args={[4, 4, 4]} />
          <meshPhysicalMaterial color="#88ccff" transparent opacity={0.3} />
        </mesh>
        <mesh position={[0, 0.1, 0]}>
          <boxGeometry args={[4.2, 0.2, 4.2]} />
          <meshStandardMaterial color="#654321" />
        </mesh>
      </group>

      {/* Render Portfolio Holdings as Simple Objects */}
      {portfolio.holdings.map((holding: Holding, index: number) => {
        const pos = holding.position || [index * 2 - 8, 0, -5]
        
        try {
          switch (holding.type) {
            case "stock":
              // Flower (sphere on stick)
              return (
                <group key={holding.id} position={pos}>
                  <mesh position={[0, 0.5, 0]} castShadow>
                    <cylinderGeometry args={[0.05, 0.05, 1]} />
                    <meshStandardMaterial color="#2d5016" />
                  </mesh>
                  <mesh position={[0, 1, 0]} castShadow>
                    <sphereGeometry args={[0.3, 16, 16]} />
                    <meshStandardMaterial 
                      color={holding.changePercent >= 0 ? "#ff69b4" : "#8b4513"} 
                      emissive={holding.changePercent >= 0 ? "#ff69b4" : "#000000"}
                      emissiveIntensity={0.3}
                    />
                  </mesh>
                  <Text position={[0, 1.5, 0]} fontSize={0.15} color="white" anchorX="center">
                    {holding.ticker}
                  </Text>
                  <Html position={[0, 0.2, 0]} center>
                    <div style={{background: 'rgba(0,0,0,0.7)', color: 'white', padding: '2px 6px', borderRadius: '4px', fontSize: '10px'}}>
                      {holding.changePercent >= 0 ? '▲' : '▼'} {holding.changePercent.toFixed(1)}%
                    </div>
                  </Html>
                </group>
              )
              
            case "bond":
              // Tree
              return (
                <group key={holding.id} position={pos}>
                  <mesh position={[0, 1.5, 0]} castShadow>
                    <cylinderGeometry args={[0.2, 0.3, 3]} />
                    <meshStandardMaterial color="#654321" />
                  </mesh>
                  <mesh position={[0, 3, 0]} castShadow>
                    <sphereGeometry args={[1, 16, 16]} />
                    <meshStandardMaterial color="#228b22" />
                  </mesh>
                  <Text position={[0, 4.5, 0]} fontSize={0.15} color="white" anchorX="center">
                    Bond {holding.yield}%
                  </Text>
                </group>
              )
              
            case "crypto":
              // Glowing Crystal
              return (
                <group key={holding.id} position={pos}>
                  <mesh position={[0, 1, 0]} castShadow rotation={[0, Math.PI / 4, 0]}>
                    <octahedronGeometry args={[0.5]} />
                    <meshStandardMaterial 
                      color={holding.symbol === 'BTC' ? '#ffd700' : '#c0c0c0'} 
                      emissive={holding.symbol === 'BTC' ? '#ffd700' : '#c0c0c0'}
                      emissiveIntensity={0.5}
                      metalness={0.9}
                    />
                  </mesh>
                  <pointLight position={[0, 1, 0]} intensity={1} color={holding.symbol === 'BTC' ? '#ffd700' : '#c0c0c0'} />
                  <Text position={[0, 1.8, 0]} fontSize={0.15} color="white" anchorX="center">
                    {holding.symbol}
                  </Text>
                </group>
              )
              
            case "reit":
              // Building
              return (
                <group key={holding.id} position={pos}>
                  <mesh position={[0, 0.75, 0]} castShadow>
                    <boxGeometry args={[1, 1.5, 1]} />
                    <meshStandardMaterial color="#8b7355" />
                  </mesh>
                  <mesh position={[0, 1.6, 0]} castShadow>
                    <coneGeometry args={[0.7, 0.5, 4]} />
                    <meshStandardMaterial color="#654321" />
                  </mesh>
                  <Text position={[0, 2.2, 0]} fontSize={0.12} color="white" anchorX="center">
                    {holding.ticker}
                  </Text>
                </group>
              )
              
            default:
              return null
          }
        } catch (error) {
          console.error("Error rendering holding:", holding.id, error)
          return null
        }
      })}

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

