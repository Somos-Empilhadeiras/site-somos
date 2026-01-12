import {
  Info,
  MessageCircle,
  X,
  Settings,
  Weight,
  Zap,
  ArrowUp,
  CheckCircle2,
  FileText
} from "lucide-react";
import { Empilhadeira } from "@/types";
import { useEffect } from "react";

interface ModalItemProps {
  empilhadeira: Empilhadeira;
  onClose: () => void;
  onWhatsApp: (empilhadeira: Empilhadeira) => void;
}

export default function ModalItem({
  empilhadeira: e,
  onClose,
  onWhatsApp,
}: ModalItemProps) {
  const image = e.imageUrl || (e as any).image_url;
  const technicalSheet = e.technicalSheetUrl || (e as any).technical_sheet_url;

  // Fecha ao apertar ESC
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  return (
    /* 1. OVERLAY COM SCROLL (overflow-y-auto)
      Permite que a modal seja maior que a tela e role naturalmente.
    */
    <div
      className="fixed inset-0 z-[99999] bg-slate-900/80 backdrop-blur-sm overflow-y-auto"
      onClick={onClose}
    >
      {/* 2. CONTAINER DE POSICIONAMENTO 
        min-h-full: garante que o scroll funcione
        pt-24 (padding-top): EMPURRA A MODAL PARA BAIXO DA NAVBAR
        pb-10: Espaço no final para não cortar
      */}
      <div className="min-h-full flex items-start justify-center p-4 pt-24 pb-10">
        
        {/* 3. O CARTÃO DA MODAL (Sem altura fixa) */}
        <div
          onClick={(ev) => ev.stopPropagation()}
          className="
            relative
            bg-white
            w-full max-w-5xl
            rounded-3xl
            shadow-2xl
            flex flex-col md:flex-row
            overflow-hidden
            animate-in zoom-in-95 duration-300
          "
        >
          {/* --- BOTÃO FECHAR (Sempre visível no topo do cartão) --- */}
          <button
            onClick={onClose}
            className="
              absolute top-4 right-4 z-50
              p-2
              rounded-full
              bg-white/80 backdrop-blur
              text-slate-500
              hover:bg-red-50 hover:text-red-600
              border border-slate-200 shadow-sm
              transition-all
            "
          >
            <X size={24} />
          </button>

          {/* --- LADO ESQUERDO: IMAGEM --- */}
          {/* h-64 md:h-auto define uma altura fixa só pra imagem no mobile pra não ficar gigante */}
          <div className="w-full md:w-5/12 bg-slate-50 flex items-center justify-center p-8 h-64 md:h-auto relative shrink-0">
             {/* Fundo decorativo */}
             <div className="absolute inset-0 opacity-[0.05] bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:16px_16px]"></div>
             
             <img
              src={image}
              alt={e.model}
              className="relative z-10 w-full h-full object-contain drop-shadow-lg"
            />
          </div>

          {/* --- LADO DIREITO: CONTEÚDO --- */}
          <div className="w-full md:w-7/12 flex flex-col bg-white">
            
            <div className="p-6 md:p-8">
              
              {/* Header */}
              <div className="mb-6 pr-10"> {/* Espaço pro botão fechar não cobrir texto */}
                <div className="flex items-center gap-2 mb-2">
                   <span className="bg-blue-50 text-blue-700 px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider border border-blue-100">
                    {e.brand || "HELI"}
                  </span>
                  {e.year && (
                     <span className="bg-slate-100 text-slate-600 px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider border border-slate-200">
                      Ano {e.year}
                    </span>
                  )}
                </div>
                
                <h2 className="text-2xl md:text-3xl font-black text-slate-900 leading-tight">
                  {e.name}
                </h2>
                <p className="text-slate-400 font-medium text-sm mt-1">
                  Ref: <span className="text-slate-600">{e.model}</span>
                </p>
              </div>

              {/* Grid Especificações */}
              <div className="grid grid-cols-2 gap-3 mb-6">
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                   <div className="flex items-center gap-1.5 text-slate-400 mb-1">
                      <Weight size={14} /> <span className="text-[10px] font-bold uppercase">Capacidade</span>
                   </div>
                   <div className="font-bold text-slate-800 text-base">
                      {e.capacity ? `${e.capacity} kg` : "N/A"}
                   </div>
                </div>

                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                   <div className="flex items-center gap-1.5 text-slate-400 mb-1">
                      <ArrowUp size={14} /> <span className="text-[10px] font-bold uppercase">Elevação</span>
                   </div>
                   <div className="font-bold text-slate-800 text-base">
                      {e.lift_height || "N/A"}
                   </div>
                </div>

                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 col-span-2 md:col-span-1">
                   <div className="flex items-center gap-1.5 text-slate-400 mb-1">
                      <Settings size={14} /> <span className="text-[10px] font-bold uppercase">Motor</span>
                   </div>
                   <div className="font-bold text-slate-800 text-sm truncate">
                      {e.engine || "N/A"}
                   </div>
                </div>

                {e.voltage ? (
                  <div className="bg-yellow-50 p-3 rounded-xl border border-yellow-100">
                     <div className="flex items-center gap-1.5 text-yellow-600 mb-1">
                        <Zap size={14} /> <span className="text-[10px] font-bold uppercase">Voltagem</span>
                     </div>
                     <div className="font-bold text-yellow-700 text-base">{e.voltage}V</div>
                  </div>
                ) : (
                   <div className="bg-green-50 p-3 rounded-xl border border-green-100">
                      <div className="flex items-center gap-1.5 text-green-600 mb-1">
                         <CheckCircle2 size={14} /> <span className="text-[10px] font-bold uppercase">Status</span>
                      </div>
                      <div className="font-bold text-green-700 text-base">Disponível</div>
                   </div>
                )}
              </div>

              {/* Descrição */}
              <div className="mb-6">
                <h4 className="font-bold text-slate-900 mb-2 flex items-center gap-2 text-xs uppercase tracking-wide">
                  <Info size={14} className="text-[#005831]" /> Sobre o equipamento
                </h4>
                <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-line">
                  {e.description || "Entre em contato para mais detalhes técnicos."}
                </p>
              </div>

              {/* BOTÕES DE AÇÃO (No final do fluxo normal) */}
              <div className="flex flex-col md:flex-row gap-3 pt-4 border-t border-slate-100">
                {technicalSheet && (
                  <a
                    href={technicalSheet}
                    target="_blank"
                    className="w-full md:w-auto px-6 py-3.5 rounded-xl border-2 border-slate-200 text-slate-600 font-bold text-sm hover:border-slate-300 hover:bg-slate-50 transition-colors flex items-center justify-center gap-2"
                  >
                    <FileText size={18} />
                    Ficha Técnica
                  </a>
                )}

                <button
                  onClick={() => onWhatsApp(e)}
                  className="flex-1 w-full bg-[#005831] hover:bg-[#004626] text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 shadow-lg hover:shadow-xl active:scale-[0.98] transition-all"
                >
                  <MessageCircle size={20} />
                  Solicitar Cotação
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}