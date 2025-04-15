export type Book = {
  id: string
  title: string
  created_at: string
  image_url?: string
  seller_name: string
  seller_image: string
  price: number
  contact_number: string
  subjectName: string
  edition: string
  payment_method: string
  qr_code_url?: string
  user_id: string
}

export type User = {
  id: string
  name: string
  email: string
}
