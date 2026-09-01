import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const GOOGLE_SOURCE = "IA";
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

// Parses structured descriptions like:
//   Nom : Ileka
//   Nombre de personnes : 6
//   Occasion : Anniversaire
//   Contact : +33646250736
//   Date et Heure de l'appel : ...
function parseStructuredDescription(desc: string): {
  isStructured: boolean;
  guests: number | null;
  phone: string | null;
  occasion: string | null;
} {
  const result = { isStructured: false, guests: null as number | null, phone: null as string | null, occasion: null as string | null };
  if (!desc) return result;
  for (const line of desc.split(/\r?\n/)) {
    const m = line.match(/^\s*([^:\n]{1,40})\s*:\s*(.*)$/);
    if (!m) continue;
    const key = m[1].toLowerCase().trim();
    const value = m[2].trim();
    if (/^nombre de personnes/.test(key)) {
      const n = parseInt(value, 10);
      if (n > 0 && n <= 500) result.guests = n;
      result.isStructured = true;
    } else if (/^occasion/.test(key)) {
      if (value) result.occasion = value;
      result.isStructured = true;
    } else if (/^(contact|t[eé]l)/.test(key)) {
      result.phone = extractPhone(value) ?? result.phone;
      result.isStructured = true;
    } else if (/^nom\b/.test(key) || /^date et heure de l'appel/.test(key)) {
      result.isStructured = true;
    }
  }
  return result;
}

function cleanName(summary: string): string {
  return (
    summary
      .replace(/\(?\b\d{1,3}\s*(?:pers(?:onnes?)?|pax|couverts?|convives?)\b\)?/gi, "")
      .replace(/\bx\s*\d{1,3}\b/gi, "")
      .replace(/^[\s\-–—•]+|[\s\-–—•]+$/g, "")
      .trim() || "Réservation IA"
  );
}

/* ---------- iCal (.ics) parsing ---------- */

function icsDateToIso(value: string, params: string): { dateTime?: string; date?: string } {
  if (/VALUE=DATE/i.test(params) || /^\d{8}$/.test(value)) {
    return { date: `${value.slice(0, 4)}-${value.slice(4, 6)}-${value.slice(6, 8)}` };
  }
  const m = value.match(/^(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})(Z)?$/);
  if (!m) return {};
  if (m[7]) {
    return { dateTime: `${m[1]}-${m[2]}-${m[3]}T${m[4]}:${m[5]}:${m[6]}Z` };
  }
  // Floating / TZID time: interpreted as Paris local time
  const tzMatch = params.match(/TZID=([^;:]+)/i);
  const tz = tzMatch ? tzMatch[1] : "Europe/Paris";
  const naive = `${m[1]}-${m[2]}-${m[3]}T${m[4]}:${m[5]}:${m[6]}`;
  const guess = new Date(`${naive}Z`);
  const offsetMin = tzOffsetMinutes(guess, tz);
  return { dateTime: new Date(guess.getTime() - offsetMin * 60000).toISOString() };
}

