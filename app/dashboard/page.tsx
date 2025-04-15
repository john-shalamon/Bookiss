import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { BookGrid } from "@/components/dashboard/book-grid"
import { Suspense } from "react"
import { BookGridSkeleton } from "@/components/book-grid-skeleton"

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <DashboardHeader />
      <main className="container mx-auto px-4 py-8">
        <Suspense fallback={<BookGridSkeleton />}>
          <BookGrid />
        </Suspense>
      </main>
    </div>
  )
}
