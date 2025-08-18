import { Cpu, Wifi, Database, Smartphone, Cloud, Activity } from "lucide-react"

export function TechnologySection() {
  const technologies = [
    {
      icon: Cpu,
      title: "Sensores IoT",
      description: "Dispositivos inteligentes para medir nivel, peso, temperatura y humedad en contenedores.",
    },
    {
      icon: Wifi,
      title: "Conectividad",
      description: "Comunicación inalámbrica confiable mediante LoRaWAN, 4G/5G y WiFi.",
    },
    {
      icon: Database,
      title: "Big Data",
      description: "Almacenamiento y procesamiento de grandes volúmenes de datos en tiempo real.",
    },
    {
      icon: Smartphone,
      title: "App Móvil",
      description: "Aplicación para conductores con rutas optimizadas y notificaciones push.",
    },
    {
      icon: Cloud,
      title: "Cloud Computing",
      description: "Infraestructura escalable en la nube con alta disponibilidad y seguridad.",
    },
    {
      icon: Activity,
      title: "IA y Machine Learning",
      description: "Algoritmos predictivos para optimización de rutas y patrones de llenado.",
    },
  ]

  return (
    <section id="tecnologia" className="py-20 bg-gray-50">
      <div className="container px-4 md:px-6">
        <div className="mx-auto max-w-3xl text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl mb-4">Tecnología de Vanguardia</h2>
          <p className="text-lg text-gray-600">
            SmartWaste integra las últimas tecnologías IoT, inteligencia artificial y computación en la nube para
            ofrecer una solución completa.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {technologies.map((tech, index) => (
            <div
              key={index}
              className="p-6 bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-gray-100">
                <tech.icon className="h-6 w-6 text-gray-600" />
              </div>
              <h3 className="mb-3 text-xl font-semibold text-gray-900">{tech.title}</h3>
              <p className="text-gray-600">{tech.description}</p>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-green-100 text-green-800 text-sm font-medium">
            <Activity className="h-4 w-4 mr-2" />
            Sistema en funcionamiento 24/7
          </div>
        </div>
      </div>
    </section>
  )
}
