import { motion } from "framer-motion";
import { Fragment, useState } from "react";
import { Copy, QrCode, MoreHorizontal, Eye, EyeOff, Edit2, Trash2, ChevronRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { getBookingUrl } from "@/lib/bookingLinks";
import { getChannelColor } from "@/lib/channelColors";

interface CampaignBreakdown {
  label: string;
  reservations: number;
  covers: number;
}

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
  campaignBreakdown?: CampaignBreakdown[];
}

interface LinksTableProps {
  links: Link[];
  onLinksChange: (links: Link[]) => void;
}

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/** Un lien n'est manipulable (copie / suppression) que s'il a un slug et un id réel */
const isActionableLink = (link: Link): boolean => {
  const slug = link.shortUrl.replace(/^\//, "").trim();
  return !!slug && !link.id.startsWith("source:") && UUID_REGEX.test(link.id);
};

export function LinksTable({ links, onLinksChange }: LinksTableProps) {
  const { toast } = useToast();
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());

  const handleCopyLink = async (e: React.MouseEvent, link: Link) => {
    e.stopPropagation();
    if (!isActionableLink(link)) return;
    const fullUrl = link.redirectUrl || getBookingUrl(link.shortUrl.replace(/^\/book\//, ""));
    await navigator.clipboard.writeText(fullUrl);
    setCopiedId(link.id);
    setTimeout(() => setCopiedId(null), 2000);

    toast({
      title: "Lien copié !",
      description: "Le lien a été copié dans le presse-papier",
    });
  };

  const handleToggleActive = (e: React.MouseEvent, linkId: string) => {
    e.stopPropagation();
    onLinksChange(
      links.map(link =>
        link.id === linkId ? { ...link, isActive: !link.isActive } : link
      )
    );
  };

  const handleDeleteLink = async (e: React.MouseEvent, linkId: string) => {
    e.stopPropagation();
    if (!UUID_REGEX.test(linkId)) return;
    try {
      // First delete associated channel_stats
      const { error: statsError } = await supabase
        .from('channel_stats')
        .delete()
        .eq('channel_id', linkId);

      if (statsError) {
        console.error('Error deleting channel stats:', statsError);
        toast({
          title: "Erreur",
          description: "Impossible de supprimer les statistiques du lien",
          variant: "destructive",
        });
        return;
      }

      // Then delete the channel
      const { error } = await supabase
        .from('channels')
        .delete()
        .eq('id', linkId);

      if (error) {
        console.error('Error deleting channel:', error);
        toast({
          title: "Erreur",
          description: "Impossible de supprimer le lien",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Lien supprimé",
        description: "Le lien de tracking a été supprimé avec succès",
      });
      onLinksChange(links.filter(link => link.id !== linkId));
    } catch (error) {
      console.error('Unexpected error:', error);
      toast({
        title: "Erreur",
        description: "Une erreur inattendue s'est produite",
        variant: "destructive",
      });
    }
  };

  const toggleExpanded = (linkId: string) => {
    setExpandedIds(prev => {
      const next = new Set(prev);
      if (next.has(linkId)) next.delete(linkId);
      else next.add(linkId);
      return next;
    });
  };

  return (
    <Card className="premium-card overflow-hidden">
      <div className="p-6 border-b border-border/50">
        <h3 className="text-lg font-playfair font-semibold">Mes liens de tracking</h3>
        <p className="text-sm text-muted-foreground mt-1">
          {links.length} lien{links.length > 1 ? "s" : ""} actif{links.length > 1 ? "s" : ""}
        </p>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="border-border/50">
              <TableHead className="font-semibold">Canal</TableHead>
              <TableHead className="font-semibold">URL courte</TableHead>
              <TableHead className="font-semibold text-center">Clics</TableHead>
              <TableHead className="font-semibold text-center">Réservations</TableHead>
              <TableHead className="font-semibold text-center">Couverts</TableHead>
              <TableHead className="font-semibold text-center">Conversion</TableHead>
              <TableHead className="font-semibold text-center">Statut</TableHead>
              <TableHead className="font-semibold text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {links.map((link, index) => {
              const hasBreakdown = !!(link.campaignBreakdown && link.campaignBreakdown.length > 0);
              const isExpanded = expandedIds.has(link.id);

              return (
                <Fragment key={link.id}>
                  <motion.tr
                    key={link.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className={`group hover:bg-muted/30 transition-colors ${hasBreakdown ? 'cursor-pointer' : ''}`}
                    onClick={hasBreakdown ? () => toggleExpanded(link.id) : undefined}
                  >
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span
                          className="inline-block w-3 h-3 rounded-full"
                          style={{ backgroundColor: getChannelColor(link.channel).hsl }}
                          aria-hidden="true"
                        />
                        <div className="flex items-center gap-2">
                          <div>
                            <p className="font-medium text-foreground">{link.channel}</p>
                            <p className="text-xs text-muted-foreground">
                              Créé le {link.createdAt.toLocaleDateString()}
                            </p>
                          </div>
                          {hasBreakdown && (
                            <ChevronRight
                              className={`h-3.5 w-3.5 text-muted-foreground transition-transform duration-200 ${isExpanded ? 'rotate-90' : ''}`}
                              aria-hidden="true"
                            />
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <code className="px-2 py-1 bg-muted/50 rounded text-sm font-mono">
                        {link.shortUrl}
                      </code>
                    </TableCell>
                    <TableCell className="text-center font-semibold">
                      {link.clicks.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-center font-semibold">
                      {link.reservations.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-center font-semibold">
                      {link.covers.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-center">
                      <span className="font-semibold text-primary">
                        {link.conversion.toFixed(1)}%
                      </span>
                    </TableCell>
                    <TableCell className="text-center" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-center gap-2">
                        {link.isActive ? (
                          <Eye className="h-4 w-4 text-success" />
                        ) : (
                          <EyeOff className="h-4 w-4 text-muted-foreground" />
                        )}
                        <Switch
                          checked={link.isActive}
                          onCheckedChange={() => {}}
                          onClick={(e) => handleToggleActive(e, link.id)}
                        />
                      </div>
                    </TableCell>
                    <TableCell onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-center gap-2">
                        <motion.div whileTap={{ scale: 0.95 }}>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => handleCopyLink(e, link)}
                            className="h-8 w-8 p-0 hover:bg-primary/20"
                          >
                            <motion.div
                              animate={copiedId === link.id ? { scale: [1, 1.2, 1] } : {}}
                              transition={{ duration: 0.3 }}
                            >
                              <Copy className="h-4 w-4" />
                            </motion.div>
                          </Button>
                        </motion.div>

                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="bg-popover/95 backdrop-blur-sm">
                            <DropdownMenuItem className="hover:bg-accent/20">
                              <QrCode className="mr-2 h-4 w-4" />
                              QR Code
                            </DropdownMenuItem>
                            <DropdownMenuItem className="hover:bg-accent/20">
                              <Edit2 className="mr-2 h-4 w-4" />
                              Renommer
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="text-destructive hover:bg-destructive/20"
                              onClick={(e) => handleDeleteLink(e, link.id)}
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Supprimer
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableCell>
                  </motion.tr>

                  {hasBreakdown && isExpanded && (
                    <TableRow className="bg-muted/20 border-0 hover:bg-muted/20">
                      <TableCell colSpan={8} className="py-0">
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden"
                        >
                          <div className="py-3 px-4">
                            <p className="text-xs uppercase tracking-wider text-muted-foreground mb-2">
                              Répartition par campagne
                            </p>
                            <div className="space-y-1.5">
                              {link.campaignBreakdown!.map((campaign, idx) => (
                                <div
                                  key={idx}
                                  className="grid grid-cols-[1fr,auto,auto] items-center gap-4 text-sm"
                                >
                                  <div className="flex items-center gap-2 min-w-0">
                                    <span
                                      className="inline-block w-2 h-2 rounded-full flex-shrink-0"
                                      style={{ backgroundColor: getChannelColor(campaign.label).hsl }}
                                      aria-hidden="true"
                                    />
                                    <span className="text-foreground truncate">{campaign.label}</span>
                                  </div>
                                  <div className="text-right whitespace-nowrap min-w-[4.5rem]">
                                    <span className="font-semibold">{campaign.reservations}</span>
                                    <span className="text-muted-foreground ml-1">réservations</span>
                                  </div>
                                  <div className="text-right whitespace-nowrap min-w-[4.5rem]">
                                    <span className="font-semibold">{campaign.covers}</span>
                                    <span className="text-muted-foreground ml-1">couverts</span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </motion.div>
                      </TableCell>
                    </TableRow>
                  )}
                </Fragment>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
}
