import React from 'react';
import { Image, Linking, Pressable, StyleSheet, Text, View } from 'react-native';
import { FindStratosStore } from './types';
import { colors } from '../../theme/colors';

interface StoreCardProps {
  store: FindStratosStore;
  isBestDeal?: boolean;
}

const formatDistance = (distanceKm?: number | null) =>
  distanceKm === null || distanceKm === undefined ? 'Distance unavailable' : `${distanceKm.toFixed(1)} km`;

const formatPrice = (price?: number | null) =>
  price === null || price === undefined ? 'Price unavailable' : `Price: ${price.toFixed(2)} NOK`;

export const StoreCard = ({ store, isBestDeal = false }: StoreCardProps) => {
  const handleOpenWebsite = async () => {
    if (!store.website) {
      return;
    }
    const canOpen = await Linking.canOpenURL(store.website);
    if (canOpen) {
      await Linking.openURL(store.website);
    }
  };

  return (
    <View style={styles.card}>
      <View style={styles.badgeRow}>
        {store.isOpenNow ? (
          <View style={[styles.badge, styles.openBadge]}>
            <Text style={styles.badgeText}>Open now</Text>
          </View>
        ) : null}
        {store.priceNok !== null && store.priceNok !== undefined ? (
          <View style={[styles.badge, styles.priceBadge]}>
            <Text style={styles.badgeText}>Has Stratos price</Text>
          </View>
        ) : null}
        {isBestDeal ? (
          <View style={[styles.badge, styles.bestBadge]}>
            <Text style={styles.badgeText}>Best deal nearby</Text>
          </View>
        ) : null}
      </View>

      {store.matchedProduct ? (
        <View style={styles.productPreviewRow}>
          <Image source={{ uri: store.matchedProduct.imageUrl }} style={styles.productImage} resizeMode="cover" />
          <View style={styles.productMeta}>
            <Text style={styles.productLabel}>Likely available here</Text>
            <Text style={styles.productName} numberOfLines={2}>
              {store.matchedProduct.name}
            </Text>
          </View>
        </View>
      ) : null}

      <View style={styles.headerRow}>
        <View style={styles.titleWrap}>
          <Text style={styles.storeName}>{store.name}</Text>
          <Text style={styles.chainName}>{store.chainName}</Text>
        </View>
        {store.logo ? <Image source={{ uri: store.logo }} style={styles.logo} resizeMode="contain" /> : null}
      </View>

      <Text style={styles.metaText}>{formatDistance(store.distanceKm)}</Text>
      <Text style={styles.metaText}>{store.openingHoursLabel}</Text>
      <Text style={styles.priceText}>{formatPrice(store.priceNok)}</Text>

      <Pressable
        style={[styles.websiteButton, !store.website ? styles.websiteButtonDisabled : null]}
        onPress={handleOpenWebsite}
        disabled={!store.website}
      >
        <Text style={styles.websiteButtonText}>Open Store Website</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(233, 238, 255, 0.2)',
    backgroundColor: 'rgba(16, 36, 95, 0.9)',
    padding: 14,
    marginBottom: 10,
  },
  badgeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 8,
  },
  badge: {
    borderRadius: 999,
    paddingHorizontal: 9,
    paddingVertical: 4,
    marginRight: 6,
    marginBottom: 5,
  },
  openBadge: {
    backgroundColor: 'rgba(62, 214, 147, 0.22)',
    borderWidth: 1,
    borderColor: 'rgba(62, 214, 147, 0.65)',
  },
  priceBadge: {
    backgroundColor: 'rgba(76, 201, 240, 0.2)',
    borderWidth: 1,
    borderColor: 'rgba(76, 201, 240, 0.6)',
  },
  bestBadge: {
    backgroundColor: 'rgba(255, 199, 95, 0.2)',
    borderWidth: 1,
    borderColor: 'rgba(255, 199, 95, 0.62)',
  },
  badgeText: {
    color: colors.brandText,
    fontSize: 11,
    fontWeight: '700',
  },
  productPreviewRow: {
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(233, 238, 255, 0.2)',
    backgroundColor: 'rgba(233, 238, 255, 0.08)',
    padding: 8,
  },
  productImage: {
    width: 52,
    height: 52,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
  },
  productMeta: {
    marginLeft: 10,
    flex: 1,
  },
  productLabel: {
    color: '#4cc9f0',
    fontSize: 11,
    fontWeight: '700',
  },
  productName: {
    marginTop: 2,
    color: colors.brandText,
    fontSize: 13,
    fontWeight: '700',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  titleWrap: {
    flex: 1,
    paddingRight: 10,
  },
  storeName: {
    color: colors.brandText,
    fontSize: 17,
    fontWeight: '800',
  },
  chainName: {
    marginTop: 2,
    color: 'rgba(233, 238, 255, 0.84)',
    fontSize: 12,
    fontWeight: '600',
  },
  logo: {
    width: 54,
    height: 34,
  },
  metaText: {
    marginTop: 6,
    color: 'rgba(233, 238, 255, 0.9)',
    fontSize: 13,
  },
  priceText: {
    marginTop: 7,
    color: '#4cc9f0',
    fontSize: 14,
    fontWeight: '800',
  },
  websiteButton: {
    marginTop: 12,
    alignSelf: 'flex-start',
    borderRadius: 999,
    paddingVertical: 8,
    paddingHorizontal: 13,
    backgroundColor: 'rgba(233, 238, 255, 0.18)',
  },
  websiteButtonDisabled: {
    opacity: 0.5,
  },
  websiteButtonText: {
    color: colors.brandText,
    fontSize: 12,
    fontWeight: '700',
  },
});
