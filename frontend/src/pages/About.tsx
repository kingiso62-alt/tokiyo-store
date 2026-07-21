import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Scissors, Gem, Users } from "lucide-react";

const standards = [
  {
    icon: Scissors,
    title: "Bespoke Fitting",
    desc: "Suits crafted and tailored according to the highest standards of structural drape.",
  },
  {
    icon: Gem,
    title: "Exquisite Materials",
    desc: "We source our textiles from heritage mills in Italy and England.",
  },
  {
    icon: Users,
    title: "Boutique Experience",
    desc: "Designed for one client at a time, ensuring a focused bespoke relationship.",
  },
];

const stats = [
  { value: "10+", label: "Years of Heritage", desc: "A decade of dedication to sartorial excellence." },
  { value: "5000+", label: "Suits Tailored", desc: "Crafted for gentlemen around the world." },
  { value: "25+", label: "Countries Served", desc: "Delivering luxury to clients across the globe." },
  { value: "100%", label: "Quality Commitment", desc: "Uncompromising quality in every detail." },
];

export function About() {
  return (
    <div className="bg-[#040404] min-h-screen text-white">

      {/* Hero */}
      <div className="relative pt-28 pb-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1920')] bg-cover bg-center opacity-[0.04]" />
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <p className="text-[#D4AF37] text-xs font-extrabold uppercase tracking-[0.4em] mb-5">Our Heritage</p>
            <h1 className="text-5xl md:text-7xl font-black uppercase leading-tight mb-4">
              OUR STORY /<br />
              <span className="text-[#D4AF37]">SARTORIAL CRAFT</span>
            </h1>
            <div className="flex items-center justify-center gap-3 mt-6">
              <div className="h-[1px] w-16 bg-[#D4AF37]/50" />
              <div className="w-2 h-2 border border-[#D4AF37] rotate-45" />
              <div className="h-[1px] w-16 bg-[#D4AF37]/50" />
            </div>
          </motion.div>
        </div>
      </div>

      {/* Story Section */}
      <div className="max-w-6xl mx-auto px-4 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-20"
        >
          <div>
            <div className="flex items-center gap-3 mb-6">
              <Scissors className="h-5 w-5 text-[#D4AF37]" />
              <h2 className="text-xl font-extrabold uppercase tracking-widest">The Art of Precision</h2>
            </div>
            <div className="h-[2px] w-10 bg-[#D4AF37] mb-6" />
            <p className="text-zinc-400 leading-relaxed mb-5">
              Founded with the vision to deliver the absolute gold standard in men's tailoring, TOKIYO STORE represents the perfect convergence between traditional Italian craftsmanship and modern aesthetic guidelines.
            </p>
            <p className="text-zinc-400 leading-relaxed mb-8">
              Every garment in our boutique is curated with the utmost care, utilizing only the finest wools, silks, and hand-selected leathers. We believe that true luxury is not just seen; it is felt.
            </p>
            <p className="text-[#D4AF37] font-bold italic text-lg" style={{ fontFamily: "Georgia, serif" }}>
              — The Tokiyo Team
            </p>
          </div>
          <div className="relative rounded-xl overflow-hidden aspect-[4/5] border border-zinc-900">
            <img
              src="https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=800"
              alt="Our Story"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent" />
          </div>
        </motion.div>

        {/* Luxury Standards */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.35 }}
          className="mb-20"
        >
          <div className="text-center mb-10">
            <h2 className="text-2xl font-extrabold uppercase tracking-widest mb-3">Our Luxury Standards</h2>
            <div className="flex items-center justify-center gap-3">
              <div className="h-[1px] w-12 bg-[#D4AF37]/40" />
              <div className="w-1.5 h-1.5 bg-[#D4AF37] rotate-45" />
              <div className="h-[1px] w-12 bg-[#D4AF37]/40" />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {standards.map((s, i) => (
              <div key={i} className="border border-zinc-900 rounded-xl p-7 hover:border-[#D4AF37]/30 transition-all hover:bg-[#D4AF37]/[0.02]">
                <div className="w-12 h-12 rounded-full border border-[#D4AF37]/40 flex items-center justify-center mb-5">
                  <s.icon className="h-5 w-5 text-[#D4AF37]" />
                </div>
                <h3 className="text-sm font-extrabold uppercase tracking-widest mb-3 text-[#D4AF37]">{s.title}</h3>
                <p className="text-zinc-400 text-sm leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Legacy + Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.45 }}
          className="rounded-2xl overflow-hidden border border-zinc-900"
        >
          <div className="grid grid-cols-1 md:grid-cols-2">
            {/* Left — Dark image */}
            <div className="relative aspect-[4/3] md:aspect-auto">
              <img
                src="https://images.unsplash.com/photo-1558769132-cb1aea458c5e?q=80&w=800"
                alt="Craftsmanship"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/60" />
              <div className="absolute inset-0 p-8 md:p-10 flex flex-col justify-end">
                <p className="text-[#D4AF37] text-[10px] font-extrabold uppercase tracking-[0.35em] mb-3">Behind Every Piece</p>
                <h3 className="text-2xl md:text-3xl font-black uppercase leading-tight mb-4">
                  A Legacy of<br />Craftsmanship
                </h3>
                <p className="text-zinc-400 text-sm leading-relaxed mb-6 max-w-xs">
                  Our atelier combines generations of sartorial knowledge with contemporary innovation to create timeless pieces that stand the test of time.
                </p>
                <Link
                  to="/shop"
                  className="flex items-center gap-2 text-[#D4AF37] text-[10px] font-extrabold uppercase tracking-[0.25em] hover:gap-4 transition-all"
                >
                  Discover Our Process <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>

            {/* Right — Stats */}
            <div className="bg-[#080808] p-8 md:p-10 grid grid-cols-2 gap-6 content-center">
              {stats.map((s, i) => (
                <div key={i} className="border border-zinc-900 rounded-xl p-5 hover:border-[#D4AF37]/20 transition-all">
                  <div className="text-3xl font-black text-white mb-1">{s.value}</div>
                  <div className="text-[#D4AF37] text-[9px] font-extrabold uppercase tracking-widest mb-2">{s.label}</div>
                  <p className="text-zinc-500 text-xs leading-relaxed">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Newsletter CTA */}
      <div className="border-t border-zinc-900 bg-[#070707]">
        <div className="max-w-5xl mx-auto px-4 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4 text-zinc-300 text-sm">
            <div className="w-8 h-8 rounded-full border border-[#D4AF37]/40 flex items-center justify-center flex-shrink-0">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
            </div>
            Join our insider list for exclusive updates, new arrivals, and private offers.
          </div>
          <Link
            to="/contact"
            className="flex items-center gap-2 bg-transparent border border-[#D4AF37]/50 text-[#D4AF37] text-xs font-extrabold uppercase tracking-widest px-6 py-3 rounded hover:bg-[#D4AF37]/10 hover:border-[#D4AF37] transition-all whitespace-nowrap"
          >
            Join The List <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
