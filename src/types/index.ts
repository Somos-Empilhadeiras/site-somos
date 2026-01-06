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
  capacity?: number; // Kg
  engine?: string;
  voltage?: number;

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