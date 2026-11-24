import React from 'react';
import { useEffect, useState } from 'react';
import { Modal, View, ScrollView, Pressable, Share } from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { Button, Card, Chip, Field, Heading, Row, Txt } from './UI';
import { formatCOP } from '../domain/marketplace';

const MUNICIPALITIES = ['Mosquera', 'Funza', 'Madrid', 'Otro municipio'];

export function FilterModal({ visible, onClose, c, filters, setFilters, onApply, onReset }) {
  const update = (key, value) => setFilters((current) => ({ ...current, [key]: value }));
  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={{ flex: 1, backgroundColor: '#0008', justifyContent: 'flex-end' }}>
        <View style={{ maxHeight: '88%', backgroundColor: c.bg, borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 18 }}>
          <View style={{ width: 38, height: 4, borderRadius: 3, backgroundColor: c.line, alignSelf: 'center', marginBottom: 14 }} />
          <Heading title="Filtros combinados" subtitle="Los criterios se aplican simultáneamente (AND)." action={<Pressable onPress={onClose}><Txt c={c} size={22}>×</Txt></Pressable>} />
          <ScrollView keyboardShouldPersistTaps="handled">
            <Txt c={c} size={10} color={c.muted} weight="800" style={{ marginBottom: 8 }}>CATEGORÍA</Txt>
            <Row style={{ flexWrap: 'wrap' }}>{['Todos', 'Consolas', 'Juegos', 'Amiibos', 'Periféricos'].map((item) => <Chip key={item} c={c} label={item} active={filters.category === item} onPress={() => update('category', item)} />)}</Row>
            <Txt c={c} size={10} color={c.muted} weight="800" style={{ marginTop: 12, marginBottom: 8 }}>ÉPOCA</Txt>
            <Row>{['Todas', 'Actual', 'Retro'].map((item) => <Chip key={item} c={c} label={item} active={filters.era === item} onPress={() => update('era', item)} />)}</Row>
            <Txt c={c} size={10} color={c.muted} weight="800" style={{ marginTop: 12, marginBottom: 8 }}>MARCA</Txt>
            <Row>{['Todas', 'Nintendo', '8BitDo'].map((item) => <Chip key={item} c={c} label={item} active={filters.brand === item} onPress={() => update('brand', item)} />)}</Row>
            <Row style={{ gap: 10, marginTop: 12 }}>
              <Field c={c} label="Precio mínimo COP" value={filters.minPrice || ''} onChangeText={(value) => update('minPrice', value.replace(/[^0-9]/g, ''))} placeholder="0" keyboardType="numeric" style={{ flex: 1 }} />
              <Field c={c} label="Precio máximo COP" value={filters.maxPrice || ''} onChangeText={(value) => update('maxPrice', value.replace(/[^0-9]/g, ''))} placeholder="Sin límite" keyboardType="numeric" style={{ flex: 1 }} />
            </Row>
            <Pressable onPress={() => update('onlyAvailable', !filters.onlyAvailable)} style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 8 }}>
              <View style={{ width: 20, height: 20, borderRadius: 5, borderWidth: 1, borderColor: filters.onlyAvailable ? c.cyan : c.line, backgroundColor: filters.onlyAvailable ? c.cyan : c.input, alignItems: 'center', justifyContent: 'center', marginRight: 9 }}><Txt c={c} color="#FFFFFF" size={13} weight="900">{filters.onlyAvailable ? '✓' : ''}</Txt></View>
              <View style={{ flex: 1 }}><Txt c={c} size={12} weight="700">Solo disponibles</Txt><Txt c={c} size={10} color={c.muted}>Oculta productos sin inventario.</Txt></View>
            </Pressable>
            <View style={{ height: 12 }} />
          </ScrollView>
          <Row style={{ gap: 8, paddingTop: 10 }}>
            <Button c={c} title="Restablecer" variant="secondary" onPress={onReset} style={{ flex: 1 }} />
            <Button c={c} title="Aplicar filtros" onPress={onApply} style={{ flex: 1 }} />
          </Row>
        </View>
      </View>
    </Modal>
  );
}

