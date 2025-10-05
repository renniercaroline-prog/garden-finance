"use client"

import { createContext, useContext, useState, useCallback, type ReactNode } from "react"
import type { Achievement, Quest, EducationalContent, UserProgress } from "@/lib/types"

interface GamificationContextType {
  userProgress: UserProgress
  achievements: Achievement[]
  quests: Quest[]
  lessons: EducationalContent[]
  addXP: (amount: number, reason: string) => void
  completeQuest: (questId: string) => void
  unlockAchievement: (achievementId: string) => void
  completeLesson: (lessonId: string) => void
}

const GamificationContext = createContext<GamificationContextType | undefined>(undefined)

// Sample achievements
const sampleAchievements: Achievement[] = [
  {
    id: "first-plant",
    title: "First Seed",
    description: "Plant your first investment in the garden",
    icon: "🌱",
    category: "milestone",
    xpReward: 50,
    unlocked: true,
    unlockedAt: new Date(),
  },
  {
    id: "diversified",
    title: "Diversified Gardener",
    description: "Own at least one of each asset type",
    icon: "🌈",
    category: "investing",
    xpReward: 100,
    unlocked: false,
    progress: 3,
    maxProgress: 4,
  },
  {
    id: "green-thumb",
    title: "Green Thumb",
    description: "Achieve 10% portfolio growth",
    icon: "👍",
    category: "investing",
    xpReward: 200,
    unlocked: false,
    progress: 2.33,
    maxProgress: 10,
  },
  {
    id: "social-butterfly",
    title: "Social Butterfly",
    description: "Visit 5 friend gardens",
    icon: "🦋",
    category: "social",
    xpReward: 75,
    unlocked: false,
    progress: 0,
    maxProgress: 5,
  },
  {
    id: "scholar",
    title: "Investment Scholar",
    description: "Complete 10 educational lessons",
    icon: "📚",
    category: "learning",
    xpReward: 150,
    unlocked: false,
    progress: 0,
    maxProgress: 10,
  },
  {
    id: "diamond-hands",
    title: "Diamond Hands",
    description: "Hold an investment for 30 days",
    icon: "💎",
    category: "investing",
    xpReward: 250,
    unlocked: false,
    progress: 0,
    maxProgress: 30,
  },
]

// Sample quests
const sampleQuests: Quest[] = [
  {
    id: "daily-check",
    title: "Daily Garden Check",
    description: "Visit your garden and check your portfolio",
    type: "daily",
    xpReward: 25,
    completed: true,
    progress: 1,
    maxProgress: 1,
    expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24),
  },
  {
    id: "learn-stocks",
    title: "Learn About Stocks",
    description: "Complete a lesson about stock investing",
    type: "daily",
    xpReward: 50,
    completed: false,
    progress: 0,
    maxProgress: 1,
    expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24),
  },
  {
    id: "visit-friend",
    title: "Visit a Friend",
    description: "Explore a friend's garden",
    type: "daily",
    xpReward: 30,
    completed: false,
    progress: 0,
    maxProgress: 1,
    expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24),
  },
  {
    id: "weekly-diversify",
    title: "Diversify Your Portfolio",
    description: "Add 3 different types of investments",
    type: "weekly",
    xpReward: 150,
    completed: false,
    progress: 0,
    maxProgress: 3,
    expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
  },
]

