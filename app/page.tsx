"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Navigation } from "@/components/navigation"
import { useLanguage } from "@/lib/language-context"
import { MapPin, Search, Bell, BarChart3, Clock, Users } from "lucide-react"

export default function HomePage() {
  const { t } = useLanguage()
  
  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Hero Section */}
      <section className="relative py-20 px-4">
        <div className="container mx-auto text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold text-balance mb-6">
              {t('homepage.hero.title')}
            </h1>
            <p className="text-xl text-muted-foreground text-pretty mb-8 max-w-2xl mx-auto">
              {t('homepage.hero.subtitle')}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Button asChild size="lg" className="text-lg px-8 py-6">
                <Link href="/tracking">
                  <MapPin className="mr-2 h-5 w-5" />
                  {t('homepage.hero.trackMyBus')}
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="text-lg px-8 py-6 bg-transparent">
                <Link href="/routes">
                  <Search className="mr-2 h-5 w-5" />
                  {t('homepage.hero.searchRoute')}
                </Link>
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">12</div>
                <div className="text-muted-foreground">{t('homepage.stats.activeRoutes')}</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">45</div>
                <div className="text-muted-foreground">{t('homepage.stats.busStops')}</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">98%</div>
                <div className="text-muted-foreground">{t('homepage.stats.onTimePerformance')}</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-muted/50">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-balance mb-4">{t('homepage.features.title')}</h2>
            <p className="text-xl text-muted-foreground text-pretty max-w-2xl mx-auto">
              {t('homepage.features.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <MapPin className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>{t('homepage.features.liveTracking.title')}</CardTitle>
                <CardDescription>
                  {t('homepage.features.liveTracking.description')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild variant="ghost" className="p-0 h-auto">
                  <Link href="/tracking">{t('homepage.features.liveTracking.cta')}</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Search className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>{t('homepage.features.routeSearch.title')}</CardTitle>
                <CardDescription>
                  {t('homepage.features.routeSearch.description')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild variant="ghost" className="p-0 h-auto">
                  <Link href="/routes">{t('homepage.features.routeSearch.cta')}</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Bell className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>{t('homepage.features.smartAlerts.title')}</CardTitle>
                <CardDescription>
                  {t('homepage.features.smartAlerts.description')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild variant="ghost" className="p-0 h-auto">
                  <Link href="/alerts">{t('homepage.features.smartAlerts.cta')}</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Clock className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>{t('homepage.features.accurateETAs.title')}</CardTitle>
                <CardDescription>
                  {t('homepage.features.accurateETAs.description')}
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <BarChart3 className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>{t('homepage.features.analyticsDashboard.title')}</CardTitle>
                <CardDescription>
                  {t('homepage.features.analyticsDashboard.description')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild variant="ghost" className="p-0 h-auto">
                  <Link href="/admin">{t('homepage.features.analyticsDashboard.cta')}</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>{t('homepage.features.communityDriven.title')}</CardTitle>
                <CardDescription>
                  {t('homepage.features.communityDriven.description')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild variant="ghost" className="p-0 h-auto">
                  <Link href="/about">{t('homepage.features.communityDriven.cta')}</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-balance mb-6">{t('homepage.cta.title')}</h2>
            <p className="text-xl text-muted-foreground text-pretty mb-8">
              {t('homepage.cta.subtitle')}
            </p>
            <Button asChild size="lg" className="text-lg px-8 py-6">
              <Link href="/tracking">{t('homepage.cta.button')}</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <MapPin className="h-5 w-5 text-primary-foreground" />
                </div>
                <span className="text-xl font-bold">SmartTransit</span>
              </div>
              <p className="text-muted-foreground mb-4 max-w-md">
                {t('homepage.footer.description')}
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-4">{t('homepage.footer.quickLinks')}</h3>
              <div className="space-y-2">
                <Link href="/tracking" className="block text-muted-foreground hover:text-foreground">
                  {t('homepage.footer.liveTracking')}
                </Link>
                <Link href="/routes" className="block text-muted-foreground hover:text-foreground">
                  {t('homepage.footer.routeSearch')}
                </Link>
                <Link href="/alerts" className="block text-muted-foreground hover:text-foreground">
                  {t('homepage.footer.busAlerts')}
                </Link>
                <Link href="/admin" className="block text-muted-foreground hover:text-foreground">
                  {t('homepage.footer.dashboard')}
                </Link>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-4">{t('homepage.footer.support')}</h3>
              <div className="space-y-2">
                <Link href="/faq" className="block text-muted-foreground hover:text-foreground">
                  {t('navigation.faq')}
                </Link>
                <Link href="/contact" className="block text-muted-foreground hover:text-foreground">
                  {t('navigation.contact')}
                </Link>
                <Link href="/about" className="block text-muted-foreground hover:text-foreground">
                  {t('navigation.aboutUs')}
                </Link>
                <Link href="/updates" className="block text-muted-foreground hover:text-foreground">
                  {t('navigation.updates')}
                </Link>
              </div>
            </div>
          </div>

          <div className="border-t mt-8 pt-8 text-center text-muted-foreground">
            <p>{t('homepage.footer.copyright')}</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
