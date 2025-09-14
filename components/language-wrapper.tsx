"use client"

import React, { useEffect } from 'react'
import { useLanguage } from '@/lib/language-context'
import { cn } from '@/lib/utils'

interface LanguageWrapperProps {
  children: React.ReactNode
  className?: string
}

export function LanguageWrapper({ children, className }: LanguageWrapperProps) {
  const { language } = useLanguage()

  useEffect(() => {
    // Update document language attribute for accessibility
    document.documentElement.lang = language
  }, [language])

  return (
    <div 
      className={cn(
        "language-transition multilingual-text",
        language === 'hi' && "hindi-text",
        className
      )}
      lang={language}
    >
      {children}
    </div>
  )
}
