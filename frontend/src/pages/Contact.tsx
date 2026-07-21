import { useState } from "react";
import { Mail, Phone, MapPin, Send, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";

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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 font-sans">
      <div className="text-center max-w-2xl mx-auto mb-16">
        <h1 className="text-3xl sm:text-4xl font-extrabold uppercase tracking-widest text-gray-900 mb-4">
          Contact Us / Nala Soo Xiriir
        </h1>
        <p className="text-gray-500">
          Waxaan halkan u joognaa inaan kaa caawino wixii su'aalo ama faahfaahin ah oo aad u baahan tahay.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        {/* Contact Info */}
        <div className="space-y-8">
          <div>
            <h2 className="text-xl font-bold uppercase tracking-wider text-gray-900 mb-6">Store Details</h2>
            <p className="text-gray-600 leading-relaxed mb-6">
              Booqo xaruntayada dhexe ee dukaamaysiga ama nagala soo xiriir khadka telefoonka ama email-ka hoos ku qoran.
            </p>
          </div>

          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                <MapPin className="h-5 w-5 text-gray-700" />
              </div>
              <div>
                <p className="font-bold text-gray-900 uppercase text-xs tracking-wider">Address / Ciwaanka</p>
                <p className="text-gray-600 text-sm mt-1">123 Luxury Avenue, Mogadishu, Somalia</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Phone className="h-5 w-5 text-gray-700" />
              </div>
              <div>
                <p className="font-bold text-gray-900 uppercase text-xs tracking-wider">Phone / Telefoon</p>
                <p className="text-gray-600 text-sm mt-1">+252 61 1234567</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Mail className="h-5 w-5 text-gray-700" />
              </div>
              <div>
                <p className="font-bold text-gray-900 uppercase text-xs tracking-wider">Email</p>
                <p className="text-gray-600 text-sm mt-1">clientservices@tokiyostore.com</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center flex-shrink-0">
                <MessageSquare className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="font-bold text-green-800 uppercase text-xs tracking-wider">WhatsApp</p>
                <p className="text-gray-600 text-sm mt-1">+252 61 1234567</p>
              </div>
            </div>
          </div>
        </div>

        {/* Message Form */}
        <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-lg">
          <h2 className="text-lg font-bold uppercase tracking-wider text-gray-900 mb-6">Send a Message</h2>
          {sent && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-800 rounded-xl text-sm">
              Farriintaada si guul leh ayaa loo diray! Waxaan kugu soo jawaabi doonaa 24 saac gudahood.
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1 uppercase tracking-wider">Full Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full border border-gray-300 rounded-lg py-2.5 px-3 text-sm focus:ring-2 focus:ring-black focus:border-black outline-none"
                placeholder="Magacaaga oo dhamaystiran"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1 uppercase tracking-wider">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-gray-300 rounded-lg py-2.5 px-3 text-sm focus:ring-2 focus:ring-black focus:border-black outline-none"
                placeholder="ciwaan@email.com"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1 uppercase tracking-wider">Message</label>
              <textarea
                rows={5}
                required
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full border border-gray-300 rounded-lg py-2.5 px-3 text-sm focus:ring-2 focus:ring-black focus:border-black outline-none"
                placeholder="Ku qor farriintaada halkan..."
              />
            </div>
            <Button
              type="submit"
              className="w-full h-12 rounded-none bg-black text-white hover:bg-gray-800 uppercase tracking-widest text-xs font-bold gap-2"
            >
              <Send className="h-4 w-4" /> Send Message
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
