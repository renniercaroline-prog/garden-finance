"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Trophy, X, Medal, TrendingUp } from "lucide-react"
import { useSocial } from "@/context/social-context"

export default function LeaderboardPanel() {
  const [isOpen, setIsOpen] = useState(false)
  const { leaderboard } = useSocial()

  if (!isOpen) {
    return (
      <div className="fixed left-4 top-1/2 -translate-y-1/2 pointer-events-auto z-20">
        <Button
          onClick={() => setIsOpen(true)}
          size="lg"
          className="rounded-full h-14 w-14 shadow-lg bg-accent hover:bg-accent/90"
        >
          <Trophy className="w-6 h-6" />
        </Button>
      </div>
    )
  }

  return (
    <div className="fixed left-4 top-1/2 -translate-y-1/2 w-96 pointer-events-auto z-20">
      <Card className="glass-panel border-primary/20">
        <div className="p-4 border-b border-border/50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-accent" />
            <h3 className="text-lg font-bold text-foreground font-serif">Leaderboard</h3>
          </div>
          <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        <Tabs defaultValue="daily" className="w-full">
          <TabsList className="w-full grid grid-cols-4 m-4 mb-0">
            <TabsTrigger value="daily">Daily</TabsTrigger>
            <TabsTrigger value="weekly">Weekly</TabsTrigger>
            <TabsTrigger value="monthly">Monthly</TabsTrigger>
            <TabsTrigger value="yearly">Yearly</TabsTrigger>
          </TabsList>

          <ScrollArea className="h-[500px]">
            <TabsContent value="daily" className="p-4 space-y-2 mt-0">
              {leaderboard.map((entry) => (
                <LeaderboardEntry key={entry.userId} entry={entry} metric={entry.dailyReturn} />
              ))}
            </TabsContent>

            <TabsContent value="weekly" className="p-4 space-y-2 mt-0">
              {leaderboard.map((entry) => (
                <LeaderboardEntry key={entry.userId} entry={entry} metric={entry.weeklyReturn} />
              ))}
            </TabsContent>

            <TabsContent value="monthly" className="p-4 space-y-2 mt-0">
              {leaderboard.map((entry) => (
                <LeaderboardEntry key={entry.userId} entry={entry} metric={entry.monthlyReturn} />
              ))}
            </TabsContent>

            <TabsContent value="yearly" className="p-4 space-y-2 mt-0">
              {leaderboard.map((entry) => (
                <LeaderboardEntry key={entry.userId} entry={entry} metric={entry.yearlyReturn} />
              ))}
            </TabsContent>
          </ScrollArea>
        </Tabs>
      </Card>
    </div>
  )
}

function LeaderboardEntry({ entry, metric }: { entry: any; metric: number }) {
  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Medal className="w-5 h-5 text-yellow-500" />
      case 2:
        return <Medal className="w-5 h-5 text-gray-400" />
      case 3:
        return <Medal className="w-5 h-5 text-amber-700" />
      default:
        return <span className="text-sm font-bold text-muted-foreground w-5 text-center">{rank}</span>
    }
  }

  const isYou = entry.userId === "you"

  return (
    <Card
      className={`p-3 ${isYou ? "bg-primary/10 border-primary/50" : "bg-background/50 border-border/50"} transition-colors`}
    >
      <div className="flex items-center gap-3">
        <div className="flex items-center justify-center w-8">{getRankIcon(entry.rank)}</div>

        <div className="text-2xl">{entry.avatar}</div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="font-semibold text-foreground text-sm truncate">{entry.displayName}</h4>
            {isYou && (
              <Badge variant="default" className="text-xs">
                You
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">${(entry.portfolioValue / 1000).toFixed(0)}K</span>
            <span className="text-xs text-muted-foreground">•</span>
            <span className="text-xs text-muted-foreground">Lv {entry.level}</span>
          </div>
        </div>

        <div className="text-right">
          <div className="flex items-center gap-1">
            <TrendingUp className={`w-3 h-3 ${metric >= 0 ? "text-success" : "text-destructive"}`} />
            <span className={`text-sm font-bold ${metric >= 0 ? "text-success" : "text-destructive"}`}>
              {metric >= 0 ? "+" : ""}
              {metric.toFixed(2)}%
            </span>
          </div>
        </div>
      </div>
    </Card>
  )
}
