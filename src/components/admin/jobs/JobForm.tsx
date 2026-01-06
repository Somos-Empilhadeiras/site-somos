'use client';
import { JobVacancy } from '@/types/admin';
import DynamicListInput from '../ui/DynamicListInput';
import { Save, X, Info } from 'lucide-react';

interface Props {
  formData: JobVacancy;
  setFormData: (val: any) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
  loading: boolean;
  isEditing: boolean;
}

export default function JobForm({ formData, setFormData, onSubmit, onCancel, loading, isEditing }: Props) {
  const updateList = (field: keyof JobVacancy, newItems: string[]) => {
    setFormData((prev: JobVacancy) => ({ ...prev, [field]: newItems }));
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-xl border border-t-4 border-t-orange-500 sticky top-4 z-20 animate-in slide-in-from-right-4 duration-300">
       <div className="flex justify-between items-center mb-6">
          <h2 className="font-bold text-lg text-slate-800">{isEditing ? 'Editar Vaga' : 'Nova Vaga'}</h2>
          <button onClick={onCancel} className="p-1 hover:bg-slate-100 rounded-full text-slate-400"><X size={20}/></button>
       </div>

       <form onSubmit={onSubmit} className="space-y-6">
          {/* Dados Principais */}
          <div className="space-y-4">
              <div>
                  <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Título da Vaga</label>
                  <input placeholder="Ex: Auxiliar Administrativo" required className="w-full border p-2 rounded focus:ring-2 focus:ring-orange-500 outline-none" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Local</label>
                    <input placeholder="Ex: Itajaí/SC" className="w-full border p-2 rounded text-sm" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Regime</label>
                    <select className="w-full border p-2 rounded text-sm bg-white" value={formData.vacancyType} onChange={e => setFormData({...formData, vacancyType: e.target.value})}>
                        <option value="">Selecione...</option>
                        <option value="CLT">CLT (Efetivo)</option>
                        <option value="PJ">PJ</option>
                        <option value="Estágio">Estágio</option>
                        <option value="Temporário">Temporário</option>
                    </select>
                  </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                   <div>
                    <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Horário</label>
                    <input placeholder="Ex: Seg a Sex, 08h as 18h" className="w-full border p-2 rounded text-sm" value={formData.workSchedule} onChange={e => setFormData({...formData, workSchedule: e.target.value})} />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Salário</label>
                    <input placeholder="Ex: R$ 2.500 ou A Combinar" className="w-full border p-2 rounded text-sm" value={formData.remuneration} onChange={e => setFormData({...formData, remuneration: e.target.value})} />
                  </div>
              </div>
          </div>

          <div className="border-t border-slate-100 pt-4 space-y-6">
             <div className="bg-orange-50 p-3 rounded-lg flex gap-2 text-orange-800 text-xs items-center">
                <Info size={16} />
                <span>Adicione itens individuais para criar as listas.</span>
             </div>
             
             <DynamicListInput label="Requisitos & Qualificações" items={formData.requirements || []} onChange={(items) => updateList('requirements', items)} placeholder="Ex: Ensino Médio Completo" />
             <DynamicListInput label="Responsabilidades & Atividades" items={formData.activities || []} onChange={(items) => updateList('activities', items)} placeholder="Ex: Atendimento ao cliente" />
             <DynamicListInput label="Benefícios" items={formData.benefits || []} onChange={(items) => updateList('benefits', items)} placeholder="Ex: Vale Refeição" />
          </div>

          <div className="flex justify-between items-center pt-4 border-t">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input type="checkbox" checked={formData.isActive} onChange={e => setFormData({...formData, isActive: e.target.checked})} className="w-4 h-4 text-orange-600 rounded focus:ring-orange-500" />
                  <span className={`text-sm font-bold ${formData.isActive ? 'text-green-600' : 'text-slate-400'}`}>{formData.isActive ? 'Vaga Publicada' : 'Rascunho (Oculta)'}</span>
              </label>

              <button type="submit" disabled={loading} className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-2.5 rounded-lg font-bold flex justify-center items-center gap-2 transition-all shadow-lg disabled:opacity-50">
                {loading ? 'Salvando...' : <><Save size={18}/> Salvar Vaga</>}
              </button>
          </div>
       </form>
    </div>
  );
}