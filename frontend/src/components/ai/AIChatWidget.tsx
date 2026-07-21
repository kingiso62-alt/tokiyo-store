import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, X, Send, Bot } from "lucide-react";

export function AIChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: "ai", content: "Hi! I'm your personal AI Fashion Stylist. How can I help you put together the perfect outfit today?" }
  ]);
  const [input, setInput] = useState("");

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    setMessages([...messages, { role: "user", content: input }]);
    const currentInput = input;
    setInput("");

    // Simulate AI response
    setTimeout(() => {
      let response = "That's a great choice! I'd recommend pairing that with some dark denim or a sleek blazer.";
      if (currentInput.toLowerCase().includes("wedding")) {
        response = "For a wedding, you can't go wrong with our Italian Wool Tailored Suit. Pair it with the Oxford Leather Dress Shoes for a classic look.";
      } else if (currentInput.toLowerCase().includes("summer")) {
        response = "Summer calls for breathable fabrics. Check out our linen shirts and lightweight chinos. Want me to build a summer outfit for you?";
      }
      setMessages((prev) => [...prev, { role: "ai", content: response }]);
    }, 1000);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute bottom-16 right-0 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden flex flex-col"
            style={{ height: "500px" }}
          >
            {/* Header */}
            <div className="bg-black text-white p-4 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Bot className="h-5 w-5 text-accent" />
                <span className="font-semibold tracking-wide uppercase text-sm">AI Stylist</span>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-gray-300 hover:text-white transition-colors">
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
              {messages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm ${
                    msg.role === "user" 
                      ? "bg-black text-white rounded-tr-sm" 
                      : "bg-white text-gray-800 border border-gray-200 shadow-sm rounded-tl-sm"
                  }`}>
                    {msg.content}
                  </div>
                </div>
              ))}
            </div>

            {/* Input Area */}
            <div className="p-3 bg-white border-t border-gray-200">
              <form onSubmit={handleSend} className="relative">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask for style advice..."
                  className="w-full pl-4 pr-10 py-2 bg-gray-100 border-transparent rounded-full text-sm focus:border-black focus:ring-black focus:bg-white transition-colors"
                />
                <button 
                  type="submit"
                  disabled={!input.trim()}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-black text-white rounded-full disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-800 transition-colors"
                >
                  <Send className="h-3.5 w-3.5" />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Action Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="h-14 w-14 bg-black text-white rounded-full shadow-xl flex items-center justify-center hover:bg-gray-900 transition-colors focus:outline-none"
      >
        {isOpen ? <X className="h-6 w-6" /> : <Sparkles className="h-6 w-6 text-accent" />}
      </motion.button>
    </div>
  );
}
