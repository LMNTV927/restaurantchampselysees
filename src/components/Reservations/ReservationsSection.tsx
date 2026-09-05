import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { Calendar as CalendarIcon, Calendar, Clock, Users, MapPin, History, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

import { KPICard } from "@/components/UI/KPICard";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StatusBadge } from "@/components/UI/StatusBadge";
import { useToast } from "@/hooks/use-toast";
import { useRealtimeReservations } from "@/hooks/useRealtimeReservations";
import { useGoogleCalendarAutoSync } from "@/hooks/useGoogleCalendarAutoSync";
import { useAuth } from "@/hooks/useAuth";
import { AddReservationDialog } from "./AddReservationDialog";
import { ImportOpenTableDialog } from "./ImportOpenTableDialog";
import { EditCommentDialog } from "./EditCommentDialog";
import { EditReservationDialog } from "./EditReservationDialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { getTodayInParis, getCurrentTimeInParis, getCurrentMonthInParis, createDateTimeInParis } from "@/lib/dateUtils";
import { cn } from "@/lib/utils";

type ReservationStatus = "confirmed" | "show" | "no_show" | "cancelled";

interface Reservation {
  id: string;
  customer: { firstName: string; lastName: string; phone: string };
  startAt: Date;
  partySize: number;
  occasion: string;
  notes: string;
  status: ReservationStatus;
  source: string | null;
}

