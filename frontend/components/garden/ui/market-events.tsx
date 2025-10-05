"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { X, TrendingUp, TrendingDown, Info, AlertCircle } from "lucide-react"
import { useMarketData } from "@/hooks/use-market-data"
import type { MarketEvent } from "@/lib/market-data"

export default function MarketEvents() {
  const { events, dismissEvent } = useMarketData()

  if (events.length === 0) return null

  const getIcon = (event: MarketEvent) => {
    switch (event.severity) {
      case "positive":
        return <TrendingUp className="w-4 h-4 text-success" />
      case "negative":
        return <TrendingDown className="w-4 h-4 text-destructive" />
      default:
        return <Info className="w-4 h-4 text-primary" />
    }
  }

  const getBorderColor = (event: MarketEvent) => {
    switch (event.severity) {
      case "positive":
        return "border-success/30"
      case "negative":
        return "border-destructive/30"
      default:
        return "border-primary/20"
    }
  }

  return (
    <div className="fixed left-4 top-20 w-80 pointer-events-auto z-20 space-y-2 max-h-[60vh] overflow-y-auto">
      {events.map((event) => (
        <Card
          key={event.id}
          className={`glass-panel p-4 border ${getBorderColor(event)} animate-in slide-in-from-left`}
        >
          <div className="flex items-start gap-3">
            <div className="mt-0.5">{getIcon(event)}</div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2 mb-1">
                <h4 className="text-sm font-semibold text-foreground leading-tight">{event.title}</h4>
                <Button variant="ghost" size="icon" className="h-6 w-6 shrink-0" onClick={() => dismissEvent(event.id)}>
                  <X className="w-3 h-3" />
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mb-2">{event.description}</p>
              <div className="flex items-center gap-2">
                <AlertCircle className="w-3 h-3 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">
                  {event.affectedHoldings.length} holding{event.affectedHoldings.length !== 1 ? "s" : ""} affected
                </span>
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}
