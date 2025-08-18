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
import { Checkbox } from "@/components/ui/checkbox"
import { Edit, Trash2, Search, Loader2, AlertTriangle, Plus, Users, MapPin } from "lucide-react"
import {
  getAllRoutes,
  createRoute,
  updateRoute,
  deleteRoute,
  getAssignableUsers,
  assignUsersToRoute,
} from "@/app/actions/auth"

interface Route {
  id: number
  name: string
  description: string
  status: string
  createdAt: string
  assignedUsersDetails: Array<{ id: number; name: string; role: string }>
}

interface AssignableUser {
  id: number
  name: string
  email: string
  role: string
}

interface RouteManagementProps {
  userRole?: string
  userId?: number
}

export function RouteManagement({ userRole = "ADMIN", userId }: RouteManagementProps) {
  const [routes, setRoutes] = useState<Route[]>([])
  const [assignableUsers, setAssignableUsers] = useState<AssignableUser[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [userSearchTerm, setUserSearchTerm] = useState("")
  const [editingRoute, setEditingRoute] = useState<Route | null>(null)
  const [deletingRoute, setDeletingRoute] = useState<Route | null>(null)
  const [assigningRoute, setAssigningRoute] = useState<Route | null>(null)
  const [selectedUserIds, setSelectedUserIds] = useState<number[]>([])
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const isAdmin = userRole === "ADMIN"
  const isChofer = userRole === "CHOFER"
  const isUsuario = userRole === "USUARIO"

  useEffect(() => {
    loadRoutes()
    if (isAdmin) {
      loadAssignableUsers()
    }
  }, [])

  const loadRoutes = async () => {
    try {
      setLoading(true)
      const routesData = await getAllRoutes()

      // Filter routes based on user role
      let filteredRoutes = routesData
      if (!isAdmin && userId) {
        filteredRoutes = routesData.filter((route) => route.assignedUsersDetails.some((user) => user.id === userId))
      }

      setRoutes(filteredRoutes)
    } catch (err) {
      setError("Error al cargar rutas")
    } finally {
      setLoading(false)
    }
  }

  const loadAssignableUsers = async () => {
    try {
      const usersData = await getAssignableUsers()
      setAssignableUsers(usersData)
    } catch (err) {
      console.error("Error al cargar usuarios asignables")
    }
  }

  const filteredRoutes = routes.filter(
    (route) =>
      route.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      route.description.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const filteredUsers = assignableUsers.filter(
    (user) =>
      user.name.toLowerCase().includes(userSearchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(userSearchTerm.toLowerCase()),
  )

  const handleCreateRoute = async (formData: FormData) => {
    setIsSubmitting(true)
    setError("")

    try {
      const result = await createRoute(formData)
      if (result.success) {
        setSuccess("Ruta creada correctamente")
        setIsCreateDialogOpen(false)
        await loadRoutes()
      } else {
        setError(result.error || "Error al crear ruta")
      }
    } catch (err) {
      setError("Error de conexión")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEditRoute = (route: Route) => {
    setEditingRoute(route)
    setIsEditDialogOpen(true)
    setError("")
    setSuccess("")
  }

  const handleDeleteRoute = (route: Route) => {
    setDeletingRoute(route)
    setIsDeleteDialogOpen(true)
    setError("")
    setSuccess("")
  }

  const handleAssignUsers = (route: Route) => {
    setAssigningRoute(route)
    setSelectedUserIds(route.assignedUsersDetails.map((user) => user.id))
    setIsAssignDialogOpen(true)
    setUserSearchTerm("")
    setError("")
    setSuccess("")
  }

  const handleUpdateRoute = async (formData: FormData) => {
    if (!editingRoute) return

    setIsSubmitting(true)
    setError("")

    try {
      const result = await updateRoute(formData)
      if (result.success) {
        setSuccess("Ruta actualizada correctamente")
        setIsEditDialogOpen(false)
        setEditingRoute(null)
        await loadRoutes()
      } else {
        setError(result.error || "Error al actualizar ruta")
      }
    } catch (err) {
      setError("Error de conexión")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleConfirmDelete = async () => {
    if (!deletingRoute) return

    setIsSubmitting(true)
    setError("")

    try {
      const result = await deleteRoute(deletingRoute.id)
      if (result.success) {
        setSuccess("Ruta eliminada correctamente")
        setIsDeleteDialogOpen(false)
        setDeletingRoute(null)
        await loadRoutes()
      } else {
        setError(result.error || "Error al eliminar ruta")
      }
    } catch (err) {
      setError("Error de conexión")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSaveAssignments = async () => {
    if (!assigningRoute) return

    setIsSubmitting(true)
    setError("")

    try {
      const result = await assignUsersToRoute(assigningRoute.id, selectedUserIds)
      if (result.success) {
        setSuccess("Usuarios asignados correctamente")
        setIsAssignDialogOpen(false)
        setAssigningRoute(null)
        setSelectedUserIds([])
        await loadRoutes()
      } else {
        setError(result.error || "Error al asignar usuarios")
      }
    } catch (err) {
      setError("Error de conexión")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleUserSelection = (userId: number, checked: boolean) => {
    if (checked) {
      setSelectedUserIds([...selectedUserIds, userId])
    } else {
      setSelectedUserIds(selectedUserIds.filter((id) => id !== userId))
    }
  }

  const getStatusBadge = (status: string) => {
    return status === "activa" ? (
      <Badge className="bg-green-100 text-green-800">Activa</Badge>
    ) : (
      <Badge className="bg-gray-100 text-gray-800">Inactiva</Badge>
    )
  }

  const getRoleBadge = (role: string) => {
    const roleConfig = {
      USUARIO: { label: "Usuario", className: "bg-blue-100 text-blue-800" },
      CHOFER: { label: "Chofer", className: "bg-purple-100 text-purple-800" },
    }
    const config = roleConfig[role as keyof typeof roleConfig] || {
      label: role,
      className: "bg-gray-100 text-gray-800",
    }
    return <Badge className={config.className}>{config.label}</Badge>
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-green-600" />
        <span className="ml-2 text-gray-600">Cargando rutas...</span>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Buscar rutas..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        {isAdmin && (
          <Button onClick={() => setIsCreateDialogOpen(true)} className="bg-green-600 hover:bg-green-700 text-white">
            <Plus className="h-4 w-4 mr-2" />
            Nueva Ruta
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

      {/* Routes Table */}
      <div className="rounded-md border bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nombre de la ruta</TableHead>
              <TableHead>Descripción</TableHead>
              <TableHead>Estatus</TableHead>
              <TableHead>Usuarios asignados</TableHead>
              <TableHead>Fecha de registro</TableHead>
              {isAdmin && <TableHead className="text-right">Acciones</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredRoutes.length === 0 ? (
              <TableRow>
                <TableCell colSpan={isAdmin ? 6 : 5} className="text-center py-8 text-gray-500">
                  {!isAdmin && userId ? "No tienes rutas asignadas" : "No se encontraron rutas"}
                </TableCell>
              </TableRow>
            ) : (
              filteredRoutes.map((route) => (
                <TableRow key={route.id}>
                  <TableCell className="font-medium">{route.name}</TableCell>
                  <TableCell className="max-w-xs truncate">{route.description}</TableCell>
                  <TableCell>{getStatusBadge(route.status)}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {route.assignedUsersDetails.length === 0 ? (
                        <span className="text-gray-500 text-sm">Sin asignar</span>
                      ) : (
                        route.assignedUsersDetails.slice(0, 2).map((user) => (
                          <Badge key={user.id} variant="outline" className="text-xs">
                            {user.name}
                          </Badge>
                        ))
                      )}
                      {route.assignedUsersDetails.length > 2 && (
                        <Badge variant="outline" className="text-xs">
                          +{route.assignedUsersDetails.length - 2} más
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>{new Date(route.createdAt).toLocaleDateString()}</TableCell>
                  {isAdmin && (
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleAssignUsers(route)}
                          className="bg-transparent"
                          title="Asignar usuarios"
                        >
                          <Users className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditRoute(route)}
                          className="bg-transparent"
                          title="Editar ruta"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteRoute(route)}
                          className="bg-transparent text-red-600 hover:text-red-700 hover:bg-red-50"
                          title="Eliminar ruta"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  )}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Create Route Dialog */}
      {isAdmin && (
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Crear Nueva Ruta</DialogTitle>
              <DialogDescription>Completa la información para crear una nueva ruta de recolección.</DialogDescription>
            </DialogHeader>
            <form action={handleCreateRoute} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="create-name">Nombre de la ruta</Label>
                <Input id="create-name" name="name" placeholder="Ej: Ruta Centro" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="create-description">Descripción</Label>
                <Textarea
                  id="create-description"
                  name="description"
                  placeholder="Describe la zona y características de la ruta..."
                  rows={3}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="create-status">Estatus</Label>
                <Select name="status" defaultValue="activa">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="activa">Activa</SelectItem>
                    <SelectItem value="inactiva">Inactiva</SelectItem>
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
      )}

      {/* Edit Route Dialog */}
      {isAdmin && (
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Editar Ruta</DialogTitle>
              <DialogDescription>Actualiza la información de la ruta seleccionada.</DialogDescription>
            </DialogHeader>
            {editingRoute && (
              <form action={handleUpdateRoute} className="space-y-4">
                <input type="hidden" name="id" value={editingRoute.id} />
                <div className="space-y-2">
                  <Label htmlFor="edit-name">Nombre de la ruta</Label>
                  <Input id="edit-name" name="name" defaultValue={editingRoute.name} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-description">Descripción</Label>
                  <Textarea
                    id="edit-description"
                    name="description"
                    defaultValue={editingRoute.description}
                    rows={3}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-status">Estatus</Label>
                  <Select name="status" defaultValue={editingRoute.status}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="activa">Activa</SelectItem>
                      <SelectItem value="inactiva">Inactiva</SelectItem>
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
      )}

      {/* Delete Route Dialog */}
      {isAdmin && (
        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Eliminar Ruta</DialogTitle>
              <DialogDescription>
                ¿Estás seguro de que deseas eliminar la ruta <strong>{deletingRoute?.name}</strong>? Esta acción no se
                puede deshacer.
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
                  "Eliminar ruta"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Assign Users Dialog */}
      {isAdmin && (
        <Dialog open={isAssignDialogOpen} onOpenChange={setIsAssignDialogOpen}>
          <DialogContent className="sm:max-w-[600px] max-h-[80vh]">
            <DialogHeader>
              <DialogTitle className="flex items-center space-x-2">
                <MapPin className="h-5 w-5" />
                <span>Asignar Usuarios a Ruta</span>
              </DialogTitle>
              <DialogDescription>
                Selecciona los usuarios que trabajarán en la ruta <strong>{assigningRoute?.name}</strong>
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              {/* Search Users */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Buscar usuarios por nombre o correo..."
                  value={userSearchTerm}
                  onChange={(e) => setUserSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Users List */}
              <div className="max-h-60 overflow-y-auto border rounded-lg">
                {filteredUsers.length === 0 ? (
                  <div className="p-4 text-center text-gray-500">No se encontraron usuarios disponibles</div>
                ) : (
                  <div className="p-2 space-y-2">
                    {filteredUsers.map((user) => (
                      <div key={user.id} className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded">
                        <Checkbox
                          id={`user-${user.id}`}
                          checked={selectedUserIds.includes(user.id)}
                          onCheckedChange={(checked) => handleUserSelection(user.id, checked as boolean)}
                        />
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium text-sm">{user.name}</p>
                              <p className="text-xs text-gray-600">{user.email}</p>
                            </div>
                            {getRoleBadge(user.role)}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Selected Users Summary */}
              {selectedUserIds.length > 0 && (
                <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-sm font-medium text-green-800 mb-2">
                    Usuarios seleccionados ({selectedUserIds.length}):
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {selectedUserIds.map((userId) => {
                      const user = assignableUsers.find((u) => u.id === userId)
                      return user ? (
                        <Badge key={userId} variant="outline" className="text-xs">
                          {user.name}
                        </Badge>
                      ) : null
                    })}
                  </div>
                </div>
              )}

              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsAssignDialogOpen(false)}
                className="bg-transparent"
              >
                Cancelar
              </Button>
              <Button
                onClick={handleSaveAssignments}
                disabled={isSubmitting}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Guardando...
                  </>
                ) : (
                  "Guardar asignaciones"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
