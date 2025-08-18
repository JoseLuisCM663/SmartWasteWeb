"use server"

import { cookies } from "next/headers"

// Simulated databases
const users = [
  {
    id: 1,
    email: "admin@smartwaste.com",
    password: "admin123",
    name: "Administrador Principal",
    role: "ADMIN",
    status: "activo",
    createdAt: "2024-01-15",
  },
  {
    id: 2,
    email: "usuario@smartwaste.com",
    password: "usuario123",
    name: "Lemuel Lira",
    role: "USUARIO",
    status: "activo",
    createdAt: "2024-02-10",
  },
  {
    id: 3,
    email: "chofer@smartwaste.com",
    password: "chofer123",
    name: "Raul Perez",
    role: "CHOFER",
    status: "activo",
    createdAt: "2024-02-15",
  },
  {
    id: 4,
    email: "carlos.lopez@smartwaste.com",
    password: "carlos123",
    name: "Carlos López",
    role: "USUARIO",
    status: "inactivo",
    createdAt: "2024-01-20",
  },
  {
    id: 5,
    email: "ana.martinez@smartwaste.com",
    password: "ana123",
    name: "Ana Martínez",
    role: "CHOFER",
    status: "activo",
    createdAt: "2024-02-20",
  },
]

const routes = [
  {
    id: 1,
    name: "Ruta Centro",
    description: "Recolección en el centro histórico de la ciudad",
    status: "activa",
    createdAt: "2024-01-10",
    assignedUsers: [2, 3],
  },
  {
    id: 2,
    name: "Ruta Norte",
    description: "Zona residencial norte, incluye parques y escuelas",
    status: "activa",
    createdAt: "2024-01-15",
    assignedUsers: [5],
  },
  {
    id: 3,
    name: "Ruta Industrial",
    description: "Zona industrial y comercial",
    status: "inactiva",
    createdAt: "2024-02-01",
    assignedUsers: [],
  },
]

const containers = [
  {
    id: 1,
    location: "Av. Reforma #123, Centro",
    capacity: 1000,
    description: "Contenedor principal frente al banco",
    status: "activo",
    fillLevel: 75,
    routeId: 1,
    createdAt: "2024-01-10",
  },
  {
    id: 2,
    location: "Parque Central, Zona Norte",
    capacity: 800,
    description: "Contenedor en área recreativa",
    status: "activo",
    fillLevel: 45,
    routeId: 2,
    createdAt: "2024-01-15",
  },
  {
    id: 3,
    location: "Calle Industrial #456",
    capacity: 1500,
    description: "Contenedor para zona comercial",
    status: "inactivo",
    fillLevel: 0,
    routeId: 3,
    createdAt: "2024-02-01",
  },
  {
    id: 4,
    location: "Plaza de Armas, Centro Histórico",
    capacity: 600,
    description: "Contenedor turístico",
    status: "activo",
    fillLevel: 90,
    routeId: 1,
    createdAt: "2024-01-20",
  },
  {
    id: 5,
    location: "Mercado Municipal, Zona Sur",
    capacity: 1200,
    description: "Contenedor para residuos orgánicos",
    status: "activo",
    fillLevel: 60,
    routeId: null,
    createdAt: "2024-02-05",
  },
]

const sensors = [
  {
    id: 1,
    type: "nivel",
    description: "Sensor ultrasónico de nivel de llenado",
    status: "activo",
    containerId: 1,
    createdAt: "2024-01-10",
  },
  {
    id: 2,
    type: "temperatura",
    description: "Sensor de temperatura ambiente",
    status: "activo",
    containerId: 1,
    createdAt: "2024-01-10",
  },
  {
    id: 3,
    type: "nivel",
    description: "Sensor de nivel principal",
    status: "activo",
    containerId: 2,
    createdAt: "2024-01-15",
  },
  {
    id: 4,
    type: "humedad",
    description: "Sensor de humedad relativa",
    status: "inactivo",
    containerId: 3,
    createdAt: "2024-02-01",
  },
  {
    id: 5,
    type: "nivel",
    description: "Sensor ultrasónico avanzado",
    status: "activo",
    containerId: 4,
    createdAt: "2024-01-20",
  },
  {
    id: 6,
    type: "peso",
    description: "Sensor de peso por carga",
    status: "activo",
    containerId: 5,
    createdAt: "2024-02-05",
  },
]

