import { PageHeader } from "@/components/admin/PageHeader";
import { DataTable } from "@/components/admin/DataTable";

const MOCK_CATEGORIES = [
  { id: "c1", name: "Men's Clothing", slug: "mens-clothing", productsCount: 120, status: "Active" },
  { id: "c2", name: "Women's Clothing", slug: "womens-clothing", productsCount: 85, status: "Active" },
  { id: "c3", name: "Accessories", slug: "accessories", productsCount: 45, status: "Active" },
];

export function AdminCategories() {
  const columns = [
    { key: "name", header: "Category Name" },
    { key: "slug", header: "Slug" },
    { key: "productsCount", header: "Products" },
    { key: "status", header: "Status" },
  ];

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Categories" 
        description="Manage your product categories."
        primaryAction={{ label: "Add Category", href: "#" }} 
      />
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <DataTable columns={columns} data={MOCK_CATEGORIES} />
      </div>
    </div>
  );
}
