import { useState } from "react";
import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { KPICard } from "@/components/UI/KPICard";
import { LinksTable } from "./LinksTable";
import { CreateLinkDialog } from "./CreateLinkDialog";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { TrendingUp, MousePointer, Calendar, Users } from "lucide-react";
import { useRealtimeChannelsData, ChannelData } from "@/hooks/useRealtimeChannelsData";

interface Link {
  id: string;
  channel: string;
  shortUrl: string;
  redirectUrl: string;
  clicks: number;
  reservations: number;
  covers: number;
  conversion: number;
  isActive: boolean;
  createdAt: Date;
}

export function LinksSection() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const { toast } = useToast();
  const { channels, kpis, loading, refetch } = useRealtimeChannelsData();

  // Transform channels data to match Link interface
  const links: Link[] = channels.map(channel => ({
    id: channel.id,
    channel: channel.name,
    shortUrl: `/book/${channel.slug}`,
    redirectUrl: `${window.location.origin}/book/${channel.slug}`,
    clicks: channel.clicks,
    reservations: channel.reservations,
    covers: channel.covers,
    conversion: channel.conversion,
    isActive: channel.isActive,
    createdAt: new Date() // We don't have creation date in the hook yet
  }));

  const handleCreateLink = async (data: { channel: string }) => {
    try {
      // Generate a URL-friendly slug from the channel name
      const slug = data.channel
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');

      const { error } = await supabase
        .from('channels')
        .insert({
          name: data.channel,
          slug,
          description: '',
          is_active: true
        });

      if (error) {
        console.error('Error creating channel:', error);
        toast({
          title: "Erreur",
          description: "Impossible de créer le nouveau lien",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Lien créé",
        description: `Le lien de tracking "${data.channel}" a été créé avec succès`,
      });

      setIsCreateDialogOpen(false);
      
      // Refresh data after successful creation
      refetch();

    } catch (error) {
      console.error('Unexpected error:', error);
      toast({
        title: "Erreur",
        description: "Une erreur inattendue s'est produite",
        variant: "destructive",
      });
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
            Liens de tracking
          </h2>
          <p className="text-muted-foreground mt-1">
            Créez et suivez les performances de vos liens de réservation
          </p>
        </div>
        <Button 
          onClick={() => setIsCreateDialogOpen(true)}
          className="premium-button"
        >
          <ExternalLink className="mr-2 h-4 w-4" />
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
            title="Clics Totaux"
            value={kpis.totalClicks}
            icon={MousePointer}
            trend={{ value: 18.2, isPositive: true }}
            loading={loading}
          />
        </motion.div>
        <motion.div variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}>
          <KPICard
            title="Réservations"
            value={kpis.totalReservations}
            icon={Calendar}
            trend={{ value: 12.7, isPositive: true }}
            loading={loading}
          />
        </motion.div>
        <motion.div variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}>
          <KPICard
            title="Couverts"
            value={kpis.totalCovers}
            icon={Users}
            trend={{ value: 15.4, isPositive: true }}
            loading={loading}
          />
        </motion.div>
        <motion.div variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}>
          <KPICard
            title="Conversion"
            value={kpis.conversion}
            suffix="%"
            icon={TrendingUp}
            trend={{ value: 2.1, isPositive: true }}
            loading={loading}
          />
        </motion.div>
      </motion.div>

      {/* Links Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="text-muted-foreground mt-2">Chargement des liens...</p>
          </div>
        ) : (
          <LinksTable 
            links={links} 
            onLinksChange={(updatedLinks) => {
              // Since we're using real-time data, we just trigger a refetch
              refetch();
            }}
          />
        )}
      </motion.div>

      {/* Create Link Dialog */}
      <CreateLinkDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onSubmit={handleCreateLink}
      />
    </motion.div>
  );
}