// src/types/index.ts

export interface Empilhadeira {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;

  // Campos específicos de Máquinas (Empilhadeiras)
  brand?: string;
  model?: string;
  year?: string;

  // Especificações Técnicas (Baseado nas imagens)
  capacity?: number;       // Carga (kg) - ex: 3000
  loadCenter?: number;     // Centro de Carga (mm) - ex: 500
  lift_height?: string;     // Elevação dos Garfos - ex: "Até 7000mm" ou "6 metros"

  // Motorização / Energia
  engine?: string;         // Tipo: "Elétrica", "Combustão", "GLP"
  voltage?: number;        // Tensão (V) - ex: 48, 80
  batteryDetails?: string; // Detalhes Bateria - ex: "80V/230-280Ah"
  chargerType?: string;    // Carregador - ex: "Embutido 220V" ou "Externo"

  // Arquivos
  technicalSheetUrl?: string; // Link para PDF da Ficha Técnica

  // Campos específicos de Peças/Produtos
  manufacturer?: string;
  quantity?: number;

  type?: 'MACHINE' | 'PART' | 'SERVICE' | 'TIRE';
}

export type Product = Empilhadeira;

export interface JobVacancy {
  id: string;
  title: string;
  vacancyType: string;   // No banco: vacancy_type
  workSchedule: string;  // No banco: work_schedule
  location: string;
  remuneration: string;
  requirements: string[]; // Array de strings simples
  activities: string[];
  benefits: string[];
  imageUrl?: string;
  educationLevel: string; // No banco: education_level
  observations?: string;
  isActive: boolean;      // No banco: is_active
}