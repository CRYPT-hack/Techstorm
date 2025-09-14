"use client"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useIsMobile } from "@/hooks/use-mobile"
import { MapPin, Plus } from "lucide-react"

interface MobileFABProps {
  onClick: () => void
  icon?: React.ReactNode
  className?: string
}

export function MobileFAB({ onClick, icon = <Plus className="h-6 w-6" />, className }: MobileFABProps) {
  const isMobile = useIsMobile()

  if (!isMobile) return null

  return (
    <Button
      onClick={onClick}
      size="lg"
      className={cn(
        "fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full shadow-lg",
        "bg-primary hover:bg-primary/90 text-primary-foreground",
        "transition-all duration-200 hover:scale-110",
        className
      )}
    >
      {icon}
    </Button>
  )
}

// Quick action FAB for tracking page
export function TrackingFAB({ onQuickTrack }: { onQuickTrack: () => void }) {
  return (
    <MobileFAB
      onClick={onQuickTrack}
      icon={<MapPin className="h-6 w-6" />}
      className="bg-blue-600 hover:bg-blue-700"
    />
  )
}
