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

export async function GET(request, { params }) {
  try {
    const { id } = params
    
    const establishment = establishments.find(est => est.id === id)
    
    if (!establishment) {
      return NextResponse.json({
        success: false,
        error: 'Estabelecimento não encontrado'
      }, { status: 404 })
    }
    
    return NextResponse.json({
      success: true,
      data: establishment
    })
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Erro ao buscar estabelecimento'
    }, { status: 500 })
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = params
    const body = await request.json()
    
    const establishmentIndex = establishments.findIndex(est => est.id === id)
    
    if (establishmentIndex === -1) {
      return NextResponse.json({
        success: false,
        error: 'Estabelecimento não encontrado'
      }, { status: 404 })
    }
    
    const updatedEstablishment = {
      ...establishments[establishmentIndex],
      ...body,
      updatedAt: new Date().toISOString()
    }
    
    establishments[establishmentIndex] = updatedEstablishment
    
    return NextResponse.json({
      success: true,
      data: updatedEstablishment
    })
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Erro ao atualizar estabelecimento'
    }, { status: 500 })
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = params
    
    const establishmentIndex = establishments.findIndex(est => est.id === id)
    
    if (establishmentIndex === -1) {
      return NextResponse.json({
        success: false,
        error: 'Estabelecimento não encontrado'
      }, { status: 404 })
    }
    
    establishments.splice(establishmentIndex, 1)
    
    return NextResponse.json({
      success: true,
      message: 'Estabelecimento excluído com sucesso'
    })
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Erro ao excluir estabelecimento'
    }, { status: 500 })
  }
}
