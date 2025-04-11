"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { supabase } from "@/lib/supabase"
import { LogOut, Search, Plus, BookOpen, User } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function DashboardHeader() {
  const [searchQuery, setSearchQuery] = useState("")
  const [user, setUser] = useState<any>(null)
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getUser()
      setUser(data.user)

      if (!data.user) {
        router.push("/")
      }
    }

    checkUser()

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_OUT") {
        router.push("/")
      }
    })

    return () => {
      authListener.subscription.unsubscribe()
    }
  }, [router])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    toast({
      title: "Logged out successfully",
    })
    router.push("/")
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    // The search functionality will be handled by the BookGrid component
    // We'll just update the URL to include the search query
    const params = new URLSearchParams(window.location.search)
    if (searchQuery) {
      params.set("search", searchQuery)
    } else {
      params.delete("search")
    }

    const newUrl = `${window.location.pathname}?${params.toString()}`
    window.history.pushState({}, "", newUrl)

    // Trigger a re-render of the BookGrid component
    window.dispatchEvent(new Event("popstate"))
  }

  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center">
            <BookOpen className="h-8 w-8 text-purple-600 dark:text-purple-400 mr-2" />
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">College Book Marketplace</h1>
          </div>

          <form onSubmit={handleSearch} className="w-full md:w-auto md:flex-1 max-w-md mx-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                type="search"
                placeholder="Search books..."
                className="pl-10 w-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </form>

          <div className="flex items-center gap-4">
            <Button asChild variant="default">
              <Link href="/sell">
                <Plus className="mr-2 h-4 w-4" />
                Sell Your Books
              </Link>
            </Button>

            {user && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <User className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