function tzOffsetMinutes(date: Date, timeZone: string): number {
  const dtf = new Intl.DateTimeFormat("en-US", {
    timeZone,
    hour12: false,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
  const p = Object.fromEntries(dtf.formatToParts(date).map((x) => [x.type, x.value])) as any;
  const asUTC = Date.UTC(+p.year, +p.month - 1, +p.day, +p.hour % 24, +p.minute, +p.second);
  return (asUTC - date.getTime()) / 60000;
}

function unescapeIcs(v: string): string {
  return v.replace(/\\n/gi, "\n").replace(/\\,/g, ",").replace(/\\;/g, ";").replace(/\\\\/g, "\\");
}

function parseIcs(ics: string): any[] {
  const lines = ics.replace(/\r\n/g, "\n").replace(/\n[ \t]/g, "").split("\n");
  const events: any[] = [];
  let current: any = null;

  for (const line of lines) {
    if (line.startsWith("BEGIN:VEVENT")) {
      current = { start: {}, status: "confirmed" };
      continue;
    }
    if (line.startsWith("END:VEVENT")) {
      if (current?.id && (current.start.dateTime || current.start.date)) events.push(current);
      current = null;
      continue;
    }
    if (!current) continue;

    const idx = line.indexOf(":");
    if (idx === -1) continue;
    const left = line.slice(0, idx);
    const value = line.slice(idx + 1);
    const [name, ...paramParts] = left.split(";");
    const params = paramParts.join(";");

    switch (name.toUpperCase()) {
      case "UID":
        current.id = value.trim();
        break;
      case "SUMMARY":
        current.summary = unescapeIcs(value);
        break;
      case "DESCRIPTION":
        current.description = unescapeIcs(value);
        break;
      case "DTSTART":
        current.start = icsDateToIso(value.trim(), params);
        break;
      case "STATUS":
        if (/CANCELLED/i.test(value)) current.status = "cancelled";
        break;
    }
  }
  return events;
}

/* ---------- Handler ---------- */

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const rawKey = (Deno.env.get("GOOGLE_SERVICE_ACCOUNT_KEY") ?? "").trim();
    const calendarId = (Deno.env.get("GOOGLE_CALENDAR_ID") ?? "").trim();
    const icsUrl = [rawKey, calendarId].find((v) => v.startsWith("http") && /\.ics(\?|$)/i.test(v));

    const timeMin = new Date(Date.now() - 24 * 3600 * 1000);
    const timeMax = new Date(Date.now() + SYNC_DAYS_AHEAD * 24 * 3600 * 1000);

    let events: any[];

    if (icsUrl) {
      // Private iCal feed (read-only)
      const icsRes = await fetch(icsUrl);
      const ics = await icsRes.text();
      if (!icsRes.ok) {
        console.error(`iCal fetch error [${icsRes.status}]: ${ics.slice(0, 300)}`);
        return new Response(
          JSON.stringify({ error: "Lecture de l'agenda impossible", status: icsRes.status }),
          { status: icsRes.status, headers: { ...corsHeaders, "Content-Type": "application/json" } },
        );
      }
      events = parseIcs(ics).filter((e) => {
        const start = e.start?.dateTime ?? e.start?.date;
        if (!start) return false;
        const d = new Date(start);
        return d >= timeMin && d <= timeMax;
      });
    } else {
      if (!rawKey || !calendarId) {
        return new Response(
          JSON.stringify({ error: "Google Agenda non configuré (clé de service ou identifiant d'agenda manquant)" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
        );
      }

      let serviceAccount: any;
      try {
        serviceAccount = JSON.parse(rawKey);
      } catch {
        return new Response(
          JSON.stringify({
            error:
              "La clé Google enregistrée n'est ni un compte de service (JSON) ni une adresse iCal privée (.ics). Merci de fournir l'une des deux.",
          }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
        );
      }

      const accessToken = await getAccessToken(serviceAccount);
      const url = new URL(
        `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendarId)}/events`,
      );
      url.searchParams.set("timeMin", timeMin.toISOString());
      url.searchParams.set("timeMax", timeMax.toISOString());
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
      events = (JSON.parse(eventsBody).items ?? []) as any[];
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

      const rawDesc = ev.description ? String(ev.description) : "";
      const structured = parseStructuredDescription(rawDesc);
      const haystack = `${ev.summary ?? ""} ${rawDesc}`;
      const payload = {
        channel_id: channel.id,
        customer_name: cleanName(ev.summary ?? ""),
        customer_phone: structured.isStructured
          ? structured.phone ?? ""
          : extractPhone(haystack) ?? "",
        customer_email: ev.attendees?.[0]?.email ?? null,
        reservation_date: date,
        reservation_time: time,
        guests_count: structured.guests ?? extractGuests(haystack) ?? 2,
        notes: structured.isStructured
          ? structured.occasion
          : rawDesc
            ? rawDesc.slice(0, 500)
            : null,
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
