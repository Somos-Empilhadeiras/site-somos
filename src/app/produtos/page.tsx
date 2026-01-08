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
    <section id={id} className="py-20 border-b border-slate-200 bg-white">
      <div className="container mx-auto px-4">

        {/* HEADER DA LINHA */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-10 border-l-4 border-[#005831] pl-6">
          <div>
            <div className="flex items-center gap-2 text-[#005831] font-bold text-xs tracking-widest uppercase mb-2">
              <Icon size={14} />
              <span>Linha de Solução</span>
            </div>
            <h2 className="text-3xl font-bold text-slate-900">
              {title}
            </h2>
            <p className="text-slate-500 mt-2 max-w-2xl text-sm">
              {subtitle}
            </p>
          </div>

          <Link 
            href={linkHref}
            className="hidden md:flex items-center gap-2 text-sm font-bold text-slate-700 hover:text-[#005831] transition-colors border-b border-transparent hover:border-[#005831]"
          >
            VER CATÁLOGO COMPLETO
            <ArrowRight size={16} />
          </Link>
        </div>

        {/* GRID */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1,2,3,4].map(i => (
              <div key={i} className="h-[360px] bg-slate-100 animate-pulse" />
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
                    `https://wa.me/5562991834188?text=Interesse:${i.name}`,
                    '_blank'
                  )
                }
              />
            ))}
          </div>
        )}

        {/* LINK MOBILE */}
        <div className="mt-8 md:hidden text-center">
          <Link href={linkHref} className="inline-flex items-center gap-2 text-sm font-bold text-[#005831]">
            VER CATÁLOGO COMPLETO
            <ArrowRight size={16} />
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

    const offset = el.getBoundingClientRect().top + window.scrollY - 120;
    window.scrollTo({ top: offset, behavior: 'smooth' });
  };

  return (
    <main className="min-h-screen bg-slate-50">

      <DynamicBanner id="produtos-hero" />

      {/* ================================================= */}
      {/* HEADER INSTITUCIONAL */}
      {/* ================================================= */}
      <div className="bg-[#bb0303] pt-20 pb-28 text-white border-b-4 border-[#005831]">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-4xl font-bold uppercase mb-4">
            Soluções para Operação e Manutenção Industrial
          </h1>
          <p className="text-gray-200 text-lg max-w-3xl mx-auto font-light">
            Peças, serviços técnicos e pneus industriais para garantir
            disponibilidade, segurança e desempenho contínuo da sua frota.
          </p>
        </div>
      </div>

      {/* ================================================= */}
      {/* BLOCO DE VALOR (INSTITUCIONAL CURTO) */}
      {/* ================================================= */}
      <div className="container mx-auto px-4 py-14">
        <div className="grid md:grid-cols-3 gap-10 text-center">
          
          <div>
            <Layers size={36} className="mx-auto text-[#005831] mb-4" />
            <h3 className="font-bold uppercase text-sm text-slate-900">
              Portfólio Completo
            </h3>
            <p className="text-slate-500 text-sm mt-2">
              Soluções integradas para manutenção, reposição e operação industrial.
            </p>
          </div>

          <div>
            <Wrench size={36} className="mx-auto text-[#005831] mb-4" />
            <h3 className="font-bold uppercase text-sm text-slate-900">
              Especialização Técnica
            </h3>
            <p className="text-slate-500 text-sm mt-2">
              Atendimento técnico preparado para ambientes de alta exigência.
            </p>
          </div>

          <div>
            <Package size={36} className="mx-auto text-[#005831] mb-4" />
            <h3 className="font-bold uppercase text-sm text-slate-900">
              Agilidade Operacional
            </h3>
            <p className="text-slate-500 text-sm mt-2">
              Redução de paradas e resposta rápida às demandas do cliente.
            </p>
          </div>

        </div>
      </div>

      {/* ================================================= */}
      {/* MENU DE NAVEGAÇÃO POR SOLUÇÃO */}
      {/* ================================================= */}
      <div className="container mx-auto px-4 -mt-6 relative z-20 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 bg-white shadow-lg border border-slate-200 divide-y md:divide-y-0 md:divide-x">

          <button onClick={() => scrollToSection('section-pecas')} className="group p-8 text-left hover:bg-slate-50 transition-colors">
            <Package className="text-slate-400 group-hover:text-[#005831] mb-4" size={32} />
            <h3 className="font-bold uppercase text-slate-900">Peças</h3>
            <p className="text-sm text-slate-500 mt-2">Reposição mecânica e hidráulica.</p>
            <ChevronRight className="mt-4 text-slate-300 group-hover:text-[#005831]" />
          </button>

          <button onClick={() => scrollToSection('section-servicos')} className="group p-8 text-left hover:bg-slate-50 transition-colors">
            <Wrench className="text-slate-400 group-hover:text-[#005831] mb-4" size={32} />
            <h3 className="font-bold uppercase text-slate-900">Serviços</h3>
            <p className="text-sm text-slate-500 mt-2">Manutenção e diagnósticos técnicos.</p>
            <ChevronRight className="mt-4 text-slate-300 group-hover:text-[#005831]" />
          </button>

          <button onClick={() => scrollToSection('section-pneus')} className="group p-8 text-left hover:bg-slate-50 transition-colors">
            <Disc className="text-slate-400 group-hover:text-[#005831] mb-4" size={32} />
            <h3 className="font-bold uppercase text-slate-900">Pneus</h3>
            <p className="text-sm text-slate-500 mt-2">Pneumáticos e superelásticos.</p>
            <ChevronRight className="mt-4 text-slate-300 group-hover:text-[#005831]" />
          </button>

        </div>
      </div>

      {/* ================================================= */}
      {/* CATÁLOGO */}
      {/* ================================================= */}
      <div className="bg-white">
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
