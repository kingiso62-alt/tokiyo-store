import { useState } from "react";
import { Dialog, DialogContent, DialogTitle, DialogHeader } from "@/components/ui/dialog";

interface Product360ViewerProps {
  image: string; // Base image to use for simulation
}

export function Product360Viewer({ image }: Product360ViewerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [rotation, setRotation] = useState(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    // Simple simulation: dragging mouse left/right rotates the image slightly (using hue or rotation)
    // In a real app, this would change the `src` to image_1.jpg through image_36.jpg
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = x / rect.width;
    setRotation((percentage - 0.5) * 60); // rotate between -30 and 30 deg
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="absolute bottom-4 right-4 bg-background/80 backdrop-blur-sm p-3 rounded-full shadow-lg hover:bg-background transition-colors text-foreground flex items-center gap-2 group z-10"
      >
        <svg className="w-5 h-5 group-hover:animate-spin-slow" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
        <span className="text-xs font-bold uppercase tracking-widest hidden md:inline-block">360&deg; View</span>
      </button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[600px] bg-background">
          <DialogHeader>
            <DialogTitle className="uppercase tracking-widest text-center text-sm">360&deg; Interactive View</DialogTitle>
          </DialogHeader>
          <div className="relative aspect-square w-full bg-muted overflow-hidden flex items-center justify-center cursor-ew-resize rounded-md"
               onMouseMove={handleMouseMove}
               onTouchMove={(e) => {
                 const rect = e.currentTarget.getBoundingClientRect();
                 const x = e.touches[0].clientX - rect.left;
                 setRotation(((x / rect.width) - 0.5) * 60);
               }}
          >
            <img 
              src={image} 
              alt="360 view simulation" 
              className="w-full h-full object-contain pointer-events-none transition-transform duration-75"
              style={{ transform: `rotateY(${rotation}deg)` }}
            />
            <div className="absolute bottom-4 inset-x-0 flex justify-center pointer-events-none">
              <div className="bg-black/50 text-white text-xs px-4 py-2 rounded-full uppercase tracking-widest backdrop-blur-sm">
                Drag to rotate
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
