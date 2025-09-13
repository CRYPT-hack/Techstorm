"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Logo } from "./logo"
import { ThemeToggle } from "./theme-toggle"
import { LanguageToggle } from "./language-toggle"
import { Button } from "./ui/button"
import { cn } from "@/lib/utils"
import { useLanguage } from "@/lib/language-context"
import { Home, MapPin, Search, Bell, BarChart3, Users, HelpCircle, Mail, Newspaper, Menu, X } from "lucide-react"
import { useState } from "react"

const navigation = [
  { nameKey: "navigation.home", href: "/", icon: Home },
  { nameKey: "navigation.liveTracking", href: "/tracking", icon: MapPin },
  { nameKey: "navigation.routeSearch", href: "/routes", icon: Search },
  { nameKey: "navigation.nextBusAlert", href: "/alerts", icon: Bell },
  { nameKey: "navigation.adminDashboard", href: "/admin", icon: BarChart3 },
  { nameKey: "navigation.aboutUs", href: "/about", icon: Users },
  { nameKey: "navigation.faq", href: "/faq", icon: HelpCircle },
  { nameKey: "navigation.contact", href: "/contact", icon: Mail },
  { nameKey: "navigation.updates", href: "/updates", icon: Newspaper },
]

export function Navigation() {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { t } = useLanguage()

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center">
            <Logo />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            {navigation.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.nameKey}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md transition-colors",
                    pathname === item.href
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent",
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {t(item.nameKey)}
                </Link>
              )
            })}
          </div>

          <div className="flex items-center gap-2">
            <LanguageToggle />
            <ThemeToggle />

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navigation.map((item) => {
                const Icon = item.icon
                return (
                  <Link
                    key={item.nameKey}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2 text-base font-medium rounded-md transition-colors",
                      pathname === item.href
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:text-foreground hover:bg-accent",
                    )}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Icon className="h-5 w-5" />
                    {t(item.nameKey)}
                  </Link>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
