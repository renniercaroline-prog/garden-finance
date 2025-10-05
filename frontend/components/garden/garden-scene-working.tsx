"use client"
import { Sky, Text, Html } from "@react-three/drei"
import { useRef, useMemo } from "react"
import { useFrame } from "@react-three/fiber"
import FirstPersonControls from "./controls/first-person-controls"
import { usePortfolio } from "@/context/portfolio-context"
import type { Holding } from "@/lib/types"
import * as THREE from "three"

function WaterFountain({ portfolioValue }: { portfolioValue: number }) {
  const waterParticlesRef = useRef<THREE.Points>(null)
  const waterRef = useRef<THREE.Mesh>(null)

  // Create water droplet particles
  const particleCount = 100
  const particles = useMemo(() => {
    const positions = new Float32Array(particleCount * 3)
    const velocities = new Float32Array(particleCount * 3)

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3
      // Start at fountain center
      positions[i3] = 0
      positions[i3 + 1] = 1
      positions[i3 + 2] = 0

      // Random velocity for water splash
      const angle = Math.random() * Math.PI * 2
      const speed = 0.5 + Math.random() * 1
      velocities[i3] = Math.cos(angle) * speed
      velocities[i3 + 1] = 2 + Math.random() * 2
      velocities[i3 + 2] = Math.sin(angle) * speed
    }

    return { positions, velocities }
  }, [])

  useFrame((state, delta) => {
    if (waterParticlesRef.current) {
      const positions = waterParticlesRef.current.geometry.attributes.position.array as Float32Array
      const velocities = particles.velocities

      for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3

        // Update positions based on velocity
        positions[i3] += velocities[i3] * delta
        positions[i3 + 1] += velocities[i3 + 1] * delta
        positions[i3 + 2] += velocities[i3 + 2] * delta

        // Apply gravity
        velocities[i3 + 1] -= 9.8 * delta

        // Reset particle if it falls below fountain
        if (positions[i3 + 1] < 0.5) {
          positions[i3] = (Math.random() - 0.5) * 0.3
          positions[i3 + 1] = 1.2
          positions[i3 + 2] = (Math.random() - 0.5) * 0.3

          const angle = Math.random() * Math.PI * 2
          const speed = 0.5 + Math.random() * 1
          velocities[i3] = Math.cos(angle) * speed
          velocities[i3 + 1] = 2 + Math.random() * 2
          velocities[i3 + 2] = Math.sin(angle) * speed
        }
      }

      waterParticlesRef.current.geometry.attributes.position.needsUpdate = true
    }

    // Animate water level
    if (waterRef.current) {
      waterRef.current.position.y = 1 + Math.sin(state.clock.elapsedTime * 2) * 0.05
    }
  })

  return (
    <group position={[0, 0, 0]}>
      {/* Fountain base */}
      <mesh position={[0, 0.5, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[1.5, 1.5, 1, 32]} />
        <meshStandardMaterial color="#888888" />
      </mesh>

      {/* Water */}
      <mesh ref={waterRef} position={[0, 1, 0]}>
        <cylinderGeometry args={[1.4, 1.4, 0.2, 32]} />
        <meshStandardMaterial color="#4a9eff" transparent opacity={0.7} />
      </mesh>

      {/* Water particles */}
      <points ref={waterParticlesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={particleCount}
            array={particles.positions}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.1}
          color="#4a9eff"
          transparent
          opacity={0.6}
          sizeAttenuation
        />
      </points>

      {/* Portfolio value display - on the front of the fountain */}
      <Text
        position={[0, 0.5, 1.5]}
        fontSize={0.25}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        ${Math.round(portfolioValue).toLocaleString()}
      </Text>
    </group>
  )
}

interface Investment {
  id: number
  name: string
  type: "startup" | "cause" | "currency"
}

interface GardenSceneProps {
  onFlowerClick?: (flowerType: "startups" | "causes" | "currencies") => void
  controlsEnabled?: boolean
  investments?: Investment[]
  onInvestmentClick?: (investment: Investment) => void
}

