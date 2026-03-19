import { motion } from 'framer-motion';
import { BookingData } from '../BookingForm';

interface TimeStepProps {
  data: BookingData;
  onUpdate: (updates: Partial<BookingData>) => void;
}

const timeSlots = [
  '17:00', '17:30', '18:00', '18:30', '19:00', '19:30',
  '20:00', '20:30', '21:00', '21:30', '22:00', '22:30',
  '23:00', '23:30', '00:00', '00:30', '01:00', '01:30',
  '02:00', '02:30', '03:00', '03:30', '04:00', '04:30', '05:00'
];

export function TimeStep({ data, onUpdate }: TimeStepProps) {
  const handleTimeSelect = (time: string) => {
    onUpdate({ time });
  };

  return (
    <div className="text-center">
      <h4 className="text-xl font-playfair font-semibold text-foreground mb-2">
        Sélectionnez l'heure
      </h4>
      <p className="text-muted-foreground mb-6">
        Choisissez votre créneau horaire préféré
      </p>
      
      <div className="grid grid-cols-3 gap-3">
        {timeSlots.map((time) => (
          <motion.button
            key={time}
            onClick={() => handleTimeSelect(time)}
            className={`
              p-3 rounded-lg border-2 transition-all duration-200 font-medium
              ${data.time === time
                ? 'border-primary bg-primary text-primary-foreground shadow-soft'
                : 'border-border bg-background hover:border-primary/50 text-foreground hover:bg-primary/5'
              }
            `}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {time}
          </motion.button>
        ))}
      </div>
      
    </div>
  );
}