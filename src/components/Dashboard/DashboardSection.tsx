import { motion } from "framer-motion";
import { Calendar, Users, TrendingUp, Phone, Clock, MapPin, Activity, AlertTriangle } from "lucide-react";
import { KPICard } from "@/components/UI/KPICard";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StatusBadge } from "@/components/UI/StatusBadge";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts";

// Mock data pour le dashboard
const mockDashboardData = {
  todayKPIs: {
    reservations: 24,
    covers: 67,
    occupancy: 78.5,
    revenue: 3247
  },
  weeklyTrend: [
    { day: "Lun", reservations: 18, covers: 45 },
    { day: "Mar", reservations: 22, covers: 58 },
    { day: "Mer", reservations: 20, covers: 52 },
    { day: "Jeu", reservations: 26, covers: 71 },
    { day: "Ven", reservations: 32, covers: 89 },
    { day: "Sam", reservations: 28, covers: 76 },
    { day: "Dim", reservations: 24, covers: 67 }
  ],
  recentActivity: [
    {
      id: 1,
      type: "reservation",
      message: "Nouvelle réservation via Instagram Bio",
      customer: "Marie Dubois",
      time: "Il y a 2 minutes",
      status: "confirmed" as const
    },
    {
      id: 2,
      type: "click",
      message: "5 nouveaux clics sur le lien Google My Business",
      time: "Il y a 5 minutes"
    },
    {
      id: 3,
      type: "show",
      message: "Pierre Martin marqué comme présent",
      time: "Il y a 8 minutes",
      status: "show" as const
    },
    {
      id: 4,
      type: "reservation",
      message: "Réservation modifiée pour 6 personnes",
      customer: "Sophie Laurent",
      time: "Il y a 15 minutes",
      status: "confirmed" as const
    }
  ],
  alerts: [
    {
      id: 1,
      type: "warning",
      message: "Pic d'affluence prévu ce soir (32 réservations)",
      priority: "high"
    },
    {
      id: 2,
      type: "info",
      message: "3 réservations en attente de confirmation",
      priority: "medium"
    }
  ]
};

export function DashboardSection() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      {/* Header */}
      <div>
        <h2 className="text-3xl font-playfair font-semibold text-foreground">
          Dashboard
        </h2>
        <p className="text-muted-foreground mt-1">
          Vue d'ensemble de l'activité du Prince Palace
        </p>
      </div>

      {/* Alertes */}
      {mockDashboardData.alerts.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="grid gap-4"
        >
          {mockDashboardData.alerts.map((alert) => (
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
            title="Réservations Aujourd'hui"
            value={mockDashboardData.todayKPIs.reservations}
            icon={Calendar}
            trend={{ value: 5.2, isPositive: true }}
          />
        </motion.div>
        <motion.div variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}>
          <KPICard
            title="Couverts Aujourd'hui"
            value={mockDashboardData.todayKPIs.covers}
            icon={Users}
            trend={{ value: 12.8, isPositive: true }}
          />
        </motion.div>
        <motion.div variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}>
          <KPICard
            title="Taux d'Occupation"
            value={mockDashboardData.todayKPIs.occupancy}
            suffix="%"
            icon={MapPin}
            trend={{ value: 3.4, isPositive: true }}
          />
        </motion.div>
        <motion.div variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}>
          <KPICard
            title="Revenus du Jour"
            value={mockDashboardData.todayKPIs.revenue}
            suffix="€"
            icon={TrendingUp}
            trend={{ value: 8.7, isPositive: true }}
          />
        </motion.div>
      </motion.div>

      {/* Graphiques */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Tendance des réservations */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card className="premium-card">
            <div className="p-6">
              <h3 className="text-lg font-playfair font-semibold mb-4">
                Réservations de la Semaine
              </h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={mockDashboardData.weeklyTrend}>
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
            <div className="p-6">
              <h3 className="text-lg font-playfair font-semibold mb-4">
                Couverts de la Semaine
              </h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={mockDashboardData.weeklyTrend}>
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

      {/* Activité récente */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <Card className="premium-card">
          <div className="p-6 border-b border-border/50">
            <div className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-playfair font-semibold">
                Activité Récente
              </h3>
            </div>
          </div>
          
          <div className="p-6 space-y-4">
            {mockDashboardData.recentActivity.map((activity, index) => (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="flex items-center justify-between p-4 bg-muted/20 rounded-2xl hover:bg-muted/30 transition-all duration-300"
              >
                <div className="flex items-center gap-4">
                  <div className={`p-2 rounded-xl ${
                    activity.type === 'reservation' ? 'bg-primary/20' :
                    activity.type === 'click' ? 'bg-blue-500/20' :
                    'bg-success/20'
                  }`}>
                    {activity.type === 'reservation' && <Calendar className="h-4 w-4 text-primary" />}
                    {activity.type === 'click' && <Phone className="h-4 w-4 text-blue-500" />}
                    {activity.type === 'show' && <Users className="h-4 w-4 text-success" />}
                  </div>
                  
                  <div className="space-y-1">
                    <p className="font-medium text-foreground">
                      {activity.message}
                    </p>
                    {activity.customer && (
                      <p className="text-sm text-muted-foreground">
                        {activity.customer}
                      </p>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  {activity.status && (
                    <StatusBadge status={activity.status} />
                  )}
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    {activity.time}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </Card>
      </motion.div>
    </motion.div>
  );
}