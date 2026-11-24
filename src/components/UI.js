import React, { useEffect, useState } from 'react';

import {
  View,
  Text,
  Pressable,
  TextInput,
  StyleSheet,
  Image
} from 'react-native';

export function Txt({
  children,
  c,
  size = 14,
  weight = '400',
  color,
  style,
  numberOfLines,
  ...rest
}) {
  return (
    <Text
      numberOfLines={numberOfLines}
      {...rest}
      style={[
        {
          color: color || c?.text || '#141518',
          fontSize: size * (c?.scale || 1),
          fontWeight: weight
        },
        style
      ]}
    >
      {children}
    </Text>
  );
}

export function Row({ children, style }) {
  return (
    <View style={[{ flexDirection: 'row', alignItems: 'center' }, style]}>
      {children}
    </View>
  );
}

export function Card({ children, c, style, noPadding = false }) {
  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: c?.card || '#FFFFFF',
          borderColor: c?.line || '#E6E3DD'
        },
        noPadding ? null : styles.cardPadding,
        style
      ]}
    >
      {children}
    </View>
  );
}

export function Button({
  title,
  onPress,
  c,
  variant = 'primary',
  disabled = false,
  small = false,
  style,
  textStyle,
  icon
}) {
  const primary = variant === 'primary';
  const secondary = variant === 'secondary';
  const ghost = variant === 'ghost';
  const danger = variant === 'danger';

  const bg = primary
    ? c?.red || '#E60012'
    : secondary
      ? c?.soft || '#ECEAE5'
      : danger
        ? '#FCE8E9'
        : 'transparent';

  const fg = primary
    ? '#FFFFFF'
    : danger
      ? '#B4232E'
      : c?.text || '#141518';

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.button,
        {
          backgroundColor: bg,
          borderColor: primary || ghost
            ? 'transparent'
            : c?.line || '#DAD7D0',
          opacity: disabled ? 0.42 : pressed ? 0.82 : 1,
          paddingVertical: small ? 8 : 12,
          paddingHorizontal: small ? 11 : 15
        },
        style
      ]}
    >
      {icon ? (
        <Txt
          c={c}
          color={fg}
          size={small ? 12 : 14}
          weight="700"
          style={{ marginRight: 6 }}
        >
          {icon}
        </Txt>
      ) : null}

      <Txt
        c={c}
        color={fg}
        size={small ? 12 : 13}
        weight="700"
        style={[{ textAlign: 'center' }, textStyle]}
      >
        {title}
      </Txt>
    </Pressable>
  );
}

export function Chip({ label, active, onPress, c, style, tone }) {
  const bg = active ? c?.dark || '#141518' : c?.card || '#FFFFFF';
  const fg = active ? '#FFFFFF' : tone || c?.muted || '#686A6C';

  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.chip,
        {
          backgroundColor: bg,
          borderColor: active ? bg : c?.line || '#DDDAD2'
        },
        style
      ]}
    >
      <Txt c={c} color={fg} size={12} weight={active ? '700' : '600'}>
        {label}
      </Txt>
    </Pressable>
  );
}

export function Field({
  label,
  value,
  onChangeText,
  placeholder,
  c,
  keyboardType,
  multiline = false,
  style,
  inputStyle,
  editable = true
}) {
  return (
    <View style={[{ marginBottom: 12 }, style]}>
      {label ? (
        <Txt
          c={c}
          size={11}
          weight="700"
          color={c?.muted}
          style={{ marginBottom: 6, letterSpacing: 0.4 }}
        >
          {label.toUpperCase()}
        </Txt>
      ) : null}

      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={c?.placeholder || '#929292'}
        keyboardType={keyboardType || 'default'}
        multiline={multiline}
        editable={editable}
        textAlignVertical={multiline ? 'top' : 'center'}
        style={[
          styles.input,
          {
            backgroundColor: c?.input || '#FFFFFF',
            color: c?.text || '#141518',
            borderColor: c?.line || '#DEDAD3',
            minHeight: multiline ? 86 : 44,
            fontSize: 13 * (c?.scale || 1)
          },
          multiline ? { paddingTop: 11 } : null,
          inputStyle
        ]}
      />
    </View>
  );
}

