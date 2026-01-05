'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
    Trash2, Image as ImageIcon, Edit, Megaphone, Save, Layout,
    CreditCard, AlertTriangle, Plus, Tag, CheckCircle, X,
    ChevronDown, Settings, ChevronUp, GalleryHorizontal, CheckSquare,
    Truck, Package, EyeOff, Disc, ClipboardList
} from 'lucide-react';
import { supabase } from '@/lib/supabase'; // Certifique-se que este arquivo existe

// --- CONFIGURAÇÃO DOS SLOTS (Locais onde os banners aparecem) ---
const SLOT_GROUPS = {
    'Página Inicial': [
        { value: 'home-topo', label: 'Topo (Aviso)' },
        { value: 'home-slides', label: 'Sessão Principal Inicio' },
        { value: 'home-sessao-carrossel', label: 'Banner Principal' },
        { value: 'home-sessao-heli', label: 'Sessão Heli' },
        { value: 'home-sessao-pilares', label: 'Sessão Pilares' },
        { value: 'home-sessao-frotas', label: 'Sessão Frota' },
        { value: 'home-sessao-locacao', label: 'Sessão Locação' },
        { value: 'home-sessao-mapa', label: 'Sessão Mapa' },
        { value: 'home-sessao-contato', label: 'Sessão Contato' },
    ],
    'Catálogo': [
        { value: 'catalogo-topo', label: 'Topo (Aviso)' },
        { value: 'catalogo-sessao-hero', label: 'Banner Hero' },
        { value: 'catalogo-itens', label: 'Entre Itens' },
    ],
    'Institucional': [
        { value: 'sobre-topo', label: 'Sobre - Topo' },
        { value: 'promocional-1', label: 'Campanha Promo 1' },
    ],
    'Páginas de Produtos': [
        { value: 'pecas-topo', label: 'Peças - Topo' },
        { value: 'pecas-rodape', label: 'Peças - Rodapé' },
        { value: 'pneus-topo', label: 'Pneus - Topo' },
        { value: 'pneus-rodape', label: 'Pneus - Rodapé' },
        { value: 'servicos-topo', label: 'Serviços - Topo' },
        { value: 'servicos-rodape', label: 'Serviços - Rodapé' },
    ]
};

// --- TYPES ---
interface CarouselItem {
    title: string;
    description: string;
    imageUrl: string;
    link: string;
}

interface BannerConfig {
    id?: string;
    ids: string[];
    name: string;
    isActive: boolean;
    layout: 'full' | 'compact' | 'alert' | 'carousel';
    title: string;
    description: string;
    imageUrl: string;
    ctaText: string;
    ctaLink: string;
    carouselItems: CarouselItem[];
    bgColor: string;
    textColor: string;
    btnColor: string;
    btnTextColor: string;
    imagePosition: 'left' | 'right';
}

interface AdminItem {
    id?: string;
    name: string;
    price: number;
    description: string;
    image_url: string;
    brand?: string;
    model?: string;
    year?: string | number;
    capacity?: number;
    engine?: string;
    voltage?: number;
    manufacturer?: string;
    quantity?: number;
    application?: string; // Adicionado para peças
    serviceType?: string; // Adicionado para serviços
    type?: 'MACHINE' | 'PART' | 'TIRE' | 'SERVICE';
}

// --- SUB-COMPONENTES DO FORMULÁRIO ---

function CommonFields({ formData, setFormData }: { formData: AdminItem, setFormData: any }) {
    return (
        <>
            <div>
                <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Nome</label>
                <input
                    required
                    className="border p-2.5 w-full rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500"
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                />
            </div>
            <div>
                <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Descrição</label>
                <textarea
                    className="border p-2.5 w-full rounded-lg text-sm resize-none focus:ring-2 focus:ring-blue-500 outline-none"
                    rows={3}
                    value={formData.description}
                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                />
            </div>
            <div>
                <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Quantidade</label>
                <input
                    type="number"
                    className="border p-2.5 w-full rounded-lg text-sm font-bold text-slate-700"
                    value={formData.quantity}
                    onChange={e => setFormData({ ...formData, quantity: Number(e.target.value) })}
                />
            </div>
        </>
    );
}

function MachineFields({ formData, setFormData }: { formData: AdminItem, setFormData: any }) {
    return (
        <div className="grid grid-cols-2 gap-3 bg-slate-50 p-3 rounded-lg border border-slate-100">
            <h4 className="col-span-2 text-xs font-bold text-blue-600 uppercase mb-1">Dados Técnicos</h4>
            <input placeholder="Marca" className="border p-2 rounded text-sm" value={formData.brand || ''} onChange={e => setFormData({ ...formData, brand: e.target.value })} />
            <input placeholder="Modelo" className="border p-2 rounded text-sm" value={formData.model || ''} onChange={e => setFormData({ ...formData, model: e.target.value })} />
            <input type="number" placeholder="Ano" className="border p-2 rounded text-sm" value={formData.year || ''} onChange={e => setFormData({ ...formData, year: Number(e.target.value) })} />
            <input type="number" placeholder="Capacidade (kg)" className="border p-2 rounded text-sm" value={formData.capacity || ''} onChange={e => setFormData({ ...formData, capacity: Number(e.target.value) })} />
        </div>
    );
}

