import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { ShieldCheck, CreditCard, Lock, ArrowLeft, Loader2, AlertCircle, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export function SandboxPayment() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const paymentId = params.get("payment_id") || "";
  const amount = params.get("amount") || "0.00";
  const currency = params.get("currency") || "USD";
  const ref = params.get("ref") || "";

  const [cardName, setCardName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handlePay = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setError(null);

    try {
      const response = await fetch("http://localhost:5000/api/payments/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          paymentId,
          transactionReference: `STRIPE-REC-${Date.now()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`,
          amountPaid: Number(amount),
          currencyPaid: currency
        })
      });

      const resData = await response.json();

      if (!response.ok || !resData.success) {
        throw new Error(resData.error || "Payment verification failed / Xaqiijinta lacagta waa fashilantay.");
      }

      setSuccess(true);
      setTimeout(() => {
        // Go back to order success page
        const orderId = paymentId; // The paymentId is linked to order in backend
        // Retrieve order details to get order_id
        navigate(-1); // Go back or go to home
      }, 3000);

    } catch (err: any) {
      console.error("Sandbox pay error:", err);
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center text-accent">
          <ShieldCheck className="h-12 w-12 text-black" />
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 tracking-tight uppercase">
          Tokiyo Secure Gateway
        </h2>
        <p className="mt-2 text-center text-xs text-gray-500 uppercase tracking-widest">
          Production Sandbox / Simulator Portal
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 border border-gray-200 shadow-md sm:rounded-2xl sm:px-10 space-y-6">
          
          {/* Order Details Banner */}
          <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 flex justify-between items-center">
            <div>
              <p className="text-[10px] uppercase font-bold text-gray-400">Total Amount</p>
              <p className="text-2xl font-black text-gray-950 font-sans mt-0.5">${amount} {currency}</p>
            </div>
            <div className="text-right">
              <p className="text-[10px] uppercase font-bold text-gray-400">Reference</p>
              <p className="text-xs font-mono font-bold text-gray-700 mt-1">{ref || "—"}</p>
            </div>
          </div>

          {success ? (
            <div className="text-center py-8 space-y-4">
              <CheckCircle2 className="h-16 w-16 text-green-600 mx-auto animate-bounce" />
              <h3 className="text-lg font-bold text-gray-900 uppercase">Payment Approved!</h3>
              <p className="text-xs text-gray-500">Lacagtaada si guul leh ayaa loo xaqiijiyay. Dib kuu celinaya...</p>
            </div>
          ) : (
            <form onSubmit={handlePay} className="space-y-5">
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-800 text-xs rounded-lg flex items-start gap-2">
                  <AlertCircle className="h-4 w-4 text-red-600 flex-shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Cardholder Name</label>
                <input
                  type="text"
                  required
                  value={cardName}
                  onChange={(e) => setCardName(e.target.value)}
                  placeholder="e.g. John Doe"
                  className="w-full border-gray-300 rounded-lg py-2 px-3 border focus:ring-black focus:border-black sm:text-sm outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Card Number</label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    placeholder="4111 2222 3333 4444"
                    maxLength={19}
                    className="w-full border-gray-300 rounded-lg py-2 pl-3 pr-10 border focus:ring-black focus:border-black sm:text-sm outline-none"
                  />
                  <CreditCard className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Expiration</label>
                  <input
                    type="text"
                    required
                    value={expiry}
                    onChange={(e) => setExpiry(e.target.value)}
                    placeholder="MM/YY"
                    maxLength={5}
                    className="w-full border-gray-300 rounded-lg py-2 px-3 border focus:ring-black focus:border-black sm:text-sm outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-600 uppercase mb-1">CVV</label>
                  <input
                    type="password"
                    required
                    value={cvv}
                    onChange={(e) => setCvv(e.target.value)}
                    placeholder="123"
                    maxLength={4}
                    className="w-full border-gray-300 rounded-lg py-2 px-3 border focus:ring-black focus:border-black sm:text-sm outline-none"
                  />
                </div>
              </div>

              <div className="pt-2">
                <Button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full h-12 bg-black text-white hover:bg-gray-800 rounded-xl uppercase tracking-widest text-xs font-bold gap-2"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="animate-spin h-4 w-4" /> Processing...
                    </>
                  ) : (
                    <>
                      <Lock className="h-4 w-4" /> Pay ${amount} USD
                    </>
                  )}
                </Button>
              </div>
            </form>
          )}

          <div className="flex justify-center border-t pt-4">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="text-xs font-bold uppercase text-gray-500 hover:text-black flex items-center gap-1.5"
            >
              <ArrowLeft className="h-4 w-4" /> Cancel & Return / Kansal Garee
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
