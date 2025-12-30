'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight, Megaphone, X, ChevronLeft, ChevronRight, ImageOff } from 'lucide-react';

interface DynamicBannerProps {
  id: string;
  className?: string;
}

interface CarouselItem {
    title: string;
    description: string;
    imageUrl: string;
    link: string;
}

interface BannerData {
  isActive: boolean;
  layout: 'full' | 'compact' | 'alert' | 'carousel';
  title: string;
  description: string;
  imageUrl: string;
  ctaText: string;
  ctaLink: string;
  carouselItems?: CarouselItem[];
  bgColor?: string;
  textColor?: string;
  btnColor?: string;
  btnTextColor?: string;
  imagePosition?: 'left' | 'right';
}

export default function DynamicBanner({ id, className = '' }: DynamicBannerProps) {
  const [banner, setBanner] = useState<BannerData | null>(null);
  const [isVisible, setIsVisible] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    async function fetchBanner() {
      try {
        const res = await fetch(`/api/banners?id=${id}`);
        if (res.ok) {
          const data = await res.json();
          // LOG DE DEBUG: Abra o console (F12) para ver se 'carouselItems' está vindo aqui
          if(data.layout === 'carousel') {
             console.log(`[DEBUG Banner ${id}] Items:`, data.carouselItems); 
          }
          
          if (data && data.isActive) {
            console.log("BANNER CARREGADO:", data); // Veja se carouselItems tem algo dentro
            setBanner(data);
          }
        }
      } catch (error) {
        console.error(`Erro ao carregar banner ${id}:`, error);
      }
    }
    fetchBanner();
  }, [id]);

  // Auto-Play Carrossel
  useEffect(() => {
    if (banner?.layout === 'carousel' && banner.carouselItems && banner.carouselItems.length > 1) {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % banner.carouselItems!.length);
        }, 5000);
        return () => clearInterval(timer);
    }
  }, [banner]);

  if (!banner || !isVisible) return null;

  const bg = banner.bgColor || '#005831';
  const txt = banner.textColor || '#FFFFFF';
  const btnBg = banner.btnColor || '#EAB308';
  const btnTxt = banner.btnTextColor || '#005831';

  // =================================================================================
  //                              LAYOUT: CARROSSEL
  // =================================================================================
  if (banner.layout === 'carousel') {
      const items = banner.carouselItems || [];

      // PROTEÇÃO: Se não tiver itens, mostra aviso (apenas para você saber, em prod pode retornar null)
      if (items.length === 0) {
          return (
            <div className={`w-full h-64 bg-slate-100 flex flex-col items-center justify-center text-slate-400 border-2 border-dashed ${className}`}>
                <ImageOff size={48} className="mb-2"/>
                <p className="font-bold">Carrossel Ativo mas sem Slides</p>
                <p className="text-xs">Adicione slides no Painel Admin</p>
            </div>
          );
      }

      const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % items.length);
      const prevSlide = () => setCurrentSlide((prev) => (prev === 0 ? items.length - 1 : prev - 1));

      return (
        <section className={`relative w-full overflow-hidden h-[500px] md:h-[650px] group ${className}`}>
            {items.map((item, index) => (
                <div 
                    key={index} 
                    className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
                    style={{ backgroundColor: bg }} // Usa a cor de fundo do banner como base
                >
                    {/* Imagem de Fundo */}
                    <div className="absolute inset-0">
                        {item.imageUrl ? (
                            <img 
                                src={item.imageUrl} 
                                alt={item.title} 
                                className="w-full h-full object-cover opacity-60" // Ajuste opacidade conforme gosto
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center bg-slate-800 text-white opacity-20">Sem Imagem</div>
                        )}
                        {/* Gradiente */}
                        <div className="absolute inset-0 bg-linear-to-r from-black/90 via-black/50 to-transparent"></div>
                    </div>

                    {/* Conteúdo */}
                    <div className="relative z-20 container mx-auto px-4 h-full flex flex-col justify-center">
                        <div className="max-w-3xl animate-in slide-in-from-left-10 duration-700 fade-in">
                            <h2 
                                className="text-4xl md:text-6xl font-black mb-4 leading-tight drop-shadow-lg"
                                style={{ color: txt }}
                            >
                                {item.title}
                            </h2>
                            <p 
                                className="text-lg md:text-xl mb-8 max-w-xl font-medium drop-shadow-md opacity-90"
                                style={{ color: txt }}
                            >
                                {item.description}
                            </p>
                            {item.link && (
                                <Link 
                                    href={item.link} 
                                    className="inline-flex items-center gap-2 px-8 py-4 rounded-full font-bold hover:scale-105 transition-all shadow-lg"
                                    style={{ backgroundColor: btnBg, color: btnTxt }}
                                >
                                    Saiba Mais <ArrowRight size={20} />
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            ))}
            
            {/* Setas de Navegação */}
            {items.length > 1 && (
                <>
                    <button onClick={prevSlide} className="absolute left-4 top-1/2 -translate-y-1/2 z-30 p-3 bg-white/10 hover:bg-white/20 text-white rounded-full backdrop-blur-md border border-white/10 transition-all hidden md:block">
                        <ChevronLeft size={32} />
                    </button>
                    <button onClick={nextSlide} className="absolute right-4 top-1/2 -translate-y-1/2 z-30 p-3 bg-white/10 hover:bg-white/20 text-white rounded-full backdrop-blur-md border border-white/10 transition-all hidden md:block">
                        <ChevronRight size={32} />
                    </button>
                    
                    {/* Bolinhas */}
                    <div className="absolute bottom-8 left-0 right-0 z-30 flex justify-center gap-3">
                        {items.map((_, idx) => (
                            <button 
                                key={idx} 
                                onClick={() => setCurrentSlide(idx)} 
                                className={`h-2 rounded-full transition-all duration-300 ${idx === currentSlide ? 'w-12' : 'w-2 bg-white/50 hover:bg-white'}`} 
                                style={{ backgroundColor: idx === currentSlide ? btnBg : undefined }}
                            />
                        ))}
                    </div>
                </>
            )}
        </section>
      );
  }

  // --- LAYOUT ALERTA ---
  if (banner.layout === 'alert') {
    return (
      <div 
        className={`px-4 py-3 relative shadow-md z-100 ${className}`}
        style={{ backgroundColor: bg, color: txt }}
      >
        <div className="container mx-auto flex flex-col sm:flex-row items-center justify-center gap-4 text-center sm:text-left pr-8">
          <div className="flex items-center gap-2 font-bold">
            <Megaphone size={18} className="animate-pulse" />
            <span>{banner.title}</span>
          </div>
          {banner.description && <span className="hidden sm:inline opacity-60">|</span>}
          {banner.description && <p className="text-sm font-medium">{banner.description}</p>}
          {banner.ctaLink && (
            <Link href={banner.ctaLink} className="underline font-bold text-sm whitespace-nowrap hover:opacity-80" style={{ color: txt }}>
              {banner.ctaText || 'Confira'}
            </Link>
          )}
        </div>
        <button onClick={() => setIsVisible(false)} className="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:opacity-50 rounded-full transition-colors">
          <X size={18} />
        </button>
      </div>
    );
  }

  // --- LAYOUT COMPACTO ---
  if (banner.layout === 'compact') {
    const isRight = banner.imagePosition === 'right';
    return (
      <div className={`container mx-auto px-4 py-8 ${className}`}>
        <div 
            className={`rounded-2xl shadow-xl border border-slate-200 overflow-hidden flex flex-col md:flex-row group hover:shadow-2xl transition-all duration-300`}
            style={{ backgroundColor: bg, color: txt }}
        >
            <div className={`md:w-1/3 h-56 md:h-auto relative overflow-hidden ${isRight ? 'md:order-2' : 'md:order-1'}`}>
                <img 
                    src={banner.imageUrl || "https://via.placeholder.com/400x300"} 
                    alt={banner.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                />
            </div>
            <div className={`md:w-2/3 p-6 md:p-10 flex flex-col justify-center ${isRight ? 'md:order-1' : 'md:order-2'}`}>
                <h3 className="text-2xl font-bold mb-3" style={{ color: txt }}>{banner.title}</h3>
                <p className="mb-6 text-lg opacity-90" style={{ color: txt }}>{banner.description}</p>
                <div>
                    <Link 
                        href={banner.ctaLink || '#'} 
                        className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-bold transition shadow-lg hover:-translate-y-1"
                        style={{ backgroundColor: btnBg, color: btnTxt }}
                    >
                        {banner.ctaText || 'Saiba Mais'} <ArrowRight size={18} />
                    </Link>
                </div>
            </div>
        </div>
      </div>
    );
  }

  // --- LAYOUT HERO FULL (Fallback) ---
  // Só aparece se layout for 'full' OU se for algum tipo desconhecido
  return (
    <section 
        className={`relative w-full overflow-hidden border-b-4 ${className}`}
        style={{ backgroundColor: bg, borderColor: btnBg }}
    >
        {banner.imageUrl ? (
            <div className="absolute inset-0">
                <img src={banner.imageUrl} alt={banner.title} className="w-full h-full object-cover opacity-40" />
                <div 
                    className="absolute inset-0"
                    style={{ background: `linear-gradient(90deg, ${bg} 0%, ${bg}E6 50%, ${bg}99 100%)` }}
                ></div>
            </div>
        ) : (
            <div className="absolute inset-0" style={{ backgroundColor: bg }}></div>
        )}

        <div className="container mx-auto px-4 py-16 relative z-10">
            <div className={`max-w-4xl ${banner.imagePosition === 'right' ? 'ml-auto text-right' : 'text-left'}`}>
                <span 
                    className="inline-block px-3 py-1 mb-4 text-xs font-bold tracking-wider rounded-full animate-pulse"
                    style={{ backgroundColor: btnBg, color: btnTxt }}
                >
                DESTAQUE
                </span>
                <h2 
                    className="text-3xl md:text-5xl font-black uppercase italic tracking-tight mb-4 leading-tight"
                    style={{ color: txt }}
                >
                {banner.title}
                </h2>
                <p 
                    className="text-lg md:text-xl font-medium mb-8 max-w-2xl leading-relaxed opacity-90"
                    style={{ color: txt, marginLeft: banner.imagePosition === 'right' ? 'auto' : '0' }}
                >
                {banner.description}
                </p>
                <Link 
                href={banner.ctaLink || '#'}
                className="inline-flex items-center gap-2 px-8 py-4 text-lg font-bold transition-transform rounded-full shadow-lg hover:scale-105 active:scale-95"
                style={{ backgroundColor: btnBg, color: btnTxt }}
                >
                {banner.ctaText || 'Acessar'}
                <ArrowRight size={20} />
                </Link>
            </div>
        </div>
    </section>
  );
}