"use client"

import { usePortfolio } from "@/context/portfolio-context"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { X, TrendingUp, TrendingDown, Droplet, Scissors } from "lucide-react"

export default function PlantDetailPanel() {
  const { selectedHolding, setSelectedHolding, sellAsset } = usePortfolio()

  if (!selectedHolding) return null

  const handleClose = () => setSelectedHolding(null)

  const renderHoldingDetails = () => {
    switch (selectedHolding.type) {
      case "stock":
        const stockValue = selectedHolding.shares * selectedHolding.currentPrice
        const stockGainLoss = stockValue - selectedHolding.shares * selectedHolding.avgCost
        const stockGainLossPercent = (stockGainLoss / (selectedHolding.shares * selectedHolding.avgCost)) * 100

        return (
          <>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Shares</span>
                <span className="font-semibold">{selectedHolding.shares}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Current Price</span>
                <span className="font-semibold">${selectedHolding.currentPrice.toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Avg Cost</span>
                <span className="font-semibold">${selectedHolding.avgCost.toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Total Value</span>
                <span className="font-bold text-lg">${stockValue.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between pt-2 border-t">
                <span className="text-sm text-muted-foreground">Gain/Loss</span>
                <div className="text-right">
                  <div className={`font-bold ${stockGainLoss >= 0 ? "text-success" : "text-destructive"}`}>
                    {stockGainLoss >= 0 ? "+" : ""}${stockGainLoss.toFixed(2)}
                  </div>
                  <div className={`text-xs ${stockGainLoss >= 0 ? "text-success" : "text-destructive"}`}>
                    {stockGainLossPercent >= 0 ? "+" : ""}
                    {stockGainLossPercent.toFixed(2)}%
                  </div>
                </div>
              </div>
            </div>
          </>
        )

      case "bond":
        return (
          <>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Amount</span>
                <span className="font-semibold">${selectedHolding.amount.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Yield</span>
                <span className="font-semibold">{selectedHolding.yield}%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Maturity</span>
                <span className="font-semibold">{selectedHolding.maturityYears} years</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Current Value</span>
                <span className="font-bold text-lg">${selectedHolding.currentValue.toLocaleString()}</span>
              </div>
            </div>
          </>
        )

      case "crypto":
        const cryptoValue = selectedHolding.amount * selectedHolding.currentPrice
        const cryptoGainLoss = cryptoValue - selectedHolding.amount * selectedHolding.avgCost
        const cryptoGainLossPercent = (cryptoGainLoss / (selectedHolding.amount * selectedHolding.avgCost)) * 100

        return (
          <>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Amount</span>
                <span className="font-semibold">{selectedHolding.amount.toFixed(6)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Current Price</span>
                <span className="font-semibold">${selectedHolding.currentPrice.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Avg Cost</span>
                <span className="font-semibold">${selectedHolding.avgCost.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Total Value</span>
                <span className="font-bold text-lg">${cryptoValue.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between pt-2 border-t">
                <span className="text-sm text-muted-foreground">Gain/Loss</span>
                <div className="text-right">
                  <div className={`font-bold ${cryptoGainLoss >= 0 ? "text-success" : "text-destructive"}`}>
                    {cryptoGainLoss >= 0 ? "+" : ""}${cryptoGainLoss.toFixed(2)}
                  </div>
                  <div className={`text-xs ${cryptoGainLoss >= 0 ? "text-success" : "text-destructive"}`}>
                    {cryptoGainLossPercent >= 0 ? "+" : ""}
                    {cryptoGainLossPercent.toFixed(2)}%
                  </div>
                </div>
              </div>
            </div>
          </>
        )

      case "reit":
        const reitValue = selectedHolding.shares * selectedHolding.currentPrice
        const reitGainLoss = reitValue - selectedHolding.shares * selectedHolding.avgCost
        const reitGainLossPercent = (reitGainLoss / (selectedHolding.shares * selectedHolding.avgCost)) * 100

        return (
          <>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Shares</span>
                <span className="font-semibold">{selectedHolding.shares}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Current Price</span>
                <span className="font-semibold">${selectedHolding.currentPrice.toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Type</span>
                <span className="font-semibold capitalize">{selectedHolding.reitType}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Total Value</span>
                <span className="font-bold text-lg">${reitValue.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between pt-2 border-t">
                <span className="text-sm text-muted-foreground">Gain/Loss</span>
                <div className="text-right">
                  <div className={`font-bold ${reitGainLoss >= 0 ? "text-success" : "text-destructive"}`}>
                    {reitGainLoss >= 0 ? "+" : ""}${reitGainLoss.toFixed(2)}
                  </div>
                  <div className={`text-xs ${reitGainLoss >= 0 ? "text-success" : "text-destructive"}`}>
                    {reitGainLossPercent >= 0 ? "+" : ""}
                    {reitGainLossPercent.toFixed(2)}%
                  </div>
                </div>
              </div>
            </div>
          </>
        )
    }
  }

  const getTitle = () => {
    switch (selectedHolding.type) {
      case "stock":
        return `${selectedHolding.ticker} - ${selectedHolding.companyName}`
      case "bond":
        return selectedHolding.name
      case "crypto":
        return `${selectedHolding.symbol} - ${selectedHolding.name}`
      case "reit":
        return `${selectedHolding.ticker} - ${selectedHolding.name}`
    }
  }

  const getChangePercent = () => {
    if (selectedHolding.type === "stock" || selectedHolding.type === "crypto" || selectedHolding.type === "reit") {
      return selectedHolding.changePercent
    }
    return 0
  }

  const changePercent = getChangePercent()

  return (
    <div className="fixed right-4 top-20 w-96 pointer-events-auto z-30">
      <Card className="glass-panel p-6 border-primary/20">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-lg font-bold text-foreground font-serif mb-1">{getTitle()}</h3>
            <div className="flex items-center gap-2">
              {changePercent >= 0 ? (
                <TrendingUp className="w-4 h-4 text-success" />
              ) : (
                <TrendingDown className="w-4 h-4 text-destructive" />
              )}
              <span className={`text-sm font-semibold ${changePercent >= 0 ? "text-success" : "text-destructive"}`}>
                {changePercent >= 0 ? "+" : ""}
                {changePercent.toFixed(2)}% today
              </span>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={handleClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        {renderHoldingDetails()}

        <div className="flex gap-2 mt-6">
          <Button variant="outline" className="flex-1 bg-transparent" size="sm">
            <Droplet className="w-4 h-4 mr-2" />
            Buy More
          </Button>
          <Button variant="outline" className="flex-1 bg-transparent" size="sm">
            <Scissors className="w-4 h-4 mr-2" />
            Sell
          </Button>
        </div>

        <p className="text-xs text-muted-foreground mt-4 italic">Click outside or press ESC to close this panel</p>
      </Card>
    </div>
  )
}
