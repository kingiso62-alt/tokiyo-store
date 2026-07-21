import { Outlet, Link, useLocation, Navigate } from "react-router-dom";
import { LayoutDashboard, ShoppingCart, Package, Users, Settings, LogOut, Search, Bell, Tags, Layers, Bookmark, Ticket, Archive, MessageSquare, Truck, Undo2, CreditCard, Megaphone, Navigation } from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";

const sidebarLinks = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Orders", href: "/admin/orders", icon: ShoppingCart },
  { name: "Products", href: "/admin/products", icon: Package },
  { name: "Categories", href: "/admin/categories", icon: Layers },
  { name: "Brands", href: "/admin/brands", icon: Tags },
  { name: "Collections", href: "/admin/collections", icon: Bookmark },
  { name: "Customers", href: "/admin/customers", icon: Users },
  { name: "Marketing", href: "/admin/marketing", icon: Megaphone },
  { name: "Coupons", href: "/admin/coupons", icon: Ticket },
  { name: "Inventory", href: "/admin/inventory", icon: Archive },
  { name: "Reviews", href: "/admin/reviews", icon: MessageSquare },
  { name: "Shipping", href: "/admin/shipping", icon: Truck },
  { name: "Logistics", href: "/admin/delivery-logistics", icon: Navigation },
  { name: "Returns", href: "/admin/returns", icon: Undo2 },
  { name: "Payments", href: "/admin/payments", icon: CreditCard },
  { name: "Settings", href: "/admin/settings", icon: Settings },
];

export function AdminLayout() {
  const location = useLocation();
  const { user, profile, isLoading, signOut } = useAuthStore();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black" />
      </div>
    );
  }

  if (!user || (profile && profile.role !== 'admin' && profile.role !== 'manager')) {
    return <Navigate to="/admin-login" replace />;
  }

  const adminName = profile ? `${profile.first_name || ''} ${profile.last_name || ''}`.trim() || 'Admin' : 'Admin';
  const avatarUrl = profile?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(adminName)}&background=000&color=fff`;

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden font-sans">
      
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 hidden md:flex flex-col">
        <div className="h-16 flex items-center px-6 border-b border-gray-200">
          <Link to="/" className="text-xl font-bold uppercase tracking-widest">
            Tokiyo Admin
          </Link>
        </div>

        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          {sidebarLinks.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center px-3 py-2.5 text-sm font-medium rounded-md transition-colors ${
                  isActive 
                    ? "bg-black text-white" 
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <item.icon className={`mr-3 h-5 w-5 ${isActive ? "text-white" : "text-gray-400"}`} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-gray-200">
          <button
            onClick={() => signOut()}
            className="flex items-center px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-md w-full transition-colors"
          >
            <LogOut className="mr-3 h-5 w-5" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 sm:px-6 z-10">
          <div className="flex-1 flex">
            <div className="relative w-full max-w-md">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search orders, products..."
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-gray-50 placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:bg-white focus:ring-1 focus:ring-black focus:border-black sm:text-sm transition-colors"
              />
            </div>
          </div>
          <div className="ml-4 flex items-center space-x-4">
            <button className="p-1 text-gray-400 hover:text-gray-500 relative">
              <Bell className="h-6 w-6" />
              <span className="absolute top-1 right-1 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white"></span>
            </button>
            <div className="flex items-center gap-3">
              <img
                className="h-8 w-8 rounded-full object-cover"
                src={avatarUrl}
                alt={adminName}
              />
              <span className="text-sm font-medium text-gray-700 hidden lg:block">{adminName}</span>
            </div>
          </div>
        </header>

        {/* Main Content Scrollable Area */}
        <main className="flex-1 overflow-y-auto bg-gray-50 p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
      
    </div>
  );
}
