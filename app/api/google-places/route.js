import { NextResponse } from 'next/server'

export async function POST(request) {
  try {
    const { placeId } = await request.json()
    
    if (!placeId) {
      return NextResponse.json({
        success: false,
        error: 'Place ID é obrigatório'
      }, { status: 400 })
    }

    // Verificar se a API key do Google Maps está configurada
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
    
    if (!apiKey) {
      return NextResponse.json({
        success: false,
        error: 'Google Maps API Key não configurada'
      }, { status: 500 })
    }

    // Buscar detalhes do lugar no Google Places API
    const placesUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=name,formatted_address,formatted_phone_number,opening_hours,rating,website,url&key=${apiKey}`
    
    const response = await fetch(placesUrl)
    const data = await response.json()

    if (data.status !== 'OK') {
      return NextResponse.json({
        success: false,
        error: `Erro do Google Places API: ${data.status}`
      }, { status: 400 })
    }

    const place = data.result
    
    // Converter horários do Google para nosso formato
    const formatGoogleHours = (openingHours) => {
      if (!openingHours || !openingHours.weekday_text) {
        return {
          monday: 'Fechado',
          tuesday: 'Fechado',
          wednesday: 'Fechado',
          thursday: 'Fechado',
          friday: 'Fechado',
          saturday: 'Fechado',
          sunday: 'Fechado'
        }
      }

      const hours = {
        monday: 'Fechado',
        tuesday: 'Fechado',
        wednesday: 'Fechado',
        thursday: 'Fechado',
        friday: 'Fechado',
        saturday: 'Fechado',
        sunday: 'Fechado'
      }

      const dayMap = {
        'Monday': 'monday',
        'Tuesday': 'tuesday',
        'Wednesday': 'wednesday',
        'Thursday': 'thursday',
        'Friday': 'friday',
        'Saturday': 'saturday',
        'Sunday': 'sunday'
      }

      openingHours.weekday_text.forEach(dayText => {
        const [day, ...timeParts] = dayText.split(': ')
        const dayKey = dayMap[day]
        if (dayKey && timeParts.length > 0) {
          const timeText = timeParts.join(': ')
          if (timeText.toLowerCase().includes('closed')) {
            hours[dayKey] = 'Fechado'
          } else {
            // Converter formato do Google para nosso formato
            // Ex: "9:00 AM – 11:00 PM" -> "09:00 - 23:00"
            const timeMatch = timeText.match(/(\d{1,2}):(\d{2})\s*(AM|PM)\s*–\s*(\d{1,2}):(\d{2})\s*(AM|PM)/)
            if (timeMatch) {
              const [, openHour, openMin, openPeriod, closeHour, closeMin, closePeriod] = timeMatch
              
              const formatTime = (hour, min, period) => {
                let h = parseInt(hour)
                if (period === 'PM' && h !== 12) h += 12
                if (period === 'AM' && h === 12) h = 0
                return `${h.toString().padStart(2, '0')}:${min}`
              }
              
              const openTime = formatTime(openHour, openMin, openPeriod)
              const closeTime = formatTime(closeHour, closeMin, closePeriod)
              hours[dayKey] = `${openTime} - ${closeTime}`
            } else {
              hours[dayKey] = timeText
            }
          }
        }
      })

      return hours
    }

    // Retornar dados formatados
    const formattedData = {
      name: place.name || '',
      address: place.formatted_address || '',
      phone: place.formatted_phone_number || '',
      rating: place.rating || 0,
      website: place.website || '',
      url: place.url || '',
      hours: formatGoogleHours(place.opening_hours),
      isOpen: place.opening_hours?.open_now || false
    }

    return NextResponse.json({
      success: true,
      data: formattedData
    })

  } catch (error) {
    console.error('Erro ao buscar dados do Google Places:', error)
    return NextResponse.json({
      success: false,
      error: 'Erro interno do servidor'
    }, { status: 500 })
  }
}
