// Real-time route and schedule simulation (No GPS needed)
import { addMinutesToCurrentTime } from './time-utils'

export interface RouteStop {
  id: string
  name: string
  lat: number
  lng: number
  estimatedArrival: string // actual time like "4:15 PM"
  actualArrival?: string
  status: 'on-time' | 'delayed' | 'early' | 'cancelled'
}

export interface BusRoute {
  id: string
  name: string
  description: string
  stops: RouteStop[]
  duration: number
  frequency: number
  fare: number
  buses: number
  status: 'active' | 'maintenance' | 'suspended'
  lastUpdated: Date
  delays: number // minutes
  passengerLoad: 'low' | 'medium' | 'high'
  currentBusPosition?: {
    lat: number
    lng: number
    nextStopId: string
    estimatedArrival: string
  }
}

export interface ScheduleUpdate {
  routeId: string
  type: 'delay' | 'cancellation' | 'route_change' | 'fare_change'
  message: string
  severity: 'low' | 'medium' | 'high'
  timestamp: Date
  duration?: number // how long this update is valid
}

// Real-time route data simulation
export class RouteSimulator {
  private routes: BusRoute[] = []
  private updates: ScheduleUpdate[] = []
  private subscribers: Function[] = []

  constructor() {
    this.initializeRoutes()
    this.startSimulation()
  }

  private initializeRoutes() {
    this.routes = [
      {
        id: 'route-1',
        name: 'Route 1',
        description: 'Connaught Place - Cyber City',
        stops: [
          { id: 'stop-1', name: 'Connaught Place', lat: 28.6315, lng: 77.2167, estimatedArrival: addMinutesToCurrentTime(0), status: 'on-time' },
          { id: 'stop-2', name: 'India Gate', lat: 28.6129, lng: 77.2295, estimatedArrival: addMinutesToCurrentTime(8), status: 'on-time' },
          { id: 'stop-3', name: 'AIIMS Delhi', lat: 28.5672, lng: 77.2100, estimatedArrival: addMinutesToCurrentTime(18), status: 'on-time' },
          { id: 'stop-4', name: 'Cyber City Gurugram', lat: 28.4950, lng: 77.0890, estimatedArrival: addMinutesToCurrentTime(28), status: 'on-time' }
        ],
        duration: 45,
        frequency: 15,
        fare: 25,
        buses: 3,
        status: 'active',
        lastUpdated: new Date(),
        delays: 0,
        passengerLoad: 'medium',
        currentBusPosition: {
          lat: 28.6200,
          lng: 77.2100,
          nextStopId: 'stop-3',
          estimatedArrival: addMinutesToCurrentTime(5)
        }
      },
      {
        id: 'route-2',
        name: 'Route 2',
        description: 'Rajiv Chowk Metro - IGI Airport',
        stops: [
          { id: 'stop-5', name: 'Rajiv Chowk Metro', lat: 28.6328, lng: 77.2197, estimatedArrival: addMinutesToCurrentTime(0), status: 'on-time' },
          { id: 'stop-6', name: 'New Delhi Railway Station', lat: 28.6434, lng: 77.2199, estimatedArrival: addMinutesToCurrentTime(12), status: 'on-time' },
          { id: 'stop-7', name: 'Select City Walk Mall', lat: 28.5244, lng: 77.2066, estimatedArrival: addMinutesToCurrentTime(25), status: 'on-time' },
          { id: 'stop-8', name: 'IGI Airport Terminal 3', lat: 28.5665, lng: 77.1031, estimatedArrival: addMinutesToCurrentTime(40), status: 'on-time' }
        ],
        duration: 60,
        frequency: 20,
        fare: 35,
        buses: 2,
        status: 'active',
        lastUpdated: new Date(),
        delays: 0,
        passengerLoad: 'high',
        currentBusPosition: {
          lat: 28.6380,
          lng: 77.2200,
          nextStopId: 'stop-6',
          estimatedArrival: addMinutesToCurrentTime(3)
        }
      },
      {
        id: 'route-3',
        name: 'Route 3',
        description: 'Delhi University - DLF Mall',
        stops: [
          { id: 'stop-9', name: 'Delhi University North Campus', lat: 28.6967, lng: 77.2167, estimatedArrival: addMinutesToCurrentTime(0), status: 'on-time' },
          { id: 'stop-10', name: 'Karol Bagh Metro', lat: 28.6514, lng: 77.1906, estimatedArrival: addMinutesToCurrentTime(6), status: 'on-time' },
          { id: 'stop-11', name: 'Safdarjung Hospital', lat: 28.5730, lng: 77.2062, estimatedArrival: addMinutesToCurrentTime(15), status: 'on-time' },
          { id: 'stop-12', name: 'DLF Mall of India', lat: 28.6967, lng: 77.1458, estimatedArrival: addMinutesToCurrentTime(25), status: 'on-time' }
        ],
        duration: 35,
        frequency: 10,
        fare: 20,
        buses: 4,
        status: 'active',
        lastUpdated: new Date(),
        delays: 0,
        passengerLoad: 'low'
      },
      {
        id: 'route-4',
        name: 'Route 4',
        description: 'Lajpat Nagar - Golf Course Road',
        stops: [
          { id: 'stop-13', name: 'Lajpat Nagar Central Market', lat: 28.5677, lng: 77.2436, estimatedArrival: addMinutesToCurrentTime(0), status: 'on-time' },
          { id: 'stop-14', name: 'Nehru Place Metro', lat: 28.5494, lng: 77.2519, estimatedArrival: addMinutesToCurrentTime(10), status: 'on-time' },
          { id: 'stop-15', name: 'Saket Metro Station', lat: 28.5200, lng: 77.2066, estimatedArrival: addMinutesToCurrentTime(20), status: 'on-time' },
          { id: 'stop-16', name: 'Golf Course Road Gurugram', lat: 28.4595, lng: 77.0266, estimatedArrival: addMinutesToCurrentTime(35), status: 'on-time' }
        ],
        duration: 50,
        frequency: 25,
        fare: 30,
        buses: 2,
        status: 'maintenance',
        lastUpdated: new Date(),
        delays: 0,
        passengerLoad: 'medium'
      }
    ]
  }