const sensorReadings = [
  // Container 1 readings
  { id: 1, sensorId: 1, value: 75, unit: "%", timestamp: "2024-03-15T10:30:00Z" },
  { id: 2, sensorId: 1, value: 73, unit: "%", timestamp: "2024-03-15T09:30:00Z" },
  { id: 3, sensorId: 1, value: 70, unit: "%", timestamp: "2024-03-15T08:30:00Z" },
  { id: 4, sensorId: 2, value: 22, unit: "°C", timestamp: "2024-03-15T10:30:00Z" },
  { id: 5, sensorId: 2, value: 21, unit: "°C", timestamp: "2024-03-15T09:30:00Z" },

  // Container 2 readings
  { id: 6, sensorId: 3, value: 45, unit: "%", timestamp: "2024-03-15T10:25:00Z" },
  { id: 7, sensorId: 3, value: 42, unit: "%", timestamp: "2024-03-15T09:25:00Z" },
  { id: 8, sensorId: 3, value: 40, unit: "%", timestamp: "2024-03-15T08:25:00Z" },

  // Container 4 readings
  { id: 9, sensorId: 5, value: 90, unit: "%", timestamp: "2024-03-15T10:20:00Z" },
  { id: 10, sensorId: 5, value: 88, unit: "%", timestamp: "2024-03-15T09:20:00Z" },
  { id: 11, sensorId: 5, value: 85, unit: "%", timestamp: "2024-03-15T08:20:00Z" },

  // Container 5 readings
  { id: 12, sensorId: 6, value: 450, unit: "kg", timestamp: "2024-03-15T10:15:00Z" },
  { id: 13, sensorId: 6, value: 445, unit: "kg", timestamp: "2024-03-15T09:15:00Z" },
  { id: 14, sensorId: 6, value: 440, unit: "kg", timestamp: "2024-03-15T08:15:00Z" },
]

// Collection logs database
const collectionLogs = [
  {
    id: 1,
    date: "2024-03-15T08:00:00Z",
    routeId: 1,
    containerIds: [1, 4],
    status: "completada",
    notes: "Recolección normal, sin incidencias",
    collectorName: "Juan Pérez",
    createdAt: "2024-03-15T08:30:00Z",
  },
  {
    id: 2,
    date: "2024-03-15T09:30:00Z",
    routeId: 2,
    containerIds: [2],
    status: "completada",
    notes: "Contenedor en buen estado",
    collectorName: "María García",
    createdAt: "2024-03-15T10:00:00Z",
  },
  {
    id: 3,
    date: "2024-03-15T14:00:00Z",
    routeId: 1,
    containerIds: [1],
    status: "en_progreso",
    notes: "Recolección parcial, contenedor muy lleno",
    collectorName: "Carlos López",
    createdAt: "2024-03-15T14:15:00Z",
  },
  {
    id: 4,
    date: "2024-03-14T16:00:00Z",
    routeId: 2,
    containerIds: [2, 5],
    status: "completada",
    notes: "Ruta completada sin problemas",
    collectorName: "Ana Martínez",
    createdAt: "2024-03-14T17:00:00Z",
  },
  {
    id: 5,
    date: "2024-03-14T07:30:00Z",
    routeId: 3,
    containerIds: [3],
    status: "cancelada",
    notes: "Contenedor inaccesible por obras",
    collectorName: "Pedro Sánchez",
    createdAt: "2024-03-14T08:00:00Z",
  },
]

// Simple JWT simulation
function createToken(user: any) {
  const payload = {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    exp: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
  }
  return Buffer.from(JSON.stringify(payload)).toString("base64")
}

