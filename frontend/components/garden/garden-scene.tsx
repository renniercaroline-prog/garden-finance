"use client"
import { Sky, Environment } from "@react-three/drei"
import Terrain from "./environment/terrain"
import Lighting from "./environment/lighting"
import FirstPersonControls from "./controls/first-person-controls"
import EntryGate from "./structures/entry-gate"
import CentralFountain from "./structures/central-fountain"
import FlowerBed from "./plants/flower-bed"
import Tree from "./plants/tree"
import CryptoPlant from "./plants/crypto-plant"
import REITBuilding from "./plants/reit-building"
import Greenhouse from "./structures/greenhouse"
import { usePortfolio } from "@/context/portfolio-context"

export default function GardenScene() {
  const { portfolio } = usePortfolio()

  return (
    <>
      {/* Environment */}
      <Sky distance={450000} sunPosition={[100, 20, 100]} inclination={0.6} azimuth={0.25} />
      <Environment preset="park" />
      <fog attach="fog" args={["#e8ebe4", 50, 150]} />

      {/* Lighting */}
      <Lighting />

      {/* Terrain */}
      <Terrain />

      {/* Garden Structures */}
      <EntryGate position={[0, 0, 15]} />
      <CentralFountain
        position={[0, 0, 0]}
        portfolioValue={portfolio.totalValue}
        dailyChange={portfolio.dailyChangePercent}
      />

      {/* Greenhouse for Crypto */}
      <Greenhouse position={[12, 0, -6]} />

      {/* Render all holdings dynamically */}
      {portfolio.holdings.map((holding) => {
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
            return null
        }
      })}

      {/* First Person Controls */}
      <FirstPersonControls />
    </>
  )
}
