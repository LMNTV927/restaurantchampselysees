import { useState, useEffect } from "react";
import { Pencil, CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  customerName: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  customerPhone: z.string().min(10, "Le numéro doit contenir au moins 10 caractères"),
  customerEmail: z.string().email("Email invalide").optional().or(z.literal("")),
  reservationDate: z.date({ required_error: "Veuillez sélectionner une date" }),
  reservationTime: z.string().min(1, "Veuillez sélectionner une heure"),
  guestsCount: z.number().min(1).max(500),
  source: z.string().optional(),
  notes: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface EditReservationDialogProps {
  reservation: {
    id: string;
    customerName: string;
    customerPhone: string;
    customerEmail?: string | null;
    reservationDate: string; // YYYY-MM-DD
    reservationTime: string; // HH:mm
    guestsCount: number;
    source?: string | null;
    notes?: string | null;
  };
  onUpdated?: () => void;
}

const timeSlots = [
  '17:00','17:30','18:00','18:30','19:00','19:30',
  '20:00','20:30','21:00','21:30','22:00','22:30',
  '23:00','23:30','00:00','00:30','01:00','01:30',
  '02:00','02:30','03:00','03:30','04:00','04:30','05:00',
];

export function EditReservationDialog({ reservation, onUpdated }: EditReservationDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      customerName: reservation.customerName,
      customerPhone: reservation.customerPhone,
      customerEmail: reservation.customerEmail || "",
      reservationDate: new Date(reservation.reservationDate + "T12:00:00"),
      reservationTime: reservation.reservationTime?.slice(0, 5),
      guestsCount: reservation.guestsCount,
      source: reservation.source || "",
      notes: reservation.notes || "",
    },
  });

  useEffect(() => {
    if (isOpen) {
      form.reset({
        customerName: reservation.customerName,
        customerPhone: reservation.customerPhone,
        customerEmail: reservation.customerEmail || "",
        reservationDate: new Date(reservation.reservationDate + "T12:00:00"),
        reservationTime: reservation.reservationTime?.slice(0, 5),
        guestsCount: reservation.guestsCount,
        source: reservation.source || "",
        notes: reservation.notes || "",
      });
    }
  }, [isOpen, reservation]);

  const onSubmit = async (values: FormValues) => {
    setIsSubmitting(true);
    try {
      const reservationDate = values.reservationDate.toLocaleDateString('sv-SE', {
        timeZone: 'Europe/Paris',
      });

      const { error } = await supabase
        .from('reservations')
        .update({
          customer_name: values.customerName,
          customer_phone: values.customerPhone,
          customer_email: values.customerEmail || null,
          reservation_date: reservationDate,
          reservation_time: values.reservationTime,
          guests_count: values.guestsCount,
          source: values.source?.trim() || null,
          notes: values.notes || null,
        })
        .eq('id', reservation.id);

      if (error) throw error;

      toast({
        title: "Réservation modifiée",
        description: `La réservation de ${values.customerName} a été mise à jour.`,
      });

      setIsOpen(false);
      onUpdated?.();
    } catch (error) {
      console.error('Erreur modification réservation:', error);
      toast({
        title: "Erreur",
        description: "Impossible de modifier la réservation",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="premium-button">
          <Pencil className="h-4 w-4 mr-1" />
          Modifier
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Modifier la réservation</DialogTitle>
          <DialogDescription>
            Modifiez les informations de la réservation.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="customerName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nom du client</FormLabel>
                    <FormControl><Input {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="customerPhone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Téléphone</FormLabel>
                    <FormControl><Input {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="customerEmail"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email (optionnel)</FormLabel>
                  <FormControl><Input type="email" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="reservationDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}
                          >
                            {field.value ? format(field.value, "PPP", { locale: fr }) : <span>Date</span>}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          initialFocus
                          className={cn("p-3 pointer-events-auto")}
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="reservationTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Heure</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger><SelectValue placeholder="Heure" /></SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {timeSlots.map((t) => (
                          <SelectItem key={t} value={t}>{t}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="guestsCount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre d'invités</FormLabel>
                    <FormControl>
                      <Input
                        type="number" min="1" max="500"
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="source"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Via (source)</FormLabel>
                  <FormControl><Input {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes</FormLabel>
                  <FormControl>
                    <Textarea rows={3} className="resize-none" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end space-x-2 pt-4">
              <Button type="button" variant="outline" onClick={() => setIsOpen(false)} disabled={isSubmitting}>
                Annuler
              </Button>
              <Button type="submit" disabled={isSubmitting} className="premium-button">
                {isSubmitting ? "Enregistrement..." : "Enregistrer"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
