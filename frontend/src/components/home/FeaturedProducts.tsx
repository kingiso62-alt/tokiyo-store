import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/product/ProductCard";
import { QuickViewModal } from "@/components/product/QuickViewModal";
import type { Product } from "@/store/useWishlistStore";

import { useQuery } from "@tanstack/react-query";
import { fetchFeaturedProducts } from "@/lib/api";

export function FeaturedProducts() {
  const [activeTab, setActiveTab] = useState("all");
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  const { data: dbProducts, isLoading } = useQuery({
    queryKey: ['featured_products'],
    queryFn: fetchFeaturedProducts,
    retry: 1
  });

  const products: Product[] = (dbProducts || []).map(p => ({
    id: p.id,
    name: p.title,
    price: p.price,
    image: p.images?.[0]?.image_url || "https://images.unsplash.com/photo-1524592094714-0f0654e20314?q=80&w=600",
    category: p.category?.name || "Uncategorized",
    tag: p.is_trending ? "Trending" : "Featured"
  }));

  return (
    <section className="py-24 bg-[#050505] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Editorial Section Header */}
        <div className="text-center mb-16 space-y-4">
          <span className="text-[#D4AF37] text-xs font-extrabold tracking-[0.25em] uppercase block">
            Our Selection
          </span>
          <h2 className="text-3xl md:text-4xl font-black uppercase tracking-widest text-white leading-tight font-sans">
            Featured Products
          </h2>
          <div className="flex justify-center items-center gap-2">
            <div className="w-8 h-[1px] bg-zinc-800" />
            <div className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]" />
            <div className="w-8 h-[1px] bg-zinc-800" />
          </div>

          {/* Luxury Navigation Selector Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-6">
            {["all", "new arrivals", "best sellers", "trending"].map((tab) => (
              <button 
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`text-[10px] font-black uppercase tracking-widest transition-all px-6 py-2.5 cursor-pointer ${
                  activeTab === tab 
                    ? "bg-[#D4AF37] text-black shadow-lg" 
                    : "bg-transparent text-zinc-400 hover:text-white"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Loading / Cards Grid */}
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#D4AF37]"></div>
          </div>
        ) : products.length === 0 ? (
          <div className="bg-[#0b0b0b] text-zinc-500 p-12 rounded-xl text-center border border-zinc-900">
            <p>No featured products found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {products.slice(0, 8).map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.08 }}
              >
                <ProductCard 
                  product={product} 
                  onQuickView={(p) => setQuickViewProduct(p)} 
                />
              </motion.div>
            ))}
          </div>
        )}
        
        {/* Bottom Editorial Actions button */}
        <div className="mt-16 text-center">
          <Button variant="outline" size="lg" asChild className="rounded-none border-[#D4AF37] text-white hover:bg-[#D4AF37] hover:text-black font-black uppercase tracking-widest px-10 h-12 transition-all duration-300 bg-transparent">
            <Link to="/shop" className="flex items-center gap-2">
              <span>View All Products</span>
              <span>→</span>
            </Link>
          </Button>
        </div>
      </div>

      <QuickViewModal 
        product={quickViewProduct} 
        isOpen={!!quickViewProduct} 
        onClose={() => setQuickViewProduct(null)} 
      />
    </section>
  );
}
