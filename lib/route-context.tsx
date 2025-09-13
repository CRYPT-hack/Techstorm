"use client"

import React, { createContext, useContext, useEffect, useState } from 'react'
import { routeSimulator, BusRoute, ScheduleUpdate } from './route-simulation'

interface RouteContextType {
  routes: BusRoute[]
  updates: ScheduleUpdate[]
  isLoading: boolean
  lastUpdated: Date | null
  addDelay: (routeId: string, minutes: number) => void
  suspendRoute: (routeId: string) => void
  updateFare: (routeId: string, newFare: number) => void
}

const RouteContext = createContext<RouteContextType | undefined>(undefined)

export function RouteProvider({ children }: { children: React.ReactNode }) {
  const [routes, setRoutes] = useState<BusRoute[]>([])
  const [updates, setUpdates] = useState<ScheduleUpdate[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)

  useEffect(() => {
    // Initialize with current data
    setRoutes(routeSimulator.getRoutes())
    setUpdates(routeSimulator.getActiveUpdates())
    setIsLoading(false)
    setLastUpdated(new Date())

    // Subscribe to real-time updates
    const unsubscribe = routeSimulator.subscribe((data: { routes: BusRoute[], updates: ScheduleUpdate[] }) => {
      setRoutes(data.routes)
      setUpdates(data.updates)
      setLastUpdated(new Date())
    })

    return unsubscribe
  }, [])

  const addDelay = (routeId: string, minutes: number) => {
    routeSimulator.addDelay(routeId, minutes)
  }

  const suspendRoute = (routeId: string) => {
    routeSimulator.suspendRoute(routeId)
  }

  const updateFare = (routeId: string, newFare: number) => {
    routeSimulator.updateFare(routeId, newFare)
  }

  return (
    <RouteContext.Provider value={{
      routes,
      updates,
      isLoading,
      lastUpdated,
      addDelay,
      suspendRoute,
      updateFare
    }}>
      {children}
    </RouteContext.Provider>
  )
}

export function useRoutes() {
  const context = useContext(RouteContext)
  if (context === undefined) {
    throw new Error('useRoutes must be used within a RouteProvider')
  }
  return context
}
