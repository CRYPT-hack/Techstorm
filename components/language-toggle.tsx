"use client"

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { useLanguage } from '@/lib/language-context'
import { Languages, Globe } from 'lucide-react'
import { cn } from '@/lib/utils'

export function LanguageToggle() {
  const { language, setLanguage } = useLanguage()
  const [isAnimating, setIsAnimating] = useState(false)

  const toggleLanguage = async () => {
    console.log('LanguageToggle: Current language:', language)
    setIsAnimating(true)
    
    const newLanguage = language === 'en' ? 'hi' : 'en'
    console.log('LanguageToggle: Switching to language:', newLanguage)
    
    // Add a small delay for smooth animation
    setTimeout(() => {
      setLanguage(newLanguage)
      setIsAnimating(false)
    }, 150)
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleLanguage}
      disabled={isAnimating}
      className={cn(
        "relative overflow-hidden transition-all duration-300 ease-in-out",
        "hover:bg-accent hover:text-accent-foreground",
        "min-w-[100px] justify-center group",
        isAnimating && "scale-95"
      )}
    >
      <div className="flex items-center gap-2">
        <Globe className={cn(
          "h-4 w-4 transition-transform duration-300",
          isAnimating && "rotate-180"
        )} />
        <span 
          className={cn(
            "transition-all duration-300 ease-in-out font-medium multilingual-text",
            language === 'hi' && "hindi-text",
            isAnimating && "opacity-50"
          )}
        >
          {language === 'en' ? 'English' : 'हिंदी'}
        </span>
      </div>
      
      {/* Animated background */}
      <div 
        className={cn(
          "absolute inset-0 bg-gradient-to-r from-primary/5 to-primary/10",
          "transition-opacity duration-300 opacity-0 group-hover:opacity-100"
        )}
      />
    </Button>
  )
}

// Alternative dropdown-style toggle
export function LanguageDropdown() {
  const { language, setLanguage } = useLanguage()

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="sm"
        className="flex items-center gap-2 min-w-[100px] justify-between"
      >
        <Languages className="h-4 w-4" />
        <span className="font-medium">
          {language === 'en' ? 'English' : 'हिंदी'}
        </span>
      </Button>
      
      <div className="absolute right-0 top-full mt-1 w-full bg-background border rounded-md shadow-lg z-50">
        <button
          onClick={() => setLanguage('en')}
          className={cn(
            "w-full px-3 py-2 text-left text-sm transition-colors",
            "hover:bg-accent hover:text-accent-foreground",
            "first:rounded-t-md last:rounded-b-md",
            language === 'en' && "bg-accent text-accent-foreground"
          )}
        >
          English
        </button>
        <button
          onClick={() => setLanguage('hi')}
          className={cn(
            "w-full px-3 py-2 text-left text-sm transition-colors",
            "hover:bg-accent hover:text-accent-foreground",
            "first:rounded-t-md last:rounded-b-md",
            language === 'hi' && "bg-accent text-accent-foreground"
          )}
        >
          हिंदी
        </button>
      </div>
    </div>
  )
}
