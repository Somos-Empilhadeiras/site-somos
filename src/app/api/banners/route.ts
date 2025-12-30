import { NextResponse } from 'next/server';
import sql from '@/lib/postgres';

// --- GET: Listar todas as empilhadeiras ---
export async function GET(req: Request) {
  console.log("API: Recebendo pedido GET em /api/empilhadeiras"); // LOG DE DEBUG

  try {
    // 1. Busca no Banco de Dados
    // O 'sql' do postgres.js retorna um Array (RowList) por padrão.
    const empilhadeiras = await sql`
      SELECT * FROM empilhadeiras 
      ORDER BY created_at DESC
    `;

    console.log(`API: Sucesso! Encontrados ${empilhadeiras.length} itens.`); // LOG DE DEBUG

    // 2. Retorna o Array JSON
    return NextResponse.json(empilhadeiras);

  } catch (error) {
    console.error('API: Erro Crítico ao buscar empilhadeiras:', error);
    return NextResponse.json({ error: 'Erro interno ao buscar dados' }, { status: 500 });
  }
}

// --- POST: Criar nova empilhadeira ---
export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    // Mapeamento manual para snake_case (Padrão SQL)
    const newItem = {
      name: body.name,
      brand: body.brand,
      model: body.model,
      year: body.year,
      price: body.price,
      capacity: body.capacity,
      engine: body.engine,
      voltage: body.voltage,
      description: body.description,
      image_url: body.imageUrl || '/placeholder.jpg',
    };

    const result = await sql`
      INSERT INTO empilhadeiras ${sql(newItem)}
      RETURNING *
    `;

    return NextResponse.json(result[0], { status: 201 });
  } catch (error) {
    console.error('API: Erro ao criar:', error);
    return NextResponse.json({ error: 'Erro ao criar registro' }, { status: 500 });
  }
}

// --- PUT: Atualizar empilhadeira ---
export async function PUT(req: Request) {
  try {
    const body = await req.json();
    // Aceita tanto 'id' quanto '_id' para compatibilidade
    const targetId = body.id || body._id; 

    if (!targetId) {
      return NextResponse.json({ error: 'ID é obrigatório' }, { status: 400 });
    }

    const updateData = {
      name: body.name,
      brand: body.brand,
      model: body.model,
      year: body.year,
      price: body.price,
      capacity: body.capacity,
      engine: body.engine,
      voltage: body.voltage,
      description: body.description,
      image_url: body.imageUrl,
      updated_at: new Date() // Atualiza a data
    };

    // Remove campos undefined para não bugar o banco
    Object.keys(updateData).forEach(key => (updateData as any)[key] === undefined && delete (updateData as any)[key]);

    const result = await sql`
      UPDATE empilhadeiras
      SET ${sql(updateData)}
      WHERE id = ${targetId}
      RETURNING *
    `;

    return NextResponse.json(result[0]);
  } catch (error) {
    console.error('API: Erro ao atualizar:', error);
    return NextResponse.json({ error: 'Erro ao atualizar' }, { status: 500 });
  }
}

// --- DELETE: Remover empilhadeira ---
export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) return NextResponse.json({ error: 'ID necessário' }, { status: 400 });

    await sql`DELETE FROM empilhadeiras WHERE id = ${id}`;

    return NextResponse.json({ message: 'Deletado com sucesso' });
  } catch (error) {
    console.error('API: Erro ao deletar:', error);
    return NextResponse.json({ error: 'Erro ao deletar' }, { status: 500 });
  }
}