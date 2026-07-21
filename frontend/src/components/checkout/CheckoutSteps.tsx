import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuthStore } from "@/store/useAuthStore";

export function CheckoutSteps() {
  const { user } = useAuthStore();
  const [email, setEmail] = useState(user?.email || "");
  
  return (
    <div className="space-y-10">
      
      {/* Contact Section */}
      <section>
        <div className="flex justify-between items-end mb-4 border-b border-border pb-2">
          <h2 className="text-xl font-bold uppercase tracking-widest">1. Contact Information</h2>
          {!user && (
            <span className="text-xs text-muted-foreground">
              Already have an account? <a href="/login" className="text-primary hover:underline">Log in</a>
            </span>
          )}
        </div>
        <div className="space-y-4 max-w-lg">
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Enter your email" />
          </div>
          <div className="flex items-center space-x-2">
            <input type="checkbox" id="newsletter" className="accent-primary" defaultChecked />
            <label htmlFor="newsletter" className="text-sm text-muted-foreground">Keep me up to date on news and exclusive offers</label>
          </div>
        </div>
      </section>

      {/* Shipping Section */}
      <section>
        <div className="mb-4 border-b border-border pb-2">
          <h2 className="text-xl font-bold uppercase tracking-widest">2. Shipping Address</h2>
        </div>
        
        {user && (
          <div className="mb-6 p-4 border border-primary bg-primary/5 rounded-sm max-w-lg">
            <div className="flex justify-between items-start mb-2">
              <span className="font-bold text-sm uppercase tracking-widest text-primary">Saved Address (Home)</span>
              <input type="radio" checked readOnly className="accent-primary w-4 h-4" />
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              John Doe<br/>
              Maka Al-Mukarama Road<br/>
              Hodan District, Mogadishu<br/>
              Somalia<br/>
              +252 61 1234567
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl">
          <div className="space-y-2">
            <Label>First Name</Label>
            <Input placeholder="John" defaultValue={user ? "John" : ""} />
          </div>
          <div className="space-y-2">
            <Label>Last Name</Label>
            <Input placeholder="Doe" defaultValue={user ? "Doe" : ""} />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label>Address</Label>
            <Input placeholder="Street address or P.O. Box" />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label>Apartment, suite, etc. (optional)</Label>
            <Input placeholder="Apartment, suite, unit, building, floor, etc." />
          </div>
          <div className="space-y-2">
            <Label>City / District</Label>
            <Input placeholder="Mogadishu" />
          </div>
          <div className="space-y-2">
            <Label>Country</Label>
            <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
              <option value="SO">Somalia</option>
              <option value="KE">Kenya</option>
              <option value="DJ">Djibouti</option>
              <option value="ET">Ethiopia</option>
              <option value="US">United States</option>
            </select>
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label>Phone</Label>
            <Input type="tel" placeholder="+252 61 XXXXXXX" />
          </div>
        </div>
      </section>

      {/* Order Notes Section */}
      <section>
        <div className="mb-4 border-b border-border pb-2">
          <h2 className="text-xl font-bold uppercase tracking-widest">3. Order Notes (Optional)</h2>
        </div>
        <div className="max-w-2xl">
          <textarea 
            className="w-full min-h-[100px] border border-input bg-background px-3 py-2 text-sm focus:border-primary outline-none resize-y rounded-md" 
            placeholder="Notes about your order, e.g. special notes for delivery."
          ></textarea>
        </div>
      </section>

    </div>
  );
}
