import { Button } from "@/components/ui/button"
import { ArrowRight, Leaf, Recycle, Zap } from "lucide-react"
import Link from "next/link"

export function HeroSection() {
  return (
    <section id="inicio" className="relative overflow-hidden bg-gradient-to-br from-green-50 to-gray-50 py-20 sm:py-32">
      <div className="container px-4 md:px-6">
        <div className="mx-auto max-w-4xl text-center">
          <div className="mb-8 flex justify-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-600">
              <Leaf className="h-8 w-8 text-white" />
            </div>
          </div>

          <h1 className="mb-6 text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
            Gestión Inteligente de <span className="text-green-600">Residuos Urbanos</span>
          </h1>

          <p className="mb-8 text-lg text-gray-600 sm:text-xl">
            SmartWaste revoluciona la recolección de residuos con tecnología IoT, optimizando rutas, monitoreando
            contenedores en tiempo real y promoviendo la sostenibilidad urbana.
          </p>

          <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Link href="/login">
              <Button size="lg" className="bg-green-600 hover:bg-green-700 text-white">
                Acceder al Sistema
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="bg-transparent">
              Ver Demo
            </Button>
          </div>

          <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-3">
            <div className="flex flex-col items-center">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-green-100">
                <Zap className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="mb-2 text-lg font-semibold text-gray-900">IoT Inteligente</h3>
              <p className="text-sm text-gray-600">Sensores en tiempo real para monitoreo continuo</p>
            </div>

            <div className="flex flex-col items-center">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-green-100">
                <Recycle className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="mb-2 text-lg font-semibold text-gray-900">Sostenible</h3>
              <p className="text-sm text-gray-600">Reducción de emisiones y optimización de recursos</p>
            </div>

            <div className="flex flex-col items-center">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-green-100">
                <Leaf className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="mb-2 text-lg font-semibold text-gray-900">Eficiente</h3>
              <p className="text-sm text-gray-600">Rutas optimizadas y gestión automatizada</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
