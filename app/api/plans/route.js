import { NextResponse } from "next/server";
import db from "@/lib/utils";

// GET: Listar todos os planos
export async function GET() {
  try {
    const [rows] = await db.query('SELECT * FROM plans');
    const plans = rows.map(plan => ({
      ...plan,
      drinks: plan.drinks_inclusos ? plan.drinks_inclusos.split(',').map(s => s.trim()) : [],
    }));
    return NextResponse.json(plans);
  } catch (error) {
    console.error('Erro ao buscar planos:', error);
    return NextResponse.json({ error: 'Erro ao buscar planos', details: error }, { status: 500 });
  }
}

// POST: Criar novo plano
export async function POST(request) {
  try {
    const body = await request.json();
    const { name, description } = body;
    const [result] = await db.query('INSERT INTO plans (name, description) VALUES (?, ?)', [name, description]);
    return NextResponse.json({ id: result.insertId, name, description });
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao criar plano', details: error }, { status: 500 });
  }
}

// PUT e DELETE seriam implementados em /api/plans/[id]/route.js 