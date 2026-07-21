import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { PageHeader } from "@/components/admin/PageHeader";
import { supabase } from "@/lib/supabase";
import { Undo2, Search, CheckCircle, XCircle } from "lucide-react";

type ReturnStatus = "requested" | "approved" | "rejected" | "received" | "refunded";

interface ReturnRecord {
  id: string;
  status: ReturnStatus;
  reason: string;
  refund_amount: number | null;
  admin_notes: string | null;
  created_at: string;
  order: { order_number: string } | null;
  profile: { first_name: string | null; last_name: string | null } | null;
}

const statusColors: Record<ReturnStatus, string> = {
  requested: "bg-yellow-100 text-yellow-700",
  approved: "bg-blue-100 text-blue-700",
  rejected: "bg-red-100 text-red-700",
  received: "bg-indigo-100 text-indigo-700",
  refunded: "bg-green-100 text-green-700",
};

const RETURN_STATUSES: ReturnStatus[] = ["requested", "approved", "rejected", "received", "refunded"];

async function fetchReturns(): Promise<ReturnRecord[]> {
  const { data, error } = await supabase
    .from("returns")
    .select(`
      id, status, reason, refund_amount, admin_notes, created_at,
      order:orders(order_number),
      profile:profiles(first_name, last_name)
    `)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data || []) as unknown as ReturnRecord[];
}

