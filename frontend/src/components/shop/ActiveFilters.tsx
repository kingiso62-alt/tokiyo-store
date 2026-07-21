import { useSearchParams } from "react-router-dom";
import { X } from "lucide-react";

export function ActiveFilters() {
  const [searchParams, setSearchParams] = useSearchParams();

  const activeFilters: { type: string; value: string; key: string }[] = [];

  const category = searchParams.get("category");
  const maxPrice = searchParams.get("maxPrice");
  const color = searchParams.get("color");
  const size = searchParams.get("size");
  const brand = searchParams.get("brand");
  const rating = searchParams.get("rating");

  if (category) activeFilters.push({ type: "Category", value: category, key: "category" });
  if (maxPrice) activeFilters.push({ type: "Price", value: `Under $${maxPrice}`, key: "maxPrice" });
  if (color) activeFilters.push({ type: "Color", value: color, key: "color" });
  if (size) activeFilters.push({ type: "Size", value: size, key: "size" });
  if (brand) activeFilters.push({ type: "Brand", value: brand, key: "brand" });
  if (rating) activeFilters.push({ type: "Rating", value: `${rating} Stars & Up`, key: "rating" });

  const handleRemoveFilter = (key: string) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.delete(key);
    setSearchParams(newParams);
  };

  const handleClearAll = () => {
    setSearchParams({});
  };

  if (activeFilters.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-3">
      <span className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-zinc-500">Active Filters:</span>
      
      {activeFilters.map((filter) => (
        <span 
          key={filter.key} 
          className="inline-flex items-center gap-2 bg-zinc-900 border border-zinc-800/80 px-3 py-1.5 rounded-lg text-[10px] font-extrabold uppercase tracking-wider text-zinc-300"
        >
          <span className="text-zinc-500 font-bold">{filter.type}:</span> {filter.value}
          <button 
            onClick={() => handleRemoveFilter(filter.key)}
            className="text-zinc-500 hover:text-[#D4AF37] transition-colors cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </span>
      ))}
      
      <button 
        onClick={handleClearAll}
        className="text-[10px] font-extrabold uppercase tracking-widest text-[#D4AF37] hover:underline ml-2 transition-all cursor-pointer"
      >
        Clear All
      </button>
    </div>
  );
}
