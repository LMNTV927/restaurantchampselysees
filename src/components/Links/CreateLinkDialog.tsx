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
  onSubmit: (data: { channel: string; redirectUrl: string }) => void;
}

export function CreateLinkDialog({ open, onOpenChange, onSubmit }: CreateLinkDialogProps) {
  const [channel, setChannel] = useState("");
  const [redirectUrl, setRedirectUrl] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!channel.trim() || !redirectUrl.trim()) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    
    // Simulate generation delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    onSubmit({ channel: channel.trim(), redirectUrl: redirectUrl.trim() });
    
    // Reset form
    setChannel("");
    setRedirectUrl("");
    setIsGenerating(false);
    
    // Success animation and toast
    toast({
      title: "Lien créé avec succès ! ✨",
      description: `Le lien pour "${channel}" a été généré`,
    });
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!isGenerating) {
      onOpenChange(newOpen);
      if (!newOpen) {
        setChannel("");
        setRedirectUrl("");
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
            Créez un lien court personnalisé pour suivre vos conversions par canal
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
              placeholder="ex: Instagram Bio, Facebook Page..."
              className="premium-input"
              disabled={isGenerating}
            />
            <p className="text-xs text-muted-foreground">
              Ce nom vous aidera à identifier le canal dans vos statistiques
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="redirectUrl" className="text-sm font-medium">
              URL de redirection
            </Label>
            <Input
              id="redirectUrl"
              type="url"
              value={redirectUrl}
              onChange={(e) => setRedirectUrl(e.target.value)}
              placeholder="https://votre-site.com/reservations"
              className="premium-input"
              disabled={isGenerating}
            />
            <p className="text-xs text-muted-foreground">
              L'URL vers laquelle les visiteurs seront redirigés
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
              {isGenerating ? "Génération..." : "Générer le lien"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}