export async function loginAction(formData: FormData) {
  const email = formData.get("email") as string
  const password = formData.get("password") as string

  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 1000))

  // Find user
  const user = users.find((u) => u.email === email && u.password === password)

  if (!user) {
    return {
      success: false,
      error: "Correo o contraseña incorrectos",
    }
  }

  if (user.status === "inactivo") {
    return {
      success: false,
      error: "Tu cuenta está inactiva. Contacta al administrador.",
    }
  }

  // Create token and set cookie
  const token = createToken(user)
  const cookieStore = await cookies()

  cookieStore.set("auth-token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 24 * 60 * 60, // 24 hours
  })

  return {
    success: true,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    },
  }
}

export async function logoutAction() {
  const cookieStore = await cookies()
  cookieStore.delete("auth-token")
}

export async function getUser() {
  const cookieStore = await cookies()
  const token = cookieStore.get("auth-token")?.value

  if (!token) {
    return null
  }

  try {
    const payload = JSON.parse(Buffer.from(token, "base64").toString())

    // Check if token is expired
    if (payload.exp < Date.now()) {
      return null
    }

    return {
      id: payload.id,
      email: payload.email,
      name: payload.name,
      role: payload.role,
    }
  } catch {
    return null
  }
}

// Sensor simulator function
export async function generateSensorReadings(formData: FormData) {
  const sensorId = Number.parseInt(formData.get("sensorId") as string)
  const count = Number.parseInt(formData.get("count") as string)
  const interval = Number.parseInt(formData.get("interval") as string)

  await new Promise((resolve) => setTimeout(resolve, 1500)) // Simulate processing

  const sensor = sensors.find((s) => s.id === sensorId)
  if (!sensor) {
    return { success: false, message: "Sensor no encontrado" }
  }

  if (sensor.status !== "activo") {
    return { success: false, message: "El sensor no está activo" }
  }

  // Generate readings
  const newReadings = []
  const now = new Date()

  for (let i = 0; i < count; i++) {
    const timestamp = new Date(now.getTime() - (count - i - 1) * interval * 60 * 1000)

    let value: number
    let unit: string

    switch (sensor.type) {
      case "nivel":
        value = Math.floor(Math.random() * 100) // 0-100%
        unit = "%"
        break
      case "temperatura":
        value = Math.floor(Math.random() * 20) + 15 // 15-35°C
        unit = "°C"
        break
      case "humedad":
        value = Math.floor(Math.random() * 40) + 40 // 40-80%
        unit = "%"
        break
      case "peso":
        value = Math.floor(Math.random() * 500) + 100 // 100-600kg
        unit = "kg"
        break
      default:
        value = Math.floor(Math.random() * 100)
        unit = "units"
    }

    const reading = {
      id: Math.max(...sensorReadings.map((r) => r.id), 0) + newReadings.length + 1,
      sensorId,
      value,
      unit,
      timestamp: timestamp.toISOString(),
    }

    newReadings.push(reading)
  }

  // Add to readings array
  sensorReadings.push(...newReadings)

  const timeRange = `${new Date(now.getTime() - (count - 1) * interval * 60 * 1000).toLocaleString()} - ${now.toLocaleString()}`

  return {
    success: true,
    message: `Se generaron ${count} lecturas exitosamente para el sensor ${sensor.description}`,
    data: {
      count,
      sensorId,
      timeRange,
      readings: newReadings,
    },
  }
}

