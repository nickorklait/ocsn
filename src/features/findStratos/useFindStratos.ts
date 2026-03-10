import { useCallback, useEffect, useMemo, useState } from 'react';
import { Platform } from 'react-native';
import * as Location from 'expo-location';
import { getBulkPriceStoresByEans, getNearbyStores, searchStratosProducts, setKassalApiToken } from './kassalApi';
import { BulkPriceItem, FindStratosStore, NearbyProduct, Product, Store } from './types';

const CACHE_TTL_MS = 2 * 60 * 1000;

type CacheEntry = {
  key: string;
  timestamp: number;
  stores: FindStratosStore[];
  nearbyProducts: NearbyProduct[];
};

type Coordinates = {
  latitude: number;
  longitude: number;
};

let latestCache: CacheEntry | null = null;

const asNumber = (value: unknown): number | null => {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value;
  }
  if (typeof value === 'string') {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
};

const normalizeStoreId = (value: unknown) => {
  if (value === null || value === undefined) {
    return '';
  }
  return String(value);
};

const normalizeGroupCode = (value: unknown) => (typeof value === 'string' ? value.trim().toUpperCase() : '');
const normalizeKey = (value: unknown) => normalizeStoreId(value).trim().toUpperCase();

const haversineDistanceKm = (from: Coordinates, toLat: number, toLng: number) => {
  const toRadians = (degrees: number) => (degrees * Math.PI) / 180;
  const earthRadiusKm = 6371;
  const dLat = toRadians(toLat - from.latitude);
  const dLng = toRadians(toLng - from.longitude);
  const lat1 = toRadians(from.latitude);
  const lat2 = toRadians(toLat);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return earthRadiusKm * c;
};

const getDistanceKm = (store: Store, coords: Coordinates) => {
  const directDistance = asNumber(store.distance_km) ?? asNumber(store.distance);
  if (directDistance !== null) {
    return directDistance;
  }

  const lat = asNumber(store.position?.lat);
  const lng = asNumber(store.position?.lng);
  if (lat === null || lng === null) {
    return null;
  }
  return haversineDistanceKm(coords, lat, lng);
};

const parseTimeToMinutes = (value: string) => {
  const [hour, minute] = value.split(':').map((part) => Number(part));
  if (!Number.isFinite(hour) || !Number.isFinite(minute)) {
    return null;
  }
  return hour * 60 + minute;
};

const getTodaySchedule = (openingHours: unknown) => {
  if (openingHours && typeof openingHours === 'object' && !Array.isArray(openingHours)) {
    const weekly = openingHours as Record<string, unknown>;
    const dayKeys = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'] as const;
    const todayKey = dayKeys[new Date().getDay()];
    const todayValue = weekly[todayKey];

    if (typeof todayValue === 'string' && todayValue.trim()) {
      const rangeParts = todayValue.split('-').map((part) => part.trim());
      if (rangeParts.length === 2 && rangeParts[0] && rangeParts[1]) {
        return {
          openLabel: `Open until ${rangeParts[1]}`,
          rawRange: todayValue,
        };
      }
      return {
        openLabel: todayValue,
        rawRange: null,
      };
    }

    if (todayValue === null) {
      return {
        openLabel: 'Closed today',
        rawRange: null,
      };
    }
  }

  return null;
};

const getOpenNowState = (rawRange: string | null) => {
  if (!rawRange) {
    return null;
  }
  const [startRaw, endRaw] = rawRange.split('-').map((part) => part.trim());
  if (!startRaw || !endRaw) {
    return null;
  }
  const start = parseTimeToMinutes(startRaw);
  const end = parseTimeToMinutes(endRaw);
  if (start === null || end === null) {
    return null;
  }

  const now = new Date();
  const nowMinutes = now.getHours() * 60 + now.getMinutes();
  return nowMinutes >= start && nowMinutes <= end;
};

const formatOpeningHours = (openingHours: unknown): { label: string; isOpenNow: boolean | null } => {
  const todaySchedule = getTodaySchedule(openingHours);
  if (todaySchedule) {
    return {
      label: todaySchedule.openLabel,
      isOpenNow: getOpenNowState(todaySchedule.rawRange),
    };
  }

  if (openingHours && typeof openingHours === 'object' && !Array.isArray(openingHours)) {
    const weekly = openingHours as Record<string, unknown>;
    const text = weekly.text || weekly.label || weekly.today;
    if (typeof text === 'string') {
      return { label: text, isOpenNow: null };
    }
  }

  if (!openingHours) {
    return { label: 'Opening hours unavailable', isOpenNow: null };
  }
  if (typeof openingHours === 'string') {
    return { label: openingHours, isOpenNow: null };
  }
  if (Array.isArray(openingHours)) {
    const first = openingHours.find((item) => typeof item === 'string');
    return { label: first || 'Opening hours unavailable', isOpenNow: null };
  }
  return { label: 'Opening hours unavailable', isOpenNow: null };
};

