import { PageHeader } from "@/components/admin/PageHeader";
import { DataTable } from "@/components/admin/DataTable";

const MOCK_COLLECTIONS = [
  { id: "cl1", name: "Summer Collection", productsCount: 42, status: "Active" },
  { id: "cl2", name: "Winter Essentials", productsCount: 35, status: "Draft" },
  { id: "cl3", name: "Luxury Watches", productsCount: 12, status: "Active" },
];

export function AdminCollections() {
  const columns = [
    { key: "name", header: "Collection Name" },
    { key: "productsCount", header: "Products" },
    { key: "status", header: "Status" },
  ];

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Collections" 
        description="Manage your curated collections."
        primaryAction={{ label: "Add Collection", href: "#" }} 
      />
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <DataTable columns={columns} data={MOCK_COLLECTIONS} />
      </div>
    </div>
  );
}