// Dashboard statistics function
export async function getDashboardStats(timeRange = "7d") {
  await new Promise((resolve) => setTimeout(resolve, 800))

  // Generate mock data based on time range
  const generateRouteCapacity = () => [
    { name: "Ruta Centro", capacity: 85, usage: 75 },
    { name: "Ruta Norte", capacity: 70, usage: 45 },
    { name: "Ruta Industrial", capacity: 95, usage: 20 },
  ]

  const generateContainerUsage = () => {
    const days = timeRange === "24h" ? 1 : timeRange === "7d" ? 7 : timeRange === "30d" ? 30 : 90
    const data = []
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      data.push({
        day: date.toLocaleDateString("es-ES", { month: "short", day: "numeric" }),
        usage: Math.floor(Math.random() * 40) + 50, // 50-90%
        collections: Math.floor(Math.random() * 8) + 2, // 2-10 collections
      })
    }
    return data
  }

  const generateRecentCollections = () => [
    {
      id: 1,
      route: "Ruta Centro",
      container: "Av. Reforma #123",
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      status: "completada",
    },
    {
      id: 2,
      route: "Ruta Norte",
      container: "Parque Central",
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
      status: "en_progreso",
    },
    {
      id: 3,
      route: "Ruta Centro",
      container: "Plaza de Armas",
      timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
      status: "completada",
    },
    {
      id: 4,
      route: "Ruta Industrial",
      container: "Calle Industrial #456",
      timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
      status: "pendiente",
    },
  ]

  const generateSensorReadings = () => [
    {
      id: 1,
      sensor: "Sensor-001",
      type: "nivel",
      value: 75,
      unit: "%",
      timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
      status: "normal",
    },
    {
      id: 2,
      sensor: "Sensor-002",
      type: "temperatura",
      value: 22,
      unit: "°C",
      timestamp: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
      status: "normal",
    },
    {
      id: 3,
      sensor: "Sensor-003",
      type: "nivel",
      value: 90,
      unit: "%",
      timestamp: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
      status: "alerta",
    },
    {
      id: 4,
      sensor: "Sensor-004",
      type: "peso",
      value: 450,
      unit: "kg",
      timestamp: new Date(Date.now() - 90 * 60 * 1000).toISOString(),
      status: "normal",
    },
    {
      id: 5,
      sensor: "Sensor-005",
      type: "humedad",
      value: 65,
      unit: "%",
      timestamp: new Date(Date.now() - 120 * 60 * 1000).toISOString(),
      status: "normal",
    },
  ]

  return {
    summary: {
      totalRoutes: routes.filter((r) => r.status === "activa").length,
      activeContainers: containers.filter((c) => c.status === "activo").length,
      connectedSensors: sensors.filter((s) => s.status === "activo").length,
      totalUsers: users.filter((u) => u.status === "activo").length,
    },
    routeCapacity: generateRouteCapacity(),
    containerUsage: generateContainerUsage(),
    recentCollections: generateRecentCollections(),
    sensorReadings: generateSensorReadings(),
    containerStatus: [
      { name: "Vacío (0-30%)", value: 2, color: "#22c55e" },
      { name: "Medio (31-70%)", value: 2, color: "#eab308" },
      { name: "Lleno (71-100%)", value: 1, color: "#ef4444" },
    ],
  }
}

// User management functions
export async function getAllUsers() {
  await new Promise((resolve) => setTimeout(resolve, 500))
  return users.map((user) => ({
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    status: user.status,
    createdAt: user.createdAt,
  }))
}

export async function createUser(formData: FormData) {
  const name = formData.get("name") as string
  const email = formData.get("email") as string
  const password = formData.get("password") as string
  const role = formData.get("role") as string

  await new Promise((resolve) => setTimeout(resolve, 800))

  const existingUser = users.find((u) => u.email === email)
  if (existingUser) {
    return { success: false, error: "El correo electrónico ya está registrado" }
  }

  const newUser = {
    id: Math.max(...users.map((u) => u.id)) + 1,
    email,
    password,
    name,
    role,
    status: "activo",
    createdAt: new Date().toISOString().split("T")[0],
  }

  users.push(newUser)
  return { success: true, user: newUser }
}

export async function updateUser(formData: FormData) {
  const id = Number.parseInt(formData.get("id") as string)
  const name = formData.get("name") as string
  const email = formData.get("email") as string
  const role = formData.get("role") as string
  const status = formData.get("status") as string

  await new Promise((resolve) => setTimeout(resolve, 800))

  const userIndex = users.findIndex((u) => u.id === id)
  if (userIndex === -1) {
    return { success: false, error: "Usuario no encontrado" }
  }

  const existingUser = users.find((u) => u.email === email && u.id !== id)
  if (existingUser) {
    return { success: false, error: "El correo electrónico ya está en uso" }
  }

  users[userIndex] = {
    ...users[userIndex],
    name,
    email,
    role,
    status,
  }

  return { success: true }
}

