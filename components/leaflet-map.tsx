"use client"

import { useEffect, useState } from "react"
import { MapPin } from "lucide-react"

interface Stop {
  id: string
  name: string
  lat: number
  lng: number
  estimatedArrival: number
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
    estimatedArrival: number
  }
}

interface LeafletMapProps {
  selectedRoute: Route | null
  userLocation?: { lat: number; lng: number }
}

export function LeafletMap({ selectedRoute, userLocation }: LeafletMapProps) {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) {
    return (
      <div className="bg-gray-100 rounded-lg p-6 min-h-[400px] flex items-center justify-center">
        <div className="text-center text-gray-500">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
          Loading Map...
        </div>
      </div>
    )
  }

  // For now, show a visual representation until Leaflet is properly installed
  return (
    <div className="h-[400px] w-full rounded-lg overflow-hidden border bg-gradient-to-br from-blue-50 to-green-50 relative">
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <MapPin className="h-12 w-12 text-blue-600 mb-4" />
        <h3 className="text-xl font-semibold text-gray-800 mb-2">Interactive Map</h3>
        <p className="text-gray-600 text-center max-w-md">
          {selectedRoute ? (
            <>Showing route: <strong>{selectedRoute.name}</strong> - {selectedRoute.description}</>
          ) : (
            "Select a route to view on the map"
          )}
        </p>
        
        {selectedRoute && (
          <div className="mt-6 bg-white rounded-lg p-4 shadow-lg max-w-sm w-full">
            <h4 className="font-medium mb-3">Route Stops:</h4>
            <div className="space-y-2">
              {selectedRoute.stops.map((stop, index) => (
                <div key={stop.id} className="flex items-center gap-3 text-sm">
                  <div className={`w-3 h-3 rounded-full ${
                    index === 0 ? 'bg-green-500' : 
                    index === selectedRoute.stops.length - 1 ? 'bg-red-500' : 
                    'bg-blue-500'
                  }`}></div>
                  <span className="flex-1">{stop.name}</span>
                  <span className="text-gray-500">{stop.estimatedArrival}min</span>
                </div>
              ))}
            </div>
            
            {selectedRoute.currentBusPosition && (
              <div className="mt-4 pt-3 border-t">
                <div className="flex items-center gap-2 text-blue-600">
                  <span>🚌</span>
                  <span className="text-sm font-medium">
                    Bus approaching {selectedRoute.stops.find(s => s.id === selectedRoute.currentBusPosition?.nextStopId)?.name}
                  </span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
