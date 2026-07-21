import { useEffect, useState } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import {
  CheckCircle, Package, Truck, MapPin, Clock, Download,
  ShoppingBag, Printer, CreditCard, RefreshCw, Upload, AlertCircle, Sparkles
} from "lucide-react";
import { motion } from "framer-motion";

const STATUS_STEPS = [
  { key: "pending",          label: "Order Placed",      labelSo: "Dalabka La Diiwaan-geliyay",    icon: CheckCircle },
  { key: "confirmed",        label: "Confirmed",         labelSo: "La Xaqiijiyay",                  icon: CheckCircle },
  { key: "processing",       label: "Processing",        labelSo: "La Diyaarinayaa",                icon: Package },
  { key: "packed",           label: "Packed",            labelSo: "La Xirxiray",                    icon: Package },
  { key: "shipped",          label: "Shipped",           labelSo: "Loo Diray",                      icon: Truck },
  { key: "out_for_delivery", label: "Out for Delivery",  labelSo: "Waxaa La Gaadhsiinayaa",         icon: Truck },
  { key: "delivered",        label: "Delivered",         labelSo: "La Keenay",                      icon: MapPin },
];

const STATUS_ORDER = STATUS_STEPS.map((s) => s.key);

function getStepIndex(status: string): number {
  const idx = STATUS_ORDER.indexOf(status);
  return idx === -1 ? 0 : idx;
}

async function fetchOrderById(orderId: string) {
  const { data, error } = await supabase
    .from("orders")
    .select(`
      id, order_number, status, created_at, subtotal, discount_total,
      shipping_fee, tax_amount, total, currency, shipping_address,
      payment_provider, notes,
      order_items:order_items(
        id, quantity, unit_price, total_price, product_snapshot
      ),
      order_status_history(status, note, created_at)
    `)
    .eq("id", orderId)
    .single();
  if (error) throw error;
  return data;
}

async function fetchPaymentByOrderId(orderId: string) {
  const { data, error } = await supabase
    .from("payments")
    .select("*")
    .eq("order_id", orderId)
    .maybeSingle();
  if (error && error.code !== "PGRST116") throw error;
  return data || null;
}

