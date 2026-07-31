import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { DishImage } from '@/lib/dishImages';

interface ImageCarouselProps {
  images: DishImage[];
  autoPlayInterval?: number;
}

export function ImageCarousel({ images, autoPlayInterval = 5000 }: ImageCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  // On ne monte le carrousel (et donc les images suivantes) qu'après le premier rendu
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const id = window.setTimeout(() => setReady(true), 300);
    return () => window.clearTimeout(id);
  }, []);

  useEffect(() => {
    if (!ready || images.length < 2) return;
    const interval = window.setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, autoPlayInterval);
    return () => window.clearInterval(interval);
  }, [ready, images.length, autoPlayInterval]);

  const image = images[currentIndex];

  return (
    <div className="absolute inset-0 overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: 'easeInOut' }}
          className="absolute inset-0"
        >
          <img
            src={image.src}
            srcSet={`${image.srcSm} 800w, ${image.src} 1600w`}
            sizes="100vw"
            alt=""
            aria-hidden="true"
            decoding="async"
            loading={currentIndex === 0 ? 'eager' : 'lazy'}
            // @ts-expect-error attribut HTML standard non typé par React
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
