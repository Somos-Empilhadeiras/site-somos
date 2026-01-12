'use client';

import { useState } from 'react';
import { Empilhadeira } from '@/types';
import {
  Settings,
  Calendar,
  Weight,
  Truck,
  Wrench,
  Box,
  MapPin,
  X,
  MessageCircle,
  // Novos ícones importados
  Zap,
  ArrowUp,
  Gauge,
  Battery,
  Settings2
} from 'lucide-react';
import { COMPANY_CONTACTS, REGIONAL_CONTACTS } from '@/lib/constants';

interface ItemCardProps {
  empilhadeira: Empilhadeira;
  onOpenModal: (item: Empilhadeira) => void;
  onWhatsApp: (item: Empilhadeira) => void;
}

export default function ItemCard({
  empilhadeira,
  onOpenModal,
  onWhatsApp
}: ItemCardProps) {
  const [showLocationSelector, setShowLocationSelector] = useState(false);

  // --- LÓGICA DE IDENTIFICAÇÃO ---
  // Verifica se é uma máquina baseada na existência de 'engine' ou 'model'
  const isMachine = !!(empilhadeira.model || empilhadeira.engine);

  // Verifica se é elétrica
  const isElectric = empilhadeira.engine?.toLowerCase().includes('elétric') || (empilhadeira.voltage && empilhadeira.voltage > 0);

  const titulo = empilhadeira.model
    ? `${empilhadeira.brand} ${empilhadeira.model}`
    : empilhadeira.name;

  const subtitulo =
    empilhadeira.manufacturer ||
    empilhadeira.brand ||
    'Item técnico';

  const image =
    empilhadeira.imageUrl ||
    (empilhadeira as any).image_url;

  /* ===============================
      TIPO DO ITEM (SEMÂNTICA)
  ================================ */
  const itemType = isMachine
    ? 'Empilhadeira'
    : empilhadeira.capacity
      ? 'Peça'
      : 'Serviço';

  const TypeIcon =
    itemType === 'Empilhadeira'
      ? Truck
      : itemType === 'Peça'
        ? Box
        : Wrench;

  // --- FUNÇÃO DE CLIQUE NO BOTÃO DE CONTATO ---
  const handleContactClick = (e: React.MouseEvent) => {
    e.stopPropagation();

    if (itemType === 'Empilhadeira') {
      const baseUrl = window.location.origin;
      const categoria = empilhadeira.engine?.includes("Elétrica") ? "eletricas" : "combustao";

      // Link com busca automática
      const linkDireto = `${baseUrl}/empilhadeiras/${categoria}?q=${encodeURIComponent(empilhadeira.name)}`;

      // --- MENSAGEM MELHORADA AQUI ---
      const mensagem = `Olá! Vi no site da Somos e gostaria de uma *cotação* para este equipamento:

*Modelo:* ${empilhadeira.name}
*Link:* ${linkDireto}

Poderia me passar valores e disponibilidade?`;

      const linkZap = `https://wa.me/5562991834188?text=${encodeURIComponent(mensagem)}`;
      window.open(linkZap, '_blank');

    } else {
      setShowLocationSelector(true);
    }
  };

  const redirectToRegion = (phone: string) => {
    const text = `Olá! Tenho interesse no item: *${titulo}* (${itemType}). Poderia me passar um orçamento?`;
    const link = `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
    window.open(link, '_blank');
    setShowLocationSelector(false);
  };

  return (
    <>
      <article
        onClick={() => onOpenModal(empilhadeira)}
        className="group bg-white border border-slate-200 rounded-lg overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col relative h-full"
      >
        {/* === ÁREA DA IMAGEM === */}
        <div className="relative h-60 bg-slate-50 flex items-center justify-center overflow-hidden p-4">
          {image ? (
            <img
              src={image}
              alt={titulo}
              className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <Settings size={48} className="text-slate-300" />
          )}

          {/* Badge Superior Esquerdo (Tipo de Item) */}
          <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-white/90 backdrop-blur px-2.5 py-1 rounded-md text-[10px] font-bold text-slate-700 border shadow-sm uppercase tracking-wide">
            <TypeIcon size={12} />
            {itemType}
          </div>

          {/* Badge Superior Direito (Apenas para Máquinas - Motorização) */}
          {isMachine && empilhadeira.engine && (
            <div className={`absolute top-3 right-3 px-2.5 py-1 rounded-md text-[10px] font-bold text-white shadow-sm uppercase tracking-wide ${isElectric ? 'bg-blue-600' : 'bg-orange-600'}`}>
              {empilhadeira.engine}
            </div>
          )}
        </div>

        {/* === CONTEÚDO === */}
        <div className="flex flex-col flex-1 p-5">
          <div className="mb-4">
            <h3
              className="text-base font-bold text-slate-900 leading-snug line-clamp-2 group-hover:text-[#005831] transition-colors uppercase"
              title={titulo}
            >
              {titulo}
            </h3>
            <p className="text-xs text-slate-500 mt-1 uppercase tracking-wider font-medium">
              {subtitulo}
            </p>
          </div>

          {/* === ÁREA DE ESPECIFICAÇÕES (ADAPTÁVEL) === */}
          <div className="mb-4">
            {isMachine ? (
              // --- LAYOUT DE MÁQUINA (Rico em detalhes) ---
              <div className="grid grid-cols-2 gap-y-2 gap-x-2 bg-slate-50 p-3 rounded-lg border border-slate-100">
                {/* Capacidade */}
                <div className="flex flex-col">
                  <span className="text-[10px] text-slate-400 uppercase font-bold flex items-center gap-1">
                    <Weight size={10} /> Capacidade
                  </span>
                  <span className="text-xs font-bold text-slate-700">{empilhadeira.capacity ? `${empilhadeira.capacity}kg` : '-'}</span>
                </div>

                {/* Elevação */}
                <div className="flex flex-col border-l border-slate-200 pl-2">
                  <span className="text-[10px] text-slate-400 uppercase font-bold flex items-center gap-1">
                    <ArrowUp size={10} /> Elevação
                  </span>
                  <span className="text-xs font-bold text-slate-700">{empilhadeira.lift_height || '-'}</span>
                </div>

                {/* Linha 2: Energia ou Ano */}
                {isElectric ? (
                  // Se for elétrica: Tensão
                  <div className="flex flex-col pt-2 border-t border-slate-200 mt-1">
                    <span className="text-[10px] text-slate-400 uppercase font-bold flex items-center gap-1">
                      <Zap size={10} /> Sistema Elétrico
                    </span>
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-slate-700">{empilhadeira.voltage ? `${empilhadeira.voltage}V` : 'Elétrica'}</span>
                      {empilhadeira.batteryDetails && <span className="text-[10px] text-slate-500 truncate max-w-[100px]">{empilhadeira.batteryDetails}</span>}
                    </div>
                  </div>

                ) : (
                  // Se for combustão: Ano ou Combustível detalhado
                  <div className="flex flex-col pt-2 border-t border-slate-200 mt-1">
                    <span className="text-[10px] text-slate-400 uppercase font-bold flex items-center gap-1">
                      <Gauge size={10} /> Detalhes
                    </span>
                    <div className="flex gap-3">
                      {empilhadeira.year && <span className="text-xs font-bold text-slate-700">{empilhadeira.year}</span>}
                      <span className="text-xs text-slate-600">Motor Combustão</span>
                    </div>
                  </div>
                )}


                <div className="col-span-1 flex flex-col border-slate-200 border-t border-l pl-2 mt-1">
                  <span className="text-[10px] text-slate-400 uppercase font-bold flex items-center gap-1">
                    <Settings size={10} /> Motor
                  </span>
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-slate-700">{empilhadeira.engine}</span>
                    {empilhadeira.batteryDetails && <span className="text-[10px] text-slate-500 truncate max-w-[100px]">{empilhadeira.batteryDetails}</span>}
                  </div>
                </div>

              </div>
            ) : (
              // --- LAYOUT DE PEÇA/SERVIÇO (Simples) ---
              <div className="flex flex-wrap gap-2 text-xs text-slate-600 min-h-[50px] content-start">
                {empilhadeira.year && (
                  <span className="flex items-center gap-1 bg-slate-50 px-2 py-1 rounded border border-slate-100">
                    <Calendar size={12} />
                    {empilhadeira.year}
                  </span>
                )}
                {empilhadeira.capacity && (
                  <span className="flex items-center gap-1 bg-slate-50 px-2 py-1 rounded border border-slate-100">
                    <Weight size={12} />
                    {empilhadeira.capacity}kg
                  </span>
                )}
                {!empilhadeira.year && !empilhadeira.capacity && (
                  <span className="text-slate-400 text-xs italic">Toque para ver detalhes técnicos e aplicação.</span>
                )}
              </div>
            )}
          </div>

          {/* FOOTER */}
          <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between">
            <div>
              <span className="block text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                Investimento
              </span>
              <span className="text-lg font-extrabold text-[#005831]">
                {empilhadeira.price > 0
                  ? empilhadeira.price.toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL'
                  })
                  : 'Sob consulta'}
              </span>
            </div>

            <button
              onClick={handleContactClick}
              className="bg-[#005831] hover:bg-[#004626] text-white p-2.5 rounded-lg transition-all shadow-md hover:shadow-lg active:scale-95 flex items-center justify-center gap-0.5 group/btn"
              title="Solicitar orçamento via WhatsApp"
            >
              <span className="text-xs font-bold hidden sm:inline-block max-w-0 overflow-hidden group-hover/btn:max-w-xs transition-all duration-500 whitespace-nowrap">Solicitar Orçamento</span>
              <MessageCircle size={20} />
            </button>
          </div>
        </div>
      </article>

      {/* --- MODAL DE SELEÇÃO DE REGIÃO (Mantido igual) --- */}
      {showLocationSelector && (
        <div
          className="fixed inset-0 z-9999 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={(e) => {
            e.stopPropagation();
            setShowLocationSelector(false);
          }}
        >
          <div
            className="bg-white rounded-lg shadow-2xl w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-[#005831] p-4 flex justify-between items-center">
              <h3 className="text-white font-bold flex items-center gap-2">
                <MapPin size={18} />
                Selecione sua Região
              </h3>
              <button
                onClick={() => setShowLocationSelector(false)}
                className="text-white/80 hover:text-white hover:bg-white/20 rounded-full p-1 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6">
              <p className="text-sm text-slate-600 mb-4 text-center">
                Para um atendimento mais ágil sobre <strong>{titulo}</strong>, escolha a unidade mais próxima:
              </p>

              <div className="grid gap-3">
                <button
                  onClick={() => redirectToRegion(REGIONAL_CONTACTS.GO_TO)}
                  className="w-full flex items-center justify-between p-4 rounded-md border border-slate-200 hover:border-[#005831] hover:bg-green-50 transition-all group"
                >
                  <span className="font-bold text-slate-700 group-hover:text-[#005831]">Goiânia / Tocantins</span>
                  <MessageCircle size={18} className="text-slate-300 group-hover:text-[#005831]" />
                </button>

                <button
                  onClick={() => redirectToRegion(REGIONAL_CONTACTS.DF)}
                  className="w-full flex items-center justify-between p-4 rounded-md border border-slate-200 hover:border-[#005831] hover:bg-green-50 transition-all group"
                >
                  <span className="font-bold text-slate-700 group-hover:text-[#005831]">Distrito Federal</span>
                  <MessageCircle size={18} className="text-slate-300 group-hover:text-[#005831]" />
                </button>

                <button
                  onClick={() => redirectToRegion(REGIONAL_CONTACTS.BA)}
                  className="w-full flex items-center justify-between p-4 rounded-md border border-slate-200 hover:border-[#005831] hover:bg-green-50 transition-all group"
                >
                  <span className="font-bold text-slate-700 group-hover:text-[#005831]">Bahia</span>
                  <MessageCircle size={18} className="text-slate-300 group-hover:text-[#005831]" />
                </button>

                <button
                  onClick={() => redirectToRegion(REGIONAL_CONTACTS.PE)}
                  className="w-full flex items-center justify-between p-4 rounded-md border border-slate-200 hover:border-[#005831] hover:bg-green-50 transition-all group"
                >
                  <span className="font-bold text-slate-700 group-hover:text-[#005831]">Pernambuco</span>
                  <MessageCircle size={18} className="text-slate-300 group-hover:text-[#005831]" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}