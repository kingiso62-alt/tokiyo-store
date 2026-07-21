import { PageHeader } from "@/components/admin/PageHeader";
import { DataTable } from "@/components/admin/DataTable";

const MOCK_BRANDS = [
  { id: "b1", name: "Armani", productsCount: 12, status: "Active" },
  { id: "b2", name: "Rolex", productsCount: 5, status: "Active" },
  { id: "b3", name: "Gucci", productsCount: 18, status: "Active" },
];

export function AdminBrands() {
  const columns = [
    { key: "name", header: "Brand Name" },
    { key: "productsCount", header: "Products" },
    { key: "status", header: "Status" },
  ];

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Brands" 
        description="Manage your product brands."
        primaryAction={{ label: "Add Brand", href: "#" }} 
      />
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <DataTable columns={columns} data={MOCK_BRANDS} />
      </div>
    </div>
  );
}
