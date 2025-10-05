"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Award, X, Lock } from "lucide-react"
import { useGamification } from "@/context/gamification-context"
import type { Achievement } from "@/lib/types"

export default function AchievementsPanel() {
  const [isOpen, setIsOpen] = useState(false)
  const { achievements } = useGamification()

  const unlockedCount = achievements.filter((a) => a.unlocked).length

  if (!isOpen) {
    return (
      <div className="fixed right-1/2 translate-x-1/2 top-20 pointer-events-auto z-20">
        <Button onClick={() => setIsOpen(true)} variant="outline" className="bg-background/80 backdrop-blur-sm">
          <Award className="w-4 h-4 mr-2" />
          Achievements
          <Badge variant="secondary" className="ml-2">
            {unlockedCount}/{achievements.length}
          </Badge>
        </Button>
      </div>
    )
  }

  return (
    <div className="fixed right-1/2 translate-x-1/2 top-20 w-[600px] pointer-events-auto z-30">
      <Card className="glass-panel border-primary/20">
        <div className="p-4 border-b border-border/50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-accent" />
            <h3 className="text-lg font-bold text-foreground font-serif">Achievements</h3>
            <Badge variant="secondary">
              {unlockedCount}/{achievements.length}
            </Badge>
          </div>
          <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        <ScrollArea className="h-[500px]">
          <div className="p-4 grid grid-cols-2 gap-3">
            {achievements.map((achievement) => (
              <AchievementCard key={achievement.id} achievement={achievement} />
            ))}
          </div>
        </ScrollArea>
      </Card>
    </div>
  )
}

function AchievementCard({ achievement }: { achievement: Achievement }) {
  const progressPercent = achievement.maxProgress ? ((achievement.progress || 0) / achievement.maxProgress) * 100 : 100

  return (
    <Card
      className={`p-4 ${achievement.unlocked ? "bg-accent/10 border-accent/30" : "bg-background/50 border-border/50"}`}
    >
      <div className="flex flex-col items-center text-center">
        <div
          className={`text-4xl mb-2 ${!achievement.unlocked && "grayscale opacity-50"}`}
          style={{ filter: !achievement.unlocked ? "grayscale(100%)" : "none" }}
        >
          {achievement.unlocked ? achievement.icon : <Lock className="w-10 h-10 text-muted-foreground" />}
        </div>

        <h4 className="font-semibold text-foreground text-sm mb-1">{achievement.title}</h4>
        <p className="text-xs text-muted-foreground mb-3">{achievement.description}</p>

        {!achievement.unlocked && achievement.maxProgress && (
          <>
            <Progress value={progressPercent} className="h-1.5 w-full mb-2" />
            <span className="text-xs text-muted-foreground">
              {achievement.progress} / {achievement.maxProgress}
            </span>
          </>
        )}

        <Badge variant={achievement.unlocked ? "default" : "outline"} className="mt-2 text-xs">
          {achievement.unlocked ? "Unlocked" : `+${achievement.xpReward} XP`}
        </Badge>
      </div>
    </Card>
  )
}
