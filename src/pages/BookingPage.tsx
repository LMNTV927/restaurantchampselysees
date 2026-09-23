import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { BookingForm } from "@/components/Booking/BookingForm";
import { ImageCarousel } from "@/components/Booking/ImageCarousel";
import { DISH_IMAGES, PRINCE_PALACE_LOGO } from "@/lib/dishImages";

const princePalaceLogo = PRINCE_PALACE_LOGO;
const dishImages = DISH_IMAGES;


const GOOGLE_ADS_SLUG = "google-ads";
const GOOGLE_ADS_PMAX_SLUG = "google-ads-pmax";
const GOOGLE_ADS_SEARCH_SLUG = "google-ads-search";
const CAMPAIGN_STORAGE_KEY = "pp_ads_campaign_kind";

/** Détecte une visite issue de Google Ads (gclid / utm cpc) */
const detectGoogleAds = (): boolean => {
  if (typeof window === "undefined") return false;
  try {
    const params = new URLSearchParams(window.location.search);
    const gclid = params.get("gclid") || params.get("gbraid") || params.get("wbraid");
    const source = (params.get("utm_source") || "").toLowerCase();
    const medium = (params.get("utm_medium") || "").toLowerCase();
    const isAds =
      !!gclid ||
      (source.includes("google") && ["cpc", "ppc", "paid", "paidsearch", "paid_search"].includes(medium));
    if (isAds) sessionStorage.setItem("pp_google_ads", "1");
    return isAds || sessionStorage.getItem("pp_google_ads") === "1";
  } catch {
    return false;
  }
};

/** "pmax" | "search" | null — mémorisé pour survivre au tunnel de réservation */
const detectCampaignKind = (): "pmax" | "search" | null => {
  if (typeof window === "undefined") return null;
  try {
    const params = new URLSearchParams(window.location.search);
    const campaign = (params.get("utm_campaign") || "").toLowerCase();
    let kind: "pmax" | "search" | null = null;
    if (/(pmax|p-max|p_max|performance[ -_]?max)/.test(campaign)) kind = "pmax";
    else if (campaign.includes("search")) kind = "search";

    if (kind) {
      sessionStorage.setItem(CAMPAIGN_STORAGE_KEY, kind);
      return kind;
    }
    const stored = sessionStorage.getItem(CAMPAIGN_STORAGE_KEY);
    return stored === "pmax" || stored === "search" ? stored : null;
  } catch {
    return null;
  }
};

/** Slug de canal publicitaire à utiliser, par ordre de préférence */
const getAdsSlugCandidates = (): string[] => {
  const kind = detectCampaignKind();
  if (kind === "pmax") return [GOOGLE_ADS_PMAX_SLUG, GOOGLE_ADS_SLUG];
  if (kind === "search") return [GOOGLE_ADS_SEARCH_SLUG, GOOGLE_ADS_SLUG];
  return [GOOGLE_ADS_SLUG];
};

export function BookingPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [channel, setChannel] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Les pages de réservation sont des pages de conversion : jamais indexées.
  useEffect(() => {
    let meta = document.head.querySelector<HTMLMetaElement>('meta[name="robots"]');
    if (!meta) {
      meta = document.createElement("meta");
      meta.setAttribute("name", "robots");
      document.head.appendChild(meta);
    }
    meta.setAttribute("content", "noindex, nofollow");
  }, []);

  useEffect(() => {
    let cancelled = false;


    const fetchChannel = async () => {
      if (!slug) {
        setError("Lien de réservation invalide");
        setLoading(false);
        return;
      }

      // Attribution Google Ads prioritaire sur le canal du lien
      const effectiveSlug = detectGoogleAds() ? GOOGLE_ADS_SLUG : slug;

      // Le comptage du clic part en parallèle et ne bloque jamais l'affichage
      supabase.rpc('increment_channel_clicks', { channel_slug: effectiveSlug }).then(
        () => {},
        () => {}
      );

      try {
        const { data, error } = await supabase
          .from('channels')
          .select('id, name, slug, is_active')
          .eq('slug', effectiveSlug)
          .eq('is_active', true)
          .maybeSingle();

        if (cancelled) return;

        if (error || !data) {
          // repli sur le canal du lien si le canal Google Ads est indisponible
          const fallback = effectiveSlug === slug ? null : await supabase
            .from('channels')
            .select('id, name, slug, is_active')
            .eq('slug', slug)
            .eq('is_active', true)
            .maybeSingle();

          if (cancelled) return;

          if (fallback?.data) {
            setChannel(fallback.data);
          } else {
            setError("Lien de réservation introuvable ou inactif");
          }
        } else {
          setChannel(data);
        }
      } catch (err) {
        if (cancelled) return;
        console.error('Error fetching channel:', err);
        setError("Erreur lors du chargement");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchChannel();
    return () => { cancelled = true; };
  }, [slug]);


  const handleBookingSuccess = async (reservationData: any) => {
    if (channel) {
      // Increment reservation stats
      await supabase.rpc('increment_channel_reservation', {
        channel_slug: channel.slug,
        covers_count: reservationData.guestsCount
      });
    }
    // You could redirect to a success page here
  };



  if (error) {
    return (
      <div className="min-h-screen bg-gradient-subtle flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="text-destructive text-6xl mb-4">⚠️</div>
          <h1 className="text-2xl font-playfair font-semibold text-foreground mb-2">
            {error || "Page non trouvée"}
          </h1>
          <p className="text-muted-foreground mb-6">
            Le lien de réservation que vous cherchez n'existe pas ou n'est plus actif.
          </p>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-3 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-colors"
          >
            Retour à l'accueil
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background Carousel */}
      <div className="absolute inset-0 z-0">
        <ImageCarousel images={dishImages} />
        <div className="absolute inset-0 bg-black/65"></div>
      </div>

      {/* Logo Overlay */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1, duration: 0.3 }}
        className="absolute top-8 left-8 z-20"
      >
        <img 
          src={princePalaceLogo} 
          alt="Prince Palace" 
          width={64}
          height={64}
          className="h-16 w-16 object-cover rounded-2xl shadow-gold"
        />
      </motion.div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="w-full max-w-lg"
        >
          <div className="text-center mb-8">
            <h1 className="text-4xl font-playfair font-bold text-white mb-2">
              Réservation
            </h1>
            <p className="text-white/80 text-lg">
              Prince Palace Restaurant
            </p>
          </div>

          <BookingForm 
            channelId={channel?.id ?? ''} 
            onSuccess={handleBookingSuccess}
          />
        </motion.div>
      </div>
    </div>
  );
}