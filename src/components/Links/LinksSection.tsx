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
import { useRealtimeChannelsData, type ChannelData } from "@/hooks/useRealtimeChannelsData";
import { getBookingPath, getBookingUrl } from "@/lib/bookingLinks";

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

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/** Canal réel (vrai lien de tracking), pas un canal dérivé d'une source/campagne */
const isRealChannel = (channel: ChannelData): boolean =>
  !!channel.slug && !channel.id.startsWith('source:') && UUID_REGEX.test(channel.id);


export function LinksSection() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const { toast } = useToast();
  const { channels, kpis, loading, refetch } = useRealtimeChannelsData();

  // Transform channels data to match Link interface (canaux réels uniquement)
  const links: Link[] = channels.filter(isRealChannel).map(channel => ({
    id: channel.id,
    channel: channel.name,
    shortUrl: getBookingPath(channel.slug),
    redirectUrl: getBookingUrl(channel.slug),
    clicks: channel.clicks,
    reservations: channel.reservations,
    covers: channel.covers,
    conversion: channel.conversion,
    isActive: channel.isActive,
    createdAt: new Date(), // We don't have creation date in the hook yet
  }));

  const handleCreateLink = async (data: { channel: string; adsCampaign?: 'pmax' | 'search' | null }) => {
    try {
      // Slug imposé pour les canaux de campagne Google Ads
      const campaignSlug =
        data.adsCampaign === 'pmax'
          ? 'google-ads-pmax'
          : data.adsCampaign === 'search'
            ? 'google-ads-search'
            : null;

      const slug =
        campaignSlug ||
        data.channel
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
      className="space-y-3 sm:space-y-6 lg:space-y-8"
    >
      {/* Header */}
      <div className="flex flex-col space-y-3 sm:space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
          <div className="text-center sm:text-left">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-playfair font-semibold text-foreground">
              Liens de tracking
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground mt-1">
              Créez et suivez les performances de vos liens de réservation
            </p>
          </div>
          <Button 
            onClick={() => setIsCreateDialogOpen(true)}
            className="premium-button flex-shrink-0 w-full sm:w-auto"
          >
            <ExternalLink className="mr-2 h-4 w-4" />
            Nouveau lien
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
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
            icon={MousePointer}
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
            icon={Calendar}
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
            title="Conversion"
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