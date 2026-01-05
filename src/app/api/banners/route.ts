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

    // Mapeamento EXATO para sua tabela 'banners'
    const newBanner = {
      name: body.name,
      ids: body.ids || [], // Postgres.js converte array JS p/ array Text[] automaticamente
      is_active: body.isActive,
      layout: body.layout,
      title: body.title,
      description: body.description,
      image_url: body.imageUrl,
      cta_text: body.ctaText,
      cta_link: body.ctaLink,
      carousel_items: sql.json(body.carouselItems || []), // Converte para JSONB
      bg_color: body.bgColor,
      text_color: body.textColor,
      btn_color: body.btnColor,         // Adicionado conforme sua tabela
      btn_text_color: body.btnTextColor, // Adicionado conforme sua tabela
      image_position: body.imagePosition
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

    const updateData = {
      name: body.name,
      ids: body.ids || [],
      is_active: body.isActive,
      layout: body.layout,
      title: body.title,
      description: body.description,
      image_url: body.imageUrl,
      cta_text: body.ctaText,
      cta_link: body.ctaLink,
      carousel_items: sql.json(body.carouselItems || []),
      bg_color: body.bgColor,
      text_color: body.textColor,
      btn_color: body.btnColor,
      btn_text_color: body.btnTextColor,
      image_position: body.imagePosition,
      updated_at: new Date()
    };

    // Remove campos undefined
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