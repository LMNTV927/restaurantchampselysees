import { useState } from "react";
import { motion } from "framer-motion";
import { Calendar, Users, Clock, MapPin, Activity, AlertTriangle, CalendarClock } from "lucide-react";
import { KPICard } from "@/components/UI/KPICard";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StatusBadge } from "@/components/UI/StatusBadge";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts";
import { useRealtimeDashboard } from "@/hooks/useRealtimeDashboard";
import { useReservationsTaken } from "@/hooks/useReservationsTaken";
import { useUpcomingReservations } from "@/hooks/useUpcomingReservations";
import { getTodayInParis, getCurrentMonthNameInParis } from "@/lib/dateUtils";

const formatShortDay = (date: string): string =>
  new Intl.DateTimeFormat("fr-FR", {
    weekday: "short",
    day: "numeric",
    month: "short",
  }).format(new Date(`${date}T12:00:00`));

const formatTakenTime = (createdAt: string): string =>
  new Intl.DateTimeFormat("fr-FR", {
    timeZone: "Europe/Paris",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(new Date(createdAt));

const formatForDay = (date: string, time: string): string => {
  const hasTime = /^\d{2}:\d{2}/.test(time ?? "");
  const d = new Date(`${date}T${hasTime ? time.slice(0, 5) : "12:00"}`);
  if (isNaN(d.getTime())) return `${date}${time ? ` à ${time}` : ""}`;
  const dayLabel = new Intl.DateTimeFormat("fr-FR", {
    weekday: "short",
    day: "numeric",
    month: "short",
  }).format(d);
  return hasTime ? `${dayLabel} à ${time.slice(0, 5)}` : `${dayLabel} · heure ${time || "à confirmer"}`;
};

export function DashboardSection() {
  const { dashboardData, loading } = useRealtimeDashboard();
  const currentMonthName = getCurrentMonthNameInParis();
  const today = getTodayInParis();
  const [takenDay, setTakenDay] = useState(today);
  const { reservations: takenReservations, count: takenCount, loading: takenLoading } = useReservationsTaken(takenDay);
  const [upcomingDay, setUpcomingDay] = useState(today);
  const { reservations: upcomingReservations, count: upcomingCount, covers: upcomingCovers, next7, loading: upcomingLoading } = useUpcomingReservations(upcomingDay);
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-4 sm:space-y-8"
    >
      {/* Header */}
      <div>
        <h2 className="text-2xl sm:text-3xl font-playfair font-semibold text-foreground">
          Dashboard
        </h2>
        <p className="text-muted-foreground mt-1">
          Vue d'ensemble de l'activité du Prince Palace
        </p>
      </div>

      {/* Alertes */}
      {dashboardData.alerts.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="grid gap-4"
        >
          {dashboardData.alerts.map((alert) => (
            <Card key={alert.id} className="premium-card border-l-4 border-l-primary">
              <div className="p-4 flex items-center gap-3">
                <AlertTriangle className="h-5 w-5 text-primary" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">
                    {alert.message}
                  </p>
                </div>
                <Badge variant={alert.priority === "high" ? "destructive" : "secondary"}>
                  {alert.priority === "high" ? "Urgent" : "Info"}
                </Badge>
              </div>
            </Card>
          ))}
        </motion.div>
      )}

        {/* KPI Cards */}
        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4 lg:gap-6"
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
            title="Réservations Aujourd'hui"
            value={dashboardData.todayKPIs.reservations}
            icon={Calendar}
            trend={dashboardData.todayKPIs.evolution?.reservationsEvolution !== null && dashboardData.todayKPIs.evolution?.reservationsEvolution !== undefined ? 
              { value: dashboardData.todayKPIs.evolution.reservationsEvolution, isPositive: dashboardData.todayKPIs.evolution.reservationsEvolution >= 0 } : 
              undefined
            }
            loading={loading}
          />
        </motion.div>
        <motion.div variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}>
          <KPICard
            title="Couverts Aujourd'hui"
            value={dashboardData.todayKPIs.covers}
            icon={Users}
            trend={dashboardData.todayKPIs.evolution?.coversEvolution !== null && dashboardData.todayKPIs.evolution?.coversEvolution !== undefined ? 
              { value: dashboardData.todayKPIs.evolution.coversEvolution, isPositive: dashboardData.todayKPIs.evolution.coversEvolution >= 0 } : 
              undefined
            }
            loading={loading}
          />
        </motion.div>
        <motion.div variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}>
          <KPICard
            title="Taux d'Occupation"
            value={dashboardData.todayKPIs.occupancy}
            suffix="%"
            icon={MapPin}
            trend={dashboardData.todayKPIs.evolution?.occupancyEvolution !== null && dashboardData.todayKPIs.evolution?.occupancyEvolution !== undefined ? 
              { value: dashboardData.todayKPIs.evolution.occupancyEvolution, isPositive: dashboardData.todayKPIs.evolution.occupancyEvolution >= 0 } : 
              undefined
            }
            loading={loading}
          />
        </motion.div>
      </motion.div>

        {/* Graphiques */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 lg:gap-6">
        {/* Tendance des réservations */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card className="premium-card">
            <div className="p-3 sm:p-4 lg:p-6">
              <h3 className="text-sm sm:text-base lg:text-lg font-playfair font-semibold mb-3 sm:mb-4">
                Réservations de {currentMonthName}
              </h3>
                <div className="h-40 sm:h-48 lg:h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={dashboardData.monthlyTrend}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis 
                      dataKey="day" 
                      className="text-xs fill-muted-foreground"
                    />
                    <YAxis className="text-xs fill-muted-foreground" />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '12px',
                        color: 'hsl(var(--foreground))'
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="reservations"
                      stroke="hsl(var(--primary))"
                      fill="hsl(var(--primary) / 0.2)"
                      strokeWidth={2}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Tendance des couverts */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Card className="premium-card">
            <div className="p-3 sm:p-4 lg:p-6">
              <h3 className="text-sm sm:text-base lg:text-lg font-playfair font-semibold mb-3 sm:mb-4">
                Couverts de {currentMonthName}
              </h3>
                <div className="h-40 sm:h-48 lg:h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={dashboardData.monthlyTrend}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis 
                      dataKey="day" 
                      className="text-xs fill-muted-foreground"
                    />
                    <YAxis className="text-xs fill-muted-foreground" />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '12px',
                        color: 'hsl(var(--foreground))'
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="covers"
                      stroke="hsl(var(--primary))"
                      strokeWidth={3}
                      dot={{ fill: 'hsl(var(--primary))', r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Réservations prises */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <Card className="premium-card">
          <div className="p-3 sm:p-4 lg:p-6 border-b border-border/50">
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              <Activity className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
              <h3 className="text-sm sm:text-base lg:text-lg font-playfair font-semibold">
                Réservations prises
              </h3>
              <div className="flex items-center gap-2 ml-auto">
                <input
                  type="date"
                  value={takenDay}
                  onChange={(e) => setTakenDay(e.target.value || getTodayInParis())}
                  className="h-9 rounded-md border border-border bg-background px-2 text-xs sm:text-sm text-foreground"
                  aria-label="Choisir le jour"
                />
                {takenDay !== today && (
                  <button
                    type="button"
                    onClick={() => setTakenDay(today)}
                    className="h-9 rounded-md border border-border px-2.5 text-xs sm:text-sm text-muted-foreground hover:text-foreground hover:bg-muted/30 transition-colors"
                  >
                    Aujourd'hui
                  </button>
                )}
              </div>
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              {takenLoading
                ? "Chargement…"
                : takenCount === 0
                  ? "Aucune réservation prise"
                  : takenCount === 1
                    ? "1 réservation prise"
                    : `${takenCount} réservations prises`}
            </p>
          </div>

          <div className="p-3 sm:p-4 lg:p-6 space-y-2 sm:space-y-3">
            {takenReservations.map((r) => (
              <div
                key={r.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4 p-4 bg-muted/20 rounded-2xl hover:bg-muted/30 transition-all duration-300"
              >
                <div className="flex items-start sm:items-center gap-3 min-w-0">
                  <div className="flex items-center gap-1 text-xs text-muted-foreground shrink-0">
                    <Clock className="h-3 w-3" />
                    {formatTakenTime(r.createdAt)}
                  </div>
                  <div className="space-y-0.5 min-w-0">
                    <p className="font-medium text-foreground truncate">
                      {r.customerName} · {r.guestsCount} couvert{r.guestsCount > 1 ? "s" : ""}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      pour le {formatForDay(r.reservationDate, r.reservationTime)}
                      {r.channelName ? ` · via ${r.channelName}` : " · via Web"}
                    </p>
                  </div>
                </div>
                <div className="shrink-0">
                  <StatusBadge status={r.status} />
                </div>
              </div>
            ))}
            {!takenLoading && takenReservations.length === 0 && (
              <p className="text-sm text-muted-foreground py-2">Aucune réservation prise ce jour-là</p>
            )}
          </div>
        </Card>
      </motion.div>

      {/* Réservations à venir */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <Card className="premium-card">
          <div className="p-3 sm:p-4 lg:p-6 border-b border-border/50">
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              <CalendarClock className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
              <h3 className="text-sm sm:text-base lg:text-lg font-playfair font-semibold">
                Réservations à venir
              </h3>
              <div className="flex items-center gap-2 ml-auto">
                <input
                  type="date"
                  value={upcomingDay}
                  min={today}
                  onChange={(e) => setUpcomingDay(e.target.value || today)}
                  className="h-9 rounded-md border border-border bg-background px-2 text-xs sm:text-sm text-foreground"
                  aria-label="Choisir le jour à venir"
                />
                {upcomingDay !== today && (
                  <button
                    type="button"
                    onClick={() => setUpcomingDay(today)}
                    className="h-9 rounded-md border border-border px-2.5 text-xs sm:text-sm text-muted-foreground hover:text-foreground hover:bg-muted/30 transition-colors"
                  >
                    Aujourd'hui
                  </button>
                )}
              </div>
            </div>

            {/* Aperçu rapide des 7 prochains jours */}
            <div className="flex gap-2 overflow-x-auto mt-4 pb-1">
              {next7.map((d) => {
                const isActive = d.date === upcomingDay;
                return (
                  <button
                    key={d.date}
                    type="button"
                    onClick={() => setUpcomingDay(d.date)}
                    className={`shrink-0 rounded-xl border px-3 py-2 text-left transition-colors ${
                      isActive
                        ? "border-primary bg-primary/10"
                        : "border-border hover:bg-muted/30"
                    }`}
                  >
                    <p className="text-[11px] uppercase tracking-wide text-muted-foreground">
                      {d.date === today ? "Aujourd'hui" : formatShortDay(d.date)}
                    </p>
                    <p className="text-sm font-semibold text-foreground">
                      {d.count} résa{d.count > 1 ? "s" : ""} · {d.covers} cv.
                    </p>
                  </button>
                );
              })}
            </div>

            <p className="text-sm text-muted-foreground mt-3">
              {upcomingLoading
                ? "Chargement…"
                : upcomingCount === 0
                  ? `Aucune réservation prévue le ${formatShortDay(upcomingDay)}`
                  : `${upcomingCount} réservation${upcomingCount > 1 ? "s" : ""} · ${upcomingCovers} couvert${upcomingCovers > 1 ? "s" : ""} prévu${upcomingCovers > 1 ? "s" : ""} le ${formatShortDay(upcomingDay)}`}
            </p>
          </div>

          <div className="p-3 sm:p-4 lg:p-6 space-y-2 sm:space-y-3">
            {upcomingReservations.map((r) => (
              <div
                key={r.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4 p-4 bg-muted/20 rounded-2xl hover:bg-muted/30 transition-all duration-300"
              >
                <div className="flex items-start sm:items-center gap-3 min-w-0">
                  <div className="flex items-center gap-1 text-xs text-muted-foreground shrink-0">
                    <Clock className="h-3 w-3" />
                    {r.reservationTime.slice(0, 5)}
                  </div>
                  <div className="space-y-0.5 min-w-0">
                    <p className="font-medium text-foreground truncate">
                      {r.customerName} · {r.guestsCount} couvert{r.guestsCount > 1 ? "s" : ""}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {r.channelName ? `via ${r.channelName}` : "via Web"}
                      {r.notes ? ` · ${r.notes}` : ""}
                    </p>
                  </div>
                </div>
                <div className="shrink-0">
                  <StatusBadge status={r.status} />
                </div>
              </div>
            ))}
            {!upcomingLoading && upcomingReservations.length === 0 && (
              <p className="text-sm text-muted-foreground py-2">Aucune réservation à venir ce jour-là</p>
            )}
          </div>
        </Card>
      </motion.div>
    </motion.div>
  );
}