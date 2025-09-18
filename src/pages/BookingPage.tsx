import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { BookingForm } from "@/components/Booking/BookingForm";
import { ImageCarousel } from "@/components/Booking/ImageCarousel";
const princePalaceLogo = "/lovable-uploads/ce9ac516-0580-4c36-b708-89f1a0a13c29.png";
import dish1 from "@/assets/dish-1.jpg";
import dish2 from "@/assets/dish-2.jpg";
import dish3 from "@/assets/dish-3.jpg";
import dish4 from "@/assets/dish-4.jpg";

const dishImages = [dish1, dish2, dish3, dish4];

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
        // Increment clicks
        await supabase.rpc('increment_channel_clicks', { channel_slug: slug });

        // Fetch channel info
        const { data, error } = await supabase
          .from('channels')
          .select('*')
          .eq('slug', slug)
          .eq('is_active', true)
          .single();

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
    // You could redirect to a success page here
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
        <ImageCarousel images={dishImages} autoPlayInterval={3000} />
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>
      </div>

      {/* Logo Overlay */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5, duration: 0.6 }}
        className="absolute top-8 left-8 z-20"
      >
        <img 
          src={princePalaceLogo} 
          alt="Prince Palace" 
          className="h-16 w-16 object-cover rounded-2xl shadow-gold"
        />
      </motion.div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
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