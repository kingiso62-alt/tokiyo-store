import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";

export function FAQ() {
  const faqs = [
    {
      q_en: "How long does shipping take?",
      q_so: "Intee in le'eg ayay qaadataa raridda alaabta?",
      a_en: "Shipping takes 24 hours within Mogadishu. For other regions in Somalia, it takes 3-5 days. International orders are delivered in 5-10 business days.",
      a_so: "Rarista dhexdeeda Muqdisho waxay qaadataa 24 saac. Gobolada kale ee dalka waa 3-5 maalmood. Dalabaadka dibadda ee caalamiga ahna waxay qaataan 5-10 maalmood oo shaqo."
    },
    {
      q_en: "What payment methods are supported?",
      q_so: "Waa maxay hababka lacag bixinta ee aad aqbashaan?",
      a_en: "We support local mobile money (EVC Plus, Zaad, Sahal, eDahab, Jeeb), international cards (Visa, Mastercard, Stripe), PayPal, and Cash on Delivery.",
      a_so: "Waxaan aqbalnaa lacagaha maxalliga ah (EVC Plus, Zaad, Sahal, eDahab, Jeeb), kaararka caalamiga ah (Visa, Mastercard, Stripe), PayPal, iyo Lacag bixinta marka alaabta la keeno (COD)."
    },
    {
      q_en: "How can I track my order status?",
      q_so: "Sidee ula socon karaa halka uu dalabkaygu marayo?",
      a_en: "After placing an order, you will receive an Order ID. Go to the Track Order page or your Account Profile to view real-time status updates from our logistics team.",
      a_so: "Markaad dalabka sameyso, waxaad heleysaa lambar aqoonsi (Order ID). Tag bogga dabagalka dalabka ama qaybta profile-kaaga si aad u aragto halka uu marayo dalabkaaga."
    },
    {
      q_en: "Can I return an item if it doesn't fit?",
      q_so: "Ma celin karaa alaabta haddii ay cabbir ahaan igu weynaato ama igu yaraato?",
      a_en: "Yes, we accept returns within 14 days of delivery. The item must be unworn, in its original packaging, and with tags attached. Clearance items are final sale.",
      a_so: "Haa, waxaan aqbalnaa in alaabta dib loo soo celiyo 14 maalmood gudahood. Waa in alaabtu aysan xirnayn oo tags-kii ay ku dheggan yihiin."
    },
    {
      q_en: "How does the AI Outfit Builder work?",
      q_so: "Sidee u shaqeeyaa AI Outfit Builder?",
      a_en: "Simply type the event or style you want (e.g., 'Wedding suit' or 'Summer beach shirts') in the AI chat widget, and our algorithm will suggest matching suits, shirts, watches, and shoes dynamically.",
      a_so: "Kaliya ku qor waxa aad rabto (tusaale: 'Suut aroos' ama 'Shaati xagaaga') sanduuqa AI-ga, wuxuuna si toos ah kuugu soo doorayaa dhar isu dhigma oo wada socda."
    }
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-16 font-sans leading-relaxed">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-extrabold uppercase tracking-widest text-gray-900 mb-4">
          Frequently Asked Questions / Su'aalaha Badanaa La Weydiiyo
        </h1>
        <p className="text-gray-500">
          Halkan ka heli jawaabaha su'aalaha ugu muhiimsan ee ku saabsan dukaankayaga.
        </p>
      </div>

      <Accordion type="single" collapsible className="w-full space-y-4">
        {faqs.map((faq, index) => (
          <AccordionItem key={index} value={`faq-${index}`} className="border border-gray-200 px-5 rounded-xl bg-white shadow-sm">
            <AccordionTrigger className="hover:no-underline py-4 text-left">
              <div>
                <p className="font-bold text-gray-900 text-sm sm:text-base">{faq.q_en}</p>
                <p className="text-xs text-gray-500 font-medium mt-1 font-sans">{faq.q_so}</p>
              </div>
            </AccordionTrigger>
            <AccordionContent className="pb-5 pt-1 text-gray-700 text-sm leading-relaxed border-t border-gray-100 mt-2">
              <p className="mb-3">{faq.a_en}</p>
              <p className="text-gray-500 font-medium border-l-2 border-gray-300 pl-3">{faq.a_so}</p>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
