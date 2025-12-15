"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Loader2,
  AlertTriangle,
  CheckCircle,
  Clock,
  Activity,
  Route,
  Trash2,
  Users
} from "lucide-react"
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts"
import { getDashboardStats } from "@/app/actions/auth"
import { dbUtils } from "@/lib/indexedDB"
import { localStorageUtil } from "@/lib/localStorage"
import { useOnline } from "@/hooks/use-online"

// Tipado de los datos del dashboard
interface DashboardData {
  summary: {
    totalRoutes: number
    activeContainers: number
    connectedSensors: number
    totalUsers: number
  }
  routeCapacity: Array<{ name: string; capacity: number; usage: number }>
  containerUsage: Array<{ day: string; usage: number; collections: number }>
  recentCollections: Array<{ id: number; route: string; container: string; timestamp: string; status: string }>
  sensorReadings: Array<{
    id: number
    sensor: string
    type: string
    value: number
    unit: string
    timestamp: string
    status: string
  }>
  containerStatus: Array<{ name: string; value: number; color: string }>
}

export function DashboardStats() {
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [timeRange, setTimeRange] = useState("7d")
  const [error, setError] = useState("")
  const [isOffline, setIsOffline] = useState(false)
  const router = useRouter()
  const isOnline = useOnline()

  useEffect(() => {
    const token = localStorageUtil.get<string>("access_token")
    console.log("Token en useEffect:", token)

    if (!token) {
      router.push("/login")
    } else {
      loadDashboardData()
    }
  }, [router, timeRange, isOnline])

  const loadDashboardData = async () => {
    try {
      setLoading(true)
      setError("")
      setIsOffline(false)

      if (isOnline) {
        // Online: fetch from server and cache
        const dashboardData = await getDashboardStats(timeRange)
        setData(dashboardData)
        await dbUtils.saveStats({ ...dashboardData, timeRange, timestamp: Date.now() })
        localStorageUtil.set('lastStatsUpdate', Date.now())
      } else {
        // Offline: load from cache
        const cachedData = await dbUtils.getStats() as { timeRange: string; timestamp: number; [key: string]: unknown } | null
        if (cachedData && cachedData.timeRange === timeRange) {
          setData(cachedData as unknown as DashboardData)
          setIsOffline(true)
        } else {
          setError("No hay datos disponibles sin conexión")
        }
      }
    } catch (err) {
      console.error(err)
      // Try to load from cache on error
      try {
        const cachedData = await dbUtils.getStats() as { timeRange: string; timestamp: number; [key: string]: unknown } | null
        if (cachedData && cachedData.timeRange === timeRange) {
          setData(cachedData as unknown as DashboardData)
          setIsOffline(true)
          setError("Mostrando datos en caché")
        } else {
          setError("Error al cargar estadísticas del dashboard")
        }
      } catch (cacheErr) {
        setError("Error al cargar estadísticas del dashboard")
      }
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      completada: { label: "Completada", className: "bg-green-100 text-green-800", icon: CheckCircle },
      en_progreso: { label: "En Progreso", className: "bg-blue-100 text-blue-800", icon: Clock },
      pendiente: { label: "Pendiente", className: "bg-yellow-100 text-yellow-800", icon: Clock },
      normal: { label: "Normal", className: "bg-green-100 text-green-800", icon: CheckCircle },
      alerta: { label: "Alerta", className: "bg-red-100 text-red-800", icon: AlertTriangle }
    }
    const config = statusConfig[status as keyof typeof statusConfig] || {
      label: status,
      className: "bg-gray-100 text-gray-800",
      icon: CheckCircle
    }
    return (
      <Badge className={config.className}>
        <config.icon className="h-3 w-3 mr-1" />
        {config.label}
      </Badge>
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-green-600" />
        <span className="ml-2 text-gray-600">Cargando estadísticas...</span>
      </div>
    )
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    )
  }

  if (!data) return null

  return (
    <div className="space-y-6">
      {isOffline && (
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Modo sin conexión: Mostrando datos en caché. Última actualización: {new Date(localStorageUtil.get<number>('lastStatsUpdate') || 0).toLocaleString()}
          </AlertDescription>
        </Alert>
      )}

      {/* Selector de rango de tiempo */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Dashboard de Estadísticas</h2>
          <p className="text-gray-600">Monitoreo en tiempo real del sistema SmartWaste</p>
        </div>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="24h">Últimas 24 horas</SelectItem>
            <SelectItem value="7d">Últimos 7 días</SelectItem>
            <SelectItem value="30d">Últimos 30 días</SelectItem>
            <SelectItem value="90d">Últimos 90 días</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Tarjetas resumen */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rutas Activas</CardTitle>
            <Route className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.summary.totalRoutes}</div>
            <p className="text-xs text-muted-foreground">Rutas en operación</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Contenedores</CardTitle>
            <Trash2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.summary.activeContainers}</div>
            <p className="text-xs text-muted-foreground">Contenedores activos</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sensores IoT</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.summary.connectedSensors}</div>
            <p className="text-xs text-muted-foreground">Sensores conectados</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Usuarios</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.summary.totalUsers}</div>
            <p className="text-xs text-muted-foreground">Usuarios activos</p>
          </CardContent>
        </Card>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Capacidad por Ruta</CardTitle>
            <CardDescription>Capacidad vs uso actual de contenedores por ruta</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={data.routeCapacity}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="capacity" fill="#e5e7eb" name="Capacidad" />
                <Bar dataKey="usage" fill="#16a34a" name="Uso Actual" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Tendencia de Uso</CardTitle>
            <CardDescription>Uso promedio de contenedores en el tiempo</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={data.containerUsage}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="usage" stroke="#16a34a" strokeWidth={2} name="Uso %" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
