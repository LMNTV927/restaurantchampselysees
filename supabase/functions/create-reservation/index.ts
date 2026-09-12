import { createClient } from "npm:@supabase/supabase-js@2";
import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";
import { cleanText, normalizePhone, normalizeEmail, isValidTime, isValidDate } from "../_shared/validation.ts";

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const body = await req.json().catch(() => null);
    if (!body || typeof body !== "object") return json({ error: "Requête invalide" }, 400);

    const channelId = String(body.channel_id ?? "");
    const name = cleanText(String(body.customer_name ?? ""));
    const phone = normalizePhone(String(body.customer_phone ?? ""));
    const email = normalizeEmail(body.customer_email);
    const date = String(body.reservation_date ?? "");
    const time = String(body.reservation_time ?? "");
    const guests = Number(body.guests_count ?? 0);
    const notes = body.notes ? cleanText(String(body.notes)).slice(0, 1000) : null;

    if (!/^[0-9a-f-]{36}$/i.test(channelId)) return json({ error: "Canal invalide" }, 400);
    if (name.length < 2 || name.length > 120) return json({ error: "Nom invalide" }, 400);
    if (!phone) return json({ error: "Numéro de téléphone invalide" }, 400);
    if (email.invalid) return json({ error: "Adresse e-mail invalide" }, 400);
    if (!isValidDate(date)) return json({ error: "Date invalide" }, 400);
    if (!isValidTime(time)) return json({ error: "Horaire invalide (17:00 – 05:00)" }, 400);
    if (!Number.isInteger(guests) || guests < 1 || guests > 500) return json({ error: "Nombre de convives invalide" }, 400);

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    const { data: channel } = await supabase
      .from("channels")
      .select("id, name")
      .eq("id", channelId)
      .eq("is_active", true)
      .maybeSingle();
    if (!channel) return json({ error: "Canal introuvable" }, 400);

    // Duplicate guard: same phone + same date already booked.
    // La réservation la plus récente est toujours celle qui compte : on insère
    // la nouvelle comme valide et on marque les précédentes comme doublons.
    const { data: existing } = await supabase
      .from("reservations")
      .select("id")
      .eq("customer_phone", phone)
      .eq("reservation_date", date)
      .eq("is_duplicate", false)
      .neq("status", "cancelled");

    const { data: inserted, error } = await supabase
      .from("reservations")
      .insert({
        channel_id: channelId,
        reservation_date: date,
        reservation_time: time,
        guests_count: guests,
        customer_name: name,
        customer_phone: phone,
        customer_email: email.value,
        notes,
        is_duplicate: false,
        duplicate_of: null,
      })
      .select("id, modification_token")
      .single();

    if (error) {
      console.error("insert error", error);
      return json({ error: "Enregistrement impossible" }, 500);
    }

    if (existing && existing.length > 0) {
      await supabase
        .from("reservations")
        .update({ is_duplicate: true, duplicate_of: inserted.id, reminder_sent: true })
        .in("id", existing.map((r) => r.id));
    }


    return json({
      id: inserted.id,
      modification_token: inserted.modification_token,
      channel_name: channel.name,
      customer_phone: phone,
      customer_email: email.value,
    });
  } catch (e) {
    console.error(e);
    return json({ error: "Erreur serveur" }, 500);
  }
});
