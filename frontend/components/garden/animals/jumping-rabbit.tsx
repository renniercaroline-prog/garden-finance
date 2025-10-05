"use client"

import { useEffect, useMemo, useRef } from "react"
import { useFrame } from "@react-three/fiber"
import type { Group } from "three"

interface JumpingRabbitProps {
  position: [number, number, number]
  hopHeight?: number
  hopSpeed?: number
  lookAt?: [number, number, number]
}

export default function JumpingRabbit({
  position,
  hopHeight = 0.8,
  hopSpeed = 1.5,
  lookAt,
}: JumpingRabbitProps) {
  const rabbitRef = useRef<Group>(null)

  const phaseOffset = useMemo(() => Math.random() * Math.PI * 2, [])

  useEffect(() => {
    if (rabbitRef.current && lookAt) {
      rabbitRef.current.lookAt(...lookAt)
    }
  }, [lookAt])

  useFrame((state) => {
    if (!rabbitRef.current) return
    const t = state.clock.elapsedTime * hopSpeed + phaseOffset
    const hop = Math.abs(Math.sin(t)) * hopHeight
    rabbitRef.current.position.y = position[1] + hop
    rabbitRef.current.position.x = position[0] + Math.sin(t) * 0.2
    rabbitRef.current.position.z = position[2] + Math.cos(t * 0.8) * 0.2

    const tilt = Math.sin(t) * 0.2
    rabbitRef.current.rotation.x = -tilt
  })

  return (
    <group ref={rabbitRef} position={position} castShadow>
      {/* Body */}
      <mesh position={[0, 0.4, 0]} scale={[0.6, 0.45, 1.1]} castShadow>
        <sphereGeometry args={[0.6, 32, 32]} />
        <meshStandardMaterial color="#f0ead6" roughness={0.85} />
      </mesh>

      {/* Head */}
      <mesh position={[0, 0.9, 0.45]} scale={[0.45, 0.45, 0.5]} castShadow>
        <sphereGeometry args={[0.5, 32, 32]} />
        <meshStandardMaterial color="#f0ead6" roughness={0.85} />
      </mesh>

      {/* Nose */}
      <mesh position={[0, 0.85, 0.9]} scale={[0.18, 0.12, 0.2]}>
        <sphereGeometry args={[0.2, 16, 16]} />
        <meshStandardMaterial color="#f6b0b0" />
      </mesh>

      {/* Eyes */}
      <mesh position={[-0.18, 1, 0.75]} scale={[0.08, 0.08, 0.08]}>
        <sphereGeometry args={[0.1, 16, 16]} />
        <meshStandardMaterial color="#2f2f2f" />
      </mesh>
      <mesh position={[0.18, 1, 0.75]} scale={[0.08, 0.08, 0.08]}>
        <sphereGeometry args={[0.1, 16, 16]} />
        <meshStandardMaterial color="#2f2f2f" />
      </mesh>

      {/* Ears */}
      {[-0.18, 0.18].map((x) => (
        <group key={x} position={[x, 1.3, 0.3]} rotation={[0.1, 0, 0]}>
          <mesh scale={[0.2, 0.7, 0.2]}>
            <cylinderGeometry args={[0.12, 0.08, 1.2, 12]} />
            <meshStandardMaterial color="#f0ead6" roughness={0.9} />
          </mesh>
          <mesh position={[0, 0, 0.01]} scale={[0.1, 0.65, 0.1]}>
            <cylinderGeometry args={[0.06, 0.04, 1.1, 8]} />
            <meshStandardMaterial color="#f6b0b0" roughness={0.6} />
          </mesh>
        </group>
      ))}

      {/* Front paws */}
      {[-0.2, 0.2].map((x) => (
        <mesh key={`front-${x}`} position={[x, 0.1, 0.4]} scale={[0.15, 0.25, 0.3]}>
          <sphereGeometry args={[0.2, 16, 16]} />
          <meshStandardMaterial color="#f0ead6" />
        </mesh>
      ))}

      {/* Hind legs */}
      {[-0.25, 0.25].map((x) => (
        <mesh key={`hind-${x}`} position={[x, 0.15, -0.25]} scale={[0.2, 0.3, 0.4]}>
          <sphereGeometry args={[0.25, 16, 16]} />
          <meshStandardMaterial color="#f0ead6" />
        </mesh>
      ))}

      {/* Tail */}
      <mesh position={[0, 0.45, -0.55]} scale={[0.25, 0.25, 0.25]}>
        <sphereGeometry args={[0.3, 16, 16]} />
        <meshStandardMaterial color="#ffffff" roughness={0.9} />
      </mesh>
    </group>
  )
}
