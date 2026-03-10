import { Platform } from 'react-native';
import { BulkPriceItem, KassalApiListResponse, Product, Store } from './types';
import { reportError } from '../../utils/errorReporting';

const KASSAL_BASE_URL = 'https://kassal.app/api/v1';
const DEFAULT_STORE_RADIUS_KM = 10;
const DEFAULT_SIZE = 20;
const PRODUCT_SIZE = 100;
const WEB_TOKEN_STORAGE_KEY = 'EXPO_PUBLIC_KASSALAPP_API_TOKEN';

let tokenSourceLogged = false;
let runtimeToken = '';

const getWebStoredToken = () => {
  if (Platform.OS !== 'web' || typeof window === 'undefined') {
    return '';
  }
  try {
    return window.localStorage.getItem(WEB_TOKEN_STORAGE_KEY)?.trim() || '';
  } catch {
    return '';
  }
};

const getGlobalRuntimeToken = () => {
  if (typeof globalThis === 'undefined') {
    return '';
  }
  const value = (globalThis as { EXPO_PUBLIC_KASSALAPP_API_TOKEN?: unknown }).EXPO_PUBLIC_KASSALAPP_API_TOKEN;
  return typeof value === 'string' ? value.trim() : '';
};

const getApiToken = () => {
  const inMemoryToken = runtimeToken.trim();
  const envToken = process.env.EXPO_PUBLIC_KASSALAPP_API_TOKEN?.trim() || '';
  const globalToken = getGlobalRuntimeToken();
  const webStoredToken = getWebStoredToken();

  const token = inMemoryToken || envToken || globalToken || webStoredToken;
  if (!tokenSourceLogged) {
    const source = inMemoryToken
      ? 'runtime'
      : envToken
        ? 'env'
        : globalToken
          ? 'globalThis'
          : webStoredToken
            ? 'webStorage'
            : 'missing';
    console.info(`[FindStratos] Kassal token source: ${source}`);
    tokenSourceLogged = true;
  }

  return token;
};

export const setKassalApiToken = (token: string) => {
  runtimeToken = token.trim();
  tokenSourceLogged = false;
  if (Platform.OS === 'web' && typeof window !== 'undefined') {
    try {
      window.localStorage.setItem(WEB_TOKEN_STORAGE_KEY, runtimeToken);
    } catch {
      // Ignore web storage errors; runtime token still works for current session.
    }
  }
};

const buildUrl = (path: string, params: Record<string, string | number | boolean>) => {
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    searchParams.set(key, String(value));
  });
  return `${KASSAL_BASE_URL}${path}?${searchParams.toString()}`;
};

const fetchKassalJson = async <T,>(url: string): Promise<T> => {
  const token = getApiToken();
  if (!token) {
    void reportError(new Error('Missing Kassal API token at request time'), 'findStratos:token');
    throw new Error(
      'Missing API key. Set EXPO_PUBLIC_KASSALAPP_API_TOKEN in env. On web dev you can run localStorage.setItem("EXPO_PUBLIC_KASSALAPP_API_TOKEN","<token>") and reload.'
    );
  }

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
    },
  });

  if (!response.ok) {
    let details = '';
    try {
      const payload = (await response.json()) as {
        message?: string;
        errors?: Record<string, string[]>;
      };
      const message = payload?.message ? ` ${payload.message}` : '';
      const fieldErrors = payload?.errors
        ? ` ${Object.entries(payload.errors)
            .map(([field, errors]) => `${field}: ${errors.join(', ')}`)
            .join(' | ')}`
        : '';
      details = `${message}${fieldErrors}`.trim();
    } catch {
      // Ignore parse failures and keep generic status message.
    }
    const apiError = new Error(`Kassal API request failed (${response.status}).${details ? ` ${details}` : ''}`);
    void reportError(apiError, `findStratos:api:${response.status}`);
    throw apiError;
  }

  return (await response.json()) as T;
};

const getList = <T,>(payload: KassalApiListResponse<T> | T[]): T[] => {
  if (Array.isArray(payload)) {
    return payload;
  }
  return payload.data || payload.results || [];
};

export const searchStratosProducts = async () => {
  const url = buildUrl('/products', {
    search: 'stratos',
    size: PRODUCT_SIZE,
    sort: 'price_asc',
  });
  const payload = await fetchKassalJson<KassalApiListResponse<Product> | Product[]>(url);
  return getList(payload);
};

export const getNearbyStores = async (lat: number, lng: number) => {
  const url = buildUrl('/physical-stores', {
    lat,
    lng,
    km: DEFAULT_STORE_RADIUS_KM,
    size: DEFAULT_SIZE,
  });
  const payload = await fetchKassalJson<KassalApiListResponse<Store> | Store[]>(url);
  return getList(payload);
};

export const getBulkPriceStoresByEans = async (eans: string[]) => {
  if (!eans.length) {
    return [] as BulkPriceItem[];
  }

  const token = getApiToken();
  if (!token) {
    return [] as BulkPriceItem[];
  }

  const response = await fetch(`${KASSAL_BASE_URL}/products/prices-bulk`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      eans: eans.slice(0, 100),
      days: 30,
      aggregation: 'min',
    }),
  });

  if (!response.ok) {
    return [] as BulkPriceItem[];
  }

  try {
    const payload = (await response.json()) as { data?: BulkPriceItem[] };
    return payload.data || [];
  } catch {
    return [] as BulkPriceItem[];
  }
};
