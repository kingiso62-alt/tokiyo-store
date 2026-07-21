import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useCartStore } from "@/store/useCartStore";
import { useAuthStore } from "@/store/useAuthStore";
import { useWishlistStore } from "@/store/useWishlistStore";
import { motion, AnimatePresence } from "framer-motion";
import { AISearchModal } from "@/components/ai/AISearchModal";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { X, ChevronDown, ChevronRight } from "lucide-react";

export function Header() {
  const location = useLocation();
  const { itemCount } = useCartStore();
  const { user } = useAuthStore();
  const wishlistCount = useWishlistStore((state) => state.items.length);
  const [showMegaMenu, setShowMegaMenu] = useState(false);
  const [isAISearchOpen, setIsAISearchOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileShopOpen, setMobileShopOpen] = useState(false);

  // Close mobile menu on route change
  const closeMobile = () => { setMobileOpen(false); setMobileShopOpen(false); };

  // Dynamic Supabase queries for database-driven Mega Menu
  const { data: dbCategories } = useQuery({
    queryKey: ["header_categories"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .eq("is_active", true);
      if (error) throw error;
      return data || [];
    }
  });

  const { data: dbCollections } = useQuery({
    queryKey: ["header_collections"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("collections")
        .select("*")
        .eq("is_active", true)
        .limit(4);
      if (error) throw error;
      return data || [];
    }
  });

  // Fallbacks if loading or empty
  const categoriesList = dbCategories && dbCategories.length > 0 ? dbCategories : [
    { name: "Suits", slug: "suits", description: "Tailored Suits" },
    { name: "Shirts", slug: "shirts", description: "Dress Shirts" },
    { name: "Trousers", slug: "trousers", description: "Formal Trousers" },
    { name: "Knitwear", slug: "knitwear", description: "Sweaters" },
    { name: "Shoes", slug: "shoes", description: "Luxury Footwear" },
    { name: "Watches", slug: "watches", description: "Luxury Timepieces" },
    { name: "Accessories", slug: "accessories", description: "Premium Belts & Ties" },
    { name: "Outerwear", slug: "outerwear", description: "Coats & Jackets" }
  ];

  const collectionsList = dbCollections && dbCollections.length > 0 ? dbCollections : [
    { name: "Summer Collection", slug: "summer" },
    { name: "Classic Essentials", slug: "classic" }
  ];

  // Grouping categories into groups
  const clothingCategories = categoriesList.filter(c =>
    ["suits", "shirts", "trousers", "knitwear", "outerwear"].includes(c.slug.toLowerCase())
  );

  const accessoryCategories = categoriesList.filter(c =>
    ["shoes", "watches", "accessories"].includes(c.slug.toLowerCase())
  );

  const navLinks = [
    { to: "/", label: "Home" },
    { to: "/collections", label: "Collections" },
    { to: "/about", label: "Our Story" },
    { to: "/blog", label: "Blog" },
    { to: "/contact", label: "Contact" },
  ];

  return (
    <>
      <header className="fixed top-0 inset-x-0 z-[100] w-full bg-[#080808]/95 backdrop-blur-md border-b border-zinc-900 py-3 shadow-[0_4px_30px_rgba(0,0,0,0.5)] text-white transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">

            {/* Mobile Menu Button */}
            <div className="flex-1 md:hidden">
              <button
                onClick={() => setMobileOpen(true)}
                className="text-zinc-300 p-2 -ml-2 hover:text-[#D4AF37] transition-colors"
                aria-label="Open Menu"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>
              </button>
            </div>

            {/* Logo */}
            <div className="flex-shrink-0 flex items-center md:flex-1">
              <Link to="/" onClick={closeMobile} className="flex items-center space-x-3 transition-all hover:scale-[1.02] group">
                <img
                  src="/logo.png"
                  alt="Tokiyo Luxury Logo"
                  className="h-10 w-10 object-cover rounded-lg border border-zinc-800 group-hover:border-[#D4AF37] shadow-[0_0_15px_rgba(212,175,55,0.1)] group-hover:shadow-[0_0_20px_rgba(212,175,55,0.25)] transition-all duration-500"
                />
                <span className="font-extrabold text-lg tracking-[0.25em] uppercase text-white font-sans">
                  Tokiyo
                </span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex flex-1 justify-center items-center space-x-6 lg:space-x-8">
              <Link to="/" className="text-[11px] font-extrabold uppercase tracking-widest transition-colors text-zinc-300 hover:text-white relative group py-1 whitespace-nowrap">
                Home
                <span className="absolute bottom-0 left-0 w-full h-[1.5px] bg-[#D4AF37] transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300" />
              </Link>

              <Link
                to="/shop"
                className="text-[11px] font-extrabold uppercase tracking-widest transition-colors text-zinc-300 hover:text-white relative group py-1 whitespace-nowrap"
                onMouseEnter={() => setShowMegaMenu(true)}
                onMouseLeave={() => setShowMegaMenu(false)}
              >
                <span className="flex items-center gap-1">Shop</span>
                <span className="absolute bottom-0 left-0 w-full h-[1.5px] bg-[#D4AF37] transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300" />

                {/* Mega Menu Dropdown */}
                <AnimatePresence>
                  {showMegaMenu && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute top-full left-0 w-full bg-[#0a0a0a]/98 border-t border-zinc-900 shadow-[0_20px_50px_rgba(0,0,0,0.8)] p-8 cursor-default text-white z-50"
                    >
                      <div className="max-w-7xl mx-auto grid grid-cols-4 gap-8 text-left">
                        {/* Apparel Category List */}
                        <div>
                          <h3 className="text-[#D4AF37] font-extrabold text-xs uppercase tracking-widest mb-4 border-b border-zinc-800 pb-2">Clothing / Dharka</h3>
                          <ul className="space-y-2">
                            {clothingCategories.map((c: any) => (
                              <li key={c.slug}>
                                <Link to={`/shop?category=${c.slug}`} className="text-zinc-400 hover:text-white transition-colors text-xs font-semibold block py-0.5 capitalize">
                                  {c.name}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Accessories Category List */}
                        <div>
                          <h3 className="text-[#D4AF37] font-extrabold text-xs uppercase tracking-widest mb-4 border-b border-zinc-800 pb-2">Accessories / Agabka</h3>
                          <ul className="space-y-2">
                            {accessoryCategories.map((c: any) => (
                              <li key={c.slug}>
                                <Link to={`/shop?category=${c.slug}`} className="text-zinc-400 hover:text-white transition-colors text-xs font-semibold block py-0.5 capitalize">
                                  {c.name}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Collections List */}
                        <div>
                          <h3 className="text-[#D4AF37] font-extrabold text-xs uppercase tracking-widest mb-4 border-b border-zinc-800 pb-2">Collections / Xulashada</h3>
                          <ul className="space-y-2">
                            {collectionsList.map((col: any) => (
                              <li key={col.slug}>
                                <Link to={`/shop?collection=${col.slug}`} className="text-zinc-400 hover:text-white transition-colors text-xs font-semibold block py-0.5 capitalize">
                                  {col.name}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Image Showcase */}
                        <div className="relative h-48 rounded-lg overflow-hidden group border border-zinc-900 shadow-md">
                          <img src="https://images.unsplash.com/photo-1594938298603-c8148c4dae35?q=80&w=800" loading="lazy" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" alt="Collection Showcase" />
                          <div className="absolute inset-0 bg-black/60" />
                          <div className="absolute inset-0 p-5 flex flex-col justify-end">
                            <h3 className="text-white font-extrabold uppercase tracking-widest text-base mb-1">New Arrivals</h3>
                            <Link to="/shop" className="text-[#D4AF37] text-[10px] font-extrabold uppercase tracking-wider hover:underline">Shop Latest Look</Link>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </Link>

              <Link to="/collections" className="text-[11px] font-extrabold uppercase tracking-widest transition-colors text-zinc-300 hover:text-white relative group py-1 whitespace-nowrap">
                Collections
                <span className="absolute bottom-0 left-0 w-full h-[1.5px] bg-[#D4AF37] transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300" />
              </Link>
              <Link to="/about" className="text-[11px] font-extrabold uppercase tracking-widest transition-colors text-zinc-300 hover:text-white relative group py-1 whitespace-nowrap">
                Our Story
                <span className="absolute bottom-0 left-0 w-full h-[1.5px] bg-[#D4AF37] transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300" />
              </Link>
              <Link to="/blog" className="text-[11px] font-extrabold uppercase tracking-widest transition-colors text-zinc-300 hover:text-white relative group py-1 whitespace-nowrap">
                Blog
                <span className="absolute bottom-0 left-0 w-full h-[1.5px] bg-[#D4AF37] transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300" />
              </Link>
              <Link to="/contact" className="text-[11px] font-extrabold uppercase tracking-widest transition-colors text-zinc-300 hover:text-white relative group py-1 whitespace-nowrap">
                Contact
                <span className="absolute bottom-0 left-0 w-full h-[1.5px] bg-[#D4AF37] transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300" />
              </Link>
            </nav>

            {/* Icons & Actions */}
            <div className="flex items-center justify-end flex-1 space-x-5">
              <button
                onClick={() => setIsAISearchOpen(true)}
                className="hover:text-[#D4AF37] transition-all text-zinc-300 hover:scale-105 active:scale-95"
                aria-label="Search"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
              </button>
              <Link
                to={user ? "/profile" : "/login"}
                className="hover:text-[#D4AF37] transition-all text-zinc-300 hover:scale-105 active:scale-95"
                aria-label="User Account"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
              </Link>
              <Link
                to="/wishlist"
                className="hover:text-[#D4AF37] transition-all relative text-zinc-300 hover:scale-105 active:scale-95"
                aria-label="Wishlist"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
                {wishlistCount > 0 && (
                  <span className="absolute -top-2 -right-2 flex h-4 w-4 items-center justify-center rounded-full bg-[#D4AF37] text-[8px] font-black text-black border border-[#080808]">
                    {wishlistCount}
                  </span>
                )}
              </Link>
              <Link
                to="/cart"
                className="hover:text-[#D4AF37] transition-all relative text-zinc-300 hover:scale-105 active:scale-95"
                aria-label="Cart"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
                {itemCount > 0 && (
                  <span className="absolute -top-2 -right-2 flex h-4 w-4 items-center justify-center rounded-full bg-[#D4AF37] text-[8px] font-black text-black border border-[#080808]">
                    {itemCount}
                  </span>
                )}
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* ============ MOBILE DRAWER MENU ============ */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/70 z-[200] md:hidden"
              onClick={closeMobile}
            />

            {/* Drawer */}
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 280 }}
              className="fixed top-0 left-0 h-full w-[82%] max-w-sm bg-[#080808] z-[201] md:hidden flex flex-col shadow-[4px_0_40px_rgba(0,0,0,0.8)] border-r border-zinc-900 overflow-y-auto"
            >
              {/* Drawer Header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-900">
                <Link to="/" onClick={closeMobile} className="flex items-center space-x-2.5">
                  <img src="/logo.png" alt="Tokiyo" className="h-9 w-9 object-cover rounded-lg border border-zinc-800" />
                  <span className="font-extrabold text-base tracking-[0.2em] uppercase text-white">Tokiyo</span>
                </Link>
                <button
                  onClick={closeMobile}
                  className="p-2 rounded-full bg-zinc-900 hover:bg-zinc-800 transition-colors text-zinc-400 hover:text-white"
                  aria-label="Close Menu"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Gold divider */}
              <div className="h-[1px] bg-gradient-to-r from-transparent via-[#D4AF37]/50 to-transparent" />

              {/* Nav Links */}
              <nav className="flex-1 px-4 py-6 space-y-1">

                {/* Home */}
                {navLinks.map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    onClick={closeMobile}
                    className={`flex items-center justify-between w-full px-4 py-3.5 rounded-xl text-sm font-bold uppercase tracking-widest transition-all ${
                      location.pathname === link.to
                        ? "bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/20"
                        : "text-zinc-300 hover:bg-zinc-900 hover:text-white"
                    }`}
                  >
                    {link.label}
                    <ChevronRight className="h-4 w-4 opacity-40" />
                  </Link>
                ))}

                {/* Shop — Expandable */}
                <div>
                  <button
                    onClick={() => setMobileShopOpen(!mobileShopOpen)}
                    className={`flex items-center justify-between w-full px-4 py-3.5 rounded-xl text-sm font-bold uppercase tracking-widest transition-all ${
                      location.pathname === "/shop"
                        ? "bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/20"
                        : "text-zinc-300 hover:bg-zinc-900 hover:text-white"
                    }`}
                  >
                    Shop
                    <ChevronDown className={`h-4 w-4 opacity-60 transition-transform duration-200 ${mobileShopOpen ? "rotate-180" : ""}`} />
                  </button>

                  <AnimatePresence>
                    {mobileShopOpen && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.22 }}
                        className="overflow-hidden"
                      >
                        <div className="mt-2 ml-4 space-y-4 pb-2">
                          {/* Clothing */}
                          <div>
                            <p className="text-[10px] font-extrabold uppercase tracking-widest text-[#D4AF37] mb-2 px-3">Clothing</p>
                            {clothingCategories.map((c: any) => (
                              <Link
                                key={c.slug}
                                to={`/shop?category=${c.slug}`}
                                onClick={closeMobile}
                                className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-zinc-400 hover:text-white hover:bg-zinc-900 transition-all capitalize font-medium"
                              >
                                <span className="w-1 h-1 rounded-full bg-[#D4AF37] flex-shrink-0" />
                                {c.name}
                              </Link>
                            ))}
                          </div>
                          {/* Accessories */}
                          <div>
                            <p className="text-[10px] font-extrabold uppercase tracking-widest text-[#D4AF37] mb-2 px-3">Accessories</p>
                            {accessoryCategories.map((c: any) => (
                              <Link
                                key={c.slug}
                                to={`/shop?category=${c.slug}`}
                                onClick={closeMobile}
                                className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-zinc-400 hover:text-white hover:bg-zinc-900 transition-all capitalize font-medium"
                              >
                                <span className="w-1 h-1 rounded-full bg-[#D4AF37] flex-shrink-0" />
                                {c.name}
                              </Link>
                            ))}
                          </div>
                          {/* Collections */}
                          <div>
                            <p className="text-[10px] font-extrabold uppercase tracking-widest text-[#D4AF37] mb-2 px-3">Collections</p>
                            {collectionsList.map((col: any) => (
                              <Link
                                key={col.slug}
                                to={`/shop?collection=${col.slug}`}
                                onClick={closeMobile}
                                className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-zinc-400 hover:text-white hover:bg-zinc-900 transition-all capitalize font-medium"
                              >
                                <span className="w-1 h-1 rounded-full bg-[#D4AF37] flex-shrink-0" />
                                {col.name}
                              </Link>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </nav>

              {/* Drawer Footer */}
              <div className="px-5 py-5 border-t border-zinc-900 space-y-3">
                <Link
                  to={user ? "/profile" : "/login"}
                  onClick={closeMobile}
                  className="flex items-center gap-3 w-full px-4 py-3 rounded-xl bg-[#D4AF37] text-black font-extrabold text-sm uppercase tracking-widest hover:bg-[#c9a227] transition-all"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                  {user ? "My Account" : "Sign In"}
                </Link>
                <div className="flex gap-3">
                  <Link to="/wishlist" onClick={closeMobile} className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700 text-xs font-bold uppercase tracking-widest transition-all">
                    Wishlist {wishlistCount > 0 && <span className="bg-[#D4AF37] text-black rounded-full text-[9px] font-black px-1.5 py-0.5">{wishlistCount}</span>}
                  </Link>
                  <Link to="/cart" onClick={closeMobile} className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700 text-xs font-bold uppercase tracking-widest transition-all">
                    Cart {itemCount > 0 && <span className="bg-[#D4AF37] text-black rounded-full text-[9px] font-black px-1.5 py-0.5">{itemCount}</span>}
                  </Link>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* AI Search Modal */}
      <AISearchModal isOpen={isAISearchOpen} onClose={() => setIsAISearchOpen(false)} />
    </>
  );
}
