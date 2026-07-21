import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/store/useCartStore";
import { Percent, Clock, ShieldCheck, Truck, ArrowRight } from "lucide-react";

const flashSaleProducts = [
  { 
    id: "fs1", 
    name: "Classic Aviator Sunglasses", 
    price: 120, 
    oldPrice: 250, 
    image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?q=80&w=600",
    category: "Accessories" 
  },
  { 
    id: "fs2", 
    name: "Leather Weekend Duffle", 
    price: 290, 
    oldPrice: 450, 
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=600",
    category: "Bags" 
  },
  { 
    id: "fs3", 
    name: "Cashmere Turtleneck", 
    price: 180, 
    oldPrice: 320, 
    image: "https://images.unsplash.com/photo-1617137968427-85924c800a22?q=80&w=600",
    category: "Clothing" 
  },
];

export function FlashSale() {
  const [timeLeft, setTimeLeft] = useState({ hours: 23, minutes: 59, seconds: 54 });
  const addItem = useCartStore(state => state.addItem);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="py-24 bg-[#050505] text-white relative overflow-hidden">
      
      {/* Editorial Glowing Gold Vectors background details */}
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-gradient-to-tr from-[#D4AF37]/10 to-transparent rounded-full filter blur-3xl pointer-events-none opacity-60" />
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-gradient-to-bl from-[#D4AF37]/10 to-transparent rounded-full filter blur-3xl pointer-events-none opacity-60" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-16">
        
        {/* Flash Sale Editorial block */}
        <div className="flex flex-col lg:flex-row items-center gap-12">
          
          {/* Left: Timer details */}
          <div className="lg:w-1/3 text-center lg:text-left space-y-6">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="space-y-5"
            >
              <div className="flex items-center gap-2 text-[#D4AF37] text-xs font-black tracking-widest uppercase justify-center lg:justify-start">
                <Clock className="h-4 w-4 text-[#D4AF37]" />
                <span>Limited Time Only</span>
              </div>
              
              <h2 className="text-4xl sm:text-5xl font-black uppercase tracking-wider leading-none text-white font-sans">
                Flash <span className="text-[#D4AF37]">Sale</span>
              </h2>
              
              <p className="text-zinc-400 text-sm leading-relaxed max-w-sm mx-auto lg:mx-0 font-medium">
                Up to 50% off premium accessories. Don't miss out on our best deals of the season!
              </p>
              
              {/* Luxury Countdown Timer */}
              <div className="flex justify-center lg:justify-start items-center gap-3 pt-2">
                <div className="flex flex-col items-center">
                  <div className="bg-[#0e0e0e] border border-zinc-900 text-white font-sans font-black text-xl w-16 h-16 flex items-center justify-center rounded-xl shadow-lg">
                    {String(timeLeft.hours).padStart(2, '0')}
                  </div>
                  <span className="text-[9px] uppercase tracking-widest font-bold mt-2 text-zinc-500">Hours</span>
                </div>
                <div className="text-[#D4AF37] text-xl font-bold pb-6">:</div>
                <div className="flex flex-col items-center">
                  <div className="bg-[#0e0e0e] border border-zinc-900 text-white font-sans font-black text-xl w-16 h-16 flex items-center justify-center rounded-xl shadow-lg">
                    {String(timeLeft.minutes).padStart(2, '0')}
                  </div>
                  <span className="text-[9px] uppercase tracking-widest font-bold mt-2 text-zinc-500">Mins</span>
                </div>
                <div className="text-[#D4AF37] text-xl font-bold pb-6">:</div>
                <div className="flex flex-col items-center">
                  <div className="bg-[#0e0e0e] border border-zinc-900 text-white font-sans font-black text-xl w-16 h-16 flex items-center justify-center rounded-xl shadow-lg">
                    {String(timeLeft.seconds).padStart(2, '0')}
                  </div>
                  <span className="text-[9px] uppercase tracking-widest font-bold mt-2 text-zinc-500">Secs</span>
                </div>
              </div>

              <div className="pt-4 text-center lg:text-left">
                <Button variant="outline" size="lg" asChild className="rounded-none border-[#D4AF37] text-white hover:bg-[#D4AF37] hover:text-black font-black uppercase tracking-widest px-8 h-12 transition-all duration-350 bg-transparent">
                  <Link to="/shop" className="flex items-center gap-2">
                    <span>View All Offers</span>
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </motion.div>
          </div>

          {/* Right: Products list */}
          <div className="lg:w-2/3 grid grid-cols-1 sm:grid-cols-3 gap-6">
            {flashSaleProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 + index * 0.08 }}
                className="bg-[#0c0c0c] border border-zinc-900 rounded-xl overflow-hidden shadow-lg hover:border-zinc-800 transition-all duration-300 flex flex-col justify-between text-left"
              >
                <div className="relative">
                  
                  {/* Discount percentage tag */}
                  <div className="absolute top-3 left-3 z-10 bg-red-600 text-white text-[9px] font-black uppercase tracking-widest px-2 py-0.5 shadow">
                    -{Math.round((1 - product.price / product.oldPrice) * 100)}%
                  </div>

                  {/* Circular Add to Cart Button (Bottom Right of Image) */}
                  <button 
                      onClick={(e) => { 
                        e.preventDefault(); 
                        addItem({ 
                          id: product.id, 
                          name: product.name, 
                          price: product.price, 
                          image: product.image, 
                          quantity: 1
                        }); 
                      }}
                    className="absolute bottom-3 right-3 z-10 w-8.5 h-8.5 rounded-full bg-black/60 hover:bg-[#D4AF37] text-white hover:text-black flex items-center justify-center border border-zinc-800 hover:border-transparent shadow-lg transition-all hover:scale-105 active:scale-95 cursor-pointer"
                    aria-label="Add to Cart"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
                  </button>
                  
                  {/* Product Image */}
                  <Link to={`/shop`} className="block aspect-[4/5] overflow-hidden bg-zinc-950 border-b border-zinc-900">
                    <img 
                      src={product.image} 
                      alt={product.name} 
                      loading="lazy" 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-80" 
                    />
                  </Link>
                </div>

                {/* Details */}
                <div className="p-4 space-y-1">
                  <span className="text-[9px] text-[#D4AF37] font-black uppercase tracking-[0.2em]">{product.category}</span>
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider line-clamp-1 leading-tight">{product.name}</h3>
                  <div className="flex items-center gap-2 pt-1">
                    <span className="text-[#D4AF37] font-black text-xs font-sans">${product.price.toFixed(2)}</span>
                    <span className="text-zinc-500 line-through text-[10px] font-sans">${product.oldPrice.toFixed(2)}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          
        </div>

        {/* 2. Bottom horizontal propositions row inside elegant white border container */}
        <div className="bg-white border border-gray-100 rounded-xl p-6 grid grid-cols-2 lg:grid-cols-4 gap-6 items-center shadow-lg text-left">
          {[
            { icon: Percent, title: "Up to 50% Off", desc: "Best deals this season" },
            { icon: Clock, title: "Limited Time", desc: "Hurry, offer ends soon" },
            { icon: ShieldCheck, title: "Premium Quality", desc: "100% authentic products" },
            { icon: Truck, title: "Fast Delivery", desc: "Worldwide shipping" }
          ].map((val, idx) => (
            <div key={idx} className="flex items-center gap-4">
              <div className="h-10 w-10 rounded-full bg-zinc-50 border border-zinc-100 flex items-center justify-center flex-shrink-0">
                <val.icon className="h-5 w-5 text-[#D4AF37]" />
              </div>
              <div>
                <h4 className="text-[10px] font-black uppercase tracking-widest text-black">{val.title}</h4>
                <span className="text-[9px] font-bold text-zinc-500 mt-0.5 block leading-none">{val.desc}</span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
