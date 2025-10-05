export type AssetType = "stock" | "bond" | "crypto" | "reit" | "cash"

export type Sector =
  | "technology"
  | "healthcare"
  | "energy"
  | "finance"
  | "consumer"
  | "realestate"
  | "materials"
  | "utilities"

export type BondType = "government" | "corporate" | "highyield"

export interface StockHolding {
  id: string
  type: "stock"
  ticker: string
  companyName: string
  shares: number
  avgCost: number
  currentPrice: number
  changePercent: number
  sector: Sector
  position: [number, number, number]
}

export interface BondHolding {
  id: string
  type: "bond"
  bondType: BondType
  name: string
  amount: number
  yield: number
  maturityYears: number
  currentValue: number
  position: [number, number, number]
}

export interface CryptoHolding {
  id: string
  type: "crypto"
  symbol: string
  name: string
  amount: number
  avgCost: number
  currentPrice: number
  changePercent: number
  position: [number, number, number]
}

export interface REITHolding {
  id: string
  type: "reit"
  ticker: string
  name: string
  shares: number
  avgCost: number
  currentPrice: number
  changePercent: number
  reitType: "residential" | "commercial" | "industrial"
  position: [number, number, number]
}

export type Holding = StockHolding | BondHolding | CryptoHolding | REITHolding

export interface Portfolio {
  holdings: Holding[]
  cash: number
  totalValue: number
  dailyChange: number
  dailyChangePercent: number
}

export interface PlantInteraction {
  holdingId: string
  action: "view" | "buy" | "sell" | "water"
}

export interface Friend {
  id: string
  username: string
  displayName: string
  avatar: string
  portfolioValue: number
  dailyChange: number
  dailyChangePercent: number
  gardenTheme: "spring" | "summer" | "autumn" | "winter"
  level: number
  achievements: number
  lastActive: Date
}

export interface LeaderboardEntry {
  rank: number
  userId: string
  username: string
  displayName: string
  avatar: string
  portfolioValue: number
  dailyReturn: number
  weeklyReturn: number
  monthlyReturn: number
  yearlyReturn: number
  level: number
}

export interface GardenVisit {
  friendId: string
  timestamp: Date
}

export interface Achievement {
  id: string
  title: string
  description: string
  icon: string
  category: "investing" | "social" | "learning" | "milestone"
  xpReward: number
  unlocked: boolean
  unlockedAt?: Date
  progress?: number
  maxProgress?: number
}

export interface Quest {
  id: string
  title: string
  description: string
  type: "daily" | "weekly" | "special"
  xpReward: number
  completed: boolean
  progress: number
  maxProgress: number
  expiresAt: Date
}

export interface EducationalContent {
  id: string
  type: "stock" | "bond" | "crypto" | "reit" | "general"
  title: string
  description: string
  content: string
  difficulty: "beginner" | "intermediate" | "advanced"
  readTime: number
  xpReward: number
  completed: boolean
}

export interface UserProgress {
  level: number
  xp: number
  xpToNextLevel: number
  totalXp: number
  achievements: Achievement[]
  quests: Quest[]
  completedLessons: string[]
}
