import { NextResponse } from 'next/server'
import mysql from 'mysql2/promise'

export async function GET() {
  try {
    console.log('🔍 Testando conexão com banco...')
    console.log('DB_HOST:', process.env.DB_HOST)
    console.log('DB_USER:', process.env.DB_USER)
    console.log('DB_NAME:', process.env.DB_NAME)
    
    const db = mysql.createPool({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME
    })
    
    // Teste simples de conexão
    const [rows] = await db.execute('SELECT 1 as test')
    console.log('✅ Conexão bem-sucedida:', rows)
    
    return NextResponse.json({
      success: true,
      message: 'Conexão com banco OK',
      test: rows
    })
  } catch (error) {
    console.error('❌ Erro de conexão:', error)
    return NextResponse.json({
      success: false,
      error: error.message,
      code: error.code
    }, { status: 500 })
  }
}
