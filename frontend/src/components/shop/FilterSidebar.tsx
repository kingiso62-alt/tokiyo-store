import { useState } from "react";
import { ChevronDown, ChevronUp, Star } from "lucide-react";

export function FilterSidebar() {
  const [priceRange, setPriceRange] = useState(5000);
  const [openSections, setOpenSections] = useState({
    category: true,
    price: true,
    color: true,
    size: false,
    brand: false,
    rating: false
  });

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  return (
    <div className="w-full text-white bg-[#080808] border border-zinc-900 rounded-2xl p-6 shadow-xl">
      <div className="flex justify-between items-center mb-6 pb-4 border-b border-zinc-900">
        <h2 className="text-sm font-extrabold uppercase tracking-[0.2em] text-white">Filters</h2>
        <button className="text-[10px] text-[#D4AF37] uppercase tracking-widest hover:underline">Clear All</button>
      </div>

      <div className="space-y-6">
        
        {/* Category */}
        <div className="border-b border-zinc-900 pb-5">
          <button 
            onClick={() => toggleSection('category')}
            className="flex justify-between items-center w-full text-xs font-extrabold uppercase tracking-widest text-[#D4AF37] hover:text-white transition-colors"
          >
            Category
            {openSections.category ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </button>
          
          {openSections.category && (
            <div className="space-y-3 pt-4">
              {['Suits', 'Shirts', 'Pants', 'Outerwear', 'Watches', 'Shoes', 'Accessories'].map((cat) => (
                <label key={cat} className="flex items-center space-x-3 cursor-pointer group text-zinc-400 hover:text-white transition-colors">
                  <input 
                    type="checkbox" 
                    defaultChecked={cat === 'Suits'}
                    className="w-4.5 h-4.5 rounded bg-zinc-950 border border-zinc-800 text-[#D4AF37] focus:ring-0 focus:ring-offset-0 checked:bg-[#D4AF37] checked:border-[#D4AF37] transition-all cursor-pointer accent-[#D4AF37]"
                  />
                  <span className="text-xs font-semibold uppercase tracking-wider">{cat}</span>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Price */}
        <div className="border-b border-zinc-900 pb-5">
          <button 
            onClick={() => toggleSection('price')}
            className="flex justify-between items-center w-full text-xs font-extrabold uppercase tracking-widest text-[#D4AF37] hover:text-white transition-colors"
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
                value={priceRange} 
                onChange={(e) => setPriceRange(Number(e.target.value))}
                className="w-full h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-[#D4AF37]" 
              />
              <div className="flex justify-between items-center mt-4 text-xs">
                <span className="bg-zinc-950 border border-zinc-800 px-3 py-1.5 rounded-lg text-zinc-300 font-mono">$0</span>
                <span className="text-zinc-500 font-bold uppercase tracking-widest text-[9px]">to</span>
                <span className="bg-zinc-950 border border-zinc-800 px-3 py-1.5 rounded-lg text-[#D4AF37] font-mono">${priceRange}</span>
              </div>
            </div>
          )}
        </div>

        {/* Color */}
        <div className="border-b border-zinc-900 pb-5">
          <button 
            onClick={() => toggleSection('color')}
            className="flex justify-between items-center w-full text-xs font-extrabold uppercase tracking-widest text-[#D4AF37] hover:text-white transition-colors"
          >
            Color
            {openSections.color ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </button>
          
          {openSections.color && (
            <div className="flex flex-wrap gap-2.5 pt-4">
              {[
                { name: 'Black', hex: '#000000', active: true },
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
                  className={`w-7 h-7 rounded-full transition-all duration-300 hover:scale-110 relative ${
                    color.active ? 'ring-2 ring-[#D4AF37] ring-offset-2 ring-offset-[#080808] scale-105' : 'border border-zinc-800'
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
            className="flex justify-between items-center w-full text-xs font-extrabold uppercase tracking-widest text-[#D4AF37] hover:text-white transition-colors"
          >
            Size
            {openSections.size ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </button>
          
          {openSections.size && (
            <div className="grid grid-cols-4 gap-2 pt-4">
              {['XS', 'S', 'M', 'L', 'XL', 'XXL', '38R', '40R'].map((size) => (
                <button
                  key={size}
                  className="h-9 rounded-lg border border-zinc-800 bg-zinc-950 text-[10px] font-extrabold uppercase tracking-wider hover:border-[#D4AF37] hover:text-[#D4AF37] transition-all"
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
            className="flex justify-between items-center w-full text-xs font-extrabold uppercase tracking-widest text-[#D4AF37] hover:text-white transition-colors"
          >
            Brand
            {openSections.brand ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </button>
          
          {openSections.brand && (
            <div className="space-y-3 pt-4">
              {['Tokiyo Exclusive', 'Italian Tailors', 'Swiss Horology', 'London Brogues'].map((brand) => (
                <label key={brand} className="flex items-center space-x-3 cursor-pointer group text-zinc-400 hover:text-white transition-colors">
                  <input 
                    type="checkbox" 
                    className="w-4.5 h-4.5 rounded bg-zinc-950 border border-zinc-800 text-[#D4AF37] focus:ring-0 focus:ring-offset-0 checked:bg-[#D4AF37] checked:border-[#D4AF37] transition-all cursor-pointer accent-[#D4AF37]"
                  />
                  <span className="text-xs font-semibold uppercase tracking-wider">{brand}</span>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Rating */}
        <div>
          <button 
            onClick={() => toggleSection('rating')}
            className="flex justify-between items-center w-full text-xs font-extrabold uppercase tracking-widest text-[#D4AF37] hover:text-white transition-colors"
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
