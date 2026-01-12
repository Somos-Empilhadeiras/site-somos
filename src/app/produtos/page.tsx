'use client';

import { useState } from 'react';
import {
  Package,
  Wrench,
  Disc,
  X,
  MapPin,
  MessageCircle,
  ArrowRight,
  CheckCircle2,
  Tag // Ícone para identificar a categoria
} from 'lucide-react';
import DynamicBanner from '@/components/admin/banners/DynamicBanner';
import { REGIONAL_CONTACTS } from '@/lib/constants';

// ======================================================
// COMPONENTE MODAL DE CONTATO (ATUALIZADO)
// ======================================================
interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  category: string;
}

const ContactModal = ({ isOpen, onClose, category }: ContactModalProps) => {
  if (!isOpen) return null;

  const redirectToRegion = (phone: string, regionName: string) => {
    // Monta a mensagem personalizada
    const message = `Olá! Vim pelo site. Estou interessado em *${category}* para a região de *${regionName}*. Poderia me ajudar?`;
    
    // Cria o link codificado
    const link = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
    
    window.open(link, '_blank');
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-[9999] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl shadow-2xl w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Cabeçalho */}
        <div className="bg-[#005831] p-5">
          <div className="flex justify-between items-start mb-3">
            <h3 className="text-white font-bold flex items-center gap-2 text-lg">
              <MapPin size={20} />
              Selecione sua Região
            </h3>
            <button
              onClick={onClose}
              className="text-white/80 hover:text-white hover:bg-white/20 rounded-full p-1 transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Badge de Identificação do Interesse */}
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md text-white px-3 py-1.5 rounded-lg text-xs font-medium border border-white/10">
            <Tag size={14} />
            <span>Interesse: <strong>{category}</strong></span>
          </div>
        </div>

        <div className="p-6">
          <p className="text-sm text-slate-600 mb-5 text-center leading-relaxed">
            Para agilizar seu atendimento sobre <strong>{category}</strong>, escolha a unidade mais próxima:
          </p>

          <div className="grid gap-3">
            <button
              onClick={() => redirectToRegion(REGIONAL_CONTACTS.GO_TO, 'Goiânia / Tocantins')}
              className="w-full flex items-center justify-between p-4 rounded-xl border border-slate-200 hover:border-[#005831] hover:bg-green-50 transition-all group"
            >
              <span className="font-bold text-slate-700 group-hover:text-[#005831]">Goiânia / Tocantins</span>
              <MessageCircle size={20} className="text-slate-300 group-hover:text-[#005831]" />
            </button>

            <button
              onClick={() => redirectToRegion(REGIONAL_CONTACTS.DF, 'Distrito Federal')}
              className="w-full flex items-center justify-between p-4 rounded-xl border border-slate-200 hover:border-[#005831] hover:bg-green-50 transition-all group"
            >
              <span className="font-bold text-slate-700 group-hover:text-[#005831]">Distrito Federal</span>
              <MessageCircle size={20} className="text-slate-300 group-hover:text-[#005831]" />
            </button>

            <button
              onClick={() => redirectToRegion(REGIONAL_CONTACTS.BA, 'Bahia')}
              className="w-full flex items-center justify-between p-4 rounded-xl border border-slate-200 hover:border-[#005831] hover:bg-green-50 transition-all group"
            >
              <span className="font-bold text-slate-700 group-hover:text-[#005831]">Bahia</span>
              <MessageCircle size={20} className="text-slate-300 group-hover:text-[#005831]" />
            </button>

            <button
              onClick={() => redirectToRegion(REGIONAL_CONTACTS.PE, 'Pernambuco')}
              className="w-full flex items-center justify-between p-4 rounded-xl border border-slate-200 hover:border-[#005831] hover:bg-green-50 transition-all group"
            >
              <span className="font-bold text-slate-700 group-hover:text-[#005831]">Pernambuco</span>
              <MessageCircle size={20} className="text-slate-300 group-hover:text-[#005831]" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ======================================================
// PÁGINA PRINCIPAL
// ======================================================
export default function ProductsPage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const openModal = (category: string) => setSelectedCategory(category);
  const closeModal = () => setSelectedCategory(null);

  const SOLUTIONS = [
    {
      id: 'pecas',
      title: 'Peças de Reposição',
      description: 'Peças de alta durabilidade para manter sua empilhadeira operando com segurança.',
      icon: Package,
      details: ['Filtros e Óleos', 'Componentes de Motor', 'Sistema Hidráulico', 'Elétrica e Sensores'],
      color: ' border-[#474747] text-[#00804A]',
      btnColor: 'bg-[#474747] hover:bg-[#51AE14]'
    },
    {
      id: 'servicos',
      title: 'Serviços Especializados',
      description: 'Manutenção técnica realizada por profissionais experientes e qualificados.',
      icon: Wrench,
      details: ['Manutenção Preventiva', 'Reforma de Máquinas', 'Diagnóstico Técnico', 'Suporte Especializado'],
      color: ' border-[#474747] text-[#00804A]',
      btnColor: 'bg-[#474747] hover:bg-[#51AE14]'
    },
    {
      id: 'pneus',
      title: 'Pneus Industriais',
      description: 'Opções robustas para garantir estabilidade e tração em qualquer operação.',
      icon: Disc,
      details: ['Pneus Pneumáticos', 'Pneus Superelásticos', 'Pneus Maciços', 'Serviço de Prensagem'],
      color: ' border-[#474747] text-[#00804A]',
      btnColor: 'bg-[#474747] hover:bg-[#51AE14]'
    }
  ];

  return (
    <main className="min-h-screen bg-slate-50 font-sans">

      <DynamicBanner id="produtos-hero" />

      {/* Hero Section */}
      <div className="bg-[#005831] py-12 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <h1 className="text-3xl md:text-5xl font-extrabold uppercase tracking-tight mb-4">
            Soluções Completas
          </h1>
          <p className="text-green-100 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
            Peças, Pneus e Serviços Técnicos para garantir o desempenho da sua operação.
          </p>
        </div>
      </div>

      {/* ÁREA DOS CARDS */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {SOLUTIONS.map((item) => (
              <div
                key={item.id}
                onClick={() => openModal(item.title)}
                className="group bg-white rounded-2xl shadow-sm hover:shadow-2xl border border-slate-200 hover:border-[#005831]/30 transition-all duration-300 cursor-pointer overflow-hidden flex flex-col relative"
              >
                <div className={`h-2 w-full ${item.btnColor}`}></div>
                <div className="p-8 flex-1 flex flex-col">
                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110 duration-300 ${item.color}`}>
                    <item.icon size={32} />
                  </div>
                  <h2 className="text-2xl font-bold text-slate-800 mb-3 group-hover:text-[#005831] transition-colors">
                    {item.title}
                  </h2>
                  <p className="text-slate-600 mb-6 leading-relaxed">
                    {item.description}
                  </p>
                  <ul className="space-y-2 mb-8 bg-slate-50 p-4 rounded-lg">
                    {item.details.map((detail, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-sm text-slate-600 font-medium">
                        <CheckCircle2 size={14} className="text-[#005831]" />
                        {detail}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-auto">
                    <button className={`w-full py-4 rounded-xl text-white font-bold flex items-center justify-center gap-2 transition-all shadow-md group-hover:shadow-lg ${item.btnColor}`}>
                      Solicitar Cotação
                      <ArrowRight size={20} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAIXA DE CONFIANÇA */}
      <section className="bg-white border-t border-slate-200 py-16">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-slate-400 font-bold text-sm uppercase tracking-widest mb-10">
            Excelência Somos Empilhadeiras
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 md:gap-12">
            {/* Item 1 */}
            <div className="p-4 flex flex-col items-center">
              <span className="inline-flex items-center justify-center w-12 h-12 bg-green-50 text-[#005831] rounded-full mb-4">
                <Wrench size={24} />
              </span>
              <span className="block text-xl font-black text-slate-800 mb-2 uppercase">Especialistas</span>
              <span className="text-sm text-slate-500 font-medium leading-relaxed max-w-[200px]">
                Equipe técnica treinada e qualificada.
              </span>
            </div>

            {/* Item 2 */}
            <div className="p-4 flex flex-col items-center">
              <span className="inline-flex items-center justify-center w-12 h-12 bg-green-50 text-[#005831] rounded-full mb-4">
                <CheckCircle2 size={24} />
              </span>
              <span className="block text-xl font-black text-slate-800 mb-2 uppercase">Agilidade</span>
              <span className="text-sm text-slate-500 font-medium leading-relaxed max-w-[200px]">
                Rapidez no diagnóstico e na solução do problema.
              </span>
            </div>

            {/* Item 3 */}
            <div className="p-4 flex flex-col items-center">
              <span className="inline-flex items-center justify-center w-12 h-12 bg-green-50 text-[#005831] rounded-full mb-4">
                <MessageCircle size={24} />
              </span>
              <span className="block text-xl font-black text-slate-800 mb-2 uppercase">Confiança</span>
              <span className="text-sm text-slate-500 font-medium leading-relaxed max-w-[200px]">
                Foco total na satisfação e sucesso do cliente.
              </span>
            </div>
          </div>
        </div>
      </section>

      <DynamicBanner id="produtos-rodape" />

      <ContactModal
        isOpen={!!selectedCategory}
        onClose={closeModal}
        category={selectedCategory || ''}
      />

    </main>
  );
}