import { NextResponse } from 'next/server';
import mysql from 'mysql2/promise';

// Configuração da conexão com o banco de dados
const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
};

// Função para obter conexão com o banco
async function getConnection() {
  return await mysql.createConnection(dbConfig);
}

// PUT - Atualizar um drink específico
export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const body = await request.json();
    
    const { name, description, price, image_url, category } = body;
    
    const connection = await getConnection();
    
    const [result] = await connection.execute(
      'UPDATE drinkeira_drinks SET name = ?, description = ?, price = ?, image_url = ?, category = ? WHERE id = ?',
      [name, description, price, image_url, category, id]
    );
    
    await connection.end();
    
    if (result.affectedRows === 0) {
      return NextResponse.json(
        { error: 'Drink não encontrado' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(
      { message: 'Drink atualizado com sucesso' },
      { status: 200 }
    );
    
  } catch (error) {
    console.error('Erro ao atualizar drink:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

// DELETE - Remover um drink específico
export async function DELETE(request, { params }) {
  try {
    const { id } = params;
    
    const connection = await getConnection();
    
    const [result] = await connection.execute(
      'DELETE FROM drinkeira_drinks WHERE id = ?',
      [id]
    );
    
    await connection.end();
    
    if (result.affectedRows === 0) {
      return NextResponse.json(
        { error: 'Drink não encontrado' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(
      { message: 'Drink removido com sucesso' },
      { status: 200 }
    );
    
  } catch (error) {
    console.error('Erro ao remover drink:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
} 