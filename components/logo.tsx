import { Bus } from "lucide-react"

interface LogoProps {
  className?: string
  showText?: boolean
}

export function Logo({ className = "", showText = true }: LogoProps) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="relative">
        <Bus className="h-8 w-8 text-primary" />
      </div>
      {showText && <span className="text-xl font-bold text-primary">SmartTransit</span>}
    </div>
  )
}
