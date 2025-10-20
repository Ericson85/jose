"use client"

import { useState, useEffect } from "react"
import { MapPin, Navigation, Phone, Clock, Star, Wine, ArrowLeft, Filter, Utensils, Music, Coffee } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import InstagramFeed from "@/components/instagram/instagram-feed"

interface Establishment {
  id: string
  name: string
  type: "bar" | "boate" | "restaurante"
  category: string
  address: string
  phone: string
  description: string
  lat: number
  lng: number
  rating: number
  hours: {
    monday: string
    tuesday: string
    wednesday: string
    thursday: string
    friday: string
    saturday: string
    sunday: string
  }
  specialties: string[]
  priceRange: "€" | "€€" | "€€€"
  menuLink?: string
  googlePlaceId?: string
  images: string[]
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export default function RotaCaipirinha() {
  const [isClient, setIsClient] = useState(false)
  const [establishments, setEstablishments] = useState<Establishment[]>([])

  const loadEstablishments = async () => {
    try {
      console.log('Carregando estabelecimentos...')
      const response = await fetch('/api/establishments?active=true')
      const data = await response.json()
      console.log('Dados recebidos:', data)
      if (data.success) {
        setEstablishments(data.data)
        console.log('Estabelecimentos carregados:', data.data.length)
      }
    } catch (error) {
      console.error('Erro ao carregar estabelecimentos:', error)
    }
  }

  const [selectedEstablishment, setSelectedEstablishment] = useState<Establishment | null>(null)
  const [selectedType, setSelectedType] = useState<"todos" | "bar" | "boate" | "restaurante">("todos")
  const [showFeed, setShowFeed] = useState(false)

  useEffect(() => {
    setIsClient(true)
    loadEstablishments()
  }, [])

  useEffect(() => {
    console.log("Inicializando mapa com estabelecimentos:", establishments)
  }, [establishments])

  useEffect(() => {
    console.log("Estabelecimento selecionado:", selectedEstablishment)
  }, [selectedEstablishment])

  // Filtrar estabelecimentos por tipo
  const filteredEstablishments = selectedType === "todos" 
    ? establishments 
    : establishments.filter(est => est.type === selectedType)

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "bar": return <Wine className="h-4 w-4" />
      case "boate": return <Music className="h-4 w-4" />
      case "restaurante": return <Utensils className="h-4 w-4" />
      default: return <Coffee className="h-4 w-4" />
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "bar": return "text-purple-400"
      case "boate": return "text-pink-400"
      case "restaurante": return "text-orange-400"
      default: return "text-gray-400"
    }
  }

  // Função para verificar se o estabelecimento está aberto
  function isEstablishmentOpen(hours: any) {
    const now = new Date();
    const currentDay = now.getDay(); // 0 = domingo, 1 = segunda, etc.
    let currentTime = now.getHours() * 60 + now.getMinutes(); // minutos desde meia-noite
    
    const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const currentDayName = dayNames[currentDay];
    const todayHours = hours[currentDayName];
    
    if (!todayHours || todayHours.toLowerCase().includes('fechado')) {
      return false;
    }
    
    // Parse do horário (ex: "18:00 - 02:00")
    const timeMatch = todayHours.match(/(\d{1,2}):(\d{2})\s*-\s*(\d{1,2}):(\d{2})/);
    if (!timeMatch) return false;
    
    const [, openHour, openMin, closeHour, closeMin] = timeMatch;
    const openTime = parseInt(openHour) * 60 + parseInt(openMin);
    let closeTime = parseInt(closeHour) * 60 + parseInt(closeMin);
    
    // Se o horário de fechamento é menor que o de abertura, significa que fecha no dia seguinte
    if (closeTime < openTime) {
      closeTime += 24 * 60; // adiciona 24 horas
      if (currentTime < openTime) {
        currentTime += 24 * 60; // adiciona 24 horas se ainda não passou da meia-noite
      }
    }
    
    return currentTime >= openTime && currentTime <= closeTime;
  }

  const openInGoogleMaps = (establishment: Establishment) => {
    if (typeof window !== 'undefined') {
      const url = `https://www.google.com/maps?q=${establishment.lat},${establishment.lng}`
      window.open(url, '_blank')
    }
  }

  const callEstablishment = (phone: string) => {
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
                  <p className="text-gray-300">Descubra bares, boates e restaurantes da cidade</p>
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
                Estabelecimentos na Rota
              </h2>
              
              {/* Filtros */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-300 mb-3 flex items-center">
                  <Filter className="h-4 w-4 mr-2" />
                  Filtrar por tipo:
                </h3>
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant={selectedType === "todos" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedType("todos")}
                    className="text-xs"
                  >
                    Todos ({establishments.length})
                  </Button>
                  <Button
                    variant={selectedType === "bar" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedType("bar")}
                    className="text-xs"
                  >
                    <Wine className="h-3 w-3 mr-1" />
                    Bares ({establishments.filter(e => e.type === "bar").length})
                  </Button>
                  <Button
                    variant={selectedType === "boate" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedType("boate")}
                    className="text-xs"
                  >
                    <Music className="h-3 w-3 mr-1" />
                    Boates ({establishments.filter(e => e.type === "boate").length})
                  </Button>
                  <Button
                    variant={selectedType === "restaurante" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedType("restaurante")}
                    className="text-xs"
                  >
                    <Utensils className="h-3 w-3 mr-1" />
                    Restaurantes ({establishments.filter(e => e.type === "restaurante").length})
                  </Button>
                </div>
              </div>

              <div className="space-y-3">
                {filteredEstablishments.map((establishment) => (
                  <Card 
                    key={establishment.id} 
                    className={`cursor-pointer transition-all duration-300 bg-gray-700/50 border-gray-600 hover:border-purple-500/50 ${
                      selectedEstablishment?.id === establishment.id ? 'border-purple-500 bg-purple-900/20' : ''
                    }`}
                    onClick={() => {
                      console.log('Clicando no estabelecimento:', establishment.name)
                      setSelectedEstablishment(establishment)
                    }}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <div className={`${getTypeColor(establishment.type)}`}>
                              {getTypeIcon(establishment.type)}
                            </div>
                            <h3 className="font-semibold text-white">{establishment.name}</h3>
                          </div>
                          <p className="text-sm text-gray-300 mb-2">{establishment.description}</p>
                          <div className="flex items-center space-x-2 mb-2">
                            <div className="flex items-center">
                              {[...Array(5)].map((_, i) => (
                                <Star 
                                  key={i} 
                                  className={`h-3 w-3 ${i < Math.floor(establishment.rating) ? 'text-yellow-400 fill-current' : 'text-gray-600'}`} 
                                />
                              ))}
                              <span className="text-xs text-gray-400 ml-1">{establishment.rating}</span>
                            </div>
                            <Badge className="bg-purple-900/50 text-purple-200 text-xs">
                              {establishment.priceRange}
                            </Badge>
                            <Badge 
                              className="bg-blue-900/50 text-blue-200 text-xs cursor-pointer hover:bg-blue-800/50 transition-colors"
                              onClick={(e) => {
                                e.stopPropagation()
                                if (establishment.menuLink) {
                                  window.open(establishment.menuLink, '_blank')
                                }
                              }}
                            >
                              Cardápio
                            </Badge>
                            <Badge 
                              className={`text-xs ${
                                isEstablishmentOpen(establishment.hours) 
                                  ? 'bg-green-900/50 text-green-200 border border-green-600/50' 
                                  : 'bg-red-900/50 text-red-200 border border-red-600/50'
                              }`}
                            >
                              {isEstablishmentOpen(establishment.hours) ? '🟢 Aberto' : '🔴 Fechado'}
                            </Badge>
                          </div>
                          <div className="flex items-center text-xs text-gray-400">
                            <Clock className="h-3 w-3 mr-1" />
                            {establishment.hours.monday}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>

          {/* Detalhes */}
          <div className="lg:col-span-2 space-y-6">

            {/* Detalhes do Estabelecimento Selecionado */}
            {selectedEstablishment && (
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6">
                <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
                  <div className={`${getTypeColor(selectedEstablishment.type)} mr-2`}>
                    {getTypeIcon(selectedEstablishment.type)}
                  </div>
                  Detalhes do {selectedEstablishment.type === 'bar' ? 'Bar' : selectedEstablishment.type === 'boate' ? 'Boate' : 'Restaurante'}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">{selectedEstablishment.name}</h3>
                    <p className="text-gray-300 mb-4">{selectedEstablishment.description}</p>
                    
                    <div className="space-y-3">
                      <div className="flex items-center text-gray-300">
                        <MapPin className="h-4 w-4 mr-2 text-purple-400" />
                        <span>{selectedEstablishment.address}</span>
                      </div>
                      <div className="flex items-center text-gray-300">
                        <Phone className="h-4 w-4 mr-2 text-green-400" />
                        <span>{selectedEstablishment.phone}</span>
                      </div>
                      <div className="flex items-center text-gray-300">
                        <Clock className="h-4 w-4 mr-2 text-blue-400" />
                        <span>
                          {isEstablishmentOpen(selectedEstablishment.hours) ? '🟢 Aberto agora' : '🔴 Fechado'}
                        </span>
                      </div>
                    </div>

                    {/* Horários Detalhados */}
                    <div className="mt-6">
                      <h4 className="text-md font-semibold text-white mb-3 flex items-center">
                        <Clock className="h-4 w-4 mr-2 text-blue-400" />
                        Horários de Funcionamento
                      </h4>
                      <div className="grid grid-cols-1 gap-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">Segunda-feira:</span>
                          <span className="text-gray-300">{selectedEstablishment.hours.monday}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">Terça-feira:</span>
                          <span className="text-gray-300">{selectedEstablishment.hours.tuesday}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">Quarta-feira:</span>
                          <span className="text-gray-300">{selectedEstablishment.hours.wednesday}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">Quinta-feira:</span>
                          <span className="text-gray-300">{selectedEstablishment.hours.thursday}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">Sexta-feira:</span>
                          <span className="text-gray-300">{selectedEstablishment.hours.friday}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">Sábado:</span>
                          <span className="text-gray-300">{selectedEstablishment.hours.saturday}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">Domingo:</span>
                          <span className="text-gray-300">{selectedEstablishment.hours.sunday}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-md font-semibold text-white mb-3">Especialidades</h4>
                    <div className="space-y-2 mb-4">
                      {selectedEstablishment.specialties.map((specialty, index) => (
                        <Badge key={index} className="bg-purple-900/50 text-purple-200 mr-2 mb-2">
                          {specialty}
                        </Badge>
                      ))}
                    </div>

                    {/* Cardápio */}
                    {selectedEstablishment.menuLink && (
                      <div className="mb-4">
                        <h4 className="text-md font-semibold text-white mb-3 flex items-center">
                          <Utensils className="h-4 w-4 mr-2 text-orange-400" />
                          Cardápio
                        </h4>
                        <Button
                          onClick={() => window.open(selectedEstablishment.menuLink, '_blank')}
                          className="bg-orange-600 hover:bg-orange-700 text-white"
                        >
                          <Utensils className="h-4 w-4 mr-2" />
                          Ver Cardápio Completo
                        </Button>
                      </div>
                    )}
                    
                    <div className="flex space-x-3">
                      <Button
                        onClick={() => openInGoogleMaps(selectedEstablishment)}
                        className="bg-green-600 hover:bg-green-700 flex-1"
                      >
                        <Navigation className="h-4 w-4 mr-2" />
                        Ver no Mapa
                      </Button>
                      <Button
                        onClick={() => setShowFeed(true)}
                        className="bg-purple-600 hover:bg-purple-700 flex-1"
                      >
                        <MessageCircle className="h-4 w-4 mr-2" />
                        Feed
                      </Button>
                      <Button
                        onClick={() => callEstablishment(selectedEstablishment.phone)}
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

      {/* Instagram Feed */}
      <InstagramFeed
        isOpen={showFeed}
        onClose={() => setShowFeed(false)}
        establishmentId={selectedEstablishment?.id}
        establishmentName={selectedEstablishment?.name}
        currentUser={{
          id: "user1",
          username: "Usuário",
          avatar: "/placeholder-user.jpg"
        }}
      />
    </div>
  )
}
