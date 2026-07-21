import { useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";

export function FilterSidebar() {
  const [priceRange, setPriceRange] = useState([0, 5000]);

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold uppercase tracking-widest">Filters</h2>
        <button className="text-xs text-muted-foreground uppercase tracking-widest hover:text-foreground">Clear All</button>
      </div>

      <Accordion type="multiple" defaultValue={["category", "price", "color"]} className="w-full">
        
        {/* Category */}
        <AccordionItem value="category" className="border-b border-border">
          <AccordionTrigger className="text-sm font-semibold uppercase tracking-widest hover:no-underline">Category</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-3 pt-2">
              {['Suits', 'Shirts', 'Pants', 'Outerwear', 'Watches', 'Shoes', 'Accessories'].map((cat) => (
                <div key={cat} className="flex items-center space-x-3">
                  <Checkbox id={`cat-${cat}`} />
                  <label htmlFor={`cat-${cat}`} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    {cat}
                  </label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Price */}
        <AccordionItem value="price" className="border-b border-border">
          <AccordionTrigger className="text-sm font-semibold uppercase tracking-widest hover:no-underline">Price Range</AccordionTrigger>
          <AccordionContent>
            <div className="pt-4 pb-2 px-2">
              <Slider
                defaultValue={[0, 5000]}
                max={5000}
                step={50}
                value={priceRange}
                onValueChange={setPriceRange}
                className="mb-6"
              />
              <div className="flex justify-between items-center text-sm font-medium">
                <span className="bg-secondary px-3 py-1 rounded-sm">${priceRange[0]}</span>
                <span className="text-muted-foreground">to</span>
                <span className="bg-secondary px-3 py-1 rounded-sm">${priceRange[1]}</span>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Color */}
        <AccordionItem value="color" className="border-b border-border">
          <AccordionTrigger className="text-sm font-semibold uppercase tracking-widest hover:no-underline">Color</AccordionTrigger>
          <AccordionContent>
            <div className="flex flex-wrap gap-3 pt-2">
              {[
                { name: 'Black', hex: '#000000' },
                { name: 'Navy', hex: '#000080' },
                { name: 'Grey', hex: '#808080' },
                { name: 'White', hex: '#ffffff', border: true },
                { name: 'Brown', hex: '#8B4513' },
                { name: 'Burgundy', hex: '#800020' },
                { name: 'Olive', hex: '#808000' },
                { name: 'Gold', hex: '#FFD700' },
              ].map((color) => (
                <button
                  key={color.name}
                  className={`w-8 h-8 rounded-full shadow-sm transition-transform hover:scale-110 focus:ring-2 focus:ring-offset-2 focus:ring-primary ${color.border ? 'border border-border' : ''}`}
                  style={{ backgroundColor: color.hex }}
                  title={color.name}
                  aria-label={`Select color ${color.name}`}
                />
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Size */}
        <AccordionItem value="size" className="border-b border-border">
          <AccordionTrigger className="text-sm font-semibold uppercase tracking-widest hover:no-underline">Size</AccordionTrigger>
          <AccordionContent>
            <div className="grid grid-cols-3 gap-2 pt-2">
              {['XS', 'S', 'M', 'L', 'XL', 'XXL', '38R', '40R', '42R', '44R'].map((size) => (
                <button
                  key={size}
                  className="h-10 border border-border bg-background text-sm font-medium hover:border-primary transition-colors uppercase"
                >
                  {size}
                </button>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Brand */}
        <AccordionItem value="brand" className="border-b border-border">
          <AccordionTrigger className="text-sm font-semibold uppercase tracking-widest hover:no-underline">Brand</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-3 pt-2">
              {['Tokiyo Exclusive', 'Italian Tailors', 'Swiss Horology', 'London Brogues'].map((brand) => (
                <div key={brand} className="flex items-center space-x-3">
                  <Checkbox id={`brand-${brand}`} />
                  <label htmlFor={`brand-${brand}`} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    {brand}
                  </label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Rating */}
        <AccordionItem value="rating" className="border-b border-border">
          <AccordionTrigger className="text-sm font-semibold uppercase tracking-widest hover:no-underline">Rating</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-3 pt-2">
              {[5, 4, 3, 2].map((rating) => (
                <div key={rating} className="flex items-center space-x-3">
                  <Checkbox id={`rating-${rating}`} />
                  <label htmlFor={`rating-${rating}`} className="flex items-center cursor-pointer">
                    <div className="flex text-accent mr-2">
                      {[1,2,3,4,5].map(i => (
                        <svg key={i} className={`w-4 h-4 ${i <= rating ? 'text-accent' : 'text-muted-foreground/30'}`} fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <span className="text-sm font-medium">& Up</span>
                  </label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

      </Accordion>
    </div>
  );
}
