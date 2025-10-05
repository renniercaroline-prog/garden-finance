"use client"
import { Sky } from "@react-three/drei"
import FirstPersonControls from "./controls/first-person-controls"
import Terrain from "./environment/terrain"
import Lighting from "./environment/lighting"
import EntryGate from "./structures/entry-gate"
import CentralFountain from "./structures/central-fountain"
import Greenhouse from "./structures/greenhouse"
import FlowerBed from "./plants/flower-bed"
import Tree from "./plants/tree"
import CryptoPlant from "./plants/crypto-plant"
import REITBuilding from "./plants/reit-building"
import { usePortfolio } from "@/context/portfolio-context"
import type { Holding } from "@/lib/types"

export default function GardenScene() {
  const { portfolio } = usePortfolio()

  console.log("🌿 Full Garden Scene Loading...")
  console.log("📊 Portfolio:", portfolio.holdings.length, "holdings")
  console.log("💰 Total Value:", portfolio.totalValue)

  return (
    <>
      {/* Background */}
      <color attach="background" args={["#87CEEB"]} />
      
      {/* Lighting - Move before Sky for better visibility */}
      <ambientLight intensity={1.5} />
      <directionalLight position={[50, 50, 25]} intensity={2} castShadow />
      <hemisphereLight intensity={0.5} />

      {/* Test ground plane to ensure basic rendering works */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[100, 100]} />
        <meshStandardMaterial color="#6b8e4e" />
      </mesh>

      {/* Sky */}
      <Sky 
        distance={450000} 
        sunPosition={[100, 20, 100]} 
        inclination={0.6} 
        azimuth={0.25}
        turbidity={8}
        rayleigh={2}
      />
      
      {/* Fog for depth */}
      <fog attach="fog" args={["#e8ebe4", 50, 150]} />

      {/* Garden Structures - Wrap in error boundary */}
      {(() => {
        try {
          return (
            <>
              <EntryGate position={[0, 0, 15]} />
              <CentralFountain
                position={[0, 0, 0]}
                portfolioValue={portfolio.totalValue}
                dailyChange={portfolio.dailyChangePercent}
              />
              <Greenhouse position={[12, 0, -6]} />
            </>
          )
        } catch (error) {
          console.error("Error rendering structures:", error)
          return null
        }
      })()}

      {/* Render Portfolio Holdings */}
      {portfolio.holdings.map((holding: Holding) => {
        try {
          switch (holding.type) {
            case "stock":
              return (
                <FlowerBed
                  key={holding.id}
                  position={holding.position}
                  ticker={holding.ticker}
                  companyName={holding.companyName}
                  shares={holding.shares}
                  currentPrice={holding.currentPrice}
                  changePercent={holding.changePercent}
                  sector={holding.sector}
                  holdingId={holding.id}
                />
              )
            case "bond":
              return (
                <Tree
                  key={holding.id}
                  position={holding.position}
                  bondType={holding.bondType}
                  amount={holding.amount}
                  yield={holding.yield}
                  maturityYears={holding.maturityYears}
                  holdingId={holding.id}
                />
              )
            case "crypto":
              return (
                <CryptoPlant
                  key={holding.id}
                  position={holding.position}
                  symbol={holding.symbol}
                  name={holding.name}
                  amount={holding.amount}
                  currentPrice={holding.currentPrice}
                  changePercent={holding.changePercent}
                  holdingId={holding.id}
                />
              )
            case "reit":
              return (
                <REITBuilding
                  key={holding.id}
                  position={holding.position}
                  ticker={holding.ticker}
                  name={holding.name}
                  shares={holding.shares}
                  currentPrice={holding.currentPrice}
                  changePercent={holding.changePercent}
                  reitType={holding.reitType}
                  holdingId={holding.id}
                />
              )
            default:
              console.warn("Unknown holding type:", holding)
              return null
          }
        } catch (error) {
          console.error("Error rendering holding:", holding.id, error)
          return null
        }
      })}

      {/* First Person Controls */}
      <FirstPersonControls />
    </>
  )
}

