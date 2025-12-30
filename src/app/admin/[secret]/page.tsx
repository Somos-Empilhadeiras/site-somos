'use client';
import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
    Trash2, Upload, Image as ImageIcon, Edit, Megaphone, Save, Layout,
    CreditCard, AlertTriangle, Plus, Tag, CheckCircle, X, Palette,
    ChevronDown, Settings, ChevronUp, Monitor, GalleryHorizontal, CheckSquare,
    Truck, Package, Search, Filter,
    EyeOff
} from 'lucide-react';

// --- CONFIGURAÇÃO DOS SLOTS (AGRUPADOS) ---
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
    _id?: string;
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

// INTERFACE PRODUTO
interface EmpihladeiraData {
    _id?: string;
    name: string;
    brand: string;
    model: string;
    year: string;
    price: number;
    engine: string;
    capacity: number;
    voltage: number;
    description: string;
    imageUrl: string;
    // Futuramente você pode adicionar 'category': 'machine' | 'part'
}

export default function AdminPage() {
    const params = useParams();
    const router = useRouter();
    const secret = params.secret;
    const VALID_SECRET = '019abc6c-62d4-765f-83f6-cc3226df3f9a';

    const [activeTab, setActiveTab] = useState<'empilhadeiras' | 'banners'>('empilhadeiras');

    // --- ESTADOS DE UI (PRODUTOS) ---
    const [empilhadeiraSubTab, setEmpilhadeiraSubTab] = useState<'machines' | 'parts'>('machines');
    const [isFormOpen, setIsFormOpen] = useState(false);

    // --- ESTADOS GERAIS ---
    const [showAdvanced, setShowAdvanced] = useState(false);
    const [empilhadeiras, setEmpilhadeiras] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);

    const initialEmpilhadeiraState = {
        name: '', brand: '', model: '', year: new Date().getFullYear().toString(),
        price: 0, engine: 'Elétrico', capacity: 0, voltage: 0, description: '', imageUrl: ''
    };
    const [empilhadeiraForm, setEmpilhadeiraForm] = useState(initialEmpilhadeiraState);

    // --- ESTADOS BANNER ---
    const [banners, setBanners] = useState<BannerConfig[]>([]);
    const [bannerLoading, setBannerLoading] = useState(false);
    const [isBannerFormOpen, setIsBannerFormOpen] = useState(false); // Novo controle de UI

    const initialBannerState: BannerConfig = {
        ids: [],
        name: '',
        isActive: true,
        layout: 'full',
        title: '',
        description: '',
        imageUrl: '',
        ctaText: 'Saiba Mais',
        ctaLink: '',
        carouselItems: [],
        bgColor: '#005831',
        textColor: '#FFFFFF',
        btnColor: '#EAB308',
        btnTextColor: '#005831',
        imagePosition: 'left'
    };
    const [bannerForm, setBannerForm] = useState<BannerConfig>(initialBannerState);
    const [editingBannerId, setEditingBannerId] = useState<string | null>(null);

    // --- LOAD ---
    useEffect(() => {
        if (secret !== VALID_SECRET) {
            alert("Acesso negado");
            router.push('/');
            return;
        }
        fetchEmpilhadeiras();
        fetchBanners();
    }, [secret, router]);

    // Substitua a linha antiga:
    // const fetchEmpilhadeiras = () => { fetch('/api/empilhadeiras').then(res => res.json()).then(setEmpilhadeiras); };

    // Por esta versão segura:
    const fetchEmpilhadeiras = async () => {
        try {
            // Verifique se o caminho da API está correto. Antes era '/api/products'? 
            // Se você mudou a pasta para 'empilhadeiras', mantenha assim. 
            // Caso contrário, volte para '/api/products'.
            const res = await fetch('/api/empilhadeiras');
            const data = await res.json();

            // AQUI ESTÁ A PROTEÇÃO:
            // Só atualizamos o estado se 'data' for realmente uma Lista (Array)
            if (Array.isArray(data)) {
                setEmpilhadeiras(data);
            } else {
                console.error("A API não retornou uma lista. Resposta:", data);
                setEmpilhadeiras([]); // Garante que continue sendo um array vazio para não quebrar a tela
            }
        } catch (error) {
            console.error("Erro na requisição:", error);
            setEmpilhadeiras([]);
        }
    };

    const fetchBanners = () => { fetch('/api/empilhadeiras').then(res => res.json()).then(setBanners); };

    // --- UPLOAD GERAL ---
    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, type: 'empilhadeira' | 'banner', carouselIndex?: number) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 2 * 1024 * 1024) { alert("Imagem muito grande (Max 2MB)."); return; }
            const reader = new FileReader();
            reader.onloadend = () => {
                if (type === 'empilhadeira') {
                    setEmpilhadeiraForm({ ...empilhadeiraForm, imageUrl: reader.result as string });
                } else if (type === 'banner') {
                    if (carouselIndex !== undefined) {
                        const newItems = [...bannerForm.carouselItems];
                        newItems[carouselIndex].imageUrl = reader.result as string;
                        setBannerForm({ ...bannerForm, carouselItems: newItems });
                    } else {
                        setBannerForm({ ...bannerForm, imageUrl: reader.result as string });
                    }
                }
            };
            reader.readAsDataURL(file);
        }
    };

    // --- LÓGICA PRODUTOS ---
    const handleAddNewEmpilhadeira = () => { setEmpilhadeiraForm(initialEmpilhadeiraState); setEditingId(null); setIsFormOpen(true); window.scrollTo({ top: 0, behavior: 'smooth' }); };
    const handleEditEmpilhadeiraClick = (p: any) => { setEmpilhadeiraForm(p); setEditingId(p._id); setIsFormOpen(true); window.scrollTo({ top: 0, behavior: 'smooth' }); };
    const handleCancelEmpilhadeiraEdit = () => { setEmpilhadeiraForm(initialEmpilhadeiraState); setEditingId(null); setIsFormOpen(false); };
    const handleDeleteEmpilhadeira = async (id: string) => { if (!confirm('Tem certeza?')) return; await fetch(`/api/empilhadeiras?id=${id}`, { method: 'DELETE' }); fetchEmpilhadeiras(); };
    const handleSubmitEmpilhadeira = async (e: React.FormEvent) => { e.preventDefault(); setLoading(true); await fetch('/api/empilhadeiras', { method: editingId ? 'PUT' : 'POST', body: JSON.stringify(editingId ? { ...empilhadeiraForm, id: editingId } : empilhadeiraForm) }); fetchEmpilhadeiras(); setLoading(false); handleCancelEmpilhadeiraEdit(); };

    // --- LÓGICA BANNERS ---
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
            ...initialBannerState, ...banner,
            ids: banner.ids || [],
            carouselItems: banner.carouselItems || [],
            bgColor: banner.bgColor || initialBannerState.bgColor,
            textColor: banner.textColor || initialBannerState.textColor,
            btnColor: banner.btnColor || initialBannerState.btnColor,
            btnTextColor: banner.btnTextColor || initialBannerState.btnTextColor,
            imagePosition: banner.imagePosition || initialBannerState.imagePosition
        });
        setEditingBannerId(banner._id || null);
        setIsBannerFormOpen(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };
    const handleNewBannerClick = () => { setBannerForm(initialBannerState); setEditingBannerId(null); setIsBannerFormOpen(true); window.scrollTo({ top: 0, behavior: 'smooth' }); };
    const handleCancelBannerEdit = () => { setBannerForm(initialBannerState); setEditingBannerId(null); setIsBannerFormOpen(false); };
    const handleDeleteBanner = async (id: string) => { if (!confirm('Tem certeza?')) return; await fetch(`/api/banners?id=${id}`, { method: 'DELETE' }); fetchBanners(); };
    const handleSaveBanner = async (e: React.FormEvent) => {
        e.preventDefault();
        setBannerLoading(true);
        try {
            const payload = { ...bannerForm };
            const method = editingBannerId ? 'PUT' : 'POST';
            const res = await fetch('/api/banners', { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
            if (res.ok) { alert("Banner salvo!"); handleCancelBannerEdit(); fetchBanners(); } else { alert("Erro"); }
        } catch (error) { console.error(error); } finally { setBannerLoading(false); }
    };

    if (secret !== VALID_SECRET) return null;

    // Helpers para organização visual
    const activeBanners = banners.filter(b => b.isActive);
    const inactiveBanners = banners.filter(b => !b.isActive);
    return (
        <div className="min-h-screen bg-slate-50 p-4 md:p-8 font-sans text-slate-900">
            <div className="max-w-7xl mx-auto">
                {/* Header & Navigation */}
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

                {/* ================================================================================= */}
                {/* ABA PRODUTOS                                                                      */}
                {/* ================================================================================= */}
                {activeTab === 'empilhadeiras' && (
                    <div className="space-y-6">

                        {/* Sub-navegação e Ações Principais */}
                        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                            <div className="flex gap-2 bg-slate-100 p-1 rounded-lg">
                                <button
                                    onClick={() => setEmpilhadeiraSubTab('machines')}
                                    className={`px-4 py-2 rounded-md text-sm font-bold flex items-center gap-2 transition-all ${empilhadeiraSubTab === 'machines' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                                >
                                    <Truck size={16} /> Empilhadeiras
                                </button>
                                <button
                                    onClick={() => setEmpilhadeiraSubTab('parts')}
                                    className={`px-4 py-2 rounded-md text-sm font-bold flex items-center gap-2 transition-all ${empilhadeiraSubTab === 'parts' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                                >
                                    <Package size={16} /> Peças & Insumos
                                </button>
                            </div>

                            <div className="flex items-center gap-3 w-full sm:w-auto">
                                {/* Busca visual (funcionalidade futura) */}
                                <div className="relative flex-1 sm:flex-none">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                                    <input placeholder="Buscar item..." className="pl-9 pr-4 py-2 rounded-lg border border-slate-200 text-sm w-full focus:ring-2 focus:ring-blue-500 outline-none" />
                                </div>

                                <button
                                    onClick={handleAddNewEmpilhadeira}
                                    className="bg-[#005831] hover:bg-[#004626] text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 shadow-lg transition-colors whitespace-nowrap"
                                >
                                    <Plus size={18} /> Cadastrar {empilhadeiraSubTab === 'machines' ? 'Máquina' : 'Produto'}
                                </button>
                            </div>
                        </div>

                        {/* Layout Principal (Grid) */}
                        <div className="grid grid-cols-12 gap-6 items-start transition-all">

                            {/* FORMULÁRIO (Lado Esquerdo - Só aparece se isFormOpen for true) */}
                            {isFormOpen && (
                                <div className="col-span-12 lg:col-span-4 bg-white p-6 rounded-xl shadow-xl border border-slate-200 border-t-4 border-t-blue-500 animate-in slide-in-from-left-4 duration-300 sticky top-4 z-10">
                                    <div className="flex justify-between items-center mb-6">
                                        <h2 className="font-bold text-lg flex items-center gap-2 text-slate-800">
                                            {editingId ? <Edit size={20} className="text-blue-600" /> : <Plus size={20} className="text-green-600" />}
                                            {editingId ? 'Editar Item' : 'Novo Cadastro'}
                                        </h2>
                                        <button onClick={handleCancelEmpilhadeiraEdit} className="p-1 hover:bg-slate-100 rounded-full text-slate-400 hover:text-red-500 transition-colors">
                                            <X size={20} />
                                        </button>
                                    </div>

                                    <form onSubmit={handleSubmitEmpilhadeira} className="space-y-4">
                                        {/* Campos Comuns */}
                                        <div>
                                            <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Nome do Produto</label>
                                            <input placeholder={empilhadeiraSubTab === 'machines' ? "Ex: Empilhadeira CPCD25" : "Ex: Pneu Maciço 6.00-9"} className="border p-2.5 w-full rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" value={empilhadeiraForm.name} onChange={e => setEmpilhadeiraForm({ ...empilhadeiraForm, name: e.target.value })} required />
                                        </div>

                                        <div className="grid grid-cols-2 gap-3">
                                            <div>
                                                <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Marca</label>
                                                <input placeholder="Ex: Heli" className="border p-2.5 w-full rounded-lg text-sm" value={empilhadeiraForm.brand} onChange={e => setEmpilhadeiraForm({ ...empilhadeiraForm, brand: e.target.value })} />
                                            </div>
                                            <div>
                                                <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Modelo</label>
                                                <input placeholder="Ex: H2000" className="border p-2.5 w-full rounded-lg text-sm" value={empilhadeiraForm.model} onChange={e => setEmpilhadeiraForm({ ...empilhadeiraForm, model: e.target.value })} />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-3">
                                            <div>
                                                <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Preço (R$)</label>
                                                <input type="number" placeholder="0.00" className="border p-2.5 w-full rounded-lg text-sm" value={empilhadeiraForm.price} onChange={e => setEmpilhadeiraForm({ ...empilhadeiraForm, price: Number(e.target.value) })} />
                                            </div>
                                            {/* Campo condicional: Ano só faz sentido para máquinas */}
                                            {empilhadeiraSubTab === 'machines' && (
                                                <div>
                                                    <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Ano</label>
                                                    <input type="number" placeholder="2024" className="border p-2.5 w-full rounded-lg text-sm" value={empilhadeiraForm.year} onChange={e => setEmpilhadeiraForm({ ...empilhadeiraForm, year: e.target.value })} />
                                                </div>
                                            )}
                                        </div>

                                        {/* Campos Específicos de Máquinas */}
                                        {empilhadeiraSubTab === 'machines' && (
                                            <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 space-y-3">
                                                <p className="text-xs font-bold text-blue-600 uppercase">Ficha Técnica</p>
                                                <div className="grid grid-cols-2 gap-3">
                                                    <div>
                                                        <label className="text-[10px] font-bold text-slate-400 uppercase mb-1 block">Motor</label>
                                                        <input placeholder="Diesel/Elétrico" className="border p-2 w-full rounded text-sm" value={empilhadeiraForm.engine} onChange={e => setEmpilhadeiraForm({ ...empilhadeiraForm, engine: e.target.value })} />
                                                    </div>
                                                    <div>
                                                        <label className="text-[10px] font-bold text-slate-400 uppercase mb-1 block">Capacidade (KG)</label>
                                                        <input type="number" placeholder="2500" className="border p-2 w-full rounded text-sm" value={empilhadeiraForm.capacity} onChange={e => setEmpilhadeiraForm({ ...empilhadeiraForm, capacity: Number(e.target.value) })} />
                                                    </div>
                                                    <div className="col-span-2">
                                                        <label className="text-[10px] font-bold text-slate-400 uppercase mb-1 block">Voltagem (V)</label>
                                                        <input type="number" placeholder="48" className="border p-2 w-full rounded text-sm" value={empilhadeiraForm.voltage} onChange={e => setEmpilhadeiraForm({ ...empilhadeiraForm, voltage: Number(e.target.value) })} />
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        <div>
                                            <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Descrição</label>
                                            <textarea placeholder="Detalhes do item..." className="border p-2.5 w-full rounded-lg text-sm resize-none focus:ring-2 focus:ring-blue-500 outline-none" rows={3} value={empilhadeiraForm.description} onChange={e => setEmpilhadeiraForm({ ...empilhadeiraForm, description: e.target.value })} />
                                        </div>

                                        <div>
                                            <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Foto do Item</label>
                                            <div className="border-2 border-dashed border-slate-300 rounded-lg h-32 flex flex-col items-center justify-center relative bg-slate-50 hover:bg-blue-50 transition-colors group">
                                                <input type="file" onChange={e => handleImageUpload(e, 'empilhadeira')} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                                                {empilhadeiraForm.imageUrl ? (
                                                    <img src={empilhadeiraForm.imageUrl} alt="Preview" className="h-full w-full object-contain p-2" />
                                                ) : (
                                                    <>
                                                        <ImageIcon className="text-slate-400 mb-1 group-hover:text-blue-500" size={24} />
                                                        <span className="text-xs text-slate-400 group-hover:text-blue-600">Clique para enviar foto</span>
                                                    </>
                                                )}
                                            </div>
                                        </div>

                                        <div className="pt-2 flex gap-2">
                                            <button type="button" onClick={handleCancelEmpilhadeiraEdit} className="flex-1 py-3 rounded-lg font-bold text-slate-600 hover:bg-slate-100 transition">Cancelar</button>
                                            <button type="submit" disabled={loading} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-bold shadow-lg transition disabled:opacity-50 flex justify-center items-center gap-2">
                                                {loading ? '...' : <><Save size={18} /> Salvar</>}
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            )}

                            {/* LISTA (Lado Direito - Ocupa tudo se form fechado, ou parte se aberto) */}
                            <div className={`col-span-12 ${isFormOpen ? 'lg:col-span-8' : 'lg:col-span-12'} transition-all duration-300`}>

                                {empilhadeiras.length === 0 ? (
                                    <div className="text-center py-20 bg-white rounded-xl border border-dashed border-slate-300">
                                        <div className="bg-slate-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <Package size={32} className="text-slate-300" />
                                        </div>
                                        <h3 className="text-lg font-bold text-slate-600">Nenhum item cadastrado</h3>
                                        <p className="text-slate-400 text-sm mt-1">Comece clicando no botão "Cadastrar" acima.</p>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                                        {empilhadeiras.map(p => (
                                            <div
                                                key={p._id}
                                                className={`bg-white rounded-xl border w-4/5 h-full shadow-sm hover:shadow-md transition-all overflow-hidden group flex flex-col ${editingId === p._id ? 'ring-2 ring-blue-500 border-transparent' : 'border-slate-200'}`}
                                            >
                                                {/* Imagem */}
                                                <div className="h-40 bg-slate-100 relative flex items-center justify-center overflow-hidden p-4">
                                                    {p.imageUrl ? (
                                                        <img src={p.imageUrl} alt={p.name} className="object-fill group-hover:scale-105 transition-transform duration-500" />
                                                    ) : (
                                                        <ImageIcon className="text-slate-300" size={40} />
                                                    )}
                                                    <div className="absolute top-3 left-3">
                                                        <span className="bg-white/90 backdrop-blur text-slate-700 text-[10px] font-bold px-2 py-1 rounded shadow-sm uppercase">
                                                            {p.brand}
                                                        </span>
                                                    </div>
                                                </div>

                                                {/* Conteúdo */}
                                                <div className="p-4 flex-1 flex flex-col">
                                                    <h3 className="font-bold text-slate-800 text-sm line-clamp-1 mb-1" title={p.name}>{p.name}</h3>
                                                    <p className="text-xs text-slate-500 mb-3">{p.model} {p.year ? `• ${p.year}` : ''}</p>

                                                    <div className="mt-auto flex items-center justify-between border-t border-slate-100 pt-3">
                                                        <span className="text-sm font-black text-[#005831]">
                                                            {p.price > 0 ? `R$ ${p.price.toLocaleString('pt-BR')}` : 'Consulte'}
                                                        </span>

                                                        <div className="flex gap-1">
                                                            <button
                                                                onClick={() => handleEditEmpilhadeiraClick(p)}
                                                                className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                                title="Editar"
                                                            >
                                                                <Edit size={16} />
                                                            </button>
                                                            <button
                                                                onClick={() => handleDeleteEmpilhadeira(p._id)}
                                                                className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                                title="Excluir"
                                                            >
                                                                <Trash2 size={16} />
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* ================================================================================= */}
                {/* ABA BANNERS (Novo Layout Organizado)                                              */}
                {/* ================================================================================= */}
                {activeTab === 'banners' && (
                    <div className="space-y-6">

                        {/* Barra de Ações */}
                        <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                            <h2 className="font-bold text-slate-700 flex items-center gap-2"><Megaphone size={20} className="text-purple-600" /> Campanhas & Banners</h2>
                            <button onClick={handleNewBannerClick} className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 shadow-lg transition-colors"><Plus size={18} /> Criar Novo Banner</button>
                        </div>

                        <div className="grid grid-cols-12 gap-6 items-start transition-all">

                            {/* FORMULÁRIO (Lado Esquerdo - Só aparece se isBannerFormOpen for true) */}
                            {isBannerFormOpen && (
                                <div className="col-span-12 lg:col-span-5 bg-white p-6 rounded-xl shadow-xl border border-slate-200 border-t-4 border-t-purple-500 animate-in slide-in-from-left-4 duration-300 sticky top-4 z-20">
                                    <div className="flex justify-between items-center mb-6">
                                        <h2 className="font-bold text-lg flex items-center gap-2 text-slate-800">
                                            {editingBannerId ? <Edit size={20} className="text-blue-600" /> : <Plus size={20} className="text-green-600" />}
                                            {editingBannerId ? 'Editar Banner' : 'Novo Banner'}
                                        </h2>
                                        <button onClick={handleCancelBannerEdit} className="p-1 hover:bg-slate-100 rounded-full text-slate-400 hover:text-red-500 transition-colors"><X size={20} /></button>
                                    </div>

                                    <form onSubmit={handleSaveBanner} className="space-y-6">
                                        {/* Configuração Básica */}
                                        <div className="grid md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Nome Interno</label>
                                                <input required value={bannerForm.name} onChange={e => setBannerForm({ ...bannerForm, name: e.target.value })} placeholder="Ex: Promo Natal" className="w-full border p-2 rounded text-sm" />
                                            </div>
                                            <div className="col-span-1 md:col-span-2">
                                                <label className="text-sm font-bold text-slate-700 mb-3 flex items-center gap-2">
                                                    <Tag size={16} className="text-purple-600" /> Onde este banner vai aparecer?
                                                </label>

                                                <div className="bg-slate-50 rounded-xl border border-slate-200 p-4 space-y-6 max-h-[400px] overflow-y-auto custom-scrollbar">
                                                    {Object.entries(SLOT_GROUPS).map(([group, slots]) => (
                                                        <div key={group}>
                                                            <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2 after:content-[''] after:flex-1 after:h-px after:bg-slate-200">
                                                                {group}
                                                            </h4>

                                                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                                                                {slots.map(slot => {
                                                                    const isSelected = bannerForm.ids.includes(slot.value);
                                                                    return (
                                                                        <div
                                                                            key={slot.value}
                                                                            onClick={() => handleSlotToggle(slot.value)}
                                                                            className={`
                                    relative cursor-pointer rounded-lg border px-2 py-2 transition-all duration-200 flex items-center gap-1 group select-none
                                    ${isSelected
                                                                                    ? 'bg-purple-600 border-purple-600 text-white shadow-md shadow-purple-200 transform scale-[1.02]'
                                                                                    : 'bg-white border-slate-200 text-slate-600 hover:border-purple-300 hover:shadow-sm'
                                                                                }
                                `}
                                                                        >
                                                                            {/* Checkbox Visual Customizado */}
                                                                            <div className={`
                                    w-6 h-6 rounded flex items-center justify-center transition-colors border
                                    ${isSelected ? 'bg-white/20 border-white/50' : 'bg-slate-100 border-slate-300 group-hover:border-purple-300'}
                                `}>
                                                                                {isSelected && <CheckSquare size={14} className="text-white" />}
                                                                            </div>

                                                                            <div className="flex flex-col">
                                                                                <span className={`text-xs font-bold ${isSelected ? 'text-white' : 'text-slate-700'}`}>
                                                                                    {slot.label}
                                                                                </span>
                                                                            </div>
                                                                        </div>
                                                                    );
                                                                })}
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                                <p className="text-[11px] text-slate-400 mt-2 text-center">
                                                    * Você pode selecionar múltiplos locais para exibir o mesmo banner em várias páginas.
                                                </p>
                                            </div>
                                        </div>

                                        {/* Estilo Visual */}
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

                                        {/* Conteúdo Condicional */}
                                        {bannerForm.layout === 'carousel' ? (
                                            <div className="space-y-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
                                                <div className="flex justify-between"><label className="text-sm font-bold">Slides</label><button type="button" onClick={addCarouselItem} className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">+ Add</button></div>
                                                {bannerForm.carouselItems.map((item, idx) => (
                                                    <div key={idx} className="border p-3 rounded bg-white relative space-y-2">
                                                        <button type="button" onClick={() => removeCarouselItem(idx)} className="absolute top-2 right-2 text-red-400"><X size={14} /></button>
                                                        <p className="text-xs font-bold text-slate-400">Slide {idx + 1}</p>
                                                        <div className="grid grid-cols-3 gap-2">
                                                            <div className="border-2 border-dashed h-20 flex items-center justify-center relative"><input type="file" onChange={e => handleImageUpload(e, 'banner', idx)} className="absolute inset-0 opacity-0 cursor-pointer" />{item.imageUrl ? <img src={item.imageUrl} className="h-full w-full object-cover" /> : <ImageIcon size={16} />}</div>
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
                                                {/* Imagem: Escondida se for Alerta */}
                                                {bannerForm.layout !== 'alert' && (
                                                    <div className="border-2 border-dashed p-4 text-center relative bg-slate-50 rounded-lg"><input type="file" onChange={e => handleImageUpload(e, 'banner')} className="absolute inset-0 opacity-0 cursor-pointer" />{bannerForm.imageUrl ? <img src={bannerForm.imageUrl} className="h-24 w-full object-cover mx-auto" /> : <span className="text-xs text-slate-400 flex items-center justify-center gap-2"><ImageIcon size={16} /> Imagem de Fundo</span>}</div>
                                                )}
                                            </div>
                                        )}

                                        {/* Avançado e Salvar */}
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

                            {/* LISTA (Lado Direito - Separada em 2 Colunas: Ativos e Inativos) */}
                            <div className={`col-span-12 ${isBannerFormOpen ? 'lg:col-span-7' : 'lg:col-span-12'} transition-all duration-300`}>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                                    {/* Coluna ATIVOS */}
                                    <div className="space-y-3">
                                        <h3 className="text-sm font-bold text-green-700 uppercase flex items-center gap-2"><CheckCircle size={16} /> Banners Ativos</h3>
                                        {activeBanners.length === 0 && <p className="text-xs text-slate-400 italic">Nenhum banner ativo.</p>}
                                        {activeBanners.map((banner) => (
                                            <div key={banner._id} onClick={() => handleEditBannerClick(banner)} className={`bg-white p-4 rounded-xl border border-green-200 shadow-sm hover:shadow-md cursor-pointer transition group relative overflow-hidden ${editingBannerId === banner._id ? 'ring-2 ring-purple-500' : ''}`}>
                                                <div className="absolute top-0 left-0 w-1 h-full bg-green-500"></div>
                                                <div className="flex justify-between items-start mb-2 pl-2">
                                                    <span className="text-[10px] font-bold uppercase text-slate-500 bg-slate-100 px-2 py-0.5 rounded">{banner.layout}</span>
                                                    <button onClick={(e) => { e.stopPropagation(); handleDeleteBanner(banner._id!) }} className="text-slate-300 hover:text-red-500"><Trash2 size={14} /></button>
                                                </div>
                                                <h4 className="font-bold text-slate-800 text-sm pl-2 mb-1">{banner.name}</h4>
                                                <div className="pl-2 flex flex-wrap gap-1">
                                                    {banner.ids.slice(0, 3).map(id => <span key={id} className="text-[9px] text-purple-700 bg-purple-50 px-1 rounded border border-purple-100">{id}</span>)}
                                                    {banner.ids.length > 3 && <span className="text-[9px] text-slate-400">+{banner.ids.length - 3}</span>}
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Coluna INATIVOS */}
                                    <div className="space-y-3">
                                        <h3 className="text-sm font-bold text-slate-500 uppercase flex items-center gap-2"><EyeOff size={16} /> Rascunhos / Inativos</h3>
                                        {inactiveBanners.length === 0 && <p className="text-xs text-slate-400 italic">Nenhum banner inativo.</p>}
                                        {inactiveBanners.map((banner) => (
                                            <div key={banner._id} onClick={() => handleEditBannerClick(banner)} className={`bg-slate-50 p-4 rounded-xl border border-slate-200 cursor-pointer transition hover:bg-white group opacity-70 hover:opacity-100 ${editingBannerId === banner._id ? 'ring-2 ring-purple-500' : ''}`}>
                                                <div className="flex justify-between items-start mb-2">
                                                    <span className="text-[10px] font-bold uppercase text-slate-400">{banner.layout}</span>
                                                    <button onClick={(e) => { e.stopPropagation(); handleDeleteBanner(banner._id!) }} className="text-slate-300 hover:text-red-500"><Trash2 size={14} /></button>
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