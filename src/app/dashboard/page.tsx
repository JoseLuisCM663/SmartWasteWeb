"use client"

import { useEffect, useState } from "react"
import { getUser } from "@/lib/auth"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Loader2 } from "lucide-react"

interface User {
  id: number
  email: string
  name: string
  role: string
}

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkUser = async () => {
      try {
        const userData = await getUser()
        console.log("Usuario obtenido:", userData)

        if (!userData) {
          window.location.href = "/login"
          return
        }

        setUser(userData)
      } catch (error) {
        console.error("Error al obtener usuario:", error)
        window.location.href = "/login"
      } finally {
        setLoading(false)
      }
    }

    checkUser()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    )
  }

  if (!user) return null

  return <DashboardLayout user={user} />
}
