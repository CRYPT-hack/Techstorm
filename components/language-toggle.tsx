"use client"

import React from 'react'
import { Button } from '@/components/ui/button'
import { useLanguage } from '@/lib/language-context'
import { Languages } from 'lucide-react'
import { cn } from '@/lib/utils'

export function LanguageToggle() {
  const { language, setLanguage } = useLanguage()

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'hi' : 'en')
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleLanguage}
      className={cn(
        "relative overflow-hidden transition-all duration-300 ease-in-out",
        "hover:bg-accent hover:text-accent-foreground",
        "min-w-[80px] justify-center"
      )}
    >
      <div className="flex items-center gap-2">
        <Languages className="h-4 w-4" />
        <span 
          className={cn(
            "transition-all duration-300 ease-in-out",
            "font-medium"
          )}
        >
          {language === 'en' ? 'English' : 'हिंदी'}
        </span>
      </div>
      
      {/* Smooth transition overlay */}
      <div 
        className={cn(
          "absolute inset-0 bg-primary/10 transition-opacity duration-300",
          "opacity-0 hover:opacity-100"
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
