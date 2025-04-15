"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { supabase } from "@/lib/supabase"
import { useToast } from "@/hooks/use-toast"
import { Loader2, Upload, X, ImageIcon, User } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { v4 as uuidv4 } from "uuid"

export function SellForm() {
  const [bookName, setBookName] = useState("")
  const [sellerName, setsellerName] = useState("")
  const [subjectName, setSubjectName] = useState("")
  const [edition, setEdition] = useState("")
  const [price, setPrice] = useState("")
  const [description, setDescription] = useState("")
  const [contactNumber, setContactNumber] = useState("")
  const [bookImage, setBookImage] = useState<File | null>(null)
  const [bookImagePreview, setBookImagePreview] = useState<string | null>(null)
  const [sellerImage, setSellerImage] = useState<File | null>(null)
  const [sellerImagePreview, setSellerImagePreview] = useState<string | null>(null)
  const [qrCode, setQrCode] = useState<File | null>(null)
  const [qrCodePreview, setQrCodePreview] = useState<string | null>(null)
  const [paymentMethods, setPaymentMethods] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [dragActive, setDragActive] = useState<string | null>(null)

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
  }, [router])

  const handleDrag = (e: React.DragEvent, type: string) => {
    e.preventDefault()
    e.stopPropagation()

    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(type)
    } else if (e.type === "dragleave") {
      setDragActive(null)
    }
  }

  const handleDrop = (e: React.DragEvent, type: string) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(null)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0], type)
    }
  }

  const handleFileChange = (file: File, type: string) => {
    if (!file.type.includes("image/")) {
      toast({
        title: "Invalid file type",
        description: "Please upload an image file",
        variant: "destructive",
      })
      return
    }

    const preview = URL.createObjectURL(file)

    if (type === "book") {
      setBookImage(file)
      setBookImagePreview(preview)
    } else if (type === "seller") {
      setSellerImage(file)
      setSellerImagePreview(preview)
    } else if (type === "qr") {
      setQrCode(file)
      setQrCodePreview(preview)
    }
  }

  const handlePaymentMethodChange = (method: string) => {
    setPaymentMethods((prev) => {
      if (prev.includes(method)) {
        return prev.filter((m) => m !== method)
      } else {
        return [...prev, method]
      }
    })
  }

  const uploadImage = async (file: File, path: string) => {
    const fileExt = file.name.split(".").pop()
    const fileName = `${uuidv4()}.${fileExt}`
    const filePath = `${path}/${fileName}`

    const { error: uploadError } = await supabase.storage.from("book-marketplace").upload(filePath, file)

    if (uploadError) {
      throw uploadError
    }

    const { data } = supabase.storage.from("book-marketplace").getPublicUrl(filePath)

    return data.publicUrl
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    if (!bookImage) {
      toast({
        title: "Book image required",
        description: "Please upload an image of the book",
        variant: "destructive",
      });
      return;
    }
  
    setIsLoading(true);
  
    try {
      // Upload images
      const bookImageUrl = await uploadImage(bookImage, "book-images");
      const qrCodeUrl = qrCode ? await uploadImage(qrCode, "qr-codes") : null;
      const sellerImageUrl = sellerImage ? await uploadImage(sellerImage, "seller-images") : null;
  
      // Insert book (match your schema!)
      const { error } = await supabase.from("books").insert([
        {
          title: bookName,
          seller_name: sellerName || "Unknown",
          description: description || null,
          price: Number(price),
          condition: "Good",
          subject: subjectName || null,
          edition: edition || null,
          image_url: bookImageUrl,
          qr_code_url: qrCodeUrl || null,
          payment_method: paymentMethods.join(", ") || null,
          user_id: user.id,
          contact_number: contactNumber ? Number(contactNumber) : null,
          seller_image: sellerImageUrl || null,
        },
      ]);

      console.log("Book data:", error);
  
      if (error) throw error;
  
      toast({
        title: "Book listed successfully!",
        description: "Your book is now available for sale.",
      });
      router.push("/dashboard");
    } catch (error: any) {
      toast({
        title: "Failed to list book",
        description: error.message || "Invalid data format",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="book-image">Book Image (Required)</Label>
            <div
              className={`border-2 border-dashed rounded-lg p-4 text-center ${
                dragActive === "book"
                  ? "border-purple-500 bg-purple-50 dark:bg-purple-900/20"
                  : "border-gray-300 dark:border-gray-700"
              }`}
              onDragEnter={(e) => handleDrag(e, "book")}
              onDragOver={(e) => handleDrag(e, "book")}
              onDragLeave={(e) => handleDrag(e, "book")}
              onDrop={(e) => handleDrop(e, "book")}
            >
              {bookImagePreview ? (
                <div className="relative w-full h-48">
                  <Image
                    src={bookImagePreview || "/placeholder.svg"}
                    alt="Book preview"
                    fill
                    className="object-contain"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2"
                    onClick={() => {
                      setBookImage(null)
                      setBookImagePreview(null)
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div className="py-8">
                  <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="mt-4 flex text-sm leading-6 text-gray-600 dark:text-gray-400">
                    <label
                      htmlFor="book-image-upload"
                      className="relative cursor-pointer rounded-md bg-white dark:bg-gray-800 font-semibold text-purple-600 dark:text-purple-400 focus-within:outline-none focus-within:ring-2 focus-within:ring-purple-600 focus-within:ring-offset-2 hover:text-purple-500"
                    >
                      <span>Upload a file</span>
                      <input
                        id="book-image-upload"
                        name="book-image-upload"
                        type="file"
                        className="sr-only"
                        accept="image/*"
                        onChange={(e) => {
                          if (e.target.files && e.target.files[0]) {
                            handleFileChange(e.target.files[0], "book")
                          }
                        }}
                      />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">PNG, JPG, GIF up to 10MB</p>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="book-name">Book Name</Label>
            <Input id="book-name" value={bookName} onChange={(e) => setBookName(e.target.value)} placeholder="Enter the book name" required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="author">Author Name</Label>
            <Input id="author" value={sellerName} onChange={(e) => setsellerName(e.target.value)} placeholder="Enter the author name" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="subject-name">Subject Name</Label>
            <Input
              id="subject-name"
              value={subjectName}
              onChange={(e) => setSubjectName(e.target.value)}
              placeholder="Enter the subject name"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edition">Edition</Label>
            <Input
              id="edition"
              value={edition}
              onChange={(e) => setEdition(e.target.value)}
              placeholder="Enter the edition of the book"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="book-description">Book Description (Optional)</Label>
            <Input
              id="book-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide a brief description of the book"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="price">Price (₹)</Label>
            <Input
              id="price"
              type="number"
              min="0"
              step="0.01"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="Enter the price of the book"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="contact-number">Contact Number</Label>
            <Input
              id="contact-number"
              type="tel"
              value={contactNumber}
              onChange={(e) => setContactNumber(e.target.value)}
              placeholder="Enter your contact number"
              maxLength={10}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="seller-image">Your Photo (Optional)</Label>
            <div
              className={`border-2 border-dashed rounded-lg p-4 text-center ${
                dragActive === "seller"
                  ? "border-purple-500 bg-purple-50 dark:bg-purple-900/20"
                  : "border-gray-300 dark:border-gray-700"
              }`}
              onDragEnter={(e) => handleDrag(e, "seller")}
              onDragOver={(e) => handleDrag(e, "seller")}
              onDragLeave={(e) => handleDrag(e, "seller")}
              onDrop={(e) => handleDrop(e, "seller")}
            >
              {sellerImagePreview ? (
                <div className="relative w-32 h-32 mx-auto">
                  <Image
                    src={sellerImagePreview || "/placeholder.svg"}
                    alt="Seller preview"
                    fill
                    className="object-cover rounded-full"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute top-0 right-0"
                    onClick={() => {
                      setSellerImage(null)
                      setSellerImagePreview(null)
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div className="py-4">
                  <User className="mx-auto h-10 w-10 text-gray-400" />
                  <div className="mt-2 flex text-sm leading-6 text-gray-600 dark:text-gray-400">
                    <label
                      htmlFor="seller-image-upload"
                      className="relative cursor-pointer rounded-md bg-white dark:bg-gray-800 font-semibold text-purple-600 dark:text-purple-400 focus-within:outline-none focus-within:ring-2 focus-within:ring-purple-600 focus-within:ring-offset-2 hover:text-purple-500"
                    >
                      <span>Upload a file</span>
                      <input
                        id="seller-image-upload"
                        name="seller-image-upload"
                        type="file"
                        className="sr-only"
                        accept="image/*"
                        onChange={(e) => {
                          if (e.target.files && e.target.files[0]) {
                            handleFileChange(e.target.files[0], "seller")
                          }
                        }}
                      />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                </div>
              )}
            </div>
          </div>

            <div className="space-y-3">
            <Label>Payment Method</Label>
            <div className="grid grid-cols-1 gap-2">
              {["Cash", "Google Pay", "Phone Pay"].map((method) => (
              <div key={method} className="flex items-center space-x-2">
                <Checkbox
                id={`payment-${method}`}
                checked={paymentMethods.includes(method)}
                onCheckedChange={() => setPaymentMethods([method])}
                />
                <Label htmlFor={`payment-${method}`} className="font-normal">
                {method}
                </Label>
              </div>
              ))}
            </div>
            </div>

          <div className="space-y-2">
            <Label htmlFor="qr-code">Payment QR Code (Optional)</Label>
            <div
              className={`border-2 border-dashed rounded-lg p-4 text-center ${
                dragActive === "qr"
                  ? "border-purple-500 bg-purple-50 dark:bg-purple-900/20"
                  : "border-gray-300 dark:border-gray-700"
              }`}
              onDragEnter={(e) => handleDrag(e, "qr")}
              onDragOver={(e) => handleDrag(e, "qr")}
              onDragLeave={(e) => handleDrag(e, "qr")}
              onDrop={(e) => handleDrop(e, "qr")}
            >
              {qrCodePreview ? (
                <div className="relative w-48 h-48 mx-auto">
                  <Image
                    src={qrCodePreview || "/placeholder.svg"}
                    alt="QR Code preview"
                    fill
                    className="object-contain"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2"
                    onClick={() => {
                      setQrCode(null)
                      setQrCodePreview(null)
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div className="py-4">
                  <Upload className="mx-auto h-10 w-10 text-gray-400" />
                  <div className="mt-2 flex text-sm leading-6 text-gray-600 dark:text-gray-400">
                    <label
                      htmlFor="qr-code-upload"
                      className="relative cursor-pointer rounded-md bg-white dark:bg-gray-800 font-semibold text-purple-600 dark:text-purple-400 focus-within:outline-none focus-within:ring-2 focus-within:ring-purple-600 focus-within:ring-offset-2 hover:text-purple-500"
                    >
                      <span>Upload a file</span>
                      <input
                        id="qr-code-upload"
                        name="qr-code-upload"
                        type="file"
                        className="sr-only"
                        accept="image/*"
                        onChange={(e) => {
                          if (e.target.files && e.target.files[0]) {
                            handleFileChange(e.target.files[0], "qr")
                          }
                        }}
                      />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Upload your UPI or payment QR code</p>
                </div>
              )}
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Uploading...
              </>
            ) : (
              "List Book for Sale"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
