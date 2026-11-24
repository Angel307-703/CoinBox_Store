import React from 'react';
import { View, TextInput, Pressable, ScrollView } from 'react-native';
import {
  Button, Card, Chip, Divider, EmptyState, Field, Heading,
  ProductArtwork, ProductTile, Row, SectionTitle, StatusPill, Txt
} from '../components/UI';
import {
  calculateShipping, canCancelOrder, formatCOP, formatDate,
  nextOrderStatus, startingPrice, totalStock
} from '../domain/marketplace';

function LabelValue({ label, value, c, style }) {
  return (
    <View style={[{ flex: 1, paddingVertical: 7 }, style]}>
      <Txt c={c} size={10} color={c.muted} weight="700">{label.toUpperCase()}</Txt>
      <Txt c={c} size={13} weight="800" style={{ marginTop: 3 }}>{value}</Txt>
    </View>
  );
}

export function CatalogScreen({ app }) {
  const {
    c, scale, filteredProducts, products, filters, setFilters,
    openFilters, openProduct, compareIds, toggleCompare
  } = app;

  const category = filters.category || 'Todos';
  const era = filters.era || 'Todas';

  return (
    <View>
      {(() => {
        const featured = products.find((product) => product.id === 'PROD-001');

        return (
          <Pressable
            onPress={() => openProduct('PROD-001')}
            style={{
              backgroundColor: c.dark,
              borderRadius: 10,
              marginBottom: 13,
              overflow: 'hidden',
              borderWidth: 1,
              borderColor: c.dark
            }}
          >
            <Row style={{ alignItems: 'stretch' }}>
              <View style={{ flex: 1, padding: 13, justifyContent: 'center' }}>
                <View style={{
                  alignSelf: 'flex-start',
                  backgroundColor: c.red,
                  borderRadius: 4,
                  paddingHorizontal: 7,
                  paddingVertical: 4
                }}>
                  <Txt size={8} color="#FFFFFF" weight="900">
                    MÁS VENDIDO · NUEVA LLEGADA
                  </Txt>
                </View>

                <Txt c={c} color="#FFFFFF" size={16} weight="900" style={{ marginTop: 8 }}>
                  Nintendo Switch OLED
                </Txt>

                <Txt c={c} color="#D5D8DD" size={9} style={{ marginTop: 3, lineHeight: 14 }}>
                  Pantalla OLED de 7 pulgadas · Edición Neon
                </Txt>

                <Txt c={c} color="#FFFFFF" size={13} weight="900" style={{ marginTop: 7 }}>
                  Desde $1.649.000
                </Txt>

                <Txt c={c} color="#79D8E8" size={8} weight="800" style={{ marginTop: 7 }}>
                  VER PRODUCTO ›
                </Txt>
              </View>

              <View style={{
                width: 142,
                minHeight: 118,
                backgroundColor: '#22262D',
                alignItems: 'center',
                justifyContent: 'center',
                paddingHorizontal: 5
              }}>
                {featured ? <ProductArtwork product={featured} size="feature" /> : null}

                <View style={{
                  position: 'absolute',
                  right: -22,
                  top: -31,
                  width: 78,
                  height: 78,
                  borderRadius: 40,
                  borderWidth: 10,
                  borderColor: '#FFFFFF0D'
                }} />
              </View>
            </Row>
          </Pressable>
        );
      })()}

      <Row style={{ gap: 8, marginBottom: 12 }}>
        <View style={{
          flex: 1,
          borderWidth: 1,
          borderColor: c.line,
          backgroundColor: c.input,
          borderRadius: 10,
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: 12,
          minHeight: 46
        }}>
          <Txt c={c} color={c.muted} size={16}>⌕</Txt>

          <TextInput
            value={filters.search || ''}
            onChangeText={(value) =>
              setFilters((current) => ({ ...current, search: value }))
            }
            placeholder="Buscar consolas, juegos..."
            placeholderTextColor={c.placeholder}
            style={{
              flex: 1,
              paddingVertical: 8,
              paddingHorizontal: 8,
              color: c.text,
              fontSize: 12
            }}
          />
        </View>

        <Button
          c={c}
          title="Filtros"
          icon="☷"
          variant="secondary"
          onPress={openFilters}
        />
      </Row>

      <Row style={{ flexWrap: 'wrap', marginBottom: 9 }}>
        {['Todos', 'Consolas', 'Juegos', 'Amiibos', 'Periféricos'].map((item) => (
          <Chip
            key={item}
            c={c}
            label={item}
            active={category === item}
            onPress={() =>
              setFilters((current) => ({ ...current, category: item }))
            }
          />
        ))}
      </Row>

      <Row style={{ marginBottom: 12 }}>
        {['Todas', 'Actual', 'Retro'].map((item) => (
          <Chip
            key={item}
            c={c}
            label={item}
            active={era === item}
            onPress={() =>
              setFilters((current) => ({ ...current, era: item }))
            }
          />
        ))}

        <View style={{ flex: 1 }} />

        <Txt c={c} size={10} color={c.muted} weight="700">
          {filteredProducts.length} / {products.length} artículos
        </Txt>
      </Row>

      {(filters.brand !== 'Todas' || filters.onlyAvailable || filters.minPrice || filters.maxPrice) ? (
        <Row style={{ flexWrap: 'wrap', marginBottom: 10 }}>
          <StatusPill c={c} label="Filtros activos" tone="cyan" />

          <Pressable
            onPress={() => setFilters({
              search: '',
              category: 'Todos',
              era: 'Todas',
              brand: 'Todas',
              minPrice: '',
              maxPrice: '',
              onlyAvailable: false
            })}
          >
            <Txt c={c} size={11} color={c.red} weight="800" style={{ marginLeft: 9 }}>
              Restablecer
            </Txt>
          </Pressable>
        </Row>
      ) : null}

      {filteredProducts.length === 0 ? (
        <EmptyState
          c={c}
          icon="⌕"
          title="Sin productos para esta combinación"
          detail="Prueba otros criterios o restablece los filtros para volver a ver el catálogo."
          action={
            <Button
              c={c}
              title="Restablecer filtros"
              onPress={() => setFilters({
                search: '',
                category: 'Todos',
                era: 'Todas',
                brand: 'Todas',
                minPrice: '',
                maxPrice: '',
                onlyAvailable: false
              })}
            />
          }
        />
      ) : (
        <View style={{
          flexDirection: 'row',
          flexWrap: 'wrap',
          justifyContent: 'space-between'
        }}>
          {filteredProducts.map((product) => (
            <ProductTile
              key={product.id}
              product={product}
              c={c}
              scale={scale}
              price={formatCOP(startingPrice(product))}
              stock={totalStock(product)}
              onPress={() => openProduct(product.id)}
              onCompare={() => toggleCompare(product.id)}
              compared={compareIds.includes(product.id)}
            />
          ))}
        </View>
      )}

      <Card c={c} style={{ marginTop: 8, backgroundColor: c.cyanSoft }}>
        <Row style={{ justifyContent: 'space-between' }}>
          <View style={{ flex: 1 }}>
            <Txt c={c} size={12} weight="800" color={c.cyan}>
              COMPARADOR INTELIGENTE
            </Txt>

            <Txt c={c} size={11} color={c.muted} style={{ marginTop: 4 }}>
              Selecciona hasta 3 artículos para revisar precio, disponibilidad y atributos.
            </Txt>
          </View>

          <Button
            c={c}
            title={`Ver ${compareIds.length}/3`}
            small
            onPress={() => app.navigate('Compare')}
          />
        </Row>
      </Card>
    </View>
  );
}

