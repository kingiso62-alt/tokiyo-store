import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const blogPosts = [
  {
    title: "The Art of Bespoke Tailoring",
    slug: "art-of-bespoke-tailoring",
    excerpt: "Understanding canvas construction, shoulder drape, and the architectural foundation of a true luxury suit.",
    image: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?q=80&w=800",
    date: "July 20, 2026"
  },
  {
    title: "Luxury Watch Care Guide",
    slug: "luxury-watch-care-guide",
    excerpt: "Essential tips to protect, clean, and service mechanical timepieces to ensure heirloom longevity.",
    image: "https://images.unsplash.com/photo-1524592094714-0f0654e20314?q=80&w=800",
    date: "July 18, 2026"
  },
  {
    title: "Seasonal Tones for the Gentleman",
    slug: "seasonal-tones-gentleman",
    excerpt: "How to transition your wardrobe using charcoal, gold accents, and tailored layers this autumn.",
    image: "https://images.unsplash.com/photo-1617137968427-85924c800a22?q=80&w=800",
    date: "July 12, 2026"
  }
];

export function Blog() {
  return (
    <div className="bg-[#040404] text-white min-h-screen py-24 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-6xl mx-auto space-y-16">
        
        {/* Header Title */}
        <div className="text-center space-y-4">
          <span className="text-[#D4AF37] text-xs font-extrabold tracking-[0.3em] uppercase block">
            Sartorial Detour
          </span>
          <h1 className="text-4xl sm:text-5xl font-black uppercase tracking-widest text-white leading-tight font-sans">
            Tokiyo Editorial Blog
          </h1>
          <div className="flex justify-center items-center gap-2">
            <div className="w-8 h-[1px] bg-zinc-800" />
            <div className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]" />
            <div className="w-8 h-[1px] bg-zinc-800" />
          </div>
        </div>

        {/* Editorial posts grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {blogPosts.map((post, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: idx * 0.1 }}
              className="bg-[#0b0b0b] border border-zinc-900 rounded-xl overflow-hidden shadow-xl flex flex-col justify-between group"
            >
              <div>
                <div className="h-56 overflow-hidden relative border-b border-zinc-900">
                  <img 
                    src={post.image} 
                    alt={post.title} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/30" />
                </div>
                <div className="p-6 space-y-3">
                  <span className="text-[10px] text-[#D4AF37] uppercase font-black tracking-widest">{post.date}</span>
                  <h3 className="text-white font-bold text-lg uppercase tracking-wide group-hover:text-[#D4AF37] transition-colors leading-tight">
                    {post.title}
                  </h3>
                  <p className="text-zinc-500 text-xs leading-relaxed font-medium">
                    {post.excerpt}
                  </p>
                </div>
              </div>
              <div className="p-6 pt-0 text-left">
                <Link 
                  to="/shop" 
                  className="inline-flex items-center gap-1 text-[10px] uppercase font-extrabold tracking-widest text-zinc-400 hover:text-white transition-colors"
                >
                  <span>Read Article</span>
                  <ArrowRight className="h-3.5 w-3.5 transform transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </div>
  );
}
