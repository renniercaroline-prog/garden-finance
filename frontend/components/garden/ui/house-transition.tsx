"use client"

interface HouseTransitionProps {
  isTransitioning: boolean
}

export default function HouseTransition({ isTransitioning }: HouseTransitionProps) {
  return (
    <div
      className={`fixed inset-0 bg-black pointer-events-none transition-opacity duration-1000 ease-in-out z-[9999] ${
        isTransitioning ? "opacity-100" : "opacity-0"
      }`}
      style={{
        willChange: "opacity"
      }}
    />
  )
}