export async function deleteUser(userId: number) {
  await new Promise((resolve) => setTimeout(resolve, 600))

  const userIndex = users.findIndex((u) => u.id === userId)
  if (userIndex === -1) {
    return { success: false, error: "Usuario no encontrado" }
  }

  users.splice(userIndex, 1)
  return { success: true }
}

// Route management functions
export async function getAllRoutes() {
  await new Promise((resolve) => setTimeout(resolve, 500))
  return routes.map((route) => ({
    ...route,
    assignedUsersDetails: route.assignedUsers
      .map((userId) => {
        const user = users.find((u) => u.id === userId)
        return user ? { id: user.id, name: user.name, role: user.role } : null
      })
      .filter(Boolean),
  }))
}

export async function createRoute(formData: FormData) {
  const name = formData.get("name") as string
  const description = formData.get("description") as string
  const status = formData.get("status") as string

  await new Promise((resolve) => setTimeout(resolve, 800))

  const newRoute = {
    id: Math.max(...routes.map((r) => r.id)) + 1,
    name,
    description,
    status,
    createdAt: new Date().toISOString().split("T")[0],
    assignedUsers: [],
  }

  routes.push(newRoute)
  return { success: true, route: newRoute }
}

export async function updateRoute(formData: FormData) {
  const id = Number.parseInt(formData.get("id") as string)
  const name = formData.get("name") as string
  const description = formData.get("description") as string
  const status = formData.get("status") as string

  await new Promise((resolve) => setTimeout(resolve, 800))

  const routeIndex = routes.findIndex((r) => r.id === id)
  if (routeIndex === -1) {
    return { success: false, error: "Ruta no encontrada" }
  }

  routes[routeIndex] = {
    ...routes[routeIndex],
    name,
    description,
    status,
  }

  return { success: true }
}

export async function deleteRoute(routeId: number) {
  await new Promise((resolve) => setTimeout(resolve, 600))

  const routeIndex = routes.findIndex((r) => r.id === routeId)
  if (routeIndex === -1) {
    return { success: false, error: "Ruta no encontrada" }
  }

  routes.splice(routeIndex, 1)
  return { success: true }
}

export async function getAssignableUsers() {
  await new Promise((resolve) => setTimeout(resolve, 300))
  return users
    .filter((user) => user.role === "CHOFER" || user.role === "USUARIO")
    .filter((user) => user.status === "activo")
    .map((user) => ({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    }))
}

export async function assignUsersToRoute(routeId: number, userIds: number[]) {
  await new Promise((resolve) => setTimeout(resolve, 800))

  const routeIndex = routes.findIndex((r) => r.id === routeId)
  if (routeIndex === -1) {
    return { success: false, error: "Ruta no encontrada" }
  }

  routes[routeIndex].assignedUsers = userIds
  return { success: true }
}

// Container management functions
export async function getAllContainers() {
  await new Promise((resolve) => setTimeout(resolve, 500))
  return containers.map((container) => ({
    ...container,
    routeDetails: container.routeId ? routes.find((r) => r.id === container.routeId) : null,
  }))
}

export async function createContainer(formData: FormData) {
  const location = formData.get("location") as string
  const capacity = Number.parseInt(formData.get("capacity") as string)
  const description = formData.get("description") as string
  const status = formData.get("status") as string
  const routeId = formData.get("routeId") as string

  await new Promise((resolve) => setTimeout(resolve, 800))

  const newContainer = {
    id: Math.max(...containers.map((c) => c.id)) + 1,
    location,
    capacity,
    description,
    status,
    fillLevel: 0,
    routeId: routeId ? Number.parseInt(routeId) : null,
    createdAt: new Date().toISOString().split("T")[0],
  }

  containers.push(newContainer)
  return { success: true, container: newContainer }
}

