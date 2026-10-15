import { isStaff, unauthorized, guardReservationBody } from "../_shared/guard.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

const ADMIN_PHONE = '+33604674007';
const KEYWORDS = ['anniversaire', 'afterwork', 'after work', 'after-work', 'teambuilding', 'team building', 'team-building'];

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await guardReservationBody(req);
    if (!body) return unauthorized(corsHeaders);
    const {
      customerName,
      customerPhone,
      reservationDate,
      reservationTime,
      guestsCount,
      notes,
      source,
    } = body;

    const guests = Number(guestsCount) || 0;
    const haystack = `${notes ?? ''} ${source ?? ''}`.toLowerCase();
    const matchedKeyword = KEYWORDS.find((k) => haystack.includes(k));
    const isLarge = guests >= 4;


    if (!isLarge && !matchedKeyword) {
      return new Response(JSON.stringify({ skipped: true }), {
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

    const reason = isLarge
      ? `Grande réservation (${guests} personnes)`
      : `Réservation ${matchedKeyword}`;

    const message = `🔔 ${reason}\n\nClient : ${customerName ?? '—'}\nTél : ${customerPhone ?? '—'}\nDate : ${reservationDate ?? '—'} à ${reservationTime ?? '—'}\nCouverts : ${guests}\n${notes ? `Note : ${notes}\n` : ''}${source ? `Via : ${source}\n` : ''}\nPrince Palace`;

    const response = await fetch(
      `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`,
      {
        method: 'POST',
        headers: {
          'Authorization': 'Basic ' + btoa(`${accountSid}:${authToken}`),
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          To: ADMIN_PHONE,
          From: twilioPhone,
          Body: message,
        }).toString(),
      },
    );

    const result = await response.text();

    if (!response.ok) {
      console.error('Twilio error:', response.status, result);
      return new Response(JSON.stringify({ error: 'SMS sending failed', status: response.status, details: result }), {
        status: response.status,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log('Alerte grande réservation envoyée:', reason);
    return new Response(JSON.stringify({ success: true, reason }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error notifying large reservation:', error);
    return new Response(JSON.stringify({ error: (error as Error).message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
