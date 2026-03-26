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
const FROM_EMAIL = `${BRAND_NAME} <confirmation@xn--rservation-prince-palace-bfc.fr>`;
const LOGO_URL = "https://dd89562d-9168-4ff4-946e-c0abb6097cdc.lovableproject.com/prince-palace-logo-new.png";

function buildThankYouEmailHtml(customerName: string): string {
  return `<!DOCTYPE html>
<html lang="fr">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background-color:#000000;font-family:Georgia,'Times New Roman',serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background-color:#000000;padding:40px 20px;">
<tr><td align="center">
<table width="600" cellpadding="0" cellspacing="0" style="background-color:#0a0a0a;border:1px solid #c9a84c;border-radius:8px;">

<!-- Logo -->
<tr><td align="center" style="padding:30px 20px 10px;">
<img src="${LOGO_URL}" alt="${BRAND_NAME}" width="160" style="display:block;" />
</td></tr>

<!-- Divider -->
<tr><td align="center" style="padding:0 40px;">
<hr style="border:none;border-top:1px solid #c9a84c;margin:10px 0 20px;" />
</td></tr>

<!-- Title -->
<tr><td align="center" style="padding:0 30px;">
<h1 style="color:#c9a84c;font-size:24px;margin:0 0 10px;font-weight:normal;font-family:Georgia,'Times New Roman',serif;">
Merci pour votre visite !
</h1>
</td></tr>

<!-- Message -->
<tr><td style="padding:20px 40px;color:#ffffff;font-size:15px;line-height:1.7;">
<p style="margin:0 0 15px;">Cher(e) ${customerName},</p>
<p style="margin:0 0 15px;">Toute l'équipe du <strong style="color:#c9a84c;">${BRAND_NAME}</strong> vous remercie chaleureusement pour votre visite. Nous espérons que vous avez passé un agréable moment.</p>
<p style="margin:0 0 25px;">Votre avis compte beaucoup pour nous ! Si vous avez apprécié votre expérience, nous serions ravis que vous partagiez votre ressenti sur Google.</p>
</td></tr>

<!-- CTA Button -->
<tr><td align="center" style="padding:0 40px 30px;">
<a href="${GOOGLE_REVIEW_LINK}" target="_blank" style="display:inline-block;background-color:#c9a84c;color:#000000;text-decoration:none;padding:14px 32px;border-radius:6px;font-size:15px;font-weight:bold;font-family:Georgia,'Times New Roman',serif;">
⭐ Laisser un avis sur Google
</a>
</td></tr>

<!-- Divider -->
<tr><td align="center" style="padding:0 40px;">
<hr style="border:none;border-top:1px solid #c9a84c;margin:0 0 20px;" />
</td></tr>

<!-- Social Links -->
<tr><td align="center" style="padding:0 20px 20px;">
<table cellpadding="0" cellspacing="0"><tr>
<td style="padding:0 8px;"><a href="https://www.instagram.com/princepalace_off/" target="_blank" style="color:#c9a84c;text-decoration:none;font-size:13px;">Instagram</a></td>
<td style="color:#c9a84c;">•</td>
<td style="padding:0 8px;"><a href="https://www.facebook.com/leprincepalace75?locale=fr_FR" target="_blank" style="color:#c9a84c;text-decoration:none;font-size:13px;">Facebook</a></td>
<td style="color:#c9a84c;">•</td>
<td style="padding:0 8px;"><a href="https://www.tiktok.com/@59princepalace" target="_blank" style="color:#c9a84c;text-decoration:none;font-size:13px;">TikTok</a></td>
</tr></table>
</td></tr>

<!-- Footer -->
<tr><td align="center" style="padding:0 20px 25px;">
<p style="color:#666666;font-size:11px;margin:0;font-family:Arial,sans-serif;">
${BRAND_NAME} — 16 Rue de Marignan, 75008 Paris
</p>
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
