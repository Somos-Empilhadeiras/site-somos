'use client';

import { useState } from 'react';
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
} from 'react-simple-maps';
import {
  MapPin,
  ArrowRight,
  Building2,
  Users,
  Truck,
  Phone,
  Clock,
  ShieldCheck,
} from 'lucide-react';
import Link from 'next/link';

const GEO_URL =
  'https://raw.githubusercontent.com/codeforamerica/click_that_hood/master/public/data/brazil-states.geojson';

const MARKERS = [
  { id: 'GO', name: 'Goiânia', coords: [-49.255, -16.679] as [number, number] },
  { id: 'DF', name: 'Brasília', coords: [-47.887, -15.793] as [number, number] },
  { id: 'TO', name: 'Palmas', coords: [-48.327, -10.183] as [number, number] },
  {
    id: 'BA',
    name: 'Luís Eduardo Magalhães',
    shortName: 'Luís Eduardo',
    coords: [-45.796, -12.095] as [number, number],
  },
  { id: 'PE', name: 'Recife', coords: [-34.877, -8.047] as [number, number] },
];

const UNIT_DATA: Record<
  string,
  {
    type: string;
    address: string;
    manager: string;
    wpp: string;
    status: string;
    hours: string;
  }
> = {
  GO: {
    type: 'Matriz',
    address: 'Av. Caiapó, 1190 – Santa Genoveva',
    manager: 'Khryss Mylla',
    wpp: '5562991834188',
    status: 'Operação Total',
    hours: '08:00 – 18:00',
  },
  DF: {
    type: 'Filial',
    address: 'SCIA – Lote, Brasília – DF',
    manager: 'Maike Jhonny',
    wpp: '5562991834188',
    status: 'Ativo',
    hours: '08:00 – 18:00',
  },
  TO: {
    type: 'Filial',
    address: 'Logística Integrada – Palmas',
    manager: 'Comercial',
    wpp: '5562991834188',
    status: 'Ativo',
    hours: '08:00 - 18:00',
  },
  BA: {
    type: 'Filial',
    address: 'Av. Luís Eduardo Magalhães',
    manager: 'Cristiane R.',
    wpp: '5562991834188',
    status: 'Ativo',
    hours: '08:00 – 18:00',
  },
  PE: {
    type: 'Base de Apoio',
    address: 'Recife – Base Operacional',
    manager: 'Alan Santana',
    wpp: '5581992586532',
    status: 'Ativo',
    hours: '08:00 – 17:00',
  },
};

