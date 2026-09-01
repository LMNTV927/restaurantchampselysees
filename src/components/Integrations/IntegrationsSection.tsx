import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Loader2, Mail, Webhook, Copy, Check, AlertTriangle, Save } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface SetupResult {
  ok: boolean;
  domain?: {
    id: string;
    name: string;
    status: string;
    created: boolean;
    records?: any;
  };
  receiving_email?: string;
  webhook_url?: string;
  webhook_id?: string | null;
  next_steps?: string[];
  error?: string;
  details?: string;
}

export function IntegrationsSection() {
  const [loading, setLoading] = useState(true);
  const [setup, setSetup] = useState<SetupResult | null>(null);
  const [copied, setCopied] = useState<string | null>(null);
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [importing, setImporting] = useState(false);

  const loadSetup = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("setup-opentable-receiving");
      if (error) {
        const details = error instanceof Error ? error.message : String(error);
        setSetup({ ok: false, error: "Échec du chargement de la configuration", details });
      } else {
        setSetup(data as SetupResult);
      }
    } catch (err) {
      setSetup({ ok: false, error: "Échec du chargement de la configuration", details: String(err) });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadSetup();
  }, []);

  const copyToClipboard = async (text: string, key: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(key);
      window.setTimeout(() => setCopied(null), 2000);
    } catch {
      toast.error("Impossible de copier");
    }
  };

  const handleManualImport = async () => {
    if (!subject.trim() && !body.trim()) {
      toast.error("Renseignez au minimum l'objet ou le corps du mail");
      return;
    }
    setImporting(true);
    try {
      const { data, error } = await supabase.functions.invoke("manual-opentable-import", {
        body: { subject, html: "", text: body },
      });
      if (error) {
        toast.error("Import manuel échoué");
        console.error(error);
      } else if (data?.ok) {
        toast.success(`Réservation ${data.action === "updated" ? "mise à jour" : "créée"} (${data.externalId})`);
        setSubject("");
        setBody("");
      } else {
        toast.error(data?.reason === "unparsed" ? "Le contenu n'a pas été reconnu comme une réservation OpenTable" : "Import échoué");
      }
    } catch (err) {
      toast.error("Import manuel échoué");
      console.error(err);
    } finally {
      setImporting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-4 sm:space-y-8"
    >
      <div>
        <h2 className="text-2xl sm:text-3xl font-playfair font-semibold text-foreground">
          Intégrations
        </h2>
        <p className="text-muted-foreground mt-1">
          Connectez vos sources de réservations externes
        </p>
      </div>

      <Card className="premium-card overflow-hidden">
        <div className="p-4 sm:p-6 space-y-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Mail className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-playfair font-semibold">OpenTable</h3>
              <p className="text-sm text-muted-foreground">Réception automatique des e-mails de confirmation</p>
            </div>
          </div>

          {loading && (
            <div className="flex items-center gap-2 text-muted-foreground py-4">
              <Loader2 className="h-4 w-4 animate-spin" />
              Chargement de la configuration...
            </div>
          )}

          {!loading && setup && !setup.ok && (
            <div className="rounded-xl border border-destructive/30 bg-destructive/10 p-4 flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="text-sm font-medium text-foreground">{setup.error}</p>
                {setup.details && <p className="text-xs text-muted-foreground break-all">{setup.details}</p>}
              </div>
            </div>
          )}

          {!loading && setup?.ok && (
            <div className="space-y-4">
              {setup.restriction && (
                <div className="rounded-xl border border-primary/30 bg-primary/10 p-4 flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-foreground">{setup.restriction}</p>
                </div>
              )}

              {setup.domain?.created && (
                <div className="rounded-xl border border-primary/30 bg-primary/10 p-4">
                  <p className="text-sm font-medium text-foreground mb-2">
                    Domaine créé dans Resend : <span className="font-semibold">{setup.domain.name}</span>
                  </p>
                  <p className="text-xs text-muted-foreground mb-2">
                    Ajoutez les enregistrements DNS ci-dessous, puis rechargez cette page.
                  </p>
                  {setup.domain.records && (
                    <pre className="text-xs bg-background/50 rounded-lg p-3 overflow-auto max-h-60">
                      {JSON.stringify(setup.domain.records, null, 2)}
                    </pre>
                  )}
                </div>
              )}

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Adresse de réception
                  </label>
                  <div className="flex items-center gap-2">
                    <Input
                      readOnly
                      value={setup.receiving_email ?? ""}
                      className="bg-background/50 font-mono text-sm"
                    />
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setup.receiving_email && copyToClipboard(setup.receiving_email, "email")}
                      className="flex-shrink-0"
                    >
                      {copied === "email" ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Webhook Resend
                  </label>
                  <div className="flex items-center gap-2">
                    <Input
                      readOnly
                      value={setup.webhook_url ?? ""}
                      className="bg-background/50 font-mono text-sm"
                    />
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setup.webhook_url && copyToClipboard(setup.webhook_url, "webhook")}
                      className="flex-shrink-0"
                    >
                      {copied === "webhook" ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
              </div>

              {setup.next_steps && setup.next_steps.length > 0 && (
                <ol className="list-decimal list-inside text-sm text-muted-foreground space-y-1">
                  {setup.next_steps.map((step, i) => (
                    <li key={i}>{step}</li>
                  ))}
                </ol>
              )}
            </div>
          )}

          <div className="border-t border-border/50 pt-4 space-y-3">
            <div className="flex items-center gap-2 text-sm font-medium text-foreground">
              <Webhook className="h-4 w-4 text-primary" />
              Import manuel de secours
            </div>
            <p className="text-xs text-muted-foreground">
              Si un e-mail OpenTable n'a pas été intégré automatiquement, collez son contenu ici.
            </p>
            <div className="space-y-2">
              <Input
                placeholder="Objet du mail"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="bg-background/50"
              />
              <Textarea
                placeholder="Collez ici le texte complet du mail OpenTable..."
                value={body}
                onChange={(e) => setBody(e.target.value)}
                rows={8}
                className="bg-background/50 resize-none"
              />
            </div>
            <Button
              onClick={handleManualImport}
              disabled={importing}
              className="w-full sm:w-auto"
            >
              {importing ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
              Importer la réservation
            </Button>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
