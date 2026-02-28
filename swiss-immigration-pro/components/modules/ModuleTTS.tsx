'use client'

import { useState, useEffect, useCallback, useImperativeHandle, forwardRef } from 'react'
import { Volume2, Play, Pause, Square, X } from 'lucide-react'

interface ModuleTTSProps {
  activeSection: string
  sections: { id: string; title: string; content: string }[]
  aiAssistantOpen: boolean
}

export interface ModuleTTSHandle {
  readSection: (title: string, content: string) => void
}

export const ModuleTTS = forwardRef<ModuleTTSHandle, ModuleTTSProps>(
  function ModuleTTS({ activeSection, sections, aiAssistantOpen }, ref) {
    const [isTTSOpen, setIsTTSOpen] = useState(false)
    const [isPlaying, setIsPlaying] = useState(false)
    const [selectedText, setSelectedText] = useState('')
    const [selectedVoice, setSelectedVoice] = useState<SpeechSynthesisVoice | null>(null)
    const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([])
    const [speechSynth, setSpeechSynth] = useState<SpeechSynthesis | null>(null)
    const [, setCurrentUtterance] = useState<SpeechSynthesisUtterance | null>(null)

    // Initialize TTS and load voices
    useEffect(() => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        const synth = window.speechSynthesis
        setSpeechSynth(synth)

        const loadVoices = () => {
          const availableVoices = synth.getVoices()
          const naturalVoices = availableVoices.filter(v => {
            const name = v.name.toLowerCase()
            if (name.includes('microsoft') || name.includes('zira') || name.includes('mark')) {
              return false
            }
            return name.includes('neural') ||
                   name.includes('natural') ||
                   name.includes('premium') ||
                   name.includes('enhanced') ||
                   name.includes('google') ||
                   name.includes('amazon') ||
                   name.includes('polly') ||
                   name.includes('wavenet') ||
                   name.includes('studio')
          })

          const sortedVoices = naturalVoices.sort((a, b) => {
            const aIsNatural = a.name.toLowerCase().includes('neural') ||
                              a.name.toLowerCase().includes('natural') ||
                              a.name.toLowerCase().includes('premium') ||
                              a.name.toLowerCase().includes('enhanced')
            const bIsNatural = b.name.toLowerCase().includes('neural') ||
                              b.name.toLowerCase().includes('natural') ||
                              b.name.toLowerCase().includes('premium') ||
                              b.name.toLowerCase().includes('enhanced')
            if (aIsNatural && !bIsNatural) return -1
            if (!aIsNatural && bIsNatural) return 1
            if (a.lang.startsWith('en') && !b.lang.startsWith('en')) return -1
            if (!a.lang.startsWith('en') && b.lang.startsWith('en')) return 1
            return a.name.localeCompare(b.name)
          })
          setVoices(sortedVoices)
          const naturalVoice = sortedVoices.find(
            v => (v.name.toLowerCase().includes('neural') ||
                 v.name.toLowerCase().includes('natural') ||
                 v.name.toLowerCase().includes('premium') ||
                 v.name.toLowerCase().includes('enhanced')) &&
                 v.lang.startsWith('en')
          ) || sortedVoices.find(
            v => v.name.toLowerCase().includes('google') &&
                 v.lang.startsWith('en')
          ) || sortedVoices.find(v => v.lang.startsWith('en')) || sortedVoices[0]
          if (naturalVoice) setSelectedVoice(naturalVoice)
        }

        loadVoices()
        synth.onvoiceschanged = loadVoices
      }
    }, [])

    // Handle text selection
    useEffect(() => {
      const handleSelection = () => {
        const selection = window.getSelection()
        if (selection && selection.toString().trim().length > 0) {
          setSelectedText(selection.toString().trim())
          setIsTTSOpen(true)
        }
      }

      document.addEventListener('mouseup', handleSelection)
      return () => document.removeEventListener('mouseup', handleSelection)
    }, [])

    const stripMarkdown = (text: string): string => {
      return text
        .replace(/<[^>]+>/g, ' ')
        .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
        .replace(/#{1,6}\s+/g, '')
        .replace(/\*\*([^*]+)\*\*/g, '$1')
        .replace(/\*([^*]+)\*/g, '$1')
        .replace(/`[^`]+`/g, '')
        .replace(/^\s*[-*+]\s+/gm, '')
        .replace(/^\s*\d+\.\s+/gm, '')
        .replace(/\n{2,}/g, '. ')
        .replace(/\n/g, ' ')
        .trim()
    }

    const speakText = useCallback((text: string) => {
      if (!speechSynth) return

      speechSynth.cancel()

      const utterance = new SpeechSynthesisUtterance(stripMarkdown(text))
      if (selectedVoice) {
        utterance.voice = selectedVoice
      }
      utterance.rate = 1.0
      utterance.pitch = 1.0
      utterance.volume = 1.0

      utterance.onstart = () => setIsPlaying(true)
      utterance.onend = () => {
        setIsPlaying(false)
        setCurrentUtterance(null)
      }
      utterance.onerror = () => {
        setIsPlaying(false)
        setCurrentUtterance(null)
      }

      setCurrentUtterance(utterance)
      speechSynth.speak(utterance)
    }, [speechSynth, selectedVoice])

    const stopSpeaking = () => {
      if (speechSynth) {
        speechSynth.cancel()
        setIsPlaying(false)
        setCurrentUtterance(null)
      }
    }

    const readCurrentChapter = useCallback(() => {
      const currentSection = sections.find(s => s.id === activeSection)
      if (currentSection) {
        const textToRead = `${currentSection.title}. ${currentSection.content}`
        setSelectedText(textToRead)
        setIsTTSOpen(true)
        speakText(textToRead)
      }
    }, [activeSection, sections, speakText])

    const readSelectedText = useCallback(() => {
      if (selectedText) {
        speakText(selectedText)
      }
    }, [selectedText, speakText])

    const togglePlayPause = () => {
      if (!speechSynth) return

      if (isPlaying) {
        speechSynth.pause()
        setIsPlaying(false)
      } else if (speechSynth.paused) {
        speechSynth.resume()
        setIsPlaying(true)
      } else if (selectedText) {
        readSelectedText()
      } else {
        readCurrentChapter()
      }
    }

    const readSection = useCallback((title: string, content: string) => {
      const textToRead = `${title}. ${content}`
      setSelectedText(textToRead)
      setIsTTSOpen(true)
      speakText(textToRead)
    }, [speakText])

    useImperativeHandle(ref, () => ({ readSection }), [readSection])

    return (
      <>
        {/* TTS Floating Button */}
        <button
          onClick={() => {
            if (selectedText) {
              setIsTTSOpen(true)
            } else {
              readCurrentChapter()
            }
          }}
          className="fixed bottom-20 right-4 lg:bottom-6 lg:right-20 z-[9997] bg-blue-600 text-white p-3 lg:p-4 rounded-full shadow-lg hover:bg-blue-700 transition-all hover:scale-110"
          style={{
            right: typeof window !== 'undefined' && window.innerWidth >= 1024
              ? (aiAssistantOpen ? '400px' : '80px')
              : '16px',
            bottom: typeof window !== 'undefined' && window.innerWidth >= 1024
              ? '24px'
              : '80px'
          }}
          title="Text to Speech - Read selected text or current chapter"
        >
          <Volume2 className="w-5 h-5 lg:w-5" />
        </button>

        {/* TTS Control Panel */}
        {isTTSOpen && (
          <div
            className="fixed bottom-32 lg:bottom-24 z-[9996] bg-white border border-gray-200 rounded-lg shadow-xl p-4 w-[calc(100vw-2rem)] max-w-sm lg:w-80 lg:max-w-[calc(100vw-3rem)]"
            style={{
              right: typeof window !== 'undefined' && window.innerWidth >= 1024
                ? (aiAssistantOpen ? '400px' : '24px')
                : '16px'
            }}
          >
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-semibold text-gray-900 flex items-center">
                <Volume2 className="w-4 h-4 mr-2 text-blue-600" />
                Text to Speech
              </h4>
              <button
                onClick={() => {
                  setIsTTSOpen(false)
                  stopSpeaking()
                }}
                className="p-1 hover:bg-gray-100 rounded transition-colors text-gray-500"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Voice Selection */}
            <div className="mb-3">
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Voice
              </label>
              <select
                value={selectedVoice?.name || ''}
                onChange={(e) => {
                  const voice = voices.find(v => v.name === e.target.value)
                  if (voice) setSelectedVoice(voice)
                }}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {voices.length === 0 ? (
                  <option>Loading voices...</option>
                ) : (
                  voices
                    .filter(v => {
                      const name = v.name.toLowerCase()
                      if (name.includes('microsoft') || name.includes('zira') || name.includes('mark')) {
                        return false
                      }
                      return v.lang.startsWith('en') || v.lang.startsWith('de') || v.lang.startsWith('fr') || v.lang.startsWith('it')
                    })
                    .map((voice) => {
                      const isNatural = voice.name.toLowerCase().includes('neural') ||
                                       voice.name.toLowerCase().includes('natural') ||
                                       voice.name.toLowerCase().includes('premium') ||
                                       voice.name.toLowerCase().includes('enhanced')
                      return (
                        <option key={voice.name} value={voice.name}>
                          {isNatural ? '\u2B50 ' : ''}
                          {voice.name} ({voice.lang})
                        </option>
                      )
                    })
                )}
              </select>
            </div>

            {/* Selected Text Preview */}
            {selectedText && (
              <div className="mb-3 p-2 bg-gray-50 rounded text-xs text-gray-600 max-h-20 overflow-y-auto">
                {selectedText.substring(0, 100)}{selectedText.length > 100 ? '...' : ''}
              </div>
            )}

            {/* Control Buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={togglePlayPause}
                className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium flex items-center justify-center gap-2"
              >
                {isPlaying ? (
                  <>
                    <Pause className="w-4 h-4" />
                    <span>Pause</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4" />
                    <span>Play</span>
                  </>
                )}
              </button>
              <button
                onClick={stopSpeaking}
                disabled={!isPlaying && speechSynth?.speaking !== true}
                className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                title="Stop"
              >
                <Square className="w-4 h-4" />
              </button>
            </div>

            {/* Quick Actions */}
            <div className="mt-3 pt-3 border-t border-gray-200">
              <button
                onClick={readCurrentChapter}
                className="w-full px-3 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors text-left"
              >
                {'\uD83D\uDCD6'} Read Current Chapter
              </button>
            </div>
          </div>
        )}
      </>
    )
  }
)
