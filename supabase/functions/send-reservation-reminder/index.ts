import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@4.0.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const RESTAURANT_EMAIL = "princepalace.champselysees@gmail.com";
const BRAND_NAME = "Prince Palace";
const FROM_EMAIL = `${BRAND_NAME} <confirmation@xn--rservation-prince-palace-bfc.fr>`;
const BASE_URL = "https://xn--rservation-prince-palace-bfc.fr";
const LOGO_URL = "https://vedistbhwfdtkjaojycs.supabase.co/storage/v1/object/public/email-assets/prince-palace-logo-thankyou.png";

function formatFrenchDate(dateStr: string): string {
  const [y, m, d] = dateStr.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d)).toLocaleDateString("fr-FR", {
    timeZone: "UTC",
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function buildReminderHtml(opts: {
  customerName: string;
  date: string;
  time: string;
  guests: number;
  token: string;
}): string {
  const modifyUrl = `${BASE_URL}/reservation/modify/${opts.token}`;
  const cancelUrl = `${BASE_URL}/reservation/cancel/${opts.token}`;
  return `<!DOCTYPE html>
<html lang="fr">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:24px 16px;background-color:#0a0908;font-family:'DM Sans',system-ui,-apple-system,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background-color:#0a0908;">
<tr><td align="center">
<table width="720" cellpadding="0" cellspacing="0" style="max-width:720px;margin:0 auto;">

<tr><td align="center" style="background-color:#0d0b09;padding:36px 28px;border-radius:16px 16px 0 0;border:1px solid rgba(201,168,76,0.12);border-bottom:none;">
<img src="${LOGO_URL}" alt="${BRAND_NAME}" width="280" style="display:block;" />
</td></tr>

<tr><td align="center" style="background-color:#111111;padding:28px 28px 20px;border-left:1px solid rgba(201,168,76,0.12);border-right:1px solid rgba(201,168,76,0.12);">
<h1 style="font-size:20px;font-weight:600;color:#f2ede4;margin:0 0 6px;">Rappel de votre réservation</h1>
<p style="font-size:13.5px;color:#7a7268;margin:0;">${opts.customerName}, nous vous attendons demain</p>
</td></tr>

<tr><td style="background-color:#111111;padding:8px 28px 24px;border-left:1px solid rgba(201,168,76,0.12);border-right:1px solid rgba(201,168,76,0.12);">
<table cellpadding="0" cellspacing="0" width="100%" style="background-color:rgba(201,168,76,0.04);border:1px solid rgba(201,168,76,0.1);border-radius:10px;">
<tr><td style="padding:18px;">
<p style="color:#f2ede4;font-size:14.5px;line-height:1.9;margin:0;">
📅 <strong style="color:#c9a84c;">${formatFrenchDate(opts.date)}</strong><br/>
🕐 <strong style="color:#c9a84c;">${opts.time}</strong><br/>
👥 <strong style="color:#c9a84c;">${opts.guests} personne${opts.guests > 1 ? "s" : ""}</strong>
</p>
</td></tr>
</table>
</td></tr>

<tr><td align="center" style="background-color:#111111;padding:0 28px 28px;border-left:1px solid rgba(201,168,76,0.12);border-right:1px solid rgba(201,168,76,0.12);border-bottom:1px solid rgba(201,168,76,0.08);">
<a href="${modifyUrl}" target="_blank" style="display:inline-block;background-color:#c9a84c;color:#0d0b09;text-decoration:none;padding:13px 28px;border-radius:10px;font-size:14px;font-weight:600;margin:0 6px 8px;">Modifier ma réservation</a>
<a href="${cancelUrl}" target="_blank" style="display:inline-block;background-color:transparent;color:#c9a84c;border:1px solid rgba(201,168,76,0.4);text-decoration:none;padding:12px 28px;border-radius:10px;font-size:14px;font-weight:600;margin:0 6px 8px;">Annuler</a>
</td></tr>

<tr><td style="background-color:#0d0b09;padding:24px 28px;border-radius:0 0 16px 16px;border:1px solid rgba(201,168,76,0.12);border-top:none;" align="center">
<p style="font-size:11px;color:#4a4440;line-height:1.8;margin:0;">Prince Palace — 76 Av. des Champs-Élysées, 75008 Paris</p>
<p style="font-size:11px;color:#4a4440;line-height:1.8;margin:0;">01 59 13 32 68</p>
</td></tr>

</table>
</td></tr>
</table>
</body>
</html>`;
}

async function sendSms(to: string, body: string) {
  const accountSid = Deno.env.get("TWILIO_ACCOUNT_SID");
  const authToken = Deno.env.get("TWILIO_AUTH_TOKEN");
  const twilioPhone = Deno.env.get("TWILIO_PHONE_NUMBER");
  if (!accountSid || !authToken || !twilioPhone) {
    console.error("Twilio not configured");
    return;
  }
  const res = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`, {
    method: "POST",
    headers: {
      Authorization: "Basic " + btoa(`${accountSid}:${authToken}`),
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({ To: to, From: twilioPhone, Body: body }).toString(),
  });
  if (!res.ok) console.error("Twilio error:", await res.text());
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

    // "Now" in Paris, as an absolute timestamp reference
    const now = new Date();
    const parisOffsetMs = (() => {
      const utc = new Date(now.toLocaleString("en-US", { timeZone: "UTC" }));
      const paris = new Date(now.toLocaleString("en-US", { timeZone: "Europe/Paris" }));
      return paris.getTime() - utc.getTime();
    })();

    const toAbsolute = (date: string, time: string): Date => {
      const [h, mi] = time.split(":").map(Number);
      const [y, m, d] = date.split("-").map(Number);
      // Interpret the local Paris wall time as UTC, then remove the Paris offset
      return new Date(Date.UTC(y, m - 1, d, h, mi) - parisOffsetMs);
    };

    const horizonEnd = new Date(now.getTime() + 24 * 60 * 60 * 1000);
    const startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
    const endDate = new Date(now.getTime() + 48 * 60 * 60 * 1000).toISOString().slice(0, 10);

    const { data: reservations, error } = await supabase
      .from("reservations")
      .select("id, customer_name, customer_phone, customer_email, reservation_date, reservation_time, guests_count, created_at, modification_token")
      .eq("status", "confirmed")
      .eq("reminder_sent", false)
      .eq("is_duplicate", false)
      .gte("reservation_date", startDate)
      .lte("reservation_date", endDate);

    if (error) throw error;

    let sent = 0;

    for (const r of reservations || []) {
      const when = toAbsolute(r.reservation_date, r.reservation_time);
      if (when <= now) continue; // déjà passée
      if (when > horizonEnd) continue; // plus de 24h avant : trop tôt

      const createdAt = new Date(r.created_at);
      const leadTimeHours = (when.getTime() - createdAt.getTime()) / (60 * 60 * 1000);
      if (leadTimeHours < 30) continue; // réservation de dernière minute : pas de rappel

      const html = buildReminderHtml({
        customerName: r.customer_name,
        date: r.reservation_date,
        time: r.reservation_time,
        guests: r.guests_count,
        token: r.modification_token,
      });

      if (r.customer_email) {
        await resend.emails.send({
          from: FROM_EMAIL,
          to: [r.customer_email],
          bcc: [RESTAURANT_EMAIL],
          subject: `Rappel — votre réservation au ${BRAND_NAME}`,
          html,
        });
      }

      if (r.customer_phone) {
        await sendSms(
          r.customer_phone,
          `Cher(e) ${r.customer_name},\n\nRappel de votre réservation au Prince Palace :\n📅 ${formatFrenchDate(r.reservation_date)}\n🕐 ${r.reservation_time}\n👥 ${r.guests_count} personne${r.guests_count > 1 ? "s" : ""}\n\nModifier ou annuler : ${BASE_URL}/reservation/modify/${r.modification_token}\n\nÀ très bientôt,\nL'équipe du Prince Palace`,
        );
      }

      await supabase.from("reservations").update({ reminder_sent: true }).eq("id", r.id);
      sent++;
    }

    console.log(`Reminders sent: ${sent}`);
    return new Response(JSON.stringify({ success: true, sent }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error("Error in send-reservation-reminder:", error);
    return new Response(JSON.stringify({ success: false, error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }
};

serve(handler);
