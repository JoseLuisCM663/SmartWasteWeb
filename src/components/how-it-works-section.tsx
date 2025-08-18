import { Card, CardContent } from "@/components/ui/card"
import { Wifi, Smartphone, BarChart3, Truck } from "lucide-react"

const steps = [
  {
    icon: Wifi,
    title: "Sensores IoT",
    description:
      "Sensores inteligentes instalados en contenedores monitorean niveles de llenado, temperatura y otros parámetros en tiempo real.",
    color: "bg-blue-100 text-blue-600",
    step: "01",
  },
  {
    icon: BarChart3,
    title: "Análisis de Datos",
    description:
      "Los datos se procesan mediante algoritmos de IA para generar insights y optimizar rutas de recolección automáticamente.",
    color: "bg-green-100 text-green-600",
    step: "02",
  },
  {
    icon: Smartphone,
    title: "Plataforma Digital",
    description:
      "Dashboard centralizado permite monitorear todos los contenedores, gestionar rutas y recibir alertas en tiempo real.",
    color: "bg-purple-100 text-purple-600",
    step: "03",
  },
  {
    icon: Truck,
    title: "Recolección Optimizada",
    description:
      "Los equipos reciben rutas optimizadas y notificaciones inteligentes para maximizar eficiencia y reducir costos operativos.",
    color: "bg-orange-100 text-orange-600",
    step: "04",
  },
]

export function HowItWorksSection() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-white">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-gray-900">
              ¿Cómo funciona SmartWaste?
            </h2>
            <p className="max-w-[900px] text-gray-600 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Un sistema integral que conecta sensores IoT con inteligencia artificial para revolucionar la gestión de
              residuos
            </p>
          </div>
        </div>

        <div className="mx-auto grid max-w-6xl gap-8 py-12 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, index) => {
            const IconComponent = step.icon
            return (
              <Card
                key={index}
                className="border-gray-200 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 relative"
              >
                <CardContent className="flex flex-col items-center space-y-4 p-6 text-center">
                  <div className="absolute -top-4 left-4 bg-green-600 text-white text-sm font-bold px-3 py-1 rounded-full">
                    {step.step}
                  </div>
                  <div className={`flex h-16 w-16 items-center justify-center rounded-lg ${step.color} mt-4`}>
                    <IconComponent className="h-8 w-8" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">{step.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{step.description}</p>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Process Flow */}
        <div className="mt-16 max-w-4xl mx-auto">
          <div className="relative">
            <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-green-200 via-green-400 to-green-600 transform -translate-y-1/2 hidden lg:block"></div>
            <div className="flex justify-between items-center relative z-10">
              {steps.map((step, index) => (
                <div key={index} className="flex flex-col items-center space-y-2">
                  <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
                    {index + 1}
                  </div>
                  <span className="text-sm font-medium text-gray-700 text-center max-w-20">{step.title}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
