import { Outlet, useLocation } from "react-router-dom";
import { CartSidebar } from "@/components/CartSidebar";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { AIChatWidget } from "@/components/ai/AIChatWidget";
import { MobileBottomNav } from "@/components/layout/MobileBottomNav";
import { PWAManager } from "@/components/pwa/PWAManager";

export function MainLayout() {
  const location = useLocation();

  return (
    <div className="min-h-screen flex flex-col font-sans bg-background text-foreground pb-[env(safe-area-inset-bottom)]">
      <Header />
      
      {/* Header is fixed, so we need padding top everywhere, and padding bottom on mobile for bottom nav */}
      <main className="flex-1 pt-24 pb-20 md:pb-0">
        <Outlet />
      </main>

      <Footer />
      <CartSidebar />
      <AIChatWidget />
      
      {/* Mobile Bottom Nav and PWA Lifecycle prompts */}
      <MobileBottomNav />
      <PWAManager />
    </div>
  );
}
