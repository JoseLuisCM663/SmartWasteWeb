"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Leaf,
  LogOut,
  Users,
  Route,
  Shield,
  Trash2,
  Activity,
  BarChart3,
  FileText,
  Menu,
  X,
  Beaker,
} from "lucide-react"
import { logoutAction } from "@/app/actions/auth"
import { DashboardStats } from "@/components/dashboard-stats"
import { UserManagement } from "@/components/user-management"
import { RouteManagement } from "@/components/route-management"
import { ContainerManagement } from "@/components/container-management"
import { SensorManagement } from "@/components/sensor-management"
import { CollectionLog } from "@/components/collection-log"
import { SensorSimulator } from "@/components/sensor-simulator"
import Link from "next/link"

interface User {
  id: number
  email: string
  name: string
  role: string
}

interface DashboardLayoutProps {
  user: User
}

export function DashboardLayout({ user }: DashboardLayoutProps) {
  const [activeTab, setActiveTab] = useState("dashboard")
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const isAdmin = user.role === "ADMIN"
  const isChofer = user.role === "CHOFER"
  const isUsuario = user.role === "USUARIO"

  // Define navigation items based on user role
  const getNavigationItems = () => {
    const items = []

    if (isAdmin) {
      items.push(
        { id: "dashboard", label: "Dashboard", icon: BarChart3 },
        { id: "users", label: "Usuarios", icon: Users },
        { id: "routes", label: "Rutas", icon: Route },
        { id: "containers", label: "Contenedores", icon: Trash2 },
        { id: "sensors", label: "Sensores", icon: Activity },
        { id: "collections", label: "Bitácora", icon: FileText },
        { id: "simulator", label: "Simulador", icon: Beaker },
      )
    } else if (isChofer) {
      items.push(
        { id: "routes", label: "Mis Rutas", icon: Route },
        { id: "collections", label: "Bitácora", icon: FileText },
      )
    } else if (isUsuario) {
      items.push(
        { id: "routes", label: "Rutas Asignadas", icon: Route },
        { id: "sensors", label: "Lecturas", icon: Activity },
      )
    }

    return items
  }

  const navigationItems = getNavigationItems()

  const renderContent = () => {
    if (!isAdmin && activeTab === "dashboard") {
      return (
        <div className="max-w-2xl mx-auto text-center space-y-6 py-12">
          <div className="p-8 bg-white rounded-lg shadow-sm border">
            <div className="w-16 h-16 mx-auto mb-4 bg-yellow-100 rounded-full flex items-center justify-center">
              <Shield className="h-8 w-8 text-yellow-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Acceso Limitado</h1>
            <p className="text-gray-600 mb-6">
              Tu cuenta de tipo <strong>{user.role}</strong> tiene acceso limitado al sistema.
            </p>
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h3 className="font-semibold text-blue-900 mb-2">Funcionalidades Disponibles</h3>
                <ul className="text-sm text-blue-800 space-y-1">
                  {isChofer && (
                    <>
                      <li>• Visualizar rutas asignadas</li>
                      <li>• Registrar recolecciones en bitácora</li>
                      <li>• Actualizar estado de contenedores</li>
                    </>
                  )}
                  {isUsuario && (
                    <>
                      <li>• Ver rutas asignadas</li>
                      <li>• Monitorear lecturas de sensores</li>
                      <li>• Consultar historial de datos</li>
                    </>
                  )}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )
    }

    switch (activeTab) {
      case "dashboard":
        return <DashboardStats />
      case "users":
        return isAdmin ? <UserManagement /> : null
      case "routes":
        return <RouteManagement userRole={user.role} userId={user.id} />
      case "containers":
        return <ContainerManagement />
      case "sensors":
        return <SensorManagement userRole={user.role} />
      case "collections":
        return <CollectionLog userRole={user.role} userId={user.id} />
      case "simulator":
        return isAdmin ? <SensorSimulator /> : null
      default:
        return <DashboardStats />
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static lg:inset-0`}
      >
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
          <Link href="/" className="flex items-center space-x-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-600">
              <Leaf className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">SmartWaste</span>
          </Link>
          <Button variant="ghost" size="sm" className="lg:hidden" onClick={() => setSidebarOpen(false)}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2">
          {navigationItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id)
                setSidebarOpen(false)
              }}
              className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                activeTab === item.id ? "bg-green-100 text-green-700" : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <item.icon className="h-5 w-5" />
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
              <Shield className="h-4 w-4 text-gray-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">{user.name}</p>
              <p className="text-xs text-gray-500">{user.role}</p>
            </div>
          </div>
          <form action={logoutAction}>
            <Button variant="outline" size="sm" className="w-full bg-transparent">
              <LogOut className="h-4 w-4 mr-2" />
              Cerrar sesión
            </Button>
          </form>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 lg:ml-0">
        {/* Top Navigation */}
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" className="lg:hidden" onClick={() => setSidebarOpen(true)}>
                <Menu className="h-5 w-5" />
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {navigationItems.find((item) => item.id === activeTab)?.label || "Dashboard"}
                </h1>
                <p className="text-sm text-gray-600">Sistema de gestión inteligente de residuos urbanos</p>
              </div>
            </div>
            <Badge variant="outline" className="border-green-200 text-green-700">
              {isAdmin ? "Administrador" : isChofer ? "Chofer" : "Usuario"}
            </Badge>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6">{renderContent()}</main>
      </div>

      {/* Sidebar Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}
    </div>
  )
}
