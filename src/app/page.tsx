'use client';

import React, { useState, useEffect } from 'react';
import BrazilMap from '../components/BrazilMap';
import Link from 'next/link';
import {
  ArrowRight, Award, CheckCircle, CheckCircle2, ChevronRight,
  Clock, FileText, Globe, Mail, MapPin, MessageCircle,
  PackageSearch, Phone, ShieldCheck, TrendingUp, Users, Wrench,
  ChevronLeft
} from 'lucide-react';
import DynamicBanner from '@/components/DynamicBanner';

// DADOS DO SLIDER'
const SLIDES = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=2070&auto=format&fit=crop",
    preTitle: "TECNOLOGIA HELI PARA O SEU NEGÓCIO",
    title: "Eleve a Produtividade da sua Operação Logística",
    description: "Distribuidora oficial para Goiás, DF, Tocantins e Bahia. Equipamentos de alta performance para quem não pode parar.",
    ctaPrimary: "Ver Catálogo",
    ctaSecondary: "Falar com Consultor"
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?q=80&w=2070&auto=format&fit=crop",
    preTitle: "FORÇA BRUTA E DURABILIDADE",
    title: "Soluções Robustas para Terrenos Difíceis",
    description: "Linha completa de empilhadeiras a combustão e todo-terreno. Potência que sua obra precisa com a economia que você quer.",
    ctaPrimary: "Linha Diesel",
    ctaSecondary: "Solicitar Cotação"
  },
  {
    id: 3,
    image: "https://plus.unsplash.com/premium_photo-1661964014750-963a28aeddea?q=80&w=2069&auto=format&fit=crop",
    preTitle: "SUSTENTABILIDADE E ECONOMIA",
    title: "A Revolução das Empilhadeiras de Lítio",
    description: "Zero emissões, carregamento rápido e manutenção reduzida. O futuro da movimentação de carga já chegou.",
    ctaPrimary: "Ver Elétricas",
    ctaSecondary: "Calcular Economia"
  }
];

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % SLIDES.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % SLIDES.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev === 0 ? SLIDES.length - 1 : prev - 1));

  return (
    <main className="min-h-screen bg-slate-50">

      {/* BANNER ID NUMERO UM */}
      <DynamicBanner id="home-topo" className="sticky top-[5.2rem] z-50" />

      {/* BANNER ID NUMERO UM */}
      <DynamicBanner id="home-slides" className="z-50" />

      {/* Barra de Destaques Inferior */}
      <div className=" w-full z-50 bg-linear-90 bg-emerald-900/90 border-t border-white/10 backdrop-blur-md hidden md:block">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-white/10">
            <div className="py-6 px-4 flex items-center gap-4 text-white hover:bg-white/5 transition-colors cursor-default">
              <div className="bg-[#005831] p-3 rounded-lg text-yellow-400"><ShieldCheck size={28} /></div>
              <div><h3 className="font-bold text-lg">Garantia Estendida</h3><p className="text-sm text-slate-300">Segurança total na sua compra</p></div>
            </div>
            <div className="py-6 px-4 flex items-center gap-4 text-white hover:bg-white/5 transition-colors cursor-default">
              <div className="bg-[#005831] p-3 rounded-lg text-yellow-400"><Wrench size={28} /></div>
              <div><h3 className="font-bold text-lg">Peças Genuínas</h3><p className="text-sm text-slate-300">Estoque local para reposição</p></div>
            </div>
            <div className="py-6 px-4 flex items-center gap-4 text-white hover:bg-white/5 transition-colors cursor-default">
              <div className="bg-[#005831] p-3 rounded-lg text-yellow-400"><Clock size={28} /></div>
              <div><h3 className="font-bold text-lg">Suporte 24h</h3><p className="text-sm text-slate-300">Atendimento técnico especializado</p></div>
            </div>
          </div>
        </div>
      </div>

      {/* BANNER ID NUMERO DOIS */}
      <DynamicBanner id="home-sessao-carrossel" className="z-50" />

      {/* 2. SESSÃO DISTRIBUIDOR HELI (Movida para cima -> Autoridade) */}
      <section className="py-24 bg-white relative overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
            <div className="lg:w-1/2 relative group">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <div className="absolute inset-0 bg-linear-to-tr from-red-600/10 to-transparent group-hover:bg-transparent transition-colors z-10"></div>
                <div className="aspect-4/3 bg-[url('https://images.unsplash.com/photo-1628148818278-42289c037803?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center transform group-hover:scale-105 transition-transform duration-700"></div>
                <div className="absolute top-6 left-6 z-20 bg-white/95 backdrop-blur px-6 py-4 rounded-xl shadow-lg border-l-8 border-red-600">
                  <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">Parceria Oficial</p>
                  <p className="text-red-600 font-black text-3xl leading-none">Desde 2023</p>
                </div>
              </div>
              <div className="absolute -bottom-8 -right-8 w-40 h-40 bg-slate-100 rounded-full mix-blend-multiply filter blur-3xl opacity-80 -z-10"></div>
            </div>

            <div className="lg:w-1/2 space-y-8">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-red-50 rounded-lg text-red-600">
                    <Award size={28} />
                  </div>
                  <span className="font-bold text-slate-800 uppercase tracking-widest text-sm">Excelência Global</span>
                </div>
                <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 leading-tight">
                  Distribuidor Autorizado <span className="text-red-600">HELI</span>
                </h2>
                <p className="mt-6 text-lg text-slate-600 leading-relaxed">
                  A <strong>Somos Empilhadeiras</strong> orgulha-se de representar oficialmente a HELI, uma das 10 maiores fabricantes de empilhadeiras do mundo.
                  Trazemos para sua operação o que há de mais avançado em tecnologia global.
                </p>
              </div>

              <div className="grid sm:grid-cols-2 gap-6">
                <div className="bg-slate-50 p-6 rounded-xl border border-slate-100 hover:border-red-200 hover:bg-white hover:shadow-lg transition-all duration-300 group/card">
                  <Globe className="text-slate-400 group-hover/card:text-red-600 mb-4 transition-colors" size={28} />
                  <h4 className="font-bold text-slate-900 mb-2">Tecnologia Mundial</h4>
                  <p className="text-sm text-slate-600 leading-relaxed">Acesso direto aos lançamentos globais e peças genuínas.</p>
                </div>
                <div className="bg-slate-50 p-6 rounded-xl border border-slate-100 hover:border-red-200 hover:bg-white hover:shadow-lg transition-all duration-300 group/card">
                  <TrendingUp className="text-slate-400 group-hover/card:text-red-600 mb-4 transition-colors" size={28} />
                  <h4 className="font-bold text-slate-900 mb-2">Alta Performance</h4>
                  <p className="text-sm text-slate-600 leading-relaxed">Equipamentos robustos projetados para ciclos intensos.</p>
                </div>
              </div>

              <div className="pt-2">
                <Link href="/catalogo" className="inline-flex items-center gap-2 text-red-700 font-bold hover:text-red-800 transition-colors group text-lg">
                  <span>Conheça a linha HELI disponível</span>
                  <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* BANNER ID NUMERO TRÊS */}
      <DynamicBanner id="home-sessao-heli" className="z-40" />

      {/* 3. SESSÃO DE PILARES (Suporte de Qualidade) */}
      <section className="py-24 bg-slate-50 border-t border-slate-200">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Por que somos a escolha certa?</h2>
            <p className="text-slate-600 max-w-2xl mx-auto text-lg">
              Além de grandes marcas, construímos nossa reputação em pilares sólidos de atendimento.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: <Clock className="w-8 h-8 text-blue-600" />, bg: "bg-blue-100", title: "Agilidade", desc: "Processos otimizados para garantir que sua operação inicie no prazo, sem atrasos." },
              { icon: <ShieldCheck className="w-8 h-8 text-green-600" />, bg: "bg-green-100", title: "Segurança", desc: "Equipamentos certificados e testados para garantir a integridade dos operadores." },
              { icon: <Wrench className="w-8 h-8 text-yellow-600" />, bg: "bg-yellow-100", title: "Manutenção", desc: "Revisão preventiva rigorosa em toda a frota, assegurando disponibilidade mecânica." },
              { icon: <Users className="w-8 h-8 text-purple-600" />, bg: "bg-purple-100", title: "Suporte", desc: "Equipe de especialistas pronta para consultoria e solução rápida de problemas." }
            ].map((card, idx) => (
              <div key={idx} className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-slate-100 group">
                <div className={`w-14 h-14 ${card.bg} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  {card.icon}
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-3">{card.title}</h3>
                <p className="text-slate-600 leading-relaxed text-sm">{card.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BANNER ID NUMERO QUATRO */}
      <DynamicBanner id="home-sessao-pilares" className="z-40" />

      {/* 4. SESSÃO DE DESTAQUE DA FROTA (Fundo Branco - Produto) */}
      <section className="py-24 bg-white relative">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="lg:w-1/2 space-y-8 order-2 lg:order-1">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-bold uppercase tracking-wider">
                <PackageSearch size={14} /> Nossa Especialidade
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-slate-900 leading-tight">
                Equipamentos Robustos para <span className="text-transparent bg-clip-text bg-linear-to-r from-yellow-600 to-yellow-500">Desafios Reais</span>
              </h2>
              <p className="text-slate-600 text-lg leading-relaxed">
                Não deixe sua operação parar. Contamos com uma frota diversificada de empilhadeiras elétricas e a combustão, prontas para atender desde pequenos estoques até grandes centros de distribuição.
              </p>
              <ul className="space-y-4">
                {['Manutenção preventiva inclusa', 'Equipamentos revisados e com garantia', 'Opções a Gás (GLP), Diesel e Lítio'].map((item, index) => (
                  <li key={index} className="flex items-center gap-3 text-slate-700 font-medium"><CheckCircle2 className="text-green-600 w-6 h-6 shrink-0" />{item}</li>
                ))}
              </ul>
              <div className="pt-6">
                <Link href="/catalogo" className="group inline-flex items-center justify-center px-8 py-4 text-base font-bold text-white transition-all duration-200 bg-slate-900 border border-transparent rounded-xl hover:bg-slate-800 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-900">
                  Ver Catálogo Completo <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </div>
            <div className="lg:w-1/2 w-full relative order-1 lg:order-2">
              <div className="absolute inset-0 bg-yellow-400 rounded-3xl transform rotate-6 translate-x-4 translate-y-4 opacity-20"></div>
              <div className="relative bg-slate-100 rounded-3xl overflow-hidden shadow-2xl aspect-4/3 group">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1587578507850-252a1ba763b0?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center">
                  <div className="absolute inset-0 bg-linear-to-t from-slate-900/50 to-transparent"></div>
                </div>
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <span className="text-white font-bold border-2 border-white px-6 py-2 rounded-full backdrop-blur-sm cursor-pointer">Visualizar Máquinas</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* BANNER ID NUMERO CINCO */}
      <DynamicBanner id="home-sessao-frotas" className="z-40" />

      {/* 5. LOCAÇÃO E VENDA (Fundo Verde - O "Baralho" Visual) */}
      <section className="relative bg-[#005831] overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center bg-no-repeat opacity-20 mix-blend-overlay"></div>
          <div className="absolute inset-0 bg-linear-to-r from-[#005831] via-[#005831]/95 to-[#005831]/40"></div>
        </div>

        <div className="container mx-auto px-4 py-20 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-20">
            {/* Texto */}
            <div className="lg:w-1/2 text-white space-y-6">
              <h2 className="text-3xl md:text-5xl font-bold leading-tight">
                Especialistas em <span className="text-yellow-400">Locação e Venda</span>
              </h2>
              <div className="w-24 h-1 bg-yellow-400 mt-2 rounded-full"></div>

              <div className="space-y-4 text-lg text-slate-100/90 leading-relaxed max-w-2xl">
                <p>
                  A <strong className="text-white">Somos Empilhadeiras</strong> oferece a flexibilidade que sua empresa precisa. Seja para renovação de frota (Venda) ou demandas sazonais (Locação).
                </p>
                <p>
                  Garantimos <span className="text-yellow-400 font-bold">redução de custos</span> operacionais e aumento imediato da produtividade com suporte técnico especializado incluso.
                </p>
              </div>

              {/* Box CTA */}
              <div className="mt-8 bg-black/20 backdrop-blur-sm border border-white/10 p-6 rounded-2xl">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-yellow-400 rounded-lg text-[#005831] hidden sm:block"><FileText size={24} /></div>
                  <div>
                    <h3 className="text-xl font-bold text-white mb-1">Solicite uma análise gratuita</h3>
                    <p className="text-slate-200 text-sm mb-6">Descubra qual o modelo ideal (Locação ou Compra) para o seu fluxo de caixa.</p>
                    <div className="flex flex-col sm:flex-row gap-4">
                      <Link href="https://wa.me/5562991834188" target="_blank" className="flex-1 flex items-center justify-center gap-2 bg-transparent border-2 border-white/30 hover:border-green-400 hover:bg-green-500/20 text-white py-3 px-6 rounded-lg font-bold transition-all group">
                        <MessageCircle size={20} className="text-green-400 group-hover:text-white transition-colors" />
                        <span>WhatsApp</span>
                      </Link>
                      <Link href="/sobre" className="flex-1 flex items-center justify-center gap-2 bg-yellow-400 hover:bg-yellow-300 text-[#005831] py-3 px-6 rounded-lg font-bold shadow-lg hover:shadow-yellow-400/20 transition-all transform hover:-translate-y-1">
                        <span>SAIBA MAIS</span>
                        <ChevronRight size={18} />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Visual Baralho (Cards Animados) */}
            <div className="lg:w-1/2 w-full relative h-[550px] sm:h-[650px] flex items-center justify-center perspective-1000">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[130%] h-[130%] bg-white/5 rounded-full blur-3xl -z-10"></div>
              <div className="relative w-[450px] sm:w-[550px] h-full flex items-center justify-center">

                {/* Carta Esquerda */}
                <div className="absolute left-0 sm:left-6 w-56 sm:w-64 h-80 sm:h-96 bg-slate-800 rounded-xl shadow-2xl border-4 border-white/20 transform -rotate-12 translate-y-8 hover:rotate-0 hover:translate-y-0 hover:z-30 hover:scale-105 transition-all duration-500 ease-out z-10 overflow-hidden group cursor-pointer">
                  <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center transition-transform duration-700 group-hover:scale-110"></div>
                  <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent opacity-90"></div>
                  <div className="absolute bottom-4 left-4 text-white">
                    <p className="text-sm text-yellow-400 font-bold uppercase tracking-wider">Locação</p>
                    <p className="font-bold text-lg">Flexibilidade Total</p>
                  </div>
                </div>

                {/* Carta Direita */}
                <div className="absolute right-0 sm:right-6 w-56 sm:w-64 h-80 sm:h-96 bg-slate-800 rounded-xl shadow-2xl border-4 border-white/20 transform rotate-12 translate-y-8 hover:rotate-0 hover:translate-y-0 hover:z-30 hover:scale-105 transition-all duration-500 ease-out z-10 overflow-hidden group cursor-pointer">
                  <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1587578507850-252a1ba763b0?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center transition-transform duration-700 group-hover:scale-110"></div>
                  <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent opacity-90"></div>
                  <div className="absolute bottom-4 left-4 text-white">
                    <p className="text-sm text-yellow-400 font-bold uppercase tracking-wider">Venda</p>
                    <p className="font-bold text-lg">Frota Própria</p>
                  </div>
                </div>

                {/* Carta Central */}
                <div className="absolute z-20 w-64 sm:w-72 h-[340px] sm:h-[420px] bg-slate-800 rounded-xl shadow-2xl border-4 border-white transform -translate-y-6 hover:translate-y-2 hover:scale-105 hover:z-40 transition-all duration-500 ease-out overflow-hidden group cursor-pointer">
                  <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center transition-transform duration-700 group-hover:scale-110"></div>
                  <div className="absolute inset-0 bg-linear-to-t from-[#005831] via-transparent to-transparent opacity-80"></div>
                  <div className="absolute bottom-6 left-6 right-6 bg-yellow-400 p-3 rounded-lg text-center shadow-lg group-hover:bg-white transition-colors">
                    <p className="text-[#005831] font-black text-sm sm:text-base uppercase tracking-wider">Profissionais Certificados</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* BANNER ID NUMERO SEIS */}
      <DynamicBanner id="home-sessao-locacao" className="z-40" />

      {/* 6. MAPA SECTION (Fundo Cinza - Separação Visual) */}
      <section id='unidades' className="py-24 bg-slate-50 border-t border-slate-200">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Onde Atuamos</h2>
            <p className="text-slate-600 max-w-2xl mx-auto text-lg">
              Presentes estrategicamente nas principais rotas logísticas do país.
            </p>
          </div>
          <BrazilMap />
        </div>
      </section>

      {/* BANNER ID NUMERO SETE */}
      <DynamicBanner id="home-sessao-mapa" className="z-40" />

      {/* 7. CONTATO (Fundo Branco Final) */}
      <section id='contato' className="py-24 bg-white border-t border-slate-100">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-[#005831] mb-4">Entre em Contato</h2>
            <p className="text-slate-600 max-w-2xl mx-auto text-lg">
              Estamos prontos para atender sua demanda.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <Link href="https://wa.me/5562991834188" target="_blank" className="bg-slate-50 p-8 rounded-2xl shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 border border-slate-100 flex flex-col items-center text-center group">
              <div className="w-16 h-16 bg-green-100 text-[#005831] rounded-full flex items-center justify-center mb-6 group-hover:bg-[#005831] group-hover:text-white transition-colors"><MessageCircle size={32} /></div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">WhatsApp</h3>
              <p className="text-slate-600 mb-4">Atendimento rápido</p>
              <span className="text-[#005831] font-bold text-lg">(62) 99183-4188</span>
            </Link>

            <Link href="mailto:comercial@somosempilhadeiras.com.br" className="bg-slate-50 p-8 rounded-2xl shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 border border-slate-100 flex flex-col items-center text-center group">
              <div className="w-16 h-16 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center mb-6 group-hover:bg-blue-700 group-hover:text-white transition-colors"><Mail size={32} /></div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">E-mail Comercial</h3>
              <p className="text-slate-600 mb-4">Solicite orçamento</p>
              <span className="text-blue-700 font-bold text-sm md:text-base break-all">comercial@somosempilhadeiras.com.br</span>
            </Link>

            <Link href="https://maps.google.com/?q=Av.+Caiapó,+1190+-+Santa+Genoveva,+Goiânia+-+GO,+74672-400" target="_blank" className="bg-slate-50 p-8 rounded-2xl shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 border border-slate-100 flex flex-col items-center text-center group">
              <div className="w-16 h-16 bg-yellow-100 text-yellow-700 rounded-full flex items-center justify-center mb-6 group-hover:bg-yellow-600 group-hover:text-white transition-colors"><MapPin size={32} /></div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">Nossa Sede</h3>
              <p className="text-slate-600 mb-4">Goiânia - GO</p>
              <span className="text-slate-800 font-medium text-sm">Av. Caiapó, 1190 - Santa Genoveva</span>
            </Link>
          </div>

          <div className="w-full h-[400px] bg-slate-200 rounded-2xl overflow-hidden shadow-lg border border-slate-300 relative">
            <iframe width="100%" height="100%" style={{ border: 0 }} loading="lazy" allowFullScreen referrerPolicy="no-referrer-when-downgrade" src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3822.458925439486!2d-49.2275815!3d-16.6538964!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x935ef3d9f2e4e1b3%3A0x1b1b1b1b1b1b1b1b!2sAv.%20Caiap%C3%B3%2C%201190%20-%20Santa%20Genoveva%2C%20Goi%C3%A2nia%20-%20GO%2C%2074672-400!5e0!3m2!1spt-BR!2sbr!4v1620000000000!5m2!1spt-BR!2sbr"></iframe>
            <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur px-4 py-2 rounded-lg shadow text-sm font-bold text-[#005831] flex items-center gap-2">
              <MapPin size={16} /> Como Chegar
            </div>
          </div>
        </div>
      </section>

      {/* BANNER ID NUMERO OITO */}
      <DynamicBanner id="home-sessao-contato" className="z-40" />

    </main>
  );
}