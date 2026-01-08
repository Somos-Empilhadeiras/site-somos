'use client';
import { useState, useEffect } from 'react';
import { Megaphone, Plus, Trash2, CheckCircle, Edit } from 'lucide-react';
import { BannerConfig } from '@/types/admin';
import BannerForm from './BannerForm';

export default function BannerManager() {
    const [banners, setBanners] = useState<BannerConfig[]>([]);
    const [loading, setLoading] = useState(false);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);

    const initialBannerState: BannerConfig = {
        ids: [], name: '', isActive: true, layout: 'carousel',
        title: '', description: '',
        imageUrl: '', ctaText: 'Saiba Mais', ctaLink: '', 
        carouselItems: [],
        productIds: [], // Importante inicializar vazio
        bgColor: '#005831', textColor: '#FFFFFF', btnColor: '#EAB308', btnTextColor: '#005831', imagePosition: 'left',
        height: 'h-[80vh]', contentAlign: 'left', textSize: 'medium', slideDuration: 5,
        titleColor: '#ffffff', descColor: '#e2e8f0', secBtnColor: '#ffffff', secBtnTextColor: '#000000'
    };
    
    const [formData, setFormData] = useState<BannerConfig>(initialBannerState);

    const fetchBanners = async () => {
        try {
            const res = await fetch('/api/banners', { cache: 'no-store' });
            const data = await res.json();
            
            const listToMap = Array.isArray(data) ? data : []; 

            const formatted = listToMap.map((b: any) => {
                // --- CORREÇÃO AQUI: LER AMBOS OS FORMATOS (SNAKE E CAMEL) ---
                let parsedSlides = [];
                try {
                    // Pega o que vier: carousel_items OU carouselItems
                    const rawSlides = b.carousel_items || b.carouselItems;

                    if (Array.isArray(rawSlides)) {
                        parsedSlides = rawSlides;
                    } else if (typeof rawSlides === 'string') {
                        parsedSlides = JSON.parse(rawSlides);
                    }
                } catch (e) {
                    console.error("Erro ao ler slides:", e);
                    parsedSlides = [];
                }

                // --- PARSE PARA PRODUTOS (MANTIDO IGUAL) ---
                let parsedProducts: string[] = [];
                try {
                    const rawProd = b.productIds || b.product_ids;
                    if (Array.isArray(rawProd)) {
                        parsedProducts = rawProd.map(String);
                    } else if (typeof rawProd === 'string') {
                        if (rawProd.startsWith('[')) {
                             parsedProducts = JSON.parse(rawProd).map(String);
                        } else {
                             parsedProducts = rawProd.split(',').map((s:string) => s.trim());
                        }
                    }
                } catch (e) {
                    console.error("Erro ao ler produtos:", e);
                }

                return {
                    id: b.id,
                    ids: b.ids || [],
                    name: b.name,
                    isActive: b.is_active !== undefined ? b.is_active : b.isActive,
                    layout: b.layout || 'carousel',
                    
                    productIds: parsedProducts,

                    title: b.title,
                    description: b.description,
                    ctaText: b.cta_text || b.ctaText,
                    ctaLink: b.cta_link || b.ctaLink,
                    imageUrl: b.image_url || b.imageUrl,
                    
                    // AGORA SIM: Usa a variável que leu os dois formatos
                    carouselItems: parsedSlides,
                    
                    bgColor: b.bg_color || b.bgColor,
                    textColor: b.text_color || b.textColor,
                    btnColor: b.btn_color || b.btnColor,
                    btnTextColor: b.btn_text_color || b.btnTextColor,
                    imagePosition: b.image_position || b.imagePosition,
                    
                    height: b.height || 'h-[80vh]',
                    contentAlign: b.content_align || 'left',
                    textSize: b.text_size || 'medium',
                    slideDuration: b.slide_duration || 5,
                    titleColor: b.title_color || '#ffffff',
                    descColor: b.desc_color || '#e2e8f0',
                    secBtnColor: b.sec_btn_color || '#ffffff',
                    secBtnTextColor: b.sec_btn_text_color || '#000000'
                };
            });
            
            setBanners(formatted);
        } catch (error) {
            console.error("Erro ao buscar banners", error);
            setBanners([]);
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
        if (!confirm('Tem certeza que deseja excluir?')) return;
        try {
            await fetch(`/api/banners?id=${id}`, { method: 'DELETE' });
            fetchBanners();
        } catch (e) { console.error(e); }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const dbPayload = {
                name: formData.name,
                ids: formData.ids,
                is_active: formData.isActive,
                layout: formData.layout,
                
                // Envia os IDs selecionados
                product_ids: formData.productIds || [], 
                
                title: formData.title,
                description: formData.description,
                image_url: formData.imageUrl,
                cta_text: formData.ctaText,
                cta_link: formData.ctaLink,
                carousel_items: formData.carouselItems, 
                
                bg_color: formData.bgColor,
                text_color: formData.textColor,
                btn_color: formData.btnColor,
                btn_text_color: formData.btnTextColor,
                image_position: formData.imagePosition,
                height: formData.height,
                content_align: formData.contentAlign,
                text_size: formData.textSize,
                slide_duration: formData.slideDuration,
                title_color: formData.titleColor,
                desc_color: formData.descColor,
                sec_btn_color: formData.secBtnColor,
                sec_btn_text_color: formData.secBtnTextColor
            };

            if (editingId) (dbPayload as any).id = editingId;
            
            const res = await fetch('/api/banners', { 
                method: editingId ? 'PUT' : 'POST', 
                headers: { 'Content-Type': 'application/json' }, 
                body: JSON.stringify(dbPayload) 
            });

            if (res.ok) {
                setIsFormOpen(false);
                setFormData(initialBannerState);
                setEditingId(null);
                fetchBanners();
            } else {
                alert("Erro ao salvar.");
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const activeBanners = banners.filter(b => b.isActive);

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

                <div className={`col-span-12 ${isFormOpen ? 'lg:col-span-6' : 'lg:col-span-12'} transition-all space-y-6`}>
                    <div className="space-y-3">
                        <h3 className="text-sm font-bold text-green-700 uppercase flex items-center gap-2"><CheckCircle size={16} /> Ativos</h3>
                        {activeBanners.map((banner) => (
                            <div key={banner.id} onClick={() => handleEditClick(banner)} className={`bg-white p-4 rounded-xl border border-green-200 shadow-sm hover:shadow-md cursor-pointer transition group relative overflow-hidden ${editingId === banner.id ? 'ring-2 ring-purple-500' : ''}`}>
                                <div className="flex justify-between items-start mb-2 pl-2">
                                    <span className="text-[10px] font-bold uppercase text-slate-500 bg-slate-100 px-2 py-0.5 rounded">{banner.layout}</span>
                                    <div className="flex gap-2">
                                        <button className="text-blue-500 hover:text-blue-700"><Edit size={14} /></button>
                                        <button onClick={(e) => { e.stopPropagation(); handleDelete(banner.id!) }} className="text-slate-300 hover:text-red-500"><Trash2 size={14} /></button>
                                    </div>
                                </div>
                                <h4 className="font-bold text-slate-800 text-sm pl-2 mb-1">{banner.name}</h4>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}