const mapStore = (store: Store, coords: Coordinates, priceByStoreId: Map<string, number>): FindStratosStore => {
  const storeId = normalizeStoreId(store.id);
  const groupCode = normalizeGroupCode(store.group);
  const chain =
    typeof store.chain === 'string'
      ? store.chain
      : store.chain?.name || store.chainName || groupCode || 'Unknown chain';
  const logoCandidate = (typeof store.chain === 'object' && store.chain?.logo) || store.logo || null;
  const websiteCandidate =
    (typeof store.chain === 'object' && store.chain?.website) || store.website || store.detailUrl || null;
  const opening = formatOpeningHours(store.openingHours || store.opening_hours);

  return {
    id: storeId || `${store.name || 'store'}-${Math.random().toString(36).slice(2, 7)}`,
    name: store.name || 'Unknown store',
    groupCode: groupCode || null,
    chainName: chain,
    logo: typeof logoCandidate === 'string' && logoCandidate.includes('localhost') ? null : logoCandidate,
    website: websiteCandidate,
    distanceKm: getDistanceKm(store, coords),
    openingHoursLabel: opening.label,
    isOpenNow: opening.isOpenNow,
    priceNok: priceByStoreId.get((groupCode || storeId).trim().toUpperCase()) ?? null,
    matchedProduct: null,
  };
};

const buildPriceMap = (products: Product[]) => {
  const map = new Map<string, number>();
  const writePrice = (key: string, price: number) => {
    if (!key) {
      return;
    }
    const normalized = key.trim().toUpperCase();
    if (!normalized) {
      return;
    }
    const existing = map.get(normalized);
    if (existing === undefined || price < existing) {
      map.set(normalized, price);
    }
  };

  products.forEach((product) => {
    const price = asNumber(product.current_price) ?? asNumber(product.price);
    if (price === null) {
      return;
    }

    writePrice(normalizeStoreId(product.store_id ?? product.physical_store_id), price);

    const storeRefs = Array.isArray(product.store)
      ? product.store
      : product.store
        ? [product.store]
        : [];

    storeRefs.forEach((storeRef) => {
      writePrice(normalizeStoreId(storeRef.id), price);
      writePrice(normalizeGroupCode(storeRef.code), price);
      writePrice(normalizeStoreId(storeRef.name), price);
    });

    const vendorKey = normalizeGroupCode(product.vendor);
    if (vendorKey) {
      writePrice(vendorKey, price);
    }
  });
  return map;
};

const mergeBulkPriceMap = (map: Map<string, number>, bulkItems: BulkPriceItem[]) => {
  const writePrice = (key: string, price: number) => {
    if (!key) {
      return;
    }
    const normalized = key.trim().toUpperCase();
    if (!normalized) {
      return;
    }
    const existing = map.get(normalized);
    if (existing === undefined || price < existing) {
      map.set(normalized, price);
    }
  };

  bulkItems.forEach((item) => {
    (item.stores || []).forEach((storeRow) => {
      const price = asNumber(storeRow.current_price);
      if (price === null) {
        return;
      }
      writePrice(normalizeGroupCode(storeRow.store), price);
      writePrice(normalizeStoreId(storeRow.name), price);
    });
  });

  return map;
};

const toValidImageUrl = (value: unknown) => {
  if (typeof value !== 'string') {
    return null;
  }
  const trimmed = value.trim();
  if (!trimmed || trimmed.includes('localhost')) {
    return null;
  }
  return trimmed;
};

const getProductPrice = (product: Product) => asNumber(product.current_price) ?? asNumber(product.price);

const buildProductPreviewMaps = (products: Product[]) => {
  const byStoreKey = new Map<string, NearbyProduct>();
  const listByIdentity = new Map<string, NearbyProduct>();

  const writeStorePreview = (key: string, preview: NearbyProduct) => {
    if (!key) {
      return;
    }
    const existing = byStoreKey.get(key);
    const existingPrice = existing?.priceNok ?? Number.MAX_SAFE_INTEGER;
    const incomingPrice = preview.priceNok ?? Number.MAX_SAFE_INTEGER;
    if (!existing || incomingPrice < existingPrice) {
      byStoreKey.set(key, preview);
    }
  };

  products.forEach((product) => {
    const imageUrl = toValidImageUrl(product.image);
    if (!imageUrl || !product.name) {
      return;
    }

    const preview: NearbyProduct = {
      id: normalizeStoreId(product.id || product.ean || product.name),
      name: product.name,
      imageUrl,
      priceNok: getProductPrice(product),
      ean: product.ean || null,
    };

    const identityKey = (product.ean || product.name).trim().toUpperCase();
    if (!listByIdentity.has(identityKey)) {
      listByIdentity.set(identityKey, preview);
    } else {
      const existing = listByIdentity.get(identityKey);
      const existingPrice = existing?.priceNok ?? Number.MAX_SAFE_INTEGER;
      const incomingPrice = preview.priceNok ?? Number.MAX_SAFE_INTEGER;
      if (incomingPrice < existingPrice) {
        listByIdentity.set(identityKey, preview);
      }
    }

    writeStorePreview(normalizeKey(product.store_id), preview);
    writeStorePreview(normalizeKey(product.physical_store_id), preview);
    writeStorePreview(normalizeGroupCode(product.vendor), preview);

    const storeRefs = Array.isArray(product.store)
      ? product.store
      : product.store
        ? [product.store]
        : [];
    storeRefs.forEach((storeRef) => {
      writeStorePreview(normalizeKey(storeRef.id), preview);
      writeStorePreview(normalizeGroupCode(storeRef.code), preview);
      writeStorePreview(normalizeKey(storeRef.name), preview);
    });
  });

  const nearbyProducts = [...listByIdentity.values()]
    .sort((a, b) => (a.priceNok ?? Number.MAX_SAFE_INTEGER) - (b.priceNok ?? Number.MAX_SAFE_INTEGER))
    .slice(0, 8);

  return { byStoreKey, nearbyProducts };
};