export function Heading({ title, subtitle, c, action, style }) {
  return (
    <View style={[{ marginBottom: 16 }, style]}>
      <Row style={{ justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <View style={{ flex: 1, paddingRight: 10 }}>
          <Txt c={c} size={23} weight="800" style={{ letterSpacing: -0.6 }}>
            {title}
          </Txt>

          {subtitle ? (
            <Txt
              c={c}
              size={12}
              color={c?.muted}
              style={{ marginTop: 4, lineHeight: 18 }}
            >
              {subtitle}
            </Txt>
          ) : null}
        </View>

        {action || null}
      </Row>
    </View>
  );
}

export function SectionTitle({ title, right, c, style }) {
  return (
    <Row style={[
      { justifyContent: 'space-between', marginBottom: 10, marginTop: 19 },
      style
    ]}>
      <Txt c={c} size={14} weight="800">{title}</Txt>
      {right || null}
    </Row>
  );
}

export function Divider({ c, style }) {
  return (
    <View
      style={[
        {
          height: 1,
          backgroundColor: c?.line || '#E6E3DD',
          marginVertical: 12
        },
        style
      ]}
    />
  );
}

function Dot({ size = 7, color = '#FFFFFF', style }) {
  return (
    <View
      style={[
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: color
        },
        style
      ]}
    />
  );
}

function Triangle({ color = '#D7B34A', size = 18, style }) {
  return (
    <View
      style={[
        {
          width: 0,
          height: 0,
          borderLeftWidth: size / 2,
          borderRightWidth: size / 2,
          borderBottomWidth: size,
          borderLeftColor: 'transparent',
          borderRightColor: 'transparent',
          borderBottomColor: color
        },
        style
      ]}
    />
  );
}

/**
 * Ilustraciones vectoriales construidas con Views nativas.
 * No dependen de imágenes remotas ni de paquetes adicionales.
 */

const PRODUCT_IMAGE_URLS = {
  // Nintendo Switch OLED
  'PROD-001': {
    default: 'https://www.proshop.nl/Images/915x900/2977069_0872fd05dcaa.jpg',
    variants: {
      'VAR-01A': 'https://www.proshop.nl/Images/915x900/2977069_0872fd05dcaa.jpg',
      'VAR-01B': 'https://www.pbtech.co.nz/imgprod/G/A/GAMNTD1012__2.jpg?h=1107414667',
      'VAR-01C': 'https://www.nintendo.fi/images/products_23/hw_switch_oled_tloz_totk/TLOZ-TearsOfTheKingdom-Console-illu-05.png'
    }
  },


  // PROD-002: Nintendo 64 + Expansion Pak
  'PROD-002': {
    default: 'https://videogametrader.com/cdn/shop/files/Nintendo-64-System-w-Expa_d400a52795_2048x.png?v=1744922087'
  },

  // PROD-003: Super Nintendo SNES Classic Edition
  'PROD-003': {
    default: 'https://www.mgpl.org/sites/default/files/2023-01/GAMES_supernes.jpg'
  },

  // PROD-006: Mario Kart 8 Deluxe
  'PROD-006': {
    default: 'https://www.nfm.com/on/demandware.static/-/Sites-nfm-master-catalog/default/dw0b985101/images/049/08/49084502-1.jpg'
  },

  // PROD-009: Amiibo Mario
  'PROD-009': {
    default: 'https://i.ebayimg.com/images/g/vtoAAOSw2fRkHiKQ/s-l1200.jpg'
  },

  // Game Boy Advance SP Cobalt
  'PROD-004': {
    default: 'https://aimages.itembazaar.com/images/I/41u6LFJ95QL._UL1600_.jpg'
  },

  // Zelda Tears of the Kingdom
  'PROD-005': {
    default: 'https://i.ebayimg.com/images/g/GUwAAOSw5OJnrIKt/s-l2400.jpg'
  },

  // Super Mario Odyssey
  'PROD-007': {
    default: 'https://down-my.img.susercontent.com/file/my-11134207-7ras9-m8ectvovp7ym4d'
  },

  // Amiibo Link
  'PROD-008': {
    default: 'https://www.gameshop.my/cdn/shop/files/AmiiboLegendofZeldaTearsoftheKingdom.jpg?v=1687021742',
    variants: {
      'VAR-08A': 'https://www.gameshop.my/cdn/shop/files/AmiiboLegendofZeldaTearsoftheKingdom.jpg?v=1687021742',
      'VAR-08B': 'https://vtrgaming.ca/cdn/shop/files/WebsitePics600x600-2024-10-26T124741.883.png?v=1751479640'
    }
  },

  // Amiibo Samus
  'PROD-010': {
    default: 'https://superretro.com.au/cdn/shop/files/amiibo-samus-aran-samus-returns-39425-206777_1600x.jpg?v=1721767529'
  },

  // Nintendo Switch Pro Controller
  'PROD-011': {
    default: 'https://static.comet.it/b2c/public/e-cat/NIN00898G/NIN00898G-0.jpg',
    variants: {
      'VAR-11A': 'https://static.comet.it/b2c/public/e-cat/NIN00898G/NIN00898G-0.jpg',
      'VAR-11B': 'https://cdn.shopify.com/s/files/1/0054/5007/2113/files/123_480x480.jpg?v=1662622220'
    }
  },

  // Joy-Con
  'PROD-012': {
    default: 'https://siman.vtexassets.com/arquivos/ids/1734405/103462022.jpg?v=637679274247130000'
  }
};

export function ProductArtwork({
  product,
  variant = null,
  size = 'card'
}) {
  const productImages = PRODUCT_IMAGE_URLS[product?.id];

  // Cuando hay variantes, muestra la foto de la variante elegida.
  const imageUrl =
    productImages?.variants?.[variant?.id] ||
    productImages?.default;

  const [imageFailed, setImageFailed] = useState(false);

  useEffect(() => {
    setImageFailed(false);
  }, [imageUrl]);

  const height =
    size === 'hero' ? 174 :
    size === 'feature' ? 108 :
    size === 'mini' ? 78 : 98;

  return (
    <View
      style={{
        width: '100%',
        height,
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        borderRadius: size === 'feature' ? 8 : 0,
        backgroundColor:
          size === 'feature' ? '#FFFFFF' : 'transparent'
      }}
    >
      {imageUrl && !imageFailed ? (
        <Image
          source={{ uri: imageUrl }}
          resizeMode="contain"
          accessibilityLabel={`Imagen de ${product?.name || 'producto Nintendo'}`}
          onError={() => setImageFailed(true)}
          style={{
            width: '100%',
            height: '100%'
          }}
        />
      ) : (
        <View
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            padding: 8
          }}
        >
          <Text style={{
            fontSize: size === 'hero' ? 42 : 30
          }}>
            {product?.emoji || '🎮'}
          </Text>

          <Text style={{
            color: '#777777',
            fontSize: 9,
            marginTop: 3
          }}>
            Imagen no disponible
          </Text>
        </View>
      )}
    </View>
  );
}

