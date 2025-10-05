"use client"

import { useEffect, useMemo, useRef } from "react"
import { useFrame } from "@react-three/fiber"
import { Color, InstancedMesh, Matrix4, Object3D } from "three"

interface GrassFieldProps {
  /** Overall square size of the field */
  size?: number
  /** Total number of blades to render */
  bladeCount?: number
  /** Base grass color, slightly varied per blade */
  color?: string
  /** Areas (rectangles) where no grass should spawn */
  clearings?: Array<{ x: number; z: number; width: number; depth: number }>
}

const tempObject = new Object3D()
const tempMatrix = new Matrix4()

export default function GrassField({
  size = 60,
  bladeCount = 1200,
  color = "#4e8f4a",
  clearings = [],
}: GrassFieldProps) {
  const grassRef = useRef<InstancedMesh>(null)

  const blades = useMemo(() => {
    const half = size / 2
    const baseColor = new Color(color)

    const generated: Array<{
      x: number
      z: number
      height: number
      swaySpeed: number
      swayOffset: number
      baseRotation: number
      color: Color
    }> = []

    const isInClearing = (x: number, z: number) =>
      clearings.some(({ x: cx, z: cz, width, depth }) =>
        Math.abs(x - cx) <= width / 2 && Math.abs(z - cz) <= depth / 2,
      )

    while (generated.length < bladeCount) {
      const x = Math.random() * size - half
      const z = Math.random() * size - half

      if (isInClearing(x, z)) {
        continue
      }

      const height = 0.7 + Math.random() * 0.6
      const swaySpeed = 0.6 + Math.random() * 0.6
      const swayOffset = Math.random() * Math.PI * 2
      const baseRotation = Math.random() * Math.PI
      const colorVariation = baseColor.clone().offsetHSL(0, (Math.random() - 0.5) * 0.05, (Math.random() - 0.5) * 0.1)

      generated.push({ x, z, height, swaySpeed, swayOffset, baseRotation, color: colorVariation })
    }

    return generated
  }, [bladeCount, clearings, color, size])

  useEffect(() => {
    if (!grassRef.current) return

    blades.forEach(({ x, z, height, baseRotation, color: bladeColor }, index) => {
      tempObject.position.set(x, 0, z)
      tempObject.scale.set(0.08, height, 0.08)
      tempObject.rotation.set(0, baseRotation, 0)
      tempObject.updateMatrix()
      tempMatrix.copy(tempObject.matrix)
      grassRef.current!.setMatrixAt(index, tempMatrix)
      grassRef.current!.setColorAt(index, bladeColor)
    })

    grassRef.current.instanceMatrix.needsUpdate = true
    if (grassRef.current.instanceColor) {
      grassRef.current.instanceColor.needsUpdate = true
    }
  }, [blades])

  useFrame((state) => {
    if (!grassRef.current) return

    const time = state.clock.elapsedTime
    blades.forEach(({ x, z, height, swaySpeed, swayOffset, baseRotation }, index) => {
      const sway = Math.sin(time * swaySpeed + swayOffset) * 0.35
      tempObject.position.set(x, 0, z)
      tempObject.scale.set(0.08, height, 0.08)
      tempObject.rotation.set(-sway * 0.2, baseRotation + sway * 0.15, sway)
      tempObject.updateMatrix()
      tempMatrix.copy(tempObject.matrix)
      grassRef.current!.setMatrixAt(index, tempMatrix)
    })

    grassRef.current.instanceMatrix.needsUpdate = true
  })

  return (
    <instancedMesh ref={grassRef} args={[undefined, undefined, bladeCount]} castShadow receiveShadow>
      <coneGeometry args={[0.18, 1.5, 5]} />
      <meshStandardMaterial
        color={color}
        roughness={0.9}
        metalness={0.05}
        vertexColors
      />
    </instancedMesh>
  )
}
