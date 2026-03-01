'use client'

import { ReactNode, useState, useEffect } from 'react'

interface Props {
  children: ReactNode
}

interface ErrorInfo {
  hasError: boolean
  error?: Error
}

export function ErrorBoundary({ children }: Props) {
  const [errorInfo, setErrorInfo] = useState<ErrorInfo>({ hasError: false })

  useEffect(() => {
    const handleError = (error: ErrorEvent) => {
      console.error('Error caught by boundary:', error.error)
      setErrorInfo({ hasError: true, error: error.error })
    }

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      console.error('Unhandled promise rejection:', event.reason)
      setErrorInfo({
        hasError: true,
        error: event.reason instanceof Error ? event.reason : new Error(String(event.reason))
      })
    }

    window.addEventListener('error', handleError)
    window.addEventListener('unhandledrejection', handleUnhandledRejection)

    return () => {
      window.removeEventListener('error', handleError)
      window.removeEventListener('unhandledrejection', handleUnhandledRejection)
    }
  }, [])

  const resetError = () => {
    setErrorInfo({ hasError: false })
    window.location.reload()
  }

  if (errorInfo.hasError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Something went wrong
            </h2>
            <p className="text-gray-600 mb-4">
              {errorInfo.error?.message || 'An unexpected error occurred. Please try again.'}
            </p>
          </div>
          <div className="space-y-3">
            <button
              onClick={resetError}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
            >
              Reload Page
            </button>
            <button
              onClick={() => window.location.href = '/'}
              className="w-full bg-gray-100 hover:bg-gray-200 text-gray-900 font-semibold px-6 py-3 rounded-lg transition-colors"
            >
              Go to Homepage
            </button>
          </div>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
