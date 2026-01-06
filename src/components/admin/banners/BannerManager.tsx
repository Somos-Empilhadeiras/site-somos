'use client';
import { useState, useEffect } from 'react';
import { Megaphone, Plus, Trash2, CheckCircle, EyeOff, Edit } from 'lucide-react';
import { BannerConfig } from '@/types/admin';
import BannerForm from './BannerForm';

export default function BannerManager() {
    const [banners, setBanners] = useState<BannerConfig[]>([]);
    const [loading, setLoading] = useState(false);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);

    const initialBannerState: BannerConfig = {
        ids: [], name: '', isActive: true, layout: 'full', title: '', description: '',
        imageUrl: '', ctaText: 'Saiba Mais', ctaLink: '', carouselItems: [],
        bgColor: '#005831', textColor: '#FFFFFF', btnColor: '#EAB308', btnTextColor: '#005831', imagePosition: 'left'
    };
    const [formData, setFormData] = useState<BannerConfig>(initialBannerState);

    const fetchBanners = async () => {
        try {
            const res = await fetch('/api/banners');
            const data = await res.json();
            
            // Mapeamento CRUCIAL (Snake_case do Banco -> CamelCase do Frontend)
            const formatted = data.map((b: any) => ({
                id: b.id,
                ids: b.ids || [],
                name: b.name,
                isActive: b.is_active,
                layout: b.layout,
                title: b.title,
                description: b.description,
                ctaText: b.cta_text,
                ctaLink: b.cta_link,
                imageUrl: b.image_url,
                carouselItems: b.carousel_items || [],
                bgColor: b.bg_color,
                textColor: b.text_color,
                btnColor: b.btn_color,
                btnTextColor: b.btn_text_color,
                imagePosition: b.image_position
            }));
            setBanners(formatted);
        } catch (error) {
            console.error("Erro ao buscar banners", error);
        }
    };

    useEffect(() => { fetchBanners(); }, []);

    const handleEditClick = (banner: BannerConfig) => {
        setFormData({ ...initialBannerState, ...banner });
        setEditingId(banner.id || null);
        setIsFormOpen(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Tem certeza que deseja excluir este banner?')) return;
        await fetch(`/api/banners?id=${id}`, { method: 'DELETE' });
        fetchBanners();
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const payload = { ...formData };
            if (editingId) payload.id = editingId;
            
            // Nota: A API deve estar preparada para receber os campos e converter para snake_case
            // ou você faz a conversão inversa aqui se sua API for estrita.
            const res = await fetch('/api/banners', { 
                method: editingId ? 'PUT' : 'POST', 
                headers: { 'Content-Type': 'application/json' }, 
                body: JSON.stringify(payload) 
            });

            if (res.ok) {
                setIsFormOpen(false);
                setFormData(initialBannerState);
                setEditingId(null);
                fetchBanners();
            } else {
                alert("Erro ao salvar banner");
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const activeBanners = banners.filter(b => b.isActive);
    const inactiveBanners = banners.filter(b => !b.isActive);

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                <h2 className="font-bold text-slate-700 flex items-center gap-2"><Megaphone size={20} className="text-purple-600" /> Campanhas & Banners</h2>
                <button onClick={() => { setFormData(initialBannerState); setEditingId(null); setIsFormOpen(true); }} className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 shadow-lg transition-colors"><Plus size={18} /> Novo Banner</button>
            </div>

            <div className="grid grid-cols-12 gap-6 items-start">
                {isFormOpen && (
                    <BannerForm 
                        formData={formData} setFormData={setFormData} 
                        onSubmit={handleSubmit} onCancel={() => setIsFormOpen(false)} 
                        loading={loading} isEditing={!!editingId} 
                    />
                )}

                <div className={`col-span-12 ${isFormOpen ? 'lg:col-span-7' : 'lg:col-span-12'} transition-all space-y-6`}>
                    
                    {/* Banners Ativos */}
                    <div className="space-y-3">
                        <h3 className="text-sm font-bold text-green-700 uppercase flex items-center gap-2"><CheckCircle size={16} /> Ativos</h3>
                        {activeBanners.length === 0 && <p className="text-xs text-slate-400 italic">Nenhum banner ativo.</p>}
                        {activeBanners.map((banner) => (
                            <div key={banner.id} onClick={() => handleEditClick(banner)} className={`bg-white p-4 rounded-xl border border-green-200 shadow-sm hover:shadow-md cursor-pointer transition group relative overflow-hidden ${editingId === banner.id ? 'ring-2 ring-purple-500' : ''}`}>
                                <div className="absolute top-0 left-0 w-1 h-full bg-green-500"></div>
                                <div className="flex justify-between items-start mb-2 pl-2">
                                    <span className="text-[10px] font-bold uppercase text-slate-500 bg-slate-100 px-2 py-0.5 rounded">{banner.layout}</span>
                                    <div className="flex gap-2">
                                        <button className="text-blue-500 hover:text-blue-700"><Edit size={14} /></button>
                                        <button onClick={(e) => { e.stopPropagation(); handleDelete(banner.id!) }} className="text-slate-300 hover:text-red-500"><Trash2 size={14} /></button>
                                    </div>
                                </div>
                                <h4 className="font-bold text-slate-800 text-sm pl-2 mb-1">{banner.name}</h4>
                                <div className="pl-2 flex flex-wrap gap-1">
                                    {banner.ids.slice(0, 3).map(id => <span key={id} className="text-[9px] text-purple-700 bg-purple-50 px-1 rounded border border-purple-100">{id}</span>)}
                                    {banner.ids.length > 3 && <span className="text-[9px] text-slate-400">+{banner.ids.length - 3}</span>}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Banners Inativos */}
                    <div className="space-y-3">
                        <h3 className="text-sm font-bold text-slate-500 uppercase flex items-center gap-2"><EyeOff size={16} /> Inativos / Rascunhos</h3>
                        {inactiveBanners.length === 0 && <p className="text-xs text-slate-400 italic">Nenhum banner inativo.</p>}
                        {inactiveBanners.map((banner) => (
                            <div key={banner.id} onClick={() => handleEditClick(banner)} className={`bg-slate-50 p-4 rounded-xl border border-slate-200 cursor-pointer transition hover:bg-white opacity-70 hover:opacity-100 ${editingId === banner.id ? 'ring-2 ring-purple-500' : ''}`}>
                                <div className="flex justify-between items-start mb-1">
                                    <span className="text-[10px] font-bold uppercase text-slate-400">{banner.layout}</span>
                                    <button onClick={(e) => { e.stopPropagation(); handleDelete(banner.id!) }} className="text-slate-300 hover:text-red-500"><Trash2 size={14} /></button>
                                </div>
                                <h4 className="font-bold text-slate-600 text-sm">{banner.name}</h4>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}