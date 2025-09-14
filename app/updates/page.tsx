"use client"

import { Navigation } from "@/components/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { SafeImage } from "@/components/ui/safe-image"
import { useLanguage } from "@/lib/language-context"
import { Calendar, Tag, ArrowRight, Zap, Bug, Plus, Wrench } from "lucide-react"

const updates = [
  {
    id: 1,
    title: "Real-Time GPS Tracking Now Live",
    date: "2024-01-28",
    type: "feature",
    category: "Major Release",
    description:
      "We're excited to announce that real-time GPS tracking is now fully operational across all bus routes. Track your bus with pinpoint accuracy and get precise ETAs.",
    highlights: [
      "Live GPS tracking for all buses",
      "Accurate ETA calculations",
      "Interactive map with bus locations",
      "10-second update intervals",
    ],
    image: "/gps-tracking-interface-on-mobile-device.jpg",
  },
  {
    id: 2,
    title: "Mobile App Performance Improvements",
    date: "2024-01-25",
    type: "improvement",
    category: "Performance",
    description:
      "Significant performance optimizations have been implemented to make the app faster and more responsive, especially on slower internet connections.",
    highlights: [
      "50% faster page load times",
      "Improved offline caching",
      "Better performance on 3G networks",
      "Reduced data usage by 30%",
    ],
  },
  {
    id: 3,
    title: "New Route Added: Airport Express",
    date: "2024-01-22",
    type: "feature",
    category: "Route Expansion",
    description:
      "Introducing the new Airport Express route connecting downtown to the airport with limited stops for faster travel times.",
    highlights: [
      "Direct airport connection",
      "Express service with limited stops",
      "30-minute travel time",
      "Operates 5 AM to 11 PM daily",
    ],
    image: "/modern-bus-at-airport-terminal.jpg",
  },
  {
    id: 4,
    title: "Bug Fixes and Stability Improvements",
    date: "2024-01-20",
    type: "bugfix",
    category: "Maintenance",
    description: "This update addresses several reported issues and improves overall system stability and reliability.",
    highlights: [
      "Fixed map loading issues on Safari",
      "Resolved ETA calculation errors",
      "Improved error handling",
      "Better support for older devices",
    ],
  },
  {
    id: 5,
    title: "Dark Mode Support",
    date: "2024-01-18",
    type: "feature",
    category: "UI/UX",
    description:
      "SmartTransit now supports dark mode! Switch between light and dark themes using the toggle in the top navigation bar.",
    highlights: [
      "Full dark mode support",
      "Automatic system theme detection",
      "Improved readability in low light",
      "Consistent theming across all pages",
    ],
    image: "/dark-mode-interface-of-transit-app.jpg",
  },
  {
    id: 6,
    title: "Enhanced Admin Dashboard",
    date: "2024-01-15",
    type: "feature",
    category: "Admin Tools",
    description:
      "Transit authorities now have access to comprehensive analytics and management tools through our enhanced admin dashboard.",
    highlights: [
      "Real-time fleet monitoring",
      "Performance analytics",
      "Route optimization insights",
      "Maintenance scheduling tools",
    ],
  },
]

const getTypeIcon = (type: string) => {
  switch (type) {
    case "feature":
      return Plus
    case "improvement":
      return Zap
    case "bugfix":
      return Bug
    default:
      return Wrench
  }
}

const getTypeColor = (type: string) => {
  switch (type) {
    case "feature":
      return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
    case "improvement":
      return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400"
    case "bugfix":
      return "bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400"
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400"
  }
}

export default function UpdatesPage() {
  const { t } = useLanguage()
  
  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-balance mb-6">
            {t('updates.title')}
          </h1>
          <p className="text-xl text-muted-foreground text-pretty max-w-2xl mx-auto">
            {t('updates.subtitle')}
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-12">
            <Card className="text-center">
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-primary mb-1">
                  {updates.filter((u) => u.type === "feature").length}
                </div>
                <div className="text-sm text-muted-foreground">{t('updates.stats.newFeatures')}</div>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-primary mb-1">
                  {updates.filter((u) => u.type === "improvement").length}
                </div>
                <div className="text-sm text-muted-foreground">{t('updates.stats.improvements')}</div>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-primary mb-1">
                  {updates.filter((u) => u.type === "bugfix").length}
                </div>
                <div className="text-sm text-muted-foreground">{t('updates.stats.bugFixes')}</div>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-primary mb-1">{updates.length}</div>
                <div className="text-sm text-muted-foreground">{t('updates.stats.totalUpdates')}</div>
              </CardContent>
            </Card>
          </div>

          {/* Updates Timeline */}
          <div className="space-y-8">
            {updates.map((update, index) => {
              const TypeIcon = getTypeIcon(update.type)
              return (
                <Card key={update.id} className="overflow-hidden">
                  <CardContent className="p-0">
                    <div className="flex flex-col lg:flex-row">
                      {/* Image */}
                      {update.image && (
                        <div className="lg:w-1/3">
                          <SafeImage
                            src={update.image || "/placeholder.svg"}
                            alt={update.title}
                            className="w-full h-48 lg:h-full object-cover"
                          />
                        </div>
                      )}

                      {/* Content */}
                      <div className={`p-6 ${update.image ? "lg:w-2/3" : "w-full"}`}>
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                              <TypeIcon className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                              <h2 className="text-xl font-bold text-balance">{update.title}</h2>
                              <div className="flex items-center gap-2 mt-1">
                                <Calendar className="h-4 w-4 text-muted-foreground" />
                                <span className="text-sm text-muted-foreground">
                                  {new Date(update.date).toLocaleDateString("en-US", {
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                  })}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Badge className={getTypeColor(update.type)}>{update.type}</Badge>
                            <Badge variant="outline">{update.category}</Badge>
                          </div>
                        </div>

                        <p className="text-muted-foreground mb-4 leading-relaxed">{update.description}</p>

                        {/* Highlights */}
                        <div className="space-y-2">
                          <h4 className="font-semibold flex items-center gap-2">
                            <Tag className="h-4 w-4" />
                            Key Highlights:
                          </h4>
                          <ul className="space-y-1">
                            {update.highlights.map((highlight, idx) => (
                              <li key={idx} className="flex items-center gap-2 text-sm text-muted-foreground">
                                <ArrowRight className="h-3 w-3 text-primary" />
                                {highlight}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {/* Newsletter Signup */}
          <Card className="mt-12 text-center">
            <CardHeader>
              <CardTitle>{t('updates.newsletter.title')}</CardTitle>
              <CardDescription>{t('updates.newsletter.description')}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="max-w-md mx-auto">
                <div className="flex gap-2">
                  <input
                    type="email"
                    placeholder={t('updates.newsletter.placeholder')}
                    className="flex-1 px-3 py-2 border border-input bg-background rounded-md text-sm"
                  />
                  <button className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90 transition-colors">
                    {t('updates.newsletter.subscribe')}
                  </button>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  {t('updates.newsletter.disclaimer')}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
