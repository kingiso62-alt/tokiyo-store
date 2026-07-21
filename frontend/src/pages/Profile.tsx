import { useState, useEffect } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { fetchMyOrders } from "@/lib/api";
import { Copy, Check, Save, User, Phone, Image, Award, AlertCircle, Package, Clock, Truck, MapPin, XCircle } from "lucide-react";

export function Profile() {
  const { user, profile, setProfile, signOut } = useAuthStore();
  
  // Form states
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  // Populate form fields on load
  useEffect(() => {
    if (profile) {
      setFirstName(profile.first_name || "");
      setLastName(profile.last_name || "");
      setPhone(profile.phone || "");
      setAvatarUrl(profile.avatar_url || "");
    } else if (user) {
      // If profile is not loaded yet but we have user metadata from Google OAuth
      setFirstName(user.user_metadata?.first_name || user.user_metadata?.name?.split(" ")[0] || "");
      setLastName(user.user_metadata?.last_name || user.user_metadata?.name?.split(" ")[1] || "");
      setAvatarUrl(user.user_metadata?.avatar_url || user.user_metadata?.picture || "");
    }
  }, [profile, user]);

  // Fetch user orders
  const { data: myOrders = [], isLoading: isLoadingOrders } = useQuery({
    queryKey: ["my_orders", user?.id],
    queryFn: () => fetchMyOrders(user!.id),
    enabled: !!user?.id
  });

  // Handle Profile Update
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setLoading(true);
    setSuccessMsg("");
    setErrorMsg("");

    try {
      const { data, error } = await supabase
        .from("profiles")
        .update({
          first_name: firstName,
          last_name: lastName,
          phone: phone,
          avatar_url: avatarUrl,
          updated_at: new Date().toISOString()
        })
        .eq("id", user.id)
        .select()
        .single();

      if (error) throw error;
      
      setProfile(data);
      setSuccessMsg("Profile-kaaga si guul leh ayaa loo cusbooneysiiyay! / Profile updated successfully!");
      setTimeout(() => setSuccessMsg(""), 4000);
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to update profile.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopyId = () => {
    if (!user?.id) return;
    navigator.clipboard.writeText(user.id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Determine avatar source: DB avatar_url, or Google OAuth avatar, or fallback letter
  const googleAvatar = user?.user_metadata?.avatar_url || user?.user_metadata?.picture;
  const currentAvatar = avatarUrl || googleAvatar;
  const shortUserId = user?.id ? user.id.substring(0, 8) : "";

  return (
    <div className="bg-[#040404] min-h-screen text-white pt-32 pb-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#080808] border border-zinc-900 rounded-2xl p-8 shadow-2xl space-y-8">
          
          {/* Header */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 border-b border-zinc-900 pb-8">
            <div className="flex flex-col sm:flex-row items-center gap-5">
              {/* Profile Image / Initial Fallback */}
              {currentAvatar ? (
                <img 
                  src={currentAvatar} 
                  alt="Profile Avatar" 
                  className="h-20 w-20 rounded-full object-cover border-2 border-[#D4AF37] shadow-[0_0_15px_rgba(212,175,55,0.2)]"
                  onError={(e) => {
                    // If image fails to load, clear it so it falls back to the letter circle
                    (e.target as HTMLImageElement).style.display = "none";
                  }}
                />
              ) : (
                <div className="h-20 w-20 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-3xl font-black text-[#D4AF37] uppercase">
                  {firstName.charAt(0) || user?.email?.charAt(0) || "U"}
                </div>
              )}
              
              <div className="text-center sm:text-left space-y-1">
                <h1 className="text-2xl font-black uppercase tracking-wider text-white">
                  {firstName || lastName ? `${firstName} ${lastName}` : "User Profile"}
                </h1>
                <p className="text-zinc-500 text-xs font-semibold">{user?.email}</p>
                <div className="inline-flex items-center rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/20 px-3 py-0.5 text-[9px] font-black uppercase tracking-wider text-[#D4AF37]">
                  {profile?.role || "CUSTOMER"}
                </div>
              </div>
            </div>

            {/* Logout */}
            <Button 
              variant="outline" 
              onClick={signOut} 
              className="border-zinc-800 hover:border-red-900 text-zinc-400 hover:text-red-500 hover:bg-red-950/20 uppercase tracking-widest text-[9px] font-black h-10 px-5 rounded-xl transition-all"
            >
              Sign Out
            </Button>
          </div>

          {/* Success / Error Messages */}
          {successMsg && (
            <div className="p-4 bg-green-950/30 border border-green-800/50 text-green-400 rounded-xl text-xs font-bold uppercase tracking-wider">
              {successMsg}
            </div>
          )}

          {errorMsg && (
            <div className="p-4 bg-red-950/30 border border-red-900/50 text-red-400 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2">
              <AlertCircle className="w-4 h-4" /> {errorMsg}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleUpdate} className="space-y-6">
            
            <h2 className="text-sm font-extrabold uppercase tracking-[0.2em] text-[#D4AF37] border-b border-zinc-900 pb-2">
              Account Information
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-[9px] font-black text-zinc-500 mb-2 uppercase tracking-widest">
                  First Name / Magaca Kowaad
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-zinc-600">
                    <User className="h-4 w-4" />
                  </span>
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full bg-[#040404] border border-zinc-800 rounded-xl py-3 pl-10 pr-4 text-xs text-white placeholder-zinc-700 focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] outline-none transition-all font-semibold"
                    placeholder="Enter first name"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[9px] font-black text-zinc-500 mb-2 uppercase tracking-widest">
                  Last Name / Magaca Qoyska
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-zinc-600">
                    <User className="h-4 w-4" />
                  </span>
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full bg-[#040404] border border-zinc-800 rounded-xl py-3 pl-10 pr-4 text-xs text-white placeholder-zinc-700 focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] outline-none transition-all font-semibold"
                    placeholder="Enter last name"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-[9px] font-black text-zinc-500 mb-2 uppercase tracking-widest">
                  Phone Number / Telefoonka
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-zinc-600">
                    <Phone className="h-4 w-4" />
                  </span>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-[#040404] border border-zinc-800 rounded-xl py-3 pl-10 pr-4 text-xs text-white placeholder-zinc-700 focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] outline-none transition-all font-semibold"
                    placeholder="E.g., +252 61 XXXXXXX"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[9px] font-black text-zinc-500 mb-2 uppercase tracking-widest">
                  Profile Picture URL / Sawirka Link-giisa
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-zinc-600">
                    <Image className="h-4 w-4" />
                  </span>
                  <input
                    type="url"
                    value={avatarUrl}
                    onChange={(e) => setAvatarUrl(e.target.value)}
                    className="w-full bg-[#040404] border border-zinc-800 rounded-xl py-3 pl-10 pr-4 text-xs text-white placeholder-zinc-700 focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] outline-none transition-all font-semibold"
                    placeholder="Paste image link/URL"
                  />
                </div>
              </div>
            </div>

            <div className="border-t border-zinc-900 pt-6 grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
              {/* User ID - Shortened format */}
              <div className="bg-zinc-950 border border-zinc-900 rounded-xl p-4 flex items-center justify-between gap-3">
                <div>
                  <span className="block text-[8px] font-black text-zinc-600 uppercase tracking-widest">User ID</span>
                  <span className="font-mono text-zinc-400 font-bold">{shortUserId}</span>
                </div>
                <button
                  type="button"
                  onClick={handleCopyId}
                  className="p-2 bg-zinc-900 border border-zinc-800 rounded-lg hover:border-[#D4AF37] transition-all hover:text-[#D4AF37]"
                  title="Copy full User ID"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>

              {/* Loyalty Program */}
              <div className="bg-zinc-950 border border-zinc-900 rounded-xl p-4 flex items-center gap-4">
                <div className="w-10 h-10 rounded-full border border-[#D4AF37]/30 flex items-center justify-center bg-[#D4AF37]/5">
                  <Award className="h-5 w-5 text-[#D4AF37]" />
                </div>
                <div>
                  <span className="block text-[8px] font-black text-zinc-600 uppercase tracking-widest">Loyalty Level</span>
                  <span className="font-black text-[#D4AF37] text-sm">{profile?.loyalty_points || 0} PTS</span>
                </div>
              </div>
            </div>

            {/* Save Button */}
            <div className="flex justify-end pt-4">
              <button
                type="submit"
                disabled={loading}
                className="px-8 py-3.5 bg-[#D4AF37] text-black font-extrabold text-xs uppercase tracking-[0.25em] rounded-xl hover:bg-[#c9a227] transition-all flex items-center gap-2 active:scale-95 disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                {loading ? "Saving..." : "Save Profile / Keydi"}
              </button>
            </div>

          </form>

          </form>

          {/* My Orders Section */}
          <div className="border-t border-zinc-900 pt-6">
            <h2 className="text-sm font-extrabold uppercase tracking-[0.2em] text-[#D4AF37] mb-6 flex items-center gap-2">
              <Package className="w-4 h-4" /> My Orders / Dalabaadkaaga
            </h2>
            
            {isLoadingOrders ? (
              <div className="text-zinc-500 text-xs text-center py-8 animate-pulse">Loading orders...</div>
            ) : myOrders.length === 0 ? (
              <div className="text-zinc-500 text-xs text-center py-8 border border-zinc-900 rounded-xl bg-zinc-950/30">
                You haven't placed any orders yet. / Wali wax dalab ah maadan samayn.
              </div>
            ) : (
              <div className="space-y-4">
                {myOrders.map((order: any) => {
                  let statusColor = "text-zinc-500 border-zinc-800 bg-zinc-900";
                  let statusIcon = <Clock className="w-3.5 h-3.5" />;
                  
                  if (order.status === "delivered") {
                    statusColor = "text-green-500 border-green-900/50 bg-green-950/20";
                    statusIcon = <Check className="w-3.5 h-3.5" />;
                  } else if (order.status === "cancelled" || order.status === "returned") {
                    statusColor = "text-red-500 border-red-900/50 bg-red-950/20";
                    statusIcon = <XCircle className="w-3.5 h-3.5" />;
                  } else if (order.status === "shipped" || order.status === "out_for_delivery") {
                    statusColor = "text-[#3abaf4] border-[#3abaf4]/30 bg-[#3abaf4]/10";
                    statusIcon = <Truck className="w-3.5 h-3.5" />;
                  } else if (order.status === "processing" || order.status === "packed") {
                    statusColor = "text-[#D4AF37] border-[#D4AF37]/30 bg-[#D4AF37]/10";
                    statusIcon = <Package className="w-3.5 h-3.5" />;
                  } else {
                    statusColor = "text-orange-400 border-orange-900/50 bg-orange-950/20";
                  }

                  return (
                    <div key={order.id} className="border border-zinc-900 rounded-xl bg-[#0a0a0a] overflow-hidden">
                      <div className="p-4 sm:p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-3">
                            <span className="font-bold text-white text-sm">#{order.order_number}</span>
                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-wider border ${statusColor}`}>
                              {statusIcon}
                              {order.status.replace(/_/g, ' ')}
                            </span>
                          </div>
                          <p className="text-[11px] text-zinc-500 font-medium">
                            {new Date(order.created_at).toLocaleDateString("en-US", { 
                              year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' 
                            })}
                          </p>
                        </div>
                        <div className="text-left sm:text-right w-full sm:w-auto">
                          <div className="text-[#D4AF37] font-bold">${Number(order.total || 0).toFixed(2)}</div>
                          <div className="text-[10px] text-zinc-500 font-semibold uppercase">{order.order_items?.length || 0} Items</div>
                        </div>
                      </div>
                      
                      {/* Items Preview */}
                      {order.order_items && order.order_items.length > 0 && (
                        <div className="border-t border-zinc-900 bg-zinc-950 p-4">
                          <div className="flex flex-wrap gap-3">
                            {order.order_items.map((item: any) => (
                              <div key={item.id} className="flex items-center gap-2 bg-[#040404] border border-zinc-800 rounded-lg p-2 pr-4">
                                <div className="h-8 w-8 bg-zinc-900 rounded flex items-center justify-center text-[10px] font-bold text-zinc-600 border border-zinc-800">
                                  x{item.quantity}
                                </div>
                                <div>
                                  <p className="text-[10px] font-bold text-zinc-300 max-w-[120px] truncate" title={item.product_name}>
                                    {item.product_name}
                                  </p>
                                  <p className="text-[9px] text-zinc-600 font-semibold">
                                    {[item.color, item.size].filter(Boolean).join(" / ")}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* PWA Notifications simulated card */}
          <div className="border-t border-zinc-900 pt-6">
            <h3 className="text-xs font-extrabold uppercase tracking-[0.2em] text-[#D4AF37] mb-3">Push Notification Settings</h3>
            <p className="text-[11px] text-zinc-500 mb-4 leading-relaxed">
              Enable preferences to receive real-time notifications about order confirmations and seasonal sales.<br />
              <span className="text-zinc-400 font-semibold">Daar ogeysiisyada si aad u hesho xaqiijinta dalabka iyo qiimo dhimista.</span>
            </p>

            <div className="flex gap-4">
              <button
                type="button"
                onClick={async () => {
                  if (!("Notification" in window)) {
                    alert("Notifications not supported in this browser.");
                    return;
                  }
                  const perm = await Notification.requestPermission();
                  if (perm === "granted") alert("Push permissions granted successfully! / Ogeysiisyada waa la shiday.");
                }}
                className="flex-1 rounded-xl border border-zinc-800 bg-transparent text-zinc-300 hover:text-white hover:border-[#D4AF37] transition-all uppercase tracking-widest text-[9px] font-black h-11 cursor-pointer"
              >
                Grant Push Permission
              </button>
              <button
                type="button"
                onClick={() => {
                  if (!("Notification" in window)) {
                    alert("Notifications not supported in this browser.");
                    return;
                  }
                  if (Notification.permission === "granted") {
                    new Notification("Tokiyo Luxury Store", {
                      body: "Order ORD-77826 has been shipped! / Dalabkaaga waa la soo diray.",
                      icon: "/apple-touch-icon.png"
                    });
                  } else {
                    alert("Order ORD-77826 has been shipped! / Dalabkaaga waa la soo diray. (Fadlan marka hore daar Permission-ka)");
                  }
                }}
                className="flex-1 rounded-xl bg-zinc-900 text-white border border-zinc-800 hover:bg-zinc-800 hover:border-zinc-700 transition-all uppercase tracking-widest text-[9px] font-black h-11 cursor-pointer"
              >
                Send Test Push
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
