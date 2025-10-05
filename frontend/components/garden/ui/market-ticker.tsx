"use client"

import { Card } from "@/components/ui/card"
import { useStocks } from "@/context/stocks-context"
import { TrendingUp, TrendingDown, Minus } from "lucide-react"

export default function MarketTicker() {
  const { quotes } = useStocks()

  // Get top movers from live quotes
  const topMovers = [...quotes]
    .sort((a, b) => Math.abs((b.regularMarketChangePercent || 0)) - Math.abs((a.regularMarketChangePercent || 0)))
    .slice(0, 5)

  return (
    <div className="fixed bottom-20 left-4 right-4 pointer-events-auto">
      <Card className="glass-panel p-3 border-primary/20">
        <div className="flex items-center gap-4 overflow-x-auto scrollbar-hide">
          <span className="text-xs font-semibold text-muted-foreground whitespace-nowrap">TOP MOVERS</span>
          {topMovers.map((q) => {
            const changePercent = q.regularMarketChangePercent || 0
            const name = q.symbol

            return (
              <div key={name} className="flex items-center gap-2 whitespace-nowrap">
                <span className="text-sm font-semibold text-foreground">{name}</span>
                <div className="flex items-center gap-1">
                  {changePercent > 0 ? (
                    <TrendingUp className="w-3 h-3 text-success" />
                  ) : changePercent < 0 ? (
                    <TrendingDown className="w-3 h-3 text-destructive" />
                  ) : (
                    <Minus className="w-3 h-3 text-muted-foreground" />
                  )}
                  <span
                    className={`text-xs font-semibold ${
                      changePercent > 0
                        ? "text-success"
                        : changePercent < 0
                          ? "text-destructive"
                          : "text-muted-foreground"
                    }`}
                  >
                    {changePercent > 0 ? "+" : ""}
                    {changePercent.toFixed(2)}%
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      </Card>
    </div>
  )
}
