import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { PageHeader } from "@/components/admin/PageHeader";
import { Button } from "@/components/ui/button";
import {
  Activity, TrendingUp, Database, Loader2, AlertCircle, RefreshCw, 
  AlertTriangle, ShieldCheck, ClipboardList, Download
} from "lucide-react";

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
      <div className="min-h-screen bg-[#040404] flex items-center justify-center pt-20">
        <div className="text-center">
          <Loader2 className="animate-spin h-10 w-10 text-[#D4AF37] mx-auto mb-4" />
          <p className="text-[#D4AF37] text-xs font-black uppercase tracking-[0.2em]">Xisaabinaya Dakhliga & Hawlaha Ganacsiga...</p>
        </div>
      </div>
    );
  }

  if (error || !opData) {
    return (
      <div className="min-h-screen bg-[#040404] pt-32 pb-20 px-4">
        <div className="p-6 bg-red-950/30 text-red-400 border border-red-900/50 rounded-2xl flex items-center gap-3 max-w-md mx-auto shadow-2xl">
          <AlertCircle className="h-6 w-6 flex-shrink-0" />
          <div>
            <p className="font-bold text-sm uppercase tracking-wider">Failed to load operations. / Cilad ayaa dhacday.</p>
            <p className="text-xs text-red-500 mt-1 font-medium">Make sure backend port 5000 is running.</p>
          </div>
        </div>
      </div>
    );
  }

  const { operations, alerts, reports, targets, backupStatus } = opData;
  const currentClosingReport = reports[closingPeriod];

  return (
    <div className="bg-[#040404] min-h-screen text-white pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 font-sans">
        
        {/* Page Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 border-b border-zinc-900 pb-6">
          <PageHeader 
            title="Boutique Control & Operations" 
            description="Operational dashboard, real-time alerts, daily business closing reports, targets, and disaster recovery."
          />

          {/* Tab Navigation */}
          <div className="flex bg-zinc-950 p-1.5 rounded-xl border border-zinc-900 w-full lg:w-auto shadow-lg">
            {(["control", "targets", "disaster"] as ActiveSubTab[]).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 lg:flex-initial px-5 py-2.5 rounded-lg text-[10px] font-black uppercase tracking-[0.15em] transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  activeTab === tab 
                    ? "bg-[#D4AF37] text-black shadow-md" 
                    : "text-zinc-500 hover:text-white hover:bg-zinc-900"
                }`}
              >
                {tab === "control" && <Activity className="h-3.5 w-3.5" />}
                {tab === "targets" && <TrendingUp className="h-3.5 w-3.5" />}
                {tab === "disaster" && <Database className="h-3.5 w-3.5" />}

                {tab === "control" && "Control"}
                {tab === "targets" && "Targets"}
                {tab === "disaster" && "Recovery"}
              </button>
            ))}
          </div>
        </div>

        {/* TAB 1: OPERATIONS CONTROL */}
        {activeTab === "control" && (
          <div className="space-y-8">
            
            {/* Daily Operations Metrics Dashboard */}
            <div className="bg-[#080808] border border-zinc-900 rounded-2xl p-6 lg:p-8 shadow-2xl relative overflow-hidden">
              {/* Decorative background glow */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-[#D4AF37] opacity-[0.02] blur-3xl rounded-full pointer-events-none"></div>

              <div className="flex justify-between items-center border-b border-zinc-900 pb-4 mb-6 relative z-10">
                <div>
                  <h3 className="text-xs font-black uppercase tracking-[0.2em] text-[#D4AF37]">Daily Operations Dashboard</h3>
                  <p className="text-[10px] text-zinc-500 uppercase tracking-widest mt-1">Guddiga hawlaha boutique-ga ee maanta</p>
                </div>
                <button 
                  onClick={() => refetch()} 
                  className="p-2.5 border border-zinc-800 rounded-lg bg-zinc-950 hover:bg-zinc-900 transition-all hover:border-[#D4AF37] cursor-pointer group"
                >
                  <RefreshCw className="h-4 w-4 text-zinc-400 group-hover:text-[#D4AF37] transition-colors" />
                </button>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 relative z-10">
                {[
                  { title_en: "New Orders", title_so: "Dalabyo Cusub", val: operations.newOrders },
                  { title_en: "Awaiting Conf.", title_so: "Sugaya Xaqiijin", val: operations.awaitingConfirmation },
                  { title_en: "Payments Review", title_so: "Baarista Lacagta", val: operations.paymentsUnderReview },
                  { title_en: "Needing Packing", title_so: "Awaiting Packing", val: operations.needingPacking },
                  { title_en: "Ready for Delivery", title_so: "Diyaar u ah Keenid", val: operations.readyForDelivery },
                  { title_en: "Failed Deliveries", title_so: "Keenid Fashilantay", val: operations.failedDeliveries },
                  { title_en: "Return Requests", title_so: "Codsi Soo-celin", val: operations.returnRequests },
                  { title_en: "Refund Requests", title_so: "Codsi Lacag-celin", val: operations.refundRequests },
                  { title_en: "Low Stock Products", title_so: "Alaab Sii Dhamanaysa", val: operations.lowStockProducts },
                  { title_en: "Unread Messages", title_so: "Farriimo aan la akhrin", val: operations.unreadMessages },
                  { title_en: "Cash Outstanding", title_so: "Cash Outstanding", val: `$${operations.cashOutstanding.toFixed(2)}`, colSpan: true, accent: true },
                  { title_en: "Daily Revenue", title_so: "Dakhliga Maanta", val: `$${operations.dailyRevenue.toFixed(2)}`, colSpan: true, accent: true },
                  { title_en: "Daily Profit", title_so: "Faa'iidada Maanta", val: `$${operations.dailyProfit.toFixed(2)}`, colSpan: true, accent: true }
                ].map((item, idx) => (
                  <div 
                    key={idx} 
                    className={`p-5 rounded-xl flex flex-col justify-between transition-all hover:-translate-y-1 ${
                      item.accent 
                        ? "bg-zinc-950 border border-[#D4AF37]/30 shadow-[0_0_15px_rgba(212,175,55,0.05)]" 
                        : "bg-zinc-950 border border-zinc-900 hover:border-zinc-700 shadow-sm"
                    } ${item.colSpan ? "col-span-2 md:col-span-2 lg:col-span-2" : ""}`}
                  >
                    <div className="space-y-1">
                      <p className={`text-[9px] uppercase tracking-[0.2em] font-black ${item.accent ? "text-[#D4AF37]" : "text-zinc-400"}`}>
                        {item.title_en}
                      </p>
                      <p className="text-[8px] font-bold text-zinc-600 uppercase tracking-widest">{item.title_so}</p>
                    </div>
                    <h4 className={`text-2xl font-black mt-4 tracking-tight font-sans ${item.accent ? "text-white" : "text-zinc-100"}`}>
                      {item.val}
                    </h4>
                  </div>
                ))}
              </div>
            </div>

            {/* Task Alerts Section */}
            <div className="bg-[#080808] border border-zinc-900 rounded-2xl p-6 lg:p-8 shadow-2xl">
              <div className="border-b border-zinc-900 pb-4 mb-6">
                <h3 className="text-xs font-black uppercase tracking-[0.2em] text-[#D4AF37]">Task Alerts & System Failures</h3>
                <p className="text-[10px] text-zinc-500 uppercase tracking-widest mt-1">Digniinaha iyo hawlaha u baahan in hadda la xaliyo</p>
              </div>

              {alerts.length === 0 ? (
                <div className="p-5 bg-green-950/20 text-green-400 rounded-xl text-xs font-bold border border-green-900/30 flex items-center gap-3 uppercase tracking-wider">
                  <ShieldCheck className="h-5 w-5" /> Operations fully optimized! All checks passed successfully.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {alerts.map((al: any) => (
                    <div key={al.id} className={`p-5 rounded-xl border flex gap-4 items-start transition-all shadow-sm ${
                      al.level === "danger" 
                        ? "bg-red-950/20 text-red-100 border-red-900/50" 
                        : al.level === "warning" ? "bg-amber-950/20 text-amber-100 border-amber-900/50" : "bg-blue-950/20 text-blue-100 border-blue-900/50"
                    }`}>
                      <AlertTriangle className={`h-5 w-5 flex-shrink-0 mt-0.5 ${
                        al.level === "danger" ? "text-red-500" : al.level === "warning" ? "text-amber-500" : "text-blue-500"
                      }`} />
                      <div className="space-y-1.5">
                        <h4 className="text-[10px] font-black uppercase tracking-widest flex flex-wrap gap-x-2">
                          <span className={al.level === "danger" ? "text-red-400" : al.level === "warning" ? "text-amber-400" : "text-blue-400"}>
                            {al.title_en}
                          </span>
                          <span className="opacity-40">|</span>
                          <span className="opacity-70">{al.title_so}</span>
                        </h4>
                        <p className="text-[11px] font-medium leading-relaxed text-zinc-300">{al.desc_en}</p>
                        <p className="text-[9px] font-bold leading-relaxed text-zinc-500">{al.desc_so}</p>
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
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Business Targets & Projections */}
            <div className="lg:col-span-2 bg-[#080808] border border-zinc-900 rounded-2xl p-6 lg:p-8 shadow-2xl">
              <div className="border-b border-zinc-900 pb-4 mb-6">
                <h3 className="text-xs font-black uppercase tracking-[0.2em] text-[#D4AF37]">Monthly Business Targets</h3>
                <p className="text-[10px] text-zinc-500 uppercase tracking-widest mt-1">Hadafyada ganacsi ee bishaan iyo saadaalinta dhammaadka bisha</p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-zinc-950/50 border-y border-zinc-800">
                      <th className="p-4 text-[9px] uppercase font-black tracking-widest text-zinc-500">Target Metric</th>
                      <th className="p-4 text-right text-[9px] uppercase font-black tracking-widest text-zinc-500">Current</th>
                      <th className="p-4 text-right text-[9px] uppercase font-black tracking-widest text-zinc-500">Target</th>
                      <th className="p-4 text-center text-[9px] uppercase font-black tracking-widest text-zinc-500">Progress</th>
                      <th className="p-4 text-right text-[9px] uppercase font-black tracking-widest text-[#D4AF37]">Forecast</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-900">
                    {targets.map((tg: any) => (
                      <tr key={tg.key} className="hover:bg-zinc-950/30 transition-colors">
                        <td className="p-4">
                          <p className="text-[11px] font-bold text-zinc-100">{tg.name_en}</p>
                          <p className="text-[9px] text-zinc-600 font-bold uppercase tracking-wider mt-0.5">{tg.name_so}</p>
                        </td>
                        <td className="p-4 text-right text-xs font-black text-white">
                          {tg.unit === "$" && "$"}
                          {tg.current.toLocaleString(undefined, { minimumFractionDigits: tg.unit === "$" ? 2 : 0, maximumFractionDigits: tg.unit === "$" ? 2 : 0 })}
                          {tg.unit === "%" && "%"}
                        </td>
                        <td className="p-4 text-right text-xs font-black text-zinc-500">
                          {tg.unit === "$" && "$"}
                          {tg.target.toLocaleString(undefined, { minimumFractionDigits: tg.unit === "$" ? 2 : 0, maximumFractionDigits: tg.unit === "$" ? 2 : 0 })}
                          {tg.unit === "%" && "%"}
                        </td>
                        <td className="p-4 text-center align-middle">
                          <div className="flex items-center justify-center gap-3">
                            <div className="w-20 bg-zinc-900 h-1.5 rounded-full overflow-hidden">
                              <div className="bg-[#D4AF37] h-full shadow-[0_0_10px_rgba(212,175,55,0.5)]" style={{ width: `${tg.progress}%` }} />
                            </div>
                            <span className="text-[10px] font-black text-zinc-300 w-8 text-right">{tg.progress.toFixed(0)}%</span>
                          </div>
                        </td>
                        <td className="p-4 text-right text-xs font-black text-[#D4AF37]">
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
            <div className="bg-[#080808] border border-zinc-900 rounded-2xl p-6 lg:p-8 shadow-2xl flex flex-col">
              <div className="flex justify-between items-start border-b border-zinc-900 pb-4 mb-6">
                <div>
                  <h3 className="text-xs font-black uppercase tracking-[0.2em] text-[#D4AF37]">Closing Report</h3>
                  <p className="text-[10px] text-zinc-500 uppercase tracking-widest mt-1">Warbixinta dakhliga</p>
                </div>
                
                <select
                  value={closingPeriod}
                  onChange={(e) => setClosingPeriod(e.target.value as PeriodReportType)}
                  className="bg-zinc-950 border border-zinc-800 text-[9px] font-black uppercase tracking-widest py-2 px-3 rounded-lg outline-none focus:border-[#D4AF37] text-white cursor-pointer"
                >
                  <option value="daily">DAILY</option>
                  <option value="weekly">WEEKLY</option>
                  <option value="monthly">MONTHLY</option>
                </select>
              </div>

              <div className="flex-1 space-y-4 text-xs text-zinc-400 font-bold uppercase tracking-wider">
                <div className="flex justify-between border-b border-zinc-900/50 pb-2.5">
                  <span>Total Orders</span>
                  <span className="text-white">{currentClosingReport.totalOrders}</span>
                </div>
                <div className="flex justify-between border-b border-zinc-900/50 pb-2.5 text-[10px]">
                  <span className="text-zinc-600">Paid / Unpaid</span>
                  <span className="text-zinc-300">{currentClosingReport.paidOrders} paid | {currentClosingReport.unpaidOrders} unpaid</span>
                </div>
                <div className="flex justify-between border-b border-zinc-900/50 pb-2.5">
                  <span>Gross Revenue</span>
                  <span className="text-white">${currentClosingReport.revenue.toFixed(2)}</span>
                </div>
                <div className="flex justify-between border-b border-zinc-900/50 pb-2.5 text-red-400/80 text-[10px]">
                  <span>Discounts Offered</span>
                  <span>-${currentClosingReport.discounts.toFixed(2)}</span>
                </div>
                <div className="flex justify-between border-b border-zinc-900/50 pb-2.5 text-red-400/80 text-[10px]">
                  <span>Gateway Fees (2%)</span>
                  <span>-${currentClosingReport.paymentFees.toFixed(2)}</span>
                </div>
                <div className="flex justify-between border-b border-zinc-900/50 pb-2.5 text-red-400/80 text-[10px]">
                  <span>Delivery Expenses</span>
                  <span>-${currentClosingReport.deliveryExpenses.toFixed(2)}</span>
                </div>
                <div className="flex justify-between border-b border-zinc-900/50 pb-2.5 text-red-500/80 text-[10px]">
                  <span>Refunds Processed</span>
                  <span>-${currentClosingReport.refunds.toFixed(2)}</span>
                </div>
                <div className="flex justify-between border-b border-zinc-900/50 pb-2.5 text-green-400 mt-2 pt-2">
                  <span>Net Cash Collected</span>
                  <span>${currentClosingReport.cashCollected.toFixed(2)}</span>
                </div>
                <div className="flex justify-between border-b border-zinc-900/50 pb-2.5 text-red-400">
                  <span>Cash Outstanding</span>
                  <span>${currentClosingReport.cashOutstanding.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm font-black text-[#D4AF37] pt-4 pb-2">
                  <span>Calculated Profit:</span>
                  <span>${currentClosingReport.profit.toFixed(2)}</span>
                </div>
              </div>

              <button 
                onClick={() => window.print()} 
                className="w-full mt-6 bg-[#D4AF37] text-black font-extrabold text-[10px] uppercase tracking-[0.25em] py-3.5 rounded-xl hover:bg-[#c9a227] transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                Print Invoice Report
              </button>
            </div>

          </div>
        )}

        {/* TAB 3: DISASTER RECOVERY & EXPORTS */}
        {activeTab === "disaster" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* JSON Backups Data Exporters */}
            <div className="bg-[#080808] border border-zinc-900 rounded-2xl p-6 lg:p-8 shadow-2xl flex flex-col">
              <div className="border-b border-zinc-900 pb-4 mb-6">
                <h3 className="text-xs font-black uppercase tracking-[0.2em] text-[#D4AF37]">JSON Exporters</h3>
                <p className="text-[10px] text-zinc-500 uppercase tracking-widest mt-1">U dhoofi xogta oo dhan hab kayd ahaan</p>
              </div>

              <div className="flex-1 space-y-3">
                {[
                  { name: "Export Products", table: "products" },
                  { name: "Export Customers", table: "profiles" },
                  { name: "Export Orders", table: "orders" },
                  { name: "Export Payments", table: "payments" },
                  { name: "Export Settings", table: "settings" }
                ].map((exp, idx) => (
                  <button
                    key={idx}
                    onClick={() => triggerExport(exp.table)}
                    className="w-full border border-zinc-800 hover:border-[#D4AF37] p-4 rounded-xl flex items-center justify-between text-[10px] font-black uppercase tracking-[0.15em] text-zinc-400 hover:text-[#D4AF37] transition-all bg-zinc-950 cursor-pointer group"
                  >
                    <span>{exp.name}</span>
                    <Download className="h-4 w-4 text-zinc-600 group-hover:text-[#D4AF37] transition-colors" />
                  </button>
                ))}
              </div>

              {/* Daily Backup Status */}
              <div className="border-t border-zinc-900 pt-6 mt-6">
                <h4 className="text-[9px] uppercase font-black tracking-widest text-zinc-600 mb-3">Daily Backup Status</h4>
                <div className="bg-green-950/10 p-4 rounded-xl border border-green-900/30 text-[10px] font-bold text-green-500 space-y-2">
                  <p className="flex justify-between">Status: <span>{backupStatus.status.toUpperCase()}</span></p>
                  <p className="flex justify-between">Last Backup: <span className="font-mono text-zinc-300">{new Date(backupStatus.last_backup_at).toLocaleString()}</span></p>
                  <p className="flex justify-between">File Size: <span>{backupStatus.file_size}</span></p>
                  <p className="text-[8px] uppercase tracking-widest opacity-60 pt-2 leading-normal border-t border-green-900/50 mt-2">{backupStatus.frequency}</p>
                </div>
              </div>
            </div>

            {/* Disaster Recovery Checklist & Restoration Instructions */}
            <div className="lg:col-span-2 bg-[#080808] border border-zinc-900 rounded-2xl p-6 lg:p-8 shadow-2xl space-y-8">
              <div className="border-b border-zinc-900 pb-4">
                <h3 className="text-xs font-black uppercase tracking-[0.2em] text-[#D4AF37]">Disaster-Recovery Checklist & Instructions</h3>
                <p className="text-[10px] text-zinc-500 uppercase tracking-widest mt-1">Tallaabooyinka soo-celinta xogta boutique-ga ee xaaladaha degdegga ah</p>
              </div>

              {/* Instructions checklist */}
              <div className="space-y-4">
                <div className="bg-zinc-950 p-5 rounded-xl border border-zinc-800">
                  <h4 className="text-[#D4AF37] uppercase font-black tracking-[0.15em] text-[10px] flex items-center gap-2 mb-4">
                    <ClipboardList className="h-4 w-4" /> Checklist / Hubinta
                  </h4>
                  <ul className="space-y-3.5 text-[11px] leading-relaxed text-zinc-300 font-medium">
                    <li className="flex items-start gap-3">
                      <input type="checkbox" defaultChecked className="rounded border-zinc-700 bg-zinc-900 text-[#D4AF37] focus:ring-[#D4AF37] focus:ring-offset-zinc-950 h-4 w-4 mt-0.5" />
                      <span>Verify that Supabase CLI is authenticated against target project-ref.</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <input type="checkbox" defaultChecked className="rounded border-zinc-700 bg-zinc-900 text-[#D4AF37] focus:ring-[#D4AF37] focus:ring-offset-zinc-950 h-4 w-4 mt-0.5" />
                      <span>Download latest `.sql` database backup file from secure cold storage.</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <input type="checkbox" className="rounded border-zinc-700 bg-zinc-900 text-[#D4AF37] focus:ring-[#D4AF37] focus:ring-offset-zinc-950 h-4 w-4 mt-0.5" />
                      <span>Pause payment webhook integrations (Stripe, Paypal) to prevent data corruption during restoration.</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <input type="checkbox" className="rounded border-zinc-700 bg-zinc-900 text-[#D4AF37] focus:ring-[#D4AF37] focus:ring-offset-zinc-950 h-4 w-4 mt-0.5" />
                      <span>Restore database schema using Supabase CLI commands.</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <input type="checkbox" className="rounded border-zinc-700 bg-zinc-900 text-[#D4AF37] focus:ring-[#D4AF37] focus:ring-offset-zinc-950 h-4 w-4 mt-0.5" />
                      <span>Resume webhook systems and trigger mock payment verification to test connectivity.</span>
                    </li>
                  </ul>
                </div>

                {/* Recovery commands */}
                <div className="space-y-4 pt-2">
                  <h4 className="text-[10px] uppercase font-black tracking-[0.15em] text-zinc-500">Restore Instructions / Tilmaamaha</h4>
                  
                  <div className="space-y-2">
                    <p className="text-[10px] text-zinc-400 uppercase tracking-widest font-bold">Using Supabase CLI:</p>
                    <pre className="bg-[#040404] border border-zinc-800 text-[#D4AF37] p-4 rounded-xl font-mono text-[10px] select-all overflow-x-auto shadow-inner leading-relaxed">
                      supabase db restore --project-ref &lt;project-id&gt; -f ./backups/tokiyo_latest.sql
                    </pre>
                  </div>

                  <div className="space-y-2 pt-2">
                    <p className="text-[10px] text-zinc-400 uppercase tracking-widest font-bold">Using standard PostgreSQL client:</p>
                    <pre className="bg-[#040404] border border-zinc-800 text-[#D4AF37] p-4 rounded-xl font-mono text-[10px] select-all overflow-x-auto shadow-inner leading-relaxed">
                      psql -h db.supabase.co -p 5432 -U postgres -d postgres -f ./backups/tokiyo_latest.sql
                    </pre>
                  </div>
                </div>
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
