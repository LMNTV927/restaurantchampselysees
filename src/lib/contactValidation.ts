/** Validation des coordonnées client (miroir de la validation serveur). */

export function normalizePhone(raw: string): string {
  let p = raw.replace(/[\u200B-\u200F\u202A-\u202E\u2066-\u2069\uFEFF]/g, "").replace(/[^\d+]/g, "");
  if (p.startsWith("00")) p = "+" + p.slice(2);
  if (/^0[1-9]\d{8}$/.test(p)) p = "+33" + p.slice(1);
  if (!p.startsWith("+") && /^33\d{9}$/.test(p)) p = "+" + p;
  return p;
}

export function isValidPhone(raw: string): boolean {
  const digits = normalizePhone(raw).replace(/\D/g, "");
  return digits.length >= 9 && digits.length <= 15;
}

export function isValidEmail(raw: string): boolean {
  const e = raw.trim().toLowerCase();
  return /^[^@\s]+@[^@\s]+\.[A-Za-z]{2,}$/.test(e);
}

export function phoneError(raw: string): string | null {
  if (!raw.trim()) return "Le numéro de téléphone est obligatoire";
  return isValidPhone(raw) ? null : "Numéro de téléphone incomplet ou invalide";
}

export function emailError(raw: string | undefined | null): string | null {
  if (!raw || !raw.trim()) return null;
  return isValidEmail(raw) ? null : "Adresse e-mail invalide (exemple : nom@domaine.com)";
}
