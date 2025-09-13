import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Calendar, Clock, Users, User, Phone, MessageSquare } from 'lucide-react';
import { BookingData } from '../BookingForm';

interface SummaryStepProps {
  data: BookingData;
  onUpdate: (updates: Partial<BookingData>) => void;
}

export function SummaryStep({ data }: SummaryStepProps) {
  return (
    <div>
      <div className="text-center mb-6">
        <h4 className="text-xl font-playfair font-semibold text-foreground mb-2">
          Récapitulatif de votre réservation
        </h4>
        <p className="text-muted-foreground">
          Vérifiez les informations avant de confirmer
        </p>
      </div>
      
      <div className="space-y-4">
        <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
          <Calendar className="w-5 h-5 text-primary" />
          <div>
            <p className="font-medium text-foreground">Date</p>
            <p className="text-sm text-muted-foreground">
              {data.date ? format(data.date, 'EEEE d MMMM yyyy', { locale: fr }) : 'Non définie'}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
          <Clock className="w-5 h-5 text-primary" />
          <div>
            <p className="font-medium text-foreground">Heure</p>
            <p className="text-sm text-muted-foreground">{data.time || 'Non définie'}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
          <Users className="w-5 h-5 text-primary" />
          <div>
            <p className="font-medium text-foreground">Nombre de convives</p>
            <p className="text-sm text-muted-foreground">
              {data.guestsCount} {data.guestsCount === 1 ? 'personne' : 'personnes'}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
          <User className="w-5 h-5 text-primary" />
          <div>
            <p className="font-medium text-foreground">Nom</p>
            <p className="text-sm text-muted-foreground">{data.customerName || 'Non défini'}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
          <Phone className="w-5 h-5 text-primary" />
          <div>
            <p className="font-medium text-foreground">Téléphone</p>
            <p className="text-sm text-muted-foreground">{data.customerPhone || 'Non défini'}</p>
          </div>
        </div>
        
        {data.notes && (
          <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/30">
            <MessageSquare className="w-5 h-5 text-primary mt-0.5" />
            <div>
              <p className="font-medium text-foreground">Notes</p>
              <p className="text-sm text-muted-foreground">{data.notes}</p>
            </div>
          </div>
        )}
      </div>
      
      <div className="mt-6 p-4 bg-primary/10 rounded-lg">
        <p className="text-sm text-foreground text-center">
          Après avoir confirmé votre réservation, nous vous enverrons un mail de confirmation.
        </p>
      </div>
    </div>
  );
}