import { Calendar } from '@/components/ui/calendar';
import { BookingData } from '../BookingForm';
import { addDays, format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface DateStepProps {
  data: BookingData;
  onUpdate: (updates: Partial<BookingData>) => void;
}

export function DateStep({ data, onUpdate }: DateStepProps) {
  const handleDateSelect = (date: Date | undefined) => {
    if (!date) return;
    onUpdate({ date });
  };

  // Bornes : aujourd'hui -> +60 jours
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const maxDate = addDays(today, 60);

  return (
    <div className="text-center">
      <h4 className="text-xl font-playfair font-semibold text-foreground mb-2">
        Choisissez votre date
      </h4>
      <p className="text-muted-foreground mb-6">
        Sélectionnez le jour souhaité pour votre réservation
      </p>

      <div className="flex justify-center">
        <Calendar
          mode="single"
          selected={data.date || undefined}
          onSelect={handleDateSelect}
          defaultMonth={data.date || today}
          fromDate={today}
          toDate={maxDate}
          locale={fr}
          className="rounded-xl border border-border bg-background p-4 pointer-events-auto"
          classNames={{
            day: "h-9 w-9 p-0 font-normal text-foreground opacity-100 hover:bg-accent hover:text-accent-foreground rounded-md cursor-pointer",
            day_selected:
              "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
            day_today: "",
            day_disabled: "text-muted-foreground/40 opacity-100 cursor-not-allowed",
            day_outside: "invisible",
          }}
        />
      </div>
    </div>
  );
}
