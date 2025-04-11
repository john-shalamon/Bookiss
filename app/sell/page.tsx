import { SellForm } from "@/components/sell-form"
import { DashboardHeader } from "@/components/dashboard-header"

export default function SellPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <DashboardHeader />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Sell Your Books</h1>
          <SellForm />
        </div>
      </main>
    </div>
  )
}
