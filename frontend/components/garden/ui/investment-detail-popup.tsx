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

const donationDetails: Record<string, any> = {
  "Girls Education Fund": {
    name: "Girls Education Fund",
    organization: "Global Learning Initiative",
    description:
      "Providing scholarships and educational resources for girls in underserved communities. Supporting 5,000+ girls across 20 countries with school supplies, uniforms, and mentorship programs.",
    seeking: "$75,000",
    raised: "$48,000",
    category: "Education",
    color: "#dc143c",
  },
  "Women's Health Clinic": {
    name: "Women's Health Clinic",
    organization: "Maternal Care Foundation",
    description:
      "Mobile health clinics providing prenatal care, cancer screenings, and reproductive health services to women in rural areas. Served 10,000+ women with free healthcare services.",
    seeking: "$100,000",
    raised: "$67,000",
    category: "Healthcare",
    color: "#dc143c",
  },
  "Safe Haven Project": {
    name: "Safe Haven Project",
    organization: "Women's Shelter Network",
    description:
      "Emergency shelter and support services for women escaping domestic violence. Provides safe housing, counseling, legal aid, and job training for 500+ women annually.",
    seeking: "$85,000",
    raised: "$52,000",
    category: "Safety",
    color: "#dc143c",
  },
  "Girls Code Academy": {
    name: "Girls Code Academy",
    organization: "Tech Equality Now",
    description:
      "Free coding bootcamps and STEM education for girls aged 10-18. Breaking barriers in tech with hands-on programming classes, mentorship, and internship opportunities. Graduated 800+ students.",
    seeking: "$60,000",
    raised: "$41,000",
    category: "Education",
    color: "#dc143c",
  },
  "Maternal Nutrition Program": {
    name: "Maternal Nutrition Program",
    organization: "Healthy Mothers Initiative",
    description:
      "Nutrition support and prenatal vitamins for pregnant women in food-insecure areas. Reduces maternal mortality and ensures healthy pregnancies for 3,000+ mothers each year.",
    seeking: "$45,000",
    raised: "$28,000",
    category: "Healthcare",
    color: "#dc143c",
  },
  "Women Entrepreneurs Fund": {
    name: "Women Entrepreneurs Fund",
    organization: "Economic Empowerment Collective",
    description:
      "Microloans and business training for women starting their own businesses. 95% loan repayment rate and helped 1,200+ women achieve financial independence.",
    seeking: "$90,000",
    raised: "$73,000",
    category: "Economic",
    color: "#dc143c",
  },
  "Girls Sports Initiative": {
    name: "Girls Sports Initiative",
    organization: "Play Like a Girl",
    description:
      "Sports programs and equipment for girls in underserved schools. Building confidence, leadership, and teamwork through athletics. Reached 2,500+ girls across 50 schools.",
    seeking: "$40,000",
    raised: "$19,000",
    category: "Education",
    color: "#dc143c",
  },
  "Breast Cancer Awareness": {
    name: "Breast Cancer Awareness",
    organization: "Pink Hope Foundation",
    description:
      "Free mammogram screenings and breast cancer education for women in low-income communities. Early detection saves lives - screened 8,000+ women and detected 150+ cases early.",
    seeking: "$70,000",
    raised: "$56,000",
    category: "Healthcare",
    color: "#dc143c",
  },
  "Period Poverty Relief": {
    name: "Period Poverty Relief",
    organization: "Dignity for All",
    description:
      "Free menstrual products and hygiene education for girls who can't afford period supplies. Distributed 100,000+ period kits to schools and shelters, ensuring girls don't miss school.",
    seeking: "$35,000",
    raised: "$22,000",
    category: "Healthcare",
    color: "#dc143c",
  },
  "Women in Leadership": {
    name: "Women in Leadership",
    organization: "Lead Like Her",
    description:
      "Leadership training and mentorship programs for young women entering the workforce. Connecting emerging leaders with successful female executives. Mentored 600+ women in 3 years.",
    seeking: "$55,000",
    raised: "$38,000",
    category: "Economic",
    color: "#dc143c",
  },
}

