import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

const POPULAR_SEARCHES = ["Tailored Suits", "Chronograph Watches", "Leather Oxfords", "Silk Ties", "Summer Collection"];
const CATEGORIES = ["Suits", "Watches", "Shoes", "Accessories", "Outerwear"];

// Mock data for live search
const MOCK_PRODUCTS = [
  { id: "1", name: "Midnight Onyx Chronograph", price: 850, image: "https://images.unsplash.com/photo-1524592094714-0f0654e20314?q=80&w=200" },
  { id: "2", name: "Italian Wool Tailored Suit", price: 1200, image: "https://images.unsplash.com/photo-1593030761757-71fae45fa0e5?q=80&w=200" },
  { id: "3", name: "Oxford Leather Brogues", price: 340, image: "https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?q=80&w=200" },
];

export function SearchOverlay({ isOpen, onClose }: SearchOverlayProps) {
  const [query, setQuery] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [results, setResults] = useState(MOCK_PRODUCTS);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => { document.body.style.overflow = "auto"; };
  }, [isOpen]);

  useEffect(() => {
    if (query.length > 1) {
      setResults(MOCK_PRODUCTS.filter(p => p.name.toLowerCase().includes(query.toLowerCase())));
    } else {
      setResults([]);
    }
  }, [query]);

  const handleVoiceSearch = () => {
    // @ts-ignore - Web Speech API
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.onstart = () => setIsListening(true);
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setQuery(transcript);
        setIsListening(false);
      };
      recognition.onerror = () => setIsListening(false);
      recognition.onend = () => setIsListening(false);
      recognition.start();
    } else {
      alert("Voice search is not supported in this browser.");
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onClose();
      navigate(`/shop?q=${encodeURIComponent(query)}`);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] bg-background/95 backdrop-blur-md overflow-y-auto"
        >
          <div className="max-w-4xl mx-auto px-4 pt-20 pb-10">
            {/* Close Button */}
            <button 
              onClick={onClose}
              className="absolute top-8 right-8 text-muted-foreground hover:text-foreground transition-colors p-2"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>

            {/* Search Input Area */}
            <form onSubmit={handleSearch} className="relative group">
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search for products, categories, or brands..."
                className="w-full bg-transparent border-b-2 border-muted-foreground/30 focus:border-primary outline-none text-2xl md:text-4xl py-4 pr-32 placeholder:text-muted-foreground/50 transition-colors"
              />
              <div className="absolute right-0 top-1/2 -translate-y-1/2 flex items-center gap-2">
                
                {/* Voice Search */}
                <button 
                  type="button" 
                  onClick={handleVoiceSearch}
                  className={`p-2 rounded-full transition-colors ${isListening ? 'bg-red-500/10 text-red-500 animate-pulse' : 'hover:bg-muted text-muted-foreground hover:text-foreground'}`}
                  title="Voice Search"
                >
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" /></svg>
                </button>
                
                {/* Image Search Placeholder */}
                <button 
                  type="button"
                  className="p-2 rounded-full transition-colors hover:bg-muted text-muted-foreground hover:text-foreground hidden sm:block"
                  title="Image Search"
                >
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                </button>
                
                {/* Ask AI Placeholder */}
                <button 
                  type="button"
                  className="p-2 rounded-full transition-colors hover:bg-muted text-muted-foreground hover:text-accent"
                  title="Ask AI"
                >
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                </button>
              </div>
            </form>

            <div className="mt-12 grid grid-cols-1 md:grid-cols-12 gap-12">
              
              {/* Left Side: Suggestions (Visible when typing) or Discover (When empty) */}
              <div className="md:col-span-4 space-y-10">
                {!query && (
                  <>
                    <div>
                      <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4">Popular Searches</h3>
                      <div className="flex flex-wrap gap-2">
                        {POPULAR_SEARCHES.map(item => (
                          <button 
                            key={item} 
                            onClick={() => { setQuery(item); inputRef.current?.focus(); }}
                            className="text-sm px-4 py-2 rounded-full border border-border hover:border-primary hover:bg-primary hover:text-primary-foreground transition-colors"
                          >
                            {item}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4">Categories</h3>
                      <ul className="space-y-3">
                        {CATEGORIES.map(cat => (
                          <li key={cat}>
                            <Link 
                              to={`/shop?category=${cat.toLowerCase()}`}
                              onClick={onClose}
                              className="text-lg font-medium hover:text-accent transition-colors flex items-center group"
                            >
                              <span className="w-4 h-[1px] bg-accent mr-3 scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
                              {cat}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </>
                )}
                {query && (
                  <div>
                     <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4">Suggestions</h3>
                     <ul className="space-y-3">
                        <li>
                          <button onClick={() => handleSearch({ preventDefault: () => {} } as any)} className="text-lg font-medium hover:text-accent transition-colors flex items-center">
                            <svg className="w-4 h-4 mr-3 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                            {query} <span className="text-muted-foreground ml-2">in Suits</span>
                          </button>
                        </li>
                        <li>
                          <button onClick={() => handleSearch({ preventDefault: () => {} } as any)} className="text-lg font-medium hover:text-accent transition-colors flex items-center">
                            <svg className="w-4 h-4 mr-3 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                            {query} <span className="text-muted-foreground ml-2">in Accessories</span>
                          </button>
                        </li>
                     </ul>
                  </div>
                )}
              </div>

              {/* Right Side: Results */}
              <div className="md:col-span-8">
                {query && (
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-6">Products ({results.length})</h3>
                    {results.length > 0 ? (
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                        {results.map(product => (
                          <Link 
                            key={product.id} 
                            to={`/product/${product.id}`}
                            onClick={onClose}
                            className="group"
                          >
                            <div className="aspect-[4/5] bg-muted mb-3 overflow-hidden">
                              <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                            </div>
                            <h4 className="text-sm font-semibold line-clamp-1">{product.name}</h4>
                            <p className="text-sm text-accent">${product.price.toFixed(2)}</p>
                          </Link>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <p className="text-muted-foreground text-lg mb-4">No products found for "{query}"</p>
                        <button 
                          onClick={() => {
                            onClose();
                            navigate('/shop');
                          }}
                          className="text-primary hover:text-accent underline font-semibold uppercase tracking-widest text-sm"
                        >
                          View All Products
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>

            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
