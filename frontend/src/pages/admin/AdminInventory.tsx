import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { PageHeader } from "@/components/admin/PageHeader";
import { DataTable } from "@/components/admin/DataTable";
import { Barcode, QrCode, Save, Loader2, Check } from "lucide-react";
import { fetchInventory, updateInventoryStock } from "@/lib/api";

const MOCK_PURCHASE_ORDERS = [
  { id: "PO-1029", supplier: "Global Timepieces Ltd.", date: "2026-07-25", total: "$12,450", status: "Pending" },
  { id: "PO-1028", supplier: "Milano Tailors", date: "2026-07-15", total: "$8,200", status: "Received" },
  { id: "PO-1027", supplier: "Leather Works Co.", date: "2026-07-10", total: "$4,150", status: "Received" },
];

const MOCK_SUPPLIERS = [
  { id: "SUP-01", name: "Global Timepieces Ltd.", contact: "orders@globaltime.example", phone: "+1 555 123 4567", leadTime: "14 days" },
  { id: "SUP-02", name: "Milano Tailors", contact: "supply@milanotailors.example", phone: "+39 02 1234 5678", leadTime: "30 days" },
  { id: "SUP-03", name: "Leather Works Co.", contact: "sales@leatherworks.example", phone: "+44 20 7123 4567", leadTime: "21 days" },
];

const MOCK_HISTORY = [
  { id: "LOG-551", product: "Midnight Onyx Chronograph", change: "-1", reason: "Automatic Update (Order #ORD-739281)", date: "2026-07-20 14:30" },
  { id: "LOG-550", product: "Italian Wool Tailored Suit", change: "-2", reason: "Automatic Update (Order #ORD-739280)", date: "2026-07-20 11:15" },
  { id: "LOG-549", product: "Oxford Leather Dress Shoes", change: "+50", reason: "Manual Adjustment (Received PO-1027)", date: "2026-07-19 09:00" },
];

