import { useState, useRef } from "react";

interface ProductGalleryProps {
  images: string[];
  productName: string;
}

export function ProductGallery({ images, productName }: ProductGalleryProps) {
  const [activeImage, setActiveImage] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const imgRef = useRef<HTMLImageElement>(null);
  const touchStartX = useRef<number | null>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!imgRef.current || !isZoomed) return;
    const { left, top, width, height } = imgRef.current.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setMousePos({ x, y });
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const deltaX = touchStartX.current - touchEndX;

    // Minimum swipe distance threshold (50px)
    if (Math.abs(deltaX) > 50) {
      if (deltaX > 0) {
        // Swipe Left: Next image
        setActiveImage((prev) => (prev + 1) % images.length);
      } else {
        // Swipe Right: Previous image
        setActiveImage((prev) => (prev - 1 + images.length) % images.length);
      }
    }
    touchStartX.current = null;
  };

  return (
    <div className="flex flex-col-reverse md:flex-row gap-4">
      {/* Thumbnails */}
      <div className="flex md:flex-col gap-3 overflow-x-auto md:overflow-y-auto md:w-24 flex-shrink-0 hide-scrollbar pb-2 md:pb-0">
        {images.map((img, idx) => (
          <button
            key={idx}
            onClick={() => setActiveImage(idx)}
            className={`relative w-20 h-24 md:w-full md:h-32 flex-shrink-0 border-2 transition-all ${activeImage === idx ? 'border-primary' : 'border-transparent opacity-60 hover:opacity-100'}`}
          >
            <img src={img} alt={`${productName} view ${idx + 1}`} className="w-full h-full object-cover" />
          </button>
        ))}
      </div>

      {/* Main Image with Zoom and Swipe gestures */}
      <div 
        className="relative flex-1 bg-muted aspect-[3/4] md:aspect-auto overflow-hidden group cursor-crosshair"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <img
          ref={imgRef}
          src={images[activeImage]}
          alt={productName}
          className={`w-full h-full object-cover transition-opacity duration-300 ${isZoomed ? 'opacity-0' : 'opacity-100'}`}
          onMouseEnter={() => setIsZoomed(true)}
          onMouseLeave={() => setIsZoomed(false)}
          onMouseMove={handleMouseMove}
        />
        
        {isZoomed && (
          <div 
            className="absolute inset-0 pointer-events-none bg-no-repeat"
            style={{
              backgroundImage: `url(${images[activeImage]})`,
              backgroundPosition: `${mousePos.x}% ${mousePos.y}%`,
              backgroundSize: '250%' // Magnification level
            }}
          />
        )}
      </div>
    </div>
  );
}
