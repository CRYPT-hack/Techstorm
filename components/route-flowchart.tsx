"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Clock, Bus, ArrowDown, Navigation } from "lucide-react"

interface Stop {
  id: string
  name: string
  lat: number
  lng: number
  estimatedArrival: string
  status: 'on-time' | 'delayed' | 'early'
}

interface Route {
  id: string
  name: string
  description: string
  stops: Stop[]
  currentBusPosition?: {
    lat: number
    lng: number
    nextStopId: string
    estimatedArrival: string
  }
}

interface RouteFlowchartProps {
  route: Route
}

export function RouteFlowchart({ route }: RouteFlowchartProps) {
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const getCurrentBusStop = () => {
    if (!route.currentBusPosition) return null
    return route.stops.find(stop => stop.id === route.currentBusPosition?.nextStopId)
  }

  const currentBusStop = getCurrentBusStop()

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Navigation className="h-5 w-5" />
          {route.name} - Route Timeline
        </CardTitle>
        <CardDescription>
          {route.description} • Live tracking with arrival times
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="relative">
          {/* Current Time Display */}
          <div className="mb-6 p-3 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-blue-600" />
                <span className="font-medium text-blue-800">Current Time</span>
              </div>
              <span className="text-lg font-bold text-blue-800">
                {currentTime.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}
              </span>
            </div>
          </div>

          {/* Route Flowchart */}
          <div className="space-y-4">
            {route.stops.map((stop, index) => {
              const isCurrentBusStop = currentBusStop?.id === stop.id
              const isStartStop = index === 0
              const isEndStop = index === route.stops.length - 1
              
              return (
                <div key={stop.id} className="relative">
                  {/* Stop Card */}
                  <div className={`relative p-4 rounded-lg border-2 transition-all ${
                    isCurrentBusStop 
                      ? 'border-blue-500 bg-blue-50 shadow-lg' 
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        {/* Stop Number/Icon */}
                        <div className={`w-10 h-10 rounded-full border-2 border-white shadow-lg flex items-center justify-center font-bold text-white ${
                          isStartStop ? 'bg-green-500' :
                          isEndStop ? 'bg-red-500' :
                          isCurrentBusStop ? 'bg-blue-500' :
                          'bg-gray-400'
                        }`}>
                          {isCurrentBusStop ? (
                            <Bus className="h-5 w-5" />
                          ) : (
                            <span>{index + 1}</span>
                          )}
                        </div>

                        {/* Stop Details */}
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-800">{stop.name}</h3>
                          <div className="flex items-center gap-4 mt-1">
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3 text-gray-500" />
                              <span className="text-sm text-gray-600">
                                Arrives: <span className="font-medium">{stop.estimatedArrival}</span>
                              </span>
                            </div>
                            <Badge variant={
                              stop.status === 'on-time' ? 'default' :
                              stop.status === 'delayed' ? 'destructive' : 'secondary'
                            } className="text-xs">
                              {stop.status.replace('-', ' ').toUpperCase()}
                            </Badge>
                          </div>
                        </div>
                      </div>

                      {/* Stop Type Badge */}
                      <div className="text-right">
                        {isStartStop && (
                          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                            START
                          </Badge>
                        )}
                        {isEndStop && (
                          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                            END
                          </Badge>
                        )}
                        {isCurrentBusStop && (
                          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 animate-pulse">
                            BUS HERE
                          </Badge>
                        )}
                      </div>
                    </div>

                    {/* Current Bus Info */}
                    {isCurrentBusStop && route.currentBusPosition && (
                      <div className="mt-3 pt-3 border-t border-blue-200">
                        <div className="flex items-center gap-2 text-blue-700">
                          <Bus className="h-4 w-4" />
                          <span className="text-sm font-medium">
                            Bus is approaching this stop
                          </span>
                        </div>
                        <p className="text-sm text-blue-600 mt-1">
                          Expected arrival: {route.currentBusPosition.estimatedArrival}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Arrow Connector */}
                  {!isEndStop && (
                    <div className="flex justify-center py-2">
                      <div className="flex flex-col items-center">
                        <ArrowDown className={`h-6 w-6 ${
                          isCurrentBusStop ? 'text-blue-500 animate-bounce' : 'text-gray-400'
                        }`} />
                        <div className="text-xs text-gray-500 mt-1">
                          {Math.floor(Math.random() * 5) + 3} min
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          {/* Route Summary */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h4 className="font-medium text-gray-800 mb-3">Route Summary</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div className="text-center">
                <div className="font-bold text-lg text-blue-600">{route.stops.length}</div>
                <div className="text-gray-600">Total Stops</div>
              </div>
              <div className="text-center">
                <div className="font-bold text-lg text-green-600">
                  {route.stops[0]?.estimatedArrival}
                </div>
                <div className="text-gray-600">First Stop</div>
              </div>
              <div className="text-center">
                <div className="font-bold text-lg text-red-600">
                  {route.stops[route.stops.length - 1]?.estimatedArrival}
                </div>
                <div className="text-gray-600">Last Stop</div>
              </div>
              <div className="text-center">
                <div className="font-bold text-lg text-purple-600">
                  {currentBusStop ? currentBusStop.name.split(' ')[0] : 'N/A'}
                </div>
                <div className="text-gray-600">Next Stop</div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
