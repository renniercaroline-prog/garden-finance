"use client"

interface GrowthSpiralStatueProps {
  position: [number, number, number]
  onClick?: () => void
}

export default function GrowthSpiralStatue({ position, onClick }: GrowthSpiralStatueProps) {
  return (
    <group position={position} onClick={onClick}>
      <mesh position={[0, 0.3, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.8, 1, 0.6, 32]} />
        <meshStandardMaterial color="#bcb7aa" roughness={0.75} />
      </mesh>

      {[0, 1, 2].map((level) => (
        <mesh key={level} position={[0, 0.9 + level * 0.9, 0]} rotation={[0, level * (Math.PI / 6), 0]} castShadow>
          <torusGeometry args={[0.7 - level * 0.12, 0.09, 16, 48]} />
          <meshStandardMaterial color="#dad5c7" roughness={0.6} metalness={0.1 * (level + 1)} />
        </mesh>
      ))}

      <mesh position={[0, 3.1, 0]} rotation={[0, Math.PI / 4, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.12, 0.2, 1.8, 20]} />
        <meshStandardMaterial color="#e8e3d8" roughness={0.55} />
      </mesh>

      <mesh position={[0, 4.1, 0]} rotation={[0, Math.PI / 3, 0]} castShadow>
        <coneGeometry args={[0.35, 0.9, 24]} />
        <meshStandardMaterial color="#f2eddf" roughness={0.5} metalness={0.15} />
      </mesh>
    </group>
  )
}
