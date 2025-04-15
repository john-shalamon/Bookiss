"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import type { Book } from "@/types/database.types"
import { UserBookCard } from "./user-book-card"

interface Props {
  userEmail: string | null
}

export function UserBookGrid({ userEmail }: Props) {
  const [books, setBooks] = useState<Book[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchBooks = async () => {
      if (!userEmail) return

      // Step 1: Get user_id from auth.users using email
      const { data: users, error: userError } = await supabase
        .from("profiles")
        .select("id")
        .eq("email", userEmail)
        .single()

      if (userError || !users) {
        console.error("User not found or error:", userError)
        return
      }

      const userId = users.id

      // Step 2: Fetch books using user_id
      const { data: booksData, error: booksError } = await supabase
        .from("books")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })

      if (booksError) {
        console.error("Error fetching user's books:", booksError)
      } else {
        setBooks(booksData as Book[])
      }

      setLoading(false)
    }

    fetchBooks()
  }, [userEmail])

  if (loading) return <div>Loading your books...</div>

  return (
    <div>
      {books.length === 0 ? (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">You haven't listed any books yet</h3>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Start by uploading your first book for sale!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {books.map((book) => (
            <UserBookCard key={book.id} book={book} onDelete={(id) => setBooks(books.filter((b) => b.id !== id))} />
          ))}
        </div>
      )}
    </div>
  )
}
