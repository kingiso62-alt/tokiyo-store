import { X } from "lucide-react";

export function ActiveFilters() {
  const activeFilters = [
    { type: 'Category', value: 'Suits' },
    { type: 'Price', value: '$500 - $1200' },
    { type: 'Color', value: 'Black' }
  ];

  if (activeFilters.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-3">
      <span className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-zinc-500">Active Filters:</span>
      
      {activeFilters.map((filter, idx) => (
        <span 
          key={idx} 
          className="inline-flex items-center gap-2 bg-zinc-900 border border-zinc-800/80 px-3 py-1.5 rounded-lg text-[10px] font-extrabold uppercase tracking-wider text-zinc-300"
        >
          <span className="text-zinc-500 font-bold">{filter.type}:</span> {filter.value}
          <button className="text-zinc-500 hover:text-[#D4AF37] transition-colors">
            <X className="w-3.5 h-3.5" />
          </button>
        </span>
      ))}
      
      <button className="text-[10px] font-extrabold uppercase tracking-widest text-[#D4AF37] hover:underline ml-2 transition-all">
        Clear All
      </button>
    </div>
  );
}
