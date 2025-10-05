"use client"

import Link from "next/link"
import { ArrowLeft, Home, LineChart, PieChart, Wallet, TrendingUp, TrendingDown } from "lucide-react"
import { PortfolioProvider, usePortfolio } from "@/context/portfolio-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { cn } from "@/lib/utils"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart"
import {
  Area,
  AreaChart,
  CartesianGrid,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Pie,
  PieChart as RechartsPieChart,
  Cell,
} from "recharts"

function currency(value: number) {
  return value.toLocaleString(undefined, { style: "currency", currency: "USD", maximumFractionDigits: 0 })
}

function percent(value: number) {
  return `${(value).toFixed(2)}%`
}

function PortfolioDashboard() {
  const { portfolio } = usePortfolio()

  const byType = portfolio.holdings.reduce<Record<string, number>>((acc, h) => {
    switch (h.type) {
      case "stock":
        acc.stock = (acc.stock || 0) + h.shares * h.currentPrice
        break
      case "crypto":
        acc.crypto = (acc.crypto || 0) + h.amount * h.currentPrice
        break
      case "reit":
        acc.reit = (acc.reit || 0) + h.shares * h.currentPrice
        break
      case "bond":
        acc.bond = (acc.bond || 0) + h.currentValue
        break
    }
    return acc
  }, { cash: portfolio.cash })

  const allocationData = Object.entries(byType).map(([name, value]) => ({ name, value }))
  const allocationColors: Record<string, string> = {
    stock: "#4a7c3c",   // green
    crypto: "#f4c430",  // gold
    reit: "#6b9080",    // sage
    bond: "#d4756e",    // terracotta
    cash: "#a8b5a0",    // soft gray-green
  }

  // Generate a soft synthetic equity curve for display purposes (static page)
  const seed = 0.003
  const perfData = Array.from({ length: 30 }).map((_, i) => {
    const drift = 1 + seed * i
    const wiggle = 1 + (Math.sin(i / 3) * 0.01 + Math.cos(i / 5) * 0.006)
    const value = Math.round(portfolio.totalValue * drift * wiggle)
    return { day: `D${i + 1}`, value }
  })

  const dailyPositive = portfolio.dailyChange >= 0

  return (
    <div className="min-h-screen house-bg relative">
      <div className="mx-auto w-full max-w-7xl px-6 py-10 relative z-10">
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-800/20 border-2 border-amber-900/30 shadow-lg">
              <Home className="h-6 w-6 text-amber-900" />
            </div>
            <div>
              <h1 className="text-4xl font-bold leading-tight text-amber-950" style={{ fontFamily: 'Georgia, serif', textShadow: '0 1px 2px rgba(255,255,255,0.5)' }}>
                Your Cozy House
              </h1>
              <p className="text-amber-900/70 text-sm font-medium">A warm overview of your investments</p>
            </div>
          </div>
          <Link 
            href="/" 
            className="inline-flex items-center gap-2 rounded-lg border-2 border-amber-900/30 bg-amber-800/10 px-4 py-2 text-sm font-medium text-amber-950 transition-all hover:bg-amber-800/20 hover:border-amber-900/40 shadow-md"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Garden
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between text-base">
                <span className="flex items-center gap-2"><Wallet className="h-4 w-4" /> Total Value</span>
                <Badge variant="secondary" className="font-mono">{percent(portfolio.dailyChangePercent)}</Badge>
              </CardTitle>
              <CardDescription>Combined value of all rooms</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{currency(portfolio.totalValue)}</div>
              <div className={cn("mt-2 inline-flex items-center gap-1 text-sm", dailyPositive ? "text-emerald-600" : "text-rose-600")}
              >
                {dailyPositive ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                <span>{currency(Math.abs(portfolio.dailyChange))} today</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base"><LineChart className="h-4 w-4" /> Performance</CardTitle>
              <CardDescription>Past month synthetic curve</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{ value: { label: "Equity", color: "hsl(var(--primary))" } }}
                className="h-44 md:h-48 aspect-auto"
              >
                <AreaChart data={perfData} margin={{ left: 0, right: 0, top: 10, bottom: 0 }}>
                  <defs>
                    <linearGradient id="areaGradient" x1="0" x2="0" y1="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.35} />
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0.02} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="day" hide />
                  <YAxis hide domain={["dataMin - 1000", "dataMax + 1000"]} />
                  <Area type="monotone" dataKey="value" stroke="hsl(var(--primary))" fill="url(#areaGradient)" strokeWidth={2} />
                  <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                </AreaChart>
              </ChartContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base"><PieChart className="h-4 w-4" /> Allocation</CardTitle>
              <CardDescription>How your rooms are furnished</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={Object.fromEntries(allocationData.map((d) => [d.name, { label: d.name }]))}
                className="h-56 aspect-square"
              >
                <RechartsPieChart>
                  <Pie data={allocationData} dataKey="value" nameKey="name" innerRadius={40} outerRadius={70}>
                    {allocationData.map((entry) => (
                      <Cell key={entry.name} fill={allocationColors[entry.name] || "hsl(var(--muted))"} />
                    ))}
                  </Pie>
                  <ChartLegend content={<ChartLegendContent />} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                </RechartsPieChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>

        <div className="mt-8">
          <Tabs defaultValue="holdings">
            <TabsList className="grid w-full grid-cols-3 md:w-auto">
              <TabsTrigger value="holdings">Holdings</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
              <TabsTrigger value="cash">Cash & Bonds</TabsTrigger>
            </TabsList>

            <TabsContent value="holdings" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Portfolio Holdings</CardTitle>
                  <CardDescription>Each item is a plant in your garden, now viewed from home</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Asset</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead className="text-right">Position</TableHead>
                          <TableHead className="text-right">Price</TableHead>
                          <TableHead className="text-right">Change</TableHead>
                          <TableHead className="text-right">Market Value</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {portfolio.holdings.map((h) => {
                          const change = (h as any).changePercent ?? 0
                          const isUp = change >= 0
                          const price =
                            h.type === "stock" || h.type === "reit"
                              ? h.currentPrice
                              : h.type === "crypto"
                                ? h.currentPrice
                                : undefined
                          const qty =
                            h.type === "stock" || h.type === "reit"
                              ? h.shares
                              : h.type === "crypto"
                                ? h.amount
                                : h.type === "bond"
                                  ? h.amount
                                  : 0
                          const value =
                            h.type === "stock" || h.type === "reit"
                              ? h.shares * h.currentPrice
                              : h.type === "crypto"
                                ? h.amount * h.currentPrice
                                : h.type === "bond"
                                  ? h.currentValue
                                  : 0

                          return (
                            <TableRow key={h.id}>
                              <TableCell className="font-medium">
                                {h.type === "stock" || h.type === "reit" ? ("ticker" in h ? h.ticker : (h as any).ticker) : h.type === "crypto" ? h.symbol : "Bond"}
                              </TableCell>
                              <TableCell className="capitalize">{h.type}</TableCell>
                              <TableCell className="text-right">{qty.toLocaleString()}</TableCell>
                              <TableCell className="text-right">{price ? currency(price) : "—"}</TableCell>
                              <TableCell className={cn("text-right", isUp ? "text-emerald-600" : "text-rose-600")}>{percent(change)}</TableCell>
                              <TableCell className="text-right font-medium">{currency(value)}</TableCell>
                            </TableRow>
                          )
                        })}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="analytics" className="mt-4">
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Sector Exposure</CardTitle>
                    <CardDescription>Technology, healthcare, real estate and more</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ChartContainer
                      config={{ value: { label: "Value", color: "hsl(var(--chart-1))" } }}
                      className="h-60"
                    >
                      <AreaChart
                        data={perfData.map((d, i) => ({ ...d, tech: d.value * (0.35 + Math.sin(i / 4) * 0.02), other: d.value * (0.65 - Math.sin(i / 4) * 0.02) }))}
                        margin={{ left: 0, right: 0, top: 10, bottom: 0 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="day" />
                        <YAxis tickFormatter={(v) => `$${Math.round(v / 1000)}k`} />
                        <Area type="monotone" dataKey="tech" stroke="hsl(var(--chart-1))" fillOpacity={0.2} fill="hsl(var(--chart-1))" />
                        <Area type="monotone" dataKey="other" stroke="hsl(var(--chart-2))" fillOpacity={0.15} fill="hsl(var(--chart-2))" />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <ChartLegend content={<ChartLegendContent />} />
                      </AreaChart>
                    </ChartContainer>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Risk & Cushion</CardTitle>
                    <CardDescription>Equity vs. liquidity mix</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-sm text-muted-foreground">Cash on hand</div>
                        <div className="text-xl font-semibold">{currency(portfolio.cash)}</div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">Equity exposure</div>
                        <div className="text-xl font-semibold">{percent(((portfolio.totalValue - portfolio.cash) / portfolio.totalValue) * 100)}</div>
                      </div>
                    </div>
                    <div className="mt-4 rounded-lg border bg-muted/40 p-4 text-sm text-muted-foreground">
                      Your house feels {((portfolio.totalValue - portfolio.cash) / portfolio.totalValue) > 0.7 ? "energetic and growth-oriented" : "balanced and steady"}. Keep a comfy cash couch for rainy days.
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="cash" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Cash & Bonds</CardTitle>
                  <CardDescription>Your cushions and foundations</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    <div className="rounded-lg border p-4">
                      <div className="text-sm text-muted-foreground">Cash</div>
                      <div className="text-2xl font-bold">{currency(portfolio.cash)}</div>
                    </div>
                    {portfolio.holdings.filter((h) => h.type === "bond").map((b) => (
                      <div key={b.id} className="rounded-lg border p-4">
                        <div className="text-sm text-muted-foreground">{b.name}</div>
                        <div className="text-2xl font-bold">{currency((b as any).currentValue)}</div>
                        <div className="mt-1 text-xs text-muted-foreground">Yield: {(b as any).yield}% • Maturity: {(b as any).maturityYears}y</div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}

export default function PortfolioPage() {
  return (
    <PortfolioProvider>
      <PortfolioDashboard />
    </PortfolioProvider>
  )
}


