'use client';
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ComposableMap, Geographies, Geography } from 'react-simple-maps';
import { MapPin,  Mail, MessageCircle, Phone, User, Clock } from 'lucide-react';
import {GEO_URL, STATE_DETAILS } from '@/lib/constants';


// Importante: 'GO' é o primeiro para iniciar nele
const ACTIVE_STATES = ['GO', 'DF', 'TO', 'BA', 'PE'];


interface GeoProps {
  rsmKey: string;
  properties: {
    sigla: string;
    name: string;
  };
}

interface PopupData {
  title: string;
  sigla: string;
  date?: string;
  city?: string;
  address: string;
  mail: string;
  phone: string;
  representant: string;
  operation: string;
  message: string;
  wpp: string,
  isActive: boolean;
}

export default function BrazilMap() {
  // Estado para controlar qual sigla está sendo exibida no momento
  const [currentSigla, setCurrentSigla] = useState<string>('GO');

  // Dados completos para exibição (derivado da sigla ou clique manual)
  const [displayData, setDisplayData] = useState<PopupData | null>(null);

  // Controle do modo automático
  const [isAutoPlay, setIsAutoPlay] = useState(true);

  // Refs para gerenciar os timers sem causar re-renderizações desnecessárias
  const autoPlayTimerRef = useRef<NodeJS.Timeout | null>(null);
  const inactivityTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Função auxiliar para montar os dados de exibição baseados na sigla
  const getDisplayData = useCallback((sigla: string, stateName?: string): PopupData => {
    const isActive = ACTIVE_STATES.includes(sigla);
    const details = STATE_DETAILS[sigla];

    const title = stateName || sigla;

    if (isActive) {
      return {
        title: title,
        sigla: sigla,
        address: details.address,
        representant: details.representant,
        operation: details.operation,
        mail: details.mail,
        phone: details.phone,
        date: details?.date || 'Presente',
        city: details?.city || "",
        message: details?.text || 'Atuando com excelência.',
        wpp: details?.wpp || "",
        isActive: true
      };
    } else {
      return {
        title: title,
        sigla: sigla,
        address: details.address,
        representant: details.representant,
        operation: details.operation,
        mail: details.mail,
        phone: details.phone,
        message: 'Ainda não possuímos filial física neste estado, mas entre em contato para projetos especiais.',
        wpp: details.wpp,
        isActive: false
      };
    }
  }, []);

  // 1. Efeito para o Carrossel Automático
  useEffect(() => {
    if (isAutoPlay) {
      autoPlayTimerRef.current = setInterval(() => {
        setCurrentSigla((prev) => {
          const currentIndex = ACTIVE_STATES.indexOf(prev);
          // Se não achar (caso de clique em estado inativo), volta pro 0, senão vai pro próximo
          const nextIndex = (currentIndex + 1) % ACTIVE_STATES.length;
          return ACTIVE_STATES[nextIndex];
        });
      }, 4000); // Muda a cada 4 segundos
    }

    return () => {
      if (autoPlayTimerRef.current) clearInterval(autoPlayTimerRef.current);
    };
  }, [isAutoPlay]);

  // 2. Efeito para atualizar os dados visuais quando a sigla muda (Automático)
  useEffect(() => {
    // Só atualizamos automaticamente se estivermos no modo AutoPlay
    // Isso evita conflitos visuais rápidos
    if (isAutoPlay) {
      // Nota: No modo automático, não temos o "Nome Completo" do GeoJSON fácil, 
      // então usamos a sigla ou você precisaria de um mapa { 'GO': 'Goiás' }.
      // Para simplificar, vou deixar a Sigla no título ou buscaria de uma lista estática.
      const mapNames: Record<string, string> = {
        'GO': 'Goiás', 'DF': 'Distrito Federal', 'TO': 'Tocantins', 'BA': 'Bahia', 'PE': 'Pernambuco'
      };
      setDisplayData(getDisplayData(currentSigla, mapNames[currentSigla]));
    }
  }, [currentSigla, isAutoPlay, getDisplayData]);

  // 3. Handler de Clique (Interrupção e Lógica de Retomada)
  const handleStateClick = (geo: GeoProps) => {
    const { sigla, name } = geo.properties;

    // 1. Para o slideshow
    setIsAutoPlay(false);

    // 2. Limpa timer de inatividade anterior se houver (reset)
    if (inactivityTimerRef.current) clearTimeout(inactivityTimerRef.current);

    // 3. Atualiza a tela imediatamente com o clique do usuário
    setCurrentSigla(sigla);
    setDisplayData(getDisplayData(sigla, name));

    // 4. Configura timer para voltar a rodar se ninguém mexer por 5 segundos
    inactivityTimerRef.current = setTimeout(() => {
      // Só volta a rodar se o estado clicado for um dos ativos. 
      // Se clicou num estado cinza, talvez queira voltar pro 'GO'.
      const startNext = ACTIVE_STATES.includes(sigla) ? sigla : 'GO';
      setCurrentSigla(startNext);
      setIsAutoPlay(true);
    }, 10000); // 5 segundos de espera antes de voltar
  };

  return (
    <div className="
  flex flex-col lg:flex-row
  w-full
  max-w-7xl
  mx-auto
  gap-6
  items-stretch
  min-h-[600px]
  h-[75vh]
  max-h-[800px]
">

      {/* LADO ESQUERDO: MAPA */}
      <div className="
  relative
  flex-1
  bg-white
  rounded-2xl
  border border-slate-200
  shadow-inner
  overflow-hidden
">
        <ComposableMap
          projection="geoMercator"
          projectionConfig={{ scale: 830, center: [-52, -15] }}
          className="w-full h-full"
        >

          <Geographies geography={GEO_URL}>
            {({ geographies }: { geographies: GeoProps[] }) =>
              geographies.map((geo) => {
                const geoSigla = geo.properties.sigla;
                const isActiveInList = ACTIVE_STATES.includes(geoSigla);

                // O estado está selecionado se for igual ao currentSigla
                const isSelected = currentSigla === geoSigla;

                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    onClick={() => handleStateClick(geo)}
                    fill={
                      isSelected
                        ? (isActiveInList ? "#15803d" : "#64748b") // Selecionado (Ativo Verde Forte : Inativo Cinza Escuro)
                        : isActiveInList ? "#22c55e" : "#e2e8f0"    // Normal (Ativo Verde Claro : Inativo Cinza Claro)
                    }
                    stroke="#FFF"
                    strokeWidth={0.5}
                    style={{
                      default: { outline: "none", transition: "all 0.5s ease" }, // Transição suave para o slide
                      hover: {
                        fill: isActiveInList ? "#166534" : "#cbd5e1",
                        outline: "none",
                        cursor: "pointer",
                      },
                      pressed: { outline: "none" },
                    }}
                  />
                );
              })
            }
          </Geographies>
        </ComposableMap>

        {/* Indicador de Status do Slide */}
        <div className="absolute bottom-4 left-4 flex flex-col gap-2">
          <div className="bg-white/80 backdrop-blur px-3 py-2 rounded-lg border border-slate-200 shadow-sm flex items-center gap-2 text-xs text-slate-600">
            <div className={`w-3 h-3 rounded-full transition-colors duration-500 ${isAutoPlay ? 'bg-green-500 animate-pulse' : 'bg-yellow-500'}`}></div>
            {isAutoPlay ? 'Modo Apresentação' : 'Interação Manual'}
          </div>
        </div>
      </div>

      {/* LADO DIREITO: PAINEL DE INFORMAÇÕES */}
      <div className={`w-full lg:w-2/6 bg-white rounded-2xl border border-slate-200 shadow-lg p-6 flex flex-col h-full overflow-hidden`}>
        <div className="flex-1 overflow-y-auto pr-2">

          {displayData ? (
            <div
              key={displayData.sigla}
              className="animate-in fade-in slide-in-from-right-4 duration-500 space-y-6"
            >

              {/* Cabeçalho */}
              <div className="border-b border-slate-100 pb-4">
                <div className="flex items-center justify-between mb-2">
                  <span
                    className={`text-xs font-bold px-2 py-1 rounded-full uppercase tracking-wide transition-colors ${displayData.isActive
                      ? 'bg-green-100 text-green-700'
                      : 'bg-slate-100 text-slate-500'
                      }`}
                  >
                    {displayData.isActive && displayData.sigla === 'GO'
                      ? 'Matriz'
                      : displayData.isActive
                        ? 'Filial'
                        : 'Indisponível'}
                  </span>

                  <span className="text-4xl font-black text-slate-100">
                    {displayData.sigla}
                  </span>
                </div>

                <h2 className="text-3xl font-bold text-slate-800 leading-tight">
                  {displayData.title}
                </h2>
              </div>

              {/* Conteúdo */}
              {displayData.isActive ? (
                <div className="space-y-3">
                  <div className="space-y-4 pt-2">

                    {/* Endereço */}
                    {displayData.address && (
                      <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg">
                        <div className="mt-1 text-[#005831]">
                          <MapPin size={18} />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-500 uppercase">Endereço</p>
                          <p className="text-sm text-slate-700 leading-relaxed">{displayData.address}</p>
                        </div>
                      </div>
                    )}

                    {/* Representante (Antigo 'manager', agora 'representant') */}
                    {displayData.representant && (
                      <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                        <div className="text-[#005831]">
                          <User size={18} />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-500 uppercase">Responsável</p>
                          <p className="text-sm font-bold text-slate-800">{displayData.representant}</p>
                        </div>
                      </div>
                    )}

                    {/* Horário de Operação (Novo - já que você tem esse dado) */}
                    {displayData.operation && (
                      <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                        <div className="text-[#005831]">
                          <Clock size={18} />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-500 uppercase">Funcionamento</p>
                          <p className="text-sm font-bold text-slate-800">{displayData.operation}</p>
                        </div>
                      </div>
                    )}

                    {/* Contatos */}
                    <div className="grid grid-cols-1 gap-3 mt-4">
                      {displayData.phone && (
                        <a
                          href={`https://wa.me/${displayData.wpp.replace(/\D/g, '')}`}
                          target='_blank'
                          className="flex items-center gap-3 p-3 border border-slate-200 rounded-lg hover:border-[#005831] hover:bg-green-50 transition-colors group"
                        >
                          <Phone size={18} className="text-slate-400 group-hover:text-[#005831]" />
                          <div>
                            <p className="text-xs font-bold text-slate-400 uppercase">Telefone</p>
                            <p className="text-sm font-bold text-slate-700 group-hover:text-[#005831]">{displayData.phone}</p>
                          </div>
                        </a>
                      )}

                      {/* E-mail (Antigo 'email', agora 'mail') */}
                      {displayData.mail && (
                        <a
                          href={`mailto:${displayData.mail}`}
                          className="flex items-center gap-3 p-3 border border-slate-200 rounded-lg hover:border-[#005831] hover:bg-green-50 transition-colors group"
                        >
                          <Mail size={18} className="text-slate-400 group-hover:text-[#005831]" />
                          <div>
                            <p className="text-xs font-bold text-slate-400 uppercase">E-mail</p>
                            <p className="text-sm font-medium text-slate-700 group-hover:text-[#005831] truncate">{displayData.mail}</p>
                          </div>
                        </a>
                      )}
                    </div>

                    {/* Botão de Ação */}
                    <div className="pt-4 mt-auto">
                      <a
                        href={`https://wa.me/${displayData.wpp}?text=Olá%20gostaria%20de%20mais%20informações`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full bg-[#005831] hover:bg-[#004626] text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-green-900/20 transition-all flex items-center justify-center gap-2"
                      >
                        <MessageCircle size={20} />
                        Falar com essa Unidade
                      </a>
                    </div>
                  </div>                </div>
              ) : (
                <div className="text-center py-6 space-y-3">
                  <p className="text-slate-600">{displayData.message}</p>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="animate-spin w-8 h-8 border-4 border-green-600 border-t-transparent rounded-full" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}