// Real-time route and schedule simulation (No GPS needed)
export interface RouteStop {
  id: string
  name: string
  lat: number
  lng: number
  estimatedArrival: number // minutes from now
  actualArrival?: number
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
        description: 'Central Market - Tech Park',
        stops: [
          { id: 'stop-1', name: 'Central Market', lat: 28.6139, lng: 77.2090, estimatedArrival: 0, status: 'on-time' },
          { id: 'stop-2', name: 'City Center', lat: 28.6140, lng: 77.2095, estimatedArrival: 8, status: 'on-time' },
          { id: 'stop-3', name: 'Business District', lat: 28.6145, lng: 77.2100, estimatedArrival: 18, status: 'on-time' },
          { id: 'stop-4', name: 'Tech Park', lat: 28.6150, lng: 77.2105, estimatedArrival: 28, status: 'on-time' }
        ],
        duration: 45,
        frequency: 15,
        fare: 25,
        buses: 3,
        status: 'active',
        lastUpdated: new Date(),
        delays: 0,
        passengerLoad: 'medium'
      },
      {
        id: 'route-2',
        name: 'Route 2',
        description: 'Metro Station - Airport',
        stops: [
          { id: 'stop-5', name: 'Metro Station', lat: 28.6135, lng: 77.2085, estimatedArrival: 0, status: 'on-time' },
          { id: 'stop-6', name: 'Railway Station', lat: 28.6140, lng: 77.2090, estimatedArrival: 12, status: 'on-time' },
          { id: 'stop-7', name: 'Shopping Mall', lat: 28.6145, lng: 77.2095, estimatedArrival: 25, status: 'on-time' },
          { id: 'stop-8', name: 'Airport', lat: 28.6150, lng: 77.2100, estimatedArrival: 40, status: 'on-time' }
        ],
        duration: 60,
        frequency: 20,
        fare: 35,
        buses: 2,
        status: 'active',
        lastUpdated: new Date(),
        delays: 0,
        passengerLoad: 'high'
      },
      {
        id: 'route-3',
        name: 'Route 3',
        description: 'University - Mall',
        stops: [
          { id: 'stop-9', name: 'University', lat: 28.6130, lng: 77.2080, estimatedArrival: 0, status: 'on-time' },
          { id: 'stop-10', name: 'Library', lat: 28.6135, lng: 77.2085, estimatedArrival: 6, status: 'on-time' },
          { id: 'stop-11', name: 'Hospital', lat: 28.6140, lng: 77.2090, estimatedArrival: 15, status: 'on-time' },
          { id: 'stop-12', name: 'Mall', lat: 28.6145, lng: 77.2095, estimatedArrival: 25, status: 'on-time' }
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
        description: 'Residential Area - Office Complex',
        stops: [
          { id: 'stop-13', name: 'Residential Area', lat: 28.6125, lng: 77.2075, estimatedArrival: 0, status: 'on-time' },
          { id: 'stop-14', name: 'School', lat: 28.6130, lng: 77.2080, estimatedArrival: 10, status: 'on-time' },
          { id: 'stop-15', name: 'Market', lat: 28.6135, lng: 77.2085, estimatedArrival: 20, status: 'on-time' },
          { id: 'stop-16', name: 'Office Complex', lat: 28.6140, lng: 77.2090, estimatedArrival: 35, status: 'on-time' }
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
