import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, Clock, Users, Check, Loader2, XCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { ImageCarousel } from '@/components/Booking/ImageCarousel';
import { dishImages } from '@/lib/dishImages';

const princePalaceLogo = "/prince-palace-logo-128.webp";


interface ReservationData {
  id: string;
  customer_name: string;
  customer_phone: string;
  customer_email: string | null;
  reservation_date: string;
  reservation_time: string;
  guests_count: number;
  notes: string | null;
  status: string;
}

export default function CancelReservationPage() {
  const { token } = useParams<{ token: string }>();
  const [reservation, setReservation] = useState<ReservationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReservation = async () => {
      if (!token) { setError("Lien invalide"); setLoading(false); return; }

      const { data, error: fetchError } = await supabase
        .from('reservations')
        .select('*')
        .eq('modification_token', token)
        .single();

      if (fetchError || !data) {
        setError("Réservation introuvable ou lien expiré");
      } else if (data.status === 'cancelled') {
        setError("Cette réservation a déjà été annulée");
      } else {
        setReservation(data as ReservationData);
      }
      setLoading(false);
    };
    fetchReservation();
  }, [token]);

  const formatDate = (dateStr: string) => {
    const [year, month, day] = dateStr.split('-').map(Number);
    return new Date(year, month - 1, day).toLocaleDateString('fr-FR', {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    });
  };

  const handleCancel = async () => {
    if (!reservation) return;
    setSubmitting(true);

    try {
      const { error: updateError } = await supabase
        .from('reservations')
        .update({ status: 'cancelled' })
        .eq('modification_token', token);

      if (updateError) throw updateError;

      const formattedDate = formatDate(reservation.reservation_date);

      // Send cancellation email
      if (reservation.customer_email) {
        await supabase.functions.invoke('send-reservation-confirmation', {
          body: {
            customerName: reservation.customer_name,
            customerEmail: reservation.customer_email,
            restaurantName: 'Prince Palace',
            reservationDate: formattedDate,
            reservationTime: reservation.reservation_time,
            guestsCount: reservation.guests_count,
            customerPhone: reservation.customer_phone,
            modificationToken: token,
            type: 'cancellation',
          }
        });
      }

      // Send cancellation SMS
      await supabase.functions.invoke('send-reservation-sms', {
        body: {
          customerName: reservation.customer_name,
          customerPhone: reservation.customer_phone,
          restaurantName: 'Prince Palace',
          reservationDate: formattedDate,
          reservationTime: reservation.reservation_time,
          guestsCount: reservation.guests_count,
          type: 'cancellation',
        }
      });

      setSuccess(true);
    } catch (err) {
      console.error('Error cancelling reservation:', err);
      toast({ title: "Erreur", description: "Impossible d'annuler la réservation.", variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <ImageCarousel images={dishImages} />
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
        </div>
        <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
            <div className="text-6xl mb-4">⚠️</div>
            <h1 className="text-2xl font-playfair font-semibold text-white mb-2">{error}</h1>
            <p className="text-white/60">Veuillez contacter le restaurant au 01 59 13 32 68</p>
          </motion.div>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <ImageCarousel images={dishImages} />
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
        </div>
        <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="premium-card p-8 text-center max-w-md mx-auto backdrop-blur-md bg-card/90">
            <div className="w-16 h-16 bg-destructive/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <XCircle className="w-8 h-8 text-destructive" />
            </div>
            <h2 className="text-2xl font-playfair font-bold text-foreground mb-2">Réservation annulée</h2>
            <p className="text-muted-foreground">
              Votre réservation a été annulée. Une confirmation vous a été envoyée.
            </p>
            <p className="text-muted-foreground mt-4 text-sm">
              Pour toute question, contactez-nous au <a href="tel:0159133268" className="text-primary hover:underline">01 59 13 32 68</a>
            </p>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      <div className="absolute inset-0 z-0">
        <ImageCarousel images={dishImages} />
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      </div>

      <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.5, duration: 0.6 }} className="absolute top-8 left-8 z-20">
        <img src={princePalaceLogo} alt="Prince Palace" className="h-16 w-16 object-cover rounded-2xl shadow-gold" />
      </motion.div>

      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="w-full max-w-lg">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-playfair font-bold text-white mb-2">Annuler ma réservation</h1>
            <p className="text-white/80 text-lg">Prince Palace Restaurant</p>
          </div>

          <div className="premium-card p-6 backdrop-blur-md bg-card/90 max-w-md mx-auto">
            <div className="text-center mb-6">
              <XCircle className="w-12 h-12 text-destructive mx-auto mb-3" />
              <p className="text-muted-foreground">Êtes-vous sûr de vouloir annuler cette réservation ?</p>
            </div>

            <div className="space-y-4 mb-6 p-4 rounded-xl bg-muted/30 border border-border">
              <div className="flex items-center gap-3">
                <Calendar className="w-4 h-4 text-primary" />
                <span className="text-foreground">{formatDate(reservation!.reservation_date)}</span>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="w-4 h-4 text-primary" />
                <span className="text-foreground">{reservation!.reservation_time}</span>
              </div>
              <div className="flex items-center gap-3">
                <Users className="w-4 h-4 text-primary" />
                <span className="text-foreground">{reservation!.guests_count} personne{reservation!.guests_count > 1 ? 's' : ''}</span>
              </div>
            </div>

            <div className="space-y-3">
              <Button
                onClick={handleCancel}
                disabled={submitting}
                variant="destructive"
                className="w-full font-semibold"
              >
                {submitting ? <><Loader2 className="w-4 h-4 animate-spin mr-2" /> Annulation...</> : "Confirmer l'annulation"}
              </Button>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => window.history.back()}
                disabled={submitting}
              >
                Retour
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
