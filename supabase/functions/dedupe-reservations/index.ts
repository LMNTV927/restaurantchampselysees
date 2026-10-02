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
      .select("id, customer_phone, customer_name, reservation_date, reservation_time, created_at, is_duplicate, duplicate_of, status, notes, dedupe_ignored")
      .neq("status", "cancelled")
      .gte("reservation_date", today);

    if (error) throw error;

    const hasNotes = (r: any) => !!(r.notes && String(r.notes).trim().length > 0);
    const toMinutes = (time: string | null): number => {
      if (!time) return 0;
      const [h, m] = String(time).split(":");
      return (parseInt(h, 10) || 0) * 60 + (parseInt(m, 10) || 0);
    };

    // Regroupement par téléphone normalisé + date (les lignes ignorées volontairement sont écartées)
    const groups = new Map<string, any[]>();
    for (const r of reservations || []) {
      if (r.dedupe_ignored) continue;
      const phone = normalizePhone(r.customer_phone);
      if (!phone) continue;
      const key = `${phone}|${r.reservation_date}`;
      if (!groups.has(key)) groups.set(key, []);
      groups.get(key)!.push(r);
    }

    const toMarkDuplicate: { id: string; duplicate_of: string; notes?: string }[] = [];
    const toRestore: string[] = [];
    const noteMerges = new Map<string, string>();

    const handleCluster = (cluster: any[]) => {
      if (cluster.length === 1) {
        if (cluster[0].is_duplicate) toRestore.push(cluster[0].id);
        return;
      }

      // On garde la réservation créée le plus récemment.
      const keep = cluster.reduce((a, b) =>
        new Date(b.created_at).getTime() > new Date(a.created_at).getTime() ? b : a,
      );
      if (keep.is_duplicate) toRestore.push(keep.id);

      for (const r of cluster) {
        if (r.id === keep.id) continue;

        // Aucun commentaire perdu : on le recopie sur la réservation conservée.
        if (hasNotes(r)) {
          const existing = (noteMerges.get(keep.id) ?? keep.notes ?? "").trim();
          const incoming = String(r.notes).trim();
          if (!existing) noteMerges.set(keep.id, incoming);
          else if (!existing.includes(incoming)) noteMerges.set(keep.id, `${existing}\n${incoming}`);
        }

        if (!r.is_duplicate || r.duplicate_of !== keep.id) {
          toMarkDuplicate.push({ id: r.id, duplicate_of: keep.id });
        }
      }
    };

    for (const group of groups.values()) {
      // Fenêtre horaire : seules les réservations à moins de 3h d'écart sont candidates.
      const sorted = [...group].sort((a, b) => toMinutes(a.reservation_time) - toMinutes(b.reservation_time));
      let cluster: any[] = [];
      for (const r of sorted) {
        if (cluster.length === 0) {
          cluster.push(r);
          continue;
        }
        const last = cluster[cluster.length - 1];
        if (Math.abs(toMinutes(r.reservation_time) - toMinutes(last.reservation_time)) < 180) {
          cluster.push(r);
        } else {
          handleCluster(cluster);
          cluster = [r];
        }
      }
      if (cluster.length > 0) handleCluster(cluster);
    }

    for (const [keepId, mergedNotes] of noteMerges.entries()) {
      await supabase.from("reservations").update({ notes: mergedNotes }).eq("id", keepId);
    }

    for (const item of toMarkDuplicate) {

      await supabase
        .from("reservations")
        .update({ is_duplicate: true, duplicate_of: item.duplicate_of })
        .eq("id", item.id);
    }


    if (toRestore.length > 0) {
      await supabase
        .from("reservations")
        .update({ is_duplicate: false, duplicate_of: null })
        .in("id", Array.from(new Set(toRestore)));
    }


    console.log(`Dedupe: ${toMarkDuplicate.length} marquées, ${toRestore.length} restaurées, ${noteMerges.size} commentaires fusionnés`);



    return new Response(
      JSON.stringify({ success: true, marked: toMarkDuplicate.length, restored: Array.from(new Set(toRestore)).length, notesMerged: noteMerges.size }),
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
