import { NextResponse } from 'next/server';
import mysql from 'mysql2/promise';

const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME
});

export async function PUT(request, { params }) {
  const { id } = params;
  const { name, price, category, image, price_type, popular } = await request.json();
  await db.query(
    'UPDATE drinks SET name=?, price=?, category=?, image=?, price_type=?, popular=? WHERE id=?',
    [name, price, category, image, price_type, popular, id]
  );
  return NextResponse.json({ message: 'Drink atualizado!' });
}

export async function DELETE(request, { params }) {
  const { id } = params;
  await db.query('DELETE FROM drinks WHERE id=?', [id]);
  return NextResponse.json({ message: 'Drink removido!' });
} 