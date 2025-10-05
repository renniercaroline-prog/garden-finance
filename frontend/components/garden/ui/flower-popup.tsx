"use client"

import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState, useEffect } from "react"
import { useStocks } from "@/context/stocks-context"

interface FlowerPopupProps {
  flowerType: "startups" | "causes" | "currencies"
  onClose: () => void
  onInvest: (id: number, name: string, type: "startup" | "cause" | "currency", amount: number) => void
  onAmountDialogChange?: (isOpen: boolean) => void
}

const flowerConfig = {
  startups: {
    title: "Startups",
    description: "Invest in innovative startups and early-stage companies",
    color: "#F5C542",
    emoji: "🌻",
  },
  causes: {
    title: "Donations",
    description: "Support women-focused causes and make a positive impact",
    color: "#dc143c",
    emoji: "🌹",
  },
  currencies: {
    title: "Stocks",
    description: "Invest in cryptocurrency stocks and digital assets",
    color: "#9b59b6",
    emoji: "💜",
  },
}

type TrendingItem = {
  symbol: string
  shortName?: string
}

type QuoteItem = {
  symbol: string
  shortName?: string
  regularMarketPrice?: number
  regularMarketChangePercent?: number
  marketCap?: number
}

function formatCurrencyUSD(n?: number) {
  if (n == null || Number.isNaN(n)) return "—"
  return n.toLocaleString(undefined, { style: "currency", currency: "USD" })
}

function formatPercent(n?: number) {
  if (n == null || Number.isNaN(n)) return "—"
  return `${n.toFixed(2)}%`
}

function formatMarketCap(n?: number) {
  if (n == null || Number.isNaN(n)) return "—"
  if (n >= 1e12) return `$${(n / 1e12).toFixed(1)}T`
  if (n >= 1e9) return `$${(n / 1e9).toFixed(1)}B`
  if (n >= 1e6) return `$${(n / 1e6).toFixed(1)}M`
  return `$${n.toLocaleString()}`
}

const mockDonations = [
  {
    id: 101,
    name: "Girls Education Fund",
    organization: "Global Learning Initiative",
    description: "Providing scholarships and educational resources for girls in underserved communities. Supporting 5,000+ girls across 20 countries with school supplies, uniforms, and mentorship programs.",
    seeking: "$75,000",
    raised: "$48,000",
    raisedAmount: 48000,
    goalAmount: 75000,
    category: "Education",
  },
  {
    id: 102,
    name: "Women's Health Clinic",
    organization: "Maternal Care Foundation",
    description: "Mobile health clinics providing prenatal care, cancer screenings, and reproductive health services to women in rural areas. Served 10,000+ women with free healthcare services.",
    seeking: "$100,000",
    raised: "$67,000",
    raisedAmount: 67000,
    goalAmount: 100000,
    category: "Healthcare",
  },
  {
    id: 103,
    name: "Safe Haven Project",
    organization: "Women's Shelter Network",
    description: "Emergency shelter and support services for women escaping domestic violence. Provides safe housing, counseling, legal aid, and job training for 500+ women annually.",
    seeking: "$85,000",
    raised: "$52,000",
    raisedAmount: 52000,
    goalAmount: 85000,
    category: "Safety",
  },
  {
    id: 104,
    name: "Girls Code Academy",
    organization: "Tech Equality Now",
    description: "Free coding bootcamps and STEM education for girls aged 10-18. Breaking barriers in tech with hands-on programming classes, mentorship, and internship opportunities. Graduated 800+ students.",
    seeking: "$60,000",
    raised: "$41,000",
    raisedAmount: 41000,
    goalAmount: 60000,
    category: "Education",
  },
  {
    id: 105,
    name: "Maternal Nutrition Program",
    organization: "Healthy Mothers Initiative",
    description: "Nutrition support and prenatal vitamins for pregnant women in food-insecure areas. Reduces maternal mortality and ensures healthy pregnancies for 3,000+ mothers each year.",
    seeking: "$45,000",
    raised: "$28,000",
    raisedAmount: 28000,
    goalAmount: 45000,
    category: "Healthcare",
  },
  {
    id: 106,
    name: "Women Entrepreneurs Fund",
    organization: "Economic Empowerment Collective",
    description: "Microloans and business training for women starting their own businesses. 95% loan repayment rate and helped 1,200+ women achieve financial independence.",
    seeking: "$90,000",
    raised: "$73,000",
    raisedAmount: 73000,
    goalAmount: 90000,
    category: "Economic",
  },
  {
    id: 107,
    name: "Girls Sports Initiative",
    organization: "Play Like a Girl",
    description: "Sports programs and equipment for girls in underserved schools. Building confidence, leadership, and teamwork through athletics. Reached 2,500+ girls across 50 schools.",
    seeking: "$40,000",
    raised: "$19,000",
    raisedAmount: 19000,
    goalAmount: 40000,
    category: "Education",
  },
  {
    id: 108,
    name: "Breast Cancer Awareness",
    organization: "Pink Hope Foundation",
    description: "Free mammogram screenings and breast cancer education for women in low-income communities. Early detection saves lives - screened 8,000+ women and detected 150+ cases early.",
    seeking: "$70,000",
    raised: "$56,000",
    raisedAmount: 56000,
    goalAmount: 70000,
    category: "Healthcare",
  },
  {
    id: 109,
    name: "Period Poverty Relief",
    organization: "Dignity for All",
    description: "Free menstrual products and hygiene education for girls who can't afford period supplies. Distributed 100,000+ period kits to schools and shelters, ensuring girls don't miss school.",
    seeking: "$35,000",
    raised: "$22,000",
    raisedAmount: 22000,
    goalAmount: 35000,
    category: "Healthcare",
  },
  {
    id: 110,
    name: "Women in Leadership",
    organization: "Lead Like Her",
    description: "Leadership training and mentorship programs for young women entering the workforce. Connecting emerging leaders with successful female executives. Mentored 600+ women in 3 years.",
    seeking: "$55,000",
    raised: "$38,000",
    raisedAmount: 38000,
    goalAmount: 55000,
    category: "Economic",
  },
]

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

