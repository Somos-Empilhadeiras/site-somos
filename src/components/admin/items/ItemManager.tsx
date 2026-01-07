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

  // Estado Inicial Atualizado com os novos campos
  const initialFormState: AdminItem = { 
      name: '', price: 0, description: '', image_url: '', 
      brand: '', model: '', year: undefined, capacity: undefined, 
      manufacturer: '', application: '', serviceType: '',
      quantity: 0, type: 'MACHINE',
      // Novos campos iniciados como string vazia ou undefined
      lift_height: '', loadCenter: undefined, voltage: undefined, 
      batteryDetails: '', chargerType: '', technicalSheetUrl: ''
  };
  
  const [formData, setFormData] = useState<AdminItem>(initialFormState);

  const fetchData = async () => {
      setLoading(true);
      try {
          let url = '';
          if (subTab === 'machines') {
              url = '/api/empilhadeiras';
          } else {
              const typeMap: any = { 'parts': 'PART', 'tires': 'TIRE', 'services': 'SERVICE' };
              url = `/api/products?type=${typeMap[subTab]}&limit=1000`;
          }

          const res = await fetch(url, { cache: 'no-store' });
          const data = await res.json();

          if(Array.isArray(data)) {
              setItems(data.map((i: any) => ({
                  ...i, 
                  image_url: i.image_url || i.imageUrl,
                  brand: subTab === 'machines' ? i.brand : (i.manufacturer || i.brand),
                  // Mapeamento de segurança (Snake_case do banco -> CamelCase do front)
                  lift_height: i.liftHeight || i.lift_height,
                  loadCenter: i.loadCenter || i.load_center,
                  batteryDetails: i.batteryDetails || i.battery_details,
                  chargerType: i.chargerType || i.charger_type,
                  technicalSheetUrl: i.technicalSheetUrl || i.technical_sheet_url
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

  const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setLoading(true);

      try {
        let url = '';
        // Cria uma cópia para enviar, mapeando de volta para snake_case se necessário pela API
        // OBS: Se sua API aceitar camelCase, o payload direto funciona. 
        // Se ela esperar snake_case, você deve renomear as chaves aqui.
        let payload: any = { 
            ...formData,
            // Exemplo de mapeamento para envio (se sua API esperar snake_case)
            lift_height: formData.lift_height,
            load_center: formData.loadCenter,
            battery_details: formData.batteryDetails,
            charger_type: formData.chargerType,
            technical_sheet_url: formData.technicalSheetUrl
        };
        
        if (subTab === 'machines') {
            url = '/api/empilhadeiras';
            payload.type = 'MACHINE';
            delete payload.manufacturer; delete payload.application; delete payload.serviceType;
        } else {
            url = '/api/products';
            if (subTab === 'parts') payload.type = 'PART';
            if (subTab === 'tires') payload.type = 'TIRE';
            if (subTab === 'services') payload.type = 'SERVICE';
            // Limpa campos de máquina
            delete payload.brand; delete payload.engine; delete payload.capacity; 
            delete payload.year; delete payload.voltage; delete payload.lift_height;
        }

        // Conversões numéricas
        if (payload.quantity) payload.quantity = Number(payload.quantity);
        if (payload.capacity) payload.capacity = Number(payload.capacity);
        if (payload.year) payload.year = Number(payload.year);
        if (payload.voltage) payload.voltage = Number(payload.voltage);
        if (payload.load_center) payload.load_center = Number(payload.load_center);

        if (editingId) payload.id = editingId;
        else delete payload.id;

        const method = editingId ? 'PUT' : 'POST';
        
        const res = await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (res.ok) {
            await fetchData();
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
      const url = subTab === 'machines' ? `/api/empilhadeiras?id=${id}` : `/api/products?id=${id}`;
      await fetch(url, { method: 'DELETE' });
      fetchData();
  };

  const handleNewItem = () => {
      setFormData(initialFormState);
      setEditingId(null);
      setIsFormOpen(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleEditItem = (item: AdminItem) => {
      setFormData({
          ...initialFormState,
          ...item,
          brand: subTab === 'machines' ? item.brand : '',
          manufacturer: subTab !== 'machines' ? (item.brand || item.manufacturer) : ''
      });
      setEditingId(item.id!);
      setIsFormOpen(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="space-y-6">
        <div className="flex flex-col xl:flex-row justify-between items-center gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
             <div className="flex flex-wrap gap-2 bg-slate-100 p-1 rounded-lg w-full xl:w-auto">
                <button onClick={() => { setSubTab('machines'); setIsFormOpen(false); }} className={`px-4 py-2 rounded-md text-sm font-bold flex items-center gap-2 transition-all ${subTab === 'machines' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}><Truck size={16}/> Máquinas</button>
                <button onClick={() => { setSubTab('parts'); setIsFormOpen(false); }} className={`px-4 py-2 rounded-md text-sm font-bold flex items-center gap-2 transition-all ${subTab === 'parts' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}><Settings size={16}/> Peças</button>
                <button onClick={() => { setSubTab('tires'); setIsFormOpen(false); }} className={`px-4 py-2 rounded-md text-sm font-bold flex items-center gap-2 transition-all ${subTab === 'tires' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}><Disc size={16}/> Pneus</button>
                <button onClick={() => { setSubTab('services'); setIsFormOpen(false); }} className={`px-4 py-2 rounded-md text-sm font-bold flex items-center gap-2 transition-all ${subTab === 'services' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}><ClipboardList size={16}/> Serviços</button>
             </div>
             <div className="w-full xl:w-auto">
                <button onClick={handleNewItem} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg text-sm font-bold flex items-center justify-center gap-2 w-full transition-colors shadow-lg"><Plus size={18}/> Cadastrar {subTab === 'machines' ? 'Máquina' : subTab === 'parts' ? 'Peça' : subTab === 'tires' ? 'Pneu' : 'Serviço'}</button>
             </div>
        </div>

        <div className="grid grid-cols-12 gap-6 items-start">
            {isFormOpen && (
                <div className="col-span-12 lg:col-span-5 animate-in slide-in-from-left-4 fade-in duration-300">
                    <ItemForm 
                        formData={formData} setFormData={setFormData} subTab={subTab} 
                        onSubmit={handleSubmit} onCancel={() => setIsFormOpen(false)} 
                        loading={loading} isEditing={!!editingId} 
                    />
                </div>
            )}
            
            <div className={`col-span-12 ${isFormOpen ? 'lg:col-span-7' : 'lg:col-span-12'} transition-all duration-500`}>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                    {items.map(item => (
                        <div key={item.id} className={`bg-white rounded-xl border w-full h-full shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col ${editingId === item.id ? 'ring-2 ring-blue-500 border-transparent' : 'border-slate-200'}`}>
                             <div className="h-32 bg-slate-100 relative flex items-center justify-center overflow-hidden p-2">
                                {item.image_url ? (
                                    <img src={item.image_url} className="h-full w-full object-contain mix-blend-multiply" alt={item.name} />
                                ) : (
                                    <Package className="text-slate-300 w-10 h-10"/>
                                )}
                                <span className="absolute top-2 left-2 bg-white/90 px-2 py-0.5 rounded text-[10px] font-bold uppercase text-slate-600 shadow-sm">{subTab === 'machines' ? 'MÁQUINA' : item.type}</span>
                             </div>
                             <div className="p-3 flex flex-col flex-1">
                                <h4 className="font-bold text-slate-800 text-sm mb-1 line-clamp-2 min-h-10" title={item.name}>{item.name}</h4>
                                <p className="text-[10px] uppercase text-slate-500 mb-2 truncate">{item.brand || item.manufacturer || 'Genérico'}</p>
                                <div className="mt-auto flex justify-between items-center pt-2 border-t border-slate-100">
                                    <span className="font-bold text-[#005831] text-xs bg-green-50 px-2 py-1 rounded">Qtd: {item.quantity}</span>
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