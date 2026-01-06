'use client';

import { useEffect, useState } from 'react';
import {
  MapPin,
  Clock,
  Briefcase,
  Banknote,
  Send,
} from 'lucide-react';

import { COMPANY_CONTACTS } from '@/lib/constants';
import JobDetailsModal from '@/components/admin/jobs/JobDetailsModal';

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
  isActive: boolean;
}

export default function TrabalheConoscoPage() {
  const [jobs, setJobs] = useState<JobVacancy[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState<JobVacancy | null>(null);

  useEffect(() => {
    async function fetchJobs() {
      try {
        const res = await fetch(`/api/vagas?t=${Date.now()}`);
        const data = await res.json();
        if (Array.isArray(data)) {
          setJobs(data.filter((job: JobVacancy) => job.isActive));
        }
      } catch (error) {
        console.error('Erro ao carregar vagas', error);
      } finally {
        setLoading(false);
      }
    }

    fetchJobs();
  }, []);

  const getWhatsAppLink = (jobTitle: string) => {
    const text = `Olá! Vi a vaga de *${jobTitle}* no site e gostaria de me candidatar.`;
    return `https://wa.me/${COMPANY_CONTACTS.rh_phone_raw}?text=${encodeURIComponent(text)}`;
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">

      {/* HERO / APRESENTAÇÃO */}
      <section className="bg-linear-to-r from-[#005831] to-[#0a7a47] text-white">
        <div className="max-w-6xl mx-auto px-6 py-20 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-4xl font-bold leading-tight">
              Trabalhe Conosco
            </h1>
            <p className="mt-6 text-lg text-white/90">
              Estamos sempre em busca de profissionais comprometidos,
              que desejam crescer junto com a empresa.
              Confira nossas vagas abertas e faça parte do nosso time.
            </p>
            <p className="mt-4 text-white/80">
              Ambiente profissional, oportunidades reais de crescimento
              e valorização das pessoas.
            </p>
          </div>

          <div className="hidden md:flex justify-center">
            <div className="bg-white/10 backdrop-blur rounded-2xl p-8 text-center shadow-lg">
              <Briefcase size={48} className="mx-auto mb-4" />
              <p className="text-lg font-semibold">
                Vagas atualizadas frequentemente
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* LISTA DE VAGAS */}
      <section className="max-w-6xl mx-auto px-6 py-16">

        {loading && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-48 bg-white rounded-xl shadow animate-pulse" />
            ))}
          </div>
        )}

        {!loading && jobs.length === 0 && (
          <div className="bg-white rounded-xl shadow p-10 text-center">
            <Briefcase size={48} className="mx-auto text-slate-300 mb-4" />
            <h3 className="text-xl font-bold">Nenhuma vaga aberta no momento</h3>
            <p className="text-slate-500 mt-2">
              Você pode enviar seu currículo para nosso banco de talentos.
            </p>
            <a
              href={`mailto:${COMPANY_CONTACTS.rh_email}`}
              className="inline-block mt-6 bg-[#005831] text-white px-6 py-3 rounded-lg font-bold"
            >
              Enviar currículo por e-mail
            </a>
          </div>
        )}

        {!loading && jobs.length > 0 && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {jobs.map(job => (
              <div
                key={job.id}
                className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition flex flex-col"
              >
                <div className="p-6 flex-1">
                  <h2 className="text-lg font-bold mb-3">
                    {job.title}
                  </h2>

                  <div className="space-y-2 text-sm text-slate-600">
                    <div className="flex items-center gap-2">
                      <MapPin size={14} />
                      {job.location}
                    </div>
                    <div className="flex items-center gap-2">
                      <Briefcase size={14} />
                      {job.vacancyType}
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock size={14} />
                      {job.workSchedule}
                    </div>
                    <div className="flex items-center gap-2 font-semibold text-[#005831]">
                      <Banknote size={14} />
                      {job.remuneration || 'A combinar'}
                    </div>
                  </div>
                </div>

                <div className="p-6 pt-0 space-y-3">
                  <a
                    href={getWhatsAppLink(job.title)}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full bg-[#25D366] hover:bg-[#1da851] text-white py-2 rounded-lg font-bold flex items-center justify-center gap-2"
                  >
                    <Send size={16} />
                    Candidatar-se
                  </a>

                  <button
                    onClick={() => setSelectedJob(job)}
                    className="w-full text-sm font-semibold text-slate-600 hover:text-slate-800"
                  >
                    Ver detalhes da vaga
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* MODAL */}
      {selectedJob && (
        <JobDetailsModal
          job={selectedJob}
          onClose={() => setSelectedJob(null)}
        />
      )}
    </div>
  );
}
