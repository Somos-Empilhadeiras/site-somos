'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ArrowRight, Award, CheckCircle2, ChevronRight, ChevronLeft,
  Clock, Globe, Mail, MapPin, MessageCircle,
  PackageSearch, Phone, ShieldCheck, TrendingUp, Users, Wrench,
  Building2, Leaf
} from 'lucide-react';
import DynamicBanner from '@/components/admin/banners/DynamicBanner';
import HomeUnitsSection from '@/components/HOmeUnitsSection';

export default function Home() {
  return (
    <main className="min-h-screen bg-white">

      {/* 1. HERO SLIDER (Impacto Visual) */}
      <DynamicBanner id="home-topo" className="absolute top-0 left-0 w-full z-50" />


      <DynamicBanner id="home-slides" />

      {/* 2. BARRA DE DESTAQUES (Conexão visual sólida) */}
      <div className="bg-[#005831] border-b-4 border-yellow-400 relative z-30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-green-800">
            {[
              { icon: ShieldCheck, title: "Garantia de Disponibilidade", desc: "Segurança total na sua compra" },
              { icon: Wrench, title: "Peças Genuínas", desc: "Estoque local para reposição imediata" },
              { icon: Clock, title: "Suporte de Pós Venda", desc: "Atendimento técnico especializado" }
            ].map((item, idx) => (
              <div key={idx} className="py-8 px-6 flex items-center justify-center md:justify-start gap-5 group hover:bg-[#004d2b] transition-colors">
                <div className="p-3 bg-white/10 rounded-xl text-yellow-400 group-hover:scale-110 transition-transform">
                  <item.icon size={32} />
                </div>
                <div className="text-white">
                  <h3 className="font-bold text-lg leading-tight">{item.title}</h3>
                  <p className="text-sm text-green-100 opacity-80">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <DynamicBanner id="home-sessao-carrossel" />

      {/* 3. SESSÃO HELI (Layout Assimétrico Profissional) */}
      <section className="py-20 md:py-28 bg-white overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center gap-16">

            {/* Imagem com Elementos Gráficos */}
            <div className="lg:w-1/2 relative">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl group">
                <div className="aspect-4/3 bg-slate-100">
                  <img
                    src="/images/heli-brasil.png"
                    alt="Empilhadeira HELI"
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                  />
                </div>
                {/* Badge Flutuante */}
                <div className="absolute top-6 left-6 bg-white/95 backdrop-blur px-6 py-4 rounded-xl shadow-lg border-l-4 border-red-600">
                  <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">Parceria Oficial</p>
                  <img src="/heli.png" alt="HELI Logo" className='w-32 h-8'/>
                </div>
              </div>
              {/* Elemento Decorativo de Fundo */}
              <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-slate-100 rounded-full mix-blend-multiply filter blur-3xl opacity-70 -z-10"></div>
            </div>

            {/* Texto */}
            <div className="lg:w-1/2 space-y-8">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <span className="w-10 h-1 bg-red-600"></span>
                  <span className="font-bold text-slate-500 uppercase tracking-widest text-sm">Excelência Global</span>
                </div>
                <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 leading-tight">
                  Distribuidor Autorizado <img src="/heli.png" alt="HELI Logo" className='w-40 h-10'/>
                </h2>
                <p className="mt-6 text-lg text-slate-600 leading-relaxed">
                  A <strong>Somos Empilhadeiras</strong> orgulha-se de representar oficialmente a HELI, uma das 10 maiores fabricantes do mundo.
                  Não vendemos apenas máquinas; entregamos tecnologia global adaptada para a realidade brasileira.
                </p>
              </div>

              <div className="grid sm:grid-cols-2 gap-6">
                <div className="p-5 bg-slate-50 rounded-lg border border-slate-100 hover:border-red-100 transition-colors">
                  <Globe className="text-red-600 mb-3" size={24} />
                  <h4 className="font-bold text-slate-900">Tecnologia Mundial</h4>
                  <p className="text-sm text-slate-500">Acesso direto aos lançamentos globais.</p>
                </div>
                <div className="p-5 bg-slate-50 rounded-lg border border-slate-100 hover:border-red-100 transition-colors">
                  <TrendingUp className="text-red-600 mb-3" size={24} />
                  <h4 className="font-bold text-slate-900">Alta Performance</h4>
                  <p className="text-sm text-slate-500">Robustez para ciclos intensos.</p>
                </div>
              </div>

              <Link href="/empilhadeiras" className="inline-flex items-center gap-2 text-red-700 font-bold hover:text-red-800 transition-colors text-lg border-b-2 border-transparent hover:border-red-700 pb-1">
                Conheça a linha completa <ChevronRight size={20} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <DynamicBanner id="home-sessao-heli" />

      {/* 4. SESSÃO FROTA / ESPECIALIDADES (Design Clean B2B) */}
      <section className="py-20 md:py-28 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Equipamentos para Desafios Reais
            </h2>
            <p className="text-slate-600 text-lg">
              Contamos com uma frota diversificada, pronta para atender desde pequenos estoques até grandes centros de distribuição.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Card 1 */}
            <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 group">
              <div className="w-14 h-14 bg-yellow-100 rounded-xl flex items-center justify-center mb-6 text-yellow-700 group-hover:bg-yellow-500 group-hover:text-white transition-colors">
                <PackageSearch size={28} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Vendas</h3>
              <p className="text-slate-600 mb-6 leading-relaxed">
                Renove sua frota com equipamentos zero km HELI. Garantia de fábrica e consultoria para escolher o modelo ideal.
              </p>
              <Link href="/catalogo" className="text-[#005831] font-bold text-sm uppercase tracking-wide flex items-center gap-1 group-hover:gap-2 transition-all">
                Ver Opções <ArrowRight size={16} />
              </Link>
            </div>

            {/* Card 2 */}
            <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 group relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-[#005831] text-white text-xs font-bold px-3 py-1 rounded-bl-lg">MAIS PROCURADO</div>
              <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center mb-6 text-[#005831] group-hover:bg-[#005831] group-hover:text-white transition-colors">
                <Building2 size={28} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Locação</h3>
              <p className="text-slate-600 mb-6 leading-relaxed">
                Evite descapitalização. Planos de locação flexíveis com manutenção inclusa para sua operação nunca parar.
              </p>
              <Link href="https://wa.me/5562991834188" className="text-[#005831] font-bold text-sm uppercase tracking-wide flex items-center gap-1 group-hover:gap-2 transition-all">
                Solicitar Cotação <ArrowRight size={16} />
              </Link>
            </div>

            {/* Card 3 */}
            <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 group">
              <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mb-6 text-blue-700 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                <Leaf size={28} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Tecnologia Lítio</h3>
              <p className="text-slate-600 mb-6 leading-relaxed">
                Migre para o elétrico. Baterias de íon-lítio com carga rápida, zero manutenção e alta eficiência energética.
              </p>
              <Link href="https://helibrasil.com/sustentabilidade/posicionamento-esg" className="text-[#005831] font-bold text-sm uppercase tracking-wide flex items-center gap-1 group-hover:gap-2 transition-all">
                Conhecer Tecnologia <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <DynamicBanner id="home-sessao-locacao" />

      {/* 5. LOCAÇÃO E VENDA (Call to Action Forte) */}
      <section className="relative py-24 bg-[#005831] overflow-hidden">
        {/* Pattern de Fundo */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] bg-size-[20px_20px]"></div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
            <div className="lg:w-3/5 text-white">
              <h2 className="text-3xl md:text-5xl font-bold mb-6 leading-tight">
                Sua operação precisa de <span className="text-yellow-400">Flexibilidade?</span>
              </h2>
              <p className="text-xl text-green-100 mb-8 max-w-2xl">
                Seja para comprar ou alugar, temos a solução financeira e operacional que se encaixa no seu fluxo de caixa.
              </p>
              <ul className="grid sm:grid-cols-2 gap-4 mb-8">
                {['Manutenção Preventiva Inclusa', 'Frota Sempre Renovada', 'Dedutível do IR (Locação)', 'Suporte Técnico Dedicado'].map((item, i) => (
                  <li key={i} className="flex items-center gap-2 font-medium">
                    <CheckCircle2 className="text-yellow-400" size={20} /> {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="lg:w-2/5 w-full">
              <div className="bg-white/10 backdrop-blur-md border border-white/20 p-8 rounded-2xl text-center">
                <h3 className="text-white font-bold text-2xl mb-2">Fale com um Especialista</h3>
                <p className="text-green-100 mb-6 text-sm">Resposta rápida em horário comercial</p>

                <div className="space-y-4">
                  <a
                    href="https://wa.me/5562991834188"
                    target="_blank"
                    className="flex items-center justify-center gap-3 w-full bg-[#25D366] hover:bg-[#1da851] text-white py-4 rounded-xl font-bold shadow-lg transition-all transform hover:-translate-y-1"
                  >
                    <MessageCircle size={24} />
                    Chamar no WhatsApp
                  </a>
                  <Link
                    href="mailto:comercial@somosempilhadeiras.com.br"
                    className="flex items-center justify-center gap-3 w-full bg-white hover:bg-slate-100 text-[#005831] py-4 rounded-xl font-bold shadow-lg transition-colors"
                  >
                    <Mail size={24} />
                    Solicitar Orçamento
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <DynamicBanner id="home-sessao-mapa" />

      {/* 6. MAPA (Design Limpo) */}
      <section id="unidades" className="py-20 md:py-28 bg-white">
        <HomeUnitsSection />
      </section>

      {/* 7. CONTATO (Clean Footer) */}
      <section id='contato' className="py-20 bg-slate-50 border-t border-slate-200">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <Link href="https://wa.me/5562991834188" target="_blank" className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-slate-100 flex flex-col items-center text-center group">
              <div className="w-16 h-16 bg-green-100 text-[#005831] rounded-full flex items-center justify-center mb-6 group-hover:bg-[#005831] group-hover:text-white transition-colors"><MessageCircle size={32} /></div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">Comercial</h3>
              <p className="text-slate-500 mb-4">Atendimento rápido via WhatsApp</p>
              <span className="text-[#005831] font-bold text-lg">(62) 99183-4188</span>
            </Link>

            <Link href="mailto:comercial@somosempilhadeiras.com.br" className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-slate-100 flex flex-col items-center text-center group">
              <div className="w-16 h-16 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center mb-6 group-hover:bg-blue-700 group-hover:text-white transition-colors"><Mail size={32} /></div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">E-mail Corporativo</h3>
              <p className="text-slate-500 mb-4">Envie seu projeto ou cotação</p>
              <span className="text-blue-700 font-bold text-sm md:text-base break-all">comercial@somosempilhadeiras.com.br</span>
            </Link>

            <Link href="https://maps.google.com/?q=Av.+Caiapó,+1190+-+Santa+Genoveva,+Goiânia+-+GO" target="_blank" className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-slate-100 flex flex-col items-center text-center group">
              <div className="w-16 h-16 bg-yellow-100 text-yellow-700 rounded-full flex items-center justify-center mb-6 group-hover:bg-yellow-600 group-hover:text-white transition-colors"><MapPin size={32} /></div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">Matriz</h3>
              <p className="text-slate-500 mb-4">Venha tomar um café conosco</p>
              <span className="text-slate-800 font-medium text-sm">Av. Caiapó, 1190 - Goiânia/GO</span>
            </Link>
          </div>
        </div>
      </section>

      <DynamicBanner id="home-sessao-contato" />
    </main>
  );
}