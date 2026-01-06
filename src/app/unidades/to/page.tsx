// ARQUIVO: src/components/UnitDetails.tsx
'use client';

import { useEffect, useState } from 'react';
import { ComposableMap, Geographies, Geography, Marker } from 'react-simple-maps';
import { 
  MapPin, Mail, Phone, Clock, User, Building2, MessageCircle, ArrowRight, Star
} from 'lucide-react';

// --- DADOS (Mesmos dados, apenas reestruturação visual) ---
const GEO_URL = "https://raw.githubusercontent.com/codeforamerica/click_that_hood/master/public/data/brazil-states.geojson";

const CITY_COORDINATES: Record<string, [number, number]> = {
  'GO': [-49.255, -16.679],
  'DF': [-47.887, -15.793],
  'TO': [-48.327, -10.183],
  'BA': [-45.796, -12.095],
  'PE': [-34.877, -8.047],
};

const MAP_CONFIG: Record<string, { scale: number; center: [number, number] }> = {
  'GO': { scale: 3500, center: [-49.5, -16.5] },
  'DF': { scale: 15000, center: [-47.8, -15.75] },
  'TO': { scale: 3000, center: [-48.0, -10.5] },
  'BA': { scale: 1800, center: [-41.5, -12.5] },
  'PE': { scale: 5000, center: [-37.0, -8.3] },
};

const STATE_DETAILS: Record<string, any> = {
  'GO': { date: '2023', address: "Av. Caiapó, 1190 - Santa Genoveva, Goiânia - GO, 74672-400", representant: "Khryss Mylla", role: "Gerente Comercial", operation: "Seg a Sex, 07h às 17h", mail: "comercial@somosempilhadeiras.com.br", phone: "(62) 9 9183-4188", city: "Goiânia", wpp: '5562991834188', text: 'Nossa casa, onde tudo começou. Sede administrativa e operacional.' },
  'DF': { date: '2024', address: "SCIA - Lote, Brasília - DF", representant: "Maike Jhonny", role: "Consultor Técnico", operation: "Seg a Sex, 07h às 17h", mail: "maike@somosempilhadeiras.com.br", phone: "(62) 9 9183-4188", wpp:"5562991834188", city: "Brasília", text: 'Atendendo o coração do Brasil com agilidade e precisão logística.' },
  'TO': { date: '2024', address: "Logística Integrada", representant: "Equipe Comercial", role: "Atendimento", operation: "Seg a Sex, 08h às 18h", mail: "comercial@somosempilhadeiras.com.br", phone: "(62) 9 9183-4188", wpp: "5562991834188", city: "Palmas", text: 'Expandindo horizontes no norte, apoiando o agronegócio.' },
  'BA': { date: '2024', address: "Av. Luís Eduardo Magalhães, QD 02 - LT 26, LEM - BA", representant: "Cristiane Rodrigues", role: "Representante", operation: "Seg a Sex, 08h às 18h", mail: "cristiane@somosempilhadeiras.com.br", phone: "(62) 9 9183-4188", wpp: "5562991834188", city: "Luís Eduardo Magalhães", text: 'Energia e força para o nordeste, com frota especializada.' },
  'PE': { date: '2025', address: "Base Operacional Recife", representant: "Alan Santana", role: "Gerente Regional", operation: "Seg a Sex, 07h às 17h", mail: "alan@somosempilhadeiras.com.br", phone: "(81) 9 9258-6532", wpp: '5581992586532', city: "Recife", text: "Nova base estratégica para o litoral e indústrias da região." },
};

interface UnitDetailsProps {
  stateId: string;
}

