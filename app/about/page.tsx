"use client"

import { Navigation } from "@/components/navigation"
import { useLanguage } from "@/lib/language-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Users, Target, Award, Clock, MapPin, Phone, Mail, Globe } from "lucide-react"

export default function AboutPage() {
  const { t, language } = useLanguage()
  
  console.log('AboutPage: Current language:', language)
  console.log('AboutPage: Testing translation for about.title:', t('about.title'))

  const stats = [
    { label: "Years of Service", value: "15+", icon: Clock },
    { label: "Active Routes", value: "4", icon: MapPin },
    { label: "Fleet Size", value: "11", icon: Users },
    { label: "Daily Passengers", value: "2,500+", icon: Users }
  ]

  const values = [
    {
      title: "Reliability",
      description: "We ensure punctual and dependable bus services for all our passengers.",
      icon: Clock
    },
    {
      title: "Safety",
      description: "Your safety is our top priority with well-maintained vehicles and trained drivers.",
      icon: Award
    },
    {
      title: "Accessibility",
      description: "Making public transportation accessible to everyone in our community.",
      icon: Users
    },
    {
      title: "Innovation",
      description: "Continuously improving our services with modern technology and better routes.",
      icon: Target
    }
  ]

  const team = [
    {
      name: "Shobhit Rai",
      image: "/api/placeholder/100/100"
    },
    {
      name: "Raghav Chawla",
      image: "/api/placeholder/100/100"
    },
    {
      name: "Manaya",
      image: "/api/placeholder/100/100"
    },
    {
      name: "Divyansh",
      image: "/api/placeholder/100/100"
    },
    {
      name: "Ananaya",
      image: "/api/placeholder/100/100"
    }
  ]

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="container mx-auto px-4 py-8">
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold text-balance mb-4">
            {t('about.title')}
          </h1>
          <p className="text-xl text-muted-foreground text-pretty max-w-3xl mx-auto">
            {t('about.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {stats.map((stat, index) => (
            <Card key={index} className="text-center">
              <CardContent className="pt-6">
                <stat.icon className="h-8 w-8 mx-auto mb-3 text-blue-600" />
                <div className="text-2xl font-bold mb-1">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
          <div>
            <h2 className="text-2xl font-bold mb-6">{t('about.mission.title')}</h2>
            <div className="space-y-4 text-muted-foreground">
              <p>
                {t('about.mission.description')}
              </p>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-bold mb-6">{t('about.vision.title')}</h2>
            <Card>
              <CardContent className="pt-6">
                <blockquote className="text-lg italic text-muted-foreground mb-4">
                  "{t('about.vision.description')}"
                </blockquote>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                    <span className="text-sm">{t('about.values.innovation')}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                    <span className="text-sm">{t('about.values.reliability')}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                    <span className="text-sm">{t('about.values.accessibility')}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                    <span className="text-sm">{t('about.values.community')}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-center">{t('about.values.title')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <Card key={index} className="text-center">
                <CardContent className="pt-6">
                  <value.icon className="h-8 w-8 mx-auto mb-3 text-blue-600" />
                  <h3 className="font-semibold mb-2">{value.title}</h3>
                  <p className="text-sm text-muted-foreground">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-center">{t('about.team.title')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {team.map((member, index) => (
              <Card key={index} className="text-center">
                <CardContent className="pt-6">
                  <div className="w-20 h-20 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <Users className="h-8 w-8 text-gray-500" />
                  </div>
                  <h3 className="font-semibold mb-1">{member.name}</h3>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                {t('contact.info.address')}
              </CardTitle>
              <CardDescription>{t('about.office.description')}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <div className="font-medium">City Transport Services</div>
                  <div className="text-sm text-muted-foreground">
                    123 Transport Avenue<br />
                    Central Business District<br />
                    Delhi - 110001
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  <span className="text-sm">+91 11 2345 6789</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  <span className="text-sm">info@citytransport.com</span>
                </div>
                <div className="flex items-center gap-2">
                  <Globe className="h-4 w-4" />
                  <span className="text-sm">www.citytransport.com</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t('contact.info.hours')}</CardTitle>
              <CardDescription>{t('about.hours.description')}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Monday - Friday</span>
                  <span className="text-sm font-medium">8:00 AM - 6:00 PM</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Saturday</span>
                  <span className="text-sm font-medium">9:00 AM - 4:00 PM</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Sunday</span>
                  <span className="text-sm font-medium">Closed</span>
                </div>
                <div className="pt-3 border-t">
                  <div className="text-sm font-medium mb-2">Emergency Contact</div>
                  <div className="text-sm text-muted-foreground">
                    Available 24/7 for urgent matters
                  </div>
                  <div className="text-sm font-medium mt-1">+91 11 9999 8888</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-12 text-center">
          <Card>
            <CardContent className="pt-8">
              <h3 className="text-xl font-semibold mb-4">{t('about.cta.title')}</h3>
              <p className="text-muted-foreground mb-6">
                {t('about.cta.description')}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button>View Routes & Schedules</Button>
                <Button variant="outline">Contact Us</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}