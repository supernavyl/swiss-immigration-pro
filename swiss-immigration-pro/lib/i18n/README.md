# Internationalization (i18n) System

This directory contains natural, native French translations for the Swiss Immigration Pro platform.

## Overview

The i18n system provides:
- **Natural French translations** - Written by native speakers, not machine-translated
- **Automatic language detection** - Uses browser language and user preferences
- **React hooks** - Easy integration with components
- **Type-safe** - Full TypeScript support

## Structure

```
lib/i18n/
├── index.ts              # Core i18n utilities
├── useTranslation.ts     # React hooks for translations
├── fr/                   # French translations
│   ├── layerContent.ts   # Layer-specific content (EU/US/Others)
│   └── packContent.ts    # Pack content translations
└── README.md             # This file
```

## Usage

### In React Components

```tsx
import { useLayerContent } from '@/lib/i18n/useTranslation'
import type { LayerType } from '@/lib/layerLogic'

export default function MyComponent() {
  const layer: LayerType = 'europeans'
  const content = useLayerContent(layer)
  
  return (
    <div>
      <h1>{content.hero.tagline}</h1>
      <p>{content.hero.description}</p>
    </div>
  )
}
```

### Check Current Language

```tsx
import { useIsFrench, useLanguage } from '@/lib/i18n/useTranslation'

export default function MyComponent() {
  const isFrench = useIsFrench()
  const language = useLanguage() // 'en' | 'fr'
  
  return <div>{isFrench ? 'Bonjour' : 'Hello'}</div>
}
```

### Set Language Programmatically

```tsx
import { setLanguage } from '@/lib/i18n'

// Set to French
setLanguage('fr')

// Set to English
setLanguage('en')
```

## Language Detection

The system automatically detects language from:
1. `localStorage.getItem('preferredLanguage')` - User preference
2. Browser language (`navigator.language`)
3. Defaults to English if not detected

## Adding New Translations

### 1. Add to French Translation File

Edit `lib/i18n/fr/layerContent.ts` or `lib/i18n/fr/packContent.ts`:

```typescript
export const LAYER_CONTENT_FR = {
  europeans: {
    hero: {
      tagline: 'Votre Rêve Suisse Commence Ici',
      // ... more translations
    }
  }
}
```

### 2. Use in Components

Components using `useLayerContent()` will automatically get French translations when the language is set to French.

## Translation Style Guide

### French Translations Should:

- ✅ Use natural, conversational French
- ✅ Maintain Swiss legal terminology (AuG, VZAE, SEM, etc.) untranslated
- ✅ Use proper French formatting (spaces before punctuation: `CHF 2 500`)
- ✅ Preserve HTML tags and special classes
- ✅ Keep Swiss terms like "canton", "commune" as-is
- ✅ Use formal "vous" for user-facing content

### Example:

**English:**
```
Welcome to Swiss Immigration Pro – the most comprehensive platform.
```

**French:**
```
Bienvenue sur Swiss Immigration Pro – la plateforme la plus complète.
```

## Current Status

- ✅ Layer content (EU/US/Others) - Fully translated
- ✅ Pack content (Free pack) - Partially translated
- ⏳ Additional pack content - In progress
- ⏳ UI strings - To be added

## Integration with Google Translate

This system replaces Google Translate for French content. When French is selected:
- Native translations are used instead of machine translation
- Better quality and natural phrasing
- Faster performance (no API calls)
- Consistent terminology

For other languages, Google Translate can still be used as a fallback.





