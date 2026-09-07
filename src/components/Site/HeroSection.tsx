import { ReactNode, useEffect, useRef, useState } from "react";

interface HeroSectionProps {
  image: string;
  /** Vidéo de fond en boucle (remplace l'image si fournie) */
  video?: string;
  videoWebm?: string;
  alt: string;
  children: ReactNode;
  height?: string;
  priority?: boolean;
}

/**
 * Hero immersif : parallax + Ken-Burns (scale 1 -> 1.08) + assombrissement
 * progressif de l'overlay au scroll. Uniquement transform/opacity (GPU),
 * déclenché par IntersectionObserver, désactivé si prefers-reduced-motion.
 */
export function HeroSection({ image, video, videoWebm, alt, children, height = "min-h-[92vh]", priority }: HeroSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const imageRef = useRef<HTMLImageElement | HTMLVideoElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    let raf = 0;
    let active = false;

    const update = () => {
      raf = 0;
      const el = sectionRef.current;
      const img = imageRef.current;
      const overlay = overlayRef.current;
      if (!el || !img || !overlay) return;
      const rect = el.getBoundingClientRect();
      const progress = Math.min(Math.max(-rect.top / Math.max(rect.height, 1), 0), 1);
      img.style.transform = `translate3d(0, ${progress * 14}%, 0) scale(${1 + progress * 0.08})`;
      overlay.style.opacity = String(0.55 + progress * 0.35);
    };

    const onScroll = () => {
      if (!active || raf) return;
      raf = requestAnimationFrame(update);
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        active = entry.isIntersecting;
        if (entry.isIntersecting) {
          setVisible(true);
          window.addEventListener("scroll", onScroll, { passive: true });
          update();
        } else {
          window.removeEventListener("scroll", onScroll);
        }
      },
      { threshold: 0 }
    );

    observer.observe(section);
    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section ref={sectionRef} className={`relative ${height} overflow-hidden flex items-center`}>
      {video ? (
        <video
          ref={imageRef as React.RefObject<HTMLVideoElement>}
          className="absolute inset-0 h-[115%] w-full object-cover will-change-transform"
          style={{ transformOrigin: "center 40%" }}
          poster={image}
          aria-label={alt}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
        >
          {videoWebm && <source src={videoWebm} type="video/webm" />}
          <source src={video} type="video/mp4" />
        </video>
      ) : (
        <img
          ref={imageRef as React.RefObject<HTMLImageElement>}
          src={image}
          alt={alt}
          width={1920}
          height={1088}
          loading={priority ? "eager" : "lazy"}
          {...{ fetchpriority: priority ? "high" : "auto" }}
          decoding="async"
          className="absolute inset-0 h-[115%] w-full object-cover will-change-transform"
          style={{ transformOrigin: "center 40%" }}
        />
      )}
      <div ref={overlayRef} className="absolute inset-0 bg-background" style={{ opacity: 0.55 }} />
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
      <div
        className={`container relative z-10 transition-all duration-1000 ${
          visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
        }`}
      >
        {children}
      </div>
    </section>
  );
}
