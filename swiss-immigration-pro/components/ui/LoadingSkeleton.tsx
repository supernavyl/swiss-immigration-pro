function SkeletonBox({ className }: { className: string }) {
  return <div className={`bg-gray-200 dark:bg-gray-700 rounded animate-pulse ${className}`} />
}

export function CardSkeleton() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg animate-pulse">
      <SkeletonBox className="h-6 w-3/4 mb-4" />
      <SkeletonBox className="h-4 w-full mb-2" />
      <SkeletonBox className="h-4 w-5/6 mb-4" />
      <SkeletonBox className="h-10 w-1/3" />
    </div>
  )
}

export function ArticleSkeleton() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg animate-pulse space-y-4">
      <SkeletonBox className="h-8 w-1/2" />
      <SkeletonBox className="h-4 w-full" />
      <SkeletonBox className="h-4 w-full" />
      <SkeletonBox className="h-4 w-3/4" />
      <SkeletonBox className="h-64 w-full mt-6" />
      <SkeletonBox className="h-4 w-full mt-4" />
      <SkeletonBox className="h-4 w-full" />
      <SkeletonBox className="h-4 w-5/6" />
    </div>
  )
}

export function ListSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg animate-pulse divide-y divide-gray-100 dark:divide-gray-700">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 p-4">
          <SkeletonBox className="h-10 w-10 rounded-full shrink-0" />
          <div className="flex-1 space-y-2">
            <SkeletonBox className="h-4 w-1/3" />
            <SkeletonBox className="h-3 w-2/3" />
          </div>
          <SkeletonBox className="h-6 w-16 rounded-full" />
        </div>
      ))}
    </div>
  )
}

export function GridSkeleton({ cols = 3, rows = 2 }: { cols?: number; rows?: number }) {
  return (
    <div
      className="grid gap-6 animate-pulse"
      style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
    >
      {Array.from({ length: cols * rows }).map((_, i) => (
        <div key={i} className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-lg space-y-3">
          <SkeletonBox className="h-40 w-full" />
          <SkeletonBox className="h-5 w-3/4" />
          <SkeletonBox className="h-4 w-full" />
          <SkeletonBox className="h-4 w-5/6" />
          <SkeletonBox className="h-9 w-1/2 mt-2" />
        </div>
      ))}
    </div>
  )
}

export function TableSkeleton({ rows = 5, cols = 4 }: { rows?: number; cols?: number }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden animate-pulse">
      {/* Header */}
      <div className="flex gap-4 px-6 py-4 bg-gray-50 dark:bg-gray-900 border-b border-gray-100 dark:border-gray-700">
        {Array.from({ length: cols }).map((_, i) => (
          <SkeletonBox key={i} className={`h-4 ${i === 0 ? 'w-1/4' : 'flex-1'}`} />
        ))}
      </div>
      {/* Rows */}
      <div className="divide-y divide-gray-100 dark:divide-gray-700">
        {Array.from({ length: rows }).map((_, ri) => (
          <div key={ri} className="flex gap-4 px-6 py-4">
            {Array.from({ length: cols }).map((_, ci) => (
              <SkeletonBox key={ci} className={`h-4 ${ci === 0 ? 'w-1/4' : 'flex-1'}`} />
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

export function ProfileSkeleton() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg animate-pulse">
      <div className="flex items-center gap-6 mb-8">
        <SkeletonBox className="h-20 w-20 rounded-full shrink-0" />
        <div className="flex-1 space-y-3">
          <SkeletonBox className="h-6 w-48" />
          <SkeletonBox className="h-4 w-32" />
          <SkeletonBox className="h-4 w-64" />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-6 mb-8">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="space-y-2">
            <SkeletonBox className="h-3 w-24" />
            <SkeletonBox className="h-5 w-40" />
          </div>
        ))}
      </div>
      <SkeletonBox className="h-px w-full mb-6" />
      <div className="space-y-3">
        <SkeletonBox className="h-4 w-full" />
        <SkeletonBox className="h-4 w-full" />
        <SkeletonBox className="h-4 w-3/4" />
      </div>
    </div>
  )
}
