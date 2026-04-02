import { motion } from 'framer-motion';
import { BookingData } from '../BookingForm';

interface TimeStepProps {
  data: BookingData;
  onUpdate: (updates: Partial<BookingData>) => void;
}

const allSlots = [
  '17:00', '17:30', '18:00', '18:30', '19:00', '19:30',
  '20:00', '20:30', '21:00', '21:30', '22:00', '22:30',
  '23:00', '23:30', '00:00', '00:30', '01:00', '01:30',
  '02:00', '02:30', '03:00', '03:30', '04:00', '04:30', '05:00'
];

function isWeekend(date: Date | null): boolean {
  if (!date) return false;
  const day = date.getDay();
  return day === 5 || day === 6 || day === 0; // Vendredi, Samedi, Dimanche
}

function getSlotCategory(time: string, weekend: boolean): 'restaurant' | 'club' {
  // Semaine: restaurant 17h-23h (dernier créneau 22:30), club à partir de 23h
  // Weekend: restaurant 17h-00h (dernier créneau 23:30), club à partir de 00h
  const [h] = time.split(':').map(Number);
  
  if (weekend) {
    // Weekend: 17-23 = restaurant, 00-05 = club
    return h >= 17 ? 'restaurant' : 'club';
  } else {
    // Semaine: 17-22 = restaurant, 23+ et 00-05 = club
    return h >= 17 && h <= 22 ? 'restaurant' : 'club';
  }
}

export function TimeStep({ data, onUpdate }: TimeStepProps) {
  const handleTimeSelect = (time: string) => {
    onUpdate({ time });
  };

  const weekend = isWeekend(data.date);
  const restaurantSlots = allSlots.filter(t => getSlotCategory(t, weekend) === 'restaurant');
  const clubSlots = allSlots.filter(t => getSlotCategory(t, weekend) === 'club');

  return (
    <div className="text-center">
      <h4 className="text-xl font-playfair font-semibold text-foreground mb-2">
        Sélectionnez l'heure
      </h4>
      <p className="text-muted-foreground mb-6">
        Choisissez votre créneau horaire préféré
      </p>
      
      {/* Restauration */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#F4B183' }}></div>
          <span className="text-sm font-medium text-muted-foreground">Restauration</span>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {restaurantSlots.map((time) => (
            <motion.button
              key={time}
              onClick={() => handleTimeSelect(time)}
              className={`p-3 rounded-lg border-2 transition-all duration-200 font-medium ${
                data.time === time
                  ? 'shadow-soft text-foreground'
                  : 'border-border bg-background text-foreground hover:opacity-80'
              }`}
              style={{
                borderColor: data.time === time ? '#F4B183' : undefined,
                backgroundColor: data.time === time ? 'rgba(244, 177, 131, 0.2)' : undefined,
              }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {time}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Club */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#C8A2FF' }}></div>
          <span className="text-sm font-medium text-muted-foreground">Club</span>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {clubSlots.map((time) => (
            <motion.button
              key={time}
              onClick={() => handleTimeSelect(time)}
              className={`p-3 rounded-lg border-2 transition-all duration-200 font-medium ${
                data.time === time
                  ? 'shadow-soft text-foreground'
                  : 'border-border bg-background text-foreground hover:opacity-80'
              }`}
              style={{
                borderColor: data.time === time ? '#C8A2FF' : undefined,
                backgroundColor: data.time === time ? 'rgba(200, 162, 255, 0.2)' : undefined,
              }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {time}
            </motion.button>
          ))}
        </div>
      </div>
      
    </div>
  );
}