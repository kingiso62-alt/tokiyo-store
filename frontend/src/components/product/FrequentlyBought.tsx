import { ProductCard } from "./ProductCard";
import type { Product } from "@/store/useWishlistStore";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/store/useCartStore";

const accessories: Product[] = [
  { id: "a1", name: "Leather Care Kit", price: 45, image: "https://images.unsplash.com/photo-1584916201218-f4242ceb4809?q=80&w=400", category: "Care" },
  { id: "a2", name: "Silk Pocket Square", price: 35, image: "https://images.unsplash.com/photo-1603957593649-65ecdf656a1b?q=80&w=400", category: "Accessories" }
];

export function FrequentlyBought({ mainProduct }: { mainProduct: Product }) {
  const addItem = useCartStore(state => state.addItem);

  const handleAddBundle = () => {
    addItem({ ...mainProduct, quantity: 1 });
    accessories.forEach(acc => addItem({ ...acc, quantity: 1 }));
  };

  const totalPrice = mainProduct.price + accessories.reduce((sum, item) => sum + item.price, 0);

  return (
    <div className="mt-16 pt-16 border-t border-border">
      <h3 className="text-2xl font-bold uppercase tracking-tight mb-8">Frequently Bought Together</h3>
      
      <div className="flex flex-col lg:flex-row gap-8 items-start">
        {/* Visual Bundle */}
        <div className="flex-1 flex items-center gap-4 flex-wrap">
          <div className="w-32 flex-shrink-0">
            <img src={mainProduct.image} alt={mainProduct.name} loading="lazy" className="w-full aspect-[4/5] object-cover rounded-md shadow-sm" />
          </div>
          <div className="text-2xl text-muted-foreground">+</div>
          {accessories.map((item, idx) => (
            <div key={item.id} className="flex items-center gap-4">
              <div className="w-32 flex-shrink-0">
                <img src={item.image} alt={item.name} loading="lazy" className="w-full aspect-[4/5] object-cover rounded-md shadow-sm" />
              </div>
              {idx < accessories.length - 1 && <div className="text-2xl text-muted-foreground">+</div>}
            </div>
          ))}
        </div>
        
        {/* Action Panel */}
        <div className="w-full lg:w-72 bg-secondary p-6 rounded-md">
          <div className="space-y-3 mb-6">
            <div className="flex justify-between items-start">
              <span className="text-sm font-medium leading-tight">This item: {mainProduct.name}</span>
              <span className="text-sm">${mainProduct.price}</span>
            </div>
            {accessories.map(item => (
              <div key={item.id} className="flex justify-between items-start text-muted-foreground">
                <span className="text-sm leading-tight">{item.name}</span>
                <span className="text-sm">${item.price}</span>
              </div>
            ))}
          </div>
          <div className="border-t border-border pt-4 mb-6 flex justify-between items-center">
            <span className="font-bold uppercase text-sm">Total Price</span>
            <span className="text-xl font-bold text-accent">${totalPrice}</span>
          </div>
          <Button 
            onClick={handleAddBundle}
            className="w-full bg-foreground text-background hover:bg-foreground/90 uppercase tracking-widest rounded-none h-12"
          >
            Add All To Cart
          </Button>
        </div>
      </div>
    </div>
  );
}
