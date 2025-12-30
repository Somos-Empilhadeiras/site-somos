import Link from 'next/link';
import { Facebook, Instagram, Linkedin, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#e9e8e8] text-slate-700 flex flex-col items-center text-center pt-16 pb-8 px-4">
      <div className=" grid grid-cols-[2fr_3fr] gap-x-5 container w-full">

        <div className='flex flex-col items-center gap-y-5 w-full'>
          {/* LOGO */}
          <Link href="/" className="flex items-center gap-3 group select-none">
            <img alt='Logo somos' src="/logo.png" width={250} height={250} />
            <img alt='Logo heli' src="/heli.png" width={175} height={175} />
          </Link>

          {/* Título Redes Sociais */}
          <h3 className="text-xl font-semibold">Siga as nossas redes sociais</h3>


          {/* Ícones */}
          <div className="flex gap-4 mb-10">
            <a href="#" className="bg-white/10 hover:bg-white/50 p-3 rounded-full transition-all hover:-translate-y-1">
              <Instagram size={24} className="" />
            </a>
            <a href="#" className="bg-white/10 hover:bg-white/50 p-3 rounded-full transition-all hover:-translate-y-1">
              <Facebook size={24} className="" />
            </a>
            <a href="#" className="bg-white/10 hover:bg-white/50 p-3 rounded-full transition-all hover:-translate-y-1">
              <Linkedin size={24} className="" />
            </a>
          </div>
        </div>

        <div className='grid grid-cols-4 gap-x-5 container w-full'>
          <div className="flex items-baseline  flex-col mb-6  h-full">
            <p className='font-semibold mb-3'>
              Geral
            </p>

            <div className="flex flex-col gap-2">
              <span className='flex gap-2 hover:text-gray-400 hover:-translate-y-0.5 transition-all'>
                <Link href={"/"}>Inicio</Link>
              </span>
              <span className='flex gap-2 hover:text-gray-400 hover:-translate-y-0.5 transition-all'>
                <Link href={"/sobre"}>Sobre nós</Link>
              </span>
              <span className='flex gap-2 hover:text-gray-400 hover:-translate-y-0.5 transition-all'>
                <Link href={"/empilhadeiras"}>Empilhadeiras</Link>
              </span>
              <span className='flex gap-2 hover:text-gray-400 hover:-translate-y-0.5 transition-all'>
                <Link href={"/produtos"}>Produtos</Link>
              </span>
              <span className='flex gap-2 hover:text-gray-400 hover:-translate-y-0.5 transition-all'>
                <Link href={"/unidades"}>Unidades</Link>
              </span>
            </div>
          </div>
          <div className="flex items-baseline  flex-col mb-6 h-full">
            <p className='font-semibold mb-3'>
              Empilhadeiras
            </p>

            <div className='flex flex-col gap-2'>
              <span className='flex gap-2 hover:text-gray-400 hover:-translate-y-0.5 transition-all'>
                <Link href={"/empilhadeiras/"}>Todas as empilhadeiras</Link>
              </span>
              <span className='flex gap-2 hover:text-gray-400 hover:-translate-y-0.5 transition-all'>
                <Link href={"/empilhadeiras/eletricas"}>Elétricas</Link>
              </span>
              <span className='flex gap-2 hover:-translate-y-0.5 transition-all hover:text-gray-400 '>
                <Link href={"/empilhadeiras/combustao"}>Combustão</Link>
              </span>
              <span className='flex gap-2 hover:text-gray-400 hover:-translate-y-0.5 transition-all '>
                <Link href={"/empilhadeiras/rebocadores"}>Rebocadores</Link>
              </span>
            </div>
          </div>

          <div className="flex items-baseline  flex-col mb-6 h-full">
            <p className='font-semibold mb-3'>
              Produtos
            </p>

            <div className='flex flex-col gap-2'>
              <span className='flex gap-2 hover:text-gray-400 hover:-translate-y-0.5 transition-all'>
                <Link href={"/produtos/pecas"}>Peças</Link>
              </span>
              <span className='flex gap-2 hover:text-gray-400 hover:-translate-y-0.5 transition-all'>
                <Link href={"/produtos/servicos"}>Serviços</Link>
              </span>
              <span className='flex gap-2 hover:text-gray-400 hover:-translate-y-0.5 transition-all'>
                <Link href={"/produtos/pneus"}>Pneus</Link>
              </span>
            </div>
          </div>

          <div className="flex items-baseline  flex-col mb-6 h-full">
            <p className='font-semibold mb-3'>
              Outros
            </p>

            <div className='flex flex-col gap-2'>
              <span className='flex gap-2 hover:text-gray-400 hover:-translate-y-0.5 transition-all'>
                <Link href={"/#contato"}>Fale conosco</Link>
              </span>
              <span className='flex gap-2 hover:text-gray-400 hover:-translate-y-0.5 transition-all'>
                <Link href={"/#unidades"}>Nossas Unidades</Link>
              </span>
              <span className='flex gap-2 hover:text-gray-400 hover:-translate-y-0.5 transition-all'>
                <Link href={"https://apps.somosempilhadeiras.com"}>Área do Colaborador</Link>
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className='flex flex-col container items-center'>
        {/* Linha Divisória */}
        <div className="w-full h-px bg-gray-700/30 mb-8 max-w-"></div>

        {/* Copyright */}
        <p className="text-sm /80">
          © 2025 Somos Empilhadeiras
        </p>
      </div>
    </footer>
  );
}