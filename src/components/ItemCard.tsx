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
  MessageCircle
} from 'lucide-react';
import { COMPANY_CONTACTS } from '@/lib/constants';

// --- CONFIGURAÇÃO DOS NÚMEROS POR REGIÃO ---
// Substitua pelos números reais (apenas números, com DDD)
const REGIONAL_CONTACTS = {
  GO_TO: COMPANY_CONTACTS.juliana_phone_raw, // Goiânia / Tocantins
  DF: COMPANY_CONTACTS.maike_phone_raw,    // Distrito Federal
  BA: COMPANY_CONTACTS.cristiane_phone_raw,    // Bahia
  PE: COMPANY_CONTACTS.alan_phone_raw,    // Pernambuco
};

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
  const itemType = empilhadeira.model
    ? 'Equipamento' // É Empilhadeira
    : empilhadeira.capacity
      ? 'Peça'
      : 'Serviço';

  const TypeIcon =
    itemType === 'Equipamento'
      ? Truck
      : itemType === 'Peça'
        ? Box
        : Wrench;

  // --- FUNÇÃO DE CLIQUE NO BOTÃO DE CONTATO ---
  const handleContactClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Não abre os detalhes do item

    if (itemType === 'Equipamento') {
      // Se for Empilhadeira, usa o comportamento padrão (direto)
      onWhatsApp(empilhadeira);
    } else {
      // Se for Peça ou Serviço, abre o seletor de região
      setShowLocationSelector(true);
    }
  };

  // --- FUNÇÃO PARA REDIRECIONAR PARA O ZAP DA REGIÃO ---
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
        className="group bg-white border border-slate-200 rounded-sm overflow-hidden hover:shadow-xl transition-shadow cursor-pointer flex flex-col relative"
      >
        {/* IMAGEM */}
        <div className="relative h-56 bg-slate-100 flex items-center justify-center overflow-hidden">
          {image ? (
            <img
              src={image}
              alt={titulo}
              className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <Settings size={48} className="text-slate-300" />
          )}

          {/* Badge de Tipo */}
          <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-white/90 backdrop-blur px-2.5 py-1 rounded-sm text-xs font-bold text-slate-700 border shadow-sm">
            <TypeIcon size={12} />
            {itemType}
          </div>
        </div>

        {/* CONTEÚDO */}
        <div className="flex flex-col flex-1 p-5">
          <h3
            className="text-base font-bold text-slate-900 leading-snug line-clamp-2 group-hover:text-[#005831] transition-colors uppercase"
            title={titulo}
          >
            {titulo}
          </h3>

          <p className="text-xs text-slate-500 mt-1 mb-3 line-clamp-1">
            {subtitulo}
          </p>

          {/* DETALHES */}
          <div className="flex flex-wrap gap-2 text-xs text-slate-600 mb-4">
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
              className="bg-[#005831] hover:bg-[#004626] text-white p-3 rounded-md transition-all shadow-md hover:shadow-lg active:scale-95 flex items-center justify-center"
              title="Solicitar orçamento via WhatsApp"
            >
              <MessageCircle size={20} />
            </button>
          </div>
        </div>
      </article>

      {/* --- MODAL DE SELEÇÃO DE REGIÃO (Só aparece para Peças/Pneus/Serviços) --- */}
      {showLocationSelector && (
        <div 
          className="fixed inset-0 z-[9999] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={(e) => {
             e.stopPropagation();
             setShowLocationSelector(false);
          }}
        >
          <div 
            className="bg-white rounded-lg shadow-2xl w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()} // Evita fechar ao clicar dentro
          >
            {/* Header da Modal */}
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