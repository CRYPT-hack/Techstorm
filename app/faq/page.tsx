"use client"

import { Navigation } from "@/components/navigation"
import { useLanguage } from "@/lib/language-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ChevronDown, ChevronUp, HelpCircle, Search, Phone, Mail } from "lucide-react"
import { useState } from "react"

export default function FAQPage() {
  const { t } = useLanguage()
  const [expandedItems, setExpandedItems] = useState<number[]>([])
  const [searchTerm, setSearchTerm] = useState("")

  const faqCategories = [
    {
      id: "general",
      title: "General Information",
      icon: HelpCircle,
      questions: [
        {
          id: 1,
          question: "What are your operating hours?",
          answer: "Our buses operate from 6:00 AM to 10:00 PM on weekdays and 7:00 AM to 9:00 PM on weekends. Some routes may have extended hours during peak seasons."
        },
        {
          id: 2,
          question: "How many routes do you operate?",
          answer: "We currently operate 4 main routes covering key areas of the city: Route 1 (Central Market - Tech Park), Route 2 (Metro Station - Airport), Route 3 (University - Mall), and Route 4 (Residential Area - Office Complex)."
        },
        {
          id: 3,
          question: "What is your fleet size?",
          answer: "We have a fleet of 11 buses serving our 4 routes. Each route typically has 2-4 buses depending on demand and frequency requirements."
        }
      ]
    },
    {
      id: "fares",
      title: "Fares & Payment",
      icon: HelpCircle,
      questions: [
        {
          id: 4,
          question: "What are the current fare rates?",
          answer: "Our current fare structure is: Route 1 (Central Market - Tech Park): ₹25, Route 2 (Metro Station - Airport): ₹35, Route 3 (University - Mall): ₹20, Route 4 (Residential Area - Office Complex): ₹30."
        },
        {
          id: 5,
          question: "Do you offer monthly passes?",
          answer: "Yes, we offer monthly passes at discounted rates. Route-specific monthly passes are available at 20% discount, and an all-route pass is available at 30% discount."
        },
        {
          id: 6,
          question: "What payment methods do you accept?",
          answer: "We accept cash payments on board, digital payments through UPI, and monthly pass subscriptions. We're working on implementing contactless card payments soon."
        }
      ]
    },
    {
      id: "routes",
      title: "Routes & Schedules",
      icon: HelpCircle,
      questions: [
        {
          id: 7,
          question: "How often do buses run?",
          answer: "Bus frequency varies by route: Route 1 runs every 15 minutes, Route 2 every 20 minutes, Route 3 every 10 minutes, and Route 4 every 25 minutes during peak hours."
        },
        {
          id: 8,
          question: "Can I track my bus in real-time?",
          answer: "Yes, you can track buses in real-time through our website's tracking page. We provide live updates on bus locations, delays, and estimated arrival times."
        },
        {
          id: 9,
          question: "What if my bus is delayed?",
          answer: "We provide real-time alerts for delays through our website and mobile notifications. If a bus is delayed by more than 15 minutes, we'll send notifications to subscribed passengers."
        }
      ]
    },
    {
      id: "safety",
      title: "Safety & Security",
      icon: HelpCircle,
      questions: [
        {
          id: 10,
          question: "What safety measures do you have in place?",
          answer: "All our buses are equipped with GPS tracking, CCTV cameras, emergency buttons, and first aid kits. Our drivers are trained in safety protocols and passenger assistance."
        },
        {
          id: 11,
          question: "How do I report a safety concern?",
          answer: "You can report safety concerns through our website contact form, call our emergency hotline at +91 11 9999 8888, or speak directly to the driver or conductor."
        },
        {
          id: 12,
          question: "Are your buses wheelchair accessible?",
          answer: "Currently, 3 out of our 11 buses are wheelchair accessible. We're working to make our entire fleet accessible within the next year."
        }
      ]
    },
    {
      id: "support",
      title: "Customer Support",
      icon: HelpCircle,
      questions: [
        {
          id: 13,
          question: "How can I contact customer support?",
          answer: "You can reach us at +91 11 2345 6789 during office hours (8 AM - 6 PM, Monday-Friday), email us at support@citytransport.com, or visit our office at 123 Transport Avenue."
        },
        {
          id: 14,
          question: "Do you have a mobile app?",
          answer: "We're currently developing a mobile app that will be available for both iOS and Android. The app will include real-time tracking, ticket booking, and route planning features."
        },
        {
          id: 15,
          question: "How do I file a complaint?",
          answer: "You can file complaints through our website contact form, email us at complaints@citytransport.com, or call our customer service number. We aim to respond to all complaints within 24 hours."
        }
      ]
    }
  ]

  const toggleExpanded = (id: number) => {
    setExpandedItems(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    )
  }

  const filteredCategories = faqCategories.map(category => ({
    ...category,
    questions: category.questions.filter(q => 
      q.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      q.answer.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })).filter(category => category.questions.length > 0)

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-balance mb-2">
            {t('faq.title')}
          </h1>
          <p className="text-muted-foreground text-pretty">
            {t('faq.subtitle')}
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="relative mb-8">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search FAQs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="space-y-6">
            {filteredCategories.map((category) => (
              <Card key={category.id}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <category.icon className="h-5 w-5" />
                    {category.title}
                  </CardTitle>
                  <CardDescription>
                    {category.questions.length} questions in this category
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {category.questions.map((faq) => (
                    <div key={faq.id} className="border rounded-lg">
                      <button
                        onClick={() => toggleExpanded(faq.id)}
                        className="w-full px-4 py-3 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                      >
                        <span className="font-medium">{faq.question}</span>
                        {expandedItems.includes(faq.id) ? (
                          <ChevronUp className="h-4 w-4 text-gray-500" />
                        ) : (
                          <ChevronDown className="h-4 w-4 text-gray-500" />
                        )}
                      </button>
                      {expandedItems.includes(faq.id) && (
                        <div className="px-4 pb-3 text-muted-foreground">
                          {faq.answer}
                        </div>
                      )}
                    </div>
                  ))}
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredCategories.length === 0 && searchTerm && (
            <Card>
              <CardContent className="pt-8 text-center">
                <HelpCircle className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <h3 className="text-lg font-semibold mb-2">No results found</h3>
                <p className="text-muted-foreground mb-4">
                  We couldn't find any FAQs matching your search term "{searchTerm}".
                </p>
                <Button variant="outline" onClick={() => setSearchTerm("")}>
                  Clear search
                </Button>
              </CardContent>
            </Card>
          )}

          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Still have questions?</CardTitle>
              <CardDescription>
                Can't find what you're looking for? We're here to help!
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 border rounded-lg">
                  <Phone className="h-8 w-8 mx-auto mb-3 text-blue-600" />
                  <h3 className="font-semibold mb-2">Call Us</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Speak directly with our customer service team
                  </p>
                  <Button variant="outline" size="sm">
                    +91 11 2345 6789
                  </Button>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <Mail className="h-8 w-8 mx-auto mb-3 text-green-600" />
                  <h3 className="font-semibold mb-2">Email Us</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Send us your questions and we'll respond within 24 hours
                  </p>
                  <Button variant="outline" size="sm">
                    support@citytransport.com
                  </Button>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <HelpCircle className="h-8 w-8 mx-auto mb-3 text-purple-600" />
                  <h3 className="font-semibold mb-2">Visit Us</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Come to our office for in-person assistance
                  </p>
                  <Button variant="outline" size="sm">
                    Get Directions
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}