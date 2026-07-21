import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { PageHeader } from "@/components/admin/PageHeader";
import { supabase } from "@/lib/supabase";
import { 
  Mail, MessageSquare, Smartphone, Send, Plus, Calendar, Clock,
  Trash2, AlertCircle, CheckCircle, RefreshCw, BarChart3, Play,
  Users, Gift, Award, Settings, Sparkles, Percent, Database, Globe, EyeOff
} from "lucide-react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Legend, Cell
} from 'recharts';
import { Button } from "@/components/ui/button";

type ActiveTab = "campaigns" | "segments" | "automations" | "analytics";

interface CampaignRecord {
  id: string;
  name: string;
  target_segment: string;
  channel: string;
  language: string;
  subject_en: string | null;
  subject_so: string | null;
  body_en: string;
  body_so: string;
  discount_code: string | null;
  schedule_type: string;
  start_date: string;
  end_date: string | null;
  status: string;
  sent_count: number;
  delivered_count: number;
  opened_count: number;
  clicked_count: number;
  unsubscribed_count: number;
  orders_count: number;
  revenue_generated: number;
  created_at: string;
}

interface SegmentMembers {
  count: number;
  members: Array<{
    id: string;
    first_name: string;
    last_name: string;
    phone: string;
    location: string;
    loyalty_points: number;
  }>;
}

