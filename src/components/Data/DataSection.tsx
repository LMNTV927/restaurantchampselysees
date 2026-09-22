import { motion } from "framer-motion";
import React, { useState } from "react";
import { Download, Calendar, BarChart3, TrendingUp, Users, Target, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { KPICard } from "@/components/UI/KPICard";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { useRealtimeChannelsData } from "@/hooks/useRealtimeChannelsData";
import { useMonthlyData } from "@/hooks/useMonthlyData";
import { usePDFReport } from "@/hooks/usePDFReport";
import { getCurrentMonthInParis, getCurrentYearInParis } from "@/lib/dateUtils";
import { getChannelHsl } from "@/lib/channelColors";
import { toast } from "sonner";

export function DataSection() {
  const currentMonth = getCurrentMonthInParis();
  const [selectedMonth, setSelectedMonth] = useState(currentMonth);
  const { channels: currentChannels, kpis: currentKpis, loading: currentLoading } = useRealtimeChannelsData();
  const { data: monthlyData, loading: monthlyLoading } = useMonthlyData(selectedMonth);
  const { generateMonthlyReport } = usePDFReport();

  const isCurrentMonth = selectedMonth === currentMonth;
  const channels = monthlyData?.channels || currentChannels;
  const kpis = monthlyData?.kpis || currentKpis;
  const monthlyReservations = monthlyData?.reservations || [];
  const loading = isCurrentMonth ? currentLoading : monthlyLoading;

  // Configuration pour les graphiques
  const chartConfig = {
    clics: {
      label: "Clics",
      color: "hsl(var(--primary))",
    },
    reservations: {
      label: "Réservations",
      color: "hsl(var(--secondary))",
    },
    couverts: {
      label: "Couverts",
      color: "hsl(var(--accent))",
    },
  };

  // Couleurs uniques par canal pour le graphique en secteurs
  const getChannelColor = (name: string) => getChannelHsl(name);

  // Préparer les données pour les graphiques mensuels
  const getDailyData = () => {
    if (!monthlyReservations?.length) {
      // Créer des données vides pour tous les jours du mois
      const [year, month] = selectedMonth.split('-');
      const daysInMonth = new Date(parseInt(year), parseInt(month), 0).getDate();
      
      return Array.from({ length: daysInMonth }, (_, index) => ({
        day: index + 1,
        reservations: 0,
        covers: 0
      }));
    }
    
    // Grouper les réservations par jour
    const dailyData = new Map();
    const [year, month] = selectedMonth.split('-');
    const daysInMonth = new Date(parseInt(year), parseInt(month), 0).getDate();
    
    // Initialiser tous les jours avec 0
    for (let day = 1; day <= daysInMonth; day++) {
      dailyData.set(day, { day, reservations: 0, covers: 0 });
    }
    
    // Ajouter les données réelles
    monthlyReservations.forEach(reservation => {
      const reservationDate = new Date(reservation.reservation_date);
      const day = reservationDate.getDate();
      const existing = dailyData.get(day);
      if (existing) {
        existing.reservations += 1;
        existing.covers += reservation.guests_count || 0;
      }
    });
    
    return Array.from(dailyData.values());
  };

  const dailyData = getDailyData();

  const handleMonthChange = (month: string) => {
    setSelectedMonth(month);
  };

  const currentYear = getCurrentYearInParis();
  const months = [
    { value: `${currentYear}-09`, label: `Septembre ${currentYear}` },
    { value: `${currentYear}-08`, label: `Août ${currentYear}` },
    { value: `${currentYear}-07`, label: `Juillet ${currentYear}` },
    { value: `${currentYear}-06`, label: `Juin ${currentYear}` },
    { value: `${currentYear}-05`, label: `Mai ${currentYear}` },
    { value: `${currentYear}-04`, label: `Avril ${currentYear}` },
    { value: `${currentYear}-03`, label: `Mars ${currentYear}` },
    { value: `${currentYear}-02`, label: `Février ${currentYear}` },
    { value: `${currentYear}-01`, label: `Janvier ${currentYear}` },
  ];

  // Obtenir le nom du mois sélectionné
  const getSelectedMonthLabel = () => {
    const month = months.find(m => m.value === selectedMonth);
    return month ? month.label.split(' ')[0] : 'Septembre'; // Retourne juste le nom du mois
  };

  const handleExportCSV = () => {
    // Real CSV export with current data
    const csvContent = "data:text/csv;charset=utf-8," + 
      "Canal,Clics,Réservations,Couverts,Conversion\n" +
      channels.map(channel => 
        `${channel.name},${channel.clicks},${channel.reservations},${channel.covers},${Math.round(channel.conversion)}%`
      ).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `prince-palace-${selectedMonth}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleGeneratePDF = () => {
    // Créer une promesse pour la génération du PDF
    const generatePDFPromise = () => {
      return new Promise((resolve, reject) => {
        try {
          // Use current data for current month, monthly data for historical months
          const reportChannels = channels;
          const reportKpis = kpis;
          const reportReservations = monthlyReservations;
          
          const result = generateMonthlyReport(reportChannels, reportKpis, selectedMonth, reportReservations);
          
          if (result.success) {
            resolve(result.fileName);
          } else {
            reject(new Error(result.error || "Erreur inconnue"));
          }
        } catch (error) {
          reject(error);
        }
      });
    };
    
    // Utiliser toast.promise pour gérer automatiquement les états
    toast.promise(generatePDFPromise(), {
      loading: "Génération du rapport PDF...",
      success: (fileName) => `Rapport PDF généré: ${fileName}`,
      error: (error) => `Erreur: ${error.message}`,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-3 sm:space-y-6 lg:space-y-8"
    >
      {/* Header */}
      <div className="flex flex-col space-y-3 sm:space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
          <div className="text-center sm:text-left">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-playfair font-semibold text-foreground">
              Données & Analytics
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground mt-1">
              Vue d'ensemble des performances mensuelles et par canal
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
            <Select value={selectedMonth} onValueChange={handleMonthChange}>
              <SelectTrigger className="w-full sm:w-48 premium-input">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-popover/95 backdrop-blur-sm">
                {months.map((month) => (
                  <SelectItem key={month.value} value={month.value}>
                    {month.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <div className="flex gap-2">
              <Button 
                onClick={handleExportCSV}
                variant="outline" 
                className="premium-button flex-1 sm:flex-none"
                size="sm"
              >
                <Download className="mr-1 sm:mr-2 h-4 w-4" />
                <span className="hidden sm:inline">Export </span>CSV
              </Button>
              
              <Button 
                onClick={handleGeneratePDF}
                variant="default" 
                className="premium-button flex-1 sm:flex-none"
                size="sm"
              >
                <FileText className="mr-1 sm:mr-2 h-4 w-4" />
                <span className="hidden sm:inline">Rapport </span>PDF
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Monthly KPIs */}
      <motion.div 
        className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4 lg:gap-6"
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
            title="Clics Totaux"
            value={kpis.totalClicks}
            icon={BarChart3}
            trend={kpis.evolution?.clicksEvolution !== null && kpis.evolution?.clicksEvolution !== undefined ? 
              { value: kpis.evolution.clicksEvolution, isPositive: kpis.evolution.clicksEvolution >= 0 } : 
              undefined
            }
            loading={loading}
          />
        </motion.div>
        <motion.div variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}>
          <KPICard
            title="Réservations"
            value={kpis.totalReservations}
            icon={Target}
            trend={kpis.evolution?.reservationsEvolution !== null && kpis.evolution?.reservationsEvolution !== undefined ? 
              { value: kpis.evolution.reservationsEvolution, isPositive: kpis.evolution.reservationsEvolution >= 0 } : 
              undefined
            }
            loading={loading}
          />
        </motion.div>
        <motion.div variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}>
          <KPICard
            title="Couverts"
            value={kpis.totalCovers}
            icon={Users}
            trend={kpis.evolution?.coversEvolution !== null && kpis.evolution?.coversEvolution !== undefined ? 
              { value: kpis.evolution.coversEvolution, isPositive: kpis.evolution.coversEvolution >= 0 } : 
              undefined
            }
            loading={loading}
          />
        </motion.div>
        <motion.div variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}>
          <KPICard
            title="Conversion liens"
            value={kpis.conversion}
            suffix="%"
            icon={TrendingUp}
            trend={kpis.evolution?.conversionEvolution !== null && kpis.evolution?.conversionEvolution !== undefined ? 
              { value: kpis.evolution.conversionEvolution, isPositive: kpis.evolution.conversionEvolution >= 0 } : 
              undefined
            }
            loading={loading}
          />
        </motion.div>
      </motion.div>

      {/* Charts Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 lg:gap-6"
      >
        {/* Graphique Réservations mensuelles */}
        <Card className="premium-card p-3 sm:p-4 lg:p-6">
          <div className="flex items-center justify-between mb-3 sm:mb-4 lg:mb-6">
            <h3 className="text-sm sm:text-base lg:text-lg font-playfair font-semibold">Réservations de {getSelectedMonthLabel()}</h3>
            <Calendar className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
          </div>
          <ChartContainer config={chartConfig} className="h-40 sm:h-48 lg:h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={dailyData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis 
                  dataKey="day" 
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                  tick={{ fill: "hsl(var(--muted-foreground))" }}
                />
                <YAxis 
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                  tick={{ fill: "hsl(var(--muted-foreground))" }}
                />
                <ChartTooltip 
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-background/95 backdrop-blur-sm border border-border rounded-lg shadow-lg p-3">
                          <p className="font-semibold">Jour {label}</p>
                          <p className="text-sm text-muted-foreground">
                            Réservations: <span className="font-medium text-foreground">{payload[0]?.value}</span>
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="reservations" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={3}
                  dot={{ fill: "hsl(var(--primary))", strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, stroke: "hsl(var(--primary))", strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </Card>

        {/* Graphique Couverts mensuels */}
        <Card className="premium-card p-4 sm:p-6">
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <h3 className="text-base sm:text-lg font-playfair font-semibold">Couverts de {getSelectedMonthLabel()}</h3>
            <Users className="h-5 w-5 text-primary" />
          </div>
          <ChartContainer config={chartConfig} className="h-48 sm:h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={dailyData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis 
                  dataKey="day" 
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                  tick={{ fill: "hsl(var(--muted-foreground))" }}
                />
                <YAxis 
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                  tick={{ fill: "hsl(var(--muted-foreground))" }}
                />
                <ChartTooltip 
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-background/95 backdrop-blur-sm border border-border rounded-lg shadow-lg p-3">
                          <p className="font-semibold">Jour {label}</p>
                          <p className="text-sm text-muted-foreground">
                            Couverts: <span className="font-medium text-foreground">{payload[0]?.value}</span>
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="covers" 
                  stroke="hsl(var(--accent))" 
                  strokeWidth={3}
                  dot={{ fill: "hsl(var(--accent))", strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, stroke: "hsl(var(--accent))", strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </Card>
      </motion.div>

      {/* Graphique en secteurs - Distribution des Réservations */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <Card className="premium-card p-4 sm:p-6">
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <h3 className="text-base sm:text-lg font-playfair font-semibold">Répartition des Réservations par Canal</h3>
            <Target className="h-5 w-5 text-primary" />
          </div>
          <ChartContainer config={chartConfig} className="h-64 sm:h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={channels.filter(c => c.reservations > 0)}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value, percent }) => 
                    window.innerWidth < 640 ? `${(percent * 100).toFixed(0)}%` : `${name}: ${value} (${(percent * 100).toFixed(1)}%)`
                  }
                  outerRadius={window.innerWidth < 640 ? 80 : 120}
                  fill="#8884d8"
                  dataKey="reservations"
                  nameKey="name"
                >
                  {channels.filter(c => c.reservations > 0).map((entry) => (
                    <Cell key={`cell-${entry.id}`} fill={getChannelColor(entry.name)} />
                  ))}
                </Pie>
                <ChartTooltip 
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-background/95 backdrop-blur-sm border border-border rounded-lg shadow-lg p-3">
                          <p className="font-semibold">{data.name}</p>
                          <p className="text-sm text-muted-foreground">
                            Réservations: <span className="font-medium text-foreground">{data.reservations}</span>
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Couverts: <span className="font-medium text-foreground">{data.covers}</span>
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </ChartContainer>
        </Card>
      </motion.div>

      {/* Channel Performance Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <Card className="premium-card overflow-hidden">
          <div className="p-6 border-b border-border/50">
            <h3 className="text-lg font-playfair font-semibold">Performance par Canal</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Réservations et couverts réels du mois (par jour de venue), doublons exclus.
              Les clics et la conversion ne concernent que les liens de réservation suivis.
            </p>
          </div>
          
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-border/50">
                  <TableHead className="font-semibold">Canal</TableHead>
                  <TableHead className="font-semibold text-center">Clics</TableHead>
                  <TableHead className="font-semibold text-center">Réservations</TableHead>
                  <TableHead className="font-semibold text-center">Couverts</TableHead>
                  <TableHead className="font-semibold text-center">Conversion</TableHead>
                  <TableHead className="font-semibold">Lien</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {channels.map((channel, index) => (
                  <motion.tr
                    key={channel.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="hover:bg-muted/30 transition-colors"
                  >
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <span
                          className="inline-block w-3 h-3 rounded-full"
                          style={{ backgroundColor: getChannelColor(channel.name) }}
                          aria-hidden="true"
                        />
                        {channel.name}
                      </div>
                    </TableCell>
                    <TableCell className="text-center font-semibold">
                      {channel.slug ? channel.clicks.toLocaleString() : "—"}
                    </TableCell>
                    <TableCell className="text-center font-semibold">
                      {channel.reservations.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-center font-semibold">
                      {channel.covers.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-center">
                      <span className="font-semibold text-primary">
                        {channel.slug ? `${Math.round(channel.conversion)}%` : "—"}
                      </span>
                    </TableCell>
                    <TableCell>
                      {channel.shortUrl ? (
                        <code className="px-2 py-1 bg-muted/50 rounded text-sm font-mono">
                          {channel.shortUrl}
                        </code>
                      ) : (
                        <span className="text-sm text-muted-foreground">Hors lien de suivi</span>
                      )}
                    </TableCell>
                  </motion.tr>
                ))}
              </TableBody>
            </Table>
          </div>
        </Card>
      </motion.div>
    </motion.div>
  );
}