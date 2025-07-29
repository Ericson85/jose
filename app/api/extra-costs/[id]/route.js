import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

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