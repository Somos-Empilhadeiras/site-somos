'use client';
import { AdminItem } from '@/types/admin';
import ImageUpload from '../ui/ImageUpload';
import { Save, X } from 'lucide-react';

interface Props {
  formData: AdminItem;
  setFormData: (data: AdminItem) => void;
  subTab: string;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
  loading: boolean;
  isEditing: boolean;
}

export default function ItemForm({ formData, setFormData, subTab, onSubmit, onCancel, loading, isEditing }: Props) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-xl border border-slate-200 border-t-4 border-t-blue-500 sticky top-4 z-10">
      <div className="flex justify-between items-center mb-6">
        <h2 className="font-bold text-lg text-slate-800">{isEditing ? 'Editar Item' : 'Novo Item'}</h2>
        <button onClick={onCancel} className="p-1 hover:bg-slate-100 rounded-full"><X size={20} /></button>
      </div>

      <form onSubmit={onSubmit} className="space-y-4">
        {/* CAMPOS COMUNS */}
        <div>
          <label className="text-xs font-bold text-slate-500 uppercase block">Nome</label>
          <input required className="border p-2 w-full rounded" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
        </div>
        <div>
           <label className="text-xs font-bold text-slate-500 uppercase block">Descrição</label>
           <textarea className="border p-2 w-full rounded" rows={3} value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} />
        </div>
        
        {/* CAMPOS ESPECÍFICOS */}
        {subTab === 'machines' && (
           <div className="grid grid-cols-2 gap-3 bg-slate-50 p-3 rounded">
              <input placeholder="Marca" className="border p-2 rounded text-sm" value={formData.brand || ''} onChange={e => setFormData({ ...formData, brand: e.target.value })} />
              <input placeholder="Modelo" className="border p-2 rounded text-sm" value={formData.model || ''} onChange={e => setFormData({ ...formData, model: e.target.value })} />
              <input type="number" placeholder="Ano" className="border p-2 rounded text-sm" value={formData.year || ''} onChange={e => setFormData({ ...formData, year: Number(e.target.value) })} />
              <input type="number" placeholder="Capacidade (kg)" className="border p-2 rounded text-sm" value={formData.capacity || ''} onChange={e => setFormData({ ...formData, capacity: Number(e.target.value) })} />
           </div>
        )}

        {(subTab === 'parts' || subTab === 'tires') && (
            <div className="bg-slate-50 p-3 rounded">
                <input placeholder="Fabricante" className="border p-2 rounded text-sm w-full mb-2" value={formData.manufacturer || ''} onChange={e => setFormData({ ...formData, manufacturer: e.target.value })} />
                <input placeholder="Aplicação" className="border p-2 rounded text-sm w-full" value={formData.application || ''} onChange={e => setFormData({ ...formData, application: e.target.value })} />
            </div>
        )}

        {subTab === 'services' && (
            <select className="border p-2 rounded w-full" value={formData.serviceType || ''} onChange={e => setFormData({ ...formData, serviceType: e.target.value })}>
                <option value="">Tipo de Serviço</option>
                <option value="manutencao">Manutenção</option>
                <option value="reforma">Reforma</option>
                <option value="inspecao">Inspeção</option>
            </select>
        )}

        <div className="grid grid-cols-2 gap-4">
            <div>
                <label className="text-xs font-bold text-slate-500 uppercase block">Qtd.</label>
                <input type="number" className="border p-2 w-full rounded" value={formData.quantity} onChange={e => setFormData({ ...formData, quantity: Number(e.target.value) })} />
            </div>
             <div className='h-full'>
                <ImageUpload currentImageUrl={formData.image_url} onUpload={(url) => setFormData({...formData, image_url: url})} />
            </div>
        </div>

        <div className="flex gap-2 pt-2">
            <button type="button" onClick={onCancel} className="flex-1 py-3 rounded text-slate-600 hover:bg-slate-100">Cancelar</button>
            <button type="submit" disabled={loading} className="flex-1 bg-blue-600 text-white py-3 rounded font-bold flex justify-center items-center gap-2">{loading ? '...' : <><Save size={18} /> Salvar</>}</button>
        </div>
      </form>
    </div>
  );
}