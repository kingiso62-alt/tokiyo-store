import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { supabase } from '@/lib/supabase';
import {
  fetchOrCreateCart,
  fetchCartItems,
  addItemToCart,
  removeItemFromCart,
  clearCartItems,
} from '@/lib/api';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  color?: string | null;
  size?: string | null;
  inventory_id?: string;
  product_id?: string;
}

interface CartStore {
  items: CartItem[];
  cartId: string | null;
  isOpen: boolean;
  isSyncing: boolean;
  // Actions
  setIsOpen: (isOpen: boolean) => void;
  addItem: (item: Omit<CartItem, 'quantity'> & { quantity?: number }) => Promise<void>;
  removeItem: (id: string) => Promise<void>;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => Promise<void>;
  // Cloud sync
  syncFromCloud: (userId: string) => Promise<void>;
  mergeLocalToCloud: (userId: string) => Promise<void>;
  // Derived
  get itemCount(): number;
  get subtotal(): number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      cartId: null,
      isOpen: false,
      isSyncing: false,

      setIsOpen: (isOpen) => set({ isOpen }),

      addItem: async (item) => {
        const { items, cartId } = get();
        const cartItemId = item.inventory_id || item.id;

        // Optimistic local update
        const existing = items.find((i) => i.id === cartItemId);
        if (existing) {
          set({
            items: items.map((i) =>
              i.id === cartItemId
                ? { ...i, quantity: i.quantity + (item.quantity || 1) }
                : i
            ),
            isOpen: true,
          });
        } else {
          set({
            items: [...items, { ...item, id: cartItemId, quantity: item.quantity || 1 }],
            isOpen: true,
          });
        }

        // Cloud sync if logged in
        if (cartId) {
          try {
            await addItemToCart(cartId, item.inventory_id || item.id, item.quantity || 1, item.product_id);
          } catch (e) {
            console.error("Cloud cart add failed:", e);
          }
        }
      },

      removeItem: async (id) => {
        const { items } = get();
        set({ items: items.filter((i) => i.id !== id) });

        // Cloud sync: id is the cart_item's database id (uuid)
        try {
          await removeItemFromCart(id);
        } catch (e) {
          // Ignore - item may only be local
        }
      },

      updateQuantity: (id, quantity) => {
        const { items } = get();
        if (quantity <= 0) {
          set({ items: items.filter((i) => i.id !== id) });
        } else {
          set({ items: items.map((i) => (i.id === id ? { ...i, quantity } : i)) });
        }
      },

      clearCart: async () => {
        const { cartId } = get();
        set({ items: [] });
        if (cartId) {
          try {
            await clearCartItems(cartId);
          } catch (e) {
            console.error("Cloud cart clear failed:", e);
          }
        }
      },

      // Load cart from Supabase (used on login)
      syncFromCloud: async (userId: string) => {
        set({ isSyncing: true });
        try {
          const cloudCartId = await fetchOrCreateCart(userId);
          const cloudItems = await fetchCartItems(cloudCartId);
          set({ cartId: cloudCartId, items: cloudItems, isSyncing: false });
        } catch (e) {
          console.error("Cart sync from cloud failed:", e);
          set({ isSyncing: false });
        }
      },

      // Merge existing local cart into cloud (run once after login)
      mergeLocalToCloud: async (userId: string) => {
        const { items: localItems } = get();
        set({ isSyncing: true });
        try {
          const cloudCartId = await fetchOrCreateCart(userId);
          // Push local items that have inventory_id to the cloud
          for (const item of localItems) {
            if (item.inventory_id) {
              try {
                await addItemToCart(cloudCartId, item.inventory_id, item.quantity, item.product_id);
              } catch (_) {}
            }
          }
          // After merging, sync the full cloud cart
          const mergedItems = await fetchCartItems(cloudCartId);
          set({ cartId: cloudCartId, items: mergedItems, isSyncing: false });
        } catch (e) {
          console.error("Cart merge failed:", e);
          set({ isSyncing: false });
        }
      },

      get itemCount() {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },

      get subtotal() {
        return get().items.reduce((total, item) => total + item.price * item.quantity, 0);
      },
    }),
    {
      name: 'tokiyo-cart-v2',
      partialize: (state) => ({ items: state.items }),
    }
  )
);

// Subscribe to auth changes to trigger cart sync / merge
supabase.auth.onAuthStateChange(async (event, session) => {
  const store = useCartStore.getState();
  if (event === 'SIGNED_IN' && session?.user) {
    // Merge any local items first, then sync
    await store.mergeLocalToCloud(session.user.id);
  } else if (event === 'SIGNED_OUT') {
    // Clear cloud cart reference; keep local items
    useCartStore.setState({ cartId: null, items: [] });
  }
});
