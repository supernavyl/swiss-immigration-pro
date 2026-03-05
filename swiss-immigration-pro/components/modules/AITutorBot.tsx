'use client'

/* eslint-disable @typescript-eslint/no-explicit-any -- Web Speech API lacks standard TS types */
type SpeechRecognitionInstance = {
  continuous: boolean; interimResults: boolean; lang: string
  start(): void; stop(): void; abort(): void
  onresult: ((event: { results: SpeechRecognitionResultList }) => void) | null
  onerror: ((event: { error: string }) => void) | null
  onend: (() => void) | null
}

import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  MessageCircle, X, Send, Sparkles, BookOpen, Lightbulb,
  HelpCircle, ChevronRight, Brain, Zap, Target, CheckCircle2,
  Minimize2, Maximize2, MessageSquare, Mic, MicOff, Volume2, VolumeX
} from 'lucide-react'
import { useSession } from '@/lib/auth-client'

interface AITutorBotProps {
  moduleTitle?: string
  moduleDescription?: string
  currentSection?: string
  currentSectionContent?: string
  moduleId?: string
  isMinimized?: boolean
  onMinimize?: (minimized: boolean) => void
  isEmbedded?: boolean
  onClose?: () => void
}

interface ChatMessage {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  timestamp: Date
}

const QUICK_ACTIONS = [
  { id: 'explain', label: 'Explain this section', icon: Lightbulb, prompt: 'Can you explain the key concepts in this section?' },
  { id: 'examples', label: 'Give examples', icon: Zap, prompt: 'Can you provide real-world examples related to this content?' },
  { id: 'summary', label: 'Summarize', icon: BookOpen, prompt: 'Can you summarize the main points of this section?' },
  { id: 'clarify', label: 'Clarify doubts', icon: HelpCircle, prompt: 'I have some questions about this section. Can you help clarify?' },
]

