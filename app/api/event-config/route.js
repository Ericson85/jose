import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET: Obter configurações de eventos
export async function GET() {
  try {
    const [rows] = await db.query('SELECT * FROM event_config ORDER BY id DESC LIMIT 1');
                    return NextResponse.json(rows[0] || {
                  transportation_fee: 150,
                  bartender_base_cost: 100,
                  extra_hour_cost: 15,
                  max_hours_before_extra: 4,
                  bartenders_per_50_people: 1
                });
  } catch (error) {
    console.error('Erro ao buscar configurações de eventos:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

// PUT: Atualizar configurações de eventos
export async function PUT(request) {
  try {
                    const body = await request.json();
                const { transportation_fee, bartender_base_cost, extra_hour_cost, max_hours_before_extra, bartenders_per_50_people } = body;

    // Verificar se já existe uma configuração
    const [existing] = await db.query('SELECT id FROM event_config LIMIT 1');
    
    if (existing.length > 0) {
                        // Atualizar configuração existente
                  await db.query(
                    'UPDATE event_config SET transportation_fee = ?, bartender_base_cost = ?, extra_hour_cost = ?, max_hours_before_extra = ?, bartenders_per_50_people = ? WHERE id = ?',
                    [transportation_fee, bartender_base_cost, extra_hour_cost, max_hours_before_extra, bartenders_per_50_people, existing[0].id]
                  );
    } else {
                        // Criar nova configuração
                  await db.query(
                    'INSERT INTO event_config (transportation_fee, bartender_base_cost, extra_hour_cost, max_hours_before_extra, bartenders_per_50_people) VALUES (?, ?, ?, ?, ?)',
                    [transportation_fee, bartender_base_cost, extra_hour_cost, max_hours_before_extra, bartenders_per_50_people]
                  );
    }

    return NextResponse.json({ message: 'Configurações atualizadas com sucesso' });
  } catch (error) {
    console.error('Erro ao atualizar configurações de eventos:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
} 