  private startSimulation() {
    // Update routes every 30 seconds
    setInterval(() => {
      this.updateRoutes()
      this.generateScheduleUpdates()
      this.notifySubscribers()
    }, 30000)

    // Update stops every 10 seconds
    setInterval(() => {
      this.updateStopTimes()
      this.notifySubscribers()
    }, 10000)
  }

  private updateRoutes() {
    this.routes.forEach(route => {
      // Simulate random delays
      const delayChance = Math.random()
      if (delayChance < 0.3) { // 30% chance of delay
        route.delays = Math.floor(Math.random() * 15) + 1 // 1-15 minutes
        route.status = 'active'
      } else if (delayChance < 0.35) { // 5% chance of maintenance
        route.status = 'maintenance'
        route.delays = 0
      } else {
        route.delays = 0
        route.status = 'active'
      }

      // Update passenger load based on time of day
      const hour = new Date().getHours()
      if (hour >= 7 && hour <= 9 || hour >= 17 && hour <= 19) {
        route.passengerLoad = 'high'
      } else if (hour >= 10 && hour <= 16) {
        route.passengerLoad = 'medium'
      } else {
        route.passengerLoad = 'low'
      }

      route.lastUpdated = new Date()
    })
  }

  private updateStopTimes() {
    this.routes.forEach(route => {
      route.stops.forEach((stop, index) => {
        if (index === 0) {
          stop.estimatedArrival = 0
        } else {
          const baseTime = index * (route.duration / route.stops.length)
          const delay = route.delays
          stop.estimatedArrival = Math.max(0, baseTime + delay)
          
          // Update status based on delay
          if (delay > 10) {
            stop.status = 'delayed'
          } else if (delay < -2) {
            stop.status = 'early'
          } else {
            stop.status = 'on-time'
          }
        }
      })
    })
  }

  private generateScheduleUpdates() {
    const updateTypes = ['delay', 'cancellation', 'route_change', 'fare_change']
    const severities = ['low', 'medium', 'high']
    
    // 20% chance of generating a new update
    if (Math.random() < 0.2) {
      const route = this.routes[Math.floor(Math.random() * this.routes.length)]
      const type = updateTypes[Math.floor(Math.random() * updateTypes.length)]
      const severity = severities[Math.floor(Math.random() * severities.length)]
      
      const messages = {
        delay: `Route ${route.name} experiencing ${route.delays} minute delays due to traffic`,
        cancellation: `Route ${route.name} temporarily suspended due to maintenance`,
        route_change: `Route ${route.name} temporarily skipping some stops`,
        fare_change: `New fare structure effective for Route ${route.name}`
      }
      
      const update: ScheduleUpdate = {
        routeId: route.id,
        type: type as any,
        message: messages[type as keyof typeof messages],
        severity: severity as any,
        timestamp: new Date(),
        duration: Math.floor(Math.random() * 120) + 30 // 30-150 minutes
      }
      
      this.updates.unshift(update)
      
      // Keep only last 20 updates
      if (this.updates.length > 20) {
        this.updates = this.updates.slice(0, 20)
      }
    }
  }

  // Public methods
  getRoutes(): BusRoute[] {
    return this.routes
  }

  getRoute(id: string): BusRoute | undefined {
    return this.routes.find(route => route.id === id)
  }

  getUpdates(): ScheduleUpdate[] {
    return this.updates
  }

  getActiveUpdates(): ScheduleUpdate[] {
    const now = new Date()
    return this.updates.filter(update => {
      if (!update.duration) return true
      const expiryTime = new Date(update.timestamp.getTime() + update.duration * 60000)
      return now < expiryTime
    })
  }

  subscribe(callback: Function) {
    this.subscribers.push(callback)
    return () => {
      this.subscribers = this.subscribers.filter(sub => sub !== callback)
    }
  }

  private notifySubscribers() {
    this.subscribers.forEach(callback => {
      callback({
        routes: this.routes,
        updates: this.getActiveUpdates()
      })
    })
  }

  // Manual methods for testing
  addDelay(routeId: string, minutes: number) {
    const route = this.routes.find(r => r.id === routeId)
    if (route) {
      route.delays = minutes
      route.lastUpdated = new Date()
      this.notifySubscribers()
    }
  }

  suspendRoute(routeId: string) {
    const route = this.routes.find(r => r.id === routeId)
    if (route) {
      route.status = 'suspended'
      route.lastUpdated = new Date()
      this.notifySubscribers()
    }
  }

  updateFare(routeId: string, newFare: number) {
    const route = this.routes.find(r => r.id === routeId)
    if (route) {
      route.fare = newFare
      route.lastUpdated = new Date()
      this.notifySubscribers()
    }
  }
}

// Export singleton instance
export const routeSimulator = new RouteSimulator()
