import { useState } from "react";
import { Sparkles, ShoppingBag, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

import { useQuery } from "@tanstack/react-query";
import { fetchProducts } from "@/lib/api";

export function OutfitBuilder() {
  const [prompt, setPrompt] = useState("");
  const [isBuilding, setIsBuilding] = useState(false);
  const [outfit, setOutfit] = useState<any[]>([]);

  const { data: dbProducts } = useQuery({
    queryKey: ['products'],
    queryFn: () => fetchProducts(),
    retry: 1
  });

  const handleBuildOutfit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setIsBuilding(true);
    setOutfit([]);
    
    // Simulate AI Generation by picking 4 random products from DB
    setTimeout(() => {
      setIsBuilding(false);
      if (dbProducts && dbProducts.length >= 4) {
        // Just take the first 4 for the demo
        const selected = dbProducts.slice(0, 4).map(p => ({
          id: p.id,
          type: p.category?.name || "Clothing",
          name: p.title,
          price: p.price,
          image: p.images?.[0]?.image_url || "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=400&q=80"
        }));
        setOutfit(selected);
      } else {
        // Fallback if DB is empty
        setOutfit([
          { id: "c1", type: "Jacket", name: "Italian Wool Blazer", price: 650, image: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=400&q=80" },
          { id: "c2", type: "Shirt", name: "Crisp White Dress Shirt", price: 120, image: "https://images.unsplash.com/photo-1596755094514-f87e32f85e2c?w=400&q=80" },
          { id: "c3", type: "Pants", name: "Tailored Navy Trousers", price: 250, image: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=400&q=80" },
          { id: "c4", type: "Shoes", name: "Oxford Leather Dress Shoes", price: 295, image: "https://images.unsplash.com/photo-1614252235316-8465d9c632c2?w=400&q=80" },
        ]);
      }
    }, 1500);
  };

  const totalPrice = outfit.reduce((sum, item) => sum + item.price, 0);

  return (
    <div className="min-h-screen bg-gray-50 py-12 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center justify-center p-3 bg-black rounded-full mb-4 shadow-lg">
            <Sparkles className="h-6 w-6 text-accent" />
          </div>
          <h1 className="text-4xl font-bold uppercase tracking-widest text-black mb-4">
            AI Outfit Builder
          </h1>
          <p className="text-gray-600">
            Tell our AI stylist the occasion or style you're going for, and we'll curate a complete, matching outfit just for you.
          </p>
        </div>

        {/* Input Form */}
        <div className="max-w-3xl mx-auto mb-16">
          <form onSubmit={handleBuildOutfit} className="relative">
            <div className="relative flex items-center p-2 bg-white rounded-full shadow-lg border border-gray-200 focus-within:ring-2 focus-within:ring-black focus-within:border-black transition-all">
              <input
                type="text"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="e.g. 'A formal summer wedding in Italy' or 'Business casual for a tech conference'"
                className="w-full pl-6 pr-32 py-4 bg-transparent border-none text-gray-900 placeholder-gray-400 focus:ring-0 text-base sm:text-lg"
              />
              <button
                type="submit"
                disabled={isBuilding || !prompt.trim()}
                className="absolute right-2 top-2 bottom-2 px-6 bg-black text-white rounded-full font-bold uppercase tracking-widest text-sm hover:bg-gray-800 disabled:opacity-50 transition-colors flex items-center"
              >
                {isBuilding ? (
                  <RefreshCw className="h-4 w-4 animate-spin" />
                ) : (
                  <>Build <Sparkles className="h-4 w-4 ml-2 text-accent" /></>
                )}
              </button>
            </div>
          </form>
          
          <div className="mt-4 flex flex-wrap justify-center gap-2">
            <span className="text-xs text-gray-500 uppercase tracking-widest font-semibold mr-2 mt-1.5">Try:</span>
            {["Summer Wedding", "Boardroom Executive", "Weekend Getaway", "Date Night"].map((suggestion) => (
              <button 
                key={suggestion}
                onClick={() => setPrompt(suggestion)}
                className="text-xs font-semibold px-3 py-1.5 bg-white border border-gray-200 rounded-full hover:border-black hover:text-black transition-colors"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>

        {/* Results Area */}
        {outfit.length > 0 && (
          <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
            <div className="p-6 sm:p-10 border-b border-gray-200 bg-gray-50 flex flex-col sm:flex-row items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold uppercase tracking-widest text-black mb-2 flex items-center">
                  Your Styled Look <Sparkles className="h-5 w-5 ml-2 text-accent" />
                </h2>
                <p className="text-gray-500">Curated based on: "{prompt}"</p>
              </div>
              <div className="mt-4 sm:mt-0 text-right">
                <p className="text-sm text-gray-500 uppercase tracking-widest mb-1">Total Bundle Price</p>
                <p className="text-3xl font-light text-accent">${totalPrice.toFixed(2)}</p>
              </div>
            </div>

            <div className="p-6 sm:p-10">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {outfit.map((item, index) => (
                  <div key={item.id} className="group relative">
                    <div className="absolute -top-3 -left-3 h-8 w-8 bg-black text-white rounded-full flex items-center justify-center font-bold z-10 shadow-md">
                      {index + 1}
                    </div>
                    <div className="relative aspect-[3/4] bg-gray-100 overflow-hidden mb-4 rounded-lg">
                      <img 
                        src={item.image} 
                        alt={item.name} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <button className="bg-white text-black px-4 py-2 font-bold uppercase tracking-widest text-xs hover:bg-gray-100">
                          Swap Item
                        </button>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 uppercase tracking-widest mb-1">{item.type}</p>
                    <h3 className="text-sm font-bold uppercase tracking-widest text-black line-clamp-2 mb-1">
                      {item.name}
                    </h3>
                    <p className="text-sm font-medium text-gray-900">${item.price.toFixed(2)}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-6 sm:p-10 border-t border-gray-200 bg-gray-50 flex justify-center">
              <Button size="lg" className="h-16 px-12 bg-accent hover:bg-accent/90 text-white rounded-none shadow-xl uppercase tracking-widest text-sm flex items-center">
                <ShoppingBag className="h-5 w-5 mr-3" />
                Add Entire Outfit to Cart
              </Button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