export function ReservationsSection() {
  const [selectedFilter, setSelectedFilter] = useState("today");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedPastDate, setSelectedPastDate] = useState<Date | undefined>(undefined);
  const ITEMS_PER_PAGE = 5;
  const { toast } = useToast();
  const { reservations: realtimeReservations, duplicates, kpis, loading, updateReservationStatus, updateReservationNotes, deleteReservation, restoreReservation, refetch } = useRealtimeReservations();
  const { role } = useAuth();
  useGoogleCalendarAutoSync();




  // Transform real-time reservations to match local interface
  const allReservations: Reservation[] = realtimeReservations.map(reservation => {
    const nameParts = reservation.customerName.split(' ');
    const firstName = nameParts[0] || '';
    const lastName = nameParts.slice(1).join(' ') || '';
    
    return {
      id: reservation.id,
      customer: { 
        firstName, 
        lastName, 
        phone: reservation.customerPhone 
      },
      startAt: createDateTimeInParis(reservation.reservationDate, reservation.reservationTime),
      partySize: reservation.guestsCount,
      occasion: '', // We don't have occasion in our data model yet
      notes: reservation.notes || '',
      status: reservation.status,
      source: reservation.source || reservation.channelName
    };
  });

  // Filter reservations based on selected period
  const getFilteredReservations = () => {
    const todayString = getTodayInParis();
    const currentTime = getCurrentTimeInParis();
    const currentMonth = getCurrentMonthInParis();
    
    // Calculate date strings for filtering (avoid timezone issues)
    const today = new Date(todayString + 'T00:00:00');
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const nextWeek = new Date(today);
    nextWeek.setDate(nextWeek.getDate() + 7);
    
    // Format dates as YYYY-MM-DD for string comparison
    const tomorrowString = tomorrow.toISOString().split('T')[0];
    const nextWeekString = nextWeek.toISOString().split('T')[0];
    
    // Use original reservation data for filtering (avoid timezone conversion issues)
    const sourceList = selectedFilter === 'duplicates' ? duplicates : realtimeReservations;
    const reservationsWithOriginalData = sourceList.map(reservation => {
      const nameParts = reservation.customerName.split(' ');
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || '';
      
      return {
        id: reservation.id,
        customer: { 
          firstName, 
          lastName, 
          phone: reservation.customerPhone 
        },
        startAt: createDateTimeInParis(reservation.reservationDate, reservation.reservationTime),
        partySize: reservation.guestsCount,
        occasion: '',
        notes: reservation.notes || '',
        status: reservation.status,
        source: reservation.source || reservation.channelName,
        reservationDate: reservation.reservationDate, // Keep original date string
        reservationTime: reservation.reservationTime  // Keep original time string
      };
    });

    if (selectedFilter === 'duplicates') {
      return reservationsWithOriginalData.sort((a, b) =>
        `${b.reservationDate}${b.reservationTime}`.localeCompare(`${a.reservationDate}${a.reservationTime}`)
      );
    }


    switch (selectedFilter) {
      case "today":
        // Réservations d'aujourd'hui uniquement - comparer directement les dates string
        return reservationsWithOriginalData.filter(reservation => 
          reservation.reservationDate === todayString
        );
      
      case "upcoming":
        // Réservations des 7 prochains jours (sans aujourd'hui)
        return reservationsWithOriginalData.filter(reservation => 
          reservation.reservationDate >= tomorrowString && 
          reservation.reservationDate < nextWeekString
        );
      
      case "all":
        // Réservations au-delà de 7 jours
        return reservationsWithOriginalData.filter(reservation => 
          reservation.reservationDate >= nextWeekString
        );
      
      case "past": {
        // Filtre par jour sélectionné si défini, sinon toutes les réservations passées paginées
        const selectedPastDateString = selectedPastDate
          ? selectedPastDate.toLocaleDateString('sv-SE', { timeZone: 'Europe/Paris' })
          : null;

        const allPastReservations = reservationsWithOriginalData.filter(reservation => {
          const isPast = reservation.reservationDate < todayString || 
                        (reservation.reservationDate === todayString && 
                         reservation.reservationTime < currentTime);
          
          if (selectedPastDateString) {
            return isPast && reservation.reservationDate === selectedPastDateString;
          }
          return isPast;
        }).sort((a, b) => {
          if (a.reservationDate !== b.reservationDate) {
            return b.reservationDate.localeCompare(a.reservationDate);
          }
          return b.reservationTime.localeCompare(a.reservationTime);
        });
        
        if (selectedPastDateString) {
          return allPastReservations;
        }
        
        // Pagination - afficher seulement ITEMS_PER_PAGE réservations
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        const endIndex = startIndex + ITEMS_PER_PAGE;
        return allPastReservations.slice(startIndex, endIndex);
      }
      
      default:
        return reservationsWithOriginalData;
    }
  };

  const reservations = getFilteredReservations();

  // Calculate KPIs based on filtered reservations
  const getFilteredKPIs = () => {
    const totalReservations = reservations.length;
    const totalCovers = reservations.reduce((sum, r) => sum + r.partySize, 0);
    
    // Restaurant capacity: 500 seats
    const restaurantCapacity = 500;
    const occupancyRate = Math.min(Math.round((totalCovers / restaurantCapacity) * 100), 100);

    return {
      totalReservations,
      totalCovers,
      occupancyRate
    };
  };

  const filteredKPIs = getFilteredKPIs();

  // Calculer les informations de pagination pour les réservations passées
  const getTotalPastReservations = () => {
    const todayString = getTodayInParis();
    const currentTime = getCurrentTimeInParis();
    const selectedPastDateString = selectedPastDate
      ? selectedPastDate.toLocaleDateString('sv-SE', { timeZone: 'Europe/Paris' })
      : null;
    
    const reservationsWithOriginalData = realtimeReservations.map(reservation => {
      const nameParts = reservation.customerName.split(' ');
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || '';
      
      return {
        id: reservation.id,
        customer: { 
          firstName, 
          lastName, 
          phone: reservation.customerPhone 
        },
        startAt: createDateTimeInParis(reservation.reservationDate, reservation.reservationTime),
        partySize: reservation.guestsCount,
        occasion: '',
        notes: reservation.notes || '',
        status: reservation.status,
        source: reservation.source || reservation.channelName,
        reservationDate: reservation.reservationDate,
        reservationTime: reservation.reservationTime
      };
    });

    return reservationsWithOriginalData.filter(reservation => {
      const isPast = reservation.reservationDate < todayString || 
                    (reservation.reservationDate === todayString && 
                     reservation.reservationTime < currentTime);
      if (selectedPastDateString) {
        return isPast && reservation.reservationDate === selectedPastDateString;
      }
      return isPast;
    }).length;
  };

  const totalPastReservations = selectedFilter === "past" ? getTotalPastReservations() : 0;
  const totalPages = selectedPastDate ? 1 : Math.ceil(totalPastReservations / ITEMS_PER_PAGE);

  // Reset à la page 1 et au jour sélectionné si on change de filtre
  useEffect(() => {
    setCurrentPage(1);
    setSelectedPastDate(undefined);
  }, [selectedFilter]);

  const handleUpdateReservationStatus = async (reservationId: string, newStatus: ReservationStatus) => {
    try {
      await updateReservationStatus(reservationId, newStatus);
      
      const statusLabels = {
        confirmed: "Confirmé",
        show: "Présent",
        no_show: "Absent", 
        cancelled: "Annulé"
      };

      toast({
        title: "Statut mis à jour",
        description: `Réservation marquée comme "${statusLabels[newStatus]}"`,
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le statut",
        variant: "destructive",
      });
    }
  };

  const handleUpdateReservationNotes = async (reservationId: string, notes: string) => {
    try {
      await updateReservationNotes(reservationId, notes);
    } catch (error) {
      throw error; // Re-throw to let EditCommentDialog handle the error
    }
  };

  const getFilterTitle = () => {
    switch (selectedFilter) {
      case "today":
        return "Réservations d'aujourd'hui";
      case "upcoming":
        return "Réservations des 7 prochains jours";
      case "all":
        return "Réservations à venir";
      case "past":
        if (selectedPastDate) {
          return `Réservations du ${format(selectedPastDate, 'dd/MM/yyyy', { locale: fr })}`;
        }
        return "Réservations passées";
      case "duplicates":
        return "Doublons détectés (masqués) — la réservation la plus récente est conservée";

      default:
        return "Réservations";
    }
  };

  const getKPITitles = () => {
    switch (selectedFilter) {
      case "today":
        return {
          reservations: "Réservations Aujourd'hui",
          covers: "Couverts Aujourd'hui",
          occupancy: "Taux d'Occupation"
        };
      case "upcoming":
        return {
          reservations: "Réservations 7 jours",
          covers: "Couverts 7 jours",
          occupancy: "Taux d'Occupation"
        };
      case "all":
        return {
          reservations: "Réservations futures",
          covers: "Couverts futures",
          occupancy: "Taux d'Occupation"
        };
      case "past":
        return {
          reservations: "Réservations Passées",
          covers: "Couverts Passés",
          occupancy: "Pages"
        };
      default:
        return {
          reservations: "Réservations",
          covers: "Couverts",
          occupancy: "Taux d'Occupation"
        };
    }
  };

  const kpiTitles = getKPITitles();

  const filters = [
    { id: "today", label: "Aujourd'hui" },
    { id: "upcoming", label: "Prochains 7 jours" },
    { id: "all", label: "Tout à venir" },
    { id: "past", label: "Réservations passées" },
    ...(role === 'admin' && duplicates.length > 0
      ? [{ id: "duplicates", label: `Doublons (${duplicates.length})` }]
      : []),
  ];


  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-playfair font-semibold text-foreground">
            Réservations
          </h2>
          <p className="text-muted-foreground mt-1">
            Gestion opérationnelle de la salle et suivi des services
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          <AddReservationDialog onReservationAdded={refetch} />
          {role === 'admin' && <ImportOpenTableDialog onImported={refetch} />}


          {/* Filters */}
          <div className="flex items-center bg-card/50 rounded-2xl p-1 backdrop-blur-sm">
            {filters.map((filter) => (
              <motion.button
                key={filter.id}
                onClick={() => setSelectedFilter(filter.id)}
                className={`relative px-4 py-2 text-sm font-medium rounded-xl transition-all duration-300 ${
                  selectedFilter === filter.id
                    ? "text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {selectedFilter === filter.id && (
                  <motion.div
                    className="absolute inset-0 bg-gradient-gold rounded-xl shadow-gold"
                    layoutId="activeFilter"
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                  />
                )}
                <span className="relative z-10">{filter.label}</span>
              </motion.button>
            ))}
          </div>

        </div>
      </div>

      {/* KPI Cards */}
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        variants={{
          hidden: { opacity: 0 },
          show: {
            opacity: 1,
            transition: {
              staggerChildren: 0.1
            }
          }
        }}
        initial="hidden"
        animate="show"
      >
        <motion.div variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}>
          <KPICard
            title={kpiTitles.reservations}
            value={filteredKPIs.totalReservations}
            icon={selectedFilter === "past" ? History : Calendar}
            trend={kpis.evolution?.reservationsEvolution !== null && kpis.evolution?.reservationsEvolution !== undefined && selectedFilter === "today" ? 
              { value: kpis.evolution.reservationsEvolution, isPositive: kpis.evolution.reservationsEvolution >= 0 } : 
              undefined
            }
            loading={loading}
          />
        </motion.div>
        <motion.div variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}>
          <KPICard
            title={kpiTitles.covers}
            value={filteredKPIs.totalCovers}
            icon={Users}
            trend={kpis.evolution?.coversEvolution !== null && kpis.evolution?.coversEvolution !== undefined && selectedFilter === "today" ? 
              { value: kpis.evolution.coversEvolution, isPositive: kpis.evolution.coversEvolution >= 0 } : 
              undefined
            }
            loading={loading}
          />
        </motion.div>
        <motion.div variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}>
          {selectedFilter === "past" ? (
            <Card className="premium-card p-3 sm:p-6 group hover:shadow-medium transition-all duration-300">
              <div className="flex flex-col items-center text-center space-y-3 sm:space-y-2 sm:flex-row sm:text-left sm:items-center sm:justify-between">
                <div className="space-y-2 order-2 sm:order-1 w-full sm:w-auto">
                  <p className="text-xs sm:text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors whitespace-nowrap">
                    {selectedPastDate ? "Jour sélectionné" : "Choisir un jour"}
                  </p>
                  <div className="flex items-center justify-center sm:justify-start gap-2 flex-wrap">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          className={cn(
                            "justify-start text-left font-normal bg-card/50 border-border/50 hover:bg-card h-9 px-3",
                            !selectedPastDate && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4 text-primary" />
                          {selectedPastDate
                            ? format(selectedPastDate, "dd/MM/yyyy", { locale: fr })
                            : "Choisir un jour"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0 pointer-events-auto" align="start">
                        <CalendarComponent
                          mode="single"
                          selected={selectedPastDate}
                          onSelect={setSelectedPastDate}
                          defaultMonth={selectedPastDate || new Date()}
                          toDate={new Date()}
                          locale={fr}
                          className="p-3"
                        />
                      </PopoverContent>
                    </Popover>
                    {selectedPastDate && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-muted-foreground hover:text-foreground h-9 px-2"
                        onClick={() => setSelectedPastDate(undefined)}
                      >
                        Tout voir
                      </Button>
                    )}
                  </div>
                </div>
                
                <div className="p-2 sm:p-3 bg-gradient-gold rounded-xl shadow-gold group-hover:shadow-large transition-all duration-300 order-1 sm:order-2">
                  <History className="h-5 w-5 sm:h-6 sm:w-6 text-charcoal" />
                </div>
              </div>
            </Card>
          ) : (
            <KPICard
              title={kpiTitles.occupancy}
              value={filteredKPIs.occupancyRate}
              suffix="%"
              icon={MapPin}
              trend={kpis.evolution?.occupancyEvolution !== null && kpis.evolution?.occupancyEvolution !== undefined && selectedFilter === "today" ? 
                { value: kpis.evolution.occupancyEvolution, isPositive: kpis.evolution.occupancyEvolution >= 0 } : 
                undefined
              }
              loading={loading}
            />
          )}
        </motion.div>
      </motion.div>

      {/* Reservations List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <Card className="premium-card overflow-hidden">
          <div className="p-6 border-b border-border/50">
            <h3 className="text-lg font-playfair font-semibold">{getFilterTitle()}</h3>
            <p className="text-sm text-muted-foreground mt-1">
              {reservations.length} réservations • {reservations.reduce((sum, r) => sum + r.partySize, 0)} couverts
            </p>
          </div>
          
          <div className="p-6 space-y-4">
            {reservations.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">Aucune réservation pour cette période</p>
              </div>
            ) : (
              reservations.map((reservation, index) => (
                <motion.div
                  key={reservation.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="flex items-center justify-between p-4 bg-muted/20 rounded-2xl hover:bg-muted/30 transition-all duration-300 group"
                >
                  <div className="flex items-center gap-4">
                    <div className="text-center">
                      <p className="text-lg font-semibold text-foreground">
                        {(reservation as any).reservationTime?.slice(0, 5) ?? reservation.startAt.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', timeZone: 'Europe/Paris' })}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {(reservation as any).reservationDate ? `${(reservation as any).reservationDate.slice(8, 10)}/${(reservation as any).reservationDate.slice(5, 7)}` : reservation.startAt.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', timeZone: 'Europe/Paris' })}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {reservation.partySize} pers.
                      </p>
                    </div>
                    
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-foreground">
                          {reservation.customer.firstName} {reservation.customer.lastName}
                        </p>
                        <StatusBadge status={reservation.status} />
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {reservation.customer.phone}
                      </p>
                      {reservation.occasion && (
                        <Badge variant="outline" className="text-xs">
                          {reservation.occasion}
                        </Badge>
                      )}
                      <div className="flex items-center gap-2">
                        {reservation.notes && (
                          <p className="text-xs text-muted-foreground italic">
                            "{reservation.notes}"
                          </p>
                        )}
                        <EditCommentDialog
                          reservationId={reservation.id}
                          currentNotes={reservation.notes}
                          onNotesUpdate={handleUpdateReservationNotes}
                        />
                      </div>
                      {reservation.source && (
                        <p className="text-xs text-primary">
                          via {reservation.source}
                        </p>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 flex-wrap">
                    {selectedFilter === 'duplicates' ? (
                      <Button
                        variant="outline"
                        size="sm"
                        className="premium-button"
                        onClick={async () => {
                          try {
                            await restoreReservation(reservation.id);
                            toast({
                              title: "Réservation restaurée",
                              description: `La réservation de ${reservation.customer.firstName} ${reservation.customer.lastName} est de nouveau active.`,
                            });
                          } catch {
                            toast({ title: "Erreur", description: "Impossible de restaurer la réservation", variant: "destructive" });
                          }
                        }}
                      >
                        Restaurer
                      </Button>
                    ) : (
                      <>
                        <Button 
                          variant={reservation.status === "show" ? "default" : "outline"}
                          size="sm" 
                          className="premium-button"
                          onClick={() => handleUpdateReservationStatus(reservation.id, reservation.status === "show" ? "confirmed" : "show")}
                        >
                          Présent
                        </Button>
                        <Button 
                          variant={reservation.status === "no_show" ? "destructive" : "outline"}
                          size="sm" 
                          className="premium-button"
                          onClick={() => handleUpdateReservationStatus(reservation.id, reservation.status === "no_show" ? "confirmed" : "no_show")}
                        >
                          Absent
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="premium-button"
                          onClick={() => handleUpdateReservationStatus(reservation.id, reservation.status === "cancelled" ? "confirmed" : "cancelled")}
                        >
                          {reservation.status === "cancelled" ? "Rétablir" : "Annuler"}
                        </Button>
                      </>
                    )}


                    {(() => {
                      const r = realtimeReservations.find(x => x.id === reservation.id);
                      if (!r) return null;
                      return (
                        <EditReservationDialog
                          reservation={{
                            id: r.id,
                            customerName: r.customerName,
                            customerPhone: r.customerPhone,
                            customerEmail: r.customerEmail,
                            reservationDate: r.reservationDate,
                            reservationTime: r.reservationTime,
                            guestsCount: r.guestsCount,
                            source: r.source,
                            notes: r.notes,
                          }}
                          onUpdated={refetch}
                        />
                      );
                    })()}
                    {role === 'admin' && (
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="text-destructive hover:bg-destructive hover:text-destructive-foreground border-destructive/50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Supprimer cette réservation ?</AlertDialogTitle>
                            <AlertDialogDescription>
                              Cette action est irréversible. La réservation de {reservation.customer.firstName} {reservation.customer.lastName} sera définitivement supprimée de la base de données et n'apparaîtra plus dans les rapports.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Annuler</AlertDialogCancel>
                            <AlertDialogAction
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              onClick={async () => {
                                try {
                                  await deleteReservation(reservation.id);
                                  toast({
                                    title: "Réservation supprimée",
                                    description: `La réservation de ${reservation.customer.firstName} ${reservation.customer.lastName} a été supprimée.`,
                                  });
                                } catch (error) {
                                  toast({
                                    title: "Erreur",
                                    description: "Impossible de supprimer la réservation",
                                    variant: "destructive",
                                  });
                                }
                              }}
                            >
                              Supprimer
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    )}
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </Card>
      </motion.div>
    </motion.div>
  );
}