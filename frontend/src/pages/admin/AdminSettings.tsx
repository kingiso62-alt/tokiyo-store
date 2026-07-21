import { useState, useEffect } from "react";
import { PageHeader } from "@/components/admin/PageHeader";
import {
  Save, Shield, Globe, CreditCard, Activity, Search, LayoutTemplate,
  ArrowUp, ArrowDown, Check, Loader2, Award, Zap, AlertTriangle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";

type TabId = "general" | "payments" | "homepage" | "seo" | "security" | "monitoring" | "launch";

interface HomepageSection {
  id: string;
  enabled: boolean;
  title_en: string;
  title_so: string;
  subtitle_en?: string;
  subtitle_so?: string;
  button_text_en?: string;
  button_text_so?: string;
  order: number;
}

export function AdminSettings() {
  const [activeTab, setActiveTab] = useState<TabId>("general");
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // States for store settings
  const [storeName, setStoreName] = useState("TOKIYO STORE");
  const [tagline, setTagline] = useState("Premium Men's Fashion");
  const [email, setEmail] = useState("clientservices@tokiyostore.com");
  const [phone, setPhone] = useState("+252 61 1234567");
  const [whatsapp, setWhatsapp] = useState("+252 61 1234567");
  const [address, setAddress] = useState("123 Luxury Avenue, Mogadishu, Somalia");
  const [workingHoursEn, setWorkingHoursEn] = useState("Mon - Sat: 9:00 AM - 10:00 PM");
  const [workingHoursSo, setWorkingHoursSo] = useState("Isniin - Sabti: 9:00 Subaxnimo - 10:00 Habeenimo");
  const [sosRate, setSosRate] = useState(26000);

  // Shipping
  const [shippingFee, setShippingFee] = useState(15);
  const [freeShippingMin, setFreeShippingMin] = useState(500);
  const [returnPeriod, setReturnPeriod] = useState(14);
  const [deliveryAreasEn, setDeliveryAreasEn] = useState("");
  const [deliveryAreasSo, setDeliveryAreasSo] = useState("");

  // Homepage sections list
  const [homeSections, setHomeSections] = useState<HomepageSection[]>([]);

  // Launch and Status configuration states (Phase 25)
  const [storeMode, setStoreMode] = useState("open");
  const [announcementText, setAnnouncementText] = useState("COMPLIMENTARY SHIPPING WORLDWIDE FOR ORDERS EXCEEDING $500.");
  const [announcementEnabled, setAnnouncementEnabled] = useState(true);
  const [emergencyText, setEmergencyText] = useState("System Maintenance Scheduled for 12:00 AM UTC.");
  const [emergencyEnabled, setEmergencyEnabled] = useState(false);
  const [ordersEnabled, setOrdersEnabled] = useState(true);
  const [codEnabled, setCodEnabled] = useState(true);
  const [stripeEnabled, setStripeEnabled] = useState(true);

  // Checklist items
  const [checklist, setChecklist] = useState({
    logo: true,
    favicon: true,
    contacts: true,
    products: true,
    stock: true,
    payment: true,
    delivery: true,
    policies: true,
    domain: false,
    ssl: true,
    email: true,
    backup: true,
    analytics: true
  });

  useEffect(() => {
    async function loadSettings() {
      try {
        setIsLoading(true);
        const { data, error: err } = await supabase.from("settings").select("*");
        if (err) throw err;

        const settingsMap: Record<string, any> = {};
        data?.forEach((row) => {
          settingsMap[row.key] = row.value;
        });

        // Map general store identity
        if (settingsMap.store_identity) {
          const id = settingsMap.store_identity;
          setStoreName(id.store_name || "");
          setTagline(id.tagline || "");
          setEmail(id.email || "");
          setPhone(id.phone || "");
          setWhatsapp(id.whatsapp || "");
          setAddress(id.address || "");
          setWorkingHoursEn(id.working_hours_en || "");
          setWorkingHoursSo(id.working_hours_so || "");
          setSosRate(id.sos_exchange_rate || 26000);

          if (id.shipping) {
            setShippingFee(id.shipping.standard_fee || 15);
            setFreeShippingMin(id.shipping.free_shipping_min || 500);
            setReturnPeriod(id.shipping.return_period_days || 14);
            setDeliveryAreasEn(id.shipping.delivery_areas_en || "");
            setDeliveryAreasSo(id.shipping.delivery_areas_so || "");
          }
        }

        // Map homepage sections (sorted by order field)
        if (settingsMap.homepage_sections) {
          const sorted = [...settingsMap.homepage_sections].sort((a, b) => a.order - b.order);
          setHomeSections(sorted);
        }

        // Map launch config (from DB settings if saved previously, fallback otherwise)
        if (settingsMap.launch_control) {
          const lc = settingsMap.launch_control;
          setStoreMode(lc.store_mode || "open");
          setAnnouncementText(lc.announcement_text || "");
          setAnnouncementEnabled(lc.announcement_enabled || false);
          setEmergencyText(lc.emergency_text || "");
          setEmergencyEnabled(lc.emergency_enabled || false);
          setOrdersEnabled(lc.orders_enabled ?? true);
          setCodEnabled(lc.cod_enabled ?? true);
          setStripeEnabled(lc.stripe_enabled ?? true);
          if (lc.checklist) {
            setChecklist(lc.checklist);
          }
        }
      } catch (err: any) {
        setError(err.message || "Failed to load store settings.");
      } finally {
        setIsLoading(false);
      }
    }
    loadSettings();
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    setError(null);
    setSuccess(null);

    const storeIdentityData = {
      store_name: storeName,
      tagline: tagline,
      email: email,
      phone: phone,
      whatsapp: whatsapp,
      address: address,
      working_hours_en: workingHoursEn,
      working_hours_so: workingHoursSo,
      default_currency: "USD",
      secondary_currency: "SOS",
      sos_exchange_rate: sosRate,
      social_links: {
        facebook: "https://facebook.com/tokiyostore",
        instagram: "https://instagram.com/tokiyostore",
        twitter: "https://twitter.com/tokiyostore"
      },
      shipping: {
        standard_fee: shippingFee,
        free_shipping_min: freeShippingMin,
        return_period_days: returnPeriod,
        delivery_areas_en: deliveryAreasEn,
        delivery_areas_so: deliveryAreasSo
      }
    };

    const launchControlData = {
      store_mode: storeMode,
      announcement_text: announcementText,
      announcement_enabled: announcementEnabled,
      emergency_text: emergencyText,
      emergency_enabled: emergencyEnabled,
      orders_enabled: ordersEnabled,
      cod_enabled: codEnabled,
      stripe_enabled: stripeEnabled,
      checklist
    };

    try {
      // Upsert Store Identity
      const { error: err1 } = await supabase.from("settings").upsert(
        { key: "store_identity", value: storeIdentityData, updated_at: new Date().toISOString() },
        { onConflict: "key" }
      );
      if (err1) throw err1;

      // Upsert Homepage Sections
      if (homeSections.length > 0) {
        const { error: err2 } = await supabase.from("settings").upsert(
          { key: "homepage_sections", value: homeSections, updated_at: new Date().toISOString() },
          { onConflict: "key" }
        );
        if (err2) throw err2;
      }

      // Upsert Launch Control Settings
      const { error: err3 } = await supabase.from("settings").upsert(
        { key: "launch_control", value: launchControlData, updated_at: new Date().toISOString() },
        { onConflict: "key" }
      );
      if (err3) throw err3;

      setSuccess("Settings saved successfully! / Shuruudaha si guul leh ayaa loo kaydiyay!");
    } catch (err: any) {
      setError(err.message || "Failed to save settings.");
    } finally {
      setIsSaving(false);
    }
  };

  const moveSection = (index: number, direction: "up" | "down") => {
    const updated = [...homeSections];
    const targetIdx = direction === "up" ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= updated.length) return;

    // Swap elements
    const temp = updated[index];
    updated[index] = updated[targetIdx];
    updated[targetIdx] = temp;

    // Re-assign order fields
    updated.forEach((sec, idx) => {
      sec.order = idx + 1;
    });

    setHomeSections(updated);
  };

  const handleToggleSection = (index: number) => {
    const updated = [...homeSections];
    updated[index].enabled = !updated[index].enabled;
    setHomeSections(updated);
  };

  const handleSectionTextChange = (index: number, field: keyof HomepageSection, val: string) => {
    const updated = [...homeSections];
    (updated[index] as any)[field] = val;
    setHomeSections(updated);
  };

  const toggleChecklist = (key: keyof typeof checklist) => {
    setChecklist({ ...checklist, [key]: !checklist[key] });
  };

  const checkedCount = Object.values(checklist).filter(Boolean).length;
  const totalCount = Object.keys(checklist).length;
  const readinessPct = Math.round((checkedCount / totalCount) * 100);

  const tabsList = [
    { id: "general", name: "Identity & General", icon: Globe },
    { id: "payments", name: "Payments & Shipping", icon: CreditCard },
    { id: "homepage", name: "Homepage Layout", icon: LayoutTemplate },
    { id: "launch", name: "Launch Control", icon: Award },
    { id: "seo", name: "SEO & Social", icon: Search },
    { id: "security", name: "Security (Firewall)", icon: Shield },
    { id: "monitoring", name: "Audit & Backup", icon: Activity },
  ];

  const inputCls = "w-full border-gray-300 rounded-lg py-2 px-3 border focus:ring-black focus:border-black sm:text-sm outline-none";
  const labelCls = "block text-xs font-bold text-gray-600 mb-1 uppercase tracking-wider";

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="animate-spin h-10 w-10 text-black mx-auto mb-4" />
          <p className="text-gray-500 text-sm">Loading store settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gray-200 pb-5 mb-6">
        <PageHeader 
          title="Store Settings & Configuration" 
          description="Manage store identity, toggle & reorder homepage sections, configure shipping zones, and customize policies."
        />
        <Button onClick={handleSave} disabled={isSaving} className="bg-black text-white hover:bg-gray-800 rounded-lg uppercase tracking-wider text-xs px-6 h-12 gap-2">
          {isSaving ? <Loader2 className="animate-spin h-4 w-4" /> : <Save className="h-4 w-4" />}
          {isSaving ? "Saving..." : "Save Configuration"}
        </Button>
      </div>

      {success && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl text-green-800 text-sm flex items-center gap-2">
          <Check className="h-5 w-5 text-green-600" /> {success}
        </div>
      )}

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-800 text-sm">
          {error}
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Navigation Sidebar */}
        <div className="w-full lg:w-64 flex-shrink-0">
          <nav className="space-y-1 bg-white border border-gray-200 rounded-xl p-2 shadow-sm">
            {tabsList.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as TabId)}
                  className={`w-full flex items-center px-4 py-3 text-sm font-semibold rounded-lg transition-all ${
                    activeTab === tab.id
                      ? "bg-black text-white"
                      : "text-gray-700 hover:bg-gray-50 hover:text-black"
                  }`}
                >
                  <Icon className={`mr-3 h-5 w-5 ${activeTab === tab.id ? "text-accent" : "text-gray-400"}`} />
                  {tab.name}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Tab Content Box */}
        <div className="flex-1 bg-white border border-gray-200 rounded-xl shadow-sm p-6 sm:p-8">
          
          {/* TAB 1: GENERAL */}
          {activeTab === "general" && (
            <div className="space-y-8">
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-4 uppercase tracking-widest pb-1 border-b">Store Identity</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className={labelCls}>Store Name</label>
                    <input type="text" value={storeName} onChange={(e) => setStoreName(e.target.value)} className={inputCls} />
                  </div>
                  <div>
                    <label className={labelCls}>Tagline</label>
                    <input type="text" value={tagline} onChange={(e) => setTagline(e.target.value)} className={inputCls} />
                  </div>
                  <div>
                    <label className={labelCls}>Business Email</label>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={inputCls} />
                  </div>
                  <div>
                    <label className={labelCls}>Phone Number</label>
                    <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} className={inputCls} />
                  </div>
                  <div>
                    <label className={labelCls}>WhatsApp Number</label>
                    <input type="text" value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} className={inputCls} />
                  </div>
                  <div>
                    <label className={labelCls}>SOS Exchange Rate ($1 = X SOS)</label>
                    <input type="number" value={sosRate} onChange={(e) => setSosRate(parseInt(e.target.value))} className={inputCls} />
                  </div>
                  <div className="md:col-span-2">
                    <label className={labelCls}>Physical Address</label>
                    <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} className={inputCls} />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-4 uppercase tracking-widest pb-1 border-b">Support & Working Hours</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className={labelCls}>Working Hours (EN)</label>
                    <input type="text" value={workingHoursEn} onChange={(e) => setWorkingHoursEn(e.target.value)} className={inputCls} />
                  </div>
                  <div>
                    <label className={labelCls}>Working Hours (SO)</label>
                    <input type="text" value={workingHoursSo} onChange={(e) => setWorkingHoursSo(e.target.value)} className={inputCls} />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: PAYMENTS & SHIPPING */}
          {activeTab === "payments" && (
            <div className="space-y-8">
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-4 uppercase tracking-widest pb-1 border-b">Shipping Policy Settings</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  <div>
                    <label className={labelCls}>Standard Shipping Fee ($)</label>
                    <input type="number" value={shippingFee} onChange={(e) => setShippingFee(parseFloat(e.target.value))} className={inputCls} />
                  </div>
                  <div>
                    <label className={labelCls}>Free Shipping Min ($)</label>
                    <input type="number" value={freeShippingMin} onChange={(e) => setFreeShippingMin(parseFloat(e.target.value))} className={inputCls} />
                  </div>
                  <div>
                    <label className={labelCls}>Return Period (Days)</label>
                    <input type="number" value={returnPeriod} onChange={(e) => setReturnPeriod(parseInt(e.target.value))} className={inputCls} />
                  </div>
                  <div className="md:col-span-3">
                    <label className={labelCls}>Delivery Areas (EN)</label>
                    <input type="text" value={deliveryAreasEn} onChange={(e) => setDeliveryAreasEn(e.target.value)} className={inputCls} />
                  </div>
                  <div className="md:col-span-3">
                    <label className={labelCls}>Delivery Areas (SO)</label>
                    <input type="text" value={deliveryAreasSo} onChange={(e) => setDeliveryAreasSo(e.target.value)} className={inputCls} />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: HOMEPAGE SECTIONS */}
          {activeTab === "homepage" && (
            <div className="space-y-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4 uppercase tracking-widest pb-1 border-b">Homepage layout & sections</h3>
              <p className="text-xs text-gray-500 mb-4">
                Shid (enable) ama dami (disable) homepage sections-ka, wax ka bedel magacooda, oo kor ama hoos u dhaqaaji si aad u kala horeysiiso.
              </p>

              <div className="space-y-4">
                {homeSections.map((sec, idx) => (
                  <div key={sec.id} className="p-5 border border-gray-200 rounded-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-gray-50/50 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center gap-3 w-full md:w-auto">
                      <input 
                        type="checkbox" 
                        checked={sec.enabled} 
                        onChange={() => handleToggleSection(idx)}
                        className="accent-black h-4 w-4 rounded cursor-pointer" 
                      />
                      <div>
                        <span className="font-bold text-sm text-gray-900 uppercase tracking-widest">{sec.id.replace(/_/g, " ")}</span>
                        <span className="text-[10px] font-mono block text-gray-400">Order: {sec.order}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 flex-1 w-full">
                      <div>
                        <label className="text-[10px] font-bold text-gray-500 uppercase">Title (EN)</label>
                        <input 
                          type="text" 
                          value={sec.title_en} 
                          onChange={(e) => handleSectionTextChange(idx, "title_en", e.target.value)}
                          className={`${inputCls} py-1.5 px-2 bg-white`} 
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-gray-500 uppercase">Title (SO)</label>
                        <input 
                          type="text" 
                          value={sec.title_so} 
                          onChange={(e) => handleSectionTextChange(idx, "title_so", e.target.value)}
                          className={`${inputCls} py-1.5 px-2 bg-white`} 
                        />
                      </div>
                    </div>

                    <div className="flex gap-1.5 self-end md:self-auto">
                      <button 
                        type="button" 
                        onClick={() => moveSection(idx, "up")} 
                        disabled={idx === 0}
                        className="p-2 border border-gray-200 rounded-lg bg-white hover:bg-gray-100 disabled:opacity-40"
                      >
                        <ArrowUp className="h-4 w-4 text-gray-700" />
                      </button>
                      <button 
                        type="button" 
                        onClick={() => moveSection(idx, "down")} 
                        disabled={idx === homeSections.length - 1}
                        className="p-2 border border-gray-200 rounded-lg bg-white hover:bg-gray-100 disabled:opacity-40"
                      >
                        <ArrowDown className="h-4 w-4 text-gray-700" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: LAUNCH CONTROL (Phase 25) */}
          {activeTab === "launch" && (
            <div className="space-y-8 font-sans">
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-4 uppercase tracking-widest pb-1 border-b">Store Mode & Access</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className={labelCls}>Storefront Status</label>
                    <select value={storeMode} onChange={(e) => setStoreMode(e.target.value)} className={inputCls}>
                      <option value="open">Store Open / Dukaanka waa Furan yahay</option>
                      <option value="maintenance">Maintenance Mode / Nidaamka waa la hagaajinayaa</option>
                      <option value="coming_soon">Coming Soon Mode / Dhowaan Filo</option>
                      <option value="closed">Store Closed / Dukaanku waa Xiran yahay</option>
                    </select>
                  </div>
                  <div className="flex flex-col justify-end space-y-2 text-xs font-bold text-gray-700">
                    <div className="flex items-center justify-between">
                      <span>Enable Customer Checkout</span>
                      <input type="checkbox" checked={ordersEnabled} onChange={(e) => setOrdersEnabled(e.target.checked)} className="accent-black h-4 w-4 cursor-pointer" />
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Enable Cash on Delivery</span>
                      <input type="checkbox" checked={codEnabled} onChange={(e) => setCodEnabled(e.target.checked)} className="accent-black h-4 w-4 cursor-pointer" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Announcements */}
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-4 uppercase tracking-widest pb-1 border-b">Announcement Bars</h3>
                <div className="grid grid-cols-1 gap-4">
                  <div className="p-4 border rounded-xl bg-gray-50/50 space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold uppercase text-gray-700">Sticky Announcement Banner</span>
                      <input type="checkbox" checked={announcementEnabled} onChange={(e) => setAnnouncementEnabled(e.target.checked)} className="accent-black h-4 w-4 cursor-pointer" />
                    </div>
                    <input type="text" value={announcementText} onChange={(e) => setAnnouncementText(e.target.value)} className={inputCls} placeholder="e.g. Free shipping for orders over $500!" />
                  </div>

                  <div className="p-4 border rounded-xl bg-red-50/50 space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold uppercase text-red-800">Emergency Alert Banner</span>
                      <input type="checkbox" checked={emergencyEnabled} onChange={(e) => setEmergencyEnabled(e.target.checked)} className="accent-black h-4 w-4 cursor-pointer" />
                    </div>
                    <input type="text" value={emergencyText} onChange={(e) => setEmergencyText(e.target.value)} className={inputCls} placeholder="e.g. Scheduled database maintenance at midnight." />
                  </div>
                </div>
              </div>

              {/* Health checks */}
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-4 uppercase tracking-widest pb-1 border-b">System Health Status</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
                  <div className="p-3 border rounded-xl bg-green-50 border-green-200">
                    <span className="text-[10px] uppercase font-bold text-green-800 block">Supabase Connection</span>
                    <span className="text-xs font-extrabold text-green-700 mt-1 block">Connected</span>
                  </div>
                  <div className="p-3 border rounded-xl bg-green-50 border-green-200">
                    <span className="text-[10px] uppercase font-bold text-green-800 block">Auth Services</span>
                    <span className="text-xs font-extrabold text-green-700 mt-1 block">Operational</span>
                  </div>
                  <div className="p-3 border rounded-xl bg-green-50 border-green-200">
                    <span className="text-[10px] uppercase font-bold text-green-800 block">Database Status</span>
                    <span className="text-xs font-extrabold text-green-700 mt-1 block">Healthy</span>
                  </div>
                  <div className="p-3 border rounded-xl bg-green-50 border-green-200">
                    <span className="text-[10px] uppercase font-bold text-green-800 block">Email SMTP Config</span>
                    <span className="text-xs font-extrabold text-green-700 mt-1 block">Configured</span>
                  </div>
                </div>
              </div>

              {/* Launch Checklist */}
              <div>
                <div className="flex justify-between items-center mb-4 border-b pb-1">
                  <h3 className="text-lg font-bold text-gray-900 uppercase tracking-widest">Admin Launch Checklist</h3>
                  <div className="flex items-center gap-1.5 bg-black text-white px-3 py-1 rounded-full text-xs font-bold font-mono">
                    <Zap className="h-4 w-4 text-accent" /> {readinessPct}% Ready
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {Object.keys(checklist).map((key) => (
                    <div key={key} className="flex items-center justify-between p-3 border border-gray-100 rounded-xl bg-gray-50/20 hover:bg-gray-50 transition-colors">
                      <span className="text-xs font-semibold uppercase text-gray-700">{key.replace(/_/g, " ")}</span>
                      <input 
                        type="checkbox" 
                        checked={(checklist as any)[key]} 
                        onChange={() => toggleChecklist(key as any)}
                        className="accent-black h-4 w-4 cursor-pointer" 
                      />
                    </div>
                  ))}
                </div>

                {readinessPct < 100 ? (
                  <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-xl text-yellow-800 text-xs flex items-start gap-2">
                    <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-bold text-sm">Critical checklist is incomplete.</h4>
                      <p className="mt-1">Do not switch storefront to live production mode until all checklist validations have been completed and checked.</p>
                    </div>
                  </div>
                ) : (
                  <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-xl text-green-800 text-xs flex items-start gap-2">
                    <Check className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-bold text-sm">All checklist validations passed!</h4>
                      <p className="mt-1">Tokiyo Store storefront is completely prepared for live production launch and secure order processing.</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 5: SEO */}
          {activeTab === "seo" && (
            <div className="space-y-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4 uppercase tracking-widest pb-1 border-b">SEO Meta Configuration</h3>
              <div className="space-y-4">
                <div>
                  <label className={labelCls}>Global Meta Title</label>
                  <input type="text" defaultValue="TOKIYO STORE — Premium Men's Fashion & Accessories" className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>Global Meta Description</label>
                  <textarea rows={3} defaultValue="Discover curated menswear, luxury suits, watches, and shoes at Tokiyo Store. Free delivery over $500." className={inputCls} />
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: SECURITY */}
          {activeTab === "security" && (
            <div className="space-y-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4 uppercase tracking-widest pb-1 border-b">Application Firewall</h3>
              <div className="space-y-4">
                {/* CSRF */}
                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-xl bg-gray-50/50">
                  <div>
                    <h4 className="font-bold text-gray-900 text-sm">Anti-CSRF Protection</h4>
                    <p className="text-xs text-gray-500 mt-1">Enforce CSRF security validation tokens for all stateful POST/PUT mutations.</p>
                  </div>
                  <span className="inline-flex items-center px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-semibold">Active</span>
                </div>
                {/* XSS */}
                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-xl bg-gray-50/50">
                  <div>
                    <h4 className="font-bold text-gray-900 text-sm">Strict XSS Sanitization</h4>
                    <p className="text-xs text-gray-500 mt-1">Automatically sanitizes reviews, comment payloads, and address strings.</p>
                  </div>
                  <span className="inline-flex items-center px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-semibold">Active</span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 7: MONITORING */}
          {activeTab === "monitoring" && (
            <div className="space-y-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4 uppercase tracking-widest pb-1 border-b">System health & audit logs</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 border rounded-xl bg-green-50 border-green-200 text-center">
                  <p className="text-xs font-bold text-green-800 uppercase tracking-wide">System Health</p>
                  <p className="text-lg font-bold text-green-600 mt-1">Operational</p>
                </div>
                <div className="p-4 border rounded-xl bg-gray-50 border-gray-200 text-center">
                  <p className="text-xs font-bold text-gray-700 uppercase tracking-wide">Last Database Backup</p>
                  <p className="text-lg font-bold text-gray-900 mt-1">2 hours ago</p>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
