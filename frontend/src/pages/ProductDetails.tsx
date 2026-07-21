import { useParams, Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/store/useCartStore";
import { useAuthStore } from "@/store/useAuthStore";
import { useRecentlyViewedStore } from "@/store/useRecentlyViewedStore";
import { ProductGallery } from "@/components/product/ProductGallery";
import { Product360Viewer } from "@/components/product/Product360Viewer";
import { FrequentlyBought } from "@/components/product/FrequentlyBought";
import { ReviewsList } from "@/components/product/ReviewsList";
import { AIRecommendations } from "@/components/ai/AIRecommendations";
import { Sparkles, Heart, AlertCircle, Package } from "lucide-react";
import { fetchProductById, addToWishlist, removeFromWishlist, fetchWishlist } from "@/lib/api";
import type { InventoryVariant } from "@/lib/types";

export function ProductDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const addItem = useCartStore((state) => state.addItem);
  const { user } = useAuthStore();
  const { addViewedProduct } = useRecentlyViewedStore();

  const [selectedVariant, setSelectedVariant] = useState<InventoryVariant | null>(null);
  const [activeTab, setActiveTab] = useState<"details" | "specs" | "shipping">("details");
  const [addedToCart, setAddedToCart] = useState(false);

  // Fetch product from Supabase
  const { data: product, isLoading, isError } = useQuery({
    queryKey: ["product", id],
    queryFn: () => fetchProductById(id!),
    enabled: !!id,
    retry: 1,
  });

  // Fetch user wishlist for heart-toggle state
  const { data: wishlist } = useQuery({
    queryKey: ["wishlist", user?.id],
    queryFn: () => fetchWishlist(user!.id),
    enabled: !!user,
  });

  const isInWishlist = wishlist?.some((w) => w.product_id === product?.id) ?? false;

  const wishlistMutation = useMutation({
    mutationFn: async () => {
      if (!user || !product) return;
      if (isInWishlist) {
        await removeFromWishlist(user.id, product.id);
      } else {
        await addToWishlist(user.id, product.id);
      }
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["wishlist", user?.id] }),
  });

  // Get unique colors and sizes from variants
  const variants = product?.inventory || [];
  const uniqueColors = [...new Set(variants.map((v) => v.color).filter(Boolean))] as string[];
  const uniqueSizes = [...new Set(variants.map((v) => v.size).filter(Boolean))] as string[];
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);

  // When colors/sizes load, pre-select first
  useEffect(() => {
    if (uniqueColors.length > 0 && !selectedColor) setSelectedColor(uniqueColors[0]);
    if (uniqueSizes.length > 0 && !selectedSize) setSelectedSize(uniqueSizes[0]);
  }, [product]);

  // Derive the matching variant based on selections
  useEffect(() => {
    if (!variants.length) return;
    const match = variants.find(
      (v) =>
        (!selectedColor || v.color === selectedColor) &&
        (!selectedSize || v.size === selectedSize)
    );
    setSelectedVariant(match || variants[0]);
  }, [selectedColor, selectedSize, product]);

  // Track recently viewed
  useEffect(() => {
    if (product) {
      addViewedProduct({
        id: product.id,
        name: product.title,
        price: product.price,
        image: product.images?.find((i) => i.is_primary)?.image_url || product.images?.[0]?.image_url || "",
        category: product.category?.name || "",
      });
    }
  }, [product?.id]);

  const handleAddToCart = () => {
    if (!product) return;
    if (!selectedVariant && variants.length > 0) {
      alert("Please select a size and color.");
      return;
    }
    if (selectedVariant && selectedVariant.stock_quantity === 0) {
      alert("Sorry, this variant is out of stock.");
      return;
    }
    const primaryImage =
      product.images?.find((i) => i.is_primary)?.image_url ||
      product.images?.[0]?.image_url ||
      "";

    addItem({
      id: selectedVariant?.id || product.id,
      name: product.title,
      price: product.price,
      image: primaryImage,
      color: selectedVariant?.color || null,
      size: selectedVariant?.size || null,
      quantity: 1,
      inventory_id: selectedVariant?.id,
      product_id: product.id,
    });
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  const handleToggleWishlist = () => {
    if (!user) {
      navigate("/login");
      return;
    }
    wishlistMutation.mutate();
  };

  // ---- LOADING STATE ----
  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 min-h-screen">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="aspect-[4/5] bg-muted animate-pulse rounded-lg" />
          <div className="space-y-4 pt-6">
            <div className="h-4 bg-muted animate-pulse rounded w-24" />
            <div className="h-10 bg-muted animate-pulse rounded w-3/4" />
            <div className="h-6 bg-muted animate-pulse rounded w-32" />
            <div className="h-20 bg-muted animate-pulse rounded" />
          </div>
        </div>
      </div>
    );
  }

  // ---- ERROR STATE ----
  if (isError || !product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center min-h-screen">
        <AlertCircle className="h-16 w-16 text-red-400 mx-auto mb-4" />
        <h1 className="text-2xl font-bold uppercase tracking-widest mb-2">Product Not Found</h1>
        <p className="text-muted-foreground mb-6">
          {isError ? "Failed to load product. Please try again." : "This product does not exist or has been removed."}
        </p>
        <Button asChild>
          <Link to="/shop">Continue Shopping</Link>
        </Button>
      </div>
    );
  }

  const galleryImages = product.images
    ?.sort((a, b) => a.display_order - b.display_order)
    .map((img) => img.image_url) || [];

  const stockStatus =
    !selectedVariant
      ? { label: "Select Variant", color: "text-gray-500 bg-gray-100" }
      : selectedVariant.stock_quantity === 0
      ? { label: "Out of Stock", color: "text-red-800 bg-red-100" }
      : selectedVariant.stock_quantity <= selectedVariant.low_stock_threshold
      ? { label: `Low Stock (${selectedVariant.stock_quantity} left)`, color: "text-yellow-800 bg-yellow-100" }
      : { label: "In Stock", color: "text-green-800 bg-green-100" };

  const discount = product.compare_at_price
    ? Math.round((1 - product.price / product.compare_at_price) * 100)
    : null;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.title,
    "image": galleryImages[0] || "",
    "description": product.description,
    "sku": product.sku || product.id,
    "brand": {
      "@type": "Brand",
      "name": product.brand?.name || "Tokiyo Premium"
    },
    "offers": {
      "@type": "Offer",
      "url": typeof window !== "undefined" ? window.location.href : "",
      "priceCurrency": "USD",
      "price": product.price,
      "itemCondition": "https://schema.org/NewCondition",
      "availability": selectedVariant && selectedVariant.stock_quantity > 0
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock"
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 bg-background min-h-screen">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* Breadcrumbs */}
      <nav className="flex text-sm text-muted-foreground mb-8">
        <ol className="flex items-center space-x-2">
          <li><Link to="/" className="hover:text-primary transition-colors uppercase tracking-widest text-xs font-semibold">Home</Link></li>
          <li><span className="mx-2">/</span></li>
          <li><Link to="/shop" className="hover:text-primary transition-colors uppercase tracking-widest text-xs font-semibold">Shop</Link></li>
          <li><span className="mx-2">/</span></li>
          <li><span className="text-foreground uppercase tracking-widest text-xs font-semibold">{product.category?.name || "Product"}</span></li>
        </ol>
      </nav>

      {/* Main Product Area */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 mb-24">

        {/* Left Column: Gallery */}
        <div className="relative">
          {galleryImages.length > 0 ? (
            <>
              <ProductGallery images={galleryImages} productName={product.title} />
              <Product360Viewer image={galleryImages[0]} />
            </>
          ) : (
            <div className="aspect-[4/5] bg-muted flex items-center justify-center rounded-lg">
              <Package className="h-16 w-16 text-muted-foreground" />
            </div>
          )}
        </div>

        {/* Right Column: Details */}
        <div className="flex flex-col pt-6 lg:pt-0">
          <div className="mb-2 flex justify-between items-start flex-wrap gap-2">
            <span className="text-xs uppercase tracking-widest text-muted-foreground font-semibold">
              {product.category?.name || ""} {product.brand?.name ? `· ${product.brand.name}` : ""}
            </span>
            <div className="flex gap-2 flex-wrap">
              <span className={`inline-flex items-center text-xs font-medium px-2.5 py-0.5 rounded-sm uppercase ${stockStatus.color}`}>
                {stockStatus.label}
              </span>
              {product.sku && (
                <span className="inline-flex items-center bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-0.5 rounded-sm uppercase">
                  SKU: {product.sku}
                </span>
              )}
            </div>
          </div>

          <h1 className="text-4xl sm:text-5xl font-bold uppercase tracking-tight text-foreground mb-4">
            {product.title}
          </h1>

          <div className="flex items-center gap-4 mb-6 flex-wrap">
            <span className="text-3xl font-light text-accent">${product.price.toFixed(2)}</span>
            {product.compare_at_price && (
              <span className="text-xl text-muted-foreground line-through">${product.compare_at_price.toFixed(2)}</span>
            )}
            {discount && (
              <span className="bg-red-100 text-red-700 text-xs font-bold px-2 py-1 rounded-sm uppercase">
                -{discount}% OFF
              </span>
            )}
            {product.reviews_count > 0 && (
              <div className="flex items-center text-accent">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span className="text-sm font-semibold text-foreground ml-1">
                  {product.rating.toFixed(1)} ({product.reviews_count} Reviews)
                </span>
              </div>
            )}
          </div>

          {product.description && (
            <p className="text-muted-foreground leading-relaxed mb-10 font-light">{product.description}</p>
          )}

          {/* Color Selection */}
          {uniqueColors.length > 0 && (
            <div className="mb-8">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-sm font-semibold uppercase tracking-widest">
                  Color: <span className="text-muted-foreground">{selectedColor}</span>
                </h3>
              </div>
              <div className="flex gap-3 flex-wrap">
                {uniqueColors.map((color) => {
                  const colorMap: Record<string, string> = {
                    black: "#000", white: "#fff", navy: "#1a237e", brown: "#5d4037",
                    grey: "#757575", gray: "#757575", blue: "#1565c0", red: "#c62828",
                    green: "#2e7d32", "rose gold": "#b76e79", silver: "#b0bec5",
                  };
                  const bg = colorMap[color.toLowerCase()] || color.toLowerCase();
                  return (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`w-10 h-10 rounded-full border-2 shadow-sm transition-all ${
                        selectedColor === color
                          ? "border-primary ring-2 ring-primary/20 ring-offset-2"
                          : "border-gray-200 hover:border-gray-400"
                      }`}
                      style={{ backgroundColor: bg }}
                      title={color}
                      aria-label={color}
                    />
                  );
                })}
              </div>
            </div>
          )}

          {/* Size Selection */}
          {uniqueSizes.length > 0 && (
            <div className="mb-10">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-sm font-semibold uppercase tracking-widest">Size</h3>
                <button
                  className="flex items-center text-xs text-accent uppercase tracking-widest font-semibold hover:underline"
                  onClick={() => alert("AI Size Recommender: Enter your height and weight for a recommendation.")}
                >
                  <Sparkles className="h-3 w-3 mr-1" />
                  Find My Size (AI)
                </button>
              </div>
              <div className="flex flex-wrap gap-3">
                {uniqueSizes.map((size) => {
                  const variant = variants.find(
                    (v) => v.size === size && (!selectedColor || v.color === selectedColor)
                  );
                  const outOfStock = variant ? variant.stock_quantity === 0 : false;
                  return (
                    <button
                      key={size}
                      onClick={() => !outOfStock && setSelectedSize(size)}
                      disabled={outOfStock}
                      className={`min-w-[3.5rem] h-12 px-3 border text-sm font-bold uppercase tracking-widest transition-colors relative ${
                        selectedSize === size
                          ? "border-primary bg-primary text-primary-foreground"
                          : outOfStock
                          ? "border-border bg-muted text-muted-foreground cursor-not-allowed"
                          : "border-border bg-background text-foreground hover:border-primary"
                      }`}
                    >
                      {size}
                      {outOfStock && (
                        <span className="absolute inset-0 flex items-center justify-center">
                          <span className="w-full h-px bg-muted-foreground/50 rotate-12 block" />
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-4 mb-8">
            <Button
              size="lg"
              onClick={handleAddToCart}
              disabled={!!selectedVariant && selectedVariant.stock_quantity === 0}
              className={`flex-1 h-16 uppercase tracking-widest text-sm rounded-none shadow-xl transition-all ${
                addedToCart
                  ? "bg-green-600 text-white"
                  : "bg-accent text-accent-foreground hover:bg-accent/90"
              }`}
            >
              {addedToCart ? "✓ Added to Cart!" : selectedVariant?.stock_quantity === 0 ? "Out of Stock" : "Add to Cart"}
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={handleToggleWishlist}
              className={`w-16 h-16 rounded-none border-border hover:bg-muted ${
                isInWishlist ? "text-red-500 border-red-200 bg-red-50" : "text-foreground"
              }`}
              title={isInWishlist ? "Remove from Wishlist" : "Add to Wishlist"}
            >
              <Heart className="w-6 h-6" fill={isInWishlist ? "currentColor" : "none"} />
            </Button>
          </div>

          <div className="flex items-center justify-center gap-6 py-4 border-y border-border text-xs uppercase tracking-widest text-muted-foreground mb-8 flex-wrap">
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" /></svg>
              Secure Payment
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
              Free Shipping
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              30-Day Returns
            </div>
          </div>

          {/* Tabs: Details / Specs / Shipping */}
          <div className="mt-auto">
            <div className="flex border-b border-border">
              {(["details", "specs", "shipping"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex-1 py-4 text-xs font-bold uppercase tracking-widest transition-colors ${
                    activeTab === tab
                      ? "border-b-2 border-primary text-primary"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
            <div className="py-6 text-sm text-muted-foreground leading-relaxed">
              {activeTab === "details" && (
                <p>{product.description || "No description available."}</p>
              )}
              {activeTab === "specs" && (
                <ul className="space-y-2">
                  {product.material && <li><strong className="text-foreground">Material:</strong> {product.material}</li>}
                  {product.sku && <li><strong className="text-foreground">SKU:</strong> {product.sku}</li>}
                  {selectedVariant?.sku && <li><strong className="text-foreground">Variant SKU:</strong> {selectedVariant.sku}</li>}
                  {product.care_instructions && <li><strong className="text-foreground">Care:</strong> {product.care_instructions}</li>}
                </ul>
              )}
              {activeTab === "shipping" && (
                <p>Complimentary shipping on all orders over $500. Next-day delivery available for orders placed before 2 PM. Hassle-free 30-day returns.</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Frequently Bought Together */}
      <FrequentlyBought mainProduct={{ id: product.id, name: product.title, price: product.price, image: galleryImages[0] || "", category: product.category?.name || "" }} />

      {/* AI Recommendations */}
      <AIRecommendations />

      {/* Reviews */}
      <ReviewsList productId={product.id} />

      {/* Sticky Mobile Add to Cart Bar stacked above mobile bottom navigation */}
      <div className="fixed bottom-[72px] inset-x-0 bg-white/95 backdrop-blur-md border-y border-gray-200 p-3 z-30 flex items-center justify-between md:hidden shadow-[0_-4px_16px_rgba(0,0,0,0.06)]">
        <div className="flex items-center gap-3">
          <img
            src={galleryImages[0] || ""}
            alt={product.title}
            className="w-9 h-11 object-cover rounded"
          />
          <div className="text-left">
            <h4 className="text-[10px] font-bold text-gray-900 line-clamp-1 uppercase">{product.title}</h4>
            <span className="text-[10px] font-bold text-accent">${product.price.toFixed(2)}</span>
          </div>
        </div>
        <Button
          onClick={handleAddToCart}
          disabled={!!selectedVariant && selectedVariant.stock_quantity === 0}
          className={`px-5 py-2 text-[9px] uppercase tracking-widest font-black rounded-none shadow-md ${
            addedToCart ? "bg-green-600 text-white" : "bg-black text-white"
          }`}
        >
          {addedToCart ? "✓ Added" : selectedVariant?.stock_quantity === 0 ? "Out of stock" : "Add to Cart"}
        </Button>
      </div>
    </div>
  );
}
