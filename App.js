import React, { useMemo, useState } from 'react';
import { Alert, Pressable, SafeAreaView, ScrollView, StatusBar, Text, View } from 'react-native';
import { Button, Row, StatusPill, Txt } from './src/components/UI';
import { AddressModal, FilterModal, ShareModal } from './src/components/Modals';
import {
  CatalogScreen, ProductDetailScreen, CompareScreen, CartScreen,
  OrdersScreen, NotificationsScreen, SupportScreen, SettingsScreen,
} from './src/screens/Screens';
import { initialCatalog } from './src/data/catalog';
import { initialAddresses, initialNotifications, initialOrders, initialQuestions, initialTickets } from './src/data/seed';
import {
  calculateShipping, canCancelOrder, cartLineKey, formatCOP, nextOrderStatus, startingPrice, totalStock,
} from './src/domain/marketplace';

const PALETTES = {
  light: {
    bg: '#F6F5F2', card: '#FFFFFF', text: '#141518', muted: '#74767A', line: '#E2DFD8', soft: '#ECEAE5', input: '#FFFFFF',
    dark: '#141518', red: '#E60012', cyan: '#007799', cyanSoft: '#E2F3F5', greenSoft: '#E4F4EB', placeholder: '#929292',
  },
  dark: {
    bg: '#0F1115', card: '#171A20', text: '#F5F6F7', muted: '#A4A9B2', line: '#30343C', soft: '#20242C', input: '#171A20',
    dark: '#080A0E', red: '#E60012', cyan: '#00D2FF', cyanSoft: '#102B31', greenSoft: '#153329', placeholder: '#737B86',
  },
};

const EMPTY_FILTERS = { search: '', category: 'Todos', era: 'Todas', brand: 'Todas', minPrice: '', maxPrice: '', onlyAvailable: false };

const TABS = [
  { key: 'Catalog', label: 'Tienda', icon: '⌂' },
  { key: 'Compare', label: 'Comparar', icon: '⇄' },
  { key: 'Cart', label: 'Carrito', icon: '▣' },
  { key: 'Orders', label: 'Pedidos', icon: '☷' },
  { key: 'Support', label: 'Ayuda', icon: '?' },
];

