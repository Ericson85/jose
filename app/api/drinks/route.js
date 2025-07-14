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
  const { name, price, category, image, price_type, popular } = await request.json();
  await db.query(
    'INSERT INTO drinks (name, price, category, image, price_type, popular) VALUES (?, ?, ?, ?, ?, ?)',
    [name, price, category, image, price_type, popular]
  );
  return NextResponse.json({ message: 'Drink adicionado!' }, { status: 201 });
} 