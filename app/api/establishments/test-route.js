import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request) {
  try {
    console.log('🔍 Testando conexão com banco...')
    
    // Teste simples de conexão
    const [rows] = await db.execute('SELECT COUNT(*) as total FROM establishments')
    console.log('📊 Total de registros:', rows[0].total)
    
    // Query simples sem aliases
    const [establishments] = await db.execute('SELECT * FROM establishments LIMIT 5')
    console.log('📋 Estabelecimentos encontrados:', establishments.length)
    
    return NextResponse.json({
      success: true,
      data: establishments,
      total: rows[0].total
    })
  } catch (error) {
    console.error('❌ Erro:', error)
    return NextResponse.json({
      success: false,
      error: error.message,
      stack: error.stack
    }, { status: 500 })
  }
}
