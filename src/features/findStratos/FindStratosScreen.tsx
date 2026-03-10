import React from 'react';
import { DrawerActions, useNavigation } from '@react-navigation/native';
import { Image, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { routes } from '../../navigation/routes';
import { colors } from '../../theme/colors';
import { StoreCard } from './StoreCard';
import { useFindStratos } from './useFindStratos';
import { reportError } from '../../utils/errorReporting';

const formatUpdatedTime = (value: number | null) => {
  if (!value) {
    return '';
  }
  return `Updated ${new Date(value).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
};

export const FindStratosScreen = () => {
  const navigation = useNavigation<any>();
  const { stores, nearbyProducts, loading, error, needsApiKey, empty, locationNotice, lastUpdated, refresh, submitApiKey } = useFindStratos();
  const [apiKeyInput, setApiKeyInput] = React.useState('');
  const [openNowOnly, setOpenNowOnly] = React.useState(false);
  const [withPriceOnly, setWithPriceOnly] = React.useState(false);
  const [selectedChainCode, setSelectedChainCode] = React.useState<string | null>(null);
  const loggedTileImageErrors = React.useRef<Set<string>>(new Set());

  const handleTileImageError = React.useCallback((uri: string) => {
    if (loggedTileImageErrors.current.has(uri)) {
      return;
    }
    loggedTileImageErrors.current.add(uri);
    void reportError(new Error(`Product tile image failed to load: ${uri}`), 'findStratos:tileImage');
  }, []);

  const chainOptions = React.useMemo(() => {
    const map = new Map<string, string>();
    stores.forEach((store) => {
      const key = (store.groupCode || '').trim().toUpperCase();
      if (!key) {
        return;
      }
      if (!map.has(key)) {
        map.set(key, store.chainName);
      }
    });
    return [...map.entries()].map(([code, label]) => ({ code, label }));
  }, [stores]);

  const filteredStores = React.useMemo(
    () =>
      stores.filter((store) => {
        if (selectedChainCode && (store.groupCode || '').trim().toUpperCase() !== selectedChainCode) {
          return false;
        }
        if (openNowOnly && !store.isOpenNow) {
          return false;
        }
        if (withPriceOnly && (store.priceNok === null || store.priceNok === undefined)) {
          return false;
        }
        return true;
      }),
    [openNowOnly, selectedChainCode, stores, withPriceOnly]
  );

  const bestDealStore = React.useMemo(() => {
    const pricedStores = filteredStores.filter(
      (store) => store.priceNok !== null && store.priceNok !== undefined
    );
    if (!pricedStores.length) {
      return null;
    }
    return [...pricedStores].sort((a, b) => (a.priceNok ?? Number.MAX_SAFE_INTEGER) - (b.priceNok ?? Number.MAX_SAFE_INTEGER))[0];
  }, [filteredStores]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.topBar}>
        <Pressable
          style={styles.topBarButton}
          onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
          accessibilityRole="button"
          accessibilityLabel="Open menu"
        >
          <Text style={styles.topBarButtonText}>Menu</Text>
        </Pressable>
        <Pressable
          style={styles.topBarButton}
          onPress={() => (navigation.canGoBack() ? navigation.goBack() : navigation.navigate(routes.Tabs))}
          accessibilityRole="button"
          accessibilityLabel="Back"
        >
          <Text style={styles.topBarButtonText}>Back</Text>
        </Pressable>
      </View>

      <View style={styles.header}>
        <Text style={styles.title}>Find Stratos Near Me</Text>
        <Text style={styles.subtitle}>Nearby stores, opening hours, prices, and quick website links.</Text>
      </View>

      <View style={styles.metaRow}>
        <Text style={styles.updatedText}>{formatUpdatedTime(lastUpdated)}</Text>
        <Pressable style={styles.refreshButton} onPress={refresh} accessibilityRole="button">
          <Text style={styles.refreshButtonText}>{loading ? 'Loading...' : 'Refresh'}</Text>
        </Pressable>
      </View>

      {locationNotice ? (
        <View style={styles.noticeCard}>
          <Text style={styles.noticeText}>{locationNotice}</Text>
        </View>
      ) : null}

      <ScrollView contentContainerStyle={styles.listWrap}>
        {!error ? (
          <View style={styles.filtersRow}>
            <Pressable
              style={[styles.filterChip, openNowOnly ? styles.filterChipActive : null]}
              onPress={() => setOpenNowOnly((value) => !value)}
            >
              <Text style={styles.filterChipText}>Open now</Text>
            </Pressable>
            <Pressable
              style={[styles.filterChip, withPriceOnly ? styles.filterChipActive : null]}
              onPress={() => setWithPriceOnly((value) => !value)}
            >
              <Text style={styles.filterChipText}>Has price</Text>
            </Pressable>
          </View>
        ) : null}

        {!error && chainOptions.length > 0 ? (
          <View style={styles.chainSection}>
            <Text style={styles.chainTitle}>Chains nearby</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <Pressable
                style={[styles.chainChip, !selectedChainCode ? styles.chainChipActive : null]}
                onPress={() => setSelectedChainCode(null)}
              >
                <Text style={styles.chainChipText}>All</Text>
              </Pressable>
              {chainOptions.map((chain) => (
                <Pressable
                  key={chain.code}
                  style={[styles.chainChip, selectedChainCode === chain.code ? styles.chainChipActive : null]}
                  onPress={() => setSelectedChainCode(chain.code)}
                >
                  <Text style={styles.chainChipText}>{chain.label}</Text>
                </Pressable>
              ))}
            </ScrollView>
          </View>
        ) : null}

        {!error && bestDealStore ? (
          <View style={styles.bestDealCard}>
            <Text style={styles.bestDealTitle}>Best nearby deal</Text>
            <Text style={styles.bestDealValue}>
              {bestDealStore.name}: {(bestDealStore.priceNok ?? 0).toFixed(2)} NOK
            </Text>
          </View>
        ) : null}

        {!error && nearbyProducts.length > 0 ? (
          <View style={styles.productsSection}>
            <Text style={styles.productsTitle}>Available Stratos Nearby</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {nearbyProducts.map((product) => (
                <View key={product.id} style={styles.productTile}>
                  <Image
                    source={{ uri: product.imageUrl }}
                    style={styles.productTileImage}
                    resizeMode="cover"
                    onError={() => handleTileImageError(product.imageUrl)}
                  />
                  <Text style={styles.productTileName} numberOfLines={2}>
                    {product.name}
                  </Text>
                  {product.priceNok !== null && product.priceNok !== undefined ? (
                    <Text style={styles.productTilePrice}>{product.priceNok.toFixed(2)} NOK</Text>
                  ) : (
                    <Text style={styles.productTilePriceMuted}>Price varies</Text>
                  )}
                </View>
              ))}
            </ScrollView>
          </View>
        ) : null}

        {needsApiKey ? (
          <View style={styles.keyCard}>
            <Text style={styles.keyCardTitle}>Kassal API key required</Text>
            <Text style={styles.keyCardText}>
              Paste your key locally. It is stored in your browser/app runtime only.
            </Text>
            <TextInput
              value={apiKeyInput}
              onChangeText={setApiKeyInput}
              placeholder="Paste Kassal API key"
              placeholderTextColor="rgba(233, 238, 255, 0.55)"
              style={styles.keyInput}
              autoCapitalize="none"
              autoCorrect={false}
            />
            <Pressable
              style={styles.saveKeyButton}
              onPress={() => void submitApiKey(apiKeyInput)}
              accessibilityRole="button"
            >
              <Text style={styles.saveKeyButtonText}>Save Key and Retry</Text>
            </Pressable>
          </View>
        ) : null}
        {error ? <Text style={styles.stateText}>{error}</Text> : null}
        {empty ? <Text style={styles.stateText}>No nearby stores found in this area yet.</Text> : null}
        {!error && !empty
          ? filteredStores.map((store) => (
              <StoreCard key={store.id} store={store} isBestDeal={bestDealStore?.id === store.id} />
            ))
          : null}
        {!error && !empty && filteredStores.length === 0 ? (
          <Text style={styles.stateText}>No stores match the selected filters yet.</Text>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0b1e61',
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    paddingTop: 8,
  },
  topBarButton: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 16,
    backgroundColor: 'rgba(233, 238, 255, 0.14)',
  },
  topBarButtonText: {
    color: colors.brandText,
    fontSize: 13,
    fontWeight: '700',
  },
  header: {
    paddingHorizontal: 18,
    paddingTop: 8,
  },
  title: {
    color: colors.brandText,
    fontSize: 28,
    fontWeight: '700',
  },
  subtitle: {
    marginTop: 4,
    color: 'rgba(233, 238, 255, 0.84)',
    fontSize: 14,
  },
  metaRow: {
    marginTop: 8,
    paddingHorizontal: 18,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  updatedText: {
    color: 'rgba(233, 238, 255, 0.76)',
    fontSize: 12,
  },
  refreshButton: {
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: 'rgba(233, 238, 255, 0.14)',
  },
  refreshButtonText: {
    color: colors.brandText,
    fontSize: 12,
    fontWeight: '700',
  },
  noticeCard: {
    marginTop: 8,
    marginHorizontal: 18,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 199, 95, 0.5)',
    backgroundColor: 'rgba(255, 199, 95, 0.12)',
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  noticeText: {
    color: colors.brandText,
    fontSize: 12,
    lineHeight: 17,
  },
  listWrap: {
    paddingHorizontal: 18,
    paddingTop: 10,
    paddingBottom: 20,
  },
  stateText: {
    marginTop: 18,
    color: colors.brandText,
    fontSize: 14,
    textAlign: 'center',
  },
  keyCard: {
    marginTop: 6,
    marginBottom: 10,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(233, 238, 255, 0.2)',
    backgroundColor: 'rgba(16, 36, 95, 0.9)',
    padding: 14,
  },
  keyCardTitle: {
    color: colors.brandText,
    fontSize: 16,
    fontWeight: '800',
  },
  keyCardText: {
    marginTop: 6,
    color: 'rgba(233, 238, 255, 0.84)',
    fontSize: 12,
    lineHeight: 17,
  },
  keyInput: {
    marginTop: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(233, 238, 255, 0.28)',
    backgroundColor: 'rgba(5, 14, 50, 0.42)',
    color: colors.brandText,
    paddingHorizontal: 11,
    paddingVertical: 10,
    fontSize: 13,
  },
  saveKeyButton: {
    marginTop: 10,
    borderRadius: 12,
    paddingVertical: 10,
    alignItems: 'center',
    backgroundColor: '#4cc9f0',
  },
  saveKeyButtonText: {
    color: '#062562',
    fontSize: 13,
    fontWeight: '800',
  },
  filtersRow: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  filterChip: {
    marginRight: 8,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: 'rgba(233, 238, 255, 0.22)',
    backgroundColor: 'rgba(233, 238, 255, 0.08)',
  },
  filterChipActive: {
    backgroundColor: 'rgba(76, 201, 240, 0.26)',
    borderColor: 'rgba(76, 201, 240, 0.65)',
  },
  filterChipText: {
    color: colors.brandText,
    fontSize: 12,
    fontWeight: '700',
  },
  bestDealCard: {
    marginBottom: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(255, 199, 95, 0.5)',
    backgroundColor: 'rgba(255, 199, 95, 0.12)',
    padding: 10,
  },
  bestDealTitle: {
    color: colors.brandText,
    fontSize: 12,
    fontWeight: '700',
    opacity: 0.9,
  },
  bestDealValue: {
    marginTop: 2,
    color: colors.brandText,
    fontSize: 14,
    fontWeight: '800',
  },
  chainSection: {
    marginBottom: 10,
  },
  chainTitle: {
    color: colors.brandText,
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 6,
    opacity: 0.9,
  },
  chainChip: {
    marginRight: 8,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: 'rgba(233, 238, 255, 0.2)',
    backgroundColor: 'rgba(233, 238, 255, 0.08)',
  },
  chainChipActive: {
    backgroundColor: 'rgba(255, 199, 95, 0.22)',
    borderColor: 'rgba(255, 199, 95, 0.62)',
  },
  chainChipText: {
    color: colors.brandText,
    fontSize: 12,
    fontWeight: '700',
  },
  productsSection: {
    marginBottom: 12,
  },
  productsTitle: {
    color: colors.brandText,
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 8,
  },
  productTile: {
    width: 130,
    marginRight: 10,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(233, 238, 255, 0.18)',
    backgroundColor: 'rgba(16, 36, 95, 0.9)',
    padding: 8,
  },
  productTileImage: {
    width: '100%',
    height: 92,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
  },
  productTileName: {
    marginTop: 8,
    color: colors.brandText,
    fontSize: 12,
    fontWeight: '700',
    minHeight: 32,
  },
  productTilePrice: {
    marginTop: 5,
    color: '#4cc9f0',
    fontSize: 12,
    fontWeight: '800',
  },
  productTilePriceMuted: {
    marginTop: 5,
    color: 'rgba(233, 238, 255, 0.72)',
    fontSize: 12,
    fontWeight: '700',
  },
});
