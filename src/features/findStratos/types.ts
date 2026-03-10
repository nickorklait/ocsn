export interface KassalApiListResponse<T> {
  data?: T[];
  results?: T[];
}

export interface StoreChain {
  id?: string | number;
  name?: string;
  logo?: string | null;
  website?: string | null;
}

export interface OpeningHours {
  weekdayText?: string[] | null;
  raw?: unknown;
}

export interface Store {
  id?: string | number;
  group?: string | null;
  name?: string;
  address?: string;
  chain?: StoreChain | string | null;
  chainName?: string;
  logo?: string | null;
  website?: string | null;
  detailUrl?: string | null;
  distance?: number | null;
  distance_km?: number | null;
  opening_hours?: unknown;
  openingHours?: {
    monday?: string | null;
    tuesday?: string | null;
    wednesday?: string | null;
    thursday?: string | null;
    friday?: string | null;
    saturday?: string | null;
    sunday?: string | null;
  } | null;
  position?: {
    lat?: string | number | null;
    lng?: string | number | null;
  } | null;
}

export interface ProductPrice {
  amount?: number | null;
  currency?: string;
}

export interface Product {
  id?: string | number;
  name?: string;
  image?: string | null;
  ean?: string | null;
  current_price?: number | null;
  price?: number | null;
  store_id?: string | number | null;
  physical_store_id?: string | number | null;
  store?:
    | {
        id?: string | number;
        code?: string;
        name?: string;
        url?: string;
        logo?: string;
      }
    | Array<{
        id?: string | number;
        code?: string;
        name?: string;
        url?: string;
        logo?: string;
      }>
    | null;
  vendor?: string | null;
}

export interface BulkPriceStore {
  store?: string;
  name?: string;
  current_price?: number | null;
}

export interface BulkPriceItem {
  ean?: string;
  stores?: BulkPriceStore[];
}

export interface FindStratosStore {
  id: string;
  name: string;
  groupCode?: string | null;
  chainName: string;
  logo?: string | null;
  website?: string | null;
  distanceKm?: number | null;
  openingHoursLabel: string;
  isOpenNow?: boolean | null;
  priceNok?: number | null;
  matchedProduct?: NearbyProduct | null;
}

export interface NearbyProduct {
  id: string;
  name: string;
  imageUrl: string;
  priceNok?: number | null;
  ean?: string | null;
}
