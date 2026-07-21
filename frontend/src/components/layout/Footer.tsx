import { Link } from "react-router-dom";
import { ShoppingBag, Headphones, MapPin, Mail, Phone, ChevronRight } from "lucide-react";

function TwitterIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.259 5.63L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
    </svg>
  );
}

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
    </svg>
  );
}

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"/>
    </svg>
  );
}

export function Footer() {
  return (
    <footer className="bg-[#050505] text-white pt-24 pb-12 border-t border-zinc-950 relative overflow-hidden">
      
      {/* Glow Top & Bottom Line Accents */}
      <div className="h-[1.5px] bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent absolute top-0 left-0 w-full opacity-60 shadow-[0_1px_8px_rgba(212,175,55,0.4)]" />
      <div className="h-[1px] bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent absolute bottom-0 left-0 w-full opacity-30" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-16">
        
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12">
          
          {/* Brand & Socials Column */}
          <div className="lg:col-span-3 space-y-6 text-left">
            <Link to="/" className="flex items-center gap-3">
              <img src="/logo.png" alt="TK Logo" className="h-8 w-auto filter brightness-110" />
              <span className="font-black text-xl tracking-widest text-white uppercase font-sans">
                Tokiyo <span className="text-[#D4AF37]">Store</span>
              </span>
            </Link>
            <p className="text-zinc-400 text-xs leading-relaxed font-medium">
              Elevating men's fashion with premium craftsmanship, timeless designs, and uncompromising quality. Redefining modern luxury.
            </p>
            <div className="w-12 h-[1px] bg-[#D4AF37] opacity-60" />
            <div className="flex space-x-3.5">
              {[
                { icon: TwitterIcon, href: "https://twitter.com" },
                { icon: InstagramIcon, href: "https://instagram.com" },
                { icon: FacebookIcon, href: "https://facebook.com" }
              ].map((social, idx) => (
                <a 
                  key={idx} 
                  href={social.href} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full border border-zinc-800 flex items-center justify-center text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black hover:border-transparent transition-all duration-350 shadow-md"
                >
                  <social.icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Links Column 1: Shop */}
          <div className="lg:col-span-3 space-y-6 text-left">
            <div className="space-y-2">
              <ShoppingBag className="h-5 w-5 text-[#D4AF37]" />
              <h4 className="text-[#D4AF37] font-black uppercase tracking-[0.2em] text-xs pb-1 border-b border-zinc-900">Shop</h4>
            </div>
            <ul className="space-y-3.5">
              {[
                { label: "Tailored Suits", path: "/shop?category=suits" },
                { label: "Luxury Timepieces", path: "/shop?category=watches" },
                { label: "Italian Footwear", path: "/shop?category=shoes" },
                { label: "Accessories", path: "/shop?category=accessories" },
                { label: "Flash Sale", path: "/shop?sale=true", highlight: true }
              ].map((link, idx) => (
                <li key={idx}>
                  <Link 
                    to={link.path} 
                    className={`text-xs font-bold flex items-center justify-between group transition-colors py-0.5 ${
                      link.highlight ? "text-[#D4AF37] hover:text-white" : "text-zinc-400 hover:text-white"
                    }`}
                  >
                    <span>{link.label}</span>
                    <ChevronRight className="h-3.5 w-3.5 text-[#D4AF37] opacity-60 transform transition-transform group-hover:translate-x-1" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Links Column 2: Support */}
          <div className="lg:col-span-3 space-y-6 text-left">
            <div className="space-y-2">
              <Headphones className="h-5 w-5 text-[#D4AF37]" />
              <h4 className="text-[#D4AF37] font-black uppercase tracking-[0.2em] text-xs pb-1 border-b border-zinc-900">Support</h4>
            </div>
            <ul className="space-y-3.5">
              {[
                { label: "Contact Us", path: "/contact" },
                { label: "FAQ", path: "/faq" },
                { label: "Shipping & Returns", path: "/shipping" },
                { label: "Size Guide", path: "/size-guide" },
                { label: "Track Order", path: "/profile" }
              ].map((link, idx) => (
                <li key={idx}>
                  <Link 
                    to={link.path} 
                    className="text-zinc-400 hover:text-white transition-colors text-xs font-bold flex items-center justify-between group py-0.5"
                  >
                    <span>{link.label}</span>
                    <ChevronRight className="h-3.5 w-3.5 text-[#D4AF37] opacity-60 transform transition-transform group-hover:translate-x-1" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Column */}
          <div className="lg:col-span-3 space-y-6 text-left">
            <div className="space-y-2">
              <MapPin className="h-5 w-5 text-[#D4AF37]" />
              <h4 className="text-[#D4AF37] font-black uppercase tracking-[0.2em] text-xs pb-1 border-b border-zinc-900">Contact</h4>
            </div>
            <ul className="space-y-5">
              <li className="flex items-center text-xs font-bold text-zinc-400 leading-normal">
                <div className="w-9 h-9 rounded-full border border-zinc-800 flex items-center justify-center text-[#D4AF37] flex-shrink-0 mr-4 shadow-md">
                  <MapPin className="h-4 w-4" />
                </div>
                <span>123 Luxury Avenue, Suite 400<br />New York, NY 10022</span>
              </li>
              <li className="flex items-center text-xs font-bold text-zinc-400">
                <div className="w-9 h-9 rounded-full border border-zinc-800 flex items-center justify-center text-[#D4AF37] flex-shrink-0 mr-4 shadow-md">
                  <Mail className="h-4 w-4" />
                </div>
                <a href="mailto:clientservices@tokiyostore.com" className="hover:text-white transition-colors">clientservices@tokiyostore.com</a>
              </li>
              <li className="flex items-center text-xs font-bold text-zinc-400">
                <div className="w-9 h-9 rounded-full border border-zinc-800 flex items-center justify-center text-[#D4AF37] flex-shrink-0 mr-4 shadow-md">
                  <Phone className="h-4 w-4" />
                </div>
                <a href="tel:+18001234567" className="hover:text-white transition-colors">+1 (800) 123-4567</a>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Copyright & Payments */}
        <div className="border-t border-zinc-900 pt-8 flex flex-col md:flex-row items-center justify-between gap-6 text-left">
          
          {/* Copyright */}
          <p className="text-zinc-500 text-xs font-bold order-3 md:order-1">
            &copy; {new Date().getFullYear()} Tokiyo Store. All rights reserved.
          </p>

          {/* Payment Gateways */}
          <div className="flex items-center gap-4 text-zinc-400 text-xs font-black tracking-widest order-1 md:order-2 opacity-80">
            <span className="font-serif italic font-bold">VISA</span>
            <div className="flex -space-x-1.5 items-center">
              <div className="w-3.5 h-3.5 rounded-full bg-zinc-500/50" />
              <div className="w-3.5 h-3.5 rounded-full bg-zinc-600/50" />
            </div>
            <span className="font-sans font-bold">AMEX</span>
            <span className="font-sans font-extrabold italic">PayPal</span>
            <span className="font-sans font-bold flex items-center gap-0.5"> Pay</span>
          </div>

          {/* Policy Links & Badge */}
          <div className="flex items-center gap-4 order-2 md:order-3 text-zinc-500 text-xs font-bold">
            <Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <span className="text-zinc-800">|</span>
            <Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
            
            {/* TK Luxury Badge Seal */}
            <div className="w-7 h-7 rounded-full border border-[#D4AF37]/50 flex items-center justify-center text-[#D4AF37] text-[8px] font-black tracking-tighter shadow ml-2 animate-pulse">
              TK
            </div>
          </div>

        </div>

      </div>
    </footer>
  );
}
