import { NextResponse } from 'next/server';
import sql from '@/lib/postgres';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const type = searchParams.get('type');
    const limit = searchParams.get('limit') || '100';

    let query = sql`SELECT * FROM products`;

    if (type) {
      query = sql`${query} WHERE type = ${type}`;
    }

    query = sql`${query} ORDER BY created_at DESC LIMIT ${limit}`;
    const products = await query;
    return NextResponse.json(products);
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao buscar' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    // Preparar objeto para o banco - REMOVIDO O PRICE DAQUI
    const productData = {
      name: body.name,
      manufacturer: body.manufacturer || 'Genérico', 
      // price: 0,  <-- REMOVIDO ISSO
      quantity: body.quantity || 0,
      description: body.description || '',
      image_url: body.imageUrl || body.image_url || '',
      type: body.type
    };

    // Remove ID se vier vazio
    if (body.id) { delete (productData as any).id; }

    const result = await sql`INSERT INTO products ${sql(productData)} RETURNING *`;
    
    return NextResponse.json(result[0]);
  } catch (error: any) {
    console.error('Erro detalhado:', error); 
    return NextResponse.json({ error: error.message || 'Erro ao salvar no banco' }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { id, ...rest } = body;

    // REMOVIDO O PRICE DAQUI TAMBÉM
    const updateData = {
        name: rest.name,
        manufacturer: rest.manufacturer,
        quantity: rest.quantity,
        description: rest.description,
        image_url: rest.imageUrl || rest.image_url,
        updated_at: new Date()
    };

    const result = await sql`UPDATE products SET ${sql(updateData)} WHERE id = ${id} RETURNING *`;
    return NextResponse.json(result[0]);
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao atualizar' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id');
        await sql`DELETE FROM products WHERE id = ${id}`;
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Erro' }, { status: 500 });
    }
}