"use client"

import { useState, useEffect } from "react"
import dynamic from "next/dynamic"
import { MapPin, Navigation, Phone, Clock, Star, Wine, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

// Importação dinâmica para evitar problemas de SSR
const CustomMap = dynamic(() => import("@/components/maps/custom-map"), {
  ssr: false,
  loading: () => (
    <div className="bg-gray-700/50 rounded-lg h-96 flex items-center justify-center border-2 border-dashed border-gray-600">
      <div className="text-center">
        <MapPin className="h-16 w-16 text-purple-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-white mb-2">Carregando Mapa...</h3>
        <p className="text-gray-400">Aguarde enquanto carregamos o Google Maps</p>
      </div>
    </div>
  )
})

interface Bar {
  id: string
  name: string
  address: string
  phone: string
  hours: string
  rating: number
  lat: number
  lng: number
  description: string
  specialties: string[]
  priceRange: "€" | "€€" | "€€€"
}

export default function RotaCaipirinha() {
  const [isClient, setIsClient] = useState(false)
  const [bars, setBars] = useState<Bar[]>([
    {
      id: "1",
      name: "Bar da Caipirinha",
      address: "Rua das Flores, 123",
      phone: "(11) 99999-9999",
      hours: "18:00 - 02:00",
      rating: 4.8,
      lat: -23.5505,
      lng: -46.6333,
      description: "Especialista em caipirinhas tradicionais e criativas",
      specialties: ["Caipirinha Tradicional", "Caipirinha de Frutas", "Cachaça Premium"],
      priceRange: "€€"
    },
    {
      id: "2",
      name: "Cantinho Brasileiro",
      address: "Av. Paulista, 456",
      phone: "(11) 88888-8888",
      hours: "17:00 - 01:00",
      rating: 4.5,
      lat: -23.5615,
      lng: -46.6565,
      description: "Ambiente aconchegante com música ao vivo",
      specialties: ["Caipirinha de Limão", "Batidas", "Drinks Brasileiros"],
      priceRange: "€€€"
    },
    {
      id: "3",
      name: "Samba & Cachaça",
      address: "Rua Augusta, 789",
      phone: "(11) 77777-7777",
      hours: "19:00 - 03:00",
      rating: 4.7,
      lat: -23.5489,
      lng: -46.6388,
      description: "Noite de samba com as melhores caipirinhas",
      specialties: ["Caipirinha Artesanal", "Cachaça de Alambique", "Petiscos"],
      priceRange: "€€"
    }
  ])

  const [selectedBar, setSelectedBar] = useState<Bar | null>(null)

  useEffect(() => {
    setIsClient(true)
    // Aqui você pode integrar com Google Maps API
    // Por enquanto, vamos simular o mapa
    console.log("Inicializando mapa com bares:", bars)
  }, [bars])

  const openInGoogleMaps = (bar: Bar) => {
    if (typeof window !== 'undefined') {
      const url = `https://www.google.com/maps?q=${bar.lat},${bar.lng}`
      window.open(url, '_blank')
    }
  }

  const callBar = (phone: string) => {
    if (typeof window !== 'undefined') {
      window.open(`tel:${phone}`)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-gray-900 to-purple-800">
      {/* Header */}
      <header className="bg-gray-900/80 backdrop-blur-md border-b border-purple-500/30">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/">
                <Button variant="outline" size="sm" className="border-purple-500 text-purple-300 hover:bg-purple-900/50">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Voltar
                </Button>
              </Link>
              <div className="flex items-center space-x-3">
                <Wine className="h-8 w-8 text-purple-400" />
                <div>
                  <h1 className="text-2xl font-bold text-white">Rota da Caipirinha</h1>
                  <p className="text-gray-300">Descubra os melhores bares da cidade</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Lista de Bares */}
          <div className="lg:col-span-1 space-y-4">
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6">
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
                <MapPin className="h-5 w-5 mr-2 text-purple-400" />
                Bares na Rota
              </h2>
              <div className="space-y-3">
                {bars.map((bar) => (
                  <Card 
                    key={bar.id} 
                    className={`cursor-pointer transition-all duration-300 bg-gray-700/50 border-gray-600 hover:border-purple-500/50 ${
                      selectedBar?.id === bar.id ? 'border-purple-500 bg-purple-900/20' : ''
                    }`}
                    onClick={() => setSelectedBar(bar)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold text-white mb-1">{bar.name}</h3>
                          <p className="text-sm text-gray-300 mb-2">{bar.description}</p>
                          <div className="flex items-center space-x-2 mb-2">
                            <div className="flex items-center">
                              {[...Array(5)].map((_, i) => (
                                <Star 
                                  key={i} 
                                  className={`h-3 w-3 ${i < Math.floor(bar.rating) ? 'text-yellow-400 fill-current' : 'text-gray-600'}`} 
                                />
                              ))}
                              <span className="text-xs text-gray-400 ml-1">{bar.rating}</span>
                            </div>
                            <Badge className="bg-purple-900/50 text-purple-200 text-xs">
                              {bar.priceRange}
                            </Badge>
                          </div>
                          <div className="flex items-center text-xs text-gray-400">
                            <Clock className="h-3 w-3 mr-1" />
                            {bar.hours}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>

          {/* Mapa e Detalhes */}
          <div className="lg:col-span-2 space-y-6">
            {/* Mapa Interativo */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6">
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
                <Navigation className="h-5 w-5 mr-2 text-green-400" />
                Mapa Interativo
              </h2>
              {isClient ? (
                <CustomMap 
                  bars={bars}
                  selectedBar={selectedBar}
                  onBarSelect={setSelectedBar}
                  center={{ lat: -23.5505, lng: -46.6333 }}
                  zoom={13}
                />
              ) : (
                <div className="bg-gray-700/50 rounded-lg h-96 flex items-center justify-center border-2 border-dashed border-gray-600">
                  <div className="text-center">
                    <MapPin className="h-16 w-16 text-purple-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-white mb-2">Carregando Mapa...</h3>
                    <p className="text-gray-400">Aguarde enquanto carregamos o Google Maps</p>
                  </div>
                </div>
              )}
            </div>

            {/* Detalhes do Bar Selecionado */}
            {selectedBar && (
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6">
                <h2 className="text-xl font-semibold text-white mb-4">Detalhes do Bar</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">{selectedBar.name}</h3>
                    <p className="text-gray-300 mb-4">{selectedBar.description}</p>
                    
                    <div className="space-y-3">
                      <div className="flex items-center text-gray-300">
                        <MapPin className="h-4 w-4 mr-2 text-purple-400" />
                        <span>{selectedBar.address}</span>
                      </div>
                      <div className="flex items-center text-gray-300">
                        <Phone className="h-4 w-4 mr-2 text-green-400" />
                        <span>{selectedBar.phone}</span>
                      </div>
                      <div className="flex items-center text-gray-300">
                        <Clock className="h-4 w-4 mr-2 text-blue-400" />
                        <span>{selectedBar.hours}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-md font-semibold text-white mb-3">Especialidades</h4>
                    <div className="space-y-2 mb-4">
                      {selectedBar.specialties.map((specialty, index) => (
                        <Badge key={index} className="bg-purple-900/50 text-purple-200 mr-2 mb-2">
                          {specialty}
                        </Badge>
                      ))}
                    </div>
                    
                    <div className="flex space-x-3">
                      <Button
                        onClick={() => openInGoogleMaps(selectedBar)}
                        className="bg-green-600 hover:bg-green-700 flex-1"
                      >
                        <Navigation className="h-4 w-4 mr-2" />
                        Ver no Mapa
                      </Button>
                      <Button
                        onClick={() => callBar(selectedBar.phone)}
                        variant="outline"
                        className="border-blue-500 text-blue-300 hover:bg-blue-900/50"
                      >
                        <Phone className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
