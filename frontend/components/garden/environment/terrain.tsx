"use client"

import { useRef } from "react"
import type { Mesh } from "three"
import GrassField from "./grass-field"

export default function Terrain() {
  const meshRef = useRef<Mesh>(null)

  return (
    <group>
      {/* Main grass terrain */}
      <mesh ref={meshRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.02, 0]} receiveShadow>
        <planeGeometry args={[100, 100, 50, 50]} />
        <meshStandardMaterial color="#3f5f2a" roughness={1} metalness={0.05} />
      </mesh>

      <GrassField
        size={80}
        bladeCount={1500}
        clearings={[
          { x: 0, z: 0, width: 4, depth: 32 },
          { x: 0, z: -5, width: 4, depth: 32 },
        ]}
      />

      {/* Garden paths */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]} receiveShadow>
        <planeGeometry args={[3, 30]} />
        <meshStandardMaterial color="#c4b5a0" roughness={0.95} />
      </mesh>

      <mesh rotation={[-Math.PI / 2, 0, Math.PI / 2]} position={[0, 0.01, -5]} receiveShadow>
        <planeGeometry args={[3, 30]} />
        <meshStandardMaterial color="#c4b5a0" roughness={0.95} />
      </mesh>
    </group>
  )
}
