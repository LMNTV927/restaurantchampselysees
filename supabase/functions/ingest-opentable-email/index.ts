import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-ingest-token, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const OPENTABLE_SOURCE = "OpenTable";
const CHANNEL_SLUG = "opentable";

/* ---------- Utils ---------- */

function htmlToText(html: string): string {
  return html
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/(p|div|tr|td|h\d|li)>/gi, "\n")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&#39;|&rsquo;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&eacute;/g, "é")
    .replace(/&egrave;/g, "è")
    .replace(/[ \t\u00a0]+/g, " ")
    .replace(/\n\s*\n+/g, "\n")
    .trim();
}

const MONTHS: Record<string, number> = {
  janvier: 1, janv: 1, january: 1, jan: 1,
  "février": 2, fevrier: 2, "févr": 2, fevr: 2, february: 2, feb: 2,
  mars: 3, march: 3, mar: 3,
  avril: 4, avr: 4, april: 4, apr: 4,
  mai: 5, may: 5,
  juin: 6, june: 6, jun: 6,
  juillet: 7, juil: 7, july: 7, jul: 7,
  "août": 8, aout: 8, august: 8, aug: 8,
  septembre: 9, sept: 9, september: 9, sep: 9,
  octobre: 10, oct: 10, october: 10,
  novembre: 11, nov: 11, november: 11,
  "décembre": 12, decembre: 12, "déc": 12, dec: 12, december: 12,
};

function pad(n: number): string {
  return n.toString().padStart(2, "0");
}

function parseDate(text: string): string | null {
  // 2026-05-30
  let m = text.match(/\b(20\d{2})-(\d{2})-(\d{2})\b/);
  if (m) return `${m[1]}-${m[2]}-${m[3]}`;

  // 30/05/2026 or 30-05-2026
  m = text.match(/\b(\d{1,2})[\/.-](\d{1,2})[\/.-](20\d{2})\b/);
  if (m) return `${m[3]}-${pad(+m[2])}-${pad(+m[1])}`;

  // 30 mai 2026 / 30 mai
  m = text.match(/\b(\d{1,2})(?:er)?\s+([A-Za-zÀ-ÿ]{3,10})\.?\s*(20\d{2})?/);
  if (m) {
    const month = MONTHS[m[2].toLowerCase()];
    if (month) {
      const year = m[3] ? +m[3] : new Date().getFullYear();
      return `${year}-${pad(month)}-${pad(+m[1])}`;
    }
  }

  // May 30, 2026
  m = text.match(/\b([A-Za-z]{3,10})\.?\s+(\d{1,2})(?:st|nd|rd|th)?,?\s*(20\d{2})?/);
  if (m) {
    const month = MONTHS[m[1].toLowerCase()];
    if (month) {
      const year = m[3] ? +m[3] : new Date().getFullYear();
      return `${year}-${pad(month)}-${pad(+m[2])}`;
    }
  }
  return null;
}

function parseTime(text: string): string | null {
  // 20h30 / 20 h 30 / 20:30
  let m = text.match(/\b(\d{1,2})\s*[h:]\s*(\d{2})\b/i);
  if (m) return `${pad(+m[1])}:${m[2]}`;
  // 20h
  m = text.match(/\b(\d{1,2})\s*h\b/i);
  if (m) return `${pad(+m[1])}:00`;
  // 8:30 PM
  m = text.match(/\b(\d{1,2}):(\d{2})\s*(AM|PM)\b/i);
  if (m) {
    let h = +m[1] % 12;
    if (m[3].toUpperCase() === "PM") h += 12;
    return `${pad(h)}:${m[2]}`;
  }
  return null;
}

function firstMatch(text: string, patterns: RegExp[]): string | null {
  for (const re of patterns) {
    const m = text.match(re);
    if (m?.[1]) return m[1].trim();
  }
  return null;
}

