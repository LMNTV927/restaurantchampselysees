/* ---------- TheFork (LaFourchette) e-mail parser ---------- */
import { htmlToText } from "./opentable-parser.ts";

export const THEFORK_UNKNOWN_TIME = "À confirmer";

export interface TheForkReservation {
  externalId: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string | null;
  date: string;
  time: string | null;
  guests: number;
  cancelled: boolean;
}

/** Extracts date + reservationId from the tracked "Voir les détails" links. */
function extractBookingLink(html: string): { date: string; id: string } | null {
  const candidates: string[] = [html];
  for (const m of html.matchAll(/\/lnk\/[^/"]+\/\d\/[^/"]+\/([A-Za-z0-9_\-]+)/g)) {
    try {
      candidates.push(atob(m[1].replace(/-/g, "+").replace(/_/g, "/") + "==".slice(0, (4 - (m[1].length % 4)) % 4)));
    } catch { /* ignore */ }
  }
  for (const c of candidates) {
    const m = c.match(/booking\/(20\d{2}-\d{2}-\d{2})\?reservationId(?:=|&#x3D;|%3D)([0-9a-f\-]{36})/i);
    if (m) return { date: m[1], id: m[2] };
  }
  return null;
}

export function parseTheForkEmail(subject: string, html: string, textPart = ""): TheForkReservation | null {
  if (!/r[ée]servation/i.test(subject)) return null;
  const link = extractBookingLink(html);
  if (!link) return null;

  const text = (html ? htmlToText(html) : textPart).replace(/&#x27;/g, "'");
  const lines = text.split("\n").map((l) => l.trim()).filter(Boolean);

  const cancelled = /annul/i.test(subject);

  // Name: line right after the intro sentence
  const introIdx = lines.findIndex((l) =>
    /de la part de\s*:?$|a été annulée|a été reconfirmée|a été modifiée/i.test(l)
  );
  const name = introIdx >= 0 ? lines[introIdx + 1] : null;
  if (!name || name.length > 80) return null;

  const valueAfter = (label: RegExp) => {
    const i = lines.findIndex((l) => label.test(l));
    return i >= 0 ? lines[i + 1] ?? null : null;
  };

  const phoneLine = lines.find((l) => /^\+?\d[\d\s().\-]{7,}$/.test(l.replace(/•/g, "").trim()));
  const phone = phoneLine ? phoneLine.replace(/[^\d+]/g, "") : "";
  const email = text.match(/[\w.+\-]+@[\w\-]+\.[\w.\-]+/)?.[0] ?? null;

  const guestsLine = valueAfter(/^Personnes$/i) ?? text.match(/(\d{1,3})\s*personnes?/i)?.[0] ?? "";
  const guests = parseInt(guestsLine.match(/\d{1,3}/)?.[0] ?? "2", 10);

  const timeLine = valueAfter(/^Horaire$/i);
  const tm = timeLine?.match(/\b(\d{1,2})[:h](\d{2})\b/);
  const time = tm ? `${tm[1].padStart(2, "0")}:${tm[2]}` : null;

  return {
    externalId: link.id,
    customerName: name.replace(/\s+/g, " "),
    customerPhone: phone,
    customerEmail: email,
    date: link.date,
    time,
    guests: Math.min(Math.max(guests, 1), 500),
    cancelled,
  };
}
