import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ShoppingBag } from "lucide-react";

export function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4 font-sans text-center">
      <div className="max-w-md w-full">
        {/* Animated Icon */}
        <div className="inline-flex items-center justify-center w-20 h-20 bg-black text-white rounded-full mb-6 shadow-xl animate-bounce">
          <ShoppingBag className="h-10 w-10 text-white" />
        </div>

        {/* 404 Header */}
        <h1 className="text-9xl font-extrabold text-black tracking-widest font-mono">404</h1>
        <div className="bg-accent px-2 text-sm rounded rotate-12 inline-block -mt-3 mb-6 text-black font-bold uppercase tracking-widest">
          Page Not Found / Boggan Lama Helin
        </div>

        <h2 className="text-2xl font-bold uppercase tracking-wider text-gray-900 mb-3">
          Sartorial Detour
        </h2>
        <p className="text-gray-500 mb-8 text-sm sm:text-base leading-relaxed">
          Waxay u muuqataa in bogga aad raadinayso uu lumay ama magaciisa la beddelay. Fadlan ku laabo dukaanka.
        </p>

        <Button asChild size="lg" className="w-full rounded-none uppercase tracking-widest bg-black text-white hover:bg-gray-800 transition-colors h-14 font-bold shadow-lg">
          <Link to="/">Go Back Home</Link>
        </Button>
      </div>
    </div>
  );
}
