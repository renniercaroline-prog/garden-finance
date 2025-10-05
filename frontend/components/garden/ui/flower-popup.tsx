"use client"

import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface FlowerPopupProps {
  flowerType: "startups" | "causes" | "currencies"
  onClose: () => void
}

const flowerConfig = {
  startups: {
    title: "Startups",
    description: "Invest in innovative startups and early-stage companies",
    color: "#F5C542",
    emoji: "🌻",
  },
  causes: {
    title: "Causes",
    description: "Support social causes and make a positive impact",
    color: "#dc143c",
    emoji: "🌹",
  },
  currencies: {
    title: "Currencies",
    description: "Trade and invest in digital currencies",
    color: "#9b59b6",
    emoji: "💜",
  },
}

export default function FlowerPopup({ flowerType, onClose }: FlowerPopupProps) {
  const config = flowerConfig[flowerType]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <Card className="w-full max-w-lg shadow-2xl">
        <CardHeader className="border-b" style={{ borderBottomColor: config.color }}>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <span className="text-4xl">{config.emoji}</span>
              <div>
                <CardTitle className="text-2xl" style={{ color: config.color }}>
                  {config.title}
                </CardTitle>
                <CardDescription className="mt-1">{config.description}</CardDescription>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose} className="ml-4">
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="p-6">
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Click below to explore opportunities in {config.title.toLowerCase()}.
            </p>

            <div className="flex gap-3">
              <Button
                className="flex-1 text-white hover:opacity-90"
                style={{ backgroundColor: config.color }}
              >
                Explore {config.title}
              </Button>
              <Button variant="outline" className="flex-1" onClick={onClose}>
                Close
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
