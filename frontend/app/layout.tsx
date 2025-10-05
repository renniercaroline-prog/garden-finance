import type React from "react"
import { Geist, Geist_Mono, Crimson_Text } from "next/font/google"
import "./globals.css"

const geistSans = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
})

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
})

const crimsonText = Crimson_Text({
  weight: ["400", "600", "700"],
  subsets: ["latin"],
  variable: "--font-crimson",
})

export const metadata = {
  title: "Garden Finance - Grow Your Wealth",
  description:
    "A beautiful 3D investment tracking and financial education app where your portfolio grows like a garden",
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} ${crimsonText.variable} antialiased`}>
      <body>{children}</body>
    </html>
  )
}
