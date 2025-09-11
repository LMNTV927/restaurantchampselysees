import { motion } from "framer-motion";
import { Calendar, Users, TrendingUp, Phone, Clock, MapPin, Activity, AlertTriangle } from "lucide-react";
import { KPICard } from "@/components/UI/KPICard";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StatusBadge } from "@/components/UI/StatusBadge";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts";
import { useRealtimeDashboard } from "@/hooks/useRealtimeDashboard";

export function DashboardSection() {
  const { dashboardData, loading } = useRealtimeDashboard();
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
            value={dashboardData.todayKPIs.reservations}
            icon={Calendar}
            trend={{ value: 5.2, isPositive: true }}
            loading={loading}
          />
        </motion.div>
        <motion.div variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}>
          <KPICard
            title="Couverts Aujourd'hui"
            value={dashboardData.todayKPIs.covers}
            icon={Users}
            trend={{ value: 12.8, isPositive: true }}
            loading={loading}
          />
        </motion.div>
        <motion.div variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}>
          <KPICard
            title="Taux d'Occupation"
            value={dashboardData.todayKPIs.occupancy}
            suffix="%"
            icon={MapPin}
            trend={{ value: 3.4, isPositive: true }}
            loading={loading}
          />
        </motion.div>
        <motion.div variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}>
          <KPICard
            title="Revenus du Jour"
            value={dashboardData.todayKPIs.revenue}
            suffix="€"
            icon={TrendingUp}
            trend={{ value: 8.7, isPositive: true }}
            loading={loading}
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
                    <AreaChart data={dashboardData.weeklyTrend}>
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
                    <LineChart data={dashboardData.weeklyTrend}>
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
            {dashboardData.recentActivity.map((activity, index) => (
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