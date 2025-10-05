"use client"

import { useRef, useEffect } from "react"
import { useThree, useFrame } from "@react-three/fiber"
import { PointerLockControls } from "@react-three/drei"
import { Vector3 } from "three"

interface FirstPersonControlsProps {
  enabled?: boolean
}

export default function FirstPersonControls({ enabled = true }: FirstPersonControlsProps) {
  const { camera } = useThree()
  const controlsRef = useRef<any>(null)

  const moveSpeed = 5
  const sprintMultiplier = 1.8

  const movement = useRef({
    forward: false,
    backward: false,
    left: false,
    right: false,
    sprint: false,
  })

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.code) {
        case "KeyW":
        case "ArrowUp":
          movement.current.forward = true
          break
        case "KeyS":
        case "ArrowDown":
          movement.current.backward = true
          break
        case "KeyA":
        case "ArrowLeft":
          movement.current.left = true
          break
        case "KeyD":
        case "ArrowRight":
          movement.current.right = true
          break
        case "ShiftLeft":
        case "ShiftRight":
          movement.current.sprint = true
          break
      }
    }

    const handleKeyUp = (e: KeyboardEvent) => {
      switch (e.code) {
        case "KeyW":
        case "ArrowUp":
          movement.current.forward = false
          break
        case "KeyS":
        case "ArrowDown":
          movement.current.backward = false
          break
        case "KeyA":
        case "ArrowLeft":
          movement.current.left = false
          break
        case "KeyD":
        case "ArrowRight":
          movement.current.right = false
          break
        case "ShiftLeft":
        case "ShiftRight":
          movement.current.sprint = false
          break
      }
    }

    document.addEventListener("keydown", handleKeyDown)
    document.addEventListener("keyup", handleKeyUp)

    return () => {
      document.removeEventListener("keydown", handleKeyDown)
      document.removeEventListener("keyup", handleKeyUp)
    }
  }, [])

  useEffect(() => {
    if (!enabled) {
      // Force unlock pointer
      if (controlsRef.current?.isLocked) {
        controlsRef.current.unlock()
      }
      // Also try to exit pointer lock through the browser API
      if (document.pointerLockElement) {
        document.exitPointerLock()
      }
    }
  }, [enabled])

  useFrame((state, delta) => {
    if (!enabled || !controlsRef.current?.isLocked) return

    const speed = moveSpeed * (movement.current.sprint ? sprintMultiplier : 1) * delta
    const direction = new Vector3()

    if (movement.current.forward) {
      direction.z -= speed
    }
    if (movement.current.backward) {
      direction.z += speed
    }
    if (movement.current.left) {
      direction.x -= speed
    }
    if (movement.current.right) {
      direction.x += speed
    }

    // Apply movement relative to camera direction
    direction.applyEuler(camera.rotation)
    direction.y = 0 // Keep on ground level

    camera.position.add(direction)

    // Keep camera at eye level
    camera.position.y = 1.6
  })

  return <PointerLockControls ref={controlsRef} enabled={enabled} />
}
