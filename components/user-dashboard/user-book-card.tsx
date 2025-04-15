"use client"

import Image from "next/image"
import type { Book } from "@/types/database.types"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { supabase } from "@/lib/supabase"
import { useState } from "react"

interface BookCardProps {
  book: Book
  onDelete: (id: string) => void
}

export function UserBookCard({ book, onDelete }: BookCardProps) {
  const [deleting, setDeleting] = useState(false)

  const handleDelete = async () => {
    const confirmDelete = confirm(`Are you sure you want to delete "${book.title}"?`)
    if (!confirmDelete) return

    setDeleting(true)
    const { error } = await supabase.from("books").delete().eq("id", book.id)

    if (error) {
      alert("Error deleting book")
      console.error("Delete error:", error)
    } else {
      onDelete(book.id)
    }

    setDeleting(false)
  }

  return (
    <Card className="overflow-hidden transition-all duration-200 hover:shadow-lg">
      <div className="relative h-48 bg-gray-100 dark:bg-gray-700">
        {book.image_url ? (
          <Image src={book.image_url || "/placeholder.svg"} alt={book.image_url} fill className="object-cover" />
        ) : (
          <div className="flex h-full items-center justify-center text-gray-400">No image available</div>
        )}
      </div>

      <CardContent className="p-4">
        <h3 className="font-semibold text-lg line-clamp-1 text-black dark:text-white">{book.title}</h3>
        <p className="text-purple-600 dark:text-purple-400 font-bold mt-1">₹{book.price.toFixed(2)}</p>
      </CardContent>

      <CardFooter className="p-4 pt-0">
        <Button className="w-full" variant="destructive" onClick={handleDelete} disabled={deleting}>
          {deleting ? "Deleting..." : "Delete"}
        </Button>
      </CardFooter>
    </Card>
  )
}
