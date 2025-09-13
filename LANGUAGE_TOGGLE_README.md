# Language Toggle Feature

This project includes a comprehensive language toggle feature that allows users to switch between English and Hindi dynamically without page reloads.

## Features

- ✅ **Dynamic Language Switching**: Toggle between English and Hindi instantly
- ✅ **No Page Reload**: All text changes happen client-side without refreshing
- ✅ **Persistent Preferences**: Language choice is saved in localStorage
- ✅ **Smooth Transitions**: CSS animations for seamless language changes
- ✅ **JSON-based Translations**: Easy to maintain and extend translation files
- ✅ **Nested Translation Support**: Supports complex nested JSON structures
- ✅ **Fallback System**: Shows translation keys if translations are missing
- ✅ **React Context**: Clean state management using React Context API

## Implementation Details

### 1. Translation Files
- `lib/translations/en.json` - English translations
- `lib/translations/hi.json` - Hindi translations

### 2. Language Context
- `lib/language-context.tsx` - React context for language management
- Provides `useLanguage()` hook for components
- Handles localStorage persistence
- Manages language state and translation function

### 3. Language Toggle Component
- `components/language-toggle.tsx` - Toggle button component
- Includes both simple toggle and dropdown variants
- Smooth CSS transitions and hover effects

### 4. Updated Components
- `components/navigation.tsx` - Navigation with translations
- `app/page.tsx` - Homepage with full translation support
- `app/layout.tsx` - Root layout with LanguageProvider

## Usage

### Basic Usage
```tsx
import { useLanguage } from '@/lib/language-context'

function MyComponent() {
  const { t, language, setLanguage } = useLanguage()
  
  return (
    <div>
      <h1>{t('homepage.hero.title')}</h1>
      <button onClick={() => setLanguage('hi')}>
        Switch to Hindi
      </button>
    </div>
  )
}
```

### Adding New Translations
1. Add the key-value pair to both `en.json` and `hi.json`
2. Use nested structure for organization: `"section.subsection.key"`
3. Use the `t()` function in components: `t('section.subsection.key')`

### Language Toggle Component
```tsx
import { LanguageToggle } from '@/components/language-toggle'

function Header() {
  return (
    <header>
      <LanguageToggle />
    </header>
  )
}
```

## File Structure

```
lib/
├── translations/
│   ├── en.json          # English translations
│   └── hi.json          # Hindi translations
└── language-context.tsx # Language context and provider

components/
├── language-toggle.tsx  # Language toggle component
├── language-demo.tsx    # Demo component
└── navigation.tsx       # Updated navigation

app/
├── layout.tsx           # Root layout with LanguageProvider
├── page.tsx            # Updated homepage
└── demo/
    └── page.tsx        # Demo page
```

## CSS Transitions

The implementation includes smooth CSS transitions for language changes:

```css
/* Language transition animations */
.language-transition {
  transition: all 0.3s ease-in-out;
}

/* Smooth text transitions for language changes */
h1, h2, h3, h4, h5, h6, p, span, div {
  transition: opacity 0.2s ease-in-out;
}
```

## Demo

Visit `/demo` to see the language toggle in action with a comprehensive demo component.

## Browser Support

- Modern browsers with localStorage support
- React 18+ required
- TypeScript support included

## Future Enhancements

- Add more languages (extend translation files)
- RTL (Right-to-Left) language support
- Language-specific date/number formatting
- Dynamic language loading from API
- Language detection from browser settings
