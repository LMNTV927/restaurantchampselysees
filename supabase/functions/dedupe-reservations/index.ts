import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

/** Normalise un numéro FR en E.164 approximatif pour comparaison */
function normalizePhone(raw: string | null): string | null {
  if (!raw) return null;
  let p = raw.replace(/[^\d+]/g, "");
  if (p.startsWith("00")) p = "+" + p.slice(2);
  if (p.startsWith("0") && p.length === 10) p = "+33" + p.slice(1);
  if (!p.startsWith("+") && p.length === 9) p = "+33" + p;
  if (!p.startsWith("+") && p.startsWith("33")) p = "+" + p;
  // On compare sur les 9 derniers chiffres (numéro national)
  const digits = p.replace(/\D/g, "");
  return digits.length >= 9 ? digits.slice(-9) : digits;
}




const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    const today = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().slice(0, 10);

    const { data: reservations, error } = await supabase
      .from("reservations")
      .select("id, customer_phone, customer_name, reservation_date, reservation_time, created_at, is_duplicate, duplicate_of, status")
      .neq("status", "cancelled")
      .gte("reservation_date", today);

    if (error) throw error;

    // Regroupement par téléphone normalisé + date
    const groups = new Map<string, typeof reservations>();
    for (const r of reservations || []) {
      const phone = normalizePhone(r.customer_phone);
      if (!phone) continue;
      const key = `${phone}|${r.reservation_date}`;
      if (!groups.has(key)) groups.set(key, [] as any);
      groups.get(key)!.push(r);
    }

    const toMarkDuplicate: { id: string; duplicate_of: string }[] = [];
    const toRestore: string[] = [];

    for (const group of groups.values()) {
      if (group.length === 1) {
        // Plus de doublon : restaurer si marquée à tort
        if (group[0].is_duplicate) toRestore.push(group[0].id);
        continue;
      }

      // Même téléphone + même date = doublon, quel que soit l'écart d'horaire.
      // On garde la réservation créée le plus récemment.
      const keep = group.reduce((a, b) =>
        new Date(b.created_at).getTime() > new Date(a.created_at).getTime() ? b : a,
      );
      if (keep.is_duplicate) toRestore.push(keep.id);
      for (const r of group) {
        if (r.id === keep.id) continue;
        if (!r.is_duplicate || r.duplicate_of !== keep.id) {
          toMarkDuplicate.push({ id: r.id, duplicate_of: keep.id });
        }
      }
    }


    for (const item of toMarkDuplicate) {
      await supabase
        .from("reservations")
        .update({ is_duplicate: true, duplicate_of: item.duplicate_of, reminder_sent: true })
        .eq("id", item.id);
    }

    if (toRestore.length > 0) {
      await supabase
        .from("reservations")
        .update({ is_duplicate: false, duplicate_of: null })
        .in("id", toRestore);
    }

    console.log(`Dedupe: ${toMarkDuplicate.length} marquées, ${toRestore.length} restaurées`);

    return new Response(
      JSON.stringify({ success: true, marked: toMarkDuplicate.length, restored: toRestore.length }),
      { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } },
    );
  } catch (error: any) {
    console.error("Error in dedupe-reservations:", error);
    return new Response(JSON.stringify({ success: false, error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }
};

serve(handler);
