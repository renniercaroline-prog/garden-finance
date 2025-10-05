"use client"

import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { useGamification } from "@/context/gamification-context"
import { Star } from "lucide-react"

export default function ProgressBar() {
  const { userProgress } = useGamification()

  const progressPercent = (userProgress.xp / userProgress.xpToNextLevel) * 100

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 w-96 pointer-events-auto z-30">
      <Card className="glass-panel px-4 py-3 border-primary/20">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-accent/20 border-2 border-accent">
            <Star className="w-5 h-5 text-accent fill-accent" />
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm font-bold text-foreground font-serif">Level {userProgress.level}</span>
              <span className="text-xs text-muted-foreground">
                {userProgress.xp} / {userProgress.xpToNextLevel} XP
              </span>
            </div>
            <Progress value={progressPercent} className="h-2" />
          </div>
        </div>
      </Card>
    </div>
  )
}
