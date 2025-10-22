"use client"

import { MapPin } from "lucide-react"

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
  showSelectedLocation?: boolean
}

export default function SimpleMap({ 
  bars, 
  selectedBar, 
  onBarSelect, 
  center = { lat: -23.5505, lng: -46.6333 },
  showSelectedLocation = true
}: SimpleMapProps) {
  
  const openInGoogleMaps = (bar: Bar) => {
    // Se o estabelecimento tem um link do Google Maps, usar ele
    if (bar.googleMapsUrl) {
      window.open(bar.googleMapsUrl, '_blank')
    } else {
      // Fallback para coordenadas se não tiver link
      const url = `https://www.google.com/maps?q=${bar.lat},${bar.lng}`
      window.open(url, '_blank')
    }
  }
  
  return (
    <div className="w-full h-96 bg-gray-100 rounded-lg border-2 border-gray-300 flex items-center justify-center relative overflow-hidden cursor-pointer"
         onClick={() => selectedBar && openInGoogleMaps(selectedBar)}>
      {/* Mapa estático usando imagem do Google Maps Static API */}
      <div className="absolute inset-0">
        {showSelectedLocation && selectedBar && selectedBar.lat && selectedBar.lng ? (
          // Mostrar localização específica do estabelecimento selecionado
          <img
            src={`https://maps.googleapis.com/maps/api/staticmap?center=${selectedBar.lat},${selectedBar.lng}&zoom=16&size=800x400&maptype=roadmap&markers=color:red%7C${selectedBar.lat},${selectedBar.lng}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || 'demo'}`}
            alt={`Mapa de ${selectedBar.name}`}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.style.display = 'none'
            }}
          />
        ) : (
          // Mostrar todos os estabelecimentos
          <img
            src={`https://maps.googleapis.com/maps/api/staticmap?center=${center.lat},${center.lng}&zoom=13&size=800x400&maptype=roadmap&markers=color:red%7C${bars.filter(bar => bar.lat && bar.lng).map(bar => `${bar.lat},${bar.lng}`).join('|')}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || 'demo'}`}
            alt="Mapa dos estabelecimentos"
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.style.display = 'none'
            }}
          />
        )}
      </div>
      
      {/* Overlay simples com informações básicas */}
      <div className="absolute inset-0 bg-black bg-opacity-10 flex items-end justify-center p-4">
        {showSelectedLocation && selectedBar && selectedBar.lat && selectedBar.lng ? (
          // Mostrar informações do estabelecimento selecionado
          <div className="bg-white bg-opacity-90 backdrop-blur-sm rounded-lg p-4 max-w-sm">
            <div className="text-center">
              <MapPin className="h-8 w-8 text-red-500 mx-auto mb-2" />
              <h3 className="text-lg font-bold text-gray-800 mb-1">
                {selectedBar.name}
              </h3>
              <p className="text-sm text-gray-600 mb-2">{selectedBar.address}</p>
              <div className="flex items-center justify-center mb-2">
                <span className="text-yellow-500">⭐</span>
                <span className="text-sm text-gray-600 ml-1">{selectedBar.rating}/5</span>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Clique no mapa para abrir no Google Maps
              </p>
            </div>
          </div>
        ) : (
          // Mostrar contagem de estabelecimentos
          <div className="bg-white bg-opacity-90 backdrop-blur-sm rounded-lg p-4">
            <div className="text-center">
              <MapPin className="h-8 w-8 text-red-500 mx-auto mb-2" />
              <h3 className="text-lg font-bold text-gray-800">
                {bars.length} Estabelecimento{bars.length !== 1 ? 's' : ''}
              </h3>
              <p className="text-sm text-gray-600">
                Clique nos cards para ver localização ou clique no mapa para abrir no Google Maps
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
