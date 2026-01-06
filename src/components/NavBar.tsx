'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronDown, Menu, X, Phone, Package, Wrench, Disc, Pin, MapPin } from 'lucide-react';

export default function Navbar() {
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
	const [expandedMenu, setExpandedMenu] = useState<string | null>(null);

	const pathname = usePathname();

	const isActive = (path: string) => pathname === path ? "text-[#005831] font-bold bg-green-50" : "text-slate-600 hover:text-[#005831]";

	useEffect(() => {
		if (isMobileMenuOpen) {
			document.body.style.overflow = 'hidden';
		} else {
			document.body.style.overflow = 'unset';
		}
		return () => {
			document.body.style.overflow = 'unset';
		};
	}, [isMobileMenuOpen]);

	const toggleSubmenu = (menu: string) => {
		if (expandedMenu === menu) {
			setExpandedMenu(null);
		} else {
			setExpandedMenu(menu);
		}
	};

	// Helper para fechar menu ao navegar
	const handleMobileLinkClick = () => {
		setIsMobileMenuOpen(false);
	};

	return (
		<div className='sticky top-0 z-[100] w-full'>

			<nav className="bg-white border-b-4 border-[#005831] shadow-lg relative z-[100]">
				<div className="container mx-auto px-4">
					<div className="flex justify-between items-center h-20">

						{/* LOGO */}
						<Link href="/" className="flex items-center gap-3 group select-none" onClick={handleMobileLinkClick}>
							<img alt='Logo somos' src="/logo.png" className="w-[120px] md:w-[150px] object-contain" />
							<img alt='Logo heli' src="/heli.png" className="w-[100px] md:w-[125px] object-contain" />
						</Link>

						{/* MENU DESKTOP */}
						<div className="hidden lg:flex items-center gap-1">
							<Link href="/" className={`px-4 py-2 rounded-full transition-all ${isActive('/')}`}>
								Início
							</Link>

							<Link href="/sobre" className={`px-4 py-2 rounded-full transition-all ${isActive('/sobre')}`}>
								Sobre
							</Link>

							<Link href="/empilhadeiras" className={`px-4 py-2 rounded-full transition-all ${isActive('/empilhadeiras')}`}>
								Empilhadeiras
							</Link>

							{/* Dropdown Produtos Desktop */}
							<div className="relative group px-4 py-2 cursor-pointer">
								<Link href="/produtos" className="flex items-center gap-1 text-slate-600 group-hover:text-[#005831] transition-colors">
									<span>Produtos</span>
									<ChevronDown size={16} className="mt-0.5 group-hover:rotate-180 transition-transform duration-300" />
								</Link>

								<div className="absolute top-full left-0 pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform translate-y-2 group-hover:translate-y-0 z-[100]">
									<div className="bg-white border border-slate-100 shadow-xl rounded-xl overflow-hidden w-56 p-2">
										<Link href="/produtos/pecas" className="flex items-center gap-3 px-3 py-3 hover:bg-green-50 text-slate-700 hover:text-[#005831] rounded-lg transition-colors">
											<Package size={18} /> <span className="font-medium">Peças</span>
										</Link>
										<Link href="/produtos/servicos" className="flex items-center gap-3 px-3 py-3 hover:bg-green-50 text-slate-700 hover:text-[#005831] rounded-lg transition-colors">
											<Wrench size={18} /> <span className="font-medium">Serviços</span>
										</Link>
										<Link href="/produtos/pneus" className="flex items-center gap-3 px-3 py-3 hover:bg-green-50 text-slate-700 hover:text-[#005831] rounded-lg transition-colors">
											<Disc size={18} /> <span className="font-medium">Pneus</span>
										</Link>
									</div>
								</div>
							</div>

							<Link href="/trabalhe-conosco" className={`px-4 py-2 rounded-full transition-all ${isActive('/trabalhe-conosco')}`}>
								Trabalhe Conosco
							</Link>

							{/* Dropdown Unidades Desktop */}
							<div className="relative group px-4 py-2 cursor-pointer">
								<div className="flex items-center gap-1 text-slate-600 group-hover:text-[#005831] transition-colors">
									<span>Unidades</span>
									<ChevronDown size={16} className="mt-0.5 group-hover:rotate-180 transition-transform duration-300" />
								</div>
								<div className="absolute top-full left-0 pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform translate-y-2 group-hover:translate-y-0">
									<div className="bg-white border border-slate-100 shadow-xl rounded-xl overflow-hidden w-56 p-2">
										<div className="text-xs font-bold text-slate-400 px-3 py-2 uppercase tracking-wider">Nossas Lojas</div>
										<Link href="/unidades/go" className="px-3 py-2 hover:bg-green-50 rounded cursor-pointer flex gap-2 items-center">
											<MapPin />
											<div>
												<span className="font-bold block text-sm text-slate-700">Goiânia - GO</span>
												<span className="text-xs text-slate-500">Matriz</span>
											</div>
										</Link>
										<Link href="/unidades/df" className="px-3 py-2 hover:bg-green-50 rounded cursor-pointer flex gap-2 items-center">
											<MapPin />
											<span className="font-bold block text-sm text-slate-700">Brasília - DF</span>
										</Link>
										<Link href="/unidades/to" className="px-3 py-2 hover:bg-green-50 rounded cursor-pointer flex gap-2 items-center">
											<MapPin />
											<span className="font-bold block text-sm text-slate-700">Palmas - TO</span>
										</Link>
										<Link href="/unidades/ba" className="px-3 py-2 hover:bg-green-50 rounded cursor-pointer flex gap-2 items-center">
											<MapPin />
											<span className="font-bold block text-sm text-slate-700">LEM - BA</span>
										</Link>
										<Link href="/unidades/pe" className="px-3 py-2 hover:bg-green-50 rounded cursor-pointer flex gap-2 items-center">
											<MapPin />
											<span className="font-bold block text-sm text-slate-700">Recife - PE</span>
										</Link>
									</div>
								</div>
							</div>
						</div>

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

						{/* BOTÃO MENU MOBILE */}
						<button
							className="lg:hidden p-2 text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
							onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
						>
							{isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
						</button>
					</div>
				</div>

				{/* ======================================= */}
				{/* MENU MOBILE (CORRIGIDO)                 */}
				{/* ======================================= */}
				{isMobileMenuOpen && (
					<div className="lg:hidden bg-white fixed inset-0 top-[84px] z-50 overflow-y-auto pb-20 animate-in slide-in-from-right-10 duration-200">
						<div className="container mx-auto px-4 py-6 flex flex-col gap-2">

							<Link
								href="/"
								className={`p-4 rounded-xl font-bold flex items-center justify-between border border-transparent ${pathname === '/' ? 'bg-green-50 text-[#005831] border-green-100' : 'text-slate-700 hover:bg-slate-50'}`}
								onClick={handleMobileLinkClick}
							>
								Início
							</Link>

							<Link
								href="/empilhadeiras"
								className={`p-4 rounded-xl font-bold flex items-center justify-between border border-transparent ${pathname === '/empilhadeiras' ? 'bg-green-50 text-[#005831] border-green-100' : 'text-slate-700 hover:bg-slate-50'}`}
								onClick={handleMobileLinkClick}
							>
								Empilhadeiras
							</Link>

							{/* DROPDOWN MOBILE: PRODUTOS */}
							<div className="border border-transparent rounded-xl overflow-hidden">
								<button
									onClick={() => toggleSubmenu('produtos')}
									className={`w-full p-4 font-bold flex items-center justify-between text-slate-700 hover:bg-slate-50 transition-colors ${expandedMenu === 'produtos' ? 'bg-slate-50' : ''}`}
								>
									Produtos
									<ChevronDown size={20} className={`transition-transform duration-300 ${expandedMenu === 'produtos' ? 'rotate-180 text-[#005831]' : 'text-slate-400'}`} />
								</button>

								{expandedMenu === 'produtos' && (
									<div className="bg-slate-50 px-4 pb-4 grid gap-2 animate-in slide-in-from-top-2">
										<Link href="/produtos/pecas" onClick={handleMobileLinkClick} className="flex items-center gap-3 p-3 bg-white rounded-lg border border-slate-100 shadow-sm active:scale-95 transition-transform">
											<div className="bg-green-100 p-2 rounded-full text-[#005831]"><Package size={18} /></div>
											<span className="font-semibold text-slate-700">Peças</span>
										</Link>
										<Link href="/produtos/servicos" onClick={handleMobileLinkClick} className="flex items-center gap-3 p-3 bg-white rounded-lg border border-slate-100 shadow-sm active:scale-95 transition-transform">
											<div className="bg-green-100 p-2 rounded-full text-[#005831]"><Wrench size={18} /></div>
											<span className="font-semibold text-slate-700">Serviços</span>
										</Link>
										<Link href="/produtos/pneus" onClick={handleMobileLinkClick} className="flex items-center gap-3 p-3 bg-white rounded-lg border border-slate-100 shadow-sm active:scale-95 transition-transform">
											<div className="bg-green-100 p-2 rounded-full text-[#005831]"><Disc size={18} /></div>
											<span className="font-semibold text-slate-700">Pneus</span>
										</Link>
									</div>
								)}
							</div>

							<Link
								href="/sobre"
								className={`p-4 rounded-xl font-bold flex items-center justify-between border border-transparent ${pathname === '/sobre' ? 'bg-green-50 text-[#005831] border-green-100' : 'text-slate-700 hover:bg-slate-50'}`}
								onClick={handleMobileLinkClick}
							>
								Sobre a Empresa
							</Link>

							<Link
								href="/trabalhe-conosco"
								className={`p-4 rounded-xl font-bold flex items-center justify-between border border-transparent ${pathname === '/trabalhe-conosco' ? 'bg-green-50 text-[#005831] border-green-100' : 'text-slate-700 hover:bg-slate-50'}`}
								onClick={handleMobileLinkClick}
							>
								Trabalhe Conosco
							</Link>

							{/* DROPDOWN MOBILE: UNIDADES (CORRIGIDO: AGORA SÃO LINKS) */}
							<div className="border border-transparent rounded-xl overflow-hidden">
								<button
									onClick={() => toggleSubmenu('unidades')}
									className={`w-full p-4 font-bold flex items-center justify-between text-slate-700 hover:bg-slate-50 transition-colors ${expandedMenu === 'unidades' ? 'bg-slate-50' : ''}`}
								>
									Unidades
									<ChevronDown size={20} className={`transition-transform duration-300 ${expandedMenu === 'unidades' ? 'rotate-180 text-[#005831]' : 'text-slate-400'}`} />
								</button>

								{expandedMenu === 'unidades' && (
									<div className="bg-slate-50 px-4 pb-4 animate-in slide-in-from-top-2">
										<div className="grid grid-cols-2 gap-2">
											<Link
												href="/unidades/go"
												onClick={handleMobileLinkClick}
												className="bg-white p-3 rounded-lg border border-slate-200 text-center active:scale-95 transition-transform hover:border-green-500"
											>
												<span className="block text-[#005831] font-bold text-sm mb-1">Goiânia</span>
												<span className="text-[10px] uppercase bg-green-100 text-green-800 px-2 py-0.5 rounded-full font-bold">Matriz</span>
											</Link>

											<Link
												href="/unidades/df"
												onClick={handleMobileLinkClick}
												className="bg-white p-3 rounded-lg border border-slate-200 text-center flex items-center justify-center active:scale-95 transition-transform hover:border-green-500"
											>
												<span className="block text-slate-600 font-bold text-sm">Brasília</span>
											</Link>

											<Link
												href="/unidades/to"
												onClick={handleMobileLinkClick}
												className="bg-white p-3 rounded-lg border border-slate-200 text-center flex items-center justify-center active:scale-95 transition-transform hover:border-green-500"
											>
												<span className="block text-slate-600 font-bold text-sm">Palmas</span>
											</Link>

											<Link
												href="/unidades/ba"
												onClick={handleMobileLinkClick}
												className="bg-white p-3 rounded-lg border border-slate-200 text-center flex items-center justify-center active:scale-95 transition-transform hover:border-green-500"
											>
												<span className="block text-slate-600 font-bold text-sm">LEM - BA</span>
											</Link>

											<Link
												href="/unidades/pe"
												onClick={handleMobileLinkClick}
												className="bg-white p-3 rounded-lg border border-slate-200 text-center flex items-center justify-center col-span-2 active:scale-95 transition-transform hover:border-green-500"
											>
												<span className="block text-slate-600 font-bold text-sm">Recife - PE</span>
											</Link>
										</div>
									</div>
								)}
							</div>

							<div className="h-px bg-slate-100 my-4"></div>

							{/* Botão CTA Mobile */}
							<Link
								href="https://wa.me/5562991834188"
								target="_blank"
								className="w-full bg-[#005831] hover:bg-[#004626] text-white p-4 rounded-xl font-bold transition-all shadow-md flex items-center justify-center gap-3 text-lg"
							>
								<Phone size={20} />
								Fale Conosco
							</Link>

						</div>
					</div>
				)}
			</nav>
		</div>
	);
}