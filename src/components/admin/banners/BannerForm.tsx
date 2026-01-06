'use client';
import { useState } from 'react';
import { 
    X, Save, Layout, CreditCard, AlertTriangle, GalleryHorizontal, 
    Plus, Settings, ChevronDown, ChevronUp, CheckSquare, Tag, Image as ImageIcon 
} from 'lucide-react';
import { BannerConfig, CarouselItem, SLOT_GROUPS } from '@/types/admin';
import ImageUpload from '../ui/ImageUpload';

interface Props {
    formData: BannerConfig;
    setFormData: (data: BannerConfig) => void;
    onSubmit: (e: React.FormEvent) => void;
    onCancel: () => void;
    loading: boolean;
    isEditing: boolean;
}

export default function BannerForm({ formData, setFormData, onSubmit, onCancel, loading, isEditing }: Props) {
    const [showAdvanced, setShowAdvanced] = useState(false);

    // --- Helpers para Slots ---
    const handleSlotToggle = (slotValue: string) => {
        const currentIds = formData.ids || [];
        if (currentIds.includes(slotValue)) {
            setFormData({ ...formData, ids: currentIds.filter(id => id !== slotValue) });
        } else {
            setFormData({ ...formData, ids: [...currentIds, slotValue] });
        }
    };

    // --- Helpers para Carrossel ---
    const addCarouselItem = () => {
        setFormData({ ...formData, carouselItems: [...(formData.carouselItems || []), { title: '', description: '', imageUrl: '', link: '' }] });
    };

    const removeCarouselItem = (index: number) => {
        setFormData({ ...formData, carouselItems: (formData.carouselItems || []).filter((_, i) => i !== index) });
    };

    const updateCarouselItem = (index: number, field: keyof CarouselItem, value: string) => {
        const newItems = [...(formData.carouselItems || [])];
        newItems[index] = { ...newItems[index], [field]: value };
        setFormData({ ...formData, carouselItems: newItems });
    };

    return (
        <div className="col-span-12 lg:col-span-5 bg-white p-6 rounded-xl shadow-xl border border-slate-200 border-t-4 border-t-purple-500 sticky top-4 z-20">
            <div className="flex justify-between items-center mb-6">
                <h2 className="font-bold text-lg text-slate-800">
                    {isEditing ? 'Editar Banner' : 'Novo Banner'}
                </h2>
                <button onClick={onCancel} className="p-1 hover:bg-slate-100 rounded-full text-slate-400 hover:text-red-500 transition-colors"><X size={20} /></button>
            </div>

            <form onSubmit={onSubmit} className="space-y-6">
                {/* Nome Interno */}
                <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Nome Interno (Organização)</label>
                    <input required value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} placeholder="Ex: Promo Natal" className="w-full border p-2 rounded text-sm" />
                </div>

                {/* Seleção de Slots (Locais) */}
                <div className="bg-slate-50 rounded-xl border border-slate-200 p-4 space-y-4 max-h-[300px] overflow-y-auto custom-scrollbar">
                    <label className="text-sm font-bold text-slate-700 flex items-center gap-2"><Tag size={16} className="text-purple-600" /> Onde exibir?</label>
                    {Object.entries(SLOT_GROUPS).map(([group, slots]) => (
                        <div key={group}>
                            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">{group}</h4>
                            <div className="grid grid-cols-2 gap-2">
                                {slots.map(slot => {
                                    const isSelected = formData.ids.includes(slot.value);
                                    return (
                                        <div key={slot.value} onClick={() => handleSlotToggle(slot.value)} className={`cursor-pointer rounded border px-2 py-1.5 flex items-center gap-2 transition-all ${isSelected ? 'bg-purple-600 border-purple-600 text-white' : 'bg-white hover:border-purple-300 text-slate-600'}`}>
                                            <div className={`w-4 h-4 rounded flex items-center justify-center border ${isSelected ? 'border-white bg-white/20' : 'bg-slate-100'}`}>{isSelected && <CheckSquare size={10} />}</div>
                                            <span className="text-xs font-bold">{slot.label}</span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Seletor de Layout */}
                <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Estilo Visual</label>
                    <div className="grid grid-cols-4 gap-2">
                        {['full', 'compact', 'alert', 'carousel'].map((layout) => (
                            <button key={layout} type="button" onClick={() => setFormData({ ...formData, layout: layout as any })} className={`p-2 border rounded flex flex-col items-center gap-1 transition-all ${formData.layout === layout ? 'border-purple-600 bg-purple-50 text-purple-900 ring-1 ring-purple-500' : 'border-slate-200 hover:bg-slate-50'}`}>
                                {layout === 'full' && <Layout size={18} />}
                                {layout === 'compact' && <CreditCard size={18} />}
                                {layout === 'alert' && <AlertTriangle size={18} />}
                                {layout === 'carousel' && <GalleryHorizontal size={18} />}
                                <span className="text-[10px] font-bold uppercase">{layout}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Conteúdo Específico por Layout */}
                {formData.layout === 'carousel' ? (
                    <div className="space-y-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
                        <div className="flex justify-between items-center">
                            <label className="text-sm font-bold">Slides</label>
                            <button type="button" onClick={addCarouselItem} className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded font-bold hover:bg-green-200">+ Adicionar Slide</button>
                        </div>
                        {formData.carouselItems?.map((item, idx) => (
                            <div key={idx} className="border p-3 rounded bg-white relative space-y-2">
                                <button type="button" onClick={() => removeCarouselItem(idx)} className="absolute top-2 right-2 text-slate-300 hover:text-red-500"><X size={14} /></button>
                                <p className="text-[10px] font-bold text-slate-400 uppercase">Slide {idx + 1}</p>
                                <div className="grid grid-cols-3 gap-3">
                                    <div className="h-20">
                                        <ImageUpload currentImageUrl={item.imageUrl} onUpload={(url) => updateCarouselItem(idx, 'imageUrl', url)} label="Img" />
                                    </div>
                                    <div className="col-span-2 space-y-2">
                                        <input placeholder="Título" value={item.title} onChange={e => updateCarouselItem(idx, 'title', e.target.value)} className="w-full border p-1 rounded text-xs" />
                                        <input placeholder="Descrição" value={item.description} onChange={e => updateCarouselItem(idx, 'description', e.target.value)} className="w-full border p-1 rounded text-xs" />
                                        <input placeholder="Link (opcional)" value={item.link} onChange={e => updateCarouselItem(idx, 'link', e.target.value)} className="w-full border p-1 rounded text-xs" />
                                    </div>
                                </div>
                            </div>
                        ))}
                         {(!formData.carouselItems || formData.carouselItems.length === 0) && <p className="text-xs text-center text-slate-400 py-2">Nenhum slide adicionado.</p>}
                    </div>
                ) : (
                    <div className="space-y-3">
                        <input value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} placeholder="Título Principal" className="w-full border p-2 rounded font-bold" />
                        <textarea value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} placeholder="Descrição..." rows={2} className="w-full border p-2 rounded resize-none text-sm" />
                        <div className="grid grid-cols-2 gap-2">
                            <input value={formData.ctaText} onChange={e => setFormData({ ...formData, ctaText: e.target.value })} placeholder="Texto Botão" className="border p-2 rounded text-sm" />
                            <input value={formData.ctaLink} onChange={e => setFormData({ ...formData, ctaLink: e.target.value })} placeholder="Link Botão" className="border p-2 rounded text-sm" />
                        </div>
                        {formData.layout !== 'alert' && (
                            <div className="h-32">
                                <ImageUpload currentImageUrl={formData.imageUrl} onUpload={(url) => setFormData({...formData, imageUrl: url})} label="Imagem de Fundo/Destaque" />
                            </div>
                        )}
                    </div>
                )}

                {/* Personalização Avançada (Cores) */}
                <div className="border-t pt-4">
                    <button type="button" onClick={() => setShowAdvanced(!showAdvanced)} className="text-xs font-bold text-slate-500 flex items-center gap-1 w-full justify-between p-2 hover:bg-slate-50 rounded">
                        <span className="flex gap-1 items-center"><Settings size={14} /> Personalização (Cores & Posição)</span>
                        {showAdvanced ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                    </button>
                    {showAdvanced && (
                        <div className="p-3 bg-slate-50 rounded border space-y-3 mt-2">
                            {formData.layout !== 'alert' && formData.layout !== 'carousel' && (
                                <div className="flex gap-4">
                                    <span className="text-xs font-bold">Posição Imagem:</span>
                                    <label className="flex items-center gap-1 text-xs"><input type="radio" checked={formData.imagePosition === 'left'} onChange={() => setFormData({ ...formData, imagePosition: 'left' })} /> Esq</label>
                                    <label className="flex items-center gap-1 text-xs"><input type="radio" checked={formData.imagePosition === 'right'} onChange={() => setFormData({ ...formData, imagePosition: 'right' })} /> Dir</label>
                                </div>
                            )}
                            <div className="grid grid-cols-2 gap-2">
                                <div><span className="text-xs text-slate-500">Fundo</span><div className="flex"><input type="color" value={formData.bgColor} onChange={e => setFormData({ ...formData, bgColor: e.target.value })} className="h-6 w-6 cursor-pointer" /><input value={formData.bgColor} onChange={e => setFormData({ ...formData, bgColor: e.target.value })} className="w-full border text-xs p-1" /></div></div>
                                <div><span className="text-xs text-slate-500">Texto</span><div className="flex"><input type="color" value={formData.textColor} onChange={e => setFormData({ ...formData, textColor: e.target.value })} className="h-6 w-6 cursor-pointer" /><input value={formData.textColor} onChange={e => setFormData({ ...formData, textColor: e.target.value })} className="w-full border text-xs p-1" /></div></div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Rodapé do Form */}
                <div className="flex justify-between items-center pt-2 border-t">
                    <label className="flex gap-2 items-center cursor-pointer select-none bg-slate-50 px-3 py-2 rounded border">
                        <input type="checkbox" checked={formData.isActive} onChange={e => setFormData({ ...formData, isActive: e.target.checked })} />
                        <span className={`text-sm font-bold ${formData.isActive ? 'text-green-600' : 'text-slate-400'}`}>{formData.isActive ? 'Banner Ativo' : 'Rascunho'}</span>
                    </label>
                    <button type="submit" disabled={loading} className="bg-purple-600 text-white px-6 py-2.5 rounded-lg font-bold shadow transition hover:bg-purple-700 disabled:opacity-50 flex items-center gap-2">
                        {loading ? 'Salvando...' : <><Save size={18} /> Salvar Banner</>}
                    </button>
                </div>
            </form>
        </div>
    );
}