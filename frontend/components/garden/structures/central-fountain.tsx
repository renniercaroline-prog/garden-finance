"use client"

import { useRef } from "react"
import { useFrame } from "@react-three/fiber"
import { Text } from "@react-three/drei"
import type { Mesh } from "three"

interface CentralFountainProps {
  position: [number, number, number]
  portfolioValue: number
  dailyChange: number
}

export default function CentralFountain({ position, portfolioValue, dailyChange }: CentralFountainProps) {
  const waterRef = useRef<Mesh>(null)

  // Water color based on performance
  const waterColor = dailyChange > 0 ? "#4a9eff" : dailyChange < 0 ? "#ff8a80" : "#a8b5a0"

  // Water height based on portfolio value (scaled)
  const waterHeight = Math.min((portfolioValue / 100000) * 0.5, 1.5)

  useFrame((state) => {
    if (waterRef.current) {
      // Gentle water animation
      waterRef.current.position.y = waterHeight + Math.sin(state.clock.elapsedTime * 2) * 0.05
    }
  })

  return (
    <group position={position}>
      {/* Fountain base */}
      <mesh position={[0, 0.3, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[2, 2.2, 0.6, 32]} />
        <meshStandardMaterial color="#8a7a6a" roughness={0.7} />
      </mesh>

      {/* Water */}
      <mesh ref={waterRef} position={[0, waterHeight, 0]}>
        <cylinderGeometry args={[1.8, 1.8, 0.2, 32]} />
        <meshStandardMaterial color={waterColor} transparent opacity={0.7} roughness={0.1} metalness={0.3} />
      </mesh>

      {/* Center pedestal */}
      <mesh position={[0, 1, 0]} castShadow>
        <cylinderGeometry args={[0.3, 0.4, 1.5, 16]} />
        <meshStandardMaterial color="#8a7a6a" roughness={0.7} />
      </mesh>

      {/* Portfolio value display */}
      <Text
        position={[0, 2, 0]}
        fontSize={0.3}
        color="#2d5016"
        anchorX="center"
        anchorY="middle"
        font="/fonts/Geist-Bold.ttf"
      >
        ${portfolioValue.toLocaleString()}
      </Text>

      <Text
        position={[0, 1.6, 0]}
        fontSize={0.15}
        color={dailyChange >= 0 ? "#4a7c3c" : "#c44536"}
        anchorX="center"
        anchorY="middle"
        font="/fonts/Geist-Regular.ttf"
      >
        {dailyChange >= 0 ? "+" : ""}
        {dailyChange.toFixed(2)}%
      </Text>
    </group>
  )
}
