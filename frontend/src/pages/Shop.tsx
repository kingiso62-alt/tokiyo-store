import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { FilterSidebar } from "@/components/shop/FilterSidebar";
import { ActiveFilters } from "@/components/shop/ActiveFilters";
import { ProductCard } from "@/components/product/ProductCard";
import { QuickViewModal } from "@/components/product/QuickViewModal";
import { fetchProducts } from "@/lib/api";
import type { Product } from "@/store/useWishlistStore";
import { Grid, List } from "lucide-react";

export function Shop() {
  const [searchParams] = useSearchParams();
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const searchQuery = searchParams.get('q');
  const categoryQuery = searchParams.get('category');
  const maxPriceQuery = Number(searchParams.get('maxPrice')) || 5000;
  const colorQuery = searchParams.get('color');
  const sizeQuery = searchParams.get('size');
  const brandQuery = searchParams.get('brand');
  const ratingQuery = Number(searchParams.get('rating')) || 0;

  const { data: dbProducts, isLoading, isError } = useQuery({
    queryKey: ['products'],
    queryFn: () => fetchProducts(),
    retry: 1
  });

  // Map DB products to the frontend Product type expected by ProductCard
  const catalogProducts = (dbProducts || []).map(p => {
    const inv = p.inventory || [];
    const sizesList = [...new Set(inv.map(i => i.size).filter(Boolean))] as string[];
    const colorsList = [...new Set(inv.map(i => i.color).filter(Boolean))] as string[];
    
    return {
      id: p.id,
      name: p.title,
      price: Number(p.price),
      image: p.images?.[0]?.image_url || "https://images.unsplash.com/photo-1593030761757-71fae45fa0e5?q=80&w=600",
      category: p.category?.name || "Uncategorized",
      categorySlug: p.category?.slug || "",
      brandSlug: p.brand?.slug || "",
      rating: Number(p.rating) || 0,
      sizes: sizesList,
      colors: colorsList.map(c => c.toLowerCase()),
      tag: p.is_trending ? "Trending" : p.is_featured ? "Featured" : ""
    };
  });

  // Filter products based on URL parameters
  const filteredProducts = catalogProducts.filter(product => {
    // 1. Search Query
    if (searchQuery && !product.name.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    // 2. Category
    if (categoryQuery && product.categorySlug.toLowerCase() !== categoryQuery.toLowerCase()) {
      return false;
    }
    // 3. Max Price
    if (product.price > maxPriceQuery) {
      return false;
    }
    // 4. Color
    if (colorQuery && !product.colors.includes(colorQuery.toLowerCase())) {
      return false;
    }
    // 5. Size
    if (sizeQuery && !product.sizes.includes(sizeQuery)) {
      return false;
    }
    // 6. Brand
    if (brandQuery && product.brandSlug !== brandQuery) {
      return false;
    }
    // 7. Rating
    if (ratingQuery && product.rating < ratingQuery) {
      return false;
    }
    return true;
  });

  return (
    <div className="bg-[#040404] min-h-screen text-white pt-32 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page Header */}
        <div className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-end border-b border-zinc-900 pb-6 gap-4">
          <div>
            <h1 className="text-3xl font-black uppercase tracking-widest text-white mb-2">
              {searchQuery ? `Search: "${searchQuery}"` : categoryQuery ? `${categoryQuery}` : 'ALL PRODUCTS'}
            </h1>
            <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest">
              {isLoading ? "Loading..." : `Showing ${filteredProducts.length} results`}
            </p>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-10">
          
          {/* Sidebar Filters */}
          <aside className="w-full lg:w-68 flex-shrink-0">
            <FilterSidebar />
          </aside>

          {/* Main Content */}
          <div className="flex-1 space-y-6">
            
            {/* Top Bar (Active Filters & Sort) */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-[#080808] border border-zinc-900 p-4 rounded-2xl">
              <ActiveFilters />
              
              <div className="flex items-center gap-4 ml-auto">
                {/* View toggles */}
                <div className="flex border border-zinc-800 p-1 rounded-lg">
                  <button 
                    onClick={() => setViewMode('grid')}
                    className={`p-1.5 rounded transition-all ${viewMode === 'grid' ? 'bg-[#D4AF37] text-black shadow-sm' : 'text-zinc-400 hover:text-white'}`}
                  >
                    <Grid className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => setViewMode('list')}
                    className={`p-1.5 rounded transition-all ${viewMode === 'list' ? 'bg-[#D4AF37] text-black shadow-sm' : 'text-zinc-400 hover:text-white'}`}
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>
                
                {/* Select sort */}
                <select className="bg-zinc-950 border border-zinc-800 text-[10px] font-extrabold uppercase tracking-widest py-2.5 px-4 rounded-lg outline-none focus:border-[#D4AF37] text-white">
                  <option value="newest">SORT BY: NEWEST</option>
                  <option value="price-asc">PRICE: LOW TO HIGH</option>
                  <option value="price-desc">PRICE: HIGH TO LOW</option>
                  <option value="popular">MOST POPULAR</option>
                </select>
              </div>
            </div>

            {isLoading ? (
              <div className="flex justify-center items-center h-72">
                <div className="animate-spin rounded-full h-10 w-10 border-2 border-t-[#D4AF37] border-zinc-800"></div>
              </div>
            ) : isError ? (
              <div className="bg-red-950/30 text-red-400 p-8 rounded-xl text-center border border-red-900/50">
                <h3 className="font-bold text-base uppercase tracking-wider mb-2">Error Connecting to Database</h3>
                <p className="text-xs text-zinc-500">Unable to fetch products. Please ensure your Supabase connection is correctly configured in the environment variables.</p>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="bg-[#080808] text-zinc-500 p-16 rounded-xl text-center border border-zinc-900">
                <h3 className="font-extrabold text-sm uppercase tracking-widest mb-2 text-white">No Products Found</h3>
                <p className="text-xs text-zinc-500">No products match your selected filters. Try clearing some filters.</p>
              </div>
            ) : (
              <div className={viewMode === 'grid' ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" : "flex flex-col gap-6"}>
                {filteredProducts.map(product => (
                  <div key={product.id} className={viewMode === 'list' ? 'flex gap-6 items-center bg-[#080808] border border-zinc-900 rounded-2xl p-4 hover:border-[#D4AF37]/35 transition-all' : ''}>
                    {viewMode === 'list' ? (
                      <>
                        <div className="w-40 flex-shrink-0">
                           <ProductCard product={product} onQuickView={(p) => setQuickViewProduct(p)} />
                        </div>
                        <div className="flex-1 space-y-2 text-left">
                          <p className="text-[9px] text-[#D4AF37] font-black uppercase tracking-[0.2em]">{product.category}</p>
                          <h3 className="text-sm font-extrabold uppercase tracking-wider text-white">
                            <Link to={`/product/${product.id}`}>{product.name}</Link>
                          </h3>
                          <p className="text-xs font-bold text-zinc-400">${product.price.toFixed(2)}</p>
                          <p className="text-zinc-500 text-xs leading-relaxed max-w-lg line-clamp-2">
                            Experience luxury with this premium item, crafted with the finest materials and designed for the modern individual.
                          </p>
                          <button 
                            onClick={() => setQuickViewProduct(product)}
                            className="text-[10px] font-extrabold uppercase tracking-widest border-b border-[#D4AF37] text-[#D4AF37] pb-0.5 hover:text-white hover:border-white transition-colors pt-2"
                          >
                            Quick View
                          </button>
                        </div>
                      </>
                    ) : (
                      <ProductCard product={product} onQuickView={(p) => setQuickViewProduct(p)} />
                    )}
                  </div>
                ))}
              </div>
            )}
            
            {/* Pagination */}
            {!isLoading && filteredProducts.length > 0 && (
              <div className="mt-16 flex justify-center">
                <button className="px-8 py-3.5 border border-zinc-800 text-[10px] font-extrabold uppercase tracking-[0.25em] rounded-xl hover:bg-white hover:text-black hover:border-white transition-all duration-300">
                  Load More Products
                </button>
              </div>
            )}

          </div>
        </div>

        <QuickViewModal 
          product={quickViewProduct} 
          isOpen={!!quickViewProduct} 
          onClose={() => setQuickViewProduct(null)} 
        />
      </div>
    </div>
  );
}
