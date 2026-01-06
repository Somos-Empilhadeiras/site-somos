'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { 
    LayoutDashboard, ArrowLeft, Package, Megaphone, Users, 
    ChevronRight, LogOut 
} from 'lucide-react';
import Link from 'next/link';

// Seus gerenciadores (Certifique-se que os caminhos estão corretos)
import ItemManager from '@/components/admin/items/ItemManager';
import BannerManager from '@/components/admin/banners/BannerManager';
import JobManager from '@/components/admin/jobs/JobManager';

export default function AdminPage() {
    const params = useParams();
    const router = useRouter();
    const secret = params.secret;
    const VALID_SECRET = '019abc6c-62d4-765f-83f6-cc3226df3f9a';

    const [activeTab, setActiveTab] = useState<'banners' | 'items' | 'jobs'>('banners');
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        if (secret !== VALID_SECRET) {
            router.push('/');
        }
    }, [secret, router]);

    if (secret !== VALID_SECRET) return null;

    // Configuração das Abas com Cores e Identidade
    const menuItems = [
        {
            id: 'banners',
            label: 'Marketing & Site',
            shortLabel: 'Marketing',
            description: 'Banners, Carrossel e Avisos',
            icon: Megaphone,
            colorClass: 'bg-purple-600',
            textClass: 'text-purple-600',
            bgSoft: 'bg-purple-50',
            borderClass: 'border-purple-200'
        },
        {
            id: 'items',
            label: 'Maquinários e Produtos',
            shortLabel: 'Estoque',
            description: 'Gerenciar Máquinas, Peças e Pneus',
            icon: Package,
            colorClass: 'bg-blue-600',
            textClass: 'text-blue-600',
            bgSoft: 'bg-blue-50',
            borderClass: 'border-blue-200'
        },
        {
            id: 'jobs',
            label: 'Recursos Humanos',
            shortLabel: 'RH / Vagas',
            description: 'Gerenciar Vagas e Trabalhe Conosco',
            icon: Users,
            colorClass: 'bg-orange-600',
            textClass: 'text-orange-600',
            bgSoft: 'bg-orange-50',
            borderClass: 'border-orange-200'
        }
    ];

    const activeItem = menuItems.find(i => i.id === activeTab);

    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
            {/* --- HEADER SUPERIOR PROFISSIONAL --- */}
            <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="bg-slate-900 text-white p-2 rounded-lg shadow-lg">
                            <LayoutDashboard size={20} />
                        </div>
                        <div className="leading-tight">
                            <h1 className="text-lg font-bold text-slate-800 tracking-tight">Painel Administrativo</h1>
                            <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">Somos Empilhadeiras</p>
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                        <Link 
                            href="/" 
                            className="hidden md:flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-blue-600 hover:bg-slate-50 px-3 py-2 rounded-lg transition-all"
                        >
                            <ArrowLeft size={16} />
                            Voltar ao Site
                        </Link>
                        <div className="h-8 w-px bg-slate-200 hidden md:block"></div>
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-linear-to-tr from-blue-600 to-purple-600 flex items-center justify-center text-white text-xs font-bold">
                                AD
                            </div>
                            <span className="text-sm font-medium text-slate-700 hidden sm:block">Administrador</span>
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                
                {/* --- MENSAGEM DE BOAS VINDAS --- */}
                <div className="mb-8">
                    <h2 className="text-2xl font-bold text-slate-800">Olá, bem-vindo de volta! 👋</h2>
                    <p className="text-slate-500">Selecione o departamento abaixo para começar a gerenciar.</p>
                </div>

                {/* --- NAVEGAÇÃO EM CARDS (DASHBOARD) --- */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    {menuItems.map((item) => {
                        const isActive = activeTab === item.id;
                        return (
                            <button
                                key={item.id}
                                onClick={() => setActiveTab(item.id as any)}
                                className={`
                                    relative p-6 rounded-2xl text-left transition-all duration-300 border-0 group
                                    ${isActive 
                                        ? `bg-white border-${item.textClass.split('-')[1]}-500 shadow-xl ring-4 ring-${item.textClass.split('-')[1]}-100 scale-[1.02]` 
                                        : 'bg-white border-transparent shadow-sm hover:border-slate-200 hover:shadow-md'
                                    }
                                `}
                            >
                                <div className="flex items-start justify-between mb-4">
                                    <div className={`p-3 rounded-xl ${isActive ? item.colorClass + ' text-white' : 'bg-slate-100 text-slate-500 group-hover:bg-slate-200'}`}>
                                        <item.icon size={24} />
                                    </div>
                                    {isActive && <div className={`w-3 h-3 rounded-full ${item.colorClass} animate-pulse`} />}
                                </div>
                                
                                <h3 className={`text-lg font-bold mb-1 ${isActive ? 'text-slate-900' : 'text-slate-700'}`}>
                                    {item.label}
                                </h3>
                                <p className="text-xs text-slate-500 font-medium">
                                    {item.description}
                                </p>
                            </button>
                        );
                    })}
                </div>

                {/* --- ÁREA DE CONTEÚDO (COM CONTEXTO VISUAL) --- */}
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className={`rounded-2xl bg-white shadow-sm border border-slate-200 overflow-hidden`}>
                        {/* Barra de Título da Seção Ativa */}
                        <div className={`px-6 py-4 border-b border-slate-100 flex justify-between items-center ${activeItem?.bgSoft}`}>
                            <div className="flex items-center gap-2">
                                <activeItem.icon size={18} className={activeItem?.textClass} />
                                <span className={`font-bold text-sm uppercase tracking-wide ${activeItem?.textClass}`}>
                                    Gerenciando: {activeItem?.label}
                                </span>
                            </div>
                        </div>

                        {/* O Gerenciador Real */}
                        <div className="p-6 bg-slate-50/50 min-h-[500px]">
                            {activeTab === 'items' && <ItemManager />}
                            {activeTab === 'banners' && <BannerManager />}
                            {activeTab === 'jobs' && <JobManager />}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}