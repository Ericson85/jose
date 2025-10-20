"use client"

import { useEffect, useRef, useState } from "react"
import { MapPin, Navigation, Check } from "lucide-react"
import { Button } from "@/components/ui/button"

interface LocationPickerProps {
  onLocationSelect: (lat: number, lng: number) => void
  initialLocation?: { lat: number; lng: number }
  center?: { lat: number; lng: number }
}

export default function LocationPicker({ 
  onLocationSelect, 
  initialLocation,
  center = { lat: -23.5505, lng: -46.6333 }
}: LocationPickerProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const [map, setMap] = useState<google.maps.Map | null>(null)
  const [marker, setMarker] = useState<google.maps.Marker | null>(null)
  const [selectedLocation, setSelectedLocation] = useState<{ lat: number; lng: number } | null>(
    initialLocation || null
  )

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
        center: selectedLocation || center,
        zoom: 15,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: false,
        zoomControl: true,
        gestureHandling: "greedy"
      })

      setMap(mapInstance)

      // Adicionar marcador inicial se existir
      if (selectedLocation) {
        const initialMarker = new window.google.maps.Marker({
          position: selectedLocation,
          map: mapInstance,
          draggable: true,
          title: "Localização do estabelecimento"
        })
        setMarker(initialMarker)
      }

      // Adicionar listener para cliques no mapa
      mapInstance.addListener('click', (event: google.maps.MapMouseEvent) => {
        const lat = event.latLng?.lat() || 0
        const lng = event.latLng?.lng() || 0
        
        setSelectedLocation({ lat, lng })

        // Remover marcador anterior
        if (marker) {
          marker.setMap(null)
        }

        // Adicionar novo marcador
        const newMarker = new window.google.maps.Marker({
          position: { lat, lng },
          map: mapInstance,
          draggable: true,
          title: "Localização do estabelecimento"
        })

        // Listener para arrastar o marcador
        newMarker.addListener('dragend', () => {
          const position = newMarker.getPosition()
          if (position) {
            const lat = position.lat()
            const lng = position.lng()
            setSelectedLocation({ lat, lng })
          }
        })

        setMarker(newMarker)
      })
    }

    loadGoogleMaps()

    return () => {
      if (marker) {
        marker.setMap(null)
      }
    }
  }, [])

  const handleConfirmLocation = () => {
    if (selectedLocation) {
      onLocationSelect(selectedLocation.lat, selectedLocation.lng)
    }
  }

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude
          const lng = position.coords.longitude
          
          setSelectedLocation({ lat, lng })
          
          if (map) {
            map.setCenter({ lat, lng })
            
            // Remover marcador anterior
            if (marker) {
              marker.setMap(null)
            }

            // Adicionar novo marcador
            const newMarker = new window.google.maps.Marker({
              position: { lat, lng },
              map: map,
              draggable: true,
              title: "Sua localização atual"
            })

            newMarker.addListener('dragend', () => {
              const position = newMarker.getPosition()
              if (position) {
                const lat = position.lat()
                const lng = position.lng()
                setSelectedLocation({ lat, lng })
              }
            })

            setMarker(newMarker)
          }
        },
        (error) => {
          console.error('Erro ao obter localização:', error)
        }
      )
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">Selecionar Localização</h3>
        <div className="flex space-x-2">
          <Button
            onClick={getCurrentLocation}
            variant="outline"
            size="sm"
            className="border-blue-500 text-blue-300 hover:bg-blue-900/50"
          >
            <Navigation className="h-4 w-4 mr-2" />
            Minha Localização
          </Button>
          <Button
            onClick={handleConfirmLocation}
            disabled={!selectedLocation}
            size="sm"
            className="bg-green-600 hover:bg-green-700"
          >
            <Check className="h-4 w-4 mr-2" />
            Confirmar
          </Button>
        </div>
      </div>
      
      <div className="bg-gray-800 rounded-lg p-4">
        <div 
          ref={mapRef} 
          className="w-full h-64 rounded-lg border border-gray-600"
        />
        <p className="text-sm text-gray-400 mt-2">
          Clique no mapa para selecionar a localização do estabelecimento
        </p>
        {selectedLocation && (
          <p className="text-sm text-green-400 mt-1">
            Coordenadas: {selectedLocation.lat.toFixed(6)}, {selectedLocation.lng.toFixed(6)}
          </p>
        )}
      </div>
    </div>
  )
}
