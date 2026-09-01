import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const GOOGLE_SOURCE = "Google Agenda";
const CHANNEL_SLUG = "google-agenda";
const SYNC_DAYS_AHEAD = 60;

/* ---------- Google service-account auth (read-only) ---------- */

function pemToArrayBuffer(pem: string): ArrayBuffer {
  const b64 = pem
    .replace(/-----BEGIN PRIVATE KEY-----/, "")
    .replace(/-----END PRIVATE KEY-----/, "")
    .replace(/\s+/g, "");
  const bin = atob(b64);
  const buf = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) buf[i] = bin.charCodeAt(i);
  return buf.buffer;
}

function b64url(data: Uint8Array | string): string {
  const bytes = typeof data === "string" ? new TextEncoder().encode(data) : data;
  let bin = "";
  bytes.forEach((b) => (bin += String.fromCharCode(b)));
  return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

async function getAccessToken(serviceAccount: any): Promise<string> {
  const now = Math.floor(Date.now() / 1000);
  const header = b64url(JSON.stringify({ alg: "RS256", typ: "JWT" }));
  const claim = b64url(
    JSON.stringify({
      iss: serviceAccount.client_email,
      scope: "https://www.googleapis.com/auth/calendar.readonly",
      aud: "https://oauth2.googleapis.com/token",
      exp: now + 3600,
      iat: now,
    }),
  );
  const unsigned = `${header}.${claim}`;

  const key = await crypto.subtle.importKey(
    "pkcs8",
    pemToArrayBuffer(serviceAccount.private_key),
    { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signature = new Uint8Array(
    await crypto.subtle.sign("RSASSA-PKCS1-v1_5", key, new TextEncoder().encode(unsigned)),
  );
  const jwt = `${unsigned}.${b64url(signature)}`;

  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion: jwt,
    }),
  });
  const body = await res.text();
  if (!res.ok) throw new Error(`Google token error [${res.status}]: ${body}`);
  return JSON.parse(body).access_token as string;
}

/* ---------- Parsing helpers ---------- */

const PARIS_TZ = "Europe/Paris";

