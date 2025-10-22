import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET - Buscar cálculo CMV específico
export async function GET(request, { params }) {
  try {
    const { id } = await params;
    
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
      WHERE id = ?
    `, [id]);

    if (rows.length === 0) {
      return NextResponse.json({ success: false, error: 'CMV não encontrado' }, { status: 404 });
    }

    const cmv = rows[0];
    const formattedCmv = {
      id: cmv.id,
      drinkName: cmv.drink_name,
      drinkId: cmv.drink_id,
      destiladoNome: cmv.destilado_nome,
      destiladoPrecoMl: cmv.destilado_preco_ml,
      destiladoQuantidadeMl: cmv.destilado_quantidade_ml,
      frutas: JSON.parse(cmv.frutas || '[]'),
      outrosIngredientes: JSON.parse(cmv.outros_ingredientes || '[]'),
      custoTotal: cmv.custo_total,
      margemLucroPercentual: cmv.margem_lucro_percentual,
      precoVendaSugerido: cmv.preco_venda_sugerido,
      observacoes: cmv.observacoes,
      createdAt: cmv.created_at,
      updatedAt: cmv.updated_at
    };

    return NextResponse.json({ success: true, data: formattedCmv });
  } catch (error) {
    console.error('Erro ao buscar CMV:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// PUT - Atualizar cálculo CMV
export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const body = await request.json();
    
    const {
      drinkName,
      drinkId,
      destiladoNome,
      destiladoPrecoMl,
      destiladoQuantidadeMl,
      frutas = [],
      outrosIngredientes = [],
      custoTotal,
      margemLucroPercentual,
      precoVendaSugerido,
      observacoes = ''
    } = body;

    const [result] = await db.execute(`
      UPDATE cmv_calculations SET
        drink_name = ?,
        drink_id = ?,
        destilado_nome = ?,
        destilado_preco_ml = ?,
        destilado_quantidade_ml = ?,
        frutas = ?,
        outros_ingredientes = ?,
        custo_total = ?,
        margem_lucro_percentual = ?,
        preco_venda_sugerido = ?,
        observacoes = ?,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `, [
      drinkName,
      drinkId,
      destiladoNome,
      destiladoPrecoMl,
      destiladoQuantidadeMl,
      JSON.stringify(frutas),
      JSON.stringify(outrosIngredientes),
      custoTotal,
      margemLucroPercentual,
      precoVendaSugerido,
      observacoes,
      id
    ]);

    if (result.affectedRows === 0) {
      return NextResponse.json({ success: false, error: 'CMV não encontrado' }, { status: 404 });
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Cálculo CMV atualizado com sucesso!' 
    });
  } catch (error) {
    console.error('Erro ao atualizar CMV:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// DELETE - Excluir cálculo CMV
export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    
    const [result] = await db.execute(`
      DELETE FROM cmv_calculations WHERE id = ?
    `, [id]);

    if (result.affectedRows === 0) {
      return NextResponse.json({ success: false, error: 'CMV não encontrado' }, { status: 404 });
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Cálculo CMV excluído com sucesso!' 
    });
  } catch (error) {
    console.error('Erro ao excluir CMV:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
