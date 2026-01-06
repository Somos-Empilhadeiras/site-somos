'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  Search,
  Disc, // Ícone que lembra Pneu/Roda
  Layers, // Ícone de camadas/estoque
  ArrowDownCircle,
  X,
  CheckCircle2
} from 'lucide-react';

import DynamicBanner from '@/components/DynamicBanner';
import ItemCard from '@/components/ItemCard';
import ModalItem from '@/components/ModalItem';
import { Empilhadeira } from '@/types';
import { COMPANY_CONTACTS } from '@/lib/constants';

/* ===============================
   CONFIGURAÇÕES DO CATÁLOGO
================================ */
const INITIAL_LIMIT = 4;
const LOAD_MORE_COUNT = 8;
const SEARCH_DEBOUNCE = 500;

export default function TiresCatalog() {
  const [items, setItems] = useState<Empilhadeira[]>([]);
  const [selectedItem, setSelectedItem] = useState<Empilhadeira | null>(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [offset, setOffset] = useState(0);

  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  /* ===============================
      FETCH DE DADOS
   ================================ */
  const fetchTires = useCallback(
    async (
      isLoadMore = false,
      search = searchTerm,
      currentOffset = 0,
      signal?: AbortSignal
    ) => {
      try {
        isLoadMore ? setLoadingMore(true) : setLoading(true);

        const limit = isLoadMore ? LOAD_MORE_COUNT : INITIAL_LIMIT;

        // --- FILTRO: TYPE='TIRE' ---
        const params = new URLSearchParams({
          limit: String(limit),
          offset: String(currentOffset),
          search,
          type: 'TIRE' // Busca apenas Pneus
        });

        const response = await fetch(`/api/products?${params}`, { signal });
        
        if (!response.ok) throw new Error('Erro ao buscar pneus');

        const data: Empilhadeira[] = await response.json();

        if (isLoadMore) {
          setItems(prev => [...prev, ...data]);
          setOffset(prev => prev + limit);
          if (data.length < limit) setHasMore(false);
        } else {
          setItems(data);
          setOffset(limit);
          setHasMore(data.length >= limit);
        }
      } catch (err) {
        if (err instanceof Error && err.name !== 'AbortError') {
          console.error(err.message);
        }
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [searchTerm]
  );

  /* ===============================
      CARGA INICIAL
   ================================ */
  useEffect(() => {
    fetchTires();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ===============================
      BUSCA COM DEBOUNCE
   ================================ */
  useEffect(() => {
    const controller = new AbortController();

    const timeout = setTimeout(() => {
      fetchTires(false, searchTerm, 0, controller.signal);
    }, SEARCH_DEBOUNCE);

    return () => {
      controller.abort();
      clearTimeout(timeout);
    };
  }, [searchTerm, fetchTires]);

  /* ===============================
      HANDLERS
   ================================ */
  const handleLoadMore = () => {
    fetchTires(true, searchTerm, offset);
  };

  const handleWhatsAppRedirect = (item: Empilhadeira) => {
    const phone = COMPANY_CONTACTS.alan_phone_raw;
    const link = `${window.location.origin}/pneus?id=${item.id}`;

    let message = `*SOLICITAÇÃO DE PNEUS*\n\n`;
    message += `🔘 *Modelo/Medida:* ${item.name}\n`;
    message += `🏭 *Marca:* ${item.manufacturer || item.brand}\n`;
    
    if (item.price && item.price > 0) {
       message += `💲 *Preço:* R$ ${item.price.toLocaleString('pt-BR')}\n`;
    }
    
    message += `\nOlá, tenho interesse neste pneu:\n${link}`;

    window.open(
      `https://api.whatsapp.com/send?phone=${phone}&text=${encodeURIComponent(message)}`,
      '_blank',
      'noopener,noreferrer'
    );
  };

  /* ===============================
      RENDER
   ================================ */
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">

      <DynamicBanner id="pneus-topo" />

      {/* HERO SECTION - Tom Cinza Escuro (Asfalto/Borracha) */}
      <section className="bg-slate-700 py-14 border-b-4 border-yellow-500">
        <div className="container mx-auto px-4 text-center">
          <div className="inline-flex items-center justify-center p-3 bg-white/10 rounded-full mb-4">
             <Disc className="text-white" size={32} />
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white">
            Pneus de Alta Performance
          </h1>
          <p className="text-slate-300 mt-4 max-w-2xl mx-auto text-lg">
            Pneus pneumáticos, superelásticos e maciços para todos os tipos de terreno e empilhadeiras.
          </p>
        </div>
      </section>

      {/* BUSCA */}
      <section className="container mx-auto px-4 -mt-8 z-10 relative">
        <div className="bg-white rounded-2xl shadow-xl p-4 max-w-2xl mx-auto border border-slate-100">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              aria-label="Buscar pneus"
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Ex: 6.00-9, Maciço, Pneumático, 7.00-12..."
              className="w-full pl-12 pr-10 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-slate-700 outline-none placeholder:text-slate-400"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-red-500 transition-colors"
              >
                <X size={18} />
              </button>
            )}
          </div>
        </div>
      </section>

      {/* CONTEÚDO */}
      <section className="flex-1 container mx-auto px-4 py-16">

        {loading ? (
          <div className="flex flex-col items-center py-32">
            <div className="w-12 h-12 border-4 border-slate-200 border-t-slate-700 rounded-full animate-spin" />
            <span className="mt-4 text-slate-400 font-medium">Carregando estoque de pneus…</span>
          </div>
        ) : items.length === 0 ? (
          <div className="bg-white rounded-3xl p-16 text-center border-2 border-dashed border-slate-200">
            <Disc size={48} className="mx-auto text-slate-300 mb-4" />
            <h3 className="text-xl font-bold text-slate-700">Nenhum pneu encontrado</h3>
            <p className="text-slate-500 mt-2 max-w-md mx-auto">
              Não encontramos pneus com essa especificação. Tente buscar apenas pela medida (ex: 6.00-9).
            </p>
            <button 
                onClick={() => setSearchTerm('')}
                className="mt-6 text-blue-600 font-bold hover:underline"
            >
                Limpar busca
            </button>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-200">
              <h2 className="text-2xl font-bold flex items-center gap-2 text-slate-800">
                <Layers className="text-[#005831]" />
                {searchTerm ? `Resultados para "${searchTerm}"` : 'Estoque de Pneus'}
              </h2>
              <span className="text-xs font-bold bg-slate-100 text-slate-600 px-3 py-1 rounded-full">
                {items.length} modelos disponíveis
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-8">
              {items.map(item => (
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
                  disabled={loadingMore}
                  className="group flex items-center gap-3 px-8 py-3 rounded-full border-2 border-slate-200 font-bold text-slate-600 hover:border-yellow-400 hover:text-slate-900 transition-all disabled:opacity-60 bg-white hover:shadow-lg"
                >
                  {loadingMore ? 'Buscando...' : 'Carregar mais pneus'}
                  <ArrowDownCircle size={20} className="group-hover:translate-y-1 transition-transform text-yellow-500" />
                </button>
              </div>
            )}
          </>
        )}
      </section>

      {/* MODAL */}
      {selectedItem && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <ModalItem
            empilhadeira={selectedItem}
            onClose={() => setSelectedItem(null)}
            onWhatsApp={handleWhatsAppRedirect}
          />
        </div>
      )}

      <DynamicBanner id="pneus-rodape" />
    </main>
  );
}