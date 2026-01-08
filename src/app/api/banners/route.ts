import { NextResponse } from 'next/server';
import sql from '@/lib/postgres';
import { supabase } from '@/lib/supabase';
import { deleteImageFromStorage } from '@/utils/storageCleaner';

// --- GET: Listar Banners ---
export async function GET() {
  try {
    const banners = await sql`SELECT * FROM banners ORDER BY created_at DESC`;

    const formattedBanners = banners.map(banner => ({
      id: banner.id,
      ids: banner.ids || [],
      isActive: banner.is_active,
      name: banner.name,
      layout: banner.layout,
      title: banner.title,
      description: banner.description,
      imageUrl: banner.image_url,
      ctaText: banner.cta_text,
      ctaLink: banner.cta_link,
      
      // LÊ DO BANCO E ENTREGA PRO FRONT
      productIds: banner.product_ids || [], 
      
      carouselItems: banner.carousel_items || [],
      
      bgColor: banner.bg_color,
      textColor: banner.text_color,
      btnColor: banner.btn_color,
      btnTextColor: banner.btn_text_color,
      imagePosition: banner.image_position,
      
      height: banner.height,
      contentAlign: banner.content_align,
      textSize: banner.text_size,
      slideDuration: banner.slide_duration,
      titleColor: banner.title_color,
      descColor: banner.desc_color,
      secBtnColor: banner.sec_btn_color,
      secBtnTextColor: banner.sec_btn_text_color
    }));

    return NextResponse.json(formattedBanners);
  } catch (error) {
    console.error('API: Erro ao buscar banners:', error);
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}

// --- POST: Criar Banner ---
export async function POST(req: Request) {
  try {
    const body = await req.json();

    // MAPEAMENTO BLINDADO: Aceita camelCase ou snake_case do front
    const dbData = {
      name: body.name,
      ids: body.ids || [],
      is_active: body.is_active ?? body.isActive ?? true,
      layout: body.layout,
      
      title: body.title || null,
      description: body.description || null,
      image_url: body.image_url || body.imageUrl || null,
      cta_text: body.cta_text || body.ctaText || null,
      cta_link: body.cta_link || body.ctaLink || null,
      
      // *** A CORREÇÃO MÁGICA ***
      // Lê product_ids (que o seu Manager envia) OU productIds
      product_ids: body.product_ids || body.productIds || [], 
      
      carousel_items: sql.json(body.carousel_items || body.carouselItems || []),
      
      bg_color: body.bg_color || body.bgColor || null,
      text_color: body.text_color || body.textColor || null,
      btn_color: body.btn_color || body.btnColor || null,
      btn_text_color: body.btn_text_color || body.btnTextColor || null,
      image_position: body.image_position || body.imagePosition || 'left',
      
      height: body.height || 'h-[80vh]',
      content_align: body.content_align || body.contentAlign || 'left',
      text_size: body.text_size || body.textSize || 'medium',
      slide_duration: body.slide_duration || body.slideDuration || 5,
      title_color: body.title_color || body.titleColor || null,
      desc_color: body.desc_color || body.descColor || null,
      sec_btn_color: body.sec_btn_color || body.secBtnColor || null,
      sec_btn_text_color: body.sec_btn_text_color || body.secBtnTextColor || null
    };

    const result = await sql`
      INSERT INTO banners ${sql(dbData)}
      RETURNING *
    `;

    return NextResponse.json(result[0], { status: 201 });

  } catch (error) {
    console.error('API: Erro ao criar banner:', error);
    return NextResponse.json({ error: 'Erro ao criar' }, { status: 500 });
  }
}

// --- PUT: Atualizar Banner ---
export async function PUT(req: Request) {
  const body = await req.json();
  const { id } = body; 

  // Normalização de nomes (Front camelCase -> Banco snake_case)
  // Igualzinho você fez no POST, precisa fazer aqui no PUT
  const image_url = body.image_url || body.imageUrl;
  const carousel_items = body.carousel_items || body.carouselItems;

  try {
    // 1. BUSCAR DADOS ANTIGOS (Para limpar lixo do storage)
    const { data: oldBanner } = await supabase
      .from('banners')
      .select('*')
      .eq('id', id)
      .single();

    if (oldBanner) {
      // A. Limpa Imagem Principal antiga se mudou
      if (oldBanner.image_url && oldBanner.image_url !== image_url) {
        await deleteImageFromStorage(oldBanner.image_url);
      }

      // B. Limpa Slides antigos removidos
      const newUrls = Array.isArray(carousel_items) 
        ? carousel_items.map((i: any) => i.imageUrl) 
        : [];

      let oldSlides = oldBanner.carousel_items;
      if (typeof oldSlides === 'string') {
          try { oldSlides = JSON.parse(oldSlides); } catch(e) {}
      }

      if (Array.isArray(oldSlides)) {
        for (const oldItem of oldSlides) {
          if (oldItem.imageUrl && !newUrls.includes(oldItem.imageUrl)) {
             await deleteImageFromStorage(oldItem.imageUrl);
          }
        }
      }
    }

    // 2. ATUALIZAR O BANCO (Mapeamento Completo)
    const { error } = await supabase
      .from('banners')
      .update({
        name: body.name,
        ids: body.ids,
        is_active: body.is_active ?? body.isActive,
        layout: body.layout,
        
        // Dados principais
        title: body.title,
        description: body.description,
        image_url: image_url, // Variável tratada acima
        cta_text: body.cta_text || body.ctaText,
        cta_link: body.cta_link || body.ctaLink,
        
        // Arrays e JSON
        product_ids: body.product_ids || body.productIds || [],
        carousel_items: carousel_items, // O Supabase lida bem com array -> jsonb

        // Estilos e Cores (Essenciais para não perder formatação)
        bg_color: body.bg_color || body.bgColor,
        text_color: body.text_color || body.textColor,
        btn_color: body.btn_color || body.btnColor,
        btn_text_color: body.btn_text_color || body.btnTextColor,
        image_position: body.image_position || body.imagePosition,
        
        height: body.height,
        content_align: body.content_align || body.contentAlign,
        text_size: body.text_size || body.textSize,
        slide_duration: body.slide_duration || body.slideDuration,
        
        title_color: body.title_color || body.titleColor,
        desc_color: body.desc_color || body.descColor,
        sec_btn_color: body.sec_btn_color || body.secBtnColor,
        sec_btn_text_color: body.sec_btn_text_color || body.secBtnTextColor
      })
      .eq('id', id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('API PUT Error:', error);
    return NextResponse.json({ error: 'Erro ao atualizar' }, { status: 500 });
  }
}

// DELETE mantido igual...
export async function DELETE(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');

  if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });

  try {
    // 1. BUSCAR O BANNER ANTIGO (Para saber o que apagar)
    const { data: bannerToDelete, error: fetchError } = await supabase
      .from('banners')
      .select('*')
      .eq('id', id)
      .single();

    if (fetchError || !bannerToDelete) {
      return NextResponse.json({ error: 'Banner not found' }, { status: 404 });
    }

    // 2. COLETAR AS IMAGENS PARA APAGAR
    const imagesToDelete: string[] = [];

    // Imagem principal
    if (bannerToDelete.image_url) {
      imagesToDelete.push(bannerToDelete.image_url);
    }

    // Slides (verificando se é string ou objeto, conforme seu banco)
    let slides = bannerToDelete.carousel_items;
    if (typeof slides === 'string') {
        try { slides = JSON.parse(slides); } catch(e) { slides = []; }
    }
    
    if (Array.isArray(slides)) {
      slides.forEach((slide: any) => {
        if (slide.imageUrl) imagesToDelete.push(slide.imageUrl);
      });
    }

    // 3. APAGAR DO STORAGE (em paralelo)
    await Promise.all(imagesToDelete.map(url => deleteImageFromStorage(url)));

    // 4. APAGAR DO BANCO
    const { error: deleteError } = await supabase
      .from('banners')
      .delete()
      .eq('id', id);

    if (deleteError) throw deleteError;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Erro ao deletar' }, { status: 500 });
  }
}