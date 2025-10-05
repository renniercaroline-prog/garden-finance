"use client"

interface SerenityStatueProps {
  position: [number, number, number]
  onClick?: () => void
}

export default function SerenityStatue({ position, onClick }: SerenityStatueProps) {
  return (
    <group position={position} onClick={onClick}>
      <mesh position={[0, 0.5, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.9, 1.2, 1, 24]} />
        <meshStandardMaterial color="#c9c2b5" roughness={0.7} />
      </mesh>

      <mesh position={[0, 1.3, 0]} castShadow>
        <cylinderGeometry args={[0.4, 0.9, 1.2, 24]} />
        <meshStandardMaterial color="#d9d4c8" roughness={0.75} />
      </mesh>

      <mesh position={[0, 2.2, 0]} scale={[0.75, 1, 0.75]} castShadow>
        <sphereGeometry args={[0.5, 24, 24]} />
        <meshStandardMaterial color="#e3dfd6" roughness={0.65} />
      </mesh>

      <mesh position={[0, 2.9, 0]} castShadow>
        <sphereGeometry args={[0.28, 24, 24]} />
        <meshStandardMaterial color="#f0ece3" roughness={0.6} />
      </mesh>

      <mesh position={[0, 3.6, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <torusGeometry args={[0.35, 0.08, 12, 32]} />
        <meshStandardMaterial color="#f0ece3" roughness={0.55} />
      </mesh>
    </group>
  )
}
