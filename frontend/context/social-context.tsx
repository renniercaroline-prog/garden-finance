"use client"

import { createContext, useContext, useState, type ReactNode } from "react"
import type { Friend, LeaderboardEntry, GardenVisit } from "@/lib/types"

interface SocialContextType {
  friends: Friend[]
  leaderboard: LeaderboardEntry[]
  currentVisit: GardenVisit | null
  visitGarden: (friendId: string) => void
  returnToMyGarden: () => void
  addFriend: (friendId: string) => void
  removeFriend: (friendId: string) => void
}

const SocialContext = createContext<SocialContextType | undefined>(undefined)

// Sample friends data
const sampleFriends: Friend[] = [
  {
    id: "friend-1",
    username: "sarah_investor",
    displayName: "Sarah Chen",
    avatar: "👩‍💼",
    portfolioValue: 145000,
    dailyChange: 3200,
    dailyChangePercent: 2.26,
    gardenTheme: "spring",
    level: 12,
    achievements: 24,
    lastActive: new Date(Date.now() - 1000 * 60 * 15), // 15 min ago
  },
  {
    id: "friend-2",
    username: "mike_trader",
    displayName: "Mike Johnson",
    avatar: "👨‍💻",
    portfolioValue: 98000,
    dailyChange: -1200,
    dailyChangePercent: -1.21,
    gardenTheme: "summer",
    level: 9,
    achievements: 18,
    lastActive: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
  },
  {
    id: "friend-3",
    username: "emma_hodl",
    displayName: "Emma Davis",
    avatar: "👩‍🎨",
    portfolioValue: 210000,
    dailyChange: 5800,
    dailyChangePercent: 2.84,
    gardenTheme: "autumn",
    level: 15,
    achievements: 32,
    lastActive: new Date(Date.now() - 1000 * 60 * 5), // 5 min ago
  },
  {
    id: "friend-4",
    username: "alex_crypto",
    displayName: "Alex Martinez",
    avatar: "🧑‍🚀",
    portfolioValue: 67000,
    dailyChange: 4100,
    dailyChangePercent: 6.52,
    gardenTheme: "winter",
    level: 7,
    achievements: 14,
    lastActive: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
  },
]

// Sample leaderboard data
const sampleLeaderboard: LeaderboardEntry[] = [
  {
    rank: 1,
    userId: "friend-3",
    username: "emma_hodl",
    displayName: "Emma Davis",
    avatar: "👩‍🎨",
    portfolioValue: 210000,
    dailyReturn: 2.84,
    weeklyReturn: 8.2,
    monthlyReturn: 15.6,
    yearlyReturn: 42.3,
    level: 15,
  },
  {
    rank: 2,
    userId: "friend-1",
    username: "sarah_investor",
    displayName: "Sarah Chen",
    avatar: "👩‍💼",
    portfolioValue: 145000,
    dailyReturn: 2.26,
    weeklyReturn: 6.8,
    monthlyReturn: 12.4,
    yearlyReturn: 38.7,
    level: 12,
  },
  {
    rank: 3,
    userId: "you",
    username: "you",
    displayName: "You",
    avatar: "🌱",
    portfolioValue: 125000,
    dailyReturn: 2.33,
    weeklyReturn: 5.2,
    monthlyReturn: 11.8,
    yearlyReturn: 35.2,
    level: 10,
  },
  {
    rank: 4,
    userId: "friend-2",
    username: "mike_trader",
    displayName: "Mike Johnson",
    avatar: "👨‍💻",
    portfolioValue: 98000,
    dailyReturn: -1.21,
    weeklyReturn: 3.4,
    monthlyReturn: 9.2,
    yearlyReturn: 28.5,
    level: 9,
  },
  {
    rank: 5,
    userId: "friend-4",
    username: "alex_crypto",
    displayName: "Alex Martinez",
    avatar: "🧑‍🚀",
    portfolioValue: 67000,
    dailyReturn: 6.52,
    weeklyReturn: 12.1,
    monthlyReturn: 18.9,
    yearlyReturn: 52.8,
    level: 7,
  },
]

export function SocialProvider({ children }: { children: ReactNode }) {
  const [friends, setFriends] = useState<Friend[]>(sampleFriends)
  const [leaderboard] = useState<LeaderboardEntry[]>(sampleLeaderboard)
  const [currentVisit, setCurrentVisit] = useState<GardenVisit | null>(null)

  const visitGarden = (friendId: string) => {
    setCurrentVisit({
      friendId,
      timestamp: new Date(),
    })
  }

  const returnToMyGarden = () => {
    setCurrentVisit(null)
  }

  const addFriend = (friendId: string) => {
    // Implementation for adding friends
    console.log("Adding friend:", friendId)
  }

  const removeFriend = (friendId: string) => {
    setFriends((prev) => prev.filter((f) => f.id !== friendId))
  }

  return (
    <SocialContext.Provider
      value={{
        friends,
        leaderboard,
        currentVisit,
        visitGarden,
        returnToMyGarden,
        addFriend,
        removeFriend,
      }}
    >
      {children}
    </SocialContext.Provider>
  )
}

export function useSocial() {
  const context = useContext(SocialContext)
  if (context === undefined) {
    throw new Error("useSocial must be used within a SocialProvider")
  }
  return context
}
