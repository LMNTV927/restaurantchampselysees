import { motion } from 'framer-motion';
import { CheckCircle, Calendar, Clock, Users, Phone, Mail } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { BookingData } from '../BookingForm';

interface SuccessStepProps {
  bookingData: BookingData;
}

export function SuccessStep({ bookingData }: SuccessStepProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="text-center"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
        className="mb-6"
      >
        <CheckCircle className="w-16 h-16 text-success mx-auto mb-4" />
      </motion.div>
      
      <h2 className="text-2xl font-playfair font-bold text-foreground mb-2">
        Réservation confirmée !
      </h2>
      
      <p className="text-muted-foreground mb-8">
        Merci {bookingData.customerName}, votre table a été réservée avec succès.
      </p>
      
      <div className="bg-success/10 border border-success/20 rounded-lg p-6 mb-6">
        <h3 className="font-semibold text-foreground mb-4">Détails de votre réservation</h3>
        
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-success" />
            <span className="text-muted-foreground">
              {bookingData.date ? format(bookingData.date, 'dd/MM/yyyy', { locale: fr }) : ''}
            </span>
          </div>
          
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-success" />
            <span className="text-muted-foreground">{bookingData.time}</span>
          </div>
          
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-success" />
            <span className="text-muted-foreground">
              {bookingData.guestsCount} {bookingData.guestsCount === 1 ? 'personne' : 'personnes'}
            </span>
          </div>
          
          <div className="flex items-center gap-2">
            <Phone className="w-4 h-4 text-success" />
            <span className="text-muted-foreground">{bookingData.customerPhone}</span>
          </div>
          
          {bookingData.customerEmail && (
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-success" />
              <span className="text-muted-foreground">{bookingData.customerEmail}</span>
            </div>
          )}
        </div>
      </div>
      
      <div className="text-sm text-muted-foreground space-y-2">
        {bookingData.guestsCount >= 10 && (
          <p>
            📞 Nous vous appellerons prochainement pour confirmer votre réservation.
          </p>
        )}
        <div className="text-sm text-muted-foreground space-y-1">
          <p>📍 76 Av. Des Champs Elysées, 75008 Paris</p>
          <p>📍 59 Rue de Ponthieu, 75008</p>
        </div>
      </div>
    </motion.div>
  );
}