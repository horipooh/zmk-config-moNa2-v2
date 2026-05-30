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
}

export interface StoreProduct {
  productId: string;
  confirmedAt: string;
  confirmedBy: 'official' | 'sns' | 'user';
  sourceUrl?: string;
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
