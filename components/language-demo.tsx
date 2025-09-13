"use client"

import React from 'react'
import { useLanguage } from '@/lib/language-context'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { LanguageToggle } from './language-toggle'
import { Globe, CheckCircle } from 'lucide-react'

export function LanguageDemo() {
  const { t, language } = useLanguage()

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="text-center">
        <div className="flex justify-center mb-4">
          <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
            <Globe className="h-6 w-6 text-primary" />
          </div>
        </div>
        <CardTitle className="text-2xl">
          {language === 'en' ? 'Language Toggle Demo' : 'भाषा टॉगल डेमो'}
        </CardTitle>
        <CardDescription>
          {language === 'en' 
            ? 'Click the language toggle button to switch between English and Hindi. All text will change instantly!'
            : 'अंग्रेजी और हिंदी के बीच स्विच करने के लिए भाषा टॉगल बटन पर क्लिक करें। सभी टेक्स्ट तुरंत बदल जाएगा!'
          }
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="text-center">
          <LanguageToggle />
        </div>
        
        <div className="space-y-4">
          <div className="p-4 bg-muted/50 rounded-lg">
            <h3 className="font-semibold mb-2">
              {language === 'en' ? 'Current Language:' : 'वर्तमान भाषा:'}
            </h3>
            <p className="text-lg font-medium text-primary">
              {language === 'en' ? 'English' : 'हिंदी'}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 border rounded-lg">
              <h4 className="font-semibold mb-2">
                {language === 'en' ? 'Features:' : 'विशेषताएं:'}
              </h4>
              <ul className="space-y-1 text-sm">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  {language === 'en' ? 'Instant language switching' : 'तुरंत भाषा बदलना'}
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  {language === 'en' ? 'Smooth transitions' : 'स्मूथ ट्रांजिशन'}
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  {language === 'en' ? 'Persistent preferences' : 'स्थायी प्राथमिकताएं'}
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  {language === 'en' ? 'No page reload required' : 'पेज रीलोड की आवश्यकता नहीं'}
                </li>
              </ul>
            </div>
            
            <div className="p-4 border rounded-lg">
              <h4 className="font-semibold mb-2">
                {language === 'en' ? 'Sample Text:' : 'नमूना टेक्स्ट:'}
              </h4>
              <p className="text-sm text-muted-foreground">
                {language === 'en' 
                  ? 'This is a sample paragraph that demonstrates how text changes when you switch languages. The translation system supports nested JSON structures and provides fallbacks for missing translations.'
                  : 'यह एक नमूना पैराग्राफ है जो दिखाता है कि जब आप भाषाएं बदलते हैं तो टेक्स्ट कैसे बदलता है। अनुवाद सिस्टम नेस्टेड JSON संरचनाओं का समर्थन करता है और लापता अनुवादों के लिए फॉलबैक प्रदान करता है।'
                }
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
