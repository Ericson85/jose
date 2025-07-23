import { NextResponse } from 'next/server';
import mysql from 'mysql2/promise';

const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME
});

// GET: Listar todos os drinks do modo drinkeira
export async function GET() {
  try {
    const [rows] = await db.query('SELECT * FROM drinkeira_drinks');
    return NextResponse.json(rows);
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao buscar drinks do modo drinkeira', details: error }, { status: 500 });
  }
}

// POST: Criar novo drink do modo drinkeira
export async function POST(request) {
  try {
    const body = await request.json();
    const { name, price, category, image, price_type, popular, description } = body;
    const [result] = await db.query(
      'INSERT INTO drinkeira_drinks (name, price, category, image, price_type, popular, description) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [name, price, category, image, price_type, popular ? 1 : 0, description]
    );
    return NextResponse.json({ id: result.insertId, name, price, category, image, price_type, popular, description });
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao criar drink do modo drinkeira', details: error }, { status: 500 });
  }
} 