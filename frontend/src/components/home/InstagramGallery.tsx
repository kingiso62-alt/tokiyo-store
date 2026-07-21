import { motion } from "framer-motion";
import { Heart, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";

const instagramPosts = [
  { 
    image: "https://images.unsplash.com/photo-1617137968427-85924c800a22?q=80&w=400", 
    likes: "1.2k", 
    comments: "89" 
  },
  { 
    image: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?q=80&w=400", 
    likes: "2.1k", 
    comments: "113" 
  },
  { 
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=400", 
    likes: "1.8k", 
    comments: "75" 
  },
  { 
    image: "https://images.unsplash.com/photo-1620012253295-c15bc3e6590d?q=80&w=400", 
    likes: "1.5k", 
    comments: "64" 
  },
  { 
    image: "https://images.unsplash.com/photo-1593030761757-71fae45fa0e5?q=80&w=400", 
    likes: "1.3k", 
    comments: "58" 
  }
];

export function InstagramGallery() {
  return (
    <section className="py-24 bg-[#050505] text-white border-t border-zinc-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Editorial Section Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-4">
            <div className="w-10 h-[1px] bg-zinc-800" />
            <svg className="w-6 h-6 text-[#D4AF37]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
              <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
            </svg>
            <div className="w-10 h-[1px] bg-zinc-800" />
          </div>

          <h2 className="text-3xl md:text-4xl font-black uppercase tracking-widest leading-none text-white font-sans">
            @Tokiyo<span className="text-[#D4AF37]">Store</span>
          </h2>
          
          <p className="text-zinc-400 text-sm font-medium">
            Follow us on Instagram for daily inspiration
          </p>
        </div>

        {/* Grid layout (5 Columns of portrait items) */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5">
          {instagramPosts.map((post, index) => (
            <motion.a
              key={index}
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
              className="relative group aspect-[4/5] overflow-hidden bg-zinc-950 rounded-xl block border border-zinc-900 shadow-lg hover:border-zinc-800 transition-all hover:scale-[1.02] duration-300"
            >
              <img 
                src={post.image} 
                alt="Instagram post showcase" 
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-80 group-hover:opacity-100"
              />
              
              {/* Gold Circular Instagram icon overlay (Top Right) */}
              <div className="absolute top-3 right-3 z-10 w-7 h-7 rounded-full bg-black/60 backdrop-blur-sm border border-zinc-800/80 flex items-center justify-center text-[#D4AF37] shadow group-hover:bg-[#D4AF37] group-hover:text-black group-hover:border-transparent transition-all duration-350">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                </svg>
              </div>

              {/* Likes & Comments pill overlay (Bottom Left) */}
              <div className="absolute bottom-3 left-3 z-10 bg-black/65 backdrop-blur-md px-3 py-1 rounded-full flex items-center gap-3.5 text-[10px] font-black text-zinc-300 border border-zinc-900 shadow">
                <span className="flex items-center gap-1">
                  <Heart className="h-3.5 w-3.5 text-zinc-400 fill-zinc-400" />
                  {post.likes}
                </span>
                <span className="flex items-center gap-1">
                  <MessageSquare className="h-3.5 w-3.5 text-zinc-400 fill-zinc-400" />
                  {post.comments}
                </span>
              </div>
            </motion.a>
          ))}
        </div>

        {/* View on Instagram button */}
        <div className="text-center pt-4">
          <Button variant="outline" size="lg" asChild className="rounded-none border-[#D4AF37] text-white hover:bg-[#D4AF37] hover:text-black font-black uppercase tracking-widest px-10 h-12 transition-all duration-350 bg-transparent">
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
              <svg className="w-4 h-4 text-[#D4AF37] group-hover:text-black transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
              </svg>
              <span>View More on Instagram</span>
              <span>→</span>
            </a>
          </Button>
        </div>

      </div>
    </section>
  );
}
