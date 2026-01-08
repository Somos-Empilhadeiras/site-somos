'use client';
import { AdminItem } from '@/types/admin';
import ImageUpload from '../ui/ImageUpload';
import { Save, X, Gauge, Zap, FileText } from 'lucide-react';

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
  // Helper para estilos de label
  const labelStyle = "block text-[10px] font-bold text-slate-500 uppercase mb-1";

  return (
    <div className="bg-white p-6 rounded-xl shadow-xl border border-slate-200 border-t-4 border-t-blue-500 sticky top-4 z-10 max-h-[90vh] overflow-y-auto custom-scrollbar">
      <div className="flex justify-between items-center mb-6">
        <h2 className="font-bold text-lg text-slate-800">{isEditing ? 'Editar Item' : 'Novo Item'}</h2>
        <button onClick={onCancel} className="p-1 hover:bg-slate-100 rounded-full"><X size={20} /></button>
      </div>

      <form onSubmit={onSubmit} className="space-y-5">
        
        {/* --- 1. DADOS GERAIS --- */}
        <div className="space-y-3">
            <div>
                <label className={labelStyle}>Nome Principal</label>
                <input required className="border p-2 w-full rounded text-sm" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} placeholder="Ex: Empilhadeira Elétrica 2.5T" />
            </div>
            <div>
                <label className={labelStyle}>Descrição Comercial</label>
                <textarea className="border p-2 w-full rounded text-sm" rows={3} value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} placeholder="Descrição detalhada para o site..." />
            </div>
        </div>
        
        {/* --- 2. MÁQUINAS (NOVOS CAMPOS COM LABELS) --- */}
        {subTab === 'machines' && (
           <div className="space-y-4 animate-in fade-in">
              
              {/* Bloco A: Identificação */}
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                  <span className="text-xs font-black text-blue-600 uppercase mb-3 block border-b border-blue-100 pb-1">Identificação</span>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                        <label className={labelStyle}>Marca</label>
                        <input placeholder="Ex: HELI" className="border p-2 rounded text-sm bg-white w-full" value={formData.brand || ''} onChange={e => setFormData({ ...formData, brand: e.target.value })} />
                    </div>
                    <div>
                        <label className={labelStyle}>Modelo</label>
                        <input placeholder="Ex: CPD25" className="border p-2 rounded text-sm bg-white w-full" value={formData.model || ''} onChange={e => setFormData({ ...formData, model: e.target.value })} />
                    </div>
                    <div>
                        <label className={labelStyle}>Ano Fab.</label>
                        <input type="number" placeholder="Ex: 2024" className="border p-2 rounded text-sm bg-white w-full" value={formData.year || ''} onChange={e => setFormData({ ...formData, year: Number(e.target.value) })} />
                    </div>
                    {/* PREÇO */}
                    {/* <div>
                        <label className={labelStyle}>Preço (R$)</label>
                        <input type="number" placeholder="0,00" className="border p-2 rounded text-sm bg-white w-full" value={formData.price || ''} onChange={e => setFormData({ ...formData, price: Number(e.target.value) })} />
                    </div> */}
                  </div>
              </div>

              {/* Bloco B: Especificações Técnicas */}
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                  <span className="text-xs font-black text-blue-600 uppercase mb-3 flex items-center gap-1 border-b border-blue-100 pb-1"><Gauge size={14}/> Torre & Capacidade</span>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                        <label className={labelStyle}>Capacidade (KG)</label>
                        <input type="number" placeholder="Ex: 2500" className="border p-2 rounded text-sm bg-white w-full" value={formData.capacity || ''} onChange={e => setFormData({ ...formData, capacity: Number(e.target.value) })} />
                    </div>
                    <div className="col-span-1">
                        <label className={labelStyle}>Elevação da Torre</label>
                        <input placeholder="Ex: Triplex 4.5m Container" className="border p-2 rounded text-sm bg-white w-full" value={formData.lift_height || ''} onChange={e => setFormData({ ...formData, lift_height: e.target.value })} />
                    </div>

                    {/* CENTRO DE CARGA */}
                    {/* <div>
                        <label className={labelStyle}>Centro Carga (mm)</label>
                        <input type="number" placeholder="Ex: 500" className="border p-2 rounded text-sm bg-white w-full" value={formData.loadCenter || ''} onChange={e => setFormData({ ...formData, loadCenter: Number(e.target.value) })} />
                    </div> */}
                  </div>
              </div>

              {/* Bloco C: Motorização */}
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                  <span className="text-xs font-black text-blue-600 uppercase mb-3 flex items-center gap-1 border-b border-blue-100 pb-1"><Zap size={14}/> Motorização & Energia</span>
                  <div className="grid grid-cols-2 gap-3">
                     <div className="col-span-2">
                        <label className={labelStyle}>Tipo de Motor</label>
                        <select className="border p-2 rounded text-sm bg-white w-full" value={formData.engine || ''} onChange={e => setFormData({ ...formData, engine: e.target.value })}>
                            <option value="">Selecione...</option>
                            <option value="Elétrica (Lítio)">Elétrica (Lítio)</option>
                            <option value="Elétrica (Chumbo-Ácido)">Elétrica (Chumbo-Ácido)</option>
                            <option value="Combustão (GLP)">Combustão (GLP)</option>
                            <option value="Combustão (Diesel)">Combustão (Diesel)</option>
                            <option value="Manual">Manual</option>
                        </select>
                     </div>
                     
                     <div>
                        <label className={labelStyle}>Tensão (V)</label>
                        <input type="number" placeholder="Ex: 48" className="border p-2 rounded text-sm bg-white w-full" value={formData.voltage || ''} onChange={e => setFormData({ ...formData, voltage: Number(e.target.value) })} />
                     </div>
                     <div>
                        <label className={labelStyle}>Carregador</label>
                        <input placeholder="Ex: Embutido" className="border p-2 rounded text-sm bg-white w-full" value={formData.chargerType || ''} onChange={e => setFormData({ ...formData, chargerType: e.target.value })} />
                     </div>
                     <div className="col-span-2">
                        <label className={labelStyle}>Detalhes da Bateria</label>
                        <input placeholder="Ex: 80V/230Ah - Marca X" className="border p-2 rounded text-sm bg-white w-full" value={formData.batteryDetails || ''} onChange={e => setFormData({ ...formData, batteryDetails: e.target.value })} />
                     </div>
                  </div>
              </div>

              {/* Bloco D: Arquivos */}
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                 <span className="text-xs font-black text-blue-600 uppercase mb-3 flex items-center gap-1 border-b border-blue-100 pb-1"><FileText size={14}/> Arquivos</span>
                 <div>
                    <label className={labelStyle}>Link da Ficha Técnica (PDF)</label>
                    <input placeholder="https://..." className="border p-2 rounded text-sm bg-white w-full" value={formData.technicalSheetUrl || ''} onChange={e => setFormData({ ...formData, technicalSheetUrl: e.target.value })} />
                 </div>
              </div>
           </div>
        )}

        {/* --- 3. PEÇAS / PNEUS (COM LABELS) --- */}
        {(subTab === 'parts' || subTab === 'tires') && (
            <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 space-y-3">
                <div>
                    <label className={labelStyle}>Fabricante</label>
                    <input placeholder="Ex: Michelin / Peças Genuínas" className="border p-2 rounded text-sm w-full" value={formData.manufacturer || ''} onChange={e => setFormData({ ...formData, manufacturer: e.target.value })} />
                </div>
                <div>
                    <label className={labelStyle}>Aplicação / Compatibilidade</label>
                    <input placeholder="Ex: Empilhadeiras 2.5T a 3.5T" className="border p-2 rounded text-sm w-full" value={formData.application || ''} onChange={e => setFormData({ ...formData, application: e.target.value })} />
                </div>

                {/* PREÇO */}
                {/* <div className="grid grid-cols-2 gap-3">
                    <div>
                        <label className={labelStyle}>Preço (R$)</label>
                        <input type="number" placeholder="0,00" className="border p-2 rounded text-sm w-full" value={formData.price || ''} onChange={e => setFormData({ ...formData, price: Number(e.target.value) })} />
                    </div>
                </div> */}
            </div>
        )}

        {/* --- 4. SERVIÇOS (COM LABEL) --- */}
        {subTab === 'services' && (
            <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                <label className={labelStyle}>Categoria do Serviço</label>
                <select className="border p-2 rounded w-full text-sm" value={formData.serviceType || ''} onChange={e => setFormData({ ...formData, serviceType: e.target.value })}>
                    <option value="">Selecione...</option>
                    <option value="manutencao">Manutenção Preventiva/Corretiva</option>
                    <option value="reforma">Reforma Geral</option>
                    <option value="inspecao">Inspeção Técnica</option>
                    <option value="locacao">Locação</option>
                </select>
            </div>
        )}

        {/* --- 5. RODAPÉ (FOTO E SALVAR) --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
            {/* QUANTIDADE */}
            {/* <div>
                <label className={labelStyle}>Quantidade em Estoque</label>
                <input type="number" className="border p-2 w-full rounded text-sm" value={formData.quantity} onChange={e => setFormData({ ...formData, quantity: Number(e.target.value) })} />
            </div> */}
             <div className='h-full md:col-span-2 min-h-[100px]'>
                <label className={labelStyle}>Foto Principal</label>
                <ImageUpload currentImageUrl={formData.image_url} onUpload={(url) => setFormData({...formData, image_url: url})} />
            </div>
        </div>

        <div className="flex gap-3 pt-4 border-t border-slate-100">
            <button type="button" onClick={onCancel} className="flex-1 py-3 rounded-lg text-slate-600 font-bold hover:bg-slate-100 border border-transparent hover:border-slate-200 transition-all">Cancelar</button>
            <button type="submit" disabled={loading} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-bold flex justify-center items-center gap-2 shadow-lg transition-all">{loading ? 'Salvando...' : <><Save size={18} /> Salvar Item</>}</button>
        </div>
      </form>
    </div>
  );
}