export default function AITutorBot({
  moduleTitle = 'Module',
  moduleDescription = '',
  currentSection = '',
  currentSectionContent = '',
  moduleId = '',
  isMinimized: externalMinimized,
  onMinimize,
  isEmbedded = false,
  onClose
}: AITutorBotProps) {
  const { data: session } = useSession()
  const [isOpen, setIsOpen] = useState(isEmbedded ? true : false)
  const [isMinimized, setIsMinimized] = useState(externalMinimized || false)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  
  // Voice mode state
  const [isVoiceMode, setIsVoiceMode] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null)
  const synthRef = useRef<SpeechSynthesis | null>(null)
  const currentUtteranceRef = useRef<SpeechSynthesisUtterance | null>(null)

  // Initialize speech recognition and synthesis
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Check for Web Speech API support
      const Win = window as Window & { webkitSpeechRecognition?: new () => SpeechRecognitionInstance; SpeechRecognition?: new () => SpeechRecognitionInstance }
      const SpeechRecognitionCtor = Win.webkitSpeechRecognition || Win.SpeechRecognition
      if (SpeechRecognitionCtor) {
        recognitionRef.current = new SpeechRecognitionCtor()
        recognitionRef.current.continuous = false
        recognitionRef.current.interimResults = false
        recognitionRef.current.lang = 'en-US'

        recognitionRef.current.onresult = (event) => {
          const transcript = event.results[0][0].transcript
          setInput(transcript)
          setIsListening(false)
        }

        recognitionRef.current.onerror = (event) => {
          console.error('Speech recognition error:', event.error)
          setIsListening(false)
          if (event.error === 'no-speech') {
            setErrorMessage('No speech detected. Please try again.')
          } else {
            setErrorMessage('Speech recognition error. Please try typing instead.')
          }
        }
        
        recognitionRef.current.onend = () => {
          setIsListening(false)
        }
      }
      
      synthRef.current = window.speechSynthesis
    }
    
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop()
      }
      if (synthRef.current && currentUtteranceRef.current) {
        synthRef.current.cancel()
      }
    }
  }, [])
  
  // Sync external minimized state
  useEffect(() => {
    if (externalMinimized !== undefined) {
      setIsMinimized(externalMinimized)
    }
  }, [externalMinimized])
  
  // Auto-open when embedded
  useEffect(() => {
    if (isEmbedded) {
      setIsOpen(true)
      setIsMinimized(false)
    }
  }, [isEmbedded])

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (isOpen && !isMinimized) {
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
      }, 100)
    }
  }, [messages, isOpen, isMinimized])

  // Update section content dynamically when section changes
  useEffect(() => {
    if (currentSection && typeof window !== 'undefined') {
      // Try to extract content from the DOM element
      const sectionElement = document.getElementById(currentSection.toLowerCase().replace(/[^a-z0-9]+/g, '-'))
      if (sectionElement) {
        // Content will be passed via props, but we can enhance it here if needed
      }
    }
  }, [currentSection])

  // Initialize with welcome message
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const welcomeMessage: ChatMessage = {
        id: 'welcome',
        role: 'system',
        content: `👋 Hi! I'm your AI tutor for "${moduleTitle}". I'm here to help you understand this module better. Ask me anything about the content, or use the quick actions below!`,
        timestamp: new Date()
      }
      setMessages([welcomeMessage])
    }
  }, [isOpen, moduleTitle])

  const handleToggle = useCallback(() => {
    setIsOpen(prev => !prev)
    setErrorMessage(null)
    if (!isOpen) {
      // Focus input when opening
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }, [isOpen])

  const handleMinimize = useCallback(() => {
    const newMinimized = !isMinimized
    setIsMinimized(newMinimized)
    onMinimize?.(newMinimized)
  }, [isMinimized, onMinimize])

  const createMessageId = useCallback(() => {
    try {
      return crypto.randomUUID()
    } catch {
      return `${Date.now()}-${Math.random().toString(16).slice(2)}`
    }
  }, [])
  
  // Voice mode functions (defined before sendMessage to avoid dependency issues)
  const speakText = useCallback((text: string) => {
    if (!synthRef.current) return
    
    // Cancel any ongoing speech
    synthRef.current.cancel()
    
    // Get available voices and select a natural one (excluding Microsoft)
    const voices = synthRef.current.getVoices()
    const naturalVoices = voices.filter(v => {
      const name = v.name.toLowerCase()
      // Exclude Microsoft voices
      if (name.includes('microsoft') || name.includes('zira') || name.includes('mark')) {
        return false
      }
      // Only include highly natural voices
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
    
    const naturalVoice = naturalVoices.find(
      v => (v.name.toLowerCase().includes('neural') || 
           v.name.toLowerCase().includes('natural') || 
           v.name.toLowerCase().includes('premium') ||
           v.name.toLowerCase().includes('enhanced')) &&
           v.lang.startsWith('en')
    ) || naturalVoices.find(
      v => v.name.toLowerCase().includes('google') &&
           v.lang.startsWith('en')
    ) || naturalVoices.find(v => v.lang.startsWith('en')) || null
    
    const utterance = new SpeechSynthesisUtterance(text)
    if (naturalVoice) {
      utterance.voice = naturalVoice
    }
    utterance.rate = 1.0
    utterance.pitch = 1.0
    utterance.volume = 1.0
    utterance.lang = 'en-US'
    
    utterance.onstart = () => {
      setIsSpeaking(true)
    }
    
    utterance.onend = () => {
      setIsSpeaking(false)
    }
    
    utterance.onerror = (error) => {
      console.error('Speech synthesis error:', error)
      setIsSpeaking(false)
    }
    
    currentUtteranceRef.current = utterance
    synthRef.current.speak(utterance)
  }, [])

  const sendMessage = useCallback(async (messageContent: string) => {
    if (!messageContent.trim() || isLoading) return

    const userMessage: ChatMessage = {
      id: createMessageId(),
      role: 'user',
      content: messageContent,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setErrorMessage(null)
    setIsLoading(true)

    try {
      // Build context-aware prompt
      const contextPrompt = `You are an AI tutor helping a student learn about "${moduleTitle}".

${moduleDescription ? `Module Description: ${moduleDescription}\n` : ''}
${currentSection ? `Current Section: ${currentSection}\n` : ''}
${currentSectionContent ? `Section Content (for context): ${currentSectionContent.substring(0, 500)}...\n` : ''}

Student's question: ${messageContent}

Please provide a helpful, educational response that:
1. Directly addresses the student's question
2. References the module content when relevant
3. Uses clear, easy-to-understand language
4. Provides examples when helpful
5. Encourages learning

Keep your response concise but comprehensive (2-4 paragraphs max).`

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: contextPrompt,
          packId: (session?.user as any)?.packId || 'free',
          layer: (session?.user as any)?.layer || null,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to get response from AI tutor')
      }

      const data = await response.json()
      const assistantText = data.response?.trim() || ''

      const assistantMessage: ChatMessage = {
        id: createMessageId(),
        role: 'assistant',
        content: assistantText,
        timestamp: new Date()
      }

      setMessages(prev => [...prev, assistantMessage])
      
      // Speak response if voice mode is enabled
      if (isVoiceMode) {
        speakText(assistantText)
      }
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Connection error. Please check your internet and try again.'
      setErrorMessage(errorMsg)
      const errorResponse: ChatMessage = {
        id: createMessageId(),
        role: 'assistant',
        content: `Sorry, something went wrong: ${errorMsg}`,
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorResponse])
    } finally {
      setIsLoading(false)
    }
  }, [moduleTitle, moduleDescription, currentSection, currentSectionContent, isLoading, session, createMessageId, isVoiceMode, speakText])

  const handleQuickAction = useCallback((action: typeof QUICK_ACTIONS[0]) => {
    const prompt = currentSectionContent 
      ? `${action.prompt} Here's the current section: "${currentSection}"`
      : action.prompt
    sendMessage(prompt)
  }, [currentSection, currentSectionContent, sendMessage])

  const handleSend = useCallback(() => {
    if (input.trim()) {
      sendMessage(input.trim())
    }
  }, [input, sendMessage])
  
  // Voice mode input functions
  const startListening = useCallback(() => {
    if (!recognitionRef.current) {
      setErrorMessage('Speech recognition is not supported in your browser. Please use Chrome or Edge.')
      return
    }
    
    try {
      setIsListening(true)
      setErrorMessage(null)
      recognitionRef.current.start()
    } catch (error) {
      console.error('Error starting speech recognition:', error)
      setIsListening(false)
      setErrorMessage('Could not start voice recognition. Please try again.')
    }
  }, [])
  
  const stopListening = useCallback(() => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop()
      setIsListening(false)
    }
  }, [isListening])
  
  const stopSpeaking = useCallback(() => {
    if (synthRef.current) {
      synthRef.current.cancel()
      setIsSpeaking(false)
    }
  }, [])
  
  const toggleVoiceMode = useCallback(() => {
    const newVoiceMode = !isVoiceMode
    setIsVoiceMode(newVoiceMode)
    
    if (!newVoiceMode) {
      // Turn off voice mode - stop any ongoing speech/listening
      stopListening()
      stopSpeaking()
    }
  }, [isVoiceMode, stopListening, stopSpeaking])

  // Floating button when closed (only if not embedded)
  if (!isOpen && !isEmbedded) {
    return (
      <motion.button
        onClick={handleToggle}
        className="fixed bottom-20 sm:bottom-6 right-4 sm:right-6 z-[9998] p-3 sm:p-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full shadow-2xl hover:shadow-3xl flex items-center space-x-2 sm:space-x-3 transition-all duration-300 group touch-manipulation"
        initial={{ opacity: 0, scale: 0.8, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        whileHover={{ scale: 1.1, y: -2 }}
        whileTap={{ scale: 0.95 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      >
        <motion.div
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
        >
          <Brain className="w-5 h-5 sm:w-6 sm:h-6" />
        </motion.div>
        <span className="font-semibold text-sm sm:text-base hidden sm:inline">AI Tutor</span>
        <motion.div
          className="absolute -top-1 -right-1 w-2.5 h-2.5 sm:w-3 sm:h-3 bg-green-400 rounded-full"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      </motion.button>
    )
  }

  // Minimized state (only if not embedded) - Mobile optimized
  if (isMinimized && !isEmbedded) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="fixed bottom-20 sm:bottom-6 right-4 sm:right-6 z-[9998] bg-white rounded-lg shadow-2xl border-2 border-blue-200 overflow-hidden max-w-[calc(100vw-2rem)]"
      >
        <div className="flex items-center justify-between p-2 sm:p-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
          <div className="flex items-center space-x-2">
            <Brain className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="font-semibold text-xs sm:text-sm">AI Tutor</span>
          </div>
          <div className="flex items-center space-x-1 sm:space-x-2">
            <button
              onClick={handleMinimize}
              className="p-1.5 sm:p-1 hover:bg-white/20 rounded transition-colors touch-manipulation"
            >
              <Maximize2 className="w-4 h-4" />
            </button>
            <button
              onClick={handleToggle}
              className="p-1.5 sm:p-1 hover:bg-white/20 rounded transition-colors touch-manipulation"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
        {messages.length > 1 && (
          <div className="px-2 sm:px-3 py-1.5 sm:py-2 text-xs text-gray-600 bg-gray-50">
            {messages.filter(m => m.role !== 'system').length} messages
          </div>
        )}
      </motion.div>
    )
  }

  // Full chat interface - Mobile optimized
  return (
    <motion.div
      initial={isEmbedded ? { opacity: 1 } : { opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, y: 20 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className={isEmbedded 
        ? "w-full h-full bg-white flex flex-col overflow-hidden"
        : "fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-[9998] w-[calc(100vw-2rem)] sm:w-full sm:max-w-md h-[calc(100vh-5rem)] sm:h-[600px] bg-white rounded-xl shadow-2xl border-2 border-blue-200 flex flex-col overflow-hidden"
      }
      style={isEmbedded ? {} : { maxHeight: 'calc(100vh - 1rem)' }}
    >
      {/* Header - Hidden when embedded (panel has its own header) */}
      {!isEmbedded && (
        <motion.div
          className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="flex items-center space-x-2 sm:space-x-3 flex-1 min-w-0">
            <motion.div
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 3, repeat: Infinity, repeatDelay: 2 }}
              className="flex-shrink-0"
            >
              <Brain className="w-5 h-5 sm:w-6 sm:h-6" />
            </motion.div>
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-sm sm:text-base lg:text-lg truncate">{moduleTitle}</h3>
              <p className="text-xs text-blue-100 truncate">AI Tutor Assistant</p>
            </div>
          </div>
          <div className="flex items-center space-x-1 flex-shrink-0">
            {/* Voice Mode Toggle */}
            <button
              onClick={toggleVoiceMode}
              className={`p-1.5 sm:p-2 rounded-lg transition-colors touch-manipulation ${
                isVoiceMode 
                  ? 'bg-white/30 hover:bg-white/40' 
                  : 'hover:bg-white/20'
              }`}
              title={isVoiceMode ? 'Disable Voice Mode' : 'Enable Voice Mode'}
            >
              {isVoiceMode ? (
                <Volume2 className="w-4 h-4" />
              ) : (
                <VolumeX className="w-4 h-4" />
              )}
            </button>
            <button
              onClick={handleMinimize}
              className="p-1.5 sm:p-2 hover:bg-white/20 rounded-lg transition-colors touch-manipulation"
              title="Minimize"
            >
              <Minimize2 className="w-4 h-4" />
            </button>
            <button
              onClick={handleToggle}
              className="p-1.5 sm:p-2 hover:bg-white/20 rounded-lg transition-colors touch-manipulation"
              title="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      )}
      
      {/* Voice Mode Toggle in Panel Header Area (when embedded) */}
      {isEmbedded && (
        <div className="px-4 py-2 bg-blue-50 border-b border-blue-200 flex items-center justify-end">
          <button
            onClick={toggleVoiceMode}
            className={`p-2 rounded-lg transition-colors ${
              isVoiceMode 
                ? 'bg-blue-600 text-white hover:bg-blue-700' 
                : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-300'
            }`}
            title={isVoiceMode ? 'Disable Voice Mode' : 'Enable Voice Mode'}
          >
            {isVoiceMode ? (
              <Volume2 className="w-4 h-4" />
            ) : (
              <VolumeX className="w-4 h-4" />
            )}
          </button>
        </div>
      )}

      {/* Current Section Indicator */}
      {currentSection && (
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="px-4 py-2 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-100"
        >
          <div className="flex items-center space-x-2 text-sm">
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Target className="w-4 h-4 text-blue-600" />
            </motion.div>
            <span className="text-blue-700 font-medium truncate">Learning: {currentSection}</span>
          </div>
        </motion.div>
      )}

      {/* Messages Area - Mobile optimized */}
      <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3 sm:space-y-4 bg-gradient-to-b from-gray-50 to-white scroll-smooth">
        <AnimatePresence>
          {messages.map((message, index) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2, delay: index * 0.05 }}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {message.role === 'system' && (
                <div className="w-full">
                  <motion.div
                    className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4 text-sm text-gray-700"
                    initial={{ scale: 0.9 }}
                    animate={{ scale: 1 }}
                  >
                    <div className="flex items-start space-x-2">
                      <Brain className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <p className="font-medium text-blue-900 mb-2">{message.content}</p>
                        {/* Quick Actions - Mobile optimized */}
                        <div className="grid grid-cols-2 gap-2 mt-3">
                          {QUICK_ACTIONS.map((action) => (
                            <motion.button
                              key={action.id}
                              onClick={() => handleQuickAction(action)}
                              className="flex items-center space-x-1.5 sm:space-x-2 p-1.5 sm:p-2 bg-white hover:bg-blue-100 rounded-lg border border-blue-200 text-xs font-medium text-blue-700 transition-all group touch-manipulation"
                              whileHover={{ scale: 1.05, x: 2 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              <action.icon className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
                              <span className="truncate text-xs">{action.label}</span>
                            </motion.button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </div>
              )}
              {message.role !== 'system' && (
                <motion.div
                  className={`max-w-[85%] sm:max-w-[85%] rounded-xl sm:rounded-2xl p-2.5 sm:p-3 shadow-sm ${
                    message.role === 'user'
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white'
                      : 'bg-white text-gray-800 border-2 border-blue-100'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                >
                  {message.role === 'assistant' && (
                    <div className="flex items-center space-x-1.5 sm:space-x-2 mb-1.5 sm:mb-2">
                      <Brain className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-600 flex-shrink-0" />
                      <span className="text-xs font-semibold text-blue-600">AI Tutor</span>
                    </div>
                  )}
                  <p className="text-xs sm:text-sm leading-relaxed whitespace-pre-wrap break-words">{message.content}</p>
                  <span className={`text-xs mt-1 block ${message.role === 'user' ? 'text-blue-100' : 'text-gray-400'}`}>
                    {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </motion.div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Loading Indicator */}
        {isLoading && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-start"
          >
            <motion.div
              className="bg-white border-2 border-blue-100 rounded-2xl p-4 flex items-center space-x-3"
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              >
                <Sparkles className="w-5 h-5 text-blue-600" />
              </motion.div>
              <span className="text-sm text-gray-600">AI Tutor is thinking...</span>
            </motion.div>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Error Message */}
      {errorMessage && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mx-4 mb-2 p-3 bg-red-50 border-2 border-red-200 rounded-lg text-sm text-red-700"
        >
          {errorMessage}
        </motion.div>
      )}

      {/* Input Area - Mobile optimized */}
      <div className="border-t-2 border-blue-100 bg-white p-3 sm:p-4">
        {/* Voice Mode Indicator */}
        {isVoiceMode && (
          <div className="mb-2 px-2.5 sm:px-3 py-1.5 sm:py-2 bg-blue-50 border border-blue-200 rounded-lg flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center space-x-1.5 sm:space-x-2">
              <Volume2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-600 flex-shrink-0" />
              <span className="text-xs text-blue-700 font-medium">Voice Mode Active</span>
            </div>
            {isListening && (
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
                className="flex items-center space-x-1.5 sm:space-x-2"
              >
                <Mic className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-500 flex-shrink-0" />
                <span className="text-xs text-blue-600">Listening...</span>
              </motion.div>
            )}
            {isSpeaking && (
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
                className="flex items-center space-x-1.5 sm:space-x-2"
              >
                <Volume2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-500 flex-shrink-0" />
                <span className="text-xs text-green-600">Speaking...</span>
              </motion.div>
            )}
          </div>
        )}
        <div className="flex items-end space-x-2">
          <div className="flex-1 relative">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault()
                  handleSend()
                }
              }}
              placeholder={isVoiceMode ? "Type or use microphone to ask..." : "Ask your tutor anything about this module..."}
              disabled={isLoading || isListening}
              className="w-full px-3 sm:px-4 py-2.5 sm:py-3 pr-10 sm:pr-12 border-2 border-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 text-gray-900 placeholder-gray-400 disabled:opacity-50 text-base"
            />
            {isVoiceMode ? (
              <button
                onClick={isListening ? stopListening : startListening}
                disabled={isLoading}
                className={`absolute right-2 sm:right-3 top-1/2 transform -translate-y-1/2 p-1.5 rounded-lg transition-colors touch-manipulation ${
                  isListening 
                    ? 'bg-blue-100 text-blue-600 hover:bg-blue-200' 
                    : 'bg-blue-100 text-blue-600 hover:bg-blue-200'
                }`}
                title={isListening ? 'Stop listening' : 'Start voice input'}
              >
                {isListening ? (
                  <MicOff className="w-4 h-4" />
                ) : (
                  <Mic className="w-4 h-4" />
                )}
              </button>
            ) : (
              <MessageSquare className="absolute right-2 sm:right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
            )}
          </div>
          <motion.button
            onClick={handleSend}
            disabled={!input.trim() || isLoading || isListening}
            className="p-2.5 sm:p-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all touch-manipulation flex-shrink-0"
            whileHover={{ scale: input.trim() && !isLoading && !isListening ? 1.05 : 1 }}
            whileTap={{ scale: input.trim() && !isLoading && !isListening ? 0.95 : 1 }}
          >
            <Send className="w-4 h-4 sm:w-5 sm:h-5" />
          </motion.button>
        </div>
        <p className="text-xs text-gray-500 mt-2 text-center px-1">
          {isVoiceMode 
            ? '🎤 Voice mode: Click microphone to ask questions, responses will be spoken aloud' 
            : '💡 Tip: Use quick actions above for instant help!'}
        </p>
      </div>
    </motion.div>
  )
}