export function ProductTile({
  product,
  c,
  price,
  stock,
  onPress,
  onCompare,
  compared,
  small = false,
  scale = 1
}) {
  const available = stock > 0;
  const hasVariants = Array.isArray(product.variants) && product.variants.length > 0;

  return (
    <Card
      c={c}
      style={{
        flex: 1,
        minWidth: small ? 142 : 150,
        maxWidth: small ? 190 : '48%',
        padding: 0,
        marginBottom: 10,
        borderRadius: 10
      }}
      noPadding
    >
      <Pressable onPress={onPress}>
        <View
          style={{
            height: small ? 91 : 112,
            borderRadius: 8,
            backgroundColor: product.imageTone || '#ECEAE5',
            alignItems: 'center',
            justifyContent: 'center',
            margin: 7,
            overflow: 'hidden'
          }}
        >
          <ProductArtwork product={product} size={small ? 'mini' : 'card'} />

          <View style={{ position: 'absolute', top: 6, left: 6 }}>
            <View style={{
              backgroundColor: '#FFFFFFE8',
              borderRadius: 4,
              paddingHorizontal: 6,
              paddingVertical: 3
            }}>
              <Txt c={c} size={8} color="#343434" weight="800">
                {product.era?.toUpperCase()}
              </Txt>
            </View>
          </View>

          {hasVariants ? (
            <View style={{
              position: 'absolute',
              top: 6,
              right: 6,
              backgroundColor: '#E60012',
              borderRadius: 4,
              paddingHorizontal: 5,
              paddingVertical: 3
            }}>
              <Txt size={7} color="#FFFFFF" weight="900">VARIANTES</Txt>
            </View>
          ) : null}
        </View>

        <View style={{ paddingHorizontal: 10, paddingBottom: 8 }}>
          <Txt c={c} size={8} color={c?.muted} weight="800" style={{ letterSpacing: 0.8 }}>
            {product.category?.toUpperCase()}
          </Txt>

          <Txt
            c={c}
            size={small ? 11 : 12}
            weight="800"
            style={{
              marginTop: 3,
              minHeight: 31 * scale,
              lineHeight: 15 * scale
            }}
            numberOfLines={2}
          >
            {product.name}
          </Txt>

          <Txt c={c} size={9} color={c?.muted} style={{ marginTop: 4 }}>
            Desde
          </Txt>

          <Txt
            c={c}
            size={small ? 12 : 14}
            weight="900"
            color={c?.text}
            style={{ marginTop: 1 }}
          >
            {price}
          </Txt>

          <Txt
            c={c}
            size={9}
            weight="700"
            color={available ? '#18764D' : '#B4232E'}
            style={{ marginTop: 4 }}
          >
            {available ? `${stock} unidades disponibles` : 'AGOTADO'}
          </Txt>
        </View>
      </Pressable>

      <View style={{
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 8,
        paddingBottom: 8,
        gap: 5
      }}>
        <Button
          c={c}
          title={hasVariants ? 'Elegir opción' : 'Ver ficha'}
          small
          variant="secondary"
          onPress={onPress}
          style={{
            flex: 1,
            paddingHorizontal: 5,
            minHeight: 31
          }}
        />

        {onCompare ? (
          <Button
            c={c}
            title={compared ? '✓' : '+3'}
            small
            variant="secondary"
            onPress={onCompare}
            style={{
              minWidth: 34,
              paddingHorizontal: 5,
              minHeight: 31
            }}
          />
        ) : null}
      </View>
    </Card>
  );
}

