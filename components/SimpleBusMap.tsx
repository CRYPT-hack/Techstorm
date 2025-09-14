'use client'

import React, { useRef, useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MapPin, Bus, Clock } from "lucide-react"

interface BusData {
  id: string
  route: string
  lat: number
  lng: number
  status: 'active' | 'delayed' | 'maintenance'
}

interface SimpleBusMapProps {
  className?: string
  height?: string
}

export function SimpleBusMap({ className = "", height = "400px" }: SimpleBusMapProps) {
  const [buses] = useState<BusData[]>([
    { id: 'bus-001', route: 'Route 1', lat: 28.6315, lng: 77.2167, status: 'active' },
    { id: 'bus-002', route: 'Route 2', lat: 28.6129, lng: 77.2295, status: 'active' },
    { id: 'bus-003', route: 'Route 3', lat: 28.6562, lng: 77.2410, status: 'delayed' }
  ])

  const [selectedBus, setSelectedBus] = useState<string | null>(null)
  const [currentTime, setCurrentTime] = useState(new Date())

  // Update time every second for live feel
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className={`w-full ${className}`}>
      {/* Map Placeholder with Bus Locations */}
      <div 
        className="relative bg-gradient-to-br from-blue-50 to-green-50 rounded-lg border-2 border-dashed border-gray-300 overflow-hidden"
        style={{ height }}
      >
        {/* Background Grid Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="grid grid-cols-8 grid-rows-6 h-full w-full">
            {Array.from({ length: 48 }).map((_, i) => (
              <div key={i} className="border border-gray-400"></div>
            ))}
          </div>
        </div>

        {/* Delhi Area Representation */}
        <div className="absolute inset-4 bg-white/20 rounded-lg border border-blue-200">
          <div className="p-2 text-xs text-gray-600 font-medium">Delhi Metro Area</div>
          
          {/* Route Lines */}
          <svg className="absolute inset-0 w-full h-full">
            <path
              d="M 20 60 Q 150 40 280 80 Q 350 100 400 140"
              stroke="#3b82f6"
              strokeWidth="3"
              fill="none"
              strokeDasharray="5,5"
              className="opacity-60"
            />
            <path
              d="M 60 20 Q 120 80 180 120 Q 240 160 300 200"
              stroke="#10b981"
              strokeWidth="3"
              fill="none"
              strokeDasharray="5,5"
              className="opacity-60"
            />
          </svg>

          {/* Bus Markers */}
          {buses.map((bus, index) => {
            const x = 50 + (index * 15) + (Math.sin(currentTime.getTime() / 3000 + index) * 10)
            const y = 60 + (index * 20) + (Math.cos(currentTime.getTime() / 3000 + index) * 8)
            
            return (
              <div
                key={bus.id}
                className={`absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-300 hover:scale-110 ${
                  selectedBus === bus.id ? 'scale-125 z-10' : ''
                }`}
                style={{ left: `${Math.min(Math.max(x, 20), 90)}%`, top: `${Math.min(Math.max(y, 20), 80)}%` }}
                onClick={() => setSelectedBus(selectedBus === bus.id ? null : bus.id)}
              >
                <div className={`w-6 h-6 rounded-full border-2 border-white shadow-lg flex items-center justify-center ${
                  bus.status === 'active' ? 'bg-green-500' : 
                  bus.status === 'delayed' ? 'bg-yellow-500' : 'bg-red-500'
                }`}>
                  <Bus className="w-3 h-3 text-white" />
                </div>
                
                {/* Bus Info Popup */}
                {selectedBus === bus.id && (
                  <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 bg-white rounded-lg shadow-lg border p-3 min-w-32 z-20">
                    <div className="text-sm font-medium text-gray-900">{bus.route}</div>
                    <div className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                      <div className={`w-2 h-2 rounded-full ${
                        bus.status === 'active' ? 'bg-green-500' : 
                        bus.status === 'delayed' ? 'bg-yellow-500' : 'bg-red-500'
                      }`}></div>
                      {bus.status}
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* Center Info */}
        <div className="text-center text-gray-600">
          <MapPin className="w-8 h-8 mx-auto mb-2 text-blue-500" />
          <div className="text-sm font-medium">Live Bus Tracking</div>
          <div className="text-xs opacity-75">Click on bus markers for details</div>
        </div>
      </div>

      {/* Bus Status Legend */}
      <div className="mt-4 flex flex-wrap gap-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          <span className="text-gray-600">Active ({buses.filter(b => b.status === 'active').length})</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
          <span className="text-gray-600">Delayed ({buses.filter(b => b.status === 'delayed').length})</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
          <span className="text-gray-600">Maintenance ({buses.filter(b => b.status === 'maintenance').length})</span>
        </div>
        <div className="flex items-center gap-2 ml-auto">
          <Clock className="w-4 h-4 text-gray-400" />
          <span className="text-gray-500 text-xs">Updated: {currentTime.toLocaleTimeString()}</span>
        </div>
      </div>
    </div>
  )
}
