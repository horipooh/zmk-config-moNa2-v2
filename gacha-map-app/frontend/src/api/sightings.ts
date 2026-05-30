import { api } from './client';
import type { ApiResponse, SnsPost } from './types';

export async function fetchRecentSightings(): Promise<SnsPost[]> {
  const { data } = await api.get<ApiResponse<SnsPost[]>>('/api/sightings/recent');
  return data.data;
}
