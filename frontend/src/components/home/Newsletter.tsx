import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Crown, Mail, Tag, ShoppingBag, Lock, Send, ShieldCheck, RefreshCw, Headphones } from "lucide-react";

export function Newsletter() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setTimeout(() => {
      setStatus("success");
      setEmail("");
    }, 1500);
  };

  return (
    <section className="py-24 bg-[#050505] text-white relative overflow-hidden">
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-16">
        
        {/* Main Newsletter grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Side Content & Sign-up */}
          <div className="lg:col-span-6 space-y-6 text-center lg:text-left">
            
            {/* Insider Badge */}
            <div className="flex items-center justify-center lg:justify-start gap-4">
              <div className="w-10 h-[1px] bg-zinc-800" />
              <div className="flex items-center gap-1.5 text-[#D4AF37]">
                <Crown className="h-4.5 w-4.5 text-[#D4AF37]" />
                <span className="text-[10px] font-black uppercase tracking-[0.25em]">The Insiders Club</span>
              </div>
              <div className="w-10 h-[1px] bg-zinc-800" />
            </div>

            {/* Title */}
            <h2 className="text-4xl sm:text-5xl font-black uppercase tracking-wider leading-none text-white font-sans">
              Join <span className="text-[#D4AF37]">The List</span>
            </h2>

            {/* Gold Divider with Diamond */}
            <div className="flex items-center justify-center lg:justify-start gap-2">
              <div className="w-16 h-[1px] bg-zinc-800" />
              <div className="w-1.5 h-1.5 bg-[#D4AF37] rotate-45" />
              <div className="w-16 h-[1px] bg-zinc-800" />
            </div>

            {/* Description */}
            <p className="text-zinc-400 text-sm max-w-md mx-auto lg:mx-0 font-medium leading-relaxed">
              Subscribe to receive updates on new arrivals, exclusive offers, and early access to limited edition collections.
            </p>

            {/* Subscription Form */}
            <div className="max-w-md mx-auto lg:mx-0 pt-2">
              {status === "success" ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-[#0c0c0c] text-[#D4AF37] p-4 rounded-xl border border-zinc-900 font-bold text-xs uppercase tracking-widest text-center"
                >
                  Thank you for subscribing. Welcome to the club.
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="flex gap-3">
                  <div className="relative flex-1">
                    <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-zinc-500" />
                    <Input
                      type="email"
                      required
                      placeholder="Enter your email address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="h-12 pl-11 bg-[#0c0c0c] border border-zinc-900 text-white placeholder:text-zinc-500 rounded-lg focus-visible:ring-1 focus-visible:ring-[#D4AF37] focus-visible:border-transparent text-xs"
                    />
                  </div>
                  <Button 
                    type="submit" 
                    disabled={status === "loading"}
                    className="h-12 px-6 rounded-lg bg-gradient-to-r from-[#D4AF37] to-amber-400 text-black font-black uppercase tracking-wider text-xs hover:from-white hover:to-white hover:text-black transition-all active:scale-95 cursor-pointer shadow-lg"
                  >
                    {status === "loading" ? "Joining..." : "Subscribe"}
                  </Button>
                </form>
              )}
            </div>

            {/* Small Features underneath the form */}
            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-zinc-900 max-w-md mx-auto lg:mx-0 text-left">
              {[
                { icon: Tag, title: "Exclusive Offers", desc: "Members only deals" },
                { icon: ShoppingBag, title: "New Arrivals", desc: "Be the first to know" },
                { icon: Lock, title: "Early Access", desc: "Limited collections" }
              ].map((f, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex items-center gap-1 text-[#D4AF37]">
                    <f.icon className="h-3.5 w-3.5" />
                    <span className="text-[9px] font-black uppercase tracking-widest leading-none">{f.title}</span>
                  </div>
                  <p className="text-zinc-500 text-[8px] font-semibold leading-none">{f.desc}</p>
                </div>
              ))}
            </div>

            {/* Privacy Promise */}
            <div className="flex items-center justify-center lg:justify-start gap-1.5 text-[9px] font-bold text-zinc-500 pt-2">
              <Lock className="h-3 w-3" />
              <span>We respect your privacy. Unsubscribe at any time.</span>
            </div>

          </div>

          {/* Right Side: Editorial Model Image with blending gradient mask */}
          <div className="lg:col-span-6 relative h-[450px] w-full hidden lg:block rounded-xl overflow-hidden border border-zinc-900 shadow-2xl">
            <img 
              src="https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=1200" 
              alt="Bespoke Tailoring Silhouette" 
              className="w-full h-full object-cover"
            />
            {/* Gradient Mask Overlay to blend background */}
            <div className="absolute inset-0 bg-gradient-to-r from-black via-black/10 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black to-transparent" />
          </div>

        </div>

        {/* 2. Bottom Value Propositions Banner */}
        <div className="bg-white border border-gray-100 rounded-xl p-6 grid grid-cols-2 lg:grid-cols-4 gap-6 items-center shadow-lg text-left">
          {[
            { icon: Send, title: "Fast Delivery", desc: "Worldwide shipping" },
            { icon: ShieldCheck, title: "Premium Quality", desc: "100% authentic products" },
            { icon: RefreshCw, title: "Easy Returns", desc: "30-day return policy" },
            { icon: Headphones, title: "24/7 Support", desc: "We're here to help" }
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
