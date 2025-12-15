"use client"

import { useState, useEffect } from "react"
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
import { Progress } from "@/components/ui/progress"
import { Edit, Trash2, Search, Loader2, AlertTriangle, Plus, MapPin, Filter } from "lucide-react"
import { getAllContainers, createContainer, updateContainer, deleteContainer, getAllRoutes } from "@/app/actions/auth"

interface Container {
  id: number
  location: string
  capacity: number
  description: string
  status: string
  fillLevel: number
  routeId: number | null
  createdAt: string
  routeDetails: { id: number; name: string; description: string; status: string; createdAt: string; assignedUsers: number[] } | null | undefined
}

interface Route {
  id: number
  name: string
  status: string
}

export function ContainerManagement() {
  const [containers, setContainers] = useState<Container[]>([])
  const [routes, setRoutes] = useState<Route[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [routeFilter, setRouteFilter] = useState("all")
  const [editingContainer, setEditingContainer] = useState<Container | null>(null)
  const [deletingContainer, setDeletingContainer] = useState<Container | null>(null)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  useEffect(() => {
    loadContainers()
    loadRoutes()
  }, [])

  const loadContainers = async () => {
    try {
      setLoading(true)
      const containersData = await getAllContainers()
      setContainers(containersData)
    } catch (err) {
      setError("Error al cargar contenedores")
    } finally {
      setLoading(false)
    }
  }

  const loadRoutes = async () => {
    try {
      const routesData = await getAllRoutes()
      setRoutes(routesData)
    } catch (err) {
      console.error("Error al cargar rutas")
    }
  }

  const filteredContainers = containers.filter((container) => {
    const matchesSearch =
      container.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      container.description.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || container.status === statusFilter

    const matchesRoute =
      routeFilter === "all" ||
      (routeFilter === "unassigned" && !container.routeId) ||
      (container.routeId && container.routeId.toString() === routeFilter)

    return matchesSearch && matchesStatus && matchesRoute
  })

  const handleCreateContainer = async (formData: FormData) => {
    setIsSubmitting(true)
    setError("")

    try {
      const result = await createContainer(formData)
      if (result.success) {
        setSuccess("Contenedor creado correctamente")
        setIsCreateDialogOpen(false)
        await loadContainers()
      } else {
        setError("Error al crear contenedor")
      }
    } catch (err) {
      setError("Error de conexión")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEditContainer = (container: Container) => {
    setEditingContainer(container)
    setIsEditDialogOpen(true)
    setError("")
    setSuccess("")
  }

  const handleDeleteContainer = (container: Container) => {
    setDeletingContainer(container)
    setIsDeleteDialogOpen(true)
    setError("")
    setSuccess("")
  }

  const handleUpdateContainer = async (formData: FormData) => {
    if (!editingContainer) return

    setIsSubmitting(true)
    setError("")

    try {
      const result = await updateContainer(formData)
      if (result.success) {
        setSuccess("Contenedor actualizado correctamente")
        setIsEditDialogOpen(false)
        setEditingContainer(null)
        await loadContainers()
      } else {
        setError("Error al actualizar contenedor")
      }
    } catch (err) {
      setError("Error de conexión")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleConfirmDelete = async () => {
    if (!deletingContainer) return

    setIsSubmitting(true)
    setError("")

    try {
      const result = await deleteContainer(deletingContainer.id)
      if (result.success) {
        setSuccess("Contenedor eliminado correctamente")
        setIsDeleteDialogOpen(false)
        setDeletingContainer(null)
        await loadContainers()
      } else {
        setError("Error al eliminar contenedor")
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

  const getFillLevelColor = (fillLevel: number) => {
    if (fillLevel >= 80) return "bg-red-500"
    if (fillLevel >= 60) return "bg-yellow-500"
    return "bg-green-500"
  }

  const getFillLevelBadge = (fillLevel: number) => {
    if (fillLevel >= 80) {
      return <Badge className="bg-red-100 text-red-800">Lleno</Badge>
    }
    if (fillLevel >= 60) {
      return <Badge className="bg-yellow-100 text-yellow-800">Medio</Badge>
    }
    return <Badge className="bg-green-100 text-green-800">Vacío</Badge>
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-green-600" />
        <span className="ml-2 text-gray-600">Cargando contenedores...</span>
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
              placeholder="Buscar por ubicación..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Filters */}
          <div className="flex gap-2">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[140px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="activo">Activos</SelectItem>
                <SelectItem value="inactivo">Inactivos</SelectItem>
              </SelectContent>
            </Select>

            <Select value={routeFilter} onValueChange={setRouteFilter}>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Filtrar por ruta" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las rutas</SelectItem>
                <SelectItem value="unassigned">Sin asignar</SelectItem>
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
        </div>

        <Button onClick={() => setIsCreateDialogOpen(true)} className="bg-green-600 hover:bg-green-700 text-white">
          <Plus className="h-4 w-4 mr-2" />
          Nuevo Contenedor
        </Button>
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

      {/* Containers Table */}
      <div className="rounded-md border bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Ubicación</TableHead>
              <TableHead>Capacidad</TableHead>
              <TableHead>Nivel de Llenado</TableHead>
              <TableHead>Descripción</TableHead>
              <TableHead>Estatus</TableHead>
              <TableHead>Ruta Asignada</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredContainers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                  No se encontraron contenedores
                </TableCell>
              </TableRow>
            ) : (
              filteredContainers.map((container) => (
                <TableRow key={container.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center space-x-2">
                      <MapPin className="h-4 w-4 text-gray-400" />
                      <span className="max-w-xs truncate">{container.location}</span>
                    </div>
                  </TableCell>
                  <TableCell>{container.capacity}L</TableCell>
                  <TableCell>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Progress value={container.fillLevel} className="w-16 h-2" />
                        <span className="text-sm text-gray-600">{container.fillLevel}%</span>
                      </div>
                      {getFillLevelBadge(container.fillLevel)}
                    </div>
                  </TableCell>
                  <TableCell className="max-w-xs truncate">{container.description}</TableCell>
                  <TableCell>{getStatusBadge(container.status)}</TableCell>
                  <TableCell>
                    {container.routeDetails ? (
                      <Badge variant="outline" className="text-xs">
                        {container.routeDetails.name}
                      </Badge>
                    ) : (
                      <span className="text-gray-500 text-sm">Sin asignar</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditContainer(container)}
                        className="bg-transparent"
                        title="Editar contenedor"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteContainer(container)}
                        className="bg-transparent text-red-600 hover:text-red-700 hover:bg-red-50"
                        title="Eliminar contenedor"
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

      {/* Create Container Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Agregar Nuevo Contenedor</DialogTitle>
            <DialogDescription>Completa la información para registrar un nuevo contenedor.</DialogDescription>
          </DialogHeader>
          <form action={handleCreateContainer} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="create-location">Ubicación</Label>
              <Input id="create-location" name="location" placeholder="Ej: Av. Reforma #123, Centro" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="create-capacity">Capacidad (litros)</Label>
              <Input
                id="create-capacity"
                name="capacity"
                type="number"
                placeholder="1000"
                min="100"
                max="5000"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="create-description">Descripción</Label>
              <Textarea
                id="create-description"
                name="description"
                placeholder="Describe las características del contenedor..."
                rows={3}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="create-status">Estatus</Label>
              <Select name="status" defaultValue="activo">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="activo">Activo</SelectItem>
                  <SelectItem value="inactivo">Inactivo</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="create-route">Ruta Asignada (opcional)</Label>
              <Select name="routeId">
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar ruta" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">Sin asignar</SelectItem>
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
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsCreateDialogOpen(false)}
                className="bg-transparent"
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={isSubmitting} className="bg-green-600 hover:bg-green-700 text-white">
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creando...
                  </>
                ) : (
                  "Guardar"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Container Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Editar Contenedor</DialogTitle>
            <DialogDescription>Actualiza la información del contenedor seleccionado.</DialogDescription>
          </DialogHeader>
          {editingContainer && (
            <form action={handleUpdateContainer} className="space-y-4">
              <input type="hidden" name="id" value={editingContainer.id} />
              <div className="space-y-2">
                <Label htmlFor="edit-location">Ubicación</Label>
                <Input id="edit-location" name="location" defaultValue={editingContainer.location} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-capacity">Capacidad (litros)</Label>
                <Input
                  id="edit-capacity"
                  name="capacity"
                  type="number"
                  defaultValue={editingContainer.capacity}
                  min="100"
                  max="5000"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-description">Descripción</Label>
                <Textarea
                  id="edit-description"
                  name="description"
                  defaultValue={editingContainer.description}
                  rows={3}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-status">Estatus</Label>
                <Select name="status" defaultValue={editingContainer.status}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="activo">Activo</SelectItem>
                    <SelectItem value="inactivo">Inactivo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-route">Ruta Asignada</Label>
                <Select name="routeId" defaultValue={editingContainer.routeId?.toString() || "0"}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar ruta" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">Sin asignar</SelectItem>
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
                    "Guardar cambios"
                  )}
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Container Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Eliminar Contenedor</DialogTitle>
            <DialogDescription>
              ¿Estás seguro de que deseas eliminar el contenedor en <strong>{deletingContainer?.location}</strong>? Esta
              acción no se puede deshacer.
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
                "Eliminar contenedor"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
