import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { PageHeader } from "@/components/admin/PageHeader";
import { supabase } from "@/lib/supabase";
import { Truck, Search, Package, Clock, CheckCircle } from "lucide-react";

interface ShippingRecord {
  id: string;
  carrier: string | null;
  tracking_number: string | null;
  shipping_method: string | null;
  estimated_delivery_date: string | null;
  actual_delivery_date: string | null;
  status: string;
  created_at: string;
  order: {
    id: string;
    order_number: string;
    shipping_address: any;
    profile: { first_name: string | null; last_name: string | null } | null;
  } | null;
}

const SHIPPING_STATUSES = ["pending", "label_created", "picked_up", "in_transit", "out_for_delivery", "delivered", "failed"];

const statusColors: Record<string, string> = {
  pending: "bg-gray-100 text-gray-700",
  label_created: "bg-blue-50 text-blue-700",
  picked_up: "bg-indigo-100 text-indigo-700",
  in_transit: "bg-yellow-100 text-yellow-700",
  out_for_delivery: "bg-orange-100 text-orange-700",
  delivered: "bg-green-100 text-green-700",
  failed: "bg-red-100 text-red-700",
};

async function fetchShipping(): Promise<ShippingRecord[]> {
  const { data, error } = await supabase
    .from("shipping")
    .select(`
      id, carrier, tracking_number, shipping_method,
      estimated_delivery_date, actual_delivery_date, status, created_at,
      order:orders(id, order_number, shipping_address, profile:profiles(first_name, last_name))
    `)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data || []) as unknown as ShippingRecord[];
}

export function AdminShipping() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [editRow, setEditRow] = useState<string | null>(null);
  const [editData, setEditData] = useState<Partial<ShippingRecord>>({});

  const { data: records = [], isLoading, isError } = useQuery({
    queryKey: ["admin-shipping"],
    queryFn: fetchShipping,
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<ShippingRecord> }) => {
      const { error } = await supabase.from("shipping").update(updates).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-shipping"] });
      setEditRow(null);
    },
  });

  const filtered = records.filter((r) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      r.order?.order_number?.toLowerCase().includes(q) ||
      r.tracking_number?.toLowerCase().includes(q) ||
      r.carrier?.toLowerCase().includes(q) ||
      `${r.order?.profile?.first_name} ${r.order?.profile?.last_name}`.toLowerCase().includes(q)
    );
  });

  const stats = {
    total: records.length,
    inTransit: records.filter((r) => r.status === "in_transit").length,
    delivered: records.filter((r) => r.status === "delivered").length,
    pending: records.filter((r) => r.status === "pending").length,
  };

  return (
    <div>
      <PageHeader
        title="Shipping"
        description="Track and manage shipments for all orders."
        showExport
      />

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Total Shipments", value: stats.total, icon: Truck, color: "text-gray-900" },
          { label: "In Transit", value: stats.inTransit, icon: Package, color: "text-yellow-700" },
          { label: "Delivered", value: stats.delivered, icon: CheckCircle, color: "text-green-700" },
          { label: "Pending", value: stats.pending, icon: Clock, color: "text-blue-700" },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-3">
            <s.icon className={`h-8 w-8 ${s.color} opacity-80`} />
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-widest font-medium">{s.label}</p>
              <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl border border-gray-200 mb-4 p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by order number, tracking, carrier or customer..."
            className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black outline-none"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="p-8 space-y-4">
            {[1, 2, 3].map((i) => <div key={i} className="h-14 bg-gray-100 animate-pulse rounded" />)}
          </div>
        ) : isError ? (
          <div className="p-12 text-center text-red-500">Failed to load shipping records.</div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center">
            <Truck className="h-10 w-10 text-gray-300 mx-auto mb-3" />
            <p className="font-medium text-gray-500">No shipments found.</p>
            <p className="text-sm text-gray-400 mt-1">Shipments are created automatically when orders are fulfilled.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-100">
              <thead className="bg-gray-50">
                <tr>
                  {["Order", "Customer", "Carrier", "Tracking #", "Method", "Status", "Est. Delivery", "Actions"].map((h) => (
                    <th key={h} className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {filtered.map((rec) => {
                  const isEditing = editRow === rec.id;
                  const orderObj: any = Array.isArray(rec.order) ? rec.order[0] : rec.order;
                  const prof: any = orderObj && (Array.isArray(orderObj.profile) ? orderObj.profile[0] : orderObj.profile);
                  const customer = prof
                    ? `${prof.first_name || ""} ${prof.last_name || ""}`.trim() || "Guest"
                    : "Guest";
                  return (
                    <tr key={rec.id} className="hover:bg-gray-50">
                      <td className="px-5 py-4 text-sm font-mono font-medium text-gray-900 whitespace-nowrap">
                        {orderObj?.order_number || "—"}
                      </td>
                      <td className="px-5 py-4 text-sm text-gray-700">{customer}</td>
                      <td className="px-5 py-4 text-sm text-gray-700">
                        {isEditing ? (
                          <input
                            className="border border-gray-300 rounded px-2 py-1 text-xs w-28"
                            value={editData.carrier ?? rec.carrier ?? ""}
                            onChange={(e) => setEditData({ ...editData, carrier: e.target.value })}
                          />
                        ) : (
                          rec.carrier || "—"
                        )}
                      </td>
                      <td className="px-5 py-4 text-sm">
                        {isEditing ? (
                          <input
                            className="border border-gray-300 rounded px-2 py-1 text-xs w-36"
                            value={editData.tracking_number ?? rec.tracking_number ?? ""}
                            onChange={(e) => setEditData({ ...editData, tracking_number: e.target.value })}
                          />
                        ) : rec.tracking_number ? (
                          <span className="font-mono text-xs text-blue-700">{rec.tracking_number}</span>
                        ) : (
                          <span className="text-gray-400 text-xs">Not set</span>
                        )}
                      </td>
                      <td className="px-5 py-4 text-sm text-gray-600 whitespace-nowrap">{rec.shipping_method || "Standard"}</td>
                      <td className="px-5 py-4">
                        {isEditing ? (
                          <select
                            value={editData.status ?? rec.status}
                            onChange={(e) => setEditData({ ...editData, status: e.target.value })}
                            className="text-xs border border-gray-300 rounded px-2 py-1"
                          >
                            {SHIPPING_STATUSES.map((s) => (
                              <option key={s} value={s}>{s.replace(/_/g, " ")}</option>
                            ))}
                          </select>
                        ) : (
                          <span className={`px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${statusColors[rec.status] || "bg-gray-100 text-gray-700"}`}>
                            {rec.status.replace(/_/g, " ")}
                          </span>
                        )}
                      </td>
                      <td className="px-5 py-4 text-sm text-gray-500 whitespace-nowrap">
                        {rec.estimated_delivery_date
                          ? new Date(rec.estimated_delivery_date).toLocaleDateString()
                          : "—"}
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex gap-2">
                          {isEditing ? (
                            <>
                              <button
                                onClick={() => updateMutation.mutate({ id: rec.id, updates: editData })}
                                className="px-3 py-1 bg-black text-white text-xs rounded-md hover:bg-gray-800"
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
                            <button
                              onClick={() => { setEditRow(rec.id); setEditData({}); }}
                              className="px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded-md hover:bg-gray-200 font-medium"
                            >
                              Edit
                            </button>
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