export function OrderSuccess() {
  const [params] = useSearchParams();
  const queryClient = useQueryClient();
  const orderId = params.get("id") || "";
  const navigate = useNavigate();

  // Local state for payment processing & switching
  const [isSwitching, setIsSwitching] = useState(false);
  const [sendingPhone, setSendingPhone] = useState("");
  const [txnRef, setTxnRef] = useState("");
  const [proofUrl, setProofUrl] = useState("");
  const [uploadingProof, setUploadingProof] = useState(false);
  const [submittingManual, setSubmittingManual] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [processingGate, setProcessingGate] = useState(false);

  const { data: order, isLoading: orderLoading, refetch: refetchOrder } = useQuery({
    queryKey: ["order-success", orderId],
    queryFn: () => fetchOrderById(orderId),
    enabled: !!orderId,
    refetchInterval: 15_000, // Poll every 15s for status updates
  });

  const { data: payment, isLoading: paymentLoading, refetch: refetchPayment } = useQuery({
    queryKey: ["order-payment", orderId],
    queryFn: () => fetchPaymentByOrderId(orderId),
    enabled: !!orderId,
  });

  // Real-time status subscription
  useEffect(() => {
    if (!orderId) return;
    const channel = supabase
      .channel(`order-${orderId}`)
      .on("postgres_changes", {
        event: "INSERT",
        schema: "public",
        table: "order_status_history",
        filter: `order_id=eq.${orderId}`,
      }, () => {
        refetchOrder();
        refetchPayment();
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [orderId, refetchOrder, refetchPayment]);

  const handlePrint = () => window.print();

  const handleDownloadInvoice = () => {
    if (!order) return;
    const addr = order.shipping_address as any;
    const items = (order.order_items || []) as any[];

    const invoiceHTML = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <title>Invoice — ${order.order_number}</title>
  <style>
    body { font-family: Arial, sans-serif; padding: 40px; color: #111; max-width: 800px; margin: auto; }
    .header { display: flex; justify-content: space-between; margin-bottom: 40px; border-bottom: 2px solid #000; padding-bottom: 20px; }
    .logo { font-size: 28px; font-weight: 900; letter-spacing: 4px; text-transform: uppercase; }
    .invoice-title { font-size: 14px; color: #666; text-transform: uppercase; letter-spacing: 2px; }
    table { width: 100%; border-collapse: collapse; margin: 24px 0; }
    th { background: #000; color: #fff; padding: 10px 12px; text-align: left; font-size: 12px; text-transform: uppercase; }
    td { padding: 10px 12px; border-bottom: 1px solid #eee; font-size: 13px; }
    .totals td { font-weight: bold; }
    .total-row td { font-size: 16px; background: #f5f5f5; }
    .footer { margin-top: 40px; text-align: center; color: #999; font-size: 11px; }
  </style>
</head>
<body>
  <div class="header">
    <div>
      <div class="logo">TOKIYO STORE</div>
      <p style="margin: 4px 0;">Premium Men's Fashion</p>
    </div>
    <div style="text-align: right">
      <div class="invoice-title">Official Invoice</div>
      <p style="margin: 4px 0;">INV-${order.order_number}</p>
      <p style="margin: 4px 0; font-size:11px; color:#888;">Date: ${new Date(order.created_at).toLocaleDateString()}</p>
    </div>
  </div>
  <table style="margin-bottom: 28px">
    <tbody>
      <tr>
        <td style="border:0; padding:0; width: 50%"><strong>Billed To:</strong><br/>${addr?.full_name || ""}<br/>${addr?.address_line1 || ""}<br/>${addr?.city || ""}, ${addr?.state || ""}<br/>${addr?.country || ""}</td>
        <td style="border:0; padding:0; text-align: right"><strong>Payment Details:</strong><br/>Method: ${order.payment_provider?.toUpperCase()}<br/>Currency: USD</td>
      </tr>
    </tbody>
  </table>
  <table>
    <thead>
      <tr>
        <th>Item</th>
        <th>Details</th>
        <th style="text-align:center">Qty</th>
        <th style="text-align:right">Total</th>
      </tr>
    </thead>
    <tbody>
      ${items.map(item => `
        <tr>
          <td>${item.product_snapshot?.title || "Product"}</td>
          <td>${[item.product_snapshot?.size, item.product_snapshot?.color].filter(Boolean).join(" / ")}</td>
          <td style="text-align:center">${item.quantity}</td>
          <td style="text-align:right">$${Number(item.total_price).toFixed(2)}</td>
        </tr>
      `).join("")}
    </tbody>
    <tfoot>
      <tr><td colspan="3">Subtotal</td><td style="text-align:right">$${Number(order.subtotal).toFixed(2)}</td></tr>
      <tr><td colspan="3">Shipping</td><td style="text-align:right">$${Number(order.shipping_fee).toFixed(2)}</td></tr>
      <tr style="font-weight:bold; background:#f9f9f9;"><td colspan="3">Total</td><td style="text-align:right">$${Number(order.total).toFixed(2)}</td></tr>
    </tfoot>
  </table>
</body>
</html>`;

    const blob = new Blob([invoiceHTML], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `TOKIYO-Invoice-${order.order_number}.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Proof Image Upload to Supabase Storage
  const handleUploadProof = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !order) return;
    setUploadingProof(true);
    setErrorMsg(null);
    try {
      const ext = file.name.split(".").pop();
      const path = `proofs/${order.order_number}-${Date.now()}.${ext}`;

      const { data, error } = await supabase.storage
        .from("payment-proofs")
        .upload(path, file);

      if (error) throw error;

      const { data: { publicUrl } } = supabase.storage
        .from("payment-proofs")
        .getPublicUrl(path);

      setProofUrl(publicUrl);
      setSuccessMsg("Proof uploaded successfully / Sawirka cadaynta waa la geliyay!");
    } catch (err: any) {
      console.error(err);
      setErrorMsg("Failed to upload image. Please try again / Sawirka waa la gelin waayay.");
    } finally {
      setUploadingProof(false);
    }
  };

  // Submit manual transaction reference
  const handleSubmitManual = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!txnRef) {
      setErrorMsg("Transaction reference is required / Tixraaca waa muhiim.");
      return;
    }
    setSubmittingManual(true);
    setErrorMsg(null);

    try {
      // 1. Update Payments record
      const { error: payErr } = await supabase
        .from("payments")
        .update({
          payment_reference: txnRef,
          payment_proof_url: proofUrl || null,
          status: "processing",
          payment_method_details: {
            sending_phone: sendingPhone || null,
            submitted_at: new Date().toISOString()
          }
        })
        .eq("order_id", orderId);

      if (payErr) throw payErr;

      // 2. Update Order status
      const { error: orderErr } = await supabase
        .from("orders")
        .update({ status: "payment_under_review" })
        .eq("id", orderId);

      if (orderErr) throw orderErr;

      // 3. Add to order status history
      await supabase.from("order_status_history").insert({
        order_id: orderId,
        status: "payment_under_review",
        note: `Manual payment proof submitted. Ref: ${txnRef}. Phone: ${sendingPhone || "N/A"}`
      });

      setSuccessMsg("Payment details submitted for admin review! / Cadayntaada waa la diray.");
      refetchOrder();
      refetchPayment();
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to submit verification request.");
    } finally {
      setSubmittingManual(false);
    }
  };

  // Switch payment method dynamically (Phase 26)
  const handleSwitchPayment = async (newMethod: string) => {
    if (!order) return;
    setIsSwitching(true);
    setErrorMsg(null);
    try {
      // 1. Update order provider
      const { error: orderErr } = await supabase
        .from("orders")
        .update({ payment_provider: newMethod })
        .eq("id", orderId);
      if (orderErr) throw orderErr;

      // 2. Upsert payment record matching new selection
      const { error: payErr } = await supabase
        .from("payments")
        .upsert({
          order_id: orderId,
          amount: order.total,
          provider: newMethod,
          status: "unpaid"
        }, { onConflict: "order_id,provider" });

      if (payErr) throw payErr;

      // 3. Add to status history
      await supabase.from("order_status_history").insert({
        order_id: orderId,
        status: "pending",
        note: `Payment method switched to: ${newMethod.toUpperCase()}`
      });

      setSuccessMsg(`Switched payment to ${newMethod.toUpperCase()} successfully!`);
      refetchOrder();
      refetchPayment();
    } catch (err: any) {
      setErrorMsg("Failed to switch payment method. Please try again.");
    } finally {
      setIsSwitching(false);
    }
  };

  const handlePayNow = async () => {
    if (!order) return;
    setProcessingGate(true);
    setErrorMsg(null);
    try {
      const res = await fetch("http://localhost:5000/api/payments/create-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId,
          paymentMethod: order.payment_provider
        })
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to initialize payment gateway session.");
      }

      // Redirect to sandbox simulation
      window.location.href = data.redirectUrl;
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to initialize card portal.");
    } finally {
      setProcessingGate(false);
    }
  };

  if (orderLoading || paymentLoading || !order) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <RefreshCw className="animate-spin h-10 w-10 text-black mx-auto mb-4" />
          <p className="text-gray-500 text-sm uppercase tracking-widest">Loading order details...</p>
        </div>
      </div>
    );
  }

  const currentStepIdx = getStepIndex(order.status);
  const addr = order.shipping_address as any;
  const items = (order.order_items || []) as any[];
  const history = (order.order_status_history || []) as any[];
  const isCancelled = order.status === "cancelled";

  // Check if manual/local provider
  const isLocalMobile = ["evc", "zaad", "sahal", "edahab", "jeeb"].includes(order.payment_provider || "");
  const isBank = order.payment_provider === "bank";
  const isCOD = order.payment_provider === "cod";
  const isCard = ["card", "paypal", "wallet"].includes(order.payment_provider || "");

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">

        {/* SUCCESS HEADER */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <div className={`inline-flex items-center justify-center w-20 h-20 rounded-full mb-5 ${isCancelled ? "bg-red-100" : "bg-green-100"}`}>
            {isCancelled ? (
              <span className="text-red-600 text-4xl">✕</span>
            ) : (
              <CheckCircle className="h-10 w-10 text-green-600" />
            )}
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold uppercase tracking-widest mb-2">
            {isCancelled ? "Order Cancelled" : "Order Confirmed!"}
          </h1>
          <p className="text-gray-500 text-lg">
            {isCancelled
              ? "Dalabkaagii la baajiyay."
              : "Dalabkaagii si guul leh ayaa la diiwaangeliyay. Waad ku mahadsan tahay!"}
          </p>
          <div className="mt-4 inline-block bg-black text-white px-6 py-2 font-mono text-sm font-bold tracking-widest rounded-full">
            {order.order_number}
          </div>
        </motion.div>

        {/* PAYMENT MANAGEMENT CENTER (Phase 26) */}
        {!isCancelled && (
          <div className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 mb-6 space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b pb-4 gap-2">
              <div>
                <h3 className="text-sm font-bold uppercase tracking-widest text-gray-900">Payment Status / Habka Lacag Bixinta</h3>
                <p className="text-xs text-gray-500 mt-0.5">Manage and track your transaction securely.</p>
              </div>
              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest font-sans ${
                payment?.status === 'paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
              }`}>
                {payment?.status === 'paid' ? 'Paid / Waa Bixiyay' : `Awaiting Payment: ${payment?.status || 'unpaid'}`}
              </span>
            </div>

            {successMsg && <div className="p-3 bg-green-50 text-green-800 text-xs rounded-lg">{successMsg}</div>}
            {errorMsg && <div className="p-3 bg-red-50 text-red-800 text-xs rounded-lg flex gap-2"><AlertCircle className="h-4 w-4" />{errorMsg}</div>}

            {payment?.status !== "paid" ? (
              <div className="space-y-6">
                
                {/* Dynamic Instructions */}
                {isLocalMobile && (
                  <div className="p-5 border border-yellow-100 bg-yellow-50/50 rounded-xl space-y-4 text-sm text-gray-800">
                    <h4 className="font-bold flex items-center gap-1.5"><Sparkles className="h-4 w-4 text-yellow-600" /> Mobile Money Payment Instructions</h4>
                    <p className="font-medium">
                      {order.payment_provider === "evc" && "Fadlan u wareeji lambarka EVC Plus +252 61 1234567 kadibna geli tixraaca hoos."}
                      {order.payment_provider === "zaad" && "Wac *252*611234567# si aad ugu wareejiso Zaad kadibna geli tixraaca hoos."}
                      {order.payment_provider === "sahal" && "Wac *252*901234567# si aad ugu wareejiso Sahal kadibna geli tixraaca hoos."}
                      {order.payment_provider === "edahab" && "Ku shub eDahab merchant ID 76239 kadibna geli tixraaca hoos."}
                      {order.payment_provider === "jeeb" && "Ku shub Jeeb account @tokiyo kadibna geli tixraaca hoos."}
                    </p>

                    <form onSubmit={handleSubmitManual} className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                      <div>
                        <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Sending Phone Number / Lambarkaagii</label>
                        <input type="text" value={sendingPhone} onChange={(e) => setSendingPhone(e.target.value)} placeholder="+252 61 XXXXXXX" className="w-full border rounded-lg py-2 px-3 text-xs bg-white focus:ring-black focus:border-black outline-none" required />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Transaction ID / Reference *</label>
                        <input type="text" value={txnRef} onChange={(e) => setTxnRef(e.target.value)} placeholder="Tusaale: Txn-9273619" className="w-full border rounded-lg py-2 px-3 text-xs bg-white focus:ring-black focus:border-black outline-none" required />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Upload Payment Screenshot / Sawirka Cadaynta</label>
                        <div className="flex items-center gap-3">
                          <input type="file" onChange={handleUploadProof} accept="image/*" className="hidden" id="proof-upload" />
                          <label htmlFor="proof-upload" className="flex items-center gap-1.5 px-4 py-2 border rounded-lg bg-white text-xs font-bold cursor-pointer hover:bg-gray-50 transition-all border-gray-300">
                            <Upload className="h-4 w-4 text-gray-500" /> {uploadingProof ? "Uploading..." : "Select Screenshot"}
                          </label>
                          {proofUrl && <span className="text-xs text-green-700 font-semibold truncate max-w-[200px]">Attached</span>}
                        </div>
                      </div>
                      <div className="sm:col-span-2 pt-2">
                        <Button type="submit" disabled={submittingManual} className="w-full h-10 bg-black text-white hover:bg-gray-800 text-xs font-bold uppercase tracking-wider rounded-xl">
                          {submittingManual ? "Submitting..." : "Submit Proof / Gudbi Cadaynta"}
                        </Button>
                      </div>
                    </form>
                  </div>
                )}

                {isBank && (
                  <div className="p-5 border border-yellow-100 bg-yellow-50/50 rounded-xl space-y-4 text-sm text-gray-800">
                    <h4 className="font-bold flex items-center gap-1.5"><Sparkles className="h-4 w-4 text-yellow-600" /> Bank Transfer instructions</h4>
                    <div className="bg-white border p-3 rounded-lg font-mono text-xs">
                      <p>Bank Name: Premier Bank Somalia</p>
                      <p>Acc Name: Tokiyo Store Ltd</p>
                      <p>Acc No: 1234567890123</p>
                      <p>Swift: PRBKSOSQ</p>
                    </div>

                    <form onSubmit={handleSubmitManual} className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                      <div className="sm:col-span-2">
                        <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Transaction ID / Transfer Reference *</label>
                        <input type="text" value={txnRef} onChange={(e) => setTxnRef(e.target.value)} placeholder="Enter transfer reference" className="w-full border rounded-lg py-2 px-3 text-xs bg-white focus:ring-black focus:border-black outline-none" required />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Upload Payment Slip / Warqada Transfer-ka</label>
                        <div className="flex items-center gap-3">
                          <input type="file" onChange={handleUploadProof} accept="image/*,application/pdf" className="hidden" id="proof-upload" />
                          <label htmlFor="proof-upload" className="flex items-center gap-1.5 px-4 py-2 border rounded-lg bg-white text-xs font-bold cursor-pointer hover:bg-gray-50 transition-all border-gray-300">
                            <Upload className="h-4 w-4 text-gray-500" /> {uploadingProof ? "Uploading..." : "Select File"}
                          </label>
                          {proofUrl && <span className="text-xs text-green-700 font-semibold truncate">Attached</span>}
                        </div>
                      </div>
                      <div className="sm:col-span-2 pt-2">
                        <Button type="submit" disabled={submittingManual} className="w-full h-10 bg-black text-white hover:bg-gray-800 text-xs font-bold uppercase tracking-wider rounded-xl">
                          {submittingManual ? "Submitting..." : "Submit Proof / Gudbi Cadaynta"}
                        </Button>
                      </div>
                    </form>
                  </div>
                )}

                {isCard && (
                  <div className="p-6 border rounded-xl text-center space-y-4 bg-gray-50">
                    <CreditCard className="h-10 w-10 text-gray-400 mx-auto" />
                    <div>
                      <h4 className="font-bold text-sm">Online Secure Gateway Payment</h4>
                      <p className="text-xs text-gray-500 mt-1">Complete your transaction instantly using Visa, Mastercard, or PayPal.</p>
                    </div>
                    <Button onClick={handlePayNow} disabled={processingGate} className="bg-black text-white hover:bg-gray-800 rounded-xl h-11 px-8 text-xs font-bold uppercase tracking-wider gap-1.5">
                      {processingGate ? <RefreshCw className="animate-spin h-4 w-4" /> : null}
                      Proceed to Pay / Hadda Bixi (${order.total})
                    </Button>
                  </div>
                )}

                {isCOD && (
                  <div className="p-4 border rounded-xl bg-green-50/50 border-green-200 text-sm text-green-800">
                    <p className="font-bold">Cash on Delivery Confirmation</p>
                    <p className="text-xs text-gray-600 mt-1">Your order is set to cash on delivery. You will pay when the delivery agent brings your items.</p>
                  </div>
                )}

                {/* Switch Payment Methods */}
                <div className="border-t pt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-500 font-medium">Need to switch payment option?</span>
                    <button onClick={() => setIsSwitching(!isSwitching)} className="text-xs font-bold uppercase hover:underline">
                      {isSwitching ? "Close / Xir" : "Switch Method / Bedel Habka"}
                    </button>
                  </div>

                  {isSwitching && (
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-3 bg-gray-50 p-4 rounded-xl border">
                      {["evc", "zaad", "sahal", "edahab", "jeeb", "card", "paypal", "cod", "bank"].map((method) => (
                        <button
                          key={method}
                          onClick={() => handleSwitchPayment(method)}
                          className="px-3 py-2 border rounded-lg bg-white text-xs font-bold uppercase tracking-wider text-gray-700 hover:bg-black hover:text-white transition-colors"
                        >
                          {method}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

              </div>
            ) : (
              <div className="p-4 bg-green-50 border border-green-200 text-green-800 rounded-xl text-xs flex gap-2">
                <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                <div>
                  <h4 className="font-bold">Payment Verified Successfully!</h4>
                  <p className="mt-0.5">Your payment is reconciled. Thank you for shopping with Tokiyo Store.</p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* DELIVERY PROGRESS */}
        {!isCancelled && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 mb-6"
          >
            <h2 className="text-sm font-bold uppercase tracking-widest mb-8 text-gray-700">Delivery Progress / Socodka Dalabka</h2>
            <div className="relative">
              {/* Progress line */}
              <div className="absolute top-5 left-5 right-5 h-0.5 bg-gray-200 z-0" />
              <div
                className="absolute top-5 left-5 h-0.5 bg-black z-0 transition-all duration-700"
                style={{ width: `${(currentStepIdx / (STATUS_STEPS.length - 1)) * 100}%` }}
              />
              <div className="relative flex justify-between">
                {STATUS_STEPS.map((step, idx) => {
                  const done = idx <= currentStepIdx;
                  const active = idx === currentStepIdx;
                  return (
                    <div key={step.key} className="flex flex-col items-center z-10">
                      <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all ${
                        done ? "bg-black border-black" : "bg-white border-gray-300"
                      } ${active ? "ring-4 ring-black/10" : ""}`}>
                        <step.icon className={`h-4 w-4 ${done ? "text-white" : "text-gray-400"}`} />
                      </div>
                      <p className={`mt-2 text-[10px] font-bold uppercase tracking-wider text-center hidden sm:block max-w-[64px] leading-tight ${done ? "text-black" : "text-gray-400"}`}>
                        {step.label}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
            <p className="text-center mt-8 text-sm font-semibold text-gray-700">
              Current Status: <span className="text-black uppercase tracking-widest">{order.status.replace(/_/g, " ")}</span>
            </p>
          </motion.div>
        )}

        {/* STATUS HISTORY TIMELINE */}
        {history.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 mb-6"
          >
            <h2 className="text-sm font-bold uppercase tracking-widest mb-6 text-gray-700">Status History / Taariikh</h2>
            <div className="space-y-4">
              {[...history].reverse().map((h: any, idx: number) => (
                <div key={idx} className="flex gap-4">
                  <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${idx === 0 ? "bg-black" : "bg-gray-300"}`} />
                  <div>
                    <p className="text-sm font-semibold text-gray-900 capitalize">{h.status?.replace(/_/g, " ")}</p>
                    {h.note && <p className="text-xs text-gray-500 mt-0.5">{h.note}</p>}
                    <p className="text-xs text-gray-400 mt-0.5">
                      {new Date(h.created_at).toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">

          {/* ORDER ITEMS */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl border border-gray-200 p-6"
          >
            <h2 className="text-sm font-bold uppercase tracking-widest mb-4 text-gray-700">Items Ordered / Alaabta</h2>
            <div className="space-y-4">
              {items.map((item: any) => (
                <div key={item.id} className="flex gap-3 items-start">
                  <div className="w-10 h-10 bg-gray-100 rounded flex items-center justify-center flex-shrink-0">
                    <Package className="h-5 w-5 text-gray-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate">{item.product_snapshot?.title || "Product"}</p>
                    <p className="text-xs text-gray-500">
                      {[item.product_snapshot?.size && `Size: ${item.product_snapshot.size}`,
                        item.product_snapshot?.color && `Color: ${item.product_snapshot.color}`
                      ].filter(Boolean).join(" · ")}
                    </p>
                    <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                  </div>
                  <p className="text-sm font-bold text-gray-900">${Number(item.total_price).toFixed(2)}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* ORDER SUMMARY + ADDRESS */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="space-y-4"
          >
            {/* Price Summary */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <h2 className="text-sm font-bold uppercase tracking-widest mb-4 text-gray-700">Price Summary</h2>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>${Number(order.subtotal).toFixed(2)}</span>
                </div>
                {Number(order.discount_total) > 0 && (
                  <div className="flex justify-between text-green-700">
                    <span>Discount</span>
                    <span>-${Number(order.discount_total).toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span>{Number(order.shipping_fee) === 0 ? "Free" : `$${Number(order.shipping_fee).toFixed(2)}`}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Tax</span>
                  <span>${Number(order.tax_amount).toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold text-gray-900 pt-2 border-t border-gray-100">
                  <span className="uppercase tracking-widest text-xs">Total</span>
                  <span className="text-base">${Number(order.total).toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Delivery Address */}
            {addr && (
              <div className="bg-white rounded-2xl border border-gray-200 p-6">
                <h2 className="text-sm font-bold uppercase tracking-widest mb-3 text-gray-700 flex items-center gap-2">
                  <MapPin className="h-4 w-4" /> Delivery Address
                </h2>
                <address className="not-italic text-sm text-gray-700 leading-relaxed">
                  <strong>{addr.full_name}</strong><br />
                  {addr.address_line1}{addr.address_line2 && `, ${addr.address_line2}`}<br />
                  {addr.city}{addr.state && `, ${addr.state}`}{addr.postal_code && ` ${addr.postal_code}`}<br />
                  {addr.country}
                </address>
              </div>
            )}
          </motion.div>
        </div>

        {/* ACTIONS */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Button onClick={handleDownloadInvoice} variant="outline" className="gap-2 rounded-xl uppercase tracking-widest text-xs h-12 px-6">
            <Download className="h-4 w-4" /> Download Invoice
          </Button>
          <Button onClick={handlePrint} variant="outline" className="gap-2 rounded-xl uppercase tracking-widest text-xs h-12 px-6">
            <Printer className="h-4 w-4" /> Print
          </Button>
          <Button asChild className="gap-2 rounded-xl uppercase tracking-widest text-xs h-12 px-6 bg-black text-white hover:bg-gray-900">
            <Link to="/account/orders">
              <Clock className="h-4 w-4" /> Track All Orders
            </Link>
          </Button>
          <Button asChild variant="outline" className="gap-2 rounded-xl uppercase tracking-widest text-xs h-12 px-6">
            <Link to="/shop">
              <ShoppingBag className="h-4 w-4" /> Continue Shopping
            </Link>
          </Button>
        </motion.div>

      </div>
    </div>
  );
}