export default function App() {
  const [products, setProducts] = useState(initialCatalog);
  const [screen, setScreen] = useState('Catalog');
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [selectedVariantId, setSelectedVariantId] = useState(null);
  const [filters, setFilters] = useState(EMPTY_FILTERS);
  const [compareIds, setCompareIds] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [addresses, setAddresses] = useState(initialAddresses);
  const [selectedAddressId, setSelectedAddressId] = useState(initialAddresses[0]?.id || null);
  const [shippingMode, setShippingMode] = useState('Estandar');
  const [orders, setOrders] = useState(initialOrders);
  const [notifications, setNotifications] = useState(initialNotifications);
  const [questions, setQuestions] = useState(initialQuestions);
  const [tickets, setTickets] = useState(initialTickets);
  const [restockSubscriptions, setRestockSubscriptions] = useState([]);
  const [questionDraft, setQuestionDraft] = useState('');
  const [selectedSupportOrderId, setSelectedSupportOrderId] = useState(initialOrders[0]?.id || '');
  const [supportReason, setSupportReason] = useState('Entrega');
  const [supportDescription, setSupportDescription] = useState('');
  const [darkMode, setDarkMode] = useState(false);
  const [largeFont, setLargeFont] = useState(false);
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [addressModalVisible, setAddressModalVisible] = useState(false);
  const [addressDraft, setAddressDraft] = useState({ alias: '', municipio: 'Mosquera', description: '', principal: false });
  const [editingAddressId, setEditingAddressId] = useState(null);
  const [shareModal, setShareModal] = useState({ visible: false, product: null, variant: null });
  const [notice, setNotice] = useState('');

  const scale = largeFont ? 1.2 : 1;
  const c = { ...PALETTES[darkMode ? 'dark' : 'light'], scale };

  const filteredProducts = useMemo(() => {
    const query = (filters.search || '').trim().toLowerCase();
    const min = filters.minPrice === '' ? null : Number(filters.minPrice);
    const max = filters.maxPrice === '' ? null : Number(filters.maxPrice);

    return products.filter((product) => {
      const price = startingPrice(product);
      const matchesText = !query || `${product.name} ${product.category} ${product.era} ${product.brand}`.toLowerCase().includes(query);
      const matchesCategory = !filters.category || filters.category === 'Todos' || product.category === filters.category;
      const matchesEra = !filters.era || filters.era === 'Todas' || product.era === filters.era;
      const matchesBrand = !filters.brand || filters.brand === 'Todas' || product.brand === filters.brand;
      const matchesMin = min === null || price >= min;
      const matchesMax = max === null || price <= max;
      const matchesStock = !filters.onlyAvailable || totalStock(product) > 0;

      return matchesText && matchesCategory && matchesEra && matchesBrand && matchesMin && matchesMax && matchesStock;
    });
  }, [products, filters]);

  const selectedProduct = products.find((item) => item.id === selectedProductId) || null;
  const selectedVariant = selectedProduct?.variants?.find((item) => item.id === selectedVariantId) || null;

  const relatedProducts = useMemo(() => {
    if (!selectedProduct) return [];

    return products.filter((product) =>
      product.id !== selectedProduct.id &&
      product.category === selectedProduct.category &&
      totalStock(product) > 0
    );
  }, [products, selectedProduct]);

  const compareProducts = useMemo(
    () => compareIds.map((id) => products.find((product) => product.id === id)).filter(Boolean),
    [compareIds, products]
  );

  const subtotal = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0),
    [cartItems]
  );

  const selectedAddress = addresses.find((item) => item.id === selectedAddressId) || null;

  const shipping = selectedAddress
    ? calculateShipping(selectedAddress.municipio, shippingMode)
    : { cost: null, eta: 'Selecciona una dirección', covered: false };

  const total = subtotal + (shipping.cost || 0);
  const unreadCount = notifications.filter((item) => !item.read).length;
  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const showNotice = (message) => {
    setNotice(message);
    setTimeout(() => setNotice((current) => (current === message ? '' : current)), 3200);
  };

  const pushUniqueNotification = (notification) => {
    setNotifications((current) => {
      if (current.some((item) => item.uniqueKey === notification.uniqueKey)) return current;

      return [
        { id: `NTF-${Date.now()}`, date: new Date().toISOString(), read: false, ...notification },
        ...current,
      ];
    });
  };

  const navigate = (target) => {
    setScreen(target);
    if (target !== 'Detail') setSelectedProductId(null);
  };

  const openProduct = (productId) => {
    setSelectedProductId(productId);
    setSelectedVariantId(null);
    setQuestionDraft('');
    setScreen('Detail');
  };

  const openShare = (product, variant = null) => {
    setShareModal({ visible: true, product, variant });
  };

  const toggleCompare = (productId) => {
    if (compareIds.includes(productId)) {
      setCompareIds((current) => current.filter((id) => id !== productId));
      return;
    }

    if (compareIds.length >= 3) {
      showNotice('Límite alcanzado: máximo 3 productos.');
      return;
    }

    setCompareIds((current) =>
      current.includes(productId) || current.length >= 3
        ? current
        : [...current, productId]
    );
  };

  const addToCart = (product, variant = null) => {
    const isVariantProduct = Array.isArray(product.variants) && product.variants.length > 0;

    if (isVariantProduct && !variant) {
      showNotice('Selecciona una variante antes de agregar al carrito.');
      return;
    }

    const stock = variant ? variant.stock : product.stock;

    if (stock <= 0) {
      showNotice('Compra bloqueada: no hay unidades disponibles.');
      return;
    }

    const key = cartLineKey(product.id, variant?.id);
    const existing = cartItems.find((item) => item.key === key);

    if ((existing?.quantity || 0) >= stock) {
      showNotice('La cantidad solicitada supera el stock disponible.');
      return;
    }

    setCartItems((current) => {
      const found = current.find((item) => item.key === key);

      if (found) {
        return current.map((item) =>
          item.key === key
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      return [
        ...current,
        {
          key,
          productId: product.id,
          variantId: variant?.id || null,
          variantLabel: variant?.label || null,
          unitPrice: variant?.price || product.basePrice,
          quantity: 1,
        },
      ];
    });

    showNotice(`${product.name} agregado al carrito.`);
  };

  const changeCartQuantity = (line, delta) => {
    const product = products.find((item) => item.id === line.productId);
    if (!product) return;

    const stock = line.variantId
      ? product.variants?.find((item) => item.id === line.variantId)?.stock || 0
      : product.stock;

    setCartItems((current) =>
      current.map((item) =>
        item.key === line.key
          ? { ...item, quantity: Math.max(1, Math.min(stock, item.quantity + delta)) }
          : item
      )
    );
  };

  const removeCartItem = (productId, variantId) => {
    const key = cartLineKey(productId, variantId);
    setCartItems((current) => current.filter((item) => item.key !== key));
  };

  const confirmOrder = () => {
    if (!cartItems.length) return showNotice('Agrega al menos un producto al carrito.');
    if (!selectedAddress) return showNotice('Selecciona una dirección de entrega.');
    if (shipping.cost == null) return showNotice('El envío exprés no está disponible para este municipio.');

    const stockValid = cartItems.every((line) => {
      const product = products.find((item) => item.id === line.productId);
      if (!product) return false;

      const available = line.variantId
        ? product.variants?.find((item) => item.id === line.variantId)?.stock || 0
        : product.stock;

      return line.quantity <= available;
    });

    if (!stockValid) {
      return showNotice('El inventario cambió. Ajusta las cantidades antes de confirmar.');
    }

    const now = new Date();
    const newOrderId = `CBX-${now.getFullYear()}-${String(now.getTime()).slice(-6)}`;

    const snapshotItems = cartItems.map((line) => {
      const product = products.find((item) => item.id === line.productId);

      return {
        productId: product.id,
        variantId: line.variantId,
        productName: product.name,
        variantLabel: line.variantLabel,
        quantity: line.quantity,
        unitPrice: line.unitPrice,
      };
    });

    const order = {
      id: newOrderId,
      date: now.toISOString(),
      status: 'Confirmado',
      reintegrado: false,
      subtotal,
      shippingCost: shipping.cost,
      shippingMode,
      shippingEta: shipping.eta,
      total,
      address: {
        alias: selectedAddress.alias,
        municipio: selectedAddress.municipio,
        description: selectedAddress.description,
      },
      items: snapshotItems,
      history: [{ status: 'Confirmado', date: now.toISOString() }],
    };

    setProducts((current) =>
      current.map((product) => {
        const linesForProduct = cartItems.filter((line) => line.productId === product.id);
        if (!linesForProduct.length) return product;

        if (product.variants?.length) {
          return {
            ...product,
            variants: product.variants.map((variant) => {
              const line = linesForProduct.find((item) => item.variantId === variant.id);
              return line ? { ...variant, stock: variant.stock - line.quantity } : variant;
            }),
          };
        }

        const quantity = linesForProduct.reduce((sum, item) => sum + item.quantity, 0);
        return { ...product, stock: product.stock - quantity };
      })
    );

    setOrders((current) => [order, ...current]);

    pushUniqueNotification({
      type: 'order',
      title: 'Pedido confirmado',
      message: `Tu pedido #${newOrderId} fue confirmado correctamente.`,
      uniqueKey: `order-${newOrderId}-Confirmado`,
    });

    setCartItems([]);
    setScreen('Orders');
    showNotice(`Pedido #${newOrderId} confirmado. Compra simulada, sin cobro real.`);
  };

  const toggleRestock = (variantId) => {
    setRestockSubscriptions((current) =>
      current.includes(variantId)
        ? current.filter((id) => id !== variantId)
        : [...current, variantId]
    );

    showNotice(
      restockSubscriptions.includes(variantId)
        ? 'Suscripción cancelada.'
        : 'Te avisaremos cuando vuelva el inventario.'
    );
  };

  const simulateRestock = (variantId) => {
    const sourceProduct = products.find((product) =>
      product.variants?.some((variant) => variant.id === variantId)
    );

    const sourceVariant = sourceProduct?.variants?.find((variant) => variant.id === variantId);
    const productName = sourceProduct?.name || 'Producto';
    const variantName = sourceVariant?.label || 'Variante';
    const restockCycle = sourceVariant?.restockVersion || 0;

    setProducts((current) =>
      current.map((product) => {
        if (!product.variants?.some((variant) => variant.id === variantId)) return product;

        return {
          ...product,
          variants: product.variants.map((variant) => {
            if (variant.id !== variantId) return variant;

            return {
              ...variant,
              stock: variant.stock + 3,
              restockVersion: (variant.restockVersion || 0) + 1,
            };
          }),
        };
      })
    );

    setRestockSubscriptions((current) => current.filter((id) => id !== variantId));

    pushUniqueNotification({
      type: 'stock',
      title: 'Producto disponible nuevamente',
      message: `${productName} · ${variantName}: reposición simulada de +3 unidades.`,
      uniqueKey: `restock-${variantId}-${restockCycle}`,
    });

    showNotice('Reposición simulada: se agregaron 3 unidades y se generó un aviso interno.');
  };

  const submitQuestion = (productId) => {
    if (questionDraft.trim().length < 10) {
      return showNotice(`Mínimo 10 caracteres requeridos (${questionDraft.trim().length}/10).`);
    }

    const newQuestion = {
      id: `QA-${Date.now()}`,
      productId,
      question: questionDraft.trim(),
      answer: null,
      status: 'Pendiente',
      date: new Date().toISOString(),
      simulated: false,
    };

    setQuestions((current) => [newQuestion, ...current]);
    setQuestionDraft('');
    showNotice('Pregunta publicada en la ficha del producto.');
  };

  const simulateQAReply = (questionId) => {
    setQuestions((current) =>
      current.map((item) =>
        item.id === questionId
          ? {
              ...item,
              status: 'Respondida',
              simulated: true,
              answer: 'Respuesta simulada (Demo): consulta la descripción y las especificaciones de esta ficha. Para una compra real, confirma los accesorios incluidos con el vendedor.',
            }
          : item
      )
    );

    showNotice('Respuesta simulada agregada a la consulta.');
  };

  const advanceOrder = (orderId) => {
    const order = orders.find((item) => item.id === orderId);
    const next = nextOrderStatus(order?.status);

    if (!next || order?.status === 'Cancelado') {
      return showNotice('Este pedido no admite más avances.');
    }

    const now = new Date().toISOString();

    setOrders((current) =>
      current.map((item) =>
        item.id === orderId
          ? { ...item, status: next, history: [...item.history, { status: next, date: now }] }
          : item
      )
    );

    pushUniqueNotification({
      type: 'order',
      title: `Pedido ${next.toLowerCase()}`,
      message: `El pedido #${orderId} cambió al estado ${next}.`,
      uniqueKey: `order-${orderId}-${next}`,
    });

    showNotice(`Avance simulado: ${next}.`);
  };

  const cancelOrder = (orderId) => {
    const order = orders.find((item) => item.id === orderId);

    if (!canCancelOrder(order)) {
      return showNotice(`Cancelación bloqueada: el pedido ya está ${order?.status || 'cerrado'}.`);
    }

    if (!order.reintegrado) {
      setProducts((current) =>
        current.map((product) => {
          const orderLines = order.items.filter((line) => line.productId === product.id);
          if (!orderLines.length) return product;

          if (product.variants?.length) {
            return {
              ...product,
              variants: product.variants.map((variant) => {
                const line = orderLines.find((item) => item.variantId === variant.id);
                return line ? { ...variant, stock: variant.stock + line.quantity } : variant;
              }),
            };
          }

          const qty = orderLines.reduce((sum, line) => sum + line.quantity, 0);
          return { ...product, stock: product.stock + qty };
        })
      );
    }

    const now = new Date().toISOString();

    setOrders((current) =>
      current.map((item) =>
        item.id === orderId
          ? {
              ...item,
              status: 'Cancelado',
              reintegrado: true,
              history: [...item.history, { status: 'Cancelado', date: now }],
            }
          : item
      )
    );

    pushUniqueNotification({
      type: 'order',
      title: 'Pedido cancelado',
      message: `El pedido #${orderId} fue cancelado. El inventario se restituyó una sola vez.`,
      uniqueKey: `order-${orderId}-Cancelado`,
    });

    showNotice('Pedido cancelado. Inventario reintegrado una sola vez.');
  };

  const requestReturn = (orderId) => {
    const order = orders.find((item) => item.id === orderId);

    if (order?.status !== 'Entregado') {
      return showNotice('La devolución simulada solo está disponible para pedidos Entregados.');
    }

    setOrders((current) =>
      current.map((item) =>
        item.id === orderId
          ? { ...item, returnStatus: 'Devolución solicitada' }
          : item
      )
    );

    pushUniqueNotification({
      type: 'order',
      title: 'Devolución solicitada',
      message: `Se registró la solicitud simulada para el pedido #${orderId}.`,
      uniqueKey: `return-${orderId}`,
    });

    showNotice('Solicitud de devolución simulada registrada.');
  };

  const markNotificationRead = (notificationId) => {
    setNotifications((current) =>
      current.map((item) => item.id === notificationId ? { ...item, read: true } : item)
    );
  };

  const markAllRead = () => {
    setNotifications((current) => current.map((item) => ({ ...item, read: true })));
  };

  const submitTicket = () => {
    if (!selectedSupportOrderId) {
      return showNotice('Selecciona un pedido para asociar el ticket.');
    }

    if (supportDescription.trim().length < 15) {
      return showNotice(`${supportDescription.trim().length} / 15 caracteres mínimos.`);
    }

    const sequence = Math.max(85, ...tickets.map((ticket) => Number(ticket.id.split('-').pop()) || 0)) + 1;

    const ticket = {
      id: `SUP-2026-${String(sequence).padStart(3, '0')}`,
      orderId: selectedSupportOrderId,
      reason: supportReason,
      description: supportDescription.trim(),
      status: 'Abierto',
      answer: null,
      date: new Date().toISOString(),
    };

    setTickets((current) => [ticket, ...current]);
    setSupportDescription('');
    showNotice(`Ticket #${ticket.id} creado correctamente.`);
  };

  const simulateTicketReply = (ticketId) => {
    setTickets((current) =>
      current.map((ticket) =>
        ticket.id === ticketId
          ? {
              ...ticket,
              status: 'Respondido',
              answer: 'Respuesta simulada (Demo): recibimos tu solicitud y registramos el caso. Nuestro equipo revisaría el pedido y te compartiría una actualización por este medio.',
            }
          : ticket
      )
    );

    showNotice('El ticket ahora aparece como Respondido.');
  };

  const openAddressModal = (address = null) => {
    if (address) {
      setAddressDraft({
        alias: address.alias,
        municipio: address.municipio,
        description: address.description,
        principal: address.principal,
      });

      setEditingAddressId(address.id);
    } else {
      setAddressDraft({
        alias: '',
        municipio: 'Mosquera',
        description: '',
        principal: addresses.length === 0,
      });

      setEditingAddressId(null);
    }

    setAddressModalVisible(true);
  };

  const saveAddress = () => {
    if (
      addressDraft.alias.trim().length < 2 ||
      !addressDraft.municipio ||
      addressDraft.description.trim().length < 4
    ) {
      showNotice('Completa alias (mín. 2), municipio y referencia (mín. 4).');
      return;
    }

    const id = editingAddressId || `ADR-${Date.now()}`;
    const wasPrimary = addresses.some((item) => item.id === editingAddressId && item.principal);
    const shouldBePrimary = addressDraft.principal || addresses.length === 0;

    const record = {
      ...addressDraft,
      id,
      alias: addressDraft.alias.trim(),
      description: addressDraft.description.trim(),
      principal: shouldBePrimary || wasPrimary,
    };

    setAddresses((current) => {
      const updated = editingAddressId
        ? current.map((item) => item.id === editingAddressId ? record : item)
        : [...current, record];

      if (shouldBePrimary) {
        return updated.map((item) => ({ ...item, principal: item.id === id }));
      }

      if (wasPrimary) {
        const fallbackId = updated.find((item) => item.id !== id)?.id || id;
        return updated.map((item) => ({ ...item, principal: item.id === fallbackId }));
      }

      return updated;
    });

    if (!selectedAddressId) setSelectedAddressId(id);
    if (screen === 'Cart' && !selectedAddressId) setSelectedAddressId(id);

    setAddressModalVisible(false);
    setEditingAddressId(null);
    showNotice('Dirección guardada correctamente.');
  };

  const setPrimaryAddress = (addressId) => {
    setAddresses((current) =>
      current.map((item) => ({ ...item, principal: item.id === addressId }))
    );

    showNotice('Dirección principal actualizada.');
  };

  const updateFilters = (updater) => setFilters(updater);
  const resetFilters = () => setFilters(EMPTY_FILTERS);

  const applyFilters = () => {
    const min = filters.minPrice === '' ? null : Number(filters.minPrice);
    const max = filters.maxPrice === '' ? null : Number(filters.maxPrice);

    if (min !== null && max !== null && min > max) {
      showNotice('El precio mínimo no puede superar al máximo.');
      return;
    }

    setFilterModalVisible(false);
    setScreen('Catalog');
    showNotice(`${filteredProducts.length} productos coinciden con los filtros.`);
  };

  const app = {
    c, scale, products, filteredProducts, filters, setFilters: updateFilters,
    openFilters: () => setFilterModalVisible(true),
    compareIds, compareProducts, toggleCompare, openProduct, navigate,
    selectedProduct, selectedVariantId, setSelectedVariantId,
    addToCart, questions, questionDraft, setQuestionDraft, submitQuestion,
    simulateQAReply, restockSubscriptions, toggleRestock, simulateRestock,
    relatedProducts, openShare, cartItems, changeCartQuantity, removeCartItem,
    addresses, selectedAddressId, setSelectedAddressId,
    openAddressModal, setPrimaryAddress, shippingMode, setShippingMode,
    subtotal, shipping, total, confirmOrder, orders, advanceOrder, cancelOrder,
    requestReturn, notifications, markNotificationRead, markAllRead,
    tickets, selectedSupportOrderId, setSelectedSupportOrderId,
    supportReason, setSupportReason, supportDescription, setSupportDescription,
    submitTicket, simulateTicketReply, darkMode, setDarkMode,
    largeFont, setLargeFont,
  };

  const renderScreen = () => {
    switch (screen) {
      case 'Detail': return <ProductDetailScreen app={app} />;
      case 'Compare': return <CompareScreen app={app} />;
      case 'Cart': return <CartScreen app={app} />;
      case 'Orders': return <OrdersScreen app={app} />;
      case 'Notifications': return <NotificationsScreen app={app} />;
      case 'Support': return <SupportScreen app={app} />;
      case 'Settings': return <SettingsScreen app={app} />;
      default: return <CatalogScreen app={app} />;
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: c.bg }}>
      <StatusBar barStyle={darkMode ? 'light-content' : 'dark-content'} backgroundColor={c.bg} />

      <View style={{ backgroundColor: c.dark, paddingHorizontal: 13, paddingTop: 7, paddingBottom: 8 }}>
        <Row style={{ justifyContent: 'space-between' }}>
          <Pressable
            onPress={() => navigate('Catalog')}
            style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}
          >
            <View style={{
              width: 27, height: 27, borderRadius: 6, backgroundColor: c.red,
              alignItems: 'center', justifyContent: 'center', marginRight: 7,
            }}>
              <Txt c={c} color="#FFFFFF" size={16} weight="900">C</Txt>
            </View>

            <View>
              <Row style={{ gap: 3 }}>
                <Txt c={c} color="#FFFFFF" size={14} weight="900">CoinBox</Txt>
                <Txt c={c} color={c.red} size={14} weight="900">_Store</Txt>
                <StatusPill c={c} label="2.0" tone="cyan" />
              </Row>

              <Txt c={c} color="#AFB2B8" size={7} weight="800" style={{ letterSpacing: 1, marginTop: 1 }}>
                TU UNIVERSO NINTENDO · ACTUAL Y RETRO
              </Txt>
            </View>
          </Pressable>

          <Row style={{ gap: 5 }}>
            <Pressable
              onPress={() => navigate('Notifications')}
              style={{
                paddingHorizontal: 8, height: 29, borderRadius: 7,
                backgroundColor: '#FFFFFF12', borderWidth: 1, borderColor: '#FFFFFF22',
                alignItems: 'center', justifyContent: 'center',
              }}
            >
              <Row style={{ gap: 4 }}>
                <Txt c={c} color="#C7F5FA" size={9} weight="800">Avisos</Txt>
                {unreadCount > 0 ? (
                  <View style={{
                    minWidth: 14, height: 14, borderRadius: 7, backgroundColor: c.red,
                    alignItems: 'center', justifyContent: 'center', paddingHorizontal: 3,
                  }}>
                    <Txt c={c} color="#FFFFFF" size={7} weight="900">{unreadCount}</Txt>
                  </View>
                ) : null}
              </Row>
            </Pressable>

            <Pressable
              onPress={() => navigate('Cart')}
              style={{
                paddingHorizontal: 8, height: 29, borderRadius: 7,
                backgroundColor: '#FFFFFF12', borderWidth: 1, borderColor: '#FFFFFF22',
                alignItems: 'center', justifyContent: 'center',
              }}
            >
              <Txt c={c} color="#FFFFFF" size={9} weight="800">
                Carrito{cartCount ? ` ${cartCount}` : ''}
              </Txt>
            </Pressable>

            <Pressable
              onPress={() => navigate('Settings')}
              style={{
                width: 29, height: 29, borderRadius: 7, backgroundColor: '#FFFFFF12',
                alignItems: 'center', justifyContent: 'center',
              }}
            >
              <Txt c={c} color="#FFFFFF" size={14}>⚙</Txt>
            </Pressable>
          </Row>
        </Row>
      </View>

      <View style={{ flex: 1 }}>
        {notice ? (
          <Pressable
            onPress={() => setNotice('')}
            style={{
              backgroundColor: c.cyanSoft, paddingHorizontal: 15, paddingVertical: 9,
              borderBottomWidth: 1, borderBottomColor: c.line,
            }}
          >
            <Txt c={c} size={11} weight="700" color={c.cyan}>{notice}</Txt>
          </Pressable>
        ) : null}

        <ScrollView
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 13, paddingTop: 11, paddingBottom: 26 }}
        >
          {renderScreen()}
          <View style={{ height: 10 }} />
          <Txt c={c} size={9} color={c.muted} style={{ textAlign: 'center', marginTop: 16 }}>
            COINBOX_STORE · MARKETPLACE 2.0 · PROTOTIPO ACADÉMICO
          </Txt>
        </ScrollView>
      </View>

      {screen !== 'Detail' && screen !== 'Notifications' && screen !== 'Settings' ? (
        <View style={{
          flexDirection: 'row', backgroundColor: c.dark,
          borderTopWidth: 1, borderTopColor: c.dark,
          paddingTop: 8, paddingBottom: 7, paddingHorizontal: 6,
        }}>
          {TABS.map((tab) => {
            const active = screen === tab.key;

            return (
              <Pressable
                key={tab.key}
                onPress={() => navigate(tab.key)}
                style={{ flex: 1, alignItems: 'center', paddingVertical: 4 }}
              >
                <View style={{ minWidth: 26, height: 24, alignItems: 'center', justifyContent: 'center' }}>
                  <Txt c={c} color={active ? c.red : '#B7BBC2'} size={18} weight="800">
                    {tab.icon}
                  </Txt>

                  {tab.key === 'Cart' && cartCount > 0 ? (
                    <View style={{
                      position: 'absolute', top: -4, right: -6,
                      width: 14, height: 14, borderRadius: 7,
                      backgroundColor: c.red, alignItems: 'center', justifyContent: 'center',
                    }}>
                      <Txt c={c} color="#FFFFFF" size={8} weight="900">{cartCount}</Txt>
                    </View>
                  ) : null}
                </View>

                <Txt c={c} size={9} color={active ? c.red : '#B7BBC2'} weight={active ? '800' : '600'}>
                  {tab.label}
                </Txt>
              </Pressable>
            );
          })}
        </View>
      ) : (
        <View style={{
          backgroundColor: c.dark, borderTopWidth: 1, borderTopColor: c.dark, padding: 10,
        }}>
          <Button c={c} title="Volver a la tienda" variant="secondary" onPress={() => navigate('Catalog')} />
        </View>
      )}

      <FilterModal
        visible={filterModalVisible}
        onClose={() => setFilterModalVisible(false)}
        c={c}
        filters={filters}
        setFilters={setFilters}
        onApply={applyFilters}
        onReset={resetFilters}
      />

      <AddressModal
        visible={addressModalVisible}
        onClose={() => setAddressModalVisible(false)}
        c={c}
        draft={addressDraft}
        setDraft={setAddressDraft}
        onSave={saveAddress}
        editing={Boolean(editingAddressId)}
      />

      <ShareModal
        visible={shareModal.visible}
        onClose={() => setShareModal({ visible: false, product: null, variant: null })}
        c={c}
        product={shareModal.product}
        variant={shareModal.variant}
      />
    </SafeAreaView>
  );
}