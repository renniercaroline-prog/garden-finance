"use client"

import { useRef } from "react"
import type { Group } from "three"

interface GreenhouseProps {
  position: [number, number, number]
}

export default function Greenhouse({ position }: GreenhouseProps) {
  const groupRef = useRef<Group>(null)

  return (
    <group ref={groupRef} position={position}>
      {/* Glass walls */}
      <mesh position={[0, 1.5, 0]} castShadow receiveShadow>
        <boxGeometry args={[6, 3, 6]} />
        <meshPhysicalMaterial
          color="#e8f4f8"
          transparent
          opacity={0.3}
          roughness={0.1}
          metalness={0.1}
          transmission={0.9}
          thickness={0.5}
        />
      </mesh>

      {/* Frame */}
      {/* Vertical posts */}
      {[
        [-3, 1.5, -3],
        [3, 1.5, -3],
        [-3, 1.5, 3],
        [3, 1.5, 3],
      ].map((pos, i) => (
        <mesh key={`post-${i}`} position={pos as [number, number, number]} castShadow>
          <boxGeometry args={[0.1, 3, 0.1]} />
          <meshStandardMaterial color="#3a5a3a" metalness={0.6} roughness={0.4} />
        </mesh>
      ))}

      {/* Roof frame */}
      <mesh position={[0, 3.2, 0]} rotation={[0, 0, 0]} castShadow>
        <boxGeometry args={[6.2, 0.1, 6.2]} />
        <meshStandardMaterial color="#3a5a3a" metalness={0.6} roughness={0.4} />
      </mesh>

      {/* Peaked roof */}
      <mesh position={[0, 3.8, 0]} castShadow receiveShadow>
        <coneGeometry args={[4.5, 1.5, 4]} />
        <meshPhysicalMaterial
          color="#e8f4f8"
          transparent
          opacity={0.3}
          roughness={0.1}
          metalness={0.1}
          transmission={0.9}
        />
      </mesh>

      {/* Door */}
      <mesh position={[0, 0.8, 3.05]} castShadow>
        <boxGeometry args={[1, 1.6, 0.1]} />
        <meshStandardMaterial color="#5a7a5a" roughness={0.6} />
      </mesh>

      {/* Door handle */}
      <mesh position={[0.3, 0.8, 3.1]} castShadow>
        <sphereGeometry args={[0.05, 8, 8]} />
        <meshStandardMaterial color="#d4a574" metalness={0.8} roughness={0.2} />
      </mesh>
    </group>
  )
}
