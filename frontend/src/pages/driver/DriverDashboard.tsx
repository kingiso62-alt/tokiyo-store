import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useAuthStore } from "@/store/useAuthStore";
import {
  MapPin, Phone, MessageSquare, ShieldAlert, CheckCircle, Clock,
  Upload, Navigation, DollarSign, Loader2, AlertCircle, Check
} from "lucide-react";
import { Button } from "@/components/ui/button";

type DeliveryStatus = 
  | "assigned"
  | "accepted"
  | "picked_up"
  | "out_for_delivery"
  | "customer_unreachable"
  | "delivery_failed"
  | "rescheduled"
  | "delivered"
  | "returned_to_store";

interface DeliveryRecord {
  id: string;
  status: DeliveryStatus;
  delivery_fee: number;
  cash_to_collect: number;
  cash_collected: number;
  proof_image_url: string | null;
  notes: string | null;
  created_at: string;
  order: {
    id: string;
    order_number: string;
    total: number;
    shipping_address: any;
    profile: {
      first_name: string;
      last_name: string;
      phone: string;
    } | null;
  } | null;
}

const statusSteps: { key: DeliveryStatus; label: string; color: string }[] = [
  { key: "assigned", label: "Assigned", color: "bg-gray-100 text-gray-700" },
  { key: "accepted", label: "Accepted", color: "bg-blue-100 text-blue-700" },
  { key: "picked_up", label: "Picked Up", color: "bg-indigo-100 text-indigo-700" },
  { key: "out_for_delivery", label: "Out for Delivery", color: "bg-yellow-100 text-yellow-700" },
  { key: "customer_unreachable", label: "Unreachable", color: "bg-orange-100 text-orange-700" },
  { key: "delivery_failed", label: "Failed", color: "bg-red-100 text-red-700" },
  { key: "rescheduled", label: "Rescheduled", color: "bg-purple-100 text-purple-700" },
  { key: "delivered", label: "Delivered", color: "bg-green-100 text-green-700" },
  { key: "returned_to_store", label: "Returned to Store", color: "bg-gray-200 text-gray-800" },
];

