"use client"

import React, { useRef, useEffect, useState, useCallback } from 'react'
import dynamic from 'next/dynamic'

// Import Leaflet types
interface LeafletModule {
  map: any
  tileLayer: any
  marker: any
  divIcon: any
  circleMarker: any
  polyline: any
  layerGroup: any
  featureGroup: any
  FeatureGroup: any
  Icon: any
}

// Declare Leaflet as a global variable
declare global {
  interface Window {
    L: LeafletModule
  }
}

let L: LeafletModule

// Bus data interface for type safety
interface BusData {
  id: string
  route: string
  lat: number
  lng: number
  heading: number
  speed: number
  passengers: number
  status: 'active' | 'delayed' | 'maintenance'
}

// Route stop interface
interface RouteStop {
  id: string
  name: string
  lat: number
  lng: number
}

// Component props interface
interface LiveBusTrackingMapProps {
  className?: string
  height?: string
  autoTrack?: boolean
  showRoutes?: boolean
}

export function LiveBusTrackingMap({ 
  className = "", 
  height = "500px",
  autoTrack = true,
  showRoutes = true 
}: LiveBusTrackingMapProps) {
  // Refs for map management
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<L.Map | null>(null)
  const busMarkersRef = useRef<Map<string, L.Marker>>(new Map())
  const routeLayersRef = useRef<L.LayerGroup | null>(null)
  const animationFrameRef = useRef<number>()
  
  // State management
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [buses, setBuses] = useState<BusData[]>([])
  const [isInitialized, setIsInitialized] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  
  // Delhi route stops (sample data)
  const routeStops: RouteStop[] = [
    { id: '1', name: 'Connaught Place', lat: 28.6315, lng: 77.2167 },
    { id: '2', name: 'India Gate', lat: 28.6129, lng: 77.2295 },
    { id: '3', name: 'Red Fort', lat: 28.6562, lng: 77.2410 },
    { id: '4', name: 'Chandni Chowk', lat: 28.6506, lng: 77.2334 },
    { id: '5', name: 'Rajiv Chowk Metro', lat: 28.6328, lng: 77.2197 },
    { id: '6', name: 'Karol Bagh', lat: 28.6519, lng: 77.1909 },
  ]

  // Custom bus icon creation
  const createBusIcon = useCallback((status: string, heading: number = 0) => {
    const color = status === 'active' ? '#10b981' : status === 'delayed' ? '#f59e0b' : '#ef4444'
    
    return L.divIcon({
      html: `
        <div style="
          width: 24px; 
          height: 24px; 
          background: ${color}; 
          border: 2px solid white; 
          border-radius: 50%; 
          box-shadow: 0 2px 4px rgba(0,0,0,0.3);
          transform: rotate(${heading}deg);
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
        ">
          <div style="
            width: 8px; 
            height: 8px; 
            background: white; 
            border-radius: 50%;
          "></div>
        </div>
      `,
      className: 'custom-bus-marker',
      iconSize: [24, 24],
      iconAnchor: [12, 12],
      popupAnchor: [0, -12]
    })
  }, [])

  // Smooth marker animation function
  const animateMarkerTo = useCallback((marker: L.Marker, newLat: number, newLng: number, duration: number = 1000) => {
    const startPos = marker.getLatLng()
    const startTime = Date.now()
    
    const animate = () => {
      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / duration, 1)
      
      // Easing function for smooth animation
      const easeInOut = (t: number) => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t
      const easedProgress = easeInOut(progress)
      
      const lat = startPos.lat + (newLat - startPos.lat) * easedProgress
      const lng = startPos.lng + (newLng - startPos.lng) * easedProgress
      
      marker.setLatLng([lat, lng])
      
      if (progress < 1) {
        animationFrameRef.current = requestAnimationFrame(animate)
      }
    }
    
    animate()
  }, [])

  // Generate simulated bus data
  const generateBusData = useCallback((): BusData[] => {
    return [
      {
        id: 'bus-001',
        route: 'Route 1',
        lat: 28.6315 + (Math.random() - 0.5) * 0.02,
        lng: 77.2167 + (Math.random() - 0.5) * 0.02,
        heading: Math.random() * 360,
        speed: 25 + Math.random() * 15,
        passengers: Math.floor(Math.random() * 50),
        status: 'active'
      },
      {
        id: 'bus-002',
        route: 'Route 2',
        lat: 28.6129 + (Math.random() - 0.5) * 0.02,
        lng: 77.2295 + (Math.random() - 0.5) * 0.02,
        heading: Math.random() * 360,
        speed: 20 + Math.random() * 10,
        passengers: Math.floor(Math.random() * 45),
        status: 'active'
      },
      {
        id: 'bus-003',
        route: 'Route 3',
        lat: 28.6562 + (Math.random() - 0.5) * 0.02,
        lng: 77.2410 + (Math.random() - 0.5) * 0.02,
        heading: Math.random() * 360,
        speed: 15 + Math.random() * 8,
        passengers: Math.floor(Math.random() * 40),
        status: 'delayed'
      }
    ]
  }, [])

  // Initialize map with optimized settings
  const initializeMap = useCallback(async () => {
    if (!mapRef.current || mapInstanceRef.current) return

    try {
      setIsLoading(true)
      setError(null)

      // Fix for Leaflet markers in Next.js
      delete (L.Icon.Default.prototype as any)._getIconUrl
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
        iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
      })

      // Create map with performance optimizations
      const map = L.map(mapRef.current, {
        preferCanvas: true, // Better performance for many markers
        zoomControl: true,
        attributionControl: true,
        fadeAnimation: true,
        zoomAnimation: true,
        markerZoomAnimation: true,
        maxBounds: [[28.4, 76.8], [28.9, 77.6]], // Constrain to Delhi area
        maxBoundsViscosity: 0.8
      })

      // Add highly optimized tile layer
      const tileLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: ' OpenStreetMap contributors',
        maxZoom: 16, // Reduced max zoom
        minZoom: 10,
        subdomains: ['a', 'b', 'c'],
        crossOrigin: true,
        updateWhenIdle: true,
        updateWhenZooming: false,
        keepBuffer: 2, // Reduced buffer
        maxNativeZoom: 16,
        detectRetina: false, // Disabled for performance
        noWrap: true,
        bounds: [[28.4, 76.8], [28.9, 77.6]] // Constrain tile loading
      })

      tileLayer.addTo(map)
      mapInstanceRef.current = map

      // Initialize route layers
      if (showRoutes) {
        routeLayersRef.current = L.layerGroup().addTo(map)
        
        // Add route stops
        routeStops.forEach((stop, index) => {
          const stopMarker = L.circleMarker([stop.lat, stop.lng], {
            radius: 6,
            fillColor: '#3b82f6',
            color: '#1e40af',
            weight: 2,
            opacity: 1,
            fillOpacity: 0.8
          }).bindPopup(`<strong>${stop.name}</strong><br/>Stop ${index + 1}`)
          
          routeLayersRef.current?.addLayer(stopMarker)
        })

        // Draw route lines
        const routeCoords = routeStops.map(stop => [stop.lat, stop.lng] as [number, number])
        const routeLine = L.polyline(routeCoords, {
          color: '#3b82f6',
          weight: 3,
          opacity: 0.7,
          smoothFactor: 1
        })
        routeLayersRef.current?.addLayer(routeLine)
      }

      // Set initial view to fit all stops
      const group = new L.FeatureGroup(routeStops.map(stop => 
        L.marker([stop.lat, stop.lng])
      ))
      map.fitBounds(group.getBounds().pad(0.1))

      // Simplified loading with faster timeout
      map.whenReady(() => {
        setTimeout(() => {
          if (isMounted) {
            setIsLoading(false)
            setIsInitialized(true)
          }
        }, 500)
      })

      // Fallback timeout - much faster
      setTimeout(() => {
        if (isMounted) {
          setIsLoading(false)
          setIsInitialized(true)
        }
      }, 1500)

    } catch (err) {
      console.error('Map initialization error:', err)
      setError('Failed to load map')
      setIsLoading(false)
    }
  }, [showRoutes, routeStops])

  // Update bus markers with smooth animation
  const updateBusMarkers = useCallback((busData: BusData[]) => {
    if (!mapInstanceRef.current) return

    const map = mapInstanceRef.current
    const currentMarkers = busMarkersRef.current

    busData.forEach(bus => {
      const existingMarker = currentMarkers.get(bus.id)
      
      if (existingMarker) {
        // Animate existing marker to new position
        animateMarkerTo(existingMarker, bus.lat, bus.lng)
        
        // Update popup content
        existingMarker.setPopupContent(`
          <div class="p-2">
            <strong>${bus.route}</strong><br/>
            <span class="text-sm text-gray-600">
              Speed: ${bus.speed.toFixed(1)} km/h<br/>
              Passengers: ${bus.passengers}<br/>
              Status: <span class="capitalize text-${bus.status === 'active' ? 'green' : bus.status === 'delayed' ? 'yellow' : 'red'}-600">${bus.status}</span>
            </span>
          </div>
        `)
      } else {
        // Create new marker
        const marker = L.marker([bus.lat, bus.lng], {
          icon: createBusIcon(bus.status, bus.heading)
        })
        
        marker.bindPopup(`
          <div class="p-2">
            <strong>${bus.route}</strong><br/>
            <span class="text-sm text-gray-600">
              Speed: ${bus.speed.toFixed(1)} km/h<br/>
              Passengers: ${bus.passengers}<br/>
              Status: <span class="capitalize text-${bus.status === 'active' ? 'green' : bus.status === 'delayed' ? 'yellow' : 'red'}-600">${bus.status}</span>
            </span>
          </div>
        `)
        
        marker.addTo(map)
        currentMarkers.set(bus.id, marker)
      }
    })

    // Auto-fit bounds to include all buses if enabled
    if (autoTrack && busData.length > 0) {
      const busGroup = new L.FeatureGroup(Array.from(currentMarkers.values()))
      const bounds = busGroup.getBounds()
      
      if (bounds.isValid()) {
        map.fitBounds(bounds.pad(0.1), { 
          animate: true,
          duration: 1,
          maxZoom: 15
        })
      }
    }
  }, [animateMarkerTo, createBusIcon, autoTrack])

  // Simulate live bus data updates with throttling
  useEffect(() => {
    if (!isInitialized || !isMounted) return

    const updateInterval = setInterval(() => {
      const newBusData = generateBusData()
      setBuses(newBusData)
      updateBusMarkers(newBusData)
    }, 5000) // Reduced frequency to 5 seconds

    // Initial data with delay
    const timeout = setTimeout(() => {
      const initialData = generateBusData()
      setBuses(initialData)
      updateBusMarkers(initialData)
    }, 1000)

    return () => {
      clearInterval(updateInterval)
      clearTimeout(timeout)
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [isInitialized, isMounted, generateBusData, updateBusMarkers])

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      if (mapInstanceRef.current) {
        setTimeout(() => {
          mapInstanceRef.current?.invalidateSize()
        }, 100)
      }
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Initialize map on mount with proper cleanup
  useEffect(() => {
    setIsMounted(true)
    
    // Delay map initialization to prevent SSR issues
    const timeout = setTimeout(() => {
      if (isMounted) {
        initializeMap()
      }
    }, 100)

    return () => {
      setIsMounted(false)
      clearTimeout(timeout)
      // Cleanup map instance
      if (mapInstanceRef.current) {
        try {
          mapInstanceRef.current.remove()
        } catch (err) {
          console.error('Map cleanup error:', err)
        }
        mapInstanceRef.current = null
      }
      
      busMarkersRef.current.clear()
    }
  }, [initializeMap])

  // Error state
  if (error) {
    return (
      <div 
        className={`relative bg-gray-100 rounded-lg shadow-lg flex items-center justify-center ${className}`}
        style={{ height }}
      >
        <div className="text-center p-6">
          <div className="text-red-500 text-2xl mb-2">⚠️</div>
          <div className="text-gray-700 font-medium mb-2">Map Loading Error</div>
          <div className="text-gray-600 text-sm mb-4">{error}</div>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className={`relative overflow-hidden rounded-lg shadow-lg ${className}`}>
      {/* Loading overlay */}
      {isLoading && (
        <div 
          className="absolute inset-0 bg-gray-50 flex items-center justify-center z-50"
          style={{ height }}
        >
          <div className="text-center">
            <div className="relative">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-200 border-t-blue-500 mx-auto mb-4"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-4 h-4 bg-blue-500 rounded-full animate-pulse"></div>
              </div>
            </div>
            <div className="text-gray-700 font-medium">Loading Live Bus Tracking</div>
            <div className="text-gray-500 text-sm mt-1">Initializing map and routes...</div>
          </div>
        </div>
      )}

      {/* Map container */}
      <div 
        ref={mapRef} 
        className={`w-full transition-opacity duration-500 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
        style={{ height }}
      />

      {/* Live indicator */}
      {!isLoading && (
        <div className="absolute top-4 right-4 bg-white rounded-lg shadow-lg px-3 py-2 z-10">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium text-gray-700">Live</span>
            <span className="text-xs text-gray-500">{buses.length} buses</span>
          </div>
        </div>
      )}

      {/* Map controls info */}
      {!isLoading && (
        <div className="absolute bottom-4 left-4 bg-white rounded-lg shadow-lg px-3 py-2 z-10">
          <div className="text-xs text-gray-600">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span>Active</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <span>Delayed</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span>Maintenance</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
