'use client';

import React from 'react';
import DynamicBanner from '@/components/admin/banners/DynamicBanner';
import Link from 'next/link';
import {
  CheckCircle2,
  Award,
  TrendingUp,
  Target,
  Heart,
  ShieldCheck,
  ArrowRight,
} from 'lucide-react';

export default function About() {
  return (
    <main className="min-h-screen bg-white">

      {/* BANNER */}
      <DynamicBanner id="sobre-topo" className="z-40" />

      {/* QUEM SOMOS – FUNDO CLARO, VERDE SUTIL */}
      <section className="py-28 bg-slate-50">
        <div className="container mx-auto px-4 grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <span className="text-sm font-semibold uppercase tracking-widest text-[#4fa37a]">
              Quem Somos
            </span>

            <h1 className="mt-6 text-4xl md:text-5xl font-black leading-tight text-slate-900">
              Soluções em empilhadeiras com foco em
              <span className="text-[#005831]"> desempenho e confiança</span>
            </h1>

            <div className="mt-8 space-y-6 text-slate-600 text-lg leading-relaxed">
              <p>
                A <strong>Somos Empilhadeiras</strong> atua desde 2023 no mercado de
                venda, locação e manutenção de empilhadeiras, além do fornecimento
                de peças e insumos para operações logísticas.
              </p>

              <p>
                Trabalhamos ao lado de empresas que exigem eficiência, segurança e
                suporte técnico confiável, atendendo principalmente as regiões de
                <strong> GO, DF, TO, BA e RE</strong>.
              </p>

              <p>
                Nosso compromisso é oferecer soluções práticas, atendimento próximo
                e decisões técnicas que sustentam operações que não podem parar.
              </p>
            </div>

            <div className="mt-10 grid grid-cols-2 gap-6">
              <div className="flex items-center gap-3">
                <div className="bg-green-100 p-2 rounded-full">
                  <ShieldCheck className="text-[#005831]" size={22} />
                </div>
                <span className="font-semibold text-slate-700">Peças Genuínas</span>
              </div>

              <div className="flex items-center gap-3">
                <div className="bg-green-100 p-2 rounded-full">
                  <Award className="text-[#005831]" size={22} />
                </div>
                <span className="font-semibold text-slate-700">
                  Manutenção Especializada
                </span>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -top-6 -left-6 w-32 h-32 bg-green-100 rounded-3xl"></div>
            <img
              src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=1200"
              alt="Operação logística"
              className="relative z-10 rounded-3xl shadow-xl w-full h-[460px] object-cover"
            />
          </div>
        </div>
      </section>

      {/* NÚMEROS – VERDE MAIS CLARO */}
      <section className="py-24 bg-[#f3f8f5] border-t border-slate-200">
        <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
          {[
            { value: '2023', label: 'Ano de Fundação' },
            { value: '+100', label: 'Clientes Atendidos' },
            { value: '24h', label: 'Suporte Técnico' },
            { value: '100%', label: 'Comprometimento' },
          ].map((item, index) => (
            <div
              key={index}
              className="rounded-2xl bg-white border border-slate-200 py-12 px-6 shadow-sm"
            >
              <p className="text-5xl font-black text-[#005831] mb-4">
                {item.value}
              </p>
              <p className="uppercase tracking-wide text-slate-600 font-semibold text-sm">
                {item.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* MISSÃO, VISÃO, VALORES */}
      <section className="py-28 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-black text-slate-900">
              Nossa Identidade
            </h2>
            <div className="w-24 h-1.5 bg-[#005831] mx-auto mt-6 rounded-full"></div>
          </div>

          <div className="grid md:grid-cols-3 gap-10">
            <div className="bg-slate-50 p-10 rounded-3xl border border-slate-200">
              <Target className="text-[#005831]" size={38} />
              <h3 className="mt-6 text-2xl font-bold text-slate-900">Missão</h3>
              <p className="mt-4 text-slate-600 leading-relaxed">
                Atuar como parceiro técnico de confiança, entregando soluções
                eficientes em empilhadeiras e suporte especializado.
              </p>
            </div>

            <div className="bg-slate-50 p-10 rounded-3xl border border-slate-200">
              <TrendingUp className="text-[#005831]" size={38} />
              <h3 className="mt-6 text-2xl font-bold text-slate-900">Visão</h3>
              <p className="mt-4 text-slate-600 leading-relaxed">
                Ser referência regional em soluções logísticas, reconhecida pela
                qualidade técnica e relacionamento com o cliente.
              </p>
            </div>

            <div className="bg-slate-50 p-10 rounded-3xl border border-slate-200">
              <Heart className="text-[#005831]" size={38} />
              <h3 className="mt-6 text-2xl font-bold text-slate-900">Valores</h3>
              <ul className="mt-4 space-y-3 text-slate-600">
                <li className="flex gap-2">
                  <CheckCircle2 className="text-[#4fa37a]" size={18} />
                  Cliente no centro das decisões
                </li>
                <li className="flex gap-2">
                  <CheckCircle2 className="text-[#4fa37a]" size={18} />
                  Ética, transparência e responsabilidade
                </li>
                <li className="flex gap-2">
                  <CheckCircle2 className="text-[#4fa37a]" size={18} />
                  Valorização das pessoas
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA FINAL – LIMPO E CORPORATIVO */}
      <section className="py-28 bg-slate-50 border-t border-slate-200">
        <div className="container mx-auto px-4 max-w-3xl text-center">
          <h2 className="text-4xl font-black text-slate-900 mb-6">
            Pronto para otimizar sua operação?
          </h2>
          <p className="text-slate-600 text-lg mb-10">
            Fale com nossos especialistas e encontre a solução ideal para sua empresa.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-6">
            <Link
              href="https://wa.me/5562991834188"
              className="bg-[#005831] text-white font-bold py-4 px-10 rounded-xl hover:bg-[#004626] transition-all flex items-center justify-center gap-2"
            >
              Falar com Consultor <ArrowRight size={20} />
            </Link>

            <Link
              href="/catalogo"
              className="bg-white border-2 border-slate-300 text-slate-700 py-4 px-10 rounded-xl font-bold hover:border-[#005831] hover:text-[#005831] transition-all"
            >
              Ver Catálogo
            </Link>
          </div>
        </div>
      </section>

    </main>
  );
}
