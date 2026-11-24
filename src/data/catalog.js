// Catálogo maestro CoinBox_Store 2.0.
// Los productos con variantes guardan el inventario únicamente en variants[].stock.

export const initialCatalog = [
  {
    id: 'PROD-001', name: 'Nintendo Switch OLED', category: 'Consolas', era: 'Actual', brand: 'Nintendo',
    description: 'Consola híbrida con pantalla OLED de 7 pulgadas, base con puerto LAN y modos TV, sobremesa y portátil.',
    emoji: '🎮', imageTone: '#E8F0F2', basePrice: 1649000,
    attributes: { Pantalla: 'OLED 7”', Almacenamiento: '64 GB', Modo: 'Híbrido' },
    variants: [
      { id: 'VAR-01A', label: 'Edición Neon Red / Blue', price: 1649000, stock: 4 },
      { id: 'VAR-01B', label: 'Blanco OLED Estándar', price: 1649000, stock: 2 },
      { id: 'VAR-01C', label: 'Edición Zelda: Tears of the Kingdom', price: 1799000, stock: 0 },
    ],
  },
  {
    id: 'PROD-002', name: 'Nintendo 64 + Exp. Pak', category: 'Consolas', era: 'Retro', brand: 'Nintendo',
    description: 'Consola clásica de sobremesa para revivir una generación de aventuras multijugador.',
    emoji: '🕹️', imageTone: '#EEEAE4', basePrice: 680000, stock: 3,
    attributes: { Generación: 'Nintendo 64', Formato: 'Cartucho', Tipo: 'Sobremesa' },
  },
  {
    id: 'PROD-003', name: 'SNES Clásica', category: 'Consolas', era: 'Retro', brand: 'Nintendo',
    description: 'Consola retro de 16 bits con diseño compacto inspirado en el sistema clásico.',
    emoji: '🎛️', imageTone: '#EAEAF0', basePrice: 490000, stock: 4,
    attributes: { Generación: '16 bits', Formato: 'Clásico', Tipo: 'Sobremesa' },
  },
  {
    id: 'PROD-004', name: 'Game Boy Advance SP Cobalt', category: 'Consolas', era: 'Retro', brand: 'Nintendo',
    description: 'Consola portátil plegable de colección. Se conserva agotada para probar recomendaciones y disponibilidad.',
    emoji: '🎮', imageTone: '#E7EDF6', basePrice: 520000, stock: 0,
    attributes: { Pantalla: 'Portátil', Diseño: 'Plegable', Colección: 'Retro' },
  },
  {
    id: 'PROD-005', name: 'The Legend of Zelda: Tears of the Kingdom', category: 'Juegos', era: 'Actual', brand: 'Nintendo',
    description: 'Aventura de exploración en Hyrule. Elige edición estándar física o coleccionista.',
    emoji: '🗡️', imageTone: '#E8EEE7', basePrice: 269000,
    attributes: { Plataforma: 'Nintendo Switch', Género: 'Aventura', Formato: 'Físico' },
    variants: [
      { id: 'VAR-05A', label: 'Edición Estándar Física', price: 269000, stock: 8 },
      { id: 'VAR-05B', label: 'Edición Coleccionista (Artbook + Steelbook)', price: 549000, stock: 2 },
    ],
  },
  {
    id: 'PROD-006', name: 'Mario Kart 8 Deluxe', category: 'Juegos', era: 'Actual', brand: 'Nintendo',
    description: 'Carreras arcade para competir en familia y con amigos.',
    emoji: '🏎️', imageTone: '#F5E9E3', basePrice: 229000, stock: 6,
    attributes: { Plataforma: 'Nintendo Switch', Género: 'Carreras', Jugadores: '1–4' },
  },
  {
    id: 'PROD-007', name: 'Super Mario Odyssey', category: 'Juegos', era: 'Actual', brand: 'Nintendo',
    description: 'Aventura de plataformas en distintos reinos con exploración y coleccionables.',
    emoji: '🍄', imageTone: '#F4EBDF', basePrice: 219000, stock: 5,
    attributes: { Plataforma: 'Nintendo Switch', Género: 'Plataformas', Formato: 'Físico' },
  },
  {
    id: 'PROD-008', name: 'Amiibo Link (Colección Zelda)', category: 'Amiibos', era: 'Actual', brand: 'Nintendo',
    description: 'Figura coleccionable de Link en dos presentaciones de la saga Zelda.',
    emoji: '🧝', imageTone: '#EAEFE8', basePrice: 119000,
    attributes: { Colección: 'Zelda', Tipo: 'Figura NFC', Material: 'Coleccionable' },
    variants: [
      { id: 'VAR-08A', label: 'Link (Lágrimas del Reino)', price: 119000, stock: 5 },
      { id: 'VAR-08B', label: 'Link (Ocarina of Time Clásico)', price: 135000, stock: 0 },
    ],
  },
  {
    id: 'PROD-009', name: 'Amiibo Mario', category: 'Amiibos', era: 'Actual', brand: 'Nintendo',
    description: 'Figura NFC de Mario para colección y compatibilidad con juegos seleccionados.',
    emoji: '🍄', imageTone: '#F4E9E6', basePrice: 89000, stock: 7,
    attributes: { Colección: 'Super Mario', Tipo: 'Figura NFC', Material: 'Coleccionable' },
  },
  {
    id: 'PROD-010', name: 'Amiibo Samus', category: 'Amiibos', era: 'Retro', brand: 'Nintendo',
    description: 'Figura coleccionable inspirada en la saga Metroid.',
    emoji: '🚀', imageTone: '#E9EDF0', basePrice: 99000, stock: 4,
    attributes: { Colección: 'Metroid', Tipo: 'Figura NFC', Material: 'Coleccionable' },
  },
  {
    id: 'PROD-011', name: 'Nintendo Switch Pro Controller', category: 'Periféricos', era: 'Actual', brand: 'Nintendo',
    description: 'Control inalámbrico de formato tradicional con dos acabados disponibles.',
    emoji: '🎮', imageTone: '#E9E9E9', basePrice: 319000,
    attributes: { Conexión: 'Bluetooth', Vibración: 'HD Rumble', Batería: 'Recargable' },
    variants: [
      { id: 'VAR-11A', label: 'Negro Grafito Original', price: 319000, stock: 5 },
      { id: 'VAR-11B', label: 'Edición Especial Splatoon 3', price: 359000, stock: 2 },
    ],
  },
  {
    id: 'PROD-012', name: 'Joy-Con (Par)', category: 'Periféricos', era: 'Actual', brand: 'Nintendo',
    description: 'Par de controles desmontables para jugar en modo portátil o multijugador.',
    emoji: '🕹️', imageTone: '#F2E8EB', basePrice: 329000, stock: 3,
    attributes: { Conexión: 'Inalámbrica', Unidades: '2 controles', Compatibilidad: 'Nintendo Switch' },
  },
];

export const categories = ['Todos', 'Consolas', 'Juegos', 'Amiibos', 'Periféricos'];
export const eras = ['Todas', 'Actual', 'Retro'];
