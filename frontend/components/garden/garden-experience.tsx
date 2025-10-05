"use client"

import { Canvas } from "@react-three/fiber"
import { Suspense } from "react"
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
import { PortfolioProvider } from "@/context/portfolio-context"
import { SocialProvider } from "@/context/social-context"
import { GamificationProvider } from "@/context/gamification-context"

export default function GardenExperience() {
  return (
    <PortfolioProvider>
      <SocialProvider>
        <GamificationProvider>
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
                  <GardenScene />
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

            {/* Loading Screen */}
            <LoadingScreen />
          </div>
        </GamificationProvider>
      </SocialProvider>
    </PortfolioProvider>
  )
}
