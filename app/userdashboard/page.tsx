"use client"

import { Button } from "@/components/ui/button"
import { User, BookOpen, LogOut, ArrowLeft } from "lucide-react"
import { supabase } from "@/lib/supabase"
import { useRouter } from "next/navigation"
import { useEffect, useState, Suspense } from "react"
import { useToast } from "@/hooks/use-toast"
import { BookGridSkeleton } from "@/components/book-grid-skeleton"
import { UserBookGrid } from "@/components/user-dashboard/user-book-grid"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"


export default function Userdashboard() {
    const [userEmail, setUserEmail] = useState<string | null>(null)
    const { toast } = useToast()

    useEffect(() => {
        const checkUser = async () => {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) {
                router.push("/")
            } else {
                setUserEmail(user.email ?? null)
            }
        }

        checkUser()
    }, [])

    const router = useRouter()

    const handleLogout = async () => {
        await supabase.auth.signOut()
        toast({
          title: "Logged out successfully",
        })
        router.push("/")
    }

    return (
        <>
        <header className="bg-white dark:bg-gray-800 shadow-sm">
            <div className="container mx-auto px-4 py-4">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <button onClick={() => router.back()} className="mr-4">
                            <ArrowLeft className="h-8 w-8 text-purple-600 dark:text-purple-400" />
                        </button>
                        <BookOpen className="h-8 w-8 text-purple-600 dark:text-purple-400 mr-2" />
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">College Book Marketplace</h1>
                    </div>
                    {userEmail && (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="rounded-full">
                                    <User className="h-5 w-5" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem>
                                    <User className="mr-2 h-4 w-4" />
                                    {userEmail || "Guest"}
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={handleLogout}>
                                    <LogOut className="mr-2 h-4 w-4" />
                                    Logout
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    )}
                </div>
            </div>
        </header>
        <div className="container mx-auto px-4 py-8">
            <Suspense fallback={<BookGridSkeleton />}>
                <UserBookGrid userEmail={userEmail} />
            </Suspense>
            </div></>
    )
}
