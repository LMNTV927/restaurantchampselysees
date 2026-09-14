import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Calendar, Clock, Users, User, Phone, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DateStep } from './steps/DateStep';
import { TimeStep } from './steps/TimeStep';
import { GuestsStep } from './steps/GuestsStep';
import { ContactStep } from './steps/ContactStep';
import { SummaryStep } from './steps/SummaryStep';
import { SuccessStep } from './steps/SuccessStep';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { isValidPhone, emailError } from '@/lib/contactValidation';
import { getCampaignAttribution } from '@/lib/campaignTracking';


export interface BookingData {
  date: Date | null;
  time: string;
  guestsCount: number;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  notes?: string;
}

interface BookingFormProps {
  channelId: string;
  onSuccess: (data: BookingData) => void;
}

const steps = [
  { id: 'date', title: 'Date', icon: Calendar },
  { id: 'time', title: 'Heure', icon: Clock },
  { id: 'guests', title: 'Convives', icon: Users },
  { id: 'contact', title: 'Contact', icon: User },
  { id: 'summary', title: 'Récapitulatif', icon: Check },
];

export function BookingForm({ channelId, onSuccess }: BookingFormProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [bookingData, setBookingData] = useState<BookingData>({
    date: null,
    time: '',
    guestsCount: 2,
    customerName: '',
    customerPhone: '',
    customerEmail: '',
    notes: '',
  });

  const updateBookingData = (updates: Partial<BookingData>) => {
    setBookingData(prev => ({ ...prev, ...updates }));
  };

  const canProceed = () => {
    switch (currentStep) {
      case 0:
        return bookingData.date !== null;
      case 1:
        return bookingData.time !== '';
      case 2:
        return bookingData.guestsCount > 0;
      case 3:
        return (
          bookingData.customerName.trim().length >= 2 &&
          isValidPhone(bookingData.customerPhone) &&
          emailError(bookingData.customerEmail) === null
        );

      case 4:
        return true;
      default:
        return false;
    }
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1 && canProceed()) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const submitBooking = async () => {
    if (!canProceed()) return;
    
    setIsSubmitting(true);
    
    try {
      // First, get channel data to get restaurant name
      const { data: channelData } = await supabase
        .from('channels')
        .select('name')
        .eq('id', channelId)
        .single();

      // Format the date correctly in Paris timezone to avoid timezone offset issues
      // This ensures the selected date is stored exactly as the user selected it
      const reservationDate = bookingData.date!.toLocaleDateString('sv-SE', { timeZone: 'Europe/Paris' });
      console.log('Date sélectionnée par l\'utilisateur:', bookingData.date);
      console.log('Date formatée pour la base de données:', reservationDate);

      const attribution = getCampaignAttribution();

      const { data: created, error } = await supabase.functions.invoke('create-reservation', {
        body: {
          channel_id: channelId,
          reservation_date: reservationDate,
          reservation_time: bookingData.time,
          guests_count: bookingData.guestsCount,
          customer_name: bookingData.customerName,
          customer_phone: bookingData.customerPhone,
          customer_email: bookingData.customerEmail || null,
          notes: bookingData.notes || null,
          utm_campaign: attribution.utm_campaign,
          utm_source: attribution.utm_source,
          gclid: attribution.gclid,
        },
      });

      if (error || !created || created.error) {
        console.error('Booking error:', error || created?.error);
        toast({
          title: "Erreur",
          description: created?.error || "Une erreur est survenue lors de la réservation. Veuillez réessayer.",
          variant: "destructive",
        });
        return;
      }

      const modificationToken = created.modification_token;

      // Succès affiché immédiatement — les envois (email, SMS, alertes)
      // continuent en arrière-plan sans bloquer l'utilisateur.
      setIsSuccess(true);
      onSuccess(bookingData);
      toast({
        title: "Réservation confirmée!",
        description: bookingData.customerEmail 
          ? "Votre table a été réservée avec succès. Un email de confirmation vous a été envoyé."
          : "Votre table a été réservée avec succès.",
      });

      const dateLong = bookingData.date!.toLocaleDateString('fr-FR', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });

      // Email de confirmation (arrière-plan)
      if (bookingData.customerEmail && bookingData.customerEmail.trim()) {
        supabase.functions.invoke('send-reservation-confirmation', {
          body: {
            customerName: bookingData.customerName,
            customerEmail: bookingData.customerEmail,
            restaurantName: 'Prince Palace',
            reservationDate: dateLong,
            reservationTime: bookingData.time,
            guestsCount: bookingData.guestsCount,
            customerPhone: bookingData.customerPhone,
            notes: bookingData.notes,
            modificationToken,
          }
        }).then(({ error }) => {
          if (error) console.error('Email sending error:', error);
        }).catch(err => console.error('Email sending error:', err));
      }

      // SMS de confirmation (arrière-plan)
      supabase.functions.invoke('send-reservation-sms', {
        body: {
          customerName: bookingData.customerName,
          customerPhone: bookingData.customerPhone,
          restaurantName: channelData?.name || 'Restaurant',
          reservationDate: dateLong,
          reservationTime: bookingData.time,
          guestsCount: bookingData.guestsCount,
        }
      }).then(({ error }) => {
        if (error) console.error('SMS sending error:', error);
      }).catch(err => console.error('SMS sending error:', err));

      // Alerte interne grandes réservations / événements (arrière-plan)
      supabase.functions.invoke('notify-large-reservation', {
        body: {
          customerName: bookingData.customerName,
          customerPhone: bookingData.customerPhone,
          reservationDate: dateLong,
          reservationTime: bookingData.time,
          guestsCount: bookingData.guestsCount,
          notes: bookingData.notes,
          source: channelData?.name,
        }
      }).catch(err => console.error('Large reservation alert error:', err));

      // Détection de doublons (marquage uniquement, aucune suppression)
      supabase.functions.invoke('dedupe-reservations').catch(() => {});
      
    } catch (error) {
      console.error('Unexpected error:', error);
      toast({
        title: "Erreur",
        description: "Une erreur inattendue est survenue. Veuillez réessayer.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStep = () => {
    if (isSuccess) {
      return <SuccessStep bookingData={bookingData} />;
    }

    switch (currentStep) {
      case 0:
        return <DateStep data={bookingData} onUpdate={updateBookingData} />;
      case 1:
        return <TimeStep data={bookingData} onUpdate={updateBookingData} />;
      case 2:
        return <GuestsStep data={bookingData} onUpdate={updateBookingData} />;
      case 3:
        return <ContactStep data={bookingData} onUpdate={updateBookingData} />;
      case 4:
        return <SummaryStep data={bookingData} onUpdate={updateBookingData} />;
      default:
        return null;
    }
  };

  if (isSuccess) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="premium-card p-8 text-center"
      >
        <SuccessStep bookingData={bookingData} />
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="premium-card p-4 md:p-6 backdrop-blur-md bg-card/90 max-w-md md:max-w-lg mx-auto"
    >
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isActive = index === currentStep;
            const isCompleted = index < currentStep;
            
            return (
              <div key={step.id} className="flex items-center">
                <motion.div
                  className={`
                    w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300
                    ${isActive 
                      ? 'bg-primary border-primary text-primary-foreground' 
                      : isCompleted 
                        ? 'bg-success border-success text-success-foreground'
                        : 'border-muted bg-background text-muted-foreground'
                    }
                  `}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Icon className="w-5 h-5" />
                </motion.div>
                {index < steps.length - 1 && (
                  <div className={`
                    w-8 h-0.5 mx-2 transition-colors duration-300
                    ${isCompleted ? 'bg-success' : 'bg-border'}
                  `} />
                )}
              </div>
            );
          })}
        </div>
        
        <div className="text-center">
          <h3 className="text-lg font-semibold text-foreground">
            {steps[currentStep].title}
          </h3>
          <p className="text-sm text-muted-foreground">
            Étape {currentStep + 1} sur {steps.length}
          </p>
        </div>
      </div>

      {/* Step Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
          className="mb-8"
        >
          {renderStep()}
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={prevStep}
          disabled={currentStep === 0}
          className="flex items-center gap-2"
        >
          <ChevronLeft className="w-4 h-4" />
          Précédent
        </Button>

        {currentStep === steps.length - 1 ? (
          <Button
            onClick={submitBooking}
            disabled={!canProceed() || isSubmitting}
            className="bg-gradient-gold hover:shadow-gold text-charcoal font-semibold px-8"
          >
            {isSubmitting ? 'Réservation...' : 'Confirmer la réservation'}
          </Button>
        ) : (
          <Button
            onClick={nextStep}
            disabled={!canProceed()}
            className="flex items-center gap-2 bg-primary hover:bg-primary/90"
          >
            Suivant
            <ChevronRight className="w-4 h-4" />
          </Button>
        )}
      </div>
    </motion.div>
  );
}