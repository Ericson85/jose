import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET - Buscar todos os cálculos CMV
export async function GET() {
  try {
    const [rows] = await db.execute(`
      SELECT 
        id,
        drink_name,
        drink_id,
        destilado_nome,
        destilado_preco_ml,
        destilado_quantidade_ml,
        frutas,
        outros_ingredientes,
        custo_total,
        margem_lucro_percentual,
        preco_venda_sugerido,
        observacoes,
        created_at,
        updated_at
      FROM cmv_calculations 
      ORDER BY created_at DESC
    `);

    const cmvData = rows.map(row => ({
      id: row.id,
      drinkName: row.drink_name,
      drinkId: row.drink_id,
      destiladoNome: row.destilado_nome,
      destiladoPrecoMl: row.destilado_preco_ml,
      destiladoQuantidadeMl: row.destilado_quantidade_ml,
      frutas: JSON.parse(row.frutas || '[]'),
      outrosIngredientes: JSON.parse(row.outros_ingredientes || '[]'),
      custoTotal: row.custo_total,
      margemLucroPercentual: row.margem_lucro_percentual,
      precoVendaSugerido: row.preco_venda_sugerido,
      observacoes: row.observacoes,
      createdAt: row.created_at,
      updatedAt: row.updated_at
    }));

    return NextResponse.json({ success: true, data: cmvData });
  } catch (error) {
    console.error('Erro ao buscar CMV:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// POST - Criar novo cálculo CMV
export async function POST(request) {
  try {
    const body = await request.json();
    
    const {
      drinkName,
      drinkId,
      ingredientes = [],
      custoTotal,
      margemLucroPercentual,
      precoVendaSugerido,
      observacoes = ''
    } = body;

    const [result] = await db.execute(`
      INSERT INTO cmv_calculations (
        drink_name,
        drink_id,
        ingredientes,
        custo_total,
        margem_lucro_percentual,
        preco_venda_sugerido,
        observacoes
      ) VALUES (?, ?, ?, ?, ?, ?, ?)
    `, [
      drinkName,
      drinkId,
      JSON.stringify(ingredientes),
      custoTotal,
      margemLucroPercentual,
      precoVendaSugerido,
      observacoes
    ]);

    return NextResponse.json({ 
      success: true, 
      message: 'Cálculo CMV salvo com sucesso!',
      id: result.insertId 
    });
  } catch (error) {
    console.error('Erro ao salvar CMV:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
