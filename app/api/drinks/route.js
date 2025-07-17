import { NextResponse } from 'next/server';
import mysql from 'mysql2/promise';

const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME
});

export async function GET() {
  const [rows] = await db.query('SELECT * FROM drinks');
  return NextResponse.json(rows);
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, price, category, image, price_type, popular } = body;

    // Validação básica dos campos obrigatórios
    if (!name || !price || !category || !image || !price_type) {
      return NextResponse.json({ error: 'Preencha todos os campos obrigatórios.' }, { status: 400 });
    }

    await db.query(
      'INSERT INTO drinks (name, price, category, image, price_type, popular) VALUES (?, ?, ?, ?, ?, ?)',
      [name, price, category, image, price_type, popular ? 1 : 0]
    );
    return NextResponse.json({ message: 'Drink adicionado!' }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
} 