import { CheckCircle, TrendingDown, Clock, Shield, BarChart3, Users } from "lucide-react"

export function BenefitsSection() {
  const benefits = [
    {
      icon: TrendingDown,
      title: "Reducción de Costos",
      description: "Hasta 30% menos gastos operativos mediante rutas optimizadas y recolección eficiente.",
    },
    {
      icon: Clock,
      title: "Tiempo Real",
      description: "Monitoreo continuo del nivel de llenado de contenedores con alertas automáticas.",
    },
    {
      icon: Shield,
      title: "Confiable",
      description: "Sistema robusto con alta disponibilidad y respaldo de datos en la nube.",
    },
    {
      icon: BarChart3,
      title: "Analítica Avanzada",
      description: "Reportes detallados y predicciones para optimizar la gestión de residuos.",
    },
    {
      icon: Users,
      title: "Gestión Centralizada",
      description: "Control total de usuarios, rutas, contenedores y sensores desde un panel único.",
    },
    {
      icon: CheckCircle,
      title: "Fácil Implementación",
      description: "Instalación rápida y configuración intuitiva sin interrumpir operaciones.",
    },
  ]

  return (
    <section id="beneficios" className="py-20 bg-white">
      <div className="container px-4 md:px-6">
        <div className="mx-auto max-w-3xl text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl mb-4">Beneficios de SmartWaste</h2>
          <p className="text-lg text-gray-600">
            Descubre cómo nuestra plataforma transforma la gestión de residuos urbanos con tecnología de vanguardia y
            resultados medibles.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => (
            <div
              key={index}
              className="p-6 rounded-lg border border-gray-200 hover:border-green-200 hover:shadow-lg transition-all"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-green-100">
                <benefit.icon className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="mb-3 text-xl font-semibold text-gray-900">{benefit.title}</h3>
              <p className="text-gray-600">{benefit.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
