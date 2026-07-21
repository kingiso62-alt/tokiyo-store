export function ActiveFilters() {
  const activeFilters = [
    { type: 'Category', value: 'Suits' },
    { type: 'Price', value: '$500 - $1200' },
    { type: 'Color', value: 'Black' }
  ];

  if (activeFilters.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-3 py-4 border-b border-border mb-6">
      <span className="text-sm font-semibold uppercase tracking-widest text-muted-foreground mr-2">Active Filters:</span>
      
      {activeFilters.map((filter, idx) => (
        <span key={idx} className="inline-flex items-center gap-2 bg-secondary px-3 py-1.5 rounded-full text-xs font-medium">
          <span className="text-muted-foreground">{filter.type}:</span> {filter.value}
          <button className="hover:text-primary hover:bg-background rounded-full p-0.5 transition-colors">
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </span>
      ))}
      
      <button className="text-xs uppercase tracking-widest font-semibold text-primary hover:text-accent underline ml-2 transition-colors">
        Clear All
      </button>
    </div>
  );
}
