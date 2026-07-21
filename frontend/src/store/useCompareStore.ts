import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Product } from './useWishlistStore';

interface CompareState {
  items: Product[];
  addItem: (item: Product) => void;
  removeItem: (id: string) => void;
  clearCompare: () => void;
  isInCompare: (id: string) => boolean;
}

export const useCompareStore = create<CompareState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (item) => set((state) => {
        if (state.items.find((i) => i.id === item.id)) {
          return state; // Already in compare
        }
        if (state.items.length >= 4) {
          return state; // Max 4 items allowed
        }
        return { items: [...state.items, item] };
      }),
      removeItem: (id) => set((state) => ({
        items: state.items.filter((i) => i.id !== id)
      })),
      clearCompare: () => set({ items: [] }),
      isInCompare: (id) => get().items.some(i => i.id === id),
    }),
    {
      name: 'tokiyo-compare-storage',
    }
  )
);
