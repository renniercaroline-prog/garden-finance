"use client"

import Link from "next/link"
import { Card } from "@/components/ui/card"
import { TrendingUp, TrendingDown, Sprout, Home } from "lucide-react"
import { usePortfolio } from "@/context/portfolio-context"
import MarketStatusIndicator from "./market-status-indicator"

export default function HUD() {
  const { portfolio } = usePortfolio()

  return (
    <>
      {/* Top HUD Bar */}
      <div className="fixed top-0 left-0 right-0 p-4 flex items-start justify-between pointer-events-none">
        <div className="flex gap-3 pointer-events-auto">
          {/* Home (Portfolio) Button */}
          <Link href="/portfolio" className="pointer-events-auto">
            <button
              type="button"
              className="rounded-full h-14 w-14 shadow-lg bg-primary hover:bg-primary/90 inline-flex items-center justify-center text-primary-foreground transition-colors"
              aria-label="Open Portfolio Home"
            >
              <Home className="w-6 h-6" />
            </button>
          </Link>
          {/* Portfolio Value */}
          <Card className="glass-panel px-4 py-3 border-primary/20">
            <div className="flex items-center gap-2">
              <Sprout className="w-5 h-5 text-primary" />
              <div>
                <p className="text-xs text-muted-foreground font-sans">Total Value</p>
                <p className="text-xl font-bold text-foreground font-serif">${portfolio.totalValue.toLocaleString()}</p>
              </div>
            </div>
          </Card>

          {/* Daily P&L */}
          <Card className="glass-panel px-4 py-3 border-primary/20">
            <div className="flex items-center gap-2">
              {portfolio.dailyChange >= 0 ? (
                <TrendingUp className="w-5 h-5 text-success" />
              ) : (
                <TrendingDown className="w-5 h-5 text-destructive" />
              )}
              <div>
                <p className="text-xs text-muted-foreground font-sans">Today</p>
                <p
                  className={`text-xl font-bold font-serif ${portfolio.dailyChange >= 0 ? "text-success" : "text-destructive"}`}
                >
                  {portfolio.dailyChange >= 0 ? "+" : ""}${portfolio.dailyChange.toLocaleString()}
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Market Status */}
        <div className="pointer-events-auto">
          <MarketStatusIndicator />
        </div>
      </div>

      {/* Bottom HUD Bar */}
      <div className="fixed bottom-0 left-0 right-0 p-4 flex items-end justify-between pointer-events-none">
        {/* Available Cash */}
        <Card className="glass-panel px-4 py-3 border-primary/20 pointer-events-auto">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center">
              <span className="text-lg">🌱</span>
            </div>
            <div>
              <p className="text-xs text-muted-foreground font-sans">Seeds Available</p>
              <p className="text-lg font-bold text-foreground font-serif">${portfolio.cash.toLocaleString()}</p>
            </div>
          </div>
        </Card>
      </div>
    </>
  )
}