const getCoordinates = async () => {
  try {
    const permission = await Location.requestForegroundPermissionsAsync();
    if (permission.status !== 'granted') {
      throw new Error('Location permission denied. Please enable location access and try again.');
    }
    const position = await Location.getCurrentPositionAsync({
      accuracy: Platform.OS === 'web' ? Location.Accuracy.Balanced : Location.Accuracy.High,
    });
    return {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : '';
    if (message.includes('Location permission denied')) {
      throw new Error(message);
    }
    if (Platform.OS === 'web') {
      throw new Error('Location unavailable in this browser. Please allow location access and try again.');
    }
    throw new Error('Location is unavailable on this device right now.');
  }
};

const toFriendlyError = (caughtError: unknown) => {
  if (!(caughtError instanceof Error)) {
    return 'Something went wrong while loading nearby stores.';
  }

  const message = caughtError.message.trim();
  if (message.includes('Cannot find module') || message.includes('expo-location')) {
    return 'Location service is not configured. Please install and enable expo-location.';
  }
  if (message) {
    return message;
  }
  return 'Something went wrong while loading nearby stores.';
};

export const useFindStratos = () => {
  const [stores, setStores] = useState<FindStratosStore[]>([]);
  const [nearbyProducts, setNearbyProducts] = useState<NearbyProduct[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<number | null>(null);

  const fetchNearby = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const coords = await getCoordinates();
      const cacheKey = `${coords.latitude.toFixed(2)}:${coords.longitude.toFixed(2)}`;
      const now = Date.now();

      if (latestCache && latestCache.key === cacheKey && now - latestCache.timestamp < CACHE_TTL_MS) {
        setStores(latestCache.stores);
        setNearbyProducts(latestCache.nearbyProducts);
        setLastUpdated(latestCache.timestamp);
        return;
      }

      const [nearbyStores, products] = await Promise.all([
        getNearbyStores(coords.latitude, coords.longitude),
        searchStratosProducts(),
      ]);

      const eans = Array.from(
        new Set(products.map((product) => (product.ean || '').trim()).filter((ean) => Boolean(ean)))
      );
      const bulkPriceRows = await getBulkPriceStoresByEans(eans);

      const priceByStore = mergeBulkPriceMap(buildPriceMap(products), bulkPriceRows);
      const { byStoreKey, nearbyProducts: nearbyProductsFromProducts } = buildProductPreviewMaps(products);
      const merged = nearbyStores
        .map((store) => {
          const mapped = mapStore(store, coords, priceByStore);
          const storeGroupKey = normalizeGroupCode(store.group);
          const matchedProduct =
            byStoreKey.get(normalizeKey(store.id)) ||
            byStoreKey.get(storeGroupKey) ||
            byStoreKey.get(normalizeKey(store.name)) ||
            null;
          return {
            ...mapped,
            matchedProduct,
          };
        })
        .sort((a, b) => (a.distanceKm ?? Number.MAX_SAFE_INTEGER) - (b.distanceKm ?? Number.MAX_SAFE_INTEGER));

      latestCache = {
        key: cacheKey,
        timestamp: now,
        stores: merged,
        nearbyProducts: nearbyProductsFromProducts,
      };

      setStores(merged);
      setNearbyProducts(nearbyProductsFromProducts);
      setLastUpdated(now);
    } catch (caughtError) {
      setError(toFriendlyError(caughtError));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchNearby();
  }, [fetchNearby]);

  const empty = useMemo(() => !loading && !error && stores.length === 0, [error, loading, stores.length]);
  const needsApiKey = Boolean(error && error.toLowerCase().includes('missing api key'));

  const submitApiKey = useCallback(
    async (token: string) => {
      const trimmed = token.trim();
      if (!trimmed) {
        setError('Please enter a valid API key.');
        return false;
      }
      setKassalApiToken(trimmed);
      await fetchNearby();
      return true;
    },
    [fetchNearby]
  );

  return {
    stores,
    nearbyProducts,
    loading,
    error,
    needsApiKey,
    empty,
    lastUpdated,
    refresh: fetchNearby,
    submitApiKey,
  };
};
