"use client"

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useRoutes } from '@/lib/route-context'
import { Clock, AlertTriangle, CheckCircle } from 'lucide-react'

export function RealTimeDemo() {
  const { routes, updates, addDelay, suspendRoute, updateFare } = useRoutes()
  const [selectedRoute, setSelectedRoute] = useState('route-1')

  const handleAddDelay = () => {
    const delay = Math.floor(Math.random() * 20) + 5 // 5-25 minutes
    addDelay(selectedRoute, delay)
  }

  const handleSuspendRoute = () => {
    suspendRoute(selectedRoute)
  }

  const handleUpdateFare = () => {
    const newFare = Math.floor(Math.random() * 20) + 20 // ₹20-40
    updateFare(selectedRoute, newFare)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Real-Time Demo Controls
        </CardTitle>
        <CardDescription>
          Test real-time updates by simulating events
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="text-sm font-medium mb-2 block">Select Route:</label>
          <select 
            value={selectedRoute} 
            onChange={(e) => setSelectedRoute(e.target.value)}
            className="w-full p-2 border rounded-lg"
          >
            {routes.map(route => (
              <option key={route.id} value={route.id}>
                {route.name} - {route.description}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 gap-2">
          <Button onClick={handleAddDelay} variant="outline" className="justify-start">
            <AlertTriangle className="h-4 w-4 mr-2" />
            Add Random Delay (5-25 min)
          </Button>
          <Button onClick={handleSuspendRoute} variant="outline" className="justify-start">
            <AlertTriangle className="h-4 w-4 mr-2" />
            Suspend Route
          </Button>
          <Button onClick={handleUpdateFare} variant="outline" className="justify-start">
            <CheckCircle className="h-4 w-4 mr-2" />
            Update Fare (₹20-40)
          </Button>
        </div>

        <div className="pt-4 border-t">
          <h4 className="font-medium mb-2">Live Updates:</h4>
          <div className="space-y-2">
            {updates.slice(0, 3).map((update, index) => (
              <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 rounded text-sm">
                <div className={`w-2 h-2 rounded-full ${
                  update.severity === 'high' ? 'bg-red-500' :
                  update.severity === 'medium' ? 'bg-yellow-500' :
                  'bg-green-500'
                }`} />
                <span className="flex-1">{update.message}</span>
                <Badge variant="outline" className="text-xs">
                  {update.severity}
                </Badge>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
