import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { Plus, BarChart3, Users, Target, TrendingUp, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { KPICard } from "@/components/UI/KPICard";
import { LinksTable } from "./LinksTable";
import { CreateLinkDialog } from "./CreateLinkDialog";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

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
  const [links, setLinks] = useState<any[]>([]);
  const [kpis, setKpis] = useState(mockKPIs);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchChannelsAndStats();
  }, []);

  const fetchChannelsAndStats = async () => {
    try {
      // Fetch channels with their stats
      const { data: channelsData, error: channelsError } = await supabase
        .from('channels')
        .select(`
          *,
          channel_stats (
            clicks,
            reservations,
            total_covers,
            date
          )
        `)
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (channelsError) {
        console.error('Error fetching channels:', channelsError);
        toast({
          title: "Erreur",
          description: "Impossible de charger les canaux de réservation",
          variant: "destructive",
        });
        return;
      }

      // Transform data for the table
      const transformedLinks = channelsData?.map(channel => {
        const stats = channel.channel_stats || [];
        const totalClicks = stats.reduce((sum: number, stat: any) => sum + (stat.clicks || 0), 0);
        const totalReservations = stats.reduce((sum: number, stat: any) => sum + (stat.reservations || 0), 0);
        const totalCovers = stats.reduce((sum: number, stat: any) => sum + (stat.total_covers || 0), 0);
        const conversion = totalClicks > 0 ? (totalReservations / totalClicks) * 100 : 0;

        return {
          id: channel.id,
          channel: channel.name,
          shortUrl: `/book/${channel.slug}`,
          redirectUrl: `${window.location.origin}/book/${channel.slug}`,
          clicks: totalClicks,
          reservations: totalReservations,
          covers: totalCovers,
          conversion: Math.round(conversion * 10) / 10,
          isActive: channel.is_active,
          createdAt: new Date(channel.created_at),
        };
      }) || [];

      setLinks(transformedLinks);

      // Calculate total KPIs
      const totalKpis = transformedLinks.reduce((acc, link) => ({
        totalClicks: acc.totalClicks + link.clicks,
        totalReservations: acc.totalReservations + link.reservations,
        totalCovers: acc.totalCovers + link.covers,
        conversion: 0 // Will be calculated after
      }), { totalClicks: 0, totalReservations: 0, totalCovers: 0, conversion: 0 });

      totalKpis.conversion = totalKpis.totalClicks > 0 
        ? Math.round((totalKpis.totalReservations / totalKpis.totalClicks) * 1000) / 10
        : 0;

      setKpis(totalKpis);
    } catch (error) {
      console.error('Unexpected error:', error);
      toast({
        title: "Erreur",
        description: "Une erreur inattendue s'est produite",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateLink = async (data: { channel: string }) => {
    try {
      const slug = data.channel.toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();

      const { error } = await supabase
        .from('channels')
        .insert({
          name: data.channel,
          slug: slug,
          description: `Réservations via ${data.channel}`,
          is_active: true
        });

      if (error) {
        console.error('Error creating channel:', error);
        toast({
          title: "Erreur",
          description: "Impossible de créer le canal de réservation",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Succès",
        description: "Canal de réservation créé avec succès",
      });

      setShowCreateDialog(false);
      fetchChannelsAndStats(); // Refresh the data
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
            value={kpis.totalClicks}
            icon={BarChart3}
            trend={{ value: 12.5, isPositive: true }}
          />
        </motion.div>
        <motion.div variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}>
          <KPICard
            title="Réservations"
            value={kpis.totalReservations}
            icon={Target}
            trend={{ value: 8.3, isPositive: true }}
          />
        </motion.div>
        <motion.div variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}>
          <KPICard
            title="Couverts"
            value={kpis.totalCovers}
            icon={Users}
            trend={{ value: 15.7, isPositive: true }}
          />
        </motion.div>
        <motion.div variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}>
          <KPICard
            title="Conversion"
            value={kpis.conversion}
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
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-pulse text-muted-foreground">Chargement des canaux...</div>
          </div>
        ) : (
          <>
            <LinksTable links={links} onLinksChange={setLinks} />
            
            {links.length > 0 && (
              <div className="mt-6 p-4 bg-muted/20 rounded-xl">
                <div className="flex items-center gap-2 mb-2">
                  <ExternalLink className="w-4 h-4 text-primary" />
                  <h3 className="font-semibold text-foreground">Liens de réservation générés</h3>
                </div>
                <div className="grid gap-2">
                  {links.map(link => (
                    <div key={link.id} className="flex items-center justify-between p-2 bg-background rounded-lg text-sm">
                      <span className="text-muted-foreground">{link.channel}:</span>
                      <code className="bg-muted px-2 py-1 rounded text-xs font-mono">
                        {link.redirectUrl}
                      </code>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Utilisez ces liens pour diriger vos clients vers les pages de réservation par canal.
                </p>
              </div>
            )}
          </>
        )}
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