export default function GardenScene({ onFlowerClick, controlsEnabled = true, investments = [], onInvestmentClick }: GardenSceneProps = {}) {
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

      {/* Animated Water Fountain */}
      <WaterFountain portfolioValue={portfolio.totalValue} />

      {/* Portfolio Holdings removed - clean garden for new design */}

      {/* Sunflower - to the right of fountain */}
      <group
        position={[5, 0, 0]}
        onClick={(e) => {
          e.stopPropagation()
          onFlowerClick?.("startups")
        }}
        onPointerOver={(e) => {
          e.stopPropagation()
          document.body.style.cursor = "pointer"
        }}
        onPointerOut={(e) => {
          e.stopPropagation()
          document.body.style.cursor = "default"
        }}
      >
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

        {/* Label */}
        <Text position={[0, 3, 0]} fontSize={0.3} color="white" anchorX="center">
          Startups
        </Text>
      </group>

      {/* Small sunflowers for invested startups */}
      {investments
        .filter((inv) => inv.type === "startup")
        .map((investment, index) => {
          // Radial positioning around the main sunflower
          const angle = (index / Math.max(investments.filter((inv) => inv.type === "startup").length, 1)) * Math.PI * 2
          const radius = 2.5
          const x = 5 + Math.cos(angle) * radius
          const z = 0 + Math.sin(angle) * radius

          return (
            <group
              key={investment.id}
              position={[x, 0, z]}
              onClick={(e) => {
                e.stopPropagation()
                onInvestmentClick?.(investment)
              }}
              onPointerOver={(e) => {
                e.stopPropagation()
                document.body.style.cursor = "pointer"
              }}
              onPointerOut={(e) => {
                e.stopPropagation()
                document.body.style.cursor = "default"
              }}
            >
              {/* Stem */}
              <mesh position={[0, 0.5, 0]} castShadow>
                <cylinderGeometry args={[0.05, 0.08, 1, 16]} />
                <meshStandardMaterial color="#5a7c3e" />
              </mesh>

              {/* Flower center */}
              <mesh position={[0, 1.1, 0]} castShadow>
                <sphereGeometry args={[0.2, 32, 32]} />
                <meshStandardMaterial color="#8b5a2b" />
              </mesh>

              {/* Petals */}
              {Array.from({ length: 8 }).map((_, i) => {
                const petalAngle = (i / 8) * Math.PI * 2
                const px = Math.cos(petalAngle) * 0.3
                const pz = Math.sin(petalAngle) * 0.3
                return (
                  <mesh
                    key={i}
                    position={[px, 1.1, pz]}
                    rotation={[0, petalAngle, 0]}
                    castShadow
                  >
                    <boxGeometry args={[0.15, 0.03, 0.3]} />
                    <meshStandardMaterial color="#F5C542" />
                  </mesh>
                )
              })}

              {/* Label with startup name */}
              <Text position={[0, 1.5, 0]} fontSize={0.12} color="white" anchorX="center">
                {investment.name}
              </Text>
            </group>
          )
        })}

      {/* Red Rose - to the left of fountain */}
      <group
        position={[-5, 0, 0]}
        onClick={(e) => {
          e.stopPropagation()
          onFlowerClick?.("causes")
        }}
        onPointerOver={(e) => {
          e.stopPropagation()
          document.body.style.cursor = "pointer"
        }}
        onPointerOut={(e) => {
          e.stopPropagation()
          document.body.style.cursor = "default"
        }}
      >
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

        {/* Label */}
        <Text position={[0, 3, 0]} fontSize={0.3} color="white" anchorX="center">
          Donations
        </Text>
      </group>

      {/* Purple Lily - to the back of fountain */}
      <group
        position={[0, 0, -5]}
        onClick={(e) => {
          e.stopPropagation()
          onFlowerClick?.("currencies")
        }}
        onPointerOver={(e) => {
          e.stopPropagation()
          document.body.style.cursor = "pointer"
        }}
        onPointerOut={(e) => {
          e.stopPropagation()
          document.body.style.cursor = "default"
        }}
      >
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

        {/* Label */}
        <Text position={[0, 3, 0]} fontSize={0.3} color="white" anchorX="center">
          Currencies
        </Text>
      </group>

      {/* Sky */}
      <Sky
        distance={450000}
        sunPosition={[100, 20, 100]}
        inclination={0.6}
        azimuth={0.25}
      />

      {/* Controls */}
      <FirstPersonControls enabled={controlsEnabled} />
    </>
  )
}

