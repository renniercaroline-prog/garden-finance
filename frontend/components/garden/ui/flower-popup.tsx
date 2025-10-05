"use client"

import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"

interface FlowerPopupProps {
  flowerType: "startups" | "causes" | "currencies"
  onClose: () => void
}

const flowerConfig = {
  startups: {
    title: "Startups",
    description: "Invest in innovative startups and early-stage companies",
    color: "#F5C542",
    emoji: "🌻",
  },
  causes: {
    title: "Causes",
    description: "Support social causes and make a positive impact",
    color: "#dc143c",
    emoji: "🌹",
  },
  currencies: {
    title: "Currencies",
    description: "Trade and invest in digital currencies",
    color: "#9b59b6",
    emoji: "💜",
  },
}

const mockStartups = [
  {
    id: 1,
    name: "Sarah Chen",
    startup: "EcoPackage",
    description: "Biodegradable packaging solutions for e-commerce companies. Our plant-based materials decompose in 90 days and reduce shipping costs by 30%. Already partnered with 50+ online retailers.",
    seeking: "$50,000",
    raised: "$32,000",
    raisedAmount: 32000,
    goalAmount: 50000,
    stage: "Seed",
  },
  {
    id: 2,
    name: "Marcus Johnson",
    startup: "HealthAI",
    description: "AI-powered personalized nutrition and wellness platform. Uses machine learning to analyze health data and create custom meal plans. 10,000+ active users with 85% retention rate.",
    seeking: "$100,000",
    raised: "$78,000",
    raisedAmount: 78000,
    goalAmount: 100000,
    stage: "Series A",
  },
  {
    id: 3,
    name: "Amina Patel",
    startup: "FarmConnect",
    description: "Connecting small farmers directly to urban consumers through our mobile app. Eliminates middlemen, increases farmer income by 40%, and delivers fresh produce within 24 hours.",
    seeking: "$75,000",
    raised: "$45,000",
    raisedAmount: 45000,
    goalAmount: 75000,
    stage: "Seed",
  },
  {
    id: 4,
    name: "David Kim",
    startup: "EduLearn",
    description: "Adaptive learning platform for underserved communities. Provides free education in STEM subjects with offline capabilities. Reached 25,000 students across 15 countries.",
    seeking: "$60,000",
    raised: "$12,000",
    raisedAmount: 12000,
    goalAmount: 60000,
    stage: "Pre-seed",
  },
  {
    id: 5,
    name: "Maria Rodriguez",
    startup: "CleanWave",
    description: "Ocean plastic recycling and upcycling technology. Converts marine debris into durable construction materials. Collected 500 tons of plastic and created 200 jobs in coastal communities.",
    seeking: "$120,000",
    raised: "$95,000",
    raisedAmount: 95000,
    goalAmount: 120000,
    stage: "Series A",
  },
  {
    id: 6,
    name: "James Wu",
    startup: "SolarHome",
    description: "Affordable solar panel installations for rural areas with flexible payment plans. Installed 1,000+ systems, reducing energy costs by 60% for families earning under $30k annually.",
    seeking: "$80,000",
    raised: "$56,000",
    raisedAmount: 56000,
    goalAmount: 80000,
    stage: "Seed",
  },
  {
    id: 7,
    name: "Fatima Mbeki",
    startup: "CraftMarket",
    description: "Digital marketplace connecting African artisans to global customers. Fair trade certified, supports 500+ craftspeople, and preserves traditional art forms while providing sustainable income.",
    seeking: "$45,000",
    raised: "$28,000",
    raisedAmount: 28000,
    goalAmount: 45000,
    stage: "Pre-seed",
  },
  {
    id: 8,
    name: "Carlos Santos",
    startup: "WaterPure",
    description: "Low-cost water filtration systems for developing regions. Solar-powered units provide clean water for 100 people each. Deployed 200 units serving 20,000+ people in 8 countries.",
    seeking: "$65,000",
    raised: "$41,000",
    raisedAmount: 41000,
    goalAmount: 65000,
    stage: "Seed",
  },
  {
    id: 9,
    name: "Priya Sharma",
    startup: "CodeHer",
    description: "Coding bootcamp for women in emerging markets with job placement guarantee. 90% graduation rate and 85% job placement within 3 months. Trained 300+ women developers so far.",
    seeking: "$55,000",
    raised: "$38,000",
    raisedAmount: 38000,
    goalAmount: 55000,
    stage: "Seed",
  },
  {
    id: 10,
    name: "Ahmed Hassan",
    startup: "MediTrack",
    description: "Mobile health records system for rural clinics with offline sync capabilities. Digitized records for 50,000+ patients across 100 clinics, improving diagnosis accuracy by 40%.",
    seeking: "$70,000",
    raised: "$52,000",
    raisedAmount: 52000,
    goalAmount: 70000,
    stage: "Seed",
  },
]

export default function FlowerPopup({ flowerType, onClose }: FlowerPopupProps) {
  const config = flowerConfig[flowerType]

  const handleInvest = (startupId: number, name: string) => {
    console.log(`Investing in startup ${startupId} - ${name}`)
    // TODO: Implement investment logic
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <Card className="w-full max-w-3xl max-h-[80vh] flex flex-col shadow-2xl">
        <CardHeader className="border-b" style={{ borderBottomColor: config.color }}>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <span className="text-4xl">{config.emoji}</span>
              <div>
                <CardTitle className="text-2xl" style={{ color: config.color }}>
                  {config.title}
                </CardTitle>
                <CardDescription className="mt-1">{config.description}</CardDescription>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose} className="ml-4">
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="flex-1 overflow-hidden p-0">
          {flowerType === "startups" ? (
            <ScrollArea className="h-[500px] p-6">
              <div className="space-y-3">
                {mockStartups.map((startup) => (
                  <Card key={startup.id} className="overflow-hidden">
                    <CardContent className="p-3">
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-0.5">
                            <h3 className="font-semibold text-base">{startup.name}</h3>
                            <span className="text-xs px-1.5 py-0.5 rounded-full bg-gray-100 text-gray-700">
                              {startup.stage}
                            </span>
                          </div>
                          <h4 className="font-medium text-sm mb-1.5" style={{ color: config.color }}>
                            {startup.startup}
                          </h4>
                          <p className="text-xs text-muted-foreground mb-2 leading-relaxed">{startup.description}</p>
                          <div className="space-y-1.5">
                            <div className="flex items-center justify-between text-xs">
                              <span className="text-muted-foreground">
                                {startup.raised} raised of {startup.seeking}
                              </span>
                              <span className="font-medium" style={{ color: config.color }}>
                                {Math.round((startup.raisedAmount / startup.goalAmount) * 100)}%
                              </span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div
                                className="h-2 rounded-full transition-all"
                                style={{
                                  width: `${(startup.raisedAmount / startup.goalAmount) * 100}%`,
                                  backgroundColor: config.color,
                                }}
                              />
                            </div>
                          </div>
                        </div>
                        <Button
                          onClick={() => handleInvest(startup.id, startup.name)}
                          className="text-white hover:opacity-90 shrink-0 text-sm h-8 px-3"
                          style={{ backgroundColor: config.color }}
                        >
                          Invest
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          ) : (
            <div className="p-6">
              <p className="text-sm text-muted-foreground">
                Click below to explore opportunities in {config.title.toLowerCase()}.
              </p>
              <div className="flex gap-3 mt-4">
                <Button
                  className="flex-1 text-white hover:opacity-90"
                  style={{ backgroundColor: config.color }}
                >
                  Explore {config.title}
                </Button>
                <Button variant="outline" className="flex-1" onClick={onClose}>
                  Close
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
