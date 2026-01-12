'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
  Search,
  ArrowRight,
  Zap,
  Flame,
  ChevronRight,
  ShieldCheck,
  Clock,
  Award,
  X
} from 'lucide-react';

import DynamicBanner from '@/components/admin/banners/DynamicBanner';
import ItemCard from '@/components/admin/items/ItemCard';
import ModalItem from '@/components/admin/items/ModalItem';
import { Empilhadeira } from '@/types';

interface ForkliftSectionProps {
  id: string;
  title: string;
  subtitle: string;
  items: Empilhadeira[];
  linkHref: string;
  icon: any;
  onOpenModal: (item: Empilhadeira) => void;
  onWhatsApp: (item: Empilhadeira) => void;
}

const ForkliftSection = ({ id, title, subtitle, items, linkHref, icon: Icon, onOpenModal, onWhatsApp }: ForkliftSectionProps) => {
  if (items.length === 0) return null;

  return (
    <section id={id} className="py-16 border-b border-slate-200 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-end mb-8 border-l-4 border-[#005831] pl-6">
          <div>
            <div className="flex items-center gap-2 text-[#005831] font-bold text-xs tracking-widest uppercase mb-1">
              <Icon size={14} />
              <span>Categoria</span>
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
            VER TODAS <ArrowRight size={16} />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {items.slice(0, 4).map(item => (
            <ItemCard
              key={item.id}
              empilhadeira={item}
              onOpenModal={onOpenModal}
              onWhatsApp={onWhatsApp}
            />
          ))}
        </div>

        <div className="mt-6 md:hidden text-center">
          <Link href={linkHref} className="inline-flex items-center gap-2 text-sm font-bold text-[#005831]">
            VER TODAS <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
};

/* ======================================================
   PÁGINA PRINCIPAL
====================================================== */
export default function Catalog() {
  const [items, setItems] = useState<Empilhadeira[]>([]);
  const [selectedItem, setSelectedItem] = useState<Empilhadeira | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchEmpilhadeiras = useCallback(async (search = searchTerm, signal?: AbortSignal) => {
      try {
        setLoading(true);
        const params = new URLSearchParams({ limit: '100', offset: '0', search });
        const response = await fetch(`/api/empilhadeiras?${params}`, { signal });
        if (!response.ok) throw new Error('Erro ao buscar dados');
        const data = await response.json();
        setItems(data);
      } catch (err) { console.error(err); } finally { setLoading(false); }
    }, [searchTerm]
  );

  useEffect(() => { fetchEmpilhadeiras(); }, []); // eslint-disable-line

  useEffect(() => {
    const controller = new AbortController();
    const timeout = setTimeout(() => { fetchEmpilhadeiras(searchTerm, controller.signal); }, 500);
    return () => { controller.abort(); clearTimeout(timeout); };
  }, [searchTerm, fetchEmpilhadeiras]);

  // FILTROS
  const electricItems = items.filter(i => i.engine?.toLowerCase().includes('elétric') || i.engine?.toLowerCase().includes('lítio') || (i.voltage && i.voltage > 0));
  const combustionItems = items.filter(i => i.engine?.toLowerCase().includes('combustão') || i.engine?.toLowerCase().includes('glp') || i.engine?.toLowerCase().includes('diesel'));

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    const offset = el.getBoundingClientRect().top + window.scrollY - 80;
    window.scrollTo({ top: offset, behavior: 'smooth' });
  };

  const handleWhatsAppRedirect = (item: Empilhadeira) => {
    const phone = process.env.NEXT_PUBLIC_WHATSAPP_PHONE!;
    const link = `${window.location.origin}/catalogo?id=${item.id}`;
    const message = `*SOLICITAÇÃO DE ORÇAMENTO*\n\n🚜 *Modelo:* ${item.brand} ${item.model}\n\n${link}`;
    window.open(`https://api.whatsapp.com/send?phone=${phone}&text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <main className="min-h-screen bg-slate-50">
      <DynamicBanner id="catalogo-topo" />

      {/* ================================================= */}
      {/* 1. HERO COMPACTO */}
      {/* ================================================= */}
      <div className="bg-[#005831] py-8 text-white relative">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-6">
            
            {/* Texto Hero */}
            <div className="text-center md:text-left">
                <h1 className="text-2xl md:text-3xl font-bold uppercase tracking-tight flex items-center gap-2 justify-center md:justify-start">
                    Frota Premium <span className="hidden md:inline text-green-300">|</span> <span className="text-green-200 text-lg font-normal normal-case">Venda e Locação</span>
                </h1>
            </div>

            {/* Busca Compacta */}
            <div className="w-full md:w-auto min-w-[300px]">
                <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-full flex items-center px-3 py-1.5 focus-within:bg-white/20 transition-all">
                    <Search className="text-white/70" size={18} />
                    <input 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Buscar máquina..."
                        className="bg-transparent border-none outline-none text-white placeholder-green-100/60 w-full px-3 text-sm"
                    />
                    {searchTerm && <button onClick={() => setSearchTerm('')} className="text-white/70 hover:text-white"><X size={14}/></button>}
                </div>
            </div>
        </div>
      </div>

      {searchTerm ? (
         <div className="container mx-auto px-4 py-10 min-h-[500px]">
             <h2 className="text-lg font-bold mb-6 text-slate-700 flex items-center gap-2">
                <Search size={18}/> Resultados: {items.length} itens
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {items.map(item => (
                    <ItemCard key={item.id} empilhadeira={item} onOpenModal={setSelectedItem} onWhatsApp={handleWhatsAppRedirect}/>
                ))}
            </div>
         </div>
      ) : (
        <>
            {/* ================================================= */}
            {/* 2. BARRA DE DESTAQUES (Minimalista) */}
            {/* ================================================= */}
            <div className="bg-white border-b border-slate-200">
                <div className="container mx-auto px-4 py-4">
                    <div className="grid grid-cols-3 gap-2 md:gap-8 divide-x divide-slate-100">
                        <div className="flex flex-col md:flex-row items-center justify-center gap-2 md:gap-3 text-center md:text-left">
                            <Award size={20} className="text-[#005831]" />
                            <span className="text-xs md:text-sm font-bold text-slate-700 uppercase">Procedência Garantida</span>
                        </div>
                        <div className="flex flex-col md:flex-row items-center justify-center gap-2 md:gap-3 text-center md:text-left">
                            <ShieldCheck size={20} className="text-[#005831]" />
                            <span className="text-xs md:text-sm font-bold text-slate-700 uppercase">Revisão Completa</span>
                        </div>
                        <div className="flex flex-col md:flex-row items-center justify-center gap-2 md:gap-3 text-center md:text-left">
                            <Clock size={20} className="text-[#005831]" />
                            <span className="text-xs md:text-sm font-bold text-slate-700 uppercase">Entrega Rápida</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* ================================================= */}
            {/* 3. MENU DE NAVEGAÇÃO COMPACTO */}
            {/* ================================================= */}
            <div className="container mx-auto px-4 mt-6 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                    <button 
                        onClick={() => scrollToSection('sessao-eletrica')} 
                        className="group bg-white border border-slate-200 hover:border-blue-300 hover:shadow-md p-4 rounded-xl transition-all flex items-center gap-4 text-left"
                    >
                        <div className="bg-blue-50 text-[#67DB1A] p-3 rounded-lg group-hover:bg-[#67DB1A] group-hover:text-white transition-colors">
                            <Zap size={24} />
                        </div>
                        <div>
                            <h3 className="font-bold text-slate-800 text-sm uppercase">Linha Elétrica</h3>
                            <p className="text-xs text-slate-500 mt-0.5">Tecnologia Lítio e Chumbo-Ácido</p>
                        </div>
                        <ChevronRight className="ml-auto text-slate-300 group-hover:text-blue-600" size={18}/>
                    </button>

                    <button 
                        onClick={() => scrollToSection('sessao-combustao')} 
                        className="group bg-white border border-slate-200 hover:border-orange-300 hover:shadow-md p-4 rounded-xl transition-all flex items-center gap-4 text-left"
                    >
                        <div className="bg-orange-50 text-[#FFAD16] p-3 rounded-lg group-hover:bg-[#FFAD16] group-hover:text-white transition-colors">
                            <Flame size={24} />
                        </div>
                        <div>
                            <h3 className="font-bold text-slate-800 text-sm uppercase">Linha Combustão</h3>
                            <p className="text-xs text-slate-500 mt-0.5">Potência GLP e Diesel</p>
                        </div>
                        <ChevronRight className="ml-auto text-slate-300 group-hover:text-orange-600" size={18}/>
                    </button>

                </div>
            </div>

            {/* ================================================= */}
            {/* 4. CATÁLOGO (Mantido igual) */}
            {/* ================================================= */}
            <div className="bg-slate-50">
                <ForkliftSection 
                    id="sessao-eletrica"
                    title="ELÉTRICAS"
                    subtitle="Eficiência e tecnologia para operações internas."
                    items={electricItems}
                    linkHref="/empilhadeiras/eletricas"
                    icon={Zap}
                    onOpenModal={setSelectedItem}
                    onWhatsApp={handleWhatsAppRedirect}
                />

                <ForkliftSection 
                    id="sessao-combustao"
                    title="COMBUSTÃO"
                    subtitle="Força bruta para operações externas."
                    items={combustionItems}
                    linkHref="/empilhadeiras/combustao"
                    icon={Flame}
                    onOpenModal={setSelectedItem}
                    onWhatsApp={handleWhatsAppRedirect}
                />
            </div>
        </>
      )}

      {selectedItem && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <ModalItem empilhadeira={selectedItem} onClose={() => setSelectedItem(null)} onWhatsApp={handleWhatsAppRedirect} />
        </div>
      )}

      <DynamicBanner id="catalogo-rodape" />
    </main>
  );
}