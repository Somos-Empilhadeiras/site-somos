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

// ... (Restante do arquivo: AdminItem, JobVacancy, SLOT_GROUPS podem ficar igual)
// Se precisar do SLOT_GROUPS me avise, mas a interface acima é a crítica.
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