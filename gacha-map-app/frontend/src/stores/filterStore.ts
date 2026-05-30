import { create } from 'zustand';

interface FilterState {
  manufacturer: string;
  series: string;
  searchQuery: string;
  setManufacturer: (v: string) => void;
  setSeries: (v: string) => void;
  setSearchQuery: (v: string) => void;
  clearFilters: () => void;
}

export const useFilterStore = create<FilterState>((set) => ({
  manufacturer: '',
  series: '',
  searchQuery: '',
  setManufacturer: (manufacturer) => set({ manufacturer, series: '' }),
  setSeries: (series) => set({ series }),
  setSearchQuery: (searchQuery) => set({ searchQuery }),
  clearFilters: () => set({ manufacturer: '', series: '', searchQuery: '' }),
}));
