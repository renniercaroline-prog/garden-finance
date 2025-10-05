"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Heart, MessageCircle, Share2 } from "lucide-react"
import { useSocial } from "@/context/social-context"
import { useState } from "react"

export default function SocialActions() {
  const { currentVisit, friends } = useSocial()
  const [liked, setLiked] = useState(false)

  if (!currentVisit) return null

  const friend = friends.find((f) => f.id === currentVisit.friendId)
  if (!friend) return null

  return (
    <div className="fixed bottom-32 right-4 pointer-events-auto z-20">
      <Card className="glass-panel p-3 border-primary/20">
        <div className="flex flex-col gap-2">
          <Button
            variant={liked ? "default" : "outline"}
            size="icon"
            className="h-12 w-12"
            onClick={() => setLiked(!liked)}
          >
            <Heart className={`w-5 h-5 ${liked ? "fill-current" : ""}`} />
          </Button>
          <Button variant="outline" size="icon" className="h-12 w-12 bg-transparent">
            <MessageCircle className="w-5 h-5" />
          </Button>
          <Button variant="outline" size="icon" className="h-12 w-12 bg-transparent">
            <Share2 className="w-5 h-5" />
          </Button>
        </div>
      </Card>
    </div>
  )
}
