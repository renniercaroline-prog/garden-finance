"use client"

import { Card } from "@/components/ui/card"
import { useMarketData } from "@/hooks/use-market-data"
import { usePortfolio } from "@/context/portfolio-context"
import { getMarketConditions } from "@/lib/market-data"
import { Activity } from "lucide-react"

export default function MarketStatusIndicator() {
  const { isMarketOpen } = useMarketData()
  const { portfolio } = usePortfolio()
  const conditions = getMarketConditions(portfolio.dailyChangePercent)

  const getSentimentEmoji = () => {
    switch (conditions.sentiment) {
      case "bullish":
        return "☀️"
      case "bearish":
        return "🌧️"
      default:
        return "⛅"
    }
  }

  const getSentimentText = () => {
    switch (conditions.sentiment) {
      case "bullish":
        return "Bull Market"
      case "bearish":
        return "Bear Market"
      default:
        return "Neutral"
    }
  }

  const getSentimentColor = () => {
    switch (conditions.sentiment) {
      case "bullish":
        return "text-success"
      case "bearish":
        return "text-destructive"
      default:
        return "text-muted-foreground"
    }
  }

  return (
    <Card className="glass-panel px-4 py-3 border-primary/20">
      <div className="flex items-center gap-3">
        <span className="text-2xl">{getSentimentEmoji()}</span>
        <div>
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-primary" />
            <p className="text-xs text-muted-foreground font-sans">Market Status</p>
          </div>
          <p className={`text-sm font-semibold font-sans ${getSentimentColor()}`}>{getSentimentText()}</p>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-xs text-muted-foreground">
              {isMarketOpen ? "🟢 Open" : "🔴 Closed"} • Vol: {conditions.volatility}
            </span>
          </div>
        </div>
      </div>
    </Card>
  )
}
