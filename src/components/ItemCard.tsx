import {
    Info, MessageCircle, ChevronRight, 
    Zap, Weight, Settings, Calendar, Tractor
} from 'lucide-react';
import { Empilhadeira } from '@/types';


interface ItemCardProps {
    empilhadeira: Empilhadeira;
    onOpenModal: (empilhadeira: Empilhadeira) => void;
    onWhatsApp: (empilhadeira: Empilhadeira) => void;
}

export default function ItemCard({ empilhadeira: e, onOpenModal, onWhatsApp }: ItemCardProps) {
    
    // Formatação de Preço
    const priceFormatted = e.price > 0 
        ? e.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) 
        : "Consulte";

    return (
        <div className="group bg-white rounded-3xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-slate-100 overflow-hidden flex flex-col h-full">
            
            {/* --- 1. ÁREA DA IMAGEM --- */}
            <div className="h-64 bg-slate-50 relative flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-linear-to-t from-slate-100 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                <img
                    src={e.imageUrl}
                    alt={e.model}
                    className="w-full object-fill p-8 transition-transform duration-700 group-hover:scale-110"
                />

                {/* Badges Flutuantes */}
                <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
                    <span className="bg-[#005831] text-white text-[10px] font-extrabold px-3 py-1 rounded-full shadow-md uppercase tracking-wide backdrop-blur-md">
                        {e.brand}
                    </span>
                    {e.year && (
                        <span className="bg-white/90 text-slate-700 text-[10px] font-bold px-3 py-1 rounded-full shadow-sm border border-slate-200">
                            {e.year}
                        </span>
                    )}
                </div>

                {/* Botão de Zoom (Hover) */}
                <button
                    onClick={() => onOpenModal(e)}
                    className="absolute top-4 right-4 bg-white text-slate-400 p-2 rounded-full shadow-lg opacity-0 translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 hover:text-[#005831] hover:bg-yellow-400"
                    title="Ver detalhes"
                >
                    <Info size={20} />
                </button>
            </div>

            {/* --- 2. CONTEÚDO DO CARD --- */}
            <div className="p-6 flex-1 flex flex-col">
                
                {/* Status de Estoque */}
                <div className="flex items-center gap-1.5 mb-3">
                    <span className="relative flex h-2.5 w-2.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
                    </span>
                    <span className="text-[11px] font-bold text-green-700 uppercase tracking-wide">
                        Em Estoque
                    </span>
                </div>

                {/* Título */}
                <h3 className="text-lg font-extrabold text-slate-800 leading-snug mb-1 group-hover:text-[#005831] transition-colors line-clamp-1" title={e.name}>
                    {e.name}
                </h3>

                {/* Grid de Especificações */}
                <div className="grid grid-cols-2 gap-2 mb-auto mt-3">
                    {e.brand && (
                        <div className="bg-slate-50 rounded-lg p-2 flex items-center gap-2 border border-slate-100">
                            <Tractor size={14} className="text-slate-400" />
                            <div className="flex flex-col leading-none">
                                <span className="text-[10px] font-bold text-slate-400 uppercase">Marca</span>
                                <span className="text-xs font-semibold text-slate-600 truncate">{e.brand}</span>
                            </div>
                        </div>
                    )}
                    {e.model && (
                        <div className="bg-slate-50 rounded-lg p-2 flex items-center gap-2 border border-slate-100">
                            <Settings size={14} className="text-slate-400" />
                            <div className="flex flex-col leading-none">
                                <span className="text-[10px] font-bold text-slate-400 uppercase">Modelo</span>
                                <span className="text-xs font-semibold text-slate-600 truncate">{e.model}</span>
                            </div>
                        </div>
                    )}
                    {e.year && (
                        <div className="bg-slate-50 rounded-lg p-2 flex items-center gap-2 border border-slate-100">
                            <Calendar size={14} className="text-slate-400" />
                            <div className="flex flex-col leading-none">
                                <span className="text-[10px] font-bold text-slate-400 uppercase">Ano</span>
                                <span className="text-xs font-semibold text-slate-600">{e.year}</span>
                            </div>
                        </div>
                    )}
                    {e.capacity && (
                        <div className="bg-slate-50 rounded-lg p-2 flex items-center gap-2 border border-slate-100">
                            <Weight size={14} className="text-slate-400" />
                            <div className="flex flex-col leading-none">
                                <span className="text-[10px] font-bold text-slate-400 uppercase">Capacidade</span>
                                <span className="text-xs font-semibold text-slate-600">{e.capacity} kg</span>
                            </div>
                        </div>
                    )}
                    {/* Se tiver voltagem, ocupa 2 colunas */}
                    {e.voltage && (
                        <div className="bg-slate-50 rounded-lg p-2 flex items-center gap-2 border border-slate-100 col-span-2">
                            <Zap size={14} className="text-yellow-500" />
                            <span className="text-xs font-semibold text-slate-600">Elétrica {e.voltage}V</span>
                        </div>
                    )}
                </div>

                {/* Divisor e Preço */}
                <div className="border-t border-slate-100 mt-4 pt-4">
                    <div className="mb-3">
                         <p className="text-[10px] text-slate-400 font-bold uppercase">Investimento</p>
                         <p className="text-xl font-black text-[#005831]">{priceFormatted}</p>
                    </div>

                    {/* Botões de Ação */}
                    <div className="grid grid-cols-[1fr_auto] gap-2">
                        <button
                            onClick={() => onWhatsApp(e)}
                            className="bg-[#005831] hover:bg-[#004626] text-white font-bold py-3 px-4 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-green-900/10 hover:-translate-y-0.5 active:translate-y-0 text-sm"
                        >
                            <MessageCircle size={18} />
                            <span>Negociar</span>
                        </button>
                        
                        <button
                            onClick={() => onOpenModal(e)}
                            className="bg-slate-100 hover:bg-slate-200 text-slate-600 p-3 rounded-xl transition-colors flex items-center justify-center"
                            title="Ver detalhes"
                        >
                            <ChevronRight size={20} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}