import { useSearchParams } from "react-router-dom";
import { ChevronDown, ChevronUp, Star } from "lucide-react";
import { useState } from "react";

export function FilterSidebar() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [openSections, setOpenSections] = useState({
    category: true,
    price: true,
    color: true,
    size: true,
    brand: true,
    rating: true
  });

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const handleToggleParam = (key: string, value: string) => {
    const newParams = new URLSearchParams(searchParams);
    if (newParams.get(key) === value) {
      newParams.delete(key);
    } else {
      newParams.set(key, value);
    }
    setSearchParams(newParams);
  };

  const handlePriceChange = (value: string) => {
    const newParams = new URLSearchParams(searchParams);
    if (Number(value) >= 5000) {
      newParams.delete("maxPrice");
    } else {
      newParams.set("maxPrice", value);
    }
    setSearchParams(newParams);
  };

  const handleClearAll = () => {
    setSearchParams({});
  };

  const activeCategory = searchParams.get("category") || "";
  const activeMaxPrice = Number(searchParams.get("maxPrice")) || 5000;
  const activeColor = searchParams.get("color") || "";
  const activeSize = searchParams.get("size") || "";
  const activeBrand = searchParams.get("brand") || "";
  const activeRating = Number(searchParams.get("rating")) || 0;

  return (
    <div className="w-full text-white bg-[#080808] border border-zinc-900 rounded-2xl p-6 shadow-xl">
      <div className="flex justify-between items-center mb-6 pb-4 border-b border-zinc-900">
        <h2 className="text-sm font-extrabold uppercase tracking-[0.2em] text-white">Filters</h2>
        <button 
          onClick={handleClearAll}
          className="text-[10px] text-[#D4AF37] uppercase tracking-widest hover:underline cursor-pointer"
        >
          Clear All
        </button>
      </div>

      <div className="space-y-6">
        
        {/* Category */}
        <div className="border-b border-zinc-900 pb-5">
          <button 
            onClick={() => toggleSection('category')}
            className="flex justify-between items-center w-full text-xs font-extrabold uppercase tracking-widest text-[#D4AF37] hover:text-white transition-colors cursor-pointer"
          >
            Category
            {openSections.category ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </button>
          
          {openSections.category && (
            <div className="space-y-3 pt-4">
              {[
                { name: 'Suits', slug: 'suits' },
                { name: 'Shirts', slug: 'shirts' },
                { name: 'Trousers', slug: 'trousers' },
                { name: 'Outerwear', slug: 'outerwear' },
                { name: 'Watches', slug: 'watches' },
                { name: 'Shoes', slug: 'shoes' },
                { name: 'Accessories', slug: 'accessories' },
                { name: 'Knitwear', slug: 'knitwear' }
              ].map((cat) => (
                <label key={cat.slug} className="flex items-center space-x-3 cursor-pointer group text-zinc-400 hover:text-white transition-colors">
                  <input 
                    type="checkbox" 
                    checked={activeCategory.toLowerCase() === cat.slug}
                    onChange={() => handleToggleParam("category", cat.slug)}
                    className="w-4.5 h-4.5 rounded bg-zinc-950 border border-zinc-800 text-[#D4AF37] focus:ring-0 focus:ring-offset-0 checked:bg-[#D4AF37] checked:border-[#D4AF37] transition-all cursor-pointer accent-[#D4AF37]"
                  />
                  <span className="text-xs font-semibold uppercase tracking-wider">{cat.name}</span>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Price */}
        <div className="border-b border-zinc-900 pb-5">
          <button 
            onClick={() => toggleSection('price')}
            className="flex justify-between items-center w-full text-xs font-extrabold uppercase tracking-widest text-[#D4AF37] hover:text-white transition-colors cursor-pointer"
          >
            Price Range
            {openSections.price ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </button>
          
          {openSections.price && (
            <div className="pt-4">
              <input 
                type="range" 
                min="0" 
                max="5000" 
                step="100"
                value={activeMaxPrice} 
                onChange={(e) => handlePriceChange(e.target.value)}
                className="w-full h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-[#D4AF37]" 
              />
              <div className="flex justify-between items-center mt-4 text-xs">
                <span className="bg-zinc-950 border border-zinc-800 px-3 py-1.5 rounded-lg text-zinc-300 font-mono">$0</span>
                <span className="text-zinc-500 font-bold uppercase tracking-widest text-[9px]">to</span>
                <span className="bg-zinc-950 border border-zinc-800 px-3 py-1.5 rounded-lg text-[#D4AF37] font-mono">${activeMaxPrice}</span>
              </div>
            </div>
          )}
        </div>

        {/* Color */}
        <div className="border-b border-zinc-900 pb-5">
          <button 
            onClick={() => toggleSection('color')}
            className="flex justify-between items-center w-full text-xs font-extrabold uppercase tracking-widest text-[#D4AF37] hover:text-white transition-colors cursor-pointer"
          >
            Color
            {openSections.color ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </button>
          
          {openSections.color && (
            <div className="flex flex-wrap gap-2.5 pt-4">
              {[
                { name: 'Black', hex: '#000000' },
                { name: 'Navy', hex: '#0a192f' },
                { name: 'Grey', hex: '#4b5563' },
                { name: 'White', hex: '#ffffff' },
                { name: 'Brown', hex: '#78350f' },
                { name: 'Burgundy', hex: '#4c0519' },
                { name: 'Olive', hex: '#3f6212' },
                { name: 'Gold', hex: '#d4af37' },
              ].map((color) => (
                <button
                  key={color.name}
                  onClick={() => handleToggleParam("color", color.name)}
                  className={`w-7 h-7 rounded-full transition-all duration-300 hover:scale-110 relative cursor-pointer ${
                    activeColor.toLowerCase() === color.name.toLowerCase() 
                      ? 'ring-2 ring-[#D4AF37] ring-offset-2 ring-offset-[#080808] scale-105' 
                      : 'border border-zinc-800'
                  }`}
                  style={{ backgroundColor: color.hex }}
                  title={color.name}
                />
              ))}
            </div>
          )}
        </div>

        {/* Size */}
        <div className="border-b border-zinc-900 pb-5">
          <button 
            onClick={() => toggleSection('size')}
            className="flex justify-between items-center w-full text-xs font-extrabold uppercase tracking-widest text-[#D4AF37] hover:text-white transition-colors cursor-pointer"
          >
            Size
            {openSections.size ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </button>
          
          {openSections.size && (
            <div className="grid grid-cols-4 gap-2 pt-4">
              {['XS', 'S', 'M', 'L', 'XL', 'XXL', '38R', '40R', '42R', '44R', '8', '9', '10', '11'].map((size) => (
                <button
                  key={size}
                  onClick={() => handleToggleParam("size", size)}
                  className={`h-9 rounded-lg border text-[10px] font-extrabold uppercase tracking-wider transition-all cursor-pointer ${
                    activeSize === size 
                      ? 'border-[#D4AF37] bg-[#D4AF37] text-black shadow-md' 
                      : 'border-zinc-800 bg-zinc-950 text-zinc-400 hover:border-[#D4AF37] hover:text-[#D4AF37]'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Brand */}
        <div className="border-b border-zinc-900 pb-5">
          <button 
            onClick={() => toggleSection('brand')}
            className="flex justify-between items-center w-full text-xs font-extrabold uppercase tracking-widest text-[#D4AF37] hover:text-white transition-colors cursor-pointer"
          >
            Brand
            {openSections.brand ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </button>
          
          {openSections.brand && (
            <div className="space-y-3 pt-4">
              {[
                { name: 'Tokiyo Premium', slug: 'tokiyo-premium' },
                { name: 'Milano Craft', slug: 'milano-craft' },
                { name: 'Black Atlas', slug: 'black-atlas' },
                { name: 'Sovereign', slug: 'sovereign' },
                { name: 'Aurum', slug: 'aurum' }
              ].map((brand) => (
                <label key={brand.slug} className="flex items-center space-x-3 cursor-pointer group text-zinc-400 hover:text-white transition-colors">
                  <input 
                    type="checkbox" 
                    checked={activeBrand === brand.slug}
                    onChange={() => handleToggleParam("brand", brand.slug)}
                    className="w-4.5 h-4.5 rounded bg-zinc-950 border border-zinc-800 text-[#D4AF37] focus:ring-0 focus:ring-offset-0 checked:bg-[#D4AF37] checked:border-[#D4AF37] transition-all cursor-pointer accent-[#D4AF37]"
                  />
                  <span className="text-xs font-semibold uppercase tracking-wider">{brand.name}</span>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Rating */}
        <div>
          <button 
            onClick={() => toggleSection('rating')}
            className="flex justify-between items-center w-full text-xs font-extrabold uppercase tracking-widest text-[#D4AF37] hover:text-white transition-colors cursor-pointer"
          >
            Rating
            {openSections.rating ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </button>
          
          {openSections.rating && (
            <div className="space-y-3 pt-4">
              {[5, 4, 3, 2].map((rating) => (
                <label key={rating} className="flex items-center space-x-3 cursor-pointer group text-zinc-400 hover:text-white transition-colors">
                  <input 
                    type="checkbox" 
                    checked={activeRating === rating}
                    onChange={() => handleToggleParam("rating", rating.toString())}
                    className="w-4.5 h-4.5 rounded bg-zinc-950 border border-zinc-800 text-[#D4AF37] focus:ring-0 focus:ring-offset-0 checked:bg-[#D4AF37] checked:border-[#D4AF37] transition-all cursor-pointer accent-[#D4AF37]"
                  />
                  <span className="flex items-center text-xs font-semibold">
                    <span className="flex text-amber-500 mr-2">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star 
                          key={i} 
                          className={`w-3.5 h-3.5 ${i < rating ? 'fill-current' : 'text-zinc-700'}`} 
                        />
                      ))}
                    </span>
                    <span className="text-[10px] font-extrabold uppercase tracking-widest text-zinc-500">& Up</span>
                  </span>
                </label>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
