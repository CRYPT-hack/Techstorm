"use client"

import { useState } from "react"
import { Search, MapPin, ArrowRight } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useLanguage } from "@/lib/language-context"

interface RouteSearchBarProps {
  onSearch: (from: string, to: string) => void
  onClear: () => void
}

export function RouteSearchBar({ onSearch, onClear }: RouteSearchBarProps) {
  const { t } = useLanguage()
  const [fromLocation, setFromLocation] = useState("")
  const [toLocation, setToLocation] = useState("")

  const handleSearch = () => {
    if (fromLocation.trim() || toLocation.trim()) {
      onSearch(fromLocation.trim(), toLocation.trim())
    }
  }

  const handleClear = () => {
    setFromLocation("")
    setToLocation("")
    onClear()
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  return (
    <Card className="mb-6">
      <CardContent className="p-6">
        <div className="space-y-4">
          <div className="text-center">
            <h2 className="text-xl font-semibold mb-2 flex items-center justify-center gap-2">
              <Search className="h-5 w-5" />
              {t('routes.searchRoutes')}
            </h2>
            <p className="text-sm text-muted-foreground">
              Search for bus routes between specific locations
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <div className="flex-1 w-full">
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder={t('routes.from')}
                  value={fromLocation}
                  onChange={(e) => setFromLocation(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="hidden sm:block">
              <ArrowRight className="h-4 w-4 text-muted-foreground" />
            </div>
            
            <div className="flex-1 w-full">
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder={t('routes.to')}
                  value={toLocation}
                  onChange={(e) => setToLocation(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="flex gap-2 w-full sm:w-auto">
              <Button 
                onClick={handleSearch}
                className="flex-1 sm:flex-none"
                disabled={!fromLocation.trim() && !toLocation.trim()}
              >
                <Search className="h-4 w-4 mr-2" />
                {t('common.search')}
              </Button>
              
              {(fromLocation || toLocation) && (
                <Button 
                  variant="outline" 
                  onClick={handleClear}
                  className="flex-1 sm:flex-none"
                >
                  Clear
                </Button>
              )}
            </div>
          </div>
          
          <div className="text-xs text-muted-foreground text-center">
            Enter origin and/or destination to find matching routes. Leave fields empty to show all routes.
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
