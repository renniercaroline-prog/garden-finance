"use client"

import { Card } from "@/components/ui/card"
import { usePortfolio } from "@/context/portfolio-context"
import { TrendingUp, TrendingDown, Minus } from "lucide-react"

export default function MarketTicker() {
  const { portfolio } = usePortfolio()

  // Get top movers
  const topMovers = [...portfolio.holdings]
    .filter((h) => h.type === "stock" || h.type === "crypto" || h.type === "reit")
    .sort((a, b) => {
      const aChange = "changePercent" in a ? Math.abs(a.changePercent) : 0
      const bChange = "changePercent" in b ? Math.abs(b.changePercent) : 0
      return bChange - aChange
    })
    .slice(0, 5)

  return (
    <div className="fixed bottom-20 left-4 right-4 pointer-events-auto">
      <Card className="glass-panel p-3 border-primary/20">
        <div className="flex items-center gap-4 overflow-x-auto scrollbar-hide">
          <span className="text-xs font-semibold text-muted-foreground whitespace-nowrap">TOP MOVERS</span>
          {topMovers.map((holding) => {
            const changePercent = "changePercent" in holding ? holding.changePercent : 0
            const name =
              holding.type === "stock"
                ? holding.ticker
                : holding.type === "crypto"
                  ? holding.symbol
                  : holding.type === "reit"
                    ? holding.ticker
                    : ""

            return (
              <div key={holding.id} className="flex items-center gap-2 whitespace-nowrap">
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
