import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET - Buscar todos os cálculos CMV
export async function GET() {
  try {
    // Verificar se a tabela tem a estrutura nova ou antiga
    const [columns] = await db.execute(`
      SELECT COLUMN_NAME 
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_NAME = 'cmv_calculations' 
      AND TABLE_SCHEMA = DATABASE()
    `);
    
    const columnNames = columns.map(col => col.COLUMN_NAME);
    const hasNewStructure = columnNames.includes('destilado_nome');

    let query;
    if (hasNewStructure) {
      query = `
        SELECT 
          id,
          drink_name,
          drink_id,
          destilado_nome,
          destilado_preco_ml,
          destilado_quantidade_ml,
          frutas,
          outros_ingredientes,
          ingredientes,
          custo_total,
          margem_lucro_percentual,
          preco_venda_sugerido,
          observacoes,
          created_at,
          updated_at
        FROM cmv_calculations 
        ORDER BY created_at DESC
      `;
    } else {
      query = `
        SELECT 
          id,
          drink_name,
          drink_id,
          ingredientes,
          custo_total,
          margem_lucro_percentual,
          preco_venda_sugerido,
          observacoes,
          created_at,
          updated_at
        FROM cmv_calculations 
        ORDER BY created_at DESC
      `;
    }

    const [rows] = await db.execute(query);

    const cmvData = rows.map(row => {
      const baseData = {
        id: row.id,
        drinkName: row.drink_name,
        drinkId: row.drink_id,
        custoTotal: row.custo_total,
        margemLucroPercentual: row.margem_lucro_percentual,
        precoVendaSugerido: row.preco_venda_sugerido,
        observacoes: row.observacoes,
        createdAt: row.created_at,
        updatedAt: row.updated_at
      };

      if (hasNewStructure) {
        return {
          ...baseData,
          destiladoNome: row.destilado_nome || '',
          destiladoPrecoMl: row.destilado_preco_ml || 0,
          destiladoQuantidadeMl: row.destilado_quantidade_ml || 0,
          frutas: JSON.parse(row.frutas || '[]'),
          outrosIngredientes: JSON.parse(row.outros_ingredientes || '[]'),
          ingredientes: JSON.parse(row.ingredientes || '[]')
        };
      } else {
        return {
          ...baseData,
          destiladoNome: '',
          destiladoPrecoMl: 0,
          destiladoQuantidadeMl: 0,
          frutas: [],
          outrosIngredientes: [],
          ingredientes: JSON.parse(row.ingredientes || '[]')
        };
      }
    });

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

    // Verificar se a tabela tem a estrutura nova ou antiga
    const [columns] = await db.execute(`
      SELECT COLUMN_NAME 
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_NAME = 'cmv_calculations' 
      AND TABLE_SCHEMA = DATABASE()
    `);
    
    const columnNames = columns.map(col => col.COLUMN_NAME);
    const hasNewStructure = columnNames.includes('destilado_nome');

    let query, params;

    if (hasNewStructure) {
      // Estrutura nova - separar ingredientes por tipo
      const destilados = ingredientes.filter(ing => ing.tipo === 'destilado');
      const frutas = ingredientes.filter(ing => ing.tipo === 'fruta');
      const outros = ingredientes.filter(ing => ing.tipo === 'outro');
      
      const destiladoPrincipal = destilados[0] || {};
      
      query = `
        INSERT INTO cmv_calculations (
          drink_name,
          drink_id,
          destilado_nome,
          destilado_preco_ml,
          destilado_quantidade_ml,
          frutas,
          outros_ingredientes,
          ingredientes,
          custo_total,
          margem_lucro_percentual,
          preco_venda_sugerido,
          observacoes
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;
      
      params = [
        drinkName,
        drinkId,
        destiladoPrincipal.nome || '',
        destiladoPrincipal.preco || 0,
        destiladoPrincipal.quantidade || 0,
        JSON.stringify(frutas),
        JSON.stringify(outros),
        JSON.stringify(ingredientes),
        custoTotal,
        margemLucroPercentual,
        precoVendaSugerido,
        observacoes
      ];
    } else {
      // Estrutura antiga - apenas ingredientes
      query = `
        INSERT INTO cmv_calculations (
          drink_name,
          drink_id,
          ingredientes,
          custo_total,
          margem_lucro_percentual,
          preco_venda_sugerido,
          observacoes
        ) VALUES (?, ?, ?, ?, ?, ?, ?)
      `;
      
      params = [
        drinkName,
        drinkId,
        JSON.stringify(ingredientes),
        custoTotal,
        margemLucroPercentual,
        precoVendaSugerido,
        observacoes
      ];
    }

    const [result] = await db.execute(query, params);

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