export async function updateContainer(formData: FormData) {
  const id = Number.parseInt(formData.get("id") as string)
  const location = formData.get("location") as string
  const capacity = Number.parseInt(formData.get("capacity") as string)
  const description = formData.get("description") as string
  const status = formData.get("status") as string
  const routeId = formData.get("routeId") as string

  await new Promise((resolve) => setTimeout(resolve, 800))

  const containerIndex = containers.findIndex((c) => c.id === id)
  if (containerIndex === -1) {
    return { success: false, error: "Contenedor no encontrado" }
  }

  containers[containerIndex] = {
    ...containers[containerIndex],
    location,
    capacity,
    description,
    status,
    routeId: routeId ? Number.parseInt(routeId) : null,
  }

  return { success: true }
}

export async function deleteContainer(containerId: number) {
  await new Promise((resolve) => setTimeout(resolve, 600))

  const containerIndex = containers.findIndex((c) => c.id === containerId)
  if (containerIndex === -1) {
    return { success: false, error: "Contenedor no encontrado" }
  }

  containers.splice(containerIndex, 1)
  return { success: true }
}

// Sensor management functions
export async function getAllSensors() {
  await new Promise((resolve) => setTimeout(resolve, 500))
  return sensors.map((sensor) => ({
    ...sensor,
    containerDetails: sensor.containerId ? containers.find((c) => c.id === sensor.containerId) : null,
  }))
}

export async function createSensor(formData: FormData) {
  const type = formData.get("type") as string
  const description = formData.get("description") as string
  const status = formData.get("status") as string
  const containerId = formData.get("containerId") as string

  await new Promise((resolve) => setTimeout(resolve, 800))

  const newSensor = {
    id: Math.max(...sensors.map((s) => s.id)) + 1,
    type,
    description,
    status,
    containerId: containerId ? Number.parseInt(containerId) : null,
    createdAt: new Date().toISOString().split("T")[0],
  }

  sensors.push(newSensor)
  return { success: true, sensor: newSensor }
}

export async function updateSensor(formData: FormData) {
  const id = Number.parseInt(formData.get("id") as string)
  const type = formData.get("type") as string
  const description = formData.get("description") as string
  const status = formData.get("status") as string
  const containerId = formData.get("containerId") as string

  await new Promise((resolve) => setTimeout(resolve, 800))

  const sensorIndex = sensors.findIndex((s) => s.id === id)
  if (sensorIndex === -1) {
    return { success: false, error: "Sensor no encontrado" }
  }

  sensors[sensorIndex] = {
    ...sensors[sensorIndex],
    type,
    description,
    status,
    containerId: containerId ? Number.parseInt(containerId) : null,
  }

  return { success: true }
}

export async function deleteSensor(sensorId: number) {
  await new Promise((resolve) => setTimeout(resolve, 600))

  const sensorIndex = sensors.findIndex((s) => s.id === sensorId)
  if (sensorIndex === -1) {
    return { success: false, error: "Sensor no encontrado" }
  }

  sensors.splice(sensorIndex, 1)
  return { success: true }
}

export async function getSensorReadings(containerId: number, sensorType?: string) {
  await new Promise((resolve) => setTimeout(resolve, 300))

  // Get sensors for the container
  const containerSensors = sensors.filter((s) => s.containerId === containerId)

  if (sensorType) {
    const filteredSensors = containerSensors.filter((s) => s.type === sensorType)
    const sensorIds = filteredSensors.map((s) => s.id)
    return sensorReadings
      .filter((r) => sensorIds.includes(r.sensorId))
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, 10) // Last 10 readings
      .map((reading) => ({
        ...reading,
        sensorDetails: sensors.find((s) => s.id === reading.sensorId),
      }))
  }

  const sensorIds = containerSensors.map((s) => s.id)
  return sensorReadings
    .filter((r) => sensorIds.includes(r.sensorId))
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, 20) // Last 20 readings
    .map((reading) => ({
      ...reading,
      sensorDetails: sensors.find((s) => s.id === reading.sensorId),
    }))
}

