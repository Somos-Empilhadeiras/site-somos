export interface CarouselItem {
  title: string;
  description: string;
  imageUrl: string;
  link: string;
  buttonText?: string;
  secondaryButtonText?: string;
  secondaryButtonLink?: string;
  secondaryButtonTransparent?: boolean; // Se true, o botão é outline/transparente
}

export interface BannerConfig {
  id?: string;
  ids: string[];
  name: string;
  isActive: boolean;
  layout: 'full' | 'compact' | 'alert' | 'carousel';
  title: string;
  description: string;
  imageUrl: string;
  ctaText: string;
  ctaLink: string;
  carouselItems: CarouselItem[];
  bgColor: string;
  textColor: string;
  btnColor: string;
  btnTextColor: string;
  imagePosition: 'left' | 'right';
  textSize?: 'small' | 'medium' | 'large'; // Tamanho do texto
  slideDuration?: number; // Tempo em segundos (ex: 5, 8, 10)
  
  // Cores específicas
  titleColor?: string;
  descColor?: string;
  
  // Botão Secundário (Global ou padrão)
  secBtnColor?: string;
  secBtnTextColor?: string;
  
  // Mantemos height e contentAlign do passo anterior
  height?: string;
  contentAlign?: 'left' | 'center' | 'right';
}

export interface AdminItem {
  id?: string;
  name: string;
  price: number;
  description: string;
  image_url: string;
  quantity?: number;
  type?: 'MACHINE' | 'PART' | 'TIRE' | 'SERVICE';

  // Campos de Máquinas (Antigos + Novos)
  brand?: string;
  model?: string;
  year?: number;
  capacity?: number;
  engine?: string;
  voltage?: number;
  lift_height?: string;       // Novo: Elevação
  loadCenter?: number;       // Novo: Centro de Carga
  batteryDetails?: string;   // Novo: Detalhes Bateria
  chargerType?: string;      // Novo: Tipo Carregador
  technicalSheetUrl?: string;// Novo: PDF

  // Campos de Peças/Pneus/Serviços
  manufacturer?: string;
  application?: string;
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

