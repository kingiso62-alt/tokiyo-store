import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { WifiOff, Heart, ShoppingBag, ArrowLeft, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useWishlistStore } from "@/store/useWishlistStore";
import { useCartStore } from "@/store/useCartStore";

export function Offline() {
  const [reconnecting, setReconnecting] = useState(false);
  const wishlist = useWishlistStore((state) => state.items);
  const cartItems = useCartStore((state) => state.items);

  const handleReconnect = () => {
    setReconnecting(true);
    setTimeout(() => {
      setReconnecting(false);
      if (navigator.onLine) {
        window.location.href = "/";
      } else {
        alert("Still offline. Please check your internet connection. / Weli internet ma jiro.");
      }
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col justify-between py-12 px-4 sm:px-6 lg:px-8 font-sans">
      
      {/* Top logo */}
      <div className="flex justify-center border-b pb-4">
        <Link to="/" className="text-2xl font-bold uppercase tracking-widest text-black">
          Tokiyo
        </Link>
      </div>

      {/* Main warning area */}
      <div className="flex-1 flex flex-col justify-center items-center text-center max-w-md mx-auto space-y-6">
        <div className="p-5 bg-muted rounded-full text-foreground animate-pulse">
          <WifiOff className="h-12 w-12" />
        </div>
        
        <div className="space-y-2">
          <h1 className="text-3xl font-black uppercase tracking-tight">Offline Mode</h1>
          <p className="text-xs text-muted-foreground uppercase tracking-wider font-bold">Internet La'aan</p>
        </div>

        <p className="text-sm text-muted-foreground leading-relaxed font-light">
          You are currently browsing offline. Some pages and features might be unavailable until you reconnect.
          <br />
          <span className="text-xs font-semibold block mt-2 text-foreground">
            Waxaad hadda ku jirtaa offline. Qaar ka mid ah bogaga ma furmi karaan ilaa aad ku xirto internetka.
          </span>
        </p>

        <Button
          onClick={handleReconnect}
          disabled={reconnecting}
          className="w-full bg-black text-white hover:bg-gray-800 uppercase tracking-widest text-xs h-12 rounded-none gap-2"
        >
          <RefreshCw className={`h-4 w-4 ${reconnecting ? "animate-spin" : ""}`} />
          {reconnecting ? "Reconnecting..." : "Check Connection / Isku Day Mar Kale"}
        </Button>
      </div>

      {/* Cached browser section */}
      <div className="max-w-md mx-auto w-full space-y-6 border-t pt-8">
        <h3 className="text-xs font-black uppercase tracking-widest text-center text-muted-foreground mb-4">
          Browse Cached Items
        </h3>

        <div className="grid grid-cols-2 gap-4">
          
          {/* Wishlist Cache */}
          <div className="border p-4 bg-card rounded-xl space-y-3">
            <div className="flex items-center justify-between">
              <Heart className="h-5 w-5 text-red-500" />
              <span className="text-xs font-bold text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                {wishlist.length} items
              </span>
            </div>
            <div>
              <h4 className="text-xs font-black uppercase tracking-wider">Wishlist</h4>
              <p className="text-[10px] text-muted-foreground">Your saved outfits</p>
            </div>
            <Button asChild size="sm" variant="outline" className="w-full text-[10px] uppercase font-bold tracking-wider h-8">
              <Link to="/wishlist">View Wishlist</Link>
            </Button>
          </div>

          {/* Cart Cache */}
          <div className="border p-4 bg-card rounded-xl space-y-3">
            <div className="flex items-center justify-between">
              <ShoppingBag className="h-5 w-5 text-black" />
              <span className="text-xs font-bold text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                {cartItems.length} items
              </span>
            </div>
            <div>
              <h4 className="text-xs font-black uppercase tracking-wider">Shopping Cart</h4>
              <p className="text-[10px] text-muted-foreground">Items ready to checkout</p>
            </div>
            <Button asChild size="sm" variant="outline" className="w-full text-[10px] uppercase font-bold tracking-wider h-8">
              <Link to="/cart">View Cart</Link>
            </Button>
          </div>

        </div>

        <div className="text-center pt-2">
          <Link to="/" className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground hover:text-black flex items-center justify-center gap-1">
            <ArrowLeft className="h-3 w-3" /> Back to Home Page
          </Link>
        </div>
      </div>

    </div>
  );
}
