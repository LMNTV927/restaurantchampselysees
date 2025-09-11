import { motion } from "framer-motion";
import { useState } from "react";
import { Plus, BarChart3, Users, Target, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { KPICard } from "@/components/UI/KPICard";
import { LinksTable } from "./LinksTable";
import { CreateLinkDialog } from "./CreateLinkDialog";

// Mock data for demonstration
const mockKPIs = {
  totalClicks: 2847,
  totalReservations: 156,
  totalCovers: 428,
  conversion: 14.7,
};

const mockLinks = [
  {
    id: "1",
    channel: "Instagram Bio",
    shortUrl: "/r/insta-bio",
    redirectUrl: "https://example.com/reservations",
    clicks: 1205,
    reservations: 67,
    covers: 189,
    conversion: 15.6,
    isActive: true,
    createdAt: new Date("2024-11-15"),
  },
  {
    id: "2", 
    channel: "Facebook Page",
    shortUrl: "/r/fb-page",
    redirectUrl: "https://example.com/reservations",
    clicks: 892,
    reservations: 43,
    covers: 124,
    conversion: 13.9,
    isActive: true,
    createdAt: new Date("2024-11-10"),
  },
  {
    id: "3",
    channel: "Google My Business",
    shortUrl: "/r/gmb",
    redirectUrl: "https://example.com/reservations",
    clicks: 750,
    reservations: 46,
    covers: 115,
    conversion: 15.3,
    isActive: true,
    createdAt: new Date("2024-11-08"),
  },
];

export function LinksSection() {
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [links, setLinks] = useState(mockLinks);

  const handleCreateLink = (data: { channel: string; redirectUrl: string }) => {
    const slug = data.channel.toLowerCase().replace(/\s+/g, '-');
    const newLink = {
      id: Date.now().toString(),
      channel: data.channel,
      shortUrl: `/r/${slug}`,
      redirectUrl: data.redirectUrl,
      clicks: 0,
      reservations: 0,
      covers: 0,
      conversion: 0,
      isActive: true,
      createdAt: new Date(),
    };
    setLinks([newLink, ...links]);
    setShowCreateDialog(false);
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
            Liens de tracking
          </h2>
          <p className="text-muted-foreground mt-1">
            Gérez vos liens de réservation et suivez les performances par canal
          </p>
        </div>
        <Button
          onClick={() => setShowCreateDialog(true)}
          className="premium-button bg-gradient-gold hover:shadow-gold text-charcoal font-semibold"
        >
          <Plus className="mr-2 h-4 w-4" />
          Nouveau lien
        </Button>
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
            title="Total Clics"
            value={mockKPIs.totalClicks}
            icon={BarChart3}
            trend={{ value: 12.5, isPositive: true }}
          />
        </motion.div>
        <motion.div variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}>
          <KPICard
            title="Réservations"
            value={mockKPIs.totalReservations}
            icon={Target}
            trend={{ value: 8.3, isPositive: true }}
          />
        </motion.div>
        <motion.div variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}>
          <KPICard
            title="Couverts"
            value={mockKPIs.totalCovers}
            icon={Users}
            trend={{ value: 15.7, isPositive: true }}
          />
        </motion.div>
        <motion.div variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}>
          <KPICard
            title="Conversion"
            value={mockKPIs.conversion}
            suffix="%"
            icon={TrendingUp}
            trend={{ value: 2.1, isPositive: true }}
          />
        </motion.div>
      </motion.div>

      {/* Links Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <LinksTable links={links} onLinksChange={setLinks} />
      </motion.div>

      {/* Create Link Dialog */}
      <CreateLinkDialog 
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        onSubmit={handleCreateLink}
      />
    </motion.div>
  );
}