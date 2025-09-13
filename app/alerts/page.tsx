"use client"

import { Navigation } from "@/components/navigation"
import { useLanguage } from "@/lib/language-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { AlertTriangle, Info, CheckCircle, Clock, Bell, Filter } from "lucide-react"

export default function AlertsPage() {
  const { t } = useLanguage()

  const alerts = [
    {
      id: 1,
      title: "Route 4 Temporarily Suspended",
      description: "Route 4 (Residential Area - Office Complex) is temporarily suspended due to road construction. Expected to resume by 5:00 PM today.",
      type: "warning",
      priority: "high",
      timestamp: "2 hours ago",
      affectedRoutes: ["Route 4"],
      status: "active"
    },
    {
      id: 2,
      title: "Delays on Route 1",
      description: "Heavy traffic on Central Market - Tech Park route causing 15-20 minute delays. Please plan accordingly.",
      type: "info",
      priority: "medium",
      timestamp: "1 hour ago",
      affectedRoutes: ["Route 1"],
      status: "active"
    },
    {
      id: 3,
      title: "New Bus Added to Route 3",
      description: "An additional bus has been added to Route 3 (University - Mall) to improve frequency during peak hours.",
      type: "success",
      priority: "low",
      timestamp: "3 hours ago",
      affectedRoutes: ["Route 3"],
      status: "active"
    },
    {
      id: 4,
      title: "Fare Update Effective Tomorrow",
      description: "New fare structure will be effective from tomorrow. Route 1: ₹25, Route 2: ₹35, Route 3: ₹20, Route 4: ₹30.",
      type: "info",
      priority: "medium",
      timestamp: "5 hours ago",
      affectedRoutes: ["All Routes"],
      status: "active"
    },
    {
      id: 5,
      title: "Route 2 Maintenance Complete",
      description: "Scheduled maintenance on Route 2 buses has been completed. All buses are now operational.",
      type: "success",
      priority: "low",
      timestamp: "1 day ago",
      affectedRoutes: ["Route 2"],
      status: "resolved"
    },
    {
      id: 6,
      title: "Weather Advisory",
      description: "Heavy rain expected in the evening. Bus services may experience delays. Please check for updates.",
      type: "warning",
      priority: "medium",
      timestamp: "2 days ago",
      affectedRoutes: ["All Routes"],
      status: "resolved"
    }
  ]

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-orange-500" />
      case 'info':
        return <Info className="h-5 w-5 text-blue-500" />
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500" />
      default:
        return <Info className="h-5 w-5 text-gray-500" />
    }
  }

  const getAlertColor = (type: string) => {
    switch (type) {
      case 'warning':
        return 'border-orange-200 bg-orange-50'
      case 'info':
        return 'border-blue-200 bg-blue-50'
      case 'success':
        return 'border-green-200 bg-green-50'
      default:
        return 'border-gray-200 bg-gray-50'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800'
      case 'medium':
        return 'bg-yellow-100 text-yellow-800'
      case 'low':
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const activeAlerts = alerts.filter(alert => alert.status === 'active')
  const resolvedAlerts = alerts.filter(alert => alert.status === 'resolved')

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-balance mb-2">
            Service Alerts & Notifications
          </h1>
          <p className="text-muted-foreground text-pretty">
            Stay updated with the latest service alerts, delays, and important announcements.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Active Alerts</h2>
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                <Badge variant="outline">{activeAlerts.length} active</Badge>
              </div>
            </div>

            {activeAlerts.map((alert) => (
              <Card key={alert.id} className={`border-l-4 ${getAlertColor(alert.type)}`}>
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      {getAlertIcon(alert.type)}
                      <div>
                        <CardTitle className="text-lg">{alert.title}</CardTitle>
                        <CardDescription className="mt-1">{alert.description}</CardDescription>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <Badge className={getPriorityColor(alert.priority)}>
                        {alert.priority}
                      </Badge>
                      <span className="text-xs text-gray-500">{alert.timestamp}</span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">Affected Routes:</span>
                      <div className="flex gap-1">
                        {alert.affectedRoutes.map((route, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {route}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      Get Updates
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}

            <div className="mt-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Resolved Alerts</h2>
                <Badge variant="outline">{resolvedAlerts.length} resolved</Badge>
              </div>

              {resolvedAlerts.map((alert) => (
                <Card key={alert.id} className="opacity-75 border-l-4 border-gray-300">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-green-500" />
                        <div>
                          <CardTitle className="text-lg">{alert.title}</CardTitle>
                          <CardDescription className="mt-1">{alert.description}</CardDescription>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <Badge variant="outline" className="text-green-600">
                          Resolved
                        </Badge>
                        <span className="text-xs text-gray-500">{alert.timestamp}</span>
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  Alert Summary
                </CardTitle>
                <CardDescription>Current alert status</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Active Alerts</span>
                  <Badge variant="outline" className="text-orange-600">{activeAlerts.length}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">High Priority</span>
                  <Badge variant="outline" className="text-red-600">
                    {alerts.filter(a => a.priority === 'high' && a.status === 'active').length}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Medium Priority</span>
                  <Badge variant="outline" className="text-yellow-600">
                    {alerts.filter(a => a.priority === 'medium' && a.status === 'active').length}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Low Priority</span>
                  <Badge variant="outline" className="text-green-600">
                    {alerts.filter(a => a.priority === 'low' && a.status === 'active').length}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Resolved Today</span>
                  <Badge variant="outline" className="text-blue-600">
                    {resolvedAlerts.length}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Manage your alerts</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  <Bell className="h-4 w-4 mr-2" />
                  Subscribe to Alerts
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter by Route
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Clock className="h-4 w-4 mr-2" />
                  View History
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Alert Types</CardTitle>
                <CardDescription>Understanding alert categories</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-orange-500" />
                  <div>
                    <div className="text-sm font-medium">Warning</div>
                    <div className="text-xs text-gray-600">Service disruptions</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Info className="h-4 w-4 text-blue-500" />
                  <div>
                    <div className="text-sm font-medium">Information</div>
                    <div className="text-xs text-gray-600">General updates</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <div>
                    <div className="text-sm font-medium">Success</div>
                    <div className="text-xs text-gray-600">Service improvements</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
