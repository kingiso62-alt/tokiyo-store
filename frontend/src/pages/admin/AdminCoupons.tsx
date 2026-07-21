import { PageHeader } from "@/components/admin/PageHeader";
import { DataTable } from "@/components/admin/DataTable";

const MOCK_COUPONS = [
  { id: "cp1", code: "SUMMER20", discount: "20%", usageLimit: 100, used: 45, status: "Active" },
  { id: "cp2", code: "WELCOME10", discount: "10%", usageLimit: 999, used: 120, status: "Active" },
];

export function AdminCoupons() {
  const columns = [
    { key: "code", header: "Coupon Code" },
    { key: "discount", header: "Discount" },
    { key: "usageLimit", header: "Limit" },
    { key: "used", header: "Used" },
    { key: "status", header: "Status" },
  ];

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Coupons" 
        description="Manage discount codes and promotions."
        primaryAction={{ label: "Add Coupon", href: "#" }} 
      />
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <DataTable columns={columns} data={MOCK_COUPONS} />
      </div>
    </div>
  );
}
