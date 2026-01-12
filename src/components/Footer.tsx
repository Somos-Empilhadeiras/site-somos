import Link from 'next/link';
import Image from 'next/image';
import { Facebook, Instagram, Linkedin } from 'lucide-react';

export default function Footer() {
	return (
		<footer className="bg-[#e9e8e8] text-slate-700 pt-16 pb-8 px-4">
			<div className="container mx-auto">

				{/* BLOCO PRINCIPAL */}
				<div className="grid grid-cols-1 lg:grid-cols-[2fr_3fr] gap-12">

					{/* COLUNA LOGO + REDES */}
					<div className="flex flex-col items-center lg:items-start text-center lg:text-left gap-6">
						<Link href="/" className="flex items-center gap-4 select-none">
							<Image
								src="/logo.png"
								alt="Logo Somos"
								width={180}
								height={60}
								className="w-40 lg:w-48 h-auto"
							/>
							<Image
								src="/heli.png"
								alt="Logo Heli"
								width={140}
								height={60}
								className="w-32 lg:w-40 h-auto"
							/>
						</Link>

						<h3 className="text-lg font-semibold">
							Siga as nossas redes sociais
						</h3>

						<div className="flex gap-4">
							{[Instagram, Facebook, Linkedin].map((Icon, i) => (
								<a
									key={i}
									href={Icon === Instagram ? "https://www.instagram.com/somosempilhadeiras/" : (Icon === Facebook ? "https://www.facebook.com/p/Somos-Empilhadeiras-61554723444765/" : "https://br.linkedin.com/company/somosempilhadeiras")}
									target='_blank'
									className="bg-white/40 hover:bg-white p-3 rounded-full transition hover:-translate-y-1"
								>
									<Icon size={22} />
								</a>
							))}
						</div>
					</div>

					{/* COLUNAS DE LINKS */}
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">

						{/* GERAL */}
						<div>
							<p className="font-semibold mb-3">Geral</p>
							<ul className="space-y-2">
								<li><Link href="/">Início</Link></li>
								<li><Link href="/sobre">Sobre nós</Link></li>
								<li><Link href="/empilhadeiras">Empilhadeiras</Link></li>
								<li><Link href="/produtos">Produtos</Link></li>
								<li><Link href="/unidades">Unidades</Link></li>
							</ul>
						</div>

						{/* EMPILHADEIRAS */}
						<div>
							<p className="font-semibold mb-3">Empilhadeiras</p>
							<ul className="space-y-2">
								<li><Link href="/empilhadeiras">Todas</Link></li>
								<li><Link href="/empilhadeiras/eletricas">Elétricas</Link></li>
								<li><Link href="/empilhadeiras/combustao">Combustão</Link></li>
							</ul>
						</div>

						{/* PRODUTOS */}
						<div>
							<p className="font-semibold mb-3">Produtos</p>
							<ul className="space-y-2">
								<li><Link href="/produtos">Todos os Produtos</Link></li>
							</ul>
						</div>

						{/* OUTROS */}
						<div>
							<p className="font-semibold mb-3">Outros</p>
							<ul className="space-y-2">
								<li><Link href="/#contato">Fale conosco</Link></li>
								<li><Link href="/#unidades">Nossas Unidades</Link></li>
								<li>
									<Link href="https://apps.somosempilhadeiras.com">
										Área do Colaborador
									</Link>
								</li>
							</ul>
						</div>

					</div>
				</div>

				{/* RODAPÉ FINAL */}
				<div className="mt-12 pt-6 border-t border-gray-700/30 text-center">
					<p className="text-sm">
						© 2025 Somos Empilhadeiras
					</p>
				</div>

			</div>
		</footer>
	);
}
