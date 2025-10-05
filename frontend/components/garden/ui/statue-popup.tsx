"use client"

import { useEffect, useMemo } from "react"
import { X } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

export type StatueType = "donation" | "startup" | "stocks"

interface StatuePopupProps {
  statueType: StatueType
  onClose: () => void
}

interface ChatMessage {
  sender: string
  initials: string
  timestamp: string
  text: string
  highlight?: boolean
}

const statueConfig: Record<StatueType, {
  title: string
  description: string
  accent: string
  badgeText: string
  badgeClass: string
  highlightRing: string
  pinClass: string
  bubbleClass: string
  highlightBubbleClass: string
  messages: ChatMessage[]
  placeholder: string
}> = {
  donation: {
    title: "Donation Group",
    description: "Community members coordinating charitable impact.",
    accent: "from-rose-100 via-rose-50 to-white",
    badgeText: "Monthly impact sprint",
    badgeClass: "text-rose-600 bg-rose-50 border border-rose-200",
    highlightRing: "ring-2 ring-offset-2 ring-rose-300/70",
    pinClass: "bg-rose-400",
    bubbleClass: "bg-white/70",
    highlightBubbleClass: "bg-rose-50/80",
    messages: [
      {
        sender: "Amina",
        initials: "A",
        timestamp: "08:12",
        text: "Morning team! The Girls Education Fund is only $9k away from this month's target. Can anyone reach out to their network today?",
        highlight: true,
      },
      {
        sender: "Priya",
        initials: "P",
        timestamp: "08:17",
        text: "I just confirmed a matching pledge from Lighthouse Bank. They'll double whatever we raise this week up to $5k!",
      },
      {
        sender: "Sofia",
        initials: "S",
        timestamp: "08:24",
        text: "I'll host a quick lunchtime livestream to showcase the new mentorship program. Drop any success stories you want me to feature.",
      },
      {
        sender: "Camila",
        initials: "C",
        timestamp: "08:32",
        text: "Shared the donation link with our alumni Slack. Expect a bump later this afternoon.",
      },
    ],
    placeholder: "Share an update with the Donation Group...",
  },
  startup: {
    title: "Startup Group",
    description: "Early-stage investors swapping their latest finds.",
    accent: "from-amber-100 via-orange-50 to-white",
    badgeText: "Deal flow tonight",
    badgeClass: "text-amber-600 bg-amber-50 border border-amber-200",
    highlightRing: "ring-2 ring-offset-2 ring-amber-300/70",
    pinClass: "bg-orange-400",
    bubbleClass: "bg-white/70",
    highlightBubbleClass: "bg-amber-50/80",
    messages: [
      {
        sender: "Noah",
        initials: "N",
        timestamp: "21:05",
        text: "Heads up: Aurora Robotics just closed a pilot with three hospital systems. Seed round still open at a $12M cap.",
        highlight: true,
      },
      {
        sender: "Grace",
        initials: "G",
        timestamp: "21:09",
        text: "I met their founder last week—super sharp. Product reduces surgical prep time by 28%. I'm allocating 3% of my angel fund.",
      },
      {
        sender: "Elena",
        initials: "E",
        timestamp: "21:14",
        text: "If you join, mention the Collective Women term sheet. They're giving us pro-rata rights in the next round.",
      },
      {
        sender: "Maya",
        initials: "M",
        timestamp: "21:20",
        text: "Also look at their talent roster—ex-Boston Dynamics engineers and a former Mayo Clinic director. I'm in for $15k.",
      },
    ],
    placeholder: "Drop your latest startup intel...",
  },
  stocks: {
    title: "Stocks Group",
    description: "Portfolio pros tracking market momentum together.",
    accent: "from-indigo-100 via-blue-50 to-white",
    badgeText: "Market session live",
    badgeClass: "text-indigo-600 bg-indigo-50 border border-indigo-200",
    highlightRing: "ring-2 ring-offset-2 ring-indigo-300/70",
    pinClass: "bg-indigo-500",
    bubbleClass: "bg-white/70",
    highlightBubbleClass: "bg-indigo-50/80",
    messages: [
      {
        sender: "Jordan",
        initials: "J",
        timestamp: "12:42",
        text: "Just rotated 5% into green infrastructure ETFs. Grid modernization package might pass committee tomorrow.",
        highlight: true,
      },
      {
        sender: "Liu",
        initials: "L",
        timestamp: "12:46",
        text: "Monitoring earnings alerts: Solis Energy beat top-line by 7% and raised guidance. Buying the dip under $34.",
      },
      {
        sender: "Harper",
        initials: "H",
        timestamp: "12:53",
        text: "Reminder: Women's leadership index rebalances next week. Expect inflows into companies meeting parity targets.",
      },
      {
        sender: "Rowan",
        initials: "R",
        timestamp: "12:57",
        text: "Anyone tracking liquidity on the new climate bond tranche? Yield spread looks unusually generous.",
      },
    ],
    placeholder: "Share your latest market move...",
  },
}

