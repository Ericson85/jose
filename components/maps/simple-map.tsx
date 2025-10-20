"use client"

import { MapPin, Navigation, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"

interface Bar {
  id: string
  name: string
  address: string
  lat: number
  lng: number
  rating: number
  phone?: string
  hours?: string
  description?: string
  googleMapsUrl?: string
}

interface SimpleMapProps {
  bars: Bar[]
  selectedBar?: Bar | null
  onBarSelect?: (bar: Bar) => void
  center?: { lat: number; lng: number }
}

export default function SimpleMap({ 
  bars, 
  selectedBar, 
  onBarSelect, 
  center = { lat: -23.5505, lng: -46.6333 }
}: SimpleMapProps) {
  
  const generateGoogleMapsUrl = (lat: number, lng: number, name: string) => {
    return `https://www.google.com/maps/search/?api=1&query=${lat},${lng}&query_place_id=${encodeURIComponent(name)}`
  }

  const openInGoogleMaps = (bar: Bar) => {
    const url = bar.googleMapsUrl || generateGoogleMapsUrl(bar.lat, bar.lng, bar.name)
    window.open(url, '_blank')
  }

  return (
    <div className="w-full h-96 bg-gray-100 rounded-lg border-2 border-gray-300 flex items-center justify-center relative overflow-hidden">
      {/* Mapa estático usando imagem do Google Maps Static API */}
      <div className="absolute inset-0">
        <img
          src={`https://maps.googleapis.com/maps/api/staticmap?center=${center.lat},${center.lng}&zoom=13&size=800x400&maptype=roadmap&markers=color:red%7C${bars.map(bar => `${bar.lat},${bar.lng}`).join('|')}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || 'demo'}`}
          alt="Mapa dos estabelecimentos"
          className="w-full h-full object-cover"
          onError={(e) => {
            // Fallback se não houver API key
            e.currentTarget.style.display = 'none'
          }}
        />
      </div>
      
      {/* Overlay com informações */}
      <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center">
        <div className="bg-white bg-opacity-90 backdrop-blur-sm rounded-lg p-6 max-w-md mx-4">
          <div className="text-center">
            <MapPin className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-800 mb-2">
              {bars.length} Estabelecimento{bars.length !== 1 ? 's' : ''} Encontrado{bars.length !== 1 ? 's' : ''}
            </h3>
            <p className="text-gray-600 mb-4">
              Clique nos estabelecimentos abaixo para ver detalhes e navegar
            </p>
            
            {/* Lista de estabelecimentos */}
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {bars.map((bar) => (
                <div
                  key={bar.id}
                  className={`p-3 rounded-lg border cursor-pointer transition-all ${
                    selectedBar?.id === bar.id 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                  onClick={() => onBarSelect?.(bar)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-800">{bar.name}</h4>
                      <p className="text-sm text-gray-600">{bar.address}</p>
                      <div className="flex items-center mt-1">
                        <span className="text-yellow-500">⭐</span>
                        <span className="text-sm text-gray-600 ml-1">{bar.rating}/5</span>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={(e) => {
                        e.stopPropagation()
                        openInGoogleMaps(bar)
                      }}
                      className="ml-2"
                    >
                      <Navigation className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Botão para abrir no Google Maps */}
            <Button
              onClick={() => {
                const url = generateGoogleMapsUrl(center.lat, center.lng, 'Estabelecimentos')
                window.open(url, '_blank')
              }}
              className="mt-4 w-full"
              variant="outline"
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Ver no Google Maps
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
