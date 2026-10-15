import { isStaff, unauthorized, guardReservationBody } from "../_shared/guard.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await guardReservationBody(req);
    if (!body) return unauthorized(corsHeaders);
    const { customerName, customerPhone, restaurantName, reservationDate, reservationTime, guestsCount, type } = body;

    if (!customerPhone) {
      return new Response(JSON.stringify({ error: 'Phone number is required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const accountSid = Deno.env.get('TWILIO_ACCOUNT_SID');
    const authToken = Deno.env.get('TWILIO_AUTH_TOKEN');
    const twilioPhone = Deno.env.get('TWILIO_PHONE_NUMBER');

    if (!accountSid || !authToken || !twilioPhone) {
      console.error('Missing Twilio credentials');
      return new Response(JSON.stringify({ error: 'Twilio not configured' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    let message: string;

    if (type === 'cancellation') {
      message = `Cher(e) ${customerName},\n\nVotre réservation au Prince Palace le ${reservationDate} à ${reservationTime} pour ${guestsCount} personnes a bien été annulée.\n\nNous espérons vous revoir bientôt !\n\nPour toute question, contactez-nous au 01 59 13 32 68.\n\nL'équipe du Prince Palace`;
    } else if (type === 'modification') {
      message = `Cher(e) ${customerName},\n\nVotre réservation au Prince Palace a été modifiée :\n📅 ${reservationDate}\n🕐 ${reservationTime}\n👥 ${guestsCount} personnes\n\nNous avons hâte de vous accueillir !\n\nPour toute question, contactez-nous au 01 59 13 32 68.\n\nL'équipe du Prince Palace`;
    } else {
      message = `Cher(e) ${customerName},\n\nMerci pour votre réservation au Prince Palace le ${reservationDate} à ${reservationTime} pour ${guestsCount} personnes. Nous avons hâte de vous accueillir !\n\nPour toute question, contactez-nous au 01 59 13 32 68.\n\nÀ bientôt,\n\nL'équipe du Prince Palace`;
    }

    const twilioUrl = `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`;

    const body = new URLSearchParams({
      To: customerPhone,
      From: twilioPhone,
      Body: message,
    });

    const response = await fetch(twilioUrl, {
      method: 'POST',
      headers: {
        'Authorization': 'Basic ' + btoa(`${accountSid}:${authToken}`),
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: body.toString(),
    });

    const result = await response.text();

    if (!response.ok) {
      console.error('Twilio error:', result);
      return new Response(JSON.stringify({ error: 'SMS sending failed', details: result }), {
        status: response.status,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log('SMS sent successfully to:', customerPhone);
    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error sending SMS:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
