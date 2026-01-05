import { Empilhadeira } from '@/types';
import {
  Settings,
  Calendar,
  Weight,
  Truck,
  Wrench,
  Box
} from 'lucide-react';

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
     TIPO DO ITEM (SEMÂNTICA VISUAL)
  ================================ */
  const itemType = empilhadeira.model
    ? 'Equipamento'
    : empilhadeira.capacity
      ? 'Peça'
      : 'Serviço';

  const TypeIcon =
    itemType === 'Equipamento'
      ? Truck
      : itemType === 'Peça'
        ? Box
        : Wrench;

  return (
    <article
      onClick={() => onOpenModal(empilhadeira)}
      className="group bg-white border border-slate-200 rounded-2xl overflow-hidden hover:shadow-xl transition-shadow cursor-pointer flex flex-col"
    >

      {/* IMAGEM */}
      <div className="relative h-56 bg-slate-100 flex items-center justify-center">
        {image ? (
          <img
            src={image}
            alt={titulo}
            className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-[1.03]"
          />
        ) : (
          <Settings size={48} className="text-slate-300" />
        )}

        {/* Tipo do item */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-white/90 backdrop-blur px-2.5 py-1 rounded-full text-xs font-bold text-slate-700 border">
          <TypeIcon size={12} />
          {itemType}
        </div>
      </div>

      {/* CONTEÚDO */}
      <div className="flex flex-col flex-1 p-5">

        <h3
          className="text-base font-bold text-slate-800 leading-snug line-clamp-2 group-hover:text-[#005831] transition-colors"
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
            <span className="flex items-center gap-1 bg-slate-50 px-2 py-1 rounded border">
              <Calendar size={12} />
              {empilhadeira.year}
            </span>
          )}

          {empilhadeira.capacity && (
            <span className="flex items-center gap-1 bg-slate-50 px-2 py-1 rounded border">
              <Weight size={12} />
              {empilhadeira.capacity}kg
            </span>
          )}
        </div>

        {/* FOOTER */}
        <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between">
          <div>
            <span className="block text-[10px] uppercase font-semibold text-slate-400">
              Valor
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
            onClick={(e) => {
              e.stopPropagation();
              onWhatsApp(empilhadeira);
            }}
            className="bg-[#005831] hover:bg-[#004626] text-white p-3 rounded-xl transition-colors shadow-md"
            title="Solicitar orçamento"
          >
            <Truck size={18} />
          </button>
        </div>
      </div>
    </article>
  );
}
