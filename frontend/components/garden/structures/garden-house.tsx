"use client"

interface GardenHouseProps {
  position: [number, number, number]
}

export default function GardenHouse({ position }: GardenHouseProps) {
  // Rough proportions for a cozy entrance house with a gable-style roof
  const baseWidth = 5
  const baseHeight = 3
  const baseDepth = 4

  return (
    <group position={position}>
      {/* Main structure */}
      <mesh position={[0, baseHeight / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[baseWidth, baseHeight, baseDepth]} />
        <meshStandardMaterial color="#d8c5a6" roughness={0.75} />
      </mesh>

      {/* Roof */}
      <mesh position={[0, baseHeight + 0.9, 0]} rotation={[0, Math.PI / 4, 0]} castShadow>
        <coneGeometry args={[Math.sqrt(2) * (baseWidth / 2), 1.8, 4]} />
        <meshStandardMaterial color="#8b5a2b" roughness={0.6} metalness={0.1} />
      </mesh>

      {/* Door facing the garden gate */}
      <mesh position={[0, 1.2, -(baseDepth / 2 + 0.01)]} castShadow>
        <boxGeometry args={[1.2, 2, 0.1]} />
        <meshStandardMaterial color="#5f4535" roughness={0.8} />
      </mesh>

      {/* Door handle */}
      <mesh position={[0.4, 1.2, -(baseDepth / 2 + 0.06)]} castShadow>
        <sphereGeometry args={[0.07, 16, 16]} />
        <meshStandardMaterial color="#c9b37d" metalness={0.6} roughness={0.3} />
      </mesh>

      {/* Front windows */}
      <group position={[0, 1.8, -(baseDepth / 2 - 0.05)]}>
        <mesh position={[-1.4, 0.2, 0]} castShadow>
          <boxGeometry args={[0.9, 0.9, 0.05]} />
          <meshStandardMaterial color="#f3f6ff" transparent opacity={0.85} />
        </mesh>
        <mesh position={[1.4, 0.2, 0]} castShadow>
          <boxGeometry args={[0.9, 0.9, 0.05]} />
          <meshStandardMaterial color="#f3f6ff" transparent opacity={0.85} />
        </mesh>
      </group>

      {/* Window frames */}
      <group position={[0, 1.8, -(baseDepth / 2 - 0.03)]}>
        {[[-1.4, 0.2, 0], [1.4, 0.2, 0]].map(([x, y, z]) => (
          <group key={`${x}-${y}-${z}`} position={[x, y, z]}>
            <mesh>
              <boxGeometry args={[0.9, 0.05, 0.02]} />
              <meshStandardMaterial color="#5f4535" />
            </mesh>
            <mesh>
              <boxGeometry args={[0.05, 0.9, 0.02]} />
              <meshStandardMaterial color="#5f4535" />
            </mesh>
          </group>
        ))}
      </group>

      {/* Side windows */}
      {[1, -1].map((side) => (
        <group key={side} position={[side * (baseWidth / 2 + 0.01), 1.8, 0]} rotation={[0, side === 1 ? Math.PI / 2 : -Math.PI / 2, 0]}>
          <mesh castShadow>
            <boxGeometry args={[0.9, 0.9, 0.05]} />
            <meshStandardMaterial color="#f3f6ff" transparent opacity={0.85} />
          </mesh>
          <mesh position={[0, 0, 0.03]}>
            <boxGeometry args={[0.9, 0.05, 0.02]} />
            <meshStandardMaterial color="#5f4535" />
          </mesh>
          <mesh position={[0, 0, 0.03]}>
            <boxGeometry args={[0.05, 0.9, 0.02]} />
            <meshStandardMaterial color="#5f4535" />
          </mesh>
        </group>
      ))}

      {/* Chimney */}
      <mesh position={[baseWidth / 4, baseHeight + 1.2, baseDepth / 4]} castShadow>
        <boxGeometry args={[0.6, 1.5, 0.6]} />
        <meshStandardMaterial color="#9b7860" roughness={0.7} />
      </mesh>

      {/* Small front step */}
      <mesh position={[0, 0.15, -(baseDepth / 2 + 0.3)]} receiveShadow>
        <boxGeometry args={[1.6, 0.3, 1]} />
        <meshStandardMaterial color="#b0a089" roughness={0.9} />
      </mesh>
    </group>
  )
}
