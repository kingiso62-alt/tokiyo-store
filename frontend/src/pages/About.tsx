import { motion } from "framer-motion";

export function About() {
  return (
    <div className="bg-[#040404] text-white min-h-screen py-24 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-4xl mx-auto space-y-16">
        
        {/* Header Title */}
        <div className="text-center space-y-4">
          <span className="text-[#D4AF37] text-xs font-extrabold tracking-[0.3em] uppercase block">
            Our Heritage
          </span>
          <h1 className="text-4xl sm:text-5xl font-black uppercase tracking-widest text-white leading-tight font-sans">
            Our Story / Sartorial Craft
          </h1>
          <div className="flex justify-center items-center gap-2">
            <div className="w-8 h-[1px] bg-zinc-800" />
            <div className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]" />
            <div className="w-8 h-[1px] bg-zinc-800" />
          </div>
        </div>

        {/* Narrative editorial */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-6 text-zinc-400 text-sm leading-relaxed"
          >
            <h3 className="text-white text-lg font-bold uppercase tracking-widest">The Art of Precision</h3>
            <p>
              Founded with the vision to deliver the absolute gold standard in men's tailoring, TOKIYO STORE represents the perfect convergence between traditional Italian craftsmanship and modern aesthetic guidelines.
            </p>
            <p>
              Every garment in our boutique is curated with the utmost care, utilizing only the finest wools, silks, and hand-selected leathers. We believe that true luxury is not just seen; it is felt.
            </p>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative h-96 rounded-xl overflow-hidden border border-zinc-900 shadow-xl"
          >
            <img 
              src="https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=800" 
              alt="Craftsmanship" 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/30" />
          </motion.div>
        </div>

        {/* Core Values grid */}
        <div className="border-t border-zinc-900 pt-16 space-y-8">
          <h3 className="text-center text-white text-base font-black uppercase tracking-widest">Our Luxury Standards</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {[
              { title: "Bespoke Fitting", desc: "Suits drafted and tailored according to the highest standards of structural drape." },
              { title: "Exquisite Materials", desc: "We source our textiles from heritage mills in Italy and England." },
              { title: "Boutique Experience", desc: "Designed for one client at a time, ensuring a focused bespoke relationship." }
            ].map((val, idx) => (
              <div key={idx} className="bg-[#0b0b0b] border border-zinc-900 p-6 rounded-xl space-y-3">
                <h4 className="text-[#D4AF37] font-extrabold uppercase tracking-wider text-xs">{val.title}</h4>
                <p className="text-zinc-500 text-xs leading-relaxed">{val.desc}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
