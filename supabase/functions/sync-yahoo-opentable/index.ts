import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";
import { htmlToText, parseOpenTableEmail } from "../_shared/opentable-parser.ts";
import { ImapClient, imapDate, parseRawEmail } from "../_shared/imap-client.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const OPENTABLE_SOURCE = "OpenTable";
const CHANNEL_SLUG = "opentable";
const IMAP_HOST = "imap.mail.yahoo.com";
const IMAP_PORT = 993;
const LOOKBACK_DAYS = 7;
const MAX_MESSAGES = 40;

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  const json = (data: unknown, status = 200) =>
    new Response(JSON.stringify(data), {
      status,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  const supabaseAdmin = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );

  // --- Authentification : utilisateur connecté avec un rôle autorisé ---
  const authHeader = req.headers.get("Authorization");
  if (!authHeader) return json({ error: "unauthorized" }, 401);

  const { data: userData, error: userError } = await supabaseAdmin.auth.getUser(
    authHeader.replace("Bearer ", ""),
  );
  if (userError || !userData?.user) return json({ error: "unauthorized" }, 401);

  const { data: isAdmin } = await supabaseAdmin.rpc("has_role", {
    _user_id: userData.user.id,
    _role: "admin",
  });
  if (!isAdmin) return json({ error: "forbidden" }, 403);

  const username = Deno.env.get("YAHOO_IMAP_USER");
  const password = Deno.env.get("YAHOO_IMAP_PASSWORD");
  if (!username || !password) {
    return json({ error: "Identifiants Yahoo manquants (YAHOO_IMAP_USER / YAHOO_IMAP_PASSWORD)" }, 500);
  }

  const client = new ImapClient({ hostname: IMAP_HOST, port: IMAP_PORT, username, password });

  let total = 0;
  let imported = 0;
  let updated = 0;
  let skipped = 0;
  let notesKept = 0;

  try {
    const { data: channel } = await supabaseAdmin
      .from("channels")
      .select("id")
      .eq("slug", CHANNEL_SLUG)
      .maybeSingle();
    if (!channel) return json({ error: "canal OpenTable introuvable" }, 500);

    await client.connect();
    await client.selectMailbox("INBOX");

    if (new URL(req.url).searchParams.get("inspect") === "thefork") {
      const since = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      const seqs = [
        ...(await client.search(`SINCE ${imapDate(since)} FROM "thefork"`)),
        ...(await client.search(`SINCE ${imapDate(since)} FROM "lafourchette"`)),
      ];
      const out = [];
      for (const seq of [...new Set(seqs)].slice(-8)) {
        const e = parseRawEmail(await client.fetchRaw(seq));
        const b = htmlToText(e.html) + "\n---TEXT---\n" + e.text + "\n---RAWLEN " + e.html.length;
        out.push({ seq, from: e.from, subject: e.subject, body: b.slice(0, 4000) });
      }
      return json({ count: seqs.length, out });
    }



    const since = new Date(Date.now() - LOOKBACK_DAYS * 24 * 60 * 60 * 1000);
    let sequences = await client.search(`SINCE ${imapDate(since)} FROM "opentable"`);
    if (sequences.length === 0) {
      sequences = await client.search(`SINCE ${imapDate(since)} SUBJECT "OpenTable"`);
    }

    const recent = sequences.slice(-MAX_MESSAGES);
    total = recent.length;

    for (const seq of recent) {
      let raw = "";
      try {
        raw = await client.fetchRaw(seq);
      } catch (err) {
        console.error("IMAP fetch error", seq, err);
        skipped += 1;
        continue;
      }

      const email = parseRawEmail(raw);
      const body = email.text && email.text.trim().length > 20
        ? email.text
        : htmlToText(email.html);

      const parsed = parseOpenTableEmail(email.subject, body);
      if (!parsed) {
        skipped += 1;
        continue;
      }

      const externalId = parsed.externalId ??
        `${parsed.customerName.toLowerCase().replace(/\s+/g, "-")}-${parsed.date}-${parsed.time}`;

      const { data: existing } = await supabaseAdmin
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
        const { notes: _drop, ...withoutNotes } = record;
        const patch = {
          ...withoutNotes,
          ...(!storedNotes && incomingNotes ? { notes: parsed.notes } : {}),
        };
        if (storedNotes) notesKept += 1;

        const { error } = await supabaseAdmin
          .from("reservations")
          .update(patch)
          .eq("id", existing.id);
        if (error) {
          console.error("update error", error.message);
          skipped += 1;
          continue;
        }
        updated += 1;
      } else {
        const { error } = await supabaseAdmin.from("reservations").insert(record);
        if (error) {
          console.error("insert error", error.message);
          skipped += 1;
          continue;
        }
        imported += 1;
      }
    }

    return json({ ok: true, total, imported, updated, skipped, notesKept });
  } catch (err) {
    console.error("sync-yahoo-opentable error:", err);
    return json({ error: String((err as Error).message ?? err), total, imported, updated, skipped, notesKept }, 500);
  } finally {
    await client.close();
  }
});
