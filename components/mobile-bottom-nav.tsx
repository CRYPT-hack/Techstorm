"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { useLanguage } from "@/lib/language-context"
import { useIsMobile } from "@/hooks/use-mobile"
import { Home, MapPin, Search, Bell, BarChart3 } from "lucide-react"

const bottomNavItems = [
  { nameKey: "navigation.home", href: "/", icon: Home },
  { nameKey: "navigation.liveTracking", href: "/tracking", icon: MapPin },
  { nameKey: "navigation.routeSearch", href: "/routes", icon: Search },
  { nameKey: "navigation.nextBusAlert", href: "/alerts", icon: Bell },
  { nameKey: "navigation.adminDashboard", href: "/admin", icon: BarChart3 },
]

export function MobileBottomNav() {
  const pathname = usePathname()
  const { t } = useLanguage()
  const isMobile = useIsMobile()

  if (!isMobile) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 border-t">
      <div className="flex items-center justify-around px-2 py-2">
        {bottomNavItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href
          
          return (
            <Link
              key={item.nameKey}
              href={item.href}
              className={cn(
                "flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-colors min-w-0 flex-1",
                isActive
                  ? "text-primary bg-primary/10"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Icon className="h-5 w-5 flex-shrink-0" />
              <span className="text-xs font-medium truncate w-full text-center">
                {t(item.nameKey).split(' ')[0]} {/* Show first word only */}
              </span>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
