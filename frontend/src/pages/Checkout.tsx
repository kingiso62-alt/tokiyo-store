import { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useCartStore } from "@/store/useCartStore";
import { useAuthStore } from "@/store/useAuthStore";
import { Button } from "@/components/ui/button";
import { PaymentMethodSelector } from "@/components/checkout/PaymentMethodSelector";
import { supabase } from "@/lib/supabase";
// Custom helper to generate random unique strings as fallback UUIDs
const generateUUID = () => {
  if (typeof window !== "undefined" && window.crypto && window.crypto.randomUUID) {
    try {
      return window.crypto.randomUUID();
    } catch (_) {}
  }
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
};
import {
  AlertCircle, CheckCircle, Loader2, Lock, Tag, X, ShoppingBag, Truck
} from "lucide-react";

interface CheckoutForm {
  full_name: string;
  email: string;
  phone: string;
  address_line1: string;
  address_line2: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
}

const TAX_RATE = 0.08;
const FREE_SHIPPING_THRESHOLD = 500;
const SHIPPING_FEE = 15;

export function Checkout() {
  const { items, subtotal, clearCart } = useCartStore();
  const { user } = useAuthStore();
  const navigate = useNavigate();

  // Idempotency key — generated once per checkout session
  const idempotencyKey = useRef<string>(generateUUID());

  const [isProcessing, setIsProcessing] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false); // prevent double-click
  const [error, setError] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [paymentRef, setPaymentRef] = useState("");
  const [paymentProof, setPaymentProof] = useState("");
  const [couponCode, setCouponCode] = useState("");
  const [couponInput, setCouponInput] = useState("");
  const [couponError, setCouponError] = useState<string | null>(null);
  const [discount, setDiscount] = useState(0);

  // Price calculations (server will recalculate — these are just for display)
  const afterDiscount = subtotal - discount;
  const shipping = afterDiscount >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;
  const tax = (afterDiscount + shipping) * TAX_RATE;
  const total = afterDiscount + shipping + tax;

  const { register, handleSubmit, formState: { errors } } = useForm<CheckoutForm>({
    defaultValues: { country: "United States", email: user?.email || "" },
  });

  // Validate coupon client-side preview
  const applyCoupon = async () => {
    setCouponError(null);
    if (!couponInput.trim()) return;
    const { data, error } = await supabase
      .from("coupons")
      .select("*")
      .eq("code", couponInput.trim().toUpperCase())
      .eq("is_active", true)
      .single();

    if (error || !data) {
      setCouponError("Coupon-ku waa khalad ama wuu dhammaaday. | Invalid or expired coupon.");
      return;
    }
    if (data.minimum_order_amount && subtotal < data.minimum_order_amount) {
      setCouponError(`Minimum order: $${data.minimum_order_amount} required.`);
      return;
    }
    const disc = data.discount_type === "percentage"
      ? (subtotal * data.discount_value) / 100
      : Math.min(data.discount_value, subtotal);
    setDiscount(Math.round(disc * 100) / 100);
    setCouponCode(couponInput.trim().toUpperCase());
  };

  const removeCoupon = () => {
    setCouponCode("");
    setCouponInput("");
    setDiscount(0);
    setCouponError(null);
  };

  // Empty cart guard
  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center min-h-[70vh] flex flex-col items-center justify-center">
        <ShoppingBag className="h-16 w-16 text-gray-300 mb-6" />
        <h1 className="text-2xl font-bold uppercase tracking-widest mb-3">Gaari Madhan Yahay</h1>
        <p className="text-muted-foreground mb-6">Your Cart is Empty — Add products before checking out.</p>
        <Button asChild size="lg" className="rounded-none uppercase tracking-widest">
          <Link to="/shop">Continue Shopping</Link>
        </Button>
      </div>
    );
  }

  // Auth guard
  if (!user) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center min-h-[70vh] flex flex-col items-center justify-center">
        <Lock className="h-12 w-12 text-gray-400 mb-4" />
        <h1 className="text-2xl font-bold uppercase tracking-widest mb-3">Sign In Required</h1>
        <p className="text-muted-foreground mb-6">Ku soo gal si aad dalabka u dhigto. | Please sign in to place your order.</p>
        <Button asChild size="lg" className="rounded-none uppercase tracking-widest">
          <Link to="/login?redirect=/checkout">Sign In</Link>
        </Button>
      </div>
    );
  }

  const onSubmit = async (formData: CheckoutForm) => {
    if (isProcessing || isSubmitted) return; // Prevent duplicate submissions
    setError(null);
    setIsProcessing(true);
    setIsSubmitted(true);

    const shippingAddr = {
      full_name: formData.full_name,
      address_line1: formData.address_line1,
      address_line2: formData.address_line2 || null,
      city: formData.city,
      state: formData.state,
      postal_code: formData.postal_code,
      country: formData.country,
      phone: formData.phone,
      email: formData.email,
    };

    try {
      // Build items array for RPC (only inventory_id + quantity — server fetches prices)
      const orderItems = [];
      for (const item of items) {
        let invId = item.inventory_id;
        if (!invId && item.product_id) {
          const { data: invs } = await supabase
            .from("inventory")
            .select("id")
            .eq("product_id", item.product_id)
            .limit(1);
          if (invs && invs.length > 0) {
            invId = invs[0].id;
          }
        }
        if (invId) {
          orderItems.push({
            inventory_id: invId,
            quantity: item.quantity,
          });
        }
      }

      if (orderItems.length === 0) {
        setError("Alaabta gaariga ku jirta kuma jiraan inventory_id. | Cart items missing inventory reference.");
        setIsProcessing(false);
        setIsSubmitted(false);
        return;
      }

      const { data, error: rpcError } = await supabase.rpc("create_order", {
        p_user_id: user.id,
        p_idempotency_key: idempotencyKey.current,
        p_items: orderItems,
        p_shipping_addr: shippingAddr,
        p_billing_addr: shippingAddr,
        p_coupon_code: couponCode || null,
        p_payment_provider: paymentMethod,
        p_currency: "USD",
        p_notes: null,
      });

      if (rpcError) throw rpcError;

      if (!data?.success) {
        const errMsg = data?.error || "Order creation failed. / Dalabka abuuriddiisii waxay ku guuldareysatay.";
        setError(errMsg);
        setIsProcessing(false);
        setIsSubmitted(false);
        return;
      }

      // If manual or local money with reference is selected, update payments and order status
      const isManualOrLocal = ["evc", "bank"].includes(paymentMethod);
      if (isManualOrLocal && (paymentRef || paymentProof)) {
        await supabase
          .from("payments")
          .update({
            payment_reference: paymentRef || null,
            payment_proof_url: paymentProof || null,
            status: "processing"
          })
          .eq("order_id", data.order_id);

        await supabase
          .from("orders")
          .update({ status: "payment_under_review" })
          .eq("id", data.order_id);

        await supabase
          .from("order_status_history")
          .insert({
            order_id: data.order_id,
            status: "payment_under_review",
            note: "Customer submitted proof/reference: " + (paymentRef || "")
          });
      }

      // Success — clear cart and navigate to success page
      await clearCart();
      navigate(`/order-success?order=${data.order_number}&id=${data.order_id}`, { replace: true });

    } catch (err: any) {
      console.error("Checkout RPC error:", err);
      setError(err?.message || "Khalad dhacay. Dib u isku day. | An unexpected error occurred.");
      setIsProcessing(false);
      setIsSubmitted(false);
    }
  };

  const inputCls = "w-full border border-gray-300 rounded-lg py-2.5 px-3 text-sm focus:ring-2 focus:ring-black focus:border-black outline-none transition-shadow disabled:opacity-60";
  const labelCls = "block text-xs font-bold text-gray-600 mb-1 uppercase tracking-widest";
  const errCls = "text-xs text-red-500 mt-1";

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 min-h-screen">

      {/* Top Nav */}
      <div className="text-center mb-10">
        <Link to="/" className="text-2xl font-bold uppercase tracking-widest hover:opacity-70 transition-opacity">Tokiyo</Link>
        <div className="mt-3 flex items-center justify-center text-xs uppercase tracking-widest font-bold text-gray-400 gap-2">
          <Link to="/cart" className="hover:text-black transition-colors">Cart</Link>
          <span className="text-gray-300">/</span>
          <span className="text-black">Checkout</span>
        </div>
      </div>

      {/* Error banner */}
      {error && (
        <div className="max-w-4xl mx-auto mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col lg:flex-row gap-12 xl:gap-20">

          {/* ── LEFT: Form ─────────────────────────────── */}
          <div className="flex-1 space-y-10">

            {/* Section 1: Contact */}
            <section>
              <h2 className="text-lg font-bold uppercase tracking-widest mb-5 pb-2 border-b border-gray-200">
                1. Contact Information
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className={labelCls}>Full Name *</label>
                  <input {...register("full_name", { required: "Full name is required" })} type="text" className={inputCls} placeholder="Ahmed Hassan" />
                  {errors.full_name && <p className={errCls}>{errors.full_name.message}</p>}
                </div>
                <div>
                  <label className={labelCls}>Email *</label>
                  <input {...register("email", { required: "Email required", pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Invalid email" } })} type="email" className={inputCls} />
                  {errors.email && <p className={errCls}>{errors.email.message}</p>}
                </div>
                <div>
                  <label className={labelCls}>Phone</label>
                  <input {...register("phone")} type="tel" className={inputCls} placeholder="+252 61 0000000" />
                </div>
              </div>
            </section>

            {/* Section 2: Shipping Address */}
            <section>
              <h2 className="text-lg font-bold uppercase tracking-widest mb-5 pb-2 border-b border-gray-200">
                2. Delivery Address
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className={labelCls}>Address Line 1 *</label>
                  <input {...register("address_line1", { required: "Address required" })} type="text" className={inputCls} placeholder="123 Makka Al-Mukarrama Road" />
                  {errors.address_line1 && <p className={errCls}>{errors.address_line1.message}</p>}
                </div>
                <div className="sm:col-span-2">
                  <label className={labelCls}>Address Line 2</label>
                  <input {...register("address_line2")} type="text" className={inputCls} placeholder="Apt, district, floor (optional)" />
                </div>
                <div>
                  <label className={labelCls}>City *</label>
                  <input {...register("city", { required: "City required" })} type="text" className={inputCls} placeholder="Mogadishu" />
                  {errors.city && <p className={errCls}>{errors.city.message}</p>}
                </div>
                <div>
                  <label className={labelCls}>State / Region *</label>
                  <input {...register("state", { required: "State required" })} type="text" className={inputCls} placeholder="Benadir" />
                  {errors.state && <p className={errCls}>{errors.state.message}</p>}
                </div>
                <div>
                  <label className={labelCls}>Postal Code</label>
                  <input {...register("postal_code")} type="text" className={inputCls} placeholder="00000" />
                </div>
                <div>
                  <label className={labelCls}>Country *</label>
                  <select {...register("country")} className={inputCls}>
                    <option>Somalia</option>
                    <option>United States</option>
                    <option>United Kingdom</option>
                    <option>United Arab Emirates</option>
                    <option>Canada</option>
                    <option>Australia</option>
                    <option>Germany</option>
                    <option>France</option>
                    <option>Saudi Arabia</option>
                    <option>Kenya</option>
                    <option>Ethiopia</option>
                    <option>Djibouti</option>
                  </select>
                </div>
              </div>
            </section>

            {/* Section 3: Coupon */}
            <section>
              <h2 className="text-lg font-bold uppercase tracking-widest mb-5 pb-2 border-b border-gray-200">
                3. Coupon / Discount Code
              </h2>
              {couponCode ? (
                <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-xl px-4 py-3">
                  <div className="flex items-center gap-2 text-green-700">
                    <CheckCircle className="h-5 w-5" />
                    <span className="font-bold text-sm">{couponCode}</span>
                    <span className="text-sm">applied — saves ${discount.toFixed(2)}</span>
                  </div>
                  <button type="button" onClick={removeCoupon} className="text-green-600 hover:text-red-500">
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={couponInput}
                    onChange={(e) => { setCouponInput(e.target.value); setCouponError(null); }}
                    placeholder="Enter coupon code (e.g. TOKIYO10)"
                    className={`${inputCls} flex-1`}
                    onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), applyCoupon())}
                  />
                  <Button type="button" variant="outline" onClick={applyCoupon} className="rounded-lg gap-2 uppercase tracking-widest text-xs px-4">
                    <Tag className="h-4 w-4" /> Apply
                  </Button>
                </div>
              )}
              {couponError && <p className="text-red-500 text-xs mt-2">{couponError}</p>}
            </section>

            {/* Section 4: Payment */}
            <section>
              <h2 className="text-lg font-bold uppercase tracking-widest mb-5 pb-2 border-b border-gray-200">
                4. Payment Method
              </h2>
              <PaymentMethodSelector onMethodChange={setPaymentMethod} />

              {["evc", "bank"].includes(paymentMethod) && (
                <div className="mt-6 bg-gray-50 border border-gray-200 rounded-xl p-5 space-y-4">
                  <h4 className="text-sm font-bold uppercase tracking-widest text-gray-800">
                    Geli tixraaca lacag bixinta / Enter Payment Reference
                  </h4>
                  <p className="text-xs text-gray-500">
                    Fadlan ku shub tixraaca (Transaction ID/Reference) ama cadaynta lacag bixinta hoos si aan u xaqiijino dalabkaaga.
                  </p>
                  <div>
                    <label className={labelCls}>Tixraaca (Transaction Reference) *</label>
                    <input
                      type="text"
                      required
                      value={paymentRef}
                      onChange={(e) => setPaymentRef(e.target.value)}
                      placeholder="Tusaale: Txn-18274619"
                      className={inputCls}
                    />
                  </div>
                  <div>
                    <label className={labelCls}>Cadayn Dheeri ah / Payment Proof Link (Optional)</label>
                    <input
                      type="text"
                      value={paymentProof}
                      onChange={(e) => setPaymentProof(e.target.value)}
                      placeholder="Tusaale: http://example.com/screenshot.jpg"
                      className={inputCls}
                    />
                  </div>
                </div>
              )}
            </section>

            {/* Submit */}
            <div className="pt-8 border-t border-gray-200">
              <Button
                type="submit"
                disabled={isProcessing || isSubmitted}
                size="lg"
                className="w-full h-16 rounded-none text-sm font-bold uppercase tracking-widest shadow-xl bg-black text-white hover:bg-gray-900 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isProcessing ? (
                  <span className="flex items-center gap-3">
                    <Loader2 className="animate-spin h-5 w-5" />
                    Dalabka la abuurayaa... | Processing Order...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Lock className="h-4 w-4" />
                    Place Order — ${total.toFixed(2)}
                  </span>
                )}
              </Button>
              <p className="text-center text-xs text-gray-400 mt-4">
                Dalabka marka aad dhigato waxaad aqoonsataa{" "}
                <Link to="#" className="underline">Shuruudaha</Link> iyo{" "}
                <Link to="#" className="underline">Xeerarka Sirta</Link>.
              </p>
            </div>
          </div>

          {/* ── RIGHT: Order Summary ─────────────────── */}
          <aside className="w-full lg:w-[420px]">
            <div className="sticky top-6 bg-white border border-gray-200 rounded-2xl overflow-hidden">

              <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                <h2 className="font-bold uppercase tracking-widest text-sm">
                  Order Summary ({items.length} item{items.length !== 1 ? "s" : ""})
                </h2>
              </div>

              {/* Cart Items */}
              <div className="px-6 py-4 space-y-4 max-h-72 overflow-y-auto">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-3">
                    <div className="relative flex-shrink-0 w-14 h-18">
                      {item.image && (
                        <img src={item.image} alt={item.name} className="w-14 h-16 object-cover rounded-md" loading="lazy" />
                      )}
                      <span className="absolute -top-2 -right-2 bg-black text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
                        {item.quantity}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900 truncate">{item.name}</p>
                      {(item.color || item.size) && (
                        <p className="text-xs text-gray-500 mt-0.5">
                          {[item.color && `Color: ${item.color}`, item.size && `Size: ${item.size}`].filter(Boolean).join(" · ")}
                        </p>
                      )}
                    </div>
                    <p className="text-sm font-medium text-gray-900 flex-shrink-0">${(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                ))}
              </div>

              {/* Price Breakdown */}
              <div className="px-6 py-4 border-t border-gray-100 space-y-3 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span className="font-medium">${subtotal.toFixed(2)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-green-700">
                    <span>Discount ({couponCode})</span>
                    <span className="font-semibold">-${discount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-gray-600">
                  <span className="flex items-center gap-1"><Truck className="h-3.5 w-3.5" /> Shipping</span>
                  <span className={shipping === 0 ? "text-green-600 font-semibold" : "font-medium"}>
                    {shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}
                  </span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Tax (8%)</span>
                  <span className="font-medium">${tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-900 font-bold text-base pt-3 border-t border-gray-200">
                  <span className="uppercase tracking-widest">Total</span>
                  <span className="text-xl">${total.toFixed(2)}</span>
                </div>
              </div>

              {/* Trust Signals */}
              <div className="px-6 pb-5 pt-1 flex flex-col gap-2">
                <div className="flex items-center gap-2 text-xs text-gray-400">
                  <Lock className="h-3 w-3" /> SSL Secured Checkout
                </div>
                {shipping === 0 && (
                  <div className="flex items-center gap-2 text-xs text-green-600">
                    <Truck className="h-3 w-3" /> You qualify for free shipping!
                  </div>
                )}
                {shipping > 0 && (
                  <div className="text-xs text-blue-600">
                    Add ${(FREE_SHIPPING_THRESHOLD - subtotal).toFixed(2)} more for free shipping!
                  </div>
                )}
              </div>
            </div>
          </aside>
        </div>
      </form>
    </div>
  );
}
