import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { PageHeader } from "@/components/admin/PageHeader";
import { Button } from "@/components/ui/button";
import {
  DollarSign, ShoppingBag, Users, Activity, ArrowUpRight, TrendingUp,
  Percent, FileSpreadsheet, Download, Printer, Loader2, Calendar, AlertCircle,
  Database, RefreshCw, Settings, AlertTriangle, ShieldCheck, HelpCircle, ListTodo, ClipboardList, Ban
} from "lucide-react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Legend, Cell
} from 'recharts';

type ActiveSubTab = "control" | "targets" | "disaster";
type PeriodReportType = "daily" | "weekly" | "monthly";

export function AdminDashboard() {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<ActiveSubTab>("control");
  const [closingPeriod, setClosingPeriod] = useState<PeriodReportType>("daily");
  
  // Real database fetch for accurate operations dashboard and targets calculation
  const { data: opData, isLoading, error, refetch } = useQuery({
    queryKey: ["admin_operations_dashboard"],
    queryFn: async () => {
      const res = await fetch("http://localhost:5000/api/operations/dashboard");
      if (!res.ok) throw new Error("Failed to fetch operational analytics");
      const json = await res.json();
      return json;
    }
  });

  // Client-side JSON data exporting for backups
  const triggerExport = async (table: string) => {
    try {
      const { data, error } = await supabase.from(table).select("*");
      if (error) throw error;
      
      const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
        JSON.stringify(data, null, 2)
      )}`;
      const downloadAnchor = document.createElement("a");
      downloadAnchor.setAttribute("href", jsonString);
      downloadAnchor.setAttribute("download", `tokiyo_store_${table}_export_${Date.now()}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      document.body.removeChild(downloadAnchor);
    } catch (err: any) {
      alert(`Export failed for table ${table}: ${err.message}`);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="animate-spin h-10 w-10 text-black mx-auto mb-4" />
          <p className="text-gray-500 text-sm font-bold uppercase tracking-wider">Xisaabinaya Dakhliga & Hawlaha Ganacsiga...</p>
        </div>
      </div>
    );
  }

  if (error || !opData) {
    return (
      <div className="p-6 bg-red-50 text-red-800 rounded-xl flex items-center gap-2 max-w-md mx-auto mt-10">
        <AlertCircle className="h-5 w-5" />
        <div>
          <p className="font-bold text-sm">Failed to load business operations. / Cilad ayaa dhacday.</p>
          <p className="text-xs text-red-600 mt-1">Make sure backend port 5000 is running.</p>
        </div>
      </div>
    );
  }

  const { operations, alerts, reports, targets, backupStatus } = opData;
  const currentClosingReport = reports[closingPeriod];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 font-sans">
      
      {/* Page Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 border-b pb-5">
        <PageHeader 
          title="Boutique Control & Business Operations" 
          description="Operational dashboard, real-time alerts, daily business closing reports, targets, and disaster recovery controls."
        />

        {/* Tab Navigation */}
        <div className="flex bg-gray-100 p-1 rounded-xl shadow-inner w-full lg:w-auto">
          {(["control", "targets", "disaster"] as ActiveSubTab[]).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 lg:flex-initial px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 ${
                activeTab === tab ? "bg-white text-black shadow-sm" : "text-gray-500 hover:text-black"
              }`}
            >
              {tab === "control" && <Activity className="h-3.5 w-3.5" />}
              {tab === "targets" && <TrendingUp className="h-3.5 w-3.5" />}
              {tab === "disaster" && <Database className="h-3.5 w-3.5" />}

              {tab === "control" && "Operations Control"}
              {tab === "targets" && "Business Targets"}
              {tab === "disaster" && "Data Backup & Recovery"}
            </button>
          ))}
        </div>
      </div>

      {/* TAB 1: OPERATIONS CONTROL */}
      {activeTab === "control" && (
        <div className="space-y-6">
          
          {/* Daily Operations Metrics Dashboard */}
          <div className="bg-white border rounded-2xl p-6 shadow-sm">
            <div className="flex justify-between items-center border-b pb-3 mb-5">
              <div>
                <h3 className="text-sm font-bold uppercase tracking-widest text-gray-900">Daily Operations Dashboard</h3>
                <p className="text-[11px] text-gray-400">Guddiga hawlaha boutique-ga ee maanta</p>
              </div>
              <button onClick={() => refetch()} className="p-2 border rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                <RefreshCw className="h-4 w-4 text-gray-600" />
              </button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {[
                { title_en: "New Orders", title_so: "Dalabyo Cusub", val: operations.newOrders, color: "bg-blue-50 text-blue-700 border-blue-100" },
                { title_en: "Awaiting Conf.", title_so: "Sugaya Xaqiijin", val: operations.awaitingConfirmation, color: "bg-amber-50 text-amber-700 border-amber-100" },
                { title_en: "Payments Review", title_so: "Baarista Lacagta", val: operations.paymentsUnderReview, color: "bg-indigo-50 text-indigo-700 border-indigo-100" },
                { title_en: "Needing Packing", title_so: "Awaiting Packing", val: operations.needingPacking, color: "bg-cyan-50 text-cyan-700 border-cyan-100" },
                { title_en: "Ready for Delivery", title_so: "Diyaar u ah Keenid", val: operations.readyForDelivery, color: "bg-green-50 text-green-700 border-green-100" },
                { title_en: "Failed Deliveries", title_so: "Keenid Fashilantay", val: operations.failedDeliveries, color: "bg-red-50 text-red-700 border-red-100" },
                { title_en: "Return Requests", title_so: "Codsi Soo-celin", val: operations.returnRequests, color: "bg-purple-50 text-purple-700 border-purple-100" },
                { title_en: "Refund Requests", title_so: "Codsi Lacag-celin", val: operations.refundRequests, color: "bg-pink-50 text-pink-700 border-pink-100" },
                { title_en: "Low Stock Products", title_so: "Alaab Sii Dhamanaysa", val: operations.lowStockProducts, color: "bg-orange-50 text-orange-700 border-orange-100" },
                { title_en: "Unread Messages", title_so: "Farriimo aan la akhrin", val: operations.unreadMessages, color: "bg-gray-100 text-gray-700 border-gray-200" },
                { title_en: "Cash Outstanding", title_so: "Cash Outstanding", val: `$${operations.cashOutstanding.toFixed(2)}`, color: "bg-rose-50 text-rose-700 border-rose-100", colSpan: true },
                { title_en: "Daily Revenue", title_so: "Dakhliga Maanta", val: `$${operations.dailyRevenue.toFixed(2)}`, color: "bg-emerald-50 text-emerald-700 border-emerald-100", colSpan: true },
                { title_en: "Daily Profit", title_so: "Faa'iidada Maanta", val: `$${operations.dailyProfit.toFixed(2)}`, color: "bg-violet-50 text-violet-700 border-violet-100", colSpan: true }
              ].map((item, idx) => (
                <div key={idx} className={`p-4 border rounded-xl flex flex-col justify-between shadow-sm transition-all hover:scale-[1.01] ${item.color} ${item.colSpan ? "col-span-2" : ""}`}>
                  <div className="space-y-0.5">
                    <p className="text-[10px] uppercase tracking-wider font-extrabold opacity-80">{item.title_en}</p>
                    <p className="text-[9px] font-bold opacity-60">{item.title_so}</p>
                  </div>
                  <h4 className="text-xl font-black mt-2 tracking-tight font-sans">{item.val}</h4>
                </div>
              ))}
            </div>
          </div>

          {/* Task Alerts Section */}
          <div className="bg-white border rounded-2xl p-6 shadow-sm space-y-4">
            <div>
              <h3 className="text-sm font-bold uppercase tracking-widest text-gray-900">Task Alerts & System Failures</h3>
              <p className="text-[11px] text-gray-400">Digniinaha iyo hawlaha u baahan in hadda la xaliyo</p>
            </div>

            {alerts.length === 0 ? (
              <div className="p-4 bg-green-50 text-green-800 rounded-xl text-xs font-bold border border-green-100 flex items-center gap-2">
                <ShieldCheck className="h-4 w-4" /> Operations fully optimized! All checks passed successfully.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {alerts.map((al: any) => (
                  <div key={al.id} className={`p-4 rounded-xl border flex gap-3 items-start transition-all shadow-sm ${
                    al.level === "danger" 
                      ? "bg-red-50 text-red-900 border-red-150" 
                      : al.level === "warning" ? "bg-amber-50 text-amber-900 border-amber-150" : "bg-blue-50 text-blue-900 border-blue-150"
                  }`}>
                    <AlertTriangle className={`h-5 w-5 flex-shrink-0 mt-0.5 ${
                      al.level === "danger" ? "text-red-600" : al.level === "warning" ? "text-amber-600" : "text-blue-600"
                    }`} />
                    <div className="space-y-1">
                      <h4 className="text-xs font-black uppercase tracking-wider flex flex-wrap gap-x-2">
                        <span>{al.title_en}</span>
                        <span className="opacity-60">|</span>
                        <span className="opacity-70 font-semibold">{al.title_so}</span>
                      </h4>
                      <p className="text-[10px] font-medium leading-relaxed opacity-85">{al.desc_en}</p>
                      <p className="text-[9px] font-bold leading-relaxed opacity-60">{al.desc_so}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      )}

      {/* TAB 2: TARGETS & CLOSING REPORTS */}
      {activeTab === "targets" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Business Targets & Projections */}
          <div className="lg:col-span-2 bg-white border rounded-2xl p-6 shadow-sm space-y-5">
            <div>
              <h3 className="text-sm font-bold uppercase tracking-widest text-gray-900">Monthly Business Targets</h3>
              <p className="text-[11px] text-gray-400">Hadafyada ganacsi ee bishaan iyo saadaalinta dhammaadka bisha</p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 text-[10px] uppercase font-bold text-gray-500 border-y">
                    <th className="p-3">Target Metric</th>
                    <th className="p-3 text-right">Current</th>
                    <th className="p-3 text-right">Target</th>
                    <th className="p-3 text-center">Progress %</th>
                    <th className="p-3 text-right">Forecast</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 font-medium">
                  {targets.map((tg: any) => (
                    <tr key={tg.key}>
                      <td className="p-3">
                        <p className="font-bold text-gray-900">{tg.name_en}</p>
                        <p className="text-[9px] text-gray-400 font-semibold uppercase">{tg.name_so}</p>
                      </td>
                      <td className="p-3 text-right font-black text-gray-900">
                        {tg.unit === "$" && "$"}
                        {tg.current.toLocaleString(undefined, { minimumFractionDigits: tg.unit === "$" ? 2 : 0, maximumFractionDigits: tg.unit === "$" ? 2 : 0 })}
                        {tg.unit === "%" && "%"}
                      </td>
                      <td className="p-3 text-right font-black text-gray-500">
                        {tg.unit === "$" && "$"}
                        {tg.target.toLocaleString(undefined, { minimumFractionDigits: tg.unit === "$" ? 2 : 0, maximumFractionDigits: tg.unit === "$" ? 2 : 0 })}
                        {tg.unit === "%" && "%"}
                      </td>
                      <td className="p-3 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <div className="w-16 bg-gray-100 h-1.5 rounded-full overflow-hidden">
                            <div className="bg-black h-full" style={{ width: `${tg.progress}%` }} />
                          </div>
                          <span className="font-black font-sans">{tg.progress.toFixed(0)}%</span>
                        </div>
                      </td>
                      <td className="p-3 text-right font-black text-green-700">
                        {tg.unit === "$" && "$"}
                        {tg.forecast.toLocaleString(undefined, { minimumFractionDigits: tg.unit === "$" ? 2 : 0, maximumFractionDigits: tg.unit === "$" ? 2 : 0 })}
                        {tg.unit === "%" && "%"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Period Closing Reports */}
          <div className="bg-white border rounded-2xl p-6 shadow-sm space-y-4">
            <div className="flex justify-between items-center border-b pb-3">
              <div>
                <h3 className="text-sm font-bold uppercase tracking-widest text-gray-900">Period Closing Report</h3>
                <p className="text-[11px] text-gray-400">Warbixinta xiritaanka dakhliga</p>
              </div>
              
              <select
                value={closingPeriod}
                onChange={(e) => setClosingPeriod(e.target.value as PeriodReportType)}
                className="text-[10px] font-black uppercase tracking-wider bg-gray-50 border rounded-lg py-1.5 px-3 focus:outline-none cursor-pointer"
              >
                <option value="daily">Daily / Maalin</option>
                <option value="weekly">Weekly / Todobaad</option>
                <option value="monthly">Monthly / Bil</option>
              </select>
            </div>

            <div className="space-y-3.5 text-xs text-gray-600 font-bold uppercase tracking-wider">
              <div className="flex justify-between border-b pb-2">
                <span>Total Orders</span>
                <span className="text-gray-900">{currentClosingReport.totalOrders}</span>
              </div>
              <div className="flex justify-between border-b pb-2 text-[10px]">
                <span className="text-gray-400">Paid / Unpaid</span>
                <span className="text-gray-700">{currentClosingReport.paidOrders} paid | {currentClosingReport.unpaidOrders} unpaid</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span>Gross Revenue</span>
                <span className="text-gray-900">${currentClosingReport.revenue.toFixed(2)}</span>
              </div>
              <div className="flex justify-between border-b pb-2 text-red-600 text-[10px]">
                <span>Discounts Offered</span>
                <span>-${currentClosingReport.discounts.toFixed(2)}</span>
              </div>
              <div className="flex justify-between border-b pb-2 text-red-600 text-[10px]">
                <span>Payment Gateway Fees (2%)</span>
                <span>-${currentClosingReport.paymentFees.toFixed(2)}</span>
              </div>
              <div className="flex justify-between border-b pb-2 text-red-600 text-[10px]">
                <span>Delivery Expenses</span>
                <span>-${currentClosingReport.deliveryExpenses.toFixed(2)}</span>
              </div>
              <div className="flex justify-between border-b pb-2 text-red-700 text-[10px]">
                <span>Refunds Processed</span>
                <span>-${currentClosingReport.refunds.toFixed(2)}</span>
              </div>
              <div className="flex justify-between border-b pb-2 text-green-700">
                <span>Net Cash Collected</span>
                <span>${currentClosingReport.cashCollected.toFixed(2)}</span>
              </div>
              <div className="flex justify-between border-b pb-2 text-rose-700">
                <span>Cash Outstanding</span>
                <span>${currentClosingReport.cashOutstanding.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-base font-black text-gray-950 border-t pt-3.5 normal-case font-sans">
                <span>Calculated Profit:</span>
                <span>${currentClosingReport.profit.toFixed(2)}</span>
              </div>
            </div>

            <Button onClick={() => window.print()} className="w-full bg-black text-white hover:bg-gray-800 uppercase tracking-widest text-[10px] h-10 mt-2 font-bold rounded-xl">
              Print Closing Invoice / Report
            </Button>
          </div>

        </div>
      )}

      {/* TAB 3: DISASTER RECOVERY & EXPORTS */}
      {activeTab === "disaster" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* JSON Backups Data Exporters */}
          <div className="bg-white border rounded-2xl p-6 shadow-sm space-y-4">
            <div>
              <h3 className="text-sm font-bold uppercase tracking-widest text-gray-900">Database JSON Exporters</h3>
              <p className="text-[11px] text-gray-400">U dhoofi xogta oo dhan hab kayd ahaan</p>
            </div>

            <div className="space-y-3">
              {[
                { name: "Export Products", table: "products" },
                { name: "Export Customers", table: "profiles" },
                { name: "Export Orders", table: "orders" },
                { name: "Export Payments", table: "payments" },
                { name: "Export Settings & Configurations", table: "settings" }
              ].map((exp, idx) => (
                <button
                  key={idx}
                  onClick={() => triggerExport(exp.table)}
                  className="w-full border border-gray-200 hover:border-black p-3.5 rounded-xl flex items-center justify-between text-xs font-bold uppercase tracking-wider text-gray-700 hover:text-black transition-all bg-gray-50/50 hover:bg-white cursor-pointer"
                >
                  <span>{exp.name}</span>
                  <Download className="h-4 w-4 text-gray-400" />
                </button>
              ))}
            </div>

            {/* Daily Backup Status */}
            <div className="border-t pt-4 space-y-2">
              <h4 className="text-[10px] uppercase font-black tracking-widest text-gray-400">Daily Backup Status</h4>
              <div className="bg-green-50 p-4 rounded-xl border border-green-200 text-xs font-bold text-green-800 space-y-1.5 shadow-inner">
                <p className="flex justify-between">Status: <span>{backupStatus.status.toUpperCase()}</span></p>
                <p className="flex justify-between">Last Backup At: <span className="font-mono">{new Date(backupStatus.last_backup_at).toLocaleString()}</span></p>
                <p className="flex justify-between">File Size: <span>{backupStatus.file_size}</span></p>
                <p className="text-[9px] opacity-80 pt-1 leading-normal border-t border-green-200/50 mt-1">{backupStatus.frequency}</p>
              </div>
            </div>
          </div>

          {/* Disaster Recovery Checklist & Restoration Instructions */}
          <div className="lg:col-span-2 bg-white border rounded-2xl p-6 shadow-sm space-y-5">
            <div>
              <h3 className="text-sm font-bold uppercase tracking-widest text-gray-900">Disaster-Recovery Checklist & Instructions</h3>
              <p className="text-[11px] text-gray-400">Tallaabooyinka soo-celinta xogta boutique-ga ee xaaladaha degdegga ah</p>
            </div>

            {/* Instructions checklist */}
            <div className="space-y-4 text-xs">
              <div className="space-y-2 bg-gray-50 p-4 rounded-xl border font-bold text-gray-700">
                <h4 className="text-black uppercase tracking-wider text-[10px] flex items-center gap-1.5">
                  <ClipboardList className="h-4 w-4" /> Disaster-Recovery Checklist / Hubinta Xaaladda Degdegga ah
                </h4>
                <ul className="space-y-2.5 pt-2 text-[11px] leading-relaxed">
                  <li className="flex items-start gap-2.5">
                    <input type="checkbox" defaultChecked className="rounded border-gray-300 text-black focus:ring-black h-4 w-4 mt-0.5" />
                    <span>Verify that Supabase CLI is authenticated against target project-ref.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <input type="checkbox" defaultChecked className="rounded border-gray-300 text-black focus:ring-black h-4 w-4 mt-0.5" />
                    <span>Download latest `.sql` database backup file from secure cold storage.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <input type="checkbox" className="rounded border-gray-300 text-black focus:ring-black h-4 w-4 mt-0.5" />
                    <span>Pause payment webhook integrations (Stripe, Paypal) to prevent data corruption during restoration.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <input type="checkbox" className="rounded border-gray-300 text-black focus:ring-black h-4 w-4 mt-0.5" />
                    <span>Restore database schema using Supabase CLI commands.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <input type="checkbox" className="rounded border-gray-300 text-black focus:ring-black h-4 w-4 mt-0.5" />
                    <span>Resume webhook systems and trigger mock payment verification to test connectivity.</span>
                  </li>
                </ul>
              </div>

              {/* Recovery commands */}
              <div className="space-y-3 font-semibold">
                <h4 className="text-[10px] uppercase font-black tracking-widest text-gray-400">Restore Instructions / Tilmaamaha Dib-u-soo-celinta</h4>
                
                <div className="space-y-2 leading-relaxed">
                  <p className="text-[11px]">To restore your database backup file into Supabase hosted postgresql using the CLI:</p>
                  <pre className="bg-black text-white p-3 rounded-lg font-mono text-[10px] select-all overflow-x-auto">
                    supabase db restore --project-ref &lt;project-id&gt; -f ./backups/tokiyo_store_backup_latest.sql
                  </pre>
                </div>

                <div className="space-y-2 leading-relaxed pt-2">
                  <p className="text-[11px]">Alternatively, execute SQL dump files using the standard PostgreSQL client tool:</p>
                  <pre className="bg-black text-white p-3 rounded-lg font-mono text-[10px] select-all overflow-x-auto">
                    psql -h db.your-supabase-reference.supabase.co -p 5432 -U postgres -d postgres -f ./backups/tokiyo_store_backup_latest.sql
                  </pre>
                </div>
              </div>
            </div>
          </div>

        </div>
      )}

    </div>
  );
}
