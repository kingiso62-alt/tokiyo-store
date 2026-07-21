import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, TrendingUp, Clock, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

interface AISearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const TRENDING = ["Linen Suits", "Summer Chronograph", "Oxford Shoes", "Silk Ties"];
const RECENTLY_VIEWED = [
  { id: 1, name: "Midnight Onyx Chronograph", price: 850, image: "https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=100&q=80" },
  { id: 2, name: "Italian Wool Tailored Suit", price: 1200, image: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=100&q=80" }
];

export function AISearchModal({ isOpen, onClose }: AISearchModalProps) {
  const [query, setQuery] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    if (query) {
      setIsTyping(true);
      const timer = setTimeout(() => setIsTyping(false), 800);
      return () => clearTimeout(timer);
    }
  }, [query]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
        />
        
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl overflow-hidden"
        >
          {/* Search Input Area */}
          <div className="relative border-b border-gray-200 bg-white px-4 py-4 sm:px-6">
            <div className="flex items-center">
              <Sparkles className="h-6 w-6 text-accent mr-3" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search products, brands, or ask for a style suggestion..."
                className="w-full bg-transparent border-none focus:ring-0 text-lg sm:text-xl text-gray-900 placeholder-gray-400 p-0"
                autoFocus
              />
              <button onClick={onClose} className="ml-3 text-gray-400 hover:text-gray-600">
                <X className="h-6 w-6" />
              </button>
            </div>
          </div>

          {/* Results / Default State Area */}
          <div className="bg-gray-50 px-4 py-8 sm:px-6 h-96 overflow-y-auto">
            {!query ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Trending */}
                <div>
                  <h3 className="flex items-center text-sm font-semibold text-gray-900 uppercase tracking-widest mb-4">
                    <TrendingUp className="h-4 w-4 mr-2 text-black" />
                    Trending Now
                  </h3>
                  <ul className="space-y-3">
                    {TRENDING.map((term, idx) => (
                      <li key={idx}>
                        <button 
                          onClick={() => setQuery(term)}
                          className="text-gray-600 hover:text-black hover:underline transition-colors text-lg"
                        >
                          {term}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Recently Viewed */}
                <div>
                  <h3 className="flex items-center text-sm font-semibold text-gray-900 uppercase tracking-widest mb-4">
                    <Clock className="h-4 w-4 mr-2 text-black" />
                    Recently Viewed
                  </h3>
                  <div className="space-y-4">
                    {RECENTLY_VIEWED.map((product) => (
                      <Link 
                        key={product.id} 
                        to={`/product/${product.id}`}
                        onClick={onClose}
                        className="flex items-center group"
                      >
                        <div className="h-14 w-14 rounded-md overflow-hidden bg-gray-200">
                          <img src={product.image} alt={product.name} className="h-full w-full object-cover group-hover:scale-105 transition-transform" />
                        </div>
                        <div className="ml-4">
                          <p className="text-sm font-medium text-gray-900 group-hover:underline">{product.name}</p>
                          <p className="text-sm text-gray-500">${product.price}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            ) : isTyping ? (
              <div className="flex flex-col items-center justify-center h-full space-y-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
                <p className="text-gray-500 animate-pulse">AI is searching and styling for you...</p>
              </div>
            ) : (
              <div className="text-center pt-10">
                <p className="text-gray-900 text-lg mb-2">Here's what AI found for "<span className="font-semibold">{query}</span>"</p>
                <p className="text-gray-500">Showing smart recommendations...</p>
                {/* Mock Search Results would render here */}
              </div>
            )}
          </div>
          
          <div className="bg-black px-4 py-3 sm:px-6 flex items-center justify-center">
            <p className="text-xs text-gray-300 flex items-center">
              Powered by <Sparkles className="h-3 w-3 mx-1 text-accent" /> Tokiyo AI Search
            </p>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
