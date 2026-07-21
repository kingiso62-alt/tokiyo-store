import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ShieldCheck, Ruler, Truck } from "lucide-react";

export function HeroBanner() {
  return (
    <div className="relative h-screen w-full overflow-hidden bg-[#040404] flex items-center pt-[70px]">
      
      {/* Background Image of Luxury Tailored Suit with strong elegant mask overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-right lg:bg-center bg-no-repeat opacity-50 transition-all duration-700"
        style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1594938298603-c8148c4dae35?q=80&w=2000")' }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/20" />
      </div>

      <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center h-full">
        
        {/* Left Side: Editorial Typography & Actions */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.9, ease: "easeOut" }}
          className="lg:col-span-7 space-y-6 text-left"
        >
          <span className="text-[#D4AF37] text-xs md:text-sm font-extrabold tracking-[0.25em] uppercase block">
            The Gold Standard of Men's Fashion
          </span>
          
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight text-white uppercase leading-[1.1] font-sans">
            Elevate Your <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] via-amber-200 to-[#D4AF37]">
              Signature Style
            </span>
          </h1>
          
          <p className="text-zinc-400 text-sm sm:text-base max-w-xl font-medium leading-relaxed">
            Discover our new premium collection. Impeccably tailored suits, luxury timepieces, and Italian leather accessories designed for the modern gentleman.
          </p>
          
          <div className="flex flex-wrap gap-4 pt-4">
            <Button asChild className="bg-[#D4AF37] hover:bg-white text-black font-black uppercase tracking-widest text-xs h-12 px-8 rounded-none shadow-xl transition-all duration-350">
              <Link to="/shop">Shop Collection</Link>
            </Button>
            <Button variant="outline" asChild className="border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black font-black uppercase tracking-widest text-xs h-12 px-8 rounded-none shadow-xl transition-all duration-350 bg-transparent">
              <Link to="/collections">View Lookbook</Link>
            </Button>
          </div>
        </motion.div>

        {/* Right Side: Luxury Quality Highlights */}
        <motion.div 
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.9, delay: 0.3 }}
          className="hidden lg:flex lg:col-span-5 flex-col items-end space-y-8 pr-4"
        >
          {[
            { icon: ShieldCheck, title: "Premium Quality", subtitle: "Finest materials" },
            { icon: Ruler, title: "Perfect Fit", subtitle: "Tailored to perfection" },
            { icon: Truck, title: "Fast Delivery", subtitle: "Worldwide shipping" }
          ].map((item, idx) => (
            <div key={idx} className="flex items-center gap-4 text-right group">
              <div>
                <h4 className="text-white font-extrabold uppercase tracking-widest text-xs group-hover:text-[#D4AF37] transition-colors">{item.title}</h4>
                <p className="text-zinc-500 text-[10px] font-semibold">{item.subtitle}</p>
              </div>
              <div className="h-12 w-12 rounded-full border border-zinc-800 flex items-center justify-center bg-black/60 shadow-md group-hover:border-[#D4AF37] group-hover:shadow-[0_0_15px_rgba(212,175,55,0.2)] transition-all duration-500">
                <item.icon className="h-5 w-5 text-[#D4AF37]" />
              </div>
            </div>
          ))}
        </motion.div>

      </div>

      {/* Bottom Slider Index Pagination Indicators */}
      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 max-w-7xl w-full px-8 hidden md:flex items-center gap-6 justify-start text-[11px] font-bold tracking-widest text-zinc-500">
        <div className="flex items-center gap-1.5 cursor-pointer text-[#D4AF37]">
          <span>01</span>
          <div className="w-12 h-[2px] bg-[#D4AF37]" />
        </div>
        <div className="flex items-center gap-1.5 cursor-pointer hover:text-white transition-colors">
          <span>02</span>
          <div className="w-12 h-[2px] bg-zinc-800" />
        </div>
        <div className="flex items-center gap-1.5 cursor-pointer hover:text-white transition-colors">
          <span>03</span>
          <div className="w-12 h-[2px] bg-zinc-800" />
        </div>
      </div>

    </div>
  );
}
