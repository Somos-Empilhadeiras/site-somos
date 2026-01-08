'use client';

import { useEffect, useState, useCallback } from 'react';
import { X, ArrowRight, ChevronLeft, ChevronRight, ShoppingBag, Image as ImageIcon } from 'lucide-react';
import Link from 'next/link';

// --- INTERFACES ---

interface Product {
  id: string | number;
  name: string;
  image_url: string;
  model: string;
  brand: string;
}

interface CarouselItem {
  title: string;
  description: string;
  imageUrl: string;
  link: string;
  buttonText?: string;
  secondaryButtonText?: string;
  secondaryButtonLink?: string;
  secondaryButtonTransparent?: boolean;
}

interface BannerData {
  id: string;
  ids: string[];
  isActive: boolean;
  layout: 'full' | 'compact' | 'alert' | 'carousel' | 'product_grid';

  title: string;
  description: string;
  imageUrl: string;
  ctaText: string;
  ctaLink: string;

  productIds?: string[];

  bgColor: string;
  textColor: string;
  btnColor: string;
  btnTextColor: string;
  imagePosition: 'left' | 'right';
  carouselItems: CarouselItem[];

  height?: string;
  contentAlign?: 'left' | 'center' | 'right';
  textSize?: 'small' | 'medium' | 'large';
  slideDuration?: number;
  titleColor?: string;
  descColor?: string;
  secBtnColor?: string;
  secBtnTextColor?: string;
}

interface Props {
  id: string;
  className?: string;
}

export default function DynamicBanner({ id, className = '' }: Props) {
  const [banner, setBanner] = useState<BannerData | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [isVisible, setIsVisible] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);

