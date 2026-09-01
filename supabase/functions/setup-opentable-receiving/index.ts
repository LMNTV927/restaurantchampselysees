import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const DEFAULT_DOMAIN = "xn--rservation-prince-palace-bfc.fr";
const MAILBOX = "opentable";

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  const json = (data: unknown, status = 200) =>
    new Response(JSON.stringify(data), {
      status,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader) return json({ error: "unauthorized" }, 401);

    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
      { global: { headers: { Authorization: authHeader } }, auth: { persistSession: false } },
    );

    const { data: userData, error: userError } = await supabaseAdmin.auth.getUser();
    if (userError || !userData.user) return json({ error: "unauthorized" }, 401);

    const { data: isAdmin, error: roleError } = await supabaseAdmin.rpc("has_role", {
      _user_id: userData.user.id,
      _role: "admin",
    });
    if (roleError || !isAdmin) return json({ error: "forbidden" }, 403);

    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    if (!resendApiKey) return json({ error: "RESEND_API_KEY manquant" }, 500);

    const ingestToken = Deno.env.get("OPENTABLE_INGEST_TOKEN");
    if (!ingestToken) return json({ error: "OPENTABLE_INGEST_TOKEN manquant" }, 500);

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const webhookUrl = `${supabaseUrl}/functions/v1/ingest-opentable-email?token=${ingestToken}`;

    /* ---------- List domains ---------- */
    const listRes = await fetch("https://api.resend.com/domains", {
      headers: { Authorization: `Bearer ${resendApiKey}` },
    });
    if (!listRes.ok) {
      return json({ error: "impossible de lister les domaines Resend", details: await listRes.text() }, 502);
    }
    const domainsList = await listRes.json();
    const domains = Array.isArray(domainsList?.data) ? domainsList.data : [];

    const receivingDomain = domains.find(
      (d: any) =>
        d.name === DEFAULT_DOMAIN &&
        d.capabilities?.receiving === "enabled" &&
        ["verified", "partially_verified"].includes(d.status),
    ) ?? domains.find(
      (d: any) =>
        d.capabilities?.receiving === "enabled" &&
        ["verified", "partially_verified"].includes(d.status),
    );

    let domain = receivingDomain;
    let created = false;

    if (!domain) {
      const createRes = await fetch("https://api.resend.com/domains", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${resendApiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: DEFAULT_DOMAIN,
          region: "eu-west-1",
          capabilities: { sending: "enabled", receiving: "enabled" },
        }),
      });
      if (!createRes.ok) {
        return json(
          { error: "impossible de créer le domaine de réception", details: await createRes.text() },
          502,
        );
      }
      created = true;
      domain = await createRes.json();
    }

    const receivingEmail = `${MAILBOX}@${domain.name}`;

    /* ---------- List webhooks ---------- */
    const webhooksRes = await fetch("https://api.resend.com/webhooks", {
      headers: { Authorization: `Bearer ${resendApiKey}` },
    });
    let webhookId: string | null = null;
    if (webhooksRes.ok) {
      const webhooksList = await webhooksRes.json();
      const existing = (webhooksList?.data ?? []).find(
        (w: any) => w.endpoint === webhookUrl && w.events?.includes("email.received"),
      );
      if (existing?.id) webhookId = existing.id;
    }

    if (!webhookId) {
      const createWebhookRes = await fetch("https://api.resend.com/webhooks", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${resendApiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          endpoint: webhookUrl,
          events: ["email.received"],
        }),
      });
      if (!createWebhookRes.ok) {
        return json(
          { error: "impossible de créer le webhook Resend", details: await createWebhookRes.text() },
          502,
        );
      }
      const wh = await createWebhookRes.json();
      webhookId = wh.id ?? null;
    }

    return json({
      ok: true,
      domain: {
        id: domain.id,
        name: domain.name,
        status: domain.status,
        created,
        records: domain.records ?? null,
      },
      receiving_email: receivingEmail,
      webhook_url: webhookUrl,
      webhook_id: webhookId,
      next_steps: created
        ? [
            "Ajoutez les enregistrements DNS affichés ci-dessus dans votre gestionnaire DNS.",
            "Attendez que le domaine soit vérifié (verified ou partially_verified).",
            "Configurez une règle de transfert dans Yahoo Mail vers l'adresse de réception.",
          ]
        : ["Configurez une règle de transfert dans Yahoo Mail vers l'adresse de réception."],
    });
  } catch (err) {
    console.error("setup-opentable-receiving error:", err);
    return json({ error: String((err as Error).message ?? err) }, 500);
  }
});