export default function UnitDetails({ stateId }: UnitDetailsProps) {
  const [mounted, setMounted] = useState(false);
  
  const uf = stateId ? stateId.toUpperCase() : 'TO';
  const info = STATE_DETAILS[uf];
  const mapConfig = MAP_CONFIG[uf] || { scale: 800, center: [-54, -15] };
  const cityCoords = CITY_COORDINATES[uf];

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !info) return null;

  return (
    <div className="min-h-screen bg-slate-50">
      
      {/* 1. HERO BANNER: Visual Acolhedor e Moderno */}
      <div className="relative bg-gradient-to-r from-[#005831] to-[#057a44] text-white pb-32 pt-20 overflow-hidden">
        {/* Elemento decorativo de fundo */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -translate-y-1/2 translate-x-1/3 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-black opacity-10 rounded-full translate-y-1/3 -translate-x-1/3 blur-3xl"></div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <div className="flex items-center gap-2 text-green-200 font-semibold tracking-wider text-sm mb-2 uppercase">
                <MapPin size={16} />
                Unidade Regional
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                {info.city} <span className="opacity-50 font-light">/ {uf}</span>
              </h1>
              <p className="text-lg text-green-50 max-w-xl leading-relaxed opacity-90">
                "{info.text}"
              </p>
            </div>
            
            <div className="hidden md:block text-right">
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20">
                <Star size={16} className="text-yellow-400 fill-yellow-400" />
                <span className="text-sm font-medium">Atuando desde {info.date}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. CONTEÚDO PRINCIPAL (Cards Sobrepostos) */}
      <div className="container mx-auto px-6 -mt-24 pb-20 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* ESQUERDA: Informações e Contato (Card Clean) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-slate-100">
              
              {/* Header do Card com "Foto" ou Ícone */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 mb-8 pb-8 border-b border-slate-100">
                <div className="w-16 h-16 rounded-2xl bg-green-50 flex items-center justify-center text-[#005831] shrink-0">
                  <Building2 size={32} />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-slate-800">Estamos aqui por você</h2>
                  <p className="text-slate-500 mt-1">
                    Visite nossa base ou entre em contato com nossa equipe especializada.
                  </p>
                </div>
              </div>

              {/* Grid de Informações - Visual mais arejado */}
              <div className="space-y-8">
                
                {/* Endereço */}
                <div className="flex group">
                  <div className="mr-5 mt-1 text-slate-300 group-hover:text-[#005831] transition-colors">
                    <MapPin size={24} />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wide mb-1">Endereço</h3>
                    <p className="text-lg text-slate-800 font-medium leading-relaxed max-w-md">
                      {info.address || "Localização sob consulta."}
                    </p>
                    <a 
                       href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(info.address)}`}
                       target="_blank"
                       className="inline-flex items-center gap-1 text-[#005831] text-sm font-bold mt-2 hover:underline"
                    >
                      Ver no Google Maps <ArrowRight size={14} />
                    </a>
                  </div>
                </div>

                {/* Responsável e Horário */}
                <div className="grid sm:grid-cols-2 gap-8">
                  <div className="flex group">
                    <div className="mr-5 mt-1 text-slate-300 group-hover:text-[#005831] transition-colors">
                      <User size={24} />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wide mb-1">Responsável</h3>
                      <p className="text-lg text-slate-800 font-bold">{info.representant}</p>
                      <p className="text-sm text-slate-500">{info.role}</p>
                    </div>
                  </div>

                  <div className="flex group">
                    <div className="mr-5 mt-1 text-slate-300 group-hover:text-[#005831] transition-colors">
                      <Clock size={24} />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wide mb-1">Atendimento</h3>
                      <p className="text-lg text-slate-800 font-medium">{info.operation}</p>
                    </div>
                  </div>
                </div>

                {/* Card de Contatos Rápidos */}
                <div className="bg-slate-50 rounded-xl p-6 border border-slate-100 flex flex-col sm:flex-row gap-6 justify-between items-center">
                   <div className="space-y-2 text-center sm:text-left">
                      <div className="flex items-center justify-center sm:justify-start gap-2 text-slate-600">
                        <Mail size={16} /> {info.mail}
                      </div>
                      <div className="flex items-center justify-center sm:justify-start gap-2 text-slate-600">
                        <Phone size={16} /> {info.phone}
                      </div>
                   </div>
                   
                   <a 
                    href={`https://wa.me/${info.wpp}?text=Olá, gostaria de falar com a unidade de ${info.city}.`}
                    target="_blank"
                    className="bg-[#25D366] hover:bg-[#1da851] text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all whitespace-nowrap"
                  >
                    <MessageCircle size={20} />
                    Chamar no WhatsApp
                  </a>
                </div>

              </div>
            </div>
          </div>

          {/* DIREITA: Mapa Visual */}
          <div className="lg:col-span-5">
            <div className="bg-white rounded-2xl shadow-xl p-2 h-full min-h-[400px] border border-slate-100 flex flex-col">
              
              <div className="bg-slate-50 rounded-xl flex-1 relative overflow-hidden border border-slate-100">
                {/* Título Flutuante dentro do Mapa */}
                <div className="absolute top-4 left-4 z-10 bg-white/90 backdrop-blur px-4 py-2 rounded-lg shadow-sm border border-slate-200">
                  <p className="text-xs font-bold text-slate-400 uppercase">Abrangência</p>
                  <p className="text-sm font-bold text-[#005831]">Estado de {uf === 'DF' ? 'Distrito Federal' : uf}</p>
                </div>

                <ComposableMap
                  projection="geoMercator"
                  projectionConfig={mapConfig}
                  className="w-full h-full"
                >
                  <Geographies geography={GEO_URL}>
                    {({ geographies }) =>
                      geographies
                        .filter(geo => geo.properties.sigla === uf)
                        .map((geo) => (
                          <Geography
                            key={geo.rsmKey}
                            geography={geo}
                            style={{
                              default: { fill: "#ffffff", stroke: "#005831", strokeWidth: 1.5, outline: "none", filter: "drop-shadow(0px 4px 10px rgba(0,0,0,0.05))" },
                              hover: { fill: "#f0fdf4", stroke: "#005831", strokeWidth: 2, outline: "none", cursor: "pointer" },
                              pressed: { fill: "#dcfce7", stroke: "#005831", strokeWidth: 2, outline: "none" },
                            }}
                          />
                        ))
                    }
                  </Geographies>

                  {cityCoords && (
                    <Marker coordinates={cityCoords}>
                       {/* Efeito de Pulse no Pin */}
                      <circle r={8} fill="#005831" opacity={0.3}>
                        <animate attributeName="r" from="8" to="20" dur="1.5s" repeatCount="indefinite" />
                        <animate attributeName="opacity" from="0.3" to="0" dur="1.5s" repeatCount="indefinite" />
                      </circle>
                      <circle r={5} fill="#005831" stroke="#fff" strokeWidth={2} />
                      
                      <text
                        textAnchor="middle"
                        y={24}
                        className="font-sans text-[12px] font-bold fill-slate-600 tracking-wide"
                        style={{ textShadow: "0px 2px 4px rgba(255,255,255,0.8)" }}
                      >
                        {info.city}
                      </text>
                    </Marker>
                  )}
                </ComposableMap>
              </div>

              <div className="p-4 text-center">
                <p className="text-sm text-slate-400 italic">
                  "Sua parceira logística estratégica na região {uf}."
                </p>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}