export function ProductDetailScreen({ app }) {
  const {
    c, scale, selectedProduct, selectedVariantId, setSelectedVariantId,
    addToCart, questions, questionDraft, setQuestionDraft, submitQuestion,
    simulateQAReply, restockSubscriptions, toggleRestock, simulateRestock,
    relatedProducts, openProduct, openShare
  } = app;

  if (!selectedProduct) {
    return (
      <EmptyState
        c={c}
        title="Producto no encontrado"
        action={<Button c={c} title="Volver a tienda" onPress={() => app.navigate('Catalog')} />}
      />
    );
  }

  const hasVariants = Array.isArray(selectedProduct.variants) && selectedProduct.variants.length > 0;
  const variant = selectedProduct.variants?.find((item) => item.id === selectedVariantId) || null;

  const available = hasVariants
    ? (variant ? variant.stock : totalStock(selectedProduct))
    : selectedProduct.stock;

  const price = hasVariants ? variant?.price : selectedProduct.basePrice;
  const itemQuestions = questions.filter((item) => item.productId === selectedProduct.id);
  const isSubscribed = variant ? restockSubscriptions.includes(variant.id) : false;
  const isSoldOutVariant = hasVariants && variant && variant.stock === 0;

  return (
    <View>
      <Pressable onPress={() => app.navigate('Catalog')} style={{ marginBottom: 13 }}>
        <Txt c={c} size={12} color={c.cyan} weight="800">
          ‹ VOLVER AL CATÁLOGO
        </Txt>
      </Pressable>

      <View style={{
        height: 190,
        backgroundColor: selectedProduct.imageTone || c.soft,
        borderRadius: 11,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 13,
        borderWidth: 1,
        borderColor: c.line,
        overflow: 'hidden'
      }}>
        <ProductArtwork product={selectedProduct} variant={variant} size="hero" />

        <View style={{ position: 'absolute', top: 10, left: 10 }}>
          <StatusPill c={c} label={`${selectedProduct.category} · ${selectedProduct.era}`} tone="gray" />
        </View>

        <View style={{ position: 'absolute', right: 10, bottom: 8 }}>
          <Txt c={c} size={8} color={c.muted} weight="800">{selectedProduct.id}</Txt>
        </View>
      </View>

      <Heading
        title={selectedProduct.name}
        subtitle={selectedProduct.description}
        action={
          <Button
            c={c}
            title="Compartir"
            small
            variant="secondary"
            onPress={() => openShare(selectedProduct, variant)}
          />
        }
      />

      <Card c={c}>
        <Row style={{ justifyContent: 'space-between' }}>
          <Txt c={c} size={10} color={c.muted} weight="700">
            {hasVariants ? 'SELECCIONA UNA VARIANTE' : 'PRECIO'}
          </Txt>

          <StatusPill
            c={c}
            label={available > 0 ? `${available} disponibles` : 'Agotado'}
            tone={available > 0 ? 'green' : 'red'}
          />
        </Row>

        {hasVariants ? (
          <View style={{ marginTop: 8 }}>
            {selectedProduct.variants.map((item) => {
              const active = item.id === selectedVariantId;

              return (
                <Pressable
                  key={item.id}
                  onPress={() => setSelectedVariantId(item.id)}
                  style={{
                    padding: 11,
                    borderRadius: 10,
                    borderWidth: 1,
                    borderColor: active ? c.cyan : c.line,
                    backgroundColor: active ? c.cyanSoft : c.input,
                    marginTop: 7
                  }}
                >
                  <Row style={{ justifyContent: 'space-between' }}>
                    <View style={{ flex: 1, paddingRight: 8 }}>
                      <Row>
                        <View style={{
                          width: 16,
                          height: 16,
                          borderRadius: 8,
                          borderWidth: 2,
                          borderColor: active ? c.cyan : c.muted,
                          marginRight: 8,
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}>
                          {active ? (
                            <View style={{
                              width: 7,
                              height: 7,
                              borderRadius: 4,
                              backgroundColor: c.cyan
                            }} />
                          ) : null}
                        </View>

                        <Txt c={c} size={12} weight="800" style={{ flex: 1 }}>
                          {item.label}
                        </Txt>
                      </Row>

                      <Txt
                        c={c}
                        size={10}
                        color={item.stock > 0 ? '#18764D' : '#B4232E'}
                        style={{ marginLeft: 24, marginTop: 4 }}
                      >
                        {item.stock > 0 ? `${item.stock} unidades disponibles` : 'Agotado · Stock 0'}
                      </Txt>
                    </View>

                    <Txt c={c} size={12} weight="800">{formatCOP(item.price)}</Txt>
                  </Row>
                </Pressable>
              );
            })}
          </View>
        ) : null}

        <Divider c={c} />

        <Row style={{ justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <View>
            <Txt c={c} size={10} color={c.muted} weight="700">PRECIO DE COMPRA</Txt>

            <Txt c={c} size={22} weight="900" style={{ marginTop: 3 }}>
              {price ? formatCOP(price) : 'Elige variante'}
            </Txt>
          </View>

          <Button
            c={c}
            title={
              hasVariants && !variant
                ? 'Elegir variante'
                : available > 0
                  ? 'Agregar al carrito'
                  : 'Compra bloqueada'
            }
            disabled={available <= 0 || (hasVariants && !variant)}
            onPress={() => addToCart(selectedProduct, variant)}
            style={{ minWidth: 142 }}
          />
        </Row>

        {hasVariants && !variant ? (
          <Txt c={c} size={10} color={c.red} style={{ marginTop: 8 }}>
            Selecciona una variante antes de agregar el artículo.
          </Txt>
        ) : null}

        {available <= 0 && variant ? (
          <Txt c={c} size={10} color={c.red} style={{ marginTop: 8 }}>
            Compra bloqueada · Variante agotada.
          </Txt>
        ) : null}
      </Card>

      {isSoldOutVariant ? (
        <Card c={c} style={{ marginTop: 13, borderColor: c.cyan, backgroundColor: c.cyanSoft }}>
          <Row style={{ justifyContent: 'space-between' }}>
            <Txt c={c} size={13} weight="800" color={c.cyan}>Aviso de reposición · HU30</Txt>
            <StatusPill c={c} label="Stock 0" tone="red" />
          </Row>

          <Txt c={c} size={11} color={c.muted} style={{ lineHeight: 17, marginTop: 7 }}>
            Recibe una notificación interna cuando esta variante vuelva a estar disponible.
          </Txt>

          <Button
            c={c}
            title={isSubscribed ? '✓ Suscrito · dejar de avisarme' : 'Avisarme cuando haya stock'}
            variant={isSubscribed ? 'secondary' : 'primary'}
            onPress={() => toggleRestock(variant.id)}
            style={{ marginTop: 10 }}
          />

          {isSubscribed ? (
            <Button
              c={c}
              title="Simular reposición (+3 unidades)"
              variant="secondary"
              onPress={() => simulateRestock(variant.id)}
              style={{ marginTop: 8 }}
            />
          ) : null}
        </Card>
      ) : null}

      <SectionTitle c={c} title="Ficha técnica" />

      <Card c={c}>
        {Object.entries(selectedProduct.attributes || {}).map(([key, value]) => (
          <Row key={key} style={{ justifyContent: 'space-between', paddingVertical: 6 }}>
            <Txt c={c} size={11} color={c.muted}>{key}</Txt>
            <Txt c={c} size={11} weight="700">{value}</Txt>
          </Row>
        ))}
      </Card>

      <SectionTitle
        c={c}
        title="Preguntas del producto · HU24"
        right={<Txt c={c} size={10} color={c.muted}>{itemQuestions.length} consultas</Txt>}
      />

      <Card c={c}>
        <Field
          c={c}
          label="Escribe tu pregunta"
          value={questionDraft}
          onChangeText={setQuestionDraft}
          placeholder="Ej. ¿Incluye adaptador de corriente?"
          multiline
        />

        <Row style={{ justifyContent: 'space-between' }}>
          <Txt c={c} size={10} color={questionDraft.trim().length >= 10 ? '#18764D' : c.muted}>
            {questionDraft.trim().length}/10 caracteres mínimos
          </Txt>

          <Button c={c} title="Publicar pregunta" small onPress={() => submitQuestion(selectedProduct.id)} />
        </Row>

        {itemQuestions.length ? <Divider c={c} /> : null}

        {itemQuestions.map((question) => (
          <View key={question.id} style={{
            paddingVertical: 9,
            borderBottomWidth: 1,
            borderBottomColor: c.line
          }}>
            <Row style={{ alignItems: 'flex-start' }}>
              <Txt c={c} color={c.cyan} size={14} weight="800" style={{ marginRight: 7 }}>Q.</Txt>

              <View style={{ flex: 1 }}>
                <Txt c={c} size={12} weight="700">{question.question}</Txt>

                <Txt c={c} size={9} color={c.muted} style={{ marginTop: 4 }}>
                  {formatDate(question.date)} · {question.status}
                </Txt>
              </View>
            </Row>

            {question.answer ? (
              <View style={{
                marginLeft: 22,
                backgroundColor: c.greenSoft,
                padding: 9,
                borderRadius: 8,
                marginTop: 8
              }}>
                <Txt c={c} size={9} color="#18764D" weight="800">
                  RESPUESTA SIMULADA (DEMO)
                </Txt>

                <Txt c={c} size={11} style={{ marginTop: 4, lineHeight: 17 }}>
                  {question.answer}
                </Txt>
              </View>
            ) : (
              <Button
                c={c}
                title="Simular respuesta"
                small
                variant="secondary"
                onPress={() => simulateQAReply(question.id)}
                style={{ alignSelf: 'flex-start', marginLeft: 22, marginTop: 8 }}
              />
            )}
          </View>
        ))}
      </Card>

      {relatedProducts.length ? (
        <>
          <SectionTitle
            c={c}
            title="Productos relacionados · HU31"
            right={<Txt c={c} size={10} color={c.muted}>Misma categoría</Txt>}
          />

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: 9, paddingBottom: 4 }}
          >
            {relatedProducts.map((product) => (
              <ProductTile
                key={product.id}
                product={product}
                c={c}
                small
                price={formatCOP(startingPrice(product))}
                stock={totalStock(product)}
                onPress={() => openProduct(product.id)}
              />
            ))}
          </ScrollView>
        </>
      ) : null}

      <View style={{ height: 15 }} />
    </View>
  );
}

export function CompareScreen({ app }) {
  const { c, compareProducts, toggleCompare, navigate, openProduct } = app;

  return (
    <View>
      <Heading
        title="Comparador 3×"
        subtitle="Contrasta precio, disponibilidad y especificaciones sin modificar el carrito ni el inventario."
        action={<StatusPill c={c} label={`${compareProducts.length}/3`} tone="cyan" />}
      />

      {compareProducts.length === 0 ? (
        <EmptyState
          c={c}
          title="Aún no hay productos"
          detail="Vuelve al catálogo y usa el botón +3 para agregar hasta tres productos."
          action={<Button c={c} title="Ir al catálogo" onPress={() => navigate('Catalog')} />}
        />
      ) : (
        <>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: 10, paddingBottom: 12 }}
          >
            {compareProducts.map((product) => (
              <Card key={product.id} c={c} style={{ width: 205 }}>
                <View style={{
                  height: 90,
                  backgroundColor: product.imageTone,
                  borderRadius: 8,
                  alignItems: 'center',
                  justifyContent: 'center',
                  overflow: 'hidden'
                }}>
                  <ProductArtwork
                    product={product}
                    variant={product.variants?.find(
                      (item) => item.id === line.variantId
                    )}
                    size="mini"
                  />
                </View>

                <Txt c={c} size={9} color={c.muted} weight="700" style={{ marginTop: 10 }}>
                  {product.category.toUpperCase()} · {product.era.toUpperCase()}
                </Txt>

                <Txt c={c} size={13} weight="800" style={{ marginTop: 4, minHeight: 38 }}>
                  {product.name}
                </Txt>

                <Txt c={c} size={14} weight="900" style={{ marginTop: 7 }}>
                  {formatCOP(startingPrice(product))}
                </Txt>

                <StatusPill
                  c={c}
                  label={totalStock(product) > 0 ? `${totalStock(product)} unidades` : 'Agotado'}
                  tone={totalStock(product) > 0 ? 'green' : 'red'}
                />

                <Divider c={c} />

                {Object.entries(product.attributes || {}).map(([key, value]) => (
                  <View key={key} style={{ marginBottom: 7 }}>
                    <Txt c={c} size={9} color={c.muted}>{key}</Txt>
                    <Txt c={c} size={11} weight="700">{value}</Txt>
                  </View>
                ))}

                <Button
                  c={c}
                  title="Ver ficha"
                  small
                  variant="secondary"
                  onPress={() => openProduct(product.id)}
                  style={{ marginTop: 5 }}
                />

                <Button
                  c={c}
                  title="Retirar"
                  small
                  variant="ghost"
                  onPress={() => toggleCompare(product.id)}
                  style={{ marginTop: 4 }}
                />
              </Card>
            ))}
          </ScrollView>

          <Card c={c} style={{ backgroundColor: c.cyanSoft }}>
            <Txt c={c} size={12} weight="800" color={c.cyan}>
              Comparación independiente
            </Txt>

            <Txt c={c} size={11} color={c.muted} style={{ marginTop: 4, lineHeight: 17 }}>
              La lista de comparación tiene su propio estado. Agregar o retirar productos no cambia las cantidades del carrito.
            </Txt>
          </Card>
        </>
      )}

      <SectionTitle c={c} title="Explora más opciones" />
      <Button c={c} title="Volver al catálogo" variant="secondary" onPress={() => navigate('Catalog')} />
    </View>
  );
}

