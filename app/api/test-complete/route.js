import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    console.log('🔍 Testando conexão com banco...');
    
    // Teste 1: Conexão básica
    const [testRows] = await db.execute('SELECT 1 as test');
    console.log('✅ Conexão básica OK:', testRows);
    
    // Teste 2: Listar todas as tabelas
    const [tables] = await db.execute('SHOW TABLES');
    console.log('📋 Tabelas encontradas:', tables);
    
    // Teste 3: Verificar se establishments existe
    const [establishmentsCheck] = await db.execute('SHOW TABLES LIKE "establishments"');
    console.log('🏢 Tabela establishments existe?', establishmentsCheck);
    
    // Teste 4: Contar registros em establishments
    const [countRows] = await db.execute('SELECT COUNT(*) as total FROM establishments');
    console.log('📊 Total de estabelecimentos:', countRows);
    
    // Teste 5: Listar outros dados se existirem
    try {
      const [otherTables] = await db.execute('SHOW TABLES');
      const tableNames = otherTables.map(row => Object.values(row)[0]);
      console.log('🗂️ Todas as tabelas:', tableNames);
      
      // Testar cada tabela
      for (const tableName of tableNames) {
        try {
          const [tableData] = await db.execute(`SELECT COUNT(*) as count FROM ${tableName}`);
          console.log(`📈 ${tableName}: ${tableData[0].count} registros`);
        } catch (err) {
          console.log(`❌ Erro ao contar ${tableName}:`, err.message);
        }
      }
    } catch (err) {
      console.log('❌ Erro ao listar tabelas:', err.message);
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Teste completo realizado!',
      connection: 'OK',
      establishments: establishmentsCheck.length > 0 ? 'EXISTS' : 'NOT_FOUND',
      tables: tables
    });
    
  } catch (error) {
    console.error('❌ Erro no teste:', error);
    return NextResponse.json({ 
      success: false, 
      error: error.message,
      code: error.code 
    }, { status: 500 });
  }
}
