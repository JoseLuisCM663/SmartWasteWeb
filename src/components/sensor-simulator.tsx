"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Loader2, Beaker, CheckCircle, AlertTriangle, Activity } from "lucide-react"
import { generateSensorReadings, getAllSensors } from "@/app/actions/auth"
import { useEffect } from "react"

interface Sensor {
  id: number
  type: string
  description: string
  status: string
  containerId: number | null
  containerDetails: { id: number; location: string; capacity: number; description: string; status: string; fillLevel: number; routeId: number | null; createdAt: string } | null | undefined
}

export function SensorSimulator() {
  const [sensors, setSensors] = useState<Sensor[]>([])
  const [selectedSensor, setSelectedSensor] = useState("")
  const [readingCount, setReadingCount] = useState("10")
  const [interval, setInterval] = useState("5")
  const [isGenerating, setIsGenerating] = useState(false)
  const [result, setResult] = useState<{ success: boolean; message: string; data?: unknown } | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadSensors()
  }, [])

  const loadSensors = async () => {
    try {
      setLoading(true)
      const sensorsData = await getAllSensors()
      setSensors(sensorsData.filter((sensor) => sensor.status === "activo"))
    } catch (err) {
      console.error("Error loading sensors:", err)
    } finally {
      setLoading(false)
    }
  }

  const handleGenerate = async (formData: FormData) => {
    setIsGenerating(true)
    setResult(null)

    try {
      const result = await generateSensorReadings(formData)
      setResult(result)

      if (result.success) {
        // Reset form
        setSelectedSensor("")
        setReadingCount("10")
        setInterval("5")
      }
    } catch (err) {
      setResult({
        success: false,
        message: "Error de conexión al generar lecturas",
      })
    } finally {
      setIsGenerating(false)
    }
  }

  const getTypeBadge = (type: string) => {
    const typeConfig = {
      nivel: { label: "Nivel", className: "bg-blue-100 text-blue-800" },
      temperatura: { label: "Temperatura", className: "bg-red-100 text-red-800" },
      humedad: { label: "Humedad", className: "bg-cyan-100 text-cyan-800" },
      peso: { label: "Peso", className: "bg-purple-100 text-purple-800" },
    }
    const config = typeConfig[type as keyof typeof typeConfig] || {
      label: type,
      className: "bg-gray-100 text-gray-800",
    }
    return <Badge className={config.className}>{config.label}</Badge>
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-green-600" />
        <span className="ml-2 text-gray-600">Cargando simulador...</span>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center space-x-2">
          <Beaker className="h-8 w-8 text-green-600" />
          <h1 className="text-3xl font-bold text-gray-900">Simulador de Sensores IoT</h1>
        </div>
        <p className="text-gray-600">
          Genera lecturas simuladas para probar el sistema y visualizar datos en tiempo real
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Simulator Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Activity className="h-5 w-5" />
              <span>Generar Lecturas</span>
            </CardTitle>
            <CardDescription>Configura los parámetros para simular lecturas de sensores</CardDescription>
          </CardHeader>
          <CardContent>
            <form action={handleGenerate} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="sensorId">Sensor</Label>
                <Select name="sensorId" value={selectedSensor} onValueChange={setSelectedSensor}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar sensor" />
                  </SelectTrigger>
                  <SelectContent>
                    {sensors.map((sensor) => (
                      <SelectItem key={sensor.id} value={sensor.id.toString()}>
                        <div className="flex items-center space-x-2">
                          <span>ID: {sensor.id}</span>
                          {getTypeBadge(sensor.type)}
                          <span className="text-sm text-gray-500">
                            {sensor.containerDetails?.location || "Sin contenedor"}
                          </span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="count">Número de Lecturas</Label>
                  <Input
                    id="count"
                    name="count"
                    type="number"
                    min="1"
                    max="100"
                    value={readingCount}
                    onChange={(e) => setReadingCount(e.target.value)}
                    placeholder="10"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="interval">Intervalo (minutos)</Label>
                  <Input
                    id="interval"
                    name="interval"
                    type="number"
                    min="1"
                    max="60"
                    value={interval}
                    onChange={(e) => setInterval(e.target.value)}
                    placeholder="5"
                  />
                </div>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">Configuración Actual:</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>
                    • <strong>Sensor:</strong> {selectedSensor ? `ID ${selectedSensor}` : "No seleccionado"}
                  </li>
                  <li>
                    • <strong>Lecturas:</strong> {readingCount} registros
                  </li>
                  <li>
                    • <strong>Intervalo:</strong> {interval} minutos entre lecturas
                  </li>
                  <li>
                    • <strong>Duración total:</strong> {Number.parseInt(readingCount) * Number.parseInt(interval)}{" "}
                    minutos
                  </li>
                </ul>
              </div>

              <Button
                type="submit"
                disabled={isGenerating || !selectedSensor}
                className="w-full bg-green-600 hover:bg-green-700 text-white"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generando lecturas...
                  </>
                ) : (
                  <>
                    <Beaker className="mr-2 h-4 w-4" />
                    Generar Lecturas
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Results and Info */}
        <div className="space-y-6">
          {/* Result Alert */}
          {result && (
            <Alert className={result.success ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}>
              {result.success ? (
                <CheckCircle className="h-4 w-4 text-green-600" />
              ) : (
                <AlertTriangle className="h-4 w-4 text-red-600" />
              )}
              <AlertDescription className={result.success ? "text-green-800" : "text-red-800"}>
                {result.message}
                {result.success && result.data ? (
                  <div className="mt-2 text-sm">
                    <p>• Lecturas generadas: {(result.data as { count: number; sensorId: number; timeRange: string })?.count}</p>
                    <p>• Sensor ID: {(result.data as { count: number; sensorId: number; timeRange: string })?.sensorId}</p>
                    <p>• Rango de tiempo: {(result.data as { count: number; sensorId: number; timeRange: string })?.timeRange}</p>
                  </div>
                ) : null}
              </AlertDescription>
            </Alert>
          )}

          {/* Info Card */}
          <Card>
            <CardHeader>
              <CardTitle>Información del Simulador</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">¿Cómo funciona?</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Selecciona un sensor activo de la lista</li>
                  <li>• Define cuántas lecturas generar</li>
                  <li>• Establece el intervalo entre lecturas</li>
                  <li>• Las lecturas se crean con valores realistas</li>
                </ul>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 mb-2">Tipos de Datos:</h4>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    {getTypeBadge("nivel")}
                    <span className="text-sm text-gray-600">0-100% (llenado)</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    {getTypeBadge("temperatura")}
                    <span className="text-sm text-gray-600">15-35°C (ambiente)</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    {getTypeBadge("humedad")}
                    <span className="text-sm text-gray-600">40-80% (relativa)</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    {getTypeBadge("peso")}
                    <span className="text-sm text-gray-600">100-600kg (carga)</span>
                  </div>
                </div>
              </div>

              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>Nota:</strong> Las lecturas generadas son simuladas y se almacenan temporalmente para
                  demostración. Úsalas para probar gráficos y reportes.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Active Sensors Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Sensores Disponibles</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {sensors.length === 0 ? (
                  <p className="text-sm text-gray-500">No hay sensores activos disponibles</p>
                ) : (
                  sensors.slice(0, 5).map((sensor) => (
                    <div key={sensor.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium">ID: {sensor.id}</span>
                        {getTypeBadge(sensor.type)}
                      </div>
                      <span className="text-xs text-gray-500">
                        {sensor.containerDetails?.location || "Sin contenedor"}
                      </span>
                    </div>
                  ))
                )}
                {sensors.length > 5 && (
                  <p className="text-xs text-gray-500 text-center">+{sensors.length - 5} sensores más disponibles</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
