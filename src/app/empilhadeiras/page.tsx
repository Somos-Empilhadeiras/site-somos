'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  Search,
  Truck,
  Package,
  ArrowDownCircle,
  X
} from 'lucide-react';

import DynamicBanner from '@/components/admin/banners/DynamicBanner';
import ItemCard from '@/components/admin/items/ItemCard';
import ModalItem from '@/components/admin/items/ModalItem';
import { Empilhadeira } from '@/types';

/* ===============================
   CONFIGURAÇÕES DO CATÁLOGO
================================ */
const INITIAL_LIMIT = 8;
const LOAD_MORE_COUNT = 8;
const SEARCH_DEBOUNCE = 500;

export default function Catalog() {
  const [items, setItems] = useState<Empilhadeira[]>([]);
  const [selectedItem, setSelectedItem] = useState<Empilhadeira | null>(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [offset, setOffset] = useState(0);

  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  /* ===============================
     FETCH DE DADOS (COM ABORT)
  ================================ */
  const fetchEmpilhadeiras = useCallback(
    async (
      isLoadMore = false,
      search = searchTerm,
      currentOffset = 0,
      signal?: AbortSignal
    ) => {
      try {
        isLoadMore ? setLoadingMore(true) : setLoading(true);

        const limit = isLoadMore ? LOAD_MORE_COUNT : INITIAL_LIMIT;

        const params = new URLSearchParams({
          limit: String(limit),
          offset: String(currentOffset),
          search
        });

        const response = await fetch(`/api/empilhadeiras?${params}`, { signal });
        if (!response.ok) throw new Error('Erro ao buscar empilhadeiras');

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
    fetchEmpilhadeiras();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ===============================
     BUSCA COM DEBOUNCE
  ================================ */
  useEffect(() => {
    const controller = new AbortController();

    const timeout = setTimeout(() => {
      fetchEmpilhadeiras(false, searchTerm, 0, controller.signal);
    }, SEARCH_DEBOUNCE);

    return () => {
      controller.abort();
      clearTimeout(timeout);
    };
  }, [searchTerm, fetchEmpilhadeiras]);

  /* ===============================
     HANDLERS
  ================================ */
  const handleLoadMore = () => {
    fetchEmpilhadeiras(true, searchTerm, offset);
  };

  const handleWhatsAppRedirect = (item: Empilhadeira) => {
    const phone = process.env.NEXT_PUBLIC_WHATSAPP_PHONE!;
    const link = `${window.location.origin}/catalogo?id=${item.id}`;

    let message = `*SOLICITAÇÃO DE ORÇAMENTO*\n\n`;
    message += `🚜 *Modelo:* ${item.brand} ${item.model}\n`;
    if (item.year) message += `📅 *Ano:* ${item.year}\n`;
    if (item.capacity) message += `⚙️ *Capacidade:* ${item.capacity}kg\n`;
    message += `\n${link}`;

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

      <DynamicBanner id="catalogo-topo" />

      {/* HERO MAIS LIMPO */}
      <section className="bg-[#005831] py-14">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white">
            Catálogo de Empilhadeiras
          </h1>
          <p className="text-slate-200 mt-4 max-w-2xl mx-auto">
            Equipamentos revisados, prontos para operação e com suporte técnico especializado.
          </p>
        </div>
      </section>

      {/* BUSCA */}
      <section className="container mx-auto px-4 -mt-8 z-10 relative">
        <div className="bg-white rounded-2xl shadow-lg p-4 max-w-2xl mx-auto">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              aria-label="Buscar empilhadeiras"
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Buscar por marca, modelo ou capacidade"
              className="w-full pl-12 pr-10 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#005831] outline-none"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
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
            <div className="w-12 h-12 border-4 border-slate-200 border-t-[#005831] rounded-full animate-spin" />
            <span className="mt-4 text-slate-400">Carregando catálogo…</span>
          </div>
        ) : items.length === 0 ? (
          <div className="bg-white rounded-3xl p-16 text-center border border-dashed">
            <Package size={48} className="mx-auto text-slate-300" />
            <h3 className="mt-6 text-xl font-bold">Nenhum resultado encontrado</h3>
            <p className="text-slate-500 mt-2">
              Não encontramos equipamentos com esse termo.
            </p>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <Truck className="text-[#005831]" />
                {searchTerm ? `Resultados para "${searchTerm}"` : 'Catálogo completo'}
              </h2>
              <span className="text-slate-500">
                {items.length} itens
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
                  className="flex items-center gap-3 px-8 py-3 rounded-full border-2 border-slate-200 font-bold hover:border-[#005831] hover:text-[#005831] transition disabled:opacity-60"
                >
                  {loadingMore ? 'Carregando…' : 'Ver mais'}
                  <ArrowDownCircle size={20} />
                </button>
              </div>
            )}
          </>
        )}
      </section>

      {selectedItem && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <ModalItem
            empilhadeira={selectedItem}
            onClose={() => setSelectedItem(null)}
            onWhatsApp={handleWhatsAppRedirect}
          />
        </div>
      )}

      <DynamicBanner id="catalogo-rodape" />
    </main>
  );
}
