"use client"

import { useRef } from "react"
import { Text } from "@react-three/drei"
import type { Mesh } from "three"

interface EntryGateProps {
  position: [number, number, number]
}

export default function EntryGate({ position }: EntryGateProps) {
  const gateRef = useRef<Mesh>(null)

  return (
    <group position={position}>
      {/* Left post */}
      <mesh position={[-2, 1.5, 0]} castShadow>
        <boxGeometry args={[0.3, 3, 0.3]} />
        <meshStandardMaterial color="#5a4a3a" roughness={0.8} />
      </mesh>

      {/* Right post */}
      <mesh position={[2, 1.5, 0]} castShadow>
        <boxGeometry args={[0.3, 3, 0.3]} />
        <meshStandardMaterial color="#5a4a3a" roughness={0.8} />
      </mesh>

      {/* Top beam */}
      <mesh position={[0, 3, 0]} castShadow>
        <boxGeometry args={[4.6, 0.2, 0.3]} />
        <meshStandardMaterial color="#5a4a3a" roughness={0.8} />
      </mesh>

      {/* Welcome sign */}
      <mesh position={[0, 2.5, 0.2]} castShadow>
        <boxGeometry args={[2.5, 0.8, 0.1]} />
        <meshStandardMaterial color="#f5f1e8" />
      </mesh>

      {/* Text on sign */}
      <Text
        position={[0, 2.5, 0.26]}
        fontSize={0.25}
        color="#2d5016"
        anchorX="center"
        anchorY="middle"
        font="/fonts/Geist-Bold.ttf"
      >
        Garden Finance
      </Text>

      <Text
        position={[0, 2.2, 0.26]}
        fontSize={0.12}
        color="#5a6650"
        anchorX="center"
        anchorY="middle"
        font="/fonts/Geist-Regular.ttf"
      >
        Grow Your Wealth
      </Text>
    </group>
  )
}
