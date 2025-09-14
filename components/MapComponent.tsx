"use client"

import { useEffect, useRef, useState } from 'react'

interface MapComponentProps {
  className?: string
}

export function MapComponent({ className = "" }: MapComponentProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const initializingRef = useRef(false)

  useEffect(() => {
    let mounted = true

    const initializeMap = async () => {
      if (!mapRef.current || mapInstanceRef.current || initializingRef.current) return
      
      try {
        initializingRef.current = true
        setIsLoading(true)
        setError(null)

        // Import Leaflet dynamically
        const leaflet = await import('leaflet')
        
        if (!mounted) return

        // Fix for default markers in Leaflet with Next.js
        delete (leaflet.Icon.Default.prototype as any)._getIconUrl
        leaflet.Icon.Default.mergeOptions({
          iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
          iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
          shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
        })

        // Initialize the map centered on Delhi
        const map = leaflet.map(mapRef.current, {
          preferCanvas: true, // Better performance
          zoomControl: true,
          attributionControl: true,
        }).setView([28.6139, 77.2090], 10)

        if (!mounted) {
          map.remove()
          return
        }

        // Add OpenStreetMap tiles with better caching
        leaflet.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
          maxZoom: 19,
          minZoom: 3,
          subdomains: ['a', 'b', 'c'],
          crossOrigin: true,
          updateWhenIdle: true,
          updateWhenZooming: false,
          keepBuffer: 2,
        }).addTo(map)

        // Add marker at Delhi with popup
        const delhiMarker = leaflet.marker([28.6139, 77.2090]).addTo(map)
        delhiMarker.bindPopup('Delhi - Example Marker')

        mapInstanceRef.current = map
        
        // Wait for map to fully load
        map.whenReady(() => {
          if (mounted) {
            setIsLoading(false)
            // Invalidate size to fix display issues
            setTimeout(() => {
              if (mapInstanceRef.current && mounted) {
                mapInstanceRef.current.invalidateSize()
              }
            }, 100)
          }
        })

      } catch (err) {
        console.error('Map initialization error:', err)
        if (mounted) {
          setError('Failed to load map')
          setIsLoading(false)
        }
      } finally {
        initializingRef.current = false
      }
    }

    initializeMap()

    // Cleanup function
    return () => {
      mounted = false
      if (mapInstanceRef.current) {
        try {
          mapInstanceRef.current.remove()
        } catch (err) {
          console.error('Map cleanup error:', err)
        }
        mapInstanceRef.current = null
      }
      initializingRef.current = false
    }
  }, [])

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

  if (error) {
    return (
      <div className={`w-full h-[500px] rounded-lg shadow-lg bg-gray-100 flex items-center justify-center ${className}`}>
        <div className="text-center">
          <div className="text-red-500 mb-2">⚠️</div>
          <div className="text-gray-600">{error}</div>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="relative">
      {isLoading && (
        <div className="absolute inset-0 bg-gray-100 rounded-lg shadow-lg flex items-center justify-center z-10">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
            <div className="text-gray-600">Loading map...</div>
          </div>
        </div>
      )}
      <div 
        ref={mapRef} 
        className={`w-full h-[500px] rounded-lg shadow-lg ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300 ${className}`}
      />
    </div>
  )
}
