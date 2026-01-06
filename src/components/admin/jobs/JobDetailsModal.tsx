'use client';

import { useEffect } from 'react';
import {
    X,
    MapPin,
    Clock,
    Briefcase,
    Banknote,
    Send,
    CheckCircle2,
    Building2,
    Gift // Adicionado ícone para Benefícios
} from 'lucide-react';
import { COMPANY_CONTACTS } from '@/lib/constants';

interface JobVacancy {
    id: string;
    title: string;
    vacancyType: string;
    workSchedule: string;
    location: string;
    remuneration: string;
    requirements: string[];
    activities: string[];
    benefits: string[];
}

interface Props {
    job: JobVacancy;
    onClose: () => void;
}

export default function JobDetailsModal({ job, onClose }: Props) {

    // Bloqueia o scroll do fundo
    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, []);

    const whatsappLink = `https://wa.me/${COMPANY_CONTACTS.rh_phone_raw}?text=${encodeURIComponent(
        `Olá! Vi a vaga de *${job.title}* no site e gostaria de me candidatar.`
    )}`;

    return (
        <div className="fixed inset-0 z-[9999] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">

            {/* CONTAINER MODAL */}
            <div className="bg-white w-full max-w-2xl max-h-[90vh] flex flex-col rounded-xl shadow-2xl animate-in fade-in zoom-in duration-200">

                {/* --- HEADER --- */}
                <div className="shrink-0 p-6 border-b border-slate-100 flex justify-between items-start bg-slate-50/50 rounded-t-xl">
                    <div className="pr-8">
                        <h2 className="text-2xl font-bold text-slate-900 leading-tight">{job.title}</h2>

                        <div className="mt-3 flex flex-wrap gap-2">
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100">
                                <MapPin size={12} /> {job.location}
                            </span>
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-purple-50 text-purple-700 border border-purple-100">
                                <Briefcase size={12} /> {job.vacancyType}
                            </span>
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-orange-50 text-orange-700 border border-orange-100">
                                <Clock size={12} /> {job.workSchedule}
                            </span>
                        </div>
                    </div>

                    <button
                        onClick={onClose}
                        className="p-2 rounded-full hover:bg-slate-200 text-slate-400 hover:text-slate-600 transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* --- BODY (SCROLL) --- */}
                <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">

                    <div className="space-y-6">
                        {/* Requisitos */}
                        {job.requirements?.length > 0 && (
                            <section>
                                <h3 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
                                    <CheckCircle2 size={18} className="text-[#005831]" />
                                    Requisitos
                                </h3>
                                <ul className="space-y-2 pl-1">
                                    {job.requirements.map((item, i) => (
                                        <li key={i} className="flex items-start gap-3 text-sm text-slate-600 leading-relaxed">
                                            <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-slate-300 shrink-0" />
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </section>
                        )}

                        {/* Atividades/Responsabilidades */}
                        {job.activities?.length > 0 && (
                            <section>
                                <h3 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
                                    <Building2 size={18} className="text-[#005831]" />
                                    Responsabilidades
                                </h3>
                                <ul className="space-y-2 pl-1">
                                    {job.activities.map((item, i) => (
                                        <li key={i} className="flex items-start gap-3 text-sm text-slate-600 leading-relaxed">
                                            <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-slate-300 shrink-0" />
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </section>
                        )}

                        {/* Benefícios (Agora Padronizado) */}
                        {job.benefits?.length > 0 && (
                            <section>
                                <h3 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
                                    <Gift size={18} className="text-[#005831]" />
                                    Benefícios
                                </h3>
                                <ul className="space-y-2 pl-1">
                                    {job.benefits.map((item, i) => (
                                        <li key={i} className="flex items-start gap-3 text-sm text-slate-600 leading-relaxed">
                                            <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-slate-300 shrink-0" />
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </section>
                        )}

                        {/* Remuneração */}
                        <div className="flex items-center gap-3 p-4 bg-green-50 rounded-lg border border-green-100">
                            <div className="bg-[#005831] p-2 rounded-full text-white">
                                <Banknote size={20} />
                            </div>
                            <div>
                                <p className="text-xs font-bold text-green-800 uppercase tracking-wider">Remuneração</p>
                                <p className="font-semibold text-[#005831] text-lg">
                                    {job.remuneration || 'A combinar'}
                                </p>
                            </div>
                        </div>
                    </div>

                </div>

                {/* --- FOOTER --- */}
                <div className="shrink-0 p-6 border-t border-slate-100 bg-white rounded-b-xl">
                    <a
                        href={whatsappLink}
                        target="_blank"
                        rel="noreferrer"
                        className="w-full bg-[#005831] hover:bg-[#09462a] text-white py-3.5 rounded-lg font-bold flex items-center justify-center gap-2 transition-all shadow-lg hover:shadow-xl active:scale-[0.99]"
                    >
                        <Send size={18} />
                        Candidatar-se via WhatsApp
                    </a>
                    <p className="text-center text-xs text-slate-400 mt-3">
                        Você será redirecionado para falar com nosso RH.
                    </p>
                </div>

            </div>
        </div>
    );
}