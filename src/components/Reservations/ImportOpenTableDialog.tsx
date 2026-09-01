import { useState } from "react";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface ImportOpenTableDialogProps {
  onImported?: () => void;
}

export function ImportOpenTableDialog({ onImported }: ImportOpenTableDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [subject, setSubject] = useState("");
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleImport = async () => {
    if (!subject.trim() && !content.trim()) {
      toast({
        title: "Contenu manquant",
        description: "Collez l'objet et le contenu de l'e-mail OpenTable.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const { data, error } = await supabase.functions.invoke('manual-opentable-import', {
        body: { subject, text: content, html: content },
      });

      if (error) throw error;

      if (data?.ok === false || data?.error) {
        toast({
          title: "E-mail non reconnu",
          description: "Impossible d'extraire la réservation. Vérifiez que le contenu complet de l'e-mail OpenTable est collé.",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: data?.action === 'updated' ? "Réservation mise à jour" : "Réservation importée",
        description: `${data?.parsed?.customerName ?? 'Client'} — ${data?.parsed?.date ?? ''} ${data?.parsed?.time ?? ''}`,
      });

      setSubject("");
      setContent("");
      setIsOpen(false);
      onImported?.();
    } catch (err) {
      console.error("Import OpenTable error:", err);
      toast({
        title: "Erreur",
        description: "L'import de la réservation OpenTable a échoué.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Download className="h-4 w-4" />
          Importer OpenTable
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Importer une réservation OpenTable</DialogTitle>
          <DialogDescription>
            Collez l'e-mail de notification OpenTable : la réservation apparaîtra directement dans la liste, avec la mention « Via OpenTable ».
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="ot-subject">Objet de l'e-mail</Label>
            <Input
              id="ot-subject"
              placeholder="Nouvelle réservation — Jean Dupont, 4 personnes"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="ot-content">Contenu de l'e-mail</Label>
            <Textarea
              id="ot-content"
              placeholder="Collez ici le contenu complet de l'e-mail OpenTable..."
              rows={10}
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="ghost" onClick={() => setIsOpen(false)} disabled={isSubmitting}>
              Annuler
            </Button>
            <Button className="premium-button" onClick={handleImport} disabled={isSubmitting}>
              {isSubmitting ? "Import en cours..." : "Importer"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
