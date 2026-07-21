import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/store/useCartStore";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { Link } from "react-router-dom";

export function CartSidebar() {
  const { isOpen, setIsOpen, items, updateQuantity, removeItem, subtotal } = useCartStore();

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetContent className="w-full sm:max-w-md flex flex-col p-0">
        <SheetHeader className="p-6 border-b border-border text-left">
          <SheetTitle className="text-2xl font-bold flex items-center">
            <ShoppingBag className="mr-2 h-6 w-6" /> Your Cart
          </SheetTitle>
          <SheetDescription>
            {items.length === 0 ? "Your cart is empty." : `You have ${items.length} items in your cart.`}
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {items.map((item) => (
            <div key={item.id} className="flex gap-4">
              <div className="h-24 w-20 flex-shrink-0 bg-secondary rounded-md overflow-hidden">
                <img src={item.image} alt={item.name} loading="lazy" className="h-full w-full object-cover" />
              </div>
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <h4 className="font-semibold text-base line-clamp-1">{item.name}</h4>
                  <div className="text-muted-foreground text-sm flex gap-2">
                    {item.color && <span>{item.color}</span>}
                    {item.color && item.size && <span>|</span>}
                    {item.size && <span>{item.size}</span>}
                  </div>
                </div>
                <div className="flex items-center justify-between mt-2">
                  <div className="flex items-center border border-border rounded-md">
                    <button 
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="p-1 hover:bg-muted text-muted-foreground"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                    <button 
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="p-1 hover:bg-muted text-muted-foreground"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="font-bold">${(item.price * item.quantity).toFixed(2)}</div>
                </div>
              </div>
              <button 
                onClick={() => removeItem(item.id)}
                className="text-muted-foreground hover:text-red-500 transition-colors h-fit p-1"
              >
                <Trash2 className="h-5 w-5" />
              </button>
            </div>
          ))}

          {items.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-muted-foreground space-y-4">
              <ShoppingBag className="h-16 w-16 opacity-20" />
              <p>Looks like you haven't added anything yet.</p>
              <Button variant="outline" onClick={() => setIsOpen(false)}>Continue Shopping</Button>
            </div>
          )}
        </div>

        {items.length > 0 && (
          <div className="p-6 border-t border-border bg-muted/30">
            <div className="flex justify-between text-lg font-semibold mb-4">
              <span>Subtotal</span>
              <span>${items.reduce((total, item) => total + (item.price * item.quantity), 0).toFixed(2)}</span>
            </div>
            <p className="text-xs text-muted-foreground mb-4">Shipping and taxes calculated at checkout.</p>
            <Button asChild className="w-full h-12 text-lg bg-primary text-primary-foreground hover:bg-primary/90 rounded-none uppercase tracking-widest font-bold">
              <Link to="/checkout" onClick={() => setIsOpen(false)}>
                Checkout
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full h-12 mt-2 rounded-none uppercase tracking-widest font-bold">
               <Link to="/cart" onClick={() => setIsOpen(false)}>
                 View Cart Page
               </Link>
            </Button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
