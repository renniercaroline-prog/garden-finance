"use client"

import { useRef } from "react"
import { useFrame } from "@react-three/fiber"
import { Text } from "@react-three/drei"
import type { Group, Mesh } from "three"
import { usePortfolio } from "@/context/portfolio-context"
import type { BondType } from "@/lib/types"

interface TreeProps {
  position: [number, number, number]
  bondType: BondType
  amount: number
  yield: number
  maturityYears: number
  holdingId: string
}

const treeColors = {
  government: { trunk: "#5a4a3a", leaves: "#4a7c3c" },
  corporate: { trunk: "#6a5a4a", leaves: "#5a8a4a" },
  highyield: { trunk: "#7a6a5a", leaves: "#ff9966" },
}

export default function Tree({ position, bondType, amount, yield: yieldRate, maturityYears, holdingId }: TreeProps) {
  const groupRef = useRef<Group>(null)
  const leavesRef = useRef<Mesh>(null)
  const { setSelectedHolding, portfolio } = usePortfolio()

  const colors = treeColors[bondType]
  const treeHeight = Math.max(2, amount / 10000)
  const leafDensity = Math.max(0.5, yieldRate / 10)

  const handleClick = () => {
    const holding = portfolio.holdings.find((h) => h.id === holdingId)
    if (holding) {
      setSelectedHolding(holding)
    }
  }

  useFrame((state) => {
    if (leavesRef.current) {
      // Gentle swaying
      leavesRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1
    }
  })

  return (
    <group ref={groupRef} position={position} onClick={handleClick}>
      {/* Tree trunk */}
      <mesh position={[0, treeHeight / 2, 0]} castShadow>
        <cylinderGeometry args={[0.3, 0.4, treeHeight, 8]} />
        <meshStandardMaterial color={colors.trunk} roughness={0.9} />
      </mesh>

      {/* Tree leaves/canopy */}
      <mesh ref={leavesRef} position={[0, treeHeight + 0.8, 0]} castShadow>
        <sphereGeometry args={[leafDensity * 1.5, 16, 16]} />
        <meshStandardMaterial color={colors.leaves} roughness={0.7} />
      </mesh>

      {/* Additional leaf clusters */}
      <mesh position={[-0.5, treeHeight + 0.5, 0.5]} castShadow>
        <sphereGeometry args={[leafDensity * 1.2, 12, 12]} />
        <meshStandardMaterial color={colors.leaves} roughness={0.7} />
      </mesh>

      <mesh position={[0.5, treeHeight + 0.5, -0.5]} castShadow>
        <sphereGeometry args={[leafDensity * 1.2, 12, 12]} />
        <meshStandardMaterial color={colors.leaves} roughness={0.7} />
      </mesh>

      {/* Info plaque */}
      <mesh position={[0, 0.5, 1.2]} rotation={[-Math.PI / 6, 0, 0]} castShadow>
        <boxGeometry args={[1.2, 0.4, 0.05]} />
        <meshStandardMaterial color="#f5f1e8" />
      </mesh>

      <Text
        position={[0, 0.6, 1.23]}
        rotation={[-Math.PI / 6, 0, 0]}
        fontSize={0.12}
        color="#2d5016"
        anchorX="center"
        anchorY="middle"
        font="/fonts/Geist-Bold.ttf"
      >
        {bondType.toUpperCase()}
      </Text>

      <Text
        position={[0, 0.45, 1.23]}
        rotation={[-Math.PI / 6, 0, 0]}
        fontSize={0.08}
        color="#5a6650"
        anchorX="center"
        anchorY="middle"
        font="/fonts/Geist-Regular.ttf"
      >
        ${(amount / 1000).toFixed(0)}K • {yieldRate}% • {maturityYears}Y
      </Text>
    </group>
  )
}
