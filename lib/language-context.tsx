"use client"

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import enTranslations from './translations/en.json'
import hiTranslations from './translations/hi.json'

export type Language = 'en' | 'hi'

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
  isLoading: boolean
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

const translations = {
  en: enTranslations,
  hi: hiTranslations,
}

// Debug: Log translations on load
console.log('Translations loaded:', {
  en: !!enTranslations,
  hi: !!hiTranslations,
  enKeys: enTranslations ? Object.keys(enTranslations) : [],
  hiKeys: hiTranslations ? Object.keys(hiTranslations) : []
})

// Helper function to get nested translation value
const getNestedValue = (obj: any, path: string): string => {
  try {
    const result = path.split('.').reduce((current, key) => {
      if (current && current[key] !== undefined) {
        return current[key]
      }
      throw new Error(`Key not found: ${key}`)
    }, obj)
    return result
  } catch (error) {
    console.warn(`getNestedValue failed for path: ${path}`, error)
    return path
  }
}

interface LanguageProviderProps {
  children: ReactNode
}

export function LanguageProvider({ children }: LanguageProviderProps) {
  const [language, setLanguageState] = useState<Language>('en')
  const [isLoading, setIsLoading] = useState(true)

  // Load language preference from localStorage on mount
  useEffect(() => {
    console.log('LanguageProvider: Loading language preference from localStorage')
    const savedLanguage = localStorage.getItem('preferred-language') as Language
    console.log('LanguageProvider: Saved language from localStorage:', savedLanguage)
    if (savedLanguage && (savedLanguage === 'en' || savedLanguage === 'hi')) {
      console.log('LanguageProvider: Setting language to:', savedLanguage)
      setLanguageState(savedLanguage)
    }
    console.log('LanguageProvider: Translations loaded:', { en: !!translations.en, hi: !!translations.hi })
    setIsLoading(false)
  }, [])

  // Save language preference to localStorage
  const setLanguage = (lang: Language) => {
    setLanguageState(lang)
    localStorage.setItem('preferred-language', lang)
  }

  // Translation function with detailed debugging
  const t = (key: string): string => {
    console.log(`[TRANSLATION] Key: ${key}, Language: ${language}`)
    console.log(`[TRANSLATION] Available translations:`, Object.keys(translations))
    console.log(`[TRANSLATION] Current language object:`, translations[language])
    
    const translation = getNestedValue(translations[language], key)
    console.log(`[TRANSLATION] Result for ${key}:`, translation)
    
    if (translation === key) {
      console.warn(`[TRANSLATION] Missing translation for key: ${key} in language: ${language}`)
      // Let's also check if the key exists in the other language
      const otherLang = language === 'en' ? 'hi' : 'en'
      const otherTranslation = getNestedValue(translations[otherLang], key)
      console.log(`[TRANSLATION] Key exists in ${otherLang}:`, otherTranslation !== key)
    }
    
    return translation || key
  }

  const value: LanguageContextType = {
    language,
    setLanguage,
    t,
    isLoading,
  }

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}
