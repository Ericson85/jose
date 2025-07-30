import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

// PUT: Atualizar custo extra existente
export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const body = await request.json();
    const { name, value } = body;

    if (!name || !value) {
      return NextResponse.json(
        { error: 'Nome e valor são obrigatórios' },
        { status: 400 }
      );
    }

    await db.query(
      'UPDATE extra_costs SET name = ?, value = ? WHERE id = ?',
      [name, value, id]
    );

    return NextResponse.json({ message: 'Custo extra atualizado com sucesso' });
  } catch (error) {
    console.error('Erro ao atualizar custo extra:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

// DELETE: Deletar custo extra (soft delete - marcar como inativo)
export async function DELETE(request, { params }) {
  try {
    const { id } = params;

    await db.query(
      'UPDATE extra_costs SET active = FALSE WHERE id = ?',
      [id]
    );

    return NextResponse.json({ message: 'Custo extra removido com sucesso' });
  } catch (error) {
    console.error('Erro ao remover custo extra:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
} 