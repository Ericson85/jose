"use client"

import { useState, useEffect } from "react"
import dynamic from "next/dynamic"
import { MapPin, Navigation, Phone, Clock, Star, Wine, ArrowLeft, Filter, Utensils, Music, Coffee } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import InstagramFeed from "@/components/instagram/instagram-feed"

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

interface Establishment {
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
  type: "bar" | "boate" | "restaurante"
  category: string
}

export default function RotaCaipirinha() {
  const [isClient, setIsClient] = useState(false)
  const [establishments, setEstablishments] = useState<Establishment[]>([
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
      priceRange: "€€",
      type: "bar",
      category: "Bar Tradicional"
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
      priceRange: "€€€",
      type: "bar",
      category: "Bar com Música"
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
      priceRange: "€€",
      type: "bar",
      category: "Bar de Samba"
    },
    {
      id: "4",
      name: "Club Night",
      address: "Av. Faria Lima, 1000",
      phone: "(11) 66666-6666",
      hours: "23:00 - 06:00",
      rating: 4.6,
      lat: -23.5655,
      lng: -46.6945,
      description: "Boate moderna com os melhores DJs e drinks premium",
      specialties: ["Drinks Premium", "Eletrônica", "VIP Area"],
      priceRange: "€€€",
      type: "boate",
      category: "Boate Eletrônica"
    },
    {
      id: "5",
      name: "Restaurante Mineiro",
      address: "Rua dos Pampas, 234",
      phone: "(11) 55555-5555",
      hours: "11:00 - 23:00",
      rating: 4.9,
      lat: -23.5425,
      lng: -46.6285,
      description: "Comida mineira autêntica com caipirinhas artesanais",
      specialties: ["Feijão Tropeiro", "Caipirinha de Cachaça", "Comida Caseira"],
      priceRange: "€€",
      type: "restaurante",
      category: "Restaurante Regional"
    },
    {
      id: "6",
      name: "Sushi & Caipirinha",
      address: "Rua Liberdade, 456",
      phone: "(11) 44444-4444",
      hours: "18:00 - 01:00",
      rating: 4.4,
      lat: -23.5585,
      lng: -46.6325,
      description: "Fusão japonesa-brasileira com drinks criativos",
      specialties: ["Sushi Premium", "Caipirinha de Saquê", "Fusion Drinks"],
      priceRange: "€€€",
      type: "restaurante",
      category: "Restaurante Fusion"
    }
  ])

  const [selectedEstablishment, setSelectedEstablishment] = useState<Establishment | null>(null)
  const [selectedType, setSelectedType] = useState<"todos" | "bar" | "boate" | "restaurante">("todos")
  const [showFeed, setShowFeed] = useState(false)

  useEffect(() => {
    setIsClient(true)
    console.log("Inicializando mapa com estabelecimentos:", establishments)
  }, [establishments])

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
                    onClick={() => setSelectedEstablishment(establishment)}
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
                            <Badge className="bg-blue-900/50 text-blue-200 text-xs">
                              {establishment.category}
                            </Badge>
                          </div>
                          <div className="flex items-center text-xs text-gray-400">
                            <Clock className="h-3 w-3 mr-1" />
                            {establishment.hours}
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
                  bars={establishments}
                  selectedEstablishment={selectedEstablishment}
                  onBarSelect={setSelectedEstablishment}
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
                        <span>{selectedEstablishment.hours}</span>
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
