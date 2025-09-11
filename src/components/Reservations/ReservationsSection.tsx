import { motion } from "framer-motion";
import { useState } from "react";
import { Calendar, Clock, Users, MapPin } from "lucide-react";
import { KPICard } from "@/components/UI/KPICard";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StatusBadge } from "@/components/UI/StatusBadge";

// Mock data
const mockKPIs = {
  todayReservations: 24,
  todayCovers: 67,
  upcomingReservations: 156,
  occupancyRate: 78.5,
};

const mockReservations = [
  {
    id: "1",
    customer: { firstName: "Marie", lastName: "Dubois", phone: "+33 6•••••34" },
    startAt: new Date("2024-11-20T19:30:00"),
    partySize: 4,
    occasion: "Anniversaire",
    notes: "Table près de la fenêtre si possible",
    status: "confirmed" as const,
    source: "Instagram Bio"
  },
  {
    id: "2", 
    customer: { firstName: "Pierre", lastName: "Martin", phone: "+33 6•••••67" },
    startAt: new Date("2024-11-20T20:00:00"),
    partySize: 2,
    occasion: "Dîner romantique",
    notes: "",
    status: "show" as const,
    source: "Google My Business"
  },
  {
    id: "3",
    customer: { firstName: "Sophie", lastName: "Laurent", phone: "+33 6•••••89" },
    startAt: new Date("2024-11-20T20:30:00"),
    partySize: 6,
    occasion: "Dîner d'affaires",
    notes: "Demande une facture",
    status: "confirmed" as const,
    source: null
  }
];

export function ReservationsSection() {
  const [selectedFilter, setSelectedFilter] = useState("today");

  const filters = [
    { id: "today", label: "Aujourd'hui" },
    { id: "upcoming", label: "Prochains 7 jours" },
    { id: "all", label: "Tout à venir" },
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

      {/* KPI Cards */}
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
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
            title="Aujourd'hui"
            value={mockKPIs.todayReservations}
            suffix=" rés."
            icon={Calendar}
            trend={{ value: 5.2, isPositive: true }}
          />
        </motion.div>
        <motion.div variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}>
          <KPICard
            title="Couverts Aujourd'hui"
            value={mockKPIs.todayCovers}
            icon={Users}
            trend={{ value: 12.8, isPositive: true }}
          />
        </motion.div>
        <motion.div variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}>
          <KPICard
            title="À Venir"
            value={mockKPIs.upcomingReservations}
            suffix=" rés."
            icon={Clock}
          />
        </motion.div>
        <motion.div variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}>
          <KPICard
            title="Taux d'occupation"
            value={mockKPIs.occupancyRate}
            suffix="%"
            icon={MapPin}
            trend={{ value: 3.4, isPositive: true }}
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
            <h3 className="text-lg font-playfair font-semibold">Réservations du jour</h3>
            <p className="text-sm text-muted-foreground mt-1">
              {mockReservations.length} réservations • {mockReservations.reduce((sum, r) => sum + r.partySize, 0)} couverts
            </p>
          </div>
          
          <div className="p-6 space-y-4">
            {mockReservations.map((reservation, index) => (
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
                
                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button variant="outline" size="sm" className="premium-button">
                    Show
                  </Button>
                  <Button variant="outline" size="sm" className="premium-button">
                    No-show
                  </Button>
                  <Button variant="outline" size="sm" className="premium-button">
                    Éditer
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        </Card>
      </motion.div>
    </motion.div>
  );
}