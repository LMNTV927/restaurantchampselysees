import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { BookingForm, BookingData } from "@/components/Booking/BookingForm";

const GOOGLE_ADS_SLUG = "google-ads";

/**
 * Page de réservation destinée à être intégrée en iframe sur un site externe
 * (princepalace.fr). L'attribution ne dépend d'AUCUN cookie cross-domaine :
 * elle est transmise explicitement dans l'URL de l'iframe par le site parent.
 */
const detectGoogleAdsFromUrl = (): boolean => {
  try {
    const p = new URLSearchParams(window.location.search);
    const gclid = p.get("gclid") || p.get("gbraid") || p.get("wbraid");
    const flag = (p.get("ads") || "").toLowerCase();
    const source = (p.get("utm_source") || "").toLowerCase();
    const medium = (p.get("utm_medium") || "").toLowerCase();
    return (
      !!gclid ||
      flag === "1" ||
      flag === "true" ||
      (source.includes("google") &&
        ["cpc", "ppc", "paid", "paidsearch", "paid_search"].includes(medium))
    );
  } catch {
    return false;
  }
};

const postToParent = (payload: Record<string, unknown>) => {
  try {
    window.parent?.postMessage({ source: "prince-palace-booking", ...payload }, "*");
  } catch {
    /* iframe non disponible */
  }
};

export default function EmbedBookingPage() {
  const { slug } = useParams<{ slug: string }>();
  const [channel, setChannel] = useState<{ id: string; slug: string } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Jamais indexée
  useEffect(() => {
    let meta = document.head.querySelector<HTMLMetaElement>('meta[name="robots"]');
    if (!meta) {
      meta = document.createElement("meta");
      meta.setAttribute("name", "robots");
      document.head.appendChild(meta);
    }
    meta.setAttribute("content", "noindex, nofollow");
  }, []);

  // Hauteur transmise au site parent pour éviter les barres de défilement internes
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const send = () => postToParent({ type: "height", height: el.scrollHeight });
    send();
    const ro = new ResizeObserver(send);
    ro.observe(el);
    return () => ro.disconnect();
  }, [channel]);

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      if (!slug) {
        setError("Lien de réservation invalide");
        return;
      }

      const effectiveSlug = detectGoogleAdsFromUrl() ? GOOGLE_ADS_SLUG : slug;

      supabase.rpc("increment_channel_clicks", { channel_slug: effectiveSlug }).then(
        () => {},
        () => {}
      );

      const { data } = await supabase
        .from("channels")
        .select("id, slug, is_active")
        .eq("slug", effectiveSlug)
        .eq("is_active", true)
        .maybeSingle();

      if (cancelled) return;

      if (data) {
        setChannel(data);
        return;
      }

      if (effectiveSlug !== slug) {
        const { data: fallback } = await supabase
          .from("channels")
          .select("id, slug, is_active")
          .eq("slug", slug)
          .eq("is_active", true)
          .maybeSingle();
        if (cancelled) return;
        if (fallback) {
          setChannel(fallback);
          return;
        }
      }

      setError("Lien de réservation introuvable ou inactif");
    };

    run();
    return () => {
      cancelled = true;
    };
  }, [slug]);

  const handleSuccess = async (reservationData: BookingData) => {
    if (channel) {
      await supabase.rpc("increment_channel_reservation", {
        channel_slug: channel.slug,
        covers_count: reservationData.guestsCount,
      });
    }
    // Le site parent déclenche la conversion Google Ads sur son propre domaine.
    postToParent({
      type: "reservation_success",
      channel: channel?.slug ?? null,
      guests: reservationData.guestsCount,
    });
  };

  if (error) {
    return (
      <div ref={containerRef} className="p-6 text-center text-destructive">
        {error}
      </div>
    );
  }

  return (
    <div ref={containerRef} className="p-2 sm:p-4">
      <BookingForm channelId={channel?.id ?? ""} onSuccess={handleSuccess} />
    </div>
  );
}