export function EmptyState({ title, detail, c, action, icon = '◌' }) {
  return (
    <Card c={c} style={{ alignItems: 'center', paddingVertical: 28, marginTop: 10 }}>
      <Txt c={c} size={30} color={c?.muted}>{icon}</Txt>

      <Txt c={c} size={15} weight="800" style={{ marginTop: 9 }}>
        {title}
      </Txt>

      {detail ? (
        <Txt
          c={c}
          size={12}
          color={c?.muted}
          style={{ textAlign: 'center', marginTop: 5, lineHeight: 18 }}
        >
          {detail}
        </Txt>
      ) : null}

      {action ? <View style={{ marginTop: 14 }}>{action}</View> : null}
    </Card>
  );
}

export function StatusPill({ label, c, tone = 'cyan' }) {
  const map = {
    cyan: {
      bg: c?.cyanSoft || '#E1F4F6',
      fg: c?.cyan || '#007799'
    },
    green: {
      bg: '#E4F4EB',
      fg: '#18764D'
    },
    red: {
      bg: '#FCE8E9',
      fg: '#B4232E'
    },
    gray: {
      bg: c?.soft || '#ECEAE5',
      fg: c?.muted || '#666'
    }
  };

  const palette = map[tone] || map.cyan;

  return (
    <View style={{
      backgroundColor: palette.bg,
      borderRadius: 20,
      paddingHorizontal: 9,
      paddingVertical: 5,
      alignSelf: 'flex-start'
    }}>
      <Txt c={c} color={palette.fg} size={9} weight="800">
        {label.toUpperCase()}
      </Txt>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderRadius: 13,
    overflow: 'hidden'
  },
  cardPadding: {
    padding: 14
  },
  button: {
    minHeight: 36,
    borderRadius: 9,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row'
  },
  chip: {
    borderWidth: 1,
    borderRadius: 30,
    paddingHorizontal: 13,
    paddingVertical: 8,
    marginRight: 7,
    marginBottom: 4
  },
  input: {
    borderWidth: 1,
    borderRadius: 9,
    paddingHorizontal: 12,
    paddingVertical: 9,
    fontSize: 13
  }
});