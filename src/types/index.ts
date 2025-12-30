// src/types/index.ts
export interface Empilhadeira {
  id: string;
  name: string;
  brand: string;
  model: string;
  year?: string;
  price: number;
  capacity: number;
  engine: string;
  voltage: number;
  description: string;
  image_url: string; // Note que no SQL usamos snake_case
  created_at?: Date;
}