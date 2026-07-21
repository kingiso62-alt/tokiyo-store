import { useAuthStore } from "@/store/useAuthStore";
import { Button } from "@/components/ui/button";

export function Profile() {
  const { user, profile, signOut } = useAuthStore();

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      <div className="bg-card border border-border rounded-xl p-8 shadow-sm">
        <h1 className="text-3xl font-bold uppercase tracking-tight mb-6">My Profile</h1>
        
        <div className="grid gap-6">
          <div className="flex items-center space-x-4">
            <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center text-primary text-2xl font-bold uppercase">
              {profile?.first_name?.charAt(0) || user?.email?.charAt(0)}
            </div>
            <div>
              <h2 className="text-xl font-semibold">
                {profile?.first_name} {profile?.last_name}
              </h2>
              <p className="text-muted-foreground">{user?.email}</p>
              <div className="mt-1 inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold uppercase bg-secondary">
                {profile?.role || 'Customer'}
              </div>
            </div>
          </div>

          <div className="border-t border-border pt-6 mt-2">
            <h3 className="text-lg font-semibold mb-4">Account Details</h3>
            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-6 text-sm">
              <div>
                <dt className="text-muted-foreground">User ID</dt>
                <dd className="font-mono mt-1">{user?.id}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Loyalty Points</dt>
                <dd className="font-medium mt-1 text-accent flex items-center">
                  <span className="text-lg mr-1">{profile?.loyalty_points || 0}</span> pts
                </dd>
              </div>
            </dl>
          </div>

          {/* PWA Push Notifications Preference Panel */}
          <div className="border-t border-border pt-6 mt-2">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">PWA Push Notifications</h3>
              <span className="text-[10px] uppercase font-bold text-accent bg-accent/10 px-2.5 py-0.5 rounded">
                Simulated Integration
              </span>
            </div>
            
            <p className="text-xs text-muted-foreground mb-4">
              Enable notifications to receive real-time alerts about your orders and exclusive boutique offers.
              <br />
              <span className="text-[11px] font-semibold text-foreground">
                Daar ogeysiisyada si aad u hesho xogta dalabkaaga iyo qiimo dhimista boutique-ga.
              </span>
            </p>

            <div className="space-y-3 bg-muted/30 p-4 rounded-xl border mb-4 text-sm">
              <div className="flex items-center justify-between">
                <span className="font-medium">Order & Payment Confirmation</span>
                <input type="checkbox" defaultChecked className="rounded border-gray-300 text-black focus:ring-black h-4 w-4" />
              </div>
              <div className="flex items-center justify-between border-t pt-2">
                <span className="font-medium">Order Status & Delivery Updates</span>
                <input type="checkbox" defaultChecked className="rounded border-gray-300 text-black focus:ring-black h-4 w-4" />
              </div>
              <div className="flex items-center justify-between border-t pt-2">
                <span className="font-medium">Flash Sales & Price Drop Alerts</span>
                <input type="checkbox" defaultChecked className="rounded border-gray-300 text-black focus:ring-black h-4 w-4" />
              </div>
              <div className="flex items-center justify-between border-t pt-2">
                <span className="font-medium">Back-in-Stock Alerts & New Arrivals</span>
                <input type="checkbox" defaultChecked className="rounded border-gray-300 text-black focus:ring-black h-4 w-4" />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={async () => {
                  if (!("Notification" in window)) {
                    alert("This browser does not support notifications. / Browser-kaan ma taageero ogeysiisyada.");
                    return;
                  }
                  const permission = await Notification.requestPermission();
                  if (permission === "granted") {
                    alert("Push Notifications Permission Granted! / Ogeysiisyada waa la shidday.");
                  } else {
                    alert("Permission denied or dismissed. / Waa la diiday.");
                  }
                }}
                className="flex-1 uppercase tracking-widest text-[10px] h-10 font-bold border-gray-300"
              >
                Grant Push Permission
              </Button>
              <Button
                size="sm"
                onClick={() => {
                  if (!("Notification" in window)) {
                    alert("Notifications not supported.");
                    return;
                  }
                  if (Notification.permission === "granted") {
                    new Notification("Tokiyo Store — Order Confirmed! / Dalabkaaga waa la xaqiijiyay!", {
                      body: "Your order ORD-77826 is verified and handed over to logistics. / Dalabkaaga waa la xaqiijiyay, waana la soo diray.",
                      icon: "/apple-touch-icon.png",
                      badge: "/favicon.ico"
                    });
                  } else {
                    // Fallback to custom alert if permission not granted yet
                    alert("Test Push Notification Triggered (Fallback): 'Order ORD-77826 has been shipped! / Dalabkaaga ORD-77826 waa la soo diray.'");
                  }
                }}
                className="flex-1 bg-black text-white hover:bg-gray-800 uppercase tracking-widest text-[10px] h-10 font-bold"
              >
                Send Test Push Alert
              </Button>
            </div>
          </div>

          <div className="border-t border-border pt-6 flex justify-end">
            <Button variant="outline" onClick={signOut} className="text-red-500 hover:text-red-600 hover:bg-red-50 border-red-200 uppercase tracking-widest text-xs font-bold">
              Sign Out
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
