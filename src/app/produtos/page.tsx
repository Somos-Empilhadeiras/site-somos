'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  ArrowRight, 
  Package, 
  Wrench, 
  Disc, 
  ChevronRight,
  Layers
} from 'lucide-react';

import ItemCard from '@/components/admin/items/ItemCard'; 
import DynamicBanner from '@/components/admin/banners/DynamicBanner';
import { Empilhadeira } from '@/types'; 

// ======================================================
// 1. COMPONENTE DE LINHA DE SOLUÇÃO (CATÁLOGO)
//    Mantido a lógica de fetch individual por tipo
// ======================================================
interface CategoryRowProps {
  id: string;
  title: string;
  subtitle: string;
  type: 'PART' | 'SERVICE' | 'TIRE';
  linkHref: string;
  icon: any;
}

const CategoryRow = ({ id, title, subtitle, type, linkHref, icon: Icon }: CategoryRowProps) => {
  const [items, setItems] = useState<Empilhadeira[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchItems() {
      try {
        const res = await fetch(`/api/products?type=${type}&limit=4`);
        const data = await res.json();
        if (Array.isArray(data)) setItems(data);
      } catch (error) {
        console.error(`Erro ao buscar ${type}`, error);
      } finally {
        setLoading(false);
      }
    }
    fetchItems();
  }, [type]);

  if (!loading && items.length === 0) return null;

  return (
    <section id={id} className="py-16 border-b border-slate-200 bg-white">
      <div className="container mx-auto px-4">

        {/* HEADER DA LINHA (Compacto) */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-8 border-l-4 border-[#005831] pl-6">
          <div>
            <div className="flex items-center gap-2 text-[#005831] font-bold text-xs tracking-widest uppercase mb-1">
              <Icon size={14} />
              <span>Linha de Solução</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900">
              {title}
            </h2>
            <p className="text-slate-500 mt-1 max-w-2xl text-sm">
              {subtitle}
            </p>
          </div>

          <Link 
            href={linkHref}
            className="hidden md:flex items-center gap-2 text-sm font-bold text-slate-700 hover:text-[#005831] transition-colors border-b border-transparent hover:border-[#005831]"
          >
            VER CATÁLOGO <ArrowRight size={16} />
          </Link>
        </div>

        {/* GRID */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1,2,3,4].map(i => (
              <div key={i} className="h-[360px] bg-slate-100 animate-pulse rounded-xl" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {items.map(item => (
              <ItemCard 
                key={item.id}
                empilhadeira={item}
                onOpenModal={() => {}}
                onWhatsApp={(i) =>
                  window.open(
                    `https://wa.me/5562991834188?text=Olá, tenho interesse em: ${i.name}`,
                    '_blank'
                  )
                }
              />
            ))}
          </div>
        )}

        {/* LINK MOBILE */}
        <div className="mt-6 md:hidden text-center">
          <Link href={linkHref} className="inline-flex items-center gap-2 text-sm font-bold text-[#005831]">
            VER CATÁLOGO <ArrowRight size={16} />
          </Link>
        </div>

      </div>
    </section>
  );
};

// ======================================================
// 2. PÁGINA PRINCIPAL
// ======================================================
export default function ProductsPage() {

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    const offset = el.getBoundingClientRect().top + window.scrollY - 80;
    window.scrollTo({ top: offset, behavior: 'smooth' });
  };

  return (
    <main className="min-h-screen bg-slate-50">

      <DynamicBanner id="produtos-hero" />

      {/* ================================================= */}
      {/* 1. HERO COMPACTO (Estilo Máquinas, mas cor Vermelha) */}
      {/* ================================================= */}
      <div className="bg-[#bb0303] py-8 text-white relative border-b-4 border-[#005831]">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-6">
            
            {/* Texto Hero */}
            <div className="text-center md:text-left">
                <h1 className="text-2xl md:text-3xl font-bold uppercase tracking-tight flex items-center gap-2 justify-center md:justify-start">
                    Soluções Industriais <span className="hidden md:inline text-red-300">|</span> <span className="text-red-100 text-lg font-normal normal-case">Peças, Serviços e Pneus</span>
                </h1>
            </div>

            {/* Texto de Apoio (Ocupa o lugar da busca que tem na outra página) */}
            <div className="hidden md:block text-right">
                <p className="text-sm text-red-100 font-medium max-w-md">
                   Garanta a disponibilidade e o desempenho contínuo da sua frota com nossa linha especializada.
                </p>
            </div>
        </div>
      </div>

      {/* ================================================= */}
      {/* 2. BARRA DE DESTAQUES (Minimalista) */}
      {/* ================================================= */}
      <div className="bg-white border-b border-slate-200">
          <div className="container mx-auto px-4 py-4">
              <div className="grid grid-cols-3 gap-2 md:gap-8 divide-x divide-slate-100">
                  <div className="flex flex-col md:flex-row items-center justify-center gap-2 md:gap-3 text-center md:text-left">
                      <Layers size={20} className="text-[#005831]" />
                      <span className="text-xs md:text-sm font-bold text-slate-700 uppercase">Portfólio Completo</span>
                  </div>
                  <div className="flex flex-col md:flex-row items-center justify-center gap-2 md:gap-3 text-center md:text-left">
                      <Wrench size={20} className="text-[#005831]" />
                      <span className="text-xs md:text-sm font-bold text-slate-700 uppercase">Especialização Técnica</span>
                  </div>
                  <div className="flex flex-col md:flex-row items-center justify-center gap-2 md:gap-3 text-center md:text-left">
                      <Package size={20} className="text-[#005831]" />
                      <span className="text-xs md:text-sm font-bold text-slate-700 uppercase">Agilidade Operacional</span>
                  </div>
              </div>
          </div>
      </div>

      {/* ================================================= */}
      {/* 3. MENU DE NAVEGAÇÃO COMPACTO */}
      {/* ================================================= */}
      <div className="container mx-auto px-4 mt-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

          <button 
             onClick={() => scrollToSection('section-pecas')} 
             className="group bg-white border border-slate-200 hover:border-[#005831] hover:shadow-md p-4 rounded-xl transition-all flex items-center gap-4 text-left"
          >
             <div className="bg-slate-100 text-slate-600 p-3 rounded-lg group-hover:bg-[#005831] group-hover:text-white transition-colors">
                <Package size={24} />
             </div>
             <div>
                <h3 className="font-bold text-slate-800 text-sm uppercase">Peças</h3>
                <p className="text-xs text-slate-500 mt-0.5">Reposição Mecânica</p>
             </div>
             <ChevronRight className="ml-auto text-slate-300 group-hover:text-[#005831]" size={18}/>
          </button>

          <button 
             onClick={() => scrollToSection('section-servicos')} 
             className="group bg-white border border-slate-200 hover:border-[#005831] hover:shadow-md p-4 rounded-xl transition-all flex items-center gap-4 text-left"
          >
             <div className="bg-slate-100 text-slate-600 p-3 rounded-lg group-hover:bg-[#005831] group-hover:text-white transition-colors">
                <Wrench size={24} />
             </div>
             <div>
                <h3 className="font-bold text-slate-800 text-sm uppercase">Serviços</h3>
                <p className="text-xs text-slate-500 mt-0.5">Manutenção Técnica</p>
             </div>
             <ChevronRight className="ml-auto text-slate-300 group-hover:text-[#005831]" size={18}/>
          </button>

          <button 
             onClick={() => scrollToSection('section-pneus')} 
             className="group bg-white border border-slate-200 hover:border-[#005831] hover:shadow-md p-4 rounded-xl transition-all flex items-center gap-4 text-left"
          >
             <div className="bg-slate-100 text-slate-600 p-3 rounded-lg group-hover:bg-[#005831] group-hover:text-white transition-colors">
                <Disc size={24} />
             </div>
             <div>
                <h3 className="font-bold text-slate-800 text-sm uppercase">Pneus</h3>
                <p className="text-xs text-slate-500 mt-0.5">Pneumáticos e Sólidos</p>
             </div>
             <ChevronRight className="ml-auto text-slate-300 group-hover:text-[#005831]" size={18}/>
          </button>

        </div>
      </div>

      {/* ================================================= */}
      {/* 4. CATÁLOGO */}
      {/* ================================================= */}
      <div className="bg-slate-50">
        <CategoryRow 
          id="section-pecas"
          title="PEÇAS DE REPOSIÇÃO"
          subtitle="Componentes homologados para máxima confiabilidade operacional."
          type="PART"
          linkHref="/produtos/pecas"
          icon={Package}
        />

        <CategoryRow 
          id="section-servicos"
          title="SERVIÇOS TÉCNICOS"
          subtitle="Manutenção especializada e suporte técnico em campo."
          type="SERVICE"
          linkHref="/produtos/servicos"
          icon={Wrench}
        />

        <CategoryRow 
          id="section-pneus"
          title="PNEUS INDUSTRIAIS"
          subtitle="Durabilidade e desempenho para ambientes internos e externos."
          type="TIRE"
          linkHref="/produtos/pneus"
          icon={Disc}
        />
      </div>

      <DynamicBanner id="produtos-rodape" />
    </main>
  );
}