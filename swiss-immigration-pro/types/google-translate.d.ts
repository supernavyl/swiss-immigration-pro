/* Google Translate Element API */
interface GoogleTranslateElementOptions {
  pageLanguage: string
  includedLanguages?: string
  layout?: number
  autoDisplay?: boolean
}

interface GoogleTranslateElement {
  new (options: GoogleTranslateElementOptions, containerId: string): void
  InlineLayout: { SIMPLE: number; HORIZONTAL: number; VERTICAL: number }
}

interface Window {
  google?: {
    translate?: {
      TranslateElement: GoogleTranslateElement
    }
  }
  googleTranslateElementInit?: () => void
}
