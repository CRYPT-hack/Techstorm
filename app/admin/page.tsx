"use client"

import { useState, useMemo } from "react"
import { Navigation } from "@/components/navigation"
import { useRoutes } from "@/lib/route-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { BarChart3, Clock, AlertTriangle, TrendingUp, Users, MapPin, Search, Download, RefreshCw, Settings } from "lucide-react"

// Mock bus data for admin dashboard
interface BusData {
  id: string
  number: string
  driver: string
  route: string
  status: 'active' | 'maintenance' | 'offline'
  passengers: number
  capacity: number
  fuelLevel: number
  speed: number
  delay: number
  revenue: number
  tripsToday: number
  lastMaintenance: string
  mileage: number
}

const mockBusData: BusData[] = [
  {
    id: 'bus-1',
    number: 'DL-01-B-1001',
    driver: 'Rajesh Kumar',
    route: 'Route 1',
    status: 'active',
    passengers: 24,
    capacity: 50,
    fuelLevel: 85,
    speed: 25,
    delay: 0,
    revenue: 1250,
    tripsToday: 8,
    lastMaintenance: '2024-01-15',
    mileage: 45230
  },
  {
    id: 'bus-2',
    number: 'DL-01-B-1002',
    driver: 'Priya Sharma',
    route: 'Route 1',
    status: 'active',
    passengers: 38,
    capacity: 50,
    fuelLevel: 72,
    speed: 20,
    delay: 5,
    revenue: 1890,
    tripsToday: 7,
    lastMaintenance: '2024-01-20',
    mileage: 38950
  },
  {
    id: 'bus-3',
    number: 'DL-01-B-1003',
    driver: 'Amit Singh',
    route: 'Route 2',
    status: 'active',
    passengers: 12,
    capacity: 50,
    fuelLevel: 95,
    speed: 30,
    delay: 0,
    revenue: 980,
    tripsToday: 6,
    lastMaintenance: '2024-01-10',
    mileage: 52100
  },
  {
    id: 'bus-4',
    number: 'DL-01-B-1004',
    driver: 'Sunita Patel',
    route: 'Route 3',
    status: 'maintenance',
    passengers: 0,
    capacity: 50,
    fuelLevel: 45,
    speed: 0,
    delay: 0,
    revenue: 0,
    tripsToday: 0,
    lastMaintenance: '2024-01-25',
    mileage: 41800
  }
]

