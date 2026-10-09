import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";
import { htmlToText, parseOpenTableEmail } from "../_shared/opentable-parser.ts";
import { ImapClient, imapDate, parseRawEmail } from "../_shared/imap-client.ts";
import { parseTheForkEmail, THEFORK_UNKNOWN_TIME } from "../_shared/thefork-parser.ts";

const THEFORK_SOURCE = "TheFork";
const THEFORK_SLUG = "thefork";

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

    /* ---------- TheFork ---------- */
    const { data: forkChannel } = await supabaseAdmin
      .from("channels")
      .select("id")
      .eq("slug", THEFORK_SLUG)
      .maybeSingle();
    if (forkChannel) {
      const forkSince = new Date(Date.now() - LOOKBACK_DAYS * 24 * 60 * 60 * 1000);
      const forkSeqs = [...new Set([
        ...(await client.search(`SINCE ${imapDate(forkSince)} FROM "info-reservation@thefork.com"`)),
        ...(await client.search(`SINCE ${imapDate(forkSince)} FROM "lafourchette"`)),
      ])].sort((a, b) => a - b).slice(-MAX_MESSAGES);
      total += forkSeqs.length;

      for (const seq of forkSeqs) {
        try {
          const email = parseRawEmail(await client.fetchRaw(seq));
          const parsed = parseTheForkEmail(email.subject, email.html, email.text);
          if (!parsed) { skipped += 1; continue; }

          const { data: existing } = await supabaseAdmin
            .from("reservations")
            .select("id, status")
            .eq("source", THEFORK_SOURCE)
            .eq("external_id", parsed.externalId)
            .maybeSingle();

          const base = {
            channel_id: forkChannel.id,
            customer_name: parsed.customerName,
            customer_phone: parsed.customerPhone,
            customer_email: parsed.customerEmail,
            reservation_date: parsed.date,
            guests_count: parsed.guests,
            status: parsed.cancelled ? "cancelled" : "confirmed",
            source: THEFORK_SOURCE,
            external_id: parsed.externalId,
          };

          if (existing) {
            // Never overwrite manual edits: only apply a cancellation.
            if (!parsed.cancelled || ["cancelled", "show", "no_show"].includes(existing.status ?? "")) { skipped += 1; continue; }
            const { error } = await supabaseAdmin.from("reservations").update({ status: "cancelled" }).eq("id", existing.id);
            if (error) { console.error("thefork update", error.message); skipped += 1; continue; }
            updated += 1;
          } else {
            const { error } = await supabaseAdmin.from("reservations").insert({
              ...base,
              reservation_time: parsed.time ?? THEFORK_UNKNOWN_TIME,
            });
            if (error) { console.error("thefork insert", error.message); skipped += 1; continue; }
            imported += 1;
          }
        } catch (err) {
          console.error("TheFork message error", seq, err);
          skipped += 1;
        }
      }
    }





    const since = new Date(Date.now() - LOOKBACK_DAYS * 24 * 60 * 60 * 1000);
    let sequences = await client.search(`SINCE ${imapDate(since)} FROM "opentable"`);
    if (sequences.length === 0) {
      sequences = await client.search(`SINCE ${imapDate(since)} SUBJECT "OpenTable"`);
    }

    const recent = sequences.slice(-MAX_MESSAGES);
    total += recent.length;

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
        .select("id, notes, status")
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
        // Never overwrite manual edits: only apply a cancellation.
        if (!parsed.cancelled || ["cancelled", "show", "no_show"].includes(existing.status ?? "")) {
          notesKept += 1;
          skipped += 1;
          continue;
        }
        const patch = { status: "cancelled" };
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
