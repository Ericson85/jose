"use client"

import { useEffect, useRef, useState } from "react"
import { MapPin, Navigation, Phone, Clock, Star } from "lucide-react"
import { Button } from "@/components/ui/button"

interface Establishment {
  id: string
  name: string
  address: string
  lat: number
  lng: number
  rating: number
  phone?: string
  hours?: any
  description?: string
  googleMapsUrl?: string
  menuLink?: string
}

interface InteractiveMapProps {
  establishments: Establishment[]
  selectedEstablishment?: Establishment | null
  onEstablishmentSelect?: (establishment: Establishment) => void
  center?: { lat: number; lng: number }
}

export default function InteractiveMap({ 
  establishments, 
  selectedEstablishment, 
  onEstablishmentSelect,
  center = { lat: -3.7319, lng: -38.5267 }
}: InteractiveMapProps) {
  
  const openInGoogleMaps = (establishment: Establishment) => {
    const url = establishment.googleMapsUrl || `https://www.google.com/maps?q=${establishment.lat},${establishment.lng}`
    window.open(url, '_blank')
  }

  const generateMapUrl = () => {
    if (selectedEstablishment && selectedEstablishment.lat && selectedEstablishment.lng) {
      // Mapa focado no estabelecimento selecionado
      return `https://maps.googleapis.com/maps/api/staticmap?center=${selectedEstablishment.lat},${selectedEstablishment.lng}&zoom=16&size=800x400&maptype=roadmap&markers=color:red%7C${selectedEstablishment.lat},${selectedEstablishment.lng}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || 'demo'}`
    } else {
      // Mapa com todos os estabelecimentos
      const validEstablishments = establishments.filter(est => est.lat && est.lng)
      const markers = validEstablishments.map(est => `${est.lat},${est.lng}`).join('|')
      return `https://maps.googleapis.com/maps/api/staticmap?center=${center.lat},${center.lng}&zoom=13&size=800x400&maptype=roadmap&markers=color:blue%7C${markers}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || 'demo'}`
    }
  }

  return (
    <div className="w-full h-96 bg-gray-100 rounded-lg border-2 border-gray-300 relative overflow-hidden">
      {/* Mapa estático */}
      <div className="absolute inset-0">
        <img
          src={generateMapUrl()}
          alt="Mapa dos estabelecimentos"
          className="w-full h-full object-cover"
          onError={(e) => {
            // Fallback se não conseguir carregar o mapa
            e.currentTarget.style.display = 'none'
          }}
        />
      </div>
      
      {/* Overlay com informações quando nenhum estabelecimento está selecionado */}
      {!selectedEstablishment && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
          <div className="bg-white bg-opacity-90 backdrop-blur-sm rounded-lg p-4 shadow-lg">
            <div className="text-center">
              <MapPin className="h-8 w-8 text-red-500 mx-auto mb-2" />
              <h3 className="text-lg font-bold text-gray-800">
                {establishments.length} Estabelecimento{establishments.length !== 1 ? 's' : ''}
              </h3>
              <p className="text-sm text-gray-600">
                Clique nos cards para ver localização
              </p>
            </div>
          </div>
        </div>
      )}
      
      {/* Overlay com informações do estabelecimento selecionado */}
      {selectedEstablishment && (
        <div className="absolute top-4 right-4">
          <div className="bg-white bg-opacity-90 backdrop-blur-sm rounded-lg p-4 shadow-lg max-w-sm">
            <div className="flex items-center mb-3">
              <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center mr-3">
                <span className="text-white text-lg">🍹</span>
              </div>
              <div>
                <h3 className="font-bold text-gray-800">{selectedEstablishment.name}</h3>
                <div className="flex items-center">
                  <Star className="h-4 w-4 text-yellow-500 mr-1" />
                  <span className="text-sm text-gray-600">{selectedEstablishment.rating}/5</span>
                </div>
              </div>
            </div>
            
            <p className="text-sm text-gray-600 mb-3">{selectedEstablishment.address}</p>
            
            {selectedEstablishment.description && (
              <p className="text-sm text-gray-700 mb-3">{selectedEstablishment.description}</p>
            )}
            
            <div className="flex space-x-2">
              {selectedEstablishment.menuLink && (
                <Button
                  onClick={() => window.open(selectedEstablishment.menuLink, '_blank')}
                  size="sm"
                  className="bg-orange-600 hover:bg-orange-700 text-white"
                >
                  🍽️ Cardápio
                </Button>
              )}
              
              <Button
                onClick={() => openInGoogleMaps(selectedEstablishment)}
                size="sm"
                variant="outline"
                className="border-green-500 text-green-600 hover:bg-green-50"
              >
                <Navigation className="h-4 w-4 mr-1" />
                Navegar
              </Button>
            </div>
          </div>
        </div>
      )}
      
      {/* Lista de estabelecimentos no mapa */}
      <div className="absolute top-4 left-4">
        <div className="bg-white bg-opacity-90 backdrop-blur-sm rounded-lg p-3 shadow-lg max-w-xs">
          <h4 className="font-semibold text-gray-800 mb-2 text-sm">Estabelecimentos</h4>
          <div className="space-y-1 max-h-32 overflow-y-auto">
            {establishments.map((establishment) => (
              <div
                key={establishment.id}
                className={`p-2 rounded cursor-pointer transition-colors text-xs ${
                  selectedEstablishment?.id === establishment.id 
                    ? 'bg-red-100 border border-red-300' 
                    : 'hover:bg-gray-100'
                }`}
                onClick={() => onEstablishmentSelect?.(establishment)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="font-medium text-gray-800">{establishment.name}</p>
                    <p className="text-gray-600 truncate">{establishment.address}</p>
                  </div>
                  <div className="flex items-center ml-2">
                    <Star className="h-3 w-3 text-yellow-500 mr-1" />
                    <span className="text-xs text-gray-600">{establishment.rating}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