function InlineStockEditor({ id, initialStock }: { id: string; initialStock: number }) {
  const [stock, setStock] = useState(initialStock);
  const [isUpdating, setIsUpdating] = useState(false);
  const [showCheck, setShowCheck] = useState(false);
  const queryClient = useQueryClient();

  const handleSave = async () => {
    setIsUpdating(true);
    try {
      await updateInventoryStock(id, stock);
      setShowCheck(true);
      setTimeout(() => setShowCheck(false), 2000);
      queryClient.invalidateQueries({ queryKey: ['admin_inventory'] });
    } catch (err) {
      alert("Failed to update stock");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <input 
        type="number" 
        value={stock} 
        onChange={(e) => setStock(parseInt(e.target.value) || 0)} 
        className="w-16 border border-gray-300 rounded px-2 py-1 text-xs text-center font-bold outline-none focus:border-black"
      />
      <button 
        onClick={handleSave} 
        disabled={isUpdating}
        className="p-1 hover:bg-gray-100 rounded text-gray-600 hover:text-black transition-colors"
      >
        {isUpdating ? (
          <Loader2 className="h-4 w-4 animate-spin text-black" />
        ) : showCheck ? (
          <Check className="h-4 w-4 text-green-600" />
        ) : (
          <Save className="h-4 w-4 text-gray-700" />
        )}
      </button>
    </div>
  );
}

export function AdminInventory() {
  const [activeTab, setActiveTab] = useState("stock");

  const { data: dbInventory, isLoading } = useQuery({
    queryKey: ['admin_inventory'],
    queryFn: fetchInventory,
    retry: 1
  });

  const stockData = ((dbInventory || []) as any[]).map(inv => {
    let status = "In Stock";
    if (inv.stock_quantity === 0) status = "Out of Stock";
    else if (inv.stock_quantity <= inv.low_stock_threshold) status = "Low Stock";

    return {
      id: inv.id,
      sku: inv.sku,
      name: inv.product?.title || "Unknown Product",
      warehouse: "Main WH (Mogadishu)",
      stock: inv.stock_quantity,
      status: status
    };
  });

  const stockColumns = [
    { key: "sku", header: "SKU" },
    { key: "name", header: "Product" },
    { key: "warehouse", header: "Warehouse" },
    {
      key: "stock",
      header: "Stock Level / Tirada Kaydka",
      render: (row: any) => <InlineStockEditor id={row.id} initialStock={row.stock} />
    },
    {
      key: "status",
      header: "Status",
      render: (row: any) => {
        let color = "bg-green-100 text-green-800";
        if (row.status === "Low Stock") color = "bg-yellow-100 text-yellow-800";
        if (row.status === "Out of Stock") color = "bg-red-100 text-red-800";
        return (
          <span className={`px-2.5 py-0.5 inline-flex text-xs leading-5 font-bold rounded-full uppercase tracking-wider ${color}`}>
            {row.status}
          </span>
        );
      }
    },
    {
      key: "actions",
      header: "Labels",
      render: (row: any) => (
        <div className="flex items-center space-x-2">
          <button title="Print Barcode" className="text-gray-400 hover:text-black transition-colors" onClick={() => alert(`Printing Barcode for ${row.sku}`)}>
            <Barcode className="h-5 w-5" />
          </button>
          <button title="Print QR Code" className="text-gray-400 hover:text-black transition-colors" onClick={() => alert(`Printing QR Code for ${row.sku}`)}>
            <QrCode className="h-5 w-5" />
          </button>
        </div>
      )
    }
  ];

  const poColumns = [
    { key: "id", header: "PO Number" },
    { key: "supplier", header: "Supplier" },
    { key: "date", header: "Expected Date" },
    { key: "total", header: "Total Value" },
    {
      key: "status",
      header: "Status",
      render: (row: any) => {
        const color = row.status === "Received" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800";
        return (
          <span className={`px-2.5 py-0.5 inline-flex text-xs leading-5 font-bold rounded-full ${color}`}>
            {row.status}
          </span>
        );
      }
    }
  ];

  const supplierColumns = [
    { key: "name", header: "Supplier Name" },
    { key: "contact", header: "Email" },
    { key: "phone", header: "Phone" },
    { key: "leadTime", header: "Avg. Lead Time" }
  ];

  const historyColumns = [
    { key: "date", header: "Date & Time" },
    { key: "product", header: "Product" },
    { 
      key: "change", 
      header: "Change",
      render: (row: any) => (
        <span className={`font-bold ${row.change.startsWith('+') ? 'text-emerald-600' : 'text-red-600'}`}>
          {row.change}
        </span>
      )
    },
    { key: "reason", header: "Reason / Event" }
  ];

  const tabs = [
    { id: "stock", name: "Stock Levels" },
    { id: "po", name: "Purchase Orders" },
    { id: "suppliers", name: "Suppliers" },
    { id: "history", name: "Inventory History" },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <PageHeader 
        title="Inventory Management" 
        description="Track stock, manage suppliers, and monitor inventory movements."
        showExport={true}
        primaryAction={{ label: activeTab === 'stock' ? "Adjust Stock" : activeTab === 'po' ? "Create PO" : activeTab === 'suppliers' ? "Add Supplier" : "Export Report", href: "#" }}
      />

      {/* Tabs */}
      <div className="mb-6 border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`whitespace-nowrap pb-4 px-1 border-b-2 font-bold text-sm transition-colors ${
                activeTab === tab.id
                  ? "border-black text-black"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              {tab.name}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="mt-4">
        {activeTab === "stock" && (
          isLoading ? (
            <div className="flex justify-center items-center h-64 bg-white rounded-xl shadow-sm border border-gray-200">
              <Loader2 className="animate-spin h-8 w-8 text-black" />
            </div>
          ) : (
            <DataTable columns={stockColumns} data={stockData} onEdit={() => {}} />
          )
        )}
        {activeTab === "po" && (
          <DataTable columns={poColumns} data={MOCK_PURCHASE_ORDERS} onEdit={() => {}} />
        )}
        {activeTab === "suppliers" && (
          <DataTable columns={supplierColumns} data={MOCK_SUPPLIERS} onEdit={() => {}} />
        )}
        {activeTab === "history" && (
          <DataTable columns={historyColumns} data={MOCK_HISTORY} />
        )}
      </div>
    </div>
  );
}
