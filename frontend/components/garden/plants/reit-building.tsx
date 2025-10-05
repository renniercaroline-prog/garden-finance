"use client"

import { useRef } from "react"
import { Text } from "@react-three/drei"
import type { Group } from "three"
import { usePortfolio } from "@/context/portfolio-context"

interface REITBuildingProps {
  position: [number, number, number]
  ticker: string
  name: string
  shares: number
  currentPrice: number
  changePercent: number
  reitType: "residential" | "commercial" | "industrial"
  holdingId: string
}

const buildingStyles = {
  residential: { color: "#d4a574", height: 1.5, windows: 6 },
  commercial: { color: "#8a9ba8", height: 2.5, windows: 12 },
  industrial: { color: "#6a7a6a", height: 1.8, windows: 4 },
}

export default function REITBuilding({
  position,
  ticker,
  name,
  shares,
  currentPrice,
  changePercent,
  reitType,
  holdingId,
}: REITBuildingProps) {
  const groupRef = useRef<Group>(null)
  const { setSelectedHolding, portfolio } = usePortfolio()

  const style = buildingStyles[reitType]
  const size = Math.max(0.8, shares / 15)
  const occupancyRate = Math.max(0, Math.min(100, 80 + changePercent * 5))

  const handleClick = () => {
    const holding = portfolio.holdings.find((h) => h.id === holdingId)
    if (holding) {
      setSelectedHolding(holding)
    }
  }

  return (
    <group ref={groupRef} position={position} onClick={handleClick}>
      {/* Foundation */}
      <mesh position={[0, 0.05, 0]} receiveShadow>
        <boxGeometry args={[size * 1.2, 0.1, size * 1.2]} />
        <meshStandardMaterial color="#4a4a4a" roughness={0.9} />
      </mesh>

      {/* Main building */}
      <mesh position={[0, style.height / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[size, style.height, size]} />
        <meshStandardMaterial color={style.color} roughness={0.7} />
      </mesh>

      {/* Windows */}
      {Array.from({ length: style.windows }).map((_, i) => {
        const row = Math.floor(i / 3)
        const col = i % 3
        const isLit = Math.random() * 100 < occupancyRate

        return (
          <mesh
            key={i}
            position={[(col - 1) * (size / 4), 0.3 + row * (style.height / (style.windows / 3 + 1)), size / 2 + 0.01]}
          >
            <planeGeometry args={[size / 6, size / 6]} />
            <meshStandardMaterial
              color={isLit ? "#ffffaa" : "#2a2a2a"}
              emissive={isLit ? "#ffffaa" : "#000000"}
              emissiveIntensity={isLit ? 0.5 : 0}
            />
          </mesh>
        )
      })}

      {/* Roof */}
      <mesh position={[0, style.height + 0.1, 0]} castShadow>
        <boxGeometry args={[size * 1.1, 0.2, size * 1.1]} />
        <meshStandardMaterial color="#3a3a3a" roughness={0.8} />
      </mesh>

      {/* Sign */}
      <mesh position={[0, 0.3, size / 2 + 0.15]} rotation={[-Math.PI / 6, 0, 0]} castShadow>
        <boxGeometry args={[size * 0.8, 0.3, 0.05]} />
        <meshStandardMaterial color="#f5f1e8" />
      </mesh>

      <Text
        position={[0, 0.35, size / 2 + 0.18]}
        rotation={[-Math.PI / 6, 0, 0]}
        fontSize={0.1}
        color="#2d5016"
        anchorX="center"
        anchorY="middle"
        font="/fonts/Geist-Bold.ttf"
      >
        {ticker}
      </Text>

      <Text
        position={[0, 0.25, size / 2 + 0.18]}
        rotation={[-Math.PI / 6, 0, 0]}
        fontSize={0.07}
        color="#5a6650"
        anchorX="center"
        anchorY="middle"
        font="/fonts/Geist-Regular.ttf"
      >
        {occupancyRate.toFixed(0)}% occupied
      </Text>
    </group>
  )
}
