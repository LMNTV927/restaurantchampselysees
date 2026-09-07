import { createClient } from "npm:@supabase/supabase-js@2";
import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";
import { cleanText, isValidTime, isValidDate } from "../_shared/validation.ts";

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });

const PUBLIC_FIELDS =
  "id, customer_name, customer_phone, customer_email, reservation_date, reservation_time, guests_count, notes, status, channel_id";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const body = await req.json().catch(() => null);
    if (!body) return json({ error: "Requête invalide" }, 400);

    const token = String(body.token ?? "");
    const action = String(body.action ?? "get");
    if (!/^[0-9a-f-]{36}$/i.test(token)) return json({ error: "Lien invalide" }, 400);

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    const { data: reservation } = await supabase
      .from("reservations")
      .select(PUBLIC_FIELDS)
      .eq("modification_token", token)
      .maybeSingle();

    if (!reservation) return json({ error: "Réservation introuvable ou lien expiré" }, 404);

    if (action === "get") return json({ reservation });

    if (reservation.status === "cancelled") {
      return json({ error: "Cette réservation a déjà été annulée" }, 409);
    }

    if (action === "cancel") {
      const { error } = await supabase
        .from("reservations")
        .update({ status: "cancelled" })
        .eq("modification_token", token);
      if (error) return json({ error: "Annulation impossible" }, 500);
      return json({ reservation: { ...reservation, status: "cancelled" } });
    }

    if (action === "update") {
      const date = String(body.reservation_date ?? "");
      const time = String(body.reservation_time ?? "");
      const guests = Number(body.guests_count ?? 0);
      const notes = body.notes ? cleanText(String(body.notes)).slice(0, 1000) : null;

      if (!isValidDate(date)) return json({ error: "Date invalide" }, 400);
      if (!isValidTime(time)) return json({ error: "Horaire invalide (17:00 – 05:00)" }, 400);
      if (!Number.isInteger(guests) || guests < 1 || guests > 500) {
        return json({ error: "Nombre de convives invalide" }, 400);
      }

      const { error } = await supabase
        .from("reservations")
        .update({
          reservation_date: date,
          reservation_time: time,
          guests_count: guests,
          notes,
        })
        .eq("modification_token", token);
      if (error) return json({ error: "Modification impossible" }, 500);

      return json({
        reservation: {
          ...reservation,
          reservation_date: date,
          reservation_time: time,
          guests_count: guests,
          notes,
        },
      });
    }

    return json({ error: "Action inconnue" }, 400);
  } catch (e) {
    console.error(e);
    return json({ error: "Erreur serveur" }, 500);
  }
});
