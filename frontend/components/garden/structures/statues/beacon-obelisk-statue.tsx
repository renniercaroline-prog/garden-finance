"use client"

interface BeaconObeliskStatueProps {
  position: [number, number, number]
  onClick?: () => void
}

export default function BeaconObeliskStatue({ position, onClick }: BeaconObeliskStatueProps) {
  return (
    <group position={position} onClick={onClick}>
      <mesh position={[0, 0.4, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[1, 1.1, 0.8, 6]} />
        <meshStandardMaterial color="#afa99c" roughness={0.8} />
      </mesh>

      <mesh position={[0, 1.9, 0]} castShadow>
        <cylinderGeometry args={[0.45, 0.6, 3, 6]} />
        <meshStandardMaterial color="#cfcabf" roughness={0.7} />
      </mesh>

      <mesh position={[0, 3.6, 0]} castShadow>
        <coneGeometry args={[0.55, 0.8, 6]} />
        <meshStandardMaterial color="#e2ddcf" roughness={0.6} />
      </mesh>

      <mesh position={[0, 4.3, 0]} castShadow>
        <octahedronGeometry args={[0.35, 0]} />
        <meshStandardMaterial emissive="#f6f1d3" emissiveIntensity={0.9} color="#ffffff" />
      </mesh>

      <pointLight position={[0, 4.3, 0]} intensity={0.6} distance={6} color="#fff3b0" />
    </group>
  )
}