export function CartScreen({ app }) {
  const {
    c, cartItems, products, changeCartQuantity, removeCartItem,
    addresses, selectedAddressId, setSelectedAddressId, openAddressModal,
    shippingMode, setShippingMode, subtotal, shipping, total, confirmOrder
  } = app;

  const address = addresses.find((item) => item.id === selectedAddressId);
  const shippingBlocked = shipping.cost == null;

  return (
    <View>
      <Heading
        title="Tu carrito"
        subtitle="Revisa las variantes y calcula tu entrega antes de confirmar."
        action={<StatusPill c={c} label={`${cartItems.reduce((sum, item) => sum + item.quantity, 0)} uds`} tone="cyan" />}
      />

      {cartItems.length === 0 ? (
        <EmptyState
          c={c}
          title="Tu carrito está vacío"
          detail="Descubre el catálogo y agrega un producto o una variante disponible."
          action={<Button c={c} title="Ir a la tienda" onPress={() => app.navigate('Catalog')} />}
        />
      ) : (
        <>
          {cartItems.map((line) => {
            const product = products.find((item) => item.id === line.productId);
            if (!product) return null;

            const stock = line.variantId
              ? product.variants?.find((item) => item.id === line.variantId)?.stock || 0
              : product.stock;

            return (
              <Card key={`${line.productId}-${line.variantId || 'base'}`} c={c} style={{ marginBottom: 9 }}>
                <Row style={{ alignItems: 'flex-start' }}>
                  <View style={{
                    width: 64,
                    height: 58,
                    backgroundColor: product.imageTone,
                    borderRadius: 8,
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginRight: 10,
                    overflow: 'hidden'
                  }}>
                    <ProductArtwork
                      product={product}
                      variant={product.variants?.find(
                        (item) => item.id === line.variantId
                      )}
                      size="mini"
                    />
                  </View>

                  <View style={{ flex: 1 }}>
                    <Txt c={c} size={12} weight="800">{product.name}</Txt>

                    {line.variantLabel ? (
                      <Txt c={c} size={10} color={c.cyan} weight="700" style={{ marginTop: 3 }}>
                        {line.variantLabel}
                      </Txt>
                    ) : null}

                    <Txt c={c} size={12} weight="800" style={{ marginTop: 6 }}>
                      {formatCOP(line.unitPrice)}
                    </Txt>
                  </View>

                  <Pressable onPress={() => removeCartItem(line.productId, line.variantId)}>
                    <Txt c={c} color={c.red} size={18} weight="800">×</Txt>
                  </Pressable>
                </Row>

                <Divider c={c} />

                <Row style={{ justifyContent: 'space-between' }}>
                  <Txt c={c} size={10} color={c.muted}>Stock disponible: {stock}</Txt>

                  <Row style={{ gap: 12 }}>
                    <Button
                      c={c}
                      title="−"
                      small
                      variant="secondary"
                      disabled={line.quantity <= 1}
                      onPress={() => changeCartQuantity(line, -1)}
                      style={{ minWidth: 34 }}
                    />

                    <Txt c={c} size={13} weight="800">{line.quantity}</Txt>

                    <Button
                      c={c}
                      title="+"
                      small
                      variant="secondary"
                      disabled={line.quantity >= stock}
                      onPress={() => changeCartQuantity(line, 1)}
                      style={{ minWidth: 34 }}
                    />
                  </Row>
                </Row>

                <Txt c={c} size={11} color={c.muted} style={{ textAlign: 'right', marginTop: 7 }}>
                  Subtotal de línea · {formatCOP(line.unitPrice * line.quantity)}
                </Txt>
              </Card>
            );
          })}

          <SectionTitle c={c} title="Entrega y envío · HU25 / HU26" />

          <Card c={c}>
            <Row style={{ justifyContent: 'space-between' }}>
              <View>
                <Txt c={c} size={13} weight="800">Dirección de entrega</Txt>
                <Txt c={c} size={10} color={c.muted} style={{ marginTop: 3 }}>
                  La dirección principal es solo la preferencia predeterminada.
                </Txt>
              </View>

              <Button
                c={c}
                title="Gestionar"
                small
                variant="secondary"
                onPress={() => openAddressModal()}
              />
            </Row>

            {addresses.length ? addresses.map((item) => (
              <Pressable
                key={item.id}
                onPress={() => setSelectedAddressId(item.id)}
                style={{
                  padding: 10,
                  marginTop: 8,
                  borderWidth: 1,
                  borderRadius: 9,
                  borderColor: selectedAddressId === item.id ? c.cyan : c.line,
                  backgroundColor: selectedAddressId === item.id ? c.cyanSoft : c.input
                }}
              >
                <Row>
                  <View style={{
                    width: 16,
                    height: 16,
                    borderRadius: 8,
                    borderWidth: 2,
                    borderColor: selectedAddressId === item.id ? c.cyan : c.muted,
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginRight: 8
                  }}>
                    {selectedAddressId === item.id ? (
                      <View style={{
                        width: 7,
                        height: 7,
                        borderRadius: 4,
                        backgroundColor: c.cyan
                      }} />
                    ) : null}
                  </View>

                  <View style={{ flex: 1 }}>
                    <Row style={{ gap: 6, flexWrap: 'wrap' }}>
                      <Txt c={c} size={11} weight="800">{item.alias}</Txt>
                      {item.principal ? <StatusPill c={c} label="Principal" tone="cyan" /> : null}
                    </Row>

                    <Txt c={c} size={10} color={c.muted} style={{ marginTop: 3 }}>
                      {item.municipio} · {item.description}
                    </Txt>
                  </View>
                </Row>
              </Pressable>
            )) : (
              <EmptyState
                c={c}
                title="Agrega una dirección"
                detail="Necesitas un destino válido para confirmar tu pedido."
              />
            )}

            <Divider c={c} />

            <Txt c={c} size={11} weight="800">Modalidad de envío</Txt>

            <Row style={{ gap: 8, marginTop: 9 }}>
              <Pressable
                onPress={() => setShippingMode('Estandar')}
                style={{
                  flex: 1,
                  borderWidth: 1,
                  borderRadius: 9,
                  borderColor: shippingMode === 'Estandar' ? c.cyan : c.line,
                  backgroundColor: shippingMode === 'Estandar' ? c.cyanSoft : c.input,
                  padding: 10
                }}
              >
                <Txt c={c} size={11} weight="800">Estándar</Txt>
                <Txt c={c} size={10} color={c.muted} style={{ marginTop: 3 }}>Según municipio</Txt>
              </Pressable>

              <Pressable
                onPress={() => setShippingMode('Expres')}
                style={{
                  flex: 1,
                  borderWidth: 1,
                  borderRadius: 9,
                  borderColor: shippingMode === 'Expres' ? c.cyan : c.line,
                  backgroundColor: shippingMode === 'Expres' ? c.cyanSoft : c.input,
                  padding: 10
                }}
              >
                <Txt c={c} size={11} weight="800">Exprés</Txt>
                <Txt c={c} size={10} color={c.muted} style={{ marginTop: 3 }}>Entrega prioritaria</Txt>
              </Pressable>
            </Row>

            {address ? (
              <View style={{ marginTop: 10, backgroundColor: c.soft, borderRadius: 8, padding: 10 }}>
                {shippingBlocked ? (
                  <Txt c={c} size={11} color={c.red} weight="800">
                    Exprés no disponible fuera de cobertura. Selecciona Estándar.
                  </Txt>
                ) : (
                  <>
                    <Row style={{ justifyContent: 'space-between' }}>
                      <Txt c={c} size={10} color={c.muted}>Tarifa para {address.municipio}</Txt>
                      <Txt c={c} size={12} weight="800">{formatCOP(shipping.cost)}</Txt>
                    </Row>

                    <Txt c={c} size={10} color={c.muted} style={{ marginTop: 4 }}>
                      Plazo estimado: {shipping.eta}
                    </Txt>
                  </>
                )}
              </View>
            ) : null}
          </Card>

          <SectionTitle c={c} title="Resumen de compra" />

          <Card c={c}>
            <Row style={{ justifyContent: 'space-between', marginBottom: 8 }}>
              <Txt c={c} size={11} color={c.muted}>Subtotal ({cartItems.length} líneas)</Txt>
              <Txt c={c} size={12} weight="700">{formatCOP(subtotal)}</Txt>
            </Row>

            <Row style={{ justifyContent: 'space-between', marginBottom: 8 }}>
              <Txt c={c} size={11} color={c.muted}>
                Envío {shippingMode === 'Expres' ? 'exprés' : 'estándar'}
              </Txt>
              <Txt c={c} size={12} weight="700">
                {shippingBlocked ? 'No disponible' : formatCOP(shipping.cost)}
              </Txt>
            </Row>

            <Divider c={c} />

            <Row style={{ justifyContent: 'space-between' }}>
              <Txt c={c} size={13} weight="800">Total a pagar</Txt>
              <Txt c={c} size={19} weight="900" color={c.red}>
                {shippingBlocked ? '—' : formatCOP(total)}
              </Txt>
            </Row>

            <Button
              c={c}
              title="Confirmar pedido simulado"
              disabled={!cartItems.length || !address || shippingBlocked}
              onPress={confirmOrder}
              style={{ marginTop: 13 }}
            />

            <Txt c={c} size={9} color={c.muted} style={{ textAlign: 'center', marginTop: 8 }}>
              Prototipo académico · No se realiza ningún cobro real.
            </Txt>
          </Card>
        </>
      )}
    </View>
  );
}

