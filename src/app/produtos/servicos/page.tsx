'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  Search,
  ClipboardList, // Ícone de Prancheta/Serviço
  Wrench, // Ícone de Ferramenta
  ArrowDownCircle,
  X,
  CheckCircle2
} from 'lucide-react';

import DynamicBanner from '@/components/admin/banners/DynamicBanner';
import ItemCard from '@/components/admin/items/ItemCard';
import ModalItem from '@/components/admin/items/ModalItem';
import { Empilhadeira } from '@/types';

/* ===============================
   CONFIGURAÇÕES DO CATÁLOGO
================================ */
const INITIAL_LIMIT = 4;
const LOAD_MORE_COUNT = 8;
const SEARCH_DEBOUNCE = 500;

export default function ServicesCatalog() {
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
  const fetchServices = useCallback(
    async (
      isLoadMore = false,
      search = searchTerm,
      currentOffset = 0,
      signal?: AbortSignal
    ) => {
      try {
        isLoadMore ? setLoadingMore(true) : setLoading(true);

        const limit = isLoadMore ? LOAD_MORE_COUNT : INITIAL_LIMIT;

        // --- FILTRO: TYPE='SERVICE' ---
        const params = new URLSearchParams({
          limit: String(limit),
          offset: String(currentOffset),
          search,
          type: 'SERVICE' // Busca apenas Serviços
        });

        const response = await fetch(`/api/products?${params}`, { signal });
        
        if (!response.ok) throw new Error('Erro ao buscar serviços');

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
    fetchServices();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ===============================
      BUSCA COM DEBOUNCE
   ================================ */
  useEffect(() => {
    const controller = new AbortController();

    const timeout = setTimeout(() => {
      fetchServices(false, searchTerm, 0, controller.signal);
    }, SEARCH_DEBOUNCE);

    return () => {
      controller.abort();
      clearTimeout(timeout);
    };
  }, [searchTerm, fetchServices]);

  /* ===============================
      HANDLERS
   ================================ */
  const handleLoadMore = () => {
    fetchServices(true, searchTerm, offset);
  };

  const handleWhatsAppRedirect = (item: Empilhadeira) => {
    const phone = process.env.NEXT_PUBLIC_WHATSAPP_PHONE || "5562991834188";
    const link = `${window.location.origin}/servicos?id=${item.id}`;

    // Mensagem formatada para Serviços
    let message = `*SOLICITAÇÃO DE SERVIÇO*\n\n`;
    message += `🛠️ *Serviço:* ${item.name}\n`;
    message += `📋 *Categoria:* Manutenção e Suporte\n`;
    
    if (item.price && item.price > 0) {
       message += `💲 *Valor Base:* R$ ${item.price.toLocaleString('pt-BR')}\n`;
    }
    
    message += `\nOlá, gostaria de agendar ou saber mais sobre este serviço:\n${link}`;

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

      <DynamicBanner id="servicos-topo" />

      {/* HERO SECTION - Cor diferenciada (ex: Azul escuro ou manter o verde) */}
      <section className="bg-slate-800 py-14 border-b-4 border-yellow-500">
        <div className="container mx-auto px-4 text-center">
          <div className="inline-flex items-center justify-center p-3 bg-white/10 rounded-full mb-4">
             <ClipboardList className="text-yellow-400" size={32} />
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white">
            Serviços Especializados
          </h1>
          <p className="text-slate-300 mt-4 max-w-2xl mx-auto text-lg">
            Manutenção preventiva, reformas completas e assistência técnica para sua frota não parar.
          </p>
        </div>
      </section>

      {/* BUSCA */}
      <section className="container mx-auto px-4 -mt-8 z-10 relative">
        <div className="bg-white rounded-2xl shadow-xl p-4 max-w-2xl mx-auto border border-slate-100">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              aria-label="Buscar serviços"
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Ex: Reforma de motor, Revisão preventiva, Pintura..."
              className="w-full pl-12 pr-10 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-slate-900 outline-none placeholder:text-slate-400"
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
            <div className="w-12 h-12 border-4 border-slate-200 border-t-yellow-500 rounded-full animate-spin" />
            <span className="mt-4 text-slate-400 font-medium">Carregando catálogo de serviços…</span>
          </div>
        ) : items.length === 0 ? (
          <div className="bg-white rounded-3xl p-16 text-center border-2 border-dashed border-slate-200">
            <Wrench size={48} className="mx-auto text-slate-300 mb-4" />
            <h3 className="text-xl font-bold text-slate-700">Nenhum serviço encontrado</h3>
            <p className="text-slate-500 mt-2 max-w-md mx-auto">
              Não encontramos serviços com esse nome. Tente termos mais gerais como "Revisão" ou "Manutenção".
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
                <CheckCircle2 className="text-[#005831]" />
                {searchTerm ? `Busca: "${searchTerm}"` : 'Nossos Serviços'}
              </h2>
              <span className="text-xs font-bold bg-slate-100 text-slate-600 px-3 py-1 rounded-full">
                {items.length} opções disponíveis
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
                  {loadingMore ? 'Buscando...' : 'Ver mais serviços'}
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

      <DynamicBanner id="servicos-rodape" />
    </main>
  );
}