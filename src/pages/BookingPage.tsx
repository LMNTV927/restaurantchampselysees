import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { BookingForm } from "@/components/Booking/BookingForm";
import { ImageCarousel } from "@/components/Booking/ImageCarousel";
import { dishImages } from "@/lib/dishImages";
const princePalaceLogo = "/prince-palace-logo-128.webp";
// Build-time optimised backgrounds (WebP, resized) — ~9.8 MB of JPEG originals
// become a few hundred KB total.



export function BookingPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [channel, setChannel] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchChannel = async () => {
      if (!slug) {
        setError("Lien de réservation invalide");
        setLoading(false);
        return;
      }

      try {
        // Fetch channel info first — click tracking must never delay the form.
        const { data, error } = await supabase
          .from('channels')
          .select('id, name, slug')
          .eq('slug', slug)
          .eq('is_active', true)
          .maybeSingle();

        if (error || !data) {
          setError("Lien de réservation introuvable ou inactif");
        } else {
          setChannel(data);
        }
      } catch (err) {
        console.error('Error fetching channel:', err);
        setError("Erreur lors du chargement");
      } finally {
        setLoading(false);
        // Fire-and-forget click tracking
        supabase.rpc('increment_channel_clicks', { channel_slug: slug }).then(
          () => undefined,
          (e) => console.error('Click tracking error:', e)
        );
      }
    };

    fetchChannel();
  }, [slug]);

  const handleBookingSuccess = async (reservationData: any) => {
    if (channel) {
      // Increment reservation stats
      await supabase.rpc('increment_channel_reservation', {
        channel_slug: channel.slug,
        covers_count: reservationData.guestsCount
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-subtle flex items-center justify-center">
        <div className="animate-pulse text-center">
          <div className="w-16 h-16 bg-primary/20 rounded-full mx-auto mb-4"></div>
          <p className="text-muted-foreground">Chargement...</p>
        </div>
      </div>
    );
  }

  if (error || !channel) {
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
        {/* Plain overlay (no full-screen backdrop blur — very costly on mobile GPUs) */}
        <div className="absolute inset-0 bg-black/65"></div>
      </div>

      {/* Logo Overlay */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5, duration: 0.6 }}
        className="absolute top-5 left-5 md:top-8 md:left-8 z-20"
      >
        <img
          src={princePalaceLogo}
          alt="Prince Palace"
          width={64}
          height={64}
          decoding="async"
          className="h-16 w-16 object-cover rounded-2xl shadow-gold"
        />
      </motion.div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4 pt-28 md:pt-4">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
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
            channelId={channel.id}
            onSuccess={handleBookingSuccess}
          />
        </motion.div>
      </div>
    </div>
  );
}
