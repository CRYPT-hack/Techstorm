"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MapPin, Clock, IndianRupee, Navigation, Bus } from "lucide-react"
import { LeafletMap } from "./leaflet-map"
import { GoogleMapsStyle } from "./google-maps-style"

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
  duration: number
  frequency: number
  fare: number
  buses: number
  status: string
  currentBusPosition?: {
    lat: number
    lng: number
    nextStopId: string
    estimatedArrival: string
  }
}

interface InteractiveMapProps {
  routes: Route[]
  selectedRouteId?: string
  onRouteSelect: (routeId: string) => void
}

export function InteractiveMap({ routes, selectedRouteId, onRouteSelect }: InteractiveMapProps) {
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [selectedFromStop, setSelectedFromStop] = useState<string>("")
  const [selectedToStop, setSelectedToStop] = useState<string>("")
  const [fareInfo, setFareInfo] = useState<{ amount: number; distance: number } | null>(null)

  const selectedRoute = routes.find(route => route.id === selectedRouteId)

  // Simulate getting user location
  useEffect(() => {
    // Simulate user location near Connaught Place
    setUserLocation({ lat: 28.6315, lng: 77.2167 })
  }, [])

  // Calculate fare based on stops
  const calculateFare = (fromStopId: string, toStopId: string, route: Route) => {
    if (!fromStopId || !toStopId || !route) return null

    const fromIndex = route.stops.findIndex(stop => stop.id === fromStopId)
    const toIndex = route.stops.findIndex(stop => stop.id === toStopId)
    
    if (fromIndex === -1 || toIndex === -1) return null

    const distance = Math.abs(toIndex - fromIndex)
    const baseFare = 10 // Base fare in rupees
    const perStopFare = 5 // Additional fare per stop
    const totalFare = baseFare + (distance * perStopFare)

    return { amount: totalFare, distance }
  }

  useEffect(() => {
    if (selectedFromStop && selectedToStop && selectedRoute) {
      const fare = calculateFare(selectedFromStop, selectedToStop, selectedRoute)
      setFareInfo(fare)
    } else {
      setFareInfo(null)
    }
  }, [selectedFromStop, selectedToStop, selectedRoute])

  // Find nearest stop to user location
  const findNearestStop = () => {
    if (!userLocation || !selectedRoute) return null

    let nearestStop = selectedRoute.stops[0]
    let minDistance = Infinity

    selectedRoute.stops.forEach(stop => {
      const distance = Math.sqrt(
        Math.pow(stop.lat - userLocation.lat, 2) + 
        Math.pow(stop.lng - userLocation.lng, 2)
      )
      if (distance < minDistance) {
        minDistance = distance
        nearestStop = stop
      }
    })

    return nearestStop
  }

  const nearestStop = findNearestStop()

  return (
    <div className="space-y-6">
      {/* Route Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bus className="h-5 w-5" />
            Select Route
          </CardTitle>
          <CardDescription>Choose a route to view on the map</CardDescription>
        </CardHeader>
        <CardContent>
          <Select value={selectedRouteId} onValueChange={onRouteSelect}>
            <SelectTrigger>
              <SelectValue placeholder="Select a route" />
            </SelectTrigger>
            <SelectContent>
              {routes.map(route => (
                <SelectItem key={route.id} value={route.id}>
                  {route.name} - {route.description}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {selectedRoute && (
        <>
          {/* Map Visualization */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Route Map - {selectedRoute.name}
              </CardTitle>
              <CardDescription>{selectedRoute.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <GoogleMapsStyle 
                selectedRoute={selectedRoute}
                userLocation={userLocation || undefined}
              />
            </CardContent>
          </Card>

          {/* Fare Calculator */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <IndianRupee className="h-5 w-5" />
                Fare Calculator
              </CardTitle>
              <CardDescription>Calculate fare based on your journey</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">From Stop</label>
                  <Select value={selectedFromStop} onValueChange={setSelectedFromStop}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select boarding stop" />
                    </SelectTrigger>
                    <SelectContent>
                      {selectedRoute.stops.map(stop => (
                        <SelectItem key={stop.id} value={stop.id}>
                          {stop.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">To Stop</label>
                  <Select value={selectedToStop} onValueChange={setSelectedToStop}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select destination stop" />
                    </SelectTrigger>
                    <SelectContent>
                      {selectedRoute.stops.map(stop => (
                        <SelectItem key={stop.id} value={stop.id}>
                          {stop.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {fareInfo && (
                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-green-800">Journey Fare</h4>
                      <p className="text-sm text-gray-600">
                        ETA: {selectedRoute.stops.find(stop => stop.id === selectedToStop)?.estimatedArrival}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-green-800">
                        ₹{fareInfo.amount}
                      </div>
                      <p className="text-sm text-gray-600">Total fare</p>
                      <p className="text-sm text-green-600">Total fare</p>
                    </div>
                  </div>
                </div>
              )}

              {nearestStop && (
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-center gap-2 text-blue-800 mb-2">
                    <Navigation className="h-4 w-4" />
                    <span className="font-medium">Nearest Stop</span>
                  </div>
                  <p className="text-blue-600">{nearestStop.name}</p>
                  <p className="text-sm text-blue-600">
                    Next bus arrives at {nearestStop.estimatedArrival}
                  </p>
                  <Button 
                    size="sm" 
                    className="mt-2"
                    onClick={() => setSelectedFromStop(nearestStop.id)}
                  >
                    Set as boarding stop
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Route Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Route Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">{selectedRoute.duration}</div>
                  <div className="text-sm text-gray-600">Total Duration (min)</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">{selectedRoute.frequency}</div>
                  <div className="text-sm text-gray-600">Frequency (min)</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">{selectedRoute.buses}</div>
                  <div className="text-sm text-gray-600">Active Buses</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">₹{selectedRoute.fare}</div>
                  <div className="text-sm text-gray-600">Max Fare</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}