export function AddressModal({ visible, onClose, c, draft, setDraft, onSave, editing }) {
  const update = (key, value) => setDraft((current) => ({ ...current, [key]: value }));
  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={{ flex: 1, backgroundColor: '#0008', justifyContent: 'flex-end' }}>
        <View style={{ maxHeight: '88%', backgroundColor: c.bg, borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 18 }}>
          <View style={{ width: 38, height: 4, borderRadius: 3, backgroundColor: c.line, alignSelf: 'center', marginBottom: 14 }} />
          <Heading title={editing ? 'Editar dirección' : 'Nueva dirección'} subtitle="Libreta ficticia para el checkout · HU25" action={<Pressable onPress={onClose}><Txt c={c} size={22}>×</Txt></Pressable>} />
          <ScrollView keyboardShouldPersistTaps="handled">
            <Field c={c} label="Alias de dirección" value={draft.alias} onChangeText={(value) => update('alias', value)} placeholder="Ej. Casa Mosquera" />
            <Txt c={c} size={10} weight="800" color={c.muted} style={{ marginBottom: 8 }}>MUNICIPIO</Txt>
            <Row style={{ flexWrap: 'wrap', marginBottom: 12 }}>{MUNICIPALITIES.map((item) => <Chip key={item} c={c} label={item} active={draft.municipio === item} onPress={() => update('municipio', item)} />)}</Row>
            <Field c={c} label="Dirección o referencia" value={draft.description} onChangeText={(value) => update('description', value)} placeholder="Calle, carrera, conjunto o referencia" multiline />
            <Pressable onPress={() => update('principal', !draft.principal)} style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 8 }}>
              <View style={{ width: 20, height: 20, borderRadius: 5, borderWidth: 1, borderColor: draft.principal ? c.cyan : c.line, backgroundColor: draft.principal ? c.cyan : c.input, alignItems: 'center', justifyContent: 'center', marginRight: 9 }}><Txt c={c} color="#FFFFFF" size={13} weight="900">{draft.principal ? '✓' : ''}</Txt></View>
              <Txt c={c} size={12} weight="700">Marcar como dirección principal</Txt>
            </Pressable>
          </ScrollView>
          <Row style={{ gap: 8, paddingTop: 10 }}><Button c={c} title="Cancelar" variant="secondary" onPress={onClose} style={{ flex: 1 }} /><Button c={c} title="Guardar dirección" onPress={onSave} style={{ flex: 1 }} /></Row>
        </View>
      </View>
    </Modal>
  );
}

export function ShareModal({ visible, onClose, c, product, variant }) {
  const [copied, setCopied] = useState(false);
  useEffect(() => { if (visible) setCopied(false); }, [visible, product?.id, variant?.id]);
  const message = product
    ? `CoinBox_Store · Marketplace 2.0\n${product.name}\n${variant ? `${variant.label}\n` : ''}${formatCOP(variant?.price || product.basePrice)}\n\nPrototipo académico local sin enlace web público.`
    : '';
  const copy = async () => {
    try {
      await Clipboard.setStringAsync(message);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  };
  const share = async () => {
    try {
      await Share.share({ message });
    } catch {
      // El modal permanece disponible si el menú nativo no está habilitado.
    }
  };
  return (
    <Modal visible={visible} animationType="fade" transparent onRequestClose={onClose}>
      <View style={{ flex: 1, backgroundColor: '#0008', justifyContent: 'center', padding: 20 }}>
        <Card c={c} style={{ backgroundColor: c.card, padding: 17 }}>
          <Row style={{ justifyContent: 'space-between' }}><Txt c={c} size={16} weight="900">Compartir ficha · HU35</Txt><Pressable onPress={onClose}><Txt c={c} size={22}>×</Txt></Pressable></Row>
          <Txt c={c} size={10} color={c.muted} style={{ marginTop: 5 }}>Resumen local preparado para compartir.</Txt>
          <View style={{ padding: 13, backgroundColor: c.soft, borderRadius: 9, marginTop: 14 }}><Txt c={c} size={12} weight="800">{product?.name}</Txt>{variant ? <Txt c={c} size={10} color={c.muted} style={{ marginTop: 4 }}>{variant.label}</Txt> : null}<Txt c={c} size={16} weight="900" style={{ marginTop: 8 }}>{product ? formatCOP(variant?.price || product.basePrice) : ''}</Txt><Txt c={c} size={10} color={c.muted} style={{ marginTop: 12, lineHeight: 16 }}>Prototipo académico local sin enlace web público.</Txt></View>
          <Button c={c} title={copied ? '✓ Resumen copiado' : 'Copiar resumen del producto'} onPress={copy} style={{ marginTop: 13 }} />
          <Button c={c} title="Compartir por otra aplicación" variant="secondary" onPress={share} style={{ marginTop: 8 }} />
          <Button c={c} title="Cerrar" variant="ghost" onPress={onClose} style={{ marginTop: 6 }} />
        </Card>
      </View>
    </Modal>
  );
}
