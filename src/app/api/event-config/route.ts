import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import mongoose from 'mongoose';

const ConfigSchema = new mongoose.Schema({
  key: { type: String, required: true, unique: true }, 
  value: { type: Object, required: true } 
});

const Config = mongoose.models.Config || mongoose.model('Config', ConfigSchema);

export async function GET(req: Request) {
  await connectToDatabase();
  const { searchParams } = new URL(req.url);
  
  // Pega o ID da URL (ex: ?id=1)
  const id = searchParams.get('id') || '1'; 
  const dbKey = `banner_slot_${id}`;

  const config = await Config.findOne({ key: dbKey });
  return NextResponse.json(config ? config.value : {});
}

export async function POST(req: Request) {
  await connectToDatabase();
  const body = await req.json();

  // O corpo da requisição DEVE vir com o ID do slot
  const { slotId, ...data } = body;
  
  if (!slotId) return NextResponse.json({ error: 'Slot ID required' }, { status: 400 });

  const dbKey = `banner_slot_${slotId}`;

  const config = await Config.findOneAndUpdate(
    { key: dbKey },
    { value: data },
    { upsert: true, new: true }
  );
  
  return NextResponse.json(config);
}