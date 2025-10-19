"use client"

import { useEffect, useRef, useState } from "react"
import { MapPin, Navigation } from "lucide-react"
import { Button } from "@/components/ui/button"

interface Bar {
  id: string
  name: string
  address: string
  lat: number
  lng: number
  rating: number
}

interface CustomMapProps {
  bars: Bar[]
  selectedBar?: Bar | null
  onBarSelect?: (bar: Bar) => void
  center?: { lat: number; lng: number }
  zoom?: number
}

export default function CustomMap({ 
  bars, 
  selectedBar, 
  onBarSelect, 
  center = { lat: -23.5505, lng: -46.6333 },
  zoom = 13
}: CustomMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const [map, setMap] = useState<google.maps.Map | null>(null)
  const [markers, setMarkers] = useState<google.maps.Marker[]>([])

  useEffect(() => {
    if (!mapRef.current || typeof window === 'undefined') {
      console.log('Mapa: window não disponível')
      return
    }

    if (!window.google) {
      console.log('Mapa: Google Maps API não carregada')
      return
    }

    console.log('Mapa: Inicializando mapa com centro:', center)

    const mapInstance = new window.google.maps.Map(mapRef.current, {
      center,
      zoom,
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
      ],
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: false,
      zoomControl: true,
      gestureHandling: "greedy"
    })

    setMap(mapInstance)
    console.log('Mapa: Mapa inicializado com sucesso')
  }, [center, zoom])

  useEffect(() => {
    console.log('Mapa: useEffect para marcadores - map:', !!map, 'bars:', bars.length, 'window:', typeof window !== 'undefined')
    
    if (!map || !bars.length || typeof window === 'undefined') {
      console.log('Mapa: Condições não atendidas para criar marcadores')
      return
    }

    console.log('Mapa: Criando marcadores para:', bars.length, 'bares')

    // Limpar marcadores existentes
    markers.forEach(marker => marker.setMap(null))

    const newMarkers: google.maps.Marker[] = bars.map(bar => {
      console.log('Mapa: Criando marcador para:', bar.name, 'em', bar.lat, bar.lng)
      const marker = new window.google.maps.Marker({
        position: { lat: bar.lat, lng: bar.lng },
        map,
        title: bar.name,
        icon: {
          url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
            <svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
              <circle cx="20" cy="20" r="18" fill="#8B5CF6" stroke="#FFFFFF" stroke-width="3"/>
              <path d="M12 28l8-8 8 8" fill="#FFFFFF" stroke="#8B5CF6" stroke-width="2"/>
            </svg>
          `)}`,
          scaledSize: new window.google.maps.Size(40, 40),
          anchor: new window.google.maps.Point(20, 20)
        },
        animation: selectedBar?.id === bar.id ? window.google.maps.Animation.BOUNCE : undefined
      })

      const infoWindow = new window.google.maps.InfoWindow({
        content: `
          <div style="padding: 10px; max-width: 250px;">
            <h3 style="margin: 0 0 8px 0; color: #8B5CF6; font-size: 16px; font-weight: bold;">
              ${bar.name}
            </h3>
            <p style="margin: 0 0 8px 0; color: #666; font-size: 14px;">
              ${bar.address}
            </p>
            <div style="display: flex; align-items: center; gap: 4px;">
              <span style="color: #F59E0B; font-size: 14px;">★</span>
              <span style="color: #666; font-size: 14px;">${bar.rating}</span>
            </div>
          </div>
        `
      })

      marker.addListener("click", () => {
        onBarSelect?.(bar)
        infoWindow.open(map, marker)
      })

      return marker
    })

    setMarkers(newMarkers)

    // Se há um bar selecionado, centralizar o mapa nele
    if (selectedBar) {
      console.log('Mapa: Centralizando no bar selecionado:', selectedBar.name)
      map.setCenter({ lat: selectedBar.lat, lng: selectedBar.lng })
      map.setZoom(16)
    }

    return () => {
      newMarkers.forEach(marker => marker.setMap(null))
    }
  }, [map, bars, selectedBar, onBarSelect])

  const openInGoogleMaps = (bar: Bar) => {
    const url = `https://www.google.com/maps?q=${bar.lat},${bar.lng}`
    window.open(url, '_blank')
  }

  if (typeof window === 'undefined' || !window.google) {
    return (
      <div className="bg-gray-700/50 rounded-lg h-96 flex items-center justify-center border-2 border-dashed border-gray-600">
        <div className="text-center">
          <MapPin className="h-16 w-16 text-purple-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-white mb-2">Carregando Mapa...</h3>
          <p className="text-gray-400 mb-4">Aguarde enquanto carregamos o Google Maps</p>
          <div className="flex flex-wrap justify-center gap-2">
            {bars.map((bar) => (
              <Button
                key={bar.id}
                variant="outline"
                size="sm"
                onClick={() => openInGoogleMaps(bar)}
                className="border-purple-500 text-purple-300 hover:bg-purple-900/50"
              >
                <MapPin className="h-3 w-3 mr-1" />
                {bar.name}
              </Button>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div ref={mapRef} className="w-full h-96 rounded-lg border border-gray-600" />
      
      <div className="flex justify-center space-x-4">
        <Button
          onClick={() => map?.setZoom((map?.getZoom() || 13) + 1)}
          variant="outline"
          size="sm"
          className="border-purple-500 text-purple-300 hover:bg-purple-900/50"
        >
          <Navigation className="h-4 w-4 mr-2" />
          Zoom In
        </Button>
        <Button
          onClick={() => map?.setZoom((map?.getZoom() || 13) - 1)}
          variant="outline"
          size="sm"
          className="border-purple-500 text-purple-300 hover:bg-purple-900/50"
        >
          <Navigation className="h-4 w-4 mr-2 rotate-180" />
          Zoom Out
        </Button>
      </div>
    </div>
  )
}
