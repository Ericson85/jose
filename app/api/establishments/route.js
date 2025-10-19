import { NextResponse } from 'next/server'

// Array temporário para armazenar estabelecimentos (em produção, usar banco de dados)
let establishments = [
  {
    id: "1",
    name: "Bar do João",
    type: "bar",
    category: "Tradicional",
    address: "Rua das Flores, 123 - Centro",
    phone: "(85) 99999-9999",
    description: "Bar tradicional com ambiente descontraído e petiscos deliciosos",
    lat: -3.7319,
    lng: -38.5267,
    rating: 4.5,
    hours: {
      monday: "18:00 - 02:00",
      tuesday: "18:00 - 02:00",
      wednesday: "18:00 - 02:00",
      thursday: "18:00 - 02:00",
      friday: "18:00 - 03:00",
      saturday: "18:00 - 03:00",
      sunday: "Fechado"
    },
    specialties: ["Caipirinha", "Petiscos", "Música ao vivo"],
    priceRange: "€€",
    menu: [
      {
        id: "1",
        name: "Caipirinha Tradicional",
        price: 12.00,
        description: "Limão, açúcar e cachaça",
        category: "Bebidas"
      }
    ],
    images: ["/placeholder.jpg"],
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
]

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const active = searchParams.get('active')
    
    let filteredEstablishments = establishments
    
    if (active !== null) {
      const isActive = active === 'true'
      filteredEstablishments = establishments.filter(est => est.isActive === isActive)
    }
    
    return NextResponse.json({
      success: true,
      data: filteredEstablishments
    })
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Erro ao buscar estabelecimentos'
    }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    const body = await request.json()
    
    const newEstablishment = {
      id: Date.now().toString(),
      ...body,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    
    establishments.push(newEstablishment)
    
    return NextResponse.json({
      success: true,
      data: newEstablishment
    }, { status: 201 })
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Erro ao criar estabelecimento'
    }, { status: 500 })
  }
}
