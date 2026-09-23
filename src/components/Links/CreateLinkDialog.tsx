import { motion } from "framer-motion";
import { useState } from "react";
import { Sparkles } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

type AdsCampaign = "none" | "search" | "pmax";

const CAMPAIGN_NAMES: Record<Exclude<AdsCampaign, "none">, string> = {
  search: "Google Ads — Search",
  pmax: "Google Ads — PMax",
};

interface CreateLinkDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: { channel: string; adsCampaign?: "pmax" | "search" | null }) => void;
}

export function CreateLinkDialog({ open, onOpenChange, onSubmit }: CreateLinkDialogProps) {
  const [channel, setChannel] = useState("");
  const [adsCampaign, setAdsCampaign] = useState<AdsCampaign>("none");
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const handleCampaignChange = (value: AdsCampaign) => {
    setAdsCampaign(value);
    if (value !== "none") {
      setChannel(CAMPAIGN_NAMES[value]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const isCampaign = adsCampaign !== "none";
    const channelName = isCampaign
      ? channel.trim() || CAMPAIGN_NAMES[adsCampaign]
      : channel.trim();

    if (!channelName) {
      toast({
        title: "Erreur",
        description: "Veuillez saisir le nom du canal",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);

    try {
      // Call the parent function
      await onSubmit({
        channel: channelName,
        adsCampaign: isCampaign ? adsCampaign : null,
      });

      // Reset form only after successful submission
      setChannel("");
      setAdsCampaign("none");

    } catch (error) {
      console.error('Error creating channel:', error);
      toast({
        title: "Erreur",
        description: "Impossible de créer le canal de réservation",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!isGenerating) {
      onOpenChange(newOpen);
      if (!newOpen) {
        setChannel("");
        setAdsCampaign("none");
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="premium-card max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl font-playfair">
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
            >
              <Sparkles className="h-5 w-5 text-primary" />
            </motion.div>
            Nouveau lien de tracking
          </DialogTitle>
          <DialogDescription>
            Créez un nouveau canal de réservation avec son lien de tracking automatique
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-6">
          <div className="space-y-2">
            <Label htmlFor="channel" className="text-sm font-medium">
              Nom du canal
            </Label>
            <Input
              id="channel"
              value={channel}
              onChange={(e) => setChannel(e.target.value)}
              placeholder="ex: Instagram Bio, Facebook Page, Google Ads..."
              className="premium-input"
              disabled={isGenerating}
            />
            <p className="text-xs text-muted-foreground">
              Un lien de réservation sera automatiquement généré pour ce canal
            </p>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
              disabled={isGenerating}
              className="flex-1 premium-button"
            >
              Annuler
            </Button>
            <Button
              type="submit"
              disabled={isGenerating}
              className="flex-1 premium-button bg-gradient-gold hover:shadow-gold text-charcoal font-semibold"
            >
              {isGenerating ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="mr-2"
                >
                  <Sparkles className="h-4 w-4" />
                </motion.div>
              ) : (
                <Sparkles className="mr-2 h-4 w-4" />
              )}
              {isGenerating ? "Génération..." : "Créer le canal"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}