import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, Layers, Search, Heart, User, ShoppingBag } from "lucide-react";
import { useCartStore } from "@/store/useCartStore";
import { useWishlistStore } from "@/store/useWishlistStore";
import { useAuthStore } from "@/store/useAuthStore";
import { AISearchModal } from "@/components/ai/AISearchModal";
import { useTranslation } from "react-i18next";

export function MobileBottomNav() {
  const location = useLocation();
  const cartCount = useCartStore((state) => state.itemCount);
  const wishlistCount = useWishlistStore((state) => state.items.length);
  const { user } = useAuthStore();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { t } = useTranslation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      <div className="fixed bottom-0 inset-x-0 bg-white border-t border-gray-200 z-40 md:hidden shadow-[0_-4px_16px_rgba(0,0,0,0.06)] px-4 pb-[env(safe-area-inset-bottom,16px)] pt-3">
        <div className="flex justify-around items-center max-w-lg mx-auto">

          {/* Home Link */}
          <Link
            to="/"
            className={`flex flex-col items-center justify-center gap-1.5 transition-colors relative py-1 flex-1 ${isActive("/") ? "text-black font-semibold" : "text-gray-400 hover:text-black"
              }`}
          >
            <Home className="h-5 w-5 stroke-[2px]" />
            <span className="text-[9px] uppercase tracking-widest font-black">{t('home')}</span>
            {isActive("/") && <span className="absolute bottom-0 h-1 w-1 bg-black rounded-full" />}
          </Link>

          {/* Categories / Shop Link */}
          <Link
            to="/shop"
            className={`flex flex-col items-center justify-center gap-1.5 transition-colors relative py-1 flex-1 ${isActive("/shop") ? "text-black font-semibold" : "text-gray-400 hover:text-black"
              }`}
          >
            <Layers className="h-5 w-5 stroke-[2px]" />
            <span className="text-[9px] uppercase tracking-widest font-black">{t('shop')}</span>
            {isActive("/shop") && <span className="absolute bottom-0 h-1 w-1 bg-black rounded-full" />}
          </Link>

          {/* Search Trigger */}
          <button
            onClick={() => setIsSearchOpen(true)}
            className="flex flex-col items-center justify-center gap-1.5 text-gray-400 hover:text-black transition-colors py-1 flex-1 cursor-pointer"
          >
            <Search className="h-5 w-5 stroke-[2px]" />
            <span className="text-[9px] uppercase tracking-widest font-black">{t('search')}</span>
          </button>

          {/* Wishlist Link */}
          <Link
            to="/wishlist"
            className={`flex flex-col items-center justify-center gap-1.5 transition-colors relative py-1 flex-1 ${isActive("/wishlist") ? "text-black font-semibold" : "text-gray-400 hover:text-black"
              }`}
          >
            <Heart className="h-5 w-5 stroke-[2px]" />
            {wishlistCount > 0 && (
              <span className="absolute top-0 right-4 h-4 min-w-[16px] px-1 bg-black text-white text-[8px] font-black rounded-full flex items-center justify-center border border-white">
                {wishlistCount}
              </span>
            )}
            <span className="text-[9px] uppercase tracking-widest font-black">{t('wishlist')}</span>
            {isActive("/wishlist") && <span className="absolute bottom-0 h-1 w-1 bg-black rounded-full" />}
          </Link>

          {/* Account Link */}
          <Link
            to={user ? "/profile" : "/login"}
            className={`flex flex-col items-center justify-center gap-1.5 transition-colors relative py-1 flex-1 ${isActive("/profile") || isActive("/login") ? "text-black font-semibold" : "text-gray-400 hover:text-black"
              }`}
          >
            <User className="h-5 w-5 stroke-[2px]" />
            <span className="text-[9px] uppercase tracking-widest font-black">{t('account')}</span>
            {(isActive("/profile") || isActive("/login")) && <span className="absolute bottom-0 h-1 w-1 bg-black rounded-full" />}
          </Link>

        </div>
      </div>

      {/* AI Search Modal */}
      <AISearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
}
