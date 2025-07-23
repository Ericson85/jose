import { NextResponse } from 'next/server';
import mysql from 'mysql2/promise';

const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME
});

// PUT: Editar drink do modo drinkeira por id
export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const body = await request.json();
    const { name, price, category, image, price_type, popular, description } = body;
    await db.query(
      'UPDATE drinkeira_drinks SET name=?, price=?, category=?, image=?, price_type=?, popular=?, description=? WHERE id=?',
      [name, price, category, image, price_type, popular ? 1 : 0, description, id]
    );
    return NextResponse.json({ id, name, price, category, image, price_type, popular, description });
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao editar drink do modo drinkeira', details: error }, { status: 500 });
  }
}

// DELETE: Remover drink do modo drinkeira por id
export async function DELETE(request, { params }) {
  try {
    const { id } = params;
    await db.query('DELETE FROM drinkeira_drinks WHERE id=?', [id]);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao remover drink do modo drinkeira', details: error }, { status: 500 });
  }
} 