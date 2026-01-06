'use client';

import { useEffect, useState, useCallback } from 'react';
import { X, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';

// Definição Completa dos Tipos
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
  layout: 'full' | 'compact' | 'alert' | 'carousel';
  
  // Dados Gerais
  title: string;
  description: string;
  imageUrl: string;
  ctaText: string;
  ctaLink: string;
  
  // Cores Gerais
  bgColor: string;
  textColor: string;
  btnColor: string;
  btnTextColor: string;
  
  imagePosition: 'left' | 'right';
  
  // Carrossel
  carouselItems: CarouselItem[];
  
  // Personalização Avançada (Novos Campos)
  height?: string;
  contentAlign?: 'left' | 'center' | 'right';
  textSize?: 'small' | 'medium' | 'large';
  slideDuration?: number;
  
  // Cores Específicas
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
  const [isVisible, setIsVisible] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);

  // --- 1. BUSCA E FILTRAGEM ---
  useEffect(() => {
    async function fetchBanner() {
      try {
        const res = await fetch('/api/banners'); 
        const data: any[] = await res.json();

        const found = data.find((b: any) => {
           const bannerIds = b.ids || b.slot_ids || []; 
           const isActive = b.is_active !== undefined ? b.is_active : b.isActive;
           return isActive && bannerIds.includes(id);
        });

        if (found) {
             // Mapeia os dados do backend para o frontend, garantindo valores padrão
             setBanner({
                ...found,
                // Garante arrays e objetos
                carouselItems: found.carousel_items || found.carouselItems || [],
                ids: found.ids || [],
                
                // Defaults de Estilo
                height: found.height || 'h-[80vh]', 
                contentAlign: found.contentAlign || 'left',
                textSize: found.textSize || 'medium',
                slideDuration: found.slideDuration || 5,
                
                // Defaults de Cor
                bgColor: found.bg_color || found.bgColor || '#005831',
                textColor: found.text_color || found.textColor || '#ffffff',
                titleColor: found.titleColor || '#ffffff',
                descColor: found.descColor || '#e2e8f0',
                btnColor: found.btn_color || found.btnColor || '#005831',
                btnTextColor: found.btn_text_color || found.btnTextColor || '#ffffff',
                secBtnColor: found.secBtnColor || '#ffffff',
                secBtnTextColor: found.secBtnTextColor || '#000000',
             });
        } else {
            setBanner(null);
        }
      } catch (error) {
        console.error(`Erro banner ${id}:`, error);
      }
    }
    fetchBanner();
  }, [id]);

  // --- 2. LÓGICA DO SLIDESHOW ---
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
    if (banner?.layout === 'carousel' && banner.carouselItems.length > 1) {
        // Usa o tempo configurado ou 5 segundos como fallback
        const intervalTime = (banner.slideDuration || 5) * 1000;
        const timer = setInterval(nextSlide, intervalTime); 
        return () => clearInterval(timer);
    }
  }, [banner, nextSlide]);

  if (!banner || !isVisible) return null;

  // --- HELPER DE ESTILOS ---
  // Define tamanhos de texto baseados na configuração
  const getTextSizes = (size: string = 'medium') => {
      switch(size) {
          case 'small': return { title: 'text-3xl md:text-5xl', desc: 'text-base md:text-lg' };
          case 'large': return { title: 'text-5xl md:text-7xl lg:text-8xl', desc: 'text-xl md:text-3xl' };
          default: return { title: 'text-4xl md:text-6xl lg:text-7xl', desc: 'text-lg md:text-2xl' };
      }
  };

  const textSizes = getTextSizes(banner.textSize);

  // === RENDERIZAÇÃO: CARROSSEL ===
  if (banner.layout === 'carousel' && banner.carouselItems.length > 0) {
      
      const alignClasses = {
          'left': 'items-start text-left',
          'center': 'items-center text-center',
          'right': 'items-end text-right'
      }[banner.contentAlign || 'left'];

      return (
        <div className={`relative w-full overflow-hidden bg-slate-900 group min-h-[60vh] md:min-h-[85vh] ${className}`} style={{ height: banner.height === 'h-screen' ? '100vh' : undefined }}>
             
             {banner.carouselItems.map((item, index) => (
                 <div 
                    key={index}
                    className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out ${
                        index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
                    }`}
                 >
                     {/* Imagem de Fundo */}
                     <div className="absolute inset-0">
                         {item.imageUrl ? (
                            <img 
                                src={item.imageUrl} 
                                className="w-full h-full object-cover object-center" 
                                alt={item.title} 
                            />
                         ) : (
                            <div className="w-full h-full bg-slate-800 flex items-center justify-center text-slate-500">Sem Imagem</div>
                         )}
                         
                         {/* Overlay Gradiente Inteligente */}
                         <div className={`absolute inset-0 bg-gradient-to-r ${
                             banner.contentAlign === 'right' 
                                ? 'from-transparent via-black/40 to-black/90' 
                                : banner.contentAlign === 'center'
                                    ? 'from-black/70 via-transparent to-black/70'
                                    : 'from-black/90 via-black/40 to-transparent'
                         }`}></div>
                     </div>

                     {/* Conteúdo do Slide */}
                     <div className={`relative z-20 container mx-auto px-6 h-full flex flex-col justify-center ${alignClasses}`}>
                         <div className="max-w-4xl space-y-6 animate-in slide-in-from-bottom-10 duration-1000 fade-in fill-mode-forwards pt-20">
                             
                             {/* Título */}
                             {item.title && (
                                 <h2 
                                    className={`${textSizes.title} font-extrabold leading-tight drop-shadow-2xl`}
                                    style={{ color: banner.titleColor }}
                                 >
                                     {item.title}
                                 </h2>
                             )}
                             
                             {/* Descrição */}
                             {item.description && (
                                 <p 
                                    className={`${textSizes.desc} font-medium drop-shadow-lg max-w-3xl leading-relaxed opacity-90`}
                                    style={{ color: banner.descColor }}
                                 >
                                     {item.description}
                                 </p>
                             )}
                             
                             {/* Área de Botões */}
                             <div className={`pt-8 flex flex-wrap gap-4 ${banner.contentAlign === 'center' ? 'justify-center' : banner.contentAlign === 'right' ? 'justify-end' : 'justify-start'}`}>
                                 
                                 {/* Botão Primário */}
                                 {item.link && (
                                     <Link 
                                        href={item.link} 
                                        className="inline-flex items-center gap-3 px-8 py-4 rounded-full font-bold text-lg transition-all transform hover:-translate-y-1 shadow-xl hover:shadow-2xl"
                                        style={{ backgroundColor: banner.btnColor, color: banner.btnTextColor }}
                                     >
                                         {item.buttonText || 'Saiba Mais'} <ArrowRight size={24} />
                                     </Link>
                                 )}

                                 {/* Botão Secundário (Opcional) */}
                                 {item.secondaryButtonLink && (
                                     <Link 
                                        href={item.secondaryButtonLink} 
                                        className={`inline-flex items-center gap-3 px-8 py-4 rounded-full font-bold text-lg transition-all transform hover:-translate-y-1 shadow-lg ${
                                            item.secondaryButtonTransparent 
                                                ? 'bg-transparent border-2 backdrop-blur-sm hover:bg-white/10' 
                                                : 'shadow-xl'
                                        }`}
                                        style={{ 
                                            backgroundColor: item.secondaryButtonTransparent ? 'transparent' : banner.secBtnColor, 
                                            color: item.secondaryButtonTransparent ? banner.secBtnColor : banner.secBtnTextColor,
                                            borderColor: banner.secBtnColor
                                        }}
                                     >
                                         {item.secondaryButtonText || 'Ver Mais'}
                                     </Link>
                                 )}
                             </div>

                         </div>
                     </div>
                 </div>
             ))}

             {/* Controles de Navegação */}
             {banner.carouselItems.length > 1 && (
                 <>
                    <button onClick={prevSlide} className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 p-4 bg-white/10 hover:bg-white/20 text-white rounded-full backdrop-blur-md border border-white/10 transition-all z-30 opacity-0 group-hover:opacity-100 hover:scale-110">
                        <ChevronLeft size={40} />
                    </button>
                    <button onClick={nextSlide} className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 p-4 bg-white/10 hover:bg-white/20 text-white rounded-full backdrop-blur-md border border-white/10 transition-all z-30 opacity-0 group-hover:opacity-100 hover:scale-110">
                        <ChevronRight size={40} />
                    </button>
                    
                    {/* Indicadores */}
                    <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-30 flex gap-3">
                     {banner.carouselItems.map((_, idx) => (
                         <button 
                            key={idx} 
                            onClick={() => setCurrentSlide(idx)}
                            className={`h-3 rounded-full transition-all duration-500 shadow-sm ${
                                idx === currentSlide 
                                    ? 'w-12 ring-2 ring-white/50' 
                                    : 'bg-white/40 w-3 hover:bg-white'
                            }`}
                            style={{ backgroundColor: idx === currentSlide ? banner.btnColor : undefined }}
                         />
                     ))}
                 </div>
                 </>
             )}
        </div>
      );
  }

  // === MANTENDO LAYOUTS ANTIGOS (Fallback) ===
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