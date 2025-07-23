import { NextResponse } from 'next/server';
import mysql from 'mysql2/promise';

// Configuração da conexão com o banco de dados
const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
};

// Função para obter conexão com o banco
async function getConnection() {
  return await mysql.createConnection(dbConfig);
}

// GET: Listar todos os drinks do modo drinkeira
export async function GET() {
  try {
    const connection = await getConnection();
    const [rows] = await connection.execute('SELECT * FROM drinkeira_drinks');
    await connection.end();
    return NextResponse.json(rows);
  } catch (error) {
    console.error('Erro ao buscar drinks do modo drinkeira:', error);
    return NextResponse.json({ error: 'Erro ao buscar drinks do modo drinkeira' }, { status: 500 });
  }
}

// POST: Criar novo drink do modo drinkeira
export async function POST(request) {
  try {
    const body = await request.json();
    const { name, price, category, image, price_type, priceType, popular, description } = body;
    
    // Aceitar tanto price_type quanto priceType
    const finalPriceType = price_type || priceType || 'per_unit';
    
    const connection = await getConnection();
    const [result] = await connection.execute(
      'INSERT INTO drinkeira_drinks (name, price, category, image, price_type, popular, description) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [name, price, category, image, finalPriceType, popular ? 1 : 0, description]
    );
    await connection.end();
    
    return NextResponse.json({ 
      id: result.insertId, 
      name, 
      price, 
      category, 
      image, 
      price_type: finalPriceType, 
      popular, 
      description 
    });
  } catch (error) {
    console.error('Erro ao criar drink do modo drinkeira:', error);
    return NextResponse.json({ error: 'Erro ao criar drink do modo drinkeira' }, { status: 500 });
  }
} 