function parisParts(iso: string): { date: string; time: string } {
  const d = new Date(iso);
  const fmt = new Intl.DateTimeFormat("fr-CA", {
    timeZone: PARIS_TZ,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
  const parts = Object.fromEntries(fmt.formatToParts(d).map((p) => [p.type, p.value]));
  return {
    date: `${parts.year}-${parts.month}-${parts.day}`,
    time: `${parts.hour === "24" ? "00" : parts.hour}:${parts.minute}`,
  };
}

// "Dupont - 6 pers", "6p Dupont", "Dupont x4", "Dupont (8 couverts)"
function extractGuests(text: string): number | null {
  const patterns = [
    /(\d{1,3})\s*(?:pers(?:onnes?)?|pax|couverts?|convives?)\b/i,
    /\b(\d{1,3})\s*p\b/i,
    /\bx\s*(\d{1,3})\b/i,
  ];
  for (const re of patterns) {
    const m = text.match(re);
    if (m) {
      const n = parseInt(m[1], 10);
      if (n > 0 && n <= 500) return n;
    }
  }
  return null;
}

function extractPhone(text: string): string | null {
  const m = text.replace(/[.\-\s]/g, "").match(/(\+?\d{9,15})/);
  return m ? m[1] : null;
}

function cleanName(summary: string): string {
  return (
    summary
      .replace(/\(?\b\d{1,3}\s*(?:pers(?:onnes?)?|pax|couverts?|convives?)\b\)?/gi, "")
      .replace(/\bx\s*\d{1,3}\b/gi, "")
      .replace(/^[\s\-–—•]+|[\s\-–—•]+$/g, "")
      .trim() || "Réservation Google Agenda"
  );
}

/* ---------- Handler ---------- */

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const rawKey = Deno.env.get("GOOGLE_SERVICE_ACCOUNT_KEY");
    const calendarId = Deno.env.get("GOOGLE_CALENDAR_ID");
    if (!rawKey || !calendarId) {
      return new Response(
        JSON.stringify({ error: "Google Agenda non configuré (clé de service ou identifiant d'agenda manquant)" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const serviceAccount = JSON.parse(rawKey);
    const accessToken = await getAccessToken(serviceAccount);

    const timeMin = new Date(Date.now() - 24 * 3600 * 1000).toISOString();
    const timeMax = new Date(Date.now() + SYNC_DAYS_AHEAD * 24 * 3600 * 1000).toISOString();

    const url = new URL(
      `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendarId)}/events`,
    );
    url.searchParams.set("timeMin", timeMin);
    url.searchParams.set("timeMax", timeMax);
    url.searchParams.set("singleEvents", "true");
    url.searchParams.set("orderBy", "startTime");
    url.searchParams.set("maxResults", "250");

    const eventsRes = await fetch(url.toString(), {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    const eventsBody = await eventsRes.text();
    if (!eventsRes.ok) {
      console.error(`Google Calendar error [${eventsRes.status}]: ${eventsBody}`);
      return new Response(
        JSON.stringify({ error: "Lecture Google Agenda impossible", status: eventsRes.status, details: eventsBody }),
        { status: eventsRes.status, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }
    const events = (JSON.parse(eventsBody).items ?? []) as any[];

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    const { data: channel } = await supabase
      .from("channels")
      .select("id")
      .eq("slug", CHANNEL_SLUG)
      .maybeSingle();

    if (!channel) {
      return new Response(JSON.stringify({ error: "Canal Google Agenda introuvable" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    let imported = 0;
    let updated = 0;
    let skipped = 0;

    for (const ev of events) {
      const startIso: string | undefined = ev.start?.dateTime;
      const startDateOnly: string | undefined = ev.start?.date;
      if (!startIso && !startDateOnly) {
        skipped++;
        continue;
      }
      if (ev.status === "cancelled") {
        await supabase
          .from("reservations")
          .update({ status: "cancelled" })
          .eq("source", GOOGLE_SOURCE)
          .eq("external_id", ev.id);
        updated++;
        continue;
      }

      const { date, time } = startIso
        ? parisParts(startIso)
        : { date: startDateOnly!, time: "19:00" };

      const haystack = `${ev.summary ?? ""} ${ev.description ?? ""}`;
      const payload = {
        channel_id: channel.id,
        customer_name: cleanName(ev.summary ?? ""),
        customer_phone: extractPhone(haystack) ?? "",
        customer_email: ev.attendees?.[0]?.email ?? null,
        reservation_date: date,
        reservation_time: time,
        guests_count: extractGuests(haystack) ?? 2,
        notes: ev.description ? String(ev.description).slice(0, 500) : null,
        status: "confirmed",
        source: GOOGLE_SOURCE,
        external_id: ev.id,
      };

      const { data: existing } = await supabase
        .from("reservations")
        .select("id")
        .eq("source", GOOGLE_SOURCE)
        .eq("external_id", ev.id)
        .maybeSingle();

      if (existing) {
        const { error } = await supabase
          .from("reservations")
          .update({
            customer_name: payload.customer_name,
            reservation_date: payload.reservation_date,
            reservation_time: payload.reservation_time,
            guests_count: payload.guests_count,
            notes: payload.notes,
          })
          .eq("id", existing.id);
        if (error) console.error("Update failed:", error.message);
        else updated++;
      } else {
        const { error } = await supabase.from("reservations").insert(payload);
        if (error) console.error("Insert failed:", error.message);
        else imported++;
      }
    }

    return new Response(JSON.stringify({ ok: true, total: events.length, imported, updated, skipped }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("sync-google-calendar error:", err);
    return new Response(JSON.stringify({ error: String((err as Error).message ?? err) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
