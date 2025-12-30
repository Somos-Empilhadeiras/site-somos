'use client';

import { useState, useEffect } from 'react';
import {
    X, MessageCircle, Info, Search, Filter, ChevronRight,
    Zap, Weight, Settings, CheckCircle2,
    Calendar,
    Tractor
} from 'lucide-react';
import Link from 'next/link';
import DynamicBanner from '@/components/DynamicBanner';
import ItemCard from '@/components/ItemCard';
import { Product } from '@/types';
import ModalItem from '@/components/ModalItem';

export default function Catalog() {
    const [products, setProducts] = useState<Product[]>([]);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);

    // --- NOVO: Estado para a busca ---
    const [searchTerm, setSearchTerm] = useState('');



    useEffect(() => {
        async function fetchProducts() {
            try {
                const response = await fetch('/api/products');
                if (!response.ok) {
                    throw new Error('Falha ao buscar produtos');
                }
                const data = await response.json();
                setProducts(data);
            } catch (error) {
                console.error("Erro ao carregar catálogo:", error);
            } finally {
                setLoading(false);
            }
        }
        fetchProducts();
    }, []);

    // --- LÓGICA DE FILTRAGEM ---
    // Filtra os produtos sempre que o searchTerm ou a lista de produtos mudar
    const filteredProducts = products.filter(product => {
        const term = searchTerm.toLowerCase();
        return (
            product.name.toLowerCase().includes(term) ||
            product.brand.toLowerCase().includes(term) ||
            product.model.toLowerCase().includes(term)
        );
    });

    const handleWhatsAppRedirect = (p: Product) => {
        const phoneNumber = "5562991834188";

        // Lógica para formatar o preço ou mostrar "Sob Consulta"
        const priceFormatted = p.price > 0
            ? p.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
            : "Sob Consulta";

        const productYear = p.year || "N/A";

        // Definição de Emojis para ficar visualmente organizado
        const emojiTruck = '\uD83D\uDE9C';   // 🚜 (Trator/Máquina fica melhor que caixa)
        const emojiCalendar = '\uD83D\uDCC5'; // 📅
        const emojiGear = '\u2699';          // ⚙️ (Para Motor)
        const emojiWeight = '\u2696';        // ⚖️ (Para Capacidade)
        const emojiBolt = '\u26A1';          // ⚡ (Para Voltagem)

        const productLink = `${window.location.origin}/catalogo/${p._id}`;

        // Construção da mensagem linha a linha
        let message = `*SOLICITAÇÃO DE ORÇAMENTO*\n\n`;
        message += `${emojiTruck} *Modelo:* ${p.brand} ${p.model}\n`;
        message += `${emojiCalendar} *Ano:* ${productYear}\n`;
        // Adiciona Motor e Capacidade se existirem
        if (p.engine) message += `${emojiGear} *Motor:* ${p.engine}\n`;
        if (p.capacity) message += `${emojiWeight} *Capacidade:* ${p.capacity}\n`;

        // Adiciona Voltagem apenas se tiver (para não ficar vazio em máquinas a combustão)
        if (p.voltage) {
            message += `${emojiBolt} *Voltagem:* ${p.voltage}\n`;
        }

        message += `\nOlá, tenho interesse neste item:\n${productLink}`;

        const url = `https://api.whatsapp.com/send?phone=${phoneNumber}&text=${encodeURIComponent(message)}`;

        window.open(url, '_blank');
    };

    return (
        <main className="min-h-screen bg-slate-50 flex flex-col">

            {/* BANNER ID NUMERO UM */}
            <DynamicBanner id="catalogo-topo" className="sticky top-[5.2rem] z-60" />

            {/* 1. HERO SECTION DO CATÁLOGO */}
            <div className="bg-[#005831] text-white py-16 lg:py-20 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-96 h-96 bg-white opacity-5 rounded-full blur-3xl -mr-20 -mt-20"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-yellow-400 opacity-10 rounded-full blur-3xl -ml-10 -mb-10"></div>

                <div className="container mx-auto px-4 relative z-10">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                        <div className="max-w-2xl">
                            <div className="flex items-center gap-2 mb-4">
                                <span className="px-3 py-1 bg-yellow-400 text-[#005831] text-xs font-bold rounded-full uppercase tracking-wider">Estoque Atualizado</span>
                            </div>
                            <h1 className="text-4xl md:text-5xl font-extrabold mb-4 leading-tight">
                                Encontre a Máquina Ideal para sua Operação
                            </h1>
                            <p className="text-slate-200 text-lg mb-8">
                                Explore nossa frota de empilhadeiras novas e seminovas. Equipamentos revisados, com garantia e prontos para entrega imediata.
                            </p>

                            {/* BARRA DE PESQUISA FUNCIONAL */}
                            <div className="flex flex-col sm:flex-row gap-4 bg-white/10 p-2 rounded-xl backdrop-blur-md border border-white/20 max-w-lg">
                                <div className="flex-1 relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
                                    <input
                                        type="text"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        placeholder="Buscar por modelo ou marca..."
                                        className="w-full bg-transparent border-none outline-none text-white placeholder-slate-300 pl-10 py-3"
                                    />
                                </div>
                                <button className="bg-yellow-400 hover:bg-yellow-300 text-[#005831] font-bold px-6 py-3 rounded-lg transition-colors flex items-center justify-center gap-2">
                                    <Filter size={18} />
                                    <span>{filteredProducts.length} Itens</span>
                                </button>
                            </div>
                        </div>

                        {/* Estatísticas Rápidas */}
                        <div className="hidden lg:flex gap-6">
                            <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/10 text-center">
                                <p className="text-3xl font-black text-yellow-400">+{products.length}</p>
                                <p className="text-sm text-slate-300">Máquinas Disponíveis</p>
                            </div>
                            <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/10 text-center">
                                <p className="text-3xl font-black text-yellow-400">24h</p>
                                <p className="text-sm text-slate-300">Atendimento Rápido</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* BANNER ID NUMERO DOIS */}
            <DynamicBanner id="catalogo-sessao-hero" className="z-40" />

            {/* 2. GRADE DE PRODUTOS */}
            <div className="flex-1 container mx-auto py-16 px-4">

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20 space-y-4 text-slate-400">
                        <div className="w-12 h-12 border-4 border-slate-200 border-t-[#005831] rounded-full animate-spin"></div>
                        <p>Carregando catálogo...</p>
                    </div>
                ) : (
                    <>
                        {/* Mensagem se a busca não retornar nada */}
                        {filteredProducts.length === 0 ? (
                            <div className="text-center py-20">
                                <div className="inline-block p-6 rounded-full bg-slate-100 mb-4">
                                    <Search size={48} className="text-slate-300" />
                                </div>
                                <h3 className="text-xl font-bold text-slate-700">Nenhum equipamento encontrado</h3>
                                <p className="text-slate-500 mt-2">Tente buscar por outro termo ou marca.</p>
                                <button
                                    onClick={() => setSearchTerm('')}
                                    className="mt-6 text-[#005831] font-bold hover:underline"
                                >
                                    Limpar busca e ver tudo
                                </button>
                            </div>
                        ) : (

                            <div className="flex flex-col gap-4 text-green-800 font-extrabold md:text-3xl">
                                <h1>EMPILHADEIRAS ELÉTRICAS</h1>
                                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                                    {/* Loop usando filteredProducts em vez de products */}
                                    {filteredProducts.map((p) => (
                                        <ItemCard
                                            key={p._id}
                                            product={p}
                                            onOpenModal={setSelectedProduct}
                                            onWhatsApp={handleWhatsAppRedirect}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}
                    </>
                )}

                {/* MODAL DE DETALHES */}
                {selectedProduct && (
                    <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4 z-100 animate-in fade-in duration-300">
                        {/* Chama o componente ModalItem aqui dentro */}
                        <ModalItem
                            product={selectedProduct}
                            onClose={() => setSelectedProduct(null)}
                            onWhatsApp={handleWhatsAppRedirect}
                        />
                    </div>
                )}
            </div>

            {/* BANNER ID NUMERO TRES */}
            <DynamicBanner id="catalogo-itens" className="z-40" />

        </main>
    );
}