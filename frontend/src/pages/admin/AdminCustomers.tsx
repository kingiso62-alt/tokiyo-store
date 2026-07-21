import { PageHeader } from "@/components/admin/PageHeader";
import { DataTable } from "@/components/admin/DataTable";

const MOCK_CUSTOMERS = [
  { id: "c1", name: "John Doe", email: "john@example.com", orders: 5, totalSpent: 1250, status: "Active" },
  { id: "c2", name: "Jane Smith", email: "jane@example.com", orders: 2, totalSpent: 450, status: "Active" },
  { id: "c3", name: "Bob Johnson", email: "bob@example.com", orders: 0, totalSpent: 0, status: "Inactive" },
];

export function AdminCustomers() {
  const columns = [
    { key: "name", header: "Customer Name" },
    { key: "email", header: "Email" },
    { key: "orders", header: "Orders" },
    { key: "totalSpent", header: "Total Spent ($)" },
    { key: "status", header: "Status" },
  ];

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Customers" 
        description="Manage your store's customers."
        primaryAction={{ label: "Add Customer", href: "#" }} 
      />
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <DataTable columns={columns} data={MOCK_CUSTOMERS} />
      </div>
    </div>
  );
}