export function AdminMarketing() {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<ActiveTab>("campaigns");
  
  // Compose Campaign State
  const [campName, setCampName] = useState("");
  const [campSegment, setCampSegment] = useState("all");
  const [campChannel, setCampChannel] = useState("email");
  const [campLang, setCampLang] = useState("bilingual");
  const [subjEn, setSubjEn] = useState("");
  const [subjSo, setSubjSo] = useState("");
  const [bodyEn, setBodyEn] = useState("");
  const [bodySo, setBodySo] = useState("");
  const [couponCode, setCouponCode] = useState("");
  const [scheduleType, setScheduleType] = useState("immediate");
  const [startDate, setStartDate] = useState(new Date().toISOString().substring(0, 16));
  const [endDate, setEndDate] = useState("");

  const [activeSegmentDrawer, setActiveSegmentDrawer] = useState<string | null>(null);

  const [isSeeding, setIsSeeding] = useState(false);
  const [isSimulating, setIsSimulating] = useState(false);
  const [simResults, setSimResults] = useState<string | null>(null);
  
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Fetch Coupons for discount code selectors
  const { data: coupons = [] } = useQuery({
    queryKey: ["admin_coupons_list"],
    queryFn: async () => {
      const { data, error } = await supabase.from("coupons").select("code, discount_value");
      if (error) throw error;
      return data || [];
    }
  });

  // Fetch Campaigns
  const { data: campaigns = [], isLoading: campsLoading } = useQuery({
    queryKey: ["admin_campaigns"],
    queryFn: async (): Promise<CampaignRecord[]> => {
      const { data, error } = await supabase
        .from("campaigns")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data || []) as unknown as CampaignRecord[];
    }
  });

  // Fetch Segments Sizes
  const { data: segmentsData, refetch: refetchSegments, isLoading: segmentsLoading } = useQuery({
    queryKey: ["admin_segments"],
    queryFn: async () => {
      const res = await fetch("http://localhost:5000/api/marketing/segments");
      if (!res.ok) throw new Error("Failed to load segments");
      const json = await res.json();
      return json.segments;
    }
  });

  // Fetch Marketing Settings configurations
  const { data: mConfig, refetch: refetchConfig } = useQuery({
    queryKey: ["admin_marketing_config"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("settings")
        .select("value")
        .eq("key", "marketing_automations")
        .single();
      if (error && error.code !== "PGRST116") throw error;
      return data?.value || {
        abandoned_cart: {
          enabled: true,
          delay_hours: 2,
          discount_coupon: "CART10",
          discount_value: 10,
          message_en: "You left items in your cart! Here is a 10% coupon: CART10",
          message_so: "Waxaad alaab kaga tagtay gaarigaaga! Halkan waa 10% kuuboon: CART10"
        },
        welcome_series: {
          enabled: true,
          discount_coupon: "WELCOME10",
          message_en: "Welcome to Tokiyo Store! Enjoy 10% off your first suit.",
          message_so: "Ku soo dhawaada Tokiyo Store! Ku raaxayso 10% dhimis dalabkaaga koobaad."
        },
        post_purchase: {
          loyalty_points_per_dollar: 1,
          recommend_related: true,
          review_delay_days: 3,
          return_coupon: "RETURN15"
        }
      };
    }
  });

  // Fetch Analytics reports
  const { data: analyticsReport, refetch: refetchAnalytics } = useQuery({
    queryKey: ["admin_marketing_analytics"],
    queryFn: async () => {
      const res = await fetch("http://localhost:5000/api/marketing/analytics");
      if (!res.ok) throw new Error("Failed to load analytics");
      const json = await res.json();
      return json.analytics;
    }
  });

  // Mutations
  const createCampaignMutation = useMutation({
    mutationFn: async (campaignData: Partial<CampaignRecord>) => {
      const { data, error } = await supabase.from("campaigns").insert(campaignData);
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin_campaigns"] });
      setSuccessMsg("Campaign created successfully! / Ololaha waa la abuuray.");
      // Reset compose state
      setCampName("");
      setSubjEn("");
      setSubjSo("");
      setBodyEn("");
      setBodySo("");
      setCouponCode("");
      setStartDate(new Date().toISOString().substring(0, 16));
      setEndDate("");
    },
    onError: (err: any) => {
      setErrorMsg(err.message || "Failed to save campaign.");
    }
  });

  const saveSettingsMutation = useMutation({
    mutationFn: async (newConfig: any) => {
      const { error } = await supabase.from("settings").upsert({
        key: "marketing_automations",
        value: newConfig,
        description: "Status and configurations of automated sales triggers."
      }, { onConflict: "key" });
      if (error) throw error;
    },
    onSuccess: () => {
      refetchConfig();
      setSuccessMsg("Automated flows configuration updated! / Habaynta waa la cusbooneysiiyay.");
    },
    onError: (err: any) => {
      setErrorMsg(err.message || "Failed to save settings.");
    }
  });

  const handleDeleteCampaign = async (id: string) => {
    if (!confirm("Are you sure you want to delete this campaign / Ma hubtaa inaad tirtirto?")) return;
    try {
      const { error } = await supabase.from("campaigns").delete().eq("id", id);
      if (error) throw error;
      queryClient.invalidateQueries({ queryKey: ["admin_campaigns"] });
      refetchAnalytics();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleCreateCampaignSubmit = async (e: React.FormEvent, status: "draft" | "scheduled" | "active") => {
    e.preventDefault();
    if (!campName || !bodyEn || !bodySo) {
      setErrorMsg("Please fill in name and messages in both languages.");
      return;
    }
    setErrorMsg(null);
    setSuccessMsg(null);

    const actualStatus = scheduleType === "scheduled" && status !== "draft" ? "scheduled" : status;

    createCampaignMutation.mutate({
      name: campName,
      target_segment: campSegment,
      channel: campChannel,
      language: campLang,
      subject_en: subjEn || null,
      subject_so: subjSo || null,
      body_en: bodyEn,
      body_so: bodySo,
      discount_code: couponCode || null,
      schedule_type: scheduleType,
      start_date: scheduleType === "scheduled" ? new Date(startDate).toISOString() : new Date().toISOString(),
      end_date: endDate ? new Date(endDate).toISOString() : null,
      status: actualStatus,
      sent_count: 0,
      delivered_count: 0,
      opened_count: 0,
      clicked_count: 0,
      unsubscribed_count: 0,
      orders_count: 0,
      revenue_generated: 0
    });
  };

  // Seed Demonstration Data
  const triggerSeedMock = async () => {
    setIsSeeding(true);
    setSuccessMsg(null);
    setErrorMsg(null);
    try {
      const res = await fetch("http://localhost:5000/api/marketing/seed-mock", { method: "POST" });
      const data = await res.json();
      if (data.success) {
        setSuccessMsg(data.message);
        refetchSegments();
        refetchAnalytics();
        queryClient.invalidateQueries({ queryKey: ["admin_campaigns"] });
      } else {
        setErrorMsg(data.error);
      }
    } catch (err: any) {
      setErrorMsg("Connection to server failed. Ensure backend is running. / Serverku ma shaqeynayo.");
    } finally {
      setIsSeeding(false);
    }
  };

  // Simulate Campaign dispatch
  const triggerCampaignSend = async (campaignId: string) => {
    setIsSimulating(true);
    setSuccessMsg(null);
    setErrorMsg(null);
    try {
      const res = await fetch(`http://localhost:5000/api/marketing/campaigns/${campaignId}/send`, { method: "POST" });
      const data = await res.json();
      if (data.success) {
        if (data.summary) {
          setSuccessMsg(`Simulation successful! Sent: ${data.summary.sent}, Delivered: ${data.summary.delivered}, Opened: ${data.summary.opened}, Clicked: ${data.summary.clicked}, Conversions: ${data.summary.ordersCount}, Revenue: $${data.summary.revenue.toFixed(2)}`);
        } else {
          setSuccessMsg(data.message);
        }
        queryClient.invalidateQueries({ queryKey: ["admin_campaigns"] });
        refetchAnalytics();
      } else {
        setErrorMsg(data.error);
      }
    } catch (err: any) {
      setErrorMsg("Campaign dispatch failed. Check backend log.");
    } finally {
      setIsSimulating(false);
    }
  };

  // Simulate Abandoned Cart Scanner
  const triggerAbandonedCartScan = async () => {
    setIsSimulating(true);
    setSuccessMsg(null);
    setErrorMsg(null);
    try {
      const res = await fetch("http://localhost:5000/api/marketing/cron/abandoned-cart", { method: "POST" });
      const data = await res.json();
      if (data.success) {
        setSuccessMsg(data.message);
        refetchAnalytics();
      } else {
        setErrorMsg(data.error);
      }
    } catch (err: any) {
      setErrorMsg("Scan failed. Check if server is running on port 5000.");
    } finally {
      setIsSimulating(false);
    }
  };

  // Simulate Order Confirmation and Review trigger
  const triggerPostPurchaseSim = async (eventType: string) => {
    setIsSimulating(true);
    setSuccessMsg(null);
    setErrorMsg(null);
    try {
      // Find a mock order or seed orders first
      const { data: latestOrder } = await supabase.from("orders").select("id").limit(1);
      const orderId = latestOrder && latestOrder.length > 0 ? latestOrder[0].id : null;

      if (!orderId) {
        setErrorMsg("Please seed demo data first to get a target Order ID / Fadlan marka hore seed garee xogta.");
        setIsSimulating(false);
        return;
      }

      const res = await fetch("http://localhost:5000/api/marketing/trigger-post-purchase", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, eventType })
      });
      const data = await res.json();
      if (data.success) {
        setSuccessMsg(`Simulated post-purchase flow: ${eventType} successfully. / Waa la tijaabiyay.`);
        refetchAnalytics();
      } else {
        setErrorMsg(data.error);
      }
    } catch (err: any) {
      setErrorMsg("Simulation request error.");
    } finally {
      setIsSimulating(false);
    }
  };

  // Edit configurations helper
  const handleConfigChange = (section: string, field: string, value: any) => {
    const updated = {
      ...mConfig,
      [section]: {
        ...mConfig[section],
        [field]: value
      }
    };
    saveSettingsMutation.mutate(updated);
  };

  // Recharts Chart formats
  const chartData = [...campaigns].reverse().map(c => ({
    name: c.name,
    Sent: c.sent_count,
    Delivered: c.delivered_count,
    Opened: c.opened_count,
    Clicked: c.clicked_count,
    Revenue: Number(c.revenue_generated)
  }));

  const segmentChartData = segmentsData ? [
    { name: "New Visitors", count: segmentsData.new_visitors?.count || 0 },
    { name: "Registered", count: segmentsData.registered_customers?.count || 0 },
    { name: "First-time", count: segmentsData.first_time_buyers?.count || 0 },
    { name: "Returning", count: segmentsData.returning_customers?.count || 0 },
    { name: "VIP", count: segmentsData.vip_customers?.count || 0 },
    { name: "High-value", count: segmentsData.high_value_customers?.count || 0 },
    { name: "Inactive", count: segmentsData.inactive_customers?.count || 0 },
    { name: "Abandoned Cart", count: segmentsData.abandoned_cart_customers?.count || 0 },
    { name: "Viewed-No-Buy", count: segmentsData.viewed_did_not_buy?.count || 0 }
  ] : [];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF', '#FF19A3', '#FF4E19', '#9C27B0', '#607D8B'];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 font-sans">
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4 border-b border-gray-200 pb-5">
        <PageHeader 
          title="Sales & Marketing Automation (Phase 28)" 
          description="Build bilingual campaigns, configure cart recovery workflows, target custom customer segments, and track detailed conversion rates."
        />
        
        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-2 items-center bg-gray-100 p-1.5 rounded-xl shadow-inner w-full xl:w-auto">
          {(["campaigns", "segments", "automations", "analytics"] as ActiveTab[]).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 ${
                activeTab === tab ? "bg-black text-white shadow-sm" : "text-gray-500 hover:text-black"
              }`}
            >
              {tab === "campaigns" && <Send className="h-3.5 w-3.5" />}
              {tab === "segments" && <Users className="h-3.5 w-3.5" />}
              {tab === "automations" && <Settings className="h-3.5 w-3.5" />}
              {tab === "analytics" && <BarChart3 className="h-3.5 w-3.5" />}

              {tab === "campaigns" && "Campaign Builder"}
              {tab === "segments" && "Target Segments"}
              {tab === "automations" && "Automated Flows"}
              {tab === "analytics" && "Analytics & Funnels"}
            </button>
          ))}

          {/* Seed demo data */}
          <button
            onClick={triggerSeedMock}
            disabled={isSeeding}
            className="ml-auto bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 px-3.5 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all disabled:opacity-50"
            title="Seed dummy profiles, orders, and view logs to see segments and charts update immediately."
          >
            <Database className={`h-3.5 w-3.5 ${isSeeding ? "animate-spin" : ""}`} />
            {isSeeding ? "Seeding..." : "Seed Demo"}
          </button>
        </div>
      </div>

      {successMsg && <div className="p-4 bg-green-50 text-green-800 text-xs font-bold rounded-xl border border-green-200">{successMsg}</div>}
      {errorMsg && <div className="p-4 bg-red-50 text-red-800 text-xs font-bold rounded-xl border border-red-200 flex gap-2"><AlertCircle className="h-4 w-4" />{errorMsg}</div>}

      {/* CAMPAIGNS TAB */}
      {activeTab === "campaigns" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Create Campaign */}
          <div className="lg:col-span-2 bg-white border rounded-2xl p-6 shadow-sm space-y-5">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-sm font-bold uppercase tracking-widest text-gray-900">Compose Custom Campaign</h3>
              <span className="flex items-center gap-1 text-[10px] uppercase font-bold text-gray-400 bg-gray-100 px-2 py-0.5 rounded">
                <Globe className="h-3 w-3" /> Somali & English
              </span>
            </div>

            <form className="space-y-4 text-xs font-bold text-gray-700">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block uppercase tracking-wider text-[10px] text-gray-500 mb-1">Campaign Name</label>
                  <input type="text" value={campName} onChange={(e) => setCampName(e.target.value)} placeholder="e.g. Back-In-Stock Suit Offer" className="w-full border rounded-lg py-2.5 px-3 focus:ring-black focus:border-black outline-none font-medium text-gray-800" required />
                </div>
                <div>
                  <label className="block uppercase tracking-wider text-[10px] text-gray-500 mb-1">Target Audience (Segment)</label>
                  <select value={campSegment} onChange={(e) => setCampSegment(e.target.value)} className="w-full border rounded-lg py-2.5 px-3 bg-white focus:ring-black focus:border-black outline-none uppercase font-bold text-gray-700">
                    <option value="all">All Registered Customers</option>
                    <option value="new_visitors">New visitors (7d, 0 orders)</option>
                    <option value="first_time_buyers">First-time buyers</option>
                    <option value="returning_customers">Returning customers</option>
                    <option value="vip_customers">VIP customers (spent &gt; $1000)</option>
                    <option value="high_value_customers">High-value customers (spent &gt; $500)</option>
                    <option value="inactive_customers">Inactive customers (&gt;30 days)</option>
                    <option value="abandoned_cart_customers">Abandoned-cart customers</option>
                    <option value="viewed_did_not_buy">Viewed but did not buy (14d)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-t pt-3">
                <div>
                  <label className="block uppercase tracking-wider text-[10px] text-gray-500 mb-1">Channel</label>
                  <select value={campChannel} onChange={(e) => setCampChannel(e.target.value)} className="w-full border rounded-lg py-2.5 px-3 bg-white focus:ring-black focus:border-black outline-none font-bold uppercase text-gray-700">
                    <option value="email">Email</option>
                    <option value="sms">SMS</option>
                    <option value="website">Website notifications</option>
                    <option value="push">Push notifications</option>
                    <option value="whatsapp">WhatsApp-ready integration</option>
                  </select>
                </div>
                <div>
                  <label className="block uppercase tracking-wider text-[10px] text-gray-500 mb-1">Discount Code (Optional)</label>
                  <select value={couponCode} onChange={(e) => setCouponCode(e.target.value)} className="w-full border rounded-lg py-2.5 px-3 bg-white focus:ring-black focus:border-black outline-none font-bold uppercase text-gray-700">
                    <option value="">-- No Discount --</option>
                    {coupons.map(c => (
                      <option key={c.code} value={c.code}>{c.code} ({c.discount_value}% OFF)</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block uppercase tracking-wider text-[10px] text-gray-500 mb-1">Language</label>
                  <select value={campLang} onChange={(e) => setCampLang(e.target.value)} className="w-full border rounded-lg py-2.5 px-3 bg-white focus:ring-black focus:border-black outline-none font-bold uppercase text-gray-700">
                    <option value="bilingual">Bilingual (English + Somali)</option>
                    <option value="so">Somali Only (Soomaali)</option>
                    <option value="en">English Only</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-t pt-3">
                <div>
                  <label className="block uppercase tracking-wider text-[10px] text-gray-500 mb-1">Schedule</label>
                  <select value={scheduleType} onChange={(e) => setScheduleType(e.target.value)} className="w-full border rounded-lg py-2.5 px-3 bg-white focus:ring-black focus:border-black outline-none font-bold uppercase text-gray-700">
                    <option value="immediate">Immediate Dispatch</option>
                    <option value="scheduled">Scheduled Send</option>
                  </select>
                </div>
                {scheduleType === "scheduled" && (
                  <>
                    <div>
                      <label className="block uppercase tracking-wider text-[10px] text-gray-500 mb-1">Start Date & Time</label>
                      <input type="datetime-local" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="w-full border rounded-lg py-2 px-3 focus:ring-black focus:border-black outline-none font-medium text-gray-800" required />
                    </div>
                    <div>
                      <label className="block uppercase tracking-wider text-[10px] text-gray-500 mb-1">End Date & Time (Optional)</label>
                      <input type="datetime-local" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="w-full border rounded-lg py-2 px-3 focus:ring-black focus:border-black outline-none font-medium text-gray-800" />
                    </div>
                  </>
                )}
              </div>

              {(campChannel === "email" || campChannel === "push") && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t pt-3">
                  <div>
                    <label className="block uppercase tracking-wider text-[10px] text-gray-500 mb-1">Email Subject (English)</label>
                    <input type="text" value={subjEn} onChange={(e) => setSubjEn(e.target.value)} placeholder="Subject in English" className="w-full border rounded-lg py-2 px-3 focus:ring-black focus:border-black outline-none font-medium text-gray-800" />
                  </div>
                  <div>
                    <label className="block uppercase tracking-wider text-[10px] text-gray-500 mb-1">Mawduuca Email-ka (Somali)</label>
                    <input type="text" value={subjSo} onChange={(e) => setSubjSo(e.target.value)} placeholder="Mawduuca af-Soomaali" className="w-full border rounded-lg py-2 px-3 focus:ring-black focus:border-black outline-none font-medium text-gray-800" />
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t pt-3">
                <div>
                  <label className="block uppercase tracking-wider text-[10px] text-gray-500 mb-1">Message Content (English)</label>
                  <textarea value={bodyEn} onChange={(e) => setBodyEn(e.target.value)} placeholder="Type promotional messaging in English..." rows={5} className="w-full border rounded-lg py-2 px-3 focus:ring-black focus:border-black outline-none font-medium text-gray-800" required />
                </div>
                <div>
                  <label className="block uppercase tracking-wider text-[10px] text-gray-500 mb-1">Fariinta Ololaha (Somali)</label>
                  <textarea value={bodySo} onChange={(e) => setBodySo(e.target.value)} placeholder="Ku qor fariinta xayeysiiska ah af-Soomaali..." rows={5} className="w-full border rounded-lg py-2 px-3 focus:ring-black focus:border-black outline-none font-medium text-gray-800" required />
                </div>
              </div>

              <div className="pt-2 flex gap-3">
                <Button type="button" onClick={(e) => handleCreateCampaignSubmit(e, "draft")} className="bg-white border border-gray-300 text-gray-800 hover:bg-gray-50 rounded-xl h-11 px-6 text-xs font-bold uppercase tracking-wider transition-all">
                  Save Draft
                </Button>
                <Button type="button" onClick={(e) => handleCreateCampaignSubmit(e, "active")} className="bg-black text-white hover:bg-gray-800 rounded-xl h-11 px-8 text-xs font-bold uppercase tracking-wider gap-1.5 transition-all">
                  <Send className="h-4 w-4" /> {scheduleType === "scheduled" ? "Schedule Campaign" : "Publish & Send"}
                </Button>
              </div>
            </form>
          </div>

          {/* Campaigns List */}
          <div className="bg-white border rounded-2xl p-6 shadow-sm space-y-4 max-h-[85vh] overflow-y-auto">
            <h3 className="text-sm font-bold uppercase tracking-widest text-gray-900 border-b pb-2">Campaigns History</h3>
            
            {campaigns.length === 0 ? (
              <p className="text-xs text-gray-400 text-center py-10 font-bold uppercase">No campaigns found.</p>
            ) : (
              <div className="space-y-4">
                {campaigns.map((c) => (
                  <div key={c.id} className="p-4 border rounded-xl bg-gray-50/50 hover:bg-gray-50 transition-all relative group">
                    <button
                      onClick={() => handleDeleteCampaign(c.id)}
                      className="absolute top-4 right-4 text-gray-400 hover:text-red-600 transition-colors"
                      title="Delete Campaign"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>

                    <div className="pr-6 space-y-2">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <h4 className="font-bold text-sm text-gray-900">{c.name}</h4>
                        <span className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase ${
                          c.status === "active" || c.status === "completed" 
                            ? "bg-green-100 text-green-800" 
                            : c.status === "scheduled" ? "bg-blue-100 text-blue-800" : "bg-gray-200 text-gray-700"
                        }`}>{c.status}</span>
                      </div>
                      <div className="text-[9px] text-gray-400 font-bold uppercase tracking-wider flex flex-wrap gap-x-3 gap-y-1 border-b pb-1.5">
                        <span>Segment: <strong className="text-gray-600">{c.target_segment}</strong></span>
                        <span>Channel: <strong className="text-gray-600">{c.channel}</strong></span>
                        <span>Lang: <strong className="text-gray-600">{c.language}</strong></span>
                      </div>
                      
                      {c.schedule_type === "scheduled" && (
                        <p className="text-[10px] text-gray-500 flex items-center gap-1">
                          <Calendar className="h-3 w-3" /> Scheduled: {new Date(c.start_date).toLocaleString()}
                        </p>
                      )}

                      {/* Display Delivery stats */}
                      <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-[10px] font-bold text-gray-500 pt-1.5">
                        <p className="flex justify-between">Sent: <span className="text-gray-900">{c.sent_count || 0}</span></p>
                        <p className="flex justify-between">Opened: <span className="text-gray-900">{c.opened_count || 0}</span></p>
                        <p className="flex justify-between">Delivered: <span className="text-gray-900">{c.delivered_count || 0}</span></p>
                        <p className="flex justify-between">Clicked: <span className="text-gray-900">{c.clicked_count || 0}</span></p>
                        <p className="col-span-2 flex justify-between text-green-700 border-t pt-1.5 mt-1 border-dashed">
                          Revenue generated: <span>${Number(c.revenue_generated || 0).toFixed(2)}</span>
                        </p>
                      </div>

                      {/* Simulation Trigger button for Draft / Scheduled */}
                      {c.status !== "completed" && (
                        <button
                          type="button"
                          onClick={() => triggerCampaignSend(c.id)}
                          disabled={isSimulating}
                          className="mt-3 w-full bg-black text-white hover:bg-gray-800 disabled:opacity-50 text-[10px] font-bold uppercase tracking-widest py-1.5 rounded-lg flex items-center justify-center gap-1.5 transition-all"
                        >
                          <Play className="h-3 w-3 fill-white" /> Simulate Dispatch
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TARGET SEGMENTS TAB */}
      {activeTab === "segments" && (
        <div className="space-y-6">
          <div className="bg-white border rounded-2xl p-6 shadow-sm">
            <div className="flex justify-between items-center border-b pb-4 mb-5">
              <div>
                <h3 className="text-sm font-bold uppercase tracking-widest text-gray-900">Demographic Customer Segments</h3>
                <p className="text-xs text-gray-400 mt-1">Real-time target segment sizing based on orders history, checkout carts, and view activities.</p>
              </div>
              <button
                onClick={refetchSegments}
                className="p-2 border rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
                title="Refresh Segments size"
              >
                <RefreshCw className="h-4 w-4 text-gray-600" />
              </button>
            </div>

            {segmentsLoading ? (
              <div className="py-20 flex justify-center"><RefreshCw className="h-8 w-8 text-black animate-spin" /></div>
            ) : !segmentsData ? (
              <div className="py-20 text-center text-xs text-gray-400 font-bold uppercase">No segments found. Run Demo Seeding first.</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  { key: "new_visitors", name: "New Visitors", desc: "Registered in last 7 days with 0 orders", icon: Users },
                  { key: "registered_customers", name: "Registered Customers", desc: "All user accounts on the platform", icon: UserCheck },
                  { key: "first_time_buyers", name: "First-time Buyers", desc: "Users with exactly 1 completed order", icon: ShoppingBag },
                  { key: "returning_customers", name: "Returning Customers", desc: "Users with 2 or more completed orders", icon: RefreshCw },
                  { key: "vip_customers", name: "VIP Customers", desc: "Loyalty members with over 1000 pts or $1000 spent", icon: Award },
                  { key: "high_value_customers", name: "High-value Customers", desc: "Users with total spend between $500 - $1000", icon: Gift },
                  { key: "inactive_customers", name: "Inactive Customers", desc: "Has order history but inactive for last 30+ days", icon: EyeOff },
                  { key: "abandoned_cart_customers", name: "Abandoned-Cart Customers", desc: "Users with active cart items left checkout", icon: AlertCircle },
                  { key: "viewed_did_not_buy", name: "Viewed No Buy", desc: "Viewed products in last 14 days without checkout", icon: Smile }
                ].map(seg => {
                  const data = segmentsData[seg.key] as SegmentMembers;
                  const count = data?.count || 0;
                  return (
                    <div key={seg.key} className="bg-gray-50/50 hover:bg-gray-50 border rounded-2xl p-5 transition-all flex flex-col justify-between">
                      <div className="space-y-2">
                        <div className="flex items-start justify-between">
                          <div className="p-2.5 bg-black text-white rounded-xl">
                            <seg.icon className="h-5 w-5" />
                          </div>
                          <p className="text-3xl font-black text-gray-950 leading-none">{count}</p>
                        </div>
                        <h4 className="font-bold text-sm text-gray-900 pt-2">{seg.name}</h4>
                        <p className="text-[11px] text-gray-400 leading-normal">{seg.desc}</p>
                      </div>

                      {count > 0 && (
                        <div className="mt-4 pt-3 border-t border-gray-200">
                          <button
                            onClick={() => setActiveSegmentDrawer(activeSegmentDrawer === seg.key ? null : seg.key)}
                            className="w-full border py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider hover:bg-white transition-colors"
                          >
                            {activeSegmentDrawer === seg.key ? "Hide Members" : "View Members"}
                          </button>

                          {activeSegmentDrawer === seg.key && (
                            <div className="mt-3 space-y-2 border-t pt-2 max-h-48 overflow-y-auto">
                              {data.members.map(m => (
                                <div key={m.id} className="text-[10px] font-bold text-gray-600 bg-white p-2 rounded border flex flex-col gap-0.5">
                                  <p className="text-gray-900">{m.first_name} {m.last_name}</p>
                                  <p className="text-[9px] text-gray-400">Loc: {m.location || "Somalia"} | Points: {m.loyalty_points || 0}</p>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* AUTOMATED FLOWS TAB */}
      {activeTab === "automations" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Abandoned Cart recovery flow */}
            <div className="bg-white border rounded-2xl p-6 shadow-sm space-y-4">
              <div className="flex justify-between items-start border-b pb-3">
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-widest text-gray-900">Abandoned Cart Recovery</h3>
                  <p className="text-[11px] text-gray-400 mt-0.5">Auto-trigger recovery alerts for items left in checkout carts</p>
                </div>
                <span className={`px-2.5 py-0.5 rounded text-[9px] font-bold uppercase ${
                  mConfig?.abandoned_cart?.enabled ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                }`}>
                  {mConfig?.abandoned_cart?.enabled ? "Active" : "Disabled"}
                </span>
              </div>

              <div className="space-y-3 text-xs font-bold text-gray-700">
                <div className="flex items-center justify-between">
                  <label className="uppercase tracking-wider text-[10px] text-gray-500">Automation Trigger Status</label>
                  <button
                    onClick={() => handleConfigChange("abandoned_cart", "enabled", !mConfig.abandoned_cart.enabled)}
                    className={`px-3 py-1 rounded text-[10px] font-bold uppercase ${
                      mConfig?.abandoned_cart?.enabled ? "bg-red-50 text-red-600 border border-red-200" : "bg-black text-white"
                    }`}
                  >
                    {mConfig?.abandoned_cart?.enabled ? "Disable Flow" : "Enable Flow"}
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-4 border-t pt-3">
                  <div>
                    <label className="block uppercase tracking-wider text-[10px] text-gray-500 mb-1">Scanner Trigger Delay</label>
                    <select
                      value={mConfig?.abandoned_cart?.delay_hours || 2}
                      onChange={(e) => handleConfigChange("abandoned_cart", "delay_hours", Number(e.target.value))}
                      className="w-full border rounded-lg py-2 px-3 bg-white font-bold"
                    >
                      <option value={1}>1 Hour</option>
                      <option value={2}>2 Hours (Recommended)</option>
                      <option value={4}>4 Hours</option>
                      <option value={12}>12 Hours</option>
                      <option value={24}>24 Hours</option>
                    </select>
                  </div>
                  <div>
                    <label className="block uppercase tracking-wider text-[10px] text-gray-500 mb-1">Step 2 Discount Coupon</label>
                    <select
                      value={mConfig?.abandoned_cart?.discount_coupon || "CART10"}
                      onChange={(e) => {
                        const val = e.target.value;
                        const coupon = coupons.find(c => c.code === val);
                        handleConfigChange("abandoned_cart", "discount_coupon", val);
                        if (coupon) handleConfigChange("abandoned_cart", "discount_value", Number(coupon.discount_value));
                      }}
                      className="w-full border rounded-lg py-2 px-3 bg-white font-bold uppercase"
                    >
                      {coupons.map(c => (
                        <option key={c.code} value={c.code}>{c.code} ({c.discount_value}% OFF)</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="border-t pt-3 space-y-2">
                  <div>
                    <label className="block uppercase tracking-wider text-[10px] text-gray-500 mb-1">Bilingual Recovery message (English)</label>
                    <textarea
                      value={mConfig?.abandoned_cart?.message_en || ""}
                      onChange={(e) => handleConfigChange("abandoned_cart", "message_en", e.target.value)}
                      rows={2}
                      className="w-full border rounded-lg py-2 px-3 font-medium text-gray-800"
                    />
                  </div>
                  <div>
                    <label className="block uppercase tracking-wider text-[10px] text-gray-500 mb-1">Mawduuca Fariinta Recovery (Somali)</label>
                    <textarea
                      value={mConfig?.abandoned_cart?.message_so || ""}
                      onChange={(e) => handleConfigChange("abandoned_cart", "message_so", e.target.value)}
                      rows={2}
                      className="w-full border rounded-lg py-2 px-3 font-medium text-gray-800"
                    />
                  </div>
                </div>

                <div className="border-t pt-3 bg-gray-50 p-4 rounded-xl space-y-2">
                  <h4 className="text-[10px] uppercase font-black text-gray-900 tracking-wider flex items-center gap-1.5">
                    <Sparkles className="h-3.5 w-3.5 text-black" /> Automation Recovery Simulation
                  </h4>
                  <p className="text-[10px] text-gray-400 leading-normal font-semibold">Simulate cart abandonments scanner. Finds inactive carts, triggers step-wise push alerts, and blocks duplicates on purchase.</p>
                  <Button
                    type="button"
                    onClick={triggerAbandonedCartScan}
                    disabled={isSimulating}
                    className="w-full bg-black text-white hover:bg-gray-800 uppercase tracking-widest text-[10px] h-9 rounded-lg"
                  >
                    Simulate Cart scan
                  </Button>
                </div>
              </div>
            </div>

            {/* Post-Purchase & Reviews flow */}
            <div className="bg-white border rounded-2xl p-6 shadow-sm space-y-4">
              <div className="flex justify-between items-start border-b pb-3">
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-widest text-gray-900">Post-Purchase Automation</h3>
                  <p className="text-[11px] text-gray-400 mt-0.5">Manage order alerts, reviews, rewards, and upsell logic</p>
                </div>
                <span className="px-2.5 py-0.5 rounded bg-green-100 text-green-800 text-[9px] font-bold uppercase">Active</span>
              </div>

              <div className="space-y-4 text-xs font-bold text-gray-700">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block uppercase tracking-wider text-[10px] text-gray-500 mb-1">Review Request Delay (Days)</label>
                    <input
                      type="number"
                      value={mConfig?.post_purchase?.review_delay_days || 3}
                      onChange={(e) => handleConfigChange("post_purchase", "review_delay_days", Number(e.target.value))}
                      className="w-full border rounded-lg py-2 px-3 font-bold"
                    />
                  </div>
                  <div>
                    <label className="block uppercase tracking-wider text-[10px] text-gray-500 mb-1">Award Loyalty Points Ratio</label>
                    <select
                      value={mConfig?.post_purchase?.loyalty_points_per_dollar || 1}
                      onChange={(e) => handleConfigChange("post_purchase", "loyalty_points_per_dollar", Number(e.target.value))}
                      className="w-full border rounded-lg py-2 px-3 bg-white font-bold"
                    >
                      <option value={1}>1 Point per $1 spent</option>
                      <option value={2}>2 Points per $1 spent</option>
                      <option value={5}>5 Points per $1 spent</option>
                    </select>
                  </div>
                </div>

                <div className="border-t pt-3 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block uppercase tracking-wider text-[10px] text-gray-500 mb-1">Return Customer Coupon</label>
                    <select
                      value={mConfig?.post_purchase?.return_coupon || "RETURN15"}
                      onChange={(e) => handleConfigChange("post_purchase", "return_coupon", e.target.value)}
                      className="w-full border rounded-lg py-2 px-3 bg-white font-bold uppercase"
                    >
                      {coupons.map(c => (
                        <option key={c.code} value={c.code}>{c.code} ({c.discount_value}% OFF)</option>
                      ))}
                    </select>
                  </div>
                  <div className="flex flex-col justify-end">
                    <label className="flex items-center gap-2 cursor-pointer py-2">
                      <input
                        type="checkbox"
                        checked={mConfig?.post_purchase?.recommend_related !== false}
                        onChange={(e) => handleConfigChange("post_purchase", "recommend_related", e.target.checked)}
                        className="rounded border-gray-300 text-black focus:ring-black h-4 w-4"
                      />
                      <span className="uppercase tracking-wider text-[10px] text-gray-500">Recommend Related Products</span>
                    </label>
                  </div>
                </div>

                {/* Simulate post-purchase alerts */}
                <div className="border-t pt-3 bg-gray-50 p-4 rounded-xl space-y-2">
                  <h4 className="text-[10px] uppercase font-black text-gray-900 tracking-wider flex items-center gap-1.5">
                    <Sparkles className="h-3.5 w-3.5 text-black" /> Post-Purchase Action Simulation
                  </h4>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => triggerPostPurchaseSim("order_confirmed")}
                      disabled={isSimulating}
                      className="bg-black text-white hover:bg-gray-800 disabled:opacity-50 text-[9px] font-bold uppercase p-2 rounded-lg"
                    >
                      1. Confirm Order
                    </button>
                    <button
                      type="button"
                      onClick={() => triggerPostPurchaseSim("delivery_update")}
                      disabled={isSimulating}
                      className="bg-black text-white hover:bg-gray-800 disabled:opacity-50 text-[9px] font-bold uppercase p-2 rounded-lg"
                    >
                      2. Dispatch Alert
                    </button>
                    <button
                      type="button"
                      onClick={() => triggerPostPurchaseSim("request_review")}
                      disabled={isSimulating}
                      className="bg-black text-white hover:bg-gray-800 disabled:opacity-50 text-[9px] font-bold uppercase p-2 rounded-lg"
                    >
                      3. Ask Review
                    </button>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      )}

      {/* ANALYTICS & INSIGHTS TAB */}
      {activeTab === "analytics" && (
        <div className="space-y-6">
          
          {/* KPI Dashboard */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "Messages Sent", val: analyticsReport?.sent?.toLocaleString() || "0", rate: "100% Outbox" },
              { label: "Messages Delivered", val: analyticsReport?.delivered?.toLocaleString() || "0", rate: `${analyticsReport?.sent > 0 ? ((analyticsReport.delivered / analyticsReport.sent) * 100).toFixed(1) : "0.0"}% Delivery` },
              { label: "Messages Opened", val: analyticsReport?.opened?.toLocaleString() || "0", rate: `${analyticsReport?.delivered > 0 ? ((analyticsReport.opened / analyticsReport.delivered) * 100).toFixed(1) : "0.0"}% Open Rate` },
              { label: "Links Clicked (CTR)", val: analyticsReport?.clicked?.toLocaleString() || "0", rate: `${analyticsReport?.opened > 0 ? ((analyticsReport.clicked / analyticsReport.opened) * 100).toFixed(1) : "0.0"}% Click Rate` },
              { label: "Conversions", val: `${analyticsReport?.orders || 0} orders`, rate: `${analyticsReport?.conversionRate?.toFixed(1) || "0.0"}% Conv. Rate` },
              { label: "Revenue Generated", val: `$${analyticsReport?.revenue?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || "0.00"}`, rate: "From automated links" },
              { label: "Unsubscribe Rate", val: `${analyticsReport?.unsubscribeRate?.toFixed(2) || "0.00"}%`, rate: "Marketing opt-outs" },
              { label: "Subscribed Ratio", val: `${segmentsData ? (segmentsData.registered_customers?.count || 0) : 0} users`, rate: "Subscribed customers" }
            ].map((kpi, idx) => (
              <div key={idx} className="bg-white border p-5 rounded-2xl shadow-sm space-y-1.5">
                <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">{kpi.label}</p>
                <p className="text-xl font-black text-gray-950 font-sans">{kpi.val}</p>
                <span className="text-[9px] font-bold text-gray-500 bg-gray-100 px-2 py-0.5 rounded">{kpi.rate}</span>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Delivery Funnel Graph */}
            <div className="bg-white border rounded-2xl p-6 shadow-sm space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-widest text-gray-900">Interaction Funnels (Sent vs Opened vs Clicked)</h3>
              <div className="h-80">
                {chartData.length === 0 ? (
                  <p className="text-xs text-gray-400 text-center py-24 uppercase font-bold">No campaign data found.</p>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="name" fontSize={9} stroke="#9CA3AF" tickLine={false} />
                      <YAxis fontSize={9} stroke="#9CA3AF" tickLine={false} />
                      <Tooltip />
                      <Legend verticalAlign="top" height={36} wrapperStyle={{ fontSize: 10, fontWeight: "bold" }} />
                      <Area type="monotone" dataKey="Sent" stroke="#10B981" fill="#10B981" fillOpacity={0.05} strokeWidth={2} />
                      <Area type="monotone" dataKey="Delivered" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.05} strokeWidth={2} />
                      <Area type="monotone" dataKey="Opened" stroke="#F59E0B" fill="#F59E0B" fillOpacity={0.05} strokeWidth={2} />
                      <Area type="monotone" dataKey="Clicked" stroke="#EF4444" fill="#EF4444" fillOpacity={0.05} strokeWidth={2} />
                    </AreaChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>

            {/* Campaign Revenue Graph */}
            <div className="bg-white border rounded-2xl p-6 shadow-sm space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-widest text-gray-900">Revenue Generated by Campaign (USD)</h3>
              <div className="h-80">
                {chartData.length === 0 ? (
                  <p className="text-xs text-gray-400 text-center py-24 uppercase font-bold">No campaign data found.</p>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="name" fontSize={9} stroke="#9CA3AF" tickLine={false} />
                      <YAxis fontSize={9} stroke="#9CA3AF" tickLine={false} />
                      <Tooltip />
                      <Bar dataKey="Revenue" fill="#000000" radius={[4, 4, 0, 0]}>
                        {chartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#000000' : '#4b5563'} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>

            {/* Customer segments size distribution */}
            <div className="bg-white border rounded-2xl p-6 shadow-sm space-y-4 lg:col-span-2">
              <h3 className="text-sm font-bold uppercase tracking-widest text-gray-900">Segment Distribution</h3>
              <div className="h-80">
                {segmentChartData.length === 0 ? (
                  <p className="text-xs text-gray-400 text-center py-24 uppercase font-bold">No segment distribution data. Run Demo Seeding.</p>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={segmentChartData} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                      <XAxis type="number" fontSize={9} stroke="#9CA3AF" tickLine={false} />
                      <YAxis dataKey="name" type="category" fontSize={10} stroke="#9CA3AF" tickLine={false} width={100} />
                      <Tooltip />
                      <Bar dataKey="count" fill="#4f46e5" radius={[0, 4, 4, 0]}>
                        {segmentChartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
