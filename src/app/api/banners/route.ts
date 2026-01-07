import { NextResponse } from 'next/server';
import sql from '@/lib/postgres';

// --- GET: Listar banners ---
export async function GET(req: Request) {
  try {
    const banners = await sql`
      SELECT * FROM banners 
      ORDER BY created_at DESC
    `;
    return NextResponse.json(banners);
  } catch (error) {
    console.error('API: Erro ao buscar banners:', error);
    return NextResponse.json({ error: 'Erro ao buscar banners' }, { status: 500 });
  }
}

// --- POST: Criar banner ---
export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Mapeamento EXATO: Lê o que vem do front (snake_case) e prepara para o banco
    // O operador || null garante que undefined vire null (evita o erro da API)
    const newBanner = {
      name: body.name,
      ids: body.ids || [],
      is_active: body.is_active ?? true, // Lê is_active (do front atualizado)
      layout: body.layout,
      
      title: body.title || null,
      description: body.description || null,
      image_url: body.image_url || null, // Lê image_url
      cta_text: body.cta_text || null,   // Lê cta_text
      cta_link: body.cta_link || null,   // Lê cta_link
      
      carousel_items: sql.json(body.carousel_items || []), 
      
      bg_color: body.bg_color || null,
      text_color: body.text_color || null,
      btn_color: body.btn_color || null,
      btn_text_color: body.btn_text_color || null,
      image_position: body.image_position || 'left',

      // --- NOVOS CAMPOS (Correção definitiva) ---
      height: body.height || 'h-[80vh]',
      content_align: body.content_align || 'left',
      text_size: body.text_size || 'medium',
      slide_duration: body.slide_duration || 5,
      title_color: body.title_color || null,
      desc_color: body.desc_color || null,
      sec_btn_color: body.sec_btn_color || null,
      sec_btn_text_color: body.sec_btn_text_color || null
    };

    const result = await sql`
      INSERT INTO banners ${sql(newBanner)}
      RETURNING *
    `;

    return NextResponse.json(result[0], { status: 201 });
  } catch (error) {
    console.error('API: Erro ao criar banner:', error);
    return NextResponse.json({ error: 'Erro ao criar banner' }, { status: 500 });
  }
}

// --- PUT: Atualizar banner ---
export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const targetId = body.id;

    if (!targetId) return NextResponse.json({ error: 'ID obrigatório' }, { status: 400 });

    // Mesmo mapeamento do POST
    const updateData = {
      name: body.name,
      ids: body.ids || [],
      is_active: body.is_active,
      layout: body.layout,
      
      title: body.title || null,
      description: body.description || null,
      image_url: body.image_url || null,
      cta_text: body.cta_text || null,
      cta_link: body.cta_link || null,
      
      carousel_items: sql.json(body.carousel_items || []),
      
      bg_color: body.bg_color || null,
      text_color: body.text_color || null,
      btn_color: body.btn_color || null,
      btn_text_color: body.btn_text_color || null,
      image_position: body.image_position || 'left',

      // Novos Campos
      height: body.height,
      content_align: body.content_align,
      text_size: body.text_size,
      slide_duration: body.slide_duration,
      title_color: body.title_color,
      desc_color: body.desc_color,
      sec_btn_color: body.sec_btn_color,
      sec_btn_text_color: body.sec_btn_text_color,

      updated_at: new Date()
    };

    // Remove chaves que sejam estritamente undefined (mas mantemos nulls intencionais acima)
    Object.keys(updateData).forEach(key => (updateData as any)[key] === undefined && delete (updateData as any)[key]);

    const result = await sql`
      UPDATE banners
      SET ${sql(updateData)}
      WHERE id = ${targetId}
      RETURNING *
    `;

    return NextResponse.json(result[0]);
  } catch (error) {
    console.error('API: Erro ao atualizar banner:', error);
    return NextResponse.json({ error: 'Erro ao atualizar banner' }, { status: 500 });
  }
}

// --- DELETE: Remover banner ---
export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) return NextResponse.json({ error: 'ID necessário' }, { status: 400 });

    await sql`DELETE FROM banners WHERE id = ${id}`;

    return NextResponse.json({ message: 'Banner deletado' });
  } catch (error) {
    console.error('API: Erro ao deletar:', error);
    return NextResponse.json({ error: 'Erro ao deletar banner' }, { status: 500 });
  }
}