export const ORDER_STATUSES = ['Confirmado', 'Preparando', 'En camino', 'Entregado'];
export const NEXT_STATUS = {
  Confirmado: 'Preparando',
  Preparando: 'En camino',
  'En camino': 'Entregado',
};

export function totalStock(product) {
  if (Array.isArray(product?.variants) && product.variants.length) {
    return product.variants.reduce((sum, variant) => sum + Number(variant.stock || 0), 0);
  }
  return Number(product?.stock || 0);
}

export function startingPrice(product) {
  if (Array.isArray(product?.variants) && product.variants.length) {
    return Math.min(...product.variants.map((variant) => variant.price));
  }
  return Number(product?.basePrice || 0);
}

export function cartLineKey(productId, variantId = null) {
  return `${productId}_${variantId || 'BASE'}`;
}

export function calculateShipping(municipio, mode = 'Estandar') {
  const rates = {
    Mosquera: { Estandar: { cost: 6000, eta: '1 a 2 días hábiles' }, Expres: { cost: 10000, eta: 'Mismo día / 24 h' } },
    Funza: { Estandar: { cost: 8000, eta: '2 a 3 días hábiles' }, Expres: { cost: 12000, eta: '1 a 2 días hábiles' } },
    Madrid: { Estandar: { cost: 10000, eta: '2 a 3 días hábiles' }, Expres: { cost: 14000, eta: '1 a 2 días hábiles' } },
  };
  if (!rates[municipio]) {
    return mode === 'Expres'
      ? { cost: null, eta: 'No disponible', covered: false }
      : { cost: 15000, eta: '3 a 5 días hábiles', covered: true };
  }
  return { ...rates[municipio][mode], covered: true };
}

export function canCancelOrder(order) {
  return ['Confirmado', 'Preparando'].includes(order?.status) && !order?.reintegrado;
}

export function nextOrderStatus(status) {
  return NEXT_STATUS[status] || null;
}

export function formatCOP(value) {
  return `$${Math.round(Number(value || 0)).toLocaleString('es-CO')} COP`;
}

export function formatDate(value) {
  try {
    return new Date(value).toLocaleString('es-CO', { dateStyle: 'medium', timeStyle: 'short' });
  } catch {
    return 'Fecha no disponible';
  }
}
