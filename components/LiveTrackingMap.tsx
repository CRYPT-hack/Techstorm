'use client'

import React, { useRef, useEffect, useState, useCallback } from 'react'
import dynamic from 'next/dynamic'

// Leaflet types and interfaces
interface LeafletMap {
  setView: (center: [number, number], zoom: number) => LeafletMap
  fitBounds: (bounds: [[number, number], [number, number]], options?: any) => LeafletMap
  addLayer: (layer: any) => LeafletMap
  removeLayer: (layer: any) => LeafletMap
  invalidateSize: () => void
  remove: () => void
  whenReady: (callback: () => void) => void
  on: (event: string, callback: (e?: any) => void) => void
  off: (event: string, callback?: (e?: any) => void) => void
}

interface LeafletMarker {
  setLatLng: (latlng: [number, number]) => LeafletMarker
  getLatLng: () => { lat: number; lng: number }
  bindPopup: (content: string) => LeafletMarker
  addTo: (map: LeafletMap) => LeafletMarker
  remove: () => void
  setIcon: (icon: any) => LeafletMarker
  on: (event: string, callback: (e?: any) => void) => LeafletMarker
}

interface LeafletModule {
  map: (element: HTMLElement, options?: any) => LeafletMap
  tileLayer: (url: string, options?: any) => any
  marker: (latlng: [number, number], options?: any) => LeafletMarker
  divIcon: (options: any) => any
  Icon: {
    Default: {
      prototype: any
      mergeOptions: (options: any) => void
    }
  }
  layerGroup: () => any
  featureGroup: (layers?: any[]) => any
}

// Bus data interface
interface BusData {
  id: string
  route: string
  lat: number
  lng: number
  heading: number
  speed: number
  passengers: number
  status: 'active' | 'delayed' | 'maintenance'
  lastUpdate: Date
}

// Route stop interface
interface RouteStop {
  id: string
  name: string
  lat: number
  lng: number
}

// Component props
interface LiveTrackingMapProps {
  className?: string
  height?: string
  autoFitBounds?: boolean
  showRoutes?: boolean
  updateInterval?: number
  onBusSelect?: (bus: BusData | null) => void
}

/**
 * Professional Live Tracking Map Component
 * Features:
 * - OpenStreetMap integration via Leaflet.js
 * - Smooth marker animations with no jumping
 * - Real-time WebSocket simulation
 * - Responsive design with proper container confinement
 * - Tile preloading to prevent flickering
 * - Custom bus markers with status indicators
 */
