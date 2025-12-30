'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation'; // Para saber em qual página estamos
import { ChevronDown, Menu, X, Phone, MapPin, Users2, Pin } from 'lucide-react';
import DynamicBanner from './DynamicBanner';
import Image from 'next/image';

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname(); // Hook para pegar a rota atual

  // Função auxiliar para verificar se o link está ativo
  const isActive = (path: string) => pathname === path ? "text-[#005831] font-bold bg-green-50" : "text-slate-600 hover:text-[#005831]";

  useEffect(() => {
    if (isMobileMenuOpen) {
      // Trava a rolagem do corpo do site
      document.body.style.overflow = 'hidden';
    } else {
      // Destrava quando fecha
      document.body.style.overflow = 'unset';
    }

    // Garante que destrava se o componente desmontar
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  return (
    // A div "sticky" envolve o Banner E a Navbar para ambos ficarem fixos
    <div className='sticky top-0 z-100 w-full'>

      <nav className="bg-white border-b-4 border-[#005831] shadow-lg relative z-100">
        <div className="container mx-auto px-4">
          <div className="flex z-100 justify-between items-center h-20">

            {/* LOGO */}
            <Link href="/" className="flex items-center gap-3 group select-none">
              <img alt='Logo somos' src="/logo.png" width={150} height={150} />
              <img alt='Logo heli' src="/heli.png" width={125} height={125} />
            </Link>

            {/* MENU DESKTOP */}
            <div className="hidden lg:flex items-center gap-1">
              <Link href="/" className={`px-4 py-2 rounded-full transition-all ${isActive('/')}`}>
                Início
              </Link>

              <Link href="/sobre" className={`px-4 py-2 rounded-full transition-all ${isActive('/sobre')}`}>
                Sobre
              </Link>

              <Link href="/empilhadeiras" className={`px-4 py-2 rounded-full transition-all ${isActive('/catalogo')}`}>
                Empilhadeiras
              </Link>

              <div className="relative group px-4 py-2 cursor-pointer">
                <Link href="/produtos" className="flex items-center gap-1 text-slate-600 group-hover:text-[#005831] transition-colors">
                  <span>Produtos</span>
                  <ChevronDown size={16} className="mt-0.5 group-hover:rotate-180 transition-transform duration-300" />
                </Link>

                {/* Dropdown Menu */}
                <div className="absolute top-full left-0 pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform translate-y-2 group-hover:translate-y-0 z-100">
                  <div className="bg-white border border-slate-100 shadow-xl rounded-xl overflow-hidden w-56 p-2 z-100">
                    <Link href="#" className="flex items-center gap-3 px-3 py-3 hover:bg-green-50 text-slate-700 hover:text-[#005831] rounded-lg transition-colors z-100">
                      <div className="flex flex-col leading-tight z-100">
                        <span className="font-medium">Peças</span>
                      </div>
                    </Link>
                    <Link href="#" className="flex items-center gap-3 px-3 py-3 hover:bg-green-50 text-slate-700 hover:text-[#005831] rounded-lg transition-colors">
                      <div className="flex flex-col leading-tight">
                        <span className="font-medium">Serviços</span>
                      </div>
                    </Link>
                    <Link href="#" className="flex items-center gap-3 px-3 py-3 hover:bg-green-50 text-slate-700 hover:text-[#005831] rounded-lg transition-colors">
                      <div className="flex flex-col leading-tight">
                        <span className="font-medium">Pneus</span>
                      </div>
                    </Link>
                  </div>
                </div>
              </div>

              <Link href="/trabalhe-conosco" className={`px-4 py-2 rounded-full transition-all ${isActive('/sobre')}`}>
                Trabalhe Conosco
              </Link>

              {/* Dropdown Unidades */}
              <div className="relative group px-4 py-2 cursor-pointer">
                <div className="flex items-center gap-1 text-slate-600 group-hover:text-[#005831] transition-colors">
                  <span>Unidades</span>
                  <ChevronDown size={16} className="mt-0.5 group-hover:rotate-180 transition-transform duration-300" />
                </div>

                {/* Dropdown Menu */}
                <div className="absolute top-full right-0 pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform translate-y-2 group-hover:translate-y-0">
                  <div className="bg-white border border-slate-100 shadow-xl rounded-xl overflow-hidden w-56 p-2">
                    <div className="text-xs font-bold text-slate-400 px-3 py-2 uppercase tracking-wider">Nossas Lojas</div>
                    <Link href="#" className="flex items-center gap-3 px-3 py-3 hover:bg-green-50 text-slate-700 hover:text-[#005831] rounded-lg transition-colors">
                      <MapPin size={18} className="text-yellow-500" />
                      <div className="flex flex-col leading-tight">
                        <span className="font-bold">Matriz</span>
                        <span className="text-xs opacity-70">Goiânia - GO</span>
                      </div>
                    </Link>
                    <Link href="#" className="flex items-center gap-3 px-3 py-3 hover:bg-green-50 text-slate-700 hover:text-[#005831] rounded-lg transition-colors">
                      <MapPin size={18} className="text-slate-400" />
                      <div className="flex flex-col leading-tight">
                        <span className="font-bold">Filial DF</span>
                        <span className="text-xs opacity-70">Brasília</span>
                      </div>
                    </Link>
                    <Link href="#" className="flex items-center gap-3 px-3 py-3 hover:bg-green-50 text-slate-700 hover:text-[#005831] rounded-lg transition-colors">
                      <MapPin size={18} className="text-slate-400" />
                      <div className="flex flex-col leading-tight">
                        <span className="font-bold">Filial TO</span>
                        <span className="text-xs opacity-70">Palmas</span>
                      </div>
                    </Link>
                    <Link href="#" className="flex items-center gap-3 px-3 py-3 hover:bg-green-50 text-slate-700 hover:text-[#005831] rounded-lg transition-colors">
                      <MapPin size={18} className="text-slate-400" />
                      <div className="flex flex-col leading-tight">
                        <span className="font-bold">Filial BA</span>
                        <span className="text-xs opacity-70">Luis Eduardo Magalhães</span>
                      </div>
                    </Link>
                    <Link href="#" className="flex items-center gap-3 px-3 py-3 hover:bg-green-50 text-slate-700 hover:text-[#005831] rounded-lg transition-colors">
                      <MapPin size={18} className="text-slate-400" />
                      <div className="flex flex-col leading-tight">
                        <span className="font-bold">Filial PE</span>
                        <span className="text-xs opacity-70">Recife</span>
                      </div>
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-4 sm:flex-col lg:flex-row">
              {/* CTA BUTTON (Desktop) */}
              <div className="hidden lg:block">
                <Link
                  href="https://wa.me/5562991834188"
                  target="_blank"
                  className="bg-[#005831] hover:bg-[#004626] text-white px-6 py-2.5 rounded-full font-bold transition-all shadow-md hover:shadow-lg flex items-center gap-2 text-sm"
                >
                  <Phone size={16} />
                  Fale Conosco
                </Link>
              </div>
            </div>

            {/* BOTÃO MENU MOBILE */}
            <button
              className="lg:hidden p-2 text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>

        {/* MENU MOBILE (Expansível) */}
        {isMobileMenuOpen && (
          <div className="lg:hidden bg-white border-t border-slate-100 fixed left-0 right-0 bottom-0 top-20 z-50 overflow-y-auto overscroll-contain animate-in slide-in-from-top-5 duration-200 pb-20">
            <div className="container mx-auto px-4 py-4 flex flex-col gap-2">
              <Link
                href="/"
                className={`p-4 rounded-xl font-bold flex items-center justify-between ${pathname === '/' ? 'bg-green-50 text-[#005831]' : 'text-slate-600'}`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Início
              </Link>
              <Link
                href="/catalogo"
                className={`p-4 rounded-xl font-bold flex items-center justify-between ${pathname === '/catalogo' ? 'bg-green-50 text-[#005831]' : 'text-slate-600'}`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Catálogo Completo
              </Link>
              <Link
                href="/sobre"
                className={`p-4 rounded-xl font-bold flex items-center justify-between ${pathname === '/sobre' ? 'bg-green-50 text-[#005831]' : 'text-slate-600'}`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Sobre a Empresa
              </Link>

              <div className="h-px bg-slate-100 my-2"></div>

              <p className="text-xs font-bold text-slate-400 px-4 uppercase tracking-wider mb-2">Unidades</p>
              <div className="grid grid-cols-3 grid-rows-2 gap-2 px-2">
                <div className="bg-slate-50 p-3 rounded-lg items-center justify-center flex flex-col text-center border border-slate-100">
                  <span className="block font-bold text-yellow-500 text-sm"><MapPin /></span>
                  <span className="block font-bold text-slate-800 text-sm">Goiânia</span>
                  <span className="text-xs text-slate-500">Matriz</span>
                </div>
                <div className="bg-slate-50 p-3 rounded-lg text-center items-center justify-center flex flex-col border border-slate-100">
                  <span className="block font-bold text-slate-400 text-sm"><MapPin /></span>
                  <span className="block font-bold text-slate-800 text-sm">Brasília</span>
                  <span className="text-xs text-slate-500">Filial</span>
                </div>
                <div className="bg-slate-50 p-3 rounded-lg text-center items-center justify-center flex flex-col border border-slate-100">
                  <span className="block font-bold text-slate-400 text-sm"><MapPin /></span>
                  <span className="block font-bold text-slate-800 text-sm">Palmas</span>
                  <span className="text-xs text-slate-500">Filial</span>
                </div>
                <div className="bg-slate-50 p-3 rounded-lg text-center items-center justify-center flex flex-col border border-slate-100">
                  <span className="block font-bold text-slate-400 text-sm"><MapPin /></span>
                  <span className="block font-bold text-slate-800 text-sm">Luis Eduardo Magalhães</span>
                  <span className="text-xs text-slate-500">Filial</span>
                </div>
                <div className="bg-slate-50 p-3 rounded-lg text-center items-center justify-center flex flex-col border border-slate-100">
                  <span className="block font-bold text-slate-400 text-sm"><MapPin /></span>
                  <span className="block font-bold text-slate-800 text-sm">Recife</span>
                  <span className="text-xs text-slate-500">Filial</span>
                </div>
              </div>

              <div className="h-px bg-slate-100 my-2"></div>

              <p className="text-xs font-bold text-slate-400 px-4 uppercase tracking-wider mb-2">Outros</p>
              <div className="flex gap-4">
                {/* CTA BUTTON (Desktop) */}
                <div className="block">
                  <Link
                    href="https://wa.me/5562991834188"
                    target="_blank"
                    className="bg-[#005831] hover:bg-[#004626] text-white px-6 py-2.5 rounded-full font-bold transition-all shadow-md hover:shadow-lg flex items-center gap-2 text-xs"
                  >
                    <Phone size={16} />
                    Fale Conosco
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </nav>
    </div>
  );
}