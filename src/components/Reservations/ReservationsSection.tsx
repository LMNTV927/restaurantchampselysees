import { motion } from "framer-motion";
import { useState } from "react";
import { Calendar, Clock, Users, MapPin, History } from "lucide-react";
import { KPICard } from "@/components/UI/KPICard";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StatusBadge } from "@/components/UI/StatusBadge";
import { useToast } from "@/hooks/use-toast";
import { useRealtimeReservations } from "@/hooks/useRealtimeReservations";
import { AddReservationDialog } from "./AddReservationDialog";
import { getTodayInParis, getCurrentTimeInParis, getCurrentMonthInParis, createDateTimeInParis } from "@/lib/dateUtils";

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
  const { toast } = useToast();
  const { reservations: realtimeReservations, kpis, loading, updateReservationStatus, refetch } = useRealtimeReservations();

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
      source: reservation.channelName
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
        source: reservation.channelName,
        reservationDate: reservation.reservationDate, // Keep original date string
        reservationTime: reservation.reservationTime  // Keep original time string
      };
    });

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
      
      case "past":
        // Réservations passées du mois en cours seulement
        return reservationsWithOriginalData.filter(reservation => {
          // Vérifier que la réservation est dans le mois actuel
          const isCurrentMonth = reservation.reservationDate.startsWith(currentMonth);
          
          // Vérifier si la réservation est passée
          const isPast = reservation.reservationDate < todayString || 
                        (reservation.reservationDate === todayString && 
                         reservation.reservationTime < currentTime);
          
          return isCurrentMonth && isPast;
        }).sort((a, b) => {
          // Tri chronologique inverse (plus récentes en premier)
          if (a.reservationDate !== b.reservationDate) {
            return b.reservationDate.localeCompare(a.reservationDate);
          }
          return b.reservationTime.localeCompare(a.reservationTime);
        });
      
      default:
        return reservationsWithOriginalData;
    }
  };

  const reservations = getFilteredReservations();

  // Calculate KPIs based on filtered reservations
  const getFilteredKPIs = () => {
    const totalReservations = reservations.length;
    const totalCovers = reservations.reduce((sum, r) => sum + r.partySize, 0);
    
    // Restaurant capacity: 100 seats
    const restaurantCapacity = 100;
    const occupancyRate = Math.min(Math.round((totalCovers / restaurantCapacity) * 100), 100);

    return {
      totalReservations,
      totalCovers,
      occupancyRate
    };
  };

  const filteredKPIs = getFilteredKPIs();

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

  const getFilterTitle = () => {
    switch (selectedFilter) {
      case "today":
        return "Réservations d'aujourd'hui";
      case "upcoming":
        return "Réservations des 7 prochains jours";
      case "all":
        return "Réservations à venir";
      case "past":
        return "Réservations passées (ce mois)";
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
          occupancy: "Taux d'Occupation"
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
            trend={{ value: 5.2, isPositive: true }}
            loading={loading}
          />
        </motion.div>
        <motion.div variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}>
          <KPICard
            title={kpiTitles.covers}
            value={filteredKPIs.totalCovers}
            icon={Users}
            trend={{ value: 12.8, isPositive: true }}
            loading={loading}
          />
        </motion.div>
        <motion.div variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}>
          <KPICard
            title={kpiTitles.occupancy}
            value={filteredKPIs.occupancyRate}
            suffix="%"
            icon={MapPin}
            trend={{ value: 3.4, isPositive: true }}
            loading={loading}
          />
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
                        {reservation.startAt.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {reservation.startAt.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' })}
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
                      {reservation.notes && (
                        <p className="text-xs text-muted-foreground italic">
                          "{reservation.notes}"
                        </p>
                      )}
                      {reservation.source && (
                        <p className="text-xs text-primary">
                          via {reservation.source}
                        </p>
                      )}
                    </div>
                  </div>
                  
                  {selectedFilter !== "past" && (
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="premium-button"
                        onClick={() => handleUpdateReservationStatus(reservation.id, "show")}
                      >
                        Show
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="premium-button"
                        onClick={() => handleUpdateReservationStatus(reservation.id, "no_show")}
                      >
                        No-show
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="premium-button"
                        onClick={() => handleUpdateReservationStatus(reservation.id, "cancelled")}
                      >
                        Annuler
                      </Button>
                    </div>
                  )}
                </motion.div>
              ))
            )}
          </div>
        </Card>
      </motion.div>
    </motion.div>
  );
}