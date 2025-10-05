"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function Instructions() {
  const [isVisible, setIsVisible] = useState(true)
  const [hasInteracted, setHasInteracted] = useState(false)

  useEffect(() => {
    const handleClick = () => {
      if (!hasInteracted) {
        setHasInteracted(true)
        setTimeout(() => setIsVisible(false), 3000)
      }
    }

    document.addEventListener("click", handleClick)
    return () => document.removeEventListener("click", handleClick)
  }, [hasInteracted])

  if (!isVisible) return null

  return (
    <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-20">
      <Card className="glass-panel p-6 max-w-md pointer-events-auto relative">
        <Button variant="ghost" size="icon" className="absolute top-2 right-2" onClick={() => setIsVisible(false)}>
          <X className="w-4 h-4" />
        </Button>

        <h2 className="text-2xl font-bold text-primary mb-4 font-serif">Welcome to Your Garden</h2>

        <div className="space-y-3 text-sm text-foreground font-sans">
          <p className="text-muted-foreground">Click anywhere to start exploring your financial garden.</p>

          <div className="space-y-2 pt-2">
            <div className="flex items-center gap-3">
              <kbd className="px-2 py-1 bg-muted rounded text-xs font-mono">W A S D</kbd>
              <span>Move around</span>
            </div>
            <div className="flex items-center gap-3">
              <kbd className="px-2 py-1 bg-muted rounded text-xs font-mono">Mouse</kbd>
              <span>Look around</span>
            </div>
            <div className="flex items-center gap-3">
              <kbd className="px-2 py-1 bg-muted rounded text-xs font-mono">Shift</kbd>
              <span>Sprint</span>
            </div>
            <div className="flex items-center gap-3">
              <kbd className="px-2 py-1 bg-muted rounded text-xs font-mono">E</kbd>
              <span>Interact with plants</span>
            </div>
            <div className="flex items-center gap-3">
              <kbd className="px-2 py-1 bg-muted rounded text-xs font-mono">Tab</kbd>
              <span>Portfolio overlay</span>
            </div>
          </div>

          <p className="text-xs text-muted-foreground pt-3 italic">
            Each flower represents a stock, trees are bonds, and the greenhouse holds your crypto investments.
          </p>
        </div>
      </Card>
    </div>
  )
}
