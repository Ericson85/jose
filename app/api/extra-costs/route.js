import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET: Listar todos os custos extras ativos
export async function GET() {
  try {
    const [rows] = await db.query('SELECT * FROM extra_costs WHERE active = TRUE ORDER BY created_at DESC');
    return NextResponse.json(rows);
  } catch (error) {
    console.error('Erro ao buscar custos extras:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

// POST: Criar novo custo extra
export async function POST(request) {
  try {
    const body = await request.json();
    const { name, value } = body;

    if (!name || !value) {
      return NextResponse.json(
        { error: 'Nome e valor são obrigatórios' },
        { status: 400 }
      );
    }

    const [result] = await db.query(
      'INSERT INTO extra_costs (name, value) VALUES (?, ?)',
      [name, value]
    );

    return NextResponse.json({ 
      message: 'Custo extra criado com sucesso',
      id: result.insertId 
    });
  } catch (error) {
    console.error('Erro ao criar custo extra:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
} 