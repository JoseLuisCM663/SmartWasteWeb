"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
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
import { Edit, Trash2, Search, Loader2, AlertTriangle, UserPlus } from "lucide-react"
import { getAllUsers, createUser, updateUser, deleteUser } from "@/app/actions/auth"

interface User {
  id: number
  email: string
  name: string
  role: string
  status: string
  createdAt: string
}

export function UserManagement() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [deletingUser, setDeletingUser] = useState<User | null>(null)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  useEffect(() => {
    loadUsers()
  }, [])

  const loadUsers = async () => {
    try {
      setLoading(true)
      const usersData = await getAllUsers()
      setUsers(usersData)
    } catch (err) {
      setError("Error al cargar usuarios")
    } finally {
      setLoading(false)
    }
  }

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.role.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleCreateUser = async (formData: FormData) => {
    setIsSubmitting(true)
    setError("")

    try {
      const result = await createUser(formData)
      if (result.success) {
        setSuccess("Usuario creado correctamente")
        setIsCreateDialogOpen(false)
        await loadUsers()
      } else {
        setError(result.error || "Error al crear usuario")
      }
    } catch (err) {
      setError("Error de conexión")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEditUser = (user: User) => {
    setEditingUser(user)
    setIsEditDialogOpen(true)
    setError("")
    setSuccess("")
  }

  const handleDeleteUser = (user: User) => {
    setDeletingUser(user)
    setIsDeleteDialogOpen(true)
    setError("")
    setSuccess("")
  }

  const handleUpdateUser = async (formData: FormData) => {
    if (!editingUser) return

    setIsSubmitting(true)
    setError("")

    try {
      const result = await updateUser(formData)
      if (result.success) {
        setSuccess("Usuario actualizado correctamente")
        setIsEditDialogOpen(false)
        setEditingUser(null)
        await loadUsers()
      } else {
        setError(result.error || "Error al actualizar usuario")
      }
    } catch (err) {
      setError("Error de conexión")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleConfirmDelete = async () => {
    if (!deletingUser) return

    setIsSubmitting(true)
    setError("")

    try {
      const result = await deleteUser(deletingUser.id)
      if (result.success) {
        setSuccess("Usuario eliminado correctamente")
        setIsDeleteDialogOpen(false)
        setDeletingUser(null)
        await loadUsers()
      } else {
        setError(result.error || "Error al eliminar usuario")
      }
    } catch (err) {
      setError("Error de conexión")
    } finally {
      setIsSubmitting(false)
    }
  }

  const getRoleBadge = (role: string) => {
    const roleConfig = {
      ADMIN: { label: "Administrador", className: "bg-red-100 text-red-800" },
      USUARIO: { label: "Usuario", className: "bg-blue-100 text-blue-800" },
      CHOFER: { label: "Chofer", className: "bg-purple-100 text-purple-800" },
    }
    const config = roleConfig[role as keyof typeof roleConfig] || {
      label: role,
      className: "bg-gray-100 text-gray-800",
    }
    return <Badge className={config.className}>{config.label}</Badge>
  }

  const getStatusBadge = (status: string) => {
    return status === "activo" ? (
      <Badge className="bg-green-100 text-green-800">Activo</Badge>
    ) : (
      <Badge className="bg-gray-100 text-gray-800">Inactivo</Badge>
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-green-600" />
        <span className="ml-2 text-gray-600">Cargando usuarios...</span>
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
            placeholder="Buscar usuarios..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button onClick={() => setIsCreateDialogOpen(true)} className="bg-green-600 hover:bg-green-700 text-white">
          <UserPlus className="h-4 w-4 mr-2" />
          Nuevo Usuario
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

      {/* Users Table */}
      <div className="rounded-md border bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nombre completo</TableHead>
              <TableHead>Correo electrónico</TableHead>
              <TableHead>Tipo de usuario</TableHead>
              <TableHead>Estatus</TableHead>
              <TableHead>Fecha de registro</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                  No se encontraron usuarios
                </TableCell>
              </TableRow>
            ) : (
              filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{getRoleBadge(user.role)}</TableCell>
                  <TableCell>{getStatusBadge(user.status)}</TableCell>
                  <TableCell>{new Date(user.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditUser(user)}
                        className="bg-transparent"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteUser(user)}
                        className="bg-transparent text-red-600 hover:text-red-700 hover:bg-red-50"
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

      {/* Create User Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Crear Nuevo Usuario</DialogTitle>
            <DialogDescription>Completa la información para crear un nuevo usuario en el sistema.</DialogDescription>
          </DialogHeader>
          <form action={handleCreateUser} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="create-name">Nombre completo</Label>
              <Input id="create-name" name="name" placeholder="Nombre completo" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="create-email">Correo electrónico</Label>
              <Input id="create-email" name="email" type="email" placeholder="correo@ejemplo.com" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="create-password">Contraseña</Label>
              <Input id="create-password" name="password" type="password" placeholder="••••••••" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="create-role">Tipo de usuario</Label>
              <Select name="role" defaultValue="USUARIO">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ADMIN">Administrador</SelectItem>
                  <SelectItem value="USUARIO">Usuario</SelectItem>
                  <SelectItem value="CHOFER">Chofer</SelectItem>
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

      {/* Edit User Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Editar Usuario</DialogTitle>
            <DialogDescription>Actualiza la información del usuario seleccionado.</DialogDescription>
          </DialogHeader>
          {editingUser && (
            <form action={handleUpdateUser} className="space-y-4">
              <input type="hidden" name="id" value={editingUser.id} />
              <div className="space-y-2">
                <Label htmlFor="edit-name">Nombre completo</Label>
                <Input id="edit-name" name="name" defaultValue={editingUser.name} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-email">Correo electrónico</Label>
                <Input id="edit-email" name="email" type="email" defaultValue={editingUser.email} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-role">Tipo de usuario</Label>
                <Select name="role" defaultValue={editingUser.role}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ADMIN">Administrador</SelectItem>
                    <SelectItem value="USUARIO">Usuario</SelectItem>
                    <SelectItem value="CHOFER">Chofer</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-status">Estatus</Label>
                <Select name="status" defaultValue={editingUser.status}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="activo">Activo</SelectItem>
                    <SelectItem value="inactivo">Inactivo</SelectItem>
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

      {/* Delete User Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Eliminar Usuario</DialogTitle>
            <DialogDescription>
              ¿Estás seguro de que deseas eliminar a <strong>{deletingUser?.name}</strong>? Esta acción no se puede
              deshacer.
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
                "Eliminar usuario"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
