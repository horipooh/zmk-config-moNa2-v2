export interface GachaProduct {
  id: string;
  name: string;
  manufacturer: string;
  series: string;
  releaseDate: string;
  price: number;
  imageUrl: string;
  officialUrl: string;
  category: string;
  tags: string[];
}

export interface StoreProduct {
  productId: string;
  confirmedAt: string;
  confirmedBy: 'official' | 'sns' | 'user';
  sourceUrl?: string;
  product?: GachaProduct;
}

export interface StoreLocation {
  id: string;
  name: string;
  address: string;
  prefecture: string;
  city: string;
  lat: number;
  lng: number;
  storeType: 'mall' | 'station' | 'standalone' | 'arcade';
  products: StoreProduct[];
  lastUpdated: string;
  productCount?: number;
}

export interface SnsPost {
  id: string;
  platform: 'twitter' | 'instagram' | 'tiktok';
  text: string;
  author: string;
  authorUrl: string;
  imageUrls: string[];
  postedAt: string;
  likes: number;
  locationName?: string;
  locationCoords?: { lat: number; lng: number };
  productIds: string[];
  storeId?: string;
  store?: StoreLocation;
  products?: GachaProduct[];
}

export interface ReleaseInfo {
  id: string;
  productId: string;
  releaseDate: string;
  manufacturer: string;
  title: string;
  description: string;
  sourceUrl: string;
  fetchedAt: string;
}

export interface ApiResponse<T> {
  data: T;
  total?: number;
  updatedAt: string;
}

export interface StoreQueryParams {
  lat?: number;
  lng?: number;
  radiusKm?: number;
  swLat?: number;
  swLng?: number;
  neLat?: number;
  neLng?: number;
  manufacturer?: string;
  series?: string;
  productId?: string;
}

export interface ProductQueryParams {
  q?: string;
  manufacturer?: string;
  series?: string;
}
