"use client"

import { Navigation } from "@/components/navigation"
import { useLanguage } from "@/lib/language-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Clock, Users, Route } from "lucide-react"

export default function TrackingPage() {
  const { t } = useLanguage()

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-balance mb-2">
            Live Bus Tracking
          </h1>
          <p className="text-muted-foreground text-pretty">
            Real-time locations of all buses in the city. Track your bus and get live updates.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Track by Route
              </CardTitle>
              <CardDescription>
                Select a route to see all buses on that route
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <div className="font-medium">Route 1</div>
                    <div className="text-sm text-gray-600">Central Market - Tech Park</div>
                  </div>
                  <Badge variant="secondary">3 buses</Badge>
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <div className="font-medium">Route 2</div>
                    <div className="text-sm text-gray-600">Metro Station - Airport</div>
                  </div>
                  <Badge variant="secondary">2 buses</Badge>
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <div className="font-medium">Route 3</div>
                    <div className="text-sm text-gray-600">University - Mall</div>
                  </div>
                  <Badge variant="secondary">4 buses</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Recent Updates
              </CardTitle>
              <CardDescription>
                Latest bus location updates
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 border rounded-lg">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <div className="flex-1">
                    <div className="font-medium">DL-01-B-1001</div>
                    <div className="text-sm text-gray-600">Central Market • 2 min ago</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 border rounded-lg">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <div className="flex-1">
                    <div className="font-medium">DL-01-B-1002</div>
                    <div className="text-sm text-gray-600">Tech Park • 5 min ago</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 border rounded-lg">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <div className="flex-1">
                    <div className="font-medium">DL-01-B-1003</div>
                    <div className="text-sm text-gray-600">Metro Station • 8 min ago</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Bus Status
              </CardTitle>
              <CardDescription>
                Current operational status
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Total Buses</span>
                  <span className="font-medium">9</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Active Routes</span>
                  <span className="font-medium">3</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">On Time</span>
                  <Badge variant="outline" className="text-green-600">6</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Delayed</span>
                  <Badge variant="outline" className="text-red-600">2</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Out of Service</span>
                  <Badge variant="outline" className="text-gray-600">1</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Route className="h-5 w-5" />
              Quick Actions
            </CardTitle>
            <CardDescription>
              Common tracking tasks
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 border rounded-lg text-center hover:bg-gray-50 cursor-pointer">
                <MapPin className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                <div className="font-medium">Find Nearest Bus</div>
                <div className="text-sm text-gray-600">Locate buses near you</div>
              </div>
              <div className="p-4 border rounded-lg text-center hover:bg-gray-50 cursor-pointer">
                <Clock className="h-8 w-8 mx-auto mb-2 text-green-600" />
                <div className="font-medium">Check Schedule</div>
                <div className="text-sm text-gray-600">View bus timings</div>
              </div>
              <div className="p-4 border rounded-lg text-center hover:bg-gray-50 cursor-pointer">
                <Users className="h-8 w-8 mx-auto mb-2 text-purple-600" />
                <div className="font-medium">Report Issue</div>
                <div className="text-sm text-gray-600">Report bus problems</div>
              </div>
              <div className="p-4 border rounded-lg text-center hover:bg-gray-50 cursor-pointer">
                <Route className="h-8 w-8 mx-auto mb-2 text-orange-600" />
                <div className="font-medium">Plan Journey</div>
                <div className="text-sm text-gray-600">Get route suggestions</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}