export default function FlowerPopup({ flowerType, onClose, onInvest, onAmountDialogChange }: FlowerPopupProps) {
  const config = flowerConfig[flowerType]
  const { quotes: trending, loading, error, refresh } = useStocks()
  const [selectedItem, setSelectedItem] = useState<{
    id: number
    name: string
    type: "startup" | "cause" | "currency"
  } | null>(null)
  const [amount, setAmount] = useState("")

  const handleInvest = (startup: { id: number; name: string; startup: string }) => {
    setSelectedItem({ id: startup.id, name: startup.startup, type: "startup" })
    onAmountDialogChange?.(true)
  }

  const handleDonate = (donation: { id: number; name: string; organization: string }) => {
    setSelectedItem({ id: donation.id, name: donation.name, type: "cause" })
    onAmountDialogChange?.(true)
  }

  const handleBuyCurrency = (currency: { id: number; name: string; symbol: string }) => {
    setSelectedItem({ id: currency.id, name: currency.name, type: "currency" })
    onAmountDialogChange?.(true)
  }

  const handleConfirmInvestment = () => {
    if (selectedItem && amount) {
      const investmentAmount = parseFloat(amount)
      if (investmentAmount > 0) {
        onInvest(selectedItem.id, selectedItem.name, selectedItem.type as "startup" | "cause" | "currency", investmentAmount)
        setSelectedItem(null)
        setAmount("")
        onAmountDialogChange?.(false)
      }
    }
  }

  const handleCancelAmount = () => {
    setSelectedItem(null)
    setAmount("")
    onAmountDialogChange?.(false)
  }

  // Force unlock pointer when amount dialog opens
  useEffect(() => {
    if (selectedItem) {
      // Multiple attempts to ensure pointer is unlocked
      if (document.pointerLockElement) {
        document.exitPointerLock()
      }

      // Try again after a short delay to ensure it worked
      const timeout = setTimeout(() => {
        if (document.pointerLockElement) {
          document.exitPointerLock()
        }
      }, 10)

      return () => clearTimeout(timeout)
    }
  }, [selectedItem])

  // Optional: refresh prefetch when user enters the tab
  useEffect(() => {
    if (flowerType === "currencies" && trending.length === 0 && !loading) {
      refresh()
    }
  }, [flowerType])

  return (
    <>
      {/* Amount Input Dialog */}
      {selectedItem && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-md">
          <Card className="w-full max-w-md border-none shadow-2xl bg-gradient-to-br from-white to-gray-50">
            <CardHeader className="pb-4">
              <CardTitle className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                {selectedItem.type === "startup" ? "Investment Amount" : selectedItem.type === "cause" ? "Donation Amount" : "Purchase Amount"}
              </CardTitle>
              <CardDescription className="text-base">
                {selectedItem.type === "startup" ? "Invest in" : selectedItem.type === "cause" ? "Support" : "Buy"} <span className="font-semibold" style={{ color: config.color }}>{selectedItem.name}</span>
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="amount" className="text-sm font-semibold text-gray-700">Amount (USD)</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-medium">$</span>
                  <Input
                    id="amount"
                    type="number"
                    placeholder="0.00"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    onFocus={() => {
                      if (document.pointerLockElement) {
                        document.exitPointerLock()
                      }
                    }}
                    autoFocus
                    min="1"
                    step="1"
                    className="pl-8 h-12 text-lg font-semibold border-2 focus:ring-2 transition-all"
                    style={{
                      borderColor: config.color + '40',
                      '--tw-ring-color': config.color + '60'
                    } as any}
                  />
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <Button
                  onClick={handleConfirmInvestment}
                  className="flex-1 h-11 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
                  style={{ backgroundColor: config.color }}
                  disabled={!amount || parseFloat(amount) <= 0}
                >
                  {selectedItem.type === "startup" ? "Confirm Investment" : selectedItem.type === "cause" ? "Confirm Donation" : "Confirm Purchase"}
                </Button>
                <Button variant="outline" className="flex-1 h-11 font-semibold border-2 hover:bg-gray-50" onClick={handleCancelAmount}>
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Main Popup */}
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md">
        <Card className="w-full max-w-3xl max-h-[85vh] flex flex-col shadow-2xl border-none bg-gradient-to-br from-white via-gray-50 to-white">
        <CardHeader className="border-b-2 pb-6" style={{ borderBottomColor: config.color + '30' }}>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg" style={{ backgroundColor: config.color + '20' }}>
                <span className="text-4xl">{config.emoji}</span>
              </div>
              <div>
                <CardTitle className="text-3xl font-bold" style={{ color: config.color }}>
                  {config.title}
                </CardTitle>
                <CardDescription className="mt-2 text-base text-gray-600">{config.description}</CardDescription>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose} className="ml-4 hover:bg-gray-100 rounded-full">
              <X className="h-5 w-5" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="flex-1 overflow-hidden p-0">
          {flowerType === "startups" ? (
            <ScrollArea className="h-[500px] p-6">
              <div className="space-y-4">
                {mockStartups.map((startup) => (
                  <Card key={startup.id} className="overflow-hidden border-2 hover:shadow-xl transition-all duration-200 hover:border-opacity-60" style={{ borderColor: config.color + '20' }}>
                    <CardContent className="p-5">
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-bold text-lg text-gray-800">{startup.name}</h3>
                            <span className="text-xs px-2.5 py-1 rounded-full font-semibold" style={{ backgroundColor: config.color + '20', color: config.color }}>
                              {startup.stage}
                            </span>
                          </div>
                          <h4 className="font-semibold text-base mb-2" style={{ color: config.color }}>
                            {startup.startup}
                          </h4>
                          <p className="text-sm text-gray-600 mb-3 leading-relaxed">{startup.description}</p>
                          <div className="space-y-2">
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-gray-500 font-medium">
                                {startup.raised} raised of {startup.seeking}
                              </span>
                              <span className="font-bold text-base" style={{ color: config.color }}>
                                {Math.round((startup.raisedAmount / startup.goalAmount) * 100)}%
                              </span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2.5 shadow-inner">
                              <div
                                className="h-2.5 rounded-full transition-all duration-300 shadow-sm"
                                style={{
                                  width: `${(startup.raisedAmount / startup.goalAmount) * 100}%`,
                                  backgroundColor: config.color,
                                }}
                              />
                            </div>
                          </div>
                        </div>
                        <Button
                          onClick={() => handleInvest(startup)}
                          className="text-white font-semibold shrink-0 h-10 px-6 shadow-md hover:shadow-lg transition-all duration-200 hover:scale-105"
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
          ) : flowerType === "causes" ? (
            <ScrollArea className="h-[500px] p-6">
              <div className="space-y-4">
                {mockDonations.map((donation) => (
                  <Card key={donation.id} className="overflow-hidden border-2 hover:shadow-xl transition-all duration-200 hover:border-opacity-60" style={{ borderColor: config.color + '20' }}>
                    <CardContent className="p-5">
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-bold text-lg text-gray-800">{donation.name}</h3>
                            <span className="text-xs px-2.5 py-1 rounded-full font-semibold" style={{ backgroundColor: config.color + '20', color: config.color }}>
                              {donation.category}
                            </span>
                          </div>
                          <h4 className="font-semibold text-base mb-2" style={{ color: config.color }}>
                            {donation.organization}
                          </h4>
                          <p className="text-sm text-gray-600 mb-3 leading-relaxed">{donation.description}</p>
                          <div className="space-y-2">
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-gray-500 font-medium">
                                {donation.raised} raised of {donation.seeking}
                              </span>
                              <span className="font-bold text-base" style={{ color: config.color }}>
                                {Math.round((donation.raisedAmount / donation.goalAmount) * 100)}%
                              </span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2.5 shadow-inner">
                              <div
                                className="h-2.5 rounded-full transition-all duration-300 shadow-sm"
                                style={{
                                  width: `${(donation.raisedAmount / donation.goalAmount) * 100}%`,
                                  backgroundColor: config.color,
                                }}
                              />
                            </div>
                          </div>
                        </div>
                        <Button
                          onClick={() => handleDonate(donation)}
                          className="text-white font-semibold shrink-0 h-10 px-6 shadow-md hover:shadow-lg transition-all duration-200 hover:scale-105"
                          style={{ backgroundColor: config.color }}
                        >
                          Donate
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          ) : flowerType === "currencies" ? (
            <ScrollArea className="h-[500px] p-6">
              <div className="space-y-4">
                {loading ? (
                  <div className="text-center text-sm text-muted-foreground py-8">Loading trending…</div>
                ) : error ? (
                  <div className="text-center text-sm text-destructive py-8">{error}</div>
                ) : trending.length === 0 ? (
                  <div className="text-center text-sm text-muted-foreground py-8">No trending symbols</div>
                ) : (
                  trending.map((q) => {
                    const isPositive = (q.regularMarketChangePercent || 0) >= 0
                    return (
                      <Card key={q.symbol} className="overflow-hidden border-2 hover:shadow-xl transition-all duration-200 hover:border-opacity-60" style={{ borderColor: config.color + '20' }}>
                        <CardContent className="p-5">
                          <div className="flex items-center justify-between gap-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <h3 className="font-bold text-lg text-gray-800">{q.shortName || q.symbol}</h3>
                                <span className="text-xs px-2.5 py-1 rounded-full font-semibold" style={{ backgroundColor: config.color + '20', color: config.color }}>
                                  {q.symbol}
                                </span>
                              </div>
                              <h4 className="font-semibold text-xl mb-2" style={{ color: config.color }}>
                                {formatCurrencyUSD(q.regularMarketPrice)}
                              </h4>
                              <div className="flex items-center gap-4 text-sm">
                                <div className="flex items-center gap-2">
                                  <span className="text-gray-500 font-medium">24h:</span>
                                  <span className={`font-bold ${isPositive ? "text-green-600" : "text-red-600"}`}>
                                    {formatPercent(q.regularMarketChangePercent)}
                                  </span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <span className="text-gray-500 font-medium">Market Cap:</span>
                                  <span className="font-semibold text-gray-700">
                                    {formatMarketCap(q.marketCap)}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <Button
                              onClick={() => handleBuyCurrency({ id: Date.now(), name: q.shortName || q.symbol, symbol: q.symbol })}
                              className="text-white font-semibold shrink-0 h-10 px-6 shadow-md hover:shadow-lg transition-all duration-200 hover:scale-105"
                              style={{ backgroundColor: config.color }}
                            >
                              Buy
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    )
                  })
                )}
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
    </>
  )
}
