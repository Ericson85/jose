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
  const mapRef = useRef<HTMLDivElement>(null)
  const [map, setMap] = useState<google.maps.Map | null>(null)
  const [markers, setMarkers] = useState<google.maps.Marker[]>([])
  const [infoWindows, setInfoWindows] = useState<google.maps.InfoWindow[]>([])

  useEffect(() => {
    if (!mapRef.current || typeof window === 'undefined') return

    // Carregar Google Maps API dinamicamente
    const loadGoogleMaps = () => {
      if (window.google && window.google.maps) {
        initializeMap()
      } else {
        const script = document.createElement('script')
        script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || 'demo'}&libraries=places`
        script.async = true
        script.defer = true
        script.onload = initializeMap
        document.head.appendChild(script)
      }
    }

    const initializeMap = () => {
      if (!mapRef.current) return

      const mapInstance = new window.google.maps.Map(mapRef.current, {
        center: selectedEstablishment ? { lat: selectedEstablishment.lat, lng: selectedEstablishment.lng } : center,
        zoom: selectedEstablishment ? 16 : 13,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: false,
        zoomControl: true,
        gestureHandling: "greedy",
        styles: [
          {
            featureType: "poi",
            elementType: "labels",
            stylers: [{ visibility: "off" }]
          },
          {
            featureType: "transit",
            elementType: "labels",
            stylers: [{ visibility: "off" }]
          }
        ]
      })

      setMap(mapInstance)
      createMarkers(mapInstance)
    }

    loadGoogleMaps()

    return () => {
      // Limpar marcadores e info windows
      markers.forEach(marker => marker.setMap(null))
      infoWindows.forEach(infoWindow => infoWindow.close())
    }
  }, [])

  useEffect(() => {
    if (map && selectedEstablishment) {
      // Centralizar mapa no estabelecimento selecionado
      map.setCenter({ lat: selectedEstablishment.lat, lng: selectedEstablishment.lng })
      map.setZoom(16)
    }
  }, [map, selectedEstablishment])

  const createMarkers = (mapInstance: google.maps.Map) => {
    const newMarkers: google.maps.Marker[] = []
    const newInfoWindows: google.maps.InfoWindow[] = []

    establishments.forEach((establishment) => {
      if (establishment.lat && establishment.lng) {
        // Criar marcador personalizado
        const marker = new window.google.maps.Marker({
          position: { lat: establishment.lat, lng: establishment.lng },
          map: mapInstance,
          title: establishment.name,
          icon: {
            url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
              <svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
                <circle cx="20" cy="20" r="18" fill="${selectedEstablishment?.id === establishment.id ? '#ef4444' : '#3b82f6'}" stroke="white" stroke-width="2"/>
                <text x="20" y="26" text-anchor="middle" fill="white" font-family="Arial" font-size="16" font-weight="bold">🍹</text>
              </svg>
            `)}`,
            scaledSize: new window.google.maps.Size(40, 40),
            anchor: new window.google.maps.Point(20, 20)
          }
        })

        // Criar info window
        const infoWindow = new window.google.maps.InfoWindow({
          content: createInfoWindowContent(establishment)
        })

        // Adicionar listener para clique no marcador
        marker.addListener('click', () => {
          // Fechar todas as info windows
          newInfoWindows.forEach(iw => iw.close())
          
          // Abrir info window do marcador clicado
          infoWindow.open(mapInstance, marker)
          
          // Chamar callback se fornecido
          onEstablishmentSelect?.(establishment)
        })

        newMarkers.push(marker)
        newInfoWindows.push(infoWindow)
      }
    })

    setMarkers(newMarkers)
    setInfoWindows(newInfoWindows)
  }

  const createInfoWindowContent = (establishment: Establishment) => {
    return `
      <div style="padding: 16px; max-width: 300px; font-family: Arial, sans-serif;">
        <div style="display: flex; align-items: center; margin-bottom: 12px;">
          <div style="width: 32px; height: 32px; background: #3b82f6; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-right: 12px;">
            <span style="color: white; font-size: 16px;">🍹</span>
          </div>
          <div>
            <h3 style="margin: 0; font-size: 16px; font-weight: bold; color: #1f2937;">${establishment.name}</h3>
            <div style="display: flex; align-items: center; margin-top: 4px;">
              <span style="color: #fbbf24; font-size: 14px;">⭐</span>
              <span style="margin-left: 4px; font-size: 14px; color: #6b7280;">${establishment.rating}/5</span>
            </div>
          </div>
        </div>
        
        <p style="margin: 0 0 12px 0; font-size: 14px; color: #6b7280; line-height: 1.4;">${establishment.address}</p>
        
        ${establishment.description ? `<p style="margin: 0 0 12px 0; font-size: 14px; color: #374151; line-height: 1.4;">${establishment.description}</p>` : ''}
        
        <div style="display: flex; gap: 8px; margin-top: 12px;">
          ${establishment.menuLink ? `
            <button onclick="window.open('${establishment.menuLink}', '_blank')" 
                    style="background: #f97316; color: white; border: none; padding: 8px 12px; border-radius: 6px; font-size: 12px; cursor: pointer; display: flex; align-items: center; gap: 4px;">
              🍽️ Cardápio
            </button>
          ` : ''}
          
          <button onclick="window.open('https://www.google.com/maps?q=${establishment.lat},${establishment.lng}', '_blank')" 
                  style="background: #10b981; color: white; border: none; padding: 8px 12px; border-radius: 6px; font-size: 12px; cursor: pointer; display: flex; align-items: center; gap: 4px;">
            🧭 Navegar
          </button>
        </div>
      </div>
    `
  }

  const openInGoogleMaps = (establishment: Establishment) => {
    const url = establishment.googleMapsUrl || `https://www.google.com/maps?q=${establishment.lat},${establishment.lng}`
    window.open(url, '_blank')
  }

  return (
    <div className="w-full h-96 bg-gray-100 rounded-lg border-2 border-gray-300 relative overflow-hidden">
      <div 
        ref={mapRef} 
        className="w-full h-full rounded-lg"
        style={{ minHeight: '384px' }}
      />
      
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
    </div>
  )
}
