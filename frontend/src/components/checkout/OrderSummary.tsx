import { useCartStore } from "@/store/useCartStore";

interface OrderSummaryProps {
  tax: number;
  shipping: number;
  total: number;
}

export function OrderSummary({ tax, shipping, total }: OrderSummaryProps) {
  const { items, subtotal } = useCartStore();
  

  return (
    <div className="bg-secondary/30 p-8">
      <h2 className="text-xl font-bold uppercase tracking-widest mb-6 border-b border-border pb-4">Order Summary</h2>
      
      <div className="space-y-6 mb-6">
        {items.map(item => (
          <div key={item.id} className="flex gap-4">
            <div className="w-16 h-20 bg-muted flex-shrink-0 relative">
              <img src={item.image} alt={item.name} loading="lazy" className="w-full h-full object-cover" />
              <span className="absolute -top-2 -right-2 bg-foreground text-background w-5 h-5 rounded-full text-[10px] font-bold flex items-center justify-center">
                {item.quantity}
              </span>
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-semibold line-clamp-1">{item.name}</h4>
              {(item.color || item.size) && (
                <p className="text-xs text-muted-foreground mt-1">
                  {[item.color && `Color: ${item.color}`, item.size && `Size: ${item.size}`].filter(Boolean).join(" | ")}
                </p>
              )}
            </div>
            <div className="text-sm font-medium">
              ${(item.price * item.quantity).toFixed(2)}
            </div>
          </div>
        ))}
      </div>

      <div className="space-y-3 mb-6 text-sm border-t border-border pt-4">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Subtotal</span>
          <span className="font-medium">${subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Shipping</span>
          <span className="font-medium">{shipping === 0 ? <span className="text-green-600">Free</span> : `$${shipping.toFixed(2)}`}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Estimated Tax (8%)</span>
          <span className="font-medium">${tax.toFixed(2)}</span>
        </div>
      </div>

      <div className="border-t border-border pt-4 flex justify-between items-end">
        <span className="font-bold uppercase tracking-widest text-sm">Total</span>
        <span className="text-2xl font-bold text-accent">${total.toFixed(2)}</span>
      </div>
    </div>
  );
}
