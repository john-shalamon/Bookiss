import { Skeleton } from "@/components/ui/skeleton"

export function BookGridSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
          <Skeleton className="h-48 w-full" />
          <div className="p-4">
            <Skeleton className="h-6 w-3/4 mb-2" />
            <Skeleton className="h-5 w-1/4 mb-4" />
            <Skeleton className="h-10 w-full" />
          </div>
        </div>
      ))}
    </div>
  )
}