const currencyDetails: Record<string, any> = {
  Bitcoin: {
    name: "Bitcoin",
    symbol: "BTC",
    description:
      "The first and most widely recognized cryptocurrency. Digital gold with a fixed supply of 21 million coins. Decentralized, secure, and accepted by thousands of merchants worldwide.",
    currentPrice: "$52,350",
    change24h: "+3.2%",
    marketCap: "$1.2T",
    color: "#9b59b6",
  },
  Ethereum: {
    name: "Ethereum",
    symbol: "ETH",
    description:
      "Leading smart contract platform powering DeFi, NFTs, and Web3 applications. Transition to proof-of-stake reduced energy consumption by 99.95%. Second largest cryptocurrency by market cap.",
    currentPrice: "$3,180",
    change24h: "+2.8%",
    marketCap: "$380B",
    color: "#9b59b6",
  },
  Cardano: {
    name: "Cardano",
    symbol: "ADA",
    description:
      "Proof-of-stake blockchain platform focused on sustainability and scalability. Research-driven development with peer-reviewed protocols. Strong community and growing DeFi ecosystem.",
    currentPrice: "$0.52",
    change24h: "-1.4%",
    marketCap: "$18B",
    color: "#9b59b6",
  },
  Solana: {
    name: "Solana",
    symbol: "SOL",
    description:
      "High-performance blockchain supporting up to 65,000 transactions per second. Low fees and fast confirmation times make it ideal for DeFi and NFT applications.",
    currentPrice: "$98.50",
    change24h: "+5.6%",
    marketCap: "$42B",
    color: "#9b59b6",
  },
  Polkadot: {
    name: "Polkadot",
    symbol: "DOT",
    description:
      "Multi-chain protocol enabling different blockchains to transfer messages and value. Interoperability-focused with shared security model. Founded by Ethereum co-founder Gavin Wood.",
    currentPrice: "$7.85",
    change24h: "+1.9%",
    marketCap: "$10B",
    color: "#9b59b6",
  },
  Chainlink: {
    name: "Chainlink",
    symbol: "LINK",
    description:
      "Decentralized oracle network connecting smart contracts to real-world data. Essential infrastructure for DeFi with partnerships across 900+ projects. Industry-leading oracle solution.",
    currentPrice: "$15.20",
    change24h: "-0.8%",
    marketCap: "$8.5B",
    color: "#9b59b6",
  },
  Polygon: {
    name: "Polygon",
    symbol: "MATIC",
    description:
      "Ethereum scaling solution providing faster and cheaper transactions. Layer 2 network hosting major DeFi protocols and NFT marketplaces. Used by Disney, Instagram, and Reddit.",
    currentPrice: "$0.88",
    change24h: "+4.3%",
    marketCap: "$8.2B",
    color: "#9b59b6",
  },
  Avalanche: {
    name: "Avalanche",
    symbol: "AVAX",
    description:
      "Fast smart contract platform with sub-second finality. Eco-friendly proof-of-stake consensus. Growing ecosystem of DeFi apps and institutional partnerships.",
    currentPrice: "$38.60",
    change24h: "+2.1%",
    marketCap: "$14B",
    color: "#9b59b6",
  },
  Cosmos: {
    name: "Cosmos",
    symbol: "ATOM",
    description:
      "Internet of Blockchains connecting independent chains through IBC protocol. Enables sovereignty and interoperability. Powering 250+ apps and services across the ecosystem.",
    currentPrice: "$11.40",
    change24h: "-2.3%",
    marketCap: "$4.5B",
    color: "#9b59b6",
  },
  Algorand: {
    name: "Algorand",
    symbol: "ALGO",
    description:
      "Pure proof-of-stake blockchain with carbon-negative footprint. Instant finality and low transaction costs. Used by central banks for digital currency experiments.",
    currentPrice: "$0.32",
    change24h: "+1.5%",
    marketCap: "$2.8B",
    color: "#9b59b6",
  },
}

export default function InvestmentDetailPopup({
  investment,
  onClose,
  onRemove,
}: InvestmentDetailPopupProps) {
  const isDonation = investment.type === "cause"
  const isCurrency = investment.type === "currency"

  const details = isCurrency
    ? currencyDetails[investment.name] || {
        name: investment.name,
        symbol: "N/A",
        description: "No details available",
        currentPrice: "$0",
        change24h: "0%",
        marketCap: "$0",
        color: "#9b59b6",
      }
    : isDonation
    ? donationDetails[investment.name] || {
        name: investment.name,
        organization: "Unknown",
        description: "No details available",
        seeking: "$0",
        raised: "$0",
        category: "Unknown",
        color: "#dc143c",
      }
    : startupDetails[investment.name] || {
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
                  {isCurrency ? details.symbol : isDonation ? details.category : details.stage}
                </span>
              </div>
              <CardDescription className="mt-1">
                {isCurrency ? details.currentPrice : isDonation ? details.organization : `Founded by ${details.founder}`}
              </CardDescription>
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

            {isCurrency ? (
              <div>
                <h3 className="font-semibold mb-2">Market Stats</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">24h Change</span>
                    <span className={details.change24h.startsWith('+') ? "text-green-600" : "text-red-600"}>
                      {details.change24h}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Market Cap</span>
                    <span className="font-medium" style={{ color: details.color }}>
                      {details.marketCap}
                    </span>
                  </div>
                </div>
              </div>
            ) : (
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
            )}

            <div className="flex gap-3 pt-4 border-t">
              <Button
                variant="destructive"
                className="flex-1"
                onClick={handleRemove}
              >
                {isCurrency ? "Sell Currency" : isDonation ? "Remove Donation" : "Remove Investment"}
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
