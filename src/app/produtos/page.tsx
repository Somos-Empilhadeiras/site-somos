'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
    ArrowRight, 
    Package,       // Ícone para Peças
    Wrench,        // Ícone para Serviços
    Disc,          // Ícone para Pneus
    Loader2,
    ShoppingBag
} from 'lucide-react';
import ItemCard from '@/components/ItemCard'; // Reaproveitando seu card existente
import DynamicBanner from '@/components/DynamicBanner';
import { Empilhadeira } from '@/types'; // Ou a interface unificada que criamos

// --- COMPONENTE AUXILIAR DA LINHA (Para não repetir código) ---
interface CategoryRowProps {
    title: string;
    subtitle: string;
    type: 'PART' | 'SERVICE' | 'TIRE';
    linkHref: string;
    icon: any;
}

const CategoryRow = ({ title, subtitle, type, linkHref, icon: Icon }: CategoryRowProps) => {
    const [items, setItems] = useState<Empilhadeira[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchItems = async () => {
            try {
                // Busca apenas 4 itens do tipo específico
                const res = await fetch(`/api/products?type=${type}&limit=4`);
                const data = await res.json();
                if (Array.isArray(data)) setItems(data);
            } catch (error) {
                console.error(`Erro ao buscar ${type}:`, error);
            } finally {
                setLoading(false);
            }
        };
        fetchItems();
    }, [type]);

    // Se não tiver itens e não estiver carregando, não mostra a seção (opcional)
    if (!loading && items.length === 0) return null;

    return (
        <section className="py-12 border-b border-slate-100 last:border-0">
            <div className="container mx-auto px-4">
                {/* CABEÇALHO DA LINHA */}
                <div className="flex items-end justify-between mb-8">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <div className="p-2 bg-green-100 text-[#005831] rounded-lg">
                                <Icon size={20} />
                            </div>
                            <h2 className="text-2xl font-bold text-slate-800">{title}</h2>
                        </div>
                        <p className="text-slate-500 text-sm">{subtitle}</p>
                    </div>

                    <Link 
                        href={linkHref}
                        className="group flex items-center gap-1 text-[#005831] font-bold hover:text-green-700 transition-colors text-sm"
                    >
                        Ver todos
                        <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>

                {/* GRID DE PRODUTOS */}
                {loading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {/* Skeletons de carregamento */}
                        {[1, 2, 3, 4].map(i => (
                            <div key={i} className="h-[320px] bg-slate-100 rounded-2xl animate-pulse"></div>
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {items.map((item) => (
                            <ItemCard 
                                key={item.id} 
                                empilhadeira={item} 
                                onOpenModal={() => {}} // Se quiser modal na home, passe o state aqui
                                onWhatsApp={(i) => {
                                    // Função simples de whats caso não queira passar a complexa do pai
                                    window.open(`https://wa.me/5562991834188?text=Ol%C3%A1%2C+vi+o+item+${i.name}+no+site.`, '_blank');
                                }} 
                            />
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
};

// --- PÁGINA PRINCIPAL DE PRODUTOS ---
export default function ProductsPage() {
    return (
        <main className="min-h-screen bg-slate-50">
            <DynamicBanner id="produtos-hero" />

            {/* HEADER DA PÁGINA */}
            <div className="bg-[#005831] py-16 text-center text-white relative overflow-hidden">
                <div className="relative z-10 container mx-auto px-4">
                    <h1 className="text-4xl font-extrabold mb-4">Nossos Produtos e Serviços</h1>
                    <p className="text-green-100 text-lg max-w-2xl mx-auto">
                        Tudo o que sua operação logística precisa em um só lugar. De peças de reposição a manutenção especializada.
                    </p>
                </div>
                {/* Efeito de fundo */}
                <ShoppingBag className="absolute -bottom-10 -right-10 text-white opacity-5 w-64 h-64 rotate-12" />
            </div>

            {/* 1. LINHA DE PEÇAS */}
            <CategoryRow 
                title="Peças & Componentes"
                subtitle="Itens de reposição originais e genéricos de alta qualidade."
                type="PART"
                linkHref="/produtos/pecas"
                icon={Package}
            />

            {/* 2. LINHA DE SERVIÇOS */}
            <CategoryRow 
                title="Serviços Especializados"
                subtitle="Manutenção preventiva, corretiva e reformas."
                type="SERVICE"
                linkHref="/produtos/servicos"
                icon={Wrench}
            />

            {/* 3. LINHA DE PNEUS */}
            <CategoryRow 
                title="Pneus Industriais"
                subtitle="Pneumáticos, superelásticos e maciços para todo terreno."
                type="TIRE"
                linkHref="/produtos/pneus"
                icon={Disc}
            />

            <DynamicBanner id="produtos-rodape" />
        </main>
    );
}   