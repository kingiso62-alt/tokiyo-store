import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { PageHeader } from "@/components/admin/PageHeader";
import { DataTable } from "@/components/admin/DataTable";
import {
  fetchAllOrders, updateOrderStatus, fetchOrderStatusHistory, addOrderStatusHistory
} from "@/lib/api";
import { Button } from "@/components/ui/button";
import {
  Printer, Send, Phone, CheckCircle, XCircle, Package, Truck, Award,
  RotateCcw, DollarSign, FileText, Loader2, ArrowLeft, X, MessageSquare, Clipboard
} from "lucide-react";
import { supabase } from "@/lib/supabase";

interface Order {
  id: string;
  order_number: string;
  user_id?: string;
  status: string;
  subtotal: number;
  shipping_fee: number;
  discount_amount: number;
  total: number;
  shipping_address: any;
  billing_address: any;
  created_at: string;
  notes?: string;
  profile?: {
    first_name: string;
    last_name: string;
    email: string;
  };
  order_items?: any[];
}

export function AdminOrders() {
  const queryClient = useQueryClient();
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
  const [showSlip, setShowSlip] = useState(false);
  const [showInvoice, setShowInvoice] = useState(false);
  const [trackingNumber, setTrackingNumber] = useState("");
  const [carrier, setCarrier] = useState("DHL Somalia");
  const [historyNotes, setHistoryNotes] = useState("");
  const [internalNoteInput, setInternalNoteInput] = useState("");

  const { data: dbOrders = [], isLoading } = useQuery({
    queryKey: ["admin_orders"],
    queryFn: fetchAllOrders,
    retry: 1
  });

  const { data: statusHistory = [], refetch: refetchHistory } = useQuery({
    queryKey: ["order_history", selectedOrder?.id],
    queryFn: () => fetchOrderStatusHistory(selectedOrder!.id),
    enabled: !!selectedOrder?.id
  });

  // Notifications state mockup
  const [notificationPreview, setNotificationPreview] = useState<{en: string, so: string} | null>(null);

  const generateNotificationText = (status: string, number: string) => {
    switch (status) {
      case "confirmed":
        return {
          en: `Your order #${number} has been confirmed by Tokiyo Store. Preparing package.`,
          so: `Dalabkaaga #${number} waa la xaqiijiyay. Waxaan diyaarineynaa xirmadaada.`
        };
      case "packed":
        return {
          en: `Your order #${number} is packed and ready for delivery.`,
          so: `Dalabkaaga #${number} waa la xiray, waxaana loo diyaariyay in la raro.`
        };
      case "shipped":
        return {
          en: `Your order #${number} has been shipped via ${carrier}. Tracking: ${trackingNumber || "N/A"}`,
          so: `Dalabkaaga #${number} waa la raray iyada oo la adeegsanayo ${carrier}. Tixraac: ${trackingNumber || "N/A"}`
        };
      case "delivered":
        return {
          en: `Your order #${number} has been delivered successfully. Thank you for shopping with Tokiyo!`,
          so: `Dalabkaaga #${number} si guul leh ayaa loo geeyey. Waad ku mahadsantahay la shaqeynta Tokiyo!`
        };
      case "cancelled":
        return {
          en: `Your order #${number} has been cancelled. Any payments made will be refunded.`,
          so: `Dalabkaaga #${number} waa la baajiyay. Wixii lacag ah ee aad bixisay dib ayaa laguu soo celin doonaa.`
        };
      default:
        return null;
    }
  };

  const handleUpdateStatus = async (newStatus: string) => {
    if (!selectedOrder) return;
    try {
      const note = historyNotes.trim() || `Status updated to ${newStatus}`;
      await updateOrderStatus(selectedOrder.id, newStatus as any);
      await addOrderStatusHistory(selectedOrder.id, newStatus, note);
      
      const preview = generateNotificationText(newStatus, selectedOrder.order_number);
      if (preview) setNotificationPreview(preview);

      setHistoryNotes("");
      refetchHistory();
      queryClient.invalidateQueries({ queryKey: ["admin_orders"] });
      // Update selected order locally
      setSelectedOrder({ ...selectedOrder, status: newStatus });
    } catch (err: any) {
      alert("Error: " + err.message);
    }
  };

  const handleAddInternalNote = async () => {
    if (!selectedOrder || !internalNoteInput.trim()) return;
    try {
      const { error } = await supabase
        .from("orders")
        .update({ notes: internalNoteInput.trim() })
        .eq("id", selectedOrder.id);
      if (error) throw error;
      setSelectedOrder({ ...selectedOrder, notes: internalNoteInput.trim() });
      setInternalNoteInput("");
      alert("Internal note added! / Fariinta maamulka waa la kaydiyay!");
    } catch (err: any) {
      alert(err.message);
    }
  };

  const ordersList = dbOrders.map(o => ({
    id: o.id,
    order_number: o.order_number,
    customer: o.profile ? `${o.profile.first_name} ${o.profile.last_name}` : "Guest",
    email: (o.profile as any)?.email || (o.shipping_address as any)?.email || "N/A",
    date: new Date(o.created_at).toLocaleDateString(),
    total: o.total,
    payment: (o.shipping_address as any)?.payment_method || "Stripe",
    status: o.status,
    raw: o
  }));

  const columns = [
    {
      key: "order_number",
      header: "Order #",
      render: (row: any) => <span className="font-bold text-gray-900 font-mono">{row.order_number}</span>
    },
    { 
      key: "customer", 
      header: "Customer",
      render: (row: any) => (
        <div>
          <div className="font-bold text-gray-900">{row.customer}</div>
          <div className="text-gray-500 text-xs">{row.email}</div>
        </div>
      )
    },
    { key: "date", header: "Date" },
    { 
      key: "total", 
      header: "Total",
      render: (row: any) => <div className="font-bold">${row.total.toFixed(2)}</div>
    },
    {
      key: "payment",
      header: "Payment",
      render: (row: any) => <span className="text-xs font-semibold uppercase">{row.payment.replace(/_/g, " ")}</span>
    },
    {
      key: "status",
      header: "Status",
      render: (row: any) => {
        let color = "bg-gray-100 text-gray-800";
        if (row.status === "delivered" || row.status === "paid") color = "bg-green-100 text-green-800";
        if (row.status === "processing" || row.status === "shipped") color = "bg-blue-100 text-blue-800";
        if (row.status === "pending" || row.status === "awaiting_payment") color = "bg-yellow-100 text-yellow-800";
        if (row.status === "cancelled" || row.status === "returned") color = "bg-red-100 text-red-800";
        
        return (
          <span className={`px-2.5 py-0.5 inline-flex text-[10px] leading-5 font-bold rounded-full uppercase tracking-wider ${color}`}>
            {row.status}
          </span>
        );
      }
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* Detail Panel */}
      {selectedOrder ? (
        <div className="space-y-8">
          <div className="flex justify-between items-center border-b pb-4">
            <button onClick={() => setSelectedOrder(null)} className="flex items-center text-sm font-semibold text-gray-600 hover:text-black gap-1">
              <ArrowLeft className="h-4 w-4" /> Back to Orders List
            </button>
            <div className="flex gap-2">
              <Button onClick={() => setShowSlip(true)} className="bg-gray-100 text-gray-800 hover:bg-gray-200 text-xs px-4 h-10 gap-1.5 uppercase font-bold tracking-wider">
                <Clipboard className="h-4 w-4" /> Packing Slip
              </Button>
              <Button onClick={() => setShowInvoice(true)} className="bg-gray-100 text-gray-800 hover:bg-gray-200 text-xs px-4 h-10 gap-1.5 uppercase font-bold tracking-wider">
                <Printer className="h-4 w-4" /> Invoice
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left/Middle: Info & Actions */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Customer and Shipping Details */}
              <div className="bg-white border rounded-2xl p-6 shadow-sm space-y-4">
                <h3 className="text-sm font-bold uppercase tracking-wider text-gray-900 border-b pb-2">Customer & Fulfill Details</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-700">
                  <div>
                    <span className="font-bold text-xs uppercase text-gray-400 block">Deliver To</span>
                    <p className="font-bold text-gray-900 mt-0.5">{selectedOrder.shipping_address?.first_name} {selectedOrder.shipping_address?.last_name}</p>
                    <p>{selectedOrder.shipping_address?.address_line1}</p>
                    <p>{selectedOrder.shipping_address?.city}, {selectedOrder.shipping_address?.state}</p>
                  </div>
                  <div>
                    <span className="font-bold text-xs uppercase text-gray-400 block">Contact</span>
                    <p className="mt-0.5 flex items-center gap-1"><Phone className="h-4 w-4 text-gray-400" /> {selectedOrder.shipping_address?.phone}</p>
                    <p className="text-xs text-gray-500 font-mono mt-1">Payment Method: {selectedOrder.shipping_address?.payment_method?.replace(/_/g, " ").toUpperCase()}</p>
                  </div>
                </div>
              </div>

              {/* Items List */}
              <div className="bg-white border rounded-2xl p-6 shadow-sm">
                <h3 className="text-sm font-bold uppercase tracking-wider text-gray-900 border-b pb-2 mb-4">Ordered Items</h3>
                <div className="divide-y divide-gray-100">
                  {selectedOrder.order_items?.map((item: any, idx: number) => (
                    <div key={idx} className="py-3 flex justify-between items-center text-sm">
                      <div>
                        <p className="font-bold text-gray-900">{item.product_title || "Product item"}</p>
                        <p className="text-xs text-gray-500">Size: {item.size} | Color: {item.color} | Qty: {item.quantity}</p>
                      </div>
                      <span className="font-bold text-gray-900">${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                  <div className="pt-4 border-t border-gray-200 text-sm space-y-1.5 text-right">
                    <p className="text-gray-500">Subtotal: <strong className="text-gray-900 font-bold">${selectedOrder.subtotal.toFixed(2)}</strong></p>
                    <p className="text-gray-500">Shipping: <strong className="text-gray-900 font-bold">${selectedOrder.shipping_fee.toFixed(2)}</strong></p>
                    <p className="text-gray-500">Discounts: <strong className="text-red-600 font-bold">-${selectedOrder.discount_amount.toFixed(2)}</strong></p>
                    <p className="text-lg font-extrabold text-gray-900 border-t pt-1.5">Total: ${selectedOrder.total.toFixed(2)}</p>
                  </div>
                </div>
              </div>

              {/* Transition actions */}
              <div className="bg-white border rounded-2xl p-6 shadow-sm space-y-4">
                <h3 className="text-sm font-bold uppercase tracking-wider text-gray-900 border-b pb-2">Fulfillment Workflow Controls</h3>
                
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <Button onClick={() => handleUpdateStatus("confirmed")} className="bg-black text-white hover:bg-gray-800 text-xs py-2 h-10">
                    <CheckCircle className="h-4 w-4 mr-1.5" /> Confirm Order
                  </Button>
                  <Button onClick={() => handleUpdateStatus("packed")} className="bg-black text-white hover:bg-gray-800 text-xs py-2 h-10">
                    <Package className="h-4 w-4 mr-1.5" /> Pack Order
                  </Button>
                  <Button onClick={() => handleUpdateStatus("shipped")} className="bg-black text-white hover:bg-gray-800 text-xs py-2 h-10">
                    <Truck className="h-4 w-4 mr-1.5" /> Ship Order
                  </Button>
                  <Button onClick={() => handleUpdateStatus("delivered")} className="bg-black text-white hover:bg-gray-800 text-xs py-2 h-10">
                    <Award className="h-4 w-4 mr-1.5" /> Deliver Order
                  </Button>
                  <Button onClick={() => handleUpdateStatus("cancelled")} className="bg-red-50 text-red-800 border border-red-200 hover:bg-red-100 text-xs py-2 h-10">
                    <XCircle className="h-4 w-4 mr-1.5" /> Cancel Order
                  </Button>
                  <Button onClick={() => handleUpdateStatus("refunded")} className="bg-red-50 text-red-800 border border-red-200 hover:bg-red-100 text-xs py-2 h-10">
                    <RotateCcw className="h-4 w-4 mr-1.5" /> Issue Refund
                  </Button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t">
                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Carrier Name</label>
                    <input type="text" value={carrier} onChange={(e) => setCarrier(e.target.value)} className="w-full border rounded p-2 text-xs outline-none focus:border-black" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Tracking Number</label>
                    <input type="text" value={trackingNumber} onChange={(e) => setTrackingNumber(e.target.value)} className="w-full border rounded p-2 text-xs outline-none focus:border-black" />
                  </div>
                </div>

                <div className="space-y-2 pt-2">
                  <label className="block text-[10px] font-bold text-gray-500 uppercase">Transition Notes (Logged in status history)</label>
                  <textarea rows={2} value={historyNotes} onChange={(e) => setHistoryNotes(e.target.value)} placeholder="e.g. Card verified successfully or assigned to courier" className="w-full border rounded p-2.5 text-xs outline-none focus:border-black" />
                </div>
              </div>
            </div>

            {/* Right Column: Status Log & Notes */}
            <div className="space-y-6">
              
              {/* Internal Notes widget */}
              <div className="bg-white border rounded-2xl p-6 shadow-sm space-y-4">
                <h3 className="text-sm font-bold uppercase tracking-wider text-gray-900 border-b pb-2">Internal Order Notes</h3>
                {selectedOrder.notes && (
                  <p className="bg-yellow-50 text-yellow-800 border border-yellow-100 p-3 rounded-lg text-xs font-medium leading-relaxed italic">
                    {selectedOrder.notes}
                  </p>
                )}
                <div className="space-y-2">
                  <textarea 
                    rows={2} 
                    value={internalNoteInput} 
                    onChange={(e) => setInternalNoteInput(e.target.value)} 
                    placeholder="Enter internal comment for warehouse staff..."
                    className="w-full border border-gray-300 rounded-lg p-2.5 text-xs outline-none" 
                  />
                  <Button onClick={handleAddInternalNote} className="w-full bg-black text-white hover:bg-gray-800 text-xs h-9 uppercase tracking-wider">
                    Save Note
                  </Button>
                </div>
              </div>

              {/* Status history tracking log */}
              <div className="bg-white border rounded-2xl p-6 shadow-sm space-y-4">
                <h3 className="text-sm font-bold uppercase tracking-wider text-gray-900 border-b pb-2">Order History Timeline</h3>
                <div className="relative border-l border-gray-200 pl-4 space-y-5">
                  {statusHistory.map((h: any, idx: number) => (
                    <div key={idx} className="relative text-xs">
                      <div className="absolute -left-[21px] mt-1 h-2 w-2 rounded-full bg-black ring-4 ring-white" />
                      <p className="font-bold text-gray-900 uppercase text-[10px] tracking-wide">{h.status}</p>
                      <p className="text-gray-500 mt-0.5">{h.note || "No comments"}</p>
                      <span className="text-[10px] text-gray-400 font-mono block mt-1">{new Date(h.created_at).toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Notification preview */}
              {notificationPreview && (
                <div className="p-4 bg-blue-50 border border-blue-200 text-blue-800 rounded-xl space-y-2 text-xs">
                  <p className="font-bold flex items-center gap-1"><MessageSquare className="h-4 w-4" /> Bilingual notification sent to customer:</p>
                  <div>
                    <span className="font-bold text-[10px] text-blue-600 uppercase tracking-widest block">English Alert</span>
                    <p className="mt-0.5">{notificationPreview.en}</p>
                  </div>
                  <div>
                    <span className="font-bold text-[10px] text-blue-600 uppercase tracking-widest block">Somali Alert</span>
                    <p className="mt-0.5">{notificationPreview.so}</p>
                  </div>
                </div>
              )}

            </div>
          </div>

          {/* PRINT MOCKS */}
          {showSlip && (
            <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
              <div className="bg-white border rounded-2xl w-full max-w-2xl p-8 relative shadow-2xl space-y-6">
                <button onClick={() => setShowSlip(false)} className="absolute top-4 right-4 text-gray-400 hover:text-black">
                  <X className="h-5 w-5" />
                </button>
                <div className="border-b pb-4 text-center">
                  <h2 className="text-xl font-bold uppercase tracking-widest text-gray-900">TOKIYO STORE PACKING SLIP</h2>
                  <p className="text-xs text-gray-500">Order: {selectedOrder.order_number} | Date: {new Date(selectedOrder.created_at).toLocaleDateString()}</p>
                </div>
                <div className="text-xs text-gray-700 space-y-1">
                  <p className="font-bold">Ship To Ciwaanka:</p>
                  <p>{selectedOrder.shipping_address?.first_name} {selectedOrder.shipping_address?.last_name}</p>
                  <p>{selectedOrder.shipping_address?.address_line1}</p>
                  <p>{selectedOrder.shipping_address?.city}, {selectedOrder.shipping_address?.state}</p>
                  <p>Tel: {selectedOrder.shipping_address?.phone}</p>
                </div>
                <table className="w-full text-xs text-left border-collapse mt-4">
                  <thead>
                    <tr className="bg-gray-50 text-[10px] uppercase font-bold text-gray-500">
                      <th className="p-2 border">Item Details</th>
                      <th className="p-2 border text-center">Qty</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedOrder.order_items?.map((item: any, i: number) => (
                      <tr key={i}>
                        <td className="p-2 border font-semibold">{item.product_title} (Size: {item.size}, Color: {item.color})</td>
                        <td className="p-2 border text-center font-semibold">{item.quantity}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="flex justify-end pt-4 border-t gap-2">
                  <Button onClick={() => window.print()} className="bg-black text-white hover:bg-gray-800 text-xs px-5 h-10 gap-1.5 uppercase font-bold tracking-wider">
                    <Printer className="h-4 w-4" /> Print Slip
                  </Button>
                </div>
              </div>
            </div>
          )}

          {showInvoice && (
            <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
              <div className="bg-white border rounded-2xl w-full max-w-2xl p-8 relative shadow-2xl space-y-6">
                <button onClick={() => setShowInvoice(false)} className="absolute top-4 right-4 text-gray-400 hover:text-black">
                  <X className="h-5 w-5" />
                </button>
                <div className="flex justify-between border-b pb-4">
                  <div>
                    <h2 className="text-xl font-bold uppercase tracking-tight text-gray-900">TOKIYO STORE</h2>
                    <p className="text-[10px] text-gray-500">Mogadishu, Somalia</p>
                  </div>
                  <div className="text-right">
                    <h3 className="text-sm font-bold text-gray-900 uppercase">Official Invoice</h3>
                    <p className="text-xs text-gray-500 font-mono">Invoice: INV-{selectedOrder.order_number}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 text-xs text-gray-700">
                  <div>
                    <p className="font-bold uppercase text-gray-400 text-[10px]">Billed To:</p>
                    <p className="font-bold text-gray-900 mt-0.5">{selectedOrder.shipping_address?.first_name} {selectedOrder.shipping_address?.last_name}</p>
                    <p>{selectedOrder.shipping_address?.address_line1}</p>
                    <p>{selectedOrder.shipping_address?.city}, {selectedOrder.shipping_address?.state}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold uppercase text-gray-400 text-[10px]">Order Date:</p>
                    <p className="font-bold text-gray-900 mt-0.5">{new Date(selectedOrder.created_at).toLocaleDateString()}</p>
                  </div>
                </div>
                <table className="w-full text-xs text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50 text-[10px] uppercase font-bold text-gray-500">
                      <th className="p-2 border">Item Details</th>
                      <th className="p-2 border text-center">Qty</th>
                      <th className="p-2 border text-right">Price</th>
                      <th className="p-2 border text-right">Subtotal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedOrder.order_items?.map((item: any, i: number) => (
                      <tr key={i}>
                        <td className="p-2 border font-semibold">{item.product_title} (Size: {item.size}, Color: {item.color})</td>
                        <td className="p-2 border text-center">{item.quantity}</td>
                        <td className="p-2 border text-right">${item.price.toFixed(2)}</td>
                        <td className="p-2 border text-right font-bold">${(item.price * item.quantity).toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="pt-2 text-right text-xs space-y-1.5">
                  <p className="text-gray-500">Subtotal: <strong className="text-gray-900 font-bold">${selectedOrder.subtotal.toFixed(2)}</strong></p>
                  <p className="text-gray-500">Shipping: <strong className="text-gray-900 font-bold">${selectedOrder.shipping_fee.toFixed(2)}</strong></p>
                  <p className="text-gray-500">Discounts: <strong className="text-red-600 font-bold">-${selectedOrder.discount_amount.toFixed(2)}</strong></p>
                  <p className="text-base font-extrabold text-gray-900 border-t pt-1.5">Invoice Total: ${selectedOrder.total.toFixed(2)}</p>
                </div>
                <div className="flex justify-end pt-4 border-t gap-2">
                  <Button onClick={() => window.print()} className="bg-black text-white hover:bg-gray-800 text-xs px-5 h-10 gap-1.5 uppercase font-bold tracking-wider">
                    <Printer className="h-4 w-4" /> Print Invoice
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* List View */
        <div className="space-y-6">
          <PageHeader 
            title="Orders Management / Dalabaadka" 
            description="Manage and fulfill customer orders, print slips, verify payments, and log order status history."
            showExport={true}
          />

          {isLoading ? (
            <div className="flex justify-center items-center h-64 bg-white rounded-xl shadow-sm border border-gray-200">
              <Loader2 className="animate-spin h-8 w-8 text-black" />
            </div>
          ) : (
            <DataTable 
              columns={columns} 
              data={ordersList} 
              onEdit={(id) => {
                const ord = ordersList.find(o => o.id === id);
                if (ord) setSelectedOrder(ord.raw);
              }}
            />
          )}
        </div>
      )}
    </div>
  );
}
