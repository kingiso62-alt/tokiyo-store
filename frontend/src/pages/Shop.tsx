import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { FilterSidebar } from "@/components/shop/FilterSidebar";
import { ActiveFilters } from "@/components/shop/ActiveFilters";
import { ProductCard } from "@/components/product/ProductCard";
import { QuickViewModal } from "@/components/product/QuickViewModal";
import { fetchProducts } from "@/lib/api";
import type { Product } from "@/store/useWishlistStore";

export function Shop() {
  const [searchParams] = useSearchParams();
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const searchQuery = searchParams.get('q');
  const categoryQuery = searchParams.get('category');

  const { data: dbProducts, isLoading, isError } = useQuery({
    queryKey: ['products'],
    queryFn: () => fetchProducts(),
    // Add a fallback retry so it doesn't instantly die on mock DB
    retry: 1
  });

  // Map DB products to the frontend Product type expected by ProductCard
  const catalogProducts: Product[] = (dbProducts || []).map(p => ({
    id: p.id,
    name: p.title,
    price: p.price,
    image: p.images?.[0]?.image_url || "https://images.unsplash.com/photo-1593030761757-71fae45fa0e5?q=80&w=600", // Fallback image
    category: p.category?.name || "Uncategorized",
    tag: p.is_trending ? "Trending" : p.is_featured ? "Featured" : ""
  }));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      
      {/* Page Header */}
      <div className="mb-12 text-center md:text-left">
        <h1 className="text-4xl font-bold uppercase tracking-tight mb-4">
          {searchQuery ? `Search Results for "${searchQuery}"` : categoryQuery ? `${categoryQuery} Collection` : 'All Products'}
        </h1>
        <p className="text-muted-foreground text-lg">
          {isLoading ? "Loading..." : `Showing ${catalogProducts.length} results`}
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-12">
        
        {/* Sidebar Filters */}
        <aside className="w-full lg:w-64 flex-shrink-0">
          <FilterSidebar />
        </aside>

        {/* Main Content */}
        <div className="flex-1">
          
          {/* Top Bar (Active Filters & Sort) */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <ActiveFilters />
            
            <div className="flex items-center gap-4 ml-auto">
              <div className="flex bg-secondary rounded-md p-1">
                <button 
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-sm transition-colors ${viewMode === 'grid' ? 'bg-background shadow-sm text-primary' : 'text-muted-foreground hover:text-foreground'}`}
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
                </button>
                <button 
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-sm transition-colors ${viewMode === 'list' ? 'bg-background shadow-sm text-primary' : 'text-muted-foreground hover:text-foreground'}`}
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
                </button>
              </div>
              
              <select className="bg-transparent border border-border text-sm font-medium uppercase tracking-widest py-2 px-4 rounded-none outline-none focus:border-primary">
                <option value="newest">Sort by: Newest</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="popular">Most Popular</option>
              </select>
            </div>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : isError ? (
            <div className="bg-red-50 text-red-500 p-6 rounded-lg text-center border border-red-200">
              <h3 className="font-bold text-lg mb-2">Error Connecting to Database</h3>
              <p>Unable to fetch products. Please ensure your Supabase connection is correctly configured in the environment variables.</p>
            </div>
          ) : catalogProducts.length === 0 ? (
            <div className="bg-secondary/50 text-muted-foreground p-12 rounded-lg text-center border border-border">
              <h3 className="font-bold text-lg mb-2 text-primary">No Products Found</h3>
              <p>Your database is currently empty. Add products via the Admin Dashboard.</p>
            </div>
          ) : (
            <div className={viewMode === 'grid' ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8" : "flex flex-col gap-8"}>
              {catalogProducts.map(product => (
                <div key={product.id} className={viewMode === 'list' ? 'flex gap-6 items-center border border-border p-4' : ''}>
                  {viewMode === 'list' ? (
                    <>
                      <div className="w-48 flex-shrink-0">
                         <ProductCard product={product} onQuickView={(p) => setQuickViewProduct(p)} />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs text-muted-foreground uppercase tracking-widest mb-1">{product.category}</p>
                        <h3 className="text-xl font-bold uppercase mb-2"><Link to={`/product/${product.id}`}>{product.name}</Link></h3>
                        <p className="text-lg font-medium text-accent mb-4">${product.price.toFixed(2)}</p>
                        <p className="text-muted-foreground mb-4 line-clamp-2">Experience luxury with this premium item, crafted with the finest materials and designed for the modern individual.</p>
                        <button 
                          onClick={() => setQuickViewProduct(product)}
                          className="text-xs font-bold uppercase tracking-widest border-b border-primary text-primary pb-1 hover:text-accent hover:border-accent transition-colors"
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
          
          {/* Pagination Placeholder */}
          {!isLoading && catalogProducts.length > 0 && (
            <div className="mt-16 flex justify-center">
              <button className="px-8 py-3 border border-border text-sm font-bold uppercase tracking-widest hover:bg-foreground hover:text-background transition-colors">
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
  );
}
