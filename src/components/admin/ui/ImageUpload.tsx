'use client';
import { Image as ImageIcon } from 'lucide-react';
import { supabase } from '@/lib/supabase'; 

interface ImageUploadProps {
  currentImageUrl?: string;
  onUpload: (url: string) => void;
  label?: string;
}

export default function ImageUpload({ currentImageUrl, onUpload, label = "Foto do Item" }: ImageUploadProps) {
  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const BUCKET_NAME = 'files-site-somos';
    const fileExt = file.name.split('.').pop();
    const fileName = `upload-${Date.now()}.${fileExt}`;

    try {
      const { error } = await supabase.storage.from(BUCKET_NAME).upload(fileName, file);
      if (error) throw error;
      const { data } = supabase.storage.from(BUCKET_NAME).getPublicUrl(fileName);
      onUpload(data.publicUrl);
    } catch (err) {
      console.error(err);
      alert('Erro no upload. Verifique bucket do Supabase.');
    }
  };

  return (
    <div className="border-2 border-dashed border-slate-300 rounded-lg h-32 flex flex-col items-center justify-center relative bg-slate-50 hover:bg-blue-50 transition-colors group cursor-pointer overflow-hidden">
      <input type="file" onChange={handleUpload} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
      {currentImageUrl ? (
        <img src={currentImageUrl} alt="Preview" className="h-full w-full object-contain p-2" />
      ) : (
        <>
          <ImageIcon className="text-slate-400 mb-1 group-hover:text-blue-500" size={24} />
          <span className="text-xs text-slate-400 group-hover:text-blue-600">{label}</span>
        </>
      )}
    </div>
  );
}