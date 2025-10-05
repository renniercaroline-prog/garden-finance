"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Target, X, CheckCircle2, Clock } from "lucide-react"
import { useGamification } from "@/context/gamification-context"
import type { Quest } from "@/lib/types"

export default function QuestsPanel() {
  const [isOpen, setIsOpen] = useState(false)
  const { quests } = useGamification()

  const activeQuests = quests.filter((q) => !q.completed)
  const completedQuests = quests.filter((q) => q.completed)

  if (!isOpen) {
    return (
      <div className="fixed left-1/2 -translate-x-1/2 top-20 pointer-events-auto z-20">
        <Button onClick={() => setIsOpen(true)} variant="outline" className="bg-background/80 backdrop-blur-sm">
          <Target className="w-4 h-4 mr-2" />
          Quests
          {activeQuests.length > 0 && (
            <Badge variant="default" className="ml-2">
              {activeQuests.length}
            </Badge>
          )}
        </Button>
      </div>
    )
  }

  return (
    <div className="fixed left-1/2 -translate-x-1/2 top-20 w-[500px] pointer-events-auto z-30">
      <Card className="glass-panel border-primary/20">
        <div className="p-4 border-b border-border/50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Target className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-bold text-foreground font-serif">Daily Quests</h3>
          </div>
          <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        <ScrollArea className="h-[400px]">
          <div className="p-4 space-y-3">
            {activeQuests.length > 0 && (
              <>
                <h4 className="text-sm font-semibold text-muted-foreground mb-2">Active</h4>
                {activeQuests.map((quest) => (
                  <QuestCard key={quest.id} quest={quest} />
                ))}
              </>
            )}

            {completedQuests.length > 0 && (
              <>
                <h4 className="text-sm font-semibold text-muted-foreground mb-2 mt-4">Completed</h4>
                {completedQuests.map((quest) => (
                  <QuestCard key={quest.id} quest={quest} />
                ))}
              </>
            )}
          </div>
        </ScrollArea>
      </Card>
    </div>
  )
}

function QuestCard({ quest }: { quest: Quest }) {
  const getTimeRemaining = (expiresAt: Date) => {
    const hours = Math.floor((expiresAt.getTime() - Date.now()) / (1000 * 60 * 60))
    if (hours < 1) return "< 1h"
    return `${hours}h`
  }

  const progressPercent = (quest.progress / quest.maxProgress) * 100

  return (
    <Card
      className={`p-4 ${quest.completed ? "bg-success/10 border-success/30" : "bg-background/50 border-border/50"}`}
    >
      <div className="flex items-start gap-3">
        {quest.completed ? (
          <CheckCircle2 className="w-5 h-5 text-success mt-0.5" />
        ) : (
          <div className="w-5 h-5 rounded-full border-2 border-primary mt-0.5" />
        )}

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1">
            <h4 className="font-semibold text-foreground text-sm">{quest.title}</h4>
            <Badge variant={quest.type === "daily" ? "default" : "secondary"} className="text-xs shrink-0">
              {quest.type}
            </Badge>
          </div>

          <p className="text-xs text-muted-foreground mb-2">{quest.description}</p>

          {!quest.completed && (
            <>
              <Progress value={progressPercent} className="h-1.5 mb-2" />
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">
                  {quest.progress} / {quest.maxProgress}
                </span>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Clock className="w-3 h-3" />
                    <span className="text-xs">{getTimeRemaining(quest.expiresAt)}</span>
                  </div>
                  <span className="text-xs font-semibold text-accent">+{quest.xpReward} XP</span>
                </div>
              </div>
            </>
          )}

          {quest.completed && (
            <div className="flex items-center justify-between">
              <span className="text-xs text-success font-semibold">Completed!</span>
              <span className="text-xs font-semibold text-accent">+{quest.xpReward} XP</span>
            </div>
          )}
        </div>
      </div>
    </Card>
  )
}
