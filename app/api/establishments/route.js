import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const active = searchParams.get('active')
    
    let query = `
      SELECT 
        id,
        name,
        type,
        category,
        address,
        phone,
        description,
        lat,
        lng,
        rating,
        hours_monday,
        hours_tuesday,
        hours_wednesday,
        hours_thursday,
        hours_friday,
        hours_saturday,
        hours_sunday,
        specialties,
        price_range as priceRange,
        menu_link as menuLink,
        google_place_id as googlePlaceId,
        images,
        is_active as isActive,
        created_at as createdAt,
        updated_at as updatedAt
      FROM establishments
    `
    
    const params = []
    
    if (active !== null) {
      query += ' WHERE is_active = ?'
      params.push(active === 'true')
    }
    
    query += ' ORDER BY created_at DESC'
    
    const [rows] = await db.execute(query, params)
    
    // Converter os dados para o formato esperado
    const establishments = rows.map(row => ({
      id: row.id.toString(),
      name: row.name,
      type: row.type,
      category: row.category,
      address: row.address,
      phone: row.phone,
      description: row.description,
      lat: parseFloat(row.lat),
      lng: parseFloat(row.lng),
      rating: parseFloat(row.rating),
      hours: {
        monday: row.hours_monday,
        tuesday: row.hours_tuesday,
        wednesday: row.hours_wednesday,
        thursday: row.hours_thursday,
        friday: row.hours_friday,
        saturday: row.hours_saturday,
        sunday: row.hours_sunday
      },
      specialties: row.specialties ? JSON.parse(row.specialties) : [],
      priceRange: row.priceRange,
      menuLink: row.menuLink,
      googlePlaceId: row.googlePlaceId,
      images: row.images ? JSON.parse(row.images) : [],
      isActive: Boolean(row.isActive),
      createdAt: row.createdAt,
      updatedAt: row.updatedAt
    }))
    
    return NextResponse.json({
      success: true,
      data: establishments
    })
  } catch (error) {
    console.error('Erro ao buscar estabelecimentos:', error)
    return NextResponse.json({
      success: false,
      error: 'Erro ao buscar estabelecimentos'
    }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    const body = await request.json()
    
    const query = `
      INSERT INTO establishments (
        name, type, category, address, phone, description, lat, lng, rating,
        hours_monday, hours_tuesday, hours_wednesday, hours_thursday, hours_friday, hours_saturday, hours_sunday,
        specialties, price_range, menu_link, google_place_id, google_maps_url, images, is_active
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `
    
    const params = [
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
      body.isActive !== false
    ]
    
    const [result] = await db.execute(query, params)
    
    // Buscar o estabelecimento criado
    const [rows] = await db.execute(
      'SELECT * FROM establishments WHERE id = ?',
      [result.insertId]
    )
    
    if (rows.length === 0) {
      throw new Error('Estabelecimento não foi criado')
    }
    
    const newEstablishment = rows[0]
    
    // Converter para o formato esperado
    const establishment = {
      id: newEstablishment.id.toString(),
      name: newEstablishment.name,
      type: newEstablishment.type,
      category: newEstablishment.category,
      address: newEstablishment.address,
      phone: newEstablishment.phone,
      description: newEstablishment.description,
      lat: parseFloat(newEstablishment.lat),
      lng: parseFloat(newEstablishment.lng),
      rating: parseFloat(newEstablishment.rating),
      hours: {
        monday: newEstablishment.hours_monday,
        tuesday: newEstablishment.hours_tuesday,
        wednesday: newEstablishment.hours_wednesday,
        thursday: newEstablishment.hours_thursday,
        friday: newEstablishment.hours_friday,
        saturday: newEstablishment.hours_saturday,
        sunday: newEstablishment.hours_sunday
      },
      specialties: newEstablishment.specialties ? JSON.parse(newEstablishment.specialties) : [],
      priceRange: newEstablishment.price_range,
      menuLink: newEstablishment.menu_link,
      googlePlaceId: newEstablishment.google_place_id,
      images: newEstablishment.images ? JSON.parse(newEstablishment.images) : [],
      isActive: Boolean(newEstablishment.is_active),
      createdAt: newEstablishment.created_at,
      updatedAt: newEstablishment.updated_at
    }
    
    return NextResponse.json({
      success: true,
      data: establishment
    }, { status: 201 })
  } catch (error) {
    console.error('Erro ao criar estabelecimento:', error)
    return NextResponse.json({
      success: false,
      error: 'Erro ao criar estabelecimento'
    }, { status: 500 })
  }
}
