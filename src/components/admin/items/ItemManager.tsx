'use client';

import { useState, useEffect } from 'react';
import { Truck, Settings, Disc, ClipboardList, Plus, Edit, Trash2, Package } from 'lucide-react';
import { AdminItem } from '@/types/admin';
import ItemForm from './ItemForm';

export default function ItemManager() {
  const [subTab, setSubTab] = useState<'machines' | 'parts' | 'tires' | 'services'>('machines');
  const [items, setItems] = useState<AdminItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const initialFormState: AdminItem = { 
      name: '', price: 0, description: '', image_url: '', 
      brand: '', model: '', year: '', capacity: 0, 
      manufacturer: '', application: '', serviceType: '',
      quantity: 0, type: 'MACHINE' 
  };
  
  const [formData, setFormData] = useState<AdminItem>(initialFormState);

  // 1. Busca os dados dependendo da aba selecionada
  const fetchData = async () => {
      setLoading(true);
      try {
          let url = '';
          if (subTab === 'machines') {
              url = '/api/empilhadeiras';
          } else {
              // Mapeia a aba para o TYPE do banco de dados
              const typeMap: any = { 'parts': 'PART', 'tires': 'TIRE', 'services': 'SERVICE' };
              url = `/api/products?type=${typeMap[subTab]}&limit=1000`;
          }

          const res = await fetch(url);
          const data = await res.json();

          if(Array.isArray(data)) {
              setItems(data.map((i: any) => ({
                  ...i, 
                  image_url: i.image_url || i.imageUrl,
                  // Normaliza campos que podem vir diferentes dependendo da tabela
                  brand: subTab === 'machines' ? i.brand : (i.manufacturer || i.brand)
              })));
          } else {
              setItems([]);
          }
      } catch(e) { 
          console.error(e); 
      } finally { 
          setLoading(false); 
      }
  };

  useEffect(() => { fetchData(); }, [subTab]);

  // 2. Lógica de Salvar (Incluindo Pneus e Serviços)
  const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setLoading(true);

      try {
        let url = '';
        let payload: any = { ...formData };
        
        // Limpezas e Definições de Tipo
        if (subTab === 'machines') {
            url = '/api/empilhadeiras';
            payload.type = 'MACHINE';
            // Remove campos que máquina não usa
            delete payload.manufacturer;
            delete payload.application;
            delete payload.serviceType;
        } else {
            url = '/api/products';
            
            // Define o tipo correto baseado na aba
            if (subTab === 'parts') payload.type = 'PART';
            if (subTab === 'tires') payload.type = 'TIRE';
            if (subTab === 'services') payload.type = 'SERVICE';

            // Remove campos que produtos não usam
            delete payload.brand; 
            delete payload.engine;
            delete payload.capacity;
            delete payload.year;
            delete payload.voltage;
        }

        // Conversões numéricas de segurança
        if (payload.quantity) payload.quantity = Number(payload.quantity);
        if (payload.capacity) payload.capacity = Number(payload.capacity);
        if (payload.year) payload.year = Number(payload.year);

        // Se estiver editando, usa PUT e mantém o ID
        if (editingId) {
            payload.id = editingId;
        } else {
            delete payload.id; // Garante que não vá ID vazio na criação
        }

        const method = editingId ? 'PUT' : 'POST';
        
        const res = await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (res.ok) {
            await fetchData(); // Recarrega a lista
            setIsFormOpen(false);
            setFormData(initialFormState);
            setEditingId(null);
        } else {
            alert('Erro ao salvar item.');
        }

      } catch (error) {
          console.error(error);
          alert('Erro de conexão.');
      } finally {
          setLoading(false);
      }
  };

  const handleDelete = async (id: string) => {
      if(!confirm('Tem certeza que deseja excluir este item?')) return;
      
      const url = subTab === 'machines' 
        ? `/api/empilhadeiras?id=${id}` 
        : `/api/products?id=${id}`;
        
      await fetch(url, { method: 'DELETE' });
      fetchData();
  };

  // Funções auxiliares para abrir/fechar form
  const handleNewItem = () => {
      setFormData(initialFormState);
      setEditingId(null);
      setIsFormOpen(true);
      // Rola para o topo para ver o formulário
      window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleEditItem = (item: AdminItem) => {
      setFormData({
          ...initialFormState, // Garante campos padrão
          ...item,
          // Ajuste fino para campos que mudam de nome entre tabelas
          brand: subTab === 'machines' ? item.brand : '',
          manufacturer: subTab !== 'machines' ? (item.brand || item.manufacturer) : ''
      });
      setEditingId(item.id!);
      setIsFormOpen(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="space-y-6">
        {/* CABEÇALHO COM AS ABAS (AQUI ESTAVAM FALTANDO OS BOTÕES) */}
        <div className="flex flex-col xl:flex-row justify-between items-center gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
             <div className="flex flex-wrap gap-2 bg-slate-100 p-1 rounded-lg w-full xl:w-auto">
                <button 
                    onClick={() => { setSubTab('machines'); setIsFormOpen(false); }} 
                    className={`px-4 py-2 rounded-md text-sm font-bold flex items-center gap-2 transition-all ${subTab === 'machines' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                >
                    <Truck size={16}/> Máquinas
                </button>
                
                <button 
                    onClick={() => { setSubTab('parts'); setIsFormOpen(false); }} 
                    className={`px-4 py-2 rounded-md text-sm font-bold flex items-center gap-2 transition-all ${subTab === 'parts' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                >
                    <Settings size={16}/> Peças
                </button>

                <button 
                    onClick={() => { setSubTab('tires'); setIsFormOpen(false); }} 
                    className={`px-4 py-2 rounded-md text-sm font-bold flex items-center gap-2 transition-all ${subTab === 'tires' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                >
                    <Disc size={16}/> Pneus
                </button>

                <button 
                    onClick={() => { setSubTab('services'); setIsFormOpen(false); }} 
                    className={`px-4 py-2 rounded-md text-sm font-bold flex items-center gap-2 transition-all ${subTab === 'services' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                >
                    <ClipboardList size={16}/> Serviços
                </button>
             </div>

             <div className="w-full xl:w-auto">
                <button 
                    onClick={handleNewItem} 
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg text-sm font-bold flex items-center justify-center gap-2 w-full transition-colors shadow-lg"
                >
                    <Plus size={18}/> 
                    Cadastrar {subTab === 'machines' ? 'Máquina' : subTab === 'parts' ? 'Peça' : subTab === 'tires' ? 'Pneu' : 'Serviço'}
                </button>
             </div>
        </div>

        <div className="grid grid-cols-12 gap-6 items-start">
            {/* FORMULÁRIO (Aparece ao clicar em novo/editar) */}
            {isFormOpen && (
                <div className="col-span-12 lg:col-span-4 animate-in slide-in-from-left-4 fade-in duration-300">
                    <ItemForm 
                        formData={formData} 
                        setFormData={setFormData} 
                        subTab={subTab} 
                        onSubmit={handleSubmit} 
                        onCancel={() => setIsFormOpen(false)} 
                        loading={loading} 
                        isEditing={!!editingId} 
                    />
                </div>
            )}
            
            {/* LISTA DE ITENS */}
            <div className={`col-span-12 ${isFormOpen ? 'lg:col-span-8' : 'lg:col-span-12'} transition-all duration-500`}>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                    {items.map(item => (
                        <div key={item.id} className={`bg-white rounded-xl border w-full h-full shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col ${editingId === item.id ? 'ring-2 ring-blue-500 border-transparent' : 'border-slate-200'}`}>
                             <div className="h-32 bg-slate-100 relative flex items-center justify-center overflow-hidden p-2">
                                {item.image_url ? (
                                    <img src={item.image_url} className="h-full w-full object-contain mix-blend-multiply" alt={item.name} />
                                ) : (
                                    <Package className="text-slate-300 w-10 h-10"/>
                                )}
                                <span className="absolute top-2 left-2 bg-white/90 px-2 py-0.5 rounded text-[10px] font-bold uppercase text-slate-600 shadow-sm">
                                    {subTab === 'machines' ? 'MÁQUINA' : item.type}
                                </span>
                             </div>
                             
                             <div className="p-3 flex flex-col flex-1">
                                <h4 className="font-bold text-slate-800 text-sm mb-1 line-clamp-2 min-h-10" title={item.name}>{item.name}</h4>
                                <p className="text-[10px] uppercase text-slate-500 mb-2 truncate">
                                    {item.brand || item.manufacturer || 'Genérico'}
                                </p>
                                
                                <div className="mt-auto flex justify-between items-center pt-2 border-t border-slate-100">
                                    <span className="font-bold text-[#005831] text-xs bg-green-50 px-2 py-1 rounded">
                                        Qtd: {item.quantity}
                                    </span>
                                    <div className="flex gap-1">
                                        <button onClick={() => handleEditItem(item)} className="p-1.5 text-blue-500 hover:bg-blue-50 rounded transition-colors" title="Editar"><Edit size={16}/></button>
                                        <button onClick={() => handleDelete(item.id!)} className="p-1.5 text-red-500 hover:bg-red-50 rounded transition-colors" title="Excluir"><Trash2 size={16}/></button>
                                    </div>
                                </div>
                             </div>
                        </div>
                    ))}
                </div>
                
                {items.length === 0 && !loading && (
                    <div className="text-center py-10 bg-white rounded-xl border border-dashed border-slate-300 text-slate-400">
                        <Package size={48} className="mx-auto mb-2 opacity-50"/>
                        <p>Nenhum item encontrado nesta categoria.</p>
                    </div>
                )}
            </div>
        </div>
    </div>
  );
}
