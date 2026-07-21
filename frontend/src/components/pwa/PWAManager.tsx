import { useState, useEffect } from "react";
import { Download, WifiOff, RefreshCw, X, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";

// Fallback stub for environments where vite-plugin-pwa virtual module is unavailable
function useRegisterSW() {
  return {
    offlineReady: [false, (_: boolean) => {}] as [boolean, (v: boolean) => void],
    needRefresh: [false, (_: boolean) => {}] as [boolean, (v: boolean) => void],
    updateServiceWorker: async (_reloadPage?: boolean) => {},
  };
}

export function PWAManager() {
  const {
    offlineReady: [offlineReady, setOfflineReady],
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW();

  const [installPrompt, setInstallPrompt] = useState<any>(null);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showInstallBanner, setShowInstallBanner] = useState(false);

  useEffect(() => {
    // 1. Connectivity changes
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    // 2. Install Prompt intercept
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setInstallPrompt(e);
      setShowInstallBanner(true);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstall);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
      window.removeEventListener("beforeinstallprompt", handleBeforeInstall);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!installPrompt) return;
    installPrompt.prompt();
    const { outcome } = await installPrompt.userChoice;
    if (outcome === "accepted") {
      setInstallPrompt(null);
      setShowInstallBanner(false);
    }
  };

  return (
    <div className="fixed bottom-20 left-4 right-4 z-[99] space-y-3 pointer-events-none md:max-w-md md:left-auto md:right-6 md:bottom-6">
      
      {/* 1. Offline Alert */}
      {!isOnline && (
        <div className="bg-red-600 text-white p-3.5 rounded-xl shadow-lg border border-red-500 flex items-center justify-between pointer-events-auto animate-bounce font-semibold text-xs tracking-wider uppercase">
          <div className="flex items-center gap-2">
            <WifiOff className="h-4 w-4" />
            <span>You are currently offline / Internet la'aan</span>
          </div>
          <a href="/offline" className="underline hover:text-gray-200">
            Offline Mode
          </a>
        </div>
      )}

      {/* 2. PWA Update Notification */}
      {needRefresh && (
        <div className="bg-black text-white p-4 rounded-xl shadow-2xl border border-gray-800 flex flex-col gap-3 pointer-events-auto animate-in slide-in-from-bottom duration-300">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <h4 className="text-xs font-black uppercase tracking-widest text-accent">Update Available</h4>
              <p className="text-[10px] text-gray-400 font-medium">A new premium version of Tokiyo Store is ready. Update now / Cusbooneysii hadda.</p>
            </div>
            <button onClick={() => setNeedRefresh(false)} className="text-gray-400 hover:text-white">
              <X className="h-4 w-4" />
            </button>
          </div>
          <Button
            size="sm"
            onClick={() => updateServiceWorker(true)}
            className="w-full bg-accent text-accent-foreground hover:bg-white hover:text-black uppercase tracking-wider text-[10px] h-9 gap-1 font-bold"
          >
            <RefreshCw className="h-3 w-3 animate-spin" /> Reload & Update
          </Button>
        </div>
      )}

      {/* 3. Add to Home Screen Custom Prompt */}
      {showInstallBanner && installPrompt && (
        <div className="bg-white text-black p-4 rounded-2xl shadow-2xl border border-gray-100 flex flex-col gap-3 pointer-events-auto animate-in slide-in-from-bottom duration-300">
          <div className="flex items-start justify-between">
            <div className="flex gap-3">
              <div className="h-10 w-10 bg-black text-white flex items-center justify-center rounded-xl font-bold font-serif text-lg">
                T
              </div>
              <div className="space-y-0.5">
                <h4 className="text-xs font-black uppercase tracking-wider">Install Tokiyo Store</h4>
                <p className="text-[10px] text-gray-500 font-medium">Add to your home screen for the full app experience / Ku dar shaashadda horteeda.</p>
              </div>
            </div>
            <button onClick={() => setShowInstallBanner(false)} className="text-gray-400 hover:text-black">
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowInstallBanner(false)}
              className="flex-1 uppercase text-[9px] tracking-wider h-8 font-bold border-gray-300"
            >
              Not Now
            </Button>
            <Button
              size="sm"
              onClick={handleInstallClick}
              className="flex-1 bg-black text-white hover:bg-gray-800 uppercase text-[9px] tracking-wider h-8 font-bold gap-1"
            >
              <Download className="h-3 w-3" /> Install App
            </Button>
          </div>
        </div>
      )}

    </div>
  );
}