export function AdminReturns() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<ReturnStatus | "all">("all");
  const [editRow, setEditRow] = useState<string | null>(null);
  const [editData, setEditData] = useState<{ status?: ReturnStatus; refund_amount?: number; admin_notes?: string }>({});

  const { data: returns = [], isLoading, isError } = useQuery({
    queryKey: ["admin-returns"],
    queryFn: fetchReturns,
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: any }) => {
      const { error } = await supabase
        .from("returns")
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-returns"] });
      setEditRow(null);
      setEditData({});
    },
  });

  const filtered = returns.filter((r) => {
    const q = search.toLowerCase();
    const matchSearch =
      !search ||
      r.order?.order_number?.toLowerCase().includes(q) ||
      r.reason.toLowerCase().includes(q) ||
      `${r.profile?.first_name} ${r.profile?.last_name}`.toLowerCase().includes(q);
    const matchStatus = filterStatus === "all" || r.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const stats = {
    total: returns.length,
    requested: returns.filter((r) => r.status === "requested").length,
    approved: returns.filter((r) => r.status === "approved").length,
    refunded: returns.filter((r) => r.status === "refunded").length,
    totalRefunded: returns
      .filter((r) => r.status === "refunded" && r.refund_amount)
      .reduce((s, r) => s + (r.refund_amount || 0), 0),
  };

  return (
    <div>
      <PageHeader
        title="Returns & RMAs"
        description="Process customer return requests and manage refunds."
        showExport
      />

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Total Returns", value: stats.total, color: "text-gray-900" },
          { label: "Pending Approval", value: stats.requested, color: "text-yellow-700" },
          { label: "Approved", value: stats.approved, color: "text-blue-700" },
          { label: "Total Refunded", value: `$${stats.totalRefunded.toFixed(2)}`, color: "text-green-700" },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-xl border border-gray-200 p-4">
            <p className="text-xs text-gray-500 uppercase tracking-widest font-medium">{s.label}</p>
            <p className={`text-2xl font-bold mt-1 ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-200 mb-4 p-4 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by order, customer or reason..."
            className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black outline-none"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {(["all", ...RETURN_STATUSES] as const).map((s) => (
            <button
              key={s}
              onClick={() => setFilterStatus(s as any)}
              className={`px-3 py-2 text-xs font-medium rounded-lg capitalize transition-colors ${
                filterStatus === s ? "bg-black text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="p-8 space-y-4">
            {[1, 2, 3].map((i) => <div key={i} className="h-14 bg-gray-100 animate-pulse rounded" />)}
          </div>
        ) : isError ? (
          <div className="p-12 text-center text-red-500">Failed to load returns.</div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center">
            <Undo2 className="h-10 w-10 text-gray-300 mx-auto mb-3" />
            <p className="font-medium text-gray-500">No return requests found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-100">
              <thead className="bg-gray-50">
                <tr>
                  {["Order", "Customer", "Reason", "Status", "Refund Amount", "Admin Notes", "Date", "Actions"].map((h) => (
                    <th key={h} className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {filtered.map((ret) => {
                  const isEditing = editRow === ret.id;
                  const prof: any = Array.isArray(ret.profile) ? ret.profile[0] : ret.profile;
                  const customer = prof
                    ? `${prof.first_name || ""} ${prof.last_name || ""}`.trim() || "Anonymous"
                    : "Anonymous";
                  const orderObj: any = Array.isArray(ret.order) ? ret.order[0] : ret.order;
                  return (
                    <tr key={ret.id} className="hover:bg-gray-50">
                      <td className="px-5 py-4 text-sm font-mono font-medium text-gray-900 whitespace-nowrap">
                        {orderObj?.order_number || "—"}
                      </td>
                      <td className="px-5 py-4 text-sm text-gray-700">{customer}</td>
                      <td className="px-5 py-4 text-sm text-gray-600 max-w-[180px] truncate" title={ret.reason}>
                        {ret.reason}
                      </td>
                      <td className="px-5 py-4">
                        {isEditing ? (
                          <select
                            value={editData.status ?? ret.status}
                            onChange={(e) => setEditData({ ...editData, status: e.target.value as ReturnStatus })}
                            className="text-xs border border-gray-300 rounded px-2 py-1"
                          >
                            {RETURN_STATUSES.map((s) => (
                              <option key={s} value={s}>{s}</option>
                            ))}
                          </select>
                        ) : (
                          <span className={`px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${statusColors[ret.status]}`}>
                            {ret.status}
                          </span>
                        )}
                      </td>
                      <td className="px-5 py-4 text-sm">
                        {isEditing ? (
                          <input
                            type="number"
                            step="0.01"
                            className="border border-gray-300 rounded px-2 py-1 text-xs w-24"
                            value={editData.refund_amount ?? ret.refund_amount ?? ""}
                            onChange={(e) => setEditData({ ...editData, refund_amount: parseFloat(e.target.value) })}
                            placeholder="0.00"
                          />
                        ) : ret.refund_amount != null ? (
                          <span className="font-semibold text-green-700">${ret.refund_amount.toFixed(2)}</span>
                        ) : (
                          <span className="text-gray-400 text-xs">Not set</span>
                        )}
                      </td>
                      <td className="px-5 py-4 text-sm">
                        {isEditing ? (
                          <input
                            type="text"
                            className="border border-gray-300 rounded px-2 py-1 text-xs w-36"
                            value={editData.admin_notes ?? ret.admin_notes ?? ""}
                            onChange={(e) => setEditData({ ...editData, admin_notes: e.target.value })}
                            placeholder="Internal note..."
                          />
                        ) : (
                          <span className="text-gray-500 text-xs truncate max-w-[120px] block">{ret.admin_notes || "—"}</span>
                        )}
                      </td>
                      <td className="px-5 py-4 text-sm text-gray-500 whitespace-nowrap">
                        {new Date(ret.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex gap-2">
                          {isEditing ? (
                            <>
                              <button
                                onClick={() => updateMutation.mutate({ id: ret.id, updates: editData })}
                                className="px-3 py-1 bg-black text-white text-xs rounded-md hover:bg-gray-800 font-medium"
                              >
                                Save
                              </button>
                              <button
                                onClick={() => { setEditRow(null); setEditData({}); }}
                                className="px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded-md hover:bg-gray-200"
                              >
                                Cancel
                              </button>
                            </>
                          ) : (
                            <>
                              {ret.status === "requested" && (
                                <>
                                  <button
                                    onClick={() => updateMutation.mutate({ id: ret.id, updates: { status: "approved" } })}
                                    title="Approve"
                                    className="p-1.5 rounded-md text-green-600 hover:bg-green-50"
                                  >
                                    <CheckCircle className="h-4 w-4" />
                                  </button>
                                  <button
                                    onClick={() => updateMutation.mutate({ id: ret.id, updates: { status: "rejected" } })}
                                    title="Reject"
                                    className="p-1.5 rounded-md text-red-500 hover:bg-red-50"
                                  >
                                    <XCircle className="h-4 w-4" />
                                  </button>
                                </>
                              )}
                              <button
                                onClick={() => { setEditRow(ret.id); setEditData({}); }}
                                className="px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded-md hover:bg-gray-200 font-medium"
                              >
                                Edit
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