export default function StatuePopup({ statueType, onClose }: StatuePopupProps) {
  const config = useMemo(() => statueConfig[statueType], [statueType])
  const participantCount = useMemo(() => new Set(config.messages.map((message) => message.sender)).size, [config])
  const pinnedCount = useMemo(() => config.messages.filter((message) => message.highlight).length, [config])
  const messageCount = config.messages.length

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose()
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [onClose])

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 px-4"
      onClick={onClose}
    >
      <Card
        className="relative w-full max-w-2xl overflow-hidden border border-white/40 bg-white/90 shadow-2xl shadow-black/20 backdrop-blur-xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className={`absolute inset-0 bg-gradient-to-br ${config.accent} opacity-60 pointer-events-none`} />
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="absolute right-4 top-4 z-10 text-muted-foreground hover:text-foreground"
        >
          <X className="h-5 w-5" />
        </Button>

        <CardHeader className="relative z-10 space-y-4 pb-6">
          <div className="flex flex-wrap items-center gap-2">
            <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide ${config.badgeClass}`}>
              <span className={`h-2 w-2 rounded-full ${config.pinClass}`} />
              {config.badgeText}
            </span>
          </div>
          <div className="space-y-2">
            <CardTitle className="text-3xl font-semibold text-slate-900 drop-shadow-sm">{config.title}</CardTitle>
            <CardDescription className="text-base text-slate-700">
              {config.description}
            </CardDescription>
          </div>
          <div className="grid gap-3 text-xs text-slate-600 sm:grid-cols-3">
            {[{
              label: "Active voices",
              value: participantCount,
            }, {
              label: "Pinned highlights",
              value: pinnedCount,
            }, {
              label: "Messages today",
              value: messageCount,
            }].map(({ label, value }) => (
              <div
                key={label}
                className="rounded-lg bg-white/70 px-3 py-2 text-center shadow-inner shadow-black/5 backdrop-blur"
              >
                <p className="text-sm font-semibold text-slate-900">{value}</p>
                <p>{label}</p>
              </div>
            ))}
          </div>
        </CardHeader>

        <CardContent className="relative z-10 space-y-5">
          <div className="rounded-2xl border border-white/70 bg-white/60 p-5 shadow-lg shadow-black/10 backdrop-blur">
            <ScrollArea className="h-64 pr-4">
              <div className="space-y-5">
                {config.messages.map((message, index) => {
                  const bubbleClasses = message.highlight
                    ? `${config.highlightBubbleClass} ${config.highlightRing}`
                    : config.bubbleClass
                  const isLast = index === config.messages.length - 1

                  return (
                    <div key={`${message.sender}-${index}`} className="relative pl-8">
                      {!isLast && (
                        <span className="pointer-events-none absolute left-[13px] top-7 bottom-[-18px] w-px bg-slate-200/70" />
                      )}

                      <span className={`absolute left-0 top-5 flex h-6 w-6 items-center justify-center rounded-full border-2 border-white shadow ${config.pinClass}`} />

                      <div
                        className={`flex items-start gap-3 rounded-2xl border border-white/60 p-4 shadow-sm backdrop-blur ${bubbleClasses}`}
                      >
                        <Avatar className="h-9 w-9 border border-white/80 shadow-sm">
                          <AvatarFallback className="bg-slate-900 text-white">
                            {message.initials}
                          </AvatarFallback>
                        </Avatar>
                        <div className="space-y-2">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="text-sm font-semibold text-slate-900">{message.sender}</span>
                            <span className="text-xs text-slate-500">{message.timestamp}</span>
                            {message.highlight && (
                              <span className="rounded-full bg-white/60 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-slate-700">
                                Pinned
                              </span>
                            )}
                          </div>
                          <p className="text-sm leading-relaxed text-slate-700">
                            {message.text}
                          </p>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </ScrollArea>
          </div>

          <form
            onSubmit={(event) => {
              event.preventDefault()
            }}
            className="space-y-3 rounded-2xl border border-white/70 bg-white/60 p-5 shadow-inner shadow-black/10 backdrop-blur"
          >
            <Textarea
              placeholder={config.placeholder}
              className="min-h-[90px] resize-none border-white/60 bg-white/80 text-sm text-slate-700 shadow-sm"
              disabled
            />
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span>Live messaging will arrive in a future update.</span>
              <Button type="button" size="sm" disabled className="cursor-not-allowed opacity-70">
                Message coming soon
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
