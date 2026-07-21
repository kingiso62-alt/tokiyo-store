import { useState } from "react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function PaymentMethodSelector({ onMethodChange }: { onMethodChange?: (method: string) => void }) {
  const [selectedMethod, setSelectedMethod] = useState("evc");

  const handleChange = (value: string) => {
    setSelectedMethod(value);
    onMethodChange?.(value);
  };

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-bold uppercase tracking-widest mb-4">Payment Method</h3>
      
      <Accordion type="single" value={selectedMethod} onValueChange={handleChange} className="w-full space-y-4">
        
        {/* Mobile Money (Somalia) */}
        <AccordionItem value="evc" className="border border-border bg-background px-4">
          <AccordionTrigger className="hover:no-underline py-4">
            <div className="flex items-center gap-4">
              <input type="radio" checked={selectedMethod === "evc"} readOnly className="accent-primary w-4 h-4" />
              <span className="font-bold uppercase text-sm">Mobile Money (EVC Plus, Zaad, Sahal)</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="pb-6">
            <div className="pl-8 space-y-4">
              <p className="text-sm text-muted-foreground">Pay instantly using your local mobile money provider.</p>
              
              <div className="flex gap-4 mb-4">
                {['EVC Plus', 'Zaad', 'Sahal', 'eDahab', 'Jeeb'].map(provider => (
                  <div key={provider} className="text-xs font-bold uppercase bg-secondary px-3 py-1 text-muted-foreground">
                    {provider}
                  </div>
                ))}
              </div>

              <div className="space-y-2 max-w-sm">
                <Label htmlFor="phone">Phone Number</Label>
                <div className="flex gap-2">
                  <div className="bg-secondary flex items-center px-3 border border-border text-sm">+252</div>
                  <Input id="phone" placeholder="61 XXXXXXX" className="flex-1" />
                </div>
                <p className="text-xs text-muted-foreground mt-1">You will receive a prompt on your phone to enter your PIN.</p>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Credit / Debit Card */}
        <AccordionItem value="card" className="border border-border bg-background px-4">
          <AccordionTrigger className="hover:no-underline py-4">
            <div className="flex items-center justify-between w-full pr-4">
              <div className="flex items-center gap-4">
                <input type="radio" checked={selectedMethod === "card"} readOnly className="accent-primary w-4 h-4" />
                <span className="font-bold uppercase text-sm">Credit / Debit Card</span>
              </div>
              <div className="flex gap-2 opacity-50 hidden sm:flex">
                <svg className="w-8 h-5" viewBox="0 0 24 24" fill="currentColor"><rect width="24" height="16" y="4" rx="2" /><path fill="#fff" d="M2 10h20v4H2z" /></svg>
              </div>
            </div>
          </AccordionTrigger>
          <AccordionContent className="pb-6">
            <div className="pl-8 space-y-4 max-w-md">
               <div className="space-y-2">
                 <Label>Card Number</Label>
                 <Input placeholder="0000 0000 0000 0000" />
               </div>
               <div className="grid grid-cols-2 gap-4">
                 <div className="space-y-2">
                   <Label>Expiration Date</Label>
                   <Input placeholder="MM / YY" />
                 </div>
                 <div className="space-y-2">
                   <Label>CVC</Label>
                   <Input placeholder="123" />
                 </div>
               </div>
               <div className="space-y-2">
                 <Label>Name on Card</Label>
                 <Input placeholder="John Doe" />
               </div>
               <p className="text-xs text-muted-foreground pt-2">Payments are securely processed by Stripe.</p>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Digital Wallets */}
        <AccordionItem value="wallet" className="border border-border bg-background px-4">
          <AccordionTrigger className="hover:no-underline py-4">
            <div className="flex items-center gap-4">
              <input type="radio" checked={selectedMethod === "wallet"} readOnly className="accent-primary w-4 h-4" />
              <span className="font-bold uppercase text-sm">Digital Wallets</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="pb-6">
            <div className="pl-8 space-y-3 max-w-sm">
              <button className="w-full h-12 bg-[#FFC439] hover:bg-[#F4BB33] transition-colors rounded-sm flex items-center justify-center">
                 <span className="font-bold text-[#003087] italic">PayPal</span>
              </button>
              <button className="w-full h-12 bg-black hover:bg-black/90 transition-colors rounded-sm flex items-center justify-center text-white font-semibold">
                 Apple Pay
              </button>
              <button className="w-full h-12 bg-white border border-gray-300 hover:bg-gray-50 transition-colors rounded-sm flex items-center justify-center text-gray-800 font-semibold shadow-sm">
                 <span className="flex items-center gap-2">
                   <svg className="w-4 h-4" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
                   Google Pay
                 </span>
              </button>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Offline Methods */}
        <AccordionItem value="cod" className="border border-border bg-background px-4">
          <AccordionTrigger className="hover:no-underline py-4">
            <div className="flex items-center gap-4">
              <input type="radio" checked={selectedMethod === "cod"} readOnly className="accent-primary w-4 h-4" />
              <span className="font-bold uppercase text-sm">Cash on Delivery</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="pb-6">
            <div className="pl-8 text-sm text-muted-foreground">
              Pay with cash upon delivery of your order. An additional service fee of $5.00 applies.
            </div>
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem value="bank" className="border border-border bg-background px-4">
          <AccordionTrigger className="hover:no-underline py-4">
            <div className="flex items-center gap-4">
              <input type="radio" checked={selectedMethod === "bank"} readOnly className="accent-primary w-4 h-4" />
              <span className="font-bold uppercase text-sm">Bank Transfer</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="pb-6">
            <div className="pl-8 text-sm text-muted-foreground space-y-2">
              <p>Make your payment directly into our bank account. Please use your Order ID as the payment reference.</p>
              <div className="bg-secondary p-4 mt-2 font-mono text-xs text-foreground">
                <p>Bank: Premier Bank Somalia</p>
                <p>Account Name: Tokiyo Store Ltd</p>
                <p>Account No: 1234567890123</p>
                <p>Swift/BIC: PRBKSOSQ</p>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

      </Accordion>
    </div>
  );
}
