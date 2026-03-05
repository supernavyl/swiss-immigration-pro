import { CardSkeleton } from '@/components/ui/LoadingSkeleton'

export default function MainLoading() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      {/* Content skeleton */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="h-8 w-64 bg-gray-200 dark:bg-gray-800 rounded mb-4 animate-pulse" />
        <div className="h-4 w-96 max-w-full bg-gray-100 dark:bg-gray-800/60 rounded mb-8 animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
        </div>
      </div>
    </div>
  )
}
