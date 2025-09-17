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
import { toast } from "sonner";

export function DataSection() {
  const currentMonth = getCurrentMonthInParis(); // Format: "2025-09"
  const [selectedMonth, setSelectedMonth] = useState(currentMonth);
  const [monthlyChannels, setMonthlyChannels] = useState<any[]>([]);
  const [monthlyKpis, setMonthlyKpis] = useState<any>({
    totalClicks: 0,
    totalReservations: 0,
    totalCovers: 0,
    conversion: 0
  });
  const [monthlyReservations, setMonthlyReservations] = useState<any[]>([]);
  const { channels: currentChannels, kpis: currentKpis, loading: currentLoading } = useRealtimeChannelsData();
  const { fetchMonthlyData, loading: monthlyLoading } = useMonthlyData();
  const { generateMonthlyReport } = usePDFReport();

  // Use monthly data for historical months, current data for current month  
  const isCurrentMonth = selectedMonth === currentMonth;
  
  // For September 2025 (current month), we need to fetch data properly since useRealtimeChannelsData might not have all historical data
  const channels = monthlyChannels.length > 0 ? monthlyChannels : currentChannels;
  const kpis = Object.keys(monthlyKpis).length > 1 ? monthlyKpis : currentKpis;
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

  // Couleurs pour le graphique en secteurs
  const COLORS = ['hsl(var(--primary))', 'hsl(var(--secondary))', 'hsl(var(--accent))', 'hsl(var(--muted))'];

  // Préparer les données pour les graphiques
  const barChartData = channels.map(channel => ({
    name: channel.name.length > 15 ? channel.name.substring(0, 15) + '...' : channel.name,
    clics: channel.clicks,
    reservations: channel.reservations,
  }));

  // Simuler des données temporelles pour le graphique linéaire (progression des couverts)
  const lineChartData = channels.map((channel, index) => ({
    name: channel.name.length > 10 ? channel.name.substring(0, 10) + '...' : channel.name,
    couverts: channel.covers,
    cumulé: channels.slice(0, index + 1).reduce((acc, c) => acc + c.covers, 0),
  }));

  // Load monthly data when month changes or on component mount
  const loadMonthlyData = async (month: string) => {
    try {
      const data = await fetchMonthlyData(month);
      setMonthlyChannels(data.channels);
      setMonthlyKpis(data.kpis);
      setMonthlyReservations(data.reservations);
    } catch (error) {
      toast.error("Erreur lors du chargement des données du mois");
      console.error("Monthly data loading error:", error);
    }
  };

  const handleMonthChange = (month: string) => {
    setSelectedMonth(month);
    loadMonthlyData(month);
  };

  // Load data for current month on mount
  React.useEffect(() => {
    loadMonthlyData(selectedMonth);
  }, []);

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

  const handleExportCSV = () => {
    // Real CSV export with current data
    const csvContent = "data:text/csv;charset=utf-8," + 
      "Canal,Clics,Réservations,Couverts,Conversion\n" +
      channels.map(channel => 
        `${channel.name},${channel.clicks},${channel.reservations},${channel.covers},${channel.conversion.toFixed(1)}%`
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
    const loadingToast = toast.loading("Génération du rapport PDF...");
    
    try {
      // Use current data for current month, monthly data for historical months
      const reportChannels = channels;
      const reportKpis = kpis;
      const reportReservations = monthlyReservations;
      
      const result = generateMonthlyReport(reportChannels, reportKpis, selectedMonth, reportReservations);
      
      toast.dismiss(loadingToast);
      
      if (result.success) {
        toast.success(`Rapport PDF généré: ${result.fileName}`);
      } else {
        toast.error(`Erreur: ${result.error}`);
      }
    } catch (error) {
      toast.dismiss(loadingToast);
      toast.error("Erreur lors de la génération du PDF");
      console.error("PDF generation error:", error);
    }
  };

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
            Données & Analytics
          </h2>
          <p className="text-muted-foreground mt-1">
            Vue d'ensemble des performances mensuelles et par canal
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <Select value={selectedMonth} onValueChange={handleMonthChange}>
            <SelectTrigger className="w-48 premium-input">
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
          
          <Button 
            onClick={handleExportCSV}
            variant="outline" 
            className="premium-button"
          >
            <Download className="mr-2 h-4 w-4" />
            Export CSV
          </Button>
          
          <Button 
            onClick={handleGeneratePDF}
            variant="default" 
            className="premium-button"
          >
            <FileText className="mr-2 h-4 w-4" />
            Rapport PDF
          </Button>
        </div>
      </div>

      {/* Monthly KPIs */}
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
            title="Clics Totaux"
            value={kpis.totalClicks}
            icon={BarChart3}
            trend={{ value: 18.5, isPositive: true }}
            loading={loading}
          />
        </motion.div>
        <motion.div variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}>
          <KPICard
            title="Réservations"
            value={kpis.totalReservations}
            icon={Target}
            trend={{ value: 14.2, isPositive: true }}
            loading={loading}
          />
        </motion.div>
        <motion.div variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}>
          <KPICard
            title="Couverts"
            value={kpis.totalCovers}
            icon={Users}
            trend={{ value: 22.1, isPositive: true }}
            loading={loading}
          />
        </motion.div>
        <motion.div variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}>
          <KPICard
            title="Conversion"
            value={kpis.conversion}
            suffix="%"
            icon={TrendingUp}
            trend={{ value: 4.7, isPositive: true }}
            loading={loading}
          />
        </motion.div>
      </motion.div>

      {/* Charts Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
      >
        {/* Graphique en barres - Clics vs Réservations */}
        <Card className="premium-card p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-playfair font-semibold">Clics vs Réservations</h3>
            <BarChart3 className="h-5 w-5 text-primary" />
          </div>
          <ChartContainer config={chartConfig} className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barChartData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis 
                  dataKey="name" 
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                  tick={{ fill: "hsl(var(--muted-foreground))" }}
                />
                <YAxis 
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                  tick={{ fill: "hsl(var(--muted-foreground))" }}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <ChartLegend content={<ChartLegendContent />} />
                <Bar dataKey="clics" fill="var(--color-clics)" radius={4} />
                <Bar dataKey="reservations" fill="var(--color-reservations)" radius={4} />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </Card>

        {/* Graphique en ligne - Couverts par Canal */}
        <Card className="premium-card p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-playfair font-semibold">Couverts par Canal</h3>
            <TrendingUp className="h-5 w-5 text-primary" />
          </div>
          <ChartContainer config={chartConfig} className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={lineChartData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis 
                  dataKey="name" 
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                  tick={{ fill: "hsl(var(--muted-foreground))" }}
                />
                <YAxis 
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                  tick={{ fill: "hsl(var(--muted-foreground))" }}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line 
                  type="monotone" 
                  dataKey="couverts" 
                  stroke="var(--color-couverts)" 
                  strokeWidth={3}
                  dot={{ fill: "var(--color-couverts)", strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, stroke: "var(--color-couverts)", strokeWidth: 2 }}
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
        <Card className="premium-card p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-playfair font-semibold">Répartition des Réservations par Canal</h3>
            <Target className="h-5 w-5 text-primary" />
          </div>
          <ChartContainer config={chartConfig} className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={channels.filter(c => c.reservations > 0)}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value, percent }) => 
                    `${name}: ${value} (${(percent * 100).toFixed(1)}%)`
                  }
                  outerRadius={120}
                  fill="#8884d8"
                  dataKey="reservations"
                  nameKey="name"
                >
                  {channels.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
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
              Analyse détaillée des conversions pour chaque canal de tracking
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
                    <TableCell className="font-medium">{channel.name}</TableCell>
                    <TableCell className="text-center font-semibold">
                      {channel.clicks.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-center font-semibold">
                      {channel.reservations.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-center font-semibold">
                      {channel.covers.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-center">
                      <span className="font-semibold text-primary">
                        {channel.conversion.toFixed(1)}%
                      </span>
                    </TableCell>
                    <TableCell>
                      <code className="px-2 py-1 bg-muted/50 rounded text-sm font-mono">
                        {channel.shortUrl}
                      </code>
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