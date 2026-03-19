import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@4.0.0";
import React from "npm:react@18.3.1";
import { renderAsync } from "npm:@react-email/components@0.0.22";
import { ReservationConfirmationEmail } from "./_templates/reservation-confirmation.tsx";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

interface ReservationEmailRequest {
  customerName: string;
  customerEmail: string;
  restaurantName: string;
  reservationDate: string;
  reservationTime: string;
  guestsCount: number;
  customerPhone?: string;
  notes?: string;
  modificationToken?: string;
  type?: 'confirmation' | 'modification' | 'cancellation';
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const requestData: ReservationEmailRequest = await req.json();
    const emailType = requestData.type || 'confirmation';
    const brandName = "Prince Palace";

    const {
      customerName,
      customerEmail,
      reservationDate,
      reservationTime,
      guestsCount,
      customerPhone,
      notes,
      modificationToken,
    } = requestData;

    let subject: string;
    let previewText: string;

    switch (emailType) {
      case 'modification':
        subject = `Réservation modifiée - ${brandName}`;
        previewText = `Votre réservation chez ${brandName} a été modifiée ✓`;
        break;
      case 'cancellation':
        subject = `Réservation annulée - ${brandName}`;
        previewText = `Votre réservation chez ${brandName} a été annulée`;
        break;
      default:
        subject = `Confirmation de réservation - ${brandName}`;
        previewText = `Votre réservation chez ${brandName} est confirmée ✓`;
    }

    const html = await renderAsync(
      React.createElement(ReservationConfirmationEmail, {
        customerName,
        restaurantName: brandName,
        reservationDate,
        reservationTime,
        guestsCount,
        customerPhone,
        notes,
        modificationToken,
        emailType,
      })
    );

    const RESTAURANT_EMAIL = "princepalace.champselysees@gmail.com";

    // Send to customer
    const emailResponse = await resend.emails.send({
      from: `${brandName} <confirmation@xn--rservation-prince-palace-bfc.fr>`,
      to: [customerEmail],
      subject,
      html,
    });

    console.log("Email sent to customer:", emailResponse);

    // Send copy to restaurant
    const restaurantCopy = await resend.emails.send({
      from: `${brandName} <confirmation@xn--rservation-prince-palace-bfc.fr>`,
      to: [RESTAURANT_EMAIL],
      subject: `[Copie] ${subject} - ${customerName}`,
      html,
    });

    console.log("Email copy sent to restaurant:", restaurantCopy);

    return new Response(JSON.stringify({ success: true, data: emailResponse }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error("Error in send-reservation-confirmation function:", error);
    return new Response(
      JSON.stringify({ success: false, error: error.message || "Failed to send confirmation email" }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
};

serve(handler);
