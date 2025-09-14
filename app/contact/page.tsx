"use client"

import { Navigation } from "@/components/navigation"
import { useLanguage } from "@/lib/language-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MapPin, Phone, Mail, Clock, Send, MessageSquare, AlertCircle } from "lucide-react"
import { useState } from "react"

export default function ContactPage() {
  const { t } = useLanguage()
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    category: "",
    message: ""
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const contactInfo = [
    {
      icon: Phone,
      title: "Phone",
      details: ["+91 11 2345 6789", "+91 11 9999 8888 (Emergency)"],
      description: "Call us during office hours for immediate assistance"
    },
    {
      icon: Mail,
      title: "Email",
      details: ["info@citytransport.com", "support@citytransport.com"],
      description: "Send us an email and we'll respond within 24 hours"
    },
    {
      icon: MapPin,
      title: "Office Address",
      details: ["123 Transport Avenue", "Central Business District", "Delhi - 110001"],
      description: "Visit our main office for in-person assistance"
    },
    {
      icon: Clock,
      title: "Office Hours",
      details: ["Monday - Friday: 8:00 AM - 6:00 PM", "Saturday: 9:00 AM - 4:00 PM", "Sunday: Closed"],
      description: "Emergency support available 24/7"
    }
  ]

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    setIsSubmitting(false)
    setIsSubmitted(true)
    
    // Reset form after 3 seconds
    setTimeout(() => {
      setIsSubmitted(false)
      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        category: "",
        message: ""
      })
    }, 3000)
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-balance mb-2">
            {t('contact.title')}
          </h1>
          <p className="text-muted-foreground text-pretty">
            {t('contact.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  {t('contact.form.title')}
                </CardTitle>
                <CardDescription>
                  {t('contact.form.description')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isSubmitted ? (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <MessageSquare className="h-8 w-8 text-green-600" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">{t('contact.form.success.title')}</h3>
                    <p className="text-muted-foreground">
                      {t('contact.form.success.message')}
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium mb-2 block">{t('contact.form.name')} *</label>
                        <Input
                          value={formData.name}
                          onChange={(e) => handleInputChange("name", e.target.value)}
                          placeholder={t('contact.form.namePlaceholder')}
                          required
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-2 block">{t('contact.form.email')} *</label>
                        <Input
                          type="email"
                          value={formData.email}
                          onChange={(e) => handleInputChange("email", e.target.value)}
                          placeholder={t('contact.form.emailPlaceholder')}
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium mb-2 block">{t('contact.form.phone')}</label>
                        <Input
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => handleInputChange("phone", e.target.value)}
                          placeholder={t('contact.form.phonePlaceholder')}
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-2 block">{t('contact.form.inquiryType')}</label>
                        <Select value={formData.category} onValueChange={(value) => handleInputChange("category", value)}>
                          <SelectTrigger>
                            <SelectValue placeholder={t('contact.form.inquiryPlaceholder')} />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="general">{t('contact.form.inquiryTypes.general')}</SelectItem>
                            <SelectItem value="support">{t('contact.form.inquiryTypes.support')}</SelectItem>
                            <SelectItem value="feedback">{t('contact.form.inquiryTypes.feedback')}</SelectItem>
                            <SelectItem value="partnership">{t('contact.form.inquiryTypes.partnership')}</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-2 block">{t('contact.form.subject')} *</label>
                      <Input
                        value={formData.subject}
                        onChange={(e) => handleInputChange("subject", e.target.value)}
                        placeholder={t('contact.form.subjectPlaceholder')}
                        required
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-2 block">{t('contact.form.message')} *</label>
                      <Textarea
                        value={formData.message}
                        onChange={(e) => handleInputChange("message", e.target.value)}
                        placeholder={t('contact.form.messagePlaceholder')}
                        rows={5}
                        required
                      />
                    </div>

                    <Button type="submit" className="w-full" disabled={isSubmitting}>
                      {isSubmitting ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Sending...
                        </>
                      ) : (
                        <>
                          <Send className="h-4 w-4 mr-2" />
                          {t('contact.form.send')}
                        </>
                      )}
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5" />
                  Emergency Contact
                </CardTitle>
                <CardDescription>
                  For urgent matters outside office hours
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Phone className="h-4 w-4 text-red-600" />
                      <span className="font-semibold text-red-800">Emergency Hotline</span>
                    </div>
                    <div className="text-lg font-bold text-red-600 mb-1">+91 11 9999 8888</div>
                    <div className="text-sm text-red-700">Available 24/7 for urgent matters</div>
                  </div>
                  
                  <div className="text-sm text-muted-foreground">
                    <p className="mb-2">Use this number for:</p>
                    <ul className="list-disc list-inside space-y-1">
                      <li>Safety concerns or incidents</li>
                      <li>Bus breakdowns or delays</li>
                      <li>Medical emergencies on board</li>
                      <li>Other urgent matters</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <div className="grid grid-cols-1 gap-6">
              {contactInfo.map((info, index) => (
                <Card key={index}>
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <info.icon className="h-5 w-5 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold mb-2">{info.title}</h3>
                        <div className="space-y-1 mb-2">
                          {info.details.map((detail, idx) => (
                            <div key={idx} className="text-sm text-muted-foreground">
                              {detail}
                            </div>
                          ))}
                        </div>
                        <p className="text-xs text-gray-500">{info.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Response Times</CardTitle>
                <CardDescription>When you can expect to hear from us</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">General Inquiries</span>
                  <Badge variant="outline" className="text-green-600">24 hours</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Complaints</span>
                  <Badge variant="outline" className="text-blue-600">24 hours</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Technical Support</span>
                  <Badge variant="outline" className="text-purple-600">48 hours</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Emergency</span>
                  <Badge variant="outline" className="text-red-600">Immediate</Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Visit Our Office</CardTitle>
                <CardDescription>Come see us in person</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="font-medium mb-1">City Transport Services</div>
                    <div className="text-sm text-muted-foreground">
                      123 Transport Avenue<br />
                      Central Business District<br />
                      Delhi - 110001
                    </div>
                  </div>
                  <Button variant="outline" className="w-full">
                    <MapPin className="h-4 w-4 mr-2" />
                    Get Directions
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}