export default function HomeUnitsSection() {
  const [activeState, setActiveState] = useState('GO');
  const activeInfo = UNIT_DATA[activeState];
  const activeMarker = MARKERS.find((m) => m.id === activeState);

  return (
    <section
      id="unidades"
      className="py-24 bg-slate-50 border-t border-slate-200"
    >
      <div className="container mx-auto px-4 space-y-16">
        {/* CABEÇALHO */}
        <header className="max-w-4xl">
          <div className="inline-flex items-center gap-2 mb-4 px-3 py-1 rounded-full border border-slate-200 text-xs font-bold uppercase tracking-widest text-slate-600">
            <Building2 size={14} />
            Presença Nacional
          </div>

          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 leading-tight">
            Presença nacional com{' '}
            <span className="text-[#005831]">
              suporte operacional integrado
            </span>
          </h2>

          <p className="mt-4 text-slate-600 text-lg max-w-3xl">
            Estrutura distribuída estrategicamente para garantir agilidade,
            proximidade e continuidade operacional em todo o território
            atendido.
          </p>
        </header>

        {/* INDICADORES */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { label: 'Bases físicas', value: '5', icon: Building2 },
            { label: 'Estados atendidos', value: '+4', icon: Truck },
            { label: 'Suporte técnico', value: '24h', icon: ShieldCheck },
            { label: 'Equipe dedicada', value: 'Especializada', icon: Users },
          ].map((item, i) => (
            <div
              key={i}
              className="bg-white border border-slate-200 rounded-xl p-6 flex flex-col gap-2"
            >
              <item.icon className="text-[#005831]" size={22} />
              <p className="text-xl font-bold text-slate-900">{item.value}</p>
              <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">
                {item.label}
              </p>
            </div>
          ))}
        </div>

        {/* MAPA + CARD */}
        <div className="grid lg:grid-cols-12 gap-10 items-stretch">
          {/* MAPA */}
          <div className="lg:col-span-8 bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
            <ComposableMap
              projection="geoMercator"
              projectionConfig={{ scale: 900, center: [-52, -14] }}
              className="w-full h-[560px]"
            >
              <Geographies geography={GEO_URL}>
                {({ geographies }) =>
                  geographies.map((geo) => {
                    const isUnit = Object.keys(UNIT_DATA).includes(
                      geo.properties.sigla
                    );
                    const isActive =
                      geo.properties.sigla === activeState;

                    return (
                      <Geography
                        key={geo.rsmKey}
                        geography={geo}
                        onMouseEnter={() =>
                          isUnit &&
                          setActiveState(geo.properties.sigla)
                        }
                        style={{
                          default: {
                            fill: isUnit
                              ? isActive
                                ? '#ecfdf5'
                                : '#f8fafc'
                              : '#f1f5f9',
                            stroke: '#cbd5e1',
                            strokeWidth: isActive ? 1.5 : 0.8,
                            outline: 'none',
                          },
                          hover: {
                            fill: isUnit ? '#d1fae5' : '#f1f5f9',
                            stroke: '#005831',
                            strokeWidth: 1.5,
                            cursor: isUnit ? 'pointer' : 'default',
                          },
                          pressed: {
                            fill: '#bbf7d0',
                          },
                        }}
                      />
                    );
                  })
                }
              </Geographies>

              {MARKERS.map(({ id, name, shortName, coords }) => {
                const isActive = id === activeState;
                return (
                  <Marker key={id} coordinates={coords}>
                    <g
                      onMouseEnter={() => setActiveState(id)}
                      className="cursor-pointer"
                    >
                      {isActive && (
                        <circle
                          r="14"
                          fill="#005831"
                          opacity="0.15"
                        />
                      )}
                      <circle
                        r={isActive ? 5 : 4}
                        fill="#005831"
                        stroke="#fff"
                        strokeWidth={1.5}
                      />
                    </g>
                    <text
                      y={-12}
                      textAnchor="middle"
                      className="text-[10px] font-bold fill-slate-700 uppercase tracking-wider"
                    >
                      {shortName || name}
                    </text>
                  </Marker>
                );
              })}
            </ComposableMap>
          </div>

          {/* CARD LATERAL */}
          <aside className="lg:col-span-4 bg-white border border-slate-200 rounded-2xl shadow-lg flex flex-col">
            <div className="p-6 border-b border-slate-100">
              <p className="text-xs font-bold uppercase tracking-widest text-slate-500">
                Unidade selecionada
              </p>
              <h3 className="text-2xl font-bold text-slate-900 mt-1">
                {activeMarker?.name}
              </h3>
              <span className="inline-flex items-center gap-2 mt-3 text-xs font-bold text-[#005831]">
                <span className="w-2 h-2 rounded-full bg-[#005831]" />
                {activeInfo?.status}
              </span>
            </div>

            <div className="p-6 space-y-6 flex-1">
              <InfoItem
                icon={Building2}
                label="Perfil"
                value={activeInfo?.type}
              />
              <InfoItem
                icon={MapPin}
                label="Endereço"
                value={activeInfo?.address}
              />
              <InfoItem
                icon={Users}
                label="Gestão"
                value={activeInfo?.manager}
              />
              <InfoItem
                icon={Clock}
                label="Horário"
                value={activeInfo?.hours}
              />
            </div>

            <div className="p-6 border-t border-slate-100 space-y-3">
              <a
                href={`https://wa.me/${activeInfo?.wpp}`}
                target="_blank"
                className="w-full bg-[#25D366] hover:bg-[#1da851] text-white py-3 rounded-lg font-bold flex items-center justify-center gap-2"
              >
                <Phone size={18} />
                Falar com a unidade
              </a>

              <Link
                href={`/unidades/${activeState.toLowerCase()}`}
                className="w-full flex items-center justify-center gap-2 border border-slate-200 py-3 rounded-lg font-bold text-slate-600 hover:text-[#005831] hover:border-[#005831]"
              >
                Ver ficha técnica
                <ArrowRight size={16} />
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}

function InfoItem({
  icon: Icon,
  label,
  value,
}: {
  icon: any;
  label: string;
  value?: string;
}) {
  return (
    <div className="flex gap-4">
      <Icon className="text-slate-400 mt-1" size={18} />
      <div>
        <p className="text-xs font-bold uppercase tracking-widest text-slate-500">
          {label}
        </p>
        <p className="text-slate-800 font-medium leading-snug">
          {value}
        </p>
      </div>
    </div>
  );
}
