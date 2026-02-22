import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface GoogleCalendarEvent {
  id: string;
  summary?: string;
  description?: string;
  start?: { dateTime?: string; date?: string };
  end?: { dateTime?: string; date?: string };
  status?: string;
}

function parseDescription(description: string | undefined) {
  if (!description) return { guestsCount: 2, phone: "", notes: "" };

  let guestsCount = 2;
  let phone = "";
  const noteLines: string[] = [];

  for (const line of description.split("\n")) {
    const trimmed = line.trim();
    const coversMatch = trimmed.match(/^Couverts?\s*:\s*(\d+)/i);
    if (coversMatch) {
      guestsCount = parseInt(coversMatch[1], 10);
      continue;
    }
    const phoneMatch = trimmed.match(/^T[eé]l(?:[eé]phone)?\s*:\s*(.+)/i);
    if (phoneMatch) {
      phone = phoneMatch[1].trim();
      continue;
    }
    const notesMatch = trimmed.match(/^Notes?\s*:\s*(.+)/i);
    if (notesMatch) {
      noteLines.push(notesMatch[1].trim());
      continue;
    }
    // Lines that don't match any pattern are added as notes
    if (trimmed) noteLines.push(trimmed);
  }

  return { guestsCount, phone, notes: noteLines.join(", ") };
}

async function getAccessToken(serviceAccountKey: any): Promise<string> {
  const now = Math.floor(Date.now() / 1000);
  const header = { alg: "RS256", typ: "JWT" };
  const payload = {
    iss: serviceAccountKey.client_email,
    scope: "https://www.googleapis.com/auth/calendar.readonly",
    aud: "https://oauth2.googleapis.com/token",
    iat: now,
    exp: now + 3600,
  };

  const encode = (obj: any) => {
    const json = JSON.stringify(obj);
    const bytes = new TextEncoder().encode(json);
    return btoa(String.fromCharCode(...bytes))
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/, "");
  };

  const headerB64 = encode(header);
  const payloadB64 = encode(payload);
  const unsignedToken = `${headerB64}.${payloadB64}`;

  // Import private key
  const pemContents = serviceAccountKey.private_key
    .replace(/-----BEGIN PRIVATE KEY-----/, "")
    .replace(/-----END PRIVATE KEY-----/, "")
    .replace(/\n/g, "");
  const binaryKey = Uint8Array.from(atob(pemContents), (c) => c.charCodeAt(0));

  const cryptoKey = await crypto.subtle.importKey(
    "pkcs8",
    binaryKey,
    { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
    false,
    ["sign"]
  );

  const signature = await crypto.subtle.sign(
    "RSASSA-PKCS1-v1_5",
    cryptoKey,
    new TextEncoder().encode(unsignedToken)
  );

  const signatureB64 = btoa(String.fromCharCode(...new Uint8Array(signature)))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");

  const jwt = `${unsignedToken}.${signatureB64}`;

  const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: `grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer&assertion=${jwt}`,
  });

  const tokenData = await tokenResponse.json();
  if (!tokenData.access_token) {
    throw new Error(`Failed to get access token: ${JSON.stringify(tokenData)}`);
  }
  return tokenData.access_token;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const calendarId = Deno.env.get("GOOGLE_CALENDAR_ID");
    const serviceAccountKeyStr = Deno.env.get("GOOGLE_SERVICE_ACCOUNT_KEY");
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    if (!calendarId || !serviceAccountKeyStr) {
      return new Response(
        JSON.stringify({ error: "Missing Google Calendar configuration" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const serviceAccountKey = JSON.parse(serviceAccountKeyStr);
    const accessToken = await getAccessToken(serviceAccountKey);

    // Fetch events for today + 30 days
    const now = new Date();
    const timeMin = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
    const futureDate = new Date(now);
    futureDate.setDate(futureDate.getDate() + 30);
    const timeMax = futureDate.toISOString();

    const calendarUrl = `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendarId)}/events?timeMin=${timeMin}&timeMax=${timeMax}&singleEvents=true&orderBy=startTime&maxResults=250`;

    const calendarResponse = await fetch(calendarUrl, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (!calendarResponse.ok) {
      const errorText = await calendarResponse.text();
      throw new Error(`Google Calendar API error: ${calendarResponse.status} - ${errorText}`);
    }

    const calendarData = await calendarResponse.json();
    const events: GoogleCalendarEvent[] = calendarData.items || [];

    console.log(`Found ${events.length} events from Google Calendar`);

    // Get or create "Google Agenda" channel
    const supabaseClient = createClient(supabaseUrl, supabaseServiceKey);

    let { data: channel } = await supabaseClient
      .from("channels")
      .select("id")
      .eq("slug", "google-agenda")
      .single();

    if (!channel) {
      const { data: newChannel, error: channelError } = await supabaseClient
        .from("channels")
        .insert({ name: "Google Agenda", slug: "google-agenda", description: "Réservations importées depuis Google Agenda" })
        .select("id")
        .single();
      if (channelError) throw channelError;
      channel = newChannel;
    }

    let synced = 0;
    let skipped = 0;

    for (const event of events) {
      if (event.status === "cancelled") continue;
      if (!event.summary?.trim()) continue;

      const startDateTime = event.start?.dateTime || event.start?.date;
      if (!startDateTime) continue;

      const startDate = new Date(startDateTime);
      const reservationDate = startDate.toISOString().split("T")[0];
      const reservationTime = startDate.toLocaleTimeString("fr-FR", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
        timeZone: "Europe/Paris",
      });

      const { guestsCount, phone, notes } = parseDescription(event.description);

      const { error: upsertError } = await supabaseClient
        .from("reservations")
        .upsert(
          {
            external_id: `gcal_${event.id}`,
            customer_name: event.summary.trim(),
            customer_phone: phone || "Non renseigné",
            reservation_date: reservationDate,
            reservation_time: reservationTime,
            guests_count: guestsCount,
            notes: notes || null,
            source: "Google Agenda",
            channel_id: channel!.id,
            status: "confirmed",
          },
          { onConflict: "external_id" }
        );

      if (upsertError) {
        console.error(`Error upserting event ${event.id}:`, upsertError);
        skipped++;
      } else {
        synced++;
      }
    }

    console.log(`Sync complete: ${synced} synced, ${skipped} skipped`);

    return new Response(
      JSON.stringify({ synced, skipped, total: events.length }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Sync error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
