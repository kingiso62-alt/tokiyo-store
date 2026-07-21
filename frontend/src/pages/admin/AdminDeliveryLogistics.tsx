import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { PageHeader } from "@/components/admin/PageHeader";
import { 
  Navigation, Users, Truck, Clock, CheckCircle, XCircle, 
  MapPin, DollarSign, Calendar, Eye, RefreshCw, AlertCircle, Award, Loader2 
} from "lucide-react";
import { Button } from "@/components/ui/button";

type ActiveTab = "overview" | "assignments" | "active";

export function AdminDeliveryLogistics() {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<ActiveTab>("overview");
  const [selectedProof, setSelectedProof] = useState<string | null>(null);

  // Dispatch modal state
  const [dispatchOrder, setDispatchOrder] = useState<any | null>(null);
  const [selectedDriver, setSelectedDriver] = useState("");
  const [deliveryFee, setDeliveryFee] = useState("5.00");
  const [isDispatching, setIsDispatching] = useState(false);
  const [dispatchError, setDispatchError] = useState<string | null>(null);

  // 1. Fetch Drivers List (profiles with role='driver')
  const { data: drivers = [], isLoading: driversLoading } = useQuery({
    queryKey: ["admin_drivers"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select(`
          id, first_name, last_name, phone,
          driver_profiles(*)
        `)
        .eq("role", "driver");

      if (error) throw error;
      return data || [];
    }
  });

  // 2. Fetch Deliveries
  const { data: deliveries = [], isLoading: deliveriesLoading, refetch: refetchDeliveries } = useQuery({
    queryKey: ["admin_all_deliveries"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("deliveries")
        .select(`
          id, status, delivery_fee, cash_to_collect, cash_collected, proof_image_url, notes, created_at, updated_at,
          driver:profiles(first_name, last_name, phone),
          order:orders(id, order_number, total, status, shipping_address, payment_provider, profile:profiles(first_name, last_name))
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data || [];
    }
  });

  // 3. Fetch Orders that need dispatch (confirmed orders that don't have delivery entries yet, or unassigned)
  const { data: pendingDispatch = [], isLoading: dispatchLoading, refetch: refetchPendingDispatch } = useQuery({
    queryKey: ["admin_pending_dispatch"],
    queryFn: async () => {
      // Confirmed orders
      const { data: orders, error } = await supabase
        .from("orders")
        .select(`
          id, order_number, total, status, shipping_address, payment_provider, created_at,
          profile:profiles(first_name, last_name),
          deliveries(id)
        `)
        .eq("status", "confirmed");

      if (error) throw error;
      
      // Filter out orders that already have a delivery row
      return (orders || []).filter((o: any) => !o.deliveries || o.deliveries.length === 0);
    }
  });

  // Re-assign driver mutation
  const assignDriverMutation = useMutation({
    mutationFn: async ({ orderId, driverId, fee, codAmount }: { orderId: string; driverId: string; fee: number; codAmount: number }) => {
      const { error } = await supabase
        .from("deliveries")
        .upsert({
          order_id: orderId,
          driver_id: driverId,
          status: "assigned",
          delivery_fee: fee,
          cash_to_collect: codAmount,
          cash_collected: 0,
          notes: "Dispatched by administrator."
        }, { onConflict: "order_id" });

      if (error) throw error;

      // Update order status optionally or log status history
      await supabase.from("order_status_history").insert({
        order_id: orderId,
        status: "confirmed",
        note: `Order assigned to driver. Status: dispatched.`
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin_all_deliveries"] });
      queryClient.invalidateQueries({ queryKey: ["admin_pending_dispatch"] });
      setDispatchOrder(null);
      setSelectedDriver("");
    }
  });

  const handleDispatchSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDriver || !dispatchOrder) return;
    setIsDispatching(true);
    setDispatchError(null);
    try {
      const isCod = dispatchOrder.payment_provider === "cod";
      const codAmount = isCod ? Number(dispatchOrder.total) : 0;

      await assignDriverMutation.mutateAsync({
        orderId: dispatchOrder.id,
        driverId: selectedDriver,
        fee: Number(deliveryFee),
        codAmount
      });
    } catch (err: any) {
      setDispatchError(err.message || "Failed to dispatch order.");
    } finally {
      setIsDispatching(false);
    }
  };

  // Logistics metrics calculations
  const totalDeliveries = deliveries.length;
  const completedCount = deliveries.filter((d: any) => d.status === "delivered").length;
  const failedCount = deliveries.filter((d: any) => d.status === "delivery_failed").length;
  const activeCount = deliveries.filter((d: any) => ["assigned", "accepted", "picked_up", "out_for_delivery"].includes(d.status)).length;
  const cashCollected = deliveries.reduce((sum: number, d: any) => sum + Number(d.cash_collected || 0), 0);
  const cashOutstanding = deliveries.reduce((sum: number, d: any) => sum + (d.status !== "delivered" ? Number(d.cash_to_collect || 0) : 0), 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 font-sans">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b pb-5">
        <PageHeader 
          title="Delivery & Logistics Management" 
          description="Dispatch drivers, monitor active delivery zones, track cash collected, and view delivery proofs."
        />
        
        {/* Navigation Tabs */}
        <div className="flex bg-gray-100 p-1 rounded-xl shadow-sm">
          {(["overview", "assignments", "active"] as ActiveTab[]).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
                activeTab === tab ? "bg-white text-black shadow-sm" : "text-gray-500 hover:text-black"
              }`}
            >
              {tab === "overview" && "Overview & Drivers"}
              {tab === "assignments" && `Unassigned Orders (${pendingDispatch.length})`}
              {tab === "active" && `All Dispatch Logs (${deliveries.length})`}
            </button>
          ))}
        </div>
      </div>

      {/* OVERVIEW TAB */}
      {activeTab === "overview" && (
        <div className="space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white border rounded-xl p-4 shadow-sm">
              <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Success Rate</p>
              <p className="text-xl font-bold mt-1 text-green-700">
                {totalDeliveries > 0 ? `${Math.round((completedCount / totalDeliveries) * 100)}%` : "0%"}
              </p>
            </div>
            <div className="bg-white border rounded-xl p-4 shadow-sm">
              <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Active Deliveries</p>
              <p className="text-xl font-bold mt-1 text-yellow-600">{activeCount} Packages</p>
            </div>
            <div className="bg-white border rounded-xl p-4 shadow-sm">
              <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Cash Collected (COD)</p>
              <p className="text-xl font-bold mt-1 text-green-700">${cashCollected.toFixed(2)}</p>
            </div>
            <div className="bg-white border rounded-xl p-4 shadow-sm">
              <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Cash Outstanding</p>
              <p className="text-xl font-bold mt-1 text-red-600">${cashOutstanding.toFixed(2)}</p>
            </div>
          </div>

          {/* Drivers Grid */}
          <div className="bg-white border rounded-2xl p-6 shadow-sm space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-widest text-gray-900 border-b pb-2">Active Drivers Registry</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {drivers.map((drv: any) => {
                const dp = drv.driver_profiles?.[0] || {};
                const name = `${drv.first_name} ${drv.last_name}`;
                return (
                  <div key={drv.id} className="p-4 border rounded-xl bg-gray-50/50 space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-bold text-sm text-gray-900">{name}</h4>
                        <p className="text-[10px] text-gray-400 font-mono mt-0.5">Plate: {dp.plate_number || "N/A"}</p>
                      </div>
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase ${
                        dp.is_active ? "bg-green-100 text-green-800" : "bg-gray-200 text-gray-700"
                      }`}>
                        {dp.is_active ? "Active" : "Offline"}
                      </span>
                    </div>

                    <div className="text-xs space-y-1 text-gray-600 border-t pt-2">
                      <p>Phone: <strong>{drv.phone || "—"}</strong></p>
                      <p>Vehicle: <strong>{dp.vehicle_type || "—"}</strong></p>
                      <p>Zones: <span className="font-semibold text-gray-900">{dp.assigned_zones?.join(", ") || "Mogadishu"}</span></p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* UNASSIGNED ORDERS TAB */}
      {activeTab === "assignments" && (
        <div className="bg-white border rounded-2xl shadow-sm overflow-hidden">
          <div className="p-4 border-b bg-gray-50/50">
            <h4 className="text-sm font-bold uppercase tracking-widest text-gray-900">Pending Driver Dispatch</h4>
            <p className="text-xs text-gray-500 mt-0.5">Assign confirmed orders to active drivers to begin the logistics fulfillment loop.</p>
          </div>

          {dispatchLoading ? (
            <div className="p-8 flex justify-center"><Loader2 className="animate-spin h-8 w-8 text-black" /></div>
          ) : pendingDispatch.length === 0 ? (
            <div className="p-12 text-center text-gray-500">No confirmed orders require driver dispatch.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-100 text-xs font-semibold text-gray-700">
                <thead className="bg-gray-50 text-[10px] font-bold uppercase tracking-wider text-gray-500">
                  <tr>
                    <th className="px-5 py-3 text-left">Order #</th>
                    <th className="px-5 py-3 text-left">Customer</th>
                    <th className="px-5 py-3 text-left">Address</th>
                    <th className="px-5 py-3 text-left">Payment Mode</th>
                    <th className="px-5 py-3 text-right">Order Total</th>
                    <th className="px-5 py-3 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {pendingDispatch.map((o: any) => {
                    const addr = o.shipping_address as any;
                    const customer = o.profile ? `${o.profile.first_name} ${o.profile.last_name}` : addr?.full_name || "Guest";
                    const addressQuery = addr ? `${addr.address_line1}, ${addr.city}` : "N/A";
                    return (
                      <tr key={o.id} className="hover:bg-gray-50/50">
                        <td className="px-5 py-4 font-mono font-bold text-gray-950">{o.order_number}</td>
                        <td className="px-5 py-4">{customer}</td>
                        <td className="px-5 py-4">{addressQuery}</td>
                        <td className="px-5 py-4 uppercase text-[10px]">{o.payment_provider}</td>
                        <td className="px-5 py-4 text-right font-bold">${o.total.toFixed(2)}</td>
                        <td className="px-5 py-4 text-center">
                          <button
                            onClick={() => setDispatchOrder(o)}
                            className="bg-black text-white hover:bg-gray-800 text-[10px] font-bold uppercase px-3 py-1.5 rounded-lg"
                          >
                            Assign Driver
                          </button>
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

      {/* ALL DISPATCH LOGS TAB */}
      {activeTab === "active" && (
        <div className="bg-white border rounded-2xl shadow-sm overflow-hidden">
          <div className="p-4 border-b bg-gray-50/50">
            <h4 className="text-sm font-bold uppercase tracking-widest text-gray-900">Logistics Tracking Registry</h4>
            <p className="text-xs text-gray-500 mt-0.5">Track delivery updates, cash outstanding, and proof documentation.</p>
          </div>

          {deliveriesLoading ? (
            <div className="p-8 flex justify-center"><Loader2 className="animate-spin h-8 w-8 text-black" /></div>
          ) : deliveries.length === 0 ? (
            <div className="p-12 text-center text-gray-500 font-medium">No logistics records found.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-100 text-xs font-semibold text-gray-700">
                <thead className="bg-gray-50 text-[10px] font-bold uppercase tracking-wider text-gray-500">
                  <tr>
                    <th className="px-5 py-3 text-left">Order #</th>
                    <th className="px-5 py-3 text-left">Assigned Driver</th>
                    <th className="px-5 py-3 text-left">Client</th>
                    <th className="px-5 py-3 text-right">Cash Outstanding</th>
                    <th className="px-5 py-3 text-right">Cash Collected</th>
                    <th className="px-5 py-3 text-left">Delivery Proof</th>
                    <th className="px-5 py-3 text-left">Logistics Status</th>
                    <th className="px-5 py-3 text-left">Last Update</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {deliveries.map((del: any) => {
                    const orderObj = del.order;
                    const driverObj = del.driver;
                    const addr = orderObj?.shipping_address as any;
                    const client = orderObj?.profile 
                      ? `${orderObj.profile.first_name} ${orderObj.profile.last_name}`
                      : addr?.full_name || "Guest";

                    const drvName = driverObj 
                      ? `${driverObj.first_name} ${driverObj.last_name}`
                      : "Unassigned";

                    return (
                      <tr key={del.id} className="hover:bg-gray-50/30">
                        <td className="px-5 py-4 font-mono font-bold text-gray-900">{orderObj?.order_number || "—"}</td>
                        <td className="px-5 py-4">{drvName}</td>
                        <td className="px-5 py-4">{client}</td>
                        <td className="px-5 py-4 text-right font-mono font-bold text-red-600">
                          ${del.status !== "delivered" ? Number(del.cash_to_collect || 0).toFixed(2) : "0.00"}
                        </td>
                        <td className="px-5 py-4 text-right font-mono font-bold text-green-700">
                          ${Number(del.cash_collected || 0).toFixed(2)}
                        </td>
                        <td className="px-5 py-4">
                          {del.proof_image_url ? (
                            <button
                              onClick={() => setSelectedProof(del.proof_image_url)}
                              className="text-black hover:underline flex items-center gap-1 font-bold text-[10px] uppercase"
                            >
                              <Eye className="h-3.5 w-3.5" /> View Proof
                            </button>
                          ) : (
                            <span className="text-gray-400 font-normal">No Proof</span>
                          )}
                        </td>
                        <td className="px-5 py-4">
                          <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-gray-100 text-gray-700`}>
                            {del.status}
                          </span>
                        </td>
                        <td className="px-5 py-4 text-gray-500">{new Date(del.updated_at).toLocaleString()}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* DISPATCH ORDER ASSIGN MODAL */}
      {dispatchOrder && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 relative shadow-2xl space-y-5">
            <button 
              onClick={() => setDispatchOrder(null)} 
              className="absolute top-4 right-4 text-gray-400 hover:text-black text-sm font-bold uppercase"
            >
              ✕ Close
            </button>
            <div className="border-b pb-2">
              <h3 className="text-sm font-bold uppercase tracking-widest text-gray-900">Dispatch Order to Driver</h3>
              <p className="text-xs text-gray-500 mt-0.5">Order: INV-{dispatchOrder.order_number}</p>
            </div>

            {dispatchError && <div className="p-3 bg-red-50 text-red-800 text-xs rounded-lg">{dispatchError}</div>}

            <form onSubmit={handleDispatchSubmit} className="space-y-4 text-xs font-bold text-gray-700">
              <div>
                <label className="block uppercase tracking-wider text-[10px] text-gray-500 mb-1">Select Driver</label>
                <select
                  value={selectedDriver}
                  onChange={(e) => setSelectedDriver(e.target.value)}
                  className="w-full border rounded-lg py-2.5 px-3 bg-white focus:ring-black focus:border-black outline-none font-bold uppercase"
                  required
                >
                  <option value="">-- Select Active Driver --</option>
                  {drivers.map((d: any) => (
                    <option key={d.id} value={d.id}>{d.first_name} {d.last_name}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block uppercase tracking-wider text-[10px] text-gray-500 mb-1">Delivery Fee ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={deliveryFee}
                    onChange={(e) => setDeliveryFee(e.target.value)}
                    className="w-full border rounded-lg py-2 px-3 focus:ring-black focus:border-black outline-none font-bold"
                    required
                  />
                </div>
                <div>
                  <label className="block uppercase tracking-wider text-[10px] text-gray-500 mb-1">Cash to Collect ($)</label>
                  <input
                    type="text"
                    value={dispatchOrder.payment_provider === "cod" ? `$${dispatchOrder.total.toFixed(2)}` : "$0.00"}
                    className="w-full border rounded-lg py-2 px-3 bg-gray-50 text-gray-400 font-bold"
                    disabled
                  />
                </div>
              </div>

              <div className="pt-4 flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setDispatchOrder(null)}
                  className="flex-1 h-11 text-xs font-bold uppercase tracking-wider rounded-xl"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isDispatching || !selectedDriver}
                  className="flex-1 h-11 bg-black text-white hover:bg-gray-800 text-xs font-bold uppercase tracking-wider rounded-xl"
                >
                  {isDispatching ? "Dispatching..." : "Confirm Dispatch"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELIVERY PROOF IMAGE PREVIEW MODAL */}
      {selectedProof && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 relative shadow-2xl space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-widest border-b pb-2 text-gray-900">Delivery Proof Documentation</h3>
            <button 
              onClick={() => setSelectedProof(null)} 
              className="absolute top-4 right-4 text-gray-400 hover:text-black text-sm font-bold uppercase"
            >
              ✕ Close
            </button>
            <div className="flex justify-center bg-gray-50 border rounded-xl overflow-hidden max-h-[70vh]">
              <img src={selectedProof} alt="Delivery Proof Attachment" className="object-contain w-full max-h-[60vh]" />
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
