"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Leaf, LogOut, Users, Route, Shield, Trash2, Activity, BarChart3, FileText } from "lucide-react"
import { logoutAction } from "@/app/actions/auth"
import { DashboardStats } from "@/components/dashboard-stats"
import { UserManagement } from "@/components/user-management"
import { RouteManagement } from "@/components/route-management"
import { ContainerManagement } from "@/components/container-management"
import { SensorManagement } from "@/components/sensor-management"
import { CollectionLog } from "@/components/collection-log"
import Link from "next/link"

interface User {
  id: number
  email: string
  name: string
  role: string
}

interface DashboardContentProps {
  user: User
}

export function DashboardContent({ user }: DashboardContentProps) {
  const isAdmin = user.role === "ADMIN"

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white border-b">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Link href="/" className="flex items-center space-x-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-600">
                    <Leaf className="h-5 w-5 text-white" />
                  </div>
                  <span className="text-xl font-bold text-gray-900">SmartWaste</span>
                </Link>
                <Badge variant="outline" className="border-green-200 text-green-700">
                  Acceso Restringido
                </Badge>
              </div>

              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">{user.name}</p>
                  <div className="flex items-center space-x-1">
                    <Shield className="h-3 w-3 text-gray-500" />
                    <p className="text-xs text-gray-600">{user.role}</p>
                  </div>
                </div>
                <form action={logoutAction}>
                  <Button variant="outline" size="sm" className="flex items-center space-x-2 bg-transparent">
                    <LogOut className="h-4 w-4" />
                    <span>Cerrar sesión</span>
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </header>

        {/* Restricted Access Content */}
        <main className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto text-center space-y-6">
            <div className="p-8 bg-white rounded-lg shadow-sm border">
              <div className="w-16 h-16 mx-auto mb-4 bg-yellow-100 rounded-full flex items-center justify-center">
                <Shield className="h-8 w-8 text-yellow-600" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Acceso Restringido</h1>
              <p className="text-gray-600 mb-6">
                Tu cuenta de tipo <strong>{user.role}</strong> no tiene permisos para acceder al panel de
                administración.
              </p>
              <div className="space-y-4">
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <h3 className="font-semibold text-blue-900 mb-2">Funcionalidades Futuras</h3>
                  <ul className="text-sm text-blue-800 space-y-1">
                    {user.role === "CHOFER" && (
                      <>
                        <li>• App móvil para conductores</li>
                        <li>• Rutas optimizadas en tiempo real</li>
                        <li>• Notificaciones de contenedores llenos</li>
                        <li>• Registro de recolecciones completadas</li>
                      </>
                    )}
                    {user.role === "USUARIO" && (
                      <>
                        <li>• Dashboard de monitoreo IoT</li>
                        <li>• Reportes de eficiencia y sostenibilidad</li>
                        <li>• Alertas y notificaciones inteligentes</li>
                        <li>• Análisis de datos de sensores</li>
                      </>
                    )}
                  </ul>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Link href="/">
                    <Button variant="outline" className="bg-transparent">
                      Volver al inicio
                    </Button>
                  </Link>
                  <form action={logoutAction}>
                    <Button className="bg-green-600 hover:bg-green-700 text-white">Cerrar sesión</Button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/" className="flex items-center space-x-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-600">
                  <Leaf className="h-5 w-5 text-white" />
                </div>
                <span className="text-xl font-bold text-gray-900">SmartWaste</span>
              </Link>
              <Badge variant="outline" className="border-green-200 text-green-700">
                Panel de Administración
              </Badge>
            </div>

            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{user.name}</p>
                <div className="flex items-center space-x-1">
                  <Shield className="h-3 w-3 text-gray-500" />
                  <p className="text-xs text-gray-600">{user.role}</p>
                </div>
              </div>
              <form action={logoutAction}>
                <Button variant="outline" size="sm" className="flex items-center space-x-2 bg-transparent">
                  <LogOut className="h-4 w-4" />
                  <span>Cerrar sesión</span>
                </Button>
              </form>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Panel de Administración SmartWaste</h1>
          <p className="text-gray-600 mt-2">
            Sistema integral de gestión inteligente de residuos sólidos urbanos con tecnología IoT
          </p>
        </div>

        <Tabs defaultValue="dashboard" className="space-y-6">
          <TabsList className="grid w-full grid-cols-6 lg:w-[1200px]">
            <TabsTrigger value="dashboard" className="flex items-center space-x-2">
              <BarChart3 className="h-4 w-4" />
              <span>Dashboard</span>
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center space-x-2">
              <Users className="h-4 w-4" />
              <span>Usuarios</span>
            </TabsTrigger>
            <TabsTrigger value="routes" className="flex items-center space-x-2">
              <Route className="h-4 w-4" />
              <span>Rutas</span>
            </TabsTrigger>
            <TabsTrigger value="containers" className="flex items-center space-x-2">
              <Trash2 className="h-4 w-4" />
              <span>Contenedores</span>
            </TabsTrigger>
            <TabsTrigger value="sensors" className="flex items-center space-x-2">
              <Activity className="h-4 w-4" />
              <span>Sensores</span>
            </TabsTrigger>
            <TabsTrigger value="collections" className="flex items-center space-x-2">
              <FileText className="h-4 w-4" />
              <span>Bitácora</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            <DashboardStats />
          </TabsContent>

          <TabsContent value="users" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Users className="h-5 w-5" />
                  <span>Gestión de Usuarios</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <UserManagement />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="routes" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Route className="h-5 w-5" />
                  <span>Gestión de Rutas</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <RouteManagement />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="containers" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Trash2 className="h-5 w-5" />
                  <span>Gestión de Contenedores</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ContainerManagement />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="sensors" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Activity className="h-5 w-5" />
                  <span>Gestión de Sensores IoT</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <SensorManagement />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="collections" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <FileText className="h-5 w-5" />
                  <span>Bitácora de Recolección</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CollectionLog />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
