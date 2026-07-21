import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Calendar } from "lucide-react";

const blogPosts = [
  {
    title: "The Art of Bespoke Tailoring",
    slug: "art-of-bespoke-tailoring",
    category: "TAILORING",
    excerpt: "Understanding canvas construction, shoulder drape, and the architectural foundation of a true luxury suit.",
    image: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?q=80&w=800",
    date: "July 20, 2026",
  },
  {
    title: "Luxury Watch Care Guide",
    slug: "luxury-watch-care-guide",
    category: "WATCHES",
    excerpt: "Essential tips to protect, clean, and service mechanical timepieces to ensure heirloom longevity.",
    image: "https://images.unsplash.com/photo-1524592094714-0f0654e20314?q=80&w=800",
    date: "July 18, 2026",
  },
  {
    title: "Seasonal Tones for the Gentleman",
    slug: "seasonal-tones-gentleman",
    category: "STYLE GUIDE",
    excerpt: "How to transition your wardrobe using charcoal, gold accents, and tailored layers this autumn.",
    image: "https://images.unsplash.com/photo-1617137968427-85924c800a22?q=80&w=800",
    date: "July 12, 2026",
  },
  {
    title: "The Italian Suit: A Heritage",
    slug: "italian-suit-heritage",
    category: "TAILORING",
    excerpt: "Exploring the Neapolitan and Milanese traditions that define the pinnacle of sartorial excellence.",
    image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=800",
    date: "July 8, 2026",
  },
  {
    title: "Fragrance & The Modern Gentleman",
    slug: "fragrance-modern-gentleman",
    category: "LIFESTYLE",
    excerpt: "A curated guide to building a sophisticated fragrance wardrobe for every occasion.",
    image: "https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?q=80&w=800",
    date: "July 2, 2026",
  },
  {
    title: "Leather Shoe Care Masterclass",
    slug: "leather-shoe-care",
    category: "FOOTWEAR",
    excerpt: "Polishing, conditioning, and storing your luxury footwear to last decades.",
    image: "https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?q=80&w=800",
    date: "June 28, 2026",
  },
];

export function Blog() {
  return (
    <div className="bg-[#040404] min-h-screen text-white">
      {/* Hero Section */}
      <div className="pt-32 pb-16 px-4 text-center border-b border-zinc-900">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <p className="text-[#D4AF37] text-xs font-extrabold uppercase tracking-[0.4em] mb-4">Sartorial Detour</p>
          <h1 className="text-5xl md:text-6xl font-black uppercase tracking-tight mb-5">
            TOKIYO EDITORIAL BLOG
          </h1>
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="h-[1px] w-16 bg-[#D4AF37]/50" />
            <div className="w-2 h-2 border border-[#D4AF37] rotate-45" />
            <div className="h-[1px] w-16 bg-[#D4AF37]/50" />
          </div>
          <p className="text-zinc-400 text-base max-w-xl mx-auto leading-relaxed">
            Insights, guides, and inspirations from the world of timeless style,<br />modern tailoring, and refined living.
          </p>
        </motion.div>
      </div>

      {/* Articles Grid */}
      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {blogPosts.map((post, i) => (
            <motion.article
              key={post.slug}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="group bg-[#0a0a0a] border border-zinc-900 rounded-xl overflow-hidden hover:border-[#D4AF37]/30 transition-all duration-300 hover:shadow-[0_0_30px_rgba(212,175,55,0.06)]"
            >
              {/* Image */}
              <div className="relative aspect-[4/3] overflow-hidden">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent" />
                <span className="absolute top-3 left-3 bg-black/70 backdrop-blur-sm text-[#D4AF37] text-[9px] font-extrabold uppercase tracking-[0.25em] px-2.5 py-1 rounded">
                  {post.category}
                </span>
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="flex items-center gap-2 text-zinc-500 text-[10px] uppercase tracking-widest font-semibold mb-3">
                  <Calendar className="h-3 w-3" />
                  {post.date}
                </div>
                <h2 className="text-white font-extrabold text-base uppercase tracking-wide leading-snug mb-3 group-hover:text-[#D4AF37] transition-colors duration-300">
                  {post.title}
                </h2>
                <div className="h-[1px] w-8 bg-[#D4AF37]/60 mb-3" />
                <p className="text-zinc-400 text-sm leading-relaxed mb-5">
                  {post.excerpt}
                </p>
                <Link
                  to={`/blog/${post.slug}`}
                  className="flex items-center gap-2 text-[#D4AF37] text-[10px] font-extrabold uppercase tracking-[0.2em] hover:gap-3 transition-all duration-200"
                >
                  Read Article <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </motion.article>
          ))}
        </div>

        {/* View All */}
        <div className="mt-14 flex justify-center">
          <button className="flex items-center gap-3 border border-[#D4AF37]/40 text-[#D4AF37] text-xs font-extrabold uppercase tracking-[0.25em] px-8 py-4 rounded hover:bg-[#D4AF37]/10 hover:border-[#D4AF37] transition-all duration-200">
            View All Articles <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
