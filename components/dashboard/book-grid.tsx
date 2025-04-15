"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import type { Book } from "@/types/database.types"
import { BookCard } from "./book-card"
import { BookDetailsModal } from "./book-details-modal"

export function BookGrid() {
  const [books, setBooks] = useState<Book[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedBook, setSelectedBook] = useState<Book | null>(null)
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    const fetchBooks = async () => {
      setLoading(true)

      // Get search query from URL
      const params = new URLSearchParams(window.location.search)
      const search = params.get("search") || ""
      setSearchQuery(search)

      let query = supabase.from("books").select("*")

      if (search) {
        query = query.ilike("title", `%${search}%`)
      }

      const { data, error } = await query.order("created_at", { ascending: false })

      if (error) {
        console.error("Error fetching books:", error)
      } else {
        setBooks(data as Book[])
      }

      setLoading(false)
    }

    fetchBooks()

    // Listen for URL changes
    const handlePopState = () => {
      fetchBooks()
    }

    window.addEventListener("popstate", handlePopState)

    return () => {
      window.removeEventListener("popstate", handlePopState)
    }
  }, [])

  if (loading) {
    return <div>Loading books...</div>
  }

  return (
    <div>
      {searchQuery && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Search results for: <span className="text-purple-600 dark:text-purple-400">{searchQuery}</span>
          </h2>
        </div>
      )}

      {books.length === 0 ? (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">No books found</h3>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            {searchQuery
              ? `No books matching "${searchQuery}" were found.`
              : "There are no books listed yet. Be the first to sell your books!"}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {books.map((book) => (
            <BookCard key={book.id} book={book} onClick={() => setSelectedBook(book)} />
          ))}
        </div>
      )}

      {selectedBook && (
        <BookDetailsModal book={selectedBook} isOpen={!!selectedBook} onClose={() => setSelectedBook(null)} />
      )}
    </div>
  )
}
