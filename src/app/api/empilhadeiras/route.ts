import { NextResponse } from 'next/server';
import sql from '@/lib/postgres';

// --- GET: Listar Empilhadeiras ---
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    
    const limit = parseInt(searchParams.get('limit') || '100');
    const offset = parseInt(searchParams.get('offset') || '0');
    const search = searchParams.get('search') || '';

    let empilhadeiras;

    if (search) {
      const searchPattern = `%${search}%`;
      empilhadeiras = await sql`
        SELECT * FROM empilhadeiras 
        WHERE 
          name ILIKE ${searchPattern} OR 
          brand ILIKE ${searchPattern} OR 
          model ILIKE ${searchPattern}
        ORDER BY created_at DESC
        LIMIT ${limit} OFFSET ${offset}
      `;
    } else {
      empilhadeiras = await sql`
        SELECT * FROM empilhadeiras 
        ORDER BY created_at ASC
        LIMIT ${limit} OFFSET ${offset}
      `;
    }
    
    return NextResponse.json(empilhadeiras);

  } catch (error) {
    console.error('Erro ao buscar empilhadeiras:', error);
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}

// --- POST: Criar Empilhadeira ---
export async function POST(req: Request) {
    try {
        const body = await req.json();
    
        if (!body.name) {
          return NextResponse.json({ error: 'Nome é obrigatório' }, { status: 400 });
        }
    
        // CORREÇÃO: Tratamento especial para PRICE e numéricos
        const empilhadeiraData = {
          name: body.name,
          brand: body.brand || null,
          model: body.model || null,
          year: body.year || null,
          
          // AQUI ESTAVA O ERRO:
          // Se body.price for 0, o "|| null" transformava em null.
          // O "?? 0" garante que se for undefined/null vira 0, mas se for 0 permanece 0.
          price: body.price ?? 0, 
          
          description: body.description || null,
          image_url: body.imageUrl || body.image_url || null,
          
          // Dados Técnicos
          capacity: body.capacity || null,
          engine: body.engine || null,
          voltage: body.voltage || null,

          // Novos Campos Técnicos
          lift_height: body.liftHeight || body.lift_height || null,
          load_center: body.loadCenter || null,
          battery_details: body.batteryDetails || null,
          charger_type: body.chargerType || null,
          technical_sheet_url: body.technicalSheetUrl || null,
          
          // REMOVIDO: type (pois não existe na tabela empilhadeiras)
        };
    
        const result = await sql`
          INSERT INTO empilhadeiras ${sql(empilhadeiraData)}
          RETURNING *
        `;
    
        return NextResponse.json(result[0], { status: 201 });
      } catch (error) {
        console.error('Erro ao criar empilhadeira:', error);
        return NextResponse.json({ error: 'Erro ao criar registro' }, { status: 500 });
      }
}

// --- PUT: Atualizar Empilhadeira ---
export async function PUT(req: Request) {
    try {
        const body = await req.json();
        const { id, ...rest } = body;
    
        if (!id) {
          return NextResponse.json({ error: 'ID is required' }, { status: 400 });
        }
    
        const updateData = {
            name: body.name,
            brand: body.brand || null,
            model: body.model || null,
            year: body.year || null,
            
            // CORREÇÃO TAMBÉM NO PUT
            price: body.price ?? 0,
            
            description: body.description || null,
            image_url: body.imageUrl || body.image_url || null,
            
            capacity: body.capacity || null,
            engine: body.engine || null,
            voltage: body.voltage || null,

            lift_height: body.liftHeight || body.lift_height || null,
            load_center: body.loadCenter || null,
            battery_details: body.batteryDetails || null,
            charger_type: body.chargerType || null,
            technical_sheet_url: body.technicalSheetUrl || null,

            updated_at: new Date()
        };

        // Remove chaves estritamente undefined para segurança
        Object.keys(updateData).forEach(key => (updateData as any)[key] === undefined && delete (updateData as any)[key]);
    
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

// --- DELETE: Remover Empilhadeira ---
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