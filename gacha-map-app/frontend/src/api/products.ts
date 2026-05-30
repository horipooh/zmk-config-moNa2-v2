import { api } from './client';
import type { ApiResponse, GachaProduct, ProductQueryParams, ReleaseInfo } from './types';

export async function fetchProducts(params: ProductQueryParams = {}): Promise<GachaProduct[]> {
  const { data } = await api.get<ApiResponse<GachaProduct[]>>('/api/products', { params });
  return data.data;
}

export async function fetchManufacturers(): Promise<string[]> {
  const { data } = await api.get<ApiResponse<string[]>>('/api/products/manufacturers');
  return data.data;
}

export async function fetchSeries(manufacturer?: string): Promise<string[]> {
  const { data } = await api.get<ApiResponse<string[]>>('/api/products/series', {
    params: manufacturer ? { manufacturer } : {},
  });
  return data.data;
}

export async function fetchReleases(): Promise<ReleaseInfo[]> {
  const { data } = await api.get<ApiResponse<ReleaseInfo[]>>('/api/products/releases');
  return data.data;
}
