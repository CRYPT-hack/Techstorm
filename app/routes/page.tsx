"use client"

import { useState, useMemo } from "react"
import { Navigation } from "@/components/navigation"
import { useLanguage } from "@/lib/language-context"
import { useRoutes } from "@/lib/route-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Route, Clock, MapPin, Users, ArrowRight, RefreshCw, AlertTriangle } from "lucide-react"
import { RealTimeDemo } from "@/components/real-time-demo"
import { RouteSearchBar } from "@/components/route-search-bar"

export default function RoutesPage() {
  const { t } = useLanguage()
  const { routes, updates, isLoading, lastUpdated } = useRoutes()
  const [searchFrom, setSearchFrom] = useState("")
  const [searchTo, setSearchTo] = useState("")

  // Filter routes based on search criteria
  const filteredRoutes = useMemo(() => {
    if (!searchFrom && !searchTo) {
      return routes
    }

    return routes.filter(route => {
      const fromMatch = !searchFrom || 
        route.stops.some(stop => 
          stop.name.toLowerCase().includes(searchFrom.toLowerCase())
        ) ||
        route.description.toLowerCase().includes(searchFrom.toLowerCase())

      const toMatch = !searchTo || 
        route.stops.some(stop => 
          stop.name.toLowerCase().includes(searchTo.toLowerCase())
        ) ||
        route.description.toLowerCase().includes(searchTo.toLowerCase())

      return fromMatch && toMatch
    })
  }, [routes, searchFrom, searchTo])

  const handleSearch = (from: string, to: string) => {
    setSearchFrom(from)
    setSearchTo(to)
  }

  const handleClearSearch = () => {
    setSearchFrom("")
    setSearchTo("")
  }

  const popularRoutes = [
    { from: "Connaught Place", to: "Cyber City", passengers: 245 },
    { from: "Rajiv Chowk Metro", to: "IGI Airport", passengers: 189 },
    { from: "Delhi University", to: "DLF Mall", passengers: 156 }
  ]

  const handlePopularRouteClick = (routeName: string, routeDescription: string) => {
    // Extract locations from route description (e.g., "University - Mall" -> "University", "Mall")
    const locations = routeDescription.split(' - ')
    if (locations.length >= 2) {
      setSearchFrom(locations[0].trim())
      setSearchTo(locations[1].trim())
    } else {
      // If description doesn't follow expected format, search by route name
      setSearchFrom(routeName)
      setSearchTo("")
    }
  }

  const handleFindNearestStop = () => {
    // Clear search and show all routes to help find nearest stops
    handleClearSearch()
    // Scroll to routes section
    document.querySelector('.lg\\:col-span-2')?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleCheckSchedule = () => {
    // Show all active routes for schedule checking
    handleClearSearch()
    // Focus on active routes
    const activeRoutes = routes.filter(route => route.status === 'active')
    if (activeRoutes.length > 0) {
      // Scroll to routes section
      document.querySelector('.lg\\:col-span-2')?.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const handlePlanJourney = () => {
    // Clear search and focus on search bar for journey planning
    handleClearSearch()
    // Scroll to search bar
    document.querySelector('.mb-6')?.scrollIntoView({ behavior: 'smooth' })
    // Focus on the first input field after a short delay
    setTimeout(() => {
      const firstInput = document.querySelector('input[placeholder*="From"]') as HTMLInputElement
      if (firstInput) {
        firstInput.focus()
      }
    }, 300)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800'
      case 'maintenance':
        return 'bg-yellow-100 text-yellow-800'
      case 'inactive':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-balance mb-2">
                {t('routes.title')}
              </h1>
              <p className="text-muted-foreground text-pretty">
                {t('routes.subtitle')}
              </p>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <RefreshCw className="h-4 w-4 animate-spin" />
              <span className="hidden sm:inline">{t('common.loading')}</span>
              <span className="sm:hidden">Loading</span>
              {lastUpdated && (
                <>
                  <span className="hidden sm:inline">• Last updated: {lastUpdated.toLocaleTimeString()}</span>
                  <span className="sm:hidden">• {lastUpdated.toLocaleTimeString()}</span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Route Search Bar */}
        <RouteSearchBar onSearch={handleSearch} onClear={handleClearSearch} />

        {/* Search Results Info */}
        {(searchFrom || searchTo) && (
          <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="text-sm text-blue-800">
                <span className="font-medium">Search Results:</span> 
                {searchFrom && <span> From "{searchFrom}"</span>}
                {searchFrom && searchTo && <span> →</span>}
                {searchTo && <span> To "{searchTo}"</span>}
                <span className="ml-2">({filteredRoutes.length} route{filteredRoutes.length !== 1 ? 's' : ''} found)</span>
              </div>
              <Button variant="ghost" size="sm" onClick={handleClearSearch}>
                Clear Search
              </Button>
            </div>
          </div>
        )}

        {/* Real-time Updates */}
        {updates.length > 0 && (
          <Card className="mb-6 border-orange-200 bg-orange-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-orange-800">
                <AlertTriangle className="h-5 w-5" />
                {t('routes.liveUpdates')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {updates.slice(0, 3).map((update, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 bg-white rounded-lg border">
                    <div className={`w-2 h-2 rounded-full mt-2 ${
                      update.severity === 'high' ? 'bg-red-500' :
                      update.severity === 'medium' ? 'bg-yellow-500' :
                      'bg-green-500'
                    }`} />
                    <div className="flex-1">
                      <div className="font-medium text-sm">{update.message}</div>
                      <div className="text-xs text-gray-500 mt-1">
                        {update.timestamp.toLocaleTimeString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {filteredRoutes.length === 0 && (searchFrom || searchTo) ? (
              <Card className="p-8 text-center">
                <div className="text-muted-foreground">
                  <MapPin className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <h3 className="text-lg font-medium mb-2">No routes found</h3>
                  <p className="text-sm">
                    No bus routes match your search criteria. Try different locations or clear the search to see all routes.
                  </p>
                  <Button variant="outline" className="mt-4" onClick={handleClearSearch}>
                    Show All Routes
                  </Button>
                </div>
              </Card>
            ) : (
              filteredRoutes.map((route) => (
              <Card key={route.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <Route className="h-5 w-5" />
                        {route.name}
                        {route.delays > 0 && (
                          <Badge variant="outline" className="text-orange-600 border-orange-200">
                            <AlertTriangle className="h-3 w-3 mr-1" />
                            {route.delays}min delay
                          </Badge>
                        )}
                      </CardTitle>
                      <CardDescription>{route.description}</CardDescription>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <Badge className={getStatusColor(route.status)}>
                        {route.status}
                      </Badge>
                      <Badge variant="outline" className={`text-xs ${
                        route.passengerLoad === 'high' ? 'text-red-600' :
                        route.passengerLoad === 'medium' ? 'text-yellow-600' :
                        'text-green-600'
                      }`}>
                        {route.passengerLoad} load
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-semibold mb-2 flex items-center gap-2">
                          <MapPin className="h-4 w-4" />
                          {t('routes.routeStops')}
                        </h4>
                        <div className="space-y-1">
                          {route.stops.map((stop, index) => (
                            <div key={stop.id} className="flex items-center gap-2 text-sm">
                              <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-medium">
                                {index + 1}
                              </div>
                              <span className="flex-1">{stop.name}</span>
                              <div className="flex items-center gap-1">
                                <span className={`text-xs font-medium ${
                                  stop.status === 'delayed' ? 'text-red-600' :
                                  stop.status === 'early' ? 'text-green-600' :
                                  'text-gray-600'
                                }`}>
                                  {stop.estimatedArrival}min
                                </span>
                                {stop.status === 'delayed' && (
                                  <AlertTriangle className="h-3 w-3 text-red-500" />
                                )}
                                {stop.status === 'early' && (
                                  <span className="text-green-500 text-xs">✓</span>
                                )}
                              </div>
                              {index < route.stops.length - 1 && (
                                <ArrowRight className="h-3 w-3 text-gray-400 ml-2" />
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-gray-500" />
                          <div>
                            <div className="text-sm font-medium">{t('routes.duration')}</div>
                            <div className="text-sm text-gray-600">{route.duration}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-gray-500" />
                          <div>
                            <div className="text-sm font-medium">{t('routes.frequency')}</div>
                            <div className="text-sm text-gray-600">{route.frequency}</div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <span className="text-sm font-medium">{t('routes.fare')}:</span>
                        <span className="text-lg font-bold text-green-600">₹{route.fare}</span>
                      </div>
                      
                      <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                        <span className="text-sm font-medium">{t('routes.activeBuses')}:</span>
                        <span className="text-lg font-bold text-blue-600">{route.buses}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-4 pt-4 border-t">
                    <Button variant="outline" className="w-full">
                      {t('routes.viewSchedule')}
                    </Button>
                  </div>
                </CardContent>
              </Card>
              ))
            )}
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>{t('routes.statistics')}</CardTitle>
                <CardDescription>{t('routes.statisticsDesc')}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">{t('routes.totalRoutes')}</span>
                  <span className="font-medium">{routes.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">{t('routes.activeRoutes')}</span>
                  <Badge variant="outline" className="text-green-600">
                    {routes.filter(r => r.status === 'active').length}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">{t('routes.maintenance')}</span>
                  <Badge variant="outline" className="text-yellow-600">
                    {routes.filter(r => r.status === 'maintenance').length}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">{t('routes.totalBuses')}</span>
                  <span className="font-medium">{routes.reduce((sum, r) => sum + r.buses, 0)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">{t('routes.averageFare')}</span>
                  <span className="font-medium">
                    ₹{(routes.reduce((sum, r) => sum + r.fare, 0) / routes.length).toFixed(0)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">{t('routes.delayedRoutes')}</span>
                  <Badge variant="outline" className="text-orange-600">
                    {routes.filter(r => r.delays > 0).length}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>{t('routes.popularRoutes')}</CardTitle>
                <CardDescription>{t('routes.popularRoutesDesc')}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div 
                  className="flex items-center justify-between p-3 border rounded-lg cursor-pointer hover:bg-gray-50 hover:border-blue-300 transition-colors"
                  onClick={() => handlePopularRouteClick("Route 3", "University - Mall")}
                >
                  <div>
                    <div className="font-medium">Route 3</div>
                    <div className="text-sm text-gray-600">University - Mall</div>
                  </div>
                  <Badge variant="secondary">High</Badge>
                </div>
                <div 
                  className="flex items-center justify-between p-3 border rounded-lg cursor-pointer hover:bg-gray-50 hover:border-blue-300 transition-colors"
                  onClick={() => handlePopularRouteClick("Route 1", "Central Market - Tech Park")}
                >
                  <div>
                    <div className="font-medium">Route 1</div>
                    <div className="text-sm text-gray-600">Central Market - Tech Park</div>
                  </div>
                  <Badge variant="secondary">Medium</Badge>
                </div>
                <div 
                  className="flex items-center justify-between p-3 border rounded-lg cursor-pointer hover:bg-gray-50 hover:border-blue-300 transition-colors"
                  onClick={() => handlePopularRouteClick("Route 2", "Metro Station - Airport")}
                >
                  <div>
                    <div className="font-medium">Route 2</div>
                    <div className="text-sm text-gray-600">Metro Station - Airport</div>
                  </div>
                  <Badge variant="secondary">Medium</Badge>
                </div>
              </CardContent>
            </Card>

            <RealTimeDemo />

            <Card>
              <CardHeader>
                <CardTitle>{t('routes.quickActions')}</CardTitle>
                <CardDescription>{t('routes.quickActionsDesc')}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  variant="outline" 
                  className="w-full justify-start hover:bg-blue-50 hover:border-blue-300 transition-colors"
                  onClick={handleFindNearestStop}
                >
                  <MapPin className="h-4 w-4 mr-2" />
                  {t('routes.findNearestStop')}
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start hover:bg-green-50 hover:border-green-300 transition-colors"
                  onClick={handleCheckSchedule}
                >
                  <Clock className="h-4 w-4 mr-2" />
                  {t('routes.checkSchedule')}
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start hover:bg-purple-50 hover:border-purple-300 transition-colors"
                  onClick={handlePlanJourney}
                >
                  <Route className="h-4 w-4 mr-2" />
                  {t('routes.planJourney')}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}