import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { ThemeProvider } from "@/components/theme-provider"
import { LanguageProvider } from "@/lib/language-context"
import { RouteProvider } from "@/lib/route-context"
import { Suspense } from "react"
import "./globals.css"

export const metadata: Metadata = {
  title: "SmartTransit - Real-Time Bus Tracking",
  description: "Real-time public transport tracking for small cities",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <Suspense fallback={null}>
          <LanguageProvider>
            <RouteProvider>
              <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false} disableTransitionOnChange>
                {children}
              </ThemeProvider>
            </RouteProvider>
          </LanguageProvider>
        </Suspense>
        <Analytics />
      </body>
    </html>
  )
}