export function LiveTrackingMap({
  className = "",
  height = "500px",
  autoFitBounds = true,
  showRoutes = true,
  updateInterval = 3000,
  onBusSelect
}: LiveTrackingMapProps) {
  // Refs for map management
  const mapContainerRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<LeafletMap | null>(null)
  const busMarkersRef = useRef<Map<string, LeafletMarker>>(new Map())
  const routeLayerRef = useRef<any>(null)
  const animationFramesRef = useRef<Map<string, number>>(new Map())
  
  // State management
  const [isLoading, setIsLoading] = useState(true)
  const [isMapReady, setIsMapReady] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [buses, setBuses] = useState<BusData[]>([])
  const [selectedBus, setSelectedBus] = useState<BusData | null>(null)
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date())

  // Delhi route stops (sample data)
  const routeStops: RouteStop[] = [
    { id: '1', name: 'Connaught Place', lat: 28.6315, lng: 77.2167 },
    { id: '2', name: 'India Gate', lat: 28.6129, lng: 77.2295 },
    { id: '3', name: 'Red Fort', lat: 28.6562, lng: 77.2410 },
    { id: '4', name: 'Chandni Chowk', lat: 28.6506, lng: 77.2334 },
    { id: '5', name: 'Rajiv Chowk Metro', lat: 28.6328, lng: 77.2197 },
    { id: '6', name: 'Karol Bagh', lat: 28.6519, lng: 77.1909 },
  ]

  /**
   * Creates custom bus icon based on status and heading
   */
  const createBusIcon = useCallback((L: LeafletModule, status: string, heading: number = 0) => {
    const colors = {
      active: '#10b981',    // Green
      delayed: '#f59e0b',   // Yellow
      maintenance: '#ef4444' // Red
    }
    
    const color = colors[status as keyof typeof colors] || colors.active
    
    return L.divIcon({
      html: `
        <div style="
          width: 28px; 
          height: 28px; 
          background: ${color}; 
          border: 3px solid white; 
          border-radius: 50%; 
          box-shadow: 0 3px 6px rgba(0,0,0,0.3);
          transform: rotate(${heading}deg);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
        ">
          <div style="
            width: 10px; 
            height: 10px; 
            background: white; 
            border-radius: 50%;
          "></div>
          <div style="
            position: absolute;
            top: -2px;
            right: -2px;
            width: 8px;
            height: 8px;
            background: ${status === 'active' ? '#059669' : status === 'delayed' ? '#d97706' : '#dc2626'};
            border: 1px solid white;
            border-radius: 50%;
          "></div>
        </div>
      `,
      className: 'custom-bus-marker',
      iconSize: [28, 28],
      iconAnchor: [14, 14],
      popupAnchor: [0, -14]
    })
  }, [])

  /**
   * Smoothly animates marker from current position to new position
   */
  const animateMarkerTo = useCallback((
    marker: LeafletMarker,
    newLat: number,
    newLng: number,
    duration: number = 2000,
    busId: string
  ) => {
    // Cancel any existing animation for this bus
    const existingFrame = animationFramesRef.current.get(busId)
    if (existingFrame) {
      cancelAnimationFrame(existingFrame)
    }

    const startPos = marker.getLatLng()
    const startTime = Date.now()
    
    const animate = () => {
      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / duration, 1)
      
      // Smooth easing function
      const easeInOutCubic = (t: number) => 
        t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
      
      const easedProgress = easeInOutCubic(progress)
      
      const lat = startPos.lat + (newLat - startPos.lat) * easedProgress
      const lng = startPos.lng + (newLng - startPos.lng) * easedProgress
      
      marker.setLatLng([lat, lng])
      
      if (progress < 1) {
        const frameId = requestAnimationFrame(animate)
        animationFramesRef.current.set(busId, frameId)
      } else {
        animationFramesRef.current.delete(busId)
      }
    }
    
    const frameId = requestAnimationFrame(animate)
    animationFramesRef.current.set(busId, frameId)
  }, [])

  /**
   * Generates simulated bus data with slower, more realistic movement
   */
  const generateBusData = useCallback((): BusData[] => {
    const baseTime = Date.now()
    
    return [
      {
        id: 'bus-001',
        route: 'Route 42A',
        lat: 28.6315 + (Math.sin(baseTime / 50000) * 0.005),
        lng: 77.2167 + (Math.cos(baseTime / 50000) * 0.005),
        heading: (baseTime / 1000) % 360,
        speed: 25 + Math.sin(baseTime / 25000) * 5,
        passengers: Math.floor(30 + Math.sin(baseTime / 40000) * 15),
        status: 'active',
        lastUpdate: new Date()
      },
      {
        id: 'bus-002',
        route: 'Route 15B',
        lat: 28.6129 + (Math.sin(baseTime / 60000 + 1) * 0.007),
        lng: 77.2295 + (Math.cos(baseTime / 60000 + 1) * 0.007),
        heading: ((baseTime / 1200) + 45) % 360,
        speed: 20 + Math.sin(baseTime / 30000) * 4,
        passengers: Math.floor(25 + Math.sin(baseTime / 45000) * 12),
        status: 'active',
        lastUpdate: new Date()
      },
      {
        id: 'bus-003',
        route: 'Route 8C',
        lat: 28.6562 + (Math.sin(baseTime / 75000 + 2) * 0.004),
        lng: 77.2410 + (Math.cos(baseTime / 75000 + 2) * 0.004),
        heading: ((baseTime / 1500) + 90) % 360,
        speed: 15 + Math.sin(baseTime / 35000) * 3,
        passengers: Math.floor(20 + Math.sin(baseTime / 50000) * 8),
        status: Math.random() > 0.8 ? 'delayed' : 'active',
        lastUpdate: new Date()
      }
    ]
  }, [])

  /**
   * Updates bus markers on the map with smooth animations
   */
  const updateBusMarkers = useCallback(async (busData: BusData[]) => {
    if (!mapInstanceRef.current) return

    try {
      // Dynamic import of Leaflet
      const L = (await import('leaflet')).default as any as LeafletModule

      const map = mapInstanceRef.current
      const currentMarkers = busMarkersRef.current

      busData.forEach(bus => {
        const existingMarker = currentMarkers.get(bus.id)
        
        if (existingMarker) {
          // Animate existing marker to new position with slower movement
          animateMarkerTo(existingMarker, bus.lat, bus.lng, 5000, bus.id)
          
          // Update popup content
          existingMarker.bindPopup(`
            <div class="p-3 min-w-48">
              <div class="font-semibold text-gray-900 mb-2">${bus.route}</div>
              <div class="space-y-1 text-sm text-gray-600">
                <div class="flex justify-between">
                  <span>Speed:</span>
                  <span class="font-medium">${bus.speed.toFixed(1)} km/h</span>
                </div>
                <div class="flex justify-between">
                  <span>Passengers:</span>
                  <span class="font-medium">${bus.passengers}</span>
                </div>
                <div class="flex justify-between">
                  <span>Status:</span>
                  <span class="font-medium capitalize text-${bus.status === 'active' ? 'green' : bus.status === 'delayed' ? 'yellow' : 'red'}-600">
                    ${bus.status}
                  </span>
                </div>
                <div class="text-xs text-gray-500 mt-2">
                  Updated: ${bus.lastUpdate.toLocaleTimeString()}
                </div>
              </div>
            </div>
          `)
        } else {
          // Create new marker
          const marker = L.marker([bus.lat, bus.lng], {
            icon: createBusIcon(L, bus.status, bus.heading)
          })
          
          marker.bindPopup(`
            <div class="p-3 min-w-48">
              <div class="font-semibold text-gray-900 mb-2">${bus.route}</div>
              <div class="space-y-1 text-sm text-gray-600">
                <div class="flex justify-between">
                  <span>Speed:</span>
                  <span class="font-medium">${bus.speed.toFixed(1)} km/h</span>
                </div>
                <div class="flex justify-between">
                  <span>Passengers:</span>
                  <span class="font-medium">${bus.passengers}</span>
                </div>
                <div class="flex justify-between">
                  <span>Status:</span>
                  <span class="font-medium capitalize text-${bus.status === 'active' ? 'green' : bus.status === 'delayed' ? 'yellow' : 'red'}-600">
                    ${bus.status}
                  </span>
                </div>
                <div class="text-xs text-gray-500 mt-2">
                  Updated: ${bus.lastUpdate.toLocaleTimeString()}
                </div>
              </div>
            </div>
          `)
          
          marker.addTo(map)
          currentMarkers.set(bus.id, marker)

          // Add click handler for bus selection
          marker.on('click', () => {
            setSelectedBus(bus)
            onBusSelect?.(bus)
          })
        }
      })

      // Auto-fit bounds if enabled
      if (autoFitBounds && busData.length > 0) {
        const L = (await import('leaflet')).default as any as LeafletModule
        const group = L.featureGroup(Array.from(currentMarkers.values()))
        const bounds = group.getBounds()
        
        if (bounds.isValid()) {
          map.fitBounds(bounds.pad(0.1), { 
            animate: true,
            duration: 1,
            maxZoom: 15
          })
        }
      }
    } catch (err) {
      console.error('Error updating bus markers:', err)
    }
  }, [animateMarkerTo, createBusIcon, autoFitBounds, onBusSelect])

  /**
   * Initializes the Leaflet map with optimized settings
   */
  const initializeMap = useCallback(async () => {
    if (!mapContainerRef.current || mapInstanceRef.current) return

    try {
      setIsLoading(true)
      setError(null)

      // Dynamic import of Leaflet
      const leaflet = await import('leaflet')
      const L = leaflet.default as any as LeafletModule
      
      // Ensure Leaflet is properly loaded
      if (!L || !L.map) {
        throw new Error('Leaflet failed to load')
      }
      
      // Fix for default markers in Next.js
      if (L.Icon && L.Icon.Default) {
        delete (L.Icon.Default.prototype as any)._getIconUrl
        L.Icon.Default.mergeOptions({
          iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
          iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
          shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
        })
      }

      // Ensure container is ready
      if (!mapContainerRef.current) {
        throw new Error('Map container not found')
      }

      // Create map with error handling
      const map = L.map(mapContainerRef.current, {
        preferCanvas: true,
        zoomControl: true,
        attributionControl: true,
        fadeAnimation: true,
        zoomAnimation: true,
        markerZoomAnimation: true,
        // Constrain to reasonable bounds
        maxBounds: [[28.4, 76.8], [28.9, 77.6]],
        maxBoundsViscosity: 0.7
      })

      if (!map) {
        throw new Error('Failed to create map instance')
      }

      // Add optimized tile layer with error handling
      const tileLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 18,
        minZoom: 10,
        subdomains: ['a', 'b', 'c'],
        crossOrigin: true,
        // Performance optimizations
        updateWhenIdle: true,
        updateWhenZooming: false,
        keepBuffer: 3,
        detectRetina: true,
        // Error handling
        errorTileUrl: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg=='
      })

      // Handle tile loading errors
      tileLayer.on('tileerror', (e: any) => {
        console.warn('Tile loading error:', e)
      })

      tileLayer.addTo(map)
      mapInstanceRef.current = map

      // Add route visualization if enabled
      if (showRoutes) {
        const routeLayer = L.layerGroup()
        
        // Add route stops
        routeStops.forEach((stop, index) => {
          const stopMarker = L.marker([stop.lat, stop.lng], {
            icon: L.divIcon({
              html: `
                <div style="
                  width: 12px; 
                  height: 12px; 
                  background: #3b82f6; 
                  border: 2px solid white; 
                  border-radius: 50%;
                  box-shadow: 0 2px 4px rgba(0,0,0,0.2);
                "></div>
              `,
              className: 'route-stop-marker',
              iconSize: [12, 12],
              iconAnchor: [6, 6]
            })
          }).bindPopup(`
            <div class="p-2">
              <div class="font-medium text-gray-900">${stop.name}</div>
              <div class="text-sm text-gray-600">Stop ${index + 1}</div>
            </div>
          `)
          
          routeLayer.addLayer(stopMarker)
        })

        routeLayer.addTo(map)
        routeLayerRef.current = routeLayer
      }

      // Set initial view to fit route stops
      const bounds = routeStops.map(stop => [stop.lat, stop.lng] as [number, number])
      if (bounds.length > 0) {
        const group = L.featureGroup(bounds.map(coord => L.marker(coord)))
        map.fitBounds(group.getBounds().pad(0.1))
      }

      // Wait for map to be ready with better error handling
      let isMapInitialized = false
      
      const completeInitialization = () => {
        if (!isMapInitialized) {
          isMapInitialized = true
          setIsLoading(false)
          setIsMapReady(true)
          
          // Trigger initial size calculation
          setTimeout(() => {
            if (map && mapInstanceRef.current) {
              try {
                map.invalidateSize()
              } catch (err) {
                console.warn('Size invalidation warning:', err)
              }
            }
          }, 100)
        }
      }

      // Primary initialization method
      map.whenReady(() => {
        setTimeout(completeInitialization, 300)
      })

      // Handle successful tile loading
      tileLayer.on('tileload', () => {
        // Complete after first successful tile load
        setTimeout(completeInitialization, 500)
      })

      // Handle tile loading completion
      tileLayer.on('load', () => {
        completeInitialization()
      })

      // Fallback timeout with shorter duration
      setTimeout(() => {
        completeInitialization()
      }, 2000)

    } catch (err) {
      console.error('Map initialization error:', err)
      setError(`Failed to initialize map: ${err instanceof Error ? err.message : 'Unknown error'}`)
      setIsLoading(false)
    }
  }, [showRoutes, routeStops])

  // Initialize map on mount
  useEffect(() => {
    initializeMap()

    return () => {
      // Cleanup
      if (mapInstanceRef.current) {
        try {
          mapInstanceRef.current.remove()
        } catch (err) {
          console.error('Map cleanup error:', err)
        }
        mapInstanceRef.current = null
      }
      
      // Cancel all animations
      animationFramesRef.current.forEach(frameId => {
        cancelAnimationFrame(frameId)
      })
      animationFramesRef.current.clear()
      
      // Clear markers
      busMarkersRef.current.clear()
    }
  }, [initializeMap])

  // Handle window resize for responsive behavior
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

  // Real-time data updates simulation
  useEffect(() => {
    if (!isMapReady) return

    const updateData = () => {
      const newBusData = generateBusData()
      setBuses(newBusData)
      updateBusMarkers(newBusData)
      setLastUpdate(new Date())
    }

    // Initial data load
    updateData()

    // Set up interval for live updates
    const interval = setInterval(updateData, updateInterval)

    return () => clearInterval(interval)
  }, [isMapReady, generateBusData, updateBusMarkers, updateInterval])

  // Render loading state
  if (isLoading) {
    return (
      <div 
        className={`relative bg-gray-50 rounded-lg border flex items-center justify-center ${className}`}
        style={{ height }}
      >
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <div className="text-gray-600 font-medium">Loading Map...</div>
          <div className="text-gray-500 text-sm mt-1">Initializing OpenStreetMap</div>
        </div>
      </div>
    )
  }

  // Render error state
  if (error) {
    return (
      <div 
        className={`relative bg-red-50 rounded-lg border border-red-200 flex items-center justify-center ${className}`}
        style={{ height }}
      >
        <div className="text-center">
          <div className="text-red-500 text-4xl mb-4">⚠️</div>
          <div className="text-red-700 font-medium mb-2">{error}</div>
          <button 
            onClick={initializeMap}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className={`relative ${className}`}>
      {/* Map Container */}
      <div 
        ref={mapContainerRef}
        className="w-full rounded-lg overflow-hidden border shadow-sm"
        style={{ height }}
      />
      
      {/* Live Status Indicator */}
      <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2 shadow-lg border">
        <div className="flex items-center gap-2 text-sm">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="font-medium text-gray-700">Live</span>
          <span className="text-gray-500">•</span>
          <span className="text-gray-600">{buses.length} buses</span>
        </div>
        <div className="text-xs text-gray-500 mt-1">
          Updated: {lastUpdate.toLocaleTimeString()}
        </div>
      </div>

      {/* Bus Status Legend */}
      <div className="mt-4 bg-white rounded-lg border p-4">
        <div className="flex flex-wrap items-center gap-6 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-gray-700">Active ({buses.filter(b => b.status === 'active').length})</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <span className="text-gray-700">Delayed ({buses.filter(b => b.status === 'delayed').length})</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span className="text-gray-700">Maintenance ({buses.filter(b => b.status === 'maintenance').length})</span>
          </div>
          {selectedBus && (
            <div className="ml-auto text-blue-600 font-medium">
              Selected: {selectedBus.route}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
