import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { PageHeader } from "@/components/admin/PageHeader";
import { supabase } from "@/lib/supabase";
import { 
  CreditCard, Search, CheckCircle, XCircle, Clock, RefreshCw, 
  AlertTriangle, Eye, ShieldCheck, Check, DollarSign, Download, Printer 
} from "lucide-react";
import { Button } from "@/components/ui/button";

type PaymentStatus = "unpaid" | "processing" | "paid" | "failed" | "refunded";
type TabView = "transactions" | "reconciliation";

interface PaymentRecord {
  id: string;
  amount: number;
  provider: string;
  provider_transaction_id: string | null;
  payment_reference: string | null;
  payment_proof_url: string | null;
  status: PaymentStatus;
  payment_method_details: any;
  created_at: string;
  updated_at: string;
  order: { order_number: string; total: number; status: string } | null;
  profile: { first_name: string | null; last_name: string | null } | null;
}

const statusColors: Record<PaymentStatus, string> = {
  unpaid: "bg-gray-100 text-gray-700",
  processing: "bg-blue-100 text-blue-700",
  paid: "bg-green-100 text-green-700",
  failed: "bg-red-100 text-red-700",
  refunded: "bg-orange-100 text-orange-700",
};

const statusIcons: Record<PaymentStatus, any> = {
  unpaid: Clock,
  processing: RefreshCw,
  paid: CheckCircle,
  failed: XCircle,
  refunded: RefreshCw,
};

const PAYMENT_STATUSES: PaymentStatus[] = ["unpaid", "processing", "paid", "failed", "refunded"];

async function fetchPayments(): Promise<PaymentRecord[]> {
  const { data, error } = await supabase
    .from("payments")
    .select(`
      id, amount, provider, provider_transaction_id, status,
      payment_method_details, created_at, updated_at, payment_reference, payment_proof_url,
      order:orders(order_number, total, status),
      profile:profiles(first_name, last_name)
    `)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data || []) as unknown as PaymentRecord[];
}

