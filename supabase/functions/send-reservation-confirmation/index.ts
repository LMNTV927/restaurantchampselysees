import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@4.0.0";
import React from "npm:react@18.3.1";
import { renderAsync } from "npm:@react-email/components@0.0.22";
import { ReservationConfirmationEmail } from "./_templates/reservation-confirmation.tsx";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
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
}

const handler = async (req: Request): Promise<Response> => {
  console.log("Received request:", req.method);

  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const requestData: ReservationEmailRequest = await req.json();
    console.log("Processing reservation confirmation email:", requestData);

    const {
      customerName,
      customerEmail,
      restaurantName,
      reservationDate,
      reservationTime,
      guestsCount,
      customerPhone,
      notes,
    } = requestData;

    // Render the React email template
    const html = await renderAsync(
      React.createElement(ReservationConfirmationEmail, {
        customerName,
        restaurantName,
        reservationDate,
        reservationTime,
        guestsCount,
        customerPhone,
        notes,
      })
    );

    console.log("Sending email to:", customerEmail);

    const emailResponse = await resend.emails.send({
      from: `${restaurantName} <confirmation@resend.dev>`,
      to: [customerEmail],
      subject: `Confirmation de réservation - ${restaurantName}`,
      html,
    });

    console.log("Email sent successfully:", emailResponse);

    return new Response(JSON.stringify({ success: true, data: emailResponse }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-reservation-confirmation function:", error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message || "Failed to send confirmation email" 
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);