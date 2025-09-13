"use client"

import { Navigation } from "@/components/navigation"
import { useLanguage } from "@/lib/language-context"
import { useRoutes } from "@/lib/route-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Route, Clock, MapPin, Users, ArrowRight, RefreshCw, AlertTriangle } from "lucide-react"
import { RealTimeDemo } from "@/components/real-time-demo"

export default function RoutesPage() {
  const { t } = useLanguage()
  const { routes, updates, isLoading, lastUpdated } = useRoutes()

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
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-balance mb-2">
                Bus Routes & Schedules
              </h1>
              <p className="text-muted-foreground text-pretty">
                Explore all available bus routes, schedules, and fare information.
              </p>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <RefreshCw className="h-4 w-4 animate-spin" />
              <span>Live updates</span>
              {lastUpdated && (
                <span>• Last updated: {lastUpdated.toLocaleTimeString()}</span>
              )}
            </div>
          </div>
        </div>

        {/* Real-time Updates */}
        {updates.length > 0 && (
          <Card className="mb-6 border-orange-200 bg-orange-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-orange-800">
                <AlertTriangle className="h-5 w-5" />
                Live Schedule Updates
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
            {routes.map((route) => (
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
                          Route Stops
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
                            <div className="text-sm font-medium">Duration</div>
                            <div className="text-sm text-gray-600">{route.duration}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-gray-500" />
                          <div>
                            <div className="text-sm font-medium">Frequency</div>
                            <div className="text-sm text-gray-600">{route.frequency}</div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <span className="text-sm font-medium">Fare:</span>
                        <span className="text-lg font-bold text-green-600">₹{route.fare}</span>
                      </div>
                      
                      <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                        <span className="text-sm font-medium">Active Buses:</span>
                        <span className="text-lg font-bold text-blue-600">{route.buses}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-4 pt-4 border-t">
                    <Button variant="outline" className="w-full">
                      View Schedule & Book Ticket
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Route Statistics</CardTitle>
                <CardDescription>Overall route information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Total Routes</span>
                  <span className="font-medium">{routes.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Active Routes</span>
                  <Badge variant="outline" className="text-green-600">
                    {routes.filter(r => r.status === 'active').length}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Under Maintenance</span>
                  <Badge variant="outline" className="text-yellow-600">
                    {routes.filter(r => r.status === 'maintenance').length}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Total Buses</span>
                  <span className="font-medium">{routes.reduce((sum, r) => sum + r.buses, 0)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Average Fare</span>
                  <span className="font-medium">
                    ₹{(routes.reduce((sum, r) => sum + r.fare, 0) / routes.length).toFixed(0)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Routes with Delays</span>
                  <Badge variant="outline" className="text-orange-600">
                    {routes.filter(r => r.delays > 0).length}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Popular Routes</CardTitle>
                <CardDescription>Most used routes</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <div className="font-medium">Route 3</div>
                    <div className="text-sm text-gray-600">University - Mall</div>
                  </div>
                  <Badge variant="secondary">High</Badge>
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <div className="font-medium">Route 1</div>
                    <div className="text-sm text-gray-600">Central Market - Tech Park</div>
                  </div>
                  <Badge variant="secondary">Medium</Badge>
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
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
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Common tasks</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  <MapPin className="h-4 w-4 mr-2" />
                  Find Nearest Stop
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Clock className="h-4 w-4 mr-2" />
                  Check Schedule
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Route className="h-4 w-4 mr-2" />
                  Plan Journey
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}