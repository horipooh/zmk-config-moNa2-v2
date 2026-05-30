import { create } from 'zustand';
import type { StoreLocation } from '../api/types';

interface MapBounds {
  swLat: number;
  swLng: number;
  neLat: number;
  neLng: number;
}

interface MapState {
  selectedStore: StoreLocation | null;
  mapCenter: { lat: number; lng: number };
  zoom: number;
  bounds: MapBounds | null;
  setSelectedStore: (store: StoreLocation | null) => void;
  setMapCenter: (center: { lat: number; lng: number }) => void;
  setZoom: (zoom: number) => void;
  setBounds: (bounds: MapBounds | null) => void;
}

export const useMapStore = create<MapState>((set) => ({
  selectedStore: null,
  mapCenter: { lat: 35.6762, lng: 139.6503 }, // Tokyo
  zoom: 11,
  bounds: null,
  setSelectedStore: (store) => set({ selectedStore: store }),
  setMapCenter: (center) => set({ mapCenter: center }),
  setZoom: (zoom) => set({ zoom }),
  setBounds: (bounds) => set({ bounds }),
}));
