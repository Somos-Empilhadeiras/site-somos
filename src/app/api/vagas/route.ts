import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase'; // Ajuste o caminho se necessário

export const dynamic = 'force-dynamic';

// --- GET: Buscar todas as vagas ---
export async function GET() {
  try {
    const { data, error } = await supabase
      .from('job_vacancies')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    // Mapeamento Snake_case (Banco) -> CamelCase (Front)
    const formatted = data?.map(job => ({
      id: job.id,
      title: job.title,
      vacancyType: job.vacancy_type,
      workSchedule: job.work_schedule,
      location: job.location,
      remuneration: job.remuneration,
      requirements: job.requirements || [],
      activities: job.activities || [],
      benefits: job.benefits || [],
      educationLevel: job.education_level,
      isActive: job.is_active,
    }));

    return NextResponse.json(formatted);
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao buscar vagas' }, { status: 500 });
  }
}

// --- POST: Criar nova vaga ---
export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Mapeamento CamelCase (Front) -> Snake_case (Banco)
    const payload = {
      title: body.title,
      vacancy_type: body.vacancyType,
      work_schedule: body.workSchedule,
      location: body.location,
      remuneration: body.remuneration,
      requirements: body.requirements,
      activities: body.activities,
      benefits: body.benefits,
      education_level: body.educationLevel,
      is_active: body.isActive
    };

    const { error } = await supabase.from('job_vacancies').insert([payload]);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Erro ao criar vaga' }, { status: 500 });
  }
}

// --- PUT: Atualizar vaga ---
export async function PUT(req: Request) {
  try {
    const body = await req.json();
    if (!body.id) return NextResponse.json({ error: 'ID necessário' }, { status: 400 });

    const payload = {
      title: body.title,
      vacancy_type: body.vacancyType,
      work_schedule: body.workSchedule,
      location: body.location,
      remuneration: body.remuneration,
      requirements: body.requirements,
      activities: body.activities,
      benefits: body.benefits,
      education_level: body.educationLevel,
      is_active: body.isActive
    };

    const { error } = await supabase
      .from('job_vacancies')
      .update(payload)
      .eq('id', body.id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao atualizar' }, { status: 500 });
  }
}

// --- DELETE: Excluir vaga ---
export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) return NextResponse.json({ error: 'ID obrigatório' }, { status: 400 });

    const { error } = await supabase.from('job_vacancies').delete().eq('id', id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao excluir' }, { status: 500 });
  }
}