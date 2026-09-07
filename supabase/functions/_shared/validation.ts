// Shared validation / normalisation helpers for reservation data.

/** Removes invisible bidi/format characters and normalises spacing. */
export function cleanText(input: string): string {
  return input
    .replace(/[\u200B-\u200F\u202A-\u202E\u2066-\u2069\uFEFF]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

/** Normalises a French/international phone number to E.164-ish form. */
export function normalizePhone(raw: string): string | null {
  const cleaned = cleanText(raw).replace(/[^\d+]/g, "");
  if (!cleaned) return null;

  let value = cleaned;
  if (value.startsWith("00")) value = "+" + value.slice(2);
  if (value.startsWith("0") && value.length === 10) value = "+33" + value.slice(1);

  const digits = value.replace(/\D/g, "");
  if (digits.length < 8 || digits.length > 15) return null;
  return value.startsWith("+") ? value : "+" + digits;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[A-Za-z]{2,}$/;

/** Returns a cleaned email, or null when absent/invalid. */
export function normalizeEmail(raw: string | null | undefined): { value: string | null; invalid: boolean } {
  if (!raw) return { value: null, invalid: false };
  let email = cleanText(raw).toLowerCase().replace(/\s/g, "");
  if (!email) return { value: null, invalid: false };
  // common typos
  email = email.replace(/\.con$/, ".com").replace(/\.cmo$/, ".com").replace(/\.frr$/, ".fr");
  if (!EMAIL_RE.test(email)) return { value: null, invalid: true };
  return { value: email, invalid: false };
}

/** Booking window is 17:00 -> 05:00 in 30 min steps. */
export function isValidTime(time: string): boolean {
  if (!/^\d{2}:\d{2}$/.test(time)) return false;
  const [h, m] = time.split(":").map(Number);
  if (m !== 0 && m !== 30) return false;
  return h >= 17 || h < 5 || (h === 5 && m === 0);
}

export function isValidDate(date: string): boolean {
  return /^\d{4}-\d{2}-\d{2}$/.test(date) && !Number.isNaN(Date.parse(date));
}
