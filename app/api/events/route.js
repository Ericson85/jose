import { NextResponse } from 'next/server';
import mysql from 'mysql2/promise';

const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME
});

// GET: Listar todos os eventos
export async function GET() {
  try {
    const [rows] = await db.query(`
      SELECT * FROM events 
      ORDER BY created_at DESC
    `);
    return NextResponse.json(rows);
  } catch (error) {
    console.error('Erro ao buscar eventos:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar eventos', details: error },
      { status: 500 }
    );
  }
}

// POST: Criar novo evento
export async function POST(request) {
  try {
    console.log('🔄 API Events POST chamada');
    const body = await request.json();
    console.log('📝 Dados recebidos:', body);
    
    const {
      name,
      description,
      date,
      location,
      max_guests,
      status = 'pre_scheduled',
      customer_name,
      customer_phone,
      customer_email,
      customer_address,
      customer_city,
      customer_state,
      customer_age,
      event_type,
      selected_plan_id,
      selected_drinks,
      people_count,
      hours_count,
      total_budget,
      whatsapp_message
    } = body;

    console.log('🔗 Conectando ao banco de dados...');
    const [result] = await db.query(
      `INSERT INTO events (
        name, description, date, location, max_guests, status,
        customer_name, customer_phone, customer_email, customer_address,
        customer_city, customer_state, customer_age, event_type,
        selected_plan_id, selected_drinks, people_count, hours_count,
        total_budget, whatsapp_message
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        name, description, date, location, max_guests, status,
        customer_name, customer_phone, customer_email, customer_address,
        customer_city, customer_state, customer_age, event_type,
        selected_plan_id, JSON.stringify(selected_drinks), people_count, hours_count,
        total_budget, whatsapp_message
      ]
    );

    console.log('✅ Evento inserido no banco com ID:', result.insertId);
    return NextResponse.json({
      id: result.insertId,
      message: 'Evento criado com sucesso'
    });
  } catch (error) {
    console.error('❌ Erro ao criar evento:', error);
    return NextResponse.json(
      { error: 'Erro ao criar evento', details: error.message },
      { status: 500 }
    );
  }
}

// PUT: Atualizar evento
export async function PUT(request) {
  try {
    const body = await request.json();
    const {
      id,
      name,
      description,
      date,
      location,
      max_guests,
      status,
      customer_name,
      customer_phone,
      customer_email,
      customer_address,
      customer_city,
      customer_state,
      customer_age,
      event_type,
      selected_plan_id,
      selected_drinks,
      people_count,
      hours_count,
      total_budget,
      whatsapp_message
    } = body;

    await db.query(
      `UPDATE events SET 
        name = ?, description = ?, date = ?, location = ?, max_guests = ?, status = ?,
        customer_name = ?, customer_phone = ?, customer_email = ?, customer_address = ?,
        customer_city = ?, customer_state = ?, customer_age = ?, event_type = ?,
        selected_plan_id = ?, selected_drinks = ?, people_count = ?, hours_count = ?,
        total_budget = ?, whatsapp_message = ?
      WHERE id = ?`,
      [
        name, description, date, location, max_guests, status,
        customer_name, customer_phone, customer_email, customer_address,
        customer_city, customer_state, customer_age, event_type,
        selected_plan_id, JSON.stringify(selected_drinks), people_count, hours_count,
        total_budget, whatsapp_message, id
      ]
    );

    return NextResponse.json({ message: 'Evento atualizado com sucesso' });
  } catch (error) {
    console.error('Erro ao atualizar evento:', error);
    return NextResponse.json(
      { error: 'Erro ao atualizar evento', details: error },
      { status: 500 }
    );
  }
}

// DELETE: Deletar evento
export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'ID do evento é obrigatório' },
        { status: 400 }
      );
    }

    await db.query('DELETE FROM events WHERE id = ?', [id]);

    return NextResponse.json({ message: 'Evento deletado com sucesso' });
  } catch (error) {
    console.error('Erro ao deletar evento:', error);
    return NextResponse.json(
      { error: 'Erro ao deletar evento', details: error },
      { status: 500 }
    );
  }
}
