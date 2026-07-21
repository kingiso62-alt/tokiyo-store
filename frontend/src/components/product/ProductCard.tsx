import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/store/useCartStore";
import { useWishlistStore, type Product } from "@/store/useWishlistStore";
import { useCompareStore } from "@/store/useCompareStore";

interface ProductCardProps {
  product: Product;
  onQuickView?: (product: Product) => void;
}

export function ProductCard({ product, onQuickView }: ProductCardProps) {
  const addItem = useCartStore(state => state.addItem);
  const { addItem: addWishlist, removeItem: removeWishlist, isInWishlist } = useWishlistStore();
  const { addItem: addCompare, removeItem: removeCompare, isInCompare } = useCompareStore();
  
  const inWishlist = isInWishlist(product.id);
  const inCompare = isInCompare(product.id);

  const toggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    if (inWishlist) removeWishlist(product.id);
    else addWishlist(product);
  };

  const toggleCompare = (e: React.MouseEvent) => {
    e.preventDefault();
    if (inCompare) removeCompare(product.id);
    else addCompare(product);
  };

  return (
    <div className="group bg-[#0c0c0c] border border-zinc-900 rounded-xl overflow-hidden shadow-lg hover:border-zinc-800 hover:shadow-2xl hover:-translate-y-0.5 transition-all duration-300 flex flex-col justify-between text-left">
      <div className="relative">
        
        {/* Badges */}
        {product.tag && (
          <div className="absolute top-3 left-3 z-10 bg-black/85 backdrop-blur-md border border-[#D4AF37]/50 text-white text-[8px] font-black uppercase tracking-widest px-2.5 py-1">
            {product.tag}
          </div>
        )}

        {/* Wishlist Toggle Button (Top Right) */}
        <button 
          onClick={toggleWishlist}
          className={`absolute top-3 right-3 z-10 w-8 h-8 rounded-full flex items-center justify-center bg-black/60 backdrop-blur-md border transition-all ${
            inWishlist ? 'border-[#D4AF37] text-[#D4AF37]' : 'border-zinc-800 text-white hover:text-[#D4AF37]'
          }`}
          aria-label="Wishlist"
        >
          <svg className="w-3.5 h-3.5" fill={inWishlist ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </button>

        {/* Circular Add to Cart Button (Bottom Right) */}
        <button 
          onClick={(e) => { e.preventDefault(); addItem({ ...product, quantity: 1 }); }}
          className="absolute bottom-3 right-3 z-10 w-8.5 h-8.5 rounded-full bg-[#D4AF37] hover:bg-white text-black flex items-center justify-center shadow-lg transition-all hover:scale-105 active:scale-95 cursor-pointer"
          aria-label="Add to Cart"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
        </button>
        
        {/* Product Image */}
        <Link to={`/product/${product.id}`} className="block aspect-[4/5] overflow-hidden bg-zinc-950 border-b border-zinc-900">
          <img 
            src={product.image} 
            alt={product.name}
            loading="lazy"
            className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
          />
        </Link>
      </div>
      
      {/* Product Details (Left Aligned) */}
      <div className="p-4 space-y-1.5">
        <p className="text-[9px] text-[#D4AF37] font-black uppercase tracking-[0.2em]">{product.category || 'Luxury'}</p>
        
        <h3 className="text-xs font-bold text-white uppercase tracking-wider line-clamp-1">
          <Link to={`/product/${product.id}`} className="hover:text-[#D4AF37] transition-colors">{product.name}</Link>
        </h3>
        
        {/* Star Rating and Count */}
        <div className="flex items-center gap-1.5">
          <div className="flex text-[#D4AF37] space-x-0.5">
            {[1, 2, 3, 4, 5].map(star => (
              <svg key={star} className="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
          <span className="text-[9px] text-zinc-500 font-extrabold font-sans">
            ({(product.id.charCodeAt(0) || 12) * 3 % 20 + 10})
          </span>
        </div>

        {/* Product Price */}
        <p className="text-xs font-extrabold text-[#D4AF37] font-sans pt-1">${product.price.toFixed(2)}</p>
      </div>
    </div>
  );
}
