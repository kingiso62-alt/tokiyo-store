import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Product } from './useWishlistStore';

interface RecentlyViewedState {
  items: Product[];
  addViewedProduct: (item: Product) => void;
  clearHistory: () => void;
}

export const useRecentlyViewedStore = create<RecentlyViewedState>()(
  persist(
    (set) => ({
      items: [],
      addViewedProduct: (item) => set((state) => {
        // Remove it if it exists so we can move it to the front
        const filtered = state.items.filter((i) => i.id !== item.id);
        // Add to the front, keep max 10
        return { items: [item, ...filtered].slice(0, 10) };
      }),
      clearHistory: () => set({ items: [] }),
    }),
    {
      name: 'tokiyo-recently-viewed-storage',
    }
  )
);
