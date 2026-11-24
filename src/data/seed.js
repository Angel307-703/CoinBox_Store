export const initialAddresses = [
  { id: 'ADR-001', alias: 'Casa Mosquera', municipio: 'Mosquera', description: 'Cra. 4 # 8-20, Mosquera, Cundinamarca', principal: true },
  { id: 'ADR-002', alias: 'Oficina Funza', municipio: 'Funza', description: 'Av. Calle 15 # 12-30, Funza, Cundinamarca', principal: false },
  { id: 'ADR-003', alias: 'Apto Madrid', municipio: 'Madrid', description: 'Av. Principal # 4-15, Madrid, Cundinamarca', principal: false },
];

export const initialOrders = [
  {
    id: 'CBX-2026-0215', date: '2026-11-20T10:15:00', status: 'En camino', reintegrado: false,
    subtotal: 1649000, shippingCost: 6000, shippingMode: 'Estandar', shippingEta: '1 a 2 días hábiles',
    address: { alias: 'Casa Mosquera', municipio: 'Mosquera', description: 'Cra. 4 # 8-20, Mosquera, Cundinamarca' },
    items: [{ productId: 'PROD-001', variantId: 'VAR-01A', productName: 'Nintendo Switch OLED', variantLabel: 'Edición Neon Red / Blue', quantity: 1, unitPrice: 1649000 }],
    history: [
      { status: 'Confirmado', date: '2026-11-18T09:00:00' },
      { status: 'Preparando', date: '2026-11-19T08:30:00' },
      { status: 'En camino', date: '2026-11-20T10:15:00' },
    ],
  },
  {
    id: 'CBX-2026-0216', date: '2026-11-21T14:20:00', status: 'Preparando', reintegrado: false,
    subtotal: 1649000, shippingCost: 8000, shippingMode: 'Estandar', shippingEta: '2 a 3 días hábiles',
    address: { alias: 'Oficina Funza', municipio: 'Funza', description: 'Av. Calle 15 # 12-30, Funza, Cundinamarca' },
    items: [{ productId: 'PROD-001', variantId: 'VAR-01A', productName: 'Nintendo Switch OLED', variantLabel: 'Edición Neon Red / Blue', quantity: 1, unitPrice: 1649000 }],
    history: [
      { status: 'Confirmado', date: '2026-11-21T12:10:00' },
      { status: 'Preparando', date: '2026-11-21T14:20:00' },
    ],
  },
  {
    id: 'CBX-2026-0190', date: '2026-11-05T11:00:00', status: 'Entregado', reintegrado: false,
    subtotal: 269000, shippingCost: 6000, shippingMode: 'Estandar', shippingEta: '1 a 2 días hábiles',
    address: { alias: 'Casa Mosquera', municipio: 'Mosquera', description: 'Cra. 4 # 8-20, Mosquera, Cundinamarca' },
    items: [{ productId: 'PROD-005', variantId: 'VAR-05A', productName: 'The Legend of Zelda: Tears of the Kingdom', variantLabel: 'Edición Estándar Física', quantity: 1, unitPrice: 269000 }],
    history: [
      { status: 'Confirmado', date: '2026-11-03T09:00:00' },
      { status: 'Preparando', date: '2026-11-03T17:00:00' },
      { status: 'En camino', date: '2026-11-04T08:00:00' },
      { status: 'Entregado', date: '2026-11-05T11:00:00' },
    ],
  },
];

export const initialNotifications = [
  { id: 'NTF-001', type: 'stock', title: 'Aviso de inventario', message: 'Hay una variante agotada en el catálogo. Activa «Avisarme cuando haya stock» para recibir una notificación interna cuando se reponga.', date: '2026-11-22T10:30:00', read: false, uniqueKey: 'restock-demo-initial' },
  { id: 'NTF-002', type: 'order', title: 'Tu pedido está en camino', message: 'El pedido #CBX-2026-0215 cambió al estado En camino.', date: '2026-11-20T10:15:00', read: false, uniqueKey: 'order-CBX-2026-0215-En camino' },
];

export const initialQuestions = [
  { id: 'QA-001', productId: 'PROD-001', question: '¿Incluye adaptador de corriente original?', answer: 'Sí. La presentación incluye el adaptador de corriente correspondiente.', status: 'Respondida', date: '2026-11-18T09:00:00', simulated: true },
  { id: 'QA-002', productId: 'PROD-001', question: '¿La pantalla es OLED?', answer: null, status: 'Pendiente', date: '2026-11-21T13:00:00', simulated: false },
];

export const initialTickets = [
  { id: 'SUP-2026-085', orderId: 'CBX-2026-0215', reason: 'Entrega', description: 'Quisiera confirmar el estado y la fecha estimada de entrega de mi pedido.', status: 'Abierto', answer: null, date: '2026-11-22T08:30:00' },
];