function PartFields({ formData, setFormData }: { formData: AdminItem, setFormData: any }) {
    return (
        <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
            <h4 className="text-xs font-bold text-blue-600 uppercase mb-2">Especificação</h4>
            <input placeholder="Fabricante" className="border p-2 rounded text-sm w-full mb-2" value={formData.manufacturer || ''} onChange={e => setFormData({ ...formData, manufacturer: e.target.value })} />
            <input placeholder="Aplicação / Modelo compatível" className="border p-2 rounded text-sm w-full" value={formData.application || ''} onChange={e => setFormData({ ...formData, application: e.target.value })} />
        </div>
    );
}

function ServiceFields({ formData, setFormData }: { formData: AdminItem, setFormData: any }) {
    return (
        <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
            <h4 className="text-xs font-bold text-blue-600 uppercase mb-2">Detalhes do Serviço</h4>
            <select className="border p-2 rounded text-sm w-full" value={formData.serviceType || ''} onChange={e => setFormData({ ...formData, serviceType: e.target.value })}>
                <option value="">Selecione o tipo de serviço</option>
                <option value="manutencao">Manutenção</option>
                <option value="reforma">Reforma</option>
                <option value="inspecao">Inspeção</option>
            </select>
        </div>
    );
}

function ImageUpload({ formData, onUpload }: { formData: any; onUpload: (e: React.ChangeEvent<HTMLInputElement>) => void }) {
    return (
        <div className="border-2 border-dashed border-slate-300 rounded-lg h-32 flex flex-col items-center justify-center relative bg-slate-50 hover:bg-blue-50 transition-colors group">
            <input type="file" onChange={onUpload} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
            {formData.image_url ? (
                <img src={formData.image_url} alt="Preview" className="h-full w-full object-contain p-2" />
            ) : (
                <>
                    <ImageIcon className="text-slate-400 mb-1 group-hover:text-blue-500" size={24} />
                    <span className="text-xs text-slate-400 group-hover:text-blue-600">Foto do Item</span>
                </>
            )}
        </div>
    );
}

function FormActions({ loading, onCancel }: { loading: boolean; onCancel: () => void }) {
    return (
        <div className="pt-2 flex gap-2">
            <button type="button" onClick={onCancel} className="flex-1 py-3 rounded-lg font-bold text-slate-600 hover:bg-slate-100 transition">Cancelar</button>
            <button type="submit" disabled={loading} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-bold shadow-lg transition flex justify-center items-center gap-2">
                {loading ? '...' : <><Save size={18} /> Salvar</>}
            </button>
        </div>
    );
}

// --- PÁGINA PRINCIPAL ---