// New function for sensor history with line chart data
export async function getSensorHistory(sensorId: number, fromDate: Date, toDate: Date) {
  await new Promise((resolve) => setTimeout(resolve, 500))

  // Generate mock historical data for the sensor
  const sensor = sensors.find((s) => s.id === sensorId)
  if (!sensor) return []

  const data = []
  const diffTime = Math.abs(toDate.getTime() - fromDate.getTime())
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

  // Generate data points every few hours
  const pointsPerDay = diffDays <= 1 ? 24 : diffDays <= 7 ? 4 : 2
  const totalPoints = Math.min(diffDays * pointsPerDay, 100) // Limit to 100 points

  for (let i = 0; i < totalPoints; i++) {
    const timestamp = new Date(fromDate.getTime() + i * (diffTime / totalPoints))

    let value: number
    switch (sensor.type) {
      case "nivel":
        value = Math.floor(Math.random() * 100) // 0-100%
        break
      case "temperatura":
        value = Math.floor(Math.random() * 20) + 15 // 15-35°C
        break
      case "humedad":
        value = Math.floor(Math.random() * 40) + 40 // 40-80%
        break
      case "peso":
        value = Math.floor(Math.random() * 500) + 100 // 100-600kg
        break
      default:
        value = Math.floor(Math.random() * 100)
    }

    data.push({
      timestamp: timestamp.toISOString(),
      value,
      formattedTime: timestamp.toLocaleString("es-ES", {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
    })
  }

  return data.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
}

// Collection log management functions
export async function getAllCollectionLogs() {
  await new Promise((resolve) => setTimeout(resolve, 500))
  return collectionLogs.map((log) => ({
    ...log,
    routeDetails: routes.find((r) => r.id === log.routeId) || null,
    containerDetails: log.containerIds
      .map((id) => {
        const container = containers.find((c) => c.id === id)
        return container ? { id: container.id, location: container.location } : null
      })
      .filter(Boolean),
  }))
}

export async function createCollectionLog(formData: FormData) {
  const date = formData.get("date") as string
  const routeId = Number.parseInt(formData.get("routeId") as string)
  const containerIds = JSON.parse(formData.get("containerIds") as string)
  const status = formData.get("status") as string
  const notes = formData.get("notes") as string
  const collectorName = formData.get("collectorName") as string

  await new Promise((resolve) => setTimeout(resolve, 800))

  const newLog = {
    id: Math.max(...collectionLogs.map((l) => l.id)) + 1,
    date,
    routeId,
    containerIds,
    status,
    notes,
    collectorName,
    createdAt: new Date().toISOString(),
  }

  collectionLogs.push(newLog)
  return { success: true, log: newLog }
}

export async function updateCollectionLog(formData: FormData) {
  const id = Number.parseInt(formData.get("id") as string)
  const date = formData.get("date") as string
  const status = formData.get("status") as string
  const notes = formData.get("notes") as string
  const collectorName = formData.get("collectorName") as string
  const containerIds = JSON.parse(formData.get("containerIds") as string)

  await new Promise((resolve) => setTimeout(resolve, 800))

  const logIndex = collectionLogs.findIndex((l) => l.id === id)
  if (logIndex === -1) {
    return { success: false, error: "Registro no encontrado" }
  }

  collectionLogs[logIndex] = {
    ...collectionLogs[logIndex],
    date,
    status,
    notes,
    collectorName,
    containerIds,
  }

  return { success: true }
}

export async function deleteCollectionLog(logId: number) {
  await new Promise((resolve) => setTimeout(resolve, 600))

  const logIndex = collectionLogs.findIndex((l) => l.id === logId)
  if (logIndex === -1) {
    return { success: false, error: "Registro no encontrado" }
  }

  collectionLogs.splice(logIndex, 1)
  return { success: true }
}
