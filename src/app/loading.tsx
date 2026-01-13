// app/loading.tsx
import Image from "next/image";
// import logoImg from "";

export default function Loading() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-4 animate-pulse">
        {/* Imagem da Empresa */}
        <div className="relative w-32 h-32">
           <Image
             src={"/folha.png"}
             alt="Carregando..."
             fill
             className="object-contain"
             priority // Importante para carregar a logo instantaneamente
           />
        </div>
        
        {/* Opcional: Texto ou Spinner */}
        <p className="text-green-600 text-xl font-bold ">Carregando...</p>
      </div>
    </div>
  );
}