import { RegisterForm } from "@/components/register-form"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-purple-500 to-pink-500 p-4">
      <div className="w-full max-w-md bg-white dark:bg-gray-900 rounded-2xl shadow-xl overflow-hidden">
        <div className="p-8">
          <div className="mb-4">
            <Link
              href="/"
              className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Login
            </Link>
          </div>

          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Create an Account</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">Join the college book marketplace</p>
          </div>

          <RegisterForm />
        </div>
      </div>
    </div>
  )
}