export interface ParsedReservation {
  customerName: string;
  customerPhone: string;
  customerEmail: string | null;
  date: string;
  time: string;
  guests: number;
  externalId: string | null;
  cancelled: boolean;
  notes: string | null;
}

export function parseOpenTableEmail(subject: string, body: string): ParsedReservation | null {
  const text = `${subject}\n${body}`;

  const cancelled = /annul(?:é|ation|e)|cancell?ed|cancellation/i.test(subject) ||
    /r[ée]servation annul[ée]e|reservation (?:has been )?cancell?ed/i.test(body);

  const name =
    firstMatch(text, [
      /(?:Nom(?:\s+du\s+client)?|Client|Invit[ée]|Guest(?:\s+name)?|Name)\s*[:\-]\s*([A-Za-zÀ-ÿ'’\-\. ]{2,60})/i,
      /(?:R[ée]servation (?:de|pour)|Reservation for)\s+([A-Za-zÀ-ÿ'’\-\. ]{2,60})/i,
    ]) ?? null;

  const guestsRaw = firstMatch(text, [
    /(?:Nombre de (?:personnes|couverts|convives)|Couverts|Convives|Party size|Guests|People)\s*[:\-]?\s*(\d{1,3})/i,
    /\b(\d{1,3})\s*(?:personnes?|couverts?|convives?|guests?|people)\b/i,
  ]);

  const dateLine = firstMatch(text, [
    /(?:Date(?:\s+de\s+la\s+r[ée]servation)?|Date)\s*[:\-]\s*([^\n]{4,60})/i,
  ]);
  const timeLine = firstMatch(text, [
    /(?:Heure|Time|Horaire)\s*[:\-]\s*([^\n]{2,30})/i,
  ]);

  const date = (dateLine && parseDate(dateLine)) ?? parseDate(text);
  const time = (timeLine && parseTime(timeLine)) ?? parseTime(text);

  if (!name || !date || !time) return null;

  const phone =
    firstMatch(text, [
      /(?:T[ée]l[ée]phone|Tel|Phone|Mobile)\s*[:\-]?\s*(\+?[\d\s().\-]{8,20})/i,
    ])?.replace(/[^\d+]/g, "") ?? "";

  const email = firstMatch(text, [
    /(?:E-?mail|Courriel)\s*[:\-]?\s*([\w.+\-]+@[\w\-]+\.[\w.\-]+)/i,
  ]);

  const externalId = firstMatch(text, [
    /(?:Num[ée]ro de (?:r[ée]servation|confirmation)|Confirmation (?:number|#)|R[ée]f[ée]rence|Reservation ID)\s*[:#\-]?\s*([A-Za-z0-9\-]{4,32})/i,
  ]);

  const notes = firstMatch(text, [
    /(?:Notes?|Demandes? sp[ée]ciales?|Special requests?|Commentaires?)\s*[:\-]\s*([^\n]{2,300})/i,
  ]);

  return {
    customerName: name.replace(/\s+/g, " ").trim(),
    customerPhone: phone,
    customerEmail: email,
    date,
    time,
    guests: guestsRaw ? Math.min(parseInt(guestsRaw, 10), 500) : 2,
    externalId,
    cancelled,
    notes,
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

    // Supports Resend inbound, generic forwarders and manual test payloads
    const data = payload.data ?? payload;
    const subject: string = data.subject ?? payload.subject ?? "";
    const rawHtml: string = data.html ?? payload.html ?? "";
    const rawText: string = data.text ?? payload.text ?? payload["body-plain"] ?? "";
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
      .select("id")
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
      const { error } = await supabase.from("reservations").update(record).eq("id", existing.id);
      if (error) return json({ error: error.message }, 500);
      return json({ ok: true, action: "updated", externalId });
    }

    const { error } = await supabase.from("reservations").insert(record);
    if (error) return json({ error: error.message }, 500);
    return json({ ok: true, action: "created", externalId });
  } catch (err) {
    console.error("ingest-opentable-email error:", err);
    return json({ error: String((err as Error).message ?? err) }, 500);
  }
});
