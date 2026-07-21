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
  RotateCcw, DollarSign, FileText, Loader2, ArrowLeft, X, MessageSquare, Clipboard, User, MapPin, Calendar, CreditCard, Tag
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
      case "processing":
        return {
          en: `Your order #${number} is currently being processed by our team.`,
          so: `Dalabkaaga #${number} hadda ayaa la diyaarinayaa.`
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
      case "out_for_delivery":
        return {
          en: `Your order #${number} is out for delivery! Our agent will contact you soon.`,
          so: `Dalabkaaga #${number} waa soo socdaa! Wakiilkeena ayaa kula soo xiriiri doona dhowaan.`
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
      const updatedOrder = await updateOrderStatus(selectedOrder.id, newStatus as any);
      await addOrderStatusHistory(selectedOrder.id, newStatus, note);
      
      const preview = generateNotificationText(newStatus, selectedOrder.order_number);
      if (preview) setNotificationPreview(preview);

      setHistoryNotes("");
      setSelectedOrder(updatedOrder);
      refetchHistory();
      queryClient.invalidateQueries({ queryKey: ["admin_orders"] });
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
      render: (row: any) => <span className="font-bold text-[#6777ef] hover:underline cursor-pointer">{row.order_number}</span>
    },
    { 
      key: "customer", 
      header: "Customer",
      render: (row: any) => (
        <div>
          <div className="font-bold text-[#191d21]">{row.customer}</div>
          <div className="text-[#98a6ad] text-[12px]">{row.email}</div>
        </div>
      )
    },
    { key: "date", header: "Date" },
    { 
      key: "total", 
      header: "Total",
      render: (row: any) => <div className="font-bold text-[#191d21]">${Number(row.total || 0).toFixed(2)}</div>
    },
    {
      key: "payment",
      header: "Payment",
      render: (row: any) => <span className="text-[12px] font-semibold text-[#6c757d] uppercase">{row.payment.replace(/_/g, " ")}</span>
    },
    {
      key: "status",
      header: "Status",
      render: (row: any) => {
        let color = "bg-[#e3eaef] text-[#4d5154]"; // default gray
        if (row.status === "delivered" || row.status === "paid") color = "bg-[#47c363] text-white shadow-[0_2px_6px_rgba(71,195,99,0.2)]";
        else if (row.status === "processing" || row.status === "packed" || row.status === "shipped" || row.status === "out_for_delivery") color = "bg-[#3abaf4] text-white shadow-[0_2px_6px_rgba(58,186,244,0.2)]";
        else if (row.status === "pending" || row.status === "awaiting_payment" || row.status === "confirmed") color = "bg-[#ffa426] text-white shadow-[0_2px_6px_rgba(255,164,38,0.2)]";
        else if (row.status === "cancelled" || row.status === "returned" || row.status === "refunded") color = "bg-[#fc544b] text-white shadow-[0_2px_6px_rgba(252,84,75,0.2)]";
        
        return (
          <span className={`px-3 py-1 inline-flex text-[11px] leading-4 font-bold rounded-full uppercase tracking-wider ${color}`}>
            {row.status}
          </span>
        );
      }
    }
  ];

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-full">
      
      {/* Detail Panel */}
      {selectedOrder ? (
        <div className="space-y-6">
          <div className="flex justify-between items-center bg-white p-4 rounded-lg shadow-[0_4px_8px_rgba(0,0,0,0.03)] mb-4">
            <button onClick={() => setSelectedOrder(null)} className="flex items-center text-[14px] font-semibold text-[#6777ef] hover:text-[#5563c1] transition-colors gap-1.5">
              <ArrowLeft className="h-4 w-4" /> Back to Orders
            </button>
            <div className="flex gap-2">
              <Button onClick={() => setShowSlip(true)} className="bg-white text-[#6777ef] border border-[#6777ef] hover:bg-[#6777ef] hover:text-white text-[13px] px-4 h-9 gap-1.5 transition-all">
                <Clipboard className="h-4 w-4" /> Packing Slip
              </Button>
              <Button onClick={() => setShowInvoice(true)} className="bg-[#6777ef] text-white hover:bg-[#5563c1] shadow-[0_2px_6px_rgba(103,119,239,0.4)] text-[13px] px-4 h-9 gap-1.5 transition-all">
                <Printer className="h-4 w-4" /> Print Invoice
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            
            {/* Left/Middle: Info & Actions */}
            <div className="xl:col-span-2 space-y-6">
              
              {/* Order Header Summary */}
              <div className="bg-white rounded-lg shadow-[0_4px_8px_rgba(0,0,0,0.03)] border-l-4 border-[#6777ef] p-6">
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                  <div>
                    <h2 className="text-xl font-bold text-[#191d21] flex items-center gap-2">
                      Order {selectedOrder.order_number}
                    </h2>
                    <p className="text-[#98a6ad] text-[13px] flex items-center gap-1 mt-1">
                      <Calendar className="h-3.5 w-3.5" /> Placed on {new Date(selectedOrder.created_at).toLocaleString()}
                    </p>
                  </div>
                  <div className="text-left sm:text-right">
                    <span className={`px-4 py-1.5 text-[12px] font-bold rounded-full uppercase tracking-wider inline-block
                      ${selectedOrder.status === 'delivered' ? 'bg-[#47c363] text-white shadow-[0_2px_6px_rgba(71,195,99,0.2)]' :
                        ['pending', 'awaiting_payment', 'confirmed'].includes(selectedOrder.status) ? 'bg-[#ffa426] text-white shadow-[0_2px_6px_rgba(255,164,38,0.2)]' :
                        ['cancelled', 'returned', 'refunded'].includes(selectedOrder.status) ? 'bg-[#fc544b] text-white shadow-[0_2px_6px_rgba(252,84,75,0.2)]' :
                        'bg-[#3abaf4] text-white shadow-[0_2px_6px_rgba(58,186,244,0.2)]'
                      }
                    `}>
                      {selectedOrder.status}
                    </span>
                  </div>
                </div>
              </div>

              {/* Customer and Shipping Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white rounded-lg shadow-[0_4px_8px_rgba(0,0,0,0.03)] p-6">
                  <h3 className="text-[15px] font-bold text-[#191d21] border-b border-[#f3f4f6] pb-3 mb-4 flex items-center gap-2">
                    <User className="h-4 w-4 text-[#6777ef]" /> Customer Details
                  </h3>
                  <div className="space-y-3 text-[14px]">
                    <p className="font-semibold text-[#191d21]">{selectedOrder.shipping_address?.first_name} {selectedOrder.shipping_address?.last_name}</p>
                    <p className="flex items-center gap-2 text-[#6c757d]">
                      <MessageSquare className="h-4 w-4 text-[#98a6ad]" /> {(selectedOrder.profile as any)?.email || selectedOrder.shipping_address?.email || "No email"}
                    </p>
                    <p className="flex items-center gap-2 text-[#6c757d]">
                      <Phone className="h-4 w-4 text-[#98a6ad]" /> {selectedOrder.shipping_address?.phone || "No phone"}
                    </p>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-[0_4px_8px_rgba(0,0,0,0.03)] p-6">
                  <h3 className="text-[15px] font-bold text-[#191d21] border-b border-[#f3f4f6] pb-3 mb-4 flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-[#6777ef]" /> Shipping Address
                  </h3>
                  <div className="space-y-1 text-[14px] text-[#6c757d]">
                    <p className="text-[#191d21] font-medium">{selectedOrder.shipping_address?.address_line1}</p>
                    {selectedOrder.shipping_address?.address_line2 && <p>{selectedOrder.shipping_address?.address_line2}</p>}
                    <p>{selectedOrder.shipping_address?.city}, {selectedOrder.shipping_address?.state} {selectedOrder.shipping_address?.postal_code}</p>
                    <p>{selectedOrder.shipping_address?.country}</p>
                  </div>
                </div>
              </div>

              {/* Items List */}
              <div className="bg-white rounded-lg shadow-[0_4px_8px_rgba(0,0,0,0.03)] p-0 overflow-hidden">
                <div className="p-5 border-b border-[#f3f4f6] bg-gray-50/50">
                  <h3 className="text-[15px] font-bold text-[#191d21] flex items-center gap-2">
                    <Package className="h-4 w-4 text-[#6777ef]" /> Ordered Items
                  </h3>
                </div>
                <div className="p-0">
                  <table className="w-full text-left">
                    <thead className="bg-[#fdfdff] text-[#98a6ad] text-[12px] uppercase">
                      <tr>
                        <th className="px-6 py-3 font-semibold border-b border-[#f3f4f6]">Product</th>
                        <th className="px-6 py-3 font-semibold border-b border-[#f3f4f6] text-center">Qty</th>
                        <th className="px-6 py-3 font-semibold border-b border-[#f3f4f6] text-right">Price</th>
                        <th className="px-6 py-3 font-semibold border-b border-[#f3f4f6] text-right">Total</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#f3f4f6]">
                      {selectedOrder.order_items?.map((item: any, idx: number) => (
                        <tr key={idx} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4">
                            <p className="font-bold text-[#191d21] text-[14px]">{item.product_title || item.product_name || "Product item"}</p>
                            <p className="text-[12px] text-[#98a6ad] mt-0.5">
                              {item.size && `Size: ${item.size}`} {item.color && `| Color: ${item.color}`}
                            </p>
                          </td>
                          <td className="px-6 py-4 text-center text-[#191d21] font-medium">{item.quantity}</td>
                          <td className="px-6 py-4 text-right text-[#6c757d]">${Number(item.price || 0).toFixed(2)}</td>
                          <td className="px-6 py-4 text-right text-[#191d21] font-bold">${(Number(item.price || 0) * Number(item.quantity || 1)).toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  
                  {/* Totals */}
                  <div className="bg-[#fdfdff] p-6 border-t border-[#f3f4f6]">
                    <div className="w-full md:w-1/2 ml-auto space-y-3">
                      <div className="flex justify-between text-[14px] text-[#6c757d]">
                        <span>Subtotal:</span>
                        <strong className="text-[#191d21]">${Number(selectedOrder.subtotal || 0).toFixed(2)}</strong>
                      </div>
                      <div className="flex justify-between text-[14px] text-[#6c757d]">
                        <span>Shipping:</span>
                        <strong className="text-[#191d21]">${Number(selectedOrder.shipping_fee || 0).toFixed(2)}</strong>
                      </div>
                      {Number(selectedOrder.discount_total || selectedOrder.discount_amount || 0) > 0 && (
                        <div className="flex justify-between text-[14px] text-[#fc544b]">
                          <span>Discount:</span>
                          <strong>-${Number(selectedOrder.discount_total || selectedOrder.discount_amount || 0).toFixed(2)}</strong>
                        </div>
                      )}
                      <div className="flex justify-between text-[18px] font-black text-[#6777ef] border-t border-[#e4e6fc] pt-3 mt-2">
                        <span>Total:</span>
                        <span>${Number(selectedOrder.total || 0).toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Transition actions */}
              <div className="bg-white rounded-lg shadow-[0_4px_8px_rgba(0,0,0,0.03)] p-6 space-y-5 border-l-4 border-[#3abaf4]">
                <h3 className="text-[15px] font-bold text-[#191d21] flex items-center gap-2">
                  <Truck className="h-4 w-4 text-[#3abaf4]" /> Fulfillment Workflow
                </h3>
                
                <div className="flex flex-wrap gap-2">
                  <Button onClick={() => handleUpdateStatus("confirmed")} className="bg-white text-[#6c757d] border border-[#e4e6fc] hover:border-[#6777ef] hover:text-[#6777ef] text-[13px] py-2 h-10">
                    <CheckCircle className="h-4 w-4 mr-1.5" /> Confirm
                  </Button>
                  <Button onClick={() => handleUpdateStatus("processing")} className="bg-white text-[#6c757d] border border-[#e4e6fc] hover:border-[#ffa426] hover:text-[#ffa426] text-[13px] py-2 h-10">
                    <Loader2 className="h-4 w-4 mr-1.5" /> Process
                  </Button>
                  <Button onClick={() => handleUpdateStatus("packed")} className="bg-white text-[#6c757d] border border-[#e4e6fc] hover:border-[#ffa426] hover:text-[#ffa426] text-[13px] py-2 h-10">
                    <Package className="h-4 w-4 mr-1.5" /> Pack
                  </Button>
                  <Button onClick={() => handleUpdateStatus("shipped")} className="bg-[#3abaf4] text-white hover:bg-[#259cd3] shadow-[0_2px_6px_rgba(58,186,244,0.4)] text-[13px] py-2 h-10">
                    <Truck className="h-4 w-4 mr-1.5" /> Ship Order
                  </Button>
                  <Button onClick={() => handleUpdateStatus("out_for_delivery")} className="bg-[#3abaf4] text-white hover:bg-[#259cd3] shadow-[0_2px_6px_rgba(58,186,244,0.4)] text-[13px] py-2 h-10">
                    <MapPin className="h-4 w-4 mr-1.5" /> Out for Delivery
                  </Button>
                  <Button onClick={() => handleUpdateStatus("delivered")} className="bg-[#47c363] text-white hover:bg-[#39a350] shadow-[0_2px_6px_rgba(71,195,99,0.4)] text-[13px] py-2 h-10">
                    <Award className="h-4 w-4 mr-1.5" /> Deliver
                  </Button>
                  <Button onClick={() => handleUpdateStatus("cancelled")} className="bg-white text-[#fc544b] border border-[#fc544b] hover:bg-[#fc544b] hover:text-white transition-colors text-[13px] py-2 h-10 ml-auto">
                    <XCircle className="h-4 w-4 mr-1.5" /> Cancel
                  </Button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-[#f3f4f6]">
                  <div>
                    <label className="block text-[12px] font-semibold text-[#6c757d] mb-1.5">Carrier Name</label>
                    <input type="text" value={carrier} onChange={(e) => setCarrier(e.target.value)} className="w-full bg-[#fdfdff] border border-[#e4e6fc] rounded p-2.5 text-[13px] outline-none focus:border-[#6777ef] focus:ring-1 focus:ring-[#6777ef] transition-all" />
                  </div>
                  <div>
                    <label className="block text-[12px] font-semibold text-[#6c757d] mb-1.5">Tracking Number</label>
                    <input type="text" value={trackingNumber} onChange={(e) => setTrackingNumber(e.target.value)} className="w-full bg-[#fdfdff] border border-[#e4e6fc] rounded p-2.5 text-[13px] outline-none focus:border-[#6777ef] focus:ring-1 focus:ring-[#6777ef] transition-all" />
                  </div>
                </div>

                <div className="space-y-2 pt-2">
                  <label className="block text-[12px] font-semibold text-[#6c757d]">Transition Notes (Sent to customer & logged)</label>
                  <textarea rows={2} value={historyNotes} onChange={(e) => setHistoryNotes(e.target.value)} placeholder="e.g. Dispatched via DHL" className="w-full bg-[#fdfdff] border border-[#e4e6fc] rounded p-2.5 text-[13px] outline-none focus:border-[#6777ef] focus:ring-1 focus:ring-[#6777ef] transition-all" />
                </div>
              </div>
            </div>

            {/* Right Column: Status Log & Notes */}
            <div className="space-y-6">
              
              {/* Payment Summary */}
              <div className="bg-white rounded-lg shadow-[0_4px_8px_rgba(0,0,0,0.03)] p-6 space-y-3">
                <h3 className="text-[15px] font-bold text-[#191d21] border-b border-[#f3f4f6] pb-3 mb-2 flex items-center gap-2">
                  <CreditCard className="h-4 w-4 text-[#6777ef]" /> Payment Details
                </h3>
                <div className="flex justify-between items-center text-[14px]">
                  <span className="text-[#6c757d]">Method</span>
                  <span className="font-bold uppercase text-[#191d21]">{selectedOrder.shipping_address?.payment_method?.replace(/_/g, " ") || "STRIPE"}</span>
                </div>
                <div className="flex justify-between items-center text-[14px]">
                  <span className="text-[#6c757d]">Status</span>
                  <span className="font-bold text-[#47c363]">PAID</span>
                </div>
                <div className="flex justify-between items-center text-[14px]">
                  <span className="text-[#6c757d]">Txn ID</span>
                  <span className="text-[#98a6ad] font-mono text-[12px]">N/A</span>
                </div>
              </div>

              {/* Internal Notes widget */}
              <div className="bg-white rounded-lg shadow-[0_4px_8px_rgba(0,0,0,0.03)] p-6 space-y-4 border-t-4 border-[#ffa426]">
                <h3 className="text-[15px] font-bold text-[#191d21] flex items-center gap-2">
                  <Tag className="h-4 w-4 text-[#ffa426]" /> Internal Notes
                </h3>
                {selectedOrder.notes && (
                  <p className="bg-[#fff9f1] text-[#ffa426] border border-[#ffe4c4] p-3 rounded text-[13px] font-medium leading-relaxed italic">
                    {selectedOrder.notes}
                  </p>
                )}
                <div className="space-y-3">
                  <textarea 
                    rows={2} 
                    value={internalNoteInput} 
                    onChange={(e) => setInternalNoteInput(e.target.value)} 
                    placeholder="Staff notes (Not visible to customer)..."
                    className="w-full bg-[#fdfdff] border border-[#e4e6fc] rounded p-2.5 text-[13px] outline-none focus:border-[#ffa426] focus:ring-1 focus:ring-[#ffa426] transition-all" 
                  />
                  <Button onClick={handleAddInternalNote} className="w-full bg-white text-[#ffa426] border border-[#ffa426] hover:bg-[#ffa426] hover:text-white text-[13px] h-9">
                    Save Internal Note
                  </Button>
                </div>
              </div>

              {/* Status history tracking log */}
              <div className="bg-white rounded-lg shadow-[0_4px_8px_rgba(0,0,0,0.03)] p-6 space-y-4">
                <h3 className="text-[15px] font-bold text-[#191d21] border-b border-[#f3f4f6] pb-3 mb-4">Order Timeline</h3>
                <div className="relative border-l-2 border-[#e4e6fc] pl-5 space-y-6">
                  {statusHistory.map((h: any, idx: number) => (
                    <div key={idx} className="relative text-[13px]">
                      <div className="absolute -left-[27px] mt-1 h-3 w-3 rounded-full bg-[#6777ef] ring-4 ring-white shadow-sm" />
                      <p className="font-bold text-[#191d21] uppercase tracking-wide">{h.status}</p>
                      <p className="text-[#6c757d] mt-1">{h.note || "System update"}</p>
                      <span className="text-[11px] text-[#98a6ad] mt-1.5 block">{new Date(h.created_at).toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Notification preview */}
              {notificationPreview && (
                <div className="p-4 bg-[#e8f2fc] border border-[#c1dcf8] text-[#1e5b99] rounded-lg space-y-3 text-[13px]">
                  <p className="font-bold flex items-center gap-1.5"><MessageSquare className="h-4 w-4" /> Notification Sent</p>
                  <div>
                    <span className="font-bold text-[11px] uppercase tracking-widest block mb-0.5">English</span>
                    <p>{notificationPreview.en}</p>
                  </div>
                  <div>
                    <span className="font-bold text-[11px] uppercase tracking-widest block mb-0.5">Somali</span>
                    <p>{notificationPreview.so}</p>
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
                        <td className="p-2 border font-semibold">{item.product_title || item.product_name} (Size: {item.size}, Color: {item.color})</td>
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
                        <td className="p-2 border font-semibold">{item.product_title || item.product_name} (Size: {item.size}, Color: {item.color})</td>
                        <td className="p-2 border text-center">{item.quantity}</td>
                        <td className="p-2 border text-right">${Number(item.price || 0).toFixed(2)}</td>
                        <td className="p-2 border text-right font-bold">${(Number(item.price || 0) * Number(item.quantity || 1)).toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="text-right space-y-1.5 text-sm">
                  <p className="text-gray-500">Subtotal: <strong className="text-gray-900 font-bold">${Number(selectedOrder.subtotal || 0).toFixed(2)}</strong></p>
                  <p className="text-gray-500">Shipping: <strong className="text-gray-900 font-bold">${Number(selectedOrder.shipping_fee || 0).toFixed(2)}</strong></p>
                  <p className="text-gray-500">Discounts: <strong className="text-red-600 font-bold">-${Number(selectedOrder.discount_total || selectedOrder.discount_amount || 0).toFixed(2)}</strong></p>
                  <p className="text-base font-extrabold text-gray-900 border-t pt-1.5">Invoice Total: ${Number(selectedOrder.total || 0).toFixed(2)}</p>
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
          <div className="flex justify-between items-end pb-4 border-b border-[#e4e6fc]">
            <div>
              <h1 className="text-[24px] font-bold text-[#6777ef]">Orders Management</h1>
              <p className="text-[#98a6ad] text-[14px] mt-1">Manage, fulfill, and track all customer orders.</p>
            </div>
            <Button className="bg-white text-[#6777ef] hover:bg-[#6777ef] hover:text-white border border-[#6777ef] transition-colors shadow-sm">
              Export Data
            </Button>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center h-64 bg-white rounded-lg shadow-[0_4px_8px_rgba(0,0,0,0.03)] border-0">
              <Loader2 className="animate-spin h-8 w-8 text-[#6777ef]" />
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-[0_4px_8px_rgba(0,0,0,0.03)] overflow-hidden">
              <DataTable 
                columns={columns} 
                data={ordersList} 
                onEdit={(id) => {
                  const ord = ordersList.find(o => o.id === id);
                  if (ord) setSelectedOrder(ord.raw);
                }}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
