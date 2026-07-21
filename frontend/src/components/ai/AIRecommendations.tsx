import { Sparkles, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const AI_RECOMMENDATIONS = [
  { id: 2, name: "Italian Wool Tailored Suit", price: 1200, category: "Suits", image: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=400&q=80" },
  { id: 4, name: "Silk Blend Patterned Tie", price: 85, category: "Accessories", image: "https://images.unsplash.com/photo-1595126731003-8825dfa45330?w=400&q=80" },
  { id: 3, name: "Oxford Leather Dress Shoes", price: 295, category: "Shoes", image: "https://images.unsplash.com/photo-1614252235316-8465d9c632c2?w=400&q=80" },
  { id: 1, name: "Midnight Onyx Chronograph", price: 850, category: "Watches", image: "https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=400&q=80" },
];

export function AIRecommendations() {
  return (
    <div className="py-16 mt-16 border-t border-gray-200">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold uppercase tracking-widest text-black flex items-center">
            Styled For You <Sparkles className="h-5 w-5 ml-2 text-accent" />
          </h2>
          <p className="text-gray-500 mt-2">AI-powered recommendations based on your unique taste.</p>
        </div>
        <Link to="/outfit-builder" className="hidden sm:flex items-center text-sm font-bold uppercase tracking-widest hover:text-accent transition-colors">
          Build Outfit <ArrowRight className="h-4 w-4 ml-2" />
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {AI_RECOMMENDATIONS.map((product) => (
          <Link key={product.id} to={`/product/${product.id}`} className="group block">
            <div className="relative aspect-[3/4] bg-gray-100 overflow-hidden mb-4">
              <img 
                src={product.image} 
                alt={product.name} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
              />
              <div className="absolute top-4 left-4">
                <span className="bg-black text-white text-[10px] font-bold uppercase tracking-widest px-2 py-1">
                  AI Pick
                </span>
              </div>
            </div>
            <p className="text-xs text-gray-500 uppercase tracking-widest mb-1">{product.category}</p>
            <h3 className="text-sm font-bold uppercase tracking-widest text-black group-hover:text-accent transition-colors line-clamp-1 mb-1">
              {product.name}
            </h3>
            <p className="text-sm font-medium text-gray-900">${product.price.toFixed(2)}</p>
          </Link>
        ))}
      </div>
      
      <div className="mt-8 sm:hidden">
        <Link to="/outfit-builder" className="flex items-center justify-center w-full py-4 border border-black text-sm font-bold uppercase tracking-widest hover:bg-black hover:text-white transition-colors">
          Build Complete Outfit
        </Link>
      </div>
    </div>
  );
}
