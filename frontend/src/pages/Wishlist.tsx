import { Link } from "react-router-dom";
import { useWishlistStore } from "@/store/useWishlistStore";
import { ProductCard } from "@/components/product/ProductCard";
import { Button } from "@/components/ui/button";

export function Wishlist() {
  const { items, clearWishlist } = useWishlistStore();

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center min-h-[60vh] flex flex-col items-center justify-center">
        <h1 className="text-4xl font-bold uppercase tracking-widest mb-6">Your Wishlist</h1>
        <p className="text-muted-foreground mb-10 text-lg">You haven't saved any items to your wishlist yet.</p>
        <Button asChild size="lg" className="rounded-none uppercase tracking-widest px-10 h-14">
          <Link to="/shop">Discover Collection</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20 min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 border-b border-border pb-6 gap-4">
        <div>
          <h1 className="text-4xl font-bold uppercase tracking-tight mb-2">My Wishlist</h1>
          <p className="text-muted-foreground">{items.length} {items.length === 1 ? 'item' : 'items'} saved for later</p>
        </div>
        <button 
          onClick={clearWishlist}
          className="text-sm font-semibold uppercase tracking-widest text-muted-foreground hover:text-red-500 transition-colors"
        >
          Clear Wishlist
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {items.map(product => (
          <div key={product.id} className="group relative">
             <ProductCard product={product} onQuickView={() => {}} />
          </div>
        ))}
      </div>
    </div>
  );
}
