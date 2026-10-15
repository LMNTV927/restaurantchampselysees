import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, Clock, Users, FileText, Check, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';
import { ImageCarousel } from '@/components/Booking/ImageCarousel';
import { DateStep } from '@/components/Booking/steps/DateStep';
import { TimeStep } from '@/components/Booking/steps/TimeStep';
import { GuestsStep } from '@/components/Booking/steps/GuestsStep';
import { DISH_IMAGES, PRINCE_PALACE_LOGO } from '@/lib/dishImages';

const princePalaceLogo = PRINCE_PALACE_LOGO;
const dishImages = DISH_IMAGES;

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
  channel_id: string;
}

export default function ModifyReservationPage() {
  const { token } = useParams<{ token: string }>();
  const [reservation, setReservation] = useState<ReservationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [date, setDate] = useState<Date | null>(null);
  const [time, setTime] = useState('');
  const [guestsCount, setGuestsCount] = useState(2);
  const [notes, setNotes] = useState('');

  useEffect(() => {
    const fetchReservation = async () => {
      if (!token) { setError("Lien invalide"); setLoading(false); return; }

      const { data: res, error: fnError } = await supabase.functions.invoke('manage-reservation', {
        body: { token, action: 'get' },
      });
      const data = res?.reservation ?? null;
      const fetchError = fnError || res?.error || null;


      if (fetchError || !data) {
        setError("Réservation introuvable ou lien expiré");
      } else if (data.status === 'cancelled') {
        setError("Cette réservation a déjà été annulée");
      } else {
        setReservation(data as ReservationData);
        // Parse the date correctly
        const [year, month, day] = data.reservation_date.split('-').map(Number);
        setDate(new Date(year, month - 1, day));
        setTime(data.reservation_time);
        setGuestsCount(data.guests_count);
        setNotes(data.notes || '');
      }
      setLoading(false);
    };
    fetchReservation();
  }, [token]);

  const handleSubmit = async () => {
    if (!reservation || !date || !time) return;
    setSubmitting(true);

    try {
      const newDate = date.toLocaleDateString('sv-SE', { timeZone: 'Europe/Paris' });
      const formattedDate = date.toLocaleDateString('fr-FR', {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
      });

      const { data: res, error: fnError } = await supabase.functions.invoke('manage-reservation', {
        body: {
          token,
          action: 'update',
          reservation_date: newDate,
          reservation_time: time,
          guests_count: guestsCount,
          notes: notes || null,
        },
      });

      if (fnError || res?.error) throw new Error(res?.error || 'update failed');


      // Send updated confirmation email
      if (reservation.customer_email) {
        await supabase.functions.invoke('send-reservation-confirmation', {
          body: {
            customerName: reservation.customer_name,
            customerEmail: reservation.customer_email,
            restaurantName: 'Prince Palace',
            reservationDate: formattedDate,
            reservationTime: time,
            guestsCount,
            customerPhone: reservation.customer_phone,
            notes: notes || undefined,
            modificationToken: token,
            type: 'modification',
          }
        });
      }

      // Send updated SMS
      await supabase.functions.invoke('send-reservation-sms', {
        body: {
          customerName: reservation.customer_name,
          customerPhone: reservation.customer_phone,
          restaurantName: 'Prince Palace',
          reservationDate: formattedDate,
          reservationTime: time,
          guestsCount,
          type: 'modification',
          modificationToken: token,
        }
      });

      setSuccess(true);
    } catch (err) {
      console.error('Error updating reservation:', err);
      toast({ title: "Erreur", description: "Impossible de modifier la réservation.", variant: "destructive" });
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
          <div className="absolute inset-0 bg-black/65" />
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
          <div className="absolute inset-0 bg-black/65" />
        </div>
        <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="premium-card p-8 text-center max-w-md mx-auto backdrop-blur-md bg-card/90">
            <div className="w-16 h-16 bg-success/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="w-8 h-8 text-success" />
            </div>
            <h2 className="text-2xl font-playfair font-bold text-foreground mb-2">Réservation modifiée</h2>
            <p className="text-muted-foreground mb-4">
              Vos modifications ont été enregistrées. Une nouvelle confirmation vous a été envoyée.
            </p>
            <div className="space-y-2 text-sm">
              <p className="text-foreground"><span className="text-muted-foreground">Date :</span> {date?.toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
              <p className="text-foreground"><span className="text-muted-foreground">Heure :</span> {time}</p>
              <p className="text-foreground"><span className="text-muted-foreground">Couverts :</span> {guestsCount} personne{guestsCount > 1 ? 's' : ''}</p>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      <div className="absolute inset-0 z-0">
        <ImageCarousel images={dishImages} />
        <div className="absolute inset-0 bg-black/65" />
      </div>

      <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.5, duration: 0.6 }} className="absolute top-8 left-8 z-20">
        <img src={princePalaceLogo} alt="Prince Palace" className="h-16 w-16 object-cover rounded-2xl shadow-gold" />
      </motion.div>

      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="w-full max-w-lg">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-playfair font-bold text-white mb-2">Modifier ma réservation</h1>
            <p className="text-white/80 text-lg">Prince Palace Restaurant</p>
          </div>

          <div className="premium-card p-4 md:p-6 backdrop-blur-md bg-card/90 max-w-md md:max-w-lg mx-auto space-y-6">
            {/* Date */}
            <div>
              <label className="text-sm text-muted-foreground flex items-center gap-2 mb-2">
                <Calendar className="w-4 h-4" /> Date
              </label>
              <DateStep
                data={{ date, time, guestsCount, customerName: '', customerPhone: '' }}
                onUpdate={(updates) => { if (updates.date !== undefined) setDate(updates.date ?? null); }}
              />
            </div>

            {/* Time */}
            <div>
              <label className="text-sm text-muted-foreground flex items-center gap-2 mb-2">
                <Clock className="w-4 h-4" /> Heure
              </label>
              <TimeStep
                data={{ date, time, guestsCount, customerName: '', customerPhone: '' }}
                onUpdate={(updates) => { if (updates.time) setTime(updates.time); }}
              />
            </div>

            {/* Guests */}
            <div>
              <label className="text-sm text-muted-foreground flex items-center gap-2 mb-2">
                <Users className="w-4 h-4" /> Nombre de convives
              </label>
              <GuestsStep
                data={{ date, time, guestsCount, customerName: '', customerPhone: '' }}
                onUpdate={(updates) => { if (updates.guestsCount) setGuestsCount(updates.guestsCount); }}
              />
            </div>

            {/* Notes */}
            <div>
              <label className="text-sm text-muted-foreground flex items-center gap-2 mb-2">
                <FileText className="w-4 h-4" /> Notes
              </label>
              <Textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Demandes spéciales, allergies..."
                className="bg-muted/50 border-border"
              />
            </div>

            <Button
              onClick={handleSubmit}
              disabled={!date || !time || submitting}
              className="w-full bg-gradient-gold hover:shadow-gold text-charcoal font-semibold"
            >
              {submitting ? <><Loader2 className="w-4 h-4 animate-spin mr-2" /> Modification...</> : 'Confirmer les modifications'}
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
