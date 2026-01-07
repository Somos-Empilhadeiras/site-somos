'use client';
import React from 'react';
import DynamicBanner from '@/components/admin/banners/DynamicBanner';
import Link from 'next/link';
import {
  CheckCircle2, Users, Award, TrendingUp, MapPin,
  Target, Heart, ShieldCheck, ArrowRight
} from 'lucide-react';

export default function About() {
  return (
    <main className="min-h-screen bg-slate-50">

      {/* 1. BANNER DINÂMICO (Gerenciado pelo Admin) */}
      <DynamicBanner id="sobre-topo" className="z-40" />

      {/* 2. SESSÃO: QUEM SOMOS */}
      <section className="py-20 container mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-center gap-12">

          {/* Texto de Apresentação */}
          <div className="lg:w-1/2 space-y-6">
            <span className="text-yellow-600 font-bold text-sm uppercase tracking-widest">Quem Somos</span>
            <h1 className="text-4xl md:text-5xl font-black text-[#005831] leading-tight">
              Soluções completas para sua logística.
            </h1>

            {/* --- TEXTO PRINCIPAL --- */}
            <div className="text-slate-600 text-lg leading-relaxed space-y-4">
              <p>
                A <strong>Somos Empilhadeiras</strong> atua desde 2023 no mercado de venda, locação e manutenção de empilhadeiras, bem como na venda de peças e insumos para o setor logístico.
              </p>
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
              </p>
            </div>
            {/* ----------------------- */}

            <div className="pt-4 grid grid-cols-2 gap-6">
              <div className="flex items-center gap-3">
                <div className="bg-green-100 p-2 rounded-full text-[#005831]"><ShieldCheck size={24} /></div>
                <span className="font-bold text-slate-700">Peças Genuínas</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="bg-green-100 p-2 rounded-full text-[#005831]"><Award size={24} /></div>
                <span className="font-bold text-slate-700">Manutenção Especializada</span>
              </div>
            </div>
          </div>

          {/* Imagem de Destaque */}
          <div className="lg:w-1/2 relative">
            <div className="absolute -top-4 -left-4 w-24 h-24 bg-yellow-400 rounded-tl-3xl z-0"></div>
            <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-[#005831] rounded-br-3xl z-0"></div>

            {/* Placeholder Imagem */}
            <img
              src="https://images.unsplash.com/photo-1587578507850-252a1ba763b0?q=80&w=1000&auto=format&fit=crop"
              alt="Nossa Operação"
              className="relative z-10 rounded-2xl shadow-2xl w-full h-[400px] object-cover border-4 border-white"
            />
          </div>
        </div>
      </section>

      {/* 3. SESSÃO: NÚMEROS */}
      <section className="bg-[#005831] py-16 text-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-x divide-white/20">

            <div className="p-4">
              <p className="text-4xl md:text-5xl font-black text-yellow-400 mb-2">2023</p>
              <p className="text-sm md:text-base font-medium uppercase tracking-wide">Ano de Fundação</p>
            </div>

            <div className="p-4">
              <p className="text-4xl md:text-5xl font-black text-yellow-400 mb-2">+100</p>
              <p className="text-sm md:text-base font-medium uppercase tracking-wide">Clientes Atendidos</p>
            </div>

            <div className="p-4">
              <p className="text-4xl md:text-5xl font-black text-yellow-400 mb-2">24h</p>
              <p className="text-sm md:text-base font-medium uppercase tracking-wide">Suporte Técnico</p>
            </div>

            <div className="p-4">
              <p className="text-4xl md:text-5xl font-black text-yellow-400 mb-2">100%</p>
              <p className="text-sm md:text-base font-medium uppercase tracking-wide">Comprometimento</p>
            </div>

          </div>
        </div>
      </section>

      {/* 4. SESSÃO: MISSÃO, VISÃO E VALORES */}
      <section className="py-20 container mx-auto px-4 bg-white">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-slate-800">Nossa Identidade</h2>
          <div className="w-20 h-1.5 bg-yellow-400 mx-auto mt-4 rounded-full"></div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Card Missão */}
          <div className="bg-slate-50 p-8 rounded-2xl border border-slate-100 hover:shadow-xl transition-all group">
            <div className="w-14 h-14 bg-white rounded-xl flex items-center justify-center shadow-sm mb-6 group-hover:scale-110 transition-transform">
              <Target className="text-[#005831]" size={32} />
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-3">Missão</h3>
            <p className="text-slate-600 leading-relaxed">
              Consolidar-nos como parceiro de confiança em GO, DF e TO, proporcionando experiências excepcionais com produtos de qualidade superior e um suporte pós-venda incomparável.
            </p>
          </div>

          {/* Card Visão */}
          <div className="bg-slate-50 p-8 rounded-2xl border border-slate-100 hover:shadow-xl transition-all group">
            <div className="w-14 h-14 bg-white rounded-xl flex items-center justify-center shadow-sm mb-6 group-hover:scale-110 transition-transform">
              <TrendingUp className="text-[#005831]" size={32} />
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-3">Visão</h3>
            <p className="text-slate-600 leading-relaxed">
              Consolidar-nos como o parceiro de confiança essencial, garantindo experiências excepcionais através de produtos de qualidade superior e um compromisso incomparável com o suporte pós-venda.
            </p>
          </div>

          {/* Card Valores */}
          <div className="bg-slate-50 p-8 rounded-2xl border border-slate-100 hover:shadow-xl transition-all group">
            <div className="w-14 h-14 bg-white rounded-xl flex items-center justify-center shadow-sm mb-6 group-hover:scale-110 transition-transform">
              <Heart className="text-[#005831]" size={32} />
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-3">Valores</h3>
            <ul className="text-slate-600 space-y-2">
              <li className="flex items-center gap-2"><CheckCircle2 size={16} className="text-yellow-500" /> Cliente no Centro: Foco total na satisfação e superação de expectativas.</li>
              <li className="flex items-center gap-2"><CheckCircle2 size={16} className="text-yellow-500" /> Valorização Humana: Respeito, desenvolvimento e diversidade da equipe.</li>
              <li className="flex items-center gap-2"><CheckCircle2 size={16} className="text-yellow-500" /> Sustentabilidade: Responsabilidade ambiental e eficiência energética.</li>
            </ul>
          </div>
        </div>
      </section>

      {/* 5. SESSÃO: GALERIA / INFRAESTRUTURA */}
      <section className="py-20 bg-slate-50 border-t border-slate-200">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-end mb-10">
            <div>
              <h2 className="text-3xl font-bold text-slate-800 mb-2">Nossa Estrutura</h2>
              <p className="text-slate-500">Conheça de perto onde a mágica acontece.</p>
            </div>
          </div>

          {/* Grid de Fotos */}
          <div className="grid grid-cols-1 md:grid-cols-4 grid-rows-2 gap-4 h-[500px]">
            <div className="md:col-span-2 md:row-span-2 relative group overflow-hidden rounded-2xl">
              <img
                src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=1000"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                alt="Galpão"
              />
              <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors"></div>
              <span className="absolute bottom-4 left-4 bg-white/90 px-3 py-1 rounded text-xs font-bold uppercase">Galpão Principal</span>
            </div>

            <div className="md:col-span-2 relative group overflow-hidden rounded-2xl">
              <img
                src="https://images.unsplash.com/photo-1530124566582-a618bc2615dc?q=80&w=1000"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                alt="Equipe"
              />
            </div>

            <div className="relative group overflow-hidden rounded-2xl">
              <img
                src="https://images.unsplash.com/photo-1628148818278-42289c037803?q=80&w=1000"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                alt="Peças"
              />
            </div>

            <div className="relative group overflow-hidden rounded-2xl bg-[#005831] flex items-center justify-center flex-col text-white p-6 text-center">
              <Users size={40} className="mb-2 text-yellow-400" />
              <p className="font-bold text-lg">Visite-nos</p>
              <p className="text-xs opacity-80 mt-1">Lorem ipsum, 123 - GO</p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. CTA FINAL */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 text-center max-w-3xl">
          <h2 className="text-3xl font-bold text-slate-900 mb-6">Pronto para otimizar sua operação?</h2>
          <p className="text-slate-600 text-lg mb-8">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Entre em contato com nossos consultores hoje mesmo.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              href="https://wa.me/5562991834188"
              className="bg-[#005831] hover:bg-[#004626] text-white py-4 px-8 rounded-xl font-bold shadow-lg hover:-translate-y-1 transition-all flex items-center justify-center gap-2"
            >
              Falar com Consultor <ArrowRight size={20} />
            </Link>
            <Link
              href="/catalogo"
              className="bg-white border-2 border-slate-200 hover:border-[#005831] text-slate-700 hover:text-[#005831] py-4 px-8 rounded-xl font-bold transition-all flex items-center justify-center gap-2"
            >
              Ver Catálogo
            </Link>
          </div>
        </div>
      </section>

    </main>
  );
}