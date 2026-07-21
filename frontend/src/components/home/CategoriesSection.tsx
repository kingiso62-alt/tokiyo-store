import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ShieldCheck, RefreshCw, Lock, Headphones, ArrowRight } from "lucide-react";

const features = [
  { icon: ShieldCheck, title: "Premium Quality", desc: "Finest materials" },
  { icon: RefreshCw, title: "Easy Returns", desc: "30-day return policy" },
  { icon: Lock, title: "Secure Payment", desc: "100% secure checkout" },
  { icon: Headphones, title: "Customer Support", desc: "24/7 dedicated support" }
];

const categoryCards = [
  { 
    name: "Suits & Blazers", 
    slug: "suits", 
    image: "https://images.unsplash.com/photo-1593030761757-71fae45fa0e5?q=80&w=800" 
  },
  { 
    name: "Shoes", 
    slug: "shoes", 
    image: "https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?q=80&w=800" 
  },
  { 
    name: "Watches", 
    slug: "watches", 
    image: "https://images.unsplash.com/photo-1524592094714-0f0654e20314?q=80&w=800" 
  },
  { 
    name: "Bags", 
    slug: "accessories", 
    image: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?q=80&w=800" 
  },
  { 
    name: "Fragrances", 
    slug: "accessories", 
    image: "https://images.unsplash.com/photo-1541643600914-78b084683601?q=80&w=800" 
  },
  { 
    name: "Accessories", 
    slug: "accessories", 
    image: "https://images.unsplash.com/photo-1617137968427-85924c800a22?q=80&w=800" 
  }
];

export function CategoriesSection() {
  return (
    <div className="w-full bg-white text-black">
      
      {/* 1. Features Highlight Row */}
      <div className="border-b border-gray-100 bg-[#fafafa]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 items-center divide-x-0 lg:divide-x divide-gray-200">
            {features.map((feat, idx) => (
              <div key={idx} className="flex items-center justify-start lg:justify-center gap-4 px-2">
                <div className="h-10 w-10 rounded-full bg-black/5 flex items-center justify-center flex-shrink-0">
                  <feat.icon className="h-5 w-5 text-black" />
                </div>
                <div className="text-left">
                  <h4 className="text-xs font-black uppercase tracking-widest leading-none text-gray-900">{feat.title}</h4>
                  <span className="text-[10px] font-semibold text-gray-400 mt-1 block">{feat.desc}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 2. Shop By Category Grid */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
        
        {/* Title Header */}
        <div className="text-center space-y-4">
          <h2 className="text-2xl md:text-3xl font-bold tracking-[0.15em] uppercase text-gray-900 font-sans">
            Shop by Category
          </h2>
          <div className="flex justify-center items-center gap-2">
            <div className="w-8 h-[1px] bg-gray-300" />
            <div className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]" />
            <div className="w-8 h-[1px] bg-gray-300" />
          </div>
        </div>

        {/* 6 Columns Cards Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-5">
          {categoryCards.map((cat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.08 }}
            >
              <Link 
                to={`/shop?category=${cat.slug}`} 
                className="group relative block aspect-[3/4] overflow-hidden rounded-xl bg-gray-950 border border-zinc-900 shadow-md transition-all duration-300 hover:shadow-xl hover:scale-[1.02]"
              >
                {/* Background Image */}
                <div 
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110 opacity-70 group-hover:opacity-90"
                  style={{ backgroundImage: `url(${cat.image})` }}
                />
                
                {/* Elegant black gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent transition-all duration-300 group-hover:bg-black/40" />

                {/* Card details */}
                <div className="absolute inset-x-0 bottom-0 p-4 text-left flex flex-col justify-end">
                  <h3 className="text-xs font-black text-white uppercase tracking-widest mb-1 leading-tight group-hover:text-[#D4AF37] transition-colors">
                    {cat.name}
                  </h3>
                  <div className="flex items-center gap-1.5 text-[9px] uppercase tracking-wider font-extrabold text-zinc-400 group-hover:text-white transition-colors">
                    <span>Explore</span>
                    <ArrowRight className="h-3 w-3 transform transition-transform group-hover:translate-x-1" />
                  </div>
                </div>

              </Link>
            </motion.div>
          ))}
        </div>

      </section>

    </div>
  );
}