export function AdminPayments() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<PaymentStatus | "all">("all");
  const [activeTab, setActiveTab] = useState<TabView>("transactions");
  const [selectedProof, setSelectedProof] = useState<string | null>(null);

  const { data: payments = [], isLoading, isError } = useQuery({
    queryKey: ["admin-payments"],
    queryFn: fetchPayments,
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status, reference, notes }: { id: string; status: PaymentStatus; reference?: string; notes?: string }) => {
      const { data, error } = await supabase.rpc("verify_payment", {
        p_payment_id: id,
        p_status: status,
        p_reference: reference || null,
        p_notes: notes || null
      });
      if (error) throw error;
      if (data && !data.success) throw new Error(data.error);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-payments"] });
      queryClient.invalidateQueries({ queryKey: ["admin_orders"] });
    },
  });

  // Reconcile manual helper
  const handleQuickReconcile = (id: string, refCode: string) => {
    updateStatusMutation.mutate({
      id,
      status: "paid",
      reference: refCode || `MAN-REC-${Date.now()}`,
      notes: "Manually reconciled via admin dashboard."
    });
  };

  const filtered = payments.filter((p) => {
    const q = search.toLowerCase();
    const orderObj: any = Array.isArray(p.order) ? p.order[0] : p.order;
    const prof: any = Array.isArray(p.profile) ? p.profile[0] : p.profile;
    const matchSearch =
      !search ||
      orderObj?.order_number?.toLowerCase().includes(q) ||
      p.provider?.toLowerCase().includes(q) ||
      p.provider_transaction_id?.toLowerCase().includes(q) ||
      p.payment_reference?.toLowerCase().includes(q) ||
      `${prof?.first_name} ${prof?.last_name}`.toLowerCase().includes(q);
    const matchStatus = filterStatus === "all" || p.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const getReconciliationStatus = (p: PaymentRecord) => {
    const orderObj: any = Array.isArray(p.order) ? p.order[0] : p.order;
    if (!orderObj) return { label: "No Order", color: "bg-gray-100 text-gray-500" };
    
    if (p.status === "paid" && orderObj.status !== "cancelled" && Number(p.amount) === Number(orderObj.total)) {
      return { label: "Reconciled", color: "bg-green-100 text-green-800", icon: ShieldCheck };
    }
    if (p.status === "paid" && Number(p.amount) !== Number(orderObj.total)) {
      return { label: "Discrepancy", color: "bg-red-100 text-red-800", icon: AlertTriangle, note: "Amount mismatch!" };
    }
    if (p.status === "processing" || orderObj.status === "payment_under_review") {
      return { label: "Awaiting Verification", color: "bg-yellow-100 text-yellow-800", icon: Clock };
    }
    return { label: "Unreconciled", color: "bg-gray-100 text-gray-500", icon: Clock };
  };

  const stats = {
    totalRevenue: payments.filter((p) => p.status === "paid").reduce((s, p) => s + p.amount, 0),
    paid: payments.filter((p) => p.status === "paid").length,
    pending: payments.filter((p) => p.status === "unpaid" || p.status === "processing").length,
    cashCollected: payments.filter((p) => p.provider === "cod" && p.status === "paid").reduce((s, p) => s + p.amount, 0),
    cashOutstanding: payments.filter((p) => p.provider === "cod" && p.status === "unpaid").reduce((s, p) => s + p.amount, 0),
  };

  return (
    <div className="space-y-6 font-sans">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gray-200 pb-5">
        <PageHeader
          title="Payments & Reconciliations"
          description="Track incoming transactions, verify manual mobile money receipts, and resolve financial discrepancies."
        />
        <div className="flex bg-gray-100 p-1 rounded-xl">
          <button
            onClick={() => setActiveTab("transactions")}
            className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
              activeTab === "transactions" ? "bg-white text-black shadow-sm" : "text-gray-500 hover:text-black"
            }`}
          >
            All Transactions
          </button>
          <button
            onClick={() => setActiveTab("reconciliation")}
            className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
              activeTab === "reconciliation" ? "bg-white text-black shadow-sm" : "text-gray-500 hover:text-black"
            }`}
          >
            Reconciliation Workspace
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
          <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Total Reconciled</p>
          <p className="text-xl font-bold mt-1 text-green-700">${stats.totalRevenue.toLocaleString("en-US", { minimumFractionDigits: 2 })}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
          <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Paid Receipts</p>
          <p className="text-xl font-bold mt-1 text-gray-900">{stats.paid} Transactions</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
          <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Unpaid / Awaiting</p>
          <p className="text-xl font-bold mt-1 text-yellow-600">{stats.pending} Orders</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
          <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">COD Cash Collected</p>
          <p className="text-xl font-bold mt-1 text-green-700">${stats.cashCollected.toFixed(2)}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
          <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">COD Outstanding</p>
          <p className="text-xl font-bold mt-1 text-red-600">${stats.cashOutstanding.toFixed(2)}</p>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 flex flex-col sm:flex-row gap-3 shadow-sm">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by order, customer reference, or transaction ID..."
            className="w-full pl-9 pr-3 py-2 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black outline-none bg-white"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {(["all", ...PAYMENT_STATUSES] as const).map((s) => (
            <button
              key={s}
              onClick={() => setFilterStatus(s as any)}
              className={`px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider rounded-lg transition-colors ${
                filterStatus === s ? "bg-black text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* TRANSACTIONS TABLE VIEW */}
      {activeTab === "transactions" && (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          {isLoading ? (
            <div className="p-8 space-y-4">
              {[1, 2, 3].map((i) => <div key={i} className="h-14 bg-gray-50 animate-pulse rounded-lg" />)}
            </div>
          ) : isError ? (
            <div className="p-12 text-center text-red-500">Failed to load payments.</div>
          ) : filtered.length === 0 ? (
            <div className="p-12 text-center text-gray-500">No transactions match your search.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-100">
                <thead className="bg-gray-50 text-[10px] font-bold uppercase tracking-wider text-gray-500">
                  <tr>
                    <th className="px-5 py-3 text-left">Order</th>
                    <th className="px-5 py-3 text-left">Customer</th>
                    <th className="px-5 py-3 text-left">Amount</th>
                    <th className="px-5 py-3 text-left">Provider</th>
                    <th className="px-5 py-3 text-left">Ref Code</th>
                    <th className="px-5 py-3 text-left">Attachment</th>
                    <th className="px-5 py-3 text-left">Status</th>
                    <th className="px-5 py-3 text-left">Date</th>
                    <th className="px-5 py-3 text-left">Verification Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100 text-xs font-semibold text-gray-700">
                  {filtered.map((payment) => {
                    const prof: any = Array.isArray(payment.profile) ? payment.profile[0] : payment.profile;
                    const customer = prof ? `${prof.first_name || ""} ${prof.last_name || ""}`.trim() || "Guest" : "Guest";
                    const orderObj: any = Array.isArray(payment.order) ? payment.order[0] : payment.order;
                    const StatusIcon = statusIcons[payment.status];
                    return (
                      <tr key={payment.id} className="hover:bg-gray-50/50">
                        <td className="px-5 py-4 font-mono text-gray-900 font-bold">{orderObj?.order_number || "—"}</td>
                        <td className="px-5 py-4">{customer}</td>
                        <td className="px-5 py-4 font-sans font-bold text-gray-900">${payment.amount.toFixed(2)}</td>
                        <td className="px-5 py-4">
                          <span className="px-2 py-0.5 bg-gray-100 rounded text-[9px] uppercase font-bold text-gray-600">
                            {payment.provider}
                          </span>
                        </td>
                        <td className="px-5 py-4 font-mono text-gray-500">{payment.payment_reference || payment.provider_transaction_id || "—"}</td>
                        <td className="px-5 py-4">
                          {payment.payment_proof_url ? (
                            <button
                              onClick={() => setSelectedProof(payment.payment_proof_url)}
                              className="text-black hover:underline flex items-center gap-1 font-bold"
                            >
                              <Eye className="h-3.5 w-3.5" /> View Proof
                            </button>
                          ) : (
                            <span className="text-gray-400 font-normal">None</span>
                          )}
                        </td>
                        <td className="px-5 py-4">
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${statusColors[payment.status]}`}>
                            <StatusIcon className="h-2.5 w-2.5" />
                            {payment.status}
                          </span>
                        </td>
                        <td className="px-5 py-4 text-gray-500">{new Date(payment.created_at).toLocaleDateString()}</td>
                        <td className="px-5 py-4">
                          <select
                            value={payment.status}
                            onChange={(e) => {
                              const newStatus = e.target.value as PaymentStatus;
                              let ref = "";
                              let note = "";
                              if (newStatus === "paid") {
                                ref = prompt("Geli tixraaca lacag bixinta (Payment Reference) - Optional:") || "";
                              }
                              if (newStatus === "refunded" || newStatus === "failed") {
                                note = prompt("Geli sababta / qoraalka (Notes) - Required:") || "";
                                if (!note && newStatus === "refunded") return; // cancel
                              }
                              updateStatusMutation.mutate({ id: payment.id, status: newStatus, reference: ref, notes: note });
                            }}
                            className="text-[10px] font-bold uppercase border rounded-lg px-2 py-1.5 bg-white text-gray-700 cursor-pointer"
                          >
                            {PAYMENT_STATUSES.map((s) => (
                              <option key={s} value={s}>{s}</option>
                            ))}
                          </select>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* RECONCILIATION WORKSPACE TAB */}
      {activeTab === "reconciliation" && (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="p-4 border-b bg-gray-50/50">
            <h4 className="text-sm font-bold uppercase tracking-widest text-gray-900">Payment Reconciliation Audit</h4>
            <p className="text-xs text-gray-500 mt-0.5">Cross-reference order total amounts with actual paid provider receipts server-side.</p>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-100">
              <thead className="bg-gray-50 text-[10px] font-bold uppercase tracking-wider text-gray-500">
                <tr>
                  <th className="px-5 py-3 text-left">Order #</th>
                  <th className="px-5 py-3 text-left">Customer</th>
                  <th className="px-5 py-3 text-left">Provider</th>
                  <th className="px-5 py-3 text-right">Order Total</th>
                  <th className="px-5 py-3 text-right">Paid Amount</th>
                  <th className="px-5 py-3 text-left">Payment Status</th>
                  <th className="px-5 py-3 text-left">Order Status</th>
                  <th className="px-5 py-3 text-left">Reconciliation Status</th>
                  <th className="px-5 py-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100 text-xs font-semibold text-gray-700">
                {filtered.map((payment) => {
                  const orderObj: any = Array.isArray(payment.order) ? payment.order[0] : payment.order;
                  const prof: any = Array.isArray(payment.profile) ? payment.profile[0] : payment.profile;
                  const customer = prof ? `${prof.first_name || ""} ${prof.last_name || ""}`.trim() || "Guest" : "Guest";
                  
                  const recon = getReconciliationStatus(payment);
                  const ReconIcon = recon.icon;

                  return (
                    <tr key={payment.id} className="hover:bg-gray-50/30">
                      <td className="px-5 py-4 font-mono font-bold text-gray-900">{orderObj?.order_number || "—"}</td>
                      <td className="px-5 py-4">{customer}</td>
                      <td className="px-5 py-4 uppercase text-[10px]">{payment.provider}</td>
                      <td className="px-5 py-4 text-right">${orderObj ? Number(orderObj.total).toFixed(2) : "—"}</td>
                      <td className="px-5 py-4 text-right font-bold text-gray-900">${payment.amount.toFixed(2)}</td>
                      <td className="px-5 py-4">
                        <span className={`px-2 py-0.5 rounded-full text-[9px] uppercase font-bold ${statusColors[payment.status]}`}>{payment.status}</span>
                      </td>
                      <td className="px-5 py-4">
                        <span className="px-2 py-0.5 rounded bg-gray-100 text-gray-700 text-[9px] uppercase font-bold">{orderObj?.status || "—"}</span>
                      </td>
                      <td className="px-5 py-4">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${recon.color}`}>
                          {ReconIcon && <ReconIcon className="h-2.5 w-2.5" />}
                          {recon.label}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-center">
                        {payment.status !== "paid" && (
                          <button
                            onClick={() => handleQuickReconcile(payment.id, payment.payment_reference || "")}
                            className="bg-black text-white hover:bg-gray-800 text-[10px] font-bold uppercase px-3 py-1.5 rounded-lg transition-all"
                          >
                            Reconcile Manually
                          </button>
                        )}
                        {payment.status === "paid" && (
                          <span className="text-gray-400 font-normal flex items-center justify-center gap-1">
                            <Check className="h-4 w-4 text-green-600" /> Done
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* PAYMENT PROOF VIEWER MODAL */}
      {selectedProof && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 relative shadow-2xl space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-widest border-b pb-2 text-gray-900">Payment Receipt / Cadaynta Lacagta</h3>
            <button 
              onClick={() => setSelectedProof(null)} 
              className="absolute top-4 right-4 text-gray-400 hover:text-black text-sm font-bold uppercase"
            >
              ✕ Close
            </button>
            <div className="flex justify-center bg-gray-50 border rounded-xl overflow-hidden max-h-[70vh]">
              <img src={selectedProof} alt="Payment Proof Attachment" className="object-contain w-full max-h-[60vh]" />
            </div>
            <div className="flex justify-end pt-2">
              <Button onClick={() => setSelectedProof(null)} className="bg-black text-white text-xs font-bold uppercase px-6">Close</Button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
