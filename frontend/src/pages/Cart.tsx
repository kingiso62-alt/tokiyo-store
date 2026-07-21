import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCartStore } from "@/store/useCartStore";
import { Button } from "@/components/ui/button";

export function Cart() {
  const { items, removeItem, updateQuantity } = useCartStore();
  const navigate = useNavigate();
  
  const [promoCode, setPromoCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [shippingMethod, setShippingMethod] = useState(15); // Default standard shipping

  const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const tax = subtotal * 0.05; // 5% tax
  const total = subtotal + tax + shippingMethod - discount;

  const handleApplyPromo = () => {
    if (promoCode.toUpperCase() === "TOKIYO10") {
      setDiscount(subtotal * 0.10);
    } else {
      alert("Invalid promo code");
      setDiscount(0);
    }
  };

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center min-h-[60vh] flex flex-col items-center justify-center">
        <h1 className="text-4xl font-bold uppercase tracking-widest mb-6">Your Cart is Empty</h1>
        <p className="text-muted-foreground mb-10 text-lg">Looks like you haven't added anything to your cart yet.</p>
        <Button asChild size="lg" className="rounded-none uppercase tracking-widest px-10 h-14">
          <Link to="/shop">Continue Shopping</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
      <h1 className="text-4xl font-bold uppercase tracking-tight mb-12 border-b border-border pb-6">Shopping Cart</h1>

      <div className="flex flex-col lg:flex-row gap-12">
        {/* Cart Items */}
        <div className="flex-1">
          <div className="hidden md:grid grid-cols-12 gap-4 pb-4 border-b border-border text-xs font-bold uppercase tracking-widest text-muted-foreground mb-6">
            <div className="col-span-6">Product</div>
            <div className="col-span-2 text-center">Price</div>
            <div className="col-span-2 text-center">Quantity</div>
            <div className="col-span-2 text-right">Total</div>
          </div>

          <div className="space-y-8">
            {items.map((item) => (
              <div key={item.id} className="flex flex-col md:grid md:grid-cols-12 gap-4 items-center border-b border-border/50 pb-8 last:border-0">
                
                {/* Product Info */}
                <div className="col-span-6 flex items-center gap-6 w-full">
                  <div className="w-24 h-32 bg-muted flex-shrink-0">
                    <img src={item.image} alt={item.name} loading="lazy" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-1">{item.name}</h3>
                    <p className="text-sm text-muted-foreground mb-3">Color: Black | Size: M</p>
                    <button 
                      onClick={() => removeItem(item.id)}
                      className="text-xs uppercase tracking-widest text-muted-foreground hover:text-red-500 transition-colors"
                    >
                      Remove
                    </button>
                  </div>
                </div>

                {/* Price (Desktop) */}
                <div className="col-span-2 text-center hidden md:block">
                  <span className="font-medium">${item.price.toFixed(2)}</span>
                </div>

                {/* Quantity */}
                <div className="col-span-2 flex justify-center w-full md:w-auto">
                  <div className="flex items-center border border-border">
                    <button 
                      onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                      className="w-10 h-10 flex items-center justify-center hover:bg-secondary transition-colors"
                    >-</button>
                    <span className="w-10 text-center font-medium">{item.quantity}</span>
                    <button 
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="w-10 h-10 flex items-center justify-center hover:bg-secondary transition-colors"
                    >+</button>
                  </div>
                </div>

                {/* Total */}
                <div className="col-span-2 text-right w-full md:w-auto mt-4 md:mt-0 flex justify-between md:block">
                  <span className="md:hidden font-bold uppercase tracking-widest text-xs text-muted-foreground">Total:</span>
                  <span className="font-bold text-accent">${(item.price * item.quantity).toFixed(2)}</span>
                </div>

              </div>
            ))}
          </div>

          <div className="mt-8 pt-8 border-t border-border flex justify-between items-center">
            <Button variant="outline" asChild className="rounded-none uppercase tracking-widest">
              <Link to="/shop">Continue Shopping</Link>
            </Button>
          </div>
        </div>

        {/* Order Summary */}
        <div className="w-full lg:w-[400px]">
          <div className="bg-secondary/30 p-8">
            <h2 className="text-xl font-bold uppercase tracking-widest mb-6 border-b border-border pb-4">Order Summary</h2>
            
            <div className="space-y-4 mb-6 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-medium">${subtotal.toFixed(2)}</span>
              </div>

              {/* Shipping Estimator */}
              <div className="py-4 border-y border-border">
                <span className="block text-muted-foreground mb-3">Shipping</span>
                <div className="space-y-2">
                  <label className="flex items-center justify-between cursor-pointer group">
                    <div className="flex items-center">
                      <input 
                        type="radio" 
                        name="shipping" 
                        value={15} 
                        checked={shippingMethod === 15}
                        onChange={() => setShippingMethod(15)}
                        className="mr-3 accent-primary" 
                      />
                      <span className="group-hover:text-primary transition-colors">Standard (3-5 Days)</span>
                    </div>
                    <span>$15.00</span>
                  </label>
                  <label className="flex items-center justify-between cursor-pointer group">
                    <div className="flex items-center">
                      <input 
                        type="radio" 
                        name="shipping" 
                        value={30} 
                        checked={shippingMethod === 30}
                        onChange={() => setShippingMethod(30)}
                        className="mr-3 accent-primary" 
                      />
                      <span className="group-hover:text-primary transition-colors">Express (1-2 Days)</span>
                    </div>
                    <span>$30.00</span>
                  </label>
                </div>
              </div>

              <div className="flex justify-between">
                <span className="text-muted-foreground">Estimated Tax (5%)</span>
                <span className="font-medium">${tax.toFixed(2)}</span>
              </div>
              
              {discount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Discount (TOKIYO10)</span>
                  <span className="font-medium">-${discount.toFixed(2)}</span>
                </div>
              )}
            </div>

            {/* Promo Code */}
            <div className="mb-6 flex gap-2">
              <input 
                type="text" 
                placeholder="Promo Code" 
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
                className="flex-1 bg-background border border-border px-3 py-2 text-sm outline-none focus:border-primary"
              />
              <Button onClick={handleApplyPromo} variant="outline" className="rounded-none uppercase tracking-widest text-xs">Apply</Button>
            </div>

            <div className="border-t border-border pt-4 mb-8 flex justify-between items-end">
              <span className="font-bold uppercase tracking-widest">Total</span>
              <span className="text-3xl font-bold text-accent">${total.toFixed(2)}</span>
            </div>

            <Button 
              onClick={() => navigate('/checkout')}
              className="w-full h-14 rounded-none uppercase tracking-widest font-bold text-sm bg-foreground hover:bg-foreground/90 text-background"
            >
              Proceed to Checkout
            </Button>
            
            <div className="mt-6 flex justify-center gap-4 text-muted-foreground opacity-50">
              <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor"><path d="M17 4h2a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V6a2 2 0 012-2h2m3-2h4a1 1 0 011 1v2H10V3a1 1 0 011-1z" /></svg>
              {/* Payment icons placeholder */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
