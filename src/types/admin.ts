// src/types/admin.ts

export interface CarouselItem {
  title: string;
  description: string;
  imageUrl: string;
  link: string;
  buttonText?: string;
  secondaryButtonText?: string;
  secondaryButtonLink?: string;
  secondaryButtonTransparent?: boolean;
}

export interface BannerConfig {
  id?: string;
  ids: string[];
  name: string;
  isActive: boolean;
  
  // O layout precisa incluir 'product_grid'
  layout: 'full' | 'compact' | 'alert' | 'carousel' | 'product_grid';
  
  title: string;
  description: string;
  imageUrl: string;
  ctaText: string;
  ctaLink: string;
  carouselItems: CarouselItem[];
  
  // ESTE CAMPO É OBRIGATÓRIO PARA A VITRINE FUNCIONAR
  productIds?: string[]; 

  bgColor: string;
  textColor: string;
  btnColor: string;
  btnTextColor: string;
  imagePosition: 'left' | 'right';
  textSize?: 'small' | 'medium' | 'large';
  slideDuration?: number;
  
  titleColor?: string;
  descColor?: string;
  secBtnColor?: string;
  secBtnTextColor?: string;
  
  height?: string;
  contentAlign?: 'left' | 'center' | 'right';
}

export interface AdminItem {
  id?: string;
  name: string;
  description: string;
  image_url: string;
  
  // Financeiro/Estoque
  price: number;
  quantity?: number;
  
  // Classificação
  type?: 'MACHINE' | 'PART' | 'TIRE' | 'SERVICE';
  category?: string;

  // Máquinas (Geral)
  brand?: string;
  model?: string;
  year?: string | number;
  capacity?: string;
  engine?: string;
  
  // Máquinas (Elétricas/Detalhes)
  voltage?: number;
  lift_height?: string;
  chargerType?: string;
  batteryDetails?: string;
  technicalSheetUrl?: string;
  
  // --- ADICIONE ESTA LINHA ABAIXO ---
  loadCenter?: number; 

  // Peças/Pneus
  manufacturer?: string;
  application?: string;

  // Serviços
  serviceType?: string;
}

export interface JobVacancy {
  id?: string;
  title: string;
  vacancyType: string;
  workSchedule: string;
  location: string;
  remuneration: string;
  requirements: string[];
  activities: string[];
  benefits: string[];
  imageUrl?: string;
  educationLevel: string;
  observations?: string;
  isActive: boolean;
}

export const SLOT_GROUPS = {
  'Página Inicial': [
      { value: 'home-topo', label: 'Topo (Aviso)' },
      { value: 'home-slides', label: 'Sessão Principal Inicio' },
      { value: 'home-sessao-carrossel', label: 'Banner Principal' },
      { value: 'home-sessao-heli', label: 'Sessão Heli' },
      { value: 'home-sessao-pilares', label: 'Sessão Pilares' },
      { value: 'home-sessao-frotas', label: 'Sessão Frota' },
      { value: 'home-sessao-locacao', label: 'Sessão Locação' },
      { value: 'home-sessao-mapa', label: 'Sessão Mapa' },
      { value: 'home-sessao-contato', label: 'Sessão Contato' },
  ],
  'Catálogo': [
      { value: 'catalogo-topo', label: 'Topo (Aviso)' },
      { value: 'catalogo-sessao-hero', label: 'Banner Hero' },
      { value: 'catalogo-itens', label: 'Entre Itens' },
  ],
  'Institucional': [
      { value: 'sobre-topo', label: 'Sobre - Topo' },
      { value: 'promocional-1', label: 'Campanha Promo 1' },
  ],
  'Páginas de Produtos': [
      { value: 'pecas-topo', label: 'Peças - Topo' },
      { value: 'pecas-rodape', label: 'Peças - Rodapé' },
      { value: 'pneus-topo', label: 'Pneus - Topo' },
      { value: 'pneus-rodape', label: 'Pneus - Rodapé' },
      { value: 'servicos-topo', label: 'Serviços - Topo' },
      { value: 'servicos-rodape', label: 'Serviços - Rodapé' },
  ]
};  