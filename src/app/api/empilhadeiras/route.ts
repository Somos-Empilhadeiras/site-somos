import { NextResponse } from 'next/server';
import sql from '@/lib/postgres'; // Importe o seu cliente postgres.ts

// --- GET: Listar todas as empilhadeiras ---
export async function GET() {
  try {
    // Busca tudo da tabela 'empilhadeiras'
    const products = await sql`SELECT * FROM empilhadeiras ORDER BY created_at DESC`;
    
    return NextResponse.json(products);
  } catch (error) {
    console.error('Erro ao buscar empilhadeiras:', error);
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}

// --- POST: Criar nova empilhadeira ---
export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Validação básica (opcional, mas recomendada)
    if (!body.name || !body.brand || !body.price) {
      return NextResponse.json({ error: 'Campos obrigatórios faltando' }, { status: 400 });
    }

    // O postgres.js mapeia o objeto body para as colunas automaticamente se os nomes baterem.
    // Se o seu front manda 'imageUrl' (camelCase) e o banco é 'image_url' (snake_case),
    // precisamos ajustar o objeto antes de salvar.
    
    const productData = {
      name: body.name,
      brand: body.brand,
      model: body.model,
      year: body.year,
      price: body.price,
      capacity: body.capacity,
      engine: body.engine,
      voltage: body.voltage,
      description: body.description,
      image_url: body.imageUrl || '/placeholder.jpg', // Mapeando para o nome da coluna SQL
    };

    // 'sql(productData)' cria automaticamente a query (colunas) values (valores)
    const result = await sql`
      INSERT INTO empilhadeiras ${sql(productData)}
      RETURNING *
    `;

    return NextResponse.json(result[0], { status: 201 });
  } catch (error) {
    console.error('Erro ao criar empilhadeira:', error);
    return NextResponse.json({ error: 'Erro ao criar registro' }, { status: 500 });
  }
}

// --- PUT: Atualizar empilhadeira ---
export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { id, ...rest } = body;

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    // Prepara dados para atualização (mapeando camelCase para snake_case se necessário)
    const updateData: any = { ...rest };
    if (updateData.imageUrl) {
        updateData.image_url = updateData.imageUrl;
        delete updateData.imageUrl; // Remove a chave antiga
    }
    
    // Adiciona timestamp de atualização
    updateData.updated_at = new Date();

    // Query de Update dinâmica usando postgres.js
    const result = await sql`
      UPDATE empilhadeiras
      SET ${sql(updateData)}
      WHERE id = ${id}
      RETURNING *
    `;

    if (result.length === 0) {
        return NextResponse.json({ error: 'Produto não encontrado' }, { status: 404 });
    }

    return NextResponse.json(result[0]);
  } catch (error) {
    console.error('Erro ao atualizar:', error);
    return NextResponse.json({ error: 'Erro ao atualizar registro' }, { status: 500 });
  }
}

// --- DELETE: Remover empilhadeira ---
export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID required' }, { status: 400 });
    }

    await sql`DELETE FROM empilhadeiras WHERE id = ${id}`;

    return NextResponse.json({ message: 'Deleted' });
  } catch (error) {
    console.error('Erro ao deletar:', error);
    return NextResponse.json({ error: 'Erro ao deletar registro' }, { status: 500 });
  }
}