"use client"

import { useEffect, useState } from "react"
import { MapPin, Navigation, Zap } from "lucide-react"

interface Stop {
  id: string
  name: string
  lat: number
  lng: number
  estimatedArrival: string // Now using time format like "4:15 PM"
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

interface GoogleMapsStyleProps {
  selectedRoute: Route | null
  userLocation?: { lat: number; lng: number }
}

export function GoogleMapsStyle({ selectedRoute, userLocation }: GoogleMapsStyleProps) {
  const [mapCenter, setMapCenter] = useState({ lat: 28.6139, lng: 77.2090 })
  const [zoomLevel, setZoomLevel] = useState(12)
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    if (selectedRoute && selectedRoute.stops.length > 0) {
      // Center map on route
      const lats = selectedRoute.stops.map(stop => stop.lat)
      const lngs = selectedRoute.stops.map(stop => stop.lng)
      setMapCenter({
        lat: (Math.min(...lats) + Math.max(...lats)) / 2,
        lng: (Math.min(...lngs) + Math.max(...lngs)) / 2
      })
    }
  }, [selectedRoute])

  const handleZoomIn = () => setZoomLevel(prev => Math.min(prev + 1, 18))
  const handleZoomOut = () => setZoomLevel(prev => Math.max(prev - 1, 8))

  // Calculate relative positions for stops on the visual map
  const getStopPosition = (stop: Stop, index: number) => {
    if (!selectedRoute) return { x: 50, y: 50 }
    
    const totalStops = selectedRoute.stops.length
    const progress = index / (totalStops - 1)
    
    // Create a curved path
    const x = 20 + progress * 60 // 20% to 80% width
    const y = 30 + Math.sin(progress * Math.PI) * 40 // Curved path
    
    return { x, y }
  }

  const getBusPosition = () => {
    if (!selectedRoute?.currentBusPosition) return { x: 50, y: 50 }
    
    const nextStopIndex = selectedRoute.stops.findIndex(
      stop => stop.id === selectedRoute.currentBusPosition?.nextStopId
    )
    
    if (nextStopIndex <= 0) return getStopPosition(selectedRoute.stops[0], 0)
    
    const prevStop = getStopPosition(selectedRoute.stops[nextStopIndex - 1], nextStopIndex - 1)
    const nextStop = getStopPosition(selectedRoute.stops[nextStopIndex], nextStopIndex)
    
    // Position bus 70% of the way to next stop
    const progress = 0.7
    return {
      x: prevStop.x + (nextStop.x - prevStop.x) * progress,
      y: prevStop.y + (nextStop.y - prevStop.y) * progress
    }
  }

  return (
    <div className="relative h-[500px] w-full rounded-lg overflow-hidden border shadow-lg bg-gradient-to-br from-green-100 via-blue-50 to-green-50">
      {/* Map Header */}
      <div className="absolute top-0 left-0 right-0 bg-white/90 backdrop-blur-sm border-b p-3 z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center">
              <MapPin className="h-4 w-4 text-white" />
            </div>
            <span className="font-medium text-gray-800">Live Tracking</span>
            <div className="flex items-center gap-1 text-green-600">
              <Zap className="h-3 w-3" />
              <span className="text-xs font-medium">LIVE</span>
            </div>
          </div>
          <div className="text-sm text-gray-600">
            {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>
        </div>
      </div>

      {/* Map Controls */}
      <div className="absolute top-20 right-4 z-10 flex flex-col gap-1">
        <button
          onClick={handleZoomIn}
          className="w-8 h-8 bg-white border rounded shadow-sm flex items-center justify-center hover:bg-gray-50 text-gray-700 font-bold"
        >
          +
        </button>
        <button
          onClick={handleZoomOut}
          className="w-8 h-8 bg-white border rounded shadow-sm flex items-center justify-center hover:bg-gray-50 text-gray-700 font-bold"
        >
          −
        </button>
      </div>

      {/* Map Content */}
      <div className="absolute inset-0 pt-16">
        {selectedRoute ? (
          <div className="relative h-full w-full">
            {/* Route Path */}
            <svg className="absolute inset-0 w-full h-full" style={{ zIndex: 1 }}>
              <defs>
                <linearGradient id="routeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#3b82f6" />
                  <stop offset="100%" stopColor="#10b981" />
                </linearGradient>
              </defs>
              {selectedRoute.stops.map((stop, index) => {
                if (index === selectedRoute.stops.length - 1) return null
                const currentPos = getStopPosition(stop, index)
                const nextPos = getStopPosition(selectedRoute.stops[index + 1], index + 1)
                return (
                  <line
                    key={`path-${index}`}
                    x1={`${currentPos.x}%`}
                    y1={`${currentPos.y}%`}
                    x2={`${nextPos.x}%`}
                    y2={`${nextPos.y}%`}
                    stroke="url(#routeGradient)"
                    strokeWidth="4"
                    strokeDasharray="8,4"
                    className="animate-pulse"
                  />
                )
              })}
            </svg>

            {/* Bus Stops */}
            {selectedRoute.stops.map((stop, index) => {
              const position = getStopPosition(stop, index)
              return (
                <div
                  key={stop.id}
                  className="absolute transform -translate-x-1/2 -translate-y-1/2 z-20"
                  style={{ left: `${position.x}%`, top: `${position.y}%` }}
                >
                  <div className="relative group">
                    <div className={`w-4 h-4 rounded-full border-2 border-white shadow-lg ${
                      index === 0 ? 'bg-green-500' : 
                      index === selectedRoute.stops.length - 1 ? 'bg-red-500' : 
                      'bg-blue-500'
                    }`}></div>
                    
                    {/* Stop Info Popup */}
                    <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 bg-white rounded-lg shadow-lg p-3 min-w-[200px] opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                      <div className="text-sm font-medium text-gray-800">{stop.name}</div>
                      <div className="text-xs text-gray-600 mt-1">
                        Arrives: {stop.estimatedArrival}
                      </div>
                      <div className={`text-xs font-medium mt-1 ${
                        stop.status === 'on-time' ? 'text-green-600' :
                        stop.status === 'delayed' ? 'text-red-600' : 'text-blue-600'
                      }`}>
                        {stop.status.replace('-', ' ').toUpperCase()}
                      </div>
                      <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-white"></div>
                    </div>
                  </div>
                </div>
              )
            })}

            {/* Current Bus Position */}
            {selectedRoute.currentBusPosition && (
              <div
                className="absolute transform -translate-x-1/2 -translate-y-1/2 z-30"
                style={{ 
                  left: `${getBusPosition().x}%`, 
                  top: `${getBusPosition().y}%` 
                }}
              >
                <div className="relative group">
                  <div className="w-6 h-6 bg-blue-600 rounded-full border-2 border-white shadow-lg flex items-center justify-center animate-pulse">
                    <span className="text-white text-xs font-bold">🚌</span>
                  </div>
                  
                  {/* Bus Info Popup */}
                  <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white rounded-lg shadow-lg p-3 min-w-[180px] opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="text-sm font-medium">Bus {selectedRoute.name}</div>
                    <div className="text-xs mt-1">
                      Next: {selectedRoute.stops.find(s => s.id === selectedRoute.currentBusPosition?.nextStopId)?.name}
                    </div>
                    <div className="text-xs mt-1">
                      ETA: {selectedRoute.currentBusPosition.estimatedArrival}
                    </div>
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-blue-600"></div>
                  </div>
                </div>
              </div>
            )}

            {/* User Location */}
            {userLocation && (
              <div
                className="absolute transform -translate-x-1/2 -translate-y-1/2 z-25"
                style={{ left: '25%', top: '60%' }} // Positioned near Connaught Place
              >
                <div className="relative group">
                  <div className="w-3 h-3 bg-red-500 rounded-full border-2 border-white shadow-lg animate-ping"></div>
                  <div className="absolute inset-0 w-3 h-3 bg-red-500 rounded-full border-2 border-white shadow-lg"></div>
                  
                  <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 bg-red-500 text-white rounded-lg shadow-lg p-2 min-w-[120px] opacity-0 group-hover:opacity-100 transition-opacity text-center">
                    <div className="text-xs font-medium">Your Location</div>
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-3 border-r-3 border-t-3 border-transparent border-t-red-500"></div>
                  </div>
                </div>
              </div>
            )}

            {/* Route Info Panel */}
            <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-sm rounded-lg shadow-lg p-4 max-w-sm">
              <div className="flex items-center gap-2 mb-2">
                <Navigation className="h-4 w-4 text-blue-600" />
                <span className="font-medium text-gray-800">{selectedRoute.name}</span>
              </div>
              <div className="text-sm text-gray-600 mb-3">{selectedRoute.description}</div>
              <div className="space-y-1 text-xs">
                <div className="flex justify-between">
                  <span>Total Stops:</span>
                  <span className="font-medium">{selectedRoute.stops.length}</span>
                </div>
                <div className="flex justify-between">
                  <span>Next Stop:</span>
                  <span className="font-medium text-blue-600">
                    {selectedRoute.stops.find(s => s.id === selectedRoute.currentBusPosition?.nextStopId)?.name || 'N/A'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Arrival:</span>
                  <span className="font-medium text-green-600">
                    {selectedRoute.currentBusPosition?.estimatedArrival || 'N/A'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center text-gray-500">
              <MapPin className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <p className="text-lg font-medium">Select a route to view live tracking</p>
              <p className="text-sm">Choose a route from the dropdown above</p>
            </div>
          </div>
        )}
      </div>

      {/* Map Attribution */}
      <div className="absolute bottom-1 right-2 text-xs text-gray-500 bg-white/80 px-2 py-1 rounded">
        Live Tracking • Transport Tracker
      </div>
    </div>
  )
}
