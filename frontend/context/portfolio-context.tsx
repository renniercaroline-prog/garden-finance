"use client"

import { createContext, useContext, useState, useCallback, type ReactNode } from "react"
import type { Portfolio, Holding, StockHolding, CryptoHolding } from "@/lib/types"

interface PortfolioContextType {
  portfolio: Portfolio
  selectedHolding: Holding | null
  setSelectedHolding: (holding: Holding | null) => void
  buyAsset: (holding: Partial<Holding>) => void
  sellAsset: (holdingId: string, amount: number) => void
  updateHoldingPrice: (holdingId: string, newPrice: number, changePercent: number) => void
}

const PortfolioContext = createContext<PortfolioContextType | undefined>(undefined)

// Sample initial portfolio data
const initialPortfolio: Portfolio = {
  holdings: [
    {
      id: "stock-1",
      type: "stock",
      ticker: "AAPL",
      companyName: "Apple Inc.",
      shares: 10,
      avgCost: 150.0,
      currentPrice: 175.5,
      changePercent: 1.2,
      sector: "technology",
      position: [-5, 0, -5],
    },
    {
      id: "stock-2",
      type: "stock",
      ticker: "MSFT",
      companyName: "Microsoft",
      shares: 8,
      avgCost: 350.0,
      currentPrice: 380.25,
      changePercent: -0.5,
      sector: "technology",
      position: [5, 0, -5],
    },
    {
      id: "stock-3",
      type: "stock",
      ticker: "JNJ",
      companyName: "Johnson & Johnson",
      shares: 15,
      avgCost: 160.0,
      currentPrice: 165.8,
      changePercent: 0.8,
      sector: "healthcare",
      position: [-5, 0, -8],
    },
    {
      id: "bond-1",
      type: "bond",
      bondType: "government",
      name: "US Treasury 10Y",
      amount: 25000,
      yield: 4.2,
      maturityYears: 5,
      currentValue: 25000,
      position: [-8, 0, -12],
    },
    {
      id: "bond-2",
      type: "bond",
      bondType: "corporate",
      name: "Apple Corporate Bond",
      amount: 15000,
      yield: 5.8,
      maturityYears: 3,
      currentValue: 15200,
      position: [8, 0, -12],
    },
    {
      id: "crypto-1",
      type: "crypto",
      symbol: "BTC",
      name: "Bitcoin",
      amount: 0.5,
      avgCost: 45000,
      currentPrice: 52000,
      changePercent: 3.5,
      position: [12, 0, -5],
    },
    {
      id: "crypto-2",
      type: "crypto",
      symbol: "ETH",
      name: "Ethereum",
      amount: 5,
      avgCost: 2800,
      currentPrice: 3100,
      changePercent: 2.1,
      position: [12, 0, -8],
    },
    {
      id: "reit-1",
      type: "reit",
      ticker: "VNQ",
      name: "Vanguard Real Estate ETF",
      shares: 20,
      avgCost: 85.0,
      currentPrice: 88.5,
      changePercent: 0.6,
      reitType: "residential",
      position: [-12, 0, -5],
    },
  ],
  cash: 5000,
  totalValue: 125000,
  dailyChange: 2850,
  dailyChangePercent: 2.33,
}

export function PortfolioProvider({ children }: { children: ReactNode }) {
  const [portfolio, setPortfolio] = useState<Portfolio>(initialPortfolio)
  const [selectedHolding, setSelectedHolding] = useState<Holding | null>(null)

  const calculateTotalValue = useCallback((holdings: Holding[], cash: number): number => {
    const holdingsValue = holdings.reduce((total, holding) => {
      switch (holding.type) {
        case "stock":
          return total + holding.shares * holding.currentPrice
        case "bond":
          return total + holding.currentValue
        case "crypto":
          return total + holding.amount * holding.currentPrice
        case "reit":
          return total + holding.shares * holding.currentPrice
        default:
          return total
      }
    }, 0)
    return holdingsValue + cash
  }, [])

  const buyAsset = useCallback(
    (newHolding: Partial<Holding>) => {
      // Implementation for buying new assets
      console.log("Buying asset:", newHolding)
    },
    [portfolio],
  )

  const sellAsset = useCallback(
    (holdingId: string, amount: number) => {
      setPortfolio((prev) => {
        const holding = prev.holdings.find((h) => h.id === holdingId)
        if (!holding) return prev

        let updatedHoldings = [...prev.holdings]
        let cashBack = 0

        switch (holding.type) {
          case "stock":
            cashBack = amount * holding.currentPrice
            if (amount >= holding.shares) {
              updatedHoldings = updatedHoldings.filter((h) => h.id !== holdingId)
            } else {
              updatedHoldings = updatedHoldings.map((h) =>
                h.id === holdingId ? { ...h, shares: (h as StockHolding).shares - amount } : h,
              )
            }
            break
          case "crypto":
            cashBack = amount * holding.currentPrice
            if (amount >= holding.amount) {
              updatedHoldings = updatedHoldings.filter((h) => h.id !== holdingId)
            } else {
              updatedHoldings = updatedHoldings.map((h) =>
                h.id === holdingId ? { ...h, amount: (h as CryptoHolding).amount - amount } : h,
              )
            }
            break
        }

        const newCash = prev.cash + cashBack
        const newTotalValue = calculateTotalValue(updatedHoldings, newCash)

        return {
          ...prev,
          holdings: updatedHoldings,
          cash: newCash,
          totalValue: newTotalValue,
        }
      })
    },
    [calculateTotalValue],
  )

  const updateHoldingPrice = useCallback(
    (holdingId: string, newPrice: number, changePercent: number) => {
      setPortfolio((prev) => {
        const updatedHoldings = prev.holdings.map((holding) => {
          if (holding.id === holdingId) {
            if (holding.type === "stock" || holding.type === "reit") {
              return { ...holding, currentPrice: newPrice, changePercent }
            } else if (holding.type === "crypto") {
              return { ...holding, currentPrice: newPrice, changePercent }
            }
          }
          return holding
        })

        const newTotalValue = calculateTotalValue(updatedHoldings, prev.cash)
        const dailyChange = newTotalValue - prev.totalValue
        const dailyChangePercent = (dailyChange / prev.totalValue) * 100

        return {
          ...prev,
          holdings: updatedHoldings,
          totalValue: newTotalValue,
          dailyChange,
          dailyChangePercent,
        }
      })
    },
    [calculateTotalValue],
  )

  return (
    <PortfolioContext.Provider
      value={{
        portfolio,
        selectedHolding,
        setSelectedHolding,
        buyAsset,
        sellAsset,
        updateHoldingPrice,
      }}
    >
      {children}
    </PortfolioContext.Provider>
  )
}

export function usePortfolio() {
  const context = useContext(PortfolioContext)
  if (context === undefined) {
    throw new Error("usePortfolio must be used within a PortfolioProvider")
  }
  return context
}
