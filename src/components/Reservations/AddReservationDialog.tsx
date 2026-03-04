import { useState } from "react";
import { Plus } from "lucide-react";
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
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
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  customerName: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  customerPhone: z.string().min(10, "Le numéro de téléphone doit contenir au moins 10 caractères"),
  customerEmail: z.string().email("Email invalide").optional().or(z.literal("")),
  reservationDate: z.date({
    required_error: "Veuillez sélectionner une date",
  }),
  reservationTime: z.string().min(1, "Veuillez sélectionner une heure"),
  guestsCount: z.number().min(1, "Au moins 1 invité requis").max(20, "Maximum 20 invités"),
  notes: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface AddReservationDialogProps {
  onReservationAdded?: () => void;
}

export function AddReservationDialog({ onReservationAdded }: AddReservationDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      customerName: "",
      customerPhone: "",
      customerEmail: "",
      guestsCount: 2,
      notes: "",
    },
  });

  // Generate time slots from 11:30 to 22:00
  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 11; hour <= 22; hour++) {
      if (hour === 11) {
        slots.push("11:30");
      } else {
        slots.push(`${hour.toString().padStart(2, '0')}:00`);
        if (hour < 22) {
          slots.push(`${hour.toString().padStart(2, '0')}:30`);
        }
      }
    }
    return slots;
  };

  const timeSlots = generateTimeSlots();

  const onSubmit = async (values: FormValues) => {
    setIsSubmitting(true);
    try {
      // Format the date correctly in Paris timezone
      const reservationDate = values.reservationDate.toLocaleDateString('sv-SE', { 
        timeZone: 'Europe/Paris' 
      });

      // Get the first active channel with its name
      const { data: channels, error: channelError } = await supabase
        .from('channels')
        .select('id, name')
        .eq('is_active', true)
        .limit(1);

      if (channelError || !channels || channels.length === 0) {
        throw new Error("Aucun canal actif trouvé");
      }

      const { error } = await supabase
        .from('reservations')
        .insert({
          channel_id: channels[0].id,
          reservation_date: reservationDate,
          reservation_time: values.reservationTime,
          guests_count: values.guestsCount,
          customer_name: values.customerName,
          customer_phone: values.customerPhone,
          customer_email: values.customerEmail || null,
          notes: values.notes || null,
          status: 'confirmed'
        });

      if (error) {
        throw error;
      }

      // Send confirmation email if email is provided
      if (values.customerEmail && values.customerEmail.trim()) {
        try {
          await supabase.functions.invoke('send-reservation-confirmation', {
            body: {
              customerName: values.customerName,
              customerEmail: values.customerEmail,
              restaurantName: channels[0].name || 'Restaurant',
              reservationDate: values.reservationDate.toLocaleDateString('fr-FR', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              }),
              reservationTime: values.reservationTime,
              guestsCount: values.guestsCount,
              customerPhone: values.customerPhone,
              notes: values.notes,
            }
          });
        } catch (emailError) {
          console.error('Erreur envoi email:', emailError);
        }
      }

      // Send confirmation SMS
      try {
        await supabase.functions.invoke('send-reservation-sms', {
          body: {
            customerName: values.customerName,
            customerPhone: values.customerPhone,
            restaurantName: channels[0].name || 'Restaurant',
            reservationDate: values.reservationDate.toLocaleDateString('fr-FR', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            }),
            reservationTime: values.reservationTime,
            guestsCount: values.guestsCount,
          }
        });
      } catch (smsError) {
        console.error('Erreur envoi SMS:', smsError);
      }

      toast({
        title: "Réservation créée",
        description: values.customerEmail
          ? `Réservation pour ${values.customerName} ajoutée. Email de confirmation envoyé.`
          : `Réservation pour ${values.customerName} ajoutée avec succès`,
      });

      form.reset();
      setIsOpen(false);
      onReservationAdded?.();
    } catch (error) {
      console.error('Erreur lors de la création de la réservation:', error);
      toast({
        title: "Erreur",
        description: "Impossible de créer la réservation",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="premium-button">
          <Plus className="h-4 w-4 mr-2" />
          Ajouter une réservation
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Ajouter une réservation manuelle</DialogTitle>
          <DialogDescription>
            Créez une nouvelle réservation directement depuis l'interface d'administration.
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
                    <FormControl>
                      <Input placeholder="Prénom Nom" {...field} />
                    </FormControl>
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
                    <FormControl>
                      <Input placeholder="06 12 34 56 78" {...field} />
                    </FormControl>
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
                  <FormControl>
                    <Input placeholder="client@email.com" type="email" {...field} />
                  </FormControl>
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
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP", { locale: fr })
                            ) : (
                              <span>Sélectionner une date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) => date < new Date()}
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
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner l'heure" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {timeSlots.map((time) => (
                          <SelectItem key={time} value={time}>
                            {time}
                          </SelectItem>
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
                        type="number"
                        min="1"
                        max="20"
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
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes (optionnel)</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Informations complémentaires sur la réservation..."
                      className="resize-none"
                      rows={3}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end space-x-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsOpen(false)}
                disabled={isSubmitting}
              >
                Annuler
              </Button>
              <Button type="submit" disabled={isSubmitting} className="premium-button">
                {isSubmitting ? "Création..." : "Créer la réservation"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}