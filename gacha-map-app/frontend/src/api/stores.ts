import { api } from './client';
import type { ApiResponse, StoreLocation, StoreQueryParams } from './types';

export async function fetchStores(params: StoreQueryParams = {}): Promise<StoreLocation[]> {
  const { data } = await api.get<ApiResponse<StoreLocation[]>>('/api/stores', { params });
  return data.data;
}

export async function fetchStore(id: string): Promise<StoreLocation> {
  const { data } = await api.get<ApiResponse<StoreLocation>>(`/api/stores/${id}`);
  return data.data;
}

export async function fetchStoreFeed(id: string) {
  const { data } = await api.get(`/api/stores/${id}/feed`);
  return data.data;
}
