"use client"

import { useState, useEffect } from "react"
import { Navigation } from "@/components/navigation"
import { useLanguage } from "@/lib/language-context"
import { InteractiveMap } from "@/components/interactive-map"
import { RouteFlowchart } from "@/components/route-flowchart"
import { RouteSimulator } from "@/lib/route-simulation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrackingFAB } from "@/components/mobile-fab"
import { LiveTrackingMap } from "@/components/LiveTrackingMap"
import { MapPin, Clock, Users, RefreshCw } from "lucide-react"

export default function TrackingPage() {
  const { t } = useLanguage()
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date())
  const [selectedRouteId, setSelectedRouteId] = useState<string>("")
  const [routeSimulator] = useState(() => new RouteSimulator())
  const [routes, setRoutes] = useState<any[]>([])
  const [busData, setBusData] = useState({
    totalBuses: 9,
    activeRoutes: 3,
    onTime: 6,
    delayed: 2,
    outOfService: 1
  })
  
  // Quick actions state
  const [activeAction, setActiveAction] = useState<string | null>(null)
  const [nearestBusResult, setNearestBusResult] = useState<any>(null)
  const [isSearching, setIsSearching] = useState(false)
  const [reportIssue, setReportIssue] = useState("")
  const [journeyFrom, setJourneyFrom] = useState("")
  const [journeyTo, setJourneyTo] = useState("")

  // Initialize routes and simulate real-time updates
  useEffect(() => {
    const routesData = routeSimulator.getRoutes()
    setRoutes(routesData)
    
    const interval = setInterval(() => {
      setLastUpdated(new Date())
      // Simulate dynamic bus status changes
      setBusData(prev => ({
        ...prev,
        onTime: Math.floor(Math.random() * 3) + 5,
        delayed: Math.floor(Math.random() * 3) + 1,
        outOfService: Math.floor(Math.random() * 2)
      }))
    }, 15000) // Update every 15 seconds

    return () => clearInterval(interval)
  }, [routeSimulator])

  const handleQuickTrack = () => {
    // Find nearest route or show quick tracking options
    if (routes.length > 0) {
      setSelectedRouteId(routes[0].id)
    }
  }

  const handleFindNearestBus = () => {
    setActiveAction('findBus')
    setIsSearching(true)
    setNearestBusResult(null)
    
    // Simulate API call
    setTimeout(() => {
      setIsSearching(false)
      setNearestBusResult({
        busNumber: 'DL-01-B-1001',
        route: 'Route 42A',
        location: 'Connaught Place',
        distance: '0.3 km',
        arrivalTime: '2 minutes',
        status: 'On Time'
      })
    }, 2000)
  }

  const handleCheckSchedule = () => {
    setActiveAction('schedule')
  }

  const handleReportIssue = () => {
    setActiveAction('reportIssue')
    setReportIssue("")
  }

  const handlePlanJourney = () => {
    setActiveAction('planJourney')
    setJourneyFrom("")
    setJourneyTo("")
  }

  const handleSubmitIssue = () => {
    if (reportIssue.trim()) {
      // Simulate API submission
      setTimeout(() => {
        setActiveAction(null)
        setReportIssue("")
      }, 1000)
    }
  }

  const handlePlanJourneySubmit = () => {
    if (journeyFrom.trim() && journeyTo.trim()) {
      // Simulate journey planning
      setTimeout(() => {
        setActiveAction(null)
        setJourneyFrom("")
        setJourneyTo("")
      }, 1000)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <TrackingFAB onQuickTrack={handleQuickTrack} />

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-balance mb-2">
                {t('tracking.title')}
              </h1>
              <p className="text-muted-foreground text-pretty">
                {t('tracking.subtitle')}
              </p>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <RefreshCw className="h-4 w-4 animate-spin" />
              <span className="hidden sm:inline">Live Updates</span>
              <span className="sm:hidden">Live</span>
              <span className="hidden sm:inline">• Last updated: {lastUpdated.toLocaleTimeString()}</span>
              <span className="sm:hidden">• {lastUpdated.toLocaleTimeString()}</span>
            </div>
          </div>
        </div>

        {/* Route-specific content */}
        {selectedRouteId ? (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Active Routes Sidebar */}
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    Active Routes
                  </CardTitle>
                  <CardDescription>
                    Click on any route to view its timeline
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {routes.map((route) => (
                      <div 
                        key={route.id}
                        className={`flex items-center justify-between p-3 border rounded-lg cursor-pointer transition-colors ${
                          selectedRouteId === route.id 
                            ? 'border-blue-500 bg-blue-50' 
                            : 'border-gray-200 hover:bg-gray-50'
                        }`}
                        onClick={() => setSelectedRouteId(route.id)}
                      >
                        <div>
                          <div className="font-medium text-sm">{route.name}</div>
                          <div className="text-xs text-gray-600">{route.description}</div>
                        </div>
                        <Badge variant="secondary" className="text-xs">{route.buses}</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Route Timeline */}
            <div className="lg:col-span-3">
              <RouteFlowchart 
                route={routes.find(r => r.id === selectedRouteId)!}
              />
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Active Routes Sidebar */}
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    Active Routes
                  </CardTitle>
                  <CardDescription>
                    Click on any route to view its timeline
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {routes.map((route) => (
                      <div 
                        key={route.id}
                        className="flex items-center justify-between p-3 border rounded-lg cursor-pointer transition-colors hover:bg-gray-50"
                        onClick={() => setSelectedRouteId(route.id)}
                      >
                        <div>
                          <div className="font-medium text-sm">{route.name}</div>
                          <div className="text-xs text-gray-600">{route.description}</div>
                        </div>
                        <Badge variant="secondary" className="text-xs">{route.buses}</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Placeholder */}
            <div className="lg:col-span-3">
              <div className="text-center py-12 bg-gray-50 rounded-lg">
                <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-800 mb-2">Select a Route</h3>
                <p className="text-gray-600">Click on any route from the Active Routes section to view its timeline and live tracking map.</p>
              </div>
            </div>
          </div>
        )}

        {/* Live Tracking Map Section */}
        <div className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Live Tracking Map
              </CardTitle>
              <CardDescription>
                Real-time bus locations and routes on OpenStreetMap
              </CardDescription>
            </CardHeader>
            <CardContent>
              <LiveTrackingMap 
                height="500px"
                autoFitBounds={true}
                showRoutes={true}
                updateInterval={8000}
                className="border-0"
              />
            </CardContent>
          </Card>
        </div>

        {/* Interactive Map Section */}
        {selectedRouteId && (
          <div className="mt-6">
            <InteractiveMap 
              routes={routes}
              selectedRouteId={selectedRouteId}
              onRouteSelect={setSelectedRouteId}
            />
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Recent Updates
              </CardTitle>
              <CardDescription>
                Latest bus location updates
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 border rounded-lg">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <div className="flex-1">
                    <div className="font-medium">DL-01-B-1001</div>
                    <div className="text-sm text-gray-600">Connaught Place • 2 min ago</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 border rounded-lg">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <div className="flex-1">
                    <div className="font-medium">DL-01-B-1002</div>
                    <div className="text-sm text-gray-600">Cyber City Gurugram • 5 min ago</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 border rounded-lg">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <div className="flex-1">
                    <div className="font-medium">DL-01-B-1003</div>
                    <div className="text-sm text-gray-600">Rajiv Chowk Metro • 8 min ago</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Bus Status
              </CardTitle>
              <CardDescription>
                Current operational status
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Total Buses</span>
                  <span className="font-medium">{busData.totalBuses}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Active Routes</span>
                  <span className="font-medium">{busData.activeRoutes}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">On Time</span>
                  <Badge variant="outline" className="text-green-600">{busData.onTime}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Delayed</span>
                  <Badge variant="outline" className="text-red-600">{busData.delayed}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Out of Service</span>
                  <Badge variant="outline" className="text-gray-600">{busData.outOfService}</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Quick Actions
            </CardTitle>
            <CardDescription>
              Common tracking tasks
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div 
                className={`p-4 border rounded-lg text-center cursor-pointer transition-all duration-200 active:scale-95 ${
                  activeAction === 'findBus' 
                    ? 'bg-blue-100 border-blue-400' 
                    : 'hover:bg-blue-50 hover:border-blue-300'
                }`}
                onClick={handleFindNearestBus}
              >
                <MapPin className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                <div className="font-medium">Find Nearest Bus</div>
                <div className="text-sm text-gray-600">Locate buses near you</div>
              </div>
              <div 
                className={`p-4 border rounded-lg text-center cursor-pointer transition-all duration-200 active:scale-95 ${
                  activeAction === 'schedule' 
                    ? 'bg-green-100 border-green-400' 
                    : 'hover:bg-green-50 hover:border-green-300'
                }`}
                onClick={handleCheckSchedule}
              >
                <Clock className="h-8 w-8 mx-auto mb-2 text-green-600" />
                <div className="font-medium">Check Schedule</div>
                <div className="text-sm text-gray-600">View bus timings</div>
              </div>
              <div 
                className={`p-4 border rounded-lg text-center cursor-pointer transition-all duration-200 active:scale-95 ${
                  activeAction === 'reportIssue' 
                    ? 'bg-purple-100 border-purple-400' 
                    : 'hover:bg-purple-50 hover:border-purple-300'
                }`}
                onClick={handleReportIssue}
              >
                <Users className="h-8 w-8 mx-auto mb-2 text-purple-600" />
                <div className="font-medium">Report Issue</div>
                <div className="text-sm text-gray-600">Report bus problems</div>
              </div>
              <div 
                className={`p-4 border rounded-lg text-center cursor-pointer transition-all duration-200 active:scale-95 ${
                  activeAction === 'planJourney' 
                    ? 'bg-orange-100 border-orange-400' 
                    : 'hover:bg-orange-50 hover:border-orange-300'
                }`}
                onClick={handlePlanJourney}
              >
                <MapPin className="h-8 w-8 mx-auto mb-2 text-orange-600" />
                <div className="font-medium">Plan Journey</div>
                <div className="text-sm text-gray-600">Get route suggestions</div>
              </div>
            </div>

            {/* Interactive Content Areas */}
            {activeAction && (
              <div className="mt-6 p-4 border rounded-lg bg-gray-50">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-medium text-lg">
                    {activeAction === 'findBus' && '🚌 Find Nearest Bus'}
                    {activeAction === 'schedule' && '📅 Bus Schedule'}
                    {activeAction === 'reportIssue' && '🚨 Report Issue'}
                    {activeAction === 'planJourney' && '🗺️ Plan Journey'}
                  </h3>
                  <button 
                    onClick={() => setActiveAction(null)}
                    className="text-gray-500 hover:text-gray-700 text-xl"
                  >
                    ×
                  </button>
                </div>

                {/* Find Nearest Bus Content */}
                {activeAction === 'findBus' && (
                  <div>
                    {isSearching ? (
                      <div className="text-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
                        <p className="text-gray-600">Searching for nearest buses...</p>
                      </div>
                    ) : nearestBusResult ? (
                      <div className="bg-white rounded-lg p-4 border">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                            <span className="font-medium">{nearestBusResult.busNumber}</span>
                            <Badge variant="secondary">{nearestBusResult.route}</Badge>
                          </div>
                          <span className="text-sm text-green-600 font-medium">{nearestBusResult.status}</span>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-gray-600">Location:</span>
                            <div className="font-medium">{nearestBusResult.location}</div>
                          </div>
                          <div>
                            <span className="text-gray-600">Distance:</span>
                            <div className="font-medium">{nearestBusResult.distance}</div>
                          </div>
                          <div>
                            <span className="text-gray-600">Arrival:</span>
                            <div className="font-medium text-blue-600">{nearestBusResult.arrivalTime}</div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-600">Click "Find Nearest Bus" to search for buses near your location</p>
                      </div>
                    )}
                  </div>
                )}

                {/* Schedule Content */}
                {activeAction === 'schedule' && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {routes.slice(0, 3).map((route) => (
                        <div key={route.id} className="bg-white rounded-lg p-4 border">
                          <div className="font-medium mb-2">{route.name}</div>
                          <div className="text-sm text-gray-600 mb-3">{route.description}</div>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span>First Bus:</span>
                              <span className="font-medium">5:30 AM</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Last Bus:</span>
                              <span className="font-medium">11:30 PM</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Frequency:</span>
                              <span className="font-medium">Every 15 min</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Report Issue Content */}
                {activeAction === 'reportIssue' && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Describe the issue:</label>
                      <textarea
                        value={reportIssue}
                        onChange={(e) => setReportIssue(e.target.value)}
                        className="w-full p-3 border rounded-lg resize-none h-24"
                        placeholder="Please describe the issue you encountered..."
                      />
                    </div>
                    <div className="flex gap-3">
                      <button
                        onClick={handleSubmitIssue}
                        disabled={!reportIssue.trim()}
                        className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Submit Report
                      </button>
                      <button
                        onClick={() => setActiveAction(null)}
                        className="px-4 py-2 border rounded-lg hover:bg-gray-50"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}

                {/* Plan Journey Content */}
                {activeAction === 'planJourney' && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">From:</label>
                        <input
                          type="text"
                          value={journeyFrom}
                          onChange={(e) => setJourneyFrom(e.target.value)}
                          className="w-full p-3 border rounded-lg"
                          placeholder="Enter starting location"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">To:</label>
                        <input
                          type="text"
                          value={journeyTo}
                          onChange={(e) => setJourneyTo(e.target.value)}
                          className="w-full p-3 border rounded-lg"
                          placeholder="Enter destination"
                        />
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <button
                        onClick={handlePlanJourneySubmit}
                        disabled={!journeyFrom.trim() || !journeyTo.trim()}
                        className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Plan Journey
                      </button>
                      <button
                        onClick={() => setActiveAction(null)}
                        className="px-4 py-2 border rounded-lg hover:bg-gray-50"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}