// --- 1. BUSCA DADOS (VERSÃO CORRIGIDA E BLINDADA) ---
  useEffect(() => {
    async function fetchBannerAndProducts() {
      try {
        const res = await fetch('/api/banners', { cache: 'no-store' });
        if (!res.ok) return;
        const data: any[] = await res.json();

        // 1. Filtra candidatos (Ativos e que pertencem a este ID)
        const candidates = data.filter((b: any) => {
          const bannerIds = b.ids || b.slot_ids || [];
          const isActive = b.is_active !== undefined ? b.is_active : b.isActive;
          return isActive && bannerIds.includes(id);
        });

        // 2. ORDENAÇÃO FORÇADA: O mais novo (maior ID) fica por último
        candidates.sort((a: any, b: any) => {
            if (a.id < b.id) return -1;
            if (a.id > b.id) return 1;
            return 0;
        });

        // 3. Pega o último da lista (O Vencedor)
        const found = candidates.length > 0 ? candidates[candidates.length - 1] : undefined;

        if (found) {
          // --- BLINDAGEM: PARSE DOS SLIDES ---
          let safeSlides: CarouselItem[] = [];
          try {
            // Tenta pegar de todas as formas possíveis que o banco pode mandar
            const rawSlides = found.carousel_items || found.carouselItems;
            
            if (Array.isArray(rawSlides)) {
                safeSlides = rawSlides;
            } else if (typeof rawSlides === 'string') {
                safeSlides = JSON.parse(rawSlides);
            }
          } catch (e) {
            console.error("Erro parsing slides:", e);
          }

          // --- BLINDAGEM: PARSE DOS PRODUTOS ---
          let safeProductIds: string[] = [];
          try {
            const rawIds = found.product_ids || found.productIds;
            if (Array.isArray(rawIds)) {
                safeProductIds = rawIds.map(String);
            } else if (typeof rawIds === 'string') {
                if (rawIds.startsWith('[')) {
                    safeProductIds = JSON.parse(rawIds).map(String);
                } else {
                    safeProductIds = rawIds.split(',').map((s: string) => s.trim());
                }
            }
          } catch (e) {
            console.error("Erro parsing productIds:", e);
          }

          // Monta o objeto final normalizando os nomes
          const bannerData: BannerData = {
            id: found.id,
            ids: found.ids || [],
            isActive: true,
            layout: found.layout,
            title: found.title,
            description: found.description,
            imageUrl: found.image_url || found.imageUrl,
            ctaText: found.cta_text || found.ctaText,
            ctaLink: found.cta_link || found.ctaLink,
            
            // Dados tratados
            productIds: safeProductIds,
            carouselItems: safeSlides,
            
            imagePosition: found.image_position || found.imagePosition || 'left',
            height: found.height || 'h-[80vh]',
            contentAlign: found.content_align || found.contentAlign || 'left',
            textSize: found.text_size || found.textSize || 'medium',
            slideDuration: found.slide_duration || found.slideDuration || 5,
            bgColor: found.bg_color || found.bgColor || '#005831',
            textColor: found.text_color || found.textColor || '#ffffff',
            titleColor: found.title_color || found.titleColor || '#ffffff',
            descColor: found.desc_color || found.descColor || '#e2e8f0',
            btnColor: found.btn_color || found.btnColor || '#005831',
            btnTextColor: found.btn_text_color || found.btnTextColor || '#ffffff',
            secBtnColor: found.sec_btn_color || found.secBtnColor || '#ffffff',
            secBtnTextColor: found.sec_btn_text_color || found.secBtnTextColor || '#000000',
          };

          setBanner(bannerData);

          // Busca produtos da API se for vitrine
          if (bannerData.layout === 'product_grid' && safeProductIds.length > 0) {
            try {
              const prodRes = await fetch('/api/empilhadeiras?limit=100');
              if (prodRes.ok) {
                const allProducts: Product[] = await prodRes.json();
                const filtered = allProducts.filter(p => safeProductIds.includes(String(p.id)));
                setProducts(filtered);
              }
            } catch (err) { console.error(err); }
          }
        } else {
          setBanner(null);
        }
      } catch (error) {
        console.error(`Erro banner ${id}:`, error);
      }
    }
    fetchBannerAndProducts();
  }, [id]);

  // --- 2. CARROSSEL LÓGICA ---
  const nextSlide = useCallback(() => {
    if (banner?.carouselItems && banner.carouselItems.length > 0) {
      setCurrentSlide((prev) => (prev + 1) % banner.carouselItems.length);
    }
  }, [banner]);

  const prevSlide = () => {
    if (banner?.carouselItems && banner.carouselItems.length > 0) {
      setCurrentSlide((prev) => (prev === 0 ? banner.carouselItems.length - 1 : prev - 1));
    }
  };

  useEffect(() => {
    // Só inicia o timer se tiver mais de 1 slide
    if (banner?.layout === 'carousel' && banner.carouselItems.length > 1) {
      const intervalTime = (banner.slideDuration || 5) * 1000;
      const timer = setInterval(nextSlide, intervalTime);
      return () => clearInterval(timer);
    }
  }, [banner, nextSlide]);

  if (!banner || !isVisible) return null;
  
  const textSizes = {
    small: { title: 'text-3xl md:text-4xl', desc: 'text-base md:text-lg' },
    medium: { title: 'text-4xl md:text-6xl lg:text-7xl', desc: 'text-lg md:text-2xl' },
    large: { title: 'text-5xl md:text-7xl lg:text-8xl', desc: 'text-xl md:text-3xl' }
  }[banner.textSize || 'medium'];

  // === 1. VITRINE ===
  if (banner.layout === 'product_grid') {
    return (
      <section className={`w-full py-16 md:py-24 bg-green-700 ${className}`}>
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">{banner.title}</h2>
            {banner.description && <p className="text-slate-600 text-lg leading-relaxed">{banner.description}</p>}
            <div className="w-20 h-1.5 bg-green-700 mx-auto mt-6 rounded-full opacity-80"></div>
          </div>
          {products.length > 0 ? (
            <div className="flex flex-wrap justify-center gap-8">
              {products.map((product) => (
                <Link href={`/empilhadeiras/${product.id}`} key={product.id} className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 w-full max-w-[320px] overflow-hidden border border-slate-100 flex flex-col">
                  <div className="bg-slate-100/60 p-6 h-64 flex items-center justify-center relative">
                    {product.image_url ? (
                      <img src={product.image_url} alt={product.name} className="w-full h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <div className="flex flex-col items-center justify-center text-slate-300 gap-2"><ShoppingBag size={32} /><span className="text-xs font-medium">Sem foto</span></div>
                    )}
                    {product.brand && <span className="absolute top-4 right-4 bg-white/90 backdrop-blur text-slate-700 text-[10px] font-bold px-2 py-1 rounded shadow-sm border border-slate-200 uppercase tracking-wide">{product.brand}</span>}
                  </div>
                  <div className="p-6 flex-1 flex flex-col">
                    <div className="mb-4">
                      <h3 className="text-lg font-bold text-slate-800 leading-tight group-hover:text-green-700 transition-colors">{product.name}</h3>
                      <p className="text-xs text-slate-500 mt-1 font-mono uppercase">{product.model ? `Modelo: ${product.model}` : 'Ver Detalhes'}</p>
                    </div>
                    <div className="mt-auto pt-4 border-t border-slate-50 flex items-center justify-between">
                      <span className="text-xs font-semibold text-green-700 bg-green-50 px-2 py-1 rounded">Disponível</span>
                      <span className="text-sm font-medium text-slate-400 group-hover:text-green-700 group-hover:translate-x-1 transition-all flex items-center gap-1">Ver detalhes <ArrowRight size={14} /></span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-xl border border-dashed border-slate-200">
               <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-50 mb-4 text-slate-400"><ShoppingBag size={24} /></div>
               <p className="text-slate-500 font-medium">Nenhum destaque configurado.</p>
            </div>
          )}
        </div>
      </section>
    );
  }

  // === 2. CARROSSEL (CORRIGIDO) ===
  if (banner.layout === 'carousel') {
    // Se não tiver slides, mostra um estado de aviso em vez de sumir
    if (!banner.carouselItems || banner.carouselItems.length === 0) {
        return (
            <div className={`w-full h-[40vh] bg-slate-900 flex flex-col items-center justify-center text-white ${className}`}>
                <ImageIcon size={48} className="opacity-50 mb-4" />
                <h3 className="text-xl font-bold">Carrossel Vazio</h3>
                <p className="text-slate-400">Adicione slides no Painel Administrativo.</p>
            </div>
        );
    }

    const alignClasses = {
      'left': 'items-start text-left',
      'center': 'items-center text-center',
      'right': 'items-end text-right'
    }[banner.contentAlign || 'left'];

    return (
      <div className={`relative w-full overflow-hidden bg-slate-900 group min-h-[60vh] md:min-h-[80vh] ${className}`} style={{ height: banner.height === 'h-screen' ? '100vh' : undefined }}>
        {banner.carouselItems.map((item, index) => (
          <div
            key={index}
            // Z-Index e Opacidade corrigidos para garantir transição suave
            className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out ${index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
          >
            {/* Background Image */}
            <div className="absolute inset-0">
              {item.imageUrl ? (
                <img src={item.imageUrl} className="w-full h-full object-cover object-center" alt={item.title} />
              ) : (
                <div className="w-full h-full bg-slate-800 flex items-center justify-center text-slate-500">Sem Imagem de Fundo</div>
              )}
              {/* Overlay Gradiente Baseado no Alinhamento */}
              <div className={`absolute inset-0 bg-gradient-to-r ${banner.contentAlign === 'right' ? 'from-transparent via-black/40 to-black/90' : banner.contentAlign === 'center' ? 'from-black/70 via-transparent to-black/70' : 'from-black/90 via-black/40 to-transparent'}`}></div>
            </div>

            {/* Conteúdo Texto */}
            <div className={`relative z-20 container mx-auto px-6 h-full flex flex-col justify-center ${alignClasses}`}>
              <div className="max-w-4xl space-y-6 pt-20">
                {item.title && <h2 className={`${textSizes.title} font-extrabold leading-tight drop-shadow-2xl`} style={{ color: banner.titleColor }}>{item.title}</h2>}
                {item.description && <p className={`${textSizes.desc} font-medium drop-shadow-lg max-w-3xl leading-relaxed opacity-90`} style={{ color: banner.descColor }}>{item.description}</p>}
                
                <div className={`pt-8 flex flex-wrap gap-4 ${banner.contentAlign === 'center' ? 'justify-center' : banner.contentAlign === 'right' ? 'justify-end' : 'justify-start'}`}>
                  {item.link && (
                    <Link href={item.link} className="inline-flex items-center gap-3 px-8 py-4 rounded-full font-bold text-lg transition-all transform hover:-translate-y-1 shadow-xl hover:shadow-2xl" style={{ backgroundColor: banner.btnColor, color: banner.btnTextColor }}>
                      {item.buttonText || 'Saiba Mais'} <ArrowRight size={24} />
                    </Link>
                  )}
                  {item.secondaryButtonLink && (
                    <Link href={item.secondaryButtonLink} className={`inline-flex items-center gap-3 px-8 py-4 rounded-full font-bold text-lg transition-all transform hover:-translate-y-1 shadow-lg ${item.secondaryButtonTransparent ? 'bg-transparent border-2 backdrop-blur-sm hover:bg-white/10' : 'shadow-xl'}`} style={{ backgroundColor: item.secondaryButtonTransparent ? 'transparent' : banner.secBtnColor, color: item.secondaryButtonTransparent ? banner.secBtnColor : banner.secBtnTextColor, borderColor: banner.secBtnColor }}>
                      {item.secondaryButtonText || 'Ver Mais'}
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
        
        {/* Setas de Navegação (Aparecem só se tiver > 1 slide) */}
        {banner.carouselItems.length > 1 && (
           <>
             <button onClick={prevSlide} className="absolute left-4 top-1/2 -translate-y-1/2 p-4 bg-white/10 hover:bg-white/20 text-white rounded-full z-30 transition-all hover:scale-110"><ChevronLeft size={40} /></button>
             <button onClick={nextSlide} className="absolute right-4 top-1/2 -translate-y-1/2 p-4 bg-white/10 hover:bg-white/20 text-white rounded-full z-30 transition-all hover:scale-110"><ChevronRight size={40} /></button>
             
             {/* Bolinhas indicadoras */}
             <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-30 flex gap-3">
               {banner.carouselItems.map((_, idx) => (
                 <button key={idx} onClick={() => setCurrentSlide(idx)} className={`h-3 rounded-full transition-all duration-500 shadow-sm ${idx === currentSlide ? 'w-12 ring-2 ring-white/50' : 'bg-white/40 w-3 hover:bg-white'}`} style={{ backgroundColor: idx === currentSlide ? banner.btnColor : undefined }} />
               ))}
             </div>
           </>
        )}
      </div>
    );
  }

  // === 3. ALERT ===
  if (banner.layout === 'alert') {
    return (
      <div className={`relative px-4 py-3 text-center text-sm font-bold shadow-md z-50 ${className}`} style={{ backgroundColor: banner.bgColor, color: banner.textColor }}>
        <div className="container mx-auto flex flex-col md:flex-row items-center justify-center gap-2">
          <span>{banner.title}</span>
          {banner.ctaLink && <Link href={banner.ctaLink} className="underline flex items-center gap-1">{banner.ctaText} <ArrowRight size={12} /></Link>}
        </div>
        <button onClick={() => setIsVisible(false)} className="absolute right-2 top-1/2 -translate-y-1/2 p-1 opacity-70 hover:opacity-100"><X size={16} /></button>
      </div>
    );
  }

  // === 4. PADRÃO (HERO FULL / COMPACT) ===
  return (
    <div className={`${className} w-full overflow-hidden`} style={{ backgroundColor: banner.bgColor }}>
      <div className={`container mx-auto px-4 ${banner.layout === 'full' ? 'py-20 md:py-32' : 'py-12'}`}>
        <div className={`flex flex-col md:flex-row items-center gap-12 ${banner.imagePosition === 'right' ? '' : 'md:flex-row-reverse'}`}>
          <div className="flex-1 space-y-6 text-center md:text-left">
            {banner.title && <h2 className="text-3xl md:text-5xl font-extrabold leading-tight" style={{ color: banner.textColor }}>{banner.title}</h2>}
            {banner.description && <p className="text-lg opacity-90 leading-relaxed" style={{ color: banner.textColor }}>{banner.description}</p>}
            {banner.ctaLink && (
              <Link href={banner.ctaLink} className="inline-flex items-center gap-2 px-8 py-4 rounded-lg font-bold shadow-lg hover:brightness-110 transition-all" style={{ backgroundColor: banner.btnColor, color: banner.btnTextColor }}>
                {banner.ctaText} <ArrowRight size={20} />
              </Link>
            )}
          </div>
          {banner.imageUrl && (
            <div className="flex-1 w-full max-w-xl">
              <img src={banner.imageUrl} alt={banner.title} className="w-full h-auto rounded-2xl shadow-2xl transform hover:scale-[1.02] transition-transform duration-500" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}