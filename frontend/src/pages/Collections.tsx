import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Truck, ShieldCheck, RefreshCw, Headphones } from "lucide-react";

const collections = [
  {
    slug: "business",
    name: "Business Collection",
    desc: "Power dressing for the professional.",
    items: 42,
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=800",
    icon: "👔",
  },
  {
    slug: "wedding",
    name: "Wedding Collection",
    desc: "Make every moment unforgettable.",
    items: 35,
    image: "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=800",
    icon: "🎩",
  },
  {
    slug: "casual",
    name: "Casual Collection",
    desc: "Relaxed style, elevated.",
    items: 58,
    image: "https://images.unsplash.com/photo-1617137968427-85924c800a22?q=80&w=800",
    icon: "👕",
  },
  {
    slug: "watches",
    name: "Watches Collection",
    desc: "Timeless craftsmanship on your wrist.",
    items: 28,
    image: "https://images.unsplash.com/photo-1524592094714-0f0654e20314?q=80&w=800",
    icon: "⌚",
  },
  {
    slug: "shoes",
    name: "Shoes Collection",
    desc: "Step into quality and elegance.",
    items: 52,
    image: "https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?q=80&w=800",
    icon: "👞",
  },
  {
    slug: "accessories",
    name: "Accessories Collection",
    desc: "The details that define you.",
    items: 36,
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=800",
    icon: "💼",
  },
  {
    slug: "bestsellers",
    name: "Best Sellers",
    desc: "Our most loved pieces.",
    items: 40,
    image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=800",
    icon: "⭐",
  },
  {
    slug: "essentials",
    name: "Tailored Essentials",
    desc: "Custom fit. Perfected for you.",
    items: 24,
    image: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?q=80&w=800",
    icon: "✂️",
  },
];

const features = [
  { icon: Truck, label: "Free Shipping", desc: "On all orders over $150" },
  { icon: ShieldCheck, label: "Premium Quality", desc: "100% authentic products" },
  { icon: RefreshCw, label: "Easy Returns", desc: "30-day return policy" },
  { icon: Headphones, label: "24/7 Support", desc: "We're here to help" },
];

export function Collections() {
  return (
    <div className="bg-[#040404] min-h-screen text-white">

      {/* Hero */}
      <div className="pt-28 pb-14 px-4 text-center border-b border-zinc-900">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <p className="text-[#D4AF37] text-xs font-extrabold uppercase tracking-[0.4em] mb-4">Curated for the Modern Gentleman</p>
          <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tight mb-5">OUR COLLECTIONS</h1>
          <div className="flex items-center justify-center gap-3 mb-5">
            <div className="h-[1px] w-16 bg-[#D4AF37]/50" />
            <div className="w-2 h-2 border border-[#D4AF37] rotate-45" />
            <div className="h-[1px] w-16 bg-[#D4AF37]/50" />
          </div>
          <p className="text-zinc-400 text-base max-w-lg mx-auto leading-relaxed">
            Discover expertly curated collections designed for every moment.<br />
            Timeless pieces. Modern sophistication.
          </p>
        </motion.div>
      </div>

      {/* Collections Grid */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {collections.map((col, i) => (
            <motion.div
              key={col.slug}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.07 }}
            >
              <Link
                to={`/shop?collection=${col.slug}`}
                className="group relative block rounded-xl overflow-hidden aspect-[4/3] border border-zinc-900 hover:border-[#D4AF37]/40 transition-all duration-300 hover:shadow-[0_0_30px_rgba(212,175,55,0.08)]"
              >
                {/* Image */}
                <img
                  src={col.image}
                  alt={col.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

                {/* Icon badge */}
                <div className="absolute top-3 left-3 w-9 h-9 rounded-full bg-black/60 border border-[#D4AF37]/30 backdrop-blur-sm flex items-center justify-center text-base">
                  {col.icon}
                </div>

                {/* Text overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <h3 className="text-white font-extrabold text-sm uppercase tracking-wide leading-snug mb-0.5">
                    {col.name}
                  </h3>
                  <p className="text-zinc-400 text-xs mb-2">{col.desc}</p>
                  <p className="text-zinc-500 text-[10px] mb-3">{col.items} Items</p>
                  <span className="flex items-center gap-1.5 text-[#D4AF37] text-[10px] font-extrabold uppercase tracking-widest group-hover:gap-3 transition-all duration-200">
                    Explore Collection <ArrowRight className="h-3 w-3" />
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Features Row */}
      <div className="border-t border-zinc-900 bg-[#070707]">
        <div className="max-w-5xl mx-auto px-4 py-8 grid grid-cols-2 md:grid-cols-4 gap-6">
          {features.map((f, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full border border-[#D4AF37]/30 flex items-center justify-center flex-shrink-0">
                <f.icon className="h-4 w-4 text-[#D4AF37]" />
              </div>
              <div>
                <div className="text-white text-xs font-extrabold uppercase tracking-wider">{f.label}</div>
                <div className="text-zinc-500 text-xs mt-0.5">{f.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
