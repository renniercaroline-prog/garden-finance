"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Home, ArrowLeft } from "lucide-react"
import { useSocial } from "@/context/social-context"

export default function GardenPortal() {
  const { currentVisit, returnToMyGarden, friends } = useSocial()

  if (!currentVisit) return null

  const friend = friends.find((f) => f.id === currentVisit.friendId)
  if (!friend) return null

  return (
    <div className="fixed top-24 left-1/2 -translate-x-1/2 pointer-events-auto z-30">
      <Card className="glass-panel px-6 py-4 border-primary/20">
        <div className="flex items-center gap-4">
          <div className="text-3xl">{friend.avatar}</div>
          <div>
            <h3 className="text-lg font-bold text-foreground font-serif">{friend.displayName}'s Garden</h3>
            <p className="text-sm text-muted-foreground">
              Portfolio: ${(friend.portfolioValue / 1000).toFixed(0)}K • Level {friend.level}
            </p>
          </div>
          <Button onClick={returnToMyGarden} variant="outline" className="ml-4 bg-transparent">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Return to My Garden
            <Home className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </Card>
    </div>
  )
}
