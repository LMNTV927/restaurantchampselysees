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

// Mock data
const mockMonthlyKPIs = {
  totalClicks: 12847,
  totalReservations: 487,
  totalCovers: 1341,
  conversion: 16.8,
};

const mockChannelData = [
  {
    channel: "Instagram Bio",
    clicks: 4205,
    reservations: 187,
    covers: 524,
    conversion: 18.7,
    link: "/r/insta-bio"
  },
  {
    channel: "Facebook Page", 
    clicks: 3892,
    reservations: 143,
    covers: 398,
    conversion: 14.6,
    link: "/r/fb-page"
  },
  {
    channel: "Google My Business",
    clicks: 2750,
    reservations: 97,
    covers: 259,
    conversion: 17.1,
    link: "/r/gmb"
  },
  {
    channel: "Site web",
    clicks: 2000,
    reservations: 60,
    covers: 160,
    conversion: 12.0,
    link: "/r/website"
  }
];

export function DataSection() {
  const [selectedMonth, setSelectedMonth] = useState("2024-11");

  const months = [
    { value: "2024-11", label: "Novembre 2024" },
    { value: "2024-10", label: "Octobre 2024" },
    { value: "2024-09", label: "Septembre 2024" },
  ];

  const handleExportCSV = () => {
    // Mock CSV export
    const csvContent = "data:text/csv;charset=utf-8," + 
      "Canal,Clics,Réservations,Couverts,Conversion\n" +
      mockChannelData.map(row => 
        `${row.channel},${row.clicks},${row.reservations},${row.covers},${row.conversion}%`
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
            value={mockMonthlyKPIs.totalClicks}
            icon={BarChart3}
            trend={{ value: 18.5, isPositive: true }}
          />
        </motion.div>
        <motion.div variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}>
          <KPICard
            title="Réservations"
            value={mockMonthlyKPIs.totalReservations}
            icon={Target}
            trend={{ value: 14.2, isPositive: true }}
          />
        </motion.div>
        <motion.div variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}>
          <KPICard
            title="Couverts"
            value={mockMonthlyKPIs.totalCovers}
            icon={Users}
            trend={{ value: 22.1, isPositive: true }}
          />
        </motion.div>
        <motion.div variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}>
          <KPICard
            title="Conversion"
            value={mockMonthlyKPIs.conversion}
            suffix="%"
            icon={TrendingUp}
            trend={{ value: 4.7, isPositive: true }}
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
                {mockChannelData.map((row, index) => (
                  <motion.tr
                    key={row.channel}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="hover:bg-muted/30 transition-colors"
                  >
                    <TableCell className="font-medium">{row.channel}</TableCell>
                    <TableCell className="text-center font-semibold">
                      {row.clicks.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-center font-semibold">
                      {row.reservations.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-center font-semibold">
                      {row.covers.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-center">
                      <span className="font-semibold text-primary">
                        {row.conversion.toFixed(1)}%
                      </span>
                    </TableCell>
                    <TableCell>
                      <code className="px-2 py-1 bg-muted/50 rounded text-sm font-mono">
                        {row.link}
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