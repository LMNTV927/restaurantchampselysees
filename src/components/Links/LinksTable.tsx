import { motion } from "framer-motion";
import { useState } from "react";
import { Copy, QrCode, MoreHorizontal, Eye, EyeOff, Edit2, Trash2 } from "lucide-react";
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

interface LinksTableProps {
  links: Link[];
  onLinksChange: (links: Link[]) => void;
}

export function LinksTable({ links, onLinksChange }: LinksTableProps) {
  const { toast } = useToast();
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopyLink = async (link: Link) => {
    const fullUrl = `${window.location.origin}${link.shortUrl}`;
    await navigator.clipboard.writeText(fullUrl);
    setCopiedId(link.id);
    setTimeout(() => setCopiedId(null), 2000);
    
    toast({
      title: "Lien copié !",
      description: "Le lien a été copié dans le presse-papier",
    });
  };

  const handleToggleActive = (linkId: string) => {
    onLinksChange(
      links.map(link =>
        link.id === linkId ? { ...link, isActive: !link.isActive } : link
      )
    );
  };

  const handleDeleteLink = (linkId: string) => {
    onLinksChange(links.filter(link => link.id !== linkId));
    toast({
      title: "Lien supprimé",
      description: "Le lien de tracking a été supprimé avec succès",
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
            {links.map((link, index) => (
              <motion.tr
                key={link.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="group hover:bg-muted/30 transition-colors"
              >
                <TableCell>
                  <div>
                    <p className="font-medium text-foreground">{link.channel}</p>
                    <p className="text-xs text-muted-foreground">
                      Créé le {link.createdAt.toLocaleDateString()}
                    </p>
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
                <TableCell className="text-center">
                  <div className="flex items-center justify-center gap-2">
                    {link.isActive ? (
                      <Eye className="h-4 w-4 text-success" />
                    ) : (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    )}
                    <Switch
                      checked={link.isActive}
                      onCheckedChange={() => handleToggleActive(link.id)}
                    />
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center justify-center gap-2">
                    <motion.div
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleCopyLink(link)}
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
                          onClick={() => handleDeleteLink(link.id)}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Supprimer
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </TableCell>
              </motion.tr>
            ))}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
}