import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { HeroBanner } from "@/components/home/HeroBanner";
import { CategoriesSection } from "@/components/home/CategoriesSection";
import { FlashSale } from "@/components/home/FlashSale";
import { FeaturedProducts } from "@/components/home/FeaturedProducts";
import { Newsletter } from "@/components/home/Newsletter";
import { InstagramGallery } from "@/components/home/InstagramGallery";
import { Loader2 } from "lucide-react";

interface HomepageSection {
  id: string;
  enabled: boolean;
  order: number;
}

export function Home() {
  const { data: sections, isLoading } = useQuery<HomepageSection[]>({
    queryKey: ["homepage_sections"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("settings")
        .select("value")
        .eq("key", "homepage_sections")
        .single();
      if (error || !data) return [];
      return data.value as HomepageSection[];
    },
    retry: 1
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="animate-spin h-10 w-10 text-black" />
      </div>
    );
  }

  // Fallback default structure if DB is disconnected/empty
  const displaySections = sections && sections.length > 0
    ? [...sections].sort((a, b) => a.order - b.order)
    : [
        { id: "hero", enabled: true, order: 1 },
        { id: "categories", enabled: true, order: 2 },
        { id: "flash_sale", enabled: true, order: 3 },
        { id: "new_arrivals", enabled: true, order: 4 },
        { id: "reviews", enabled: true, order: 5 },
        { id: "newsletter", enabled: true, order: 6 }
      ];

  const rendered = new Set<string>();

  return (
    <div className="flex flex-col min-h-screen">
      {displaySections
        .filter((sec) => sec.enabled)
        .map((sec) => {
          const id = sec.id;
          if (id === "new_arrivals" || id === "best_sellers") {
            if (rendered.has("featured_products")) return null;
            rendered.add("featured_products");
            return <FeaturedProducts key="featured_products" />;
          }

          switch (id) {
            case "hero":
              return <HeroBanner key={id} />;
            case "categories":
              return <CategoriesSection key={id} />;
            case "flash_sale":
              return <FlashSale key={id} />;
            case "newsletter":
              return <Newsletter key={id} />;
            case "reviews":
              return <InstagramGallery key={id} />;
            default:
              return null;
          }
        })}
    </div>
  );
}
