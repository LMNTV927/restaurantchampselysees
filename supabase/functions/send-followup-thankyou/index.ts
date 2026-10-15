import { isStaff, unauthorized, guardReservationBody } from "../_shared/guard.ts";
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@4.0.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const GOOGLE_REVIEW_LINK = "https://g.page/r/CWh1Fw303_ybEAE/review";
const RESTAURANT_EMAIL = "princepalace.champselysees@gmail.com";
const BRAND_NAME = "Prince Palace";
const FROM_EMAIL = `${BRAND_NAME} <confirmation@restaurantchampselysees.fr>`;
const LOGO_URL = "https://vedistbhwfdtkjaojycs.supabase.co/storage/v1/object/public/email-assets/prince-palace-logo-thankyou.png";

function buildThankYouEmailHtml(customerName: string): string {
  return `<!DOCTYPE html>
<html lang="fr">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">
<link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
</head>
<body style="margin:0;padding:0;background-color:#0a0908;font-family:'DM Sans',system-ui,-apple-system,sans-serif;padding:24px 16px;">
<table width="100%" cellpadding="0" cellspacing="0" style="background-color:#0a0908;">
<tr><td align="center">
<table width="720" cellpadding="0" cellspacing="0" style="max-width:720px;margin:0 auto;">

<!-- Logo -->
<tr><td align="center" style="background-color:#0d0b09;padding:36px 28px;border-radius:16px 16px 0 0;border:1px solid rgba(201,168,76,0.12);border-bottom:none;">
<img src="${LOGO_URL}" alt="${BRAND_NAME}" width="280" style="display:block;" />
</td></tr>

<!-- Star icon + Title -->
<tr><td align="center" style="background-color:#111111;padding:28px 28px 24px;border-left:1px solid rgba(201,168,76,0.12);border-right:1px solid rgba(201,168,76,0.12);border-bottom:1px solid rgba(201,168,76,0.08);">
<table cellpadding="0" cellspacing="0"><tr><td align="center" style="width:48px;height:48px;border-radius:50%;background-color:rgba(201,168,76,0.1);border:1px solid rgba(201,168,76,0.25);text-align:center;">
<span style="font-size:22px;color:#c9a84c;line-height:48px;">⭐</span>
</td></tr></table>
<h1 style="font-size:20px;font-weight:600;color:#f2ede4;margin:14px 0 4px;font-family:'DM Sans',system-ui,sans-serif;">Merci pour votre visite !</h1>
<p style="font-size:13.5px;color:#7a7268;font-weight:400;margin:0;">${customerName}, votre avis compte pour nous</p>
</td></tr>

<!-- Message -->
<tr><td style="background-color:#111111;padding:24px 28px;border-left:1px solid rgba(201,168,76,0.12);border-right:1px solid rgba(201,168,76,0.12);border-bottom:1px solid rgba(201,168,76,0.08);">
<table cellpadding="0" cellspacing="0" width="100%" style="background-color:rgba(201,168,76,0.04);border:1px solid rgba(201,168,76,0.1);border-radius:10px;padding:18px;">
<tr><td style="padding:18px;">
<p style="color:#f2ede4;font-size:14.5px;line-height:1.7;margin:0 0 12px;">Toute l'équipe du <strong style="color:#c9a84c;">${BRAND_NAME}</strong> vous remercie chaleureusement pour votre visite.</p>
<p style="color:#f2ede4;font-size:14.5px;line-height:1.7;margin:0;">Nous espérons que vous avez passé un agréable moment. Si vous avez apprécié votre expérience, nous serions ravis que vous partagiez votre ressenti sur Google.</p>
</td></tr>
</table>
</td></tr>

<!-- CTA Button -->
<tr><td align="center" style="background-color:#111111;padding:20px 28px 28px;border-left:1px solid rgba(201,168,76,0.12);border-right:1px solid rgba(201,168,76,0.12);border-bottom:1px solid rgba(201,168,76,0.08);">
<a href="${GOOGLE_REVIEW_LINK}" target="_blank" style="display:inline-block;background-color:#c9a84c;color:#0d0b09;text-decoration:none;padding:14px 36px;border-radius:10px;font-size:14px;font-weight:600;font-family:'DM Sans',system-ui,sans-serif;">
⭐ Laisser un avis sur Google
</a>
</td></tr>

<!-- Footer -->
<tr><td style="background-color:#0d0b09;padding:24px 28px;border-radius:0 0 16px 16px;border:1px solid rgba(201,168,76,0.12);border-top:none;">
<table cellpadding="0" cellspacing="0" width="100%">
<tr><td align="center" style="padding-bottom:16px;">
<a href="https://www.instagram.com/princepalace_off/" target="_blank" style="display:inline-block;text-decoration:none;"><img src="https://cdn-icons-png.flaticon.com/512/174/174855.png" width="20" height="20" alt="Instagram" style="opacity:0.5;" /></a>
&nbsp;&nbsp;&nbsp;
<a href="https://www.facebook.com/leprincepalace75" target="_blank" style="display:inline-block;text-decoration:none;"><img src="https://cdn-icons-png.flaticon.com/512/174/174848.png" width="20" height="20" alt="Facebook" style="opacity:0.5;" /></a>
&nbsp;&nbsp;&nbsp;
<a href="https://www.tiktok.com/@59princepalace" target="_blank" style="display:inline-block;text-decoration:none;"><img src="https://cdn-icons-png.flaticon.com/512/3046/3046121.png" width="20" height="20" alt="TikTok" style="opacity:0.5;" /></a>
</td></tr>
<tr><td align="center">
<p style="font-size:11px;color:#4a4440;line-height:1.8;margin:0;"><a href="https://princepalace.fr" style="color:#7a7268;text-decoration:underline;text-underline-offset:2px;">princepalace.fr</a></p>
<p style="font-size:11px;color:#4a4440;line-height:1.8;margin:0;">Prince Palace — 76 Av. des Champs-Élysées, 75008 Paris</p>
</td></tr>
</table>
</td></tr>

</table>
</td></tr>
</table>
</body>
</html>`;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  if (!(await isStaff(req))) return unauthorized(corsHeaders);
  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get current time in Paris
    const now = new Date();
    const parisFormatter = new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Paris', year: 'numeric', month: '2-digit', day: '2-digit' });
    const parisTimeFormatter = new Intl.DateTimeFormat('fr-FR', { timeZone: 'Europe/Paris', hour: '2-digit', minute: '2-digit', hour12: false });
    
    const parisDate = parisFormatter.format(now);
    const parisTime = parisTimeFormatter.format(now);
    const [parisHour, parisMinute] = parisTime.split(':').map(Number);

    // Calculate 3 hours ago
    const threeHoursAgoMinutes = (parisHour * 60 + parisMinute) - 180;

    // Fetch eligible reservations: confirmed, not yet sent, today or before
    const { data: reservations, error } = await supabase
      .from('reservations')
      .select('id, customer_name, customer_email, reservation_date, reservation_time')
      .eq('status', 'confirmed')
      .eq('followup_sent', false)
      .not('customer_email', 'is', null)
      .lte('reservation_date', parisDate);

    if (error) throw error;

    let sentCount = 0;

    for (const reservation of reservations || []) {
      const [resHour, resMinute] = reservation.reservation_time.split(':').map(Number);
      const resMinutes = resHour * 60 + resMinute;

      // If reservation is today, check if 3h have passed
      if (reservation.reservation_date === parisDate) {
        if (resMinutes > threeHoursAgoMinutes) continue; // Not yet 3h
      }
      // If reservation is before today, it's definitely past 3h

      if (!reservation.customer_email) continue;

      const html = buildThankYouEmailHtml(reservation.customer_name);

      // Send to customer
      await resend.emails.send({
        from: FROM_EMAIL,
        to: [reservation.customer_email],
        subject: `Merci pour votre visite — ${BRAND_NAME}`,
        html,
      });

      // Send copy to restaurant
      await resend.emails.send({
        from: FROM_EMAIL,
        to: [RESTAURANT_EMAIL],
        subject: `[Suivi] Remerciement envoyé à ${reservation.customer_name}`,
        html,
      });

      // Mark as sent
      await supabase
        .from('reservations')
        .update({ followup_sent: true })
        .eq('id', reservation.id);

      sentCount++;
    }

    console.log(`Followup emails sent: ${sentCount}`);

    return new Response(JSON.stringify({ success: true, sent: sentCount }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error("Error in send-followup-thankyou:", error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
};

serve(handler);
