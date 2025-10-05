"use client"

import { useRef } from "react"
import type { Mesh } from "three"

export default function Terrain() {
  const meshRef = useRef<Mesh>(null)

  return (
    <group>
      {/* Main grass terrain */}
      <mesh ref={meshRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[100, 100, 50, 50]} />
        <meshStandardMaterial color="#6b8e4e" roughness={0.9} metalness={0.1} />
      </mesh>

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
