"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Edit,
  Trash2,
  Search,
  Loader2,
  AlertTriangle,
  Plus,
  CalendarIcon,
  FileText,
  Truck,
  Filter,
  Eye,
} from "lucide-react"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import {
  getAllCollectionLogs,
  createCollectionLog,
  updateCollectionLog,
  deleteCollectionLog,
  getAllRoutes,
  getAllContainers,
} from "@/app/actions/auth"
import { dbUtils } from "@/lib/indexedDB"
import { useOnline } from "@/hooks/use-online"

interface CollectionLog {
  id: number
  date: string
  routeId: number
  containerIds: number[]
  status: string
  notes: string
  collectorName: string
  createdAt: string
  routeDetails: { id: number; name: string; description: string; status: string; createdAt: string; assignedUsers: number[] } | null
  containerDetails: Array<{ id: number; location: string } | null>
}

interface Route {
  id: number
  name: string
  description: string
  status: string
  createdAt: string
  assignedUsers: number[]
  assignedUsersDetails?: Array<{ id: number; name: string; role: string } | null>
}

interface Container {
  id: number
  location: string
  routeId: number | null
  status: string
}

export function CollectionLog() {
  const [logs, setLogs] = useState<CollectionLog[]>([])
  const [routes, setRoutes] = useState<Route[]>([])
  const [containers, setContainers] = useState<Container[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [routeFilter, setRouteFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [dateFilter, setDateFilter] = useState<Date | undefined>(undefined)
  const [editingLog, setEditingLog] = useState<CollectionLog | null>(null)
  const [deletingLog, setDeletingLog] = useState<CollectionLog | null>(null)
  const [selectedContainers, setSelectedContainers] = useState<number[]>([])
  const [selectedRoute, setSelectedRoute] = useState<number | null>(null)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [viewingLog, setViewingLog] = useState<CollectionLog | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [pendingSync, setPendingSync] = useState(false)
  const isOnline = useOnline()

  const loadCollectionLogs = useCallback(async () => {
    try {
      setLoading(true)
      if (isOnline) {
        const logsData = await getAllCollectionLogs()
        setLogs(logsData)
        for (const log of logsData) {
          await dbUtils.saveCollectionLog(log)
        }
      } else {
        const cachedLogs = (await dbUtils.getAllCollectionLogs()) as unknown as CollectionLog[]
        setLogs(cachedLogs)
        setPendingSync(true)
      }
    } catch (err) {
      try {
        const cachedLogs = (await dbUtils.getAllCollectionLogs()) as unknown as CollectionLog[]
        setLogs(cachedLogs)
        setPendingSync(true)
      } catch (cacheErr) {
        setError("Error al cargar bitácora de recolección")
      }
    } finally {
      setLoading(false)
    }
  }, [isOnline])

  const loadRoutes = useCallback(async () => {
    try {
      if (isOnline) {
        const routesData = await getAllRoutes()
        setRoutes(routesData)
        for (const route of routesData) {
          await dbUtils.saveRoute(route)
        }
      } else {
        const cachedRoutes = (await dbUtils.getAllRoutes()) as unknown as Route[]
        setRoutes(cachedRoutes)
      }
    } catch (err) {
      try {
        const cachedRoutes = (await dbUtils.getAllRoutes()) as unknown as Route[]
        setRoutes(cachedRoutes)
      } catch (cacheErr) {
        console.error("Error al cargar rutas")
      }
    }
  }, [isOnline])

  const loadContainers = useCallback(async () => {
    try {
      if (isOnline) {
        const containersData = await getAllContainers()
        setContainers(containersData)
        for (const container of containersData) {
          await dbUtils.saveContainer(container)
        }
      } else {
        const cachedContainers = (await dbUtils.getAllContainers()) as unknown as Container[]
        setContainers(cachedContainers)
      }
    } catch (err) {
      try {
        const cachedContainers = (await dbUtils.getAllContainers()) as unknown as Container[]
        setContainers(cachedContainers)
      } catch (cacheErr) {
        console.error("Error al cargar contenedores")
      }
    }
  }, [isOnline])

  useEffect(() => {
    loadCollectionLogs()
    loadRoutes()
    loadContainers()
  }, [loadCollectionLogs, loadRoutes, loadContainers])

  const filteredLogs = logs.filter((log) => {
    const matchesSearch =
      log.collectorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.notes.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (log.routeDetails?.name.toLowerCase().includes(searchTerm.toLowerCase()) ?? false)

    const matchesRoute = routeFilter === "all" || log.routeId.toString() === routeFilter
    const matchesStatus = statusFilter === "all" || log.status === statusFilter
    const matchesDate = !dateFilter || new Date(log.date).toDateString() === dateFilter.toDateString()

    return matchesSearch && matchesRoute && matchesStatus && matchesDate
  })

  const getAvailableContainers = () => {
    if (!selectedRoute) return []
    return containers.filter((container) => container.routeId === selectedRoute && container.status === "activo")
  }

  const handleCreateLog = async (formData: FormData) => {
    setIsSubmitting(true)
    setError("")

    try {
      formData.append("containerIds", JSON.stringify(selectedContainers))

      if (isOnline) {
        const result = await createCollectionLog(formData)
        if (result.success) {
          setSuccess("Registro de recolección creado correctamente")
          setIsCreateDialogOpen(false)
          setSelectedContainers([])
          setSelectedRoute(null)
          await loadCollectionLogs()
        } else {
          setError("Error al crear registro")
        }
      } else {
        const newLog = {
          id: Date.now(),
          date: formData.get('date') as string,
          routeId: selectedRoute!,
          containerIds: selectedContainers,
          status: formData.get('status') as string,
          notes: formData.get('notes') as string,
          collectorName: formData.get('collectorName') as string,
          createdAt: new Date().toISOString(),
          routeDetails: routes.find(r => r.id === selectedRoute) || null,
          containerDetails: selectedContainers.map(id => containers.find(c => c.id === id) || null)
        }
        await dbUtils.saveCollectionLog(newLog)
        setLogs(prev => [...prev, newLog])
        setSuccess("Registro guardado localmente (sincronizará cuando esté online)")
        setIsCreateDialogOpen(false)
        setSelectedContainers([])
        setSelectedRoute(null)
        setPendingSync(true)
      }
    } catch (err) {
      setError("Error de conexión")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEditLog = (log: CollectionLog) => {
    setEditingLog(log)
    setSelectedRoute(log.routeId)
    setSelectedContainers(log.containerIds)
    setIsEditDialogOpen(true)
    setError("")
    setSuccess("")
  }

  const handleViewLog = (log: CollectionLog) => {
    setViewingLog(log)
    setIsViewDialogOpen(true)
  }

  const handleDeleteLog = (log: CollectionLog) => {
    setDeletingLog(log)
    setIsDeleteDialogOpen(true)
    setError("")
    setSuccess("")
  }

  const handleUpdateLog = async (formData: FormData) => {
    if (!editingLog) return

    setIsSubmitting(true)
    setError("")

    try {
      formData.append("containerIds", JSON.stringify(selectedContainers))

      const result = await updateCollectionLog(formData)
      if (result.success) {
        setSuccess("Registro actualizado correctamente")
        setIsEditDialogOpen(false)
        setEditingLog(null)
        setSelectedContainers([])
        setSelectedRoute(null)
        await loadCollectionLogs()
      } else {
        setError("Error al actualizar registro")
      }
    } catch (err) {
      setError("Error de conexión")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleConfirmDelete = async () => {
    if (!deletingLog) return

    setIsSubmitting(true)
    setError("")

    try {
      const result = await deleteCollectionLog(deletingLog.id)
      if (result.success) {
        setSuccess("Registro eliminado correctamente")
        setIsDeleteDialogOpen(false)
        setDeletingLog(null)
        await loadCollectionLogs()
      } else {
        setError("Error al eliminar registro")
      }
    } catch (err) {
      setError("Error de conexión")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleContainerSelection = (containerId: number, checked: boolean) => {
    if (checked) {
      setSelectedContainers([...selectedContainers, containerId])
    } else {
      setSelectedContainers(selectedContainers.filter((id) => id !== containerId))
    }
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      completada: { label: "Completada", className: "bg-green-100 text-green-800" },
      en_progreso: { label: "En Progreso", className: "bg-blue-100 text-blue-800" },
      pendiente: { label: "Pendiente", className: "bg-yellow-100 text-yellow-800" },
      cancelada: { label: "Cancelada", className: "bg-red-100 text-red-800" },
    }
    const config = statusConfig[status as keyof typeof statusConfig] || {
      label: status,
      className: "bg-gray-100 text-gray-800",
    }
    return <Badge className={config.className}>{config.label}</Badge>
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-green-600" />
        <span className="ml-2 text-gray-600">Cargando bitácora...</span>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
        <div className="flex flex-col sm:flex-row gap-4 flex-1">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Buscar por recolector o notas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="flex gap-2">
            <Select value={routeFilter} onValueChange={setRouteFilter}>
              <SelectTrigger className="w-[140px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las rutas</SelectItem>
                {routes.map((route) => (
                  <SelectItem key={route.id} value={route.id.toString()}>
                    {route.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[120px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="completada">Completada</SelectItem>
                <SelectItem value="en_progreso">En Progreso</SelectItem>
                <SelectItem value="pendiente">Pendiente</SelectItem>
                <SelectItem value="cancelada">Cancelada</SelectItem>
              </SelectContent>
            </Select>

            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-[140px] justify-start text-left font-normal bg-transparent">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dateFilter ? format(dateFilter, "dd/MM/yyyy") : "Fecha"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar mode="single" selected={dateFilter} onSelect={setDateFilter} locale={es} initialFocus />
                {dateFilter && (
                  <div className="p-3 border-t">
                    <Button variant="outline" size="sm" onClick={() => setDateFilter(undefined)} className="w-full">
                      Limpiar filtro
                    </Button>
                  </div>
                )}
              </PopoverContent>
            </Popover>
          </div>
        </div>

        <Button onClick={() => setIsCreateDialogOpen(true)} className="bg-green-600 hover:bg-green-700 text-white">
          <Plus className="h-4 w-4 mr-2" />
          Nueva Recolección
        </Button>
      </div>

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

      {pendingSync && (
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Hay cambios pendientes de sincronización. Se sincronizarán automáticamente cuando vuelva la conexión.
          </AlertDescription>
        </Alert>
      )}

      <div className="rounded-md border bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Fecha de Recolección</TableHead>
              <TableHead>Ruta</TableHead>
              <TableHead>Recolector</TableHead>
              <TableHead>Contenedores</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Notas</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredLogs.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                  No se encontraron registros de recolección
                </TableCell>
              </TableRow>
            ) : (
              filteredLogs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell className="font-medium">
                    {format(new Date(log.date), "dd/MM/yyyy HH:mm", { locale: es })}
                  </TableCell>
                  <TableCell>
                    {log.routeDetails ? (
                      <Badge variant="outline" className="text-xs">
                        {log.routeDetails.name}
                      </Badge>
                    ) : (
                      <span className="text-gray-500 text-sm">Sin ruta</span>
                    )}
                  </TableCell>
                  <TableCell>{log.collectorName}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-1">
                      <Truck className="h-4 w-4 text-gray-400" />
                      <span className="text-sm">{log.containerDetails.filter(c => c !== null).length} contenedores</span>
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(log.status)}</TableCell>
                  <TableCell className="max-w-xs truncate">{log.notes || "Sin notas"}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewLog(log)}
                        className="bg-transparent"
                        title="Ver detalles"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditLog(log)}
                        className="bg-transparent"
                        title="Editar registro"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteLog(log)}
                        className="bg-transparent text-red-600 hover:text-red-700 hover:bg-red-50"
                        title="Eliminar registro"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Registrar Nueva Recolección</DialogTitle>
            <DialogDescription>Completa la información del evento de recolección.</DialogDescription>
          </DialogHeader>
          <form action={handleCreateLog} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="create-date">Fecha y Hora</Label>
                <Input
                  id="create-date"
                  name="date"
                  type="datetime-local"
                  defaultValue={new Date().toISOString().slice(0, 16)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="create-collector">Nombre del Recolector</Label>
                <Input id="create-collector" name="collectorName" placeholder="Nombre completo" required />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="create-route">Ruta</Label>
              <Select
                name="routeId"
                onValueChange={(value) => {
                  setSelectedRoute(Number(value))
                  setSelectedContainers([])
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar ruta" />
                </SelectTrigger>
                <SelectContent>
                  {routes
                    .filter((route) => route.status === "activa")
                    .map((route) => (
                      <SelectItem key={route.id} value={route.id.toString()}>
                        {route.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>

            {selectedRoute && (
              <div className="space-y-2">
                <Label>Contenedores Recolectados</Label>
                <div className="max-h-40 overflow-y-auto border rounded-lg p-3 space-y-2">
                  {getAvailableContainers().map((container) => (
                    <div key={container.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={`container-${container.id}`}
                        checked={selectedContainers.includes(container.id)}
                        onCheckedChange={(checked) => handleContainerSelection(container.id, checked as boolean)}
                      />
                      <label htmlFor={`container-${container.id}`} className="text-sm cursor-pointer">
                        ID: {container.id} - {container.location}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="create-status">Estado</Label>
              <Select name="status" defaultValue="completada">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="completada">Completada</SelectItem>
                  <SelectItem value="en_progreso">En Progreso</SelectItem>
                  <SelectItem value="pendiente">Pendiente</SelectItem>
                  <SelectItem value="cancelada">Cancelada</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="create-notes">Notas (opcional)</Label>
              <Textarea
                id="create-notes"
                name="notes"
                placeholder="Observaciones, incidencias o comentarios..."
                rows={3}
              />
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsCreateDialogOpen(false)
                  setSelectedContainers([])
                  setSelectedRoute(null)
                }}
                className="bg-transparent"
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={isSubmitting} className="bg-green-600 hover:bg-green-700 text-white">
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Guardando...
                  </>
                ) : (
                  "Guardar Registro"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <FileText className="h-5 w-5" />
              <span>Detalles de Recolección</span>
            </DialogTitle>
          </DialogHeader>
          {viewingLog && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-600">Fecha</Label>
                  <p className="text-sm">{format(new Date(viewingLog.date), "dd/MM/yyyy HH:mm", { locale: es })}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600">Estado</Label>
                  <div className="mt-1">{getStatusBadge(viewingLog.status)}</div>
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-600">Ruta</Label>
                <p className="text-sm">{viewingLog.routeDetails?.name || "Sin ruta asignada"}</p>
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-600">Recolector</Label>
                <p className="text-sm">{viewingLog.collectorName}</p>
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-600">
                  Contenedores Recolectados ({viewingLog.containerDetails.filter(c => c !== null).length})
                </Label>
                <div className="mt-2 space-y-1 max-h-32 overflow-y-auto">
                  {viewingLog.containerDetails.filter(c => c !== null).map((container) => (
                    <div key={container!.id} className="text-sm p-2 bg-gray-50 rounded">
                      <span className="font-medium">ID: {container!.id}</span> - {container!.location}
                    </div>
                  ))}
                </div>
              </div>

              {viewingLog.notes && (
                <div>
                  <Label className="text-sm font-medium text-gray-600">Notas</Label>
                  <p className="text-sm bg-gray-50 p-2 rounded">{viewingLog.notes}</p>
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsViewDialogOpen(false)}
              className="bg-transparent"
            >
              Cerrar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Editar Registro de Recolección</DialogTitle>
            <DialogDescription>Actualiza la información del evento de recolección.</DialogDescription>
          </DialogHeader>
          {editingLog && (
            <form action={handleUpdateLog} className="space-y-4">
              <input type="hidden" name="id" value={editingLog.id} />
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-date">Fecha y Hora</Label>
                  <Input
                    id="edit-date"
                    name="date"
                    type="datetime-local"
                    defaultValue={new Date(editingLog.date).toISOString().slice(0, 16)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-collector">Nombre del Recolector</Label>
                  <Input id="edit-collector" name="collectorName" defaultValue={editingLog.collectorName} required />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-status">Estado</Label>
                <Select name="status" defaultValue={editingLog.status}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="completada">Completada</SelectItem>
                    <SelectItem value="en_progreso">En Progreso</SelectItem>
                    <SelectItem value="pendiente">Pendiente</SelectItem>
                    <SelectItem value="cancelada">Cancelada</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-notes">Notas</Label>
                <Textarea id="edit-notes" name="notes" defaultValue={editingLog.notes} rows={3} />
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsEditDialogOpen(false)}
                  className="bg-transparent"
                >
                  Cancelar
                </Button>
                <Button type="submit" disabled={isSubmitting} className="bg-green-600 hover:bg-green-700 text-white">
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Guardando...
                    </>
                  ) : (
                    "Guardar Cambios"
                  )}
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Eliminar Registro</DialogTitle>
            <DialogDescription>
              ¿Estás seguro de que deseas eliminar este registro de recolección? Esta acción no se puede deshacer.
            </DialogDescription>
          </DialogHeader>
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
              className="bg-transparent"
            >
              Cancelar
            </Button>
            <Button
              onClick={handleConfirmDelete}
              disabled={isSubmitting}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Eliminando...
                </>
              ) : (
                "Eliminar Registro"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}