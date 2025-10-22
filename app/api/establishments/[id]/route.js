import { NextResponse } from 'next/server'
import mysql from 'mysql2/promise'

const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME
})

export async function GET(request, { params }) {
  try {
    const { id } = params
    
    const [rows] = await db.execute(
      'SELECT * FROM establishments WHERE id = ?',
      [id]
    )
    
    if (rows.length === 0) {
      return NextResponse.json({
        success: false,
        error: 'Estabelecimento não encontrado'
      }, { status: 404 })
    }
    
    const establishment = rows[0]
    
    // Converter para o formato esperado
    const formattedEstablishment = {
      id: establishment.id.toString(),
      name: establishment.name,
      type: establishment.type,
      category: establishment.category,
      address: establishment.address,
      phone: establishment.phone,
      description: establishment.description,
      lat: establishment.lat,
      lng: establishment.lng,
      rating: establishment.rating,
      hours: {
        monday: establishment.hours_monday,
        tuesday: establishment.hours_tuesday,
        wednesday: establishment.hours_wednesday,
        thursday: establishment.hours_thursday,
        friday: establishment.hours_friday,
        saturday: establishment.hours_saturday,
        sunday: establishment.hours_sunday
      },
      specialties: establishment.specialties ? JSON.parse(establishment.specialties) : [],
      priceRange: establishment.price_range,
      menuLink: establishment.menu_link,
      googlePlaceId: establishment.google_place_id,
      googleMapsUrl: establishment.google_maps_url,
      images: establishment.images ? JSON.parse(establishment.images) : [],
      isActive: establishment.is_active,
      createdAt: establishment.created_at,
      updatedAt: establishment.updated_at
    }
    
    return NextResponse.json({
      success: true,
      data: formattedEstablishment
    })
  } catch (error) {
    console.error('Erro ao buscar estabelecimento:', error)
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
    
    const query = `
      UPDATE establishments SET 
        name = ?, type = ?, category = ?, address = ?, phone = ?, description = ?, 
        lat = ?, lng = ?, rating = ?, hours_monday = ?, hours_tuesday = ?, 
        hours_wednesday = ?, hours_thursday = ?, hours_friday = ?, hours_saturday = ?, 
        hours_sunday = ?, specialties = ?, price_range = ?, menu_link = ?, 
        google_place_id = ?, google_maps_url = ?, images = ?, is_active = ?
      WHERE id = ?
    `
    
    const params_array = [
      body.name,
      body.type,
      body.category,
      body.address,
      body.phone,
      body.description,
      body.lat || -3.7319,
      body.lng || -38.5267,
      body.rating || 0,
      body.hours?.monday || 'Fechado',
      body.hours?.tuesday || 'Fechado',
      body.hours?.wednesday || 'Fechado',
      body.hours?.thursday || 'Fechado',
      body.hours?.friday || 'Fechado',
      body.hours?.saturday || 'Fechado',
      body.hours?.sunday || 'Fechado',
      JSON.stringify(body.specialties || []),
      body.priceRange || '€',
      body.menuLink || '',
      body.googlePlaceId || '',
      body.googleMapsUrl || '',
      JSON.stringify(body.images || []),
      body.isActive !== false,
      id
    ]
    
    await db.execute(query, params_array)
    
    // Buscar o estabelecimento atualizado
    const [rows] = await db.execute(
      'SELECT * FROM establishments WHERE id = ?',
      [id]
    )
    
    if (rows.length === 0) {
      return NextResponse.json({
        success: false,
        error: 'Estabelecimento não encontrado após atualização'
      }, { status: 404 })
    }
    
    const establishment = rows[0]
    
    // Converter para o formato esperado
    const formattedEstablishment = {
      id: establishment.id.toString(),
      name: establishment.name,
      type: establishment.type,
      category: establishment.category,
      address: establishment.address,
      phone: establishment.phone,
      description: establishment.description,
      lat: establishment.lat,
      lng: establishment.lng,
      rating: establishment.rating,
      hours: {
        monday: establishment.hours_monday,
        tuesday: establishment.hours_tuesday,
        wednesday: establishment.hours_wednesday,
        thursday: establishment.hours_thursday,
        friday: establishment.hours_friday,
        saturday: establishment.hours_saturday,
        sunday: establishment.hours_sunday
      },
      specialties: establishment.specialties ? JSON.parse(establishment.specialties) : [],
      priceRange: establishment.price_range,
      menuLink: establishment.menu_link,
      googlePlaceId: establishment.google_place_id,
      googleMapsUrl: establishment.google_maps_url,
      images: establishment.images ? JSON.parse(establishment.images) : [],
      isActive: establishment.is_active,
      createdAt: establishment.created_at,
      updatedAt: establishment.updated_at
    }
    
    return NextResponse.json({
      success: true,
      data: formattedEstablishment
    })
  } catch (error) {
    console.error('Erro ao atualizar estabelecimento:', error)
    return NextResponse.json({
      success: false,
      error: 'Erro ao atualizar estabelecimento'
    }, { status: 500 })
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = params
    
    await db.execute(
      'DELETE FROM establishments WHERE id = ?',
      [id]
    )
    
    return NextResponse.json({
      success: true,
      message: 'Estabelecimento excluído com sucesso'
    })
  } catch (error) {
    console.error('Erro ao excluir estabelecimento:', error)
    return NextResponse.json({
      success: false,
      error: 'Erro ao excluir estabelecimento'
    }, { status: 500 })
  }
}
