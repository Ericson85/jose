"use client"

import { useState } from "react"
import { X, MapPin, Clock, ExternalLink, Phone } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

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
  googleMapsUrl?: string
  images: string[]
  isActive: boolean
  createdAt: string
  updatedAt: string
}

interface SimpleProfileProps {
  establishment: Establishment
  isOpen: boolean
  onClose: () => void
}

export default function SimpleProfile({ establishment, isOpen, onClose }: SimpleProfileProps) {
  if (!isOpen) return null

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

  const openInGoogleMaps = () => {
    if (establishment.googleMapsUrl) {
      // Usar o link do Google Maps se disponível
      window.open(establishment.googleMapsUrl, '_blank')
    } else if (establishment.googlePlaceId) {
      // Usar Place ID se disponível
      const url = `https://www.google.com/maps/place/?q=place_id:${establishment.googlePlaceId}`
      window.open(url, '_blank')
    } else {
      // Fallback para coordenadas
      const url = `https://www.google.com/maps?q=${establishment.lat},${establishment.lng}`
      window.open(url, '_blank')
    }
  }

  const callEstablishment = () => {
    if (establishment.phone) {
      window.open(`tel:${establishment.phone}`)
    }
  }

  const openMenu = () => {
    if (establishment.menuLink) {
      window.open(establishment.menuLink, '_blank')
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "bar": return "🍷"
      case "boate": return "🎵"
      case "restaurante": return "🍽️"
      default: return "☕"
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

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-gray-800 border-gray-700">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-white flex items-center space-x-2">
              <span className="text-2xl">{getTypeIcon(establishment.type)}</span>
              <span>{establishment.name}</span>
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-gray-400 hover:text-white"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex items-center space-x-2">
            <Badge className={`${getTypeColor(establishment.type)} bg-gray-700`}>
              {establishment.type === 'bar' ? 'Bar' : establishment.type === 'boate' ? 'Boate' : 'Restaurante'}
            </Badge>
            <Badge className="bg-purple-900/50 text-purple-200">
              {establishment.priceRange}
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
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Descrição */}
          <p className="text-gray-300 text-sm">{establishment.description}</p>

          {/* Endereço */}
          <div className="flex items-start space-x-2">
            <MapPin className="h-4 w-4 text-purple-400 mt-0.5" />
            <span className="text-gray-300 text-sm">{establishment.address}</span>
          </div>

          {/* Horário atual */}
          <div className="flex items-center space-x-2">
            <Clock className="h-4 w-4 text-blue-400" />
            <span className="text-gray-300 text-sm">
              {isEstablishmentOpen(establishment.hours) ? '🟢 Aberto agora' : '🔴 Fechado'}
            </span>
          </div>

          {/* Especialidades */}
          {establishment.specialties && establishment.specialties.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-white mb-2">Especialidades</h4>
              <div className="flex flex-wrap gap-1">
                {establishment.specialties.map((specialty, index) => (
                  <Badge key={index} className="bg-purple-900/50 text-purple-200 text-xs">
                    {specialty}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Botões de ação */}
          <div className="space-y-2">
            {/* Cardápio */}
            {establishment.menuLink && (
              <Button
                onClick={openMenu}
                className="w-full bg-orange-600 hover:bg-orange-700 text-white"
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Ver Cardápio
              </Button>
            )}

            {/* Mapa */}
            <Button
              onClick={openInGoogleMaps}
              className="w-full bg-green-600 hover:bg-green-700 text-white"
            >
              <MapPin className="h-4 w-4 mr-2" />
              Ver no Mapa
            </Button>

            {/* Telefone */}
            {establishment.phone && (
              <Button
                onClick={callEstablishment}
                variant="outline"
                className="w-full border-blue-500 text-blue-300 hover:bg-blue-900/50"
              >
                <Phone className="h-4 w-4 mr-2" />
                Ligar
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