// Sample educational content
const sampleLessons: EducationalContent[] = [
  {
    id: "stocks-101",
    type: "stock",
    title: "Introduction to Stocks",
    description: "Learn the basics of stock investing and how companies grow in your garden",
    content:
      "Stocks represent ownership in a company. When you buy stock, you become a shareholder and own a piece of that business. In your garden, stocks appear as colorful flowers that bloom based on company performance.",
    difficulty: "beginner",
    readTime: 3,
    xpReward: 50,
    completed: false,
  },
  {
    id: "bonds-101",
    type: "bond",
    title: "Understanding Bonds",
    description: "Discover how bonds provide stable income like sturdy trees in your garden",
    content:
      "Bonds are loans you make to governments or corporations. They pay regular interest (yield) and return your principal at maturity. In your garden, bonds grow as strong trees that provide steady, reliable growth.",
    difficulty: "beginner",
    readTime: 4,
    xpReward: 50,
    completed: false,
  },
  {
    id: "crypto-101",
    type: "crypto",
    title: "Cryptocurrency Basics",
    description: "Explore digital currencies represented as glowing crystals in your greenhouse",
    content:
      "Cryptocurrencies are digital assets that use blockchain technology. They're highly volatile but offer potential for significant growth. In your garden, crypto appears as glowing crystals in a special greenhouse.",
    difficulty: "intermediate",
    readTime: 5,
    xpReward: 75,
    completed: false,
  },
  {
    id: "reit-101",
    type: "reit",
    title: "Real Estate Investment Trusts",
    description: "Learn how REITs let you invest in real estate through miniature buildings",
    content:
      "REITs allow you to invest in real estate without buying property directly. They own and operate income-producing real estate. In your garden, REITs appear as miniature buildings with lit windows showing occupancy.",
    difficulty: "intermediate",
    readTime: 4,
    xpReward: 75,
    completed: false,
  },
  {
    id: "diversification",
    type: "general",
    title: "The Power of Diversification",
    description: "Why a varied garden is healthier than planting just one type",
    content:
      "Diversification means spreading investments across different asset types to reduce risk. A diverse garden with flowers, trees, crystals, and buildings is more resilient to market changes than one with only flowers.",
    difficulty: "beginner",
    readTime: 3,
    xpReward: 50,
    completed: false,
  },
  {
    id: "risk-management",
    type: "general",
    title: "Managing Investment Risk",
    description: "Learn to protect your garden from market storms",
    content:
      "Risk management involves understanding your risk tolerance and balancing high-risk investments (crypto) with stable ones (bonds). Monitor your garden's weather to understand market conditions.",
    difficulty: "advanced",
    readTime: 6,
    xpReward: 100,
    completed: false,
  },
]

const calculateXPForLevel = (level: number): number => {
  return Math.floor(100 * Math.pow(1.5, level - 1))
}

export function GamificationProvider({ children }: { children: ReactNode }) {
  const [userProgress, setUserProgress] = useState<UserProgress>({
    level: 10,
    xp: 450,
    xpToNextLevel: calculateXPForLevel(11),
    totalXp: 2450,
    achievements: sampleAchievements,
    quests: sampleQuests,
    completedLessons: [],
  })

  const [achievements] = useState<Achievement[]>(sampleAchievements)
  const [quests, setQuests] = useState<Quest[]>(sampleQuests)
  const [lessons, setLessons] = useState<EducationalContent[]>(sampleLessons)

  const addXP = useCallback((amount: number, reason: string) => {
    setUserProgress((prev) => {
      let newXP = prev.xp + amount
      let newLevel = prev.level
      const newTotalXP = prev.totalXp + amount

      // Check for level up
      while (newXP >= calculateXPForLevel(newLevel + 1)) {
        newXP -= calculateXPForLevel(newLevel + 1)
        newLevel++
      }

      console.log(`[v0] +${amount} XP: ${reason}`)

      return {
        ...prev,
        xp: newXP,
        level: newLevel,
        totalXp: newTotalXP,
        xpToNextLevel: calculateXPForLevel(newLevel + 1),
      }
    })
  }, [])

  const completeQuest = useCallback(
    (questId: string) => {
      setQuests((prev) =>
        prev.map((quest) => {
          if (quest.id === questId && !quest.completed) {
            addXP(quest.xpReward, `Completed quest: ${quest.title}`)
            return { ...quest, completed: true, progress: quest.maxProgress }
          }
          return quest
        }),
      )
    },
    [addXP],
  )

  const unlockAchievement = useCallback(
    (achievementId: string) => {
      setUserProgress((prev) => {
        const achievement = prev.achievements.find((a) => a.id === achievementId)
        if (achievement && !achievement.unlocked) {
          addXP(achievement.xpReward, `Unlocked achievement: ${achievement.title}`)
          return {
            ...prev,
            achievements: prev.achievements.map((a) =>
              a.id === achievementId ? { ...a, unlocked: true, unlockedAt: new Date() } : a,
            ),
          }
        }
        return prev
      })
    },
    [addXP],
  )

  const completeLesson = useCallback(
    (lessonId: string) => {
      setLessons((prev) =>
        prev.map((lesson) => {
          if (lesson.id === lessonId && !lesson.completed) {
            addXP(lesson.xpReward, `Completed lesson: ${lesson.title}`)
            return { ...lesson, completed: true }
          }
          return lesson
        }),
      )

      setUserProgress((prev) => ({
        ...prev,
        completedLessons: [...prev.completedLessons, lessonId],
      }))
    },
    [addXP],
  )

  return (
    <GamificationContext.Provider
      value={{
        userProgress,
        achievements,
        quests,
        lessons,
        addXP,
        completeQuest,
        unlockAchievement,
        completeLesson,
      }}
    >
      {children}
    </GamificationContext.Provider>
  )
}

export function useGamification() {
  const context = useContext(GamificationContext)
  if (context === undefined) {
    throw new Error("useGamification must be used within a GamificationProvider")
  }
  return context
}