export function OrdersScreen({ app }) {
  const { c, orders, advanceOrder, cancelOrder, requestReturn } = app;

  return (
    <View>
      <Heading
        title="Tus pedidos"
        subtitle="Seguimiento cronológico, cancelación controlada y solicitudes posventa."
        action={<StatusPill c={c} label={`${orders.length} pedidos`} tone="cyan" />}
      />

      {orders.length === 0 ? (
        <EmptyState
          c={c}
          title="Todavía no tienes pedidos"
          detail="Cuando confirmes una compra, aparecerá aquí su seguimiento."
        />
      ) : orders.map((order) => {
        const next = nextOrderStatus(order.status);
        const cancellable = canCancelOrder(order);
        const statusTone = order.status === 'Entregado'
          ? 'green'
          : order.status === 'Cancelado'
            ? 'red'
            : 'cyan';

        return (
          <Card key={order.id} c={c} style={{ marginBottom: 12 }}>
            <Row style={{ justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <View style={{ flex: 1 }}>
                <Txt c={c} size={13} weight="900">Pedido #{order.id}</Txt>
                <Txt c={c} size={9} color={c.muted} style={{ marginTop: 4 }}>
                  {formatDate(order.date)}
                </Txt>
              </View>

              <StatusPill c={c} label={order.status} tone={statusTone} />
            </Row>

            <Divider c={c} />

            {order.items.map((item, index) => (
              <Row
                key={`${item.productId}-${index}`}
                style={{ justifyContent: 'space-between', marginBottom: 6 }}
              >
                <View style={{ flex: 1, paddingRight: 7 }}>
                  <Txt c={c} size={11} weight="700">{item.productName}</Txt>

                  {item.variantLabel ? (
                    <Txt c={c} size={9} color={c.muted}>{item.variantLabel}</Txt>
                  ) : null}

                  <Txt c={c} size={9} color={c.muted}>Cantidad: {item.quantity}</Txt>
                </View>

                <Txt c={c} size={11} weight="800">
                  {formatCOP(item.unitPrice * item.quantity)}
                </Txt>
              </Row>
            ))}

            <View style={{ backgroundColor: c.soft, borderRadius: 9, padding: 10, marginTop: 7 }}>
              <Txt c={c} size={10} weight="800">CRONOLOGÍA DE ESTADOS · HU27</Txt>

              {order.history.map((step, index) => (
                <Row
                  key={`${step.status}-${index}`}
                  style={{ alignItems: 'flex-start', marginTop: 9 }}
                >
                  <View style={{
                    width: 18,
                    height: 18,
                    borderRadius: 9,
                    backgroundColor: step.status === 'Cancelado' ? c.red : '#18764D',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginRight: 8
                  }}>
                    <Txt c={c} color="#FFFFFF" size={9} weight="900">✓</Txt>
                  </View>

                  <View style={{ flex: 1 }}>
                    <Txt c={c} size={10} weight="800">{step.status}</Txt>
                    <Txt c={c} size={9} color={c.muted}>{formatDate(step.date)}</Txt>
                  </View>
                </Row>
              ))}

              {order.status === 'Cancelado' ? (
                <Txt c={c} size={10} color={c.red} weight="800" style={{ marginTop: 8 }}>
                  Inventario reintegrado: {order.reintegrado ? 'Sí · una sola vez' : 'No'}
                </Txt>
              ) : null}
            </View>

            <Row style={{ justifyContent: 'space-between', marginTop: 10 }}>
              <Txt c={c} size={10} color={c.muted}>
                Envío · {order.shippingEta || 'Según municipio'}
              </Txt>
              <Txt c={c} size={12} weight="900">
                {formatCOP(order.total ?? order.subtotal + order.shippingCost)}
              </Txt>
            </Row>

            {next ? (
              <Button
                c={c}
                title={`Simular avance de entrega → ${next}`}
                onPress={() => advanceOrder(order.id)}
                style={{ marginTop: 10 }}
              />
            ) : null}

            {cancellable ? (
              <Button
                c={c}
                title="Cancelar pedido · reintegrar stock"
                variant="danger"
                onPress={() => cancelOrder(order.id)}
                style={{ marginTop: 7 }}
              />
            ) : null}

            {['En camino', 'Entregado'].includes(order.status) ? (
              <Txt c={c} size={9} color={c.muted} style={{ marginTop: 8 }}>
                Cancelación bloqueada: el pedido ya está {order.status}.
              </Txt>
            ) : null}

            {order.status === 'Entregado' && !order.returnStatus ? (
              <Button
                c={c}
                title="Solicitar devolución simulada"
                variant="secondary"
                onPress={() => requestReturn(order.id)}
                style={{ marginTop: 8 }}
              />
            ) : null}

            {order.returnStatus ? (
              <View style={{ marginTop: 8 }}>
                <StatusPill c={c} label={order.returnStatus} tone="cyan" />
              </View>
            ) : null}
          </Card>
        );
      })}
    </View>
  );
}

export function NotificationsScreen({ app }) {
  const { c, notifications, markNotificationRead, markAllRead } = app;
  const unread = notifications.filter((item) => !item.read).length;

  return (
    <View>
      <Heading
        title="Centro de notificaciones"
        subtitle="Avisos internos de pedidos y reposiciones. No son notificaciones push."
        action={<StatusPill c={c} label={`${unread} sin leer`} tone={unread ? 'cyan' : 'gray'} />}
      />

      {unread > 0 ? (
        <Button
          c={c}
          title="Marcar todas como leídas"
          small
          variant="secondary"
          onPress={markAllRead}
          style={{ alignSelf: 'flex-start', marginBottom: 10 }}
        />
      ) : null}

      {notifications.length === 0 ? (
        <EmptyState
          c={c}
          title="No tienes avisos"
          detail="Las novedades del pedido y del inventario aparecerán aquí."
        />
      ) : notifications.map((item) => (
        <Pressable key={item.id} onPress={() => markNotificationRead(item.id)}>
          <Card
            c={c}
            style={{
              marginBottom: 9,
              borderLeftWidth: 4,
              borderLeftColor: item.read
                ? c.line
                : item.type === 'stock'
                  ? c.cyan
                  : c.red,
              opacity: item.read ? 0.72 : 1,
              backgroundColor: item.read ? c.card : c.cyanSoft
            }}
          >
            <Row style={{ justifyContent: 'space-between' }}>
              <Txt c={c} size={12} weight="800" style={{ flex: 1, paddingRight: 8 }}>
                {item.title}
              </Txt>

              {!item.read
                ? <StatusPill c={c} label="Nuevo" tone="cyan" />
                : <StatusPill c={c} label="Leído" tone="gray" />}
            </Row>

            <Txt c={c} size={11} color={c.muted} style={{ marginTop: 6, lineHeight: 17 }}>
              {item.message}
            </Txt>

            <Txt c={c} size={9} color={c.muted} style={{ marginTop: 8 }}>
              {formatDate(item.date)}
            </Txt>
          </Card>
        </Pressable>
      ))}
    </View>
  );
}

export function SupportScreen({ app }) {
  const {
    c, orders, tickets, selectedSupportOrderId, setSelectedSupportOrderId,
    supportReason, setSupportReason, supportDescription, setSupportDescription,
    submitTicket, simulateTicketReply
  } = app;

  return (
    <View>
      <Heading
        title="Centro de ayuda"
        subtitle="Crea solicitudes vinculadas a tus pedidos y consulta su estado."
        action={<StatusPill c={c} label="HU32" tone="cyan" />}
      />

      <Card c={c}>
        <Txt c={c} size={13} weight="800">Nueva solicitud de soporte</Txt>

        <Txt c={c} size={10} color={c.muted} style={{ marginTop: 4, marginBottom: 12 }}>
          Elige un pedido, motivo y describe el caso (mínimo 15 caracteres).
        </Txt>

        <Txt c={c} size={10} color={c.muted} weight="700" style={{ marginBottom: 7 }}>
          PEDIDO ASOCIADO
        </Txt>

        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 12 }}>
          {orders.map((order) => (
            <Chip
              key={order.id}
              c={c}
              label={`#${order.id.slice(-4)}`}
              active={selectedSupportOrderId === order.id}
              onPress={() => setSelectedSupportOrderId(order.id)}
            />
          ))}
        </View>

        <Txt c={c} size={10} color={c.muted} weight="700" style={{ marginBottom: 7 }}>
          MOTIVO
        </Txt>

        <Row style={{ flexWrap: 'wrap' }}>
          {['Entrega', 'Producto', 'Otro'].map((item) => (
            <Chip
              key={item}
              c={c}
              label={item}
              active={supportReason === item}
              onPress={() => setSupportReason(item)}
            />
          ))}
        </Row>

        <Field
          c={c}
          label="Descripción del caso"
          value={supportDescription}
          onChangeText={setSupportDescription}
          placeholder="Cuéntanos qué sucedió con tu pedido..."
          multiline
        />

        <Row style={{ justifyContent: 'space-between' }}>
          <Txt
            c={c}
            size={10}
            color={supportDescription.trim().length >= 15 ? '#18764D' : c.muted}
          >
            {supportDescription.trim().length} / 15 caracteres mínimos
          </Txt>

          <Button c={c} title="Crear ticket" onPress={submitTicket} />
        </Row>
      </Card>

      <SectionTitle
        c={c}
        title="Historial de solicitudes"
        right={<Txt c={c} size={10} color={c.muted}>{tickets.length} casos</Txt>}
      />

      {tickets.length === 0 ? (
        <EmptyState c={c} title="No hay tickets registrados" />
      ) : tickets.map((ticket) => (
        <Card key={ticket.id} c={c} style={{ marginBottom: 9 }}>
          <Row style={{ justifyContent: 'space-between' }}>
            <Txt c={c} size={12} weight="900">Caso #{ticket.id}</Txt>

            <StatusPill
              c={c}
              label={ticket.status}
              tone={ticket.status === 'Respondido' ? 'green' : 'cyan'}
            />
          </Row>

          <Txt c={c} size={10} color={c.muted} style={{ marginTop: 4 }}>
            Pedido #{ticket.orderId} · {ticket.reason} · {formatDate(ticket.date)}
          </Txt>

          <Txt c={c} size={11} style={{ marginTop: 8, lineHeight: 17 }}>
            {ticket.description}
          </Txt>

          {ticket.answer ? (
            <View style={{ marginTop: 9, backgroundColor: c.greenSoft, padding: 10, borderRadius: 8 }}>
              <Txt c={c} size={9} color="#18764D" weight="800">
                RESPUESTA SIMULADA (DEMO)
              </Txt>

              <Txt c={c} size={11} style={{ marginTop: 4 }}>
                {ticket.answer}
              </Txt>
            </View>
          ) : (
            <Button
              c={c}
              title="Simular respuesta"
              variant="secondary"
              small
              onPress={() => simulateTicketReply(ticket.id)}
              style={{ marginTop: 10, alignSelf: 'flex-start' }}
            />
          )}
        </Card>
      ))}
    </View>
  );
}

