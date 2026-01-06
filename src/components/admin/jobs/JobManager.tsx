'use client';

import { useState, useEffect } from 'react';
import { 
    Briefcase, Plus, Edit, Trash2, MapPin, 
    Clock, Banknote, CheckCircle, XCircle 
} from 'lucide-react';
import { JobVacancy } from '@/types/admin';
import JobForm from './JobForm';

export default function JobManager() {
  // --- ESTADOS ---
  const [jobs, setJobs] = useState<JobVacancy[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // Estado inicial limpo para nova vaga
  const initialJob: JobVacancy = { 
    title: '', 
    vacancyType: '', 
    workSchedule: '', 
    location: '', 
    remuneration: '', 
    requirements: [], 
    activities: [], 
    benefits: [], 
    educationLevel: '', 
    isActive: true 
  };
  
  const [formData, setFormData] = useState<JobVacancy>(initialJob);
  const [editingId, setEditingId] = useState<string | null>(null);

  // --- BUSCAR DADOS ---
  const fetchJobs = async () => {
     try {
        const res = await fetch('/api/vagas');
        const data = await res.json();
        if(Array.isArray(data)) setJobs(data);
     } catch (err) {
        console.error("Erro ao buscar vagas", err);
     }
  };

  useEffect(() => { fetchJobs(); }, []);

  // --- AÇÕES ---
  const handleSubmit = async (e: React.FormEvent) => {
     e.preventDefault();
     setLoading(true);
     
     try {
        const payload = { ...formData };
        if(editingId) payload.id = editingId;
        
        const res = await fetch('/api/vagas', { 
            method: editingId ? 'PUT' : 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(payload)
        });
        
        if (res.ok) {
            await fetchJobs();
            setIsFormOpen(false);
            setFormData(initialJob);
            setEditingId(null);
        } else {
            alert('Erro ao salvar vaga. Verifique o console.');
        }
     } catch(err) {
        console.error(err);
     } finally {
        setLoading(false);
     }
  };

  const handleDelete = async (id: string) => {
      if(!confirm('Tem certeza que deseja excluir esta vaga permanentemente?')) return;
      
      try {
          await fetch(`/api/vagas?id=${id}`, { method: 'DELETE' });
          fetchJobs();
      } catch (error) {
          console.error("Erro ao excluir", error);
      }
  };

  const handleEdit = (job: JobVacancy) => {
      setFormData(job);
      setEditingId(job.id!);
      setIsFormOpen(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNew = () => {
      setFormData(initialJob);
      setEditingId(null);
      setIsFormOpen(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancel = () => {
      setIsFormOpen(false);
      setFormData(initialJob);
      setEditingId(null);
  };

  // --- RENDERIZAÇÃO ---
  return (
    <div className="space-y-6">
       {/* HEADER DO GERENCIADOR */}
       <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-slate-200 shadow-sm sticky top-20 z-10 md:static">
          <h2 className="font-bold flex items-center gap-2 text-slate-700">
              <Briefcase className="text-orange-600"/> 
              <span className="hidden sm:inline">Gestão de Vagas</span>
              <span className="sm:hidden">Vagas</span>
          </h2>
          <button 
            onClick={handleNew} 
            className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 shadow-lg hover:shadow-orange-200 transition-all active:scale-95"
          >
            <Plus size={18}/> Nova Vaga
          </button>
       </div>

       <div className="grid grid-cols-12 gap-6 items-start">
          
          {/* COLUNA ESQUERDA: FORMULÁRIO (CONDICIONAL) */}
          {isFormOpen && (
              <div className="col-span-12 lg:col-span-5 animate-in slide-in-from-left-4 fade-in duration-300">
                  <JobForm 
                    formData={formData} 
                    setFormData={setFormData} 
                    onSubmit={handleSubmit} 
                    onCancel={handleCancel} 
                    loading={loading} 
                    isEditing={!!editingId} 
                  />
              </div>
          )}
          
          {/* COLUNA DIREITA: LISTA DE VAGAS */}
          <div className={`col-span-12 ${isFormOpen ? 'lg:col-span-7' : 'lg:col-span-12'} transition-all duration-500`}>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-4">
                  {jobs.map(job => (
                      <div key={job.id} className={`bg-white rounded-xl border p-5 shadow-sm hover:shadow-md transition-all group relative ${job.isActive ? 'border-l-4 border-l-green-500 border-slate-200' : 'border-l-4 border-l-slate-300 border-slate-200 opacity-75'}`}>
                          
                          {/* Cabeçalho do Card */}
                          <div className="flex justify-between items-start mb-3">
                              <h4 className="font-bold text-slate-800 text-lg leading-tight w-3/4">{job.title}</h4>
                              {job.isActive ? (
                                  <span className="bg-green-100 text-green-700 text-[10px] font-bold px-2 py-1 rounded-full flex items-center gap-1">
                                    <CheckCircle size={10}/> ATIVA
                                  </span>
                              ) : (
                                  <span className="bg-slate-100 text-slate-500 text-[10px] font-bold px-2 py-1 rounded-full flex items-center gap-1">
                                    <XCircle size={10}/> RASCUNHO
                                  </span>
                              )}
                          </div>
                          
                          {/* Detalhes Rápidos */}
                          <div className="space-y-2 mb-4 bg-slate-50 p-3 rounded-lg">
                              <div className="flex items-center gap-2 text-slate-600 text-xs font-medium">
                                  <MapPin size={14} className="text-orange-400"/>
                                  <span className="truncate">{job.location}</span>
                              </div>
                              <div className="flex items-center gap-2 text-slate-600 text-xs font-medium">
                                  <Briefcase size={14} className="text-orange-400"/>
                                  <span className="truncate">{job.vacancyType}</span>
                              </div>
                              <div className="flex items-center gap-2 text-slate-600 text-xs font-medium">
                                  <Clock size={14} className="text-orange-400"/>
                                  <span className="truncate">{job.workSchedule || 'N/A'}</span>
                              </div>
                               <div className="flex items-center gap-2 text-slate-600 text-xs font-medium">
                                  <Banknote size={14} className="text-orange-400"/>
                                  <span className="truncate">{job.remuneration || 'A combinar'}</span>
                              </div>
                          </div>

                          {/* Rodapé do Card */}
                          <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">
                                  {job.requirements?.length || 0} Req. • {job.benefits?.length || 0} Ben.
                              </span>
                              <div className="flex gap-2">
                                  <button 
                                    onClick={() => handleEdit(job)} 
                                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors flex items-center gap-1 text-xs font-bold"
                                  >
                                    <Edit size={16}/> Editar
                                  </button>
                                  <button 
                                    onClick={() => handleDelete(job.id!)} 
                                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors" 
                                    title="Excluir Vaga"
                                  >
                                    <Trash2 size={16}/>
                                  </button>
                              </div>
                          </div>
                      </div>
                  ))}
                  
                  {/* Estado Vazio */}
                  {jobs.length === 0 && !loading && (
                      <div className="col-span-full py-12 text-center text-slate-400 bg-white rounded-xl border border-dashed border-slate-300">
                          <Briefcase size={48} className="mx-auto mb-2 opacity-50"/>
                          <p className="font-medium">Nenhuma vaga cadastrada.</p>
                          <p className="text-xs mt-1">Clique em "Nova Vaga" para começar.</p>
                      </div>
                  )}
              </div>
          </div>
       </div>
    </div>
  );
}