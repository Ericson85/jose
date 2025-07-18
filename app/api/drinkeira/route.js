import { NextResponse } from "next/server";
import db from "@/lib/utils";

// GET: Buscar configuração do modo drinkeira
export async function GET() {
  try {
    const [rows] = await db.query('SELECT * FROM drinkeira_config LIMIT 1');
    return NextResponse.json(rows[0] || {});
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao buscar configuração do modo drinkeira', details: error }, { status: 500 });
  }
}

// POST: Salvar configuração do modo drinkeira
export async function POST(request) {
  try {
    const body = await request.json();
    const { ativo, valor, descricao, drinks } = body;
    // drinks deve ser um array de ids, salvar como string separada por vírgula
    const drinksStr = Array.isArray(drinks) ? drinks.join(',') : '';
    await db.query('REPLACE INTO drinkeira_config (id, ativo, valor, descricao, drinks) VALUES (1, ?, ?, ?, ?)', [ativo, valor, descricao, drinksStr]);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao salvar configuração do modo drinkeira', details: error }, { status: 500 });
  }
} 