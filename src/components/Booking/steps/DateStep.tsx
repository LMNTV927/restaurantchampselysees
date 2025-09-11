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
    onUpdate({ date: date || null });
  };

  // Don't allow past dates or dates more than 2 months in advance
  const disabledDates = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const maxDate = addDays(today, 60);
    
    return date < today || date > maxDate;
  };

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
          disabled={disabledDates}
          locale={fr}
          className="rounded-xl border border-border bg-background p-4 pointer-events-auto"
          classNames={{
            day_selected: "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
            day_today: "bg-accent text-accent-foreground",
          }}
        />
      </div>
      
      {data.date && (
        <p className="mt-4 text-sm text-muted-foreground">
          Date sélectionnée: {format(data.date, 'EEEE d MMMM yyyy', { locale: fr })}
        </p>
      )}
    </div>
  );
}