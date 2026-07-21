import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import {
  DollarSign, ShoppingCart, Users, Activity, Eye, FileText, Trash2, ShieldAlert,
  Power, Lock, CheckCircle2, ChevronRight, Loader2
} from "lucide-react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import { fetchDashboardAnalytics } from "@/lib/api";

type ActiveSubTab = "dashboard" | "financials" | "security";

export function AdminDashboard() {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<ActiveSubTab>("dashboard");
  
  // Expenses State
  const [expenseTitle, setExpenseTitle] = useState("");
  const [expenseCategory, setExpenseCategory] = useState("Rent");
  const [expenseAmount, setExpenseAmount] = useState("");

  // Security State
  const [banIp, setBanIp] = useState("");
  const [banReason, setBanReason] = useState("");

  const { data: analytics, isLoading: isAnalyticsLoading } = useQuery({
    queryKey: ["admin_analytics"],
    queryFn: fetchDashboardAnalytics
  });

  const { data: expensesData } = useQuery({
    queryKey: ["admin_expenses"],
    queryFn: async () => {
      const res = await fetch("http://localhost:5000/api/operations/expenses");
      const json = await res.json();
      return json.expenses || [];
    }
  });

  const { data: bansData } = useQuery({
    queryKey: ["admin_bans"],
    queryFn: async () => {
      const res = await fetch("http://localhost:5000/api/security/bans");
      const json = await res.json();
      return json.bans || [];
    }
  });

  const { data: maintenanceData } = useQuery({
    queryKey: ["admin_maintenance"],
    queryFn: async () => {
      const res = await fetch("http://localhost:5000/api/settings/maintenance");
      const json = await res.json();
      return json.maintenance_mode;
    }
  });

  const addExpenseMutation = useMutation({
    mutationFn: async (expense: any) => {
      const res = await fetch("http://localhost:5000/api/operations/expenses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(expense)
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin_expenses"] });
      queryClient.invalidateQueries({ queryKey: ["admin_analytics"] });
      setExpenseTitle(""); setExpenseAmount("");
    }
  });

  const addBanMutation = useMutation({
    mutationFn: async (ban: any) => {
      const res = await fetch("http://localhost:5000/api/security/bans", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(ban)
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin_bans"] });
      setBanIp(""); setBanReason("");
    }
  });

  const toggleMaintenanceMutation = useMutation({
    mutationFn: async (enabled: boolean) => {
      const res = await fetch("http://localhost:5000/api/settings/maintenance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ enabled })
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin_maintenance"] });
    }
  });

  const deleteExpenseMutation = useMutation({
    mutationFn: async (id: string) => fetch(`http://localhost:5000/api/operations/expenses/${id}`, { method: "DELETE" }),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["admin_expenses"] }); queryClient.invalidateQueries({ queryKey: ["admin_analytics"] }); }
  });

  const deleteBanMutation = useMutation({
    mutationFn: async (id: string) => fetch(`http://localhost:5000/api/security/bans/${id}`, { method: "DELETE" }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin_bans"] })
  });

  if (isAnalyticsLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="animate-spin h-10 w-10 text-[#6777ef]" />
      </div>
    );
  }

  // Calculate dynamic metrics
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  const allOrders = analytics?.allOrders || [];
  
  // Monthly Revenue (current month)
  const currentMonthOrders = allOrders.filter(o => {
    const d = new Date(o.created_at);
    return d.getMonth() === currentMonth && d.getFullYear() === currentYear && o.status !== "cancelled" && o.status !== "returned";
  });
  
  const currentMonthRevenue = currentMonthOrders.reduce((sum, o) => sum + (o.total || 0), 0);
  
  // Total expenses
  const totalExpenses = expensesData?.reduce((s:any, e:any) => s + Number(e.amount), 0) || 0;
  
  // Profit
  const netProfit = currentMonthRevenue - totalExpenses;

  // Chart Data (Group revenue by month for current year)
  const monthlyRevenueData = Array.from({ length: 12 }, (_, i) => ({
    name: new Date(0, i).toLocaleString('default', { month: 'short' }),
    revenue: 0
  }));

  allOrders.forEach(o => {
    if (o.status === "cancelled" || o.status === "returned") return;
    const d = new Date(o.created_at);
    if (d.getFullYear() === currentYear) {
      monthlyRevenueData[d.getMonth()].revenue += (o.total || 0);
    }
  });

  const ops = {
    totalUsers: analytics?.totalCustomers || 0,
    totalVisitors: 0, // Placeholder
    awaitingConfirmation: allOrders.filter(o => o.status === "pending" || o.status === "awaiting_payment").length,
    needingPacking: allOrders.filter(o => o.status === "confirmed" || o.status === "processing").length,
    cashOutstanding: allOrders
      .filter(o => o.status !== "delivered" && o.status !== "cancelled")
      .reduce((sum, o) => sum + (o.total || 0), 0)
  };

  return (
    <div className="space-y-6">
      
      {/* Top Header & Breadcrumb */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <h1 className="text-2xl font-bold text-gray-800 tracking-tight">Dashboard</h1>
        <div className="text-sm text-gray-500 mt-2 sm:mt-0">
          Home <span className="mx-1">/</span> <span className="text-[#6777ef] font-medium">Dashboard</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-gray-200 pb-2 overflow-x-auto">
        <button onClick={() => setActiveTab("dashboard")} className={`px-4 py-2 font-semibold text-sm rounded-t-lg transition-colors whitespace-nowrap ${activeTab === "dashboard" ? "text-[#6777ef] border-b-2 border-[#6777ef]" : "text-gray-500 hover:text-gray-700"}`}>
          <Activity className="h-4 w-4 inline-block mr-2 mb-0.5" /> RuangAdmin Dashboard
        </button>
        <button onClick={() => setActiveTab("financials")} className={`px-4 py-2 font-semibold text-sm rounded-t-lg transition-colors whitespace-nowrap ${activeTab === "financials" ? "text-[#6777ef] border-b-2 border-[#6777ef]" : "text-gray-500 hover:text-gray-700"}`}>
          <DollarSign className="h-4 w-4 inline-block mr-2 mb-0.5" /> Financials & Expenses
        </button>
        <button onClick={() => setActiveTab("security")} className={`px-4 py-2 font-semibold text-sm rounded-t-lg transition-colors whitespace-nowrap ${activeTab === "security" ? "text-[#6777ef] border-b-2 border-[#6777ef]" : "text-gray-500 hover:text-gray-700"}`}>
          <ShieldAlert className="h-4 w-4 inline-block mr-2 mb-0.5" /> Security & Maintenance
        </button>
      </div>

      {activeTab === "dashboard" && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          {/* RuangAdmin Top Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            <div className="bg-white rounded-lg p-5 shadow-sm border border-gray-100 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Earnings (Monthly)</p>
                <h3 className="text-xl font-bold text-gray-800">${currentMonthRevenue.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</h3>
                <p className="text-xs text-green-500 font-medium mt-2 flex items-center">
                  Live Data <span className="text-gray-400 font-normal ml-1">For this month</span>
                </p>
              </div>
              <div className="bg-[#6777ef]/10 p-3 rounded-full">
                <FileText className="h-8 w-8 text-[#6777ef]" />
              </div>
            </div>

            <div className="bg-white rounded-lg p-5 shadow-sm border border-gray-100 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Total Sales</p>
                <h3 className="text-xl font-bold text-gray-800">{analytics?.totalOrders || 0}</h3>
                <p className="text-xs text-green-500 font-medium mt-2 flex items-center">
                  Lifetime <span className="text-gray-400 font-normal ml-1">Total orders</span>
                </p>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <ShoppingCart className="h-8 w-8 text-green-500" />
              </div>
            </div>

            <div className="bg-white rounded-lg p-5 shadow-sm border border-gray-100 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Total Users</p>
                <h3 className="text-xl font-bold text-gray-800">{ops.totalUsers || 0}</h3>
                <p className="text-xs text-green-500 font-medium mt-2 flex items-center">
                  ↑ 20.4% <span className="text-gray-400 font-normal ml-1">Since last month</span>
                </p>
              </div>
              <div className="bg-cyan-100 p-3 rounded-full">
                <Users className="h-8 w-8 text-cyan-500" />
              </div>
            </div>

            <div className="bg-white rounded-lg p-5 shadow-sm border border-gray-100 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Website Visitors</p>
                <h3 className="text-xl font-bold text-gray-800">{ops.totalVisitors || 0}</h3>
                <p className="text-xs text-red-500 font-medium mt-2 flex items-center">
                  ↓ 1.10% <span className="text-gray-400 font-normal ml-1">Since yesterday</span>
                </p>
              </div>
              <div className="bg-orange-100 p-3 rounded-full">
                <Eye className="h-8 w-8 text-orange-400" />
              </div>
            </div>

          </div>

          {/* Chart Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 lg:col-span-2">
              <h3 className="text-lg font-bold text-[#6777ef] mb-4">Monthly Recap Report</h3>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={monthlyRevenueData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#6777ef" stopOpacity={0.4}/>
                        <stop offset="95%" stopColor="#6777ef" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#888' }} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#888' }} tickFormatter={(val) => `$${val/1000}k`} />
                    <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                    <Area type="monotone" dataKey="revenue" stroke="#6777ef" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 flex flex-col">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-[#6777ef]">Quick Info</h3>
              </div>
              <div className="space-y-4 flex-1">
                <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
                  <p className="text-sm text-gray-500 font-bold mb-1">Awaiting Confirmation</p>
                  <p className="text-2xl font-black text-gray-800">{ops.awaitingConfirmation}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
                  <p className="text-sm text-gray-500 font-bold mb-1">Needing Packing</p>
                  <p className="text-2xl font-black text-gray-800">{ops.needingPacking}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
                  <p className="text-sm text-gray-500 font-bold mb-1">Cash Outstanding</p>
                  <p className="text-2xl font-black text-red-500">${ops.cashOutstanding?.toLocaleString()}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === "financials" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in duration-500">
          
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-bold text-[#6777ef] mb-4">Financial Summary</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center pb-3 border-b border-gray-100">
                  <span className="text-gray-500 font-medium">Gross Revenue (This Month)</span>
                  <span className="text-gray-800 font-bold">${currentMonthRevenue.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
                </div>
                <div className="flex justify-between items-center pb-3 border-b border-gray-100 text-red-500">
                  <span className="font-medium">Total Expenses</span>
                  <span className="font-bold">
                    -${totalExpenses.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                  </span>
                </div>
                <div className="flex justify-between items-center pt-2">
                  <span className="text-gray-800 font-black text-lg">Net Profit</span>
                  <span className={`font-black text-xl ${netProfit >= 0 ? 'text-green-600' : 'text-red-500'}`}>
                    ${netProfit.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
              <h3 className="text-md font-bold text-gray-800 mb-4">Add New Expense</h3>
              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!expenseTitle || !expenseAmount) return;
                  addExpenseMutation.mutate({ title: expenseTitle, category: expenseCategory, amount: expenseAmount });
                }}
                className="space-y-4"
              >
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase">Expense Title</label>
                  <input type="text" value={expenseTitle} onChange={e=>setExpenseTitle(e.target.value)} className="w-full mt-1 border border-gray-200 rounded p-2 text-sm focus:border-[#6777ef] focus:ring-1 focus:ring-[#6777ef] outline-none" placeholder="e.g. June Office Rent" required />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-gray-500 uppercase">Category</label>
                    <select value={expenseCategory} onChange={e=>setExpenseCategory(e.target.value)} className="w-full mt-1 border border-gray-200 rounded p-2 text-sm focus:border-[#6777ef] outline-none bg-white">
                      <option value="Rent">Rent</option>
                      <option value="Electricity">Electricity</option>
                      <option value="Water">Water</option>
                      <option value="Internet">Internet</option>
                      <option value="Marketing">Marketing</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-500 uppercase">Amount ($)</label>
                    <input type="number" step="0.01" value={expenseAmount} onChange={e=>setExpenseAmount(e.target.value)} className="w-full mt-1 border border-gray-200 rounded p-2 text-sm focus:border-[#6777ef] outline-none" placeholder="0.00" required />
                  </div>
                </div>
                <Button type="submit" disabled={addExpenseMutation.isPending} className="w-full bg-[#6777ef] hover:bg-[#5a68d4] text-white">
                  {addExpenseMutation.isPending ? "Saving..." : "Save Expense"}
                </Button>
              </form>
            </div>
          </div>

          <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-bold text-[#6777ef] mb-4">Expense Records</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 text-xs uppercase text-gray-500 border-y border-gray-200">
                    <th className="p-3">Date</th>
                    <th className="p-3">Title</th>
                    <th className="p-3">Category</th>
                    <th className="p-3 text-right">Amount</th>
                    <th className="p-3 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-sm text-gray-700">
                  {expensesData?.length === 0 ? (
                    <tr><td colSpan={5} className="p-6 text-center text-gray-400">No expenses recorded yet.</td></tr>
                  ) : (
                    expensesData?.map((exp: any) => (
                      <tr key={exp.id} className="hover:bg-gray-50 transition-colors">
                        <td className="p-3 font-mono text-xs">{new Date(exp.expense_date || exp.created_at).toLocaleDateString()}</td>
                        <td className="p-3 font-medium text-gray-800">{exp.title}</td>
                        <td className="p-3">
                          <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs">{exp.category}</span>
                        </td>
                        <td className="p-3 text-right font-bold text-red-500">-${Number(exp.amount).toFixed(2)}</td>
                        <td className="p-3 text-center">
                          <button onClick={() => deleteExpenseMutation.mutate(exp.id)} className="text-gray-400 hover:text-red-500 transition-colors">
                            <Trash2 className="h-4 w-4 inline-block" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {activeTab === "security" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-in fade-in duration-500">
          
          {/* Maintenance Mode */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 border-t-4 border-t-orange-400">
            <div className="flex items-start gap-4">
              <div className={`p-3 rounded-full ${maintenanceData ? 'bg-red-100' : 'bg-green-100'}`}>
                <Power className={`h-8 w-8 ${maintenanceData ? 'text-red-500' : 'text-green-500'}`} />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-gray-800">Maintenance Mode</h3>
                <p className="text-sm text-gray-500 mt-1 mb-4">
                  When active, the public website is disabled and customers will see a maintenance page. Admins can still log in.
                </p>
                <div className="flex items-center gap-3">
                  <div 
                    onClick={() => toggleMaintenanceMutation.mutate(!maintenanceData)}
                    className={`w-14 h-7 flex items-center rounded-full p-1 cursor-pointer transition-colors ${maintenanceData ? 'bg-red-500' : 'bg-gray-300'}`}
                  >
                    <div className={`bg-white w-5 h-5 rounded-full shadow-md transform transition-transform ${maintenanceData ? 'translate-x-7' : ''}`}></div>
                  </div>
                  <span className={`font-bold text-sm ${maintenanceData ? 'text-red-600' : 'text-gray-500'}`}>
                    {maintenanceData ? "Currently OFFLINE" : "Currently ONLINE"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Ban System Form */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 border-t-4 border-t-red-500">
            <h3 className="text-lg font-bold text-gray-800 mb-2 flex items-center gap-2">
              <Lock className="h-5 w-5 text-red-500" /> Web Application Firewall & Bans
            </h3>
            <p className="text-xs text-gray-500 mb-5">Manually block suspicious IP addresses or users to prevent them from accessing the site.</p>
            
            <form 
              onSubmit={(e) => {
                e.preventDefault();
                if (!banIp || !banReason) return;
                addBanMutation.mutate({ ip_address: banIp, reason: banReason });
              }}
              className="space-y-4"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase">IP Address</label>
                  <input type="text" value={banIp} onChange={e=>setBanIp(e.target.value)} className="w-full mt-1 border border-gray-200 rounded p-2 text-sm focus:border-red-500 outline-none" placeholder="e.g. 192.168.1.1" required />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase">Reason</label>
                  <input type="text" value={banReason} onChange={e=>setBanReason(e.target.value)} className="w-full mt-1 border border-gray-200 rounded p-2 text-sm focus:border-red-500 outline-none" placeholder="e.g. Spam / Hacking" required />
                </div>
              </div>
              <Button type="submit" disabled={addBanMutation.isPending} variant="destructive" className="w-full">
                {addBanMutation.isPending ? "Blocking..." : "Block Access"}
              </Button>
            </form>
          </div>

          {/* Active Bans List */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Active Security Bans</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 text-xs uppercase text-gray-500 border-y border-gray-200">
                    <th className="p-3">Blocked Date</th>
                    <th className="p-3">IP Address</th>
                    <th className="p-3">Reason</th>
                    <th className="p-3 text-center">Status</th>
                    <th className="p-3 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-sm text-gray-700">
                  {bansData?.length === 0 ? (
                    <tr><td colSpan={5} className="p-6 text-center text-gray-400">No active bans. System is secure.</td></tr>
                  ) : (
                    bansData?.map((ban: any) => (
                      <tr key={ban.id} className="hover:bg-red-50 transition-colors">
                        <td className="p-3 font-mono text-xs">{new Date(ban.created_at).toLocaleString()}</td>
                        <td className="p-3 font-medium text-gray-800 font-mono">{ban.ip_address}</td>
                        <td className="p-3 text-gray-600">{ban.reason}</td>
                        <td className="p-3 text-center">
                          <span className="bg-red-100 text-red-700 px-2 py-1 rounded text-xs font-bold">BLOCKED</span>
                        </td>
                        <td className="p-3 text-center">
                          <button onClick={() => deleteBanMutation.mutate(ban.id)} className="text-gray-400 hover:text-green-500 transition-colors text-xs font-bold border border-gray-200 rounded px-3 py-1 hover:border-green-500">
                            Unblock
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

    </div>
  );
}
