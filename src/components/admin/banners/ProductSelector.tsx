'use client';

import { useState, useEffect } from 'react';
import { Search, X, Package, Loader2, Plus, AlertCircle } from 'lucide-react';
import Image from 'next/image';

// Interface exata do que sua API retorna (baseado no seu código SQL)
interface Empilhadeira {
  id: string; // ou number, dependendo do seu banco. Assumindo string/uuid
  name: string;
  image_url: string | null;
  model: string | null;
  brand: string | null;
}

interface Props {
  selectedIds: string[];
  onChange: (ids: string[]) => void;
  maxItems?: number;
}

export default function ProductSelector({ selectedIds, onChange, maxItems = 4 }: Props) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Empilhadeira[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState<Empilhadeira[]>([]);

  // 1. EFEITO PARA BUSCAR DETALHES DOS ITENS JÁ SELECIONADOS (AO CARREGAR)
  // Isso garante que se você editar o banner, as empilhadeiras salvas apareçam.
  useEffect(() => {
    const fetchSelectedDetails = async () => {
      if (selectedIds.length > 0 && selectedProducts.length === 0) {
        // Nota: O ideal seria ter um endpoint que aceita vários IDs, mas vamos buscar um a um ou listar tudo por enquanto
        // Estratégia simples: Buscar todas (limit 100) e filtrar. 
        // Otimização futura: Criar endpoint /api/empilhadeiras?ids=1,2,3
        try {
           const res = await fetch('/api/empilhadeiras?limit=100');
           const data: Empilhadeira[] = await res.json();
           const filtered = data.filter(item => selectedIds.includes(String(item.id))); // String() para garantir compatibilidade
           setSelectedProducts(filtered);
        } catch (error) {
           console.error("Erro ao carregar selecionados", error);
        }
      }
    };
    fetchSelectedDetails();
  }, []); // Executa apenas na montagem

  // 2. BUSCA NA API REAL (Search)
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (query.length > 1) { // Buscar com 2 letras ou mais
        setLoading(true);
        try {
          // Chama sua API real
          const res = await fetch(`/api/empilhadeiras?search=${query}&limit=5`);
          if (!res.ok) throw new Error('Erro na busca');
          
          const data = await res.json();
          setResults(Array.isArray(data) ? data : []);
        } catch (error) {
          console.error(error);
          setResults([]);
        } finally {
          setLoading(false);
        }
      } else {
        setResults([]);
      }
    }, 500); // Debounce de 500ms

    return () => clearTimeout(timer);
  }, [query]);

  const handleSelect = (product: Empilhadeira) => {
    // Verifica duplicidade
    if (selectedIds.includes(String(product.id))) return;
    
    // Verifica limite
    if (selectedIds.length >= maxItems) return;
    
    const newSelected = [...selectedProducts, product];
    setSelectedProducts(newSelected);
    onChange(newSelected.map(p => String(p.id))); // Atualiza o Pai com os IDs
    setQuery(''); // Limpa busca
    setResults([]); // Fecha lista
  };

  const handleRemove = (idToRemove: string) => {
    const newSelected = selectedProducts.filter(p => String(p.id) !== idToRemove);
    setSelectedProducts(newSelected);
    onChange(newSelected.map(p => String(p.id)));
  };

  const slotsLeft = maxItems - selectedProducts.length;

  return (
    <div className="space-y-4">
      {/* BARRA DE BUSCA COM BOTÃO DE ADICIONAR INTEGRADO VISUALMENTE */}
      <div className="relative group">
        <label className="text-[10px] font-bold text-slate-400 uppercase mb-1 flex justify-between">
           <span>Adicionar Produto</span>
           <span className={slotsLeft === 0 ? "text-red-500" : "text-green-600"}>
             {slotsLeft} vagas restantes
           </span>
        </label>
        
        <div className={`flex items-center border rounded-lg bg-white transition-all overflow-hidden ${slotsLeft === 0 ? 'opacity-50 cursor-not-allowed border-slate-200' : 'border-slate-300 focus-within:border-purple-500 focus-within:ring-1 focus-within:ring-purple-500'}`}>
          <div className="pl-3 text-slate-400">
            {loading ? <Loader2 className="animate-spin" size={18} /> : <Search size={18} />}
          </div>
          <input
            type="text"
            className="w-full p-2.5 text-sm outline-none placeholder:text-slate-400"
            placeholder={slotsLeft > 0 ? "Digite o nome da empilhadeira..." : "Limite de itens atingido"}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            disabled={slotsLeft === 0}
          />
        </div>

        {/* DROPDOWN DE RESULTADOS DA API */}
        {results.length > 0 && query.length > 1 && (
          <div className="absolute z-50 w-full mt-1 bg-white rounded-lg shadow-xl border border-slate-100 max-h-60 overflow-y-auto animate-in fade-in slide-in-from-top-2">
            {results.map((product) => {
               const isSelected = selectedIds.includes(String(product.id));
               return (
                <button
                  key={product.id}
                  type="button"
                  onClick={() => handleSelect(product)}
                  disabled={isSelected}
                  className="w-full flex items-center gap-3 p-3 hover:bg-slate-50 transition-colors border-b border-slate-50 last:border-0 disabled:opacity-50 disabled:cursor-not-allowed text-left group/item"
                >
                  {/* IMAGEM THUMBNAIL */}
                  <div className="w-12 h-12 bg-slate-100 rounded-md overflow-hidden relative shrink-0 border border-slate-200">
                    {product.image_url ? (
                        <Image 
                            src={product.image_url} 
                            alt={product.name} 
                            fill 
                            className="object-cover"
                            sizes="48px" 
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-300">
                            <Package size={20} />
                        </div>
                    )}
                  </div>

                  <div className="flex-1">
                    <p className="text-sm font-bold text-slate-700 group-hover/item:text-purple-700 transition-colors">{product.name}</p>
                    <p className="text-[10px] text-slate-500 font-mono">
                        {product.brand} {product.model ? `• ${product.model}` : ''}
                    </p>
                  </div>

                  {!isSelected && (
                     <div className="bg-slate-100 p-1.5 rounded-full text-slate-400 group-hover/item:bg-purple-100 group-hover/item:text-purple-600 transition-colors">
                        <Plus size={16} />
                     </div>
                  )}
                  {isSelected && <span className="text-[10px] font-bold text-green-600 px-2">Adicionado</span>}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* GRID DE ITENS SELECIONADOS (Visual estilo Carrossel) */}
      <div className="grid grid-cols-1 gap-3">
        {selectedProducts.map((product, idx) => (
          <div key={product.id} className="flex items-center gap-4 p-3 bg-white border border-slate-200 rounded-xl shadow-sm relative group hover:border-purple-300 transition-all">
            
            {/* Index Badge */}
            <div className="absolute -left-2 top-1/2 -translate-y-1/2 bg-slate-800 text-white w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shadow-md z-10">
                {idx + 1}
            </div>

            {/* Imagem */}
            <div className="w-16 h-16 bg-slate-50 rounded-lg overflow-hidden relative shrink-0 border border-slate-100">
               {product.image_url ? (
                  <Image src={product.image_url} alt={product.name} fill className="object-cover" />
               ) : (
                  <Package className="w-full h-full p-4 text-slate-300" />
               )}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-bold text-slate-800 truncate">{product.name}</h4>
              <div className="flex gap-2 text-[10px] text-slate-500 mt-0.5">
                  {product.brand && <span className="bg-slate-100 px-1.5 py-0.5 rounded text-slate-600">{product.brand}</span>}
                  {product.model && <span>Modelo: {product.model}</span>}
              </div>
            </div>

            {/* Ação Remover */}
            <button
              type="button"
              onClick={() => handleRemove(String(product.id))}
              className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              title="Remover produto"
            >
              <X size={18} />
            </button>
          </div>
        ))}
        
        {/* Empty States (Vagas Vazias) - Estilo Carrossel Vazio */}
        {Array.from({ length: slotsLeft }).map((_, i) => (
          <div key={i} className="flex items-center justify-center gap-2 h-[80px] border-2 border-dashed border-slate-200 rounded-xl bg-slate-50/50 text-slate-300 select-none">
            <span className="text-xs font-bold uppercase tracking-wider">Espaço Vazio {selectedProducts.length + i + 1}</span>
          </div>
        ))}
      </div>
    </div>
  );
}