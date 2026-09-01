import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";
import { htmlToText, parseOpenTableEmail } from "../_shared/opentable-parser.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const OPENTABLE_SOURCE = "OpenTable";
const CHANNEL_SLUG = "opentable";

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  const json = (data: unknown, status = 200) =>
    new Response(JSON.stringify(data), {
      status,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader) return json({ error: "unauthorized" }, 401);

    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
      { global: { headers: { Authorization: authHeader } }, auth: { persistSession: false } },
    );

    const { data: userData, error: userError } = await supabaseAdmin.auth.getUser();
    if (userError || !userData.user) return json({ error: "unauthorized" }, 401);

    const { data: isAdmin, error: roleError } = await supabaseAdmin.rpc("has_role", {
      _user_id: userData.user.id,
      _role: "admin",
    });
    if (roleError || !isAdmin) return json({ error: "forbidden" }, 403);

    const { subject = "", html = "", text = "" } = await req.json();
    if (!subject && !html && !text) {
      return json({ error: "subject, html or text required" }, 400);
    }

    const body = text && text.trim().length > 20 ? text : htmlToText(html);
    const parsed = parseOpenTableEmail(subject, body);
    if (!parsed) {
      return json({ ok: false, reason: "unparsed", subject }, 422);
    }

    const { data: channel } = await supabaseAdmin
      .from("channels")
      .select("id")
      .eq("slug", CHANNEL_SLUG)
      .maybeSingle();
    if (!channel) return json({ error: "canal OpenTable introuvable" }, 500);

    const externalId = parsed.externalId ??
      `${parsed.customerName.toLowerCase().replace(/\s+/g, "-")}-${parsed.date}-${parsed.time}`;

    const { data: existing } = await supabaseAdmin
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
      const { error } = await supabaseAdmin.from("reservations").update(record).eq("id", existing.id);
      if (error) return json({ error: error.message }, 500);
      return json({ ok: true, action: "updated", externalId, parsed });
    }

    const { error } = await supabaseAdmin.from("reservations").insert(record);
    if (error) return json({ error: error.message }, 500);
    return json({ ok: true, action: "created", externalId, parsed });
  } catch (err) {
    console.error("manual-opentable-import error:", err);
    return json({ error: String((err as Error).message ?? err) }, 500);
  }
});
