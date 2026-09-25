import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";
import { htmlToText, parseOpenTableEmail } from "../_shared/opentable-parser.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-ingest-token, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const OPENTABLE_SOURCE = "OpenTable";
const CHANNEL_SLUG = "opentable";

/* ---------- Resend inbound helpers ---------- */

interface ResendInboundEvent {
  type?: string;
  data?: {
    email_id?: string;
    subject?: string;
  };
}

function getResendKey(): string | null {
  return Deno.env.get("RESEND_INBOUND_API_KEY") ?? Deno.env.get("RESEND_API_KEY");
}

async function fetchResendEmail(emailId: string): Promise<{ subject: string; html?: string | null; text?: string | null } | null> {
  const resendApiKey = getResendKey();
  if (!resendApiKey) {
    console.error("Aucune clé Resend configurée");
    return null;
  }

  const response = await fetch(`https://api.resend.com/emails/receiving/${emailId}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${resendApiKey}`,
    },
  });

  if (!response.ok) {
    console.error("Resend get email failed:", response.status, await response.text());
    return null;
  }

  const email = await response.json();
  return {
    subject: email.subject ?? "",
    html: email.html,
    text: email.text,
  };
}

/* ---------- Handler ---------- */

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  const json = (data: unknown, status = 200) =>
    new Response(JSON.stringify(data), {
      status,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  try {
    const expectedToken = Deno.env.get("OPENTABLE_INGEST_TOKEN");
    const url = new URL(req.url);
    const provided = url.searchParams.get("token") ?? req.headers.get("x-ingest-token");
    if (!expectedToken || provided !== expectedToken) {
      return json({ error: "unauthorized" }, 401);
    }

    let payload: any = {};
    const contentType = req.headers.get("content-type") ?? "";
    if (contentType.includes("application/json")) {
      payload = await req.json();
    } else {
      const form = await req.formData();
      payload = Object.fromEntries([...form.entries()].map(([k, v]) => [k, String(v)]));
    }

    let subject = "";
    let rawHtml = "";
    let rawText = "";

    const event: ResendInboundEvent = payload;
    if (event.type === "email.received" && event.data?.email_id) {
      const email = await fetchResendEmail(event.data.email_id);
      if (!email) {
        return json({ error: "impossible de récupérer l'e-mail depuis Resend" }, 502);
      }
      subject = email.subject;
      rawHtml = email.html ?? "";
      rawText = email.text ?? "";
    } else {
      const data = payload.data ?? payload;
      subject = data.subject ?? payload.subject ?? "";
      rawHtml = data.html ?? payload.html ?? "";
      rawText = data.text ?? payload.text ?? payload["body-plain"] ?? "";
    }

    const body = rawText && rawText.trim().length > 20 ? rawText : htmlToText(rawHtml);

    if (!subject && !body) return json({ error: "empty email payload" }, 400);

    const parsed = parseOpenTableEmail(subject, body);
    if (!parsed) {
      console.warn("OpenTable email not recognised. Subject:", subject, "| Body preview:", body.slice(0, 800));
      return json({ ok: false, reason: "unparsed", subject }, 202);
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    const { data: channel } = await supabase
      .from("channels")
      .select("id")
      .eq("slug", CHANNEL_SLUG)
      .maybeSingle();
    if (!channel) return json({ error: "canal OpenTable introuvable" }, 500);

    const externalId = parsed.externalId ??
      `${parsed.customerName.toLowerCase().replace(/\s+/g, "-")}-${parsed.date}-${parsed.time}`;

    const { data: existing } = await supabase
      .from("reservations")
      .select("id, notes")
      .eq("source", OPENTABLE_SOURCE)
      .eq("external_id", externalId)
      .maybeSingle();

    const record = {
      channel_id: channel.id,
      customer_name: parsed.customerName,
      customer_phone: parsed.customerPhone,
      customer_email: parsed.customerEmail,
      reservation_date: parsed.date,
      reservation_time: parsed.time,
      guests_count: parsed.guests,
      notes: parsed.notes,
      status: parsed.cancelled ? "cancelled" : "confirmed",
      source: OPENTABLE_SOURCE,
      external_id: externalId,
    };

    if (existing) {
      const storedNotes = typeof existing.notes === "string" ? existing.notes.trim() : "";
      const incomingNotes = typeof parsed.notes === "string" ? parsed.notes.trim() : "";
      const { notes: _incomingRecordNotes, ...recordWithoutNotes } = record;
      const updateRecord = {
        ...recordWithoutNotes,
        ...(!storedNotes && incomingNotes ? { notes: parsed.notes } : {}),
      };

      const { error } = await supabase.from("reservations").update(updateRecord).eq("id", existing.id);
      if (error) return json({ error: error.message }, 500);
      return json({ ok: true, action: "updated", externalId, notesKept: storedNotes ? 1 : 0 });
    }

    const { error } = await supabase.from("reservations").insert(record);
    if (error) return json({ error: error.message }, 500);
    return json({ ok: true, action: "created", externalId, notesKept: 0 });
  } catch (err) {
    console.error("ingest-opentable-email error:", err);
    return json({ error: String((err as Error).message ?? err) }, 500);
  }
});
