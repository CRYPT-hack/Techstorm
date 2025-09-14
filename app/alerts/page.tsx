"use client"

import { useState, useEffect } from "react"
import { Navigation } from "@/components/navigation"
import { useLanguage } from "@/lib/language-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { AlertTriangle, Info, CheckCircle, Clock, Bell, Filter, RefreshCw } from "lucide-react"

export default function AlertsPage() {
  const { t } = useLanguage()
  const [filterPriority, setFilterPriority] = useState<string | null>(null)
  const [filterType, setFilterType] = useState<string | null>(null)
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date())

  // Auto-refresh alerts every 20 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setLastUpdated(new Date())
    }, 20000)

    return () => clearInterval(interval)
  }, [])

  const alerts = [
    {
      id: 1,
      title: "Route 4 Temporarily Suspended",
      description: "Route 4 (Lajpat Nagar - Golf Course Road) is temporarily suspended due to road construction. Expected to resume by 5:00 PM today.",
      type: "warning",
      priority: "high",
      timestamp: "2 hours ago",
      affectedRoutes: ["Route 4"],
      status: "active"
    },
    {
      id: 2,
      title: "Delays on Route 1",
      description: "Heavy traffic on Connaught Place - Cyber City route causing 15-20 minute delays. Please plan accordingly.",
      type: "info",
      priority: "medium",
      timestamp: "1 hour ago",
      affectedRoutes: ["Route 1"],
      status: "active"
    },
    {
      id: 3,
      title: "New Bus Added to Route 3",
      description: "An additional bus has been added to Route 3 (Delhi University - DLF Mall) to improve frequency during peak hours.",
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
      description: "Scheduled maintenance on Route 2 (Rajiv Chowk Metro - IGI Airport) buses has been completed. All buses are now operational.",
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

  // Filter alerts based on priority and type
  const filteredAlerts = alerts.filter(alert => {
    const priorityMatch = !filterPriority || alert.priority === filterPriority
    const typeMatch = !filterType || alert.type === filterType
    return priorityMatch && typeMatch
  })

  const activeAlerts = filteredAlerts.filter(alert => alert.status === 'active')
  const resolvedAlerts = filteredAlerts.filter(alert => alert.status === 'resolved')

  // Handler functions for clickable sections
  const handlePriorityFilter = (priority: string) => {
    setFilterPriority(filterPriority === priority ? null : priority)
    setFilterType(null) // Clear type filter when priority is selected
  }

  const handleTypeFilter = (type: string) => {
    setFilterType(filterType === type ? null : type)
    setFilterPriority(null) // Clear priority filter when type is selected
  }

  const handleSubscribeToAlerts = () => {
    // Scroll to active alerts section
    document.querySelector('.lg\\:col-span-3')?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleFilterByRoute = () => {
    // Clear all filters and show all alerts
    setFilterPriority(null)
    setFilterType(null)
    // Scroll to alerts section
    document.querySelector('.lg\\:col-span-3')?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleViewHistory = () => {
    // Scroll to resolved alerts section
    const resolvedSection = document.querySelector('.mt-8')
    if (resolvedSection) {
      resolvedSection.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const clearAllFilters = () => {
    setFilterPriority(null)
    setFilterType(null)
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-balance mb-2">
                {t('alerts.title')}
              </h1>
              <p className="text-muted-foreground text-pretty">
                {t('alerts.subtitle')}
              </p>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <RefreshCw className="h-4 w-4 animate-spin" />
              <span>Auto-refresh</span>
              <span>• Last updated: {lastUpdated.toLocaleTimeString()}</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">{t('alerts.activeAlerts')}</h2>
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                <Badge variant="outline">{activeAlerts.length} {t('alerts.active')}</Badge>
                {(filterPriority || filterType) && (
                  <Button variant="ghost" size="sm" onClick={clearAllFilters}>
                    Clear Filters
                  </Button>
                )}
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
                      <span className="text-sm font-medium">{t('alerts.affectedRoutes')}:</span>
                      <div className="flex gap-1">
                        {alert.affectedRoutes.map((route, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {route}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      {t('alerts.getUpdates')}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}

            <div className="mt-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">{t('alerts.resolvedAlerts')}</h2>
                <Badge variant="outline">{resolvedAlerts.length} {t('alerts.resolved')}</Badge>
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
                          {t('alerts.resolved')}
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
                  {t('alerts.alertSummary')}
                </CardTitle>
                <CardDescription>{t('alerts.currentStatus')}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">{t('alerts.activeAlerts')}</span>
                  <Badge variant="outline" className="text-orange-600">{activeAlerts.length}</Badge>
                </div>
                <div 
                  className="flex items-center justify-between cursor-pointer hover:bg-red-50 p-2 rounded transition-colors"
                  onClick={() => handlePriorityFilter('high')}
                >
                  <span className="text-sm">{t('alerts.highPriority')}</span>
                  <Badge variant="outline" className={`text-red-600 ${filterPriority === 'high' ? 'bg-red-100' : ''}`}>
                    {alerts.filter(a => a.priority === 'high' && a.status === 'active').length}
                  </Badge>
                </div>
                <div 
                  className="flex items-center justify-between cursor-pointer hover:bg-yellow-50 p-2 rounded transition-colors"
                  onClick={() => handlePriorityFilter('medium')}
                >
                  <span className="text-sm">{t('alerts.mediumPriority')}</span>
                  <Badge variant="outline" className={`text-yellow-600 ${filterPriority === 'medium' ? 'bg-yellow-100' : ''}`}>
                    {alerts.filter(a => a.priority === 'medium' && a.status === 'active').length}
                  </Badge>
                </div>
                <div 
                  className="flex items-center justify-between cursor-pointer hover:bg-green-50 p-2 rounded transition-colors"
                  onClick={() => handlePriorityFilter('low')}
                >
                  <span className="text-sm">{t('alerts.lowPriority')}</span>
                  <Badge variant="outline" className={`text-green-600 ${filterPriority === 'low' ? 'bg-green-100' : ''}`}>
                    {alerts.filter(a => a.priority === 'low' && a.status === 'active').length}
                  </Badge>
                </div>
                <div 
                  className="flex items-center justify-between cursor-pointer hover:bg-blue-50 p-2 rounded transition-colors"
                  onClick={handleViewHistory}
                >
                  <span className="text-sm">{t('alerts.resolvedToday')}</span>
                  <Badge variant="outline" className="text-blue-600">
                    {resolvedAlerts.length}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>{t('alerts.quickActions')}</CardTitle>
                <CardDescription>{t('alerts.manageAlerts')}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  variant="outline" 
                  className="w-full justify-start hover:bg-blue-50 hover:border-blue-300 transition-colors"
                  onClick={handleSubscribeToAlerts}
                >
                  <Bell className="h-4 w-4 mr-2" />
                  {t('alerts.subscribeToAlerts')}
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start hover:bg-green-50 hover:border-green-300 transition-colors"
                  onClick={handleFilterByRoute}
                >
                  <Filter className="h-4 w-4 mr-2" />
                  {t('alerts.filterByRoute')}
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start hover:bg-purple-50 hover:border-purple-300 transition-colors"
                  onClick={handleViewHistory}
                >
                  <Clock className="h-4 w-4 mr-2" />
                  {t('alerts.viewHistory')}
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>{t('alerts.alertTypes')}</CardTitle>
                <CardDescription>{t('alerts.alertTypesDesc')}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div 
                  className="flex items-center gap-2 cursor-pointer hover:bg-orange-50 p-2 rounded transition-colors"
                  onClick={() => handleTypeFilter('warning')}
                >
                  <AlertTriangle className="h-4 w-4 text-orange-500" />
                  <div className="flex-1">
                    <div className={`text-sm font-medium ${filterType === 'warning' ? 'text-orange-700' : ''}`}>{t('alerts.warning')}</div>
                    <div className="text-xs text-gray-600">{t('alerts.warningDesc')}</div>
                  </div>
                  {filterType === 'warning' && (
                    <Badge variant="outline" className="text-orange-600 bg-orange-100">Active</Badge>
                  )}
                </div>
                <div 
                  className="flex items-center gap-2 cursor-pointer hover:bg-blue-50 p-2 rounded transition-colors"
                  onClick={() => handleTypeFilter('info')}
                >
                  <Info className="h-4 w-4 text-blue-500" />
                  <div className="flex-1">
                    <div className={`text-sm font-medium ${filterType === 'info' ? 'text-blue-700' : ''}`}>{t('alerts.information')}</div>
                    <div className="text-xs text-gray-600">{t('alerts.informationDesc')}</div>
                  </div>
                  {filterType === 'info' && (
                    <Badge variant="outline" className="text-blue-600 bg-blue-100">Active</Badge>
                  )}
                </div>
                <div 
                  className="flex items-center gap-2 cursor-pointer hover:bg-green-50 p-2 rounded transition-colors"
                  onClick={() => handleTypeFilter('success')}
                >
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <div className="flex-1">
                    <div className={`text-sm font-medium ${filterType === 'success' ? 'text-green-700' : ''}`}>{t('alerts.success')}</div>
                    <div className="text-xs text-gray-600">{t('alerts.successDesc')}</div>
                  </div>
                  {filterType === 'success' && (
                    <Badge variant="outline" className="text-green-600 bg-green-100">Active</Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