export function SettingsScreen({ app }) {
  const {
    c, darkMode, setDarkMode, largeFont, setLargeFont,
    addresses, openAddressModal, setPrimaryAddress, navigate
  } = app;

  return (
    <View>
      <Heading
        title="Studio UI 2.0"
        subtitle="Preferencias de apariencia, accesibilidad y datos de demostración."
      />

      <Card c={c}>
        <Txt c={c} size={13} weight="800">Apariencia</Txt>

        <Row style={{ justifyContent: 'space-between', marginTop: 13 }}>
          <View style={{ flex: 1, paddingRight: 10 }}>
            <Txt c={c} size={12} weight="700">Dark Studio UI</Txt>
            <Txt c={c} size={10} color={c.muted} style={{ marginTop: 3 }}>
              Superficie Obsidiana #0F1115
            </Txt>
          </View>

          <Button
            c={c}
            title={darkMode ? 'Activado' : 'Activar'}
            small
            variant={darkMode ? 'primary' : 'secondary'}
            onPress={() => setDarkMode(!darkMode)}
          />
        </Row>

        <Divider c={c} />

        <Row style={{ justifyContent: 'space-between' }}>
          <View style={{ flex: 1, paddingRight: 10 }}>
            <Txt c={c} size={12} weight="700">Escala tipográfica (+20%)</Txt>
            <Txt c={c} size={10} color={c.muted} style={{ marginTop: 3 }}>
              Aumenta el tamaño de textos y controles.
            </Txt>
          </View>

          <Button
            c={c}
            title={largeFont ? 'Activada' : 'Activar'}
            small
            variant={largeFont ? 'primary' : 'secondary'}
            onPress={() => setLargeFont(!largeFont)}
          />
        </Row>
      </Card>

      <SectionTitle
        c={c}
        title="Libreta de direcciones · HU25"
        right={
          <Button
            c={c}
            title="Nueva"
            small
            onPress={() => openAddressModal()}
          />
        }
      />

      {addresses.map((address) => (
        <Card key={address.id} c={c} style={{ marginBottom: 8 }}>
          <Row style={{ justifyContent: 'space-between' }}>
            <Txt c={c} size={12} weight="800">{address.alias}</Txt>
            {address.principal ? <StatusPill c={c} label="Principal" tone="cyan" /> : null}
          </Row>

          <Txt c={c} size={10} color={c.muted} style={{ marginTop: 4 }}>
            {address.municipio} · {address.description}
          </Txt>

          <Row style={{ gap: 7, marginTop: 9 }}>
            <Button
              c={c}
              title="Editar"
              variant="secondary"
              small
              onPress={() => openAddressModal(address)}
            />

            {!address.principal ? (
              <Button
                c={c}
                title="Hacer principal"
                variant="ghost"
                small
                onPress={() => setPrimaryAddress(address.id)}
              />
            ) : null}
          </Row>
        </Card>
      ))}

      <SectionTitle c={c} title="Información del prototipo" />

      <Card c={c}>
        <Txt c={c} size={12} weight="800">
          CoinBox_Store · Marketplace 2.0
        </Txt>

        <Txt c={c} size={11} color={c.muted} style={{ marginTop: 5, lineHeight: 18 }}>
          Tu universo Nintendo, actual y retro, en un solo lugar.
        </Txt>

        <Txt c={c} size={10} color={c.muted} style={{ marginTop: 8 }}>
          React Native · Expo · JavaScript · useState / useMemo
        </Txt>

        <Txt c={c} size={10} color={c.muted} style={{ marginTop: 4 }}>
          Las operaciones de compra, entrega, reposición y soporte son simuladas y locales.
        </Txt>
      </Card>

      <SectionTitle c={c} title="Accesos rápidos" />

      <Button
        c={c}
        title="Ver notificaciones internas"
        variant="secondary"
        onPress={() => navigate('Notifications')}
        style={{ marginBottom: 8 }}
      />

      <Button
        c={c}
        title="Abrir centro de ayuda"
        variant="secondary"
        onPress={() => navigate('Support')}
      />
    </View>
  );
}