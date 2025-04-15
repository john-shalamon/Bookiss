"use client"

import Image from "next/image"
import type { Book } from "@/types/database.types"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"

interface BookCardProps {
  book: Book
  onClick: () => void
}

export function BookCard({ book, onClick }: BookCardProps) {
  return (
    <Card className="overflow-hidden transition-all duration-200 hover:shadow-lg">
      {/* <div className="p-4">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">{book.seller_name}</h2>
      </div> */}
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
        <Button onClick={onClick} className="w-full">
          Buy Now
        </Button>
      </CardFooter>
    </Card>
  )
}
