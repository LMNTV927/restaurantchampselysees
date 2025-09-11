import { motion } from 'framer-motion';
import { Minus, Plus, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { BookingData } from '../BookingForm';

interface GuestsStepProps {
  data: BookingData;
  onUpdate: (updates: Partial<BookingData>) => void;
}

export function GuestsStep({ data, onUpdate }: GuestsStepProps) {
  const handleGuestsChange = (change: number) => {
    const newCount = Math.max(1, data.guestsCount + change);
    onUpdate({ guestsCount: newCount });
  };

  return (
    <div className="text-center">
      <h4 className="text-xl font-playfair font-semibold text-foreground mb-2">
        Nombre de convives
      </h4>
      <p className="text-muted-foreground mb-8">
        Combien de personnes participeront au repas ?
      </p>
      
      <div className="flex items-center justify-center space-x-6">
        <Button
          variant="outline"
          size="icon"
          onClick={() => handleGuestsChange(-1)}
          disabled={data.guestsCount <= 1}
          className="h-12 w-12 rounded-full"
        >
          <Minus className="h-5 w-5" />
        </Button>
        
        <motion.div
          key={data.guestsCount}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="flex flex-col items-center"
        >
          <div className="bg-primary/10 rounded-full p-6 mb-2">
            <Users className="h-8 w-8 text-primary" />
          </div>
          <span className="text-4xl font-bold text-foreground count-up">
            {data.guestsCount}
          </span>
        </motion.div>
        
        <Button
          variant="outline"
          size="icon"
          onClick={() => handleGuestsChange(1)}
          className="h-12 w-12 rounded-full"
        >
          <Plus className="h-5 w-5" />
        </Button>
      </div>
      
      <p className="mt-6 text-sm text-muted-foreground">
        {data.guestsCount === 1 ? '1 personne' : `${data.guestsCount} personnes`}
      </p>
      
      {data.guestsCount >= 10 && (
        <p className="mt-2 text-sm text-primary">
          Pour les groupes de 10 personnes et plus, une personne vous contactera pour finaliser les détails de votre réservation.
        </p>
      )}
    </div>
  );
}