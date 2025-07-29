import { NextResponse } from "next/server";
import { db } from "@/lib/db";

// PUT: Editar plano
export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const body = await request.json();
    const { name, subtitle, description, price, drinks_inclusos } = body;
    await db.query(
      'UPDATE plans SET name = ?, subtitle = ?, description = ?, price = ?, drinks_inclusos = ? WHERE id = ?', 
      [name, subtitle, description, price, drinks_inclusos, id]
    );
    return NextResponse.json({ id, name, subtitle, description, price, drinks_inclusos });
  } catch (error) {
    console.error('Erro ao editar plano:', error);
    return NextResponse.json({ error: 'Erro ao editar plano', details: error }, { status: 500 });
  }
}

// DELETE: Remover plano
export async function DELETE(request, { params }) {
  try {
    const { id } = params;
    await db.query('DELETE FROM plans WHERE id = ?', [id]);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao remover plano', details: error }, { status: 500 });
  }
} 