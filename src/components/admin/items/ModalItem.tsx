import { Info, MessageCircle, X, Settings, Weight, Zap, Calendar, Tractor, CheckCircle2 } from "lucide-react";
import { Empilhadeira } from '@/types';

interface ModalItemProps {
    empilhadeira: Empilhadeira;
    onClose: () => void; // Nome mais genérico e claro
    onWhatsApp: (empilhadeira: Empilhadeira) => void;
}

export default function ModalItem({ empilhadeira: e, onClose, onWhatsApp }: ModalItemProps) {
    
    // Formatação de Preço
    const priceFormatted = e.price > 0 
        ? e.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) 
        : "Sob Consulta";

    return (
        <div className="bg-white rounded-3xl max-w-4xl w-full overflow-hidden shadow-2xl flex flex-col md:flex-row max-h-[90vh] animate-in zoom-in-95 duration-300 relative">
            
            {/* Botão Fechar Mobile (Fixo no topo direito do card) */}
            <button
                onClick={onClose}
                className="md:hidden absolute top-4 right-4 p-2 bg-white/90 backdrop-blur rounded-full shadow-lg z-50 text-slate-500"
            >
                <X size={20} />
            </button>

            {/* Lado Esquerdo (Imagem) */}
            <div className="w-full md:w-1/2 bg-slate-50 flex items-center justify-center relative p-8 border-r border-slate-100">
                <img
                    src={e.imageUrl}
                    alt={e.model}
                    className="w-full h-full object-contain max-h-[400px] drop-shadow-xl"
                />
            </div>

            {/* Lado Direito (Infos) */}
            <div className="w-full md:w-1/2 p-8 md:p-10 flex flex-col overflow-y-auto bg-white">
                
                {/* Header */}
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <span className="inline-block bg-[#005831] text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-2">
                            {e.brand || 'Produto'}
                        </span>
                        <h2 className="text-3xl font-black text-slate-900 leading-tight">
                            {e.name}
                        </h2>
                        <p className="text-slate-400 font-bold mt-1">Ref: {e.model}</p>
                    </div>
                    {/* Botão Fechar Desktop */}
                    <button
                        onClick={onClose}
                        className="hidden md:block p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Specs (Só mostra se tiver dados) */}
                <div className="space-y-4 mb-6">
                    {(e.year || e.engine || e.capacity || e.voltage) && (
                        <div className="grid grid-cols-2 gap-4 border-b border-slate-100 pb-4">
                            {e.year && (
                                <div className="flex flex-col">
                                    <span className="text-[10px] text-slate-400 font-bold uppercase">Ano</span>
                                    <span className="font-bold text-slate-700 flex items-center gap-1"><Calendar size={14}/> {e.year}</span>
                                </div>
                            )}
                            {e.engine && (
                                <div className="flex flex-col">
                                    <span className="text-[10px] text-slate-400 font-bold uppercase">Motor</span>
                                    <span className="font-bold text-slate-700 flex items-center gap-1"><Settings size={14}/> {e.engine}</span>
                                </div>
                            )}
                            {e.capacity && (
                                <div className="flex flex-col">
                                    <span className="text-[10px] text-slate-400 font-bold uppercase">Capacidade</span>
                                    <span className="font-bold text-slate-700 flex items-center gap-1"><Weight size={14}/> {e.capacity} kg</span>
                                </div>
                            )}
                            {e.voltage && (
                                <div className="flex flex-col">
                                    <span className="text-[10px] text-slate-400 font-bold uppercase">Voltagem</span>
                                    <span className="font-bold text-slate-700 flex items-center gap-1"><Zap size={14} className="text-yellow-500"/> {e.voltage}V</span>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Descrição */}
                    <div>
                        <h4 className="font-bold text-slate-900 mb-2 flex items-center gap-2 text-sm uppercase">
                            <Info size={16} className="text-blue-500" /> Detalhes
                        </h4>
                        <p className="text-slate-600 leading-relaxed text-sm">
                            {e.description}
                        </p>
                    </div>
                </div>

                {/* Footer CTA */}
                <div className="mt-auto pt-4">
                    <button
                        onClick={() => onWhatsApp(e)}
                        className="w-full bg-[#005831] hover:bg-[#004626] text-white font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-3 shadow-xl shadow-green-900/20 hover:-translate-y-1"
                    >
                        <MessageCircle size={24} />
                        <span>Tenho Interesse</span>
                    </button>
                    <p className="text-center text-[10px] text-slate-400 mt-3 flex items-center justify-center gap-1">
                        <CheckCircle2 size={12} className="text-green-500"/> Disponível para entrega imediata
                    </p>
                </div>

            </div>
        </div>
    );
}