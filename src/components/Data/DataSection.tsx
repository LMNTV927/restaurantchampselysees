import { motion } from "framer-motion";
import { useState } from "react";
import { Download, Calendar, BarChart3, TrendingUp, Users, Target } from "lucide-react";
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
import { useRealtimeChannelsData } from "@/hooks/useRealtimeChannelsData";

export function DataSection() {
  const [selectedMonth, setSelectedMonth] = useState("2024-11");
  const { channels, kpis, loading } = useRealtimeChannelsData();

  const months = [
    { value: "2024-11", label: "Novembre 2024" },
    { value: "2024-10", label: "Octobre 2024" },
    { value: "2024-09", label: "Septembre 2024" },
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
          <Select value={selectedMonth} onValueChange={setSelectedMonth}>
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

      {/* Charts Placeholder */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
      >
        <Card className="premium-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-playfair font-semibold">Clics vs Réservations</h3>
            <Calendar className="h-5 w-5 text-muted-foreground" />
          </div>
          <div className="h-64 flex items-center justify-center bg-muted/10 rounded-xl">
            <div className="text-center space-y-2">
              <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto" />
              <p className="text-sm text-muted-foreground">
                Graphique à implémenter avec Recharts
              </p>
            </div>
          </div>
        </Card>

        <Card className="premium-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-playfair font-semibold">Couverts Cumulés</h3>
            <TrendingUp className="h-5 w-5 text-muted-foreground" />
          </div>
          <div className="h-64 flex items-center justify-center bg-muted/10 rounded-xl">
            <div className="text-center space-y-2">
              <TrendingUp className="h-12 w-12 text-muted-foreground mx-auto" />
              <p className="text-sm text-muted-foreground">
                Graphique ligne à implémenter
              </p>
            </div>
          </div>
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