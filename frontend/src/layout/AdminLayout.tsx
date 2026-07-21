import { Outlet, Link, useLocation, Navigate } from "react-router-dom";
import { LayoutDashboard, ShoppingCart, Package, Users, Settings, LogOut, Search, Bell, Tags, Layers, Bookmark, Ticket, Archive, MessageSquare, Truck, Undo2, CreditCard, Megaphone, Navigation, Menu } from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";
import { useState } from "react";

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
  const [sidebarOpen, setSidebarOpen] = useState(true);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#f8f9fc]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#6777ef]" />
      </div>
    );
  }

  if (!user || (profile && profile.role !== 'admin' && profile.role !== 'manager')) {
    return <Navigate to="/admin-login" replace />;
  }

  const adminName = profile ? `${profile.first_name || ''} ${profile.last_name || ''}`.trim() || 'Admin' : 'Admin';
  const avatarUrl = profile?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(adminName)}&background=ffffff&color=6777ef`;

  return (
    <div className="flex h-screen bg-[#f8f9fc] overflow-hidden font-sans text-gray-700">
      
      {/* Sidebar - RuangAdmin White Style (often has blue accents or entirely white with blue active items) */}
      <aside className={`bg-white border-r border-gray-200 flex-col transition-all duration-300 z-20 ${sidebarOpen ? 'w-64 flex' : 'w-0 hidden'} md:flex`}>
        {/* Brand Header */}
        <div className="h-[70px] flex items-center justify-center bg-[#6777ef] text-white px-6">
          <Link to="/" className="text-xl font-bold tracking-wider flex items-center gap-2">
            <div className="bg-white text-[#6777ef] rounded px-1.5 py-0.5 font-black">RA</div> 
            RuangAdmin
          </Link>
        </div>

        <nav className="flex-1 overflow-y-auto py-4 space-y-1">
          <div className="px-4 text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 mt-4">Features</div>
          {sidebarLinks.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center px-4 py-3 text-sm font-medium transition-colors ${
                  isActive 
                    ? "text-[#6777ef] bg-[#f8f9fc] border-r-4 border-[#6777ef]" 
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <item.icon className={`mr-3 h-[18px] w-[18px] ${isActive ? "text-[#6777ef]" : "text-gray-400"}`} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-gray-200">
          <button
            onClick={() => signOut()}
            className="flex items-center px-3 py-2 text-sm font-medium text-red-500 hover:bg-red-50 rounded-md w-full transition-colors"
          >
            <LogOut className="mr-3 h-[18px] w-[18px]" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        
        {/* Top Header - RuangAdmin Blue Style */}
        <header className="h-[70px] bg-[#6777ef] shadow flex items-center justify-between px-4 sm:px-6 z-10 transition-all">
          <div className="flex-1 flex items-center gap-4">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-white/80 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors">
              <Menu className="h-5 w-5" />
            </button>
            <div className="relative w-full max-w-xs hidden md:block">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-white/70" />
              </div>
              <input
                type="text"
                placeholder="Search for..."
                className="block w-full pl-10 pr-3 py-2 border-transparent rounded-lg leading-5 bg-white/20 text-white placeholder-white/70 focus:outline-none focus:bg-white focus:text-gray-900 focus:placeholder-gray-400 sm:text-sm transition-colors"
              />
            </div>
          </div>
          <div className="ml-4 flex items-center space-x-2 sm:space-x-4">
            <button className="p-2 text-white/80 hover:text-white relative rounded-full hover:bg-white/10 transition-colors hidden sm:block">
              <Search className="h-5 w-5" />
            </button>
            <button className="p-2 text-white/80 hover:text-white relative rounded-full hover:bg-white/10 transition-colors">
              <Bell className="h-5 w-5" />
              <span className="absolute top-2 right-2 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-[#6777ef]"></span>
            </button>
            <button className="p-2 text-white/80 hover:text-white relative rounded-full hover:bg-white/10 transition-colors">
              <MessageSquare className="h-5 w-5" />
              <span className="absolute top-2 right-2 block h-2 w-2 rounded-full bg-orange-400 ring-2 ring-[#6777ef]"></span>
            </button>
            
            <div className="h-8 w-px bg-white/20 mx-2"></div>
            
            <div className="flex items-center gap-3 pl-2 cursor-pointer hover:bg-white/10 p-2 rounded-lg transition-colors">
              <img
                className="h-8 w-8 rounded-full object-cover border-2 border-white/50"
                src={avatarUrl}
                alt={adminName}
              />
              <span className="text-sm font-medium text-white hidden lg:block">{adminName}</span>
            </div>
          </div>
        </header>

        {/* Main Content Scrollable Area */}
        <main className="flex-1 overflow-y-auto bg-[#f8f9fc] p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
      
    </div>
  );
}
