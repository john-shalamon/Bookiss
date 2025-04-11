"use client"

import Image from "next/image"
import type { Book } from "@/types/database.types"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Phone, User, CreditCard } from "lucide-react"

interface BookDetailsModalProps {
  book: Book
  isOpen: boolean
  onClose: () => void
}

export function BookDetailsModal({ book, isOpen, onClose }: BookDetailsModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{book.title}</DialogTitle>
          <DialogDescription>Contact the seller to purchase this book</DialogDescription>
        </DialogHeader>

        <div className="grid gap-6 py-4">
          <div className="flex items-center gap-4">
            <div className="relative h-16 w-16 rounded-full overflow-hidden bg-gray-100">
              {book.seller_image ? (
                <Image
                  src={book.seller_image || "/placeholder.svg"}
                  alt={book.seller_name}
                  fill
                  className="object-cover"
                />
              ) : (
                <User className="h-8 w-8 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-gray-400" />
              )}
            </div>
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white">{book.title}</h4>
              <p className="text-sm text-gray-500 dark:text-gray-400">Seller</p>
            </div>
          </div>

          <div className="grid gap-2">
            <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
              <CreditCard className="h-4 w-4" />
              <span className="font-medium">Price:</span>
              <span className="text-purple-600 dark:text-purple-400 font-bold">₹{book.price.toFixed(2)}</span>
            </div>

            <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
              <Phone className="h-4 w-4" />
              <span className="font-medium">Contact:</span>
              <span>{book.contact_number}</span>
            </div>
          </div>

          <div>
            <h4 className="font-medium text-gray-900 dark:text-white mb-2">Payment Methods</h4>
            <div className="flex flex-wrap gap-2">
              <span className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded-md text-sm">
              {book.payment_method}
              </span>
            </div>
          </div>

          {book.qr_code && (
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white mb-2">Payment QR Code</h4>
              <div className="relative h-48 w-48 mx-auto bg-white p-2 rounded-md">
                <Image src={book.qr_code || "/placeholder.svg"} alt="Payment QR Code" fill className="object-contain" />
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-end">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
