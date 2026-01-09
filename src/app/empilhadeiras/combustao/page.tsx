'use client';

import { useState, useEffect, useCallback, Suspense } from 'react'; // <--- Suspense adicionado
import {
  Search,
  Flame,
  Package,
  ArrowDownCircle,
  X
} from 'lucide-react';

import DynamicBanner from '@/components/admin/banners/DynamicBanner';
import ItemCard from '@/components/admin/items/ItemCard';
import ModalItem from '@/components/admin/items/ModalItem';
import { Empilhadeira } from '@/types';
import { useSearchParams } from 'next/navigation';

const PAGE_SIZE = 8;

// 1. Renomeie o componente principal (removemos o export default daqui)
function CombustionContent() {
  const [allItems, setAllItems] = useState<Empilhadeira[]>([]);
  const [visibleItems, setVisibleItems] = useState<Empilhadeira[]>([]);
  const [selectedItem, setSelectedItem] = useState<Empilhadeira | null>(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [loading, setLoading] = useState(true);
  
  const searchParams = useSearchParams();
  const buscaNaUrl = searchParams.get('q');
  const idNaUrl = searchParams.get('id');

  // Efeito para abrir Modal via URL
  useEffect(() => {
    // Só tenta abrir modal se tivermos itens carregados
    if (idNaUrl && allItems.length > 0) {
      const itemAlvo = allItems.find(i => String(i.id) === idNaUrl);
      if (itemAlvo) {
        setSelectedItem(itemAlvo);
        // Opcional: Limpar URL visualmente
        // window.history.replaceState(null, '', window.location.pathname);
      }
    }
  }, [idNaUrl, allItems]);

  const fetchAndFilterItems = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/empilhadeiras?limit=1000&offset=0`);
      if (!response.ok) throw new Error('Erro ao buscar dados');

      const data: Empilhadeira[] = await response.json();

      const combustionOnly = data.filter(i =>
        i.engine?.toLowerCase().includes('combustão') ||
        i.engine?.toLowerCase().includes('glp') ||
        i.engine?.toLowerCase().includes('diesel')
      );

      setAllItems(combustionOnly);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAndFilterItems();
  }, [fetchAndFilterItems]);

  // Efeito para preencher busca via URL
  useEffect(() => {
    if (buscaNaUrl) {
      setSearchTerm(buscaNaUrl);
    }
  }, [buscaNaUrl]);

  useEffect(() => {
    let filtered = allItems;
    if (searchTerm) {
      const lowerSearch = searchTerm.toLowerCase();
      filtered = filtered.filter(item =>
        item.name.toLowerCase().includes(lowerSearch) ||
        item.brand?.toLowerCase().includes(lowerSearch) ||
        item.model?.toLowerCase().includes(lowerSearch)
      );
    }
    setVisibleItems(filtered.slice(0, visibleCount));
  }, [allItems, searchTerm, visibleCount]);

  const handleLoadMore = () => {
    setVisibleCount(prev => prev + PAGE_SIZE);
  };

  const handleWhatsAppRedirect = (item: Empilhadeira) => {
    const phone = process.env.NEXT_PUBLIC_WHATSAPP_PHONE!;
    const baseUrl = window.location.origin;
    
    // Link ajustado para categoria combustão com busca
    const link = `${baseUrl}/empilhadeiras/combustao?q=${encodeURIComponent(item.name)}`;
    
    // EMOJIS CORRIGIDOS (UNICODE)
    const mensagem = `Olá! Vi no site da Somos e gostaria de uma *cotação* para este equipamento:

\u{1F69C} *Modelo:* ${item.name}
\u{1F517} *Link:* ${link}

Poderia me passar valores e disponibilidade?`;
    
    window.open(`https://api.whatsapp.com/send?phone=${phone}&text=${encodeURIComponent(mensagem)}`, '_blank');
  };

  const currentFilteredCount = allItems.filter(item => 
    !searchTerm || 
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.brand?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.model?.toLowerCase().includes(searchTerm.toLowerCase())
  ).length;

  const hasMore = visibleItems.length < currentFilteredCount;

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
      <DynamicBanner id="catalogo-topo" />

      <section className="bg-orange-600 py-14">
        <div className="container mx-auto px-4 text-center">
          <div className="inline-flex items-center justify-center p-3 bg-white/10 rounded-full mb-4 text-white">
            <Flame size={32} />
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white">
            Empilhadeiras a Combustão
          </h1>
          <p className="text-orange-100 mt-4 max-w-2xl mx-auto text-lg">
            Potência bruta e robustez. Equipamentos a Gás (GLP) e Diesel para serviços pesados.
          </p>
        </div>
      </section>

      <section className="container mx-auto px-4 -mt-8 z-10 relative">
        <div className="bg-white rounded-2xl shadow-lg p-4 max-w-2xl mx-auto">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Buscar máquina a combustão..."
              className="w-full pl-12 pr-10 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-orange-500 outline-none"
            />
            {searchTerm && (
              <button onClick={() => setSearchTerm('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                <X size={18} />
              </button>
            )}
          </div>
        </div>
      </section>

      <section className="flex-1 container mx-auto px-4 py-16">
        {loading ? (
          <div className="flex flex-col items-center py-32">
            <div className="w-12 h-12 border-4 border-slate-200 border-t-orange-600 rounded-full animate-spin" />
            <span className="mt-4 text-slate-400">Carregando estoque combustão...</span>
          </div>
        ) : visibleItems.length === 0 ? (
          <div className="bg-white rounded-3xl p-16 text-center border border-dashed">
            <Package size={48} className="mx-auto text-slate-300" />
            <h3 className="mt-6 text-xl font-bold">Nenhum equipamento encontrado</h3>
            <p className="text-slate-500 mt-2">Não encontramos máquinas com este termo.</p>
            {searchTerm && (
               <button onClick={() => setSearchTerm('')} className="mt-4 text-orange-600 font-bold hover:underline">
                 Limpar busca
               </button>
            )}
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold flex items-center gap-2 text-slate-800">
                <Flame className="text-orange-600 fill-orange-600" />
                {searchTerm ? `Resultados: "${searchTerm}"` : 'Linha Combustão Completa'}
              </h2>
              <span className="text-slate-500 font-medium bg-slate-100 px-3 py-1 rounded-full text-sm">
                {searchTerm
                  ? `${visibleItems.length} encontrado(s)`
                  : `${allItems.length} máquinas`
                }
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-8">
              {visibleItems.map(item => (
                <ItemCard
                  key={item.id}
                  empilhadeira={item}
                  onOpenModal={setSelectedItem}
                  onWhatsApp={handleWhatsAppRedirect}
                />
              ))}
            </div>

            {hasMore && (
              <div className="flex justify-center mt-16">
                <button
                  onClick={handleLoadMore}
                  className="flex items-center gap-3 px-8 py-3 rounded-full border-2 border-slate-200 font-bold hover:border-orange-600 hover:text-orange-600 transition"
                >
                  Ver mais máquinas
                  <ArrowDownCircle size={20} />
                </button>
              </div>
            )}
          </>
        )}
      </section>

      {selectedItem && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <ModalItem empilhadeira={selectedItem} onClose={() => setSelectedItem(null)} onWhatsApp={handleWhatsAppRedirect} />
        </div>
      )}

      <DynamicBanner id="catalogo-rodape" />
    </main>
  );
}

// 2. Novo componente Wrapper com Suspense
export default function CombustionPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="w-12 h-12 border-4 border-orange-600 border-t-transparent rounded-full animate-spin"></div></div>}>
      <CombustionContent />
    </Suspense>
  );
}