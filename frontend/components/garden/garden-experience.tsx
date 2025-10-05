"use client"

import { Canvas } from "@react-three/fiber"
import { Suspense, useState } from "react"
import GardenScene from "./garden-scene-working"
import HUD from "./ui/hud"
import LoadingScreen from "./ui/loading-screen"
import Instructions from "./ui/instructions"
import PlantDetailPanel from "./ui/plant-detail-panel"
import MarketTicker from "./ui/market-ticker"
import MarketEvents from "./ui/market-events"
import FriendsPanel from "./ui/friends-panel"
import LeaderboardPanel from "./ui/leaderboard-panel"
import GardenPortal from "./ui/garden-portal"
import SocialActions from "./ui/social-actions"
import ProgressBar from "./ui/progress-bar"
import QuestsPanel from "./ui/quests-panel"
import AchievementsPanel from "./ui/achievements-panel"
import LearningCenter from "./ui/learning-center"
import FlowerPopup from "./ui/flower-popup"
import InvestmentDetailPopup from "./ui/investment-detail-popup"
import StatuePopup, { StatueType } from "./ui/statue-popup"
import { PortfolioProvider, usePortfolio } from "@/context/portfolio-context"
import { SocialProvider } from "@/context/social-context"
import { StocksProvider } from "@/context/stocks-context"
import { GamificationProvider } from "@/context/gamification-context"

type FlowerType = "startups" | "causes" | "currencies" | null

interface Investment {
  id: number
  name: string
  type: "startup" | "cause" | "currency"
  amount: number
}

function GardenExperienceContent() {
  const [activeFlower, setActiveFlower] = useState<FlowerType>(null)
  const [investments, setInvestments] = useState<Investment[]>([])
  const [selectedInvestment, setSelectedInvestment] = useState<Investment | null>(null)
  const [isAmountDialogOpen, setIsAmountDialogOpen] = useState(false)
  const [activeStatue, setActiveStatue] = useState<StatueType | null>(null)
  const { spendMoney, refundMoney } = usePortfolio()

  const exitPointerLockIfNeeded = () => {
    if (typeof document !== "undefined" && document.pointerLockElement) {
      document.exitPointerLock?.()
    }
  }

  const handleFlowerClick = (flower: FlowerType) => {
    exitPointerLockIfNeeded()
    setActiveStatue(null)
    setSelectedInvestment(null)
    setActiveFlower(flower)
  }

  const handleInvestmentSelect = (investment: Investment) => {
    exitPointerLockIfNeeded()
    setActiveStatue(null)
    setActiveFlower(null)
    setSelectedInvestment(investment)
  }

  const handleStatueClick = (statue: StatueType) => {
    exitPointerLockIfNeeded()
    setActiveFlower(null)
    setSelectedInvestment(null)
    setIsAmountDialogOpen(false)
    setActiveStatue(statue)
  }

  const handleInvest = (id: number, name: string, type: "startup" | "cause" | "currency", amount: number) => {
    setInvestments((prev) => [...prev, { id, name, type, amount }])
    spendMoney(amount)
    setActiveFlower(null) // Close popup after investing
    setIsAmountDialogOpen(false) // Close amount dialog
    setActiveStatue(null)
  }

  const handleRemoveInvestment = (id: number) => {
    const investment = investments.find((inv) => inv.id === id)
    if (investment) {
      refundMoney(investment.amount)
    }
    setInvestments((prev) => prev.filter((inv) => inv.id !== id))
  }

  return (
    <div className="w-full h-screen relative">
      {/* 3D Canvas */}
      <div className="canvas-container">
        <Canvas
          shadows
          camera={{ position: [0, 1.6, 5], fov: 75 }}
          gl={{
            antialias: true,
            alpha: false,
            powerPreference: "high-performance",
            preserveDrawingBuffer: true
          }}
          onCreated={({ gl }) => {
            console.log("✅ Canvas created successfully")
            gl.setClearColor("#87CEEB")
          }}
        >
          <Suspense fallback={null}>
            <GardenScene
              onFlowerClick={handleFlowerClick}
              controlsEnabled={!activeFlower && !selectedInvestment && !isAmountDialogOpen && !activeStatue}
              investments={investments}
              onInvestmentClick={handleInvestmentSelect}
              onStatueClick={handleStatueClick}
            />
          </Suspense>
        </Canvas>
      </div>

      {/* UI Overlay */}
      <div className="ui-overlay">
        <ProgressBar />
        <HUD />
        <Instructions />
        <PlantDetailPanel />
        <MarketTicker />
        <MarketEvents />
        <FriendsPanel />
        <LeaderboardPanel />
        <GardenPortal />
        <SocialActions />
        <QuestsPanel />
        <AchievementsPanel />
        <LearningCenter />
        <div className="crosshair" />
      </div>

      {/* Flower Popup */}
      {activeFlower && (
        <FlowerPopup
          flowerType={activeFlower}
          onClose={() => setActiveFlower(null)}
          onInvest={handleInvest}
          onAmountDialogChange={setIsAmountDialogOpen}
        />
      )}

      {/* Investment Detail Popup */}
      {selectedInvestment && (
        <InvestmentDetailPopup
          investment={selectedInvestment}
          onClose={() => setSelectedInvestment(null)}
          onRemove={handleRemoveInvestment}
        />
      )}

      {/* Statue Popups */}
      {activeStatue && (
        <StatuePopup
          statueType={activeStatue}
          onClose={() => setActiveStatue(null)}
        />
      )}

      {/* Loading Screen */}
      <LoadingScreen />
    </div>
  )
}

export default function GardenExperience() {
  return (
    <PortfolioProvider>
      <SocialProvider>
        <GamificationProvider>
          <StocksProvider>
            <GardenExperienceContent />
          </StocksProvider>
        </GamificationProvider>
      </SocialProvider>
    </PortfolioProvider>
  )
}
