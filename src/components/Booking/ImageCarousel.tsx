import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ImageCarouselProps {
  images: string[];
  autoPlayInterval?: number;
}

export function ImageCarousel({ images, autoPlayInterval = 5000 }: ImageCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  // Only the first image is loaded up-front (LCP). The rest are fetched
  // in the background once the page is interactive, then the carousel starts.
  const [restLoaded, setRestLoaded] = useState(images.length <= 1);

  useEffect(() => {
    if (images.length <= 1) return;
    let cancelled = false;

    const preloadRest = () => {
      let remaining = images.length - 1;
      images.slice(1).forEach((src) => {
        const img = new Image();
        const done = () => {
          remaining -= 1;
          if (remaining <= 0 && !cancelled) setRestLoaded(true);
        };
        img.onload = done;
        img.onerror = done;
        img.src = src;
      });
    };

    const idle = (window as any).requestIdleCallback as
      | ((cb: () => void, opts?: { timeout: number }) => number)
      | undefined;
    const handle = idle
      ? idle(preloadRest, { timeout: 2000 })
      : window.setTimeout(preloadRest, 800);

    return () => {
      cancelled = true;
      if (!idle) window.clearTimeout(handle as number);
    };
  }, [images]);

  useEffect(() => {
    if (!restLoaded || images.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, autoPlayInterval);

    return () => clearInterval(interval);
  }, [restLoaded, images.length, autoPlayInterval]);

  return (
    <div className="absolute inset-0 overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 0.8, ease: 'easeInOut' }}
          className="absolute inset-0"
        >
          <img
            src={images[currentIndex]}
            alt=""
            aria-hidden="true"
            decoding="async"
            loading={currentIndex === 0 ? 'eager' : 'lazy'}
            // @ts-expect-error fetchpriority is a valid HTML attribute
            fetchpriority={currentIndex === 0 ? 'high' : 'low'}
            className="w-full h-full object-cover object-center"
          />
        </motion.div>
      </AnimatePresence>

      {/* Subtle indicators */}
      <div className="absolute bottom-8 right-8 flex space-x-2">
        {images.map((_, index) => (
          <div
            key={index}
            className={`w-2 h-2 rounded-full transition-colors duration-300 ${
              index === currentIndex ? 'bg-white/80' : 'bg-white/30'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
