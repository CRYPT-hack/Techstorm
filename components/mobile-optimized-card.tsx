"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { useIsMobile } from "@/hooks/use-mobile"

interface MobileOptimizedCardProps {
  title: string
  description?: string
  children: React.ReactNode
  className?: string
  icon?: React.ReactNode
}

export function MobileOptimizedCard({ 
  title, 
  description, 
  children, 
  className,
  icon 
}: MobileOptimizedCardProps) {
  const isMobile = useIsMobile()

  return (
    <Card className={cn(
      "border-0 shadow-lg",
      isMobile && "mx-2 rounded-xl",
      className
    )}>
      <CardHeader className={cn(
        isMobile && "pb-3"
      )}>
        <CardTitle className={cn(
          "flex items-center gap-2",
          isMobile ? "text-lg" : "text-xl"
        )}>
          {icon}
          {title}
        </CardTitle>
        {description && (
          <CardDescription className={cn(
            isMobile && "text-sm"
          )}>
            {description}
          </CardDescription>
        )}
      </CardHeader>
      <CardContent className={cn(
        isMobile && "pt-0"
      )}>
        {children}
      </CardContent>
    </Card>
  )
}
