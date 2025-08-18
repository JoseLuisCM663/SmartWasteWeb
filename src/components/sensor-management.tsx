"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Edit, Trash2, Search, Loader2, AlertTriangle, Plus, Eye, Filter, CalendarIcon, TrendingUp } from "lucide-react"
import { format, subDays } from "date-fns"
import { es } from "date-fns/locale"
import {
  getAllSensors,
  createSensor,
  updateSensor,
  deleteSensor,
  getAllContainers,
  getSensorReadings,
  getSensorHistory,
} from "@/app/actions/auth"

interface Sensor {
  id: number
  type: string
  description: string
  status: string
  containerId: number | null
  createdAt: string
  containerDetails: { id: number; location: string; status: string } | null
}

interface Container {
  id: number
  location: string
  status: string
}

interface SensorReading {
  id: number
  sensorId: number
  value: number
  unit: string
  timestamp: string
  sensorDetails: { id: number; type: string; description: string } | null
}

interface SensorHistoryData {
  timestamp: string
  value: number
  formattedTime: string
}

interface SensorManagementProps {
  userRole?: string
}

export function SensorManagement({ userRole = "ADMIN" }: SensorManagementProps) {
  const [sensors, setSensors] = useState<Sensor[]>([])
  const [containers, setContainers] = useState<Container[]>([])
  const [sensorReadings, setSensorReadings] = useState<SensorReading[]>([])
  const [sensorHistory, setSensorHistory] = useState<SensorHistoryData[]>([])
  const [loading, setLoading] = useState(true)
  const [readingsLoading, setReadingsLoading] = useState(false)
  const [historyLoading, setHistoryLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [typeFilter, setTypeFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedContainer, setSelectedContainer] = useState<number | null>(null)
  const [selectedSensor, setSelectedSensor] = useState<Sensor | null>(null)
  const [selectedSensorType, setSelectedSensorType] = useState("all")
  const [dateFrom, setDateFrom] = useState<Date>(subDays(new Date(), 7))
  const [dateTo, setDateTo] = useState<Date>(new Date())
  const [editingSensor, setEditingSensor] = useState<Sensor | null>(null)
  const [deletingSensor, setDeletingSensor] = useState<Sensor | null>(null)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isReadingsDialogOpen, setIsReadingsDialogOpen] = useState(false)
  const [isHistoryDialogOpen, setIsHistoryDialogOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const isAdmin = userRole === "ADMIN"

  useEffect(() => {
    loadSensors()
    loadContainers()
  }, [])

  const loadSensors = async () => {
    try {
      setLoading(true)
      const sensorsData = await getAllSensors()
      setSensors(sensorsData)
    } catch (err) {
      setError("Error al cargar sensores")
    } finally {
      setLoading(false)
    }
  }

  const loadContainers = async () => {
    try {
      const containersData = await getAllContainers()
      setContainers(containersData)
    } catch (err) {
      console.error("Error al cargar contenedores")
    }
  }

  const loadSensorReadings = async (containerId: number, sensorType?: string) => {
    try {
      setReadingsLoading(true)
      const readings = await getSensorReadings(containerId, sensorType === "all" ? undefined : sensorType)
      setSensorReadings(readings)
    } catch (err) {
      setError("Error al cargar lecturas de sensores")
    } finally {
      setReadingsLoading(false)
    }
  }

  const loadSensorHistory = async (sensorId: number, fromDate: Date, toDate: Date) => {
    try {
      setHistoryLoading(true)
      const history = await getSensorHistory(sensorId, fromDate, toDate)
      setSensorHistory(history)
    } catch (err) {
      setError("Error al cargar historial del sensor")
    } finally {
      setHistoryLoading(false)
    }
  }

  const filteredSensors = sensors.filter((sensor) => {
    const matchesSearch =
      sensor.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sensor.type.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesType = typeFilter === "all" || sensor.type === typeFilter
    const matchesStatus = statusFilter === "all" || sensor.status === statusFilter

    return matchesSearch && matchesType && matchesStatus
  })

  const handleCreateSensor = async (formData: FormData) => {
    setIsSubmitting(true)
    setError("")

    try {
      const result = await createSensor(formData)
      if (result.success) {
        setSuccess("Sensor creado correctamente")
        setIsCreateDialogOpen(false)
        await loadSensors()
      } else {
        setError(result.error || "Error al crear sensor")
      }
    } catch (err) {
      setError("Error de conexión")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEditSensor = (sensor: Sensor) => {
    setEditingSensor(sensor)
    setIsEditDialogOpen(true)
    setError("")
    setSuccess("")
  }

  const handleDeleteSensor = (sensor: Sensor) => {
    setDeletingSensor(sensor)
    setIsDeleteDialogOpen(true)
    setError("")
    setSuccess("")
  }

  const handleViewReadings = (sensor: Sensor) => {
    if (sensor.containerId) {
      setSelectedContainer(sensor.containerId)
      setSelectedSensorType("all")
      setIsReadingsDialogOpen(true)
      loadSensorReadings(sensor.containerId)
    }
  }

  const handleViewHistory = (sensor: Sensor) => {
    setSelectedSensor(sensor)
    setIsHistoryDialogOpen(true)
    loadSensorHistory(sensor.id, dateFrom, dateTo)
  }

  const handleUpdateSensor = async (formData: FormData) => {
    if (!editingSensor) return

    setIsSubmitting(true)
    setError("")

    try {
      const result = await updateSensor(formData)
      if (result.success) {
        setSuccess("Sensor actualizado correctamente")
        setIsEditDialogOpen(false)
        setEditingSensor(null)
        await loadSensors()
      } else {
        setError(result.error || "Error al actualizar sensor")
      }
    } catch (err) {
      setError("Error de conexión")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleConfirmDelete = async () => {
    if (!deletingSensor) return

    setIsSubmitting(true)
    setError("")

    try {
      const result = await deleteSensor(deletingSensor.id)
      if (result.success) {
        setSuccess("Sensor eliminado correctamente")
        setIsDeleteDialogOpen(false)
        setDeletingSensor(null)
        await loadSensors()
      } else {
        setError(result.error || "Error al eliminar sensor")
      }
    } catch (err) {
      setError("Error de conexión")
    } finally {
      setIsSubmitting(false)
    }
  }

  const getStatusBadge = (status: string) => {
    return status === "activo" ? (
      <Badge className="bg-green-100 text-green-800">Activo</Badge>
    ) : (
      <Badge className="bg-gray-100 text-gray-800">Inactivo</Badge>
    )
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

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString("es-ES", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-green-600" />
        <span className="ml-2 text-gray-600">Cargando sensores...</span>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header Actions and Filters */}
      <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
        <div className="flex flex-col sm:flex-row gap-4 flex-1">
          {/* Search */}
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Buscar sensores..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Filters */}
          <div className="flex gap-2">
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-[140px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los tipos</SelectItem>
                <SelectItem value="nivel">Nivel</SelectItem>
                <SelectItem value="temperatura">Temperatura</SelectItem>
                <SelectItem value="humedad">Humedad</SelectItem>
                <SelectItem value="peso">Peso</SelectItem>
              </SelectContent>
            </Select>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[120px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="activo">Activos</SelectItem>
                <SelectItem value="inactivo">Inactivos</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {isAdmin && (
          <Button onClick={() => setIsCreateDialogOpen(true)} className="bg-green-600 hover:bg-green-700 text-white">
            <Plus className="h-4 w-4 mr-2" />
            Nuevo Sensor
          </Button>
        )}
      </div>

      {/* Alerts */}
      {error && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert className="border-green-200 bg-green-50">
          <AlertDescription className="text-green-800">{success}</AlertDescription>
        </Alert>
      )}

      {/* Sensors Table */}
      <div className="rounded-md border bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tipo de Sensor</TableHead>
              <TableHead>Descripción</TableHead>
              <TableHead>Estatus</TableHead>
              <TableHead>Contenedor Asignado</TableHead>
              <TableHead>Fecha de Registro</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredSensors.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                  No se encontraron sensores
                </TableCell>
              </TableRow>
            ) : (
              filteredSensors.map((sensor) => (
                <TableRow key={sensor.id}>
                  <TableCell>{getTypeBadge(sensor.type)}</TableCell>
                  <TableCell className="max-w-xs truncate">{sensor.description}</TableCell>
                  <TableCell>{getStatusBadge(sensor.status)}</TableCell>
                  <TableCell>
                    {sensor.containerDetails ? (
                      <div className="space-y-1">
                        <Badge variant="outline" className="text-xs">
                          ID: {sensor.containerDetails.id}
                        </Badge>
                        <p className="text-xs text-gray-600 truncate max-w-32">{sensor.containerDetails.location}</p>
                      </div>
                    ) : (
                      <span className="text-gray-500 text-sm">Sin asignar</span>
                    )}
                  </TableCell>
                  <TableCell>{new Date(sensor.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewHistory(sensor)}
                        className="bg-transparent"
                        title="Ver historial"
                      >
                        <TrendingUp className="h-4 w-4" />
                      </Button>
                      {sensor.containerId && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewReadings(sensor)}
                          className="bg-transparent"
                          title="Ver lecturas"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      )}
                      {isAdmin && (
                        <>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditSensor(sensor)}
                            className="bg-transparent"
                            title="Editar sensor"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteSensor(sensor)}
                            className="bg-transparent text-red-600 hover:text-red-700 hover:bg-red-50"
                            title="Eliminar sensor"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Sensor History Dialog */}
      <Dialog open={isHistoryDialogOpen} onOpenChange={setIsHistoryDialogOpen}>
        <DialogContent className="sm:max-w-[900px] max-h-[80vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5" />
              <span>Historial del Sensor: {selectedSensor?.description}</span>
            </DialogTitle>
            <DialogDescription>Gráfico de línea con el historial de lecturas del sensor en el tiempo</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {/* Date Range Filters */}
            <div className="flex items-center space-x-4">
              <div className="space-y-2">
                <Label>Fecha Desde</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-[140px] justify-start text-left font-normal bg-transparent">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {format(dateFrom, "dd/MM/yyyy")}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={dateFrom}
                      onSelect={(date) => {
                        if (date) {
                          setDateFrom(date)
                          if (selectedSensor) {
                            loadSensorHistory(selectedSensor.id, date, dateTo)
                          }
                        }
                      }}
                      locale={es}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

           <div className="space-y-2">
  <Label>Fecha Hasta</Label>
  <Popover>
    <PopoverTrigger asChild>
      <Button variant="outline" className="w-[140px] justify-start text-left font-normal bg-transparent">
        <CalendarIcon className="mr-2 h-4 w-4" />
        {format(dateTo, "dd/MM/yyyy")}
      </Button>
    </PopoverTrigger>
    <PopoverContent className="w-auto p-0" align="start">
      <Calendar
        mode="single"
        selected={dateTo}
        onSelect={(date) => {
          if (date) {
            setDateTo(date)
            if (selectedSensor) {
              loadSensorHistory(selectedSensor.id, dateFrom, date)
            }
          }
        }}
        locale={es}
        initialFocus
      />
    </PopoverContent>
  </Popover>
              </div> {/* Cierre del segundo filtro de fecha */}
            </div> {/* Cierre del contenedor de filtros */}
          </div> {/* Cierre del contenedor con padding interno */}
        </DialogContent>
      </Dialog>
    </div>
  )
} 
