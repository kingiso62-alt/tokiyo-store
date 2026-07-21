import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/store/useCartStore";
import type { Product } from "@/store/useWishlistStore";
import { useState } from "react";
import { Link } from "react-router-dom";

interface QuickViewModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

export function QuickViewModal({ product, isOpen, onClose }: QuickViewModalProps) {
  const addItem = useCartStore((state) => state.addItem);
  const [selectedSize, setSelectedSize] = useState<string>("M");
  const [selectedColor, setSelectedColor] = useState<string>("Black");

  if (!product) return null;

  const handleAddToCart = () => {
    addItem({
      ...product,
      quantity: 1,
      // You could append size/color to the cart item if your cart supports variations
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[800px] p-0 overflow-hidden bg-background">
        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Image */}
          <div className="bg-muted relative h-64 md:h-full">
            <img 
              src={product.image} 
              alt={product.name}
              className="absolute inset-0 w-full h-full object-cover"
            />
          </div>
          
          {/* Details */}
          <div className="p-8 flex flex-col">
            <DialogHeader>
              <div className="text-xs text-muted-foreground uppercase tracking-widest mb-2">{product.category || 'Luxury'}</div>
              <DialogTitle className="text-2xl font-bold uppercase">{product.name}</DialogTitle>
            </DialogHeader>
            
            <div className="mt-4">
              <p className="text-2xl text-accent font-medium">${product.price.toFixed(2)}</p>
            </div>
            
            <p className="mt-4 text-muted-foreground text-sm leading-relaxed line-clamp-3">
              Experience the pinnacle of luxury with this exquisitely crafted piece. Designed for the modern individual who appreciates timeless elegance and superior quality.
            </p>
            
            {/* Variations placeholder */}
            <div className="mt-6 space-y-4">
              <div>
                <label className="text-xs uppercase tracking-widest text-muted-foreground block mb-2">Color: {selectedColor}</label>
                <div className="flex space-x-2">
                  {['Black', 'Navy', 'Grey'].map(c => (
                    <button 
                      key={c}
                      onClick={() => setSelectedColor(c)}
                      className={`w-8 h-8 rounded-full border-2 ${selectedColor === c ? 'border-primary' : 'border-transparent'} shadow-sm`}
                      style={{ backgroundColor: c.toLowerCase() }}
                      title={c}
                    />
                  ))}
                </div>
              </div>
              
              <div>
                <label className="text-xs uppercase tracking-widest text-muted-foreground block mb-2">Size: {selectedSize}</label>
                <div className="flex space-x-2">
                  {['S', 'M', 'L', 'XL'].map(s => (
                    <button 
                      key={s}
                      onClick={() => setSelectedSize(s)}
                      className={`w-10 h-10 border ${selectedSize === s ? 'border-primary bg-primary text-primary-foreground' : 'border-border bg-background text-foreground hover:border-primary'} text-sm font-medium transition-colors`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-8 flex flex-col gap-3 mt-auto">
              <Button 
                onClick={handleAddToCart}
                className="w-full h-12 bg-accent text-accent-foreground hover:bg-accent/90 uppercase tracking-widest"
              >
                Add To Cart
              </Button>
              <Button 
                asChild
                variant="outline"
                className="w-full h-12 uppercase tracking-widest"
              >
                <Link to={`/product/${product.id}`} onClick={onClose}>
                  View Full Details
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
