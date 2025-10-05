"use client"

import { useRef } from "react"
import { useFrame } from "@react-three/fiber"
import { Text } from "@react-three/drei"
import type { Group, Mesh } from "three"
import { usePortfolio } from "@/context/portfolio-context"

interface CryptoPlantProps {
  position: [number, number, number]
  symbol: string
  name: string
  amount: number
  currentPrice: number
  changePercent: number
  holdingId: string
}

const cryptoColors: Record<string, string> = {
  BTC: "#f7931a",
  ETH: "#627eea",
  SOL: "#14f195",
  ADA: "#0033ad",
  DOT: "#e6007a",
}

export default function CryptoPlant({
  position,
  symbol,
  name,
  amount,
  currentPrice,
  changePercent,
  holdingId,
}: CryptoPlantProps) {
  const groupRef = useRef<Group>(null)
  const crystalRef = useRef<Mesh>(null)
  const { setSelectedHolding, portfolio } = usePortfolio()

  const color = cryptoColors[symbol] || "#00d4ff"
  const volatility = Math.abs(changePercent)
  const size = Math.max(0.5, (amount * currentPrice) / 10000)

  const handleClick = () => {
    const holding = portfolio.holdings.find((h) => h.id === holdingId)
    if (holding) {
      setSelectedHolding(holding)
    }
  }

  useFrame((state) => {
    if (crystalRef.current) {
      // Pulsing glow effect
      crystalRef.current.rotation.y = state.clock.elapsedTime * 0.5
      const pulse = Math.sin(state.clock.elapsedTime * 2) * 0.5 + 0.5
      crystalRef.current.scale.setScalar(size * (1 + pulse * 0.1))
    }
  })

  return (
    <group ref={groupRef} position={position} onClick={handleClick}>
      {/* Base platform */}
      <mesh position={[0, 0.05, 0]} receiveShadow>
        <cylinderGeometry args={[0.8, 0.8, 0.1, 16]} />
        <meshStandardMaterial color="#2a2a2a" metalness={0.8} roughness={0.2} />
      </mesh>

      {/* Crystal structure */}
      <mesh ref={crystalRef} position={[0, size * 0.8, 0]} castShadow>
        <octahedronGeometry args={[size * 0.6, 0]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.5 + volatility * 0.1}
          metalness={0.9}
          roughness={0.1}
          transparent
          opacity={0.9}
        />
      </mesh>

      {/* Energy particles */}
      {[0, 1, 2, 3].map((i) => (
        <mesh
          key={i}
          position={[
            Math.cos((i / 4) * Math.PI * 2) * 0.5,
            size * 0.8 + Math.sin((i / 4) * Math.PI * 2) * 0.3,
            Math.sin((i / 4) * Math.PI * 2) * 0.5,
          ]}
        >
          <sphereGeometry args={[0.08, 8, 8]} />
          <meshStandardMaterial color={color} emissive={color} emissiveIntensity={1} />
        </mesh>
      ))}

      {/* Info display */}
      <mesh position={[0, 0.2, 0.9]} rotation={[-Math.PI / 6, 0, 0]} castShadow>
        <boxGeometry args={[1, 0.35, 0.05]} />
        <meshStandardMaterial color="#1a1a1a" metalness={0.5} roughness={0.5} />
      </mesh>

      <Text
        position={[0, 0.3, 0.93]}
        rotation={[-Math.PI / 6, 0, 0]}
        fontSize={0.12}
        color={color}
        anchorX="center"
        anchorY="middle"
        font="/fonts/Geist-Bold.ttf"
      >
        {symbol}
      </Text>

      <Text
        position={[0, 0.15, 0.93]}
        rotation={[-Math.PI / 6, 0, 0]}
        fontSize={0.08}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
        font="/fonts/Geist-Regular.ttf"
      >
        {amount.toFixed(4)} • ${currentPrice.toLocaleString()}
      </Text>
    </group>
  )
}