export default function AdminDashboard() {
  const { routes, updates, addDelay, suspendRoute, updateFare } = useRoutes()
  const [searchQuery, setSearchQuery] = useState("")
  const [filterStatus, setFilterStatus] = useState<string>("all")
  const [filterRoute, setFilterRoute] = useState<string>("all")

  // Filter buses based on search and filters
  const filteredBuses = useMemo(() => {
    return mockBusData.filter((bus) => {
      const matchesSearch =
        bus.number.toLowerCase().includes(searchQuery.toLowerCase()) ||
        bus.driver.toLowerCase().includes(searchQuery.toLowerCase()) ||
        bus.route.toLowerCase().includes(searchQuery.toLowerCase())
      
      const matchesStatus = filterStatus === "all" || bus.status === filterStatus
      const matchesRoute = filterRoute === "all" || bus.route === filterRoute
      
      return matchesSearch && matchesStatus && matchesRoute
    })
  }, [searchQuery, filterStatus, filterRoute])

  // Calculate statistics
  const totalBuses = mockBusData.length
  const activeBuses = mockBusData.filter(bus => bus.status === 'active').length
  const totalPassengers = mockBusData.reduce((sum, bus) => sum + bus.passengers, 0)
  const totalRevenue = mockBusData.reduce((sum, bus) => sum + bus.revenue, 0)
  const averageDelay = mockBusData.reduce((sum, bus) => sum + bus.delay, 0) / mockBusData.length

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800'
      case 'maintenance':
        return 'bg-yellow-100 text-yellow-800'
      case 'offline':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <div className="w-2 h-2 bg-green-500 rounded-full" />
      case 'maintenance':
        return <div className="w-2 h-2 bg-yellow-500 rounded-full" />
      case 'offline':
        return <div className="w-2 h-2 bg-red-500 rounded-full" />
      default:
        return <div className="w-2 h-2 bg-gray-500 rounded-full" />
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-balance mb-2">
            Admin Dashboard
          </h1>
          <p className="text-muted-foreground text-pretty">
            Monitor and manage your bus fleet operations in real-time.
          </p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center">
                <div className="flex-1">
                  <p className="text-sm font-medium text-muted-foreground">Total Buses</p>
                  <p className="text-2xl font-bold">{totalBuses}</p>
                </div>
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Users className="h-4 w-4 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center">
                <div className="flex-1">
                  <p className="text-sm font-medium text-muted-foreground">Active Buses</p>
                  <p className="text-2xl font-bold text-green-600">{activeBuses}</p>
                </div>
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="h-4 w-4 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center">
                <div className="flex-1">
                  <p className="text-sm font-medium text-muted-foreground">Total Passengers</p>
                  <p className="text-2xl font-bold">{totalPassengers}</p>
                </div>
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Users className="h-4 w-4 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center">
                <div className="flex-1">
                  <p className="text-sm font-medium text-muted-foreground">Today's Revenue</p>
                  <p className="text-2xl font-bold text-green-600">₹{totalRevenue.toLocaleString()}</p>
                </div>
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <BarChart3 className="h-4 w-4 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="fleet" className="space-y-6">
          <TabsList>
            <TabsTrigger value="fleet">Fleet Management</TabsTrigger>
            <TabsTrigger value="routes">Route Management</TabsTrigger>
            <TabsTrigger value="alerts">System Alerts</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="fleet" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Fleet Overview</CardTitle>
                    <CardDescription>Monitor all buses in your fleet</CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Input
                      placeholder="Search buses..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-64"
                    />
                    <Button variant="outline" size="sm">
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Refresh
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex gap-4 mb-4">
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="px-3 py-2 border rounded-lg"
                  >
                    <option value="all">All Status</option>
                    <option value="active">Active</option>
                    <option value="maintenance">Maintenance</option>
                    <option value="offline">Offline</option>
                  </select>
                  <select
                    value={filterRoute}
                    onChange={(e) => setFilterRoute(e.target.value)}
                    className="px-3 py-2 border rounded-lg"
                  >
                    <option value="all">All Routes</option>
                    {routes.map(route => (
                      <option key={route.id} value={route.name}>{route.name}</option>
                    ))}
                  </select>
                </div>

                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Bus</TableHead>
                      <TableHead>Driver</TableHead>
                      <TableHead>Route</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Passengers</TableHead>
                      <TableHead>Fuel</TableHead>
                      <TableHead>Speed</TableHead>
                      <TableHead>Delay</TableHead>
                      <TableHead>Revenue</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredBuses.map((bus) => (
                      <TableRow key={bus.id}>
                        <TableCell className="font-medium">{bus.number}</TableCell>
                        <TableCell>{bus.driver}</TableCell>
                        <TableCell>{bus.route}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {getStatusIcon(bus.status)}
                            <Badge className={getStatusColor(bus.status)}>
                              {bus.status}
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell>{bus.passengers}/{bus.capacity}</TableCell>
                        <TableCell>{bus.fuelLevel}%</TableCell>
                        <TableCell>{bus.speed} km/h</TableCell>
                        <TableCell>
                          {bus.delay > 0 ? (
                            <span className="text-red-600">+{bus.delay}min</span>
                          ) : (
                            <span className="text-green-600">On time</span>
                          )}
                        </TableCell>
                        <TableCell>₹{bus.revenue}</TableCell>
                        <TableCell>
                          <Button variant="outline" size="sm">
                            <Settings className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="routes" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Route Management</CardTitle>
                <CardDescription>Manage routes and schedules</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {routes.map((route) => (
                    <div key={route.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <h3 className="font-semibold">{route.name}</h3>
                        <p className="text-sm text-muted-foreground">{route.description}</p>
                        <div className="flex items-center gap-4 mt-2 text-sm">
                          <span>Fare: ₹{route.fare}</span>
                          <span>Frequency: {route.frequency}min</span>
                          <span>Buses: {route.buses}</span>
                          {route.delays > 0 && (
                            <span className="text-red-600">Delay: {route.delays}min</span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={getStatusColor(route.status)}>
                          {route.status}
                        </Badge>
                        <Button variant="outline" size="sm">
                          Edit
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="alerts" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>System Alerts</CardTitle>
                <CardDescription>Recent system notifications and alerts</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {updates.length > 0 ? (
                    updates.map((update, index) => (
                      <div key={index} className="flex items-start gap-3 p-3 border rounded-lg">
                        <div className={`w-2 h-2 rounded-full mt-2 ${
                          update.severity === 'high' ? 'bg-red-500' :
                          update.severity === 'medium' ? 'bg-yellow-500' :
                          'bg-green-500'
                        }`} />
                        <div className="flex-1">
                          <div className="font-medium">{update.message}</div>
                          <div className="text-sm text-muted-foreground mt-1">
                            {update.timestamp.toLocaleString()}
                          </div>
                        </div>
                        <Badge variant="outline">{update.severity}</Badge>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      No alerts at this time
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Performance Metrics</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Average Delay</span>
                    <span className="font-medium">{averageDelay.toFixed(1)} min</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Fleet Utilization</span>
                    <span className="font-medium">{((activeBuses / totalBuses) * 100).toFixed(1)}%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Total Trips Today</span>
                    <span className="font-medium">{mockBusData.reduce((sum, bus) => sum + bus.tripsToday, 0)}</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button variant="outline" className="w-full justify-start">
                    <Download className="h-4 w-4 mr-2" />
                    Export Data
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Refresh All Data
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Settings className="h-4 w-4 mr-2" />
                    System Settings
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}