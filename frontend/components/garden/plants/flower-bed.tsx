"use client"

import { useRef } from "react"
import { useFrame } from "@react-three/fiber"
import { Text } from "@react-three/drei"
import type { Group, Mesh } from "three"
import { usePortfolio } from "@/context/portfolio-context"
import type { Sector } from "@/lib/types"

interface FlowerBedProps {
  position: [number, number, number]
  ticker: string
  companyName: string
  shares: number
  currentPrice: number
  changePercent: number
  sector: Sector
  holdingId: string
}

const sectorColors = {
  technology: "#6b7fff",
  healthcare: "#ffb3d9",
  energy: "#ffd966",
  finance: "#ffd700",
  consumer: "#ff9999",
  realestate: "#90ee90",
  materials: "#a0a0a0",
  utilities: "#87ceeb",
}

export default function FlowerBed({
  position,
  ticker,
  companyName,
  shares,
  currentPrice,
  changePercent,
  sector,
  holdingId,
}: FlowerBedProps) {
  const groupRef = useRef<Group>(null)
  const flowerRef = useRef<Mesh>(null)
  const { setSelectedHolding, portfolio } = usePortfolio()

  const flowerColor = sectorColors[sector]
  const health = Math.max(0, Math.min(100, 50 + changePercent * 10))
  const size = Math.max(0.5, shares / 10)

  const handleClick = () => {
    const holding = portfolio.holdings.find((h) => h.id === holdingId)
    if (holding) {
      setSelectedHolding(holding)
    }
  }

  useFrame((state) => {
    if (flowerRef.current) {
      // Gentle swaying
      flowerRef.current.rotation.z = Math.sin(state.clock.elapsedTime + position[0]) * 0.1

      // Bloom/wilt based on performance
      const targetScale = health / 100
      flowerRef.current.scale.lerp({ x: targetScale, y: targetScale, z: targetScale } as any, 0.05)
    }
  })

  return (
    <group ref={groupRef} position={position} onClick={handleClick}>
      {/* Soil bed */}
      <mesh position={[0, 0.05, 0]} receiveShadow>
        <cylinderGeometry args={[1.2, 1.2, 0.1, 16]} />
        <meshStandardMaterial color="#4a3a2a" roughness={0.95} />
      </mesh>

      {/* Flower stem */}
      <mesh position={[0, size / 2, 0]} castShadow>
        <cylinderGeometry args={[0.05, 0.05, size]} />
        <meshStandardMaterial color="#5a8a3a" />
      </mesh>

      {/* Flower bloom */}
      <mesh ref={flowerRef} position={[0, size, 0]} castShadow>
        <sphereGeometry args={[0.3, 16, 16]} />
        <meshStandardMaterial
          color={flowerColor}
          emissive={flowerColor}
          emissiveIntensity={health > 80 ? 0.3 : 0}
          roughness={0.4}
        />
      </mesh>

      {/* Petals */}
      {[0, 1, 2, 3, 4].map((i) => (
        <mesh
          key={i}
          position={[Math.cos((i / 5) * Math.PI * 2) * 0.25, size, Math.sin((i / 5) * Math.PI * 2) * 0.25]}
          castShadow
        >
          <sphereGeometry args={[0.15, 8, 8]} />
          <meshStandardMaterial color={flowerColor} roughness={0.5} />
        </mesh>
      ))}

      {/* Name plaque */}
      <mesh position={[0, 0.15, 1]} rotation={[-Math.PI / 6, 0, 0]} castShadow>
        <boxGeometry args={[1, 0.3, 0.05]} />
        <meshStandardMaterial color="#f5f1e8" />
      </mesh>

      <Text
        position={[0, 0.2, 1.03]}
        rotation={[-Math.PI / 6, 0, 0]}
        fontSize={0.12}
        color="#2d5016"
        anchorX="center"
        anchorY="middle"
        font="/fonts/Geist-Bold.ttf"
      >
        {ticker}
      </Text>

      <Text
        position={[0, 0.1, 1.03]}
        rotation={[-Math.PI / 6, 0, 0]}
        fontSize={0.08}
        color="#5a6650"
        anchorX="center"
        anchorY="middle"
        font="/fonts/Geist-Regular.ttf"
      >
        {shares} shares
      </Text>
    </group>
  )
}
