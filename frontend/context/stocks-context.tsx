"use client"

import { createContext, useContext, useEffect, useMemo, useState } from "react"

export type TrendingItem = {
  symbol: string
  shortName?: string
}

export type QuoteItem = {
  symbol: string
  shortName?: string
  regularMarketPrice?: number
  regularMarketChangePercent?: number
  marketCap?: number
}

interface StocksContextValue {
  quotes: QuoteItem[]
  loading: boolean
  error: string | null
  refresh: () => void
}

const StocksContext = createContext<StocksContextValue | null>(null)

async function fetchTrendingAndQuotes(): Promise<QuoteItem[]> {
  const base = "https://adahack2025.onrender.com"
  const trendingRes = await fetch(`${base}/yahoo/trending`, { cache: "no-store" })
  if (!trendingRes.ok) throw new Error(`Failed trending: ${trendingRes.status}`)
  const trendingJson: { trending?: Array<{ symbol: string; name?: string }> } = await trendingRes.json()
  const symbols = (trendingJson.trending || []).map((t) => t.symbol)
  if (!symbols.length) return []
  const uniqueSymbols = Array.from(new Set(symbols)).slice(0, 20)

  // Fetch all quotes at once using the backend batch endpoint
  const quotesRes = await fetch(`${base}/yahoo/quotes?symbols=${encodeURIComponent(uniqueSymbols.join(","))}`, {
    cache: "no-store",
  })
  if (!quotesRes.ok) throw new Error(`Failed quotes: ${quotesRes.status}`)
  const quotesJson: Array<{
    symbol: string
    current_price?: number
    change_percent?: number
    market_cap?: number
  }> = await quotesRes.json()

  // Map to frontend-friendly fields; enrich shortName from trending if present
  const nameMap = new Map((trendingJson.trending || []).map((t) => [t.symbol, t.name]))
  return quotesJson.map((q) => ({
    symbol: q.symbol,
    shortName: nameMap.get(q.symbol) || q.symbol,
    regularMarketPrice: q.current_price,
    regularMarketChangePercent: q.change_percent,
    marketCap: q.market_cap,
  }))
}

export function StocksProvider({ children }: { children: React.ReactNode }) {
  const [quotes, setQuotes] = useState<QuoteItem[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  const load = useMemo(
    () =>
      async function load() {
        try {
          setLoading(true)
          setError(null)
          const result = await fetchTrendingAndQuotes()
          setQuotes(result)
        } catch (e: any) {
          setError(e?.message || "Failed to load stocks data")
        } finally {
          setLoading(false)
        }
      },
    [],
  )

  useEffect(() => {
    // Prefetch immediately on mount so data is ready when user opens stocks
    load()
  }, [load])

  return (
    <StocksContext.Provider value={{ quotes, loading, error, refresh: load }}>
      {children}
    </StocksContext.Provider>
  )
}

export function useStocks() {
  const ctx = useContext(StocksContext)
  if (!ctx) throw new Error("useStocks must be used within StocksProvider")
  return ctx
}


