import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { messages } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    // Fetch restaurant data from Supabase
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Fetch channels
    const { data: channels } = await supabase.from("channels").select("*").eq("is_active", true);

    // Fetch recent reservations (last 90 days)
    const ninetyDaysAgo = new Date();
    ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);
    const { data: reservations } = await supabase
      .from("reservations")
      .select("*")
      .gte("reservation_date", ninetyDaysAgo.toISOString().split("T")[0])
      .order("reservation_date", { ascending: false });

    // Fetch channel stats (last 90 days)
    const { data: channelStats } = await supabase
      .from("channel_stats")
      .select("*, channels(name, slug)")
      .gte("date", ninetyDaysAgo.toISOString().split("T")[0])
      .order("date", { ascending: false });

    // Build context
    const today = new Date().toISOString().split("T")[0];
    const totalReservations = reservations?.length || 0;
    const confirmedCount = reservations?.filter(r => r.status === "confirmed").length || 0;
    const cancelledCount = reservations?.filter(r => r.status === "cancelled").length || 0;
    const totalCovers = reservations?.reduce((sum, r) => sum + (r.guests_count || 0), 0) || 0;
    const avgCovers = totalReservations > 0 ? (totalCovers / totalReservations).toFixed(1) : 0;

    // Today's reservations
    const todayReservations = reservations?.filter(r => r.reservation_date === today) || [];
    const todayCount = todayReservations.length;
    const todayCovers = todayReservations.reduce((sum, r) => sum + (r.guests_count || 0), 0);
    const todayDetails = todayReservations.length > 0
      ? todayReservations.map(r => `  - ${r.customer_name}, ${r.guests_count} couverts à ${r.reservation_time} (${r.status})`).join("\n")
      : "  Aucune réservation aujourd'hui.";

    // Stats per channel
    const channelSummaries = (channels || []).map(ch => {
      const stats = (channelStats || []).filter(s => s.channel_id === ch.id);
      const totalClicks = stats.reduce((sum, s) => sum + (s.clicks || 0), 0);
      const totalRes = stats.reduce((sum, s) => sum + (s.reservations || 0), 0);
      const totalCov = stats.reduce((sum, s) => sum + (s.total_covers || 0), 0);
      const conversionRate = totalClicks > 0 ? ((totalRes / totalClicks) * 100).toFixed(1) : "N/A";
      return `- ${ch.name} (${ch.slug}): ${totalClicks} clics, ${totalRes} réservations, ${totalCov} couverts, taux conversion: ${conversionRate}%`;
    }).join("\n");

    // Reservations par jour de la semaine
    const dayNames = ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"];
    const byDay: Record<string, number> = {};
    reservations?.forEach(r => {
      const day = dayNames[new Date(r.reservation_date).getDay()];
      byDay[day] = (byDay[day] || 0) + 1;
    });
    const dayBreakdown = Object.entries(byDay)
      .sort((a, b) => b[1] - a[1])
      .map(([day, count]) => `- ${day}: ${count} réservations`)
      .join("\n");

    // Horaires populaires
    const byTime: Record<string, number> = {};
    reservations?.forEach(r => {
      byTime[r.reservation_time] = (byTime[r.reservation_time] || 0) + 1;
    });
    const timeBreakdown = Object.entries(byTime)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([time, count]) => `- ${time}: ${count} réservations`)
      .join("\n");

    const systemPrompt = `Tu es l'assistant IA du restaurant Prince Palace, situé au 76 Av. des Champs-Élysées, 75008 Paris. Tu aides l'équipe de management à analyser les performances, optimiser les résultats et prendre des décisions stratégiques.

Date d'aujourd'hui: ${today}

=== AUJOURD'HUI (${today}) ===
📌 Réservations aujourd'hui: ${todayCount}
📌 Couverts aujourd'hui: ${todayCovers}
${todayDetails}

=== DONNÉES DU RESTAURANT (90 derniers jours) ===

📊 RÉSUMÉ GLOBAL:
- Total réservations: ${totalReservations}
- Confirmées: ${confirmedCount}
- Annulées: ${cancelledCount}
- Total couverts: ${totalCovers}
- Moyenne couverts/réservation: ${avgCovers}

📢 PERFORMANCE PAR CANAL:
${channelSummaries}

📅 RÉSERVATIONS PAR JOUR DE LA SEMAINE:
${dayBreakdown}

⏰ HORAIRES LES PLUS POPULAIRES:
${timeBreakdown}

=== INSTRUCTIONS ===
- Sois **bref et concis**. Va droit à l'essentiel. Évite les longues introductions et conclusions.
- Limite tes réponses à 3-5 points maximum, sauf si on te demande explicitement plus de détails.
- Réponds toujours en français.
- Base tes analyses sur les données réelles ci-dessus.
- Utilise des émojis pour rendre tes réponses visuelles.
- Si on te demande des comparaisons, utilise des pourcentages et des tendances.
- Suggère 1-2 pistes d'amélioration max, pas plus.
- Formate en markdown.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Trop de requêtes, réessayez dans quelques instants." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Crédits IA épuisés. Ajoutez des crédits dans les paramètres." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(JSON.stringify({ error: "Erreur du service IA" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("ai-assistant error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Erreur inconnue" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
