// src/types/index.ts

export interface Empilhadeira {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string; // No banco pode vir como image_url, o front normaliza ou a API devolve camelCase
  
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
  
  // Tipo do item para controle visual
  type?: 'MACHINE' | 'PART' | 'SERVICE' | 'TIRE'; 
}

// Para manter compatibilidade, podemos dizer que Product é igual a Empilhadeira
export type Product = Empilhadeira;