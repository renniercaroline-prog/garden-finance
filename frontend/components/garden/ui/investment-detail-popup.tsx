"use client"

import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface InvestmentDetailPopupProps {
  investment: {
    id: number
    name: string
    type: "startup" | "cause" | "currency"
  }
  onClose: () => void
  onRemove: (id: number) => void
}

// Match the startup data from the main popup
const startupDetails: Record<string, any> = {
  EcoPackage: {
    name: "EcoPackage",
    founder: "Sarah Chen",
    description:
      "Biodegradable packaging solutions for e-commerce companies. Our plant-based materials decompose in 90 days and reduce shipping costs by 30%. Already partnered with 50+ online retailers.",
    seeking: "$50,000",
    raised: "$32,000",
    stage: "Seed",
    color: "#F5C542",
  },
  HealthAI: {
    name: "HealthAI",
    founder: "Marcus Johnson",
    description:
      "AI-powered personalized nutrition and wellness platform. Uses machine learning to analyze health data and create custom meal plans. 10,000+ active users with 85% retention rate.",
    seeking: "$100,000",
    raised: "$78,000",
    stage: "Series A",
    color: "#F5C542",
  },
  FarmConnect: {
    name: "FarmConnect",
    founder: "Amina Patel",
    description:
      "Connecting small farmers directly to urban consumers through our mobile app. Eliminates middlemen, increases farmer income by 40%, and delivers fresh produce within 24 hours.",
    seeking: "$75,000",
    raised: "$45,000",
    stage: "Seed",
    color: "#F5C542",
  },
  EduLearn: {
    name: "EduLearn",
    founder: "David Kim",
    description:
      "Adaptive learning platform for underserved communities. Provides free education in STEM subjects with offline capabilities. Reached 25,000 students across 15 countries.",
    seeking: "$60,000",
    raised: "$12,000",
    stage: "Pre-seed",
    color: "#F5C542",
  },
  CleanWave: {
    name: "CleanWave",
    founder: "Maria Rodriguez",
    description:
      "Ocean plastic recycling and upcycling technology. Converts marine debris into durable construction materials. Collected 500 tons of plastic and created 200 jobs in coastal communities.",
    seeking: "$120,000",
    raised: "$95,000",
    stage: "Series A",
    color: "#F5C542",
  },
  SolarHome: {
    name: "SolarHome",
    founder: "James Wu",
    description:
      "Affordable solar panel installations for rural areas with flexible payment plans. Installed 1,000+ systems, reducing energy costs by 60% for families earning under $30k annually.",
    seeking: "$80,000",
    raised: "$56,000",
    stage: "Seed",
    color: "#F5C542",
  },
  CraftMarket: {
    name: "CraftMarket",
    founder: "Fatima Mbeki",
    description:
      "Digital marketplace connecting African artisans to global customers. Fair trade certified, supports 500+ craftspeople, and preserves traditional art forms while providing sustainable income.",
    seeking: "$45,000",
    raised: "$28,000",
    stage: "Pre-seed",
    color: "#F5C542",
  },
  WaterPure: {
    name: "WaterPure",
    founder: "Carlos Santos",
    description:
      "Low-cost water filtration systems for developing regions. Solar-powered units provide clean water for 100 people each. Deployed 200 units serving 20,000+ people in 8 countries.",
    seeking: "$65,000",
    raised: "$41,000",
    stage: "Seed",
    color: "#F5C542",
  },
  CodeHer: {
    name: "CodeHer",
    founder: "Priya Sharma",
    description:
      "Coding bootcamp for women in emerging markets with job placement guarantee. 90% graduation rate and 85% job placement within 3 months. Trained 300+ women developers so far.",
    seeking: "$55,000",
    raised: "$38,000",
    stage: "Seed",
    color: "#F5C542",
  },
  MediTrack: {
    name: "MediTrack",
    founder: "Ahmed Hassan",
    description:
      "Mobile health records system for rural clinics with offline sync capabilities. Digitized records for 50,000+ patients across 100 clinics, improving diagnosis accuracy by 40%.",
    seeking: "$70,000",
    raised: "$52,000",
    stage: "Seed",
    color: "#F5C542",
  },
}

export default function InvestmentDetailPopup({
  investment,
  onClose,
  onRemove,
}: InvestmentDetailPopupProps) {
  const details = startupDetails[investment.name] || {
    name: investment.name,
    founder: "Unknown",
    description: "No details available",
    seeking: "$0",
    raised: "$0",
    stage: "Unknown",
    color: "#F5C542",
  }

  const handleRemove = () => {
    onRemove(investment.id)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <Card className="w-full max-w-2xl shadow-2xl">
        <CardHeader className="border-b" style={{ borderBottomColor: details.color }}>
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <CardTitle className="text-2xl" style={{ color: details.color }}>
                  {details.name}
                </CardTitle>
                <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-700">
                  {details.stage}
                </span>
              </div>
              <CardDescription className="mt-1">Founded by {details.founder}</CardDescription>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose} className="ml-4">
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="p-6">
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">About</h3>
              <p className="text-sm text-muted-foreground">{details.description}</p>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Funding Progress</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">
                    {details.raised} raised of {details.seeking}
                  </span>
                  <span className="font-medium" style={{ color: details.color }}>
                    {Math.round(
                      (parseInt(details.raised.replace(/\$|,/g, "")) /
                        parseInt(details.seeking.replace(/\$|,/g, ""))) *
                        100
                    )}
                    %
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="h-2 rounded-full transition-all"
                    style={{
                      width: `${
                        (parseInt(details.raised.replace(/\$|,/g, "")) /
                          parseInt(details.seeking.replace(/\$|,/g, ""))) *
                        100
                      }%`,
                      backgroundColor: details.color,
                    }}
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-4 border-t">
              <Button
                variant="destructive"
                className="flex-1"
                onClick={handleRemove}
              >
                Remove Investment
              </Button>
              <Button variant="outline" className="flex-1" onClick={onClose}>
                Close
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
