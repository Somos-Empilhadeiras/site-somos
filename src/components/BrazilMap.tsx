'use client';
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ComposableMap, Geographies, Geography } from 'react-simple-maps';
import { MapPin, Calendar, Info, MousePointerClick, Building2, Timer, Pin } from 'lucide-react';

const GEO_URL = "https://raw.githubusercontent.com/codeforamerica/click_that_hood/master/public/data/brazil-states.geojson";

// Importante: 'GO' é o primeiro para iniciar nele
const ACTIVE_STATES = ['GO', 'DF', 'TO', 'BA', 'PE'];

const STATE_DETAILS: Record<string, { date: string; address: string, representant: string, operation: string, mail: string, phone: string, city: string, text: string }> = {
  'GO': { date: 'Desde 2023', address: "Av. Caiapó, 1190 - Santa Genoveva, Goiânia - GO, 74672-400", representant: "Gustavo Teles", operation: "07:00 às 17:00", mail: "comercial@somosempilhadeiras.com.br", phone: "62 9 9183-4188", city: "Goiânia", text: 'Nossa casa, onde tudo começou. Sede administrativa e operacional.' },
  'DF': { date: 'Desde 2024', address: "SCIA - Lote, Brasília - DF", representant: "Maike Jhonny", operation: "07:00 às 17:00", mail: "maike@somosempilhadeiras.com.br", phone: "62 9 9183-4188", city: "Brasília", text: 'Atendendo o coração do Brasil com agilidade e precisão logística.' },
  'TO': { date: 'Desde 2024', address: "", representant: "", operation: "", mail: "", phone: "", city: "Palmas", text: 'Expandindo horizontes no norte, apoiando o agronegócio.' },
  'BA': { date: 'Desde 2024', address: "Av. Luís Eduardo Magalhães, QD 02 - LT 26  - Bairro Vereda Tropical, Luís Eduardo Magalhães - BA, 47862-090", representant: "Cristiane", operation: "08:00 às 18:00", mail: "cristiane@somosempilhadeiras.com.br", phone: "62 9 9183-4188", city: "Luís Eduardo Magalhães", text: 'Energia e força para o nordeste, com frota especializada.' },
  'PE': { date: 'Desde 2025', address: "", representant: "", operation: "07:00 às 17:00", mail: "alan@somosempilhadeiras.com.br", phone: "", city: "Recife", text: "" },
};

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

    // Se não tivermos o nome do estado (vinda do automático), usamos a sigla ou um mapa auxiliar
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
    <div className="flex flex-col lg:flex-row w-full max-w-full mx-auto gap-6 items-stretch">

      {/* LADO ESQUERDO: MAPA */}
      <div className="flex-1  rounded-2xl overflow-hidden relative border border-slate-200 shadow-inner min-h-[400px] lg:h-[700px]">
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
      <div className="w-full lg:w-2/6 bg-white rounded-2xl border border-slate-200 shadow-lg p-8 flex flex-col justify-center transition-all duration-300">
        {displayData ? (
          // Usando key=sigla para forçar a animação de entrada a cada troca
          <div key={displayData.sigla} className="animate-in fade-in slide-in-from-right-4 duration-500 space-y-6">

            {/* Cabeçalho */}
            <div className="border-b border-slate-100 pb-4">
              <div className="flex items-center justify-between mb-2">
                <span className={`text-xs font-bold px-2 py-1 rounded-full uppercase tracking-wide transition-colors ${displayData.isActive ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'}`}>
                  {displayData.isActive && displayData.sigla === "GO" ? 'Matriz' : displayData.isActive && displayData.sigla !== "GO" ? 'Filial' : 'Indisponivel'}
                </span>
                <span className="text-4xl font-black text-slate-100">{displayData.sigla}</span>
              </div>
              <h2 className="text-3xl font-bold text-slate-800 leading-tight">{displayData.title}</h2>
            </div>

            {/* Conteúdo */}
            {displayData.isActive ? (
              <div className="space-y-3">

                {/* Endereço de Atuação */}
                <div className="flex gap-2 items-start text-slate-800">
                  <MapPin className='w-5 h-5 text-yellow-500 shrink-0' />
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-slate-900 mb-0.5">
                      Endereço
                    </p>

                    <span className=" text-sm ">
                      {displayData.address}
                    </span>
                  </div>
                </div>

                {/* Horarios de funcionamento */}
                <div className="flex gap-2 items-start text-slate-800">
                  <MapPin className='w-5 h-5 text-yellow-500 mt-0.5 shrink-0' />
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-slate-900 mb-0.5">
                      Horários de funcionamento
                    </p>

                    <span className=" text-sm">
                      {displayData.operation}
                    </span>
                  </div>
                </div>

                {/* Email */}
                <div className="flex gap-2 items-start text-slate-800">
                  <MapPin className='w-5 h-5 text-yellow-500 mt-0.5 shrink-0' />
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-slate-900 mb-0.5">
                      E-mail
                    </p>

                    <span className=" text-sm">
                      {displayData.mail}
                    </span>
                  </div>
                </div>

                {/* Telefone */}
                <div className="flex gap-2 items-start text-slate-800">
                  <MapPin className='w-5 h-5 text-yellow-500 mt-0.5 shrink-0' />
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-slate-900 mb-0.5">
                      Telefone
                    </p>

                    <span className=" text-sm">
                      {displayData.phone}
                    </span>
                  </div>
                </div>

                {/* Cidades de Atuação */}
                {displayData.city && (
                  <div className="flex items-start gap-2 text-slate-800">
                    <Building2 className="w-5 h-5 text-yellow-500 mt-0.5 shrink-0" />
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-slate-800 mb-0.5">Locais de Atuação</p>
                      <div className="flex flex-wrap gap-2">
                        <span className={` bg-green-700 text-white border-slate-800  text-xs px-2 py-1 rounded border`}>
                          {displayData.city}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Mensagem / Descrição */}
                <div className="flex items-start gap-3 text-slate-600 bg-slate-50 p-3 rounded-lg border border-slate-100">
                  <Info className="w-5 h-5 text-yellow-500 mt-0.5 shrink-0" />
                  <p className="text-sm italic leading-relaxed">{displayData.message}</p>
                </div>


                {/* Timer Visual (Opcional, mostra barra de progresso se auto) */}
                {isAutoPlay && (
                  <div className="w-full bg-slate-100 h-1 rounded-full overflow-hidden mt-4">
                    <div className="bg-green-800 h-full w-full animate-[progress_4s_linear_infinite] origin-left"></div>
                  </div>
                )}

                {/* Botões Contato e Frota */}
                <div className="w-full flex items-center justify-around">
                  <a href='/empilhadeiras' className="w-48 font-semibold text-center bg-green-900 text-white py-3 rounded-lg font-sans hover:bg-slate-800 transition shadow-lg shadow-slate-200">
                    Ver Frota
                  </a>
                  <button
                    onClick={() => {
                      const contactSection = document.getElementById("contato");
                      contactSection?.scrollIntoView({ behavior: "smooth", block: "start" });
                    }}
                    className="w-48 px-3 font-semibold text-center bg-green-900 text-white py-3 rounded-lg font-sans hover:bg-slate-800 transition shadow-lg shadow-slate-200"
                  >
                    Entrar em contato
                  </button>
                </div>
              </div>
            ) : (
              /* Estado Inativo */
              <div className="text-center py-6 space-y-3">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-400 mb-4">
                  <MapPin size={32} />
                </div>
                <p className="text-slate-600">{displayData.message}</p>

                {!isAutoPlay && (
                  <p className="text-xs text-slate-400 animate-pulse mt-4">
                    Retornando ao modo apresentação em breve...
                  </p>
                )}
              </div>
            )}
          </div>
        ) : (
          /* Card de Carregamento Inicial */
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin w-8 h-8 border-4 border-green-600 border-t-transparent rounded-full"></div>
          </div>
        )}
      </div>

      <style jsx global>{`
        @keyframes progress {
          0% { transform: scaleX(0); }
          100% { transform: scaleX(1); }
        }
      `}</style>

    </div>
  );
}