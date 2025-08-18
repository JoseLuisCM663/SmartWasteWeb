"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, AlertTriangle } from "lucide-react"
import { loginAction } from "@/app/actions/auth"
import { useRouter } from "next/navigation"

export function LoginForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const handleSubmit = async (formData: FormData) => {
    setIsLoading(true)
    setError("")

    try {
      const result = await loginAction(formData)

      if (result.success) {
        router.push("/dashboard")
      } else {
        setError(result.error || "Error al iniciar sesión")
      }
    } catch (err) {
      setError("Error de conexión. Intenta nuevamente.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="bg-white p-8 rounded-lg shadow-lg border border-gray-200">
      <form action={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="email">Correo electrónico</Label>
          <Input id="email" name="email" type="email" placeholder="admin@smartwaste.com" required className="w-full" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Contraseña</Label>
          <Input id="password" name="password" type="password" placeholder="••••••••" required className="w-full" />
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Button type="submit" disabled={isLoading} className="w-full bg-green-600 hover:bg-green-700 text-white">
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Iniciando sesión...
            </>
          ) : (
            "Iniciar sesión"
          )}
        </Button>
      </form>

      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <p className="text-sm text-gray-600 mb-2">Cuentas de prueba:</p>
        <div className="space-y-1 text-xs text-gray-500">
          <p>
            <strong>Admin:</strong> admin@smartwaste.com / admin123
          </p>
          <p>
            <strong>Usuario:</strong> usuario@smartwaste.com / usuario123
          </p>
          <p>
            <strong>Chofer:</strong> chofer@smartwaste.com / chofer123
          </p>
        </div>
      </div>
    </div>
  )
}
