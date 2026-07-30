import { motion } from 'framer-motion';
import { BookingData } from '../BookingForm';

interface TimeStepProps {
  data: BookingData;
  onUpdate: (updates: Partial<BookingData>) => void;
  onAdvance?: () => void;
}


const allSlots = [
  '17:00', '17:30', '18:00', '18:30', '19:00', '19:30',
  '20:00', '20:30', '21:00', '21:30', '22:00', '22:30',
  '23:00', '23:30', '00:00', '00:30', '01:00', '01:30',
  '02:00', '02:30', '03:00', '03:30', '04:00', '04:30', '05:00'
];

function getDayType(date: Date | null): 'weekday' | 'friday' | 'weekend' {
  if (!date) return 'weekday';
  const day = date.getDay();
  if (day === 5) return 'friday'; // Vendredi
  if (day === 6 || day === 0) return 'weekend'; // Samedi, Dimanche
  return 'weekday'; // Lundi-Jeudi
}

function getSlotCategory(time: string, dayType: 'weekday' | 'friday' | 'weekend'): 'restaurant' | 'club' {
  const [h, m] = time.split(':').map(Number);
  const totalMin = h * 60 + m;
  
  if (dayType === 'weekend') {
    // Sam/Dim: restaurant 17h-00h00, club à partir de 00h30
    return (h >= 17) || (h === 0 && m === 0) ? 'restaurant' : 'club';
  } else if (dayType === 'friday') {
    // Vendredi: restaurant 17h-23h00, club à partir de 23h30
    return h >= 17 && h <= 23 && !(h === 23 && m === 30) ? 'restaurant' : 'club';
  } else {
    // Semaine (Lun-Jeu): restaurant 17h-22h30, club à partir de 23h
    return h >= 17 && h <= 22 ? 'restaurant' : 'club';
  }
}

export function TimeStep({ data, onUpdate, onAdvance }: TimeStepProps) {
  const handleTimeSelect = (time: string) => {
    onUpdate({ time });
    if (onAdvance) setTimeout(onAdvance, 200);
  };


  const dayType = getDayType(data.date);
  const restaurantSlots = allSlots.filter(t => getSlotCategory(t, dayType) === 'restaurant');
  const clubSlots = allSlots.filter(t => getSlotCategory(t, dayType) === 'club');

  const isChampionsLeagueFinal =
    data.date !== null &&
    data.date.getFullYear() === 2026 &&
    data.date.getMonth() === 4 && // mai (0-indexé)
    data.date.getDate() === 30;

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
              className={`min-h-[44px] p-3 rounded-lg border-2 transition-all duration-200 font-medium ${
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
              className={`min-h-[44px] p-3 rounded-lg border-2 transition-all duration-200 font-medium ${
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

      {isChampionsLeagueFinal && (
        <div
          className="mt-6 p-4 rounded-lg border-2 text-left"
          style={{
            borderColor: '#c9a84c',
            backgroundColor: 'rgba(201, 168, 76, 0.1)',
          }}
        >
          <p className="text-sm font-semibold mb-1" style={{ color: '#c9a84c' }}>
            ⚽ Finale de la Ligue des Champions
          </p>
          <p className="text-sm text-foreground">
            Pour la diffusion de la finale de la Ligue des Champions le 30 mai 2026,
            nous ne prenons pas de réservations. Merci de vous déplacer directement
            à l'avance pour garantir votre place lors de cet événement diffusé chez nous.
          </p>
        </div>
      )}

    </div>
  );
}
