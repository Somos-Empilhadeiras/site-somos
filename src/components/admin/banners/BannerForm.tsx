'use client';
import { useState } from 'react';
import {
    X, Save, Layout, CreditCard, AlertTriangle, GalleryHorizontal,
    Settings, Tag, AlignLeft, AlignCenter, AlignRight, Monitor,
    Type, Clock, Palette, MousePointerClick, Trash2, Image as ImageIcon,
    ShoppingBag
} from 'lucide-react';
import { BannerConfig, CarouselItem, SLOT_GROUPS } from '@/types/admin';
import ImageUpload from '../ui/ImageUpload';
import ProductSelector from './ProductSelector';

interface Props {
    formData: BannerConfig;
    setFormData: (data: BannerConfig) => void;
    onSubmit: (e: React.FormEvent) => void;
    onCancel: () => void;
    loading: boolean;
    isEditing: boolean;
}

export default function BannerForm({ formData, setFormData, onSubmit, onCancel, loading, isEditing }: Props) {
    const [activeTab, setActiveTab] = useState<'content' | 'style'>('content');

    const handleSlotSelect = (slotValue: string) => {
        setFormData({ ...formData, ids: [slotValue] });
    };

    const addCarouselItem = () => {
        setFormData({
            ...formData,
            carouselItems: [...(formData.carouselItems || []), {
                title: '', description: '', imageUrl: '', link: '', buttonText: 'Saiba Mais',
                secondaryButtonText: '', secondaryButtonLink: '', secondaryButtonTransparent: true
            }]
        });
    };

    const removeCarouselItem = (index: number) => {
        setFormData({ ...formData, carouselItems: (formData.carouselItems || []).filter((_, i) => i !== index) });
    };

    const updateCarouselItem = (index: number, field: keyof CarouselItem, value: any) => {
        const newItems = [...(formData.carouselItems || [])];
        newItems[index] = { ...newItems[index], [field]: value };
        setFormData({ ...formData, carouselItems: newItems });
    };

    return (
        <div className="col-span-12 lg:col-span-6 bg-white p-0 rounded-xl shadow-2xl border border-slate-200 sticky top-4 z-50 h-[90vh] flex flex-col">

            {/* Header Fixo (Mantido) */}
            <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50 backdrop-blur-sm shrink-0">
                <div>
                    <h2 className="font-bold text-lg text-slate-800">{isEditing ? 'Editar Campanha' : 'Nova Campanha'}</h2>
                    <p className="text-xs text-slate-400">Configure o visual e o conteúdo do banner.</p>
                </div>
                <button onClick={onCancel} className="p-2 hover:bg-red-50 rounded-full text-slate-400 hover:text-red-500 transition-colors"><X size={20} /></button>
            </div>

            {/* Tabs de Navegação (Mantido) */}
            <div className="flex border-b border-slate-200 shrink-0">
                <button
                    type="button"
                    onClick={() => setActiveTab('content')}
                    className={`flex-1 py-3 text-sm font-bold border-b-2 transition-colors flex items-center justify-center gap-2 ${activeTab === 'content' ? 'border-purple-600 text-purple-700 bg-purple-50/50' : 'border-transparent text-slate-500 hover:bg-slate-50'}`}
                >
                    <Layout size={16} /> Conteúdo
                </button>
                <button
                    type="button"
                    onClick={() => setActiveTab('style')}
                    className={`flex-1 py-3 text-sm font-bold border-b-2 transition-colors flex items-center justify-center gap-2 ${activeTab === 'style' ? 'border-purple-600 text-purple-700 bg-purple-50/50' : 'border-transparent text-slate-500 hover:bg-slate-50'}`}
                >
                    <Palette size={16} /> Estilo & Cores
                </button>
            </div>

            {/* Corpo do Formulário com Scroll */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
                <form id="banner-form" onSubmit={onSubmit} className="space-y-8 pb-10">

                    {/* --- TAB: CONTEÚDO --- */}
                    {activeTab === 'content' && (
                        <div className="space-y-8 animate-in fade-in slide-in-from-left-4 duration-300">

                            {/* 1. Informações Básicas */}
                            <div className="grid grid-cols-1 gap-5 p-4 bg-slate-50 rounded-xl border border-slate-100">
                                <div>
                                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Nome da Campanha</label>
                                    <input required value={formData.name || ''} onChange={e => setFormData({ ...formData, name: e.target.value })} placeholder="Ex: Promoção de Natal" className="w-full border border-slate-300 p-2 rounded text-sm focus:border-purple-500 outline-none" />
                                </div>

                                <div>
                                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Local de Exibição</label>
                                    <select
                                        className="w-full border border-slate-300 p-2 rounded text-sm bg-white focus:border-purple-500 outline-none"
                                        onChange={(e) => handleSlotSelect(e.target.value)}
                                        value={formData.ids[0] || ''}
                                    >
                                        <option value="" disabled>Selecione um local...</option>
                                        {Object.entries(SLOT_GROUPS).map(([group, slots]) => (
                                            <optgroup key={group} label={group}>
                                                {slots.map(slot => <option key={slot.value} value={slot.value}>{slot.label}</option>)}
                                            </optgroup>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-2">Formato</label>
                                    <div className="grid grid-cols-5 gap-2"> {/* Mudado para 5 colunas */}
                                        {[
                                            { id: 'carousel', icon: GalleryHorizontal, label: 'Carrossel' },
                                            { id: 'full', icon: Layout, label: 'Hero Full' },
                                            { id: 'product_grid', icon: ShoppingBag, label: 'Vitrine' }, // <--- NOVA OPÇÃO
                                            { id: 'compact', icon: CreditCard, label: 'Card' },
                                            { id: 'alert', icon: AlertTriangle, label: 'Aviso' }
                                        ].map((type) => (
                                            <button
                                                key={type.id}
                                                type="button"
                                                onClick={() => setFormData({ ...formData, layout: type.id as any })}
                                                className={`p-2 border rounded flex flex-col items-center gap-1 transition-all ${formData.layout === type.id ? 'border-purple-600 bg-purple-100 text-purple-800 ring-1 ring-purple-500' : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-600'}`}
                                            >
                                                <type.icon size={18} />
                                                <span className="text-[10px] font-bold">{type.label}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* LÓGICA DE EXIBIÇÃO POR TIPO DE LAYOUT */}

                            {/* TIPO 1: CARROSSEL (Mantido código original) */}
                            {formData.layout === 'carousel' && (
                                // ... (Seu código existente do carrossel fica aqui sem alterações)
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center sticky top-0 bg-white py-2 z-10 border-b border-white">
                                        <label className="text-sm font-bold text-slate-800 flex items-center gap-2"><GalleryHorizontal size={18} className="text-purple-600" /> Slides do Carrossel</label>
                                        <button type="button" onClick={addCarouselItem} className="text-xs bg-slate-900 text-white px-3 py-1.5 rounded-full font-bold hover:bg-slate-800 shadow flex items-center gap-1 transition-transform active:scale-95"><Monitor size={12} /> Adicionar Slide</button>
                                    </div>
                                    <div className="space-y-8">
                                        {formData.carouselItems?.map((item, idx) => (
                                            <div key={idx} className="border border-slate-300 rounded-xl bg-white overflow-hidden shadow-sm group">
                                                <div className="bg-slate-100 p-3 border-b border-slate-200 flex justify-between items-center">
                                                    <span className="text-xs font-bold text-slate-600 uppercase flex items-center gap-2">
                                                        <span className="bg-slate-300 text-slate-700 w-5 h-5 rounded-full flex items-center justify-center text-[10px]">{idx + 1}</span>
                                                        Slide {idx + 1}
                                                    </span>
                                                    <button type="button" onClick={() => removeCarouselItem(idx)} className="text-slate-400 hover:text-red-600 transition-colors" title="Remover Slide"><Trash2 size={16} /></button>
                                                </div>
                                                <div className="p-5 flex flex-col gap-5">
                                                    <div className="w-full">
                                                        <label className="text-[10px] font-bold text-slate-400 uppercase mb-2 flex items-center gap-1"><ImageIcon size={12} /> Imagem de Fundo</label>
                                                        <div className="h-40 w-full rounded-lg overflow-hidden border-2 border-dashed border-slate-300 bg-slate-50 relative hover:border-purple-400 transition-colors">
                                                            <ImageUpload currentImageUrl={item.imageUrl} onUpload={(url) => updateCarouselItem(idx, 'imageUrl', url)} label="Carregar Imagem" />
                                                        </div>
                                                    </div>
                                                    <div className="space-y-3">
                                                        <div>
                                                            <label className="text-[10px] font-bold text-slate-400 uppercase mb-1 block">Título Principal</label>
                                                            <input value={item.title || ''} onChange={e => updateCarouselItem(idx, 'title', e.target.value)} className="w-full border border-slate-300 rounded p-2 text-sm font-bold focus:border-purple-500 outline-none placeholder:font-normal" placeholder="Ex: Oferta de Verão" />
                                                        </div>
                                                        <div>
                                                            <label className="text-[10px] font-bold text-slate-400 uppercase mb-1 block">Subtítulo / Descrição</label>
                                                            <textarea value={item.description || ''} onChange={e => updateCarouselItem(idx, 'description', e.target.value)} rows={2} className="w-full border border-slate-300 rounded p-2 text-xs focus:border-purple-500 outline-none resize-none" placeholder="Ex: Descontos de até 50%..." />
                                                        </div>
                                                    </div>
                                                    {/* Botões do Carrossel Omitidos para brevidade, manter como no original */}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* TIPO 2: VITRINE DE PRODUTOS (NOVO) */}
                            {formData.layout === 'product_grid' && (
                                <div className="space-y-6 bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                                    <div className="border-b border-slate-100 pb-4 mb-4">
                                        <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                                            <ShoppingBag size={18} className="text-purple-600" />
                                            Vitrine de Produtos
                                        </h3>
                                        <p className="text-xs text-slate-400 mt-1">Configure o cabeçalho e selecione os itens.</p>
                                    </div>

                                    {/* Configuração de Texto do Cabeçalho da Vitrine */}
                                    <div className="space-y-4">
                                        <div>
                                            <label className="text-[10px] font-bold text-slate-400 uppercase mb-1 block">Título da Seção</label>
                                            <input
                                                value={formData.title || ''}
                                                onChange={e => setFormData({ ...formData, title: e.target.value })}
                                                placeholder="Ex: Destaques da Semana"
                                                className="w-full border border-slate-300 p-2 rounded text-sm font-bold focus:border-purple-500 outline-none"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-[10px] font-bold text-slate-400 uppercase mb-1 block">Subtítulo (Opcional)</label>
                                            <input
                                                value={formData.description || ''}
                                                onChange={e => setFormData({ ...formData, description: e.target.value })}
                                                placeholder="Ex: As melhores empilhadeiras para o seu negócio"
                                                className="w-full border border-slate-300 p-2 rounded text-sm focus:border-purple-500 outline-none"
                                            />
                                        </div>
                                    </div>

                                    <hr className="border-slate-100" />

                                    {/* SELETOR DE PRODUTOS */}
                                    <div>
                                        <label className="text-[10px] font-bold text-slate-400 uppercase mb-2 block">Produtos Selecionados</label>
                                        <ProductSelector
                                            selectedIds={formData.productIds || []} // Garanta que seu BannerConfig tenha esse campo opcional
                                            onChange={(ids) => setFormData({ ...formData, productIds: ids })}
                                            maxItems={4}
                                        />
                                    </div>
                                </div>
                            )}

                            {/* TIPO 3: FALLBACK (Hero, Card, Alert) */}
                            {!['carousel', 'product_grid'].includes(formData.layout) && (
                                <div className="space-y-4 bg-slate-50 p-5 rounded-xl border border-slate-200">
                                    <div className="w-full">
                                        <label className="text-[10px] font-bold text-slate-400 uppercase mb-2 block">Imagem Principal</label>
                                        <div className="h-40 w-full rounded-lg overflow-hidden border-2 border-dashed border-slate-300 bg-white">
                                            <ImageUpload currentImageUrl={formData.imageUrl} onUpload={(url) => setFormData({ ...formData, imageUrl: url })} label="Carregar" />
                                        </div>
                                    </div>
                                    <input value={formData.title || ''} onChange={e => setFormData({ ...formData, title: e.target.value })} placeholder="Título Principal" className="w-full border border-slate-300 p-2 rounded font-bold" />
                                    <textarea value={formData.description || ''} onChange={e => setFormData({ ...formData, description: e.target.value })} placeholder="Descrição" className="w-full border border-slate-300 p-2 rounded" />
                                    <div className="grid grid-cols-2 gap-2">
                                        <input value={formData.ctaText || ''} onChange={e => setFormData({ ...formData, ctaText: e.target.value })} placeholder="Texto Botão" className="border border-slate-300 p-2 rounded text-sm" />
                                        <input value={formData.ctaLink || ''} onChange={e => setFormData({ ...formData, ctaLink: e.target.value })} placeholder="Link Botão" className="border border-slate-300 p-2 rounded text-sm" />
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* --- TAB: ESTILO & CORES (COMPLETO) --- */}
                    {activeTab === 'style' && (
                        <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">

                            {/* 1. SEÇÃO DE LAYOUT E POSICIONAMENTO */}
                            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-4">
                                <h3 className="text-xs font-bold text-slate-400 uppercase flex items-center gap-2">
                                    <Layout size={14} /> Layout & Estrutura
                                </h3>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {/* Altura do Banner */}
                                    <div>
                                        <label className="text-[10px] font-bold text-slate-500 uppercase mb-1 block">Altura da Seção</label>
                                        <div className="flex bg-white border border-slate-200 rounded-lg p-1">
                                            {[
                                                { value: 'h-[60vh]', label: 'Padrão' },
                                                { value: 'h-[80vh]', label: 'Alto' },
                                                { value: 'h-screen', label: 'Tela Cheia' }
                                            ].map(opt => (
                                                <button
                                                    key={opt.value} type="button"
                                                    onClick={() => setFormData({ ...formData, height: opt.value })}
                                                    className={`flex-1 py-1.5 text-xs font-bold rounded transition-all ${formData.height === opt.value ? 'bg-slate-800 text-white shadow' : 'text-slate-500 hover:bg-slate-100'}`}
                                                >
                                                    {opt.label}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Alinhamento do Conteúdo */}
                                    <div>
                                        <label className="text-[10px] font-bold text-slate-500 uppercase mb-1 block">Alinhamento do Texto</label>
                                        <div className="flex bg-white border border-slate-200 rounded-lg p-1">
                                            {[
                                                { value: 'left', icon: AlignLeft },
                                                { value: 'center', icon: AlignCenter },
                                                { value: 'right', icon: AlignRight }
                                            ].map(opt => (
                                                <button
                                                    key={opt.value} type="button"
                                                    onClick={() => setFormData({ ...formData, contentAlign: opt.value as any })}
                                                    className={`flex-1 py-1.5 flex justify-center items-center rounded transition-all ${formData.contentAlign === opt.value ? 'bg-purple-100 text-purple-700 ring-1 ring-purple-500' : 'text-slate-400 hover:bg-slate-100'}`}
                                                >
                                                    <opt.icon size={16} />
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Posição da Imagem (Só aparece se não for Full) */}
                                    {formData.layout !== 'full' && formData.layout !== 'carousel' && (
                                        <div>
                                            <label className="text-[10px] font-bold text-slate-500 uppercase mb-1 block">Posição da Imagem</label>
                                            <div className="flex gap-2">
                                                <button type="button" onClick={() => setFormData({ ...formData, imagePosition: 'left' })} className={`flex-1 p-2 border rounded text-xs font-bold ${formData.imagePosition === 'left' ? 'border-purple-500 bg-purple-50 text-purple-700' : 'bg-white'}`}>Esquerda</button>
                                                <button type="button" onClick={() => setFormData({ ...formData, imagePosition: 'right' })} className={`flex-1 p-2 border rounded text-xs font-bold ${formData.imagePosition === 'right' ? 'border-purple-500 bg-purple-50 text-purple-700' : 'bg-white'}`}>Direita</button>
                                            </div>
                                        </div>
                                    )}

                                    {/* Tamanho do Texto */}
                                    <div>
                                        <label className="text-[10px] font-bold text-slate-500 uppercase mb-1 block flex items-center gap-1"><Type size={12} /> Tamanho da Fonte</label>
                                        <div className="flex bg-white border border-slate-200 rounded-lg p-1">
                                            {['small', 'medium', 'large'].map(size => (
                                                <button
                                                    key={size} type="button"
                                                    onClick={() => setFormData({ ...formData, textSize: size as any })}
                                                    className={`flex-1 py-1.5 text-xs font-bold rounded transition-all ${formData.textSize === size ? 'bg-slate-800 text-white shadow' : 'text-slate-500 hover:bg-slate-100'}`}
                                                >
                                                    {size === 'small' ? 'P' : size === 'medium' ? 'M' : 'G'}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Duração do Slide (Apenas Carrossel) */}
                                    {formData.layout === 'carousel' && (
                                        <div className="col-span-2">
                                            <label className="text-[10px] font-bold text-slate-500 uppercase mb-1 flex items-center gap-1"><Clock size={12} /> Tempo do Slide (segundos)</label>
                                            <input
                                                type="range" min="3" max="15" step="1"
                                                value={formData.slideDuration || 5}
                                                onChange={e => setFormData({ ...formData, slideDuration: Number(e.target.value) })}
                                                className="w-full accent-purple-600 cursor-pointer"
                                            />
                                            <div className="text-right text-xs font-bold text-purple-600">{formData.slideDuration}s</div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* 2. SEÇÃO DE CORES GERAIS */}
                            <div className="space-y-4">
                                <h3 className="text-xs font-bold text-slate-400 uppercase flex items-center gap-2">
                                    <Palette size={14} /> Cores da Campanha
                                </h3>

                                <div className="grid grid-cols-2 gap-4">
                                    {/* Cor de Fundo */}
                                    <div>
                                        <label className="text-[10px] font-bold text-slate-500 uppercase mb-1 block">Fundo da Seção</label>
                                        <div className="flex items-center gap-2 border border-slate-200 p-1.5 rounded-lg bg-white">
                                            <input type="color" value={formData.bgColor || '#ffffff'} onChange={e => setFormData({ ...formData, bgColor: e.target.value })} className="w-8 h-8 rounded cursor-pointer border-0 p-0" />
                                            <input type="text" value={formData.bgColor || ''} onChange={e => setFormData({ ...formData, bgColor: e.target.value })} className="text-xs font-mono w-full outline-none uppercase" />
                                        </div>
                                    </div>

                                    {/* Cor Título */}
                                    <div>
                                        <label className="text-[10px] font-bold text-slate-500 uppercase mb-1 block">Cor do Título</label>
                                        <div className="flex items-center gap-2 border border-slate-200 p-1.5 rounded-lg bg-white">
                                            <input type="color" value={formData.titleColor || '#000000'} onChange={e => setFormData({ ...formData, titleColor: e.target.value })} className="w-8 h-8 rounded cursor-pointer border-0 p-0" />
                                            <input type="text" value={formData.titleColor || ''} onChange={e => setFormData({ ...formData, titleColor: e.target.value })} className="text-xs font-mono w-full outline-none uppercase" />
                                        </div>
                                    </div>

                                    {/* Cor Descrição */}
                                    <div>
                                        <label className="text-[10px] font-bold text-slate-500 uppercase mb-1 block">Cor da Descrição</label>
                                        <div className="flex items-center gap-2 border border-slate-200 p-1.5 rounded-lg bg-white">
                                            <input type="color" value={formData.descColor || '#475569'} onChange={e => setFormData({ ...formData, descColor: e.target.value })} className="w-8 h-8 rounded cursor-pointer border-0 p-0" />
                                            <input type="text" value={formData.descColor || ''} onChange={e => setFormData({ ...formData, descColor: e.target.value })} className="text-xs font-mono w-full outline-none uppercase" />
                                        </div>
                                    </div>

                                    {/* Cor Texto Geral */}
                                    <div>
                                        <label className="text-[10px] font-bold text-slate-500 uppercase mb-1 block">Texto Geral</label>
                                        <div className="flex items-center gap-2 border border-slate-200 p-1.5 rounded-lg bg-white">
                                            <input type="color" value={formData.textColor || '#000000'} onChange={e => setFormData({ ...formData, textColor: e.target.value })} className="w-8 h-8 rounded cursor-pointer border-0 p-0" />
                                            <input type="text" value={formData.textColor || ''} onChange={e => setFormData({ ...formData, textColor: e.target.value })} className="text-xs font-mono w-full outline-none uppercase" />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <hr className="border-slate-100" />

                            {/* 3. SEÇÃO DE BOTÕES */}
                            <div className="space-y-4">
                                <h3 className="text-xs font-bold text-slate-400 uppercase flex items-center gap-2">
                                    <MousePointerClick size={14} /> Estilo dos Botões
                                </h3>

                                <div className="grid grid-cols-2 gap-6 bg-slate-50 p-4 rounded-xl border border-slate-200">
                                    {/* Botão Primário */}
                                    <div className="space-y-3">
                                        <span className="text-xs font-bold text-slate-700 block border-b pb-1">Botão Principal</span>
                                        <div>
                                            <label className="text-[10px] font-bold text-slate-400 mb-1 block">Cor do Fundo</label>
                                            <div className="flex items-center gap-2 bg-white border border-slate-200 p-1 rounded">
                                                <input type="color" value={formData.btnColor || '#000000'} onChange={e => setFormData({ ...formData, btnColor: e.target.value })} className="w-6 h-6 rounded cursor-pointer" />
                                                <input type="text" value={formData.btnColor} onChange={e => setFormData({ ...formData, btnColor: e.target.value })} className="text-xs w-full outline-none" />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="text-[10px] font-bold text-slate-400 mb-1 block">Cor do Texto</label>
                                            <div className="flex items-center gap-2 bg-white border border-slate-200 p-1 rounded">
                                                <input type="color" value={formData.btnTextColor || '#ffffff'} onChange={e => setFormData({ ...formData, btnTextColor: e.target.value })} className="w-6 h-6 rounded cursor-pointer" />
                                                <input type="text" value={formData.btnTextColor} onChange={e => setFormData({ ...formData, btnTextColor: e.target.value })} className="text-xs w-full outline-none" />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Botão Secundário */}
                                    <div className="space-y-3">
                                        <span className="text-xs font-bold text-slate-700 block border-b pb-1">Botão Secundário</span>
                                        <div>
                                            <label className="text-[10px] font-bold text-slate-400 mb-1 block">Cor do Fundo/Borda</label>
                                            <div className="flex items-center gap-2 bg-white border border-slate-200 p-1 rounded">
                                                <input type="color" value={formData.secBtnColor || '#ffffff'} onChange={e => setFormData({ ...formData, secBtnColor: e.target.value })} className="w-6 h-6 rounded cursor-pointer" />
                                                <input type="text" value={formData.secBtnColor} onChange={e => setFormData({ ...formData, secBtnColor: e.target.value })} className="text-xs w-full outline-none" />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="text-[10px] font-bold text-slate-400 mb-1 block">Cor do Texto</label>
                                            <div className="flex items-center gap-2 bg-white border border-slate-200 p-1 rounded">
                                                <input type="color" value={formData.secBtnTextColor || '#000000'} onChange={e => setFormData({ ...formData, secBtnTextColor: e.target.value })} className="w-6 h-6 rounded cursor-pointer" />
                                                <input type="text" value={formData.secBtnTextColor} onChange={e => setFormData({ ...formData, secBtnTextColor: e.target.value })} className="text-xs w-full outline-none" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>
                    )}
                </form>
            </div>

            {/* Footer Fixo (Mantido) */}
            <div className="p-5 border-t border-slate-200 bg-slate-50 flex justify-between items-center shrink-0">
                <label className="flex gap-2 items-center cursor-pointer select-none">
                    <div className={`w-10 h-5 rounded-full p-1 transition-colors ${formData.isActive ? 'bg-green-500' : 'bg-slate-300'}`}>
                        <div className={`bg-white w-3 h-3 rounded-full shadow-md transform transition-transform ${formData.isActive ? 'translate-x-5' : 'translate-x-0'}`}></div>
                    </div>
                    <input type="checkbox" className="hidden" checked={formData.isActive} onChange={e => setFormData({ ...formData, isActive: e.target.checked })} />
                    <span className="text-sm font-medium text-slate-600">{formData.isActive ? 'Publicado' : 'Rascunho'}</span>
                </label>

                <button
                    type="submit"
                    form="banner-form"
                    disabled={loading}
                    className="bg-slate-900 text-white px-6 py-2.5 rounded-lg font-bold shadow-lg hover:bg-slate-800 disabled:opacity-50 flex items-center gap-2 transition-transform active:scale-95"
                >
                    {loading ? 'Salvando...' : <><Save size={18} /> Salvar Alterações</>}
                </button>
            </div>
        </div>
    );
}