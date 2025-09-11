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

interface CreateLinkDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: { channel: string }) => void;
}

export function CreateLinkDialog({ open, onOpenChange, onSubmit }: CreateLinkDialogProps) {
  const [channel, setChannel] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!channel.trim()) {
      toast({
        title: "Erreur",
        description: "Veuillez saisir le nom du canal",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    
    try {
      // Store channel name before resetting
      const channelName = channel.trim();
      
      // Call the parent function
      await onSubmit({ channel: channelName });
      
      // Reset form only after successful submission
      setChannel("");
      
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