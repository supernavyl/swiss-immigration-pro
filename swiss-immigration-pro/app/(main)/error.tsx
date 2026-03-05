"use client";

import { useEffect } from "react";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

function categorizeError(error: Error): { title: string; message: string } {
  const msg = error.message?.toLowerCase() ?? ''
  if (msg.includes('fetch') || msg.includes('network') || msg.includes('failed to load')) {
    return {
      title: 'Connection issue',
      message: 'Could not reach the server. Check your internet connection and try again.',
    }
  }
  if (msg.includes('401') || msg.includes('unauthorized') || msg.includes('session')) {
    return {
      title: 'Session expired',
      message: 'Your session has ended. Please sign in again to continue.',
    }
  }
  if (msg.includes('403') || msg.includes('forbidden') || msg.includes('permission')) {
    return {
      title: 'Access denied',
      message: "You don't have permission to view this page.",
    }
  }
  return {
    title: 'Something went wrong',
    message: 'An unexpected error occurred. Please try again or return to the home page.',
  }
}

export default function MainError({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error("Route error:", error);
  }, [error]);

  const { title, message } = categorizeError(error)

  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-950 px-4">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="mx-auto w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
          <AlertTriangle className="w-8 h-8 text-red-600 dark:text-red-400" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          {title}
        </h1>
        <p className="text-gray-600 dark:text-gray-400">{message}</p>
        {error.digest && (
          <p className="text-xs text-gray-400 dark:text-gray-500 font-mono bg-gray-50 dark:bg-gray-900 rounded px-3 py-2">
            Error code: {error.digest}
          </p>
        )}
        <div className="flex gap-3 justify-center">
          <button
            onClick={reset}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            <RefreshCw className="w-4 h-4" />
            Try Again
          </button>
          <a
            href="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors font-medium"
          >
            <Home className="w-4 h-4" />
            Home
          </a>
        </div>
      </div>
    </div>
  );
}
