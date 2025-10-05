"use client"

import { useEffect, useCallback, useState } from "react"
import { usePortfolio } from "@/context/portfolio-context"
import { generatePriceUpdate, generateMarketEvent, type MarketEvent } from "@/lib/market-data"

export function useMarketData() {
  const { portfolio, updateHoldingPrice } = usePortfolio()
  const [events, setEvents] = useState<MarketEvent[]>([])
  const [isMarketOpen, setIsMarketOpen] = useState(true)

  // Simulate market hours (9:30 AM - 4:00 PM ET)
  useEffect(() => {
    const checkMarketHours = () => {
      const now = new Date()
      const hour = now.getHours()
      const isWeekday = now.getDay() >= 1 && now.getDay() <= 5
      setIsMarketOpen(isWeekday && hour >= 9 && hour < 16)
    }

    checkMarketHours()
    const interval = setInterval(checkMarketHours, 60000) // Check every minute

    return () => clearInterval(interval)
  }, [])

  // Update prices periodically
  useEffect(() => {
    if (!isMarketOpen) return

    const updateInterval = setInterval(() => {
      portfolio.holdings.forEach((holding) => {
        let currentPrice = 0
        let volatility = 0.005 // 0.5% default volatility

        switch (holding.type) {
          case "stock":
            currentPrice = holding.currentPrice
            volatility = 0.008 // Stocks: 0.8% volatility
            break
          case "crypto":
            currentPrice = holding.currentPrice
            volatility = 0.025 // Crypto: 2.5% volatility (more volatile)
            break
          case "reit":
            currentPrice = holding.currentPrice
            volatility = 0.006 // REITs: 0.6% volatility
            break
          default:
            return
        }

        const newPrice = generatePriceUpdate(currentPrice, volatility)
        const changePercent = ((newPrice - currentPrice) / currentPrice) * 100

        updateHoldingPrice(holding.id, newPrice, changePercent)
      })
    }, 5000) // Update every 5 seconds

    return () => clearInterval(updateInterval)
  }, [portfolio.holdings, updateHoldingPrice, isMarketOpen])

  // Generate random market events
  useEffect(() => {
    const eventInterval = setInterval(() => {
      if (Math.random() > 0.7 && portfolio.holdings.length > 0) {
        // 30% chance every interval
        const holdingIds = portfolio.holdings.map((h) => h.id)
        const event = generateMarketEvent(holdingIds)
        setEvents((prev) => [event, ...prev].slice(0, 10)) // Keep last 10 events
      }
    }, 30000) // Check every 30 seconds

    return () => clearInterval(eventInterval)
  }, [portfolio.holdings])

  const dismissEvent = useCallback((eventId: string) => {
    setEvents((prev) => prev.filter((e) => e.id !== eventId))
  }, [])

  return {
    events,
    dismissEvent,
    isMarketOpen,
  }
}
