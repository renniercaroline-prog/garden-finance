export interface MarketUpdate {
  holdingId: string
  newPrice: number
  changePercent: number
  volume?: number
}

export interface MarketEvent {
  id: string
  type: "news" | "earnings" | "economic" | "sector"
  severity: "positive" | "negative" | "neutral"
  title: string
  description: string
  affectedHoldings: string[]
  timestamp: Date
}

export interface MarketConditions {
  sentiment: "bullish" | "bearish" | "neutral"
  volatility: "low" | "medium" | "high"
  volume: "low" | "medium" | "high"
}

// Simulate realistic price movements
export function generatePriceUpdate(currentPrice: number, volatility = 0.02): number {
  const change = (Math.random() - 0.5) * 2 * volatility
  return currentPrice * (1 + change)
}

// Generate market events
const newsTemplates = {
  positive: [
    "Strong earnings report exceeds expectations",
    "New product launch receives positive reviews",
    "Strategic partnership announced",
    "Market share gains reported",
    "Analyst upgrades rating",
  ],
  negative: [
    "Regulatory concerns emerge",
    "Earnings miss analyst estimates",
    "Supply chain disruptions reported",
    "Competition intensifies in sector",
    "Analyst downgrades rating",
  ],
  neutral: [
    "Quarterly results meet expectations",
    "Management changes announced",
    "Market consolidation continues",
    "Industry conference highlights trends",
    "Routine regulatory filing submitted",
  ],
}

export function generateMarketEvent(holdingIds: string[]): MarketEvent {
  const severities: Array<"positive" | "negative" | "neutral"> = ["positive", "negative", "neutral"]
  const severity = severities[Math.floor(Math.random() * severities.length)]
  const templates = newsTemplates[severity]
  const title = templates[Math.floor(Math.random() * templates.length)]

  return {
    id: `event-${Date.now()}-${Math.random()}`,
    type: Math.random() > 0.5 ? "news" : "earnings",
    severity,
    title,
    description: `Market activity detected affecting selected holdings.`,
    affectedHoldings: holdingIds.slice(0, Math.floor(Math.random() * 3) + 1),
    timestamp: new Date(),
  }
}

export function getMarketConditions(dailyChangePercent: number): MarketConditions {
  let sentiment: "bullish" | "bearish" | "neutral" = "neutral"
  if (dailyChangePercent > 1) sentiment = "bullish"
  else if (dailyChangePercent < -1) sentiment = "bearish"

  const volatility = Math.abs(dailyChangePercent) > 2 ? "high" : Math.abs(dailyChangePercent) > 0.5 ? "medium" : "low"

  return {
    sentiment,
    volatility,
    volume: "medium",
  }
}
