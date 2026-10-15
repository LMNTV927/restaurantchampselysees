import { createClient } from "npm:@supabase/supabase-js@2";

export function adminClient() {
  return createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
}

/** True only for a signed-in user holding the admin or serveur role. */
export async function isStaff(req: Request): Promise<boolean> {
  const auth = req.headers.get("Authorization") ?? "";
  const token = auth.replace(/^Bearer\s+/i, "");
  if (!token) return false;
  const supa = adminClient();
  const { data, error } = await supa.auth.getUser(token);
  if (error || !data?.user) return false;
  for (const role of ["admin", "serveur"]) {
    const { data: ok } = await supa.rpc("has_role", { _user_id: data.user.id, _role: role });
    if (ok) return true;
  }
  return false;
}

export function unauthorized(cors: Record<string, string>) {
  return new Response(JSON.stringify({ error: "Unauthorized" }), {
    status: 401,
    headers: { ...cors, "Content-Type": "application/json" },
  });
}

/**
 * Staff: body accepted as-is. Public callers must provide the reservation's
 * modificationToken; recipient identity is then forced from the database so a
 * public caller can never target an arbitrary phone number or email.
 */
export async function guardReservationBody(req: Request): Promise<Record<string, any> | null> {
  const body = (await req.json().catch(() => null)) ?? {};
  if (await isStaff(req)) return body;
  const token = typeof body.modificationToken === "string" ? body.modificationToken : "";
  if (!/^[0-9a-f-]{36}$/i.test(token)) return null;
  const { data } = await adminClient()
    .from("reservations")
    .select("customer_name, customer_phone, customer_email")
    .eq("modification_token", token)
    .maybeSingle();
  if (!data) return null;
  return {
    ...body,
    customerName: data.customer_name,
    customerPhone: data.customer_phone,
    customerEmail: data.customer_email,
  };
}