export default function AdminPage() {
    const params = useParams();
    const router = useRouter();
    // ATENÇÃO: Em produção, use autenticação real (NextAuth/Clerk/Supabase Auth)
    const secret = params.secret;
    const VALID_SECRET = '019abc6c-62d4-765f-83f6-cc3226df3f9a';

    const [activeTab, setActiveTab] = useState<'empilhadeiras' | 'banners'>('empilhadeiras');
    const [subTab, setSubTab] = useState<'machines' | 'parts' | 'tires' | 'services'>('machines');
    
    // Estados de Itens
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [items, setItems] = useState<AdminItem[]>([]);
    const [loading, setLoading] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);

    const initialFormState: AdminItem = {
        name: '', price: 0, description: '', image_url: '',
        brand: '', model: '', year: '', capacity: 0, engine: '', voltage: 0,
        manufacturer: '', quantity: 0, type: 'MACHINE', application: '', serviceType: ''
    };
    const [formData, setFormData] = useState<AdminItem>(initialFormState);

    // Estados de Banners
    const [banners, setBanners] = useState<BannerConfig[]>([]);
    const [bannerLoading, setBannerLoading] = useState(false);
    const [isBannerFormOpen, setIsBannerFormOpen] = useState(false);
    const [showAdvanced, setShowAdvanced] = useState(false);

    const initialBannerState: BannerConfig = {
        ids: [], name: '', isActive: true, layout: 'full', title: '', description: '',
        imageUrl: '', ctaText: 'Saiba Mais', ctaLink: '', carouselItems: [],
        bgColor: '#005831', textColor: '#FFFFFF', btnColor: '#EAB308', btnTextColor: '#005831', imagePosition: 'left'
    };
    const [bannerForm, setBannerForm] = useState<BannerConfig>(initialBannerState);
    const [editingBannerId, setEditingBannerId] = useState<string | null>(null);

    useEffect(() => {
        if (secret !== VALID_SECRET) {
            router.push('/');
            return;
        }
        fetchData();
        fetchBanners();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [subTab]);

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

            const res = await fetch(url);
            const data = await res.json();

            if (Array.isArray(data)) {
                const normalized = data.map((item: any) => ({
                    ...item,
                    image_url: item.image_url || item.imageUrl, // Garante compatibilidade
                    brand: subTab === 'machines' ? item.brand : (item.manufacturer || item.brand),
                    type: subTab === 'machines' ? 'MACHINE' : item.type
                }));
                setItems(normalized);
            } else {
                setItems([]);
            }
        } catch (error) {
            console.error("Erro ao buscar:", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchBanners = async () => {
        try {
            const res = await fetch('/api/banners');
            const data = await res.json();
            
            // Mapeamento atualizado para sua tabela real
            const formatted = data.map((b: any) => ({
                id: b.id,
                ids: b.ids || [], // Agora lê direto de 'ids'
                name: b.name,
                isActive: b.is_active,
                layout: b.layout,
                title: b.title,
                description: b.description,
                ctaText: b.cta_text,
                ctaLink: b.cta_link,
                imageUrl: b.image_url,
                carouselItems: b.carousel_items || [], // Lê de 'carousel_items'
                bgColor: b.bg_color,
                textColor: b.text_color,
                btnColor: b.btn_color,          // Lê de 'btn_color'
                btnTextColor: b.btn_text_color, // Lê de 'btn_text_color'
                imagePosition: b.image_position
            }));
            setBanners(formatted);
        } catch (error) {
            console.error("Erro ao buscar banners", error);
        }
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'item' | 'banner', bannerIndex?: number) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const BUCKET_NAME = 'files-site-somos'; // Confirme se este é o nome correto no seu Supabase
        const fileExt = file.name.split('.').pop();
        const fileName = `${type}-${Date.now()}.${fileExt}`;

        try {
            const { error } = await supabase.storage.from(BUCKET_NAME).upload(fileName, file);
            if (error) throw error;

            const { data } = supabase.storage.from(BUCKET_NAME).getPublicUrl(fileName);
            const publicUrl = data.publicUrl;

            if (type === 'item') {
                setFormData({ ...formData, image_url: publicUrl });
            } else {
                if (bannerIndex !== undefined) {
                    const newItems = [...bannerForm.carouselItems];
                    newItems[bannerIndex].imageUrl = publicUrl;
                    setBannerForm({ ...bannerForm, carouselItems: newItems });
                } else {
                    setBannerForm({ ...bannerForm, imageUrl: publicUrl });
                }
            }
        } catch (err) {
            console.error(err);
            alert('Erro no upload. Verifique as permissões do Bucket no Supabase.');
        }
    };

    // --- AÇÕES DE ITENS ---
    const handleAddNewItem = () => { setFormData(initialFormState); setEditingId(null); setIsFormOpen(true); window.scrollTo({ top: 0, behavior: 'smooth' }); };
    
    const handleEditItemClick = (item: AdminItem) => {
        setFormData({
            ...initialFormState, // garante reset de campos não existentes
            ...item,
            brand: subTab === 'machines' ? item.brand : '',
            manufacturer: subTab !== 'machines' ? (item.brand || item.manufacturer) : ''
        });
        setEditingId(item.id!);
        setIsFormOpen(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleCancelItemEdit = () => { setFormData(initialFormState); setEditingId(null); setIsFormOpen(false); };

    const handleDeleteItem = async (id: string) => {
        if (!confirm('Tem certeza?')) return;
        const url = subTab === 'machines' ? `/api/empilhadeiras?id=${id}` : `/api/products?id=${id}`;
        await fetch(url, { method: 'DELETE' });
        fetchData();
    };

    const handleSubmitItem = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            let url = '';
            let payload: any = { ...formData };
            delete payload.price; // Se não usar preço, remove

            // Conversões de tipo numérico
            if (payload.capacity) payload.capacity = Number(payload.capacity);
            if (payload.voltage) payload.voltage = Number(payload.voltage);
            if (payload.quantity) payload.quantity = Number(payload.quantity);

            if (subTab === 'machines') {
                url = '/api/empilhadeiras';
                // Remove campos irrelevantes para máquinas
                delete payload.manufacturer; 
                delete payload.type; 
                delete payload.quantity;
                delete payload.application;
                delete payload.serviceType;
            } else {
                url = '/api/products';
                const typeMap: any = { 'parts': 'PART', 'tires': 'TIRE', 'services': 'SERVICE' };
                payload.type = typeMap[subTab];
                // Remove campos irrelevantes para produtos
                delete payload.brand;
                delete payload.engine;
                delete payload.voltage;
                delete payload.year;
                delete payload.capacity;
            }

            if (editingId) payload.id = editingId;
            else delete payload.id;

            const res = await fetch(url, {
                method: editingId ? 'PUT' : 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                alert('Salvo com sucesso!');
                handleCancelItemEdit();
                fetchData();
            } else {
                alert('Erro ao salvar item.');
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    // --- AÇÕES DE BANNERS ---
    const handleSlotToggle = (slotValue: string) => {
        const currentIds = bannerForm.ids || [];
        if (currentIds.includes(slotValue)) {
            setBannerForm({ ...bannerForm, ids: currentIds.filter(id => id !== slotValue) });
        } else {
            setBannerForm({ ...bannerForm, ids: [...currentIds, slotValue] });
        }
    };
    const addCarouselItem = () => setBannerForm({ ...bannerForm, carouselItems: [...bannerForm.carouselItems, { title: '', description: '', imageUrl: '', link: '' }] });
    const removeCarouselItem = (index: number) => setBannerForm({ ...bannerForm, carouselItems: bannerForm.carouselItems.filter((_, i) => i !== index) });
    const updateCarouselItem = (index: number, field: keyof CarouselItem, value: string) => {
        const newItems = [...bannerForm.carouselItems];
        newItems[index] = { ...newItems[index], [field]: value };
        setBannerForm({ ...bannerForm, carouselItems: newItems });
    };

    const handleEditBannerClick = (banner: BannerConfig) => {
        setBannerForm({
            ...initialBannerState,
            ...banner,
            ids: banner.ids || [],
            carouselItems: banner.carouselItems || [],
            bgColor: banner.bgColor || initialBannerState.bgColor,
            textColor: banner.textColor || initialBannerState.textColor,
            imagePosition: banner.imagePosition || initialBannerState.imagePosition
        });
        setEditingBannerId(banner.id || null);
        setIsBannerFormOpen(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleNewBannerClick = () => { setBannerForm(initialBannerState); setEditingBannerId(null); setIsBannerFormOpen(true); window.scrollTo({ top: 0, behavior: 'smooth' }); };
    const handleCancelBannerEdit = () => { setBannerForm(initialBannerState); setEditingBannerId(null); setIsBannerFormOpen(false); };
    
    const handleDeleteBanner = async (id: string) => { 
        if (!confirm('Tem certeza?')) return; 
        await fetch(`/api/banners?id=${id}`, { method: 'DELETE' }); 
        fetchBanners(); 
    };

    const handleSaveBanner = async (e: React.FormEvent) => {
        e.preventDefault();
        setBannerLoading(true);
        try {
            const payload = { ...bannerForm };
            // Mapeia de volta para o formato que sua API espera (se necessário, caso sua API espere target_slots)
            // A API que forneci anteriormente lida com "ids" convertendo para "target_slots", então aqui mandamos como está.
            if (editingBannerId) payload.id = editingBannerId;

            const method = editingBannerId ? 'PUT' : 'POST';
            const res = await fetch('/api/banners', { 
                method, 
                headers: { 'Content-Type': 'application/json' }, 
                body: JSON.stringify(payload) 
            });
            
            if (res.ok) { 
                alert("Banner salvo!"); 
                handleCancelBannerEdit(); 
                fetchBanners(); 
            } else { 
                alert("Erro ao salvar banner"); 
            }
        } catch (error) { 
            console.error(error); 
        } finally { 
            setBannerLoading(false); 
        }
    };

    if (secret !== VALID_SECRET) return null;

    const activeBanners = banners.filter(b => b.isActive);
    const inactiveBanners = banners.filter(b => !b.isActive);

    return (
        <div className="min-h-screen bg-slate-50 p-4 md:p-8 font-sans text-slate-900">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-800">Painel Administrativo</h1>
                        <p className="text-slate-500 text-sm">Controle total do conteúdo do site</p>
                    </div>
                    <div className="flex bg-white p-1 rounded-lg border border-slate-200 shadow-sm">
                        <button onClick={() => setActiveTab('empilhadeiras')} className={`px-4 py-2 rounded-md text-sm font-bold flex items-center gap-2 transition-colors ${activeTab === 'empilhadeiras' ? 'bg-blue-600 text-white' : 'text-slate-600 hover:bg-slate-50'}`}><Edit size={16} /> Gerenciar Estoque</button>
                        <button onClick={() => setActiveTab('banners')} className={`px-4 py-2 rounded-md text-sm font-bold flex items-center gap-2 transition-colors ${activeTab === 'banners' ? 'bg-purple-600 text-white' : 'text-slate-600 hover:bg-slate-50'}`}><Megaphone size={16} /> Banners & Marketing</button>
                    </div>
                </div>

                {activeTab === 'empilhadeiras' && (
                    <div className="space-y-6">
                        <div className="flex flex-col xl:flex-row justify-between items-center gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                            <div className="flex flex-wrap gap-2 bg-slate-100 p-1 rounded-lg w-full xl:w-auto">
                                <button onClick={() => setSubTab('machines')} className={`px-4 py-2 rounded-md text-sm font-bold flex items-center gap-2 transition-all ${subTab === 'machines' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}><Truck size={16} /> Máquinas</button>
                                <button onClick={() => setSubTab('parts')} className={`px-4 py-2 rounded-md text-sm font-bold flex items-center gap-2 transition-all ${subTab === 'parts' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}><Settings size={16} /> Peças</button>
                                <button onClick={() => setSubTab('tires')} className={`px-4 py-2 rounded-md text-sm font-bold flex items-center gap-2 transition-all ${subTab === 'tires' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}><Disc size={16} /> Pneus</button>
                                <button onClick={() => setSubTab('services')} className={`px-4 py-2 rounded-md text-sm font-bold flex items-center gap-2 transition-all ${subTab === 'services' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}><ClipboardList size={16} /> Serviços</button>
                            </div>
                            <div className="flex items-center gap-3 w-full xl:w-auto">
                                <button onClick={handleAddNewItem} className="bg-[#005831] hover:bg-[#004626] text-white px-6 py-2.5 rounded-lg text-sm font-bold flex items-center gap-2 shadow-lg transition-colors whitespace-nowrap w-full justify-center">
                                    <Plus size={18} />
                                    Cadastrar {subTab === 'machines' ? 'Máquina' : subTab === 'parts' ? 'Peça' : subTab === 'tires' ? 'Pneu' : 'Serviço'}
                                </button>
                            </div>
                        </div>

                        <div className="grid grid-cols-12 gap-6 items-start transition-all">
                            {isFormOpen && (
                                <div className="col-span-12 lg:col-span-4 bg-white p-6 rounded-xl shadow-xl border border-slate-200 border-t-4 border-t-blue-500 sticky top-4 z-10">
                                    <div className="flex justify-between items-center mb-6">
                                        <h2 className="font-bold text-lg flex items-center gap-2 text-slate-800">
                                            {editingId ? <Edit size={20} className="text-blue-600" /> : <Plus size={20} className="text-green-600" />}
                                            {editingId ? 'Editar Item' : 'Novo Item'}
                                        </h2>
                                        <button onClick={handleCancelItemEdit} className="p-1 hover:bg-slate-100 rounded-full text-slate-400 hover:text-red-500 transition-colors"><X size={20} /></button>
                                    </div>

                                    <form onSubmit={handleSubmitItem} className="space-y-4">
                                        <CommonFields formData={formData} setFormData={setFormData} />
                                        {subTab === 'machines' && <MachineFields formData={formData} setFormData={setFormData} />}
                                        {(subTab === 'parts' || subTab === 'tires') && <PartFields formData={formData} setFormData={setFormData} />}
                                        {subTab === 'services' && <ServiceFields formData={formData} setFormData={setFormData} />}
                                        
                                        <ImageUpload 
                                            formData={formData} 
                                            onUpload={(e: any) => handleImageUpload(e, 'item')} 
                                        />
                                        
                                        <FormActions loading={loading} onCancel={handleCancelItemEdit} />
                                    </form>
                                </div>
                            )}

                            <div className={`col-span-12 ${isFormOpen ? 'lg:col-span-8' : 'lg:col-span-12'} transition-all`}>
                                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                                    {items.map(p => (
                                        <div key={p.id} className={`bg-white rounded-xl border w-full h-full shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col ${editingId === p.id ? 'ring-2 ring-blue-500 border-transparent' : 'border-slate-200'}`}>
                                            <div className="h-32 bg-slate-100 relative flex items-center justify-center overflow-hidden">
                                                {p.image_url ? <img src={p.image_url} className="h-full object-contain" alt={p.name} /> : <Package className="text-slate-300" />}
                                                <span className="absolute top-2 left-2 bg-white/90 px-2 py-0.5 rounded text-[10px] font-bold uppercase text-slate-600">{subTab === 'machines' ? 'MÁQUINA' : p.type}</span>
                                            </div>
                                            <div className="p-3 flex flex-col flex-1">
                                                <h4 className="font-bold text-slate-800 text-sm mb-1 line-clamp-1">{p.name}</h4>
                                                <p className="text-[10px] uppercase text-slate-500 mb-2">{p.brand || 'Genérico'}</p>
                                                <div className="mt-auto flex justify-between items-center pt-2 border-t border-slate-100">
                                                    <span className="font-bold text-[#005831] text-sm">Qtd: {p.quantity}</span>
                                                    <div className="flex gap-1">
                                                        <button onClick={() => handleEditItemClick(p)} className="p-1.5 text-blue-500 hover:bg-blue-50 rounded"><Edit size={14} /></button>
                                                        <button onClick={() => handleDeleteItem(p.id!)} className="p-1.5 text-red-500 hover:bg-red-50 rounded"><Trash2 size={14} /></button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                {items.length === 0 && !loading && (
                                    <div className="text-center py-10 text-slate-400">Nenhum item encontrado nesta categoria.</div>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* ABA BANNERS */}
                {activeTab === 'banners' && (
                    <div className="space-y-6">
                        <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                            <h2 className="font-bold text-slate-700 flex items-center gap-2"><Megaphone size={20} className="text-purple-600" /> Campanhas & Banners</h2>
                            <button onClick={handleNewBannerClick} className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 shadow-lg transition-colors"><Plus size={18} /> Criar Novo Banner</button>
                        </div>

                        <div className="grid grid-cols-12 gap-6 items-start transition-all">
                            {isBannerFormOpen && (
                                <div className="col-span-12 lg:col-span-5 bg-white p-6 rounded-xl shadow-xl border border-slate-200 border-t-4 border-t-purple-500 sticky top-4 z-20">
                                    <div className="flex justify-between items-center mb-6">
                                        <h2 className="font-bold text-lg flex items-center gap-2 text-slate-800">
                                            {editingBannerId ? <Edit size={20} className="text-blue-600" /> : <Plus size={20} className="text-green-600" />}
                                            {editingBannerId ? 'Editar Banner' : 'Novo Banner'}
                                        </h2>
                                        <button onClick={handleCancelBannerEdit} className="p-1 hover:bg-slate-100 rounded-full text-slate-400 hover:text-red-500 transition-colors"><X size={20} /></button>
                                    </div>

                                    <form onSubmit={handleSaveBanner} className="space-y-6">
                                        <div className="grid md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Nome Interno</label>
                                                <input required value={bannerForm.name} onChange={e => setBannerForm({ ...bannerForm, name: e.target.value })} placeholder="Ex: Promo Natal" className="w-full border p-2 rounded text-sm" />
                                            </div>
                                            <div className="col-span-1 md:col-span-2">
                                                <label className="text-sm font-bold text-slate-700 mb-3 flex items-center gap-2"><Tag size={16} className="text-purple-600" /> Onde este banner vai aparecer?</label>
                                                <div className="bg-slate-50 rounded-xl border border-slate-200 p-4 space-y-6 max-h-[400px] overflow-y-auto custom-scrollbar">
                                                    {Object.entries(SLOT_GROUPS).map(([group, slots]) => (
                                                        <div key={group}>
                                                            <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2 after:content-[''] after:flex-1 after:h-px after:bg-slate-200">{group}</h4>
                                                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                                                                {slots.map(slot => {
                                                                    const isSelected = bannerForm.ids.includes(slot.value);
                                                                    return (
                                                                        <div key={slot.value} onClick={() => handleSlotToggle(slot.value)} className={`relative cursor-pointer rounded-lg border px-2 py-2 transition-all duration-200 flex items-center gap-1 group select-none ${isSelected ? 'bg-purple-600 border-purple-600 text-white shadow-md shadow-purple-200 transform scale-[1.02]' : 'bg-white border-slate-200 text-slate-600 hover:border-purple-300 hover:shadow-sm'}`}>
                                                                            <div className={`w-6 h-6 rounded flex items-center justify-center transition-colors border ${isSelected ? 'bg-white/20 border-white/50' : 'bg-slate-100 border-slate-300 group-hover:border-purple-300'}`}>{isSelected && <CheckSquare size={14} className="text-white" />}</div>
                                                                            <div className="flex flex-col"><span className={`text-xs font-bold ${isSelected ? 'text-white' : 'text-slate-700'}`}>{slot.label}</span></div>
                                                                        </div>
                                                                    );
                                                                })}
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-bold text-slate-700 mb-2">Estilo Visual</label>
                                            <div className="grid grid-cols-4 gap-2">
                                                {['full', 'compact', 'alert', 'carousel'].map((layout) => (
                                                    <button key={layout} type="button" onClick={() => setBannerForm({ ...bannerForm, layout: layout as any })} className={`p-2 border rounded flex flex-col items-center gap-1 transition-all ${bannerForm.layout === layout ? 'border-purple-600 bg-purple-50 text-purple-900 ring-1 ring-purple-500' : 'border-slate-200 hover:bg-slate-50'}`}>
                                                        {layout === 'full' && <Layout size={18} />}
                                                        {layout === 'compact' && <CreditCard size={18} />}
                                                        {layout === 'alert' && <AlertTriangle size={18} />}
                                                        {layout === 'carousel' && <GalleryHorizontal size={18} />}
                                                        <span className="text-[10px] font-bold uppercase">{layout}</span>
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        {bannerForm.layout === 'carousel' ? (
                                            <div className="space-y-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
                                                <div className="flex justify-between"><label className="text-sm font-bold">Slides</label><button type="button" onClick={addCarouselItem} className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">+ Add</button></div>
                                                {bannerForm.carouselItems.map((item, idx) => (
                                                    <div key={idx} className="border p-3 rounded bg-white relative space-y-2">
                                                        <button type="button" onClick={() => removeCarouselItem(idx)} className="absolute top-2 right-2 text-red-400"><X size={14} /></button>
                                                        <p className="text-xs font-bold text-slate-400">Slide {idx + 1}</p>
                                                        <div className="grid grid-cols-3 gap-2">
                                                            <div className="border-2 border-dashed h-20 flex items-center justify-center relative"><input type="file" onChange={e => handleImageUpload(e, 'banner', idx)} className="absolute inset-0 opacity-0 cursor-pointer" />{item.imageUrl ? <img src={item.imageUrl} className="h-full w-full object-cover" alt="slide" /> : <ImageIcon size={16} />}</div>
                                                            <div className="col-span-2 space-y-1"><input placeholder="Título" value={item.title} onChange={e => updateCarouselItem(idx, 'title', e.target.value)} className="w-full border p-1 rounded text-xs" /><input placeholder="Descrição" value={item.description} onChange={e => updateCarouselItem(idx, 'description', e.target.value)} className="w-full border p-1 rounded text-xs" /><input placeholder="Link" value={item.link} onChange={e => updateCarouselItem(idx, 'link', e.target.value)} className="w-full border p-1 rounded text-xs" /></div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="space-y-3">
                                                <input value={bannerForm.title} onChange={e => setBannerForm({ ...bannerForm, title: e.target.value })} placeholder="Título Principal" className="w-full border p-2 rounded font-bold" />
                                                <textarea value={bannerForm.description} onChange={e => setBannerForm({ ...bannerForm, description: e.target.value })} placeholder="Descrição..." rows={2} className="w-full border p-2 rounded resize-none" />
                                                <div className="grid grid-cols-2 gap-2">
                                                    <input value={bannerForm.ctaText} onChange={e => setBannerForm({ ...bannerForm, ctaText: e.target.value })} placeholder="Texto Botão" className="border p-2 rounded text-sm" />
                                                    <input value={bannerForm.ctaLink} onChange={e => setBannerForm({ ...bannerForm, ctaLink: e.target.value })} placeholder="Link" className="border p-2 rounded text-sm" />
                                                </div>
                                                {bannerForm.layout !== 'alert' && (
                                                    <div className="border-2 border-dashed p-4 text-center relative bg-slate-50 rounded-lg"><input type="file" onChange={e => handleImageUpload(e, 'banner')} className="absolute inset-0 opacity-0 cursor-pointer" />{bannerForm.imageUrl ? <img src={bannerForm.imageUrl} className="h-24 w-full object-cover mx-auto" alt="banner bg" /> : <span className="text-xs text-slate-400 flex items-center justify-center gap-2"><ImageIcon size={16} /> Imagem de Fundo</span>}</div>
                                                )}
                                            </div>
                                        )}

                                        <div className="border-t pt-4 flex flex-col gap-4">
                                            <button type="button" onClick={() => setShowAdvanced(!showAdvanced)} className="text-xs font-bold text-slate-500 flex items-center gap-1 w-full justify-between p-2 hover:bg-slate-50 rounded"><span className="flex gap-1 items-center"><Settings size={14} /> Personalização (Cores)</span>{showAdvanced ? <ChevronUp size={14} /> : <ChevronDown size={14} />}</button>
                                            {showAdvanced && (
                                                <div className="p-3 bg-slate-50 rounded border space-y-3 animate-in fade-in">
                                                    {bannerForm.layout !== 'alert' && bannerForm.layout !== 'carousel' && (
                                                        <div className="flex gap-4"><label className="flex items-center gap-1"><input type="radio" checked={bannerForm.imagePosition === 'left'} onChange={() => setBannerForm({ ...bannerForm, imagePosition: 'left' })} /><span className="text-xs">Esq</span></label><label className="flex items-center gap-1"><input type="radio" checked={bannerForm.imagePosition === 'right'} onChange={() => setBannerForm({ ...bannerForm, imagePosition: 'right' })} /><span className="text-xs">Dir</span></label></div>
                                                    )}
                                                    <div className="grid grid-cols-2 gap-2">
                                                        <div><span className="text-xs">Fundo</span><div className="flex"><input type="color" value={bannerForm.bgColor} onChange={e => setBannerForm({ ...bannerForm, bgColor: e.target.value })} className="h-6 w-6" /><input value={bannerForm.bgColor} onChange={e => setBannerForm({ ...bannerForm, bgColor: e.target.value })} className="w-full border text-xs" /></div></div>
                                                        <div><span className="text-xs">Texto</span><div className="flex"><input type="color" value={bannerForm.textColor} onChange={e => setBannerForm({ ...bannerForm, textColor: e.target.value })} className="h-6 w-6" /><input value={bannerForm.textColor} onChange={e => setBannerForm({ ...bannerForm, textColor: e.target.value })} className="w-full border text-xs" /></div></div>
                                                    </div>
                                                </div>
                                            )}
                                            <div className="flex justify-between items-center pt-2 border-t">
                                                <label className="flex gap-2 items-center cursor-pointer"><input type="checkbox" checked={bannerForm.isActive} onChange={e => setBannerForm({ ...bannerForm, isActive: e.target.checked })} /><span className="text-sm font-bold text-slate-700">Ativo</span></label>
                                                <button type="submit" disabled={bannerLoading} className="bg-purple-600 text-white px-6 py-2 rounded-lg font-bold shadow transition hover:bg-purple-700">{bannerLoading ? '...' : 'Salvar'}</button>
                                            </div>
                                        </div>
                                    </form>
                                </div>
                            )}

                            <div className={`col-span-12 ${isBannerFormOpen ? 'lg:col-span-7' : 'lg:col-span-12'} transition-all duration-300`}>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-3">
                                        <h3 className="text-sm font-bold text-green-700 uppercase flex items-center gap-2"><CheckCircle size={16} /> Banners Ativos</h3>
                                        {activeBanners.length === 0 && <p className="text-xs text-slate-400 italic">Nenhum banner ativo.</p>}
                                        {activeBanners.map((banner) => (
                                            <div key={banner.id} onClick={() => handleEditBannerClick(banner)} className={`bg-white p-4 rounded-xl border border-green-200 shadow-sm hover:shadow-md cursor-pointer transition group relative overflow-hidden ${editingBannerId === banner.id ? 'ring-2 ring-purple-500' : ''}`}>
                                                <div className="absolute top-0 left-0 w-1 h-full bg-green-500"></div>
                                                <div className="flex justify-between items-start mb-2 pl-2">
                                                    <span className="text-[10px] font-bold uppercase text-slate-500 bg-slate-100 px-2 py-0.5 rounded">{banner.layout}</span>
                                                    <button onClick={(e) => { e.stopPropagation(); handleDeleteBanner(banner.id!) }} className="text-slate-300 hover:text-red-500"><Trash2 size={14} /></button>
                                                </div>
                                                <h4 className="font-bold text-slate-800 text-sm pl-2 mb-1">{banner.name}</h4>
                                                <div className="pl-2 flex flex-wrap gap-1">
                                                    {banner.ids.slice(0, 3).map(id => <span key={id} className="text-[9px] text-purple-700 bg-purple-50 px-1 rounded border border-purple-100">{id}</span>)}
                                                    {banner.ids.length > 3 && <span className="text-[9px] text-slate-400">+{banner.ids.length - 3}</span>}
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="space-y-3">
                                        <h3 className="text-sm font-bold text-slate-500 uppercase flex items-center gap-2"><EyeOff size={16} /> Rascunhos / Inativos</h3>
                                        {inactiveBanners.length === 0 && <p className="text-xs text-slate-400 italic">Nenhum banner inativo.</p>}
                                        {inactiveBanners.map((banner) => (
                                            <div key={banner.id} onClick={() => handleEditBannerClick(banner)} className={`bg-slate-50 p-4 rounded-xl border border-slate-200 cursor-pointer transition hover:bg-white group opacity-70 hover:opacity-100 ${editingBannerId === banner.id ? 'ring-2 ring-purple-500' : ''}`}>
                                                <div className="flex justify-between items-start mb-2">
                                                    <span className="text-[10px] font-bold uppercase text-slate-400">{banner.layout}</span>
                                                    <button onClick={(e) => { e.stopPropagation(); handleDeleteBanner(banner.id!) }} className="text-slate-300 hover:text-red-500"><Trash2 size={14} /></button>
                                                </div>
                                                <h4 className="font-bold text-slate-600 text-sm mb-1">{banner.name}</h4>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}