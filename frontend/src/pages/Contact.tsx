import { useState } from "react";
import { Mail, Phone, MapPin, Send, MessageSquare } from "lucide-react";
import { motion } from "framer-motion";

export function Contact() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
    setName("");
    setEmail("");
    setMessage("");
    setTimeout(() => setSent(false), 4000);
  };

  return (
    <div className="bg-[#040404] min-h-screen text-white pt-32 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-[#D4AF37] text-xs font-extrabold uppercase tracking-[0.4em] mb-4">Get In Touch</p>
            <h1 className="text-5xl md:text-6xl font-black uppercase tracking-tight mb-5 text-white">
              CONTACT US
            </h1>
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="h-[1px] w-16 bg-[#D4AF37]/50" />
              <div className="w-2 h-2 border border-[#D4AF37] rotate-45" />
              <div className="h-[1px] w-16 bg-[#D4AF37]/50" />
            </div>
            <p className="text-zinc-400 text-sm max-w-xl mx-auto leading-relaxed">
              We're here to help. Reach out to us and our team will get back to you as soon as possible.
            </p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          
          {/* Contact Details */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-10"
          >
            <div>
              <h2 className="text-xl font-extrabold uppercase tracking-widest text-[#D4AF37] mb-4">Store Details</h2>
              <div className="h-[2px] w-10 bg-[#D4AF37] mb-6" />
              <p className="text-zinc-400 leading-relaxed text-sm">
                Discover our collections, offer personalized styling advice, and experience the TOKIYO standard in person.
              </p>
            </div>

            <div className="space-y-6">
              <div className="flex items-center gap-5 group">
                <div className="w-12 h-12 rounded-full border border-zinc-800 flex items-center justify-center flex-shrink-0 group-hover:border-[#D4AF37]/50 transition-colors">
                  <MapPin className="h-5 w-5 text-[#D4AF37]" />
                </div>
                <div>
                  <p className="font-extrabold text-[#D4AF37] uppercase text-[10px] tracking-widest">Address / Ciwaanka</p>
                  <p className="text-zinc-300 text-sm mt-1">123 Luxury Avenue, Mogadishu, Somalia</p>
                </div>
              </div>

              <div className="flex items-center gap-5 group">
                <div className="w-12 h-12 rounded-full border border-zinc-800 flex items-center justify-center flex-shrink-0 group-hover:border-[#D4AF37]/50 transition-colors">
                  <Phone className="h-5 w-5 text-[#D4AF37]" />
                </div>
                <div>
                  <p className="font-extrabold text-[#D4AF37] uppercase text-[10px] tracking-widest">Phone / Telefoon</p>
                  <p className="text-zinc-300 text-sm mt-1">+252 61 1234567</p>
                </div>
              </div>

              <div className="flex items-center gap-5 group">
                <div className="w-12 h-12 rounded-full border border-zinc-800 flex items-center justify-center flex-shrink-0 group-hover:border-[#D4AF37]/50 transition-colors">
                  <Mail className="h-5 w-5 text-[#D4AF37]" />
                </div>
                <div>
                  <p className="font-extrabold text-[#D4AF37] uppercase text-[10px] tracking-widest">Email</p>
                  <p className="text-zinc-300 text-sm mt-1">clientservices@tokiyostore.com</p>
                </div>
              </div>

              <div className="flex items-center gap-5 group">
                <div className="w-12 h-12 rounded-full border border-zinc-800 flex items-center justify-center flex-shrink-0 group-hover:border-[#D4AF37]/50 transition-colors">
                  <MessageSquare className="h-5 w-5 text-green-500" />
                </div>
                <div>
                  <p className="font-extrabold text-green-500 uppercase text-[10px] tracking-widest">WhatsApp</p>
                  <p className="text-zinc-300 text-sm mt-1">+252 61 1234567</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-[#080808] border border-zinc-900 rounded-2xl p-8 shadow-2xl hover:border-[#D4AF37]/20 transition-all duration-300"
          >
            <h2 className="text-lg font-extrabold uppercase tracking-widest text-[#D4AF37] mb-6">Send a Message</h2>
            
            {sent && (
              <div className="mb-6 p-4 bg-green-950/40 border border-green-800/50 text-green-400 rounded-xl text-xs font-bold uppercase tracking-wider">
                Farriintaada si guul leh ayaa loo diray! Waxaan kugu soo jawaabi doonaa 24 saac gudahood.
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-[10px] font-extrabold text-zinc-400 mb-2 uppercase tracking-widest">Full Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-[#040404] border border-zinc-800 rounded-xl py-3 px-4 text-sm text-white placeholder-zinc-600 focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] outline-none transition-all"
                  placeholder="Your full name"
                />
              </div>

              <div>
                <label className="block text-[10px] font-extrabold text-zinc-400 mb-2 uppercase tracking-widest">Email Address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#040404] border border-zinc-800 rounded-xl py-3 px-4 text-sm text-white placeholder-zinc-600 focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] outline-none transition-all"
                  placeholder="youremail@example.com"
                />
              </div>

              <div>
                <label className="block text-[10px] font-extrabold text-zinc-400 mb-2 uppercase tracking-widest">Message</label>
                <textarea
                  rows={5}
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full bg-[#040404] border border-zinc-800 rounded-xl py-3 px-4 text-sm text-white placeholder-zinc-600 focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] outline-none transition-all resize-none"
                  placeholder="How can we help you?"
                />
              </div>

              <button
                type="submit"
                className="w-full py-4 bg-[#D4AF37] text-black font-extrabold text-xs uppercase tracking-[0.25em] rounded-xl hover:bg-[#c9a227] transition-all flex items-center justify-center gap-2.5 active:scale-[0.98]"
              >
                <Send className="h-4 w-4" /> Send Message
              </button>
            </form>
          </motion.div>

        </div>

      </div>
    </div>
  );
}