export function DriverDashboard() {
  const { profile } = useAuthStore();
  const queryClient = useQueryClient();
  const [selectedDelivery, setSelectedDelivery] = useState<DeliveryRecord | null>(null);
  
  // Status update state
  const [newStatus, setNewStatus] = useState<DeliveryStatus | "">("");
  const [cashInput, setCashInput] = useState("0.00");
  const [deliveryNotes, setDeliveryNotes] = useState("");
  const [proofUrl, setProofUrl] = useState("");
  const [uploadingProof, setUploadingProof] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Fetch driver assignments
  const { data: deliveries = [], isLoading, isError } = useQuery({
    queryKey: ["driver_deliveries", profile?.id],
    queryFn: async (): Promise<DeliveryRecord[]> => {
      const { data, error } = await supabase
        .from("deliveries")
        .select(`
          id, status, delivery_fee, cash_to_collect, cash_collected, proof_image_url, notes, created_at,
          order:orders(
            id, order_number, total, shipping_address,
            profile:profiles(first_name, last_name, phone)
          )
        `)
        .eq("driver_id", profile?.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return (data || []) as unknown as DeliveryRecord[];
    },
    enabled: !!profile?.id,
  });

  // Proof Image Upload
  const handleUploadProof = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !selectedDelivery) return;
    setUploadingProof(true);
    setErrorMsg(null);
    try {
      const ext = file.name.split(".").pop();
      const path = `proofs/${selectedDelivery.order?.order_number}-${Date.now()}.${ext}`;

      const { data, error } = await supabase.storage
        .from("delivery-proofs")
        .upload(path, file);

      if (error) throw error;

      const { data: { publicUrl } } = supabase.storage
        .from("delivery-proofs")
        .getPublicUrl(path);

      setProofUrl(publicUrl);
      setSuccessMsg("Proof photo uploaded successfully!");
    } catch (err: any) {
      setErrorMsg("Failed to upload proof photo.");
    } finally {
      setUploadingProof(false);
    }
  };

  const handleUpdateStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDelivery || !newStatus) return;

    setIsUpdating(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      // 1. Update delivery table
      const { error: delErr } = await supabase
        .from("deliveries")
        .update({
          status: newStatus,
          cash_collected: newStatus === "delivered" ? Number(cashInput) : 0,
          proof_image_url: proofUrl || null,
          notes: deliveryNotes || null,
          updated_at: new Date().toISOString()
        })
        .eq("id", selectedDelivery.id);

      if (delErr) throw delErr;

      // 2. Insert to delivery history log
      const { error: histErr } = await supabase
        .from("delivery_status_history")
        .insert({
          delivery_id: selectedDelivery.id,
          status: newStatus,
          note: deliveryNotes || `Delivery status changed to ${newStatus}`,
          changed_by: profile?.id
        });

      if (histErr) throw histErr;

      // 3. If delivered, automatically update payment status to paid on Cash on Delivery orders
      if (newStatus === "delivered" && selectedDelivery.cash_to_collect > 0) {
        await supabase
          .from("payments")
          .update({ status: "paid", amount: Number(cashInput) })
          .eq("order_id", selectedDelivery.order?.id);
      }

      setSuccessMsg("Status updated successfully! / Xaaladda waa la bedelay.");
      queryClient.invalidateQueries({ queryKey: ["driver_deliveries", profile?.id] });
      
      // Reset state
      setSelectedDelivery(null);
      setNewStatus("");
      setCashInput("0.00");
      setDeliveryNotes("");
      setProofUrl("");
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to update delivery status.");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-8 space-y-6 font-sans bg-gray-50 min-h-screen pb-24">
      
      {/* Header */}
      <div className="bg-white border rounded-2xl p-5 shadow-sm space-y-1.5">
        <h1 className="text-xl font-black text-gray-950 uppercase tracking-wider flex items-center gap-1.5">
          <Navigation className="h-5 w-5 text-black" /> Driver Portal
        </h1>
        <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">
          Driver: {profile?.first_name} {profile?.last_name}
        </p>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="animate-spin h-8 w-8 text-black" />
        </div>
      ) : isError ? (
        <div className="p-4 bg-red-50 text-red-800 rounded-xl text-xs flex gap-2"><AlertCircle className="h-4 w-4" /> Failed to load deliveries.</div>
      ) : deliveries.length === 0 ? (
        <div className="text-center py-12 bg-white border rounded-2xl p-6 shadow-sm">
          <Clock className="h-10 w-10 text-gray-300 mx-auto mb-3" />
          <p className="font-bold text-sm text-gray-500 uppercase tracking-widest">No Deliveries Assigned</p>
          <p className="text-xs text-gray-400 mt-1">You will see assignments when admins dispatch new orders.</p>
        </div>
      ) : (
        <div className="space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-widest text-gray-500 px-1">Your Assignments ({deliveries.length})</h3>
          
          {deliveries.map((del) => {
            const order = del.order;
            const addr = order?.shipping_address as any;
            const clientName = order?.profile 
              ? `${order.profile.first_name} ${order.profile.last_name}`
              : addr?.full_name || "Guest";
            const phone = order?.profile?.phone || addr?.phone || "";
            const isDelivered = del.status === "delivered";

            const statusConfig = statusSteps.find(s => s.key === del.status);

            const mapQuery = addr ? `${addr.address_line1}, ${addr.city}, Somalia` : "";
            const mapLink = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(mapQuery)}`;

            return (
              <div key={del.id} className="bg-white border rounded-2xl p-5 shadow-sm space-y-4 hover:border-gray-300 transition-colors">
                <div className="flex justify-between items-center border-b pb-3">
                  <div>
                    <span className="text-xs font-mono font-bold text-gray-900">INV-{order?.order_number}</span>
                    <span className="text-[10px] text-gray-400 block">{new Date(del.created_at).toLocaleDateString()}</span>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${statusConfig?.color || "bg-gray-100 text-gray-600"}`}>
                    {del.status}
                  </span>
                </div>

                <div className="text-xs space-y-2 text-gray-700">
                  <p className="flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5 text-gray-400" /> <strong>{clientName}</strong>: {mapQuery}</p>
                  {phone && <p className="flex items-center gap-1.5"><Phone className="h-3.5 w-3.5 text-gray-400" /> {phone}</p>}
                  
                  <div className="bg-gray-50 p-2.5 rounded-xl border border-gray-100 flex justify-between items-center mt-2">
                    <div>
                      <p className="text-[10px] text-gray-400 font-bold uppercase">Order Total</p>
                      <p className="text-sm font-bold text-gray-900">${order?.total.toFixed(2)}</p>
                    </div>
                    {del.cash_to_collect > 0 && (
                      <div className="text-right text-red-700">
                        <p className="text-[10px] text-red-500 font-bold uppercase">COD Cash to Collect</p>
                        <p className="text-sm font-black">${del.cash_to_collect.toFixed(2)}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <a href={`tel:${phone}`} className="flex-1 border hover:bg-gray-50 rounded-xl h-9 flex items-center justify-center text-[10px] font-bold uppercase tracking-wider gap-1 text-gray-700">
                    <Phone className="h-3.5 w-3.5" /> Call
                  </a>
                  <a href={`https://wa.me/${phone?.replace(/\+/g, "")}`} target="_blank" rel="noreferrer" className="flex-1 border hover:bg-gray-50 rounded-xl h-9 flex items-center justify-center text-[10px] font-bold uppercase tracking-wider gap-1 text-gray-700">
                    <MessageSquare className="h-3.5 w-3.5" /> WhatsApp
                  </a>
                  <a href={mapLink} target="_blank" rel="noreferrer" className="flex-1 border hover:bg-gray-50 rounded-xl h-9 flex items-center justify-center text-[10px] font-bold uppercase tracking-wider gap-1 text-gray-700">
                    <Navigation className="h-3.5 w-3.5" /> Navigate
                  </a>
                </div>

                {!isDelivered && (
                  <Button
                    onClick={() => {
                      setSelectedDelivery(del);
                      setNewStatus(del.status);
                      setCashInput(del.cash_to_collect.toString());
                    }}
                    className="w-full bg-black text-white hover:bg-gray-800 text-xs font-bold uppercase tracking-wider h-10 rounded-xl"
                  >
                    Update Delivery Status
                  </Button>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* UPDATE STATUS MODAL SHEET */}
      {selectedDelivery && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-end justify-center p-0">
          <div className="bg-white rounded-t-3xl w-full max-w-md p-6 space-y-6 animate-slide-up shadow-2xl relative">
            <button
              onClick={() => setSelectedDelivery(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-black font-bold text-xs uppercase"
            >
              ✕ Close
            </button>
            
            <div className="border-b pb-3">
              <h3 className="text-sm font-bold uppercase tracking-widest text-gray-900">Update Delivery status</h3>
              <p className="text-xs text-gray-500 mt-0.5">Order: INV-{selectedDelivery.order?.order_number}</p>
            </div>

            {errorMsg && <div className="p-3 bg-red-50 text-red-800 text-xs rounded-lg">{errorMsg}</div>}

            <form onSubmit={handleUpdateStatus} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Select Status</label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value as DeliveryStatus)}
                  className="w-full border rounded-lg py-2.5 px-3 text-xs bg-white focus:ring-black focus:border-black outline-none cursor-pointer font-bold uppercase tracking-wider text-gray-700"
                  required
                >
                  <option value="">-- Choose Status --</option>
                  {statusSteps.slice(1).map(step => (
                    <option key={step.key} value={step.key}>{step.label}</option>
                  ))}
                </select>
              </div>

              {newStatus === "delivered" && (
                <div className="space-y-4 animate-fade-in">
                  {selectedDelivery.cash_to_collect > 0 && (
                    <div>
                      <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Cash Collected ($) *</label>
                      <input
                        type="number"
                        step="0.01"
                        value={cashInput}
                        onChange={(e) => setCashInput(e.target.value)}
                        className="w-full border rounded-lg py-2 px-3 text-xs bg-white focus:ring-black focus:border-black outline-none font-bold"
                        required
                      />
                    </div>
                  )}
                  
                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Upload Delivery Proof Image *</label>
                    <div className="flex items-center gap-3">
                      <input type="file" onChange={handleUploadProof} accept="image/*" className="hidden" id="modal-proof-upload" />
                      <label htmlFor="modal-proof-upload" className="flex items-center gap-1.5 px-4 py-2 border rounded-lg bg-white text-xs font-bold cursor-pointer hover:bg-gray-50 border-gray-300">
                        <Upload className="h-4 w-4 text-gray-500" /> {uploadingProof ? "Uploading..." : "Take Photo"}
                      </label>
                      {proofUrl && <span className="text-xs text-green-700 font-semibold truncate">Attached</span>}
                    </div>
                  </div>
                </div>
              )}

              <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Driver Notes / Qoraal</label>
                <textarea
                  value={deliveryNotes}
                  onChange={(e) => setDeliveryNotes(e.target.value)}
                  placeholder="Enter any notes about customer address or payment..."
                  rows={3}
                  className="w-full border rounded-lg py-2 px-3 text-xs bg-white focus:ring-black focus:border-black outline-none"
                />
              </div>

              <div className="pt-4 flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setSelectedDelivery(null)}
                  className="flex-1 h-11 text-xs font-bold uppercase tracking-wider rounded-xl"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isUpdating || (newStatus === "delivered" && !proofUrl && selectedDelivery.cash_to_collect > 0)}
                  className="flex-1 h-11 bg-black text-white hover:bg-gray-800 text-xs font-bold uppercase tracking-wider rounded-xl"
                >
                  {isUpdating ? "Saving..." : "Update Status"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
