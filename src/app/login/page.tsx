import { LoginForm } from "@/components/login-form"
import { Leaf } from "lucide-react"
import Link from "next/link"

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-gray-50 px-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <Link href="/" className="inline-flex items-center space-x-2 mb-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-600">
              <Leaf className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-gray-900">SmartWaste</span>
          </Link>
          <h2 className="text-3xl font-bold text-gray-900">Iniciar sesión</h2>
          <p className="mt-2 text-sm text-gray-600">Accede a tu plataforma de administración</p>
        </div>
        <LoginForm />
      </div>
    </div>
  )
}
