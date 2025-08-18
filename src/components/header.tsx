"use client"

import { Button } from "@/components/ui/button"
import { Leaf, Menu, X } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container flex h-16 items-center justify-between px-4 md:px-6">
        <Link href="/" className="flex items-center space-x-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-600">
            <Leaf className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-bold text-gray-900">SmartWaste</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <Link href="#inicio" className="text-sm font-medium text-gray-700 hover:text-green-600 transition-colors">
            Inicio
          </Link>
          <Link href="#beneficios" className="text-sm font-medium text-gray-700 hover:text-green-600 transition-colors">
            Beneficios
          </Link>
          <Link href="#tecnologia" className="text-sm font-medium text-gray-700 hover:text-green-600 transition-colors">
            Tecnología
          </Link>
          <Link href="#contacto" className="text-sm font-medium text-gray-700 hover:text-green-600 transition-colors">
            Contacto
          </Link>
        </nav>

        <div className="flex items-center space-x-4">
          <Link href="/login">
            <Button className="bg-green-600 hover:bg-green-700 text-white">Iniciar sesión</Button>
          </Link>

          {/* Mobile menu button */}
          <Button variant="ghost" size="sm" className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden border-t bg-white">
          <nav className="container px-4 py-4 space-y-4">
            <Link
              href="#inicio"
              className="block text-sm font-medium text-gray-700 hover:text-green-600 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Inicio
            </Link>
            <Link
              href="#beneficios"
              className="block text-sm font-medium text-gray-700 hover:text-green-600 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Beneficios
            </Link>
            <Link
              href="#tecnologia"
              className="block text-sm font-medium text-gray-700 hover:text-green-600 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Tecnología
            </Link>
            <Link
              href="#contacto"
              className="block text-sm font-medium text-gray-700 hover:text-green-600 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Contacto
            </Link>
          </nav>
        </div>
      )}
    </header>
  )
}
