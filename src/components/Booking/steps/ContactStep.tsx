import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { BookingData } from '../BookingForm';

interface ContactStepProps {
  data: BookingData;
  onUpdate: (updates: Partial<BookingData>) => void;
}

export function ContactStep({ data, onUpdate }: ContactStepProps) {
  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h4 className="text-xl font-playfair font-semibold text-foreground mb-2">
          Vos coordonnées
        </h4>
        <p className="text-muted-foreground">
          Nous avons besoin de quelques informations pour confirmer votre réservation
        </p>
      </div>
      
      <div className="space-y-4">
        <div>
          <Label htmlFor="name" className="text-sm font-medium text-foreground">
            Nom complet *
          </Label>
          <Input
            id="name"
            type="text"
            placeholder="Votre nom et prénom"
            value={data.customerName}
            onChange={(e) => onUpdate({ customerName: e.target.value })}
            className="premium-input mt-1"
            required
          />
        </div>
        
        <div>
          <Label htmlFor="phone" className="text-sm font-medium text-foreground">
            Numéro de téléphone *
          </Label>
          <Input
            id="phone"
            type="tel"
            placeholder="+33 6 12 34 56 78"
            value={data.customerPhone}
            onChange={(e) => onUpdate({ customerPhone: e.target.value })}
            className="premium-input mt-1"
            required
          />
          <p className="text-xs text-muted-foreground mt-1">
            Nous vous contacterons uniquement en cas de besoin concernant votre réservation
          </p>
        </div>
        
        <div>
          <Label htmlFor="notes" className="text-sm font-medium text-foreground">
            Notes particulières (optionnel)
          </Label>
          <Textarea
            id="notes"
            placeholder="Allergies, préférences alimentaires, occasion spéciale..."
            value={data.notes || ''}
            onChange={(e) => onUpdate({ notes: e.target.value })}
            className="premium-input mt-1 min-h-[80px]"
            rows={3}
          />
        </div>
      </div>
    </div>
  );
}