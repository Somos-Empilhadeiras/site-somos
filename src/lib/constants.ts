export const COMPANY_CONTACTS = {
  // Apenas números para facilitar a criação de links
  rh_phone_raw: '5562992461089', 
  // Formatado para exibição visual (opcional)
  rh_phone_display: '(62) 9 9246-1089',
  
  rh_email: 'administrativo@somosempilhadeiras.com.br',
  
  
  juliana_phone_raw: '5562992904647',
  maike_phone_raw: '556193379261',
  cristiane_phone_raw: '557781660577',
  alan_phone_raw: '558192586532',
};

export const GEO_URL = "https://raw.githubusercontent.com/codeforamerica/click_that_hood/master/public/data/brazil-states.geojson";


export const CITY_COORDINATES: Record<string, [number, number]> = {
  'GO': [-49.255, -16.679],
  'DF': [-47.887, -15.793],
  'TO': [-48.327, -10.183],
  'BA': [-45.796, -12.095],
  'PE': [-34.877, -8.047],
};

export const MAP_CONFIG: Record<string, { scale: number; center: [number, number] }> = {
  'GO': { scale: 3500, center: [-49.5, -16.5] },
  'DF': { scale: 15000, center: [-47.8, -15.75] },
  'TO': { scale: 3000, center: [-48.0, -10.5] },
  'BA': { scale: 1800, center: [-41.5, -12.5] },
  'PE': { scale: 5000, center: [-37.0, -8.3] },
};

export const STATE_DETAILS: Record<string, any> = {
  'GO': { date: '2023', address: "Av. Caiapó, 1190 - Santa Genoveva, Goiânia - GO, 74672-400", representant: "Khryss Mylla", role: "Comercial", operation: "Seg a Sex, 07h às 17h", mail: "comercial@somosempilhadeiras.com.br", phone: "(62) 9 9183-4188", city: "Goiânia", wpp: '5562991834188', text: 'Nossa casa, onde tudo começou. Sede administrativa e operacional.' },
  'DF': { date: '2024', address: "Scia Q 14 Conjunto 1, SCIA - Lote 1, Brasília - DF", representant: "Maike Jhonny", role: "Consultor de Negócios", operation: "Seg a Sex, 07h às 17h", mail: "comercial@somosempilhadeiras.com.br", phone: "(61) 9 9337-9261", wpp:"5561993379261", city: "Brasília", text: 'Atendendo o coração do Brasil com agilidade e precisão logística.' },
  'TO': { date: '2025', address: "RUA 11 C-01 LT 05, JARDIM AURENY IV, 77.060-017", representant: "Alexandra Barbosa", role: "Consultora de Negócios", operation: "Seg a Sex, 07h às 17h", mail: "comercial@somosempilhadeiras.com.br", phone: "(63) 9 9297-2396", wpp: "5563992972396", city: "Palmas", text: 'Expandindo horizontes no norte, apoiando o agronegócio.' },
  'BA': { date: '2024', address: "Av. Luís Eduardo Magalhães, QD 02 - LT 26, LEM - BA", representant: "Cristiane Rodrigues", role: "Consultora de Negócios", operation: "Seg a Sex, 08h às 18h", mail: "comercial@somosempilhadeiras.com.br", phone: "77 9 8166-0577", wpp: "5577981660577", city: "Luís Eduardo Magalhães", text: 'Energia e força para o nordeste, com frota especializada.' },
  'PE': { date: '2025', address: "Estrada de Curcurana 572, Barra de Jangada, Jaboatão dos Guararapes PE, 54490-064.", representant: "Alan Santana", role: "Gerente Regional", operation: "Seg a Sex, 07h às 17h", mail: "comercial@somosempilhadeiras.com.br", phone: "(81) 9 9258-6532", wpp: '5581992586532', city: "Recife", text: "Nova base estratégica para o litoral e indústrias da região." },
};

// --- CONFIGURAÇÃO DOS NÚMEROS POR REGIÃO ---
export const REGIONAL_CONTACTS = {
  GO_TO: COMPANY_CONTACTS.juliana_phone_raw,
  DF: COMPANY_CONTACTS.maike_phone_raw,
  BA: COMPANY_CONTACTS.cristiane_phone_raw,
  PE: COMPANY_CONTACTS.alan_phone_raw,
};
