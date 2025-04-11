export type Book = {
  id: string
  title: string
  created_at: string
  book_name: string
  image_url: string
  seller_name: string
  seller_image: string
  price: number
  contact_number: string
  payment_method: string
  qr_code?: string
  user_id: string
}

export type User = {
  id: string
  name: string
  email: string
}
