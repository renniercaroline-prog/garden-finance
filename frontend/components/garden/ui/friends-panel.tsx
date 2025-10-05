"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Users, TrendingUp, TrendingDown, Eye, X, ChevronRight } from "lucide-react"
import { useSocial } from "@/context/social-context"
import type { Friend } from "@/lib/types"

export default function FriendsPanel() {
  const [isOpen, setIsOpen] = useState(false)
  const { friends, visitGarden } = useSocial()

  const getTimeAgo = (date: Date) => {
    const seconds = Math.floor((Date.now() - date.getTime()) / 1000)
    if (seconds < 60) return "just now"
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`
    return `${Math.floor(seconds / 86400)}d ago`
  }

  const handleVisit = (friendId: string) => {
    visitGarden(friendId)
    setIsOpen(false)
  }

  if (!isOpen) {
    return (
      <div className="fixed right-4 top-1/2 -translate-y-1/2 pointer-events-auto z-20">
        <Button
          onClick={() => setIsOpen(true)}
          size="lg"
          className="rounded-full h-14 w-14 shadow-lg bg-primary hover:bg-primary/90"
        >
          <Users className="w-6 h-6" />
        </Button>
      </div>
    )
  }

  return (
    <div className="fixed right-4 top-1/2 -translate-y-1/2 w-96 pointer-events-auto z-20">
      <Card className="glass-panel border-primary/20">
        <div className="p-4 border-b border-border/50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-bold text-foreground font-serif">Friends</h3>
            <Badge variant="secondary">{friends.length}</Badge>
          </div>
          <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        <ScrollArea className="h-[500px]">
          <div className="p-4 space-y-3">
            {friends.map((friend) => (
              <FriendCard key={friend.id} friend={friend} onVisit={handleVisit} getTimeAgo={getTimeAgo} />
            ))}
          </div>
        </ScrollArea>
      </Card>
    </div>
  )
}

function FriendCard({
  friend,
  onVisit,
  getTimeAgo,
}: {
  friend: Friend
  onVisit: (id: string) => void
  getTimeAgo: (date: Date) => string
}) {
  return (
    <Card className="p-4 bg-background/50 border-border/50 hover:border-primary/30 transition-colors">
      <div className="flex items-start gap-3">
        <div className="text-3xl">{friend.avatar}</div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1">
            <div>
              <h4 className="font-semibold text-foreground text-sm">{friend.displayName}</h4>
              <p className="text-xs text-muted-foreground">@{friend.username}</p>
            </div>
            <Badge variant="outline" className="text-xs">
              Lv {friend.level}
            </Badge>
          </div>

          <div className="flex items-center gap-2 mb-2">
            <span className="text-sm font-bold text-foreground">${(friend.portfolioValue / 1000).toFixed(0)}K</span>
            <div className="flex items-center gap-1">
              {friend.dailyChange >= 0 ? (
                <TrendingUp className="w-3 h-3 text-success" />
              ) : (
                <TrendingDown className="w-3 h-3 text-destructive" />
              )}
              <span
                className={`text-xs font-semibold ${friend.dailyChange >= 0 ? "text-success" : "text-destructive"}`}
              >
                {friend.dailyChange >= 0 ? "+" : ""}
                {friend.dailyChangePercent.toFixed(2)}%
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">{getTimeAgo(friend.lastActive)}</span>
            <Button
              size="sm"
              variant="outline"
              className="h-7 text-xs bg-transparent"
              onClick={() => onVisit(friend.id)}
            >
              <Eye className="w-3 h-3 mr-1" />
              Visit Garden
              <ChevronRight className="w-3 h-3 ml-1" />
            </Button>
          </div>
        </div>
      </div>
    